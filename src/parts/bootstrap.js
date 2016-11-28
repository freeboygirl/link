function bootstrap() {
  addStyles();
  watchModel(model);
  compile(el);
  render();

  addBehaviors();
  // add behaviors here 
  // if (isObject(behaviors)) {
  //   var methods = Object.keys(behaviors);
  //   each(methods, function (fn) {
  //     if (typeof (behaviors[fn]) === 'function') {
  //       model[fn] = behaviors[fn];
  //     }
  //   });
  // }

};
