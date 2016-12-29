'use strict';
(function () {
  window.link = function linkFactory(config) {
    config = extend({}, { el: window.document, model: {}, methods: null, routes: null }, config);
    return new Link(config.el, config.model, config.methods, config.routes);
  };
  link.helper = {
    isObject: isObject,
    isFunction: isFunction,
    isArray: isArray,
    addClass: addClass,
    removeClass: removeClass,
    arrayRemove: arrayRemove,
    formatString: formatString,
    trim: trim,
    each: each,
    hash: hash
  };

  link.filter = function (name, fn) {
    if (!Link.prototype.filters[name] && isFunction(fn)) {
      Link.prototype.filters[name] = fn;
    }
  };
var
  interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
  watchRegex = /^\$?\w+(\.?\w+)*$/,
  eventDirectiveRegex = /^x-on-(\w+)$/, // x-on- with native dom event name to bind event handler 
  REPEAT = 'x-repeat',
  VIEW = 'x-view',
  BIND = 'x-bind',
  MODEL = 'x-model',
  SHOW = 'x-show',
  HIDE = 'x-hide',
  CLASS = 'x-class',
  DISABLED = 'x-disabled',
  VIEW = 'x-view',
  directives = [BIND, MODEL, REPEAT, SHOW, HIDE, CLASS, DISABLED, VIEW],
  fnRegex = /^[a-zA-Z$_]\w*$/,
  fnCallRegex = /^[a-zA-Z$_]\w*\(\s*\)$/,
  fnCallParamsRegex = /^[a-zA-Z$_]\w*\(([^\)]+)\)$/,
  unshift = Array.prototype.unshift,
  quoteRegx = /[\'\"]/g,
  watchStartRegex = /[a-zA-Z$_]/,
  validWatchChar = /[a-zA-Z0-9$\.]/,
  hasOwnProperty = Object.prototype.hasOwnProperty,
  concat = Array.prototype.concat;
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



function WatchedArray(watchMap, watch, arr) {
  this.watchMap = watchMap;
  this.watch = watch;
  this.arr = arr;
}

WatchedArray.prototype = Object.create(null);
WatchedArray.prototype.constructor = WatchedArray;

WatchedArray.prototype.notify = function (arrayChangeInfo) {
  notify(this.watchMap, this.watch, arrayChangeInfo);
};

WatchedArray.prototype.getArray = function () {
  return this.arr.slice(0);
};

WatchedArray.prototype.at = function (index) {
  return index >= 0 && index < this.arr.length && this.arr[index];
};

each(['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'], function (fn) {
  WatchedArray.prototype[fn] = function () {
    var ret = this.arr[fn].apply(this.arr, arguments);
    this.notify([fn]);
    return ret;
  };
});

WatchedArray.prototype.each = function (fn, skips) {
  var that = this.arr;
  each(that, function () {
    fn.apply(that, arguments);
  }, skips)
};

WatchedArray.prototype.contain = function (item) {
  return this.arr.indexOf(item) > -1;
};

WatchedArray.prototype.removeOne = function (item) {
  var index = this.arr.indexOf(item);
  if (index > -1) {
    this.arr.splice(index, 1);
    this.notify(['removeOne', index]);
  }
};

WatchedArray.prototype.set = function (arr) {
  this.arr.length = 0;
  this.arr = arr;
  this.notify();
};
function bindHandler(linkContext) {
  linkContext.el.textContent = evalLinkContext(linkContext);
}
function classHandler(linkContext) {
  var exprVal = evalLinkContext(linkContext);

  if (linkContext.className) {
    // json 
    if (!!exprVal) {
      addClass(linkContext.el, linkContext.className);
    }
    else {
      removeClass(linkContext.el, linkContext.className);
    }
  } else {
    if (exprVal) {
      addClass(linkContext.el, exprVal);
    }
  }
}
function disabledHandler(linkContext) {
  if (!!evalLinkContext(linkContext)) {
    linkContext.el.setAttribute("disabled", "disabled");
  }
  else {
    linkContext.el.removeAttribute("disabled");
  }
}
var DIRETIVE_RENDER_MAP = {
  'x-show': showHideHandler,
  'x-hide': showHideHandler,
  'x-bind': bindHandler,
  'x-disabled': disabledHandler,
  'x-repeat': repeatHandler,
  'x-class': classHandler,
  'x-model': modelHandler
};
function modelHandler(linkContext) {
  var el = linkContext.el,
    exprVal = evalLinkContext(linkContext);
  if (el.type === 'radio') {
    el.checked = (el.value === exprVal);
  }
  else if (el.type === 'checkbox') {
    if (exprVal instanceof WatchedArray) {
      el.checked = exprVal.arr.indexOf(el.value) > -1;
    } else if (isBoolean(exprVal)) {
      el.checked = exprVal;
    } else {
      throw linkError('checkbox should bind with array and boolean value');
    }
  }
  else {
    el.value != exprVal && (el.value = exprVal);
  }
}
function makeOneClonedLinkerForRepeater(linkContext, itemData, itemIndex) {
  var cloneEl = linkContext.el.cloneNode(true),
    model = linkContext.linker.model,
    expr = linkContext.expr,
    v = expr.split(/\s+/)[0];
  var props = {
    $index: { value: itemIndex, enumerable: true, configurable: true, writable: true },
    $$child: { value: true }
  };
  props[v] = { value: itemData, enumerable: true, configurable: true, writable: true };
  return { el: cloneEl, linker: new Link(cloneEl, Object.create(model, props)) };
}

function repeatHandler(linkContext) {
  var warr = $eval(linkContext.prop, linkContext.linker.model),
    arr = warr && warr.arr,
    el = linkContext.el,
    comment = linkContext.comment,
    lastArrayChangeInfo = linkContext.lastArraychange,
    repeaterItem,
    lastLinks = linkContext.lastLinks || [];

  if (!linkContext.$$elRemovedFromDOM) {
    comment = linkContext.comment = document.createComment('repeat end for ' + linkContext.prop);
    el.parentNode.insertBefore(linkContext.comment, el);
    el.remove();
    linkContext.$$elRemovedFromDOM = true;
  }

  function rebuild() {
    var docFragment = document.createDocumentFragment();
    each(lastLinks, function (link) {
      link.unlink();
    });

    lastLinks.length = 0;
    lastLinks = [];
    each(arr, function (itemData, index) {
      repeaterItem = makeOneClonedLinkerForRepeater(linkContext, itemData, index);
      lastLinks.push(repeaterItem.linker);
      docFragment.appendChild(repeaterItem.el);
    });

    comment.parentNode.insertBefore(docFragment, comment);
  }

  if (lastLinks.length > 0 && lastArrayChangeInfo) {
    var fn = lastArrayChangeInfo[0],
      itemData,
      _linker;
    switch (fn) {
      case 'push': {
        itemData = arr[arr.length - 1];
        repeaterItem = makeOneClonedLinkerForRepeater(linkContext, itemData, index);
        lastLinks.push(repeaterItem.linker);
        comment.parentNode.insertBefore(repeaterItem.el, comment);
        break;
      }
      case 'pop': {
        _linker = lastLinks.pop();
        _linker.unlink();
        break;
      }
      case 'removeOne': {
        var index = lastArrayChangeInfo[1];
        _linker = lastLinks.splice(index, 1)[0];
        _linker.unlink();
        break;
      }
      case 'unshift': {
        var firstLinkerEl = lastLinks[0].el;
        itemData = arr[0];
        repeaterItem = makeOneClonedLinkerForRepeater(linkContext, itemData, index);
        lastLinks.unshift(repeaterItem.linker);
        firstLinkerEl.parentNode.insertBefore(repeaterItem.el, firstLinkerEl);
        break;
      }
      case 'shift': {
        _linker = lastLinks.shift();
        _linker.unlink();
        break;
      }
      default: {
        // clear all and rebuild 
        rebuild();
      }
    }

  } else {
    rebuild();
  }

  linkContext.lastLinks = lastLinks;
}
function showHideHandler(linkContext) {
  var el = linkContext.el,
    directive = linkContext.directive,
    boolValue = !!evalLinkContext(linkContext);
  if (directive === SHOW && boolValue
    || directive === HIDE && !boolValue) {
    removeClass(el, 'x-hide');
  }
  else {
    addClass(el, 'x-hide');
  }
}

function checkboxReact(linkContext) {
  var el = linkContext.el;
  function checkboxHandler() {
    var value = el.value,
      checked = el.checked,
      propValue = evalLinkContext(linkContext);

    if (!(isBoolean(propValue) || propValue instanceof WatchedArray)) {
      throw linkError('checkbox should bind with array or boolean value');
    }

    if (propValue instanceof WatchedArray) {
      if (!checked && propValue.contain(value)) {
        propValue.removeOne(value);
      }
      else {
        propValue.push(value);
      }
    }
    else {
      setWatchValue(linkContext.prop, checked, linkContext.linker.model);
    }
  }
  addEventListenerHandler(el, 'click', checkboxHandler, linkContext.linker.eventStore);
}

function commonReact(linkContext, event) {
  var el = linkContext.el;
  function commonHandler() {
    setWatchValue(linkContext.prop, el.value || '', linkContext.linker.model);
  }
  addEventListenerHandler(el, event, commonHandler, linkContext.linker.eventStore);
}
function modelReactDispatch(linkContext) {
  var el = linkContext.el, directive = linkContext.directive,
    nodeName = el.nodeName, type = el.type;
  switch (nodeName) {
    case 'INPUT': {
      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'url': {
          commonReact(linkContext, 'keyup');
          break;
        }
        case 'radio': {
          commonReact(linkContext, 'click');
          break;
        }
        case 'checkbox': {
          checkboxReact(linkContext);
          break;
        }
      }
      break;
    }
    case 'SELECT': {
      commonReact(linkContext, 'change');
      break;
    }
    default: {
      commonReact(linkContext, 'keyup');
      break;
    }
  }
}
Link.prototype.filters = {
  uppercase: String.prototype.toUpperCase,
  lowercase: String.prototype.toLowerCase,
  money: moneyFilter,
  phone: phoneFilter
};
function moneyFilter(str) {
  if (!Number(str)) return str;
  str = str + '';
  var digit = [],
    decimals = '',
    pointIndex = -1,
    groups = [],
    sep = ',';
  if ((pointIndex = str.indexOf('.')) > -1) {
    digit = str.slice(0, pointIndex).split('');
    decimals = str.slice(pointIndex);
  }
  else {
    digit = str.split('');
  }
  do {
    groups.unshift(digit.splice(-3).join(''));
  } while (digit.length > 0)

  return groups.join(sep) + decimals;
}
function phoneFilter(str) {
  //the middle 4 digit replace with *
  if (isString(str) && str.length === 11) {
    return str.slice(0, 3) + '****' + str.slice(-4);
  }

  return str;
}
function Link(el, data, behaviors, routeConfig) {
  this.model = data;
  this.el = el;
  this.behaviors = behaviors;
  this.eventStore = []; // store event bind info 
  this.linkContextCollection = []; // store linkContext
  this.watchMap = Object.create(null); // stores watch and watchfn map
  this.routeEl = null; // route template string container if it exists,it is not required.
  this.bootstrap();

  if (routeConfig) {
    configRoutes(this, routeConfig.routes, routeConfig.defaultPath);
  }
};

Link.prototype.addBehaviors = function addBehaviors() {
  var that = this;
  if (isObject(this.behaviors)) {
    var methods = Object.keys(this.behaviors);
    each(methods, function (fn) {
      if (isFunction(that.behaviors[fn])) {
        if ((fn in that.model) && !isFunction(that.model[fn])) {
          throw linkError('{0} is defined in the data model,please change the function/method name of "{0}"', fn)
        }
        if (!that.model[fn]) {
          that.model[fn] = that.behaviors[fn];
        }
      }
    });
  }
};
Link.prototype.bootstrap = function () {
  if (this.model.hasOwnProperty('$$watched')) {
    throw linkError('this model had been used for some linker, please check...');
  }
  _def_const_prop_(this.model, '$$watched', true);
  this.watchModel(this.model, []);
  this.compile(this.el);
  this.render();
  this.addBehaviors();
};

Link.prototype.getLinkContextsFromInterpolation = function getLinkContextsFromInterpolation(el, text) {
  var expr = ['"', text, '"'].join('').replace(/(\{\{)/g, '"+(').replace(/(\}\})/g, ')+"');
  var lexer = new Lexer(expr),
    watches = lexer.getWatches(),
    that = this;
  if (lexer.filterIndex > -1) {
    throw linkError('{0} does not support filter for {1} , please use {2} instead',
      'link', 'interpolation expression', BIND);
  }

  each(watches, function (watch) {
    that.addLinkContextAndSetWatch(el, watch, BIND, expr);
  });
};

Link.prototype.addLinkContextAndSetWatch = function addLinkContextAndSetWatch(el, watches, directive, expr, filter) {
  var linkContext = LinkContext.create(el, watches, directive, expr, this);
  if (filter) {
    linkContext.filter = filter;
  }
  this.linkContextCollection.push(linkContext);
  this.addWatchNotify(linkContext);
  if (directive === MODEL) {
    modelReactDispatch(linkContext);
  }
};

Link.prototype.getEventLinkContext = function getEventLinkContext(el, attrName, fn) {
  var eventLinkContext;
  var event = eventDirectiveRegex.exec(attrName)[1];
  //done: fn could be fnc name , fnc(), fnc(args..) and null(with expr)
  if (fnRegex.test(fn)) {
    // fn
    eventLinkContext = EventLinkContext.create(el, event, fn);
  }
  else if (fnCallRegex.test(fn)) {
    // fn()
    var leftBracketIndex = fn.indexOf('(');
    eventLinkContext = EventLinkContext.create(el, event, fn.slice(0, leftBracketIndex));
  }
  else if (fnCallParamsRegex.test(fn)) {
    // fn(a,b,c)
    var args = fn.match(fnCallParamsRegex)[1].split(',');
    var leftBracketIndex = fn.indexOf('(');
    eventLinkContext = EventLinkContext.create(el, event, fn.slice(0, leftBracketIndex), args);
  }
  else {
    // expr
    eventLinkContext = EventLinkContext.create(el, event, null, fn);
  }

  this.bindEventLinkContext(eventLinkContext);
};

Link.prototype.getClassLinkContext = function getClassLinkContext(el, directive, expr) {
  var
    kvPairs = expr.slice(1, -1).split(','),
    className,
    subExpr,
    spliter,
    lexer,
    watch,
    linkContext,
    that = this;

  each(kvPairs, function (kv) {
    spliter = kv.split(':');
    className = spliter[0].replace(/[\'\"]/g, ''),
      subExpr = spliter[1];

    if (isWatch(subExpr)) {
      linkContext = LinkContext.create(el, subExpr, directive, subExpr, that);
    }
    else {
      lexer = new Lexer(subExpr);
      watch = lexer.getWatches();

      each(watch, function (w) {
        linkContext = LinkContext.create(el, w, directive, subExpr, that);
      });
    }
    linkContext.className = className;
    that.linkContextCollection.push(linkContext);
    that.addWatchNotify(linkContext);
  });
};


Link.prototype.getLinkContext = function getLinkContext(el, directive, expr) {
  if (isWatch(expr)) {
    this.addLinkContextAndSetWatch(el, expr, directive, expr);
  }
  else if (isLikeJson(expr)) {
    this.getClassLinkContext(el, directive, expr);
  }
  else {
    var lexer = new Lexer(expr),
      watches = lexer.getWatches();
    if (lexer.filter) {
      expr = expr.slice(0, lexer.filterIndex);
      this.addLinkContextAndSetWatch(el, watches, directive, expr, lexer.filter);
    }
    else
      this.addLinkContextAndSetWatch(el, watches, directive, expr);
  }
};

Link.prototype.compileDOM = function compileDOM(el) {
  var attrName,
    attrValue,
    that = this;
  if (el.nodeType === 1 && el.hasAttributes()) {
    each(el.attributes, function (attr) {
      attrName = attr.name;
      attrValue = trim(attr.value);
      if (eventDirectiveRegex.test(attrName)) {
        that.getEventLinkContext(el, attrName, attrValue);
      }
      else if (directives.indexOf(attrName) > -1) {
        that.getLinkContext(el, attrName, attrValue);
      }
    });
  } else if (el.nodeType === 3) {
    var expr = trim(el.textContent);
    if (expr && /\{\{[^\}]+\}\}/.test(expr)) {
      this.getLinkContextsFromInterpolation(el, expr);
    }
  }
};

Link.prototype.compile = function compile(el) {
  var that = this;
  if (el.nodeType === 1) {
    if (el.hasAttribute(REPEAT)) {
      var expr = trim(el.getAttribute(REPEAT)), // var in watch
        w = expr.split(/\s+/);
      if (w.length !== 3) throw linkError('repeat only support exr like: var in array.');
      this.addLinkContextAndSetWatch(el, w[2], REPEAT, expr);
      el.removeAttribute(REPEAT);
      return;
    }

    if (el.hasAttribute(VIEW)) {
      if (this.routeEl) throw linkError('a link context can only have on more than one x-view');
      el.removeAttribute(VIEW);
      this.routeEl = el;
      return;
    }
  }
  this.compileDOM(el);
  el.hasChildNodes() && each(el.childNodes, function (node) {
    that.compile(node);
  });
};

function linkError() {
  var error = formatString.apply(null, arguments);
  return new Error(error);
}
function $eval(expr, $this) {
  var fn = new Function('with(this){return ' + expr + ';}');
  try {
    return fn.call($this);
  } catch (ex) {
    throw linkError('invalid expr {0}.', expr);
  }
}

function evalLinkContext(linkContext) {
  var val = $eval(linkContext.expr, linkContext.linker.model);

  if (linkContext.filter && linkContext.directive === BIND) {
    var filters = linkContext.linker.filters,
      filter = linkContext.filter;
    if (filters[filter]) {
      val = filters[filter].call(val, val);
    }
  }

  return val;
}

function setWatchValue(watch, value, model) {
  if (value === null) {
    value = 'null';
  }
  else if (typeof (value) === 'undefined') {
    value = 'undefined';
  }
  var expr = '';
  if (isString(value)) {
    expr = [watch, '=', "'", value, "'"].join('');
  }
  else if (isPrimitive(value)) {
    expr = [watch, '=', value].join('');
  }
  else {
    throw linkError('value should be a primitive type for setWatchValue');
  }

  $eval(expr, model);
}

Link.prototype.bindEventLinkContext = function bindcontext(context) {
  var context = context,
    linker = this;

  var func = function (ev) {
    var el = context.el,
      fn = context.fn,
      args = context.args; // when fn is null, args is expr to eval.

    if (fn === null) {
      // expr 
      $eval(args, linker.model);
    } else if (linker.model[fn]) {
      if (!isArray(args)) {
        linker.model[fn].apply(linker.model, [ev, el]);
      }
      else {
        var eargs = [ev, el];
        var evaledArgs = [];
        each(args, function (arg) {
          arg = trim(arg);
          if (arg.charAt(0) === "'" || arg.charAt(0) === '"') {
            evaledArgs.push(arg.replace(quoteRegx, ''));
          } else {
            evaledArgs.push($eval(arg, linker.model));
          }
        });
        unshift.apply(eargs, evaledArgs);
        linker.model[fn].apply(linker.model, eargs);
      }

    }
  };

  addEventListenerHandler(context.el, context.event, func, this.eventStore);
};




function LinkContext(el, watches, directive, expr, linker) {
  this.el = el;
  this.prop = watches; // string, or string array of watches
  this.directive = directive;
  this.expr = expr; 
  this.linker = linker;
}

function EventLinkContext(el, event, fn, args) {
  this.el = el;
  this.event = event;
  this.fn = fn; // fn name
  this.args = args; // arguments pass by event directive
}

LinkContext.create = function (el, watches, directive, expr, linker) {
  return new LinkContext(el, watches, directive, expr, linker);
};

EventLinkContext.create = function (el, event, fn, args) {
  return new EventLinkContext(el, event, fn, args);
};

Link.prototype.defineObserver = function defineObserver(model, prop, value, propStack, isArray) {
  var that = this,
    watch = concat.call(propStack, prop).join('.');
  if (!isArray) {
    Object.defineProperty(model, prop, {
      get: function () {
        return value;
      },
      set: function (newVal) {
        if (newVal !== value) {
          value = newVal;
          notify(that.watchMap, watch);
        }
      }
    });
  }
  else {
    model[prop] = new WatchedArray(that.watchMap, watch, value);
  }
};

Link.prototype.watchModel = function watchModel(model, propStack) {
  var props = Object.keys(model),
    prop,
    value,
    that = this;
  each(props, function (prop) {
    value = model[prop];
    if (isObject(value) && !isArray(value)) {
      propStack.push(prop);
      that.watchModel(value, propStack);
      propStack.pop();
    }
    else {
      that.defineObserver(model, prop, value, propStack.slice(0), isArray(value));
    }
  });
};
function Lexer(text) {
  this.text = text;
  this.index = 0;
  this.len = text.length;
  this.watches = [];
  this.filter = null;
  this.filterIndex = -1;
  this.filterEndIndex = -1;
}

Lexer.prototype = {
  constructor: Lexer,
  getWatches: function () {
    while (this.index < this.len) {
      var ch = this.text[this.index];
      if (watchStartRegex.test(ch)) {
        this._getWatch(ch);
      }
      else if (ch === '"' || ch === "'") {
        // string 
        while (this._peek() !== ch && this.index < this.len) {
          this.index++;
        }
        if (this.index + 1 < this.len) {
          this.index += 2;
        } else {
          throw new Error('unclosed string in expr');
        }
      }
      else if (ch === '|') {
        if (this._peek() !== '|') {
          //filter sign
          this.filterIndex = this.index++;
          this._getFilter();
          break; // following chars don't need going on.
        }
        else {
          // || 
          this.index += 2;
        }
      }
      else {
        this.index++;
      }
    }

    return this.watches;
  },
  _getFilter: function () {
    // last index is | 
    var filter = [this.text[this.index]];
    while (this.index < this.len) {
      if (validWatchChar.test(this._peek())) {
        filter.push(this.text[++this.index]);
      }
      else {
        this.index++;
        break;
      }
    }
    this.filterEndIndex = this.index;
    this.filter = trim(filter.join(''));
  },
  _getWatch: function (ch) {
    var watch = [ch],
      start = this.index;
    while (this.index < this.len) {
      if (validWatchChar.test(this._peek())) {
        watch.push(this.text[++this.index]);
      } else {
        this.index++;
        break;
      }
    }
    this.watches.push(watch.join(''));
  },

  _peek: function (i) {
    i = i || 1;
    return (this.index + i < this.len) ? this.text[this.index + 1] : false;
  }
};

Link.prototype.setModel = function setModel(newModel) {
  this.model = newModel;
  this.watchModel(this.model);
  this.compile(this.el);
  this.render();
};

Link.prototype.unlink = function unlink() {
  this.linkContextCollection = null;
  this.watchMap = null;
  // clean event binding 
  each(this.eventStore, function (event) {
    removeEventListenerHandler(event.el, event.event, event.handler);
  });
  this.eventStore = null;
  if (this.model.$$child) {
    this.el.remove();
  }
  delete this.model.$$watched;
  this.model = null;
};

// if the model contains array property ,it will be wrapped, this fn get the origin model back
function unWrapModel(model, dest) {
  dest = dest || {};
  var props = Object.keys(model),
    value;
  each(props, function (prop) {
    value = model[prop];
    if (value instanceof WatchedArray) {
      dest[prop] = value.getArray();
    }
    else if (isObject(value)) {
      dest[prop] = {};
      unWrapModel(value, dest[prop]);
    }
    else {
      if (!isFunction(value)) {
        dest[prop] = model[prop];
      }
    }
  });
}

Link.prototype.getModel = function getModel() {
  var _model = {};
  unWrapModel(this.model, _model);
  return _model;
};


Link.prototype.addWatchNotify = function addWatchNotify(linkContext) {
  var that = this;
  if (isArray(linkContext.prop)) {
    each(linkContext.prop, function (watch) {
      that.addNofityHandler(watch, linkContext);
    });
  }

  else {
    that.addNofityHandler(linkContext.prop, linkContext);
  }
};

Link.prototype.addNofityHandler = function addNofityHandler(watch, linkContext) {
  if (!this.watchMap[watch]) {
    this.watchMap[watch] = [];
  }
  this.watchMap[watch].push(notifyFnFactory(linkContext));
};

Link.prototype.render = function render() {
  for (var watch in this.watchMap) {
    notify(this.watchMap, watch);
  }
};

function notifyFnFactory(linkContext) {
  /**
   * 1. this is  directive render fn 
   * 2.change has value when it's watcharray change
   *  */
  return function (change) {
    change && (linkContext.lastArraychange = change);
    renderLink(linkContext);
  };
}

function renderLink(linkContext) {
  DIRETIVE_RENDER_MAP[linkContext.directive].call(null, linkContext);
}
/**
 * x-router based on old browser hash   
*/
function hash(path) {
  if (typeof path === 'undefined') {
    var href = location.href,
      index = href.indexOf('#');
    return index === -1 ? '' : href.slice(index + 1)
  }
  else {
    location.hash = path;
  }
}

function replaceHash(path) {
  var href = location.href,
    index = href.indexOf('#');
  if (index > -1) {
    location.replace(href.slice(0, index) + '#' + path);
  }
  else {
    location.replace(href + '#' + path);
  }
}

var templateStore = Object.create(null);

function loadTemplate(url, cb) {
  var tpl = templateStore[url];
  if (tpl) {
    cb.call(null, tpl);
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          templateStore[url] = xhr.responseText;
          cb.call(null, xhr.responseText);
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'text/html');
    xhr.send(null);
  }
}

/**
  var routes = {
    'path':{
       model: {},
       methods:{},
       template: '',
       templateUrl: '',
       preLink:fn,
       postLink:fn
    }
  }];
*/
function configRoutes(linker, routes, defaultPath) {
  addEventListenerHandler(window, 'hashchange', renderRouter, linker.eventStore);
  var hs = hash();
  if (hs) {
    renderRouter();
  }
  else {
    replaceHash(defaultPath);
  }
  function renderRouter() {
    var route = routes[hash()];
    if (!route) {
      replaceHash(defaultPath);
      return;
    }
    if (!route.model || !isObject(route.model)) {
      route.model = {};
    }
    var template = trim(route.template);
    if (!template) {
      if (route.templateUrl) {
        loadTemplate(route.templateUrl, function (tpl) {
          linkRoute(linker, route, tpl);
        });
      } else {
        linkRoute(linker, route, '');
      }
    } else {
      linkRoute(linker, route, template);
    }
  }
}

function linkRoute(linker, route, tpl) {
  var preLinkReturn;
  if (linker.routeEl) {
    linker.routeEl.innerHTML = tpl;
  }
  if (route.lastLinker) {
    route.lastLinker.unlink(); // destroy link
  }
  if (isFunction(route.preLink)) {
    preLinkReturn = route.preLink.call(route, linker);
  }
  if (preLinkReturn && isFunction(preLinkReturn.then)) {
    preLinkReturn.then(traceLink);
  } else {
    if (preLinkReturn === false) return;// skip link
    traceLink();
  }

  function traceLink() {
    if (!linker.routeEl) return; // no x-view , no route link 
    route.lastLinker = link({
      el: linker.routeEl,
      model: route.model,
      methods: route.methods,
    });
    if (isFunction(route.postLink)) {
      route.postLink.call(route, route.lastLinker);
    }
  }
}

var style = document.createElement('style');
style.type = 'text/css';
style.textContent = '.x-hide{display:none !important;}';
document.head.insertAdjacentElement('afterBegin', style);

}
)();
//# sourceMappingURL=link.js.map
