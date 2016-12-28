function modelHandler(linkContext) {
  var el = linkContext.el,
    exprVal = evalLinkContext(linkContext);
  if (el.type === 'radio') {
    el.checked = (el.value === exprVal);
  }
  else if (el.type === 'checkbox') {
    if (exprVal instanceof WatchedArray) {
      el.checked = exprVal.arr.indexOf(el.value) > -1;
    } else if (isBoolean(exprVal)) {
      el.checked = exprVal;
    } else {
      throw linkError('checkbox should bind with array and boolean value');
    }
  }
  else {
    el.value != exprVal && (el.value = exprVal);
  }
}