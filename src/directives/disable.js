function disabledHanlder(linkContext, exprVal) {
  if (exprVal) {
    linkContext.el.setAttribute("disabled", "disabled");
  }
  else {
    linkContext.el.removeAttribute("disabled");
  }
}