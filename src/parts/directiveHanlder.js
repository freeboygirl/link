function showHideHanlder(binding, boolValue, directive) {
  var el = binding.el;
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

function repeatHanlder(binding) {
  var warr = getWatchValue(binding.prop),
    arr = warr && warr.arr,
    el = binding.el;

  if (el) {
    binding.originEl = binding.originEl || el.cloneNode(true);
    binding.comment = document.createComment('repeat end for ' + binding.prop);
    el.parentNode.insertBefore(binding.comment, el);
    el.remove();
    delete binding.el;
  }

  var lastLinks = binding.lastLinks || [];

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
      var cloneEl = binding.originEl.cloneNode(true);
      cloneEl.$$child = true;
      // lastClonedNodes.push(cloneEl);
      lastLinks.push(link(cloneEl, { $item: itemData }));
      // binding.comment.parentNode.insertBefore(cloneEl, binding.comment);
      docFragment.appendChild(cloneEl);
    });

    binding.comment.parentNode.insertBefore(docFragment, binding.comment);
    binding.lastLinks = lastLinks;
  }
}