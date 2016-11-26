/**
   * 1. get directives and build binding context info.
   * 2. when it's x-model , add form ui value change listener for 2 two-way binding.
   * 3. add watch fn.
   *
   * returns directives array found in el
   *  */
function compileBinding(el) {
  var attrValue, binding, foundDirectives = [];
  if (el.getAttribute) {
    each(directives, function (directive) {
      if (attrValue = el.getAttribute(directive)) {
        if (isWatch(attrValue)) {
          foundDirectives.push(directive);
          binding = Binding.create(el, attrValue, directive);
          bindings.push(binding);
          addWatchFn(binding);
          if (directive === 'x-model') {
            bindModelListener(binding);
          }
        }
        else {
          // expr
          var exprWatches = [];
          each(allWatches, function (watch) {
            if (attrValue.indexOf(watch) > -1) {
              exprWatches.push(watch);
            }
          });

          foundDirectives.push(directive);
          binding = Binding.create(el, exprWatches, directive);
          binding.expr = attrValue;
          bindings.push(binding);
          addWatchFn(binding);

        }
      }
    });
  } else if (el.nodeType === 3) {
    // text node , and it may contains several interpolation expr
    foundDirectives.push('x-bind');
    attrValue = getInterpolationWatch(el.textContent)
    if (attrValue.length > 0) {
      binding = Binding.create(el, attrValue, 'x-bind', el.textContent);
      bindings.push(binding);
      addWatchFn(binding);
    }
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