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
    }
  };
  linker = link(document.getElementById('demo'), model);
})();