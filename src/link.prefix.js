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