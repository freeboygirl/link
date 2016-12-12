// public methods
// set a new model to bind
Link.prototype.setModel = function setModel(newModel) {
  this.model = newModel;
  this.watchModel(this.model);
  this.compile(this.el);
  this.render();
};

// clear the linker object inner states
Link.prototype.unlink = function unlink() {
  // console.log(model.$item + ' unlinking');
  this.linkContextCollection.length = 0;
  this.linkContextCollection = null;
  this.watchMap = null;
  this.removeBehaviors();
  if (this.model.$$child) {
    this.el.remove();
  }
  this.model = null;
};

// if the model contains array property ,it will be wrapped, this fn get the origin model back
function unWrapModel(model, dest) {
  dest = dest || {};
  var props = Object.keys(model),
    value;
  each(props, function (prop) {
    value = model[prop];
    if (value instanceof WatchedArray) {
      dest[prop] = value.getArray();
    }
    else if (isObject(value)) {
      dest[prop] = {};
      unWrapModel(value, dest[prop]);
    }
    else {
      if (!isFunction(value)) {
        dest[prop] = model[prop];
      }
    }
  });
}

Link.prototype.getModel = function getModel() {
  var _model = {};
  unWrapModel(this.model, _model);
  return _model;
};
