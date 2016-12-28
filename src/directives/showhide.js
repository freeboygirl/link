function showHideHandler(linkContext) {
  // deal with both show and hide
  var el = linkContext.el,
    directive = linkContext.directive,
    boolValue = !!evalLinkContext(linkContext);
  if (directive === 'x-show' && boolValue
    || directive === 'x-hide' && !boolValue) {
    removeClass(el, 'x-hide');
  }
  else {
    addClass(el, 'x-hide');
  }
}