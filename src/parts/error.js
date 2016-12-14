function linkError() {
  var error = formatString.apply(null, arguments);
  return new Error(error);
}