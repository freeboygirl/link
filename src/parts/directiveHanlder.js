function showHideHanlder(linkContext, boolValue, directive) {
  var el = linkContext.el;
  if (directive === 'x-show') {
    if (boolValue) {
      if (el.className.indexOf('x-hide') > -1) {
        el.className = el.className.replace(/x-hide/g, '');
      }
    }
    else {
      if (el.className.indexOf('x-hide') === -1) {
        el.className = el.className + ' x-hide';
      }
    }
  } else {
    // x-hide
    if (!boolValue) {
      if (el.className.indexOf('x-hide') > -1) {
        el.className = el.className.replace(/x-hide/g, '');
      }
    }
    else {
      if (el.className.indexOf('x-hide') === -1) {
        el.className = el.className + ' x-hide';
      }
    }
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
      link.unlink();
    });

    lastLinks.length = 0;
    lastLinks = [];
  }

  var docFragment = document.createDocumentFragment();

  if (isArray(arr)) {
    each(arr, function (itemData) {
      var cloneEl = linkContext.originEl.cloneNode(true);
      cloneEl.$$child = true;
      // lastClonedNodes.push(cloneEl);
      lastLinks.push(link(cloneEl, { $item: itemData }));
      // linkContext.comment.parentNode.insertBefore(cloneEl, linkContext.comment);
      docFragment.appendChild(cloneEl);
    });

    linkContext.comment.parentNode.insertBefore(docFragment, linkContext.comment);
    linkContext.lastLinks = lastLinks;
  }
}
