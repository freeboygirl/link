 // public methods
  // set a new model to bind
  function setModel(newModel, reScan) {
    model = newModel;
    if (reScan === true) {
      ar = [];
      compile(el);
    }
    watchModel(model);
    render();
  }

  // clear the linker object inner states
  function unlink() {
    console.log(model.$item + ' unlinking');
    model = null;
    bindings = null;
    watchMap = null;
    if (el.$$child) {
      // clone
      el.remove();
      el = null;
    }
  }

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
        dest[prop] = model[prop];
      }
    });
  }

  function getModel() {
    var _model = {};
    unWrapModel(model, _model);
    return _model;
  }