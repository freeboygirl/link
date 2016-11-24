function isObject(obj) {
  return !!obj && typeof obj === 'object'
}

function isArray(obj) {
  return !!obj && typeof obj === 'object' && typeof obj.length === 'number';
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
    style.id = 'linkStyle';
    style.textContent = '.x-hide{display:none !important;}';
    document.head.insertAdjacentElement('afterBegin', style);
  }
}