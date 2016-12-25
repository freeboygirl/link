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
  var config = [{
    path: '',
    model: {},
    actions:{},
    template: '',
    templateUrl: '',
  }];
*/
function route(linker, config, defaultPath) {
  addEventListenerHanlder(window, 'hashchange', renderRouter, linker.eventStore);
  var hs = hash();
  if (hs) {
    renderRouter();
  }
  else {
    replaceHash(defaultPath);
  }
  function renderRouter() {
    var cf = filter(config, function (c) { return c.path === hash() });
    if (!cf) {
      replaceHash(defaultPath);
      return;
    }
    if (!cf.model || !isObject(cf.model)) {
      cf.model = {};
    }
    var template = trim(cf.template);
    if (!template) {
      if (cf.templateUrl) {
        loadTemplate(cf.templateUrl, function (tpl) {
          linkRoute(linker, cf, tpl);
        });
      }
    }
  }
}

//todo: add prelink and postlink hooks
function linkRoute(linker, cf, tpl) {
  linker.routeEl.innerHTML = tpl;
  if (cf.lastLinker) {
    cf.lastLinker.unlink(); // destroy link
  }
  cf.lastLinker = link(linker.routeEl, cf.model, cf.actions);
}