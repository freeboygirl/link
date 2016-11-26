
/**
 * isSimpleWatch[boolean]
 * expr[string] is directive attribute value in the DOM, it could be a simple watch or watch(es) expr;
 *  */
function getBinding(el, directive, expr) {
  var binding;

  if (isWatch(expr)) {
    //expr is a watch
    binding = Binding.create(el, expr, directive);
    bindings.push(binding);
    addWatchFn(binding);
    if (directive === 'x-model') {
      bindModelListener(binding);
    }
  } else {
    var exprWatches = [];
    each(allWatches, function (watch) {
      if (expr.indexOf(watch) > -1) {
        exprWatches.push(watch);
      }
    });

    binding = Binding.create(el, exprWatches, directive, expr);
    bindings.push(binding);
    addWatchFn(binding);
  }
}

function getBindingsFromInterpolation(el, tpl) {
  var props = getInterpolationWatch(tpl),
    binding,
    bindingArr = [];
  if (props.length > 0) {
    binding = Binding.create(el, props, 'x-bind', null, tpl);
    bindings.push(binding);
    addWatchFn(binding);
  }
}

/**
   * 1. get directives and build binding context info.
   * 2. when it's x-model , add form ui value change listener for 2 two-way binding.
   * 3. add watch fn.
   *
   * returns directives array found in el
   *  */
function compileBinding(el) {
  var expr, binding, foundDirectives = [];
  if (el.getAttribute) {
    each(directives, function (directive) {
      if (expr = el.getAttribute(directive)) {
        foundDirectives.push(directive);
        binding = getBinding(el, directive, expr);
      }
    });
  } else if (el.nodeType === 3) {
    // text node , and it may contains several watches
    foundDirectives.push('x-bind');
    binding = getBindingsFromInterpolation(el, el.textContent);
  }

  return foundDirectives;
}

function compile(el) {
  /**
   * 1. case x-repeat origin , compile it but skip childNodes compiling.
   * 2. case x-repeat clone , skip compiling , but go on compiling its childNodes.
   *
   *  */
  var foundDirectives;
  if (!el.$$child) {
    foundDirectives = compileBinding(el);
    if (foundDirectives.indexOf('x-repeat') > -1) {
      console.log('this is x-repeat, stop childNodes compile');
      return;
    }
  }
  else {
    console.log('this is a clone x-repeat, skip compile');
  }

  each(el.childNodes, function (node) {
    compile(node);
  });
}
