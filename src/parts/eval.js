function $eval(expr, $this) {
  var fn = new Function('with(this){return ' + expr + ';}');
  try {
    return fn.call($this);
  } catch (ex) {
    throw linkError('invalid expr {0}.', expr);
  }
}

function evalLinkContext(linkContext) {
  return $eval(linkContext.expr, linkContext.model);
}

function setWatchValue(watch, value, model) {
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
