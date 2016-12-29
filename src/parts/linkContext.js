function LinkContext(el, watches, directive, expr, linker) {
  this.el = el;
  this.prop = watches; // string, or string array of watches
  this.directive = directive;
  this.expr = expr; 
  this.linker = linker;
}

function EventLinkContext(el, event, fn, args) {
  this.el = el;
  this.event = event;
  this.fn = fn; // fn name
  this.args = args; // arguments pass by event directive
}

LinkContext.create = function (el, watches, directive, expr, linker) {
  return new LinkContext(el, watches, directive, expr, linker);
};

EventLinkContext.create = function (el, event, fn, args) {
  return new EventLinkContext(el, event, fn, args);
};
