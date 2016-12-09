function linkError() {
  var error = formatString.apply(model, arguments);
  return new Error(error);
}