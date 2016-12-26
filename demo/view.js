var model = {
  test: 'hi, welcome to x-view example',
};

var methods = {

};

var timerId = 'demo';
console.time(timerId);

var linker = link(model);

link.route(linker, [
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
    templateUrl: 'views/tpl1.html'
  },
  {
    path: '/index',
    templateUrl: 'views/tpl2.html'
  },
   {
    path: '/pre',
    preLink:function(){
      location.href='index.html';
    }
  }
], '/index');


console.timeEnd(timerId)