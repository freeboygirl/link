
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
};

Link.prototype.addNofityHanlder = function addNofityHanlder(watch, linkContext) {
  if (!this.watchMap[watch]) {
    this.watchMap[watch] = [];
  }
  this.watchMap[watch].push(notifyFnFactory(linkContext));
};

Link.prototype.render = function render() {
  for (var watch in this.watchMap) {
    notify(this.watchMap, watch);
  }
};

function notifyFnFactory(linkContext) {
  /**
   * 1. this is  directive render fn 
   * 2.change has value when it's watcharray change
   *  */
  return function (change) {
    change && (linkContext.lastArraychange = change);
    renderLink(linkContext);
  };
}

function renderLink(linkContext) {
  DIRETIVE_RENDER_MAP[linkContext.directive].call(null, linkContext);
}