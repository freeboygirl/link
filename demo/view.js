var model = {
  test: 'hi, welcome to x-view example',
};

var methods = {

};

var timerId = 'demo';
console.time(timerId);

var routeConfig = {
  defaultPath: '/index',
  routes: [
    {
      path: '/home',
      model: {
        name: 'wgc',
        age: 18
      },
      actions: {
        clickme: function () {
          console.log(this);
          alert('hello ' + this.name + ', you are ' + this.age);
        }
      },
      preLink: function () {
        this.model.name = 'leon',
          this.model.gender = 'male';
      },
      templateUrl: 'views/tpl1.html'
    },
    {
      path: '/index',
      templateUrl: 'views/tpl2.html'
    },
    {
      path: '/pre',
      preLink: function () {
        location.href = 'index.html';
      }
    },
    {
      path: '/tpl',
      template: '<h1>hello,world</h1>'
    }
  ]
}

var linker = link(model, null, routeConfig);


console.timeEnd(timerId)