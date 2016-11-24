function WatchedArray(watch, arr) {
  this.watch = watch;
  this.arr = arr;
}

WatchedArray.prototype = [];

WatchedArray.prototype.notify = function () {
  notify(this.watch, this.arr);
  console.log(this.watch + ':' + this.arr.toString());
}

WatchedArray.prototype.getArray = function () {
  return this.arr.slice(0);
}

each(['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'], function (fn) {
  WatchedArray.prototype[fn] = function () {
    var ret = this.arr[fn].apply(this.arr, arguments);
    this.notify();
  }
});