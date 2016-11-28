(function () {
  window.model = {
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
    trueAge: 18
  };

  var methods = {
    hello: function (el) {
      console.log('hello ' + this.name, ' you are ' + this.age);
    },
    hi: function () {
      console.log('hi ' + this.name);
    }
  };

  linker = link(document.getElementById('demo'), model, methods);
})();