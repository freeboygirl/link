
function addWatchFn(linkContext) {
  // check linkContext prop, if string , simple bind or model, if array it's text interpilation
  // simple watch
  if (isArray(linkContext.prop)) {
    // every prop watch need notifying the linkContext change
    each(linkContext.prop, function (prop) {
      if (!watchMap[prop]) {
        watchMap[prop] = [];
      }
      watchMap[prop].push(uiRenderFnBuilder(linkContext));
    });
  }
  else {
    if (!watchMap[linkContext.prop]) {
      watchMap[linkContext.prop] = [];
    }
    watchMap[linkContext.prop].push(uiRenderFnBuilder(linkContext));
  }
}
