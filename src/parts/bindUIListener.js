function bindModelListener(binding) {
  var el = binding.el, directive = binding.directive;
  if (el.nodeName === 'INPUT') {
    if (el.type === 'text') {
      el.addEventListener('keyup', function () {
        setWatchValue(binding.prop, el.value || '');
      }, false);
    }
    else if (el.type === 'radio') {
      //TODO: handler radio
      el.addEventListener('change', function () {
        setWatchValue(binding.prop, el.value || '');
      }, false);
    }
  }
  else if (el.nodeName === 'SELECT') {
    el.addEventListener('change', function () {
      setWatchValue(binding.prop, el.value || '');
    }, false);
  }
}
