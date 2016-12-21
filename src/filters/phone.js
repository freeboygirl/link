function phoneFilter(str) {
  //the middle 4 digit replace with *
  if (isString(str) && str.length === 11) {
    return str.slice(0, 3) + '****' + str.slice(-4);
  }

  return str;
}