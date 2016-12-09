
function addWatchNotify(linkContext) {
  if (isArray(linkContext.prop)) {
    each(linkContext.prop, function (watch) {
      addNofityHanlder(watch, linkContext);
    });
  }

  else {
    addNofityHanlder(linkContext.prop, linkContext);
  }
}

function addNofityHanlder(watch, linkContext) {
  if (!watchMap[watch]) {
    watchMap[watch] = [];
  }
  watchMap[watch].push(notifyFnFactory(linkContext));
}

function notifyFnFactory(linkContext) {
  //return ui render fn (notify fn )
  // fn has value when it's watch array change
  return function (change) {
    var exprVal;
    if (!linkContext.$$forClass) {
      exprVal = $eval(linkContext.expr);
    }
    if (change) {
      linkContext.lastArraychange = change;
    }
    renderLink(linkContext, exprVal);
  };
}
