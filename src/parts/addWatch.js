
function addWatchMap(linkContext) {
  if (isArray(linkContext.prop)) {
    each(linkContext.prop, function (watch) {
      addWatchFn(watch, linkContext);
    });
  }

  else {
    addWatchFn(linkContext.prop, linkContext);
  }
}

function addWatchFn(watch, linkContext) {
  if (!watchMap[watch]) {
    watchMap[watch] = [];
  }
  watchMap[watch].push(notifyFnFactory(linkContext));
}
