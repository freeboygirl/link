function uiRenderFnBuilder(linkContext) {
  //return ui render fn
  return function () {
    var exprVal;
    if (!linkContext.$$forClass) {
      exprVal = evalLinkValue(linkContext);
    }
    renderLink(linkContext, exprVal);
  };
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
    var el = linkContext.el;
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

  } else if (linkContext.directive === 'x-show' || linkContext.directive === 'x-hide') {
    showHideHanlder(linkContext, exprVal, linkContext.directive);
  }
  else if(linkContext.directive==='x-disabled'){
    disabledHanlder(linkContext,exprVal);
  }
  else if (linkContext.directive === 'x-repeat') {
    // repeat can't be nested
    // repeat item will construct a new linker object
    repeatHanlder(linkContext);
  }
  else if (linkContext.$$forClass) {
    // x-class
    classHandler(linkContext);
  }
}
