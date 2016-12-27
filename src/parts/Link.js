function Link(el, data, behaviors, routeConfig) {
  this.model = data;
  this.el = el;
  this.behaviors = behaviors;
  this.eventStore = []; // store event bind info 
  this.linkContextCollection = []; // store linkContext
  this.watchMap = Object.create(null); // stores watch and watchfn map
  this.routeEl = null; // route template string container if it exists,it is not required.
  this.bootstrap();

  if (routeConfig) {
    configRoutes(this, routeConfig.routes, routeConfig.defaultPath);
  }
};
