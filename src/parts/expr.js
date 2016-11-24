function getInterpolationWatch(text) {
  if (text) {
    var ar, resultArr = [];
    while (ar = interpolationRegex.exec(text)) {
      resultArr.push(ar[1]);
    }
  }

  return resultArr;
}

function evalInterpolation(binding) {
  var tpl = binding.tpl;
  each(binding.prop, function (prop) {
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

function evalExpr(binding) {
  var expr = binding.expr;
  each(binding.prop, function (prop) {
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