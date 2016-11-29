function getWatchValue(watch) {
  try {
    var val = model;
    if (watch) {
      watch = watch.split('.');
      var len = watch.length;
      for (var i = 0; i < len; i++) {
        val = val[watch[i]];
      }
    }

    return val;
  } catch (e) {

  }
}

function setWatchValue(watch, value) {
  var val = model;
  if (watch) {
    watch = watch.split('.');
    var len = watch.length;
    if (len === 1) {
      model[watch] = value;
      return;
    }
    for (var i = 0; i < len; i++) {
      val = val[watch[i]]
      if (i === len - 2) {
        val[watch[len - 1]] = value;
        return;
      }
    }
  }
}