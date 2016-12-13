function classHandler(linkContext) {
  var exprVal = !!evalLinkContext(linkContext);

  if (exprVal) {
    addClass(linkContext.el, linkContext.className);
  }
  else {
    removeClass(linkContext.el, linkContext.className);
  }
}