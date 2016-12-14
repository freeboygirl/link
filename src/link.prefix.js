'use strict';
(function () {
  window.link = function linkFactory(el, data, behaviors) {
    return new Link(el, data, behaviors);
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

  link.filter = function (name, fn) {
    if (!Link.prototype.filters[name] && isFunction(fn)) {
      Link.prototype.filters[name] = fn;
    }
  };