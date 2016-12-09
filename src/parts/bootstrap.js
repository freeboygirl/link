function bootstrap() {
  if (model.hasOwnProperty('$$watched')) {
    throw linkError('this model had been used for some linker, please check...');
  }
  addStyles();
  watchModel(model);
  _def_const_prop_(model, '$$watched', true);
  compile(el);
  render(watchMap);
  addBehaviors();
}
