var model = {
  success: true,
  danger: true
};

var methods = {
  successHanlder: function () {
    this.success = !this.success;
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link(document.getElementById('demo'), model, methods);

console.timeEnd(timerId)