var model = { name: 'leon', age: 18, address: { city: 'sh', location: { area: 'minhang', postcode: '110' } } };


function link(el, model) {
  if (!el || !model) return;
  var ar = []; // store linker item


  function scan(el) {
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
        scan(childNodes[i]);
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

  function loadRender(model, propStack) {
    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        if (isObject(model[prop])) {
          propStack = propStack || [];
          propStack.push(prop);
          loadRender(model[prop], propStack)
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

  function transformModel(model, propStack) {
    // object
    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        var value = model[prop];
        if (isObject(value)) {
          //recursive
          propStack = propStack || [];
          propStack.push(prop);
          transformModel(value, propStack);
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
                    prop = propStack.slice(0).join('.') + '.' + prop;
                  }
                  propChangeHandler(prop, newVal);

                }
              }
            })
          })(prop, value);
        }
      }
    }
  }

  function modelBinder() {
    var len = 0, item;
    scan(el);
    transformModel(model);

    // len = ar.length;

    // if (len > 0) {
    //   for (var i = 0; i < len; i++) {
    //     item = ar[i];

    //     if (item.action === 'bind') {
    //       item.el.innerText = model[item.prop];
    //     }
    //     else if (item.action === 'model') {
    //       item.el.value = model[item.prop];
    //     }
    //   }
    // }

    loadRender(model);
  }

  modelBinder();

};

link(document.getElementById('demo'), model)


// function scanDom(el, ar, model) {
//   if (el && ar && model) {
//     if (el.hasAttribute && el.hasAttribute('lk-bind')) {
//       ar.push({ el: el, prop: el.getAttribute('lk-bind'), action: 'bind' });
//     }
//     else if (el.hasAttribute && el.hasAttribute('lk-model')) {
//       ar.push({ el: el, prop: el.getAttribute('lk-model'), action: 'model' });
//       var prop = el.getAttribute('lk-model');
//       el.addEventListener('keyup', function () {
//         model[prop] = el.value || '';
//       }, false);
//     }
//     var childNodes = el.childNodes;
//     var len = childNodes.length;
//     for (var i = 0; i < len; i++) {
//       scanDom(childNodes[i], ar, model);
//     }
//   }
// }

// function transformModel(model, ar) {
//   var len = ar.length;
//   if (model) {
//     for (var prop in model) {
//       if (model.hasOwnProperty(prop)) {
//         var value = model[prop];
//         (function (prop, value) {
//           var val = value, prop = prop;
//           Object.defineProperty(model, prop, {
//             get: function () {
//               return val;
//             },
//             set: function (newVal) {
//               val = newVal;
//               var c = len, item;
//               while (c--) {
//                 item = ar[c];
//                 if (item.prop === prop) {
//                   if (item.action === 'bind') {
//                     item.el.innerText = newVal;
//                   }
//                   else if (item.action === 'model') {
//                     item.el.value = newVal;
//                   }
//                 }
//               }
//             }
//           })
//         })(prop, value);
//       }
//     }
//   }
// }

// var modelBinder = function (el, model) {
//   var ar = [], len = 0, item;
//   scanDom(el, ar, model);

//   transformModel(model, ar);

//   len = ar.length;

//   if (len > 0) {
//     for (var i = 0; i < len; i++) {
//       item = ar[i];

//       if (item.action === 'bind') {
//         item.el.innerText = model[item.prop];
//       }
//       else if (item.action === 'model') {
//         item.el.value = model[item.prop];
//       }
//     }
//   }
// }


// modelBinder(document.getElementById('demo'), model);