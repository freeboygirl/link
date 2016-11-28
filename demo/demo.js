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
    },
    focus:function(el){
      el.style.background='yellow';
    },
    blur:function(el){
      el.style.background='';
    }
  };

  linker = link(document.getElementById('demo'), model, methods);
})();