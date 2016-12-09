
/**
 * expr[string] is directive attribute value in the DOM, it could be a simple watch or watch(es) expr;
 *  */
function getLinkContext(el, directive, expr) {
  if (isWatch(expr)) {
    addLinkContextAndSetWatch(el, expr, directive, expr);
  }
  else if (expr[0] === '{' && expr.slice(-1) === '}') {
    // object ,for x-class , only support 1 classname now 
    var data = expr.slice(1, -1).split(':'),
      className = data[0],
      lexExpr = data[1];

    var lexer = new Lexer(lexExpr),
      watches = lexer.getWatches();

    var linkContext = LinkContext.create(el, watches, directive, lexExpr);
    linkContext.$$forClass = true;
    linkContext.className = className;
    linkContextCollection.push(linkContext);
    addWatchMap(linkContext);
  }
  else {
    var lexer = new Lexer(expr),
      watches = lexer.getWatches();
    addLinkContextAndSetWatch(el, watches, directive, expr);
  }
}

function getLinkContextsFromInterpolation(el, text) {
  var expr = ['"', text, '"'].join('').replace(/(\{\{)/g, '"+').replace(/(\}\})/g, '+"');
  var lexer = new Lexer(expr),
    watches = lexer.getWatches();

  each(watches, function (watch) {
    addLinkContextAndSetWatch(el, watch, 'x-bind', expr);
  });
}

function addLinkContextAndSetWatch(el, watches, directive, expr) {
  var linkContext = LinkContext.create(el, watches, directive, expr);
  linkContextCollection.push(linkContext);
  addWatchMap(linkContext);
  if (directive === 'x-model') {
    linkUIListener(linkContext);
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
    var expr = trim(el.textContent);
    if (expr && /\{\{[^\}]+\}\}/.test(expr)) {
      getLinkContextsFromInterpolation(el, expr);
    }
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
      getLinkContext(el, repeaterDrName, el.getAttribute(repeaterDrName));
      return;
    }
  }

  compileDOM(el);

  each(el.childNodes, function (node) {
    compile(node);
  });
}
