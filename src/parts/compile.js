
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
    var data = expr.slice(1, -1).split(':'),
      className = data[0],
      lexExpr = data[1];

    var lexer = new Lexer(lexExpr),
      watches = lexer.getWatches();

    linkContext = LinkContext.create(el, watches, directive, lexExpr);
    linkContext.$$forClass = true;
    linkContext.tokens = lexer.tokens;
    linkContext.className = className;
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

function getEventLinkContext(el, attrName, fn) {
  var event = eventDirectiveRegex.exec(attrName)[1],
    eventLinkContext = EventLinkContext.create(el, event, fn);
  eventLinkContextCollection.push(eventLinkContext);
  bindEventLinkContext(eventLinkContext);
}

/**
   * 1. get directives and build linkContext context info.
   * 2. when it's x-model , add form ui value change listener for 2 two-way linkContext.
   * 3. add watch fn.
   *
   *  */
function compileDOM(el) {
  var attrs = el.attributes,
    attrName,
    attrValue;
  if (el.hasAttributes && el.hasAttributes()) {
    each(attrs, function (attr) {
      attrName = attr.name;
      attrValue = trim(attr.value);
      if (eventDirectiveRegex.test(attrName)) {
        // event directive
        getEventLinkContext(el, attrName, attrValue);
      }
      else if (directives.indexOf(attrName) > -1
        && !(attrName === repeaterDrName && model.$$child)) {
        // none event directive
        getLinkContext(el, attrName, attrValue);
      }
    });

  } else if (el.nodeType === 3) {
    // text node , and it may contains several watches
    getLinkContextsFromInterpolation(el, el.textContent);
  }
}

function compile(el) {
  /**
   * 1. case x-repeat origin ,skip it and its childNodes compiling.(only need add handle x-repeat)
   * 2. case x-repeat clone , the el is root linker 
   *
   *  */
  if (el.hasAttribute && el.hasAttribute(repeaterDrName)) {
    if (!model.$$child) {
      //origin
      var linkContext = LinkContext.create(el, el.getAttribute(repeaterDrName), repeaterDrName);
      linkContextCollection.push(linkContext);
      addWatchMap(linkContext);
      return;
    }
  }

  compileDOM(el);

  each(el.childNodes, function (node) {
    compile(node);
  });
}
