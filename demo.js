(function () {
  var model = {
    name: 'leon', age: 2,
    address: {
      city: 'sh',
      location:
      { area: 'minhang', postcode: '110' }
    }
  };
  linker = link(document.getElementById('demo'), model);
})();