function LinkContext(el, prop, directive, expr, tpl) {
  this.el = el;
  this.prop = prop; // string, or string array for interpilation and expr.
  this.directive = directive;
  this.expr = expr;
  this.tpl = tpl;
}

LinkContext.create = function (el, prop, directive, expr, tpl) {
  /**
   * prop could be string and array
   * array: interpilation and expr
   * array+interpilation: tpl
   * array+expr: expr
   *  */
  return new LinkContext(el, prop, directive, expr, tpl);
}
