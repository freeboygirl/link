function $eval(expr) {
  var fn = new Function('with(this){return ' + expr + ';}');
  try {
    return fn.call(model);
  } catch (ex) {
    throw linkError('invalid expr {0}.', expr);
  }
}

function getWatchValue(watch) {
  return $eval(watch);
}

function setWatchValue(watch, value) {
  if (value === null) {
    value = 'null';
  }
  else if (typeof (value) === 'undefined') {
    value = 'undefined';
  }
  var expr = '';
  if (isPrimitive(value)) {
    expr = [watch, '=', "'", value, "'"].join('');
  }

  $eval(expr);
}
