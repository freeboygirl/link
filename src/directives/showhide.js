function showHideHanlder(linkContext, boolValue, directive) {
  var el = linkContext.el;
  if (directive === 'x-show' && boolValue
    || directive === 'x-hide' && !boolValue) {
    removeClass(el, 'x-hide');
  }
  else {
    addClass(el, 'x-hide');
  }
}