var model = {
  email: '',
  password: '',
  remember: [],
  greeting: ''
};

var methods = {
  remeberClick: function () {
    this.greeting = 'you chooosed  ' + (this.remember.at(0) === 'yes' ? 'remember' : 'forget it');
  },
  signin: function () {
    this.greeting = 'hello ' + this.email + ', your password is' + this.password + ', and you chooosed  ' + (this.remember.at(0) === 'yes' ? 'remember' : 'forget it');
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link(document.getElementById('demo'), model, methods);

console.timeEnd(timerId)