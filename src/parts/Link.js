function Link(el, data, behaviors) {
  if (!el || !data) throw Error('el and data are required!');
  if (!isObject(data)) throw Error('data must be object');
  this.model = data;
  this.el = el;
  this.behaviors = behaviors;
  this.linkContextCollection = []; // store linkContext
  this.eventLinkContextCollection = []; // store eventLinkContext
  this.watchMap = Object.create(null); // stores watch prop & watchfns mapping
  // this.allWatches = []; // store all model watches , for expr
  this.bootstrap();
};
