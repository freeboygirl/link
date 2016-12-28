/**
 * x-router based on old browser hash   
*/
function hash(path) {
  if (typeof path === 'undefined') {
    var href = location.href,
      index = href.indexOf('#');
    return index === -1 ? '' : href.slice(index + 1)
  }
  else {
    location.hash = path;
  }
}

function replaceHash(path) {
  var href = location.href,
    index = href.indexOf('#');
  if (index > -1) {
    location.replace(href.slice(0, index) + '#' + path);
  }
  else {
    location.replace(href + '#' + path);
  }
}

var templateStore = Object.create(null);

function loadTemplate(url, cb) {
  var tpl = templateStore[url];
  if (tpl) {
    cb.call(null, tpl);
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          templateStore[url] = xhr.responseText;
          cb.call(null, xhr.responseText);
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'text/html');
    xhr.send(null);
  }
}

/**
  var routes = {
    'path':{
       model: {},
       methods:{},
       template: '',
       templateUrl: '',
       preLink:fn,
       postLink:fn
    }
  }];
*/
function configRoutes(linker, routes, defaultPath) {
  addEventListenerHandler(window, 'hashchange', renderRouter, linker.eventStore);
  var hs = hash();
  if (hs) {
    renderRouter();
  }
  else {
    replaceHash(defaultPath);
  }
  function renderRouter() {
    var route = routes[hash()];
    if (!route) {
      replaceHash(defaultPath);
      return;
    }
    if (!route.model || !isObject(route.model)) {
      route.model = {};
    }
    var template = trim(route.template);
    if (!template) {
      if (route.templateUrl) {
        loadTemplate(route.templateUrl, function (tpl) {
          linkRoute(linker, route, tpl);
        });
      } else {
        linkRoute(linker, route, '');
      }
    } else {
      linkRoute(linker, route, template);
    }
  }
}

function linkRoute(linker, route, tpl) {
  var preLinkReturn;
  if (linker.routeEl) {
    linker.routeEl.innerHTML = tpl;
  }
  if (route.lastLinker) {
    route.lastLinker.unlink(); // destroy link
  }
  if (isFunction(route.preLink)) {
    preLinkReturn = route.preLink.call(route, linker);
  }
  if (preLinkReturn && isFunction(preLinkReturn.then)) {
    preLinkReturn.then(traceLink);
  } else {
    if (preLinkReturn === false) return;// skip link
    traceLink();
  }

  function traceLink() {
    if (!linker.routeEl) return; // no x-view , no route link 
    route.lastLinker = link({
      el: linker.routeEl,
      model: route.model,
      methods: route.methods,
    });
    if (isFunction(route.postLink)) {
      route.postLink.call(route, route.lastLinker);
    }
  }
}