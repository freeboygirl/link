// this.bootstrap();
if (!Link.$$loaded) {
  Link.$$loaded = true;
  var style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = '.x-hide{display:none !important;}';
  document.head.insertAdjacentElement('afterBegin', style);

  Link.helper = {
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

window.Link = Link;
}
)();