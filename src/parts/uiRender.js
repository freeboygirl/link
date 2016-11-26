function uiRenderFnBuilder(linkContext) {
  //return ui render fn
  return function () {
    if (linkContext.directive === 'x-bind' && !(linkContext.prop instanceof Array)) {
      linkContext.el.innerText = getWatchValue(linkContext.prop);
    }
    else if (linkContext.directive === 'x-model') {
      linkContext.el.value = getWatchValue(linkContext.prop);
    }
    else if (linkContext.prop instanceof Array) {
      // text node for interpolation expr
      if (linkContext.tpl) {
        linkContext.el.textContent = evalInterpolation(linkContext);
      } else if (linkContext.expr) {
        var exprVal = evalExpr(linkContext);
        if (linkContext.directive === 'x-show' || linkContext.directive === 'x-hide') {
          showHideHanlder(linkContext, exprVal, linkContext.directive);
        }
      }

    }
    else if (linkContext.directive === 'x-repeat') {
      // repeat can't be nested
      // repeat item will construct a new linker object
      repeatHanlder(linkContext);
    }
  }
}
