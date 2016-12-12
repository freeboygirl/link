function linkError(linker) {
  var error = formatString.apply(linker, arguments);
  return new Error(error);
}