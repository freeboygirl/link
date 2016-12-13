function moneyFilter(str) {
  if (!Number(str)) return str;
  str = str + '';
  var digit = [],
    decimals = '',
    pointIndex = -1,
    groups = [],
    sep = ',';
  if ((pointIndex = str.indexOf('.')) > -1) {
    digit = str.slice(0, pointIndex).split('');
    decimals = str.slice(pointIndex);
  }
  else {
    digit = str.split('');
  }
  do {
    groups.unshift(digit.splice(-3).join(''));
  } while (digit.length > 0)

  return groups.join(sep) + decimals;
}