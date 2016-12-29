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