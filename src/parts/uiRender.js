function uiRenderFnBuilder(linkContext) {
  //return ui render fn (notify fn )
  // fn has value when it's watch array change
  return function (changeInfo) {
    var exprVal;
    if (!linkContext.$$forClass) {
      exprVal = evalLinkValue(linkContext);
    }
    if (changeInfo) {
      linkContext.lastArrayChangeInfo = changeInfo;
    }
    renderLink(linkContext, exprVal);
  };
}

function evalLinkValue(linkContext) {
  var exprVal;
  if (linkContext.expr) {
    exprVal = $eval(linkContext.expr);
  }
  else {
    // just watch, no expr
    exprVal = $eval(linkContext.prop);
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
  else if (linkContext.directive === 'x-disabled') {
    disabledHanlder(linkContext, exprVal);
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
