function linkUIListener(linkContext) {
  var el = linkContext.el, directive = linkContext.directive,
    nodeName = el.nodeName, type = el.type;
  switch (nodeName) {
    case 'INPUT': {
      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'url': {
          simpleListenHandler(linkContext, 'keyup');
          break;
        }
        case 'radio':{
          simpleListenHandler(linkContext,'click');
          break;
        }
        case 'checkbox':{
          checkboxListenHandler(linkContext);
          break;
        }
      }
      break;
    }
    case 'SELECT': {
      simpleListenHandler(linkContext, 'change');
      break;
    }
    default: {
      simpleListenHandler(linkContext, 'keyup');
      break;
    }
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
