// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/tagl/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function noop() {}

function tagl(h) {
  function createProxy(tagName) {
    return new Proxy(noop, {
      apply: (_, __, args) => h(tagName, [], ...args),
      get: (_, className) => {
        const classNames = [className];
        const proxy = new Proxy(noop, {
          get(_, className) {
            classNames.push(className);
            return proxy;
          },

          apply(_, ___, args) {
            return h(tagName, classNames, ...args);
          }

        });
        return proxy;
      }
    });
  }

  return new Proxy(component => createProxy(component), {
    get: (components, tagName) => createProxy(components[tagName] || tagName)
  });
}

var _default = tagl;
exports.default = _default;
},{}],"../node_modules/tagl-mithril/lib/index.js":[function(require,module,exports) {
"use strict";

var _tagl = require("tagl");

var _tagl2 = _interopRequireDefault(_tagl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var camelToHyphen = function camelToHyphen(s) {
  return s.replace(/([A-Z])/g, function (g) {
    return "-" + g[0].toLowerCase();
  });
};

var tagl_hyperscript = function tagl_hyperscript(m) {
  return (0, _tagl2.default)(function (tagName, classes) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var cls = classes.map(camelToHyphen).join(".");
    var fullTagName = cls.length ? [tagName, cls].join(".").replace(".$", "#") : tagName;
    return m.apply(undefined, [fullTagName].concat(args));
  });
};

module.exports = tagl_hyperscript;
},{"tagl":"../node_modules/tagl/index.js"}],"../node_modules/mithril/mithril.js":[function(require,module,exports) {
var global = arguments[3];
;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
},{}],"../images/construction-site-build-construction-work-159306.jpeg":[function(require,module,exports) {
module.exports = "https://abulvenz.github.io/baustoff/construction-site-build-construction-work-159306.d0daed4c.jpeg";
},{}],"../images/architect-architecture-build-1109541.jpg":[function(require,module,exports) {
module.exports = "https://abulvenz.github.io/baustoff/architect-architecture-build-1109541.7638d818.jpg";
},{}],"../images/pexels-photo-1109541.jpeg":[function(require,module,exports) {
module.exports = "https://abulvenz.github.io/baustoff/pexels-photo-1109541.36d05f59.jpeg";
},{}],"../images/pexels-photo-277559.jpeg":[function(require,module,exports) {
module.exports = "https://abulvenz.github.io/baustoff/pexels-photo-277559.00fbd892.jpeg";
},{}],"../images/pexels-photo-323780.jpeg":[function(require,module,exports) {
module.exports = "https://abulvenz.github.io/baustoff/pexels-photo-323780.4443f839.jpeg";
},{}],"../images/shutters-caribbean-architecture-door-37827.jpeg":[function(require,module,exports) {
module.exports = "https://abulvenz.github.io/baustoff/shutters-caribbean-architecture-door-37827.676e0e18.jpeg";
},{}],"../images/*.*":[function(require,module,exports) {
module.exports = {
  "construction-site-build-construction-work-159306": {
    "jpeg": require("./construction-site-build-construction-work-159306.jpeg")
  },
  "architect-architecture-build-1109541": {
    "jpg": require("./architect-architecture-build-1109541.jpg")
  },
  "pexels-photo-1109541": {
    "jpeg": require("./pexels-photo-1109541.jpeg")
  },
  "pexels-photo-277559": {
    "jpeg": require("./pexels-photo-277559.jpeg")
  },
  "pexels-photo-323780": {
    "jpeg": require("./pexels-photo-323780.jpeg")
  },
  "shutters-caribbean-architecture-door-37827": {
    "jpeg": require("./shutters-caribbean-architecture-door-37827.jpeg")
  }
};
},{"./construction-site-build-construction-work-159306.jpeg":"../images/construction-site-build-construction-work-159306.jpeg","./architect-architecture-build-1109541.jpg":"../images/architect-architecture-build-1109541.jpg","./pexels-photo-1109541.jpeg":"../images/pexels-photo-1109541.jpeg","./pexels-photo-277559.jpeg":"../images/pexels-photo-277559.jpeg","./pexels-photo-323780.jpeg":"../images/pexels-photo-323780.jpeg","./shutters-caribbean-architecture-door-37827.jpeg":"../images/shutters-caribbean-architecture-door-37827.jpeg"}],"../node_modules/bulma-carousel/dist/js/bulma-carousel.min.js":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.bulmaCarousel=t():e.bulmaCarousel=t()}("undefined"!=typeof self?self:this,function(){return function(n){var i={};function s(e){if(i[e])return i[e].exports;var t=i[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,s),t.l=!0,t.exports}return s.m=n,s.c=i,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),r=n(2),o=function(){function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}();var a="carousel:ready",l="carousel:slide:before",u="carousel:slide:after",h=Symbol("onSwipeStart"),c=Symbol("onSwipeMove"),d=Symbol("onSwipeEnd"),f=!1;try{var s=Object.defineProperty({},"passive",{get:function(){f=!0}});window.addEventListener("testPassive",null,s),window.removeEventListener("testPassive",null,s)}catch(e){}var v=function(e){function s(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(s.__proto__||Object.getPrototypeOf(s)).call(this));if(n.element="string"==typeof e?document.querySelector(e):e,!n.element)throw new Error("An invalid selector or non-DOM node has been provided.");return n._clickEvents=["click"],n.options=Object.assign({},r.a,t),n.element.dataset.autoplay&&(n.options.autoplay=n.element.dataset.autoplay),n.element.dataset.delay&&(n.options.delay=n.element.dataset.delay),n.element.dataset.size&&!n.element.classList.contains("carousel-animate-fade")&&(n.options.size=n.element.dataset.size),n.element.classList.contains("carousel-animate-fade")&&(n.options.size=1),n.forceHiddenNavigation=!1,n[h]=n[h].bind(n),n[c]=n[c].bind(n),n[d]=n[d].bind(n),n.init(),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(s,i["a"]),o(s,[{key:"init",value:function(){this.container=this.element.querySelector(".carousel-container"),this.items=this.element.querySelectorAll(".carousel-item"),this.currentItem={element:this.element,node:this.element.querySelector(".carousel-item.is-active"),pos:-1},this.currentItem.pos=this.currentItem.node?Array.from(this.items).indexOf(this.currentItem.node):-1,this.currentItem.node||(this.currentItem.node=this.items[0],this.currentItem.node.classList.add("is-active"),this.currentItem.pos=0),this.forceHiddenNavigation=this.items.length<=1;var e=this.element.querySelectorAll("img");[].forEach.call(e,function(e){e.setAttribute("draggable",!1)}),this._resize(),this._setOrder(),this._initNavigation(),this._bindEvents(),this.options.autoplay&&this._autoPlay(this.options.delay),this.emit(a,this.currentItem)}},{key:"_resize",value:function(){var t=this,e=window.getComputedStyle(this.element),n=parseInt(e.getPropertyValue("width"),10);if(1<this.options.size&&(this.options.size>=Array.from(this.items).length?this.offset=0:this.offset=n/this.options.size,this.container.style.left=0-this.offset+"px",this.container.style.transform="translateX("+this.offset+"px)",[].forEach.call(this.items,function(e){e.style.flexBasis=t.offset+"px"})),this.element.classList.contains("carousel-animate-fade")&&this.items.length){var i=this.items[0].querySelector("img"),s=1;i.naturalWidth?(s=n/i.naturalWidth,this.container.style.height=i.naturalHeight*s+"px"):i.onload=function(){s=n/i.naturalWidth,t.container.style.height=i.naturalHeight*s+"px"}}}},{key:"_bindEvents",value:function(){var t=this;this.previousControl&&this._clickEvents.forEach(function(e){t.previousControl.addEventListener(e,function(e){f||e.preventDefault(),t._autoPlayInterval&&(clearInterval(t._autoPlayInterval),t._autoPlay(t.optionsdelay)),t._slide("previous")},!!f&&{passive:!0})}),this.nextControl&&this._clickEvents.forEach(function(e){t.nextControl.addEventListener(e,function(e){f||e.preventDefault(),t._autoPlayInterval&&(clearInterval(t._autoPlayInterval),t._autoPlay(t.options.delay)),t._slide("next")},!!f&&{passive:!0})}),this.element.addEventListener("touchstart",this[h],!!f&&{passive:!0}),this.element.addEventListener("mousedown",this[h],!!f&&{passive:!0}),this.element.addEventListener("touchmove",this[c],!!f&&{passive:!0}),this.element.addEventListener("mousemove",this[c],!!f&&{passive:!0}),this.element.addEventListener("touchend",this[d],!!f&&{passive:!0}),this.element.addEventListener("mouseup",this[d],!!f&&{passive:!0})}},{key:"destroy",value:function(){this.element.removeEventListener("touchstart",this[h],!!f&&{passive:!0}),this.element.removeEventListener("mousedown",this[h],!!f&&{passive:!0}),this.element.removeEventListener("touchmove",this[c],!!f&&{passive:!0}),this.element.removeEventListener("mousemove",this[c],!!f&&{passive:!0}),this.element.removeEventListener("touchend",this[d],!!f&&{passive:!0}),this.element.removeEventListener("mouseup",this[d],!!f&&{passive:!0})}},{key:h,value:function(e){f||e.preventDefault(),e="changedTouches"in(e=e||window.event)?e.changedTouches[0]:e,this._touch={start:{time:(new Date).getTime(),x:e.pageX,y:e.pageY},dist:{x:0,y:0}}}},{key:c,value:function(e){f||e.preventDefault()}},{key:d,value:function(e){f||e.preventDefault(),e="changedTouches"in(e=e||window.event)?e.changedTouches[0]:e,this._touch.dist={x:e.pageX-this._touch.start.x,y:e.pageY-this._touch.start.y},this._handleGesture()}},{key:"_handleGesture",value:function(){(new Date).getTime()-this._touch.start.time<=this.options.allowedTime&&Math.abs(this._touch.dist.x)>=this.options.threshold&&Math.abs(this._touch.dist.y)<=this.options.restraint&&(this._touch.dist.x<0?this._slide("next"):this._slide("previous"))}},{key:"_initNavigation",value:function(){this.previousControl=this.element.querySelector(".carousel-nav-left"),this.nextControl=this.element.querySelector(".carousel-nav-right"),(this.items.length<=1||this.forceHiddenNavigation)&&(this.container&&(this.container.style.left="0"),this.previousControl&&(this.previousControl.style.display="none"),this.nextControl&&(this.nextControl.style.display="none"))}},{key:"_setOrder",value:function(){this.currentItem.node.style.order="1",this.currentItem.node.style.zIndex="1";var e,t=this.currentItem.node,n=void 0,i=void 0;for(n=i=2,e=Array.from(this.items).length;2<=e?i<=e:e<=i;n=2<=e?++i:--i)(t=this._next(t)).style.order=""+n%Array.from(this.items).length,t.style.zIndex="0"}},{key:"_next",value:function(e){return e.nextElementSibling?e.nextElementSibling:this.items[0]}},{key:"_previous",value:function(e){return e.previousElementSibling?e.previousElementSibling:this.items[this.items.length-1]}},{key:"_slide",value:function(){var e=this,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"next";this.items.length&&(this.oldItemNode=this.currentItem.node,this.emit(l,this.currentItem),"previous"===t?(this.currentItem.node=this._previous(this.currentItem.node),this.element.classList.contains("carousel-animate-fade")||(this.element.classList.add("is-reversing"),this.container.style.transform="translateX("+-Math.abs(this.offset)+"px)")):(this.currentItem.node=this._next(this.currentItem.node),this.element.classList.remove("is-reversing"),this.container.style.transform="translateX("+Math.abs(this.offset)+"px)"),this.currentItem.node.classList.add("is-active"),this.oldItemNode.classList.remove("is-active"),this.element.classList.remove("carousel-animated"),setTimeout(function(){e.element.classList.add("carousel-animated")},50),this._setOrder(),this.emit(u,this.currentItem))}},{key:"_autoPlay",value:function(){var e=this,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:5e3;this._autoPlayInterval=setInterval(function(){e._slide("next")},t)}}],[{key:"attach",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:".carousel, .hero-carousel",t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},n=new Array,i=document.querySelectorAll(e);return[].forEach.call(i,function(e){setTimeout(function(){n.push(new s(e,t))},100)}),n}}]),s}();t.default=v},function(e,t,n){"use strict";var i=function(){function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}();var s=function(){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this._listeners=new Map(e),this._middlewares=new Map}return i(t,[{key:"listenerCount",value:function(e){return this._listeners.has(e)?this._listeners.get(e).length:0}},{key:"removeListeners",value:function(){var t=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=1<arguments.length&&void 0!==arguments[1]&&arguments[1];null!==e?Array.isArray(e)?name.forEach(function(e){return t.removeListeners(e,n)}):(this._listeners.delete(e),n&&this.removeMiddleware(e)):this._listeners=new Map}},{key:"middleware",value:function(e,t){var n=this;Array.isArray(e)?name.forEach(function(e){return n.middleware(e,t)}):(Array.isArray(this._middlewares.get(e))||this._middlewares.set(e,[]),this._middlewares.get(e).push(t))}},{key:"removeMiddleware",value:function(){var t=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;null!==e?Array.isArray(e)?name.forEach(function(e){return t.removeMiddleware(e)}):this._middlewares.delete(e):this._middlewares=new Map}},{key:"on",value:function(e,t){var n=this,i=2<arguments.length&&void 0!==arguments[2]&&arguments[2];if(Array.isArray(e))e.forEach(function(e){return n.on(e,t)});else{var s=(e=e.toString()).split(/,|, | /);1<s.length?s.forEach(function(e){return n.on(e,t)}):(Array.isArray(this._listeners.get(e))||this._listeners.set(e,[]),this._listeners.get(e).push({once:i,callback:t}))}}},{key:"once",value:function(e,t){this.on(e,t,!0)}},{key:"emit",value:function(n,i){var s=this,r=2<arguments.length&&void 0!==arguments[2]&&arguments[2];n=n.toString();var o=this._listeners.get(n),a=null,l=0,u=r;if(Array.isArray(o))for(o.forEach(function(e,t){r||(a=s._middlewares.get(n),Array.isArray(a)?(a.forEach(function(e){e(i,function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;null!==e&&(i=e),l++},n)}),l>=a.length&&(u=!0)):u=!0),u&&(e.once&&(o[t]=null),e.callback(i))});-1!==o.indexOf(null);)o.splice(o.indexOf(null),1)}}]),t}();t.a=s},function(e,t,n){"use strict";t.a={size:1,autoplay:!1,delay:5e3,threshold:50,restraint:100,allowedTime:500}}]).default});
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _taglMithril = _interopRequireDefault(require("tagl-mithril"));

