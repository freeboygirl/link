
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
