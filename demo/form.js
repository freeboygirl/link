var model = {
  email: '',
  password: '',
  remember: [],
  greeting: '',
  fruit: []
};

var methods = {
  remeberClick: function () {
    this.greeting = 'you chooosed  ' + (this.remember.at(0) === 'yes' ? 'remember' : 'forget it');
  },
  clickme: function () {
    this.greeting = 'hello ' + this.email + ', your password is' + this.password + ', and you chooosed  ' + (this.remember.at(0) === 'yes' ? 'remember' : 'forget it') +
      'your fav fruit is ' + this.fruit.getArray().join(',');
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = new Link(document.getElementById('demo'), model, methods);

console.timeEnd(timerId)