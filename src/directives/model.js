function modelHanlder(linkContext) {
  var el = linkContext.el,
    exprVal = $eval(linkContext.expr, linkContext.model);
  if (el.type === 'radio') {
    el.checked = (el.value === exprVal);
  }
  else if (el.type === 'checkbox') {
    if (exprVal instanceof WatchedArray) {
      el.checked = exprVal.arr.indexOf(el.value) > -1;
    } else {
      throw linkError('checkbox should bind with array');
    }

  }
  else {
    linkContext.el.value = exprVal;
  }
}