var _mithril = _interopRequireDefault(require("mithril"));

var _2 = _interopRequireDefault(require("../images/*.*"));

var _bulmaCarousel = _interopRequireDefault(require("bulma-carousel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var range = function range(a, b) {
  var r = [];

  for (var _i = a; _i < b; _i++) {
    r.push(_i);
  }

  return r;
};

var images_mapped = Object.keys(_2.default).map(function (key) {
  return Object.keys(_2.default[key]).map(function (key2) {
    return _defineProperty({}, key + "." + key2, _2.default[key][key2]);
  });
}).reduce(function (a, b) {
  return a.concat(b);
}).reduce(function (a, b) {
  return Object.assign(a, b);
});

var _tagl_hyperscript = (0, _taglMithril.default)(_mithril.default),
    div = _tagl_hyperscript.div,
    label = _tagl_hyperscript.label,
    section = _tagl_hyperscript.section,
    nav = _tagl_hyperscript.nav,
    footer = _tagl_hyperscript.footer,
    a = _tagl_hyperscript.a,
    p = _tagl_hyperscript.p,
    strong = _tagl_hyperscript.strong,
    img = _tagl_hyperscript.img,
    h1 = _tagl_hyperscript.h1,
    h2 = _tagl_hyperscript.h2,
    h3 = _tagl_hyperscript.h3,
    h4 = _tagl_hyperscript.h4,
    h5 = _tagl_hyperscript.h5,
    h6 = _tagl_hyperscript.h6,
    span = _tagl_hyperscript.span,
    input = _tagl_hyperscript.input,
    i = _tagl_hyperscript.i,
    ul = _tagl_hyperscript.ul,
    li = _tagl_hyperscript.li,
    table = _tagl_hyperscript.table,
    thead = _tagl_hyperscript.thead,
    tfoot = _tagl_hyperscript.tfoot,
    tbody = _tagl_hyperscript.tbody,
    tr = _tagl_hyperscript.tr,
    th = _tagl_hyperscript.th,
    td = _tagl_hyperscript.td,
    abbr = _tagl_hyperscript.abbr;

var ExamplePage =
/*#__PURE__*/
function () {
  function ExamplePage() {
    _classCallCheck(this, ExamplePage);
  }

  _createClass(ExamplePage, [{
    key: "view",
    value: function view(vnode) {
      return section.section.fade(h1.title("Example"));
    }
  }]);

  return ExamplePage;
}();

var Carousel =
/*#__PURE__*/
function () {
  function Carousel() {
    _classCallCheck(this, Carousel);
  }

  _createClass(Carousel, [{
    key: "oncreate",
    value: function oncreate(vnode) {
      this.images = Object.keys(images_mapped);
      this.active = 0;
      this.bc = new _bulmaCarousel.default(vnode.dom, {
        autoplay: true
      });
    }
  }, {
    key: "view",
    value: function view(vnode) {
      var _this = this;

      return div.carousel.carouselAnimated.carouselAnimateSlide(div.carouselContainer(Object.keys(images_mapped).map(function (img_src, idx) {
        return div.carouselItem.hasBackground[idx === _this.active ? "is-active" : ""](img.isBackground({
          width: "640",
          height: 480,
          src: images_mapped[img_src]
        }));
      })), div.carouselNavigation.isOverlay(div.carouselNavLeft(span.mdi.mdiChevronLeft.isLarge())), div.carouselNavigation.isOverlay(div.carouselNavRight(span.mdi.mdiChevronRight())));
    }
  }]);

  return Carousel;
}();

var Home =
/*#__PURE__*/
function () {
  function Home() {
    _classCallCheck(this, Home);
  }

  _createClass(Home, [{
    key: "view",
    value: function view(vnode) {
      return section.section.fade(div.container(h1.title("Willkommen"), p.level.text("Wir freuen uns, Ihnen hier Informationen zum\n                \xF6kologischen Bauen, Sanieren und Umbauen zur\n                Verf\xFCgung zu stellen. \n            "), (0, _mithril.default)(Carousel, {
        images: images_mapped
      }), p.level.text("Bitte st\xF6bern Sie und z\xF6gern nicht uns auch\n            pers\xF6nlich anzusprechen.")));
    }
  }]);

  return Home;
}();

var baustoffService = function baustoffService() {
  var cache = [{
    name: "Beton",
    greenity: 7.5,
    toxicality: -3,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Tragwerk"]
  }, {
    name: "Glaswolle",
    greenity: 2.5,
    toxicality: 8,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Dämmstoff"]
  }, {
    name: "Reed",
    greenity: 4.5,
    toxicality: 3,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Dämmstoff"]
  }, {
    name: "Rheinsand",
    greenity: 6.5,
    toxicality: 3,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Dämmstoff"]
  }, {
    name: "Beton 2",
    greenity: 7.5,
    toxicality: -3,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Tragwerk"]
  }, {
    name: "Glaswolle 2",
    greenity: 2.5,
    toxicality: 8,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Dämmstoff"]
  }, {
    name: "Reed 2",
    greenity: 4.5,
    toxicality: 3,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Dämmstoff"]
  }, {
    name: "Rheinsand 2",
    greenity: 6.5,
    toxicality: 3,
    priceRange: {
      min: 15,
      avg: 16,
      max: 18,
      currency: "EUR"
    },
    categories: ["Dämmstoff"]
  }];
  range(0, 1000).forEach(function (ii) {
    return cache.push({
      name: "Rheinsand " + ii,
      greenity: 10 * Math.random(),
      toxicality: 10 * Math.random(),
      priceRange: {
        min: Math.round(15 * 10 * Math.random()),
        avg: 16,
        max: Math.round(18 * 10 * Math.random()),
        currency: "EUR"
      },
      categories: ["Dämmstoff"]
    });
  }); //    JSON.parse(localStorage.getItem("baustoffe"));

  return {
    write: function write() {
      localStorage.setItem(JSON.stringify(cache));
    },
    load: function load() {
      _mithril.default.request({
        url: "/api/baustoffe"
      }).then(function (data) {
        cache = data;
      });
    },
    list: function list() {
      return cache;
    }
  };
};

var baustoffe = baustoffService();
console.log(baustoffe.list());

var PaginatedList =
/*#__PURE__*/
function () {
  function PaginatedList() {
    _classCallCheck(this, PaginatedList);
  }

  _createClass(PaginatedList, [{
    key: "view",
    value: function view(vnode) {
      var _this2 = this;

      var list = vnode.attrs.list || [];
      var itemsPerPage = vnode.attrs.itemsPerPage || this.itemsPerPage || 10;
      var l = list.length;
      var showEllipses = l > 5;
      this.active = this.active || 0;
      var pages = Math.round(l / itemsPerPage);
      console.log(this.active);

      vnode.attrs.filter.fun = function (e, idx) {
        return idx >= _this2.active * itemsPerPage && idx < (_this2.active + 1) * itemsPerPage;
      };

      return div.columns(div.column.isTwoThirds(nav.pagination.isSmall.isRounded.isCentered(a.paginationPrevious({
        onclick: function onclick() {
          return _this2.active = _this2.active - 1 + (_this2.active === 0 ? pages : 0);
        }
      }, "Zurück"), a.paginationNext({
        onclick: function onclick() {
          return _this2.active = _this2.active + 1 - (_this2.active === pages - 1 ? pages : 0);
        }
      }, "Weiter"), ul.paginationList(range(0, pages).filter(function (ii) {
        if (ii === 0 || ii === pages - 1) return true;
        if (Math.abs(ii - _this2.active) <= 2) return true;
        return false;
      }).map(function (page) {
        return [-page + _this2.active === 2 && showEllipses && page !== 0 ? li(span.paginationEllipsis(_mithril.default.trust("&hellip;"))) : null, li(a.paginationLink[page === _this2.active ? "is-current" : ""]({
          onclick: function onclick() {
            return _this2.active = page;
          }
        }, page + 1)), page - _this2.active === 2 && showEllipses && page !== pages - 1 ? li(span.paginationEllipsis(_mithril.default.trust("&hellip;"))) : null];
      })))), div.column(div.control.isCentered(label.radio(input({
        type: "radio",
        name: "itemsperpage",
        onclick: function onclick() {
          _this2.itemsPerPage = 5;

          _mithril.default.redraw();
        }
      }), 5), label.radio(input({
        type: "radio",
        name: "itemsperpage",
        onclick: function onclick() {
          _this2.itemsPerPage = 15;

          _mithril.default.redraw();
        }
      }), 15), label.radio(input({
        type: "radio",
        name: "itemsperpage",
        onclick: function onclick() {
          _this2.itemsPerPage = 50;

          _mithril.default.redraw();
        }
      }), 50))));
    }
  }]);

  return PaginatedList;
}();

var Greenity =
/*#__PURE__*/
function () {
  function Greenity() {
    _classCallCheck(this, Greenity);
  }

  _createClass(Greenity, [{
    key: "view",
    value: function view(vnode) {
      var g = vnode.attrs.greenity;

      var colorClass = function colorClass() {
        return g < 3 ? "has-text-danger" : g < 5 ? "has-text-warning" : g < 7 ? "has-text-link" : "has-text-success";
      };

      return p({}, range(0, g).map(function (_) {
        return i.mdi.mdiLeaf[colorClass()]();
      }));
    }
  }]);

  return Greenity;
}();

var Toxicality =
/*#__PURE__*/
function () {
  function Toxicality() {
    _classCallCheck(this, Toxicality);
  }

  _createClass(Toxicality, [{
    key: "view",
    value: function view(vnode) {
      var g = vnode.attrs.toxicality;

      var colorClass = function colorClass() {
        return g > 7 ? "has-text-danger" : g > 5 ? "has-text-warning" : g > 3 ? "has-text-link" : "has-text-success";
      };

      return p({}, range(0, g).map(function (_) {
        return i.mdi.mdiSkullCrossbones[colorClass()]();
      }));
    }
  }]);

  return Toxicality;
}();

var Search =
/*#__PURE__*/
function () {
  function Search(vnode) {
    _classCallCheck(this, Search);

    this.search = "";
    this.paginationFilter = {
      fun: function fun() {
        return true;
      }
    };
  }

  _createClass(Search, [{
    key: "view",
    value: function view(vnode) {
      var _this3 = this;

      var filteredList = baustoffe.list().filter(function (bs) {
        return _this3.search === "" || bs.name.toLowerCase().indexOf(_this3.search.toLowerCase()) >= 0;
      });
      return section.section.fade(div.container(h1.title(span.mdi.mdiDatabaseSearch(), _mithril.default.trust("&nbsp;"), "Suche nach Baustoffen"), p.control.hasIconsLeft(input.input({
        value: this.search,
        oninput: _mithril.default.withAttr("value", function (v) {
          return _this3.search = v;
        }),
        type: "text",
        placeholder: "Suchwort"
      }), span.icon.isLeft(i.mdi.mdiMagnify())), p.text(""), table.table.isFullwidth.isStriped(thead(tr(th("Typ"), th(abbr({
        title: "Grünheit ;-)"
      }, span.mdi.mdiLeaf())), th(abbr({
        title: "Tödlichkeit ;-("
      }, span.mdi.mdiSkull())), th(abbr({
        title: "Tödlichkeit ;-("
      }, span.mdi.mdiCurrencyEur())))), tbody(filteredList.filter(this.paginationFilter.fun).map(function (bs) {
        return tr(td(bs.name), td((0, _mithril.default)(Greenity, {
          greenity: bs.greenity
        })), td((0, _mithril.default)(Toxicality, {
          toxicality: bs.toxicality
        })), td(bs.priceRange.min + " - " + bs.priceRange.max));
      }))), (0, _mithril.default)(PaginatedList, {
        list: filteredList,
        filter: this.paginationFilter
      })));
    }
  }]);

  return Search;
}();

var links = [{
  link: "/",
  text: [span.mdi.mdiLeaf(), _mithril.default.trust("&nbsp;"), "Baustoff"],
  component: Home
}, {
  link: "/suche",
  text: [span.mdi.mdiDatabaseSearch(), _mithril.default.trust("&nbsp;"), "Suche"],
  component: Search
}, {
  link: "/meine",
  text: [span.mdi.mdiAccountStar(), _mithril.default.trust("&nbsp;"), "Meine Baustoffe"],
  component: ExamplePage
}];

var Navbar =
/*#__PURE__*/
function () {
  function Navbar() {
    _classCallCheck(this, Navbar);
  }

  _createClass(Navbar, [{
    key: "view",
    value: function view(vnode) {
      return nav.navbar.isInfo(div.navbarBrand(links.map(function (link) {
        return a.navbarItem({
          href: "#!" + link.link
        }, link.text);
      })));
    }
  }]);

  return Navbar;
}();

var Router =
/*#__PURE__*/
function () {
  function Router() {
    _classCallCheck(this, Router);
  }

  _createClass(Router, [{
    key: "oncreate",
    value: function oncreate(vnode) {
      _mithril.default.route(vnode.dom, "/", links.reduce(function (acc, _ref2) {
        var link = _ref2.link,
            component = _ref2.component;
        acc[link] = component;
        return acc;
      }, {}));
    }
  }, {
    key: "view",
    value: function view(vnode) {
      return (0, _mithril.default)("");
    }
  }]);

  return Router;
}();

var Footer =
/*#__PURE__*/
function () {
  function Footer() {
    _classCallCheck(this, Footer);
  }

  _createClass(Footer, [{
    key: "view",
    value: function view(vnode) {
      return footer.footer(div.content.hasTextCentered(p(strong("Baustoff"), " by ", a({
        href: "http://eismaenners.de"
      }, "Andreas Eismann"))));
    }
  }]);

  return Footer;
}();

var Layout =
/*#__PURE__*/
function () {
  function Layout() {
    _classCallCheck(this, Layout);
  }

  _createClass(Layout, [{
    key: "view",
    value: function view(vnode) {
      return [(0, _mithril.default)(Navbar), (0, _mithril.default)(Router), (0, _mithril.default)(Footer)];
    }
  }]);

  return Layout;
}();

_mithril.default.mount(document.getElementById("app"), {
  view: function view(vnode) {
    return (0, _mithril.default)(Layout);
  }
});
},{"tagl-mithril":"../node_modules/tagl-mithril/lib/index.js","mithril":"../node_modules/mithril/mithril.js","../images/*.*":"../images/*.*","bulma-carousel":"../node_modules/bulma-carousel/dist/js/bulma-carousel.min.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34339" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=https://abulvenz.github.io/baustoff/main.1f19ae8e.map