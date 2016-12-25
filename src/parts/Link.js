function Link(el, data, behaviors) {
  this.model = data;
  this.el = el;
  this.behaviors = behaviors;
  this.eventStore = []; // store event bind info 
  this.linkContextCollection = []; // store linkContext
  this.watchMap = Object.create(null); // stores watch and watchfn map
  this.routeEl = null;
  this.bootstrap();
};
