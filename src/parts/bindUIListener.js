function bindModelListener(linkContext) {
  var el = linkContext.el, directive = linkContext.directive;
  if (el.nodeName === 'INPUT') {
    if (el.type === 'text') {
      addEventListenerHanlder(el, 'keyup', function () {
        setWatchValue(linkContext.prop, el.value || '');
      });
    }
    else if (el.type === 'radio' || el.type === 'checkbox') {
      //TODO: handler radio
      el.addEventListener('click', function () {
        var val = el.checked;
        setWatchValue(linkContext.prop, el.value || '');
      }, false);
    }
  }
  else if (el.nodeName === 'SELECT') {
    addEventListenerHanlder(el, 'change', function () {
      setWatchValue(linkContext.prop, el.value || '');
    });
  }
}
