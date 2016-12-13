function showHideHanlder(linkContext) {
  // deal with both show and hide
  var el = linkContext.el,
    directive = linkContext.directive,
    boolValue = !!$eval(linkContext.expr, linkContext.model);
  if (directive === 'x-show' && boolValue
    || directive === 'x-hide' && !boolValue) {
    removeClass(el, 'x-hide');
  }
  else {
    addClass(el, 'x-hide');
  }
}