
function addWatchFn(binding) {
  // check binding prop, if string , simple bind or model, if array it's text interpilation
  // simple watch
  if (isArray(binding.prop)) {
    // every prop watch need notifying the binding change
    each(binding.prop, function (prop) {
      if (!watchMap[prop]) {
        watchMap[prop] = [];
      }
      watchMap[prop].push(uiRenderFnBuilder(binding));
    });
  }
  else {
    if (!watchMap[binding.prop]) {
      watchMap[binding.prop] = [];
    }
    watchMap[binding.prop].push(uiRenderFnBuilder(binding));
  }
}