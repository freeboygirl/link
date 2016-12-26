var interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
  watchRegex = /^\$?\w+(\.?\w+)*$/,
  eventDirectiveRegex = /^x-on-(\w+)$/, // x-on- with native dom event name to bind event handler 
  directives = ['x-bind', 'x-model', 'x-repeat', 'x-show', 'x-hide', 'x-class', 'x-disabled', 'x-view', 'x-href'];

//directive
var REPEATER = 'x-repeat',VIEW='x-view';

// event 
var fnRegex = /^[a-zA-Z$_]\w*$/,
  fnCallRegex = /^[a-zA-Z$_]\w*\(\s*\)$/,
  fnCallParamsRegex = /^[a-zA-Z$_]\w*\(([^\)]+)\)$/;