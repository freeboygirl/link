function bindEventLinkContext(eventLinkContext) {
  var el = eventLinkContext.el,
    event = eventLinkContext.event,
    fn = eventLinkContext.fn;

  var func = function () {
    if (model[fn]) {
      model[fn].apply(model, [el])
    }
  }

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
