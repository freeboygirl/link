var model = {
  name: 'LeonWang',
  money:'1234567.89'
};

var timerId = 'demo';
console.time(timerId);

// custom filter
link.filter('firstLetterLowerCase',function(str){
  return str[0].toLowerCase()+str.slice(1);
});
var linker = link(document.getElementById('demo'), model);



console.timeEnd(timerId)