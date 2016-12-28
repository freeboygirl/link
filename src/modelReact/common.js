function commonReact(linkContext, event) {
  var el = linkContext.el;
  function commonHandler() {
    setWatchValue(linkContext.prop, el.value || '', linkContext.linker.model);
  }
  addEventListenerHandler(el, event, commonHandler, linkContext.linker.eventStore);
}