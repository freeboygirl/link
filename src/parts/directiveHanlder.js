function showHideHanlder(linkContext, boolValue, directive) {
  var el = linkContext.el;
  if (directive === 'x-show' && boolValue
    || directive === 'x-hide' && !boolValue) {
    removeClass(el, 'x-hide');
  }
  else {
    addClass(el, 'x-hide');
  }
}

function repeatHanlder(linkContext) {
  var warr = getWatchValue(linkContext.prop),
    arr = warr && warr.arr,
    el = linkContext.el;

  if (el) {
    linkContext.originEl = linkContext.originEl || el.cloneNode(true);
    linkContext.comment = document.createComment('repeat end for ' + linkContext.prop);
    el.parentNode.insertBefore(linkContext.comment, el);
    el.remove();
    delete linkContext.el;
  }

  var lastLinks = linkContext.lastLinks || [];

  //unlink repeat item
  if (lastLinks.length > 0) {
    each(lastLinks, function (link) {
      link.$unlink();
    });

    lastLinks.length = 0;
    lastLinks = [];
  }

  var docFragment = document.createDocumentFragment();

  if (isArray(arr)) {
    each(arr, function (itemData, index) {
      var cloneEl = linkContext.originEl.cloneNode(true);
      cloneEl.$$child = true;
      var childModel = Object.create(model, {
        $item: { value: itemData, enumerable: true, configurable: true, writable: true },
        $index: { value: index, enumerable: true, configurable: true, writable: true }
      });

      lastLinks.push(link(cloneEl, childModel));
      docFragment.appendChild(cloneEl);
    });

    linkContext.comment.parentNode.insertBefore(docFragment, linkContext.comment);
    linkContext.lastLinks = lastLinks;
  }
}

function classHandler(linkContext) {
  var exprVal = !!evalExpr(linkContext);

  if (exprVal) {
    addClass(linkContext.el, linkContext.className);
  }
  else {
    removeClass(linkContext.el, linkContext.className);
  }
}
