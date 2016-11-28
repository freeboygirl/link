function addBehaviors() {
  if (isObject(behaviors)) {
    var methods = Object.keys(behaviors);
    each(methods, function (fn) {
      if (typeof (behaviors[fn]) === 'function') {
        model[fn] = behaviors[fn];
      }
    });
  }
}

function removeBehaviors() {
  each(eventLinkContextCollection, function (context) {
    if (context.func) {
      removeEventListenerHanlder(context.el, context.event, context.func);
    }
  });
}