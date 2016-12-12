function classHandler(linkContext) {
  var exprVal = !!$eval(linkContext.expr, linkContext.model);

  if (exprVal) {
    addClass(linkContext.el, linkContext.className);
  }
  else {
    removeClass(linkContext.el, linkContext.className);
  }
}