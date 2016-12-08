function WatchedArray(watch, arr) {
  this.watch = watch;
  this.arr = arr;
}

WatchedArray.prototype = Object.create(null);
WatchedArray.prototype.constructor = WatchedArray;

WatchedArray.prototype.notify = function () {
  notify(this.watch, this.arr);
};

WatchedArray.prototype.getArray = function () {
  return this.arr.slice(0);
};

each(['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'], function (fn) {
  WatchedArray.prototype[fn] = function () {
    var ret = this.arr[fn].apply(this.arr, arguments);
    this.notify();
  };
});

WatchedArray.prototype.each = function (fn, skips) {
  var that = this.arr;
  each(that, function () {
    fn.apply(that, arguments);
  }, skips)
};

WatchedArray.prototype.set = function (arr) {
  this.arr.length = 0;
  this.arr = arr;
  this.notify();
};

