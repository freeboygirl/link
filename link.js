var model = { name: 'leon', age: 18, address: { city: 'sh', location: { area: 'minhang', postcode: '110' } } };


function link(el, model) {
  if (!el || !model) return;
  var ar = []; // store linker item


  function scanDOMElement(el) {
    if (el.hasAttribute && el.hasAttribute('lk-bind')) {
      ar.push({ el: el, prop: el.getAttribute('lk-bind'), action: 'bind' });
    }
    else if (el.hasAttribute && el.hasAttribute('lk-model')) {
      ar.push({ el: el, prop: el.getAttribute('lk-model'), action: 'model' });
      var prop = el.getAttribute('lk-model');
      el.addEventListener('keyup', function () {
        // model[prop] = el.value || '';
        setPropValue(prop, el.value || '');
      }, false);
    }
    var childNodes = el.childNodes,
      len = childNodes.length,
      node;
    for (var i = 0; i < len; i++) {
      node = childNodes[i];
      if (node.nodeType === 1) {
        // element
        scanDOMElement(childNodes[i]);
      }
    }
  }

  function propChangeHandler(prop, newVal) {
    var c = ar.length, item;
    while (c--) {
      item = ar[c];
      if (item.prop === prop) {
        if (item.action === 'bind') {
          item.el.innerText = newVal;
        }
        else if (item.action === 'model') {
          item.el.value = newVal;
        }
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
            propChangeHandler(dotProp, getPropValue(dotProp));
          }
          else {
            propChangeHandler(prop, getPropValue(prop));
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
                    propChangeHandler(propStack.join('.') + '.' + prop, newVal);
                  }
                  else {
                    propChangeHandler(prop, newVal);
                  }

                }
              }
            })
          })(prop, value, propStack && propStack.slice(0));
        }
      }
    }
  }

  (function linkDOMWithModel() {
    scanDOMElement(el);
    watchModel(model);
    render(model); // first time render model to view 
  })();

};

link(document.getElementById('demo'), model)

