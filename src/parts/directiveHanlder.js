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
    each(arr, function (itemData) {
      var cloneEl = linkContext.originEl.cloneNode(true);
      cloneEl.$$child = true;
      lastLinks.push(link(cloneEl, { $item: itemData }, behaviors));
      docFragment.appendChild(cloneEl);
    });

    linkContext.comment.parentNode.insertBefore(docFragment, linkContext.comment);
    linkContext.lastLinks = lastLinks;
  }
}

function classHandler(linkContext) {
  var obj = parseJson(linkContext.prop),
    key = Object.keys(obj)[0],
    value = obj[key],
    exprVal = !!getWatchValue(value);

  if (exprVal) {
    addClass(linkContext.el, key);
  }
  else {
    removeClass(linkContext.el, key);
  }
}
