var model = {
  myloves: [{ name: 'mother', age: 50 }, { name: 'fater', age: 60 }],
};

var time = 1;

var methods = {
  addLove: function () {
    var vm = this;
    vm.myloves.push({
      name: 'name' + time++,
      age: 18
    });
  },
  removeLove: function () {
    var vm = this;
    vm.myloves.removeOne(vm.$item);
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link({ model: model, methods: methods });

console.timeEnd(timerId)