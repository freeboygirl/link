
var style = document.createElement('style');
style.type = 'text/css';
style.textContent = '.x-hide{display:none !important;}';
document.head.insertAdjacentElement('afterBegin', style);

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

}
)();