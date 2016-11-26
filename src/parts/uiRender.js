function uiRenderFnBuilder(binding) {
  //return ui render fn
  return function () {
    if (binding.directive === 'x-bind' && !(binding.prop instanceof Array)) {
      binding.el.innerText = getWatchValue(binding.prop);
    }
    else if (binding.directive === 'x-model') {
      binding.el.value = getWatchValue(binding.prop);
    }
    else if (binding.prop instanceof Array) {
      // text node for interpolation expr
      if (binding.tpl) {
        binding.el.textContent = evalInterpolation(binding);
      } else if (binding.expr) {
        var exprVal = evalExpr(binding);
        if (binding.directive === 'x-show' || binding.directive === 'x-hide') {
          showHideHanlder(binding, exprVal, binding.directive);
        }
      }

    }
    else if (binding.directive === 'x-repeat') {
      // repeat can't be nested
      // repeat item will construct a new linker object
      repeatHanlder(binding);
    }
  }
}
