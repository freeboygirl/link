function bindModelListener(linkContext) {
  var el = linkContext.el, directive = linkContext.directive;
  if (el.nodeName === 'INPUT') {
    if (el.type === 'text') {
      el.addEventListener('keyup', function () {
        setWatchValue(linkContext.prop, el.value || '');
      }, false);
    }
    else if (el.type === 'radio') {
      //TODO: handler radio
      el.addEventListener('change', function () {
        setWatchValue(linkContext.prop, el.value || '');
      }, false);
    }
  }
  else if (el.nodeName === 'SELECT') {
    el.addEventListener('change', function () {
      setWatchValue(linkContext.prop, el.value || '');
    }, false);
  }
}
