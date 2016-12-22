function Link(el, data, behaviors) {
  this.model = data;
  this.el = el;
  this.behaviors = behaviors;
  this.linkContextCollection = []; // store linkContext
  this.eventLinkContextCollection = []; // store eventLinkContext
  this.watchMap = Object.create(null); // stores watch prop & watchfns mapping
  // this.allWatches = []; // store all model watches , for expr
  this.bootstrap();
};
