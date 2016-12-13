function bindHanlder(linkContext) {
  linkContext.el.textContent = $eval(linkContext.expr, linkContext.model);
}