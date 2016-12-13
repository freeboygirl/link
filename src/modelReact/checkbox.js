
function checkboxReact(linkContext) {
  var el = linkContext.el;
  el.addEventListener('click', function () {
    var value = el.value,
      checked = el.checked,
      propValue = evalLinkContext(linkContext);

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
