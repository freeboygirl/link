function bootstrap() {
  addStyles();
  watchModel(model);
  compile(el);
  render();
  addBehaviors();
}
