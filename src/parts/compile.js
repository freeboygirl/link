
/**
 * expr[string] is directive attribute value in the DOM, it could be a simple watch or watch(es) expr;
 *  */
function getLinkContext(el, directive, expr) {
  var linkContext;

  if (isWatch(expr)) {
    //expr is a simple watch
    linkContext = LinkContext.create(el, expr, directive);
    linkContextCollection.push(linkContext);
    addWatchMap(linkContext);
    if (directive === 'x-model') {
      linkUIListener(linkContext);
    }
  }
  else if (expr[0] === '{' && expr.slice(-1) === '}') {
    // object ,for x-class , only support 1 classname now 
    linkContext = LinkContext.create(el, expr, directive);
    linkContext.$$forClass = true;
    linkContextCollection.push(linkContext);
    addWatchMap(linkContext);
  }
  else {
    //expr is watch expr, need parse and $eval
    var lexer = new Lexer(expr),
      watches = lexer.getWatches();

    linkContext = LinkContext.create(el, watches, directive, expr);
    linkContext.tokens = lexer.tokens;
    linkContextCollection.push(linkContext);
    addWatchMap(linkContext);
  }
}

function getLinkContextsFromInterpolation(el, tpl) {
  var props = getInterpolationWatch(tpl),
    linkContext;
  if (props.length > 0) {
    linkContext = LinkContext.create(el, props, 'x-bind', null, tpl);
    linkContextCollection.push(linkContext);
    addWatchMap(linkContext);
  }
}

/**
   * 1. get directives and build linkContext context info.
   * 2. when it's x-model , add form ui value change listener for 2 two-way linkContext.
   * 3. add watch fn.
   *
   * returns directives array found in el
   *  */
function compileDOM(el) {
  var expr, foundDirectives = [];
  if (el.getAttribute) {
    each(directives, function (directive) {
      if (expr = el.getAttribute(directive)) {
        expr = trim(expr);
        // skip child vm repeat 
        if (!(directive === 'x-repeat' && el.$$child)) {
          foundDirectives.push(directive);
          getLinkContext(el, directive, expr);
        }

      }
    });
    if (el.hasAttributes()) {
      //event directive compile 
      var attrs = el.attributes,
        event,
        fn,
        eventLinkContext;
      each(attrs, function (attr) {
        // if(attr.val)
        if (eventDirectiveRegex.test(attr.name)) {
          event = eventDirectiveRegex.exec(attr.name)[1];
          fn = attr.value;
          eventLinkContext = EventLinkContext.create(el, event, fn);
          eventLinkContextCollection.push(eventLinkContext);
          bindEventLinkContext(eventLinkContext);
        }
      });
    }

  } else if (el.nodeType === 3) {
    // text node , and it may contains several watches
    // if (interpolationRegex.test(el.textContent)) {
    foundDirectives.push('x-bind');
    getLinkContextsFromInterpolation(el, el.textContent);
    // }

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
  // if (!el.$$child) {
  foundDirectives = compileDOM(el);
  if (foundDirectives.indexOf('x-repeat') > -1) {
    // console.log('this is x-repeat, stop childNodes compile');
    return;
  }
  // }
  // else {
  //   // console.log('this is a clone x-repeat, skip compile');
  // }

  each(el.childNodes, function (node) {
    compile(node);
  });
}
