
function link(el, data) {
  'use strict';
  if (!el || !data) throw Error('el and data are required!');
  if (!isObject(data)) throw Error('data must be object');
  var model = data,
    bindings = [], // store bindings
    watchMap = Object.create(null), // stores watch prop & watchfns mapping 
    //regex 
    interpolationRegex = /\{\{(\w+)\}\}/g,
    directives = ['x-bind', 'x-model'];

  function each(arr, fn) {
    var len = arr.length, i = -1;
    while (++i < len) {
      fn.call(arr, arr[i], i, arr);
    }
  }

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
    var len = binding.prop.length,
      prop,
      el = binding.el,
      tpl = binding.tpl;
    while (len--) {
      prop = binding.prop[len];
      tpl = tpl.replace(new RegExp('{{' + prop + '}}', 'g'), getWatchValue(prop));
    }

    return tpl;
  }

  function Binding(el, prop, action, tpl) {
    this.el = el;
    this.prop = prop; // string, or string array for interpilation expr.
    this.action = action;
    this.tpl = tpl;
  }

  Binding.get = function (el, prop, action, tpl) {
    return new Binding(el, prop, action, tpl);
  }

  function getBinding(el) {
    var prop, binding;
    if (el.getAttribute) {
      each(directives, function (directive) {
        if (prop = el.getAttribute(directive)) {
          binding = Binding.get(el, prop, directive);
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
        binding = Binding.get(el, prop, 'x-bind', el.textContent);
        bindings.push(binding);
        addWatchFn(binding);
      }
    }
  }

  function addWatchFn(binding) {
    // check binding prop, if string , simple bind or model, if array it's text interpilation
    if (typeof binding.prop === 'string') {
      if (!watchMap[binding.prop]) {
        watchMap[binding.prop] = [];
      }
      watchMap[binding.prop].push(renderBuilder(binding));
    }
    else if (typeof binding.prop === 'object' && binding.prop.length) {
      // every prop watch need notifying the binding change
      var len = binding.prop.length;
      while (len--) {
        if (!watchMap[binding.prop[len]]) {
          watchMap[binding.prop[len]] = [];
        }
        watchMap[binding.prop[len]].push(renderBuilder(binding));
      }
    }
  }

  function bindModelListener(binding) {
    var el = binding.el, directive = binding.action;
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
      compile(node)
    });
  }

  function getWatchValue(watch) {
    var val = model;
    if (watch) {
      watch = watch.split('.');
      var len = watch.length;
      for (var i = 0; i < len; i++) {
        val = val[watch[i]]
      }
    }

    return val;
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

  function renderBuilder(binding) {
    //return ui render fn
    return function () {
      if (binding.action === 'x-bind' && !(binding.prop instanceof Array)) {
        binding.el.innerText = getWatchValue(binding.prop);
      }
      else if (binding.action === 'x-model') {
        binding.el.value = getWatchValue(binding.prop);
      }
      else if (binding.prop instanceof Array) {
        // text node for interpolation expr 
        binding.el.textContent = evalInterpolation(binding);
      }
    }
  }

  function isObject(obj) {
    return !!obj && typeof obj === 'object'
  }

  function isArray(obj) {
    return !!obj && typeof obj === 'object' && typeof obj.length === 'number';
  }

  function notify(watch) {
    var rendersArray = watchMap[watch],
      len;
    if (rendersArray) {
      len = rendersArray.length;

      while (len--) {
        rendersArray[len].apply();
      }
    }
  }

  function render() {
    for (var watch in watchMap) {
      notify(watch);
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

  WatchedArray.prototype.push = function (item) {
    this.arr.push(item);
    this.notify();
    return this.arr.length;
  }

  WatchedArray.prototype.pop = function () {
    var item = this.arr.pop();
    this.notify();
    return item;
  }

  WatchedArray.prototype.unshift = function (item) {
    this.arr.unshift(item);
    this.notify();
    return this.arr.length;
  }

  WatchedArray.prototype.shift = function () {
    var item = this.arr.shift();
    this.notify();
    return item;
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
    var keys = Object.keys(model),
      len = keys.length,
      prop,
      value;
    while (len--) {
      prop = keys[len];
      value = model[prop];
      if (isObject(value) && !isArray(value)) {
        propStack.push(prop);
        watchModel(value, propStack);
        propStack.pop();
      }
      else {
        defineObserver(model, prop, value, propStack.slice(0), isArray(value));
      }
    }
  }

  function bootstrap() {
    compile(el);
    watchModel(model);
    render();
  };

  bootstrap();

  // public methods
  function updateModel(newModel, reScan) {
    model = newModel;
    if (reScan === true) {
      ar = [];
      compile(el);
    }
    watchModel(model);
    render();
  }


  return {
    updateModel: updateModel
  };

};

