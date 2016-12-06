if (!el || !data) throw Error('el and data are required!');
if (!isObject(data)) throw Error('data must be object');
var timeId = 'link-lib-running-time';
// !el.$$child && console.time(timeId);
var model = data,
  linkContextCollection = [], // store linkContext
  eventLinkContextCollection = [], // store eventLinkContext
  watchMap = Object.create(null), // stores watch prop & watchfns mapping
  //regex
  interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
  watchRegex = /^\$?\w+(\.?\w+)*$/,
  eventDirectiveRegex=/^x-on-(\w+)$/, // x-on- with native dom event name to bind event handler 
  directives = ['x-bind', 'x-model', 'x-repeat', 'x-show', 'x-hide','x-class'],
  allWatches = []; // store all model watches , for expr