var
  interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
  watchRegex = /^\$?\w+(\.?\w+)*$/,
  eventDirectiveRegex = /^x-on-(\w+)$/, // x-on- with native dom event name to bind event handler 
  directives = ['x-bind', 'x-model', 'x-repeat', 'x-show', 'x-hide', 'x-class', 'x-disabled', 'x-view'],
  REPEATER = 'x-repeat',
  VIEW = 'x-view',
  fnRegex = /^[a-zA-Z$_]\w*$/,
  fnCallRegex = /^[a-zA-Z$_]\w*\(\s*\)$/,
  fnCallParamsRegex = /^[a-zA-Z$_]\w*\(([^\)]+)\)$/,
  unshift = Array.prototype.unshift,
  quoteRegx = /[\'\"]/g,
  watchStartRegex = /[a-zA-Z$_]/,
  validWatchChar = /[a-zA-Z0-9$\.]/,
  hasOwnProperty = Object.prototype.hasOwnProperty,
  concat = Array.prototype.concat;