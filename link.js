var testData = { name: 'leon', age: 18, address: { city: 'sh', location: { area: 'minhang', postcode: '110' } } };


function link(el, data) {
  if (!el || !data) return;
  var model = data;
  var ar = []; // store binding info item

  //regex 
  var interpolationRegex = /\{\{(\w+)\}\}/g;

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
      ar.push({ el: el, prop: el.getAttribute('v-bind'), action: 'bind' });
    }
    else if (el.hasAttribute && el.hasAttribute('v-model')) {
      ar.push({ el: el, prop: el.getAttribute('v-model'), action: 'model' });
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
        ar.push({ el: el, prop: prop, action: 'bind', tpl: el.textContent });
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

  function renderPropToView(prop, value) {
    var c = ar.length, item;
    while (c--) {
      item = ar[c];
      if (item.prop === prop) {
        if (item.action === 'bind') {
          item.el.innerText = value;
        }
        else if (item.action === 'model') {
          item.el.value = value;
        }
      }
      else if (item.prop instanceof Array && item.prop.length) {
        // text node for interpolation expr , in this case , value is ignored 
        item.el.textContent = execInterpolationExpr(item);
      }
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
          if (propStack && propStack.length > 0) {
            var dotProp = propStack.slice(0);
            dotProp.push(prop);
            dotProp = dotProp.join('.');
            renderPropToView(dotProp, getPropValue(dotProp));
          }
          else {
            renderPropToView(prop, getPropValue(prop));
          }
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

  function isObject(obj) {
    return obj && typeof obj === 'object';
  }

  function watchModel(model, propStack) {
    // object
    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        var value = model[prop];
        if (isObject(value)) {
          //recursive
          propStack = propStack || [];
          propStack.push(prop);
          watchModel(value, propStack);
          propStack.pop();
        }
        else {
          (function (prop, value, propStack) {
            var val = value, prop = prop, propStack = propStack;
            Object.defineProperty(model, prop, {
              get: function () {
                return val;
              },
              set: function (newVal) {
                if (newVal !== val) {
                  val = newVal;

                  if (propStack && propStack.length > 0) {
                    renderPropToView(propStack.join('.') + '.' + prop, newVal);
                  }
                  else {
                    renderPropToView(prop, newVal);
                  }

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

