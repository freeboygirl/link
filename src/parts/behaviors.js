function addBehaviors() {
  if (isObject(behaviors)) {
    var methods = Object.keys(behaviors);
    each(methods, function (fn) {
      if (isFunction(behaviors[fn])) {
        model[fn] = behaviors[fn];
      }
    });
  }
}

function removeBehaviors() {
  each(eventLinkContextCollection, function (context) {
    if (isFunction(context.func)) {
      removeEventListenerHanlder(context.el, context.event, context.func);
    }
  });
}