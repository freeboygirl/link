function linkUIListener(linkContext) {
  var el = linkContext.el, directive = linkContext.directive;
  if (el.nodeName === 'INPUT') {
    if (el.type === 'text') {
      simpleListenHandler(linkContext, 'keyup');
    }
    else if (el.type === 'radio') {
      simpleListenHandler(linkContext, 'click');
    }
    else if (el.type === 'checkbox') {
      checkboxListenHandler(linkContext);
    }
  }
  else if (el.nodeName === 'SELECT') {
    simpleListenHandler(linkContext, 'change');
  }
  else if (el.nodeName === 'TEXTAREA') {
    simpleListenHandler(linkContext, 'keyup');
  }
}

function simpleListenHandler(linkContext, event) {
  var el = linkContext.el;
  addEventListenerHanlder(el, event, function () {
    setWatchValue(linkContext.prop, el.value || '');
  });
}

function checkboxListenHandler(linkContext) {
  var el = linkContext.el;
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
    else {
      throw linkError('checkbox should bind with array');
    }
    if (!checked && arr.indexOf(value) > -1) {
      arrayRemove(arr, value);
    }
    else {
      arr.push(value);
    }
    var newPropValue = new WatchedArray(watch, arr);
    setWatchValue(linkContext.prop, newPropValue);
  }, false);
}
