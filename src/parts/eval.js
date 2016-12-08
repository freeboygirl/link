function getInterpolationWatch(text) {
  var ar, resultArr = [];
  if (text) {
    while (ar = interpolationRegex.exec(text)) {
      resultArr.push(ar[1]);
    }
  }

  return resultArr;
}

function evalInterpolation(linkContext) {
  var tpl = linkContext.tpl;
  each(linkContext.prop, function (prop) {
    if (prop[0] !== '$') {
      tpl = tpl.replace(new RegExp('{{' + prop + '}}', 'g'), getWatchValue(prop));
    }
    else {
      // special for array $item link
      tpl = tpl.replace(new RegExp('{{\\' + prop + '}}', 'g'), getWatchValue(prop));
    }

  });
  return tpl;
}

function $eval(expr, $this) {
  var fn = new Function('with(this){return ' + expr + ';}');
  try {
    return fn.call($this);
  } catch (ex) {
    //some invalid expr;
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
