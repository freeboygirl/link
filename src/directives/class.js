function classHandler(linkContext) {
  var exprVal = evalLinkContext(linkContext);

  if (linkContext.className) {
    // json 
    if (!!exprVal) {
      addClass(linkContext.el, linkContext.className);
    }
    else {
      removeClass(linkContext.el, linkContext.className);
    }
  } else {
    if (exprVal) {
      addClass(linkContext.el, exprVal);
    }
  }
}