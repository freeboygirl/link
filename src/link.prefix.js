function WatchedArray(watchMap, watch, arr) {
  this.watchMap = watchMap;
  this.watch = watch;
  this.arr = arr;
}

WatchedArray.prototype = Object.create(null);
WatchedArray.prototype.constructor = WatchedArray;

WatchedArray.prototype.notify = function (changeInfo) {
  notify(this.watchMap, this.watch, changeInfo);
};

WatchedArray.prototype.getArray = function () {
  return this.arr.slice(0);
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

// only array change pass fn 
function notify(watchMap, watch, fn) {
  var renders = watchMap[watch],
    len;
  if (renders) {
    each(renders, function (render) {
      render.call(null, fn);
    });
  }
}

function render(watchMap) {
  for (var watch in watchMap) {
    notify(watchMap, watch);
  }
}

window.link=function link(el, data, behaviors) {