function LinkContext(el, watches, directive, expr, model) {
  this.el = el;
  this.prop = watches; // string, or string array of watches
  this.directive = directive; // one directive could have multiple watches
  this.expr = expr; // watch or watch expr 
  this.model = model;
}

LinkContext.create = function (el, watches, directive, expr, model) {
  /**
   * watches could be string and array
   * array: interpilation and expr
   * array+expr: expr
   * array+interpilation: expr
   *  */
  return new LinkContext(el, watches, directive, expr, model);
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
