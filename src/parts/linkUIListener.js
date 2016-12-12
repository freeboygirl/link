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
        case 'radio': {
          simpleListenHandler(linkContext, 'click');
          break;
        }
        case 'checkbox': {
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
    setWatchValue(linkContext.prop, el.value || '', linkContext.model);
  });
}

function checkboxListenHandler(linkContext) {
  var el = linkContext.el;
  el.addEventListener('click', function () {
    var value = el.value,
      checked = el.checked,
      propValue = $eval(linkContext.prop, linkContext.model);

    if (!(propValue instanceof WatchedArray)) {
      throw linkError('checkbox should bind with array');
    }

    if (!checked && propValue.contain(value)) {
      propValue.removeOne(value);
    }
    else {
      propValue.push(value);
    }

  }, false);
}
