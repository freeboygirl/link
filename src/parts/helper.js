function isObject(obj) {
  return !!obj && typeof obj === 'object'
}

function isFunction(func) {
  return (typeof func === 'function');
}

function isArray(obj) {
  return !!obj && typeof obj === 'object' && typeof obj.length === 'number';
}

function addClass(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className = el.className + className;
  }
}

function removeClass(el, className) {
  if (el.className.indexOf(className) > -1) {
    el.className = el.className.replace(new RegExp(className, 'g'), '');
  }
}

function arrayRemove(arr, value) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    if (arr[i] === value) {
      arr.splice(i, 1);
      len--;
    }
  }
}

function formatString() {
  if (arguments.length < 2) return arguments[0];
  var str = arguments[0],
    args = Array.prototype.slice.call(arguments, 1);

  return str.replace(/\{(\d+)\}/g, function (match, n) {
    return args[n];
  });
}

function each(arr, fn) {
  var len = arr.length, i = -1;
  while (++i < len) {
    fn.call(arr, arr[i], i, arr);
  }
}

function isWatch(attr) {
  return watchRegex.test(attr);
}

// add x-hide style for x-show and x-hide
function addStyles() {
  if (!document.$$linkStyleLoaded) {
    document.$$linkStyleLoaded = true;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = '.x-hide{display:none !important;}';
    document.head.insertAdjacentElement('afterBegin', style);
  }
}