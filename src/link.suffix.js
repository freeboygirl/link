// this.bootstrap();
if (!Link.$$linkPublicFnSet) {
  Link.$$linkPublicFnSet = true;
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

// return {
//   $el:el,
//   $setModel: setModel,
//   $unlink: unlink,
//   $getModel: getModel,
//   $model: model
// };

// }

window.Link = Link;
}
)();