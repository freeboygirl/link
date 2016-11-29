function bindModelListener(linkContext) {
  var el = linkContext.el, directive = linkContext.directive;
  if (el.nodeName === 'INPUT') {
    if (el.type === 'text') {
      addEventListenerHanlder(el, 'keyup', function () {
        setWatchValue(linkContext.prop, el.value || '');
      });
    }
    else if (el.type === 'radio') {
      //TODO: handler radio
      el.addEventListener('click', function () {
        setWatchValue(linkContext.prop, el.value || '');
      }, false);
    }
    else if (el.type === 'checkbox') {
      el.addEventListener('click', function () {
        var value = el.value,
          checked = el.checked,
          propValue = getWatchValue(linkContext.prop),
          arr,
          watch;

        if (propValue instanceof WatchedArray) {
          arr = propValue.arr;
          watch = propValue.watch;
        }
        else{
          throw linkError('checkbox should bind with array');
        }
        if (!checked && arr.indexOf(value) > -1) {
          ArrayRemove(arr, value);
        }
        else {
          arr.push(value);
        }
        var newPropValue = new WatchedArray(watch, arr);
        setWatchValue(linkContext.prop, newPropValue);
      }, false);
    }
  }
  else if (el.nodeName === 'SELECT') {
    addEventListenerHanlder(el, 'change', function () {
      setWatchValue(linkContext.prop, el.value || '');
    });
  }
}
