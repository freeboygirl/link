

Link.prototype.getLinkContextsFromInterpolation = function getLinkContextsFromInterpolation(el, text) {
  var expr = ['"', text, '"'].join('').replace(/(\{\{)/g, '"+').replace(/(\}\})/g, '+"');
  var lexer = new Lexer(expr),
    watches = lexer.getWatches(),
    that = this;

  each(watches, function (watch) {
    that.addLinkContextAndSetWatch(el, watch, 'x-bind', expr);
  });
}

Link.prototype.addLinkContextAndSetWatch = function addLinkContextAndSetWatch(el, watches, directive, expr) {
  var linkContext = LinkContext.create(el, watches, directive, expr, this.model);
  this.linkContextCollection.push(linkContext);
  this.addWatchNotify(linkContext);
  if (directive === 'x-model') {
    linkUIListener(linkContext);
  }
}

Link.prototype.getEventLinkContext = function getEventLinkContext(el, attrName, fn) {
  var event = eventDirectiveRegex.exec(attrName)[1],
    eventLinkContext = EventLinkContext.create(el, event, fn, this.model);
  this.linkContextCollection.push(eventLinkContext);
  bindEventLinkContext(this, eventLinkContext);
}


Link.prototype.getLinkContext = function getLinkContext(el, directive, expr) {
  if (isWatch(expr)) {
    this.addLinkContextAndSetWatch(el, expr, directive, expr);
  }
  else if (expr[0] === '{' && expr.slice(-1) === '}') {
    // object ,for x-class , only support 1 classname now 
    var data = expr.slice(1, -1).split(':'),
      className = data[0],
      lexExpr = data[1];

    var lexer = new Lexer(lexExpr),
      watches = lexer.getWatches();

    var linkContext = LinkContext.create(el, watches, directive, lexExpr, this.model);
    linkContext.$$forClass = true;
    linkContext.className = className;
    this.linkContextCollection.push(linkContext);
    this.addWatchNotify(linkContext);
  }
  else {
    var lexer = new Lexer(expr),
      watches = lexer.getWatches();
    this.addLinkContextAndSetWatch(el, watches, directive, expr);
  }
}

/**
   * 1. get directives and build linkContext context info.
   * 2. when it's x-model , add form ui value change listener for 2 two-way linkContext.
   * 3. add watch fn.
   *
   *  */
Link.prototype.compileDOM = function compileDOM(el) {
  var attrs = el.attributes,
    attrName,
    attrValue,
    that = this;
  if (el.hasAttributes && el.hasAttributes()) {
    each(attrs, function (attr) {
      attrName = attr.name;
      attrValue = trim(attr.value);
      if (eventDirectiveRegex.test(attrName)) {
        // event directive
        that.getEventLinkContext(el, attrName, attrValue);
      }
      else if (directives.indexOf(attrName) > -1
        && !(attrName === 'x-repeat' && that.model.$$child)) {
        // none event directive
        that.getLinkContext(el, attrName, attrValue);
      }
    });

  } else if (el.nodeType === 3) {
    // text node , and it may contains several watches
    var expr = trim(el.textContent);
    if (expr && /\{\{[^\}]+\}\}/.test(expr)) {
      this.getLinkContextsFromInterpolation(el, expr);
    }
  }
}

Link.prototype.compile = function compile(el) {
  var that = this;
  /**
   * 1. case x-repeat origin ,skip it and its childNodes compiling.(only need add handle x-repeat)
   * 2. case x-repeat clone , the el is root linker 
   *
   *  */
  if (el.hasAttribute && el.hasAttribute('x-repeat')) {
    if (!this.model.$$child) {
      //origin
      this.getLinkContext(el, 'x-repeat', el.getAttribute('x-repeat'));
      return;
    }
  }

  this.compileDOM(el);

  each(el.childNodes, function (node) {
    that.compile(node);
  });
}
