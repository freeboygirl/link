var model = {
  name: 'leon', age: 2,
  address: {
    city: 'sh',
    location:
    { area: 'minhang', postcode: '110' }
  },
  loves: [{ name: 'mother', age: 50 }, { name: 'fater', age: 60 }],
  other: {
    hates: ['a', 'b', 'c']
  },
  trueAge: 18,
  sex: 'male',
  fruit: ['apple', 'banana'],
  message: '',
  password: ''
};

var methods = {
  hello: function () {
    console.log('hello ' + this.name, ' you are ' + this.age);
  },
  hi: function () {
    console.log('hi ' + this.name);
  },
  focus: function (ev, el) {
    el.style.background = 'yellow';
  },
  blur: function (ev, el) {
    el.style.background = '';
  },
  addLove: function () {
    var vm = this;
    vm.loves.push({
      name: '',
      age: 18
    });
  },
  removeLove: function () {
    var vm = this;
    // vm.loves.splice(vm.$index,1);
    vm.loves.removeOne(vm.$item);
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = new Link(document.getElementById('demo'), model, methods);

console.timeEnd(timerId)