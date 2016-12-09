var model = {
  name: 'leon', age: 2,
  address: {
    city: 'sh',
    location:
    { area: 'minhang', postcode: '110' }
  }
};

var methods = {

};

var timerId = 'interpilation';
console.time(timerId);

var linker = link(document.getElementById('demo'), model, methods);

console.timeEnd(timerId)