Link.prototype.bootstrap = function () {
  if (this.model.hasOwnProperty('$$watched')) {
    throw linkError('this model had been used for some linker, please check...');
  }
  this.watchModel(this.model);
  _def_const_prop_(this.model, '$$watched', true);
  this.compile(this.el);
  this.render();
  this.addBehaviors();
};
