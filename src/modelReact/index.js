function modelReactDispatch(linkContext) {
  var el = linkContext.el, directive = linkContext.directive,
    nodeName = el.nodeName, type = el.type;
  switch (nodeName) {
    case 'INPUT': {
      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'url': {
          commonReact(linkContext, 'keyup');
          break;
        }
        case 'radio': {
          commonReact(linkContext, 'click');
          break;
        }
        case 'checkbox': {
          checkboxReact(linkContext);
          break;
        }
      }
      break;
    }
    case 'SELECT': {
      commonReact(linkContext, 'change');
      break;
    }
    default: {
      commonReact(linkContext, 'keyup');
      break;
    }
  }
}