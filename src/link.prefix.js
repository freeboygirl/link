'use strict';
(function () {
  window.link = function linkFactory(el, data, behaviors, routeConfig) {
    var _el = el, _data = data, _behaviors = behaviors, _routeConfig = routeConfig;
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
      _routeConfig = behaviors;
    }
    if (!isObject(_data)) {
      throw linkError('data must be an object');
    }
    if (_behaviors && !isObject(_behaviors)) {
      throw linkError('behaviors must be an object with function props');
    }

    if (_routeConfig) {
      if (!(isArray(_routeConfig.routes) && _routeConfig.defaultPath)) {
        throw linkError('routeConfig must contain route array and defaultPath.');
      }
    }

    return new Link(_el, _data, _behaviors, _routeConfig);
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