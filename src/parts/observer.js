function defineObserver(model, prop, value, propStack, isArray) {
  var watch = getWatchByPropStack(prop, propStack);
  allWatches.push(watch);
  if (!isArray) {
    Object.defineProperty(model, prop, {
      get: function () {
        return value;
      },
      set: function (newVal) {
        if (newVal !== value) {
          value = newVal;
          notify(watchMap, watch);
        }
      }
    });
  }
  else {
    model[prop] = new WatchedArray(watchMap, watch, value);
  }
}

function watchModel(model, propStack) {
  //object
  propStack = propStack || [];
  var props = Object.keys(model),
    prop,
    value;
  each(props, function (prop) {
    value = model[prop];
    if (isObject(value) && !isArray(value)) {
      propStack.push(prop);
      watchModel(value, propStack);
      propStack.pop();
    }
    else {
      defineObserver(model, prop, value, propStack.slice(0), isArray(value));
    }
  });
}

function getWatchByPropStack(prop, propStack) {
  if (propStack) {
    propStack.push(prop);
  }
  else {
    propStack = [prop];
  }

  return propStack.join('.');
}