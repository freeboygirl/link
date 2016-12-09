function $eval(expr, $this) {
  var fn = new Function('with(this){return ' + expr + ';}');
  try {
    return fn.call($this);
  } catch (ex) {
    throw linkError('invalid expr {0}.', expr);
  }
}

function evalExpr(linkContext) {
  return $eval(linkContext.expr, model);
}

function getWatchValue(watch) {
  return $eval(watch, model);
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

  $eval(expr, model);
}
