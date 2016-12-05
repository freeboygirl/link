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
  var fn = new Function('return ' + expr + ';');
  try {
    return fn.call($this);
  } catch (ex) {
    //some invalid expr;
  }
}

function processExpr(expr, tokens) {
  var indexes = [];
  var result = [];
  var p = 0;
  each(tokens, function (token) {
    result.push(expr.slice(p, token.index));
    result.push('this.');
    result.push(token.watch);
    p += token.index + token.watch.length;
  });
  result.push(expr.slice(p));

  return result.join('');
}

function evalExpr(linkContext) {
  var fnExpr = processExpr(linkContext.expr, linkContext.tokens);
  return $eval(fnExpr, model);
}
