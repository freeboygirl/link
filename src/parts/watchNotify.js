
Link.prototype.addWatchNotify = function addWatchNotify(linkContext) {
  var that = this;
  if (isArray(linkContext.prop)) {
    each(linkContext.prop, function (watch) {
      that.addNofityHanlder(watch, linkContext);
    });
  }

  else {
    that.addNofityHanlder(linkContext.prop, linkContext);
  }
}

Link.prototype.addNofityHanlder = function addNofityHanlder(watch, linkContext) {
  if (!this.watchMap[watch]) {
    this.watchMap[watch] = [];
  }
  this.watchMap[watch].push(notifyFnFactory(linkContext));
}

function notifyFnFactory(linkContext) {
  //return ui render fn (notify fn )
  // fn has value when it's watch array change
  return function (change) {
    var exprVal;
    if (!linkContext.$$forClass) {
      exprVal = $eval(linkContext.expr, linkContext.model);
    }
    if (change) {
      linkContext.lastArraychange = change;
    }
    renderLink(linkContext, exprVal);
  };
}

Link.prototype.render = function render() {
  for (var watch in this.watchMap) {
    notify(this.watchMap, watch);
  }
}