var testData = { name: 'leon', age: 18, address: { city: 'sh', location: { area: 'minhang', postcode: '110' } } };


function link(el, data) {
  'use strict';
  if (!el || !data) throw Error('el and data are required!');
  var model = data,
    bindings = [], // store bindings
    watchMap = Object.create(null), // stores watch prop & watchfn mapping 
    //regex 
    interpolationRegex = /\{\{(\w+)\}\}/g;

  function getInterpolationExpr(text) {
    if (text) {
      var ar, resultArr = [];
      while (ar = interpolationRegex.exec(text)) {
        resultArr.push(ar[1]);
      }
    }

    return resultArr;
  }

  function execInterpolationExpr(binding) {
    var len = binding.prop.length,
      prop,
      el = binding.el,
      tpl = binding.tpl;
    while (len--) {
      prop = binding.prop[len];
      tpl = tpl.replace(new RegExp('{{' + prop + '}}', 'g'), getPropValue(prop));
    }

    return tpl;
  }


  function scanDOMElement(el) {
    var prop;
    if (el.hasAttribute && el.hasAttribute('v-bind')) {
      bindings.push({ el: el, prop: el.getAttribute('v-bind'), action: 'bind' });
    }
    else if (el.hasAttribute && el.hasAttribute('v-model')) {
      bindings.push({ el: el, prop: el.getAttribute('v-model'), action: 'model' });
      prop = el.getAttribute('v-model');
      if (el.nodeName === 'INPUT') {
        if (el.type === 'text') {
          el.addEventListener('keyup', function () {
            setPropValue(prop, el.value || '');
          }, false);
        }
        else if (el.type === 'radio') {
          //TODO: handler radio
          el.addEventListener('change', function () {
            setPropValue(prop, el.value || '');
          }, false);
        }

      }
      else if (el.nodeName === 'SELECT') {
        el.addEventListener('change', function () {
          setPropValue(prop, el.value || '');
        }, false);
      }
    }
    else if (el.nodeType === 3) {
      // text node , and it may contains several interpolation expr
      prop = getInterpolationExpr(el.textContent)
      if (prop.length > 0) {
        bindings.push({ el: el, prop: prop, action: 'bind', tpl: el.textContent });
      }

    }
    var childNodes = el.childNodes,
      len = childNodes.length,
      node;
    for (var i = 0; i < len; i++) {
      node = childNodes[i];
      // if (node.nodeType === 1) {
      //   // element
      //   scanDOMElement(childNodes[i]);
      // }
      scanDOMElement(childNodes[i]);
    }
  }

  function render(model, propStack) {
    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        if (isObject(model[prop])) {
          propStack = propStack || [];
          propStack.push(prop);
          render(model[prop], propStack)
          propStack.pop();
        } else {
          var watch = prop;
          if (propStack && propStack.length > 0) {
            watch = propStack.slice(0);
            watch.push(prop);
            watch = watch.join('.');
          }
          applyWatchFn(watchMap[watch]);
        }
      }
    }
  }

  function getPropValue(prop) {
    var val = model;
    if (prop) {
      prop = prop.split('.');
      var len = prop.length;
      for (var i = 0; i < len; i++) {
        val = val[prop[i]]
      }
    }

    return val;
  }

  function setPropValue(prop, value) {
    var val = model;
    if (prop) {
      prop = prop.split('.');
      var len = prop.length;
      if (len === 1) {
        model[prop] = value;
        return;
      }
      for (var i = 0; i < len; i++) {
        val = val[prop[i]]
        if (i === len - 2) {
          val[prop[len - 1]] = value;
          return;
        }
      }
    }
  }

  function propRenderBuilder(binding) {
    //return ui render fn
    return function () {
      if (binding.action === 'bind' && !(binding.prop instanceof Array)) {
        binding.el.innerText = getPropValue(binding.prop);
      }
      else if (binding.action === 'model') {
        binding.el.value = getPropValue(binding.prop);
      }
      else if (binding.prop instanceof Array) {
        // text node for interpolation expr 
        binding.el.textContent = execInterpolationExpr(binding);
      }
    }
  }

  function isObject(obj) {
    return obj && typeof obj === 'object';
  }

  function applyWatchFn(watchFn) {
    var len = watchFn.length;
    while (len--) {
      watchFn[len].apply();
    }
  }

  function watchModel(model, propStack) {
    //object
    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        var value = model[prop];
        if (isObject(value)) {
          propStack = propStack || [];
          propStack.push(prop);
          watchModel(value, propStack);
          propStack.pop();
        }
        else {
          (function (prop, value, propStack) {
            if (propStack) {
              propStack.push(prop);
            }
            else {
              propStack = [prop];
            }

            var watchProp = propStack.join('.'),
              watchFn = [];

            // look up binding and prop map.
            var c = bindings.length, binding;
            while (c--) {
              binding = bindings[c];
              if (binding.prop === watchProp
                || (binding.prop instanceof Array && binding.prop.indexOf(prop) > -1)) {
                watchFn.push(propRenderBuilder(binding));
              }
            }
            binding = null;
            propStack.length = 0;
            propStack = null;

            // store a mapping between watch prop and watch fn
            if (!watchMap[watchProp]) {
              watchMap[watchProp] = watchFn;
            }

            Object.defineProperty(model, prop, {
              get: function () {
                return value;
              },
              set: function (newVal) {
                if (newVal !== value) {
                  value = newVal;
                  applyWatchFn(watchFn);
                }
              }
            })
          })(prop, value, propStack && propStack.slice(0));
        }
      }
    }
  }

  function linkDOMWithModel() {
    scanDOMElement(el);
    watchModel(model);
    render(model);
  };

  linkDOMWithModel();

  // public methods
  function updateModel(newModel, reScan) {
    model = newModel;
    if (reScan === true) {
      ar = [];
      scanDOMElement(el);
    }
    watchModel(model);
    render(model);
  }


  return {
    updateModel: updateModel
  };

};

linker = link(document.getElementById('demo'), testData);

