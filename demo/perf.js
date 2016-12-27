
function generateArray(length, transform) {
  var nullArray = Array.apply(null, { length: length })
  return transform
    ? nullArray.map(transform)
    : nullArray
}

function reportResults(times) {
  times = [].concat(times)
  times.sort(function (a, b) { return a - b })

  var report = [
    'Fastest: ' + times[0] + 'ms',
    'Median: ' + times[times.length / 2] + 'ms',
    'Average: ' + times.reduce(function (a, b) { return a + b }, 0) / times.length + 'ms',
    '95th Perc.: ' + times[Math.ceil(times.length * 0.95)] + 'ms',
    'Slowest: ' + times[times.length - 1] + 'ms'
  ].join('\n')

  console.log(report)
  document.getElementById('results').innerHTML = report.replace(/\n/g, '<br>')
  // document.getElementById('root').innerHTML = ''

}

var now = (
  window.performance.now ||
  window.performance.webkitNow
).bind(window.performance);

function reportResults(times) {
  times = [].concat(times)
  times.sort(function (a, b) { return a - b })

  var report = [
    'Fastest: ' + times[0] + 'ms',
    'Median: ' + times[times.length / 2] + 'ms',
    'Average: ' + times.reduce(function (a, b) { return a + b }, 0) / times.length + 'ms',
    '95th Perc.: ' + times[Math.ceil(times.length * 0.95)] + 'ms',
    'Slowest: ' + times[times.length - 1] + 'ms'
  ].join('\n')

  console.log(report)
  document.getElementById('results').innerHTML = report.replace(/\n/g, '<br>')
  document.getElementById('root').innerHTML = ''
}

var items = generateArray(10000);
var maxCount = 100;
var root = document.getElementById('root');

function Benchmark(example) {
  var count = 0
  var times = []

  document.getElementById('results').textContent = 'Running benchmark. This may take a minute...'

  function runExample() {
    var startTime = now()
    example(items, function () {
      var totalTime = Math.ceil(now() - startTime)
      console.log(totalTime + 'ms')
      times.push(totalTime)
      // count += 1
      // if (count < maxCount) {
      //   root.innerHTML = '<li x-repeat="item">{{$item}}</li>';
      //   runExample()
      // } else {
      //   reportResults(times)
      // }
      reportResults(times);
    })
  }
  runExample();
  // setTimeout(runExample, 1)
}

new Benchmark(function (items, done) {
  link({ el: root, model: { item: items } });
  done.call();
});
