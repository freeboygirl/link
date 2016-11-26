function Binding(el, prop, directive, tpl) {
  this.el = el;
  this.prop = prop; // string, or string array for interpilation expr.
  this.directive = directive;
  this.tpl = tpl;
}

Binding.create = function (el, prop, directive, tpl) {
  /**
   * prop could be string and array
   * array: interpilation and expr
   * array+interpilation: tpl
   * array+expr: expr
   *  */
  return new Binding(el, prop, directive, tpl);
}