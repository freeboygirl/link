function disabledHanlder(linkContext) {
  if (!!$eval(linkContext.expr, linkContext.model)) {
    linkContext.el.setAttribute("disabled", "disabled");
  }
  else {
    linkContext.el.removeAttribute("disabled");
  }
}