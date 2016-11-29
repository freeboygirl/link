function LinkContext(el, prop, directive, expr, tpl) {
  this.el = el;
  this.prop = prop; // string, or string array for interpilation and expr.
  this.directive = directive; // one directive could have multiple watches
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
};


/**
 * event: string , event name e.g. click 
 * fn: string , function name, function will invoke using $model context, use this to refer wrapper $model
 * fn(el) execute
 *  */
function EventLinkContext(el, event, fn) {
  // event directive format: x-on-event
  this.el = el;
  this.event = event;
  this.fn = fn; // 
  this.func = null; // actual function to execute 
}

EventLinkContext.create = function (el, event, fn) {
  return new EventLinkContext(el, event, fn);
};
