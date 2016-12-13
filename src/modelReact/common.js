function commonReact(linkContext, event) {
  var el = linkContext.el;
  addEventListenerHanlder(el, event, function () {
    setWatchValue(linkContext.prop, el.value || '', linkContext.linker.model);
  });
}