function uiRenderFnBuilder(linkContext) {
  //return ui render fn
  return function () {
    var exprVal = evalLinkValue(linkContext);
    renderLink(linkContext, exprVal);
  }
}

function evalLinkValue(linkContext) {
  var exprVal;
  if (linkContext.tpl) {
    // interpolation
    exprVal = evalInterpolation(linkContext);
  }
  else if (linkContext.expr) {
    exprVal = evalExpr(linkContext);
  }
  else {
    // just watch, no expr
    exprVal = getWatchValue(linkContext.prop);
  }

  return exprVal;
}


function renderLink(linkContext, exprVal) {
  if (linkContext.directive === 'x-bind') {
    linkContext.el.textContent = exprVal;
  }
  else if (linkContext.directive === 'x-model') {
    linkContext.el.value = exprVal;
  } else if (linkContext.directive === 'x-show' || linkContext.directive === 'x-hide') {
    showHideHanlder(linkContext, exprVal, linkContext.directive);
  }
  else if (linkContext.directive === 'x-repeat') {
    // repeat can't be nested
    // repeat item will construct a new linker object
    repeatHanlder(linkContext);
  }
}
