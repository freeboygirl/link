var model = {
  name: 'LeonWang',
  money:'1234567.89',
  phone:'15901634301'
};

var timerId = 'demo';
console.time(timerId);

// custom filter
link.filter('firstLetterLowerCase',function(str){
  return str[0].toLowerCase()+str.slice(1);
});
var linker = link({model:model});



console.timeEnd(timerId)