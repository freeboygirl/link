function getInterpolationWatch(text) {
  if (text) {
    var ar, resultArr = [];
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

function $eval(expr) {
  var fn = new Function('return ' + expr + ';');
  try {
    return fn.call();
  } catch (ex) {
    //some invalid expr;
  }
}

function evalExpr(linkContext) {
  var expr = linkContext.expr;
  each(linkContext.prop, function (prop) {
    var propValue = getWatchValue(prop);
    if (typeof propValue === 'string') {
      propValue = ["'", propValue, "'"].join('');
    }
    if (prop[0] !== '$') {
      expr = expr.replace(new RegExp(prop, 'g'), propValue);
    }
    else {
      // special for array $item link
      expr = expr.replace(new RegExp('\\' + prop, 'g'), propValue);
    }

  });
  return $eval(expr);
}
