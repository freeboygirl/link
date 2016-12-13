

// function renderLink(linkContext) {
//   // var directive = linkContext.directive;
//   // if (directive === 'x-show' || directive === 'x-hide') {
//   //   showHideHanlder(linkContext);
//   // }
//   // else {
//   //   handler = [directive.split('-')[1], 'Hanlder'].join('');
//   //   if (typeof hanlder === 'function') {
//   //     handler.call(null, LinkContext);
//   //   }
//   // }
//   DIRETIVE_RENDER_MAP[linkContext.directive].call(null, linkContext);


//   // if (linkContext.directive === 'x-bind') {
//   //   // linkContext.el.textContent = exprVal;
//   //   bindHanlder(linkContext);
//   // }
//   // else if (linkContext.directive === 'x-model') {
//   //   // var el = linkContext.el;
//   //   // if (el.type === 'radio') {
//   //   //   el.checked = (el.value === exprVal);
//   //   // }
//   //   // else if (el.type === 'checkbox') {
//   //   //   if (exprVal instanceof WatchedArray) {
//   //   //     el.checked = exprVal.arr.indexOf(el.value) > -1;
//   //   //   } else {
//   //   //     throw linkError('checkbox should bind with array');
//   //   //   }

//   //   // }
//   //   // else {
//   //   //   linkContext.el.value = exprVal;
//   //   // }
//   //   modelHanlder(linkContext);

//   // } else if (linkContext.directive === 'x-show' || linkContext.directive === 'x-hide') {
//   //   showHanlder(linkContext);
//   // }
//   // else if (linkContext.directive === 'x-disabled') {
//   //   disabledHanlder(linkContext);
//   // }
//   // else if (linkContext.directive === 'x-repeat') {
//   //   // repeat can't be nested
//   //   // repeat item will construct a new linker object
//   //   repeatHanlder(linkContext);
//   // }
//   // else if (linkContext.$$forClass) {
//   //   // x-class
//   //   classHandler(linkContext);
//   // }
// }
