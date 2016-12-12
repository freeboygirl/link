function addBehaviors(linker) {
  if (isObject(linker.behaviors)) {
    var methods = Object.keys(linker.behaviors);
    each(methods, function (fn) {
      if (isFunction(linker.behaviors[fn])) {
        linker.model[fn] = linker.behaviors[fn];
      }
    });
  }
}

function removeBehaviors(eventLinkContextCollection) {
  each(eventLinkContextCollection, function (context) {
    if (isFunction(context.func)) {
      removeEventListenerHanlder(context.el, context.event, context.func);
    }
  });
}