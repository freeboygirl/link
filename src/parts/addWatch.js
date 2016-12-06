
function addWatchMap(linkContext) {
  if (isArray(linkContext.prop)) {
    each(linkContext.prop, function (watch) {
      addWatchFn(watch, linkContext);
    });
  }
  else if (linkContext.$$forClass) {
    // x-class
    // prop is value in an object 
    var obj = parseJson(linkContext.prop),
      key = Object.keys(obj)[0],
      value = obj[key];
    addWatchFn(value, linkContext);
  }
  else {
    addWatchFn(linkContext.prop, linkContext);
  }
}

function addWatchFn(watch, linkContext) {
  if (!watchMap[watch]) {
    watchMap[watch] = [];
  }
  watchMap[watch].push(uiRenderFnBuilder(linkContext));
}
