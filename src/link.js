
// 2016-11-24 reserved, no more update
function link(el, data) {
	'use strict';
	if (!el || !data) throw Error('el and data are required!');
	if (!isObject(data)) throw Error('data must be object');
	var model = data,
		bindings = [], // store bindings
		watchMap = Object.create(null), // stores watch prop & watchfns mapping
		//regex
		interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
		watchRegex = /^\$?\w+(\.?\w+)*$/,
		directives = ['x-bind', 'x-model', 'x-repeat', 'x-show', 'x-hide'],
		allWatches = []; // store all model watches , for expr

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

	function isWatch(attr) {
		return watchRegex.test(attr);
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

	WatchedArray.prototype.getArray = function () {
		return this.arr.slice(0);
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

	function evalExpr(binding) {
		var expr = binding.expr;
		each(binding.prop, function (prop) {
			var propValue = getWatchValue(prop);
			if (typeof propValue === 'string') {
				propValue = ["'", propValue, "'"].join('');
			}
			if (prop[0] !== '$') {
				expr = expr.replace(new RegExp(prop, 'g'), propValue);
			}
			else {
				// special for array $item link
				expr = expr.replace(new RegExp('\\' + prop, 'g'), propValue);
			}

		});
		return $eval(expr);
	}

	function Binding(el, prop, directive, tpl) {
		this.el = el;
		this.prop = prop; // string, or string array for interpilation expr.
		this.directive = directive;
		this.tpl = tpl;
	}

	Binding.create = function (el, prop, directive, tpl) {
    /**
     * prop could be string and array
     * array: interpilation and expr
     * array+interpilation: tpl
     * array+expr: expr
     *  */
		return new Binding(el, prop, directive, tpl);
	}

  /**
   * 1. get directives and build binding context info.
   * 2. when it's x-model , add form ui value change listener for 2 two-way binding.
   * 3. add watch fn.
   *
   * returns directives array found in el
   *  */
	function compileBinding(el) {
		var attrValue, binding, foundDirectives = [];
		if (el.getAttribute) {
			each(directives, function (directive) {
				if (attrValue = el.getAttribute(directive)) {
					if (isWatch(attrValue)) {
						foundDirectives.push(directive);
						binding = Binding.create(el, attrValue, directive);
						bindings.push(binding);
						addWatchFn(binding);
						if (directive === 'x-model') {
							linkUIListener(binding);
						}
					}
					else {
						// expr
						var exprWatches = [];
						each(allWatches, function (watch) {
							if (attrValue.indexOf(watch) > -1) {
								exprWatches.push(watch);
							}
						});

						foundDirectives.push(directive);
						binding = Binding.create(el, exprWatches, directive);
						binding.expr = attrValue;
						bindings.push(binding);
						addWatchFn(binding);

					}
				}
			});
		} else if (el.nodeType === 3) {
			// text node , and it may contains several interpolation expr
			foundDirectives.push('x-bind');
			attrValue = getInterpolationWatch(el.textContent)
			if (attrValue.length > 0) {
				binding = Binding.create(el, attrValue, 'x-bind', el.textContent);
				bindings.push(binding);
				addWatchFn(binding);
			}
		}

		return foundDirectives;
	}

	function addWatchFn(binding) {
		// check binding prop, if string , simple bind or model, if array it's text interpilation
		// simple watch
		if (isArray(binding.prop)) {
			// every prop watch need notifying the binding change
			each(binding.prop, function (prop) {
				if (!watchMap[prop]) {
					watchMap[prop] = [];
				}
				watchMap[prop].push(uiRenderFnBuilder(binding));
			});
		}
		else {
			if (!watchMap[binding.prop]) {
				watchMap[binding.prop] = [];
			}
			watchMap[binding.prop].push(uiRenderFnBuilder(binding));
		}
	}

	function linkUIListener(binding) {
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
    /**
     * 1. case x-repeat origin , compile it but skip childNodes compiling.
     * 2. case x-repeat clone , skip compiling , but go on compiling its childNodes.
     *
     *  */
		var foundDirectives;
		if (!el.$$child) {
			foundDirectives = compileBinding(el);
			if (foundDirectives.indexOf('x-repeat') > -1) {
				console.log('this is x-repeat, stop childNodes compile');
				return;
			}
		}
		else {
			console.log('this is a clone x-repeat, skip compile');
		}

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
				if (binding.tpl) {
					binding.el.textContent = evalInterpolation(binding);
				} else if (binding.expr) {
					var exprVal = evalExpr(binding);
					if (binding.directive === 'x-show') {
						showHideHanlder(binding, exprVal);
					}
				}

			}
			else if (binding.directive === 'x-repeat') {
				// repeat can't be nested
				// repeat item will construct a new linker object
				repeatHanlder(binding);
			}
		}
	}

	function $eval(expr) {
		var fn = new Function('return ' + expr + ';');
		try {
			return fn.call();
		} catch (ex) {
			//some invalid expr;
		}
	}

	function showHideHanlder(binding, isShow) {
		var el = binding.el;
		if (isShow) {
			if (el.className.indexOf('x-hide') > -1) {
				el.className = el.className.replace(/x-hide/g, '');
			}
		}
		else {
			if (el.className.indexOf('x-hide') === -1) {
				el.className = el.className + ' x-hide';
			}
		}

	}


	function repeatHanlder(binding) {
		var warr = getWatchValue(binding.prop),
			arr = warr && warr.arr,
			el = binding.el;

		if (el) {
			binding.originEl = binding.originEl || el.cloneNode(true);
			binding.comment = document.createComment('repeat end for ' + binding.prop);
			el.parentNode.insertBefore(binding.comment, el);
			el.remove();
			delete binding.el;
		}

		var lastLinks = binding.lastLinks || [];

		//unlink repeat item
		if (lastLinks.length > 0) {
			each(lastLinks, function (link) {
				link.unlink();
			});

			lastLinks.length = 0;
			lastLinks = [];
		}

		if (isArray(arr)) {
			each(arr, function (itemData) {
				var cloneEl = binding.originEl.cloneNode(true);
				cloneEl.$$child = true;
				// lastClonedNodes.push(cloneEl);
				lastLinks.push(link(cloneEl, { $item: itemData }));
				binding.comment.parentNode.insertBefore(cloneEl, binding.comment);
			});
			binding.lastLinks = lastLinks;
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
		allWatches.push(watch);
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

	// add x-hide style for x-show and x-hide
	function addStyles() {
		if (!document.$$linkStyleLoaded) {
			document.$$linkStyleLoaded = true;
			var style = document.createElement('style');
			style.type = 'text/css';
			style.id = 'linkStyle';
			style.textContent = '.x-hide{display:none !important;}';
			document.head.insertAdjacentElement('afterBegin', style);
		}
	}

	function bootstrap() {
		addStyles();

		watchModel(model);
		compile(el);
		render();
		//todo: remove
		// console.log(bindings);
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
		console.log(model.$item + ' unlinking');
		model = null;
		bindings = null;
		watchMap = null;
		if (el.$$child) {
			// clone
			el.remove();
			el = null;
		}
	}

	// if the model contains array property ,it will be wrapped, this fn get the origin model back
	function unWrapModel(model, dest) {
		dest = dest || {};
		var props = Object.keys(model),
			value;
		each(props, function (prop) {
			value = model[prop];
			if (value instanceof WatchedArray) {
				dest[prop] = value.getArray();
			}
			else if (isObject(value)) {
				dest[prop] = {};
				unWrapModel(value, dest[prop]);
			}
			else {
				dest[prop] = model[prop];
			}
		});
	}

	function getModel() {
		var _model = {};
		unWrapModel(model, _model);
		return _model;
	}


	return {
		setModel: setModel,
		unlink: unlink,
		getModel: getModel,
		$model: model // wrapped model
	};

};

