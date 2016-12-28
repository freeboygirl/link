function isObject(obj) {
  return !!obj && typeof obj === 'object'
}

function isFunction(func) {
  return (typeof func === 'function');
}

function isArray(obj) {
  return !!obj && typeof obj === 'object' && typeof obj.length === 'number';
}

function isPrimitive(o) {
  return ['string', 'number', 'boolean', 'null', 'undefined'].indexOf(typeof o) > -1;
}

function isString(str) {
  return typeof str === 'string';
}

function isBoolean(v) {
  return typeof v === 'boolean';
}

function isNumber(v) {
  return typeof v === 'number';
}

function isLikeJson(str) {
  return isString(str) && str[0] === '{' && str.slice(-1) === '}';
}

function addClass(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className = trim(el.className) + ' ' + className;
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

function trim(str) {
  if (typeof str === 'string') {
    if (str.trim) {
      return str.trim();
    }
    return str.replace(/^\s+|\s+$/g, '');
  }

  return str;
}

function each(arr, fn, skipArr) {
  var len = arr.length, i = -1, item;
  while (++i < len) {
    item = arr[i];
    if (isArray(skipArr)) {
      if (skipArr.indexOf(item) !== -1) continue;
    }

    fn.call(arr, item, i, arr);
  }
}

function filter(arr, predicate, multiple) {
  var len = arr.length, i = -1, result = multiple ? [] : null;
  while (++i < len) {
    if (predicate.call(arr, arr[i], i, arr) === true) {
      if (!multiple) {
        return arr[i];
      }
      result.push(arr[i]);
    }
  }

  return result && result.length > 0 ? result : null;
}

function isWatch(attr) {
  return watchRegex.test(attr);
}

function isJsonAlike(str) {
  if (isString(str)) {
    return str.charAt(0) === '{' && str.slice(-1) === '}';
  }

  return false;
}

function _def_const_prop_(obj, property, value) {
  Object.defineProperty(obj, property,
    {
      value: value,
      enumerable: false,
      configurable: true,
      writable: true
    });
}

// poly fill 
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// poly fill if ie 
function extend(target, varArgs) {
  if (isFunction(Object.assign)) {
    return Object.assign.apply(Object, arguments);
  }
  else {
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];
      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          if (hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  }
}

function notify(watchMap, watch, arrayChangeInfo) {
  var renders = watchMap[watch],
    len;
  if (renders) {
    each(renders, function (render) {
      render.call(null, arrayChangeInfo);
    });
  }
}

function addEventListenerHandler(el, event, func, store) {
  if (el.addEventListener && isFunction(func)) {
    el.addEventListener(event, func, false);
    store.push({
      el: el,
      event: event,
      handler: func
    });
  }
}

function removeEventListenerHandler(el, event, func) {
  if (el.removeEventListener && isFunction(func)) {
    el.removeEventListener(event, func, false);
  }
}


