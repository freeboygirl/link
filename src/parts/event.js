function bindEventLinkContext(linker, eventLinkContext) {
  var el = eventLinkContext.el,
    event = eventLinkContext.event,
    fn = eventLinkContext.fn;

  var func = function (ev) {
    if (linker.model[fn]) {
      linker.model[fn].apply(linker.model, [ev, el]);
    }
  };

  addEventListenerHanlder(el, event, func);
  eventLinkContext.func = func; // update func ref
}


function addEventListenerHanlder(el, event, func) {
  if (el.addEventListener) {
    el.addEventListener(event, func, false);
  }
}

//todo: unlink should call this 
function removeEventListenerHanlder(el, event, func) {
  if (el.removeEventListener) {
    el.removeEventListener(event, func, false);
  }
}
