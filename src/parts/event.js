Link.prototype.bindEventLinkContext = function bindEventLinkContext(eventLinkContext) {
  var el = eventLinkContext.el,
    event = eventLinkContext.event,
    fn = eventLinkContext.fn,
    that = this;

  var func = function (ev) {
    if (that.model[fn]) {
      that.model[fn].apply(that.model, [ev, el]);
    }
  };

  addEventListenerHanlder(el, event, func);
  eventLinkContext.func = func; // update func ref
};



