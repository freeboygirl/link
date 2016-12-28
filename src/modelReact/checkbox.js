
function checkboxReact(linkContext) {
  var el = linkContext.el;
  function checkboxHandler() {
    var value = el.value,
      checked = el.checked,
      propValue = evalLinkContext(linkContext);

    if (!(isBoolean(propValue) || propValue instanceof WatchedArray)) {
      throw linkError('checkbox should bind with array or boolean value');
    }

    if (propValue instanceof WatchedArray) {
      if (!checked && propValue.contain(value)) {
        propValue.removeOne(value);
      }
      else {
        propValue.push(value);
      }
    }
    else {
      setWatchValue(linkContext.prop, checked, linkContext.linker.model);
    }
  }
  addEventListenerHandler(el, 'click', checkboxHandler, linkContext.linker.eventStore);
}
