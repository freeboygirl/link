Link.prototype.defineObserver = function defineObserver(model, prop, value, propStack, isArray) {
  var that = this,
    watch = concat.call(propStack, prop).join('.');
  if (!isArray) {
    Object.defineProperty(model, prop, {
      get: function () {
        return value;
      },
      set: function (newVal) {
        if (newVal !== value) {
          value = newVal;
          notify(that.watchMap, watch);
        }
      }
    });
  }
  else {
    model[prop] = new WatchedArray(that.watchMap, watch, value);
  }
};

Link.prototype.watchModel = function watchModel(model, propStack) {
  propStack = propStack || [];
  var props = Object.keys(model),
    prop,
    value,
    that = this;
  each(props, function (prop) {
    value = model[prop];
    if (isObject(value) && !isArray(value)) {
      propStack.push(prop);
      that.watchModel(value, propStack);
      propStack.pop();
    }
    else {
      that.defineObserver(model, prop, value, propStack.slice(0), isArray(value));
    }
  });
};