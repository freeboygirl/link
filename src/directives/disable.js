function disabledHandler(linkContext) {
  if (!!evalLinkContext(linkContext)) {
    linkContext.el.setAttribute("disabled", "disabled");
  }
  else {
    linkContext.el.removeAttribute("disabled");
  }
}