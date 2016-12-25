'use strict';
(function () {
  window.link = function linkFactory(el, data, behaviors) {
    var _el = el, _data = data, _behaviors = behaviors;
    if (arguments.length === 0 || arguments.length === 1 && isObject(el) && ('nodeName' in el)) {
      throw linkError('data must be specified for a link');
    }
    if (arguments.length === 1 && !isObject(el)) {
      throw linkError('data must be an object');
    }
    if (!('nodeName' in el)) {
      _el = document;
      _data = el;
      _behaviors = data;
    }
    if (!isObject(_data)) {
      throw linkError('data must be an object');
    }
    if (_behaviors && !isObject(_behaviors)) {
      throw linkError('behaviors must be an object with function props');
    }

    return new Link(_el, _data, _behaviors);
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
    each: each
  };

  link.route = route;

  link.filter = function (name, fn) {
    if (!Link.prototype.filters[name] && isFunction(fn)) {
      Link.prototype.filters[name] = fn;
    }
  };