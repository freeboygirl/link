Link.prototype.addBehaviors = function addBehaviors() {
  var that = this;
  if (isObject(this.behaviors)) {
    var methods = Object.keys(this.behaviors);
    each(methods, function (fn) {
      if (isFunction(that.behaviors[fn])) {
        that.model[fn] = that.behaviors[fn];
      }
    });
  }
};