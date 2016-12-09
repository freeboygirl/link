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

function makeOneClonedLinkerForRepeater(linkContext, itemData, itemIndex) {
  var cloneEl = linkContext.originEl.cloneNode(true);
  // child model will inherit all props&fn from parent model.
  var childModel = Object.create(model, {
    $item: { value: itemData, enumerable: true, configurable: true, writable: true },
    $index: { value: itemIndex, enumerable: true, configurable: true, writable: true },
    $$child: { value: true }
  });

  var linker = link(cloneEl, childModel);
  return { el: cloneEl, linker: linker };
}

function repeatHanlder(linkContext) {
  var warr = $eval(linkContext.prop),
    arr = warr && warr.arr,
    el = linkContext.el;

  var lastArrayChangeInfo = linkContext.lastArrayChangeInfo;
  var lastDocFragment = linkContext.lastDocFragment || document.createDocumentFragment();
  var repeaterItem;

  if (el) {
    linkContext.originEl = linkContext.originEl || el.cloneNode(true);
    linkContext.comment = document.createComment('repeat end for ' + linkContext.prop);
    el.parentNode.insertBefore(linkContext.comment, el);
    el.remove();
    delete linkContext.el;
  }
  var lastLinks = linkContext.lastLinks || [];
  var comment = linkContext.comment;

  function rebuild() {
    each(lastLinks, function (link) {
      link.$unlink();
    });

    lastLinks.length = 0;
    lastLinks = [];
    each(arr, function (itemData, index) {
      repeaterItem = makeOneClonedLinkerForRepeater(linkContext, itemData, index);
      lastLinks.push(repeaterItem.linker);
      lastDocFragment.appendChild(repeaterItem.el);
    });

    comment.parentNode.insertBefore(lastDocFragment, comment);
  }

  if (lastLinks.length > 0 && lastArrayChangeInfo) {
    var fn = lastArrayChangeInfo[0],
      itemData,
      _linker;
    switch (fn) {
      case 'push': {
        itemData = arr[arr.length - 1];
        repeaterItem = makeOneClonedLinkerForRepeater(linkContext, itemData, index);
        lastLinks.push(repeaterItem.linker);
        comment.parentNode.insertBefore(repeaterItem.el, comment);
        break;
      }
      case 'pop': {
        _linker = lastLinks.pop();
        _linker.$unlink();
        break;
      }
      case 'removeOne': {
        var index = lastArrayChangeInfo[1];
        _linker = lastLinks.splice(index, 1)[0];
        _linker.$unlink();
        break;
      }
      case 'unshift': {
        var firstLinkerEl = lastLinks[0].$el;
        itemData = arr[0];
        repeaterItem = makeOneClonedLinkerForRepeater(linkContext, itemData, index);
        lastLinks.unshift(repeaterItem.linker);
        firstLinkerEl.parentNode.insertBefore(repeaterItem.el, firstLinkerEl);
        break;
      }
      case 'shift': {
        _linker = lastLinks.shift();
        _linker.$unlink();
        break;
      }
      default: {
        // clear all and rebuild 
        rebuild();
      }
    }

  } else {
    rebuild();
  }

  linkContext.lastLinks = lastLinks;
  linkContext.lastDocFragment = lastDocFragment;
}

function classHandler(linkContext) {
  var exprVal = !!$eval(linkContext.expr);

  if (exprVal) {
    addClass(linkContext.el, linkContext.className);
  }
  else {
    removeClass(linkContext.el, linkContext.className);
  }
}

function disabledHanlder(linkContext, exprVal) {
  if (exprVal) {
    linkContext.el.setAttribute("disabled", "disabled");
  }
  else {
    linkContext.el.removeAttribute("disabled");
  }
}
