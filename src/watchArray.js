function WatchedArray(watchMap, watch, arr) {
  this.watchMap = watchMap;
  this.watch = watch;
  this.arr = arr;
}

WatchedArray.prototype = Object.create(null);
WatchedArray.prototype.constructor = WatchedArray;

WatchedArray.prototype.notify = function (arrayChangeInfo) {
  notify(this.watchMap, this.watch, arrayChangeInfo);
};

WatchedArray.prototype.getArray = function () {
  return this.arr.slice(0);
};

WatchedArray.prototype.at = function (index) {
  return index >= 0 && index < this.arr.length && this.arr[index];
};

each(['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'], function (fn) {
  WatchedArray.prototype[fn] = function () {
    var ret = this.arr[fn].apply(this.arr, arguments);
    this.notify([fn]);
    return ret;
  };
});

WatchedArray.prototype.each = function (fn, skips) {
  var that = this.arr;
  each(that, function () {
    fn.apply(that, arguments);
  }, skips)
};

WatchedArray.prototype.contain = function (item) {
  return this.arr.indexOf(item) > -1;
};

WatchedArray.prototype.removeOne = function (item) {
  var index = this.arr.indexOf(item);
  if (index > -1) {
    this.arr.splice(index, 1);
    this.notify(['removeOne', index]);
  }
};

WatchedArray.prototype.set = function (arr) {
  this.arr.length = 0;
  this.arr = arr;
  this.notify();
};