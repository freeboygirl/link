function readonlyHandler(linkContext) {
  if (!!evalLinkContext(linkContext)) {
    linkContext.el.setAttribute("readonly", "readonly");
  }
  else {
    linkContext.el.removeAttribute("readonly");
  }
}