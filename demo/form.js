var model = {
  email: '',
  password: '',
  remember: true,
  greeting: '',
  fruit: []
};

var methods = {
  clickme: function () {
    this.greeting = 'hello ' + this.email + ', your password is' + this.password + ', and you chooosed  ' + (this.remember ? 'remember' : 'forget it') +
      'your fav fruit is ' + this.fruit.getArray().join(',');
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link(document.getElementById('demo'), model, methods);

console.timeEnd(timerId)