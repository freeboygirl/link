(function () {
  window.model = {
    name: 'leon', age: 2,
    address: {
      city: 'sh',
      location:
      { area: 'minhang', postcode: '110' }
    },
    loves: ['mother', 'father', 'son', 'daughter'],
    other:{
      hates:['a','b','c']
    }
  };
  linker = link(document.getElementById('demo'), model);
})();