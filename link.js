var model = { name: 'leon', age: 18 };

// function bindText(el, text) {
//   if (el) {
//     if (el.value) {
//       el.value = text;
//     }
//     else if (el.innerText) {
//       el.innerText = text;
//     }
//   }
// }

function collectDataBind(el, ar, model) {
  if (el && ar && model) {
    if (el.hasAttribute && el.hasAttribute('data-bind')) {
      ar.push({ el: el, prop: el.getAttribute('data-bind'), action: 'bind' });
    }
    else if (el.hasAttribute && el.hasAttribute('data-model')) {
      ar.push({ el: el, prop: el.getAttribute('data-model'), action: 'model' });
      var prop = el.getAttribute('data-model');
      el.addEventListener('keyup', function () {
        model[prop] = el.value || '';
      }, false);
    }
    var childNodes = el.childNodes;
    var len = childNodes.length;
    for (var i = 0; i < len; i++) {
      collectDataBind(childNodes[i], ar, model);
    }
  }
}

function observeWrap(model, ar) {
  var len = ar.length;
  if (model) {
    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        var value = model[prop];
        (function (prop, value) {
          var val = value, prop = prop;
          Object.defineProperty(model, prop, {
            get: function () {
              return val;
            },
            set: function (newVal) {
              val = newVal;
              var c = len, item;
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
          })
        })(prop, value);
      }
    }
  }
}

var modelBinder = function (el, model) {
  var ar = [], len = 0, item;
  collectDataBind(el, ar, model);

  observeWrap(model, ar);

  len = ar.length;

  if (len > 0) {
    for (var i = 0; i < len; i++) {
      item = ar[i];

      if (item.action === 'bind') {
        item.el.innerText = model[item.prop];
      }
      else if (item.action === 'model') {
        item.el.value = model[item.prop];
      }
    }
  }
}


modelBinder(document.getElementById('demo'), model);