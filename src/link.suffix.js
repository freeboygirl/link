bootstrap();
// !el.$$child && console.timeEnd(timeId);
if (!link.$$linkPublicFnSet) {
  link.$$linkPublicFnSet = true;
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
}

return {
  $el:el,
  $setModel: setModel,
  $unlink: unlink,
  $getModel: getModel,
  $model: model
};

}

if (!('link' in window)) {
  window.link = link;
}

})();