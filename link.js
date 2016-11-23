
function link(el, data) {
  'use strict';
  if (!el || !data) throw Error('el and data are required!');
  if (!isObject(data)) throw Error('data must be object');
  var model = data,
    bindings = [], // store bindings
    watchMap = Object.create(null), // stores watch prop & watchfns mapping 
    //regex 
    interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
    directives = ['x-bind', 'x-model', 'x-repeat'];

  function isObject(obj) {
    return !!obj && typeof obj === 'object'
  }

  function isArray(obj) {
    return !!obj && typeof obj === 'object' && typeof obj.length === 'number';
  }

  function each(arr, fn) {
    var len = arr.length, i = -1;
    while (++i < len) {
      fn.call(arr, arr[i], i, arr);
    }
  }

  // array wrapper for item change notify
  function WatchedArray(watch, arr) {
    this.watch = watch;
    this.arr = arr;
  }

  WatchedArray.prototype = [];

  WatchedArray.prototype.notify = function () {
    notify(this.watch, this.arr);
    console.log(this.watch + ':' + this.arr.toString());
  }

  each(['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'], function (fn) {
    WatchedArray.prototype[fn] = function () {
      var ret = this.arr[fn].apply(this.arr, arguments);
      this.notify();
    }
  });

  function getInterpolationWatch(text) {
    if (text) {
      var ar, resultArr = [];
      while (ar = interpolationRegex.exec(text)) {
        resultArr.push(ar[1]);
      }
    }

    return resultArr;
  }

  function evalInterpolation(binding) {
    var tpl = binding.tpl;
    each(binding.prop, function (prop) {
      if (prop[0] !== '$') {
        tpl = tpl.replace(new RegExp('{{' + prop + '}}', 'g'), getWatchValue(prop));
      }
      else {
        // special for array $item link
        tpl = tpl.replace(new RegExp('{{\\' + prop + '}}', 'g'), getWatchValue(prop));
      }

    });
    return tpl;
  }

  function Binding(el, prop, directive, tpl) {
    this.el = el;
    this.prop = prop; // string, or string array for interpilation expr.
    this.directive = directive;
    this.tpl = tpl;
  }

  Binding.create = function (el, prop, directive, tpl) {
    return new Binding(el, prop, directive, tpl);
  }

  function getBinding(el) {
    var prop, binding, hasParentRepeatDirective = !!el.$$child;
    if (el.getAttribute) {
      each(directives, function (directive) {
        if (prop = el.getAttribute(directive)) {
          binding = Binding.create(el, prop, directive);
          bindings.push(binding);
          addWatchFn(binding);
          if (directive === 'x-model') {
            bindModelListener(binding);
          }
        }
      });
    } else if (el.nodeType === 3) {
      // text node , and it may contains several interpolation expr
      prop = getInterpolationWatch(el.textContent)
      if (prop.length > 0) {
        binding = Binding.create(el, prop, 'x-bind', el.textContent);
        bindings.push(binding);
        addWatchFn(binding);
      }
    }

    return hasParentRepeatDirective;// skip further scan for repeat
  }

  function addWatchFn(binding) {
    // check binding prop, if string , simple bind or model, if array it's text interpilation
    if (typeof binding.prop === 'string') {
      if (!watchMap[binding.prop]) {
        watchMap[binding.prop] = [];
      }
      watchMap[binding.prop].push(uiRenderFnBuilder(binding));
    }
    else if (typeof binding.prop === 'object' && binding.prop.length) {
      // every prop watch need notifying the binding change
      each(binding.prop, function (prop) {
        if (!watchMap[prop]) {
          watchMap[prop] = [];
        }
        watchMap[prop].push(uiRenderFnBuilder(binding));
      });
    }
  }

  function bindModelListener(binding) {
    var el = binding.el, directive = binding.directive;
    if (el.nodeName === 'INPUT') {
      if (el.type === 'text') {
        el.addEventListener('keyup', function () {
          setWatchValue(binding.prop, el.value || '');
        }, false);
      }
      else if (el.type === 'radio') {
        //TODO: handler radio
        el.addEventListener('change', function () {
          setWatchValue(binding.prop, el.value || '');
        }, false);
      }
    }
    else if (el.nodeName === 'SELECT') {
      el.addEventListener('change', function () {
        setWatchValue(binding.prop, el.value || '');
      }, false);
    }
  }

  function compile(el) {
    getBinding(el);
    each(el.childNodes, function (node) {
      compile(node);
    });
  }

  function getWatchValue(watch) {
    try {
      var val = model;
      if (watch) {
        watch = watch.split('.');
        var len = watch.length;
        for (var i = 0; i < len; i++) {
          val = val[watch[i]];
        }
      }

      return val;
    } catch (e) {

    }
  }

  function setWatchValue(watch, value) {
    var val = model;
    if (watch) {
      watch = watch.split('.');
      var len = watch.length;
      if (len === 1) {
        model[watch] = value;
        return;
      }
      for (var i = 0; i < len; i++) {
        val = val[watch[i]]
        if (i === len - 2) {
          val[watch[len - 1]] = value;
          return;
        }
      }
    }
  }

  function uiRenderFnBuilder(binding) {
    //return ui render fn
    return function () {
      if (binding.directive === 'x-bind' && !(binding.prop instanceof Array)) {
        binding.el.innerText = getWatchValue(binding.prop);
      }
      else if (binding.directive === 'x-model') {
        binding.el.value = getWatchValue(binding.prop);
      }
      else if (binding.prop instanceof Array) {
        // text node for interpolation expr 
        binding.el.textContent = evalInterpolation(binding);
      }
      else if (binding.directive === 'x-repeat') {
        // repeat can't be nested
        // repeat item will construct a new linker object
        if (binding.el && binding.el.$$child) return;
        var warr = getWatchValue(binding.prop),
          arr = warr && warr.arr;
        el = binding.el;

        if (el) {
          binding.originEl = binding.originEl || el.cloneNode(true);
          binding.comment = document.createComment('repeat end for ' + binding.prop);
          el.parentNode.insertBefore(binding.comment, el);
          el.remove();
          delete binding.el;
        }

        var lastClonedNodes = binding.lastClonedNodes || [],
          lastLinks = binding.lastLinks || [];

        //unlink repeat item 
        if (lastLinks.length > 0) {
          each(lastLinks, function (link) {
            link.unlink();
          });
        }
        // remove repeat item
        if (lastClonedNodes.length > 0) {
          each(lastClonedNodes, function (nodeToRemove) {
            nodeToRemove.remove();
          });
        }

        if (isArray(arr)) {
          each(arr, function (itemData) {
            var cloneEl = binding.originEl.cloneNode(true);
            cloneEl.$$child = true;
            lastClonedNodes.push(cloneEl);
            lastLinks.push(link(cloneEl, { $item: itemData }));
            binding.comment.parentNode.insertBefore(cloneEl, binding.comment);
          });
          binding.lastClonedNodes = lastClonedNodes;
          binding.lastLinks = lastLinks;
        }
      }
    }
  }

  function notify(watch) {
    var rendersArray = watchMap[watch],
      len;
    if (rendersArray) {
      each(rendersArray, function (render) {
        render.apply();
      });
    }
  }

  function render() {
    for (var watch in watchMap) {
      notify(watch);
    }
  }

  function getWatchByPropStack(prop, propStack) {
    if (propStack) {
      propStack.push(prop);
    }
    else {
      propStack = [prop];
    }

    return propStack.join('.');
  }

  function defineObserver(model, prop, value, propStack, isArray) {
    var watch = getWatchByPropStack(prop, propStack);
    if (!isArray) {
      Object.defineProperty(model, prop, {
        get: function () {
          return value;
        },
        set: function (newVal) {
          if (newVal !== value) {
            value = newVal;
            notify(watch);
          }
        }
      });
    }
    else {
      model[prop] = new WatchedArray(watch, value);
    }
  }

  function watchModel(model, propStack) {
    //object
    propStack = propStack || [];
    var props = Object.keys(model),
      prop,
      value;
    each(props, function (prop) {
      value = model[prop];
      if (isObject(value) && !isArray(value)) {
        propStack.push(prop);
        watchModel(value, propStack);
        propStack.pop();
      }
      else {
        defineObserver(model, prop, value, propStack.slice(0), isArray(value));
      }
    });
  }

  function bootstrap() {
    compile(el);
    watchModel(model);
    render();
  };

  bootstrap();

  // public methods
  // set a new model to bind
  function setModel(newModel, reScan) {
    model = newModel;
    if (reScan === true) {
      ar = [];
      compile(el);
    }
    watchModel(model);
    render();
  }

  // clear the linker object inner states
  function unlink() {
    model = null;
    bindings.length = 0;
    bindings = null;
    watchMap = null;
    el = null;
  }

  // if the model contains array property ,it will be wrapped, this fn get the origin model back
  function getModel() {
    var originModel = {};
    var props = Object.keys(model);
    each(props, function (prop) {
      if (model[prop] instanceof WatchedArray) {
        originModel[prop] = model[prop].arr.slice(0);
      }
      else {
        originModel[prop] = model[prop];
      }
    });

    return originModel;
  }


  return {
    setModel: setModel,
    unlink: unlink,
    getModel: getModel
  };

};

