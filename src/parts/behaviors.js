Link.prototype.addBehaviors = function addBehaviors() {
  var that = this;
  if (isObject(this.behaviors)) {
    var methods = Object.keys(this.behaviors);
    each(methods, function (fn) {
      if (isFunction(that.behaviors[fn])) {
        if (fn in that.model) {
          throw linkError('{0} is defined in the data model,please change the function/method name of "{0}"', fn)
        }
        that.model[fn] = that.behaviors[fn];
      }
    });
  }
};