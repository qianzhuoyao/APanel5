import {
  useFrame,
  useThree
} from "./chunk-NOMVIORJ.js";
import "./chunk-QA3FA25W.js";
import {
  require_jsx_runtime
} from "./chunk-2NVUNDZI.js";
import {
  require_react
} from "./chunk-ECT2SSAV.js";
import {
  Box3,
  DynamicDrawUsage,
  Euler,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  InstancedInterleavedBuffer,
  InstancedMesh,
  InterleavedBufferAttribute,
  Line3,
  MathUtils,
  Matrix4,
  Mesh,
  Object3D,
  Quaternion,
  Scene,
  ShaderLib,
  ShaderMaterial,
  Sphere,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector3,
  Vector4,
  WireframeGeometry
} from "./chunk-WCOX6VFL.js";
import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-DLJ4GP37.js";

// ../../node_modules/.pnpm/events@3.3.0/node_modules/events/events.js
var require_events = __commonJS({
  "../../node_modules/.pnpm/events@3.3.0/node_modules/events/events.js"(exports, module2) {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter2() {
      EventEmitter2.init.call(this);
    }
    module2.exports = EventEmitter2;
    module2.exports.once = once;
    EventEmitter2.EventEmitter = EventEmitter2;
    EventEmitter2.prototype._events = void 0;
    EventEmitter2.prototype._eventsCount = 0;
    EventEmitter2.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter2.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n2) {
      if (typeof n2 !== "number" || n2 < 0 || NumberIsNaN(n2)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n2 + ".");
      }
      this._maxListeners = n2;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter2.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter2.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m2;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m2 = _getMaxListeners(target);
        if (m2 > 0 && existing.length > m2 && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter2.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
    EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter2.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter2.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter2.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter2.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter2.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n2) {
      var copy2 = new Array(n2);
      for (var i = 0; i < n2; ++i)
        copy2[i] = arr[i];
      return copy2;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// browser-external:worker_threads
var require_worker_threads = __commonJS({
  "browser-external:worker_threads"(exports, module2) {
    module2.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "worker_threads" has been externalized for browser compatibility. Cannot access "worker_threads.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// ../../node_modules/.pnpm/@react-three+p2@0.0.6_react-dom@19.2.0_react@19.2.0/node_modules/@react-three/p2/dist/index.js
var import_react = __toESM(require_react());
var import_events = __toESM(require_events());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var atomicNames = ["allowSleep", "angle", "angularDamping", "angularVelocity", "collisionFilterGroup", "collisionFilterMask", "collisionResponse", "fixedRotation", "isTrigger", "linearDamping", "mass", "material", "sleepSpeedLimit", "sleepTimeLimit", "userData"];
var vectorNames = ["position", "velocity"];
var subscriptionNames = [...atomicNames, ...vectorNames, "collisions", "raysData"];
var context = (0, import_react.createContext)({});
var debugContext = (0, import_react.createContext)(null);
function useUpdateWorldPropsEffect(_ref) {
  let {
    axisIndex,
    broadphase,
    gravity,
    iterations,
    tolerance,
    worker
  } = _ref;
  (0, import_react.useEffect)(() => {
    worker.axisIndex = axisIndex;
  }, [axisIndex]);
  (0, import_react.useEffect)(() => {
    worker.broadphase = broadphase;
  }, [broadphase]);
  (0, import_react.useEffect)(() => {
    worker.gravity = gravity;
  }, [gravity]);
  (0, import_react.useEffect)(() => {
    worker.iterations = iterations;
  }, [iterations]);
  (0, import_react.useEffect)(() => {
    worker.tolerance = tolerance;
  }, [tolerance]);
}
var WorkerClass = null;
try {
  WorkerThreads = typeof module !== "undefined" && typeof module.require === "function" && module.require("worker_threads") || typeof __non_webpack_require__ === "function" && __non_webpack_require__("worker_threads") || typeof __require === "function" && require_worker_threads();
  WorkerClass = WorkerThreads.Worker;
} catch (e) {
}
var WorkerThreads;
function decodeBase64$1(base64, enableUnicode) {
  return Buffer.from(base64, "base64").toString(enableUnicode ? "utf16" : "utf8");
}
function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
  var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
  var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
  var source = decodeBase64$1(base64, enableUnicode);
  var start = source.indexOf("\n", 10) + 1;
  var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
  return function WorkerFactory2(options) {
    return new WorkerClass(body, Object.assign({}, options, { eval: true }));
  };
}
function decodeBase64(base64, enableUnicode) {
  var binaryString = atob(base64);
  if (enableUnicode) {
    var binaryView = new Uint8Array(binaryString.length);
    for (var i = 0, n2 = binaryString.length; i < n2; ++i) {
      binaryView[i] = binaryString.charCodeAt(i);
    }
    return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
  }
  return binaryString;
}
function createURL(base64, sourcemapArg, enableUnicodeArg) {
  var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
  var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
  var source = decodeBase64(base64, enableUnicode);
  var start = source.indexOf("\n", 10) + 1;
  var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
  var blob = new Blob([body], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}
function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
  var url;
  return function WorkerFactory2(options) {
    url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
    return new Worker(url, options);
  };
}
var kIsNodeJS = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
function isNodeJS() {
  return kIsNodeJS;
}
function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
  if (isNodeJS()) {
    return createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg);
  }
  return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
}
var WorkerFactory = createBase64WorkerFactory("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIHZhciBwMiA9IHtleHBvcnRzOiB7fX07CgogICAgdmFyIHZlYzIkcSA9IHtleHBvcnRzOiB7fX07CgogICAgLyogZ2xvYmFsIFAyX0FSUkFZX1RZUEUgKi8KCiAgICB2YXIgVXRpbHNfMSA9IFV0aWxzJDc7CiAgICAvKioKICAgICAqIE1pc2MgdXRpbGl0eSBmdW5jdGlvbnMKICAgICAqIEBjbGFzcyBVdGlscwogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKi8KCiAgICBmdW5jdGlvbiBVdGlscyQ3KCkge30KICAgIC8qKgogICAgICogQXBwZW5kIHRoZSB2YWx1ZXMgaW4gYXJyYXkgYiB0byB0aGUgYXJyYXkgYS4gU2VlIDxhIGhyZWY9Imh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTM3NDEyNi9ob3ctdG8tYXBwZW5kLWFuLWFycmF5LXRvLWFuLWV4aXN0aW5nLWphdmFzY3JpcHQtYXJyYXkvMTM3NDEzMSMxMzc0MTMxIj50aGlzPC9hPiBmb3IgYW4gZXhwbGFuYXRpb24uCiAgICAgKiBAbWV0aG9kIGFwcGVuZEFycmF5CiAgICAgKiBAc3RhdGljCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gYQogICAgICogQHBhcmFtICB7QXJyYXl9IGIKICAgICAqLwoKCiAgICBVdGlscyQ3LmFwcGVuZEFycmF5ID0gZnVuY3Rpb24gKGEsIGIpIHsKICAgICAgaWYgKGIubGVuZ3RoIDwgMTUwMDAwKSB7CiAgICAgICAgYS5wdXNoLmFwcGx5KGEsIGIpOwogICAgICB9IGVsc2UgewogICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBiLmxlbmd0aDsgaSAhPT0gbGVuOyArK2kpIHsKICAgICAgICAgIGEucHVzaChiW2ldKTsKICAgICAgICB9CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIEdhcmJhZ2UgZnJlZSBBcnJheS5zcGxpY2UoKS4gRG9lcyBub3QgYWxsb2NhdGUgYSBuZXcgYXJyYXkuCiAgICAgKiBAbWV0aG9kIHNwbGljZQogICAgICogQHN0YXRpYwogICAgICogQHBhcmFtICB7QXJyYXl9IGFycmF5CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGhvd21hbnkKICAgICAqLwoKCiAgICBVdGlscyQ3LnNwbGljZSA9IGZ1bmN0aW9uIChhcnJheSwgaW5kZXgsIGhvd21hbnkpIHsKICAgICAgaG93bWFueSA9IGhvd21hbnkgfHwgMTsKCiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbGVuID0gYXJyYXkubGVuZ3RoIC0gaG93bWFueTsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtpICsgaG93bWFueV07CiAgICAgIH0KCiAgICAgIGFycmF5Lmxlbmd0aCA9IGxlbjsKICAgIH07CiAgICAvKioKICAgICAqIFJlbW92ZSBhbiBlbGVtZW50IGZyb20gYW4gYXJyYXksIGlmIHRoZSBhcnJheSBjb250YWlucyB0aGUgZWxlbWVudC4KICAgICAqIEBtZXRob2QgYXJyYXlSZW1vdmUKICAgICAqIEBzdGF0aWMKICAgICAqIEBwYXJhbSAge0FycmF5fSBhcnJheQogICAgICogQHBhcmFtICB7TnVtYmVyfSBlbGVtZW50CiAgICAgKi8KCgogICAgVXRpbHMkNy5hcnJheVJlbW92ZSA9IGZ1bmN0aW9uIChhcnJheSwgZWxlbWVudCkgewogICAgICB2YXIgaWR4ID0gYXJyYXkuaW5kZXhPZihlbGVtZW50KTsKCiAgICAgIGlmIChpZHggIT09IC0xKSB7CiAgICAgICAgVXRpbHMkNy5zcGxpY2UoYXJyYXksIGlkeCwgMSk7CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIFRoZSBhcnJheSB0eXBlIHRvIHVzZSBmb3IgaW50ZXJuYWwgbnVtZXJpYyBjb21wdXRhdGlvbnMgdGhyb3VnaG91dCB0aGUgbGlicmFyeS4gRmxvYXQzMkFycmF5IGlzIHVzZWQgaWYgaXQgaXMgYXZhaWxhYmxlLCBidXQgZmFsbHMgYmFjayBvbiBBcnJheS4gSWYgeW91IHdhbnQgdG8gc2V0IGFycmF5IHR5cGUgbWFudWFsbHksIGluamVjdCBpdCB2aWEgdGhlIGdsb2JhbCB2YXJpYWJsZSBQMl9BUlJBWV9UWVBFLiBTZWUgZXhhbXBsZSBiZWxvdy4KICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IEFSUkFZX1RZUEUKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgPHNjcmlwdD4KICAgICAqICAgICAgICAgPCEtLSBJbmplY3QgeW91ciBwcmVmZXJyZWQgYXJyYXkgdHlwZSBiZWZvcmUgbG9hZGluZyBwMi5qcyAtLT4KICAgICAqICAgICAgICAgUDJfQVJSQVlfVFlQRSA9IEFycmF5OwogICAgICogICAgIDwvc2NyaXB0PgogICAgICogICAgIDxzY3JpcHQgc3JjPSJwMi5qcyI+PC9zY3JpcHQ+CiAgICAgKi8KCgogICAgaWYgKHR5cGVvZiBQMl9BUlJBWV9UWVBFICE9PSAndW5kZWZpbmVkJykgewogICAgICBVdGlscyQ3LkFSUkFZX1RZUEUgPSBQMl9BUlJBWV9UWVBFOwogICAgfSBlbHNlIGlmICh0eXBlb2YgRmxvYXQzMkFycmF5ICE9PSAndW5kZWZpbmVkJykgewogICAgICBVdGlscyQ3LkFSUkFZX1RZUEUgPSBGbG9hdDMyQXJyYXk7CiAgICB9IGVsc2UgewogICAgICBVdGlscyQ3LkFSUkFZX1RZUEUgPSBBcnJheTsKICAgIH0KICAgIC8qKgogICAgICogRXh0ZW5kIGFuIG9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGFub3RoZXIKICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2QgZXh0ZW5kCiAgICAgKiBAcGFyYW0gIHtvYmplY3R9IGEKICAgICAqIEBwYXJhbSAge29iamVjdH0gYgogICAgICovCgoKICAgIFV0aWxzJDcuZXh0ZW5kID0gZnVuY3Rpb24gKGEsIGIpIHsKICAgICAgZm9yICh2YXIga2V5IGluIGIpIHsKICAgICAgICBhW2tleV0gPSBiW2tleV07CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIFNoYWxsb3cgY2xvbmUgYW4gb2JqZWN0LiBSZXR1cm5zIGEgbmV3IG9iamVjdCBpbnN0YW5jZSB3aXRoIHRoZSBzYW1lIHByb3BlcnRpZXMgYXMgdGhlIGlucHV0IGluc3RhbmNlLgogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBzaGFsbG93Q2xvbmUKICAgICAqIEBwYXJhbSAge29iamVjdH0gb2JqCiAgICAgKi8KCgogICAgVXRpbHMkNy5zaGFsbG93Q2xvbmUgPSBmdW5jdGlvbiAob2JqKSB7CiAgICAgIHZhciBuZXdPYmogPSB7fTsKICAgICAgVXRpbHMkNy5leHRlbmQobmV3T2JqLCBvYmopOwogICAgICByZXR1cm4gbmV3T2JqOwogICAgfTsKICAgIC8qKgogICAgICogRXh0ZW5kIGFuIG9wdGlvbnMgb2JqZWN0IHdpdGggZGVmYXVsdCB2YWx1ZXMuCiAgICAgKiBAZGVwcmVjYXRlZCBOb3QgdXNlZCBpbnRlcm5hbGx5LCB3aWxsIGJlIHJlbW92ZWQuCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIGRlZmF1bHRzCiAgICAgKiBAcGFyYW0gIHtvYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0LiBNYXkgYmUgZmFsc3k6IGluIHRoaXMgY2FzZSwgYSBuZXcgb2JqZWN0IGlzIGNyZWF0ZWQgYW5kIHJldHVybmVkLgogICAgICogQHBhcmFtICB7b2JqZWN0fSBkZWZhdWx0cyBBbiBvYmplY3QgY29udGFpbmluZyBkZWZhdWx0IHZhbHVlcy4KICAgICAqIEByZXR1cm4ge29iamVjdH0gVGhlIG1vZGlmaWVkIG9wdGlvbnMgb2JqZWN0LgogICAgICovCgoKICAgIFV0aWxzJDcuZGVmYXVsdHMgPSBmdW5jdGlvbiAob3B0aW9ucywgZGVmYXVsdHMpIHsKICAgICAgY29uc29sZS53YXJuKCdVdGlscy5kZWZhdWx0cyBpcyBkZXByZWNhdGVkLicpOwogICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsKCiAgICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0cykgewogICAgICAgIGlmICghKGtleSBpbiBvcHRpb25zKSkgewogICAgICAgICAgb3B0aW9uc1trZXldID0gZGVmYXVsdHNba2V5XTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiBvcHRpb25zOwogICAgfTsKCiAgICAvKiBDb3B5cmlnaHQgKGMpIDIwMTMsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi4gQWxsIHJpZ2h0cyByZXNlcnZlZC4KCiAgICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLAogICAgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OgoKICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMKICAgICAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci4KICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsCiAgICAgICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbgogICAgICAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLgoKICAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgIkFTIElTIiBBTkQKICAgIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVECiAgICBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFCiAgICBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUgogICAgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTCiAgICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7CiAgICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04KICAgIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUCiAgICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUwogICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuICovCgogICAgLyoqCiAgICAgKiBUaGUgdmVjMiBvYmplY3QgZnJvbSBnbE1hdHJpeCwgd2l0aCBzb21lIGV4dGVuc2lvbnMgYW5kIHNvbWUgcmVtb3ZlZCBtZXRob2RzLiBTZWUgaHR0cDovL2dsbWF0cml4Lm5ldC4KICAgICAqIEBjbGFzcyB2ZWMyCiAgICAgKi8KICAgIHZhciB2ZWMyJHAgPSB2ZWMyJHEuZXhwb3J0cyA9IHt9OwoKICAgIHZhciBVdGlscyQ2ID0gVXRpbHNfMTsKICAgIC8qKgogICAgICogTWFrZSBhIGNyb3NzIHByb2R1Y3QgYW5kIG9ubHkgcmV0dXJuIHRoZSB6IGNvbXBvbmVudAogICAgICogQG1ldGhvZCBjcm9zc0xlbmd0aAogICAgICogQHN0YXRpYwogICAgICogQHBhcmFtICB7QXJyYXl9IGEKICAgICAqIEBwYXJhbSAge0FycmF5fSBiCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKi8KCgogICAgdmVjMiRwLmNyb3NzTGVuZ3RoID0gZnVuY3Rpb24gKGEsIGIpIHsKICAgICAgcmV0dXJuIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07CiAgICB9OwogICAgLyoqCiAgICAgKiBDcm9zcyBwcm9kdWN0IGJldHdlZW4gYSB2ZWN0b3IgYW5kIHRoZSBaIGNvbXBvbmVudCBvZiBhIHZlY3RvcgogICAgICogQG1ldGhvZCBjcm9zc1ZaCiAgICAgKiBAc3RhdGljCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gb3V0CiAgICAgKiBAcGFyYW0gIHtBcnJheX0gdmVjCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHpjb21wCiAgICAgKiBAcmV0dXJuIHtBcnJheX0KICAgICAqLwoKCiAgICB2ZWMyJHAuY3Jvc3NWWiA9IGZ1bmN0aW9uIChvdXQsIHZlYywgemNvbXApIHsKICAgICAgdmVjMiRwLnJvdGF0ZShvdXQsIHZlYywgLU1hdGguUEkgLyAyKTsgLy8gUm90YXRlIGFjY29yZGluZyB0byB0aGUgcmlnaHQgaGFuZCBydWxlCgogICAgICB2ZWMyJHAuc2NhbGUob3V0LCBvdXQsIHpjb21wKTsgLy8gU2NhbGUgd2l0aCB6CgogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogQ3Jvc3MgcHJvZHVjdCBiZXR3ZWVuIGEgdmVjdG9yIGFuZCB0aGUgWiBjb21wb25lbnQgb2YgYSB2ZWN0b3IKICAgICAqIEBtZXRob2QgY3Jvc3NaVgogICAgICogQHN0YXRpYwogICAgICogQHBhcmFtICB7QXJyYXl9IG91dAogICAgICogQHBhcmFtICB7TnVtYmVyfSB6Y29tcAogICAgICogQHBhcmFtICB7QXJyYXl9IHZlYwogICAgICogQHJldHVybiB7QXJyYXl9CiAgICAgKi8KCgogICAgdmVjMiRwLmNyb3NzWlYgPSBmdW5jdGlvbiAob3V0LCB6Y29tcCwgdmVjKSB7CiAgICAgIHZlYzIkcC5yb3RhdGUob3V0LCB2ZWMsIE1hdGguUEkgLyAyKTsgLy8gUm90YXRlIGFjY29yZGluZyB0byB0aGUgcmlnaHQgaGFuZCBydWxlCgogICAgICB2ZWMyJHAuc2NhbGUob3V0LCBvdXQsIHpjb21wKTsgLy8gU2NhbGUgd2l0aCB6CgogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogUm90YXRlIGEgdmVjdG9yIGJ5IGFuIGFuZ2xlCiAgICAgKiBAbWV0aG9kIHJvdGF0ZQogICAgICogQHN0YXRpYwogICAgICogQHBhcmFtICB7QXJyYXl9IG91dAogICAgICogQHBhcmFtICB7QXJyYXl9IGEKICAgICAqIEBwYXJhbSAge051bWJlcn0gYW5nbGUKICAgICAqIEByZXR1cm4ge0FycmF5fQogICAgICovCgoKICAgIHZlYzIkcC5yb3RhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCBhbmdsZSkgewogICAgICBpZiAoYW5nbGUgIT09IDApIHsKICAgICAgICB2YXIgYyA9IE1hdGguY29zKGFuZ2xlKSwKICAgICAgICAgICAgcyA9IE1hdGguc2luKGFuZ2xlKSwKICAgICAgICAgICAgeCA9IGFbMF0sCiAgICAgICAgICAgIHkgPSBhWzFdOwogICAgICAgIG91dFswXSA9IGMgKiB4IC0gcyAqIHk7CiAgICAgICAgb3V0WzFdID0gcyAqIHggKyBjICogeTsKICAgICAgfSBlbHNlIHsKICAgICAgICBvdXRbMF0gPSBhWzBdOwogICAgICAgIG91dFsxXSA9IGFbMV07CiAgICAgIH0KCiAgICAgIHJldHVybiBvdXQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBSb3RhdGUgYSB2ZWN0b3IgOTAgZGVncmVlcyBjbG9ja3dpc2UKICAgICAqIEBtZXRob2Qgcm90YXRlOTBjdwogICAgICogQHN0YXRpYwogICAgICogQHBhcmFtICB7QXJyYXl9IG91dAogICAgICogQHBhcmFtICB7QXJyYXl9IGEKICAgICAqIEBwYXJhbSAge051bWJlcn0gYW5nbGUKICAgICAqIEByZXR1cm4ge0FycmF5fQogICAgICovCgoKICAgIHZlYzIkcC5yb3RhdGU5MGN3ID0gZnVuY3Rpb24gKG91dCwgYSkgewogICAgICB2YXIgeCA9IGFbMF07CiAgICAgIHZhciB5ID0gYVsxXTsKICAgICAgb3V0WzBdID0geTsKICAgICAgb3V0WzFdID0gLXg7CiAgICAgIHJldHVybiBvdXQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBUcmFuc2Zvcm0gYSBwb2ludCBwb3NpdGlvbiB0byBsb2NhbCBmcmFtZS4KICAgICAqIEBtZXRob2QgdG9Mb2NhbEZyYW1lCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gb3V0CiAgICAgKiBAcGFyYW0gIHtBcnJheX0gd29ybGRQb2ludAogICAgICogQHBhcmFtICB7QXJyYXl9IGZyYW1lUG9zaXRpb24KICAgICAqIEBwYXJhbSAge051bWJlcn0gZnJhbWVBbmdsZQogICAgICogQHJldHVybiB7QXJyYXl9CiAgICAgKi8KCgogICAgdmVjMiRwLnRvTG9jYWxGcmFtZSA9IGZ1bmN0aW9uIChvdXQsIHdvcmxkUG9pbnQsIGZyYW1lUG9zaXRpb24sIGZyYW1lQW5nbGUpIHsKICAgICAgdmFyIGMgPSBNYXRoLmNvcygtZnJhbWVBbmdsZSksCiAgICAgICAgICBzID0gTWF0aC5zaW4oLWZyYW1lQW5nbGUpLAogICAgICAgICAgeCA9IHdvcmxkUG9pbnRbMF0gLSBmcmFtZVBvc2l0aW9uWzBdLAogICAgICAgICAgeSA9IHdvcmxkUG9pbnRbMV0gLSBmcmFtZVBvc2l0aW9uWzFdOwogICAgICBvdXRbMF0gPSBjICogeCAtIHMgKiB5OwogICAgICBvdXRbMV0gPSBzICogeCArIGMgKiB5OwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogVHJhbnNmb3JtIGEgcG9pbnQgcG9zaXRpb24gdG8gZ2xvYmFsIGZyYW1lLgogICAgICogQG1ldGhvZCB0b0dsb2JhbEZyYW1lCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gb3V0CiAgICAgKiBAcGFyYW0gIHtBcnJheX0gbG9jYWxQb2ludAogICAgICogQHBhcmFtICB7QXJyYXl9IGZyYW1lUG9zaXRpb24KICAgICAqIEBwYXJhbSAge051bWJlcn0gZnJhbWVBbmdsZQogICAgICovCgoKICAgIHZlYzIkcC50b0dsb2JhbEZyYW1lID0gZnVuY3Rpb24gKG91dCwgbG9jYWxQb2ludCwgZnJhbWVQb3NpdGlvbiwgZnJhbWVBbmdsZSkgewogICAgICB2YXIgYyA9IE1hdGguY29zKGZyYW1lQW5nbGUpLAogICAgICAgICAgcyA9IE1hdGguc2luKGZyYW1lQW5nbGUpLAogICAgICAgICAgeCA9IGxvY2FsUG9pbnRbMF0sCiAgICAgICAgICB5ID0gbG9jYWxQb2ludFsxXSwKICAgICAgICAgIGFkZFggPSBmcmFtZVBvc2l0aW9uWzBdLAogICAgICAgICAgYWRkWSA9IGZyYW1lUG9zaXRpb25bMV07CiAgICAgIG91dFswXSA9IGMgKiB4IC0gcyAqIHkgKyBhZGRYOwogICAgICBvdXRbMV0gPSBzICogeCArIGMgKiB5ICsgYWRkWTsKICAgIH07CiAgICAvKioKICAgICAqIFRyYW5zZm9ybSBhIHZlY3RvciB0byBsb2NhbCBmcmFtZS4KICAgICAqIEBtZXRob2QgdmVjdG9yVG9Mb2NhbEZyYW1lCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gb3V0CiAgICAgKiBAcGFyYW0gIHtBcnJheX0gd29ybGRWZWN0b3IKICAgICAqIEBwYXJhbSAge051bWJlcn0gZnJhbWVBbmdsZQogICAgICogQHJldHVybiB7QXJyYXl9CiAgICAgKi8KCgogICAgdmVjMiRwLnZlY3RvclRvTG9jYWxGcmFtZSA9IGZ1bmN0aW9uIChvdXQsIHdvcmxkVmVjdG9yLCBmcmFtZUFuZ2xlKSB7CiAgICAgIHZhciBjID0gTWF0aC5jb3MoLWZyYW1lQW5nbGUpLAogICAgICAgICAgcyA9IE1hdGguc2luKC1mcmFtZUFuZ2xlKSwKICAgICAgICAgIHggPSB3b3JsZFZlY3RvclswXSwKICAgICAgICAgIHkgPSB3b3JsZFZlY3RvclsxXTsKICAgICAgb3V0WzBdID0gYyAqIHggLSBzICogeTsKICAgICAgb3V0WzFdID0gcyAqIHggKyBjICogeTsKICAgICAgcmV0dXJuIG91dDsKICAgIH07CiAgICAvKioKICAgICAqIFRyYW5zZm9ybSBhIHZlY3RvciB0byBnbG9iYWwgZnJhbWUuCiAgICAgKiBAbWV0aG9kIHZlY3RvclRvR2xvYmFsRnJhbWUKICAgICAqIEBwYXJhbSAge0FycmF5fSBvdXQKICAgICAqIEBwYXJhbSAge0FycmF5fSBsb2NhbFZlY3RvcgogICAgICogQHBhcmFtICB7TnVtYmVyfSBmcmFtZUFuZ2xlCiAgICAgKi8KCgogICAgdmVjMiRwLnZlY3RvclRvR2xvYmFsRnJhbWUgPSB2ZWMyJHAucm90YXRlOwogICAgLyoqCiAgICAgKiBDb21wdXRlIGNlbnRyb2lkIG9mIGEgdHJpYW5nbGUgc3Bhbm5lZCBieSB2ZWN0b3JzIGEsYixjLiBTZWUgaHR0cDovL2Vhc3ljYWxjdWxhdGlvbi5jb20vYW5hbHl0aWNhbC9sZWFybi1jZW50cm9pZC5waHAKICAgICAqIEBtZXRob2QgY2VudHJvaWQKICAgICAqIEBzdGF0aWMKICAgICAqIEBwYXJhbSAge0FycmF5fSBvdXQKICAgICAqIEBwYXJhbSAge0FycmF5fSBhCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gYgogICAgICogQHBhcmFtICB7QXJyYXl9IGMKICAgICAqIEByZXR1cm4gIHtBcnJheX0gVGhlICJvdXQiIHZlY3Rvci4KICAgICAqLwoKICAgIHZlYzIkcC5jZW50cm9pZCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIGMpIHsKICAgICAgdmVjMiRwLmFkZChvdXQsIGEsIGIpOwogICAgICB2ZWMyJHAuYWRkKG91dCwgb3V0LCBjKTsKICAgICAgdmVjMiRwLnNjYWxlKG91dCwgb3V0LCAxIC8gMyk7CiAgICAgIHJldHVybiBvdXQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBDcmVhdGVzIGEgbmV3LCBlbXB0eSB2ZWMyCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIGNyZWF0ZQogICAgICogQHJldHVybiB7QXJyYXl9IGEgbmV3IDJEIHZlY3RvcgogICAgICovCgoKICAgIHZlYzIkcC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBvdXQgPSBuZXcgVXRpbHMkNi5BUlJBWV9UWVBFKDIpOwogICAgICBvdXRbMF0gPSAwOwogICAgICBvdXRbMV0gPSAwOwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogQ3JlYXRlcyBhIG5ldyB2ZWMyIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgdmVjdG9yCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIGNsb25lCiAgICAgKiBAcGFyYW0ge0FycmF5fSBhIHZlY3RvciB0byBjbG9uZQogICAgICogQHJldHVybiB7QXJyYXl9IGEgbmV3IDJEIHZlY3RvcgogICAgICovCgoKICAgIHZlYzIkcC5jbG9uZSA9IGZ1bmN0aW9uIChhKSB7CiAgICAgIHZhciBvdXQgPSBuZXcgVXRpbHMkNi5BUlJBWV9UWVBFKDIpOwogICAgICBvdXRbMF0gPSBhWzBdOwogICAgICBvdXRbMV0gPSBhWzFdOwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogQ3JlYXRlcyBhIG5ldyB2ZWMyIGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlcwogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBmcm9tVmFsdWVzCiAgICAgKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudAogICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnQKICAgICAqIEByZXR1cm4ge0FycmF5fSBhIG5ldyAyRCB2ZWN0b3IKICAgICAqLwoKCiAgICB2ZWMyJHAuZnJvbVZhbHVlcyA9IGZ1bmN0aW9uICh4LCB5KSB7CiAgICAgIHZhciBvdXQgPSBuZXcgVXRpbHMkNi5BUlJBWV9UWVBFKDIpOwogICAgICBvdXRbMF0gPSB4OwogICAgICBvdXRbMV0gPSB5OwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHZlYzIgdG8gYW5vdGhlcgogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBjb3B5CiAgICAgKiBAcGFyYW0ge0FycmF5fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3IKICAgICAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIHNvdXJjZSB2ZWN0b3IKICAgICAqIEByZXR1cm4ge0FycmF5fSBvdXQKICAgICAqLwoKCiAgICB2ZWMyJHAuY29weSA9IGZ1bmN0aW9uIChvdXQsIGEpIHsKICAgICAgb3V0WzBdID0gYVswXTsKICAgICAgb3V0WzFdID0gYVsxXTsKICAgICAgcmV0dXJuIG91dDsKICAgIH07CiAgICAvKioKICAgICAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzIgdG8gdGhlIGdpdmVuIHZhbHVlcwogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBzZXQKICAgICAqIEBwYXJhbSB7QXJyYXl9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvcgogICAgICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnQKICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50CiAgICAgKiBAcmV0dXJuIHtBcnJheX0gb3V0CiAgICAgKi8KCgogICAgdmVjMiRwLnNldCA9IGZ1bmN0aW9uIChvdXQsIHgsIHkpIHsKICAgICAgb3V0WzBdID0geDsKICAgICAgb3V0WzFdID0geTsKICAgICAgcmV0dXJuIG91dDsKICAgIH07CiAgICAvKioKICAgICAqIEFkZHMgdHdvIHZlYzIncwogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBhZGQKICAgICAqIEBwYXJhbSB7QXJyYXl9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvcgogICAgICogQHBhcmFtIHtBcnJheX0gYSB0aGUgZmlyc3Qgb3BlcmFuZAogICAgICogQHBhcmFtIHtBcnJheX0gYiB0aGUgc2Vjb25kIG9wZXJhbmQKICAgICAqIEByZXR1cm4ge0FycmF5fSBvdXQKICAgICAqLwoKCiAgICB2ZWMyJHAuYWRkID0gZnVuY3Rpb24gKG91dCwgYSwgYikgewogICAgICBvdXRbMF0gPSBhWzBdICsgYlswXTsKICAgICAgb3V0WzFdID0gYVsxXSArIGJbMV07CiAgICAgIHJldHVybiBvdXQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBTdWJ0cmFjdHMgdHdvIHZlYzIncwogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBzdWJ0cmFjdAogICAgICogQHBhcmFtIHtBcnJheX0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yCiAgICAgKiBAcGFyYW0ge0FycmF5fSBhIHRoZSBmaXJzdCBvcGVyYW5kCiAgICAgKiBAcGFyYW0ge0FycmF5fSBiIHRoZSBzZWNvbmQgb3BlcmFuZAogICAgICogQHJldHVybiB7QXJyYXl9IG91dAogICAgICovCgoKICAgIHZlYzIkcC5zdWJ0cmFjdCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHsKICAgICAgb3V0WzBdID0gYVswXSAtIGJbMF07CiAgICAgIG91dFsxXSA9IGFbMV0gLSBiWzFdOwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogTXVsdGlwbGllcyB0d28gdmVjMidzCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIG11bHRpcGx5CiAgICAgKiBAcGFyYW0ge0FycmF5fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3IKICAgICAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGZpcnN0IG9wZXJhbmQKICAgICAqIEBwYXJhbSB7QXJyYXl9IGIgdGhlIHNlY29uZCBvcGVyYW5kCiAgICAgKiBAcmV0dXJuIHtBcnJheX0gb3V0CiAgICAgKi8KCgogICAgdmVjMiRwLm11bHRpcGx5ID0gZnVuY3Rpb24gKG91dCwgYSwgYikgewogICAgICBvdXRbMF0gPSBhWzBdICogYlswXTsKICAgICAgb3V0WzFdID0gYVsxXSAqIGJbMV07CiAgICAgIHJldHVybiBvdXQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBEaXZpZGVzIHR3byB2ZWMyJ3MKICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2QgZGl2aWRlCiAgICAgKiBAcGFyYW0ge0FycmF5fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3IKICAgICAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGZpcnN0IG9wZXJhbmQKICAgICAqIEBwYXJhbSB7QXJyYXl9IGIgdGhlIHNlY29uZCBvcGVyYW5kCiAgICAgKiBAcmV0dXJuIHtBcnJheX0gb3V0CiAgICAgKi8KCgogICAgdmVjMiRwLmRpdmlkZSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHsKICAgICAgb3V0WzBdID0gYVswXSAvIGJbMF07CiAgICAgIG91dFsxXSA9IGFbMV0gLyBiWzFdOwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogU2NhbGVzIGEgdmVjMiBieSBhIHNjYWxhciBudW1iZXIKICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2Qgc2NhbGUKICAgICAqIEBwYXJhbSB7QXJyYXl9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvcgogICAgICogQHBhcmFtIHtBcnJheX0gYSB0aGUgdmVjdG9yIHRvIHNjYWxlCiAgICAgKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIHZlY3RvciBieQogICAgICogQHJldHVybiB7QXJyYXl9IG91dAogICAgICovCgoKICAgIHZlYzIkcC5zY2FsZSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHsKICAgICAgb3V0WzBdID0gYVswXSAqIGI7CiAgICAgIG91dFsxXSA9IGFbMV0gKiBiOwogICAgICByZXR1cm4gb3V0OwogICAgfTsKICAgIC8qKgogICAgICogQ2FsY3VsYXRlcyB0aGUgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzIncwogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBkaXN0YW5jZQogICAgICogQHBhcmFtIHtBcnJheX0gYSB0aGUgZmlyc3Qgb3BlcmFuZAogICAgICogQHBhcmFtIHtBcnJheX0gYiB0aGUgc2Vjb25kIG9wZXJhbmQKICAgICAqIEByZXR1cm4ge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiCiAgICAgKi8KCgogICAgdmVjMiRwLmRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHsKICAgICAgdmFyIHggPSBiWzBdIC0gYVswXSwKICAgICAgICAgIHkgPSBiWzFdIC0gYVsxXTsKICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTsKICAgIH07CiAgICAvKioKICAgICAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzIncwogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBzcXVhcmVkRGlzdGFuY2UKICAgICAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGZpcnN0IG9wZXJhbmQKICAgICAqIEBwYXJhbSB7QXJyYXl9IGIgdGhlIHNlY29uZCBvcGVyYW5kCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiCiAgICAgKi8KCgogICAgdmVjMiRwLnNxdWFyZWREaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7CiAgICAgIHZhciB4ID0gYlswXSAtIGFbMF0sCiAgICAgICAgICB5ID0gYlsxXSAtIGFbMV07CiAgICAgIHJldHVybiB4ICogeCArIHkgKiB5OwogICAgfTsKICAgIC8qKgogICAgICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgdmVjMgogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBsZW5ndGgKICAgICAqIEBwYXJhbSB7QXJyYXl9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2YKICAgICAqIEByZXR1cm4ge051bWJlcn0gbGVuZ3RoIG9mIGEKICAgICAqLwoKCiAgICB2ZWMyJHAubGVuZ3RoID0gZnVuY3Rpb24gKGEpIHsKICAgICAgdmFyIHggPSBhWzBdLAogICAgICAgICAgeSA9IGFbMV07CiAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7CiAgICB9OwogICAgLyoqCiAgICAgKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHZlYzIKICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2Qgc3F1YXJlZExlbmd0aAogICAgICogQHBhcmFtIHtBcnJheX0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHNxdWFyZWQgbGVuZ3RoIG9mCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGEKICAgICAqLwoKCiAgICB2ZWMyJHAuc3F1YXJlZExlbmd0aCA9IGZ1bmN0aW9uIChhKSB7CiAgICAgIHZhciB4ID0gYVswXSwKICAgICAgICAgIHkgPSBhWzFdOwogICAgICByZXR1cm4geCAqIHggKyB5ICogeTsKICAgIH07CiAgICAvKioKICAgICAqIE5lZ2F0ZXMgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMyCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIG5lZ2F0ZQogICAgICogQHBhcmFtIHtBcnJheX0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yCiAgICAgKiBAcGFyYW0ge0FycmF5fSBhIHZlY3RvciB0byBuZWdhdGUKICAgICAqIEByZXR1cm4ge0FycmF5fSBvdXQKICAgICAqLwoKCiAgICB2ZWMyJHAubmVnYXRlID0gZnVuY3Rpb24gKG91dCwgYSkgewogICAgICBvdXRbMF0gPSAtYVswXTsKICAgICAgb3V0WzFdID0gLWFbMV07CiAgICAgIHJldHVybiBvdXQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBOb3JtYWxpemUgYSB2ZWMyCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZQogICAgICogQHBhcmFtIHtBcnJheX0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yCiAgICAgKiBAcGFyYW0ge0FycmF5fSBhIHZlY3RvciB0byBub3JtYWxpemUKICAgICAqIEByZXR1cm4ge0FycmF5fSBvdXQKICAgICAqLwoKCiAgICB2ZWMyJHAubm9ybWFsaXplID0gZnVuY3Rpb24gKG91dCwgYSkgewogICAgICB2YXIgeCA9IGFbMF0sCiAgICAgICAgICB5ID0gYVsxXTsKICAgICAgdmFyIGxlbiA9IHggKiB4ICsgeSAqIHk7CgogICAgICBpZiAobGVuID4gMCkgewogICAgICAgIC8vVE9ETzogZXZhbHVhdGUgdXNlIG9mIGdsbV9pbnZzcXJ0IGhlcmU/CiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pOwogICAgICAgIG91dFswXSA9IGFbMF0gKiBsZW47CiAgICAgICAgb3V0WzFdID0gYVsxXSAqIGxlbjsKICAgICAgfQoKICAgICAgcmV0dXJuIG91dDsKICAgIH07CiAgICAvKioKICAgICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWMyJ3MKICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2QgZG90CiAgICAgKiBAcGFyYW0ge0FycmF5fSBhIHRoZSBmaXJzdCBvcGVyYW5kCiAgICAgKiBAcGFyYW0ge0FycmF5fSBiIHRoZSBzZWNvbmQgb3BlcmFuZAogICAgICogQHJldHVybiB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiCiAgICAgKi8KCgogICAgdmVjMiRwLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7CiAgICAgIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdOwogICAgfTsKICAgIC8qKgogICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvcgogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBzdHIKICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlYyB2ZWN0b3IgdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nCiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yCiAgICAgKi8KCgogICAgdmVjMiRwLnN0ciA9IGZ1bmN0aW9uIChhKSB7CiAgICAgIHJldHVybiAndmVjMignICsgYVswXSArICcsICcgKyBhWzFdICsgJyknOwogICAgfTsKICAgIC8qKgogICAgICogTGluZWFybHkgaW50ZXJwb2xhdGUvbWl4IHR3byB2ZWN0b3JzLgogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBsZXJwCiAgICAgKiBAcGFyYW0ge0FycmF5fSBvdXQKICAgICAqIEBwYXJhbSB7QXJyYXl9IGEgRmlyc3QgdmVjdG9yCiAgICAgKiBAcGFyYW0ge0FycmF5fSBiIFNlY29uZCB2ZWN0b3IKICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IExlcnAgZmFjdG9yCiAgICAgKi8KCgogICAgdmVjMiRwLmxlcnAgPSBmdW5jdGlvbiAob3V0LCBhLCBiLCB0KSB7CiAgICAgIHZhciBheCA9IGFbMF0sCiAgICAgICAgICBheSA9IGFbMV07CiAgICAgIG91dFswXSA9IGF4ICsgdCAqIChiWzBdIC0gYXgpOwogICAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTsKICAgICAgcmV0dXJuIG91dDsKICAgIH07CiAgICAvKioKICAgICAqIFJlZmxlY3QgYSB2ZWN0b3IgYWxvbmcgYSBub3JtYWwuCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIHJlZmxlY3QKICAgICAqIEBwYXJhbSB7QXJyYXl9IG91dAogICAgICogQHBhcmFtIHtBcnJheX0gdmVjdG9yCiAgICAgKiBAcGFyYW0ge0FycmF5fSBub3JtYWwKICAgICAqLwoKCiAgICB2ZWMyJHAucmVmbGVjdCA9IGZ1bmN0aW9uIChvdXQsIHZlY3Rvciwgbm9ybWFsKSB7CiAgICAgIHZhciBkb3QgPSB2ZWN0b3JbMF0gKiBub3JtYWxbMF0gKyB2ZWN0b3JbMV0gKiBub3JtYWxbMV07CiAgICAgIG91dFswXSA9IHZlY3RvclswXSAtIDIgKiBub3JtYWxbMF0gKiBkb3Q7CiAgICAgIG91dFsxXSA9IHZlY3RvclsxXSAtIDIgKiBub3JtYWxbMV0gKiBkb3Q7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIGludGVyc2VjdGlvbiBwb2ludCBiZXR3ZWVuIHR3byBsaW5lIHNlZ21lbnRzLgogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBnZXRMaW5lU2VnbWVudHNJbnRlcnNlY3Rpb24KICAgICAqIEBwYXJhbSAge0FycmF5fSBvdXQKICAgICAqIEBwYXJhbSAge0FycmF5fSBwMAogICAgICogQHBhcmFtICB7QXJyYXl9IHAxCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gcDIKICAgICAqIEBwYXJhbSAge0FycmF5fSBwMwogICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGVyZSB3YXMgYW4gaW50ZXJzZWN0aW9uLCBvdGhlcndpc2UgZmFsc2UuCiAgICAgKi8KCgogICAgdmVjMiRwLmdldExpbmVTZWdtZW50c0ludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChvdXQsIHAwLCBwMSwgcDIsIHAzKSB7CiAgICAgIHZhciB0ID0gdmVjMiRwLmdldExpbmVTZWdtZW50c0ludGVyc2VjdGlvbkZyYWN0aW9uKHAwLCBwMSwgcDIsIHAzKTsKCiAgICAgIGlmICh0IDwgMCkgewogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfSBlbHNlIHsKICAgICAgICBvdXRbMF0gPSBwMFswXSArIHQgKiAocDFbMF0gLSBwMFswXSk7CiAgICAgICAgb3V0WzFdID0gcDBbMV0gKyB0ICogKHAxWzFdIC0gcDBbMV0pOwogICAgICAgIHJldHVybiB0cnVlOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIGludGVyc2VjdGlvbiBmcmFjdGlvbiBiZXR3ZWVuIHR3byBsaW5lIHNlZ21lbnRzLiBJZiBzdWNjZXNzZnVsLCB0aGUgaW50ZXJzZWN0aW9uIGlzIGF0IHAwICsgdCAqIChwMSAtIHAwKQogICAgICogQHN0YXRpYwogICAgICogQG1ldGhvZCBnZXRMaW5lU2VnbWVudHNJbnRlcnNlY3Rpb25GcmFjdGlvbgogICAgICogQHBhcmFtICB7QXJyYXl9IHAwCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gcDEKICAgICAqIEBwYXJhbSAge0FycmF5fSBwMgogICAgICogQHBhcmFtICB7QXJyYXl9IHAzCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMSBpZiB0aGVyZSB3YXMgYW4gaW50ZXJzZWN0aW9uLCBvdGhlcndpc2UgLTEuCiAgICAgKi8KCgogICAgdmVjMiRwLmdldExpbmVTZWdtZW50c0ludGVyc2VjdGlvbkZyYWN0aW9uID0gZnVuY3Rpb24gKHAwLCBwMSwgcDIsIHAzKSB7CiAgICAgIHZhciBzMV94ID0gcDFbMF0gLSBwMFswXTsKICAgICAgdmFyIHMxX3kgPSBwMVsxXSAtIHAwWzFdOwogICAgICB2YXIgczJfeCA9IHAzWzBdIC0gcDJbMF07CiAgICAgIHZhciBzMl95ID0gcDNbMV0gLSBwMlsxXTsKICAgICAgdmFyIHMsIHQ7CiAgICAgIHMgPSAoLXMxX3kgKiAocDBbMF0gLSBwMlswXSkgKyBzMV94ICogKHAwWzFdIC0gcDJbMV0pKSAvICgtczJfeCAqIHMxX3kgKyBzMV94ICogczJfeSk7CiAgICAgIHQgPSAoczJfeCAqIChwMFsxXSAtIHAyWzFdKSAtIHMyX3kgKiAocDBbMF0gLSBwMlswXSkpIC8gKC1zMl94ICogczFfeSArIHMxX3ggKiBzMl95KTsKCiAgICAgIGlmIChzID49IDAgJiYgcyA8PSAxICYmIHQgPj0gMCAmJiB0IDw9IDEpIHsKICAgICAgICAvLyBDb2xsaXNpb24gZGV0ZWN0ZWQKICAgICAgICByZXR1cm4gdDsKICAgICAgfQoKICAgICAgcmV0dXJuIC0xOyAvLyBObyBjb2xsaXNpb24KICAgIH07CgogICAgdmFyIHZlYzIkbyA9IHZlYzIkcS5leHBvcnRzOwoKICAgIHZhciBBQUJCXzEgPSBBQUJCJDI7CiAgICAvKioKICAgICAqIEF4aXMgYWxpZ25lZCBib3VuZGluZyBib3ggY2xhc3MuCiAgICAgKiBAY2xhc3MgQUFCQgogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge09iamVjdH0gIFtvcHRpb25zXQogICAgICogQHBhcmFtIHtBcnJheX0gICBbb3B0aW9ucy51cHBlckJvdW5kXQogICAgICogQHBhcmFtIHtBcnJheX0gICBbb3B0aW9ucy5sb3dlckJvdW5kXQogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgYWFiYiA9IG5ldyBBQUJCKHsKICAgICAqICAgICAgICAgdXBwZXJCb3VuZDogWzEsIDFdLAogICAgICogICAgICAgICBsb3dlckJvdW5kOiBbLTEsIC0xXQogICAgICogICAgIH0pOwogICAgICovCgogICAgZnVuY3Rpb24gQUFCQiQyKG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIC8qKgogICAgICAgKiBUaGUgbG93ZXIgYm91bmQgb2YgdGhlIGJvdW5kaW5nIGJveC4KICAgICAgICogQHByb3BlcnR5IGxvd2VyQm91bmQKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMubG93ZXJCb3VuZCA9IG9wdGlvbnMubG93ZXJCb3VuZCA/IHZlYzIkby5jbG9uZShvcHRpb25zLmxvd2VyQm91bmQpIDogdmVjMiRvLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogVGhlIHVwcGVyIGJvdW5kIG9mIHRoZSBib3VuZGluZyBib3guCiAgICAgICAqIEBwcm9wZXJ0eSB1cHBlckJvdW5kCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLnVwcGVyQm91bmQgPSBvcHRpb25zLnVwcGVyQm91bmQgPyB2ZWMyJG8uY2xvbmUob3B0aW9ucy51cHBlckJvdW5kKSA6IHZlYzIkby5jcmVhdGUoKTsKICAgIH0KCiAgICB2YXIgdG1wJDIgPSB2ZWMyJG8uY3JlYXRlKCk7CiAgICAvKioKICAgICAqIFNldCB0aGUgQUFCQiBib3VuZHMgZnJvbSBhIHNldCBvZiBwb2ludHMsIHRyYW5zZm9ybWVkIGJ5IHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgYW5nbGUuCiAgICAgKiBAbWV0aG9kIHNldEZyb21Qb2ludHMKICAgICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyBBbiBhcnJheSBvZiB2ZWMyJ3MuCiAgICAgKiBAcGFyYW0ge0FycmF5fSBwb3NpdGlvbgogICAgICogQHBhcmFtIHtudW1iZXJ9IFthbmdsZT0wXQogICAgICogQHBhcmFtIHtudW1iZXJ9IFtza2luU2l6ZT0wXSBTb21lIG1hcmdpbiB0byBiZSBhZGRlZCB0byB0aGUgQUFCQi4KICAgICAqLwoKICAgIEFBQkIkMi5wcm90b3R5cGUuc2V0RnJvbVBvaW50cyA9IGZ1bmN0aW9uIChwb2ludHMsIHBvc2l0aW9uLCBhbmdsZSwgc2tpblNpemUpIHsKICAgICAgdmFyIGwgPSB0aGlzLmxvd2VyQm91bmQsCiAgICAgICAgICB1ID0gdGhpcy51cHBlckJvdW5kOwogICAgICBhbmdsZSA9IGFuZ2xlIHx8IDA7IC8vIFNldCB0byB0aGUgZmlyc3QgcG9pbnQKCiAgICAgIGlmIChhbmdsZSAhPT0gMCkgewogICAgICAgIHZlYzIkby5yb3RhdGUobCwgcG9pbnRzWzBdLCBhbmdsZSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdmVjMiRvLmNvcHkobCwgcG9pbnRzWzBdKTsKICAgICAgfQoKICAgICAgdmVjMiRvLmNvcHkodSwgbCk7IC8vIENvbXB1dGUgY29zaW5lcyBhbmQgc2luZXMganVzdCBvbmNlCgogICAgICB2YXIgY29zQW5nbGUgPSBNYXRoLmNvcyhhbmdsZSksCiAgICAgICAgICBzaW5BbmdsZSA9IE1hdGguc2luKGFuZ2xlKTsKCiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIHAgPSBwb2ludHNbaV07CgogICAgICAgIGlmIChhbmdsZSAhPT0gMCkgewogICAgICAgICAgdmFyIHggPSBwWzBdLAogICAgICAgICAgICAgIHkgPSBwWzFdOwogICAgICAgICAgdG1wJDJbMF0gPSBjb3NBbmdsZSAqIHggLSBzaW5BbmdsZSAqIHk7CiAgICAgICAgICB0bXAkMlsxXSA9IHNpbkFuZ2xlICogeCArIGNvc0FuZ2xlICogeTsKICAgICAgICAgIHAgPSB0bXAkMjsKICAgICAgICB9CgogICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMjsgaisrKSB7CiAgICAgICAgICBpZiAocFtqXSA+IHVbal0pIHsKICAgICAgICAgICAgdVtqXSA9IHBbal07CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKHBbal0gPCBsW2pdKSB7CiAgICAgICAgICAgIGxbal0gPSBwW2pdOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSAvLyBBZGQgb2Zmc2V0CgoKICAgICAgaWYgKHBvc2l0aW9uKSB7CiAgICAgICAgdmVjMiRvLmFkZChsLCBsLCBwb3NpdGlvbik7CiAgICAgICAgdmVjMiRvLmFkZCh1LCB1LCBwb3NpdGlvbik7CiAgICAgIH0KCiAgICAgIGlmIChza2luU2l6ZSkgewogICAgICAgIGxbMF0gLT0gc2tpblNpemU7CiAgICAgICAgbFsxXSAtPSBza2luU2l6ZTsKICAgICAgICB1WzBdICs9IHNraW5TaXplOwogICAgICAgIHVbMV0gKz0gc2tpblNpemU7CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIENvcHkgYm91bmRzIGZyb20gYW4gQUFCQiB0byB0aGlzIEFBQkIKICAgICAqIEBtZXRob2QgY29weQogICAgICogQHBhcmFtICB7QUFCQn0gYWFiYgogICAgICovCgoKICAgIEFBQkIkMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIChhYWJiKSB7CiAgICAgIHZlYzIkby5jb3B5KHRoaXMubG93ZXJCb3VuZCwgYWFiYi5sb3dlckJvdW5kKTsKICAgICAgdmVjMiRvLmNvcHkodGhpcy51cHBlckJvdW5kLCBhYWJiLnVwcGVyQm91bmQpOwogICAgfTsKICAgIC8qKgogICAgICogRXh0ZW5kIHRoaXMgQUFCQiBzbyB0aGF0IGl0IGNvdmVycyB0aGUgZ2l2ZW4gQUFCQiB0b28uCiAgICAgKiBAbWV0aG9kIGV4dGVuZAogICAgICogQHBhcmFtICB7QUFCQn0gYWFiYgogICAgICovCgoKICAgIEFBQkIkMi5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKGFhYmIpIHsKICAgICAgdmFyIGxvd2VyID0gdGhpcy5sb3dlckJvdW5kLAogICAgICAgICAgdXBwZXIgPSB0aGlzLnVwcGVyQm91bmQ7IC8vIExvb3Agb3ZlciB4IGFuZCB5CgogICAgICB2YXIgaSA9IDI7CgogICAgICB3aGlsZSAoaS0tKSB7CiAgICAgICAgLy8gRXh0ZW5kIGxvd2VyIGJvdW5kCiAgICAgICAgdmFyIGwgPSBhYWJiLmxvd2VyQm91bmRbaV07CgogICAgICAgIGlmIChsb3dlcltpXSA+IGwpIHsKICAgICAgICAgIGxvd2VyW2ldID0gbDsKICAgICAgICB9IC8vIFVwcGVyCgoKICAgICAgICB2YXIgdSA9IGFhYmIudXBwZXJCb3VuZFtpXTsKCiAgICAgICAgaWYgKHVwcGVyW2ldIDwgdSkgewogICAgICAgICAgdXBwZXJbaV0gPSB1OwogICAgICAgIH0KICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBBQUJCIG92ZXJsYXBzIHRoaXMgQUFCQi4KICAgICAqIEBtZXRob2Qgb3ZlcmxhcHMKICAgICAqIEBwYXJhbSAge0FBQkJ9IGFhYmIKICAgICAqIEByZXR1cm4ge0Jvb2xlYW59CiAgICAgKi8KCgogICAgQUFCQiQyLnByb3RvdHlwZS5vdmVybGFwcyA9IGZ1bmN0aW9uIChhYWJiKSB7CiAgICAgIHZhciBsMSA9IHRoaXMubG93ZXJCb3VuZCwKICAgICAgICAgIHUxID0gdGhpcy51cHBlckJvdW5kLAogICAgICAgICAgbDIgPSBhYWJiLmxvd2VyQm91bmQsCiAgICAgICAgICB1MiA9IGFhYmIudXBwZXJCb3VuZDsgLy8gICAgICBsMiAgICAgICAgdTIKICAgICAgLy8gICAgICB8LS0tLS0tLS0tfAogICAgICAvLyB8LS0tLS0tLS18CiAgICAgIC8vIGwxICAgICAgIHUxCgogICAgICByZXR1cm4gKGwyWzBdIDw9IHUxWzBdICYmIHUxWzBdIDw9IHUyWzBdIHx8IGwxWzBdIDw9IHUyWzBdICYmIHUyWzBdIDw9IHUxWzBdKSAmJiAobDJbMV0gPD0gdTFbMV0gJiYgdTFbMV0gPD0gdTJbMV0gfHwgbDFbMV0gPD0gdTJbMV0gJiYgdTJbMV0gPD0gdTFbMV0pOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBjb250YWluc1BvaW50CiAgICAgKiBAcGFyYW0gIHtBcnJheX0gcG9pbnQKICAgICAqIEByZXR1cm4ge2Jvb2xlYW59CiAgICAgKi8KCgogICAgQUFCQiQyLnByb3RvdHlwZS5jb250YWluc1BvaW50ID0gZnVuY3Rpb24gKHBvaW50KSB7CiAgICAgIHZhciBsID0gdGhpcy5sb3dlckJvdW5kLAogICAgICAgICAgdSA9IHRoaXMudXBwZXJCb3VuZDsKICAgICAgcmV0dXJuIGxbMF0gPD0gcG9pbnRbMF0gJiYgcG9pbnRbMF0gPD0gdVswXSAmJiBsWzFdIDw9IHBvaW50WzFdICYmIHBvaW50WzFdIDw9IHVbMV07CiAgICB9OwogICAgLyoqCiAgICAgKiBDaGVjayBpZiB0aGUgQUFCQiBpcyBoaXQgYnkgYSByYXkuCiAgICAgKiBAbWV0aG9kIG92ZXJsYXBzUmF5CiAgICAgKiBAcGFyYW0gIHtSYXl9IHJheQogICAgICogQHJldHVybiB7bnVtYmVyfSAtMSBpZiBubyBoaXQsIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMSBpZiBoaXQsIGluZGljYXRpbmcgdGhlIHBvc2l0aW9uIGJldHdlZW4gdGhlICJmcm9tIiBhbmQgInRvIiBwb2ludHMuCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBhYWJiID0gbmV3IEFBQkIoewogICAgICogICAgICAgICB1cHBlckJvdW5kOiBbMSwgMV0sCiAgICAgKiAgICAgICAgIGxvd2VyQm91bmQ6IFstMSwgLTFdCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgdmFyIHJheSA9IG5ldyBSYXkoewogICAgICogICAgICAgICBmcm9tOiBbLTIsIDBdLAogICAgICogICAgICAgICB0bzogWzAsIDBdCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgdmFyIGZyYWN0aW9uID0gYWFiYi5vdmVybGFwc1JheShyYXkpOyAvLyBmcmFjdGlvbiA9PSAwLjUKICAgICAqLwoKCiAgICBBQUJCJDIucHJvdG90eXBlLm92ZXJsYXBzUmF5ID0gZnVuY3Rpb24gKHJheSkgewogICAgICAvLyByYXkuZGlyZWN0aW9uIGlzIHVuaXQgZGlyZWN0aW9uIHZlY3RvciBvZiByYXkKICAgICAgdmFyIGRpckZyYWNYID0gMSAvIHJheS5kaXJlY3Rpb25bMF07CiAgICAgIHZhciBkaXJGcmFjWSA9IDEgLyByYXkuZGlyZWN0aW9uWzFdOyAvLyB0aGlzLmxvd2VyQm91bmQgaXMgdGhlIGNvcm5lciBvZiBBQUJCIHdpdGggbWluaW1hbCBjb29yZGluYXRlcyAtIGxlZnQgYm90dG9tLCBydCBpcyBtYXhpbWFsIGNvcm5lcgoKICAgICAgdmFyIGZyb20gPSByYXkuZnJvbTsKICAgICAgdmFyIGxvd2VyQm91bmQgPSB0aGlzLmxvd2VyQm91bmQ7CiAgICAgIHZhciB1cHBlckJvdW5kID0gdGhpcy51cHBlckJvdW5kOwogICAgICB2YXIgdDEgPSAobG93ZXJCb3VuZFswXSAtIGZyb21bMF0pICogZGlyRnJhY1g7CiAgICAgIHZhciB0MiA9ICh1cHBlckJvdW5kWzBdIC0gZnJvbVswXSkgKiBkaXJGcmFjWDsKICAgICAgdmFyIHQzID0gKGxvd2VyQm91bmRbMV0gLSBmcm9tWzFdKSAqIGRpckZyYWNZOwogICAgICB2YXIgdDQgPSAodXBwZXJCb3VuZFsxXSAtIGZyb21bMV0pICogZGlyRnJhY1k7CiAgICAgIHZhciB0bWluID0gTWF0aC5tYXgoTWF0aC5tYXgoTWF0aC5taW4odDEsIHQyKSwgTWF0aC5taW4odDMsIHQ0KSkpOwogICAgICB2YXIgdG1heCA9IE1hdGgubWluKE1hdGgubWluKE1hdGgubWF4KHQxLCB0MiksIE1hdGgubWF4KHQzLCB0NCkpKTsgLy8gaWYgdG1heCA8IDAsIHJheSAobGluZSkgaXMgaW50ZXJzZWN0aW5nIEFBQkIsIGJ1dCB3aG9sZSBBQUJCIGlzIGJlaGluZyB1cwoKICAgICAgaWYgKHRtYXggPCAwKSB7CiAgICAgICAgLy90ID0gdG1heDsKICAgICAgICByZXR1cm4gLTE7CiAgICAgIH0gLy8gaWYgdG1pbiA+IHRtYXgsIHJheSBkb2Vzbid0IGludGVyc2VjdCBBQUJCCgoKICAgICAgaWYgKHRtaW4gPiB0bWF4KSB7CiAgICAgICAgLy90ID0gdG1heDsKICAgICAgICByZXR1cm4gLTE7CiAgICAgIH0KCiAgICAgIHJldHVybiB0bWluIC8gcmF5Lmxlbmd0aDsKICAgIH07CgogICAgdmFyIEVxdWF0aW9uXzEgPSBFcXVhdGlvbiRhOwoKICAgIHZhciB2ZWMyJG4gPSB2ZWMyJHEuZXhwb3J0cywKICAgICAgICBzY2FsZSQxID0gdmVjMiRuLnNjYWxlLAogICAgICAgIG11bHRpcGx5ID0gdmVjMiRuLm11bHRpcGx5LAogICAgICAgIGNyZWF0ZVZlYzIkMSA9IHZlYzIkbi5jcmVhdGUsCiAgICAgICAgVXRpbHMkNSA9IFV0aWxzXzE7CiAgICAvKioKICAgICAqIEJhc2UgY2xhc3MgZm9yIGNvbnN0cmFpbnQgZXF1YXRpb25zLgogICAgICogQGNsYXNzIEVxdWF0aW9uCiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUEgRmlyc3QgYm9keSBwYXJ0aWNpcGF0aW5nIGluIHRoZSBlcXVhdGlvbgogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QiBTZWNvbmQgYm9keSBwYXJ0aWNpcGF0aW5nIGluIHRoZSBlcXVhdGlvbgogICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbkZvcmNlIE1pbmltdW0gZm9yY2UgdG8gYXBwbHkuIERlZmF1bHQ6IC1OdW1iZXIuTUFYX1ZBTFVFCiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4Rm9yY2UgTWF4aW11bSBmb3JjZSB0byBhcHBseS4gRGVmYXVsdDogTnVtYmVyLk1BWF9WQUxVRQogICAgICovCgoKICAgIGZ1bmN0aW9uIEVxdWF0aW9uJGEoYm9keUEsIGJvZHlCLCBtaW5Gb3JjZSwgbWF4Rm9yY2UpIHsKICAgICAgLyoqCiAgICAgICAqIE1pbmltdW0gZm9yY2UgdG8gYXBwbHkgd2hlbiBzb2x2aW5nLgogICAgICAgKiBAcHJvcGVydHkgbWluRm9yY2UKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCiAgICAgIHRoaXMubWluRm9yY2UgPSBtaW5Gb3JjZSA9PT0gdW5kZWZpbmVkID8gLU51bWJlci5NQVhfVkFMVUUgOiBtaW5Gb3JjZTsKICAgICAgLyoqCiAgICAgICAqIE1heCBmb3JjZSB0byBhcHBseSB3aGVuIHNvbHZpbmcuCiAgICAgICAqIEBwcm9wZXJ0eSBtYXhGb3JjZQogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMubWF4Rm9yY2UgPSBtYXhGb3JjZSA9PT0gdW5kZWZpbmVkID8gTnVtYmVyLk1BWF9WQUxVRSA6IG1heEZvcmNlOwogICAgICAvKioKICAgICAgICogQ2FwIHRoZSBjb25zdHJhaW50IHZpb2xhdGlvbiAoRypxKSB0byB0aGlzIHZhbHVlLgogICAgICAgKiBAcHJvcGVydHkgbWF4QmlhcwogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMubWF4QmlhcyA9IE51bWJlci5NQVhfVkFMVUU7CiAgICAgIC8qKgogICAgICAgKiBGaXJzdCBib2R5IHBhcnRpY2lwYXRpbmcgaW4gdGhlIGNvbnN0cmFpbnQKICAgICAgICogQHByb3BlcnR5IGJvZHlBCiAgICAgICAqIEB0eXBlIHtCb2R5fQogICAgICAgKi8KCiAgICAgIHRoaXMuYm9keUEgPSBib2R5QTsKICAgICAgLyoqCiAgICAgICAqIFNlY29uZCBib2R5IHBhcnRpY2lwYXRpbmcgaW4gdGhlIGNvbnN0cmFpbnQKICAgICAgICogQHByb3BlcnR5IGJvZHlCCiAgICAgICAqIEB0eXBlIHtCb2R5fQogICAgICAgKi8KCiAgICAgIHRoaXMuYm9keUIgPSBib2R5QjsKICAgICAgLyoqCiAgICAgICAqIFRoZSBzdGlmZm5lc3Mgb2YgdGhpcyBlcXVhdGlvbi4gVHlwaWNhbGx5IGNob3NlbiB0byBhIGxhcmdlIG51bWJlciAofjFlNyksIGJ1dCBjYW4gYmUgY2hvc2VuIHNvbWV3aGF0IGZyZWVseSB0byBnZXQgYSBzdGFibGUgc2ltdWxhdGlvbi4KICAgICAgICogQHByb3BlcnR5IHN0aWZmbmVzcwogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMuc3RpZmZuZXNzID0gRXF1YXRpb24kYS5ERUZBVUxUX1NUSUZGTkVTUzsKICAgICAgLyoqCiAgICAgICAqIFRoZSBudW1iZXIgb2YgdGltZSBzdGVwcyBuZWVkZWQgdG8gc3RhYmlsaXplIHRoZSBjb25zdHJhaW50IGVxdWF0aW9uLiBUeXBpY2FsbHkgYmV0d2VlbiAzIGFuZCA1IHRpbWUgc3RlcHMuCiAgICAgICAqIEBwcm9wZXJ0eSByZWxheGF0aW9uCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5yZWxheGF0aW9uID0gRXF1YXRpb24kYS5ERUZBVUxUX1JFTEFYQVRJT047CiAgICAgIC8qKgogICAgICAgKiBUaGUgSmFjb2JpYW4gZW50cnkgb2YgdGhpcyBlcXVhdGlvbi4gNiBudW1iZXJzLCAzIHBlciBib2R5ICh4LHksYW5nbGUpLgogICAgICAgKiBAcHJvcGVydHkgRwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5HID0gbmV3IFV0aWxzJDUuQVJSQVlfVFlQRSg2KTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7CiAgICAgICAgdGhpcy5HW2ldID0gMDsKICAgICAgfQoKICAgICAgdGhpcy5vZmZzZXQgPSAwOwogICAgICB0aGlzLmEgPSAwOwogICAgICB0aGlzLmIgPSAwOwogICAgICB0aGlzLmVwc2lsb24gPSAwOwogICAgICB0aGlzLnRpbWVTdGVwID0gMSAvIDYwOwogICAgICAvKioKICAgICAgICogSW5kaWNhdGVzIGlmIHN0aWZmbmVzcyBvciByZWxheGF0aW9uIHdhcyBjaGFuZ2VkLgogICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IG5lZWRzVXBkYXRlCiAgICAgICAqLwoKICAgICAgdGhpcy5uZWVkc1VwZGF0ZSA9IHRydWU7CiAgICAgIC8qKgogICAgICAgKiBUaGUgcmVzdWx0aW5nIGNvbnN0cmFpbnQgbXVsdGlwbGllciBmcm9tIHRoZSBsYXN0IHNvbHZlLiBUaGlzIGlzIG1vc3RseSBlcXVpdmFsZW50IHRvIHRoZSBmb3JjZSBwcm9kdWNlZCBieSB0aGUgY29uc3RyYWludC4KICAgICAgICogQHByb3BlcnR5IG11bHRpcGxpZXIKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLm11bHRpcGxpZXIgPSAwOwogICAgICAvKioKICAgICAgICogUmVsYXRpdmUgdmVsb2NpdHkuCiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByZWxhdGl2ZVZlbG9jaXR5CiAgICAgICAqLwoKICAgICAgdGhpcy5yZWxhdGl2ZVZlbG9jaXR5ID0gMDsKICAgICAgLyoqCiAgICAgICAqIFdoZXRoZXIgdGhpcyBlcXVhdGlvbiBpcyBlbmFibGVkIG9yIG5vdC4gSWYgdHJ1ZSwgaXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgc29sdmVyLgogICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZWQKICAgICAgICovCgogICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlOyAvLyBUZW1wIHN0dWZmCgogICAgICB0aGlzLmxhbWJkYSA9IHRoaXMuQiA9IHRoaXMuaW52QyA9IHRoaXMubWluRm9yY2VEdCA9IHRoaXMubWF4Rm9yY2VEdCA9IDA7CiAgICAgIHRoaXMuaW5kZXggPSAtMTsKICAgIH0KICAgIC8qKgogICAgICogVGhlIGRlZmF1bHQgc3RpZmZuZXNzIHdoZW4gY3JlYXRpbmcgYSBuZXcgRXF1YXRpb24uCiAgICAgKiBAc3RhdGljCiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gREVGQVVMVF9TVElGRk5FU1MKICAgICAqIEBkZWZhdWx0IDFlNgogICAgICovCgoKICAgIEVxdWF0aW9uJGEuREVGQVVMVF9TVElGRk5FU1MgPSAxZTY7CiAgICAvKioKICAgICAqIFRoZSBkZWZhdWx0IHJlbGF4YXRpb24gd2hlbiBjcmVhdGluZyBhIG5ldyBFcXVhdGlvbi4KICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBERUZBVUxUX1JFTEFYQVRJT04KICAgICAqIEBkZWZhdWx0IDQKICAgICAqLwoKICAgIEVxdWF0aW9uJGEuREVGQVVMVF9SRUxBWEFUSU9OID0gNDsKICAgIHZhciBxaSA9IGNyZWF0ZVZlYzIkMSgpLAogICAgICAgIHFqID0gY3JlYXRlVmVjMiQxKCksCiAgICAgICAgaU1maSA9IGNyZWF0ZVZlYzIkMSgpLAogICAgICAgIGlNZmogPSBjcmVhdGVWZWMyJDEoKTsKICAgIEVxdWF0aW9uJGEucHJvdG90eXBlID0gewogICAgICAvKioKICAgICAgICogQ29tcHV0ZSBTUE9PSyBwYXJhbWV0ZXJzIC5hLCAuYiBhbmQgLmVwc2lsb24gYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhcmFtZXRlcnMuIFNlZSBlcXVhdGlvbnMgOSwgMTAgYW5kIDExIGluIHRoZSA8YSBocmVmPSJodHRwOi8vd3d3OC5jcy51bXUuc2Uva3Vyc2VyLzVEVjA1OC9WVDA5L2xlY3R1cmVzL3Nwb29rbm90ZXMucGRmIj5TUE9PSyBub3RlczwvYT4uCiAgICAgICAqIEBtZXRob2QgdXBkYXRlCiAgICAgICAqLwogICAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHsKICAgICAgICB2YXIgayA9IHRoaXMuc3RpZmZuZXNzLAogICAgICAgICAgICBkID0gdGhpcy5yZWxheGF0aW9uLAogICAgICAgICAgICBoID0gdGhpcy50aW1lU3RlcDsKICAgICAgICB0aGlzLmEgPSA0IC8gKGggKiAoMSArIDQgKiBkKSk7CiAgICAgICAgdGhpcy5iID0gNCAqIGQgLyAoMSArIDQgKiBkKTsKICAgICAgICB0aGlzLmVwc2lsb24gPSA0IC8gKGggKiBoICogayAqICgxICsgNCAqIGQpKTsKICAgICAgICB0aGlzLm5lZWRzVXBkYXRlID0gZmFsc2U7CiAgICAgIH0sCgogICAgICAvKioKICAgICAgICogTXVsdGlwbHkgYSBqYWNvYmlhbiBlbnRyeSB3aXRoIGNvcnJlc3BvbmRpbmcgcG9zaXRpb25zIG9yIHZlbG9jaXRpZXMKICAgICAgICogQG1ldGhvZCBnbXVsdAogICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgICAqLwogICAgICBnbXVsdDogZnVuY3Rpb24gKEcsIHZpLCB3aSwgdmosIHdqKSB7CiAgICAgICAgcmV0dXJuIEdbMF0gKiB2aVswXSArIEdbMV0gKiB2aVsxXSArIEdbMl0gKiB3aSArIEdbM10gKiB2alswXSArIEdbNF0gKiB2alsxXSArIEdbNV0gKiB3ajsKICAgICAgfSwKCiAgICAgIC8qKgogICAgICAgKiBDb21wdXRlcyB0aGUgUkhTIG9mIHRoZSBTUE9PSyBlcXVhdGlvbgogICAgICAgKiBAbWV0aG9kIGNvbXB1dGVCCiAgICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAgICovCiAgICAgIGNvbXB1dGVCOiBmdW5jdGlvbiAoYSwgYiwgaCkgewogICAgICAgIHZhciBHVyA9IHRoaXMuY29tcHV0ZUdXKCk7CiAgICAgICAgdmFyIEdxID0gdGhpcy5jb21wdXRlR3EoKTsKICAgICAgICB2YXIgbWF4QmlhcyA9IHRoaXMubWF4QmlhczsKCiAgICAgICAgaWYgKE1hdGguYWJzKEdxKSA+IG1heEJpYXMpIHsKICAgICAgICAgIEdxID0gR3EgPiAwID8gbWF4QmlhcyA6IC1tYXhCaWFzOwogICAgICAgIH0KCiAgICAgICAgdmFyIEdpTWYgPSB0aGlzLmNvbXB1dGVHaU1mKCk7CiAgICAgICAgdmFyIEIgPSAtR3EgKiBhIC0gR1cgKiBiIC0gR2lNZiAqIGg7CiAgICAgICAgcmV0dXJuIEI7CiAgICAgIH0sCgogICAgICAvKioKICAgICAgICogQ29tcHV0ZXMgR1wqcSwgd2hlcmUgcSBhcmUgdGhlIGdlbmVyYWxpemVkIGJvZHkgY29vcmRpbmF0ZXMKICAgICAgICogQG1ldGhvZCBjb21wdXRlR3EKICAgICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICAgKi8KICAgICAgY29tcHV0ZUdxOiBmdW5jdGlvbiAoKSB7CiAgICAgICAgdmFyIEcgPSB0aGlzLkcsCiAgICAgICAgICAgIGJpID0gdGhpcy5ib2R5QSwKICAgICAgICAgICAgYmogPSB0aGlzLmJvZHlCLAogICAgICAgICAgICBhaSA9IGJpLmFuZ2xlLAogICAgICAgICAgICBhaiA9IGJqLmFuZ2xlOwogICAgICAgIHJldHVybiB0aGlzLmdtdWx0KEcsIHFpLCBhaSwgcWosIGFqKSArIHRoaXMub2Zmc2V0OwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIENvbXB1dGVzIEdcKlcsIHdoZXJlIFcgYXJlIHRoZSBib2R5IHZlbG9jaXRpZXMKICAgICAgICogQG1ldGhvZCBjb21wdXRlR1cKICAgICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICAgKi8KICAgICAgY29tcHV0ZUdXOiBmdW5jdGlvbiAoKSB7CiAgICAgICAgdmFyIEcgPSB0aGlzLkcsCiAgICAgICAgICAgIGJpID0gdGhpcy5ib2R5QSwKICAgICAgICAgICAgYmogPSB0aGlzLmJvZHlCLAogICAgICAgICAgICB2aSA9IGJpLnZlbG9jaXR5LAogICAgICAgICAgICB2aiA9IGJqLnZlbG9jaXR5LAogICAgICAgICAgICB3aSA9IGJpLmFuZ3VsYXJWZWxvY2l0eSwKICAgICAgICAgICAgd2ogPSBiai5hbmd1bGFyVmVsb2NpdHk7CiAgICAgICAgcmV0dXJuIHRoaXMuZ211bHQoRywgdmksIHdpLCB2aiwgd2opICsgdGhpcy5yZWxhdGl2ZVZlbG9jaXR5OwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIENvbXB1dGVzIEdcKldsYW1iZGEsIHdoZXJlIFcgYXJlIHRoZSBib2R5IHZlbG9jaXRpZXMKICAgICAgICogQG1ldGhvZCBjb21wdXRlR1dsYW1iZGEKICAgICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICAgKi8KICAgICAgY29tcHV0ZUdXbGFtYmRhOiBmdW5jdGlvbiAoKSB7CiAgICAgICAgdmFyIEcgPSB0aGlzLkcsCiAgICAgICAgICAgIGJpID0gdGhpcy5ib2R5QSwKICAgICAgICAgICAgYmogPSB0aGlzLmJvZHlCLAogICAgICAgICAgICB2aSA9IGJpLnZsYW1iZGEsCiAgICAgICAgICAgIHZqID0gYmoudmxhbWJkYSwKICAgICAgICAgICAgd2kgPSBiaS53bGFtYmRhLAogICAgICAgICAgICB3aiA9IGJqLndsYW1iZGE7CiAgICAgICAgcmV0dXJuIHRoaXMuZ211bHQoRywgdmksIHdpLCB2aiwgd2opOwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIENvbXB1dGVzIEdcKmludihNKVwqZiwgd2hlcmUgTSBpcyB0aGUgbWFzcyBtYXRyaXggd2l0aCBkaWFnb25hbCBibG9ja3MgZm9yIGVhY2ggYm9keSwgYW5kIGYgYXJlIHRoZSBmb3JjZXMgb24gdGhlIGJvZGllcy4KICAgICAgICogQG1ldGhvZCBjb21wdXRlR2lNZgogICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgICAqLwogICAgICBjb21wdXRlR2lNZjogZnVuY3Rpb24gKCkgewogICAgICAgIHZhciBiaSA9IHRoaXMuYm9keUEsCiAgICAgICAgICAgIGJqID0gdGhpcy5ib2R5QiwKICAgICAgICAgICAgZmkgPSBiaS5mb3JjZSwKICAgICAgICAgICAgdGkgPSBiaS5hbmd1bGFyRm9yY2UsCiAgICAgICAgICAgIGZqID0gYmouZm9yY2UsCiAgICAgICAgICAgIHRqID0gYmouYW5ndWxhckZvcmNlLAogICAgICAgICAgICBpbnZNYXNzaSA9IGJpLmludk1hc3NTb2x2ZSwKICAgICAgICAgICAgaW52TWFzc2ogPSBiai5pbnZNYXNzU29sdmUsCiAgICAgICAgICAgIGludklpID0gYmkuaW52SW5lcnRpYVNvbHZlLAogICAgICAgICAgICBpbnZJaiA9IGJqLmludkluZXJ0aWFTb2x2ZSwKICAgICAgICAgICAgRyA9IHRoaXMuRzsKICAgICAgICBzY2FsZSQxKGlNZmksIGZpLCBpbnZNYXNzaSk7CiAgICAgICAgbXVsdGlwbHkoaU1maSwgYmkubWFzc011bHRpcGxpZXIsIGlNZmkpOwogICAgICAgIHNjYWxlJDEoaU1maiwgZmosIGludk1hc3NqKTsKICAgICAgICBtdWx0aXBseShpTWZqLCBiai5tYXNzTXVsdGlwbGllciwgaU1maik7CiAgICAgICAgcmV0dXJuIHRoaXMuZ211bHQoRywgaU1maSwgdGkgKiBpbnZJaSwgaU1maiwgdGogKiBpbnZJaik7CiAgICAgIH0sCgogICAgICAvKioKICAgICAgICogQ29tcHV0ZXMgR1wqaW52KE0pXCpHJwogICAgICAgKiBAbWV0aG9kIGNvbXB1dGVHaU1HdAogICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgICAqLwogICAgICBjb21wdXRlR2lNR3Q6IGZ1bmN0aW9uICgpIHsKICAgICAgICB2YXIgYmkgPSB0aGlzLmJvZHlBLAogICAgICAgICAgICBiaiA9IHRoaXMuYm9keUIsCiAgICAgICAgICAgIGludk1hc3NpID0gYmkuaW52TWFzc1NvbHZlLAogICAgICAgICAgICBpbnZNYXNzaiA9IGJqLmludk1hc3NTb2x2ZSwKICAgICAgICAgICAgaW52SWkgPSBiaS5pbnZJbmVydGlhU29sdmUsCiAgICAgICAgICAgIGludklqID0gYmouaW52SW5lcnRpYVNvbHZlLAogICAgICAgICAgICBHID0gdGhpcy5HOwogICAgICAgIHJldHVybiBHWzBdICogR1swXSAqIGludk1hc3NpICogYmkubWFzc011bHRpcGxpZXJbMF0gKyBHWzFdICogR1sxXSAqIGludk1hc3NpICogYmkubWFzc011bHRpcGxpZXJbMV0gKyBHWzJdICogR1syXSAqIGludklpICsgR1szXSAqIEdbM10gKiBpbnZNYXNzaiAqIGJqLm1hc3NNdWx0aXBsaWVyWzBdICsgR1s0XSAqIEdbNF0gKiBpbnZNYXNzaiAqIGJqLm1hc3NNdWx0aXBsaWVyWzFdICsgR1s1XSAqIEdbNV0gKiBpbnZJajsKICAgICAgfSwKCiAgICAgIC8qKgogICAgICAgKiBBZGQgY29uc3RyYWludCB2ZWxvY2l0eSB0byB0aGUgYm9kaWVzLgogICAgICAgKiBAbWV0aG9kIGFkZFRvV2xhbWJkYQogICAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFsYW1iZGEKICAgICAgICovCiAgICAgIGFkZFRvV2xhbWJkYTogZnVuY3Rpb24gKGRlbHRhbGFtYmRhKSB7CiAgICAgICAgdmFyIGJpID0gdGhpcy5ib2R5QSwKICAgICAgICAgICAgYmogPSB0aGlzLmJvZHlCLAogICAgICAgICAgICBpbnZNYXNzaSA9IGJpLmludk1hc3NTb2x2ZSwKICAgICAgICAgICAgaW52TWFzc2ogPSBiai5pbnZNYXNzU29sdmUsCiAgICAgICAgICAgIGludklpID0gYmkuaW52SW5lcnRpYVNvbHZlLAogICAgICAgICAgICBpbnZJaiA9IGJqLmludkluZXJ0aWFTb2x2ZSwKICAgICAgICAgICAgRyA9IHRoaXMuRzsgLy8gdl9sYW1iZGEgPSBHICogaW52KE0pICogZGVsdGFfbGFtYmRhCgogICAgICAgIGFkZFRvVkxhbWJkYShiaS52bGFtYmRhLCBHWzBdLCBHWzFdLCBpbnZNYXNzaSwgZGVsdGFsYW1iZGEsIGJpLm1hc3NNdWx0aXBsaWVyKTsKICAgICAgICBiaS53bGFtYmRhICs9IGludklpICogR1syXSAqIGRlbHRhbGFtYmRhOwogICAgICAgIGFkZFRvVkxhbWJkYShiai52bGFtYmRhLCBHWzNdLCBHWzRdLCBpbnZNYXNzaiwgZGVsdGFsYW1iZGEsIGJqLm1hc3NNdWx0aXBsaWVyKTsKICAgICAgICBiai53bGFtYmRhICs9IGludklqICogR1s1XSAqIGRlbHRhbGFtYmRhOwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIENvbXB1dGUgdGhlIGRlbm9taW5hdG9yIHBhcnQgb2YgdGhlIFNQT09LIGVxdWF0aW9uOiBDID0gR1wqaW52KE0pXCpHJyArIGVwcwogICAgICAgKiBAbWV0aG9kIGNvbXB1dGVJbnZDCiAgICAgICAqIEBwYXJhbSAge051bWJlcn0gZXBzCiAgICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAgICovCiAgICAgIGNvbXB1dGVJbnZDOiBmdW5jdGlvbiAoZXBzKSB7CiAgICAgICAgdmFyIGludkMgPSAxIC8gKHRoaXMuY29tcHV0ZUdpTUd0KCkgKyBlcHMpOwogICAgICAgIHJldHVybiBpbnZDOwogICAgICB9CiAgICB9OwoKICAgIGZ1bmN0aW9uIGFkZFRvVkxhbWJkYSh2bGFtYmRhLCBHeCwgR3ksIGludk1hc3MsIGRlbHRhbGFtYmRhLCBtYXNzTXVsdGlwbGllcikgewogICAgICB2bGFtYmRhWzBdICs9IEd4ICogaW52TWFzcyAqIGRlbHRhbGFtYmRhICogbWFzc011bHRpcGxpZXJbMF07CiAgICAgIHZsYW1iZGFbMV0gKz0gR3kgKiBpbnZNYXNzICogZGVsdGFsYW1iZGEgKiBtYXNzTXVsdGlwbGllclsxXTsKICAgIH0KCiAgICB2YXIgRXF1YXRpb24kOSA9IEVxdWF0aW9uXzE7CgogICAgdmFyIEFuZ2xlTG9ja0VxdWF0aW9uXzEgPSBBbmdsZUxvY2tFcXVhdGlvbiQxOwogICAgLyoqCiAgICAgKiBMb2NrcyB0aGUgcmVsYXRpdmUgYW5nbGUgYmV0d2VlbiB0d28gYm9kaWVzLiBUaGUgY29uc3RyYWludCB0cmllcyB0byBrZWVwIHRoZSBkb3QgcHJvZHVjdCBiZXR3ZWVuIHR3byB2ZWN0b3JzLCBsb2NhbCBpbiBlYWNoIGJvZHksIHRvIHplcm8uIFRoZSBsb2NhbCBhbmdsZSBpbiBib2R5IGkgaXMgYSBwYXJhbWV0ZXIuCiAgICAgKgogICAgICogQGNsYXNzIEFuZ2xlTG9ja0VxdWF0aW9uCiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBleHRlbmRzIEVxdWF0aW9uCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlCCiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuYW5nbGVdIEFuZ2xlIHRvIGFkZCB0byB0aGUgbG9jYWwgdmVjdG9yIGluIGJvZHkgQS4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5yYXRpb10gR2VhciByYXRpbwogICAgICovCgogICAgZnVuY3Rpb24gQW5nbGVMb2NrRXF1YXRpb24kMShib2R5QSwgYm9keUIsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIEVxdWF0aW9uJDkuY2FsbCh0aGlzLCBib2R5QSwgYm9keUIsIC1OdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFKTsKICAgICAgdGhpcy5hbmdsZSA9IG9wdGlvbnMuYW5nbGUgfHwgMDsKICAgICAgLyoqCiAgICAgICAqIFRoZSBnZWFyIHJhdGlvLgogICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmF0aW8KICAgICAgICogQHJlYWRvbmx5CiAgICAgICAqIEBzZWUgc2V0UmF0aW8KICAgICAgICovCgogICAgICB0aGlzLnJhdGlvID0gb3B0aW9ucy5yYXRpbyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5yYXRpbyA6IDE7CiAgICAgIHRoaXMuc2V0UmF0aW8odGhpcy5yYXRpbyk7CiAgICB9CgogICAgQW5nbGVMb2NrRXF1YXRpb24kMS5wcm90b3R5cGUgPSBuZXcgRXF1YXRpb24kOSgpOwogICAgQW5nbGVMb2NrRXF1YXRpb24kMS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBbmdsZUxvY2tFcXVhdGlvbiQxOwoKICAgIEFuZ2xlTG9ja0VxdWF0aW9uJDEucHJvdG90eXBlLmNvbXB1dGVHcSA9IGZ1bmN0aW9uICgpIHsKICAgICAgcmV0dXJuIHRoaXMucmF0aW8gKiB0aGlzLmJvZHlBLmFuZ2xlIC0gdGhpcy5ib2R5Qi5hbmdsZSArIHRoaXMuYW5nbGU7CiAgICB9OwogICAgLyoqCiAgICAgKiBTZXQgdGhlIGdlYXIgcmF0aW8gZm9yIHRoaXMgZXF1YXRpb24KICAgICAqIEBtZXRob2Qgc2V0UmF0aW8KICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbwogICAgICovCgoKICAgIEFuZ2xlTG9ja0VxdWF0aW9uJDEucHJvdG90eXBlLnNldFJhdGlvID0gZnVuY3Rpb24gKHJhdGlvKSB7CiAgICAgIHZhciBHID0gdGhpcy5HOwogICAgICBHWzJdID0gcmF0aW87CiAgICAgIEdbNV0gPSAtMTsKICAgICAgdGhpcy5yYXRpbyA9IHJhdGlvOwogICAgfTsKICAgIC8qKgogICAgICogU2V0IHRoZSBtYXggZm9yY2UgZm9yIHRoZSBlcXVhdGlvbi4KICAgICAqIEBtZXRob2Qgc2V0TWF4VG9ycXVlCiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG9ycXVlCiAgICAgKi8KCgogICAgQW5nbGVMb2NrRXF1YXRpb24kMS5wcm90b3R5cGUuc2V0TWF4VG9ycXVlID0gZnVuY3Rpb24gKHRvcnF1ZSkgewogICAgICB0aGlzLm1heEZvcmNlID0gdG9ycXVlOwogICAgICB0aGlzLm1pbkZvcmNlID0gLXRvcnF1ZTsKICAgIH07CgogICAgdmFyIHNyYyA9IHsKICAgICAgZGVjb21wOiBwb2x5Z29uRGVjb21wLAogICAgICBxdWlja0RlY29tcDogcG9seWdvblF1aWNrRGVjb21wLAogICAgICBpc1NpbXBsZTogcG9seWdvbklzU2ltcGxlLAogICAgICByZW1vdmVDb2xsaW5lYXJQb2ludHM6IHBvbHlnb25SZW1vdmVDb2xsaW5lYXJQb2ludHMsCiAgICAgIG1ha2VDQ1c6IHBvbHlnb25NYWtlQ0NXCiAgICB9OwogICAgLyoqCiAgICAgKiBDb21wdXRlIHRoZSBpbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGluZXMuCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIGxpbmVJbnQKICAgICAqIEBwYXJhbSAge0FycmF5fSAgbDEgICAgICAgICAgTGluZSB2ZWN0b3IgMQogICAgICogQHBhcmFtICB7QXJyYXl9ICBsMiAgICAgICAgICBMaW5lIHZlY3RvciAyCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHByZWNpc2lvbiAgIFByZWNpc2lvbiB0byB1c2Ugd2hlbiBjaGVja2luZyBpZiB0aGUgbGluZXMgYXJlIHBhcmFsbGVsCiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgIFRoZSBpbnRlcnNlY3Rpb24gcG9pbnQuCiAgICAgKi8KCiAgICBmdW5jdGlvbiBsaW5lSW50KGwxLCBsMiwgcHJlY2lzaW9uKSB7CiAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbiB8fCAwOwogICAgICB2YXIgaSA9IFswLCAwXTsgLy8gcG9pbnQKCiAgICAgIHZhciBhMSwgYjEsIGMxLCBhMiwgYjIsIGMyLCBkZXQ7IC8vIHNjYWxhcnMKCiAgICAgIGExID0gbDFbMV1bMV0gLSBsMVswXVsxXTsKICAgICAgYjEgPSBsMVswXVswXSAtIGwxWzFdWzBdOwogICAgICBjMSA9IGExICogbDFbMF1bMF0gKyBiMSAqIGwxWzBdWzFdOwogICAgICBhMiA9IGwyWzFdWzFdIC0gbDJbMF1bMV07CiAgICAgIGIyID0gbDJbMF1bMF0gLSBsMlsxXVswXTsKICAgICAgYzIgPSBhMiAqIGwyWzBdWzBdICsgYjIgKiBsMlswXVsxXTsKICAgICAgZGV0ID0gYTEgKiBiMiAtIGEyICogYjE7CgogICAgICBpZiAoIXNjYWxhcl9lcShkZXQsIDAsIHByZWNpc2lvbikpIHsKICAgICAgICAvLyBsaW5lcyBhcmUgbm90IHBhcmFsbGVsCiAgICAgICAgaVswXSA9IChiMiAqIGMxIC0gYjEgKiBjMikgLyBkZXQ7CiAgICAgICAgaVsxXSA9IChhMSAqIGMyIC0gYTIgKiBjMSkgLyBkZXQ7CiAgICAgIH0KCiAgICAgIHJldHVybiBpOwogICAgfQogICAgLyoqCiAgICAgKiBDaGVja3MgaWYgdHdvIGxpbmUgc2VnbWVudHMgaW50ZXJzZWN0cy4KICAgICAqIEBtZXRob2Qgc2VnbWVudHNJbnRlcnNlY3QKICAgICAqIEBwYXJhbSB7QXJyYXl9IHAxIFRoZSBzdGFydCB2ZXJ0ZXggb2YgdGhlIGZpcnN0IGxpbmUgc2VnbWVudC4KICAgICAqIEBwYXJhbSB7QXJyYXl9IHAyIFRoZSBlbmQgdmVydGV4IG9mIHRoZSBmaXJzdCBsaW5lIHNlZ21lbnQuCiAgICAgKiBAcGFyYW0ge0FycmF5fSBxMSBUaGUgc3RhcnQgdmVydGV4IG9mIHRoZSBzZWNvbmQgbGluZSBzZWdtZW50LgogICAgICogQHBhcmFtIHtBcnJheX0gcTIgVGhlIGVuZCB2ZXJ0ZXggb2YgdGhlIHNlY29uZCBsaW5lIHNlZ21lbnQuCiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSB0d28gbGluZSBzZWdtZW50cyBpbnRlcnNlY3QKICAgICAqLwoKCiAgICBmdW5jdGlvbiBsaW5lU2VnbWVudHNJbnRlcnNlY3QocDEsIHAyLCBxMSwgcTIpIHsKICAgICAgdmFyIGR4ID0gcDJbMF0gLSBwMVswXTsKICAgICAgdmFyIGR5ID0gcDJbMV0gLSBwMVsxXTsKICAgICAgdmFyIGRhID0gcTJbMF0gLSBxMVswXTsKICAgICAgdmFyIGRiID0gcTJbMV0gLSBxMVsxXTsgLy8gc2VnbWVudHMgYXJlIHBhcmFsbGVsCgogICAgICBpZiAoZGEgKiBkeSAtIGRiICogZHggPT09IDApIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KCiAgICAgIHZhciBzID0gKGR4ICogKHExWzFdIC0gcDFbMV0pICsgZHkgKiAocDFbMF0gLSBxMVswXSkpIC8gKGRhICogZHkgLSBkYiAqIGR4KTsKICAgICAgdmFyIHQgPSAoZGEgKiAocDFbMV0gLSBxMVsxXSkgKyBkYiAqIChxMVswXSAtIHAxWzBdKSkgLyAoZGIgKiBkeCAtIGRhICogZHkpOwogICAgICByZXR1cm4gcyA+PSAwICYmIHMgPD0gMSAmJiB0ID49IDAgJiYgdCA8PSAxOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIGFyZWEgb2YgYSB0cmlhbmdsZSBzcGFubmVkIGJ5IHRoZSB0aHJlZSBnaXZlbiBwb2ludHMuIE5vdGUgdGhhdCB0aGUgYXJlYSB3aWxsIGJlIG5lZ2F0aXZlIGlmIHRoZSBwb2ludHMgYXJlIG5vdCBnaXZlbiBpbiBjb3VudGVyLWNsb2Nrd2lzZSBvcmRlci4KICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2QgYXJlYQogICAgICogQHBhcmFtICB7QXJyYXl9IGEKICAgICAqIEBwYXJhbSAge0FycmF5fSBiCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gYwogICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICovCgoKICAgIGZ1bmN0aW9uIHRyaWFuZ2xlQXJlYSQxKGEsIGIsIGMpIHsKICAgICAgcmV0dXJuIChiWzBdIC0gYVswXSkgKiAoY1sxXSAtIGFbMV0pIC0gKGNbMF0gLSBhWzBdKSAqIChiWzFdIC0gYVsxXSk7CiAgICB9CgogICAgZnVuY3Rpb24gaXNMZWZ0KGEsIGIsIGMpIHsKICAgICAgcmV0dXJuIHRyaWFuZ2xlQXJlYSQxKGEsIGIsIGMpID4gMDsKICAgIH0KCiAgICBmdW5jdGlvbiBpc0xlZnRPbihhLCBiLCBjKSB7CiAgICAgIHJldHVybiB0cmlhbmdsZUFyZWEkMShhLCBiLCBjKSA+PSAwOwogICAgfQoKICAgIGZ1bmN0aW9uIGlzUmlnaHQoYSwgYiwgYykgewogICAgICByZXR1cm4gdHJpYW5nbGVBcmVhJDEoYSwgYiwgYykgPCAwOwogICAgfQoKICAgIGZ1bmN0aW9uIGlzUmlnaHRPbihhLCBiLCBjKSB7CiAgICAgIHJldHVybiB0cmlhbmdsZUFyZWEkMShhLCBiLCBjKSA8PSAwOwogICAgfQoKICAgIHZhciB0bXBQb2ludDEgPSBbXSwKICAgICAgICB0bXBQb2ludDIgPSBbXTsKICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhyZWUgcG9pbnRzIGFyZSBjb2xsaW5lYXIKICAgICAqIEBtZXRob2QgY29sbGluZWFyCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gYQogICAgICogQHBhcmFtICB7QXJyYXl9IGIKICAgICAqIEBwYXJhbSAge0FycmF5fSBjCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IFt0aHJlc2hvbGRBbmdsZT0wXSBUaHJlc2hvbGQgYW5nbGUgdG8gdXNlIHdoZW4gY29tcGFyaW5nIHRoZSB2ZWN0b3JzLiBUaGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgcmVzdWx0aW5nIHZlY3RvcnMgaXMgbGVzcyB0aGFuIHRoaXMgdmFsdWUuIFVzZSB6ZXJvIGZvciBtYXggcHJlY2lzaW9uLgogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKICAgIGZ1bmN0aW9uIGNvbGxpbmVhcihhLCBiLCBjLCB0aHJlc2hvbGRBbmdsZSkgewogICAgICBpZiAoIXRocmVzaG9sZEFuZ2xlKSB7CiAgICAgICAgcmV0dXJuIHRyaWFuZ2xlQXJlYSQxKGEsIGIsIGMpID09PSAwOwogICAgICB9IGVsc2UgewogICAgICAgIHZhciBhYiA9IHRtcFBvaW50MSwKICAgICAgICAgICAgYmMgPSB0bXBQb2ludDI7CiAgICAgICAgYWJbMF0gPSBiWzBdIC0gYVswXTsKICAgICAgICBhYlsxXSA9IGJbMV0gLSBhWzFdOwogICAgICAgIGJjWzBdID0gY1swXSAtIGJbMF07CiAgICAgICAgYmNbMV0gPSBjWzFdIC0gYlsxXTsKICAgICAgICB2YXIgZG90ID0gYWJbMF0gKiBiY1swXSArIGFiWzFdICogYmNbMV0sCiAgICAgICAgICAgIG1hZ0EgPSBNYXRoLnNxcnQoYWJbMF0gKiBhYlswXSArIGFiWzFdICogYWJbMV0pLAogICAgICAgICAgICBtYWdCID0gTWF0aC5zcXJ0KGJjWzBdICogYmNbMF0gKyBiY1sxXSAqIGJjWzFdKSwKICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmFjb3MoZG90IC8gKG1hZ0EgKiBtYWdCKSk7CiAgICAgICAgcmV0dXJuIGFuZ2xlIDwgdGhyZXNob2xkQW5nbGU7CiAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBzcWRpc3QoYSwgYikgewogICAgICB2YXIgZHggPSBiWzBdIC0gYVswXTsKICAgICAgdmFyIGR5ID0gYlsxXSAtIGFbMV07CiAgICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGEgdmVydGV4IGF0IHBvc2l0aW9uIGkuIEl0IGRvZXMgbm90IG1hdHRlciBpZiBpIGlzIG91dCBvZiBib3VuZHMsIHRoaXMgZnVuY3Rpb24gd2lsbCBqdXN0IGN5Y2xlLgogICAgICogQG1ldGhvZCBhdAogICAgICogQHBhcmFtICB7TnVtYmVyfSBpCiAgICAgKiBAcmV0dXJuIHtBcnJheX0KICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uQXQocG9seWdvbiwgaSkgewogICAgICB2YXIgcyA9IHBvbHlnb24ubGVuZ3RoOwogICAgICByZXR1cm4gcG9seWdvbltpIDwgMCA/IGkgJSBzICsgcyA6IGkgJSBzXTsKICAgIH0KICAgIC8qKgogICAgICogQ2xlYXIgdGhlIHBvbHlnb24gZGF0YQogICAgICogQG1ldGhvZCBjbGVhcgogICAgICogQHJldHVybiB7QXJyYXl9CiAgICAgKi8KCgogICAgZnVuY3Rpb24gcG9seWdvbkNsZWFyKHBvbHlnb24pIHsKICAgICAgcG9seWdvbi5sZW5ndGggPSAwOwogICAgfQogICAgLyoqCiAgICAgKiBBcHBlbmQgcG9pbnRzICJmcm9tIiB0byAidG8iLTEgZnJvbSBhbiBvdGhlciBwb2x5Z29uICJwb2x5IiBvbnRvIHRoaXMgb25lLgogICAgICogQG1ldGhvZCBhcHBlbmQKICAgICAqIEBwYXJhbSB7UG9seWdvbn0gcG9seSBUaGUgcG9seWdvbiB0byBnZXQgcG9pbnRzIGZyb20uCiAgICAgKiBAcGFyYW0ge051bWJlcn0gIGZyb20gVGhlIHZlcnRleCBpbmRleCBpbiAicG9seSIuCiAgICAgKiBAcGFyYW0ge051bWJlcn0gIHRvIFRoZSBlbmQgdmVydGV4IGluZGV4IGluICJwb2x5Ii4gTm90ZSB0aGF0IHRoaXMgdmVydGV4IGlzIE5PVCBpbmNsdWRlZCB3aGVuIGFwcGVuZGluZy4KICAgICAqIEByZXR1cm4ge0FycmF5fQogICAgICovCgoKICAgIGZ1bmN0aW9uIHBvbHlnb25BcHBlbmQocG9seWdvbiwgcG9seSwgZnJvbSwgdG8pIHsKICAgICAgZm9yICh2YXIgaSA9IGZyb207IGkgPCB0bzsgaSsrKSB7CiAgICAgICAgcG9seWdvbi5wdXNoKHBvbHlbaV0pOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIE1ha2Ugc3VyZSB0aGF0IHRoZSBwb2x5Z29uIHZlcnRpY2VzIGFyZSBvcmRlcmVkIGNvdW50ZXItY2xvY2t3aXNlLgogICAgICogQG1ldGhvZCBtYWtlQ0NXCiAgICAgKi8KCgogICAgZnVuY3Rpb24gcG9seWdvbk1ha2VDQ1cocG9seWdvbikgewogICAgICB2YXIgYnIgPSAwLAogICAgICAgICAgdiA9IHBvbHlnb247IC8vIGZpbmQgYm90dG9tIHJpZ2h0IHBvaW50CgogICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvbHlnb24ubGVuZ3RoOyArK2kpIHsKICAgICAgICBpZiAodltpXVsxXSA8IHZbYnJdWzFdIHx8IHZbaV1bMV0gPT09IHZbYnJdWzFdICYmIHZbaV1bMF0gPiB2W2JyXVswXSkgewogICAgICAgICAgYnIgPSBpOwogICAgICAgIH0KICAgICAgfSAvLyByZXZlcnNlIHBvbHkgaWYgY2xvY2t3aXNlCgoKICAgICAgaWYgKCFpc0xlZnQocG9seWdvbkF0KHBvbHlnb24sIGJyIC0gMSksIHBvbHlnb25BdChwb2x5Z29uLCBiciksIHBvbHlnb25BdChwb2x5Z29uLCBiciArIDEpKSkgewogICAgICAgIHBvbHlnb25SZXZlcnNlKHBvbHlnb24pOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIFJldmVyc2UgdGhlIHZlcnRpY2VzIGluIHRoZSBwb2x5Z29uCiAgICAgKiBAbWV0aG9kIHJldmVyc2UKICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uUmV2ZXJzZShwb2x5Z29uKSB7CiAgICAgIHZhciB0bXAgPSBbXTsKICAgICAgdmFyIE4gPSBwb2x5Z29uLmxlbmd0aDsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSBOOyBpKyspIHsKICAgICAgICB0bXAucHVzaChwb2x5Z29uLnBvcCgpKTsKICAgICAgfQoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIHBvbHlnb25baV0gPSB0bXBbaV07CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQ2hlY2sgaWYgYSBwb2ludCBpbiB0aGUgcG9seWdvbiBpcyBhIHJlZmxleCBwb2ludAogICAgICogQG1ldGhvZCBpc1JlZmxleAogICAgICogQHBhcmFtICB7TnVtYmVyfSAgaQogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uSXNSZWZsZXgocG9seWdvbiwgaSkgewogICAgICByZXR1cm4gaXNSaWdodChwb2x5Z29uQXQocG9seWdvbiwgaSAtIDEpLCBwb2x5Z29uQXQocG9seWdvbiwgaSksIHBvbHlnb25BdChwb2x5Z29uLCBpICsgMSkpOwogICAgfQoKICAgIHZhciB0bXBMaW5lMSA9IFtdLAogICAgICAgIHRtcExpbmUyID0gW107CiAgICAvKioKICAgICAqIENoZWNrIGlmIHR3byB2ZXJ0aWNlcyBpbiB0aGUgcG9seWdvbiBjYW4gc2VlIGVhY2ggb3RoZXIKICAgICAqIEBtZXRob2QgY2FuU2VlCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGEgVmVydGV4IGluZGV4IDEKICAgICAqIEBwYXJhbSAge051bWJlcn0gYiBWZXJ0ZXggaW5kZXggMgogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKICAgIGZ1bmN0aW9uIHBvbHlnb25DYW5TZWUocG9seWdvbiwgYSwgYikgewogICAgICB2YXIgcCwKICAgICAgICAgIGRpc3QsCiAgICAgICAgICBsMSA9IHRtcExpbmUxLAogICAgICAgICAgbDIgPSB0bXBMaW5lMjsKCiAgICAgIGlmIChpc0xlZnRPbihwb2x5Z29uQXQocG9seWdvbiwgYSArIDEpLCBwb2x5Z29uQXQocG9seWdvbiwgYSksIHBvbHlnb25BdChwb2x5Z29uLCBiKSkgJiYgaXNSaWdodE9uKHBvbHlnb25BdChwb2x5Z29uLCBhIC0gMSksIHBvbHlnb25BdChwb2x5Z29uLCBhKSwgcG9seWdvbkF0KHBvbHlnb24sIGIpKSkgewogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfQoKICAgICAgZGlzdCA9IHNxZGlzdChwb2x5Z29uQXQocG9seWdvbiwgYSksIHBvbHlnb25BdChwb2x5Z29uLCBiKSk7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gcG9seWdvbi5sZW5ndGg7ICsraSkgewogICAgICAgIC8vIGZvciBlYWNoIGVkZ2UKICAgICAgICBpZiAoKGkgKyAxKSAlIHBvbHlnb24ubGVuZ3RoID09PSBhIHx8IGkgPT09IGEpIHsKICAgICAgICAgIC8vIGlnbm9yZSBpbmNpZGVudCBlZGdlcwogICAgICAgICAgY29udGludWU7CiAgICAgICAgfQoKICAgICAgICBpZiAoaXNMZWZ0T24ocG9seWdvbkF0KHBvbHlnb24sIGEpLCBwb2x5Z29uQXQocG9seWdvbiwgYiksIHBvbHlnb25BdChwb2x5Z29uLCBpICsgMSkpICYmIGlzUmlnaHRPbihwb2x5Z29uQXQocG9seWdvbiwgYSksIHBvbHlnb25BdChwb2x5Z29uLCBiKSwgcG9seWdvbkF0KHBvbHlnb24sIGkpKSkgewogICAgICAgICAgLy8gaWYgZGlhZyBpbnRlcnNlY3RzIGFuIGVkZ2UKICAgICAgICAgIGwxWzBdID0gcG9seWdvbkF0KHBvbHlnb24sIGEpOwogICAgICAgICAgbDFbMV0gPSBwb2x5Z29uQXQocG9seWdvbiwgYik7CiAgICAgICAgICBsMlswXSA9IHBvbHlnb25BdChwb2x5Z29uLCBpKTsKICAgICAgICAgIGwyWzFdID0gcG9seWdvbkF0KHBvbHlnb24sIGkgKyAxKTsKICAgICAgICAgIHAgPSBsaW5lSW50KGwxLCBsMik7CgogICAgICAgICAgaWYgKHNxZGlzdChwb2x5Z29uQXQocG9seWdvbiwgYSksIHApIDwgZGlzdCkgewogICAgICAgICAgICAvLyBpZiBlZGdlIGlzIGJsb2NraW5nIHZpc2liaWxpdHkgdG8gYgogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICAgIC8qKgogICAgICogQ29weSB0aGUgcG9seWdvbiBmcm9tIHZlcnRleCBpIHRvIHZlcnRleCBqLgogICAgICogQG1ldGhvZCBjb3B5CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGkKICAgICAqIEBwYXJhbSAge051bWJlcn0gagogICAgICogQHBhcmFtICB7UG9seWdvbn0gW3RhcmdldFBvbHldICAgT3B0aW9uYWwgdGFyZ2V0IHBvbHlnb24gdG8gc2F2ZSBpbi4KICAgICAqIEByZXR1cm4ge1BvbHlnb259ICAgICAgICAgICAgICAgIFRoZSByZXN1bHRpbmcgY29weS4KICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uQ29weShwb2x5Z29uLCBpLCBqLCB0YXJnZXRQb2x5KSB7CiAgICAgIHZhciBwID0gdGFyZ2V0UG9seSB8fCBbXTsKICAgICAgcG9seWdvbkNsZWFyKHApOwoKICAgICAgaWYgKGkgPCBqKSB7CiAgICAgICAgLy8gSW5zZXJ0IGFsbCB2ZXJ0aWNlcyBmcm9tIGkgdG8gagogICAgICAgIGZvciAodmFyIGsgPSBpOyBrIDw9IGo7IGsrKykgewogICAgICAgICAgcC5wdXNoKHBvbHlnb25ba10pOwogICAgICAgIH0KICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBJbnNlcnQgdmVydGljZXMgMCB0byBqCiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPD0gajsgaysrKSB7CiAgICAgICAgICBwLnB1c2gocG9seWdvbltrXSk7CiAgICAgICAgfSAvLyBJbnNlcnQgdmVydGljZXMgaSB0byBlbmQKCgogICAgICAgIGZvciAodmFyIGsgPSBpOyBrIDwgcG9seWdvbi5sZW5ndGg7IGsrKykgewogICAgICAgICAgcC5wdXNoKHBvbHlnb25ba10pOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIHA7CiAgICB9CiAgICAvKioKICAgICAqIERlY29tcG9zZXMgdGhlIHBvbHlnb24gaW50byBjb252ZXggcGllY2VzLiBSZXR1cm5zIGEgbGlzdCBvZiBlZGdlcyBbW3AxLHAyXSxbcDIscDNdLC4uLl0gdGhhdCBjdXRzIHRoZSBwb2x5Z29uLgogICAgICogTm90ZSB0aGF0IHRoaXMgYWxnb3JpdGhtIGhhcyBjb21wbGV4aXR5IE8oTl40KSBhbmQgd2lsbCBiZSB2ZXJ5IHNsb3cgZm9yIHBvbHlnb25zIHdpdGggbWFueSB2ZXJ0aWNlcy4KICAgICAqIEBtZXRob2QgZ2V0Q3V0RWRnZXMKICAgICAqIEByZXR1cm4ge0FycmF5fQogICAgICovCgoKICAgIGZ1bmN0aW9uIHBvbHlnb25HZXRDdXRFZGdlcyhwb2x5Z29uKSB7CiAgICAgIHZhciBtaW4gPSBbXSwKICAgICAgICAgIHRtcDEgPSBbXSwKICAgICAgICAgIHRtcDIgPSBbXSwKICAgICAgICAgIHRtcFBvbHkgPSBbXTsKICAgICAgdmFyIG5EaWFncyA9IE51bWJlci5NQVhfVkFMVUU7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvbHlnb24ubGVuZ3RoOyArK2kpIHsKICAgICAgICBpZiAocG9seWdvbklzUmVmbGV4KHBvbHlnb24sIGkpKSB7CiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBvbHlnb24ubGVuZ3RoOyArK2opIHsKICAgICAgICAgICAgaWYgKHBvbHlnb25DYW5TZWUocG9seWdvbiwgaSwgaikpIHsKICAgICAgICAgICAgICB0bXAxID0gcG9seWdvbkdldEN1dEVkZ2VzKHBvbHlnb25Db3B5KHBvbHlnb24sIGksIGosIHRtcFBvbHkpKTsKICAgICAgICAgICAgICB0bXAyID0gcG9seWdvbkdldEN1dEVkZ2VzKHBvbHlnb25Db3B5KHBvbHlnb24sIGosIGksIHRtcFBvbHkpKTsKCiAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0bXAyLmxlbmd0aDsgaysrKSB7CiAgICAgICAgICAgICAgICB0bXAxLnB1c2godG1wMltrXSk7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICBpZiAodG1wMS5sZW5ndGggPCBuRGlhZ3MpIHsKICAgICAgICAgICAgICAgIG1pbiA9IHRtcDE7CiAgICAgICAgICAgICAgICBuRGlhZ3MgPSB0bXAxLmxlbmd0aDsKICAgICAgICAgICAgICAgIG1pbi5wdXNoKFtwb2x5Z29uQXQocG9seWdvbiwgaSksIHBvbHlnb25BdChwb2x5Z29uLCBqKV0pOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG1pbjsKICAgIH0KICAgIC8qKgogICAgICogRGVjb21wb3NlcyB0aGUgcG9seWdvbiBpbnRvIG9uZSBvciBtb3JlIGNvbnZleCBzdWItUG9seWdvbnMuCiAgICAgKiBAbWV0aG9kIGRlY29tcAogICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9yIFBvbHlnb24gb2JqZWN0cy4KICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uRGVjb21wKHBvbHlnb24pIHsKICAgICAgdmFyIGVkZ2VzID0gcG9seWdvbkdldEN1dEVkZ2VzKHBvbHlnb24pOwoKICAgICAgaWYgKGVkZ2VzLmxlbmd0aCA+IDApIHsKICAgICAgICByZXR1cm4gcG9seWdvblNsaWNlKHBvbHlnb24sIGVkZ2VzKTsKICAgICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gW3BvbHlnb25dOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIFNsaWNlcyB0aGUgcG9seWdvbiBnaXZlbiBvbmUgb3IgbW9yZSBjdXQgZWRnZXMuIElmIGdpdmVuIG9uZSwgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0d28gcG9seWdvbnMgKGZhbHNlIG9uIGZhaWx1cmUpLiBJZiBtYW55LCBhbiBhcnJheSBvZiBwb2x5Z29ucy4KICAgICAqIEBtZXRob2Qgc2xpY2UKICAgICAqIEBwYXJhbSB7QXJyYXl9IGN1dEVkZ2VzIEEgbGlzdCBvZiBlZGdlcywgYXMgcmV0dXJuZWQgYnkgLmdldEN1dEVkZ2VzKCkKICAgICAqIEByZXR1cm4ge0FycmF5fQogICAgICovCgoKICAgIGZ1bmN0aW9uIHBvbHlnb25TbGljZShwb2x5Z29uLCBjdXRFZGdlcykgewogICAgICBpZiAoY3V0RWRnZXMubGVuZ3RoID09PSAwKSB7CiAgICAgICAgcmV0dXJuIFtwb2x5Z29uXTsKICAgICAgfQoKICAgICAgaWYgKGN1dEVkZ2VzIGluc3RhbmNlb2YgQXJyYXkgJiYgY3V0RWRnZXMubGVuZ3RoICYmIGN1dEVkZ2VzWzBdIGluc3RhbmNlb2YgQXJyYXkgJiYgY3V0RWRnZXNbMF0ubGVuZ3RoID09PSAyICYmIGN1dEVkZ2VzWzBdWzBdIGluc3RhbmNlb2YgQXJyYXkpIHsKICAgICAgICB2YXIgcG9seXMgPSBbcG9seWdvbl07CgogICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3V0RWRnZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIHZhciBjdXRFZGdlID0gY3V0RWRnZXNbaV07IC8vIEN1dCBhbGwgcG9seXMKCiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBvbHlzLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICAgIHZhciBwb2x5ID0gcG9seXNbal07CiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwb2x5Z29uU2xpY2UocG9seSwgY3V0RWRnZSk7CgogICAgICAgICAgICBpZiAocmVzdWx0KSB7CiAgICAgICAgICAgICAgLy8gRm91bmQgcG9seSEgQ3V0IGFuZCBxdWl0CiAgICAgICAgICAgICAgcG9seXMuc3BsaWNlKGosIDEpOwogICAgICAgICAgICAgIHBvbHlzLnB1c2gocmVzdWx0WzBdLCByZXN1bHRbMV0pOwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gcG9seXM7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgLy8gV2FzIGdpdmVuIG9uZSBlZGdlCiAgICAgICAgdmFyIGN1dEVkZ2UgPSBjdXRFZGdlczsKICAgICAgICB2YXIgaSA9IHBvbHlnb24uaW5kZXhPZihjdXRFZGdlWzBdKTsKICAgICAgICB2YXIgaiA9IHBvbHlnb24uaW5kZXhPZihjdXRFZGdlWzFdKTsKCiAgICAgICAgaWYgKGkgIT09IC0xICYmIGogIT09IC0xKSB7CiAgICAgICAgICByZXR1cm4gW3BvbHlnb25Db3B5KHBvbHlnb24sIGksIGopLCBwb2x5Z29uQ29weShwb2x5Z29uLCBqLCBpKV07CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQ2hlY2tzIHRoYXQgdGhlIGxpbmUgc2VnbWVudHMgb2YgdGhpcyBwb2x5Z29uIGRvIG5vdCBpbnRlcnNlY3QgZWFjaCBvdGhlci4KICAgICAqIEBtZXRob2QgaXNTaW1wbGUKICAgICAqIEBwYXJhbSAge0FycmF5fSBwYXRoIEFuIGFycmF5IG9mIHZlcnRpY2VzIGUuZy4gW1swLDBdLFswLDFdLC4uLl0KICAgICAqIEByZXR1cm4ge0Jvb2xlYW59CiAgICAgKiBAdG9kbyBTaG91bGQgaXQgY2hlY2sgYWxsIHNlZ21lbnRzIHdpdGggYWxsIG90aGVycz8KICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uSXNTaW1wbGUocG9seWdvbikgewogICAgICB2YXIgcGF0aCA9IHBvbHlnb24sCiAgICAgICAgICBpOyAvLyBDaGVjawoKICAgICAgZm9yIChpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7CiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpIC0gMTsgaisrKSB7CiAgICAgICAgICBpZiAobGluZVNlZ21lbnRzSW50ZXJzZWN0KHBhdGhbaV0sIHBhdGhbaSArIDFdLCBwYXRoW2pdLCBwYXRoW2ogKyAxXSkpIHsKICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSAvLyBDaGVjayB0aGUgc2VnbWVudCBiZXR3ZWVuIHRoZSBsYXN0IGFuZCB0aGUgZmlyc3QgcG9pbnQgdG8gYWxsIG90aGVycwoKCiAgICAgIGZvciAoaSA9IDE7IGkgPCBwYXRoLmxlbmd0aCAtIDI7IGkrKykgewogICAgICAgIGlmIChsaW5lU2VnbWVudHNJbnRlcnNlY3QocGF0aFswXSwgcGF0aFtwYXRoLmxlbmd0aCAtIDFdLCBwYXRoW2ldLCBwYXRoW2kgKyAxXSkpIHsKICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldEludGVyc2VjdGlvblBvaW50KHAxLCBwMiwgcTEsIHEyLCBkZWx0YSkgewogICAgICBkZWx0YSA9IGRlbHRhIHx8IDA7CiAgICAgIHZhciBhMSA9IHAyWzFdIC0gcDFbMV07CiAgICAgIHZhciBiMSA9IHAxWzBdIC0gcDJbMF07CiAgICAgIHZhciBjMSA9IGExICogcDFbMF0gKyBiMSAqIHAxWzFdOwogICAgICB2YXIgYTIgPSBxMlsxXSAtIHExWzFdOwogICAgICB2YXIgYjIgPSBxMVswXSAtIHEyWzBdOwogICAgICB2YXIgYzIgPSBhMiAqIHExWzBdICsgYjIgKiBxMVsxXTsKICAgICAgdmFyIGRldCA9IGExICogYjIgLSBhMiAqIGIxOwoKICAgICAgaWYgKCFzY2FsYXJfZXEoZGV0LCAwLCBkZWx0YSkpIHsKICAgICAgICByZXR1cm4gWyhiMiAqIGMxIC0gYjEgKiBjMikgLyBkZXQsIChhMSAqIGMyIC0gYTIgKiBjMSkgLyBkZXRdOwogICAgICB9IGVsc2UgewogICAgICAgIHJldHVybiBbMCwgMF07CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogUXVpY2tseSBkZWNvbXBvc2UgdGhlIFBvbHlnb24gaW50byBjb252ZXggc3ViLXBvbHlnb25zLgogICAgICogQG1ldGhvZCBxdWlja0RlY29tcAogICAgICogQHBhcmFtICB7QXJyYXl9IHJlc3VsdAogICAgICogQHBhcmFtICB7QXJyYXl9IFtyZWZsZXhWZXJ0aWNlc10KICAgICAqIEBwYXJhbSAge0FycmF5fSBbc3RlaW5lclBvaW50c10KICAgICAqIEBwYXJhbSAge051bWJlcn0gW2RlbHRhXQogICAgICogQHBhcmFtICB7TnVtYmVyfSBbbWF4bGV2ZWxdCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IFtsZXZlbF0KICAgICAqIEByZXR1cm4ge0FycmF5fQogICAgICovCgoKICAgIGZ1bmN0aW9uIHBvbHlnb25RdWlja0RlY29tcChwb2x5Z29uLCByZXN1bHQsIHJlZmxleFZlcnRpY2VzLCBzdGVpbmVyUG9pbnRzLCBkZWx0YSwgbWF4bGV2ZWwsIGxldmVsKSB7CiAgICAgIG1heGxldmVsID0gbWF4bGV2ZWwgfHwgMTAwOwogICAgICBsZXZlbCA9IGxldmVsIHx8IDA7CiAgICAgIGRlbHRhID0gZGVsdGEgfHwgMjU7CiAgICAgIHJlc3VsdCA9IHR5cGVvZiByZXN1bHQgIT09ICJ1bmRlZmluZWQiID8gcmVzdWx0IDogW107CiAgICAgIHJlZmxleFZlcnRpY2VzID0gcmVmbGV4VmVydGljZXMgfHwgW107CiAgICAgIHN0ZWluZXJQb2ludHMgPSBzdGVpbmVyUG9pbnRzIHx8IFtdOwogICAgICB2YXIgdXBwZXJJbnQgPSBbMCwgMF0sCiAgICAgICAgICBsb3dlckludCA9IFswLCAwXSwKICAgICAgICAgIHAgPSBbMCwgMF07IC8vIFBvaW50cwoKICAgICAgdmFyIHVwcGVyRGlzdCA9IDAsCiAgICAgICAgICBsb3dlckRpc3QgPSAwLAogICAgICAgICAgZCA9IDAsCiAgICAgICAgICBjbG9zZXN0RGlzdCA9IDA7IC8vIHNjYWxhcnMKCiAgICAgIHZhciB1cHBlckluZGV4ID0gMCwKICAgICAgICAgIGxvd2VySW5kZXggPSAwLAogICAgICAgICAgY2xvc2VzdEluZGV4ID0gMDsgLy8gSW50ZWdlcnMKCiAgICAgIHZhciBsb3dlclBvbHkgPSBbXSwKICAgICAgICAgIHVwcGVyUG9seSA9IFtdOyAvLyBwb2x5Z29ucwoKICAgICAgdmFyIHBvbHkgPSBwb2x5Z29uLAogICAgICAgICAgdiA9IHBvbHlnb247CgogICAgICBpZiAodi5sZW5ndGggPCAzKSB7CiAgICAgICAgcmV0dXJuIHJlc3VsdDsKICAgICAgfQoKICAgICAgbGV2ZWwrKzsKCiAgICAgIGlmIChsZXZlbCA+IG1heGxldmVsKSB7CiAgICAgICAgY29uc29sZS53YXJuKCJxdWlja0RlY29tcDogbWF4IGxldmVsICgiICsgbWF4bGV2ZWwgKyAiKSByZWFjaGVkLiIpOwogICAgICAgIHJldHVybiByZXN1bHQ7CiAgICAgIH0KCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9seWdvbi5sZW5ndGg7ICsraSkgewogICAgICAgIGlmIChwb2x5Z29uSXNSZWZsZXgocG9seSwgaSkpIHsKICAgICAgICAgIHJlZmxleFZlcnRpY2VzLnB1c2gocG9seVtpXSk7CiAgICAgICAgICB1cHBlckRpc3QgPSBsb3dlckRpc3QgPSBOdW1iZXIuTUFYX1ZBTFVFOwoKICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcG9seWdvbi5sZW5ndGg7ICsraikgewogICAgICAgICAgICBpZiAoaXNMZWZ0KHBvbHlnb25BdChwb2x5LCBpIC0gMSksIHBvbHlnb25BdChwb2x5LCBpKSwgcG9seWdvbkF0KHBvbHksIGopKSAmJiBpc1JpZ2h0T24ocG9seWdvbkF0KHBvbHksIGkgLSAxKSwgcG9seWdvbkF0KHBvbHksIGkpLCBwb2x5Z29uQXQocG9seSwgaiAtIDEpKSkgewogICAgICAgICAgICAgIC8vIGlmIGxpbmUgaW50ZXJzZWN0cyB3aXRoIGFuIGVkZ2UKICAgICAgICAgICAgICBwID0gZ2V0SW50ZXJzZWN0aW9uUG9pbnQocG9seWdvbkF0KHBvbHksIGkgLSAxKSwgcG9seWdvbkF0KHBvbHksIGkpLCBwb2x5Z29uQXQocG9seSwgaiksIHBvbHlnb25BdChwb2x5LCBqIC0gMSkpOyAvLyBmaW5kIHRoZSBwb2ludCBvZiBpbnRlcnNlY3Rpb24KCiAgICAgICAgICAgICAgaWYgKGlzUmlnaHQocG9seWdvbkF0KHBvbHksIGkgKyAxKSwgcG9seWdvbkF0KHBvbHksIGkpLCBwKSkgewogICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGl0J3MgaW5zaWRlIHRoZSBwb2x5CiAgICAgICAgICAgICAgICBkID0gc3FkaXN0KHBvbHlbaV0sIHApOwoKICAgICAgICAgICAgICAgIGlmIChkIDwgbG93ZXJEaXN0KSB7CiAgICAgICAgICAgICAgICAgIC8vIGtlZXAgb25seSB0aGUgY2xvc2VzdCBpbnRlcnNlY3Rpb24KICAgICAgICAgICAgICAgICAgbG93ZXJEaXN0ID0gZDsKICAgICAgICAgICAgICAgICAgbG93ZXJJbnQgPSBwOwogICAgICAgICAgICAgICAgICBsb3dlckluZGV4ID0gajsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIGlmIChpc0xlZnQocG9seWdvbkF0KHBvbHksIGkgKyAxKSwgcG9seWdvbkF0KHBvbHksIGkpLCBwb2x5Z29uQXQocG9seSwgaiArIDEpKSAmJiBpc1JpZ2h0T24ocG9seWdvbkF0KHBvbHksIGkgKyAxKSwgcG9seWdvbkF0KHBvbHksIGkpLCBwb2x5Z29uQXQocG9seSwgaikpKSB7CiAgICAgICAgICAgICAgcCA9IGdldEludGVyc2VjdGlvblBvaW50KHBvbHlnb25BdChwb2x5LCBpICsgMSksIHBvbHlnb25BdChwb2x5LCBpKSwgcG9seWdvbkF0KHBvbHksIGopLCBwb2x5Z29uQXQocG9seSwgaiArIDEpKTsKCiAgICAgICAgICAgICAgaWYgKGlzTGVmdChwb2x5Z29uQXQocG9seSwgaSAtIDEpLCBwb2x5Z29uQXQocG9seSwgaSksIHApKSB7CiAgICAgICAgICAgICAgICBkID0gc3FkaXN0KHBvbHlbaV0sIHApOwoKICAgICAgICAgICAgICAgIGlmIChkIDwgdXBwZXJEaXN0KSB7CiAgICAgICAgICAgICAgICAgIHVwcGVyRGlzdCA9IGQ7CiAgICAgICAgICAgICAgICAgIHVwcGVySW50ID0gcDsKICAgICAgICAgICAgICAgICAgdXBwZXJJbmRleCA9IGo7CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICB9IC8vIGlmIHRoZXJlIGFyZSBubyB2ZXJ0aWNlcyB0byBjb25uZWN0IHRvLCBjaG9vc2UgYSBwb2ludCBpbiB0aGUgbWlkZGxlCgoKICAgICAgICAgIGlmIChsb3dlckluZGV4ID09PSAodXBwZXJJbmRleCArIDEpICUgcG9seWdvbi5sZW5ndGgpIHsKICAgICAgICAgICAgLy9jb25zb2xlLmxvZygiQ2FzZSAxOiBWZXJ0ZXgoIitpKyIpLCBsb3dlckluZGV4KCIrbG93ZXJJbmRleCsiKSwgdXBwZXJJbmRleCgiK3VwcGVySW5kZXgrIiksIHBvbHkuc2l6ZSgiK3BvbHlnb24ubGVuZ3RoKyIpIik7CiAgICAgICAgICAgIHBbMF0gPSAobG93ZXJJbnRbMF0gKyB1cHBlckludFswXSkgLyAyOwogICAgICAgICAgICBwWzFdID0gKGxvd2VySW50WzFdICsgdXBwZXJJbnRbMV0pIC8gMjsKICAgICAgICAgICAgc3RlaW5lclBvaW50cy5wdXNoKHApOwoKICAgICAgICAgICAgaWYgKGkgPCB1cHBlckluZGV4KSB7CiAgICAgICAgICAgICAgLy9sb3dlclBvbHkuaW5zZXJ0KGxvd2VyUG9seS5lbmQoKSwgcG9seS5iZWdpbigpICsgaSwgcG9seS5iZWdpbigpICsgdXBwZXJJbmRleCArIDEpOwogICAgICAgICAgICAgIHBvbHlnb25BcHBlbmQobG93ZXJQb2x5LCBwb2x5LCBpLCB1cHBlckluZGV4ICsgMSk7CiAgICAgICAgICAgICAgbG93ZXJQb2x5LnB1c2gocCk7CiAgICAgICAgICAgICAgdXBwZXJQb2x5LnB1c2gocCk7CgogICAgICAgICAgICAgIGlmIChsb3dlckluZGV4ICE9PSAwKSB7CiAgICAgICAgICAgICAgICAvL3VwcGVyUG9seS5pbnNlcnQodXBwZXJQb2x5LmVuZCgpLCBwb2x5LmJlZ2luKCkgKyBsb3dlckluZGV4LCBwb2x5LmVuZCgpKTsKICAgICAgICAgICAgICAgIHBvbHlnb25BcHBlbmQodXBwZXJQb2x5LCBwb2x5LCBsb3dlckluZGV4LCBwb2x5Lmxlbmd0aCk7CiAgICAgICAgICAgICAgfSAvL3VwcGVyUG9seS5pbnNlcnQodXBwZXJQb2x5LmVuZCgpLCBwb2x5LmJlZ2luKCksIHBvbHkuYmVnaW4oKSArIGkgKyAxKTsKCgogICAgICAgICAgICAgIHBvbHlnb25BcHBlbmQodXBwZXJQb2x5LCBwb2x5LCAwLCBpICsgMSk7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgaWYgKGkgIT09IDApIHsKICAgICAgICAgICAgICAgIC8vbG93ZXJQb2x5Lmluc2VydChsb3dlclBvbHkuZW5kKCksIHBvbHkuYmVnaW4oKSArIGksIHBvbHkuZW5kKCkpOwogICAgICAgICAgICAgICAgcG9seWdvbkFwcGVuZChsb3dlclBvbHksIHBvbHksIGksIHBvbHkubGVuZ3RoKTsKICAgICAgICAgICAgICB9IC8vbG93ZXJQb2x5Lmluc2VydChsb3dlclBvbHkuZW5kKCksIHBvbHkuYmVnaW4oKSwgcG9seS5iZWdpbigpICsgdXBwZXJJbmRleCArIDEpOwoKCiAgICAgICAgICAgICAgcG9seWdvbkFwcGVuZChsb3dlclBvbHksIHBvbHksIDAsIHVwcGVySW5kZXggKyAxKTsKICAgICAgICAgICAgICBsb3dlclBvbHkucHVzaChwKTsKICAgICAgICAgICAgICB1cHBlclBvbHkucHVzaChwKTsgLy91cHBlclBvbHkuaW5zZXJ0KHVwcGVyUG9seS5lbmQoKSwgcG9seS5iZWdpbigpICsgbG93ZXJJbmRleCwgcG9seS5iZWdpbigpICsgaSArIDEpOwoKICAgICAgICAgICAgICBwb2x5Z29uQXBwZW5kKHVwcGVyUG9seSwgcG9seSwgbG93ZXJJbmRleCwgaSArIDEpOwogICAgICAgICAgICB9CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAvLyBjb25uZWN0IHRvIHRoZSBjbG9zZXN0IHBvaW50IHdpdGhpbiB0aGUgdHJpYW5nbGUKICAgICAgICAgICAgLy9jb25zb2xlLmxvZygiQ2FzZSAyOiBWZXJ0ZXgoIitpKyIpLCBjbG9zZXN0SW5kZXgoIitjbG9zZXN0SW5kZXgrIiksIHBvbHkuc2l6ZSgiK3BvbHlnb24ubGVuZ3RoKyIpXG4iKTsKICAgICAgICAgICAgaWYgKGxvd2VySW5kZXggPiB1cHBlckluZGV4KSB7CiAgICAgICAgICAgICAgdXBwZXJJbmRleCArPSBwb2x5Z29uLmxlbmd0aDsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgY2xvc2VzdERpc3QgPSBOdW1iZXIuTUFYX1ZBTFVFOwoKICAgICAgICAgICAgaWYgKHVwcGVySW5kZXggPCBsb3dlckluZGV4KSB7CiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgZm9yICh2YXIgaiA9IGxvd2VySW5kZXg7IGogPD0gdXBwZXJJbmRleDsgKytqKSB7CiAgICAgICAgICAgICAgaWYgKGlzTGVmdE9uKHBvbHlnb25BdChwb2x5LCBpIC0gMSksIHBvbHlnb25BdChwb2x5LCBpKSwgcG9seWdvbkF0KHBvbHksIGopKSAmJiBpc1JpZ2h0T24ocG9seWdvbkF0KHBvbHksIGkgKyAxKSwgcG9seWdvbkF0KHBvbHksIGkpLCBwb2x5Z29uQXQocG9seSwgaikpKSB7CiAgICAgICAgICAgICAgICBkID0gc3FkaXN0KHBvbHlnb25BdChwb2x5LCBpKSwgcG9seWdvbkF0KHBvbHksIGopKTsKCiAgICAgICAgICAgICAgICBpZiAoZCA8IGNsb3Nlc3REaXN0KSB7CiAgICAgICAgICAgICAgICAgIGNsb3Nlc3REaXN0ID0gZDsKICAgICAgICAgICAgICAgICAgY2xvc2VzdEluZGV4ID0gaiAlIHBvbHlnb24ubGVuZ3RoOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQoKICAgICAgICAgICAgaWYgKGkgPCBjbG9zZXN0SW5kZXgpIHsKICAgICAgICAgICAgICBwb2x5Z29uQXBwZW5kKGxvd2VyUG9seSwgcG9seSwgaSwgY2xvc2VzdEluZGV4ICsgMSk7CgogICAgICAgICAgICAgIGlmIChjbG9zZXN0SW5kZXggIT09IDApIHsKICAgICAgICAgICAgICAgIHBvbHlnb25BcHBlbmQodXBwZXJQb2x5LCBwb2x5LCBjbG9zZXN0SW5kZXgsIHYubGVuZ3RoKTsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIHBvbHlnb25BcHBlbmQodXBwZXJQb2x5LCBwb2x5LCAwLCBpICsgMSk7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgaWYgKGkgIT09IDApIHsKICAgICAgICAgICAgICAgIHBvbHlnb25BcHBlbmQobG93ZXJQb2x5LCBwb2x5LCBpLCB2Lmxlbmd0aCk7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICBwb2x5Z29uQXBwZW5kKGxvd2VyUG9seSwgcG9seSwgMCwgY2xvc2VzdEluZGV4ICsgMSk7CiAgICAgICAgICAgICAgcG9seWdvbkFwcGVuZCh1cHBlclBvbHksIHBvbHksIGNsb3Nlc3RJbmRleCwgaSArIDEpOwogICAgICAgICAgICB9CiAgICAgICAgICB9IC8vIHNvbHZlIHNtYWxsZXN0IHBvbHkgZmlyc3QKCgogICAgICAgICAgaWYgKGxvd2VyUG9seS5sZW5ndGggPCB1cHBlclBvbHkubGVuZ3RoKSB7CiAgICAgICAgICAgIHBvbHlnb25RdWlja0RlY29tcChsb3dlclBvbHksIHJlc3VsdCwgcmVmbGV4VmVydGljZXMsIHN0ZWluZXJQb2ludHMsIGRlbHRhLCBtYXhsZXZlbCwgbGV2ZWwpOwogICAgICAgICAgICBwb2x5Z29uUXVpY2tEZWNvbXAodXBwZXJQb2x5LCByZXN1bHQsIHJlZmxleFZlcnRpY2VzLCBzdGVpbmVyUG9pbnRzLCBkZWx0YSwgbWF4bGV2ZWwsIGxldmVsKTsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHBvbHlnb25RdWlja0RlY29tcCh1cHBlclBvbHksIHJlc3VsdCwgcmVmbGV4VmVydGljZXMsIHN0ZWluZXJQb2ludHMsIGRlbHRhLCBtYXhsZXZlbCwgbGV2ZWwpOwogICAgICAgICAgICBwb2x5Z29uUXVpY2tEZWNvbXAobG93ZXJQb2x5LCByZXN1bHQsIHJlZmxleFZlcnRpY2VzLCBzdGVpbmVyUG9pbnRzLCBkZWx0YSwgbWF4bGV2ZWwsIGxldmVsKTsKICAgICAgICAgIH0KCiAgICAgICAgICByZXR1cm4gcmVzdWx0OwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmVzdWx0LnB1c2gocG9seWdvbik7CiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9CiAgICAvKioKICAgICAqIFJlbW92ZSBjb2xsaW5lYXIgcG9pbnRzIGluIHRoZSBwb2x5Z29uLgogICAgICogQG1ldGhvZCByZW1vdmVDb2xsaW5lYXJQb2ludHMKICAgICAqIEBwYXJhbSAge051bWJlcn0gW3ByZWNpc2lvbl0gVGhlIHRocmVzaG9sZCBhbmdsZSB0byB1c2Ugd2hlbiBkZXRlcm1pbmluZyB3aGV0aGVyIHR3byBlZGdlcyBhcmUgY29sbGluZWFyLiBVc2UgemVybyBmb3IgZmluZXN0IHByZWNpc2lvbi4KICAgICAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgIFRoZSBudW1iZXIgb2YgcG9pbnRzIHJlbW92ZWQKICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2x5Z29uUmVtb3ZlQ29sbGluZWFyUG9pbnRzKHBvbHlnb24sIHByZWNpc2lvbikgewogICAgICB2YXIgbnVtID0gMDsKCiAgICAgIGZvciAodmFyIGkgPSBwb2x5Z29uLmxlbmd0aCAtIDE7IHBvbHlnb24ubGVuZ3RoID4gMyAmJiBpID49IDA7IC0taSkgewogICAgICAgIGlmIChjb2xsaW5lYXIocG9seWdvbkF0KHBvbHlnb24sIGkgLSAxKSwgcG9seWdvbkF0KHBvbHlnb24sIGkpLCBwb2x5Z29uQXQocG9seWdvbiwgaSArIDEpLCBwcmVjaXNpb24pKSB7CiAgICAgICAgICAvLyBSZW1vdmUgdGhlIG1pZGRsZSBwb2ludAogICAgICAgICAgcG9seWdvbi5zcGxpY2UoaSAlIHBvbHlnb24ubGVuZ3RoLCAxKTsKICAgICAgICAgIG51bSsrOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG51bTsKICAgIH0KICAgIC8qKgogICAgICogQ2hlY2sgaWYgdHdvIHNjYWxhcnMgYXJlIGVxdWFsCiAgICAgKiBAc3RhdGljCiAgICAgKiBAbWV0aG9kIGVxCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGEKICAgICAqIEBwYXJhbSAge051bWJlcn0gYgogICAgICogQHBhcmFtICB7TnVtYmVyfSBbcHJlY2lzaW9uXQogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKCiAgICBmdW5jdGlvbiBzY2FsYXJfZXEoYSwgYiwgcHJlY2lzaW9uKSB7CiAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbiB8fCAwOwogICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgcHJlY2lzaW9uOwogICAgfQoKICAgIHZhciBTaGFwZV8xID0gU2hhcGUkYTsKCiAgICB2YXIgdmVjMiRtID0gdmVjMiRxLmV4cG9ydHM7CiAgICAvKioKICAgICAqIEJhc2UgY2xhc3MgZm9yIHNoYXBlcy4gTm90IHRvIGJlIHVzZWQgZGlyZWN0bHkuCiAgICAgKiBAY2xhc3MgU2hhcGUKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXQogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmFuZ2xlPTBdCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuY29sbGlzaW9uR3JvdXA9MV0KICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5jb2xsaXNpb25NYXNrPTFdCiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmNvbGxpc2lvblJlc3BvbnNlPXRydWVdCiAgICAgKiBAcGFyYW0ge01hdGVyaWFsfSBbb3B0aW9ucy5tYXRlcmlhbD1udWxsXQogICAgICogQHBhcmFtIHthcnJheX0gW29wdGlvbnMucG9zaXRpb25dCiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnNlbnNvcj1mYWxzZV0KICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy50eXBlPTBdCiAgICAgKi8KCgogICAgZnVuY3Rpb24gU2hhcGUkYShvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICAvKioKICAgICAgICogVGhlIGJvZHkgdGhpcyBzaGFwZSBpcyBhdHRhY2hlZCB0by4gQSBzaGFwZSBjYW4gb25seSBiZSBhdHRhY2hlZCB0byBhIHNpbmdsZSBib2R5LgogICAgICAgKiBAcHJvcGVydHkge0JvZHl9IGJvZHkKICAgICAgICovCgogICAgICB0aGlzLmJvZHkgPSBudWxsOwogICAgICAvKioKICAgICAgICogQm9keS1sb2NhbCBwb3NpdGlvbiBvZiB0aGUgc2hhcGUuCiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHBvc2l0aW9uCiAgICAgICAqLwoKICAgICAgdGhpcy5wb3NpdGlvbiA9IHZlYzIkbS5jcmVhdGUoKTsKCiAgICAgIGlmIChvcHRpb25zLnBvc2l0aW9uKSB7CiAgICAgICAgdmVjMiRtLmNvcHkodGhpcy5wb3NpdGlvbiwgb3B0aW9ucy5wb3NpdGlvbik7CiAgICAgIH0KICAgICAgLyoqCiAgICAgICAqIEJvZHktbG9jYWwgYW5nbGUgb2YgdGhlIHNoYXBlLgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYW5nbGUKICAgICAgICovCgoKICAgICAgdGhpcy5hbmdsZSA9IG9wdGlvbnMuYW5nbGUgfHwgMDsKICAgICAgLyoqCiAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBzaGFwZS4gT25lIG9mOgogICAgICAgKgogICAgICAgKiA8dWw+CiAgICAgICAqIDxsaT48YSBocmVmPSJTaGFwZS5odG1sI3Byb3BlcnR5X0NJUkNMRSI+U2hhcGUuQ0lSQ0xFPC9hPjwvbGk+CiAgICAgICAqIDxsaT48YSBocmVmPSJTaGFwZS5odG1sI3Byb3BlcnR5X1BBUlRJQ0xFIj5TaGFwZS5QQVJUSUNMRTwvYT48L2xpPgogICAgICAgKiA8bGk+PGEgaHJlZj0iU2hhcGUuaHRtbCNwcm9wZXJ0eV9QTEFORSI+U2hhcGUuUExBTkU8L2E+PC9saT4KICAgICAgICogPGxpPjxhIGhyZWY9IlNoYXBlLmh0bWwjcHJvcGVydHlfQ09OVkVYIj5TaGFwZS5DT05WRVg8L2E+PC9saT4KICAgICAgICogPGxpPjxhIGhyZWY9IlNoYXBlLmh0bWwjcHJvcGVydHlfTElORSI+U2hhcGUuTElORTwvYT48L2xpPgogICAgICAgKiA8bGk+PGEgaHJlZj0iU2hhcGUuaHRtbCNwcm9wZXJ0eV9CT1giPlNoYXBlLkJPWDwvYT48L2xpPgogICAgICAgKiA8bGk+PGEgaHJlZj0iU2hhcGUuaHRtbCNwcm9wZXJ0eV9DQVBTVUxFIj5TaGFwZS5DQVBTVUxFPC9hPjwvbGk+CiAgICAgICAqIDxsaT48YSBocmVmPSJTaGFwZS5odG1sI3Byb3BlcnR5X0hFSUdIVEZJRUxEIj5TaGFwZS5IRUlHSFRGSUVMRDwvYT48L2xpPgogICAgICAgKiA8L3VsPgogICAgICAgKgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gdHlwZQogICAgICAgKi8KCiAgICAgIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZSB8fCAwOwogICAgICAvKioKICAgICAgICogU2hhcGUgb2JqZWN0IGlkZW50aWZpZXIuIFJlYWQgb25seS4KICAgICAgICogQHJlYWRvbmx5CiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqIEBwcm9wZXJ0eSBpZAogICAgICAgKi8KCiAgICAgIHRoaXMuaWQgPSBTaGFwZSRhLmlkQ291bnRlcisrOwogICAgICAvKioKICAgICAgICogQm91bmRpbmcgY2lyY2xlIHJhZGl1cyBvZiB0aGlzIHNoYXBlCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgYm91bmRpbmdSYWRpdXMKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmJvdW5kaW5nUmFkaXVzID0gMDsKICAgICAgLyoqCiAgICAgICAqIENvbGxpc2lvbiBncm91cCB0aGF0IHRoaXMgc2hhcGUgYmVsb25ncyB0byAoYml0IG1hc2spLiBTZWUgPGEgaHJlZj0iaHR0cDovL3d3dy5hdXJlbGllbnJpYm9uLmNvbS9ibG9nLzIwMTEvMDcvYm94MmQtdHV0b3JpYWwtY29sbGlzaW9uLWZpbHRlcmluZy8iPnRoaXMgdHV0b3JpYWw8L2E+LgogICAgICAgKiBAcHJvcGVydHkgY29sbGlzaW9uR3JvdXAKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICogQGV4YW1wbGUKICAgICAgICogICAgIC8vIFNldHVwIGJpdHMgZm9yIGVhY2ggYXZhaWxhYmxlIGdyb3VwCiAgICAgICAqICAgICB2YXIgUExBWUVSID0gTWF0aC5wb3coMiwwKSwKICAgICAgICogICAgICAgICBFTkVNWSA9ICBNYXRoLnBvdygyLDEpLAogICAgICAgKiAgICAgICAgIEdST1VORCA9IE1hdGgucG93KDIsMikKICAgICAgICoKICAgICAgICogICAgIC8vIFB1dCBzaGFwZXMgaW50byB0aGVpciBncm91cHMKICAgICAgICogICAgIHBsYXllcjFTaGFwZS5jb2xsaXNpb25Hcm91cCA9IFBMQVlFUjsKICAgICAgICogICAgIHBsYXllcjJTaGFwZS5jb2xsaXNpb25Hcm91cCA9IFBMQVlFUjsKICAgICAgICogICAgIGVuZW15U2hhcGUgIC5jb2xsaXNpb25Hcm91cCA9IEVORU1ZOwogICAgICAgKiAgICAgZ3JvdW5kU2hhcGUgLmNvbGxpc2lvbkdyb3VwID0gR1JPVU5EOwogICAgICAgKgogICAgICAgKiAgICAgLy8gQXNzaWduIGdyb3VwcyB0aGF0IGVhY2ggc2hhcGUgY29sbGlkZSB3aXRoLgogICAgICAgKiAgICAgLy8gTm90ZSB0aGF0IHRoZSBwbGF5ZXJzIGNhbiBjb2xsaWRlIHdpdGggZ3JvdW5kIGFuZCBlbmVtaWVzLCBidXQgbm90IHdpdGggb3RoZXIgcGxheWVycy4KICAgICAgICogICAgIHBsYXllcjFTaGFwZS5jb2xsaXNpb25NYXNrID0gRU5FTVkgfCBHUk9VTkQ7CiAgICAgICAqICAgICBwbGF5ZXIyU2hhcGUuY29sbGlzaW9uTWFzayA9IEVORU1ZIHwgR1JPVU5EOwogICAgICAgKiAgICAgZW5lbXlTaGFwZSAgLmNvbGxpc2lvbk1hc2sgPSBQTEFZRVIgfCBHUk9VTkQ7CiAgICAgICAqICAgICBncm91bmRTaGFwZSAuY29sbGlzaW9uTWFzayA9IFBMQVlFUiB8IEVORU1ZOwogICAgICAgKgogICAgICAgKiBAZXhhbXBsZQogICAgICAgKiAgICAgLy8gSG93IGNvbGxpc2lvbiBjaGVjayBpcyBkb25lCiAgICAgICAqICAgICBpZihzaGFwZUEuY29sbGlzaW9uR3JvdXAgJiBzaGFwZUIuY29sbGlzaW9uTWFzaykhPTAgJiYgKHNoYXBlQi5jb2xsaXNpb25Hcm91cCAmIHNoYXBlQS5jb2xsaXNpb25NYXNrKSE9MCl7CiAgICAgICAqICAgICAgICAgLy8gVGhlIHNoYXBlcyB3aWxsIGNvbGxpZGUKICAgICAgICogICAgIH0KICAgICAgICovCgogICAgICB0aGlzLmNvbGxpc2lvbkdyb3VwID0gb3B0aW9ucy5jb2xsaXNpb25Hcm91cCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb2xsaXNpb25Hcm91cCA6IDE7CiAgICAgIC8qKgogICAgICAgKiBXaGV0aGVyIHRvIHByb2R1Y2UgY29udGFjdCBmb3JjZXMgd2hlbiBpbiBjb250YWN0IHdpdGggb3RoZXIgYm9kaWVzLiBOb3RlIHRoYXQgY29udGFjdHMgd2lsbCBiZSBnZW5lcmF0ZWQsIGJ1dCB0aGV5IHdpbGwgYmUgZGlzYWJsZWQuIFRoYXQgbWVhbnMgdGhhdCB0aGlzIHNoYXBlIHdpbGwgbW92ZSB0aHJvdWdoIG90aGVyIGJvZHkgc2hhcGVzLCBidXQgaXQgd2lsbCBzdGlsbCB0cmlnZ2VyIGNvbnRhY3QgZXZlbnRzLCBldGMuCiAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gY29sbGlzaW9uUmVzcG9uc2UKICAgICAgICovCgogICAgICB0aGlzLmNvbGxpc2lvblJlc3BvbnNlID0gb3B0aW9ucy5jb2xsaXNpb25SZXNwb25zZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb2xsaXNpb25SZXNwb25zZSA6IHRydWU7CiAgICAgIC8qKgogICAgICAgKiBDb2xsaXNpb24gbWFzayBvZiB0aGlzIHNoYXBlLiBTZWUgLmNvbGxpc2lvbkdyb3VwLgogICAgICAgKiBAcHJvcGVydHkgY29sbGlzaW9uTWFzawogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMuY29sbGlzaW9uTWFzayA9IG9wdGlvbnMuY29sbGlzaW9uTWFzayAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb2xsaXNpb25NYXNrIDogMTsKICAgICAgLyoqCiAgICAgICAqIE1hdGVyaWFsIHRvIHVzZSBpbiBjb2xsaXNpb25zIGZvciB0aGlzIFNoYXBlLiBJZiB0aGlzIGlzIHNldCB0byBudWxsLCB0aGUgd29ybGQgd2lsbCB1c2UgZGVmYXVsdCBtYXRlcmlhbCBwcm9wZXJ0aWVzIGluc3RlYWQuCiAgICAgICAqIEBwcm9wZXJ0eSBtYXRlcmlhbAogICAgICAgKiBAdHlwZSB7TWF0ZXJpYWx9CiAgICAgICAqLwoKICAgICAgdGhpcy5tYXRlcmlhbCA9IG9wdGlvbnMubWF0ZXJpYWwgfHwgbnVsbDsKICAgICAgLyoqCiAgICAgICAqIEFyZWEgb2YgdGhpcyBzaGFwZS4KICAgICAgICogQHByb3BlcnR5IGFyZWEKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmFyZWEgPSAwOwogICAgICAvKioKICAgICAgICogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdGhpcyBzaGFwZSB0byBiZSBhIHNlbnNvci4gQSBzZW5zb3IgZG9lcyBub3QgZ2VuZXJhdGUgY29udGFjdHMsIGJ1dCBpdCBzdGlsbCByZXBvcnRzIGNvbnRhY3QgZXZlbnRzLiBUaGlzIGlzIGdvb2QgaWYgeW91IHdhbnQgdG8ga25vdyBpZiBhIHNoYXBlIGlzIG92ZXJsYXBwaW5nIGFub3RoZXIgc2hhcGUsIHdpdGhvdXQgdGhlbSBnZW5lcmF0aW5nIGNvbnRhY3RzLgogICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHNlbnNvcgogICAgICAgKi8KCiAgICAgIHRoaXMuc2Vuc29yID0gb3B0aW9ucy5zZW5zb3IgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuc2Vuc29yIDogZmFsc2U7CgogICAgICBpZiAodGhpcy50eXBlKSB7CiAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1JhZGl1cygpOwogICAgICB9CgogICAgICB0aGlzLnVwZGF0ZUFyZWEoKTsKICAgIH0KCiAgICBTaGFwZSRhLmlkQ291bnRlciA9IDA7CiAgICAvKioKICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDSVJDTEUKICAgICAqLwoKICAgIFNoYXBlJGEuQ0lSQ0xFID0gMTsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBBUlRJQ0xFCiAgICAgKi8KCiAgICBTaGFwZSRhLlBBUlRJQ0xFID0gMjsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBMQU5FCiAgICAgKi8KCiAgICBTaGFwZSRhLlBMQU5FID0gNDsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENPTlZFWAogICAgICovCgogICAgU2hhcGUkYS5DT05WRVggPSA4OwogICAgLyoqCiAgICAgKiBAc3RhdGljCiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTElORQogICAgICovCgogICAgU2hhcGUkYS5MSU5FID0gMTY7CiAgICAvKioKICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCT1gKICAgICAqLwoKICAgIFNoYXBlJGEuQk9YID0gMzI7CiAgICAvKioKICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDQVBTVUxFCiAgICAgKi8KCiAgICBTaGFwZSRhLkNBUFNVTEUgPSA2NDsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhFSUdIVEZJRUxECiAgICAgKi8KCiAgICBTaGFwZSRhLkhFSUdIVEZJRUxEID0gMTI4OwogICAgU2hhcGUkYS5wcm90b3R5cGUgPSB7CiAgICAgIC8qKgogICAgICAgKiBTaG91bGQgcmV0dXJuIHRoZSBtb21lbnQgb2YgaW5lcnRpYSBhcm91bmQgdGhlIFogYXhpcyBvZiB0aGUgYm9keS4gU2VlIDxhIGhyZWY9Imh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9tb21lbnRzX29mX2luZXJ0aWEiPldpa2lwZWRpYSdzIGxpc3Qgb2YgbW9tZW50cyBvZiBpbmVydGlhPC9hPi4KICAgICAgICogQG1ldGhvZCBjb21wdXRlTW9tZW50T2ZJbmVydGlhCiAgICAgICAqIEByZXR1cm4ge051bWJlcn0gSWYgdGhlIGluZXJ0aWEgaXMgaW5maW5pdHkgb3IgaWYgdGhlIG9iamVjdCBzaW1wbHkgaXNuJ3QgcG9zc2libGUgdG8gcm90YXRlLCByZXR1cm4gMC4KICAgICAgICovCiAgICAgIGNvbXB1dGVNb21lbnRPZkluZXJ0aWE6IGZ1bmN0aW9uICgpIHt9LAoKICAgICAgLyoqCiAgICAgICAqIFJldHVybnMgdGhlIGJvdW5kaW5nIGNpcmNsZSByYWRpdXMgb2YgdGhpcyBzaGFwZS4KICAgICAgICogQG1ldGhvZCB1cGRhdGVCb3VuZGluZ1JhZGl1cwogICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgICAqLwogICAgICB1cGRhdGVCb3VuZGluZ1JhZGl1czogZnVuY3Rpb24gKCkge30sCgogICAgICAvKioKICAgICAgICogVXBkYXRlIHRoZSAuYXJlYSBwcm9wZXJ0eSBvZiB0aGUgc2hhcGUuCiAgICAgICAqIEBtZXRob2QgdXBkYXRlQXJlYQogICAgICAgKi8KICAgICAgdXBkYXRlQXJlYTogZnVuY3Rpb24gKCkge30sCgogICAgICAvKioKICAgICAgICogQ29tcHV0ZSB0aGUgd29ybGQgYXhpcy1hbGlnbmVkIGJvdW5kaW5nIGJveCAoQUFCQikgb2YgdGhpcyBzaGFwZS4KICAgICAgICogQG1ldGhvZCBjb21wdXRlQUFCQgogICAgICAgKiBAcGFyYW0gIHtBQUJCfSBvdXQgVGhlIHJlc3VsdGluZyBBQUJCLgogICAgICAgKiBAcGFyYW0gIHtBcnJheX0gcG9zaXRpb24gV29ybGQgcG9zaXRpb24gb2YgdGhlIHNoYXBlLgogICAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGFuZ2xlIFdvcmxkIGFuZ2xlIG9mIHRoZSBzaGFwZS4KICAgICAgICovCiAgICAgIGNvbXB1dGVBQUJCOiBmdW5jdGlvbgogICAgICAgIC8qb3V0LCBwb3NpdGlvbiwgYW5nbGUqLwogICAgICAoKSB7Ly8gVG8gYmUgaW1wbGVtZW50ZWQgaW4gZWFjaCBzdWJjbGFzcwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIFBlcmZvcm0gcmF5Y2FzdGluZyBvbiB0aGlzIHNoYXBlLgogICAgICAgKiBAbWV0aG9kIHJheWNhc3QKICAgICAgICogQHBhcmFtICB7UmF5UmVzdWx0fSByZXN1bHQgV2hlcmUgdG8gc3RvcmUgdGhlIHJlc3VsdGluZyBkYXRhLgogICAgICAgKiBAcGFyYW0gIHtSYXl9IHJheSBUaGUgUmF5IHRoYXQgeW91IHdhbnQgdG8gdXNlIGZvciByYXljYXN0aW5nLgogICAgICAgKiBAcGFyYW0gIHthcnJheX0gcG9zaXRpb24gV29ybGQgcG9zaXRpb24gb2YgdGhlIHNoYXBlICh0aGUgLnBvc2l0aW9uIHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZCkuCiAgICAgICAqIEBwYXJhbSAge251bWJlcn0gYW5nbGUgV29ybGQgYW5nbGUgb2YgdGhlIHNoYXBlICh0aGUgLmFuZ2xlIHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZCkuCiAgICAgICAqLwogICAgICByYXljYXN0OiBmdW5jdGlvbgogICAgICAgIC8qcmVzdWx0LCByYXksIHBvc2l0aW9uLCBhbmdsZSovCiAgICAgICgpIHsvLyBUbyBiZSBpbXBsZW1lbnRlZCBpbiBlYWNoIHN1YmNsYXNzCiAgICAgIH0sCgogICAgICAvKioKICAgICAgICogVGVzdCBpZiBhIHBvaW50IGlzIGluc2lkZSB0aGlzIHNoYXBlLgogICAgICAgKiBAbWV0aG9kIHBvaW50VGVzdAogICAgICAgKiBAcGFyYW0ge2FycmF5fSBsb2NhbFBvaW50CiAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59CiAgICAgICAqLwogICAgICBwb2ludFRlc3Q6IGZ1bmN0aW9uCiAgICAgICAgLypsb2NhbFBvaW50Ki8KICAgICAgKCkgewogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfSwKCiAgICAgIC8qKgogICAgICAgKiBUcmFuc2Zvcm0gYSB3b3JsZCBwb2ludCB0byBsb2NhbCBzaGFwZSBzcGFjZSAoYXNzdW1lZCB0aGUgc2hhcGUgaXMgdHJhbnNmb3JtZWQgYnkgYm90aCBpdHNlbGYgYW5kIHRoZSBib2R5KS4KICAgICAgICogQG1ldGhvZCB3b3JsZFBvaW50VG9Mb2NhbAogICAgICAgKiBAcGFyYW0ge2FycmF5fSBvdXQKICAgICAgICogQHBhcmFtIHthcnJheX0gd29ybGRQb2ludAogICAgICAgKi8KICAgICAgd29ybGRQb2ludFRvTG9jYWw6IGZ1bmN0aW9uICgpIHsKICAgICAgICB2YXIgc2hhcGVXb3JsZFBvc2l0aW9uID0gdmVjMiRtLmNyZWF0ZSgpOwogICAgICAgIHJldHVybiBmdW5jdGlvbiAob3V0LCB3b3JsZFBvaW50KSB7CiAgICAgICAgICB2YXIgYm9keSA9IHRoaXMuYm9keTsKICAgICAgICAgIHZlYzIkbS5yb3RhdGUoc2hhcGVXb3JsZFBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uLCBib2R5LmFuZ2xlKTsKICAgICAgICAgIHZlYzIkbS5hZGQoc2hhcGVXb3JsZFBvc2l0aW9uLCBzaGFwZVdvcmxkUG9zaXRpb24sIGJvZHkucG9zaXRpb24pOwogICAgICAgICAgdmVjMiRtLnRvTG9jYWxGcmFtZShvdXQsIHdvcmxkUG9pbnQsIHNoYXBlV29ybGRQb3NpdGlvbiwgdGhpcy5ib2R5LmFuZ2xlICsgdGhpcy5hbmdsZSk7CiAgICAgICAgfTsKICAgICAgfSgpCiAgICB9OwoKICAgIC8qCiAgICAgICAgUG9seUsgbGlicmFyeQogICAgICAgIHVybDogaHR0cDovL3BvbHlrLml2YW5rLm5ldAogICAgICAgIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbmNlLgogICAgICAgICBDb3B5cmlnaHQgKGMpIDIwMTIgSXZhbiBLdWNraXIKICAgICAgICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24KICAgICAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbgogICAgICAgIGZpbGVzICh0aGUgIlNvZnR3YXJlIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQKICAgICAgICByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwKICAgICAgICBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbAogICAgICAgIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZQogICAgICAgIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nCiAgICAgICAgY29uZGl0aW9uczoKICAgICAgICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUKICAgICAgICBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS4KICAgICAgICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsCiAgICAgICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTCiAgICAgICAgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQKICAgICAgICBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVAogICAgICAgIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLAogICAgICAgIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORwogICAgICAgIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IKICAgICAgICBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuCiAgICAqLwoKICAgIHZhciBQb2x5SyA9IHt9OwogICAgLyoKICAgICAgICBJcyBQb2x5Z29uIHNlbGYtaW50ZXJzZWN0aW5nPwogICAgICAgICBPKG5eMikKICAgICovCgogICAgLyoKICAgIFBvbHlLLklzU2ltcGxlID0gZnVuY3Rpb24ocCkKICAgIHsKICAgICAgICB2YXIgbiA9IHAubGVuZ3RoPj4xOwogICAgICAgIGlmKG48NCkgcmV0dXJuIHRydWU7CiAgICAgICAgdmFyIGExID0gbmV3IFBvbHlLLl9QKCksIGEyID0gbmV3IFBvbHlLLl9QKCk7CiAgICAgICAgdmFyIGIxID0gbmV3IFBvbHlLLl9QKCksIGIyID0gbmV3IFBvbHlLLl9QKCk7CiAgICAgICAgdmFyIGMgPSBuZXcgUG9seUsuX1AoKTsKICAgICAgICAgZm9yKHZhciBpPTA7IGk8bjsgaSsrKQogICAgICAgIHsKICAgICAgICAgICAgYTEueCA9IHBbMippICBdOwogICAgICAgICAgICBhMS55ID0gcFsyKmkrMV07CiAgICAgICAgICAgIGlmKGk9PW4tMSkgIHsgYTIueCA9IHBbMCAgICBdOyAgYTIueSA9IHBbMSAgICBdOyB9CiAgICAgICAgICAgIGVsc2UgICAgICAgIHsgYTIueCA9IHBbMippKzJdOyAgYTIueSA9IHBbMippKzNdOyB9CiAgICAgICAgICAgICBmb3IodmFyIGo9MDsgajxuOyBqKyspCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIGlmKE1hdGguYWJzKGktaikgPCAyKSBjb250aW51ZTsKICAgICAgICAgICAgICAgIGlmKGo9PW4tMSAmJiBpPT0wKSBjb250aW51ZTsKICAgICAgICAgICAgICAgIGlmKGk9PW4tMSAmJiBqPT0wKSBjb250aW51ZTsKICAgICAgICAgICAgICAgICBiMS54ID0gcFsyKmogIF07CiAgICAgICAgICAgICAgICBiMS55ID0gcFsyKmorMV07CiAgICAgICAgICAgICAgICBpZihqPT1uLTEpICB7IGIyLnggPSBwWzAgICAgXTsgIGIyLnkgPSBwWzEgICAgXTsgfQogICAgICAgICAgICAgICAgZWxzZSAgICAgICAgeyBiMi54ID0gcFsyKmorMl07ICBiMi55ID0gcFsyKmorM107IH0KICAgICAgICAgICAgICAgICBpZihQb2x5Sy5fR2V0TGluZUludGVyc2VjdGlvbihhMSxhMixiMSxiMixjKSAhPSBudWxsKSByZXR1cm4gZmFsc2U7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAgUG9seUsuSXNDb252ZXggPSBmdW5jdGlvbihwKQogICAgewogICAgICAgIGlmKHAubGVuZ3RoPDYpIHJldHVybiB0cnVlOwogICAgICAgIHZhciBsID0gcC5sZW5ndGggLSA0OwogICAgICAgIGZvcih2YXIgaT0wOyBpPGw7IGkrPTIpCiAgICAgICAgICAgIGlmKCFQb2x5Sy5fY29udmV4KHBbaV0sIHBbaSsxXSwgcFtpKzJdLCBwW2krM10sIHBbaSs0XSwgcFtpKzVdKSkgcmV0dXJuIGZhbHNlOwogICAgICAgIGlmKCFQb2x5Sy5fY29udmV4KHBbbCAgXSwgcFtsKzFdLCBwW2wrMl0sIHBbbCszXSwgcFswXSwgcFsxXSkpIHJldHVybiBmYWxzZTsKICAgICAgICBpZighUG9seUsuX2NvbnZleChwW2wrMl0sIHBbbCszXSwgcFswICBdLCBwWzEgIF0sIHBbMl0sIHBbM10pKSByZXR1cm4gZmFsc2U7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAqLwoKICAgIFBvbHlLLkdldEFyZWEgPSBmdW5jdGlvbiAocCkgewogICAgICBpZiAocC5sZW5ndGggPCA2KSByZXR1cm4gMDsKICAgICAgdmFyIGwgPSBwLmxlbmd0aCAtIDI7CiAgICAgIHZhciBzdW0gPSAwOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpICs9IDIpIHN1bSArPSAocFtpICsgMl0gLSBwW2ldKSAqIChwW2kgKyAxXSArIHBbaSArIDNdKTsKCiAgICAgIHN1bSArPSAocFswXSAtIHBbbF0pICogKHBbbCArIDFdICsgcFsxXSk7CiAgICAgIHJldHVybiAtc3VtICogMC41OwogICAgfTsKICAgIC8qCiAgICBQb2x5Sy5HZXRBQUJCID0gZnVuY3Rpb24ocCkKICAgIHsKICAgICAgICB2YXIgbWlueCA9IEluZmluaXR5OwogICAgICAgIHZhciBtaW55ID0gSW5maW5pdHk7CiAgICAgICAgdmFyIG1heHggPSAtbWlueDsKICAgICAgICB2YXIgbWF4eSA9IC1taW55OwogICAgICAgIGZvcih2YXIgaT0wOyBpPHAubGVuZ3RoOyBpKz0yKQogICAgICAgIHsKICAgICAgICAgICAgbWlueCA9IE1hdGgubWluKG1pbngsIHBbaSAgXSk7CiAgICAgICAgICAgIG1heHggPSBNYXRoLm1heChtYXh4LCBwW2kgIF0pOwogICAgICAgICAgICBtaW55ID0gTWF0aC5taW4obWlueSwgcFtpKzFdKTsKICAgICAgICAgICAgbWF4eSA9IE1hdGgubWF4KG1heHksIHBbaSsxXSk7CiAgICAgICAgfQogICAgICAgIHJldHVybiB7eDptaW54LCB5Om1pbnksIHdpZHRoOm1heHgtbWlueCwgaGVpZ2h0Om1heHktbWlueX07CiAgICB9CiAgICAqLwoKCiAgICBQb2x5Sy5Ucmlhbmd1bGF0ZSA9IGZ1bmN0aW9uIChwKSB7CiAgICAgIHZhciBuID0gcC5sZW5ndGggPj4gMTsKICAgICAgaWYgKG4gPCAzKSByZXR1cm4gW107CiAgICAgIHZhciB0Z3MgPSBbXTsKICAgICAgdmFyIGF2bCA9IFtdOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGF2bC5wdXNoKGkpOwoKICAgICAgdmFyIGkgPSAwOwogICAgICB2YXIgYWwgPSBuOwoKICAgICAgd2hpbGUgKGFsID4gMykgewogICAgICAgIHZhciBpMCA9IGF2bFsoaSArIDApICUgYWxdOwogICAgICAgIHZhciBpMSA9IGF2bFsoaSArIDEpICUgYWxdOwogICAgICAgIHZhciBpMiA9IGF2bFsoaSArIDIpICUgYWxdOwogICAgICAgIHZhciBheCA9IHBbMiAqIGkwXSwKICAgICAgICAgICAgYXkgPSBwWzIgKiBpMCArIDFdOwogICAgICAgIHZhciBieCA9IHBbMiAqIGkxXSwKICAgICAgICAgICAgYnkgPSBwWzIgKiBpMSArIDFdOwogICAgICAgIHZhciBjeCA9IHBbMiAqIGkyXSwKICAgICAgICAgICAgY3kgPSBwWzIgKiBpMiArIDFdOwogICAgICAgIHZhciBlYXJGb3VuZCA9IGZhbHNlOwoKICAgICAgICBpZiAoUG9seUsuX2NvbnZleChheCwgYXksIGJ4LCBieSwgY3gsIGN5KSkgewogICAgICAgICAgZWFyRm91bmQgPSB0cnVlOwoKICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWw7IGorKykgewogICAgICAgICAgICB2YXIgdmkgPSBhdmxbal07CiAgICAgICAgICAgIGlmICh2aSA9PSBpMCB8fCB2aSA9PSBpMSB8fCB2aSA9PSBpMikgY29udGludWU7CgogICAgICAgICAgICBpZiAoUG9seUsuX1BvaW50SW5UcmlhbmdsZShwWzIgKiB2aV0sIHBbMiAqIHZpICsgMV0sIGF4LCBheSwgYngsIGJ5LCBjeCwgY3kpKSB7CiAgICAgICAgICAgICAgZWFyRm91bmQgPSBmYWxzZTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgaWYgKGVhckZvdW5kKSB7CiAgICAgICAgICB0Z3MucHVzaChpMCwgaTEsIGkyKTsKICAgICAgICAgIGF2bC5zcGxpY2UoKGkgKyAxKSAlIGFsLCAxKTsKICAgICAgICAgIGFsLS07CiAgICAgICAgICBpID0gMDsKICAgICAgICB9IGVsc2UgaWYgKGkrKyA+IDMgKiBhbCkgYnJlYWs7IC8vIG5vIGNvbnZleCBhbmdsZXMgOigKCiAgICAgIH0KCiAgICAgIHRncy5wdXNoKGF2bFswXSwgYXZsWzFdLCBhdmxbMl0pOwogICAgICByZXR1cm4gdGdzOwogICAgfTsKICAgIC8qCiAgICBQb2x5Sy5Db250YWluc1BvaW50ID0gZnVuY3Rpb24ocCwgcHgsIHB5KQogICAgewogICAgICAgIHZhciBuID0gcC5sZW5ndGg+PjE7CiAgICAgICAgdmFyIGF4LCBheSwgYnggPSBwWzIqbi0yXS1weCwgYnkgPSBwWzIqbi0xXS1weTsKICAgICAgICB2YXIgZGVwdGggPSAwOwogICAgICAgIGZvcih2YXIgaT0wOyBpPG47IGkrKykKICAgICAgICB7CiAgICAgICAgICAgIGF4ID0gYng7ICBheSA9IGJ5OwogICAgICAgICAgICBieCA9IHBbMippICBdIC0gcHg7CiAgICAgICAgICAgIGJ5ID0gcFsyKmkrMV0gLSBweTsKICAgICAgICAgICAgaWYoYXk8IDAgJiYgYnk8IDApIGNvbnRpbnVlOyAgICAvLyBib3RoICJ1cCIgb3IgYm90aCAiZG9udyIKICAgICAgICAgICAgaWYoYXk+PTAgJiYgYnk+PTApIGNvbnRpbnVlOyAgICAvLyBib3RoICJ1cCIgb3IgYm90aCAiZG9udyIKICAgICAgICAgICAgaWYoYXg8IDAgJiYgYng8IDApIGNvbnRpbnVlOwogICAgICAgICAgICAgdmFyIGx4ID0gYXggKyAoYngtYXgpKigtYXkpLyhieS1heSk7CiAgICAgICAgICAgIGlmKGx4PjApIGRlcHRoKys7CiAgICAgICAgfQogICAgICAgIHJldHVybiAoZGVwdGggJiAxKSA9PSAxOwogICAgfQogICAgIFBvbHlLLlNsaWNlID0gZnVuY3Rpb24ocCwgYXgsIGF5LCBieCwgYnkpCiAgICB7CiAgICAgICAgaWYoUG9seUsuQ29udGFpbnNQb2ludChwLCBheCwgYXkpIHx8IFBvbHlLLkNvbnRhaW5zUG9pbnQocCwgYngsIGJ5KSkgcmV0dXJuIFtwLnNsaWNlKDApXTsKICAgICAgICAgdmFyIGEgPSBuZXcgUG9seUsuX1AoYXgsIGF5KTsKICAgICAgICB2YXIgYiA9IG5ldyBQb2x5Sy5fUChieCwgYnkpOwogICAgICAgIHZhciBpc2NzID0gW107ICAvLyBpbnRlcnNlY3Rpb25zCiAgICAgICAgdmFyIHBzID0gW107ICAgIC8vIHBvaW50cwogICAgICAgIGZvcih2YXIgaT0wOyBpPHAubGVuZ3RoOyBpKz0yKSBwcy5wdXNoKG5ldyBQb2x5Sy5fUChwW2ldLCBwW2krMV0pKTsKICAgICAgICAgZm9yKHZhciBpPTA7IGk8cHMubGVuZ3RoOyBpKyspCiAgICAgICAgewogICAgICAgICAgICB2YXIgaXNjID0gbmV3IFBvbHlLLl9QKDAsMCk7CiAgICAgICAgICAgIGlzYyA9IFBvbHlLLl9HZXRMaW5lSW50ZXJzZWN0aW9uKGEsIGIsIHBzW2ldLCBwc1soaSsxKSVwcy5sZW5ndGhdLCBpc2MpOwogICAgICAgICAgICAgaWYoaXNjKQogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICBpc2MuZmxhZyA9IHRydWU7CiAgICAgICAgICAgICAgICBpc2NzLnB1c2goaXNjKTsKICAgICAgICAgICAgICAgIHBzLnNwbGljZShpKzEsMCxpc2MpOwogICAgICAgICAgICAgICAgaSsrOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIGlmKGlzY3MubGVuZ3RoID09IDApIHJldHVybiBbcC5zbGljZSgwKV07CiAgICAgICAgdmFyIGNvbXAgPSBmdW5jdGlvbih1LHYpIHtyZXR1cm4gUG9seUsuX1AuZGlzdChhLHUpIC0gUG9seUsuX1AuZGlzdChhLHYpOyB9CiAgICAgICAgaXNjcy5zb3J0KGNvbXApOwogICAgICAgICB2YXIgcGdzID0gW107CiAgICAgICAgdmFyIGRpciA9IDA7CiAgICAgICAgd2hpbGUoaXNjcy5sZW5ndGggPiAwKQogICAgICAgIHsKICAgICAgICAgICAgdmFyIG4gPSBwcy5sZW5ndGg7CiAgICAgICAgICAgIHZhciBpMCA9IGlzY3NbMF07CiAgICAgICAgICAgIHZhciBpMSA9IGlzY3NbMV07CiAgICAgICAgICAgIHZhciBpbmQwID0gcHMuaW5kZXhPZihpMCk7CiAgICAgICAgICAgIHZhciBpbmQxID0gcHMuaW5kZXhPZihpMSk7CiAgICAgICAgICAgIHZhciBzb2x2ZWQgPSBmYWxzZTsKICAgICAgICAgICAgIGlmKFBvbHlLLl9maXJzdFdpdGhGbGFnKHBzLCBpbmQwKSA9PSBpbmQxKSBzb2x2ZWQgPSB0cnVlOwogICAgICAgICAgICBlbHNlCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIGkwID0gaXNjc1sxXTsKICAgICAgICAgICAgICAgIGkxID0gaXNjc1swXTsKICAgICAgICAgICAgICAgIGluZDAgPSBwcy5pbmRleE9mKGkwKTsKICAgICAgICAgICAgICAgIGluZDEgPSBwcy5pbmRleE9mKGkxKTsKICAgICAgICAgICAgICAgIGlmKFBvbHlLLl9maXJzdFdpdGhGbGFnKHBzLCBpbmQwKSA9PSBpbmQxKSBzb2x2ZWQgPSB0cnVlOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmKHNvbHZlZCkKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgZGlyLS07CiAgICAgICAgICAgICAgICB2YXIgcGduID0gUG9seUsuX2dldFBvaW50cyhwcywgaW5kMCwgaW5kMSk7CiAgICAgICAgICAgICAgICBwZ3MucHVzaChwZ24pOwogICAgICAgICAgICAgICAgcHMgPSBQb2x5Sy5fZ2V0UG9pbnRzKHBzLCBpbmQxLCBpbmQwKTsKICAgICAgICAgICAgICAgIGkwLmZsYWcgPSBpMS5mbGFnID0gZmFsc2U7CiAgICAgICAgICAgICAgICBpc2NzLnNwbGljZSgwLDIpOwogICAgICAgICAgICAgICAgaWYoaXNjcy5sZW5ndGggPT0gMCkgcGdzLnB1c2gocHMpOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGVsc2UgeyBkaXIrKzsgaXNjcy5yZXZlcnNlKCk7IH0KICAgICAgICAgICAgaWYoZGlyPjEpIGJyZWFrOwogICAgICAgIH0KICAgICAgICB2YXIgcmVzdWx0ID0gW107CiAgICAgICAgZm9yKHZhciBpPTA7IGk8cGdzLmxlbmd0aDsgaSsrKQogICAgICAgIHsKICAgICAgICAgICAgdmFyIHBnID0gcGdzW2ldOwogICAgICAgICAgICB2YXIgbnBnID0gW107CiAgICAgICAgICAgIGZvcih2YXIgaj0wOyBqPHBnLmxlbmd0aDsgaisrKSBucGcucHVzaChwZ1tqXS54LCBwZ1tqXS55KTsKICAgICAgICAgICAgcmVzdWx0LnB1c2gobnBnKTsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0KICAgICBQb2x5Sy5SYXljYXN0ID0gZnVuY3Rpb24ocCwgeCwgeSwgZHgsIGR5LCBpc2MpCiAgICB7CiAgICAgICAgdmFyIGwgPSBwLmxlbmd0aCAtIDI7CiAgICAgICAgdmFyIHRwID0gUG9seUsuX3RwOwogICAgICAgIHZhciBhMSA9IHRwWzBdLCBhMiA9IHRwWzFdLAogICAgICAgIGIxID0gdHBbMl0sIGIyID0gdHBbM10sIGMgPSB0cFs0XTsKICAgICAgICBhMS54ID0geDsgYTEueSA9IHk7CiAgICAgICAgYTIueCA9IHgrZHg7IGEyLnkgPSB5K2R5OwogICAgICAgICBpZihpc2M9PW51bGwpIGlzYyA9IHtkaXN0OjAsIGVkZ2U6MCwgbm9ybTp7eDowLCB5OjB9LCByZWZsOnt4OjAsIHk6MH19OwogICAgICAgIGlzYy5kaXN0ID0gSW5maW5pdHk7CiAgICAgICAgIGZvcih2YXIgaT0wOyBpPGw7IGkrPTIpCiAgICAgICAgewogICAgICAgICAgICBiMS54ID0gcFtpICBdOyAgYjEueSA9IHBbaSsxXTsKICAgICAgICAgICAgYjIueCA9IHBbaSsyXTsgIGIyLnkgPSBwW2krM107CiAgICAgICAgICAgIHZhciBuaXNjID0gUG9seUsuX1JheUxpbmVJbnRlcnNlY3Rpb24oYTEsIGEyLCBiMSwgYjIsIGMpOwogICAgICAgICAgICBpZihuaXNjKSBQb2x5Sy5fdXBkYXRlSVNDKGR4LCBkeSwgYTEsIGIxLCBiMiwgYywgaS8yLCBpc2MpOwogICAgICAgIH0KICAgICAgICBiMS54ID0gYjIueDsgIGIxLnkgPSBiMi55OwogICAgICAgIGIyLnggPSBwWzBdOyAgYjIueSA9IHBbMV07CiAgICAgICAgdmFyIG5pc2MgPSBQb2x5Sy5fUmF5TGluZUludGVyc2VjdGlvbihhMSwgYTIsIGIxLCBiMiwgYyk7CiAgICAgICAgaWYobmlzYykgUG9seUsuX3VwZGF0ZUlTQyhkeCwgZHksIGExLCBiMSwgYjIsIGMsIHAubGVuZ3RoLzIsIGlzYyk7CiAgICAgICAgIHJldHVybiAoaXNjLmRpc3QgIT0gSW5maW5pdHkpID8gaXNjIDogbnVsbDsKICAgIH0KICAgICBQb2x5Sy5DbG9zZXN0RWRnZSA9IGZ1bmN0aW9uKHAsIHgsIHksIGlzYykKICAgIHsKICAgICAgICB2YXIgbCA9IHAubGVuZ3RoIC0gMjsKICAgICAgICB2YXIgdHAgPSBQb2x5Sy5fdHA7CiAgICAgICAgdmFyIGExID0gdHBbMF0sCiAgICAgICAgYjEgPSB0cFsyXSwgYjIgPSB0cFszXSwgYyA9IHRwWzRdOwogICAgICAgIGExLnggPSB4OyBhMS55ID0geTsKICAgICAgICAgaWYoaXNjPT1udWxsKSBpc2MgPSB7ZGlzdDowLCBlZGdlOjAsIHBvaW50Ont4OjAsIHk6MH0sIG5vcm06e3g6MCwgeTowfX07CiAgICAgICAgaXNjLmRpc3QgPSBJbmZpbml0eTsKICAgICAgICAgZm9yKHZhciBpPTA7IGk8bDsgaSs9MikKICAgICAgICB7CiAgICAgICAgICAgIGIxLnggPSBwW2kgIF07ICBiMS55ID0gcFtpKzFdOwogICAgICAgICAgICBiMi54ID0gcFtpKzJdOyAgYjIueSA9IHBbaSszXTsKICAgICAgICAgICAgUG9seUsuX3BvaW50TGluZURpc3QoYTEsIGIxLCBiMiwgaT4+MSwgaXNjKTsKICAgICAgICB9CiAgICAgICAgYjEueCA9IGIyLng7ICBiMS55ID0gYjIueTsKICAgICAgICBiMi54ID0gcFswXTsgIGIyLnkgPSBwWzFdOwogICAgICAgIFBvbHlLLl9wb2ludExpbmVEaXN0KGExLCBiMSwgYjIsIGw+PjEsIGlzYyk7CiAgICAgICAgIHZhciBpZHN0ID0gMS9pc2MuZGlzdDsKICAgICAgICBpc2Mubm9ybS54ID0gKHgtaXNjLnBvaW50LngpKmlkc3Q7CiAgICAgICAgaXNjLm5vcm0ueSA9ICh5LWlzYy5wb2ludC55KSppZHN0OwogICAgICAgIHJldHVybiBpc2M7CiAgICB9CiAgICAgUG9seUsuX3BvaW50TGluZURpc3QgPSBmdW5jdGlvbihwLCBhLCBiLCBlZGdlLCBpc2MpCiAgICB7CiAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnksIHgxID0gYS54LCB5MSA9IGEueSwgeDIgPSBiLngsIHkyID0gYi55OwogICAgICAgICB2YXIgQSA9IHggLSB4MTsKICAgICAgICB2YXIgQiA9IHkgLSB5MTsKICAgICAgICB2YXIgQyA9IHgyIC0geDE7CiAgICAgICAgdmFyIEQgPSB5MiAtIHkxOwogICAgICAgICB2YXIgZG90ID0gQSAqIEMgKyBCICogRDsKICAgICAgICB2YXIgbGVuX3NxID0gQyAqIEMgKyBEICogRDsKICAgICAgICB2YXIgcGFyYW0gPSBkb3QgLyBsZW5fc3E7CiAgICAgICAgIHZhciB4eCwgeXk7CiAgICAgICAgIGlmIChwYXJhbSA8IDAgfHwgKHgxID09IHgyICYmIHkxID09IHkyKSkgewogICAgICAgICAgICB4eCA9IHgxOwogICAgICAgICAgICB5eSA9IHkxOwogICAgICAgIH0KICAgICAgICBlbHNlIGlmIChwYXJhbSA+IDEpIHsKICAgICAgICAgICAgeHggPSB4MjsKICAgICAgICAgICAgeXkgPSB5MjsKICAgICAgICB9CiAgICAgICAgZWxzZSB7CiAgICAgICAgICAgIHh4ID0geDEgKyBwYXJhbSAqIEM7CiAgICAgICAgICAgIHl5ID0geTEgKyBwYXJhbSAqIEQ7CiAgICAgICAgfQogICAgICAgICB2YXIgZHggPSB4IC0geHg7CiAgICAgICAgdmFyIGR5ID0geSAtIHl5OwogICAgICAgIHZhciBkc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpOwogICAgICAgIGlmKGRzdDxpc2MuZGlzdCkKICAgICAgICB7CiAgICAgICAgICAgIGlzYy5kaXN0ID0gZHN0OwogICAgICAgICAgICBpc2MuZWRnZSA9IGVkZ2U7CiAgICAgICAgICAgIGlzYy5wb2ludC54ID0geHg7CiAgICAgICAgICAgIGlzYy5wb2ludC55ID0geXk7CiAgICAgICAgfQogICAgfQogICAgIFBvbHlLLl91cGRhdGVJU0MgPSBmdW5jdGlvbihkeCwgZHksIGExLCBiMSwgYjIsIGMsIGVkZ2UsIGlzYykKICAgIHsKICAgICAgICB2YXIgbnJsID0gUG9seUsuX1AuZGlzdChhMSwgYyk7CiAgICAgICAgaWYobnJsPGlzYy5kaXN0KQogICAgICAgIHsKICAgICAgICAgICAgdmFyIGlibCA9IDEvUG9seUsuX1AuZGlzdChiMSwgYjIpOwogICAgICAgICAgICB2YXIgbnggPSAtKGIyLnktYjEueSkqaWJsOwogICAgICAgICAgICB2YXIgbnkgPSAgKGIyLngtYjEueCkqaWJsOwogICAgICAgICAgICB2YXIgZGRvdCA9IDIqKGR4Km54K2R5Km55KTsKICAgICAgICAgICAgaXNjLmRpc3QgPSBucmw7CiAgICAgICAgICAgIGlzYy5ub3JtLnggPSBueDsKICAgICAgICAgICAgaXNjLm5vcm0ueSA9IG55OwogICAgICAgICAgICBpc2MucmVmbC54ID0gLWRkb3QqbngrZHg7CiAgICAgICAgICAgIGlzYy5yZWZsLnkgPSAtZGRvdCpueStkeTsKICAgICAgICAgICAgaXNjLmVkZ2UgPSBlZGdlOwogICAgICAgIH0KICAgIH0KICAgICBQb2x5Sy5fZ2V0UG9pbnRzID0gZnVuY3Rpb24ocHMsIGluZDAsIGluZDEpCiAgICB7CiAgICAgICAgdmFyIG4gPSBwcy5sZW5ndGg7CiAgICAgICAgdmFyIG5wcyA9IFtdOwogICAgICAgIGlmKGluZDE8aW5kMCkgaW5kMSArPSBuOwogICAgICAgIGZvcih2YXIgaT1pbmQwOyBpPD0gaW5kMTsgaSsrKSBucHMucHVzaChwc1tpJW5dKTsKICAgICAgICByZXR1cm4gbnBzOwogICAgfQogICAgIFBvbHlLLl9maXJzdFdpdGhGbGFnID0gZnVuY3Rpb24ocHMsIGluZCkKICAgIHsKICAgICAgICB2YXIgbiA9IHBzLmxlbmd0aDsKICAgICAgICB3aGlsZSh0cnVlKQogICAgICAgIHsKICAgICAgICAgICAgaW5kID0gKGluZCsxKSVuOwogICAgICAgICAgICBpZihwc1tpbmRdLmZsYWcpIHJldHVybiBpbmQ7CiAgICAgICAgfQogICAgfQogICAgKi8KCgogICAgUG9seUsuX1BvaW50SW5UcmlhbmdsZSA9IGZ1bmN0aW9uIChweCwgcHksIGF4LCBheSwgYngsIGJ5LCBjeCwgY3kpIHsKICAgICAgdmFyIHYweCA9IGN4IC0gYXg7CiAgICAgIHZhciB2MHkgPSBjeSAtIGF5OwogICAgICB2YXIgdjF4ID0gYnggLSBheDsKICAgICAgdmFyIHYxeSA9IGJ5IC0gYXk7CiAgICAgIHZhciB2MnggPSBweCAtIGF4OwogICAgICB2YXIgdjJ5ID0gcHkgLSBheTsKICAgICAgdmFyIGRvdDAwID0gdjB4ICogdjB4ICsgdjB5ICogdjB5OwogICAgICB2YXIgZG90MDEgPSB2MHggKiB2MXggKyB2MHkgKiB2MXk7CiAgICAgIHZhciBkb3QwMiA9IHYweCAqIHYyeCArIHYweSAqIHYyeTsKICAgICAgdmFyIGRvdDExID0gdjF4ICogdjF4ICsgdjF5ICogdjF5OwogICAgICB2YXIgZG90MTIgPSB2MXggKiB2MnggKyB2MXkgKiB2Mnk7CiAgICAgIHZhciBpbnZEZW5vbSA9IDEgLyAoZG90MDAgKiBkb3QxMSAtIGRvdDAxICogZG90MDEpOwogICAgICB2YXIgdSA9IChkb3QxMSAqIGRvdDAyIC0gZG90MDEgKiBkb3QxMikgKiBpbnZEZW5vbTsKICAgICAgdmFyIHYgPSAoZG90MDAgKiBkb3QxMiAtIGRvdDAxICogZG90MDIpICogaW52RGVub207IC8vIENoZWNrIGlmIHBvaW50IGlzIGluIHRyaWFuZ2xlCgogICAgICByZXR1cm4gdSA+PSAwICYmIHYgPj0gMCAmJiB1ICsgdiA8IDE7CiAgICB9OwogICAgLyoKICAgIFBvbHlLLl9SYXlMaW5lSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYTEsIGEyLCBiMSwgYjIsIGMpCiAgICB7CiAgICAgICAgdmFyIGRheCA9IChhMS54LWEyLngpLCBkYnggPSAoYjEueC1iMi54KTsKICAgICAgICB2YXIgZGF5ID0gKGExLnktYTIueSksIGRieSA9IChiMS55LWIyLnkpOwogICAgICAgICB2YXIgRGVuID0gZGF4KmRieSAtIGRheSpkYng7CiAgICAgICAgaWYgKERlbiA9PSAwKSByZXR1cm4gbnVsbDsgIC8vIHBhcmFsbGVsCiAgICAgICAgIHZhciBBID0gKGExLnggKiBhMi55IC0gYTEueSAqIGEyLngpOwogICAgICAgIHZhciBCID0gKGIxLnggKiBiMi55IC0gYjEueSAqIGIyLngpOwogICAgICAgICB2YXIgSSA9IGM7CiAgICAgICAgdmFyIGlEZW4gPSAxL0RlbjsKICAgICAgICBJLnggPSAoIEEqZGJ4IC0gZGF4KkIgKSAqIGlEZW47CiAgICAgICAgSS55ID0gKCBBKmRieSAtIGRheSpCICkgKiBpRGVuOwogICAgICAgICBpZighUG9seUsuX0luUmVjdChJLCBiMSwgYjIpKSByZXR1cm4gbnVsbDsKICAgICAgICBpZigoZGF5PjAgJiYgSS55PmExLnkpIHx8IChkYXk8MCAmJiBJLnk8YTEueSkpIHJldHVybiBudWxsOwogICAgICAgIGlmKChkYXg+MCAmJiBJLng+YTEueCkgfHwgKGRheDwwICYmIEkueDxhMS54KSkgcmV0dXJuIG51bGw7CiAgICAgICAgcmV0dXJuIEk7CiAgICB9CiAgICAgUG9seUsuX0dldExpbmVJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhMSwgYTIsIGIxLCBiMiwgYykKICAgIHsKICAgICAgICB2YXIgZGF4ID0gKGExLngtYTIueCksIGRieCA9IChiMS54LWIyLngpOwogICAgICAgIHZhciBkYXkgPSAoYTEueS1hMi55KSwgZGJ5ID0gKGIxLnktYjIueSk7CiAgICAgICAgIHZhciBEZW4gPSBkYXgqZGJ5IC0gZGF5KmRieDsKICAgICAgICBpZiAoRGVuID09IDApIHJldHVybiBudWxsOyAgLy8gcGFyYWxsZWwKICAgICAgICAgdmFyIEEgPSAoYTEueCAqIGEyLnkgLSBhMS55ICogYTIueCk7CiAgICAgICAgdmFyIEIgPSAoYjEueCAqIGIyLnkgLSBiMS55ICogYjIueCk7CiAgICAgICAgIHZhciBJID0gYzsKICAgICAgICBJLnggPSAoIEEqZGJ4IC0gZGF4KkIgKSAvIERlbjsKICAgICAgICBJLnkgPSAoIEEqZGJ5IC0gZGF5KkIgKSAvIERlbjsKICAgICAgICAgaWYoUG9seUsuX0luUmVjdChJLCBhMSwgYTIpICYmIFBvbHlLLl9JblJlY3QoSSwgYjEsIGIyKSkgcmV0dXJuIEk7CiAgICAgICAgcmV0dXJuIG51bGw7CiAgICB9CiAgICAgUG9seUsuX0luUmVjdCA9IGZ1bmN0aW9uKGEsIGIsIGMpCiAgICB7CiAgICAgICAgaWYgIChiLnggPT0gYy54KSByZXR1cm4gKGEueT49TWF0aC5taW4oYi55LCBjLnkpICYmIGEueTw9TWF0aC5tYXgoYi55LCBjLnkpKTsKICAgICAgICBpZiAgKGIueSA9PSBjLnkpIHJldHVybiAoYS54Pj1NYXRoLm1pbihiLngsIGMueCkgJiYgYS54PD1NYXRoLm1heChiLngsIGMueCkpOwogICAgICAgICBpZihhLnggPj0gTWF0aC5taW4oYi54LCBjLngpICYmIGEueCA8PSBNYXRoLm1heChiLngsIGMueCkKICAgICAgICAmJiBhLnkgPj0gTWF0aC5taW4oYi55LCBjLnkpICYmIGEueSA8PSBNYXRoLm1heChiLnksIGMueSkpCiAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgfQogICAgKi8KCgogICAgUG9seUsuX2NvbnZleCA9IGZ1bmN0aW9uIChheCwgYXksIGJ4LCBieSwgY3gsIGN5KSB7CiAgICAgIHJldHVybiAoYXkgLSBieSkgKiAoY3ggLSBieCkgKyAoYnggLSBheCkgKiAoY3kgLSBieSkgPj0gMDsKICAgIH07CiAgICAvKgogICAgUG9seUsuX1AgPSBmdW5jdGlvbih4LHkpCiAgICB7CiAgICAgICAgdGhpcy54ID0geDsKICAgICAgICB0aGlzLnkgPSB5OwogICAgICAgIHRoaXMuZmxhZyA9IGZhbHNlOwogICAgfQogICAgUG9seUsuX1AucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKQogICAgewogICAgICAgIHJldHVybiAiUG9pbnQgWyIrdGhpcy54KyIsICIrdGhpcy55KyJdIjsKICAgIH0KICAgIFBvbHlLLl9QLmRpc3QgPSBmdW5jdGlvbihhLGIpCiAgICB7CiAgICAgICAgdmFyIGR4ID0gYi54LWEueDsKICAgICAgICB2YXIgZHkgPSBiLnktYS55OwogICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7CiAgICB9CiAgICAgUG9seUsuX3RwID0gW107CiAgICBmb3IodmFyIGk9MDsgaTwxMDsgaSsrKSBQb2x5Sy5fdHAucHVzaChuZXcgUG9seUsuX1AoMCwwKSk7CiAgICAgICAgKi8KCgogICAgdmFyIHBvbHlrJDEgPSBQb2x5SzsKCiAgICB2YXIgU2hhcGUkOSA9IFNoYXBlXzEsCiAgICAgICAgdmVjMiRsID0gdmVjMiRxLmV4cG9ydHMsCiAgICAgICAgZG90JDIgPSB2ZWMyJGwuZG90LAogICAgICAgIHBvbHlrID0gcG9seWskMSwKICAgICAgICBzaGFsbG93Q2xvbmUkNiA9IFV0aWxzXzEuc2hhbGxvd0Nsb25lOwoKICAgIHZhciBDb252ZXhfMSA9IENvbnZleCQzOwogICAgLyoqCiAgICAgKiBDb252ZXggc2hhcGUgY2xhc3MuCiAgICAgKiBAY2xhc3MgQ29udmV4CiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBleHRlbmRzIFNoYXBlCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIChOb3RlIHRoYXQgdGhpcyBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUge3sjY3Jvc3NMaW5rICJTaGFwZSJ9fXt7L2Nyb3NzTGlua319IGNvbnN0cnVjdG9yLikKICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLnZlcnRpY2VzXSBBbiBhcnJheSBvZiB2ZXJ0aWNlcyB0aGF0IHNwYW4gdGhpcyBzaGFwZS4gVmVydGljZXMgYXJlIGdpdmVuIGluIGNvdW50ZXItY2xvY2t3aXNlIChDQ1cpIGRpcmVjdGlvbi4KICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSk7CiAgICAgKiAgICAgdmFyIHZlcnRpY2VzID0gW1stMSwtMV0sIFsxLC0xXSwgWzEsMV0sIFstMSwxXV07CiAgICAgKiAgICAgdmFyIGNvbnZleFNoYXBlID0gbmV3IENvbnZleCh7CiAgICAgKiAgICAgICAgIHZlcnRpY2VzOiB2ZXJ0aWNlcwogICAgICogICAgIH0pOwogICAgICogICAgIGJvZHkuYWRkU2hhcGUoY29udmV4U2hhcGUpOwogICAgICovCgogICAgZnVuY3Rpb24gQ29udmV4JDMob3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyA/IHNoYWxsb3dDbG9uZSQ2KG9wdGlvbnMpIDoge307CiAgICAgIC8qKgogICAgICAgKiBWZXJ0aWNlcyBkZWZpbmVkIGluIHRoZSBsb2NhbCBmcmFtZS4KICAgICAgICogQHByb3BlcnR5IHZlcnRpY2VzCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLnZlcnRpY2VzID0gW107IC8vIENvcHkgdGhlIHZlcnRzCgogICAgICB2YXIgdmVydGljZXMgPSBvcHRpb25zLnZlcnRpY2VzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnZlcnRpY2VzIDogW107CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdGhpcy52ZXJ0aWNlcy5wdXNoKHZlYzIkbC5jbG9uZSh2ZXJ0aWNlc1tpXSkpOwogICAgICB9CiAgICAgIC8qKgogICAgICAgKiBFZGdlIG5vcm1hbHMgZGVmaW5lZCBpbiB0aGUgbG9jYWwgZnJhbWUsIHBvaW50aW5nIG91dCBvZiB0aGUgc2hhcGUuCiAgICAgICAqIEBwcm9wZXJ0eSBub3JtYWxzCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgoKICAgICAgdmFyIG5vcm1hbHMgPSB0aGlzLm5vcm1hbHMgPSBbXTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICBub3JtYWxzLnB1c2godmVjMiRsLmNyZWF0ZSgpKTsKICAgICAgfQoKICAgICAgdGhpcy51cGRhdGVOb3JtYWxzKCk7CiAgICAgIC8qKgogICAgICAgKiBUaGUgY2VudGVyIG9mIG1hc3Mgb2YgdGhlIENvbnZleAogICAgICAgKiBAcHJvcGVydHkgY2VudGVyT2ZNYXNzCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLmNlbnRlck9mTWFzcyA9IHZlYzIkbC5jcmVhdGUoKTsKICAgICAgLyoqCiAgICAgICAqIFRyaWFuZ3VsYXRlZCB2ZXJzaW9uIG9mIHRoaXMgY29udmV4LiBUaGUgc3RydWN0dXJlIGlzIEFycmF5IG9mIDMtQXJyYXlzLCBhbmQgZWFjaCBzdWJhcnJheSBjb250YWlucyAzIGludGVnZXJzLCByZWZlcmVuY2luZyB0aGUgdmVydGljZXMuCiAgICAgICAqIEBwcm9wZXJ0eSB0cmlhbmdsZXMKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMudHJpYW5nbGVzID0gW107CgogICAgICBpZiAodGhpcy52ZXJ0aWNlcy5sZW5ndGgpIHsKICAgICAgICB0aGlzLnVwZGF0ZVRyaWFuZ2xlcygpOwogICAgICAgIHRoaXMudXBkYXRlQ2VudGVyT2ZNYXNzKCk7CiAgICAgIH0KICAgICAgLyoqCiAgICAgICAqIFRoZSBib3VuZGluZyByYWRpdXMgb2YgdGhlIGNvbnZleAogICAgICAgKiBAcHJvcGVydHkgYm91bmRpbmdSYWRpdXMKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgoKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IDA7CiAgICAgIG9wdGlvbnMudHlwZSA9IG9wdGlvbnMudHlwZSB8fCBTaGFwZSQ5LkNPTlZFWDsKICAgICAgU2hhcGUkOS5jYWxsKHRoaXMsIG9wdGlvbnMpOwogICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nUmFkaXVzKCk7CiAgICAgIHRoaXMudXBkYXRlQXJlYSgpOwoKICAgICAgaWYgKHRoaXMuYXJlYSA8IDApIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIkNvbnZleCB2ZXJ0aWNlcyBtdXN0IGJlIGdpdmVuIGluIGNvdW50ZXItY2xvY2t3aXNlIHdpbmRpbmcuIik7CiAgICAgIH0KICAgIH0KCiAgICBDb252ZXgkMy5wcm90b3R5cGUgPSBuZXcgU2hhcGUkOSgpOwogICAgQ29udmV4JDMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29udmV4JDM7CiAgICB2YXIgdG1wVmVjMSA9IHZlYzIkbC5jcmVhdGUoKTsKICAgIHZhciB0bXBWZWMyID0gdmVjMiRsLmNyZWF0ZSgpOwoKICAgIENvbnZleCQzLnByb3RvdHlwZS51cGRhdGVOb3JtYWxzID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzOwogICAgICB2YXIgbm9ybWFscyA9IHRoaXMubm9ybWFsczsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgd29ybGRQb2ludDAgPSB2ZXJ0aWNlc1tpXTsKICAgICAgICB2YXIgd29ybGRQb2ludDEgPSB2ZXJ0aWNlc1soaSArIDEpICUgdmVydGljZXMubGVuZ3RoXTsKICAgICAgICB2YXIgbm9ybWFsID0gbm9ybWFsc1tpXTsKICAgICAgICB2ZWMyJGwuc3VidHJhY3Qobm9ybWFsLCB3b3JsZFBvaW50MSwgd29ybGRQb2ludDApOyAvLyBHZXQgbm9ybWFsIC0ganVzdCByb3RhdGUgOTAgZGVncmVlcyBzaW5jZSB2ZXJ0aWNlcyBhcmUgZ2l2ZW4gaW4gQ0NXCgogICAgICAgIHZlYzIkbC5yb3RhdGU5MGN3KG5vcm1hbCwgbm9ybWFsKTsKICAgICAgICB2ZWMyJGwubm9ybWFsaXplKG5vcm1hbCwgbm9ybWFsKTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogUHJvamVjdCBhIENvbnZleCBvbnRvIGEgd29ybGQtb3JpZW50ZWQgYXhpcwogICAgICogQG1ldGhvZCBwcm9qZWN0T250b0F4aXMKICAgICAqIEBzdGF0aWMKICAgICAqIEBwYXJhbSAge0FycmF5fSBvZmZzZXQKICAgICAqIEBwYXJhbSAge0FycmF5fSBsb2NhbEF4aXMKICAgICAqIEBwYXJhbSAge0FycmF5fSByZXN1bHQKICAgICAqLwoKCiAgICBDb252ZXgkMy5wcm90b3R5cGUucHJvamVjdE9udG9Mb2NhbEF4aXMgPSBmdW5jdGlvbiAobG9jYWxBeGlzLCByZXN1bHQpIHsKICAgICAgdmFyIG1heCA9IG51bGwsCiAgICAgICAgICBtaW4gPSBudWxsLAogICAgICAgICAgdiwKICAgICAgICAgIHZhbHVlLAogICAgICAgICAgbG9jYWxBeGlzID0gdG1wVmVjMTsgLy8gR2V0IHByb2plY3RlZCBwb3NpdGlvbiBvZiBhbGwgdmVydGljZXMKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52ZXJ0aWNlcy5sZW5ndGg7IGkrKykgewogICAgICAgIHYgPSB0aGlzLnZlcnRpY2VzW2ldOwogICAgICAgIHZhbHVlID0gZG90JDIodiwgbG9jYWxBeGlzKTsKCiAgICAgICAgaWYgKG1heCA9PT0gbnVsbCB8fCB2YWx1ZSA+IG1heCkgewogICAgICAgICAgbWF4ID0gdmFsdWU7CiAgICAgICAgfQoKICAgICAgICBpZiAobWluID09PSBudWxsIHx8IHZhbHVlIDwgbWluKSB7CiAgICAgICAgICBtaW4gPSB2YWx1ZTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmIChtaW4gPiBtYXgpIHsKICAgICAgICB2YXIgdCA9IG1pbjsKICAgICAgICBtaW4gPSBtYXg7CiAgICAgICAgbWF4ID0gdDsKICAgICAgfQoKICAgICAgdmVjMiRsLnNldChyZXN1bHQsIG1pbiwgbWF4KTsKICAgIH07CgogICAgQ29udmV4JDMucHJvdG90eXBlLnByb2plY3RPbnRvV29ybGRBeGlzID0gZnVuY3Rpb24gKGxvY2FsQXhpcywgc2hhcGVPZmZzZXQsIHNoYXBlQW5nbGUsIHJlc3VsdCkgewogICAgICB2YXIgd29ybGRBeGlzID0gdG1wVmVjMjsKICAgICAgdGhpcy5wcm9qZWN0T250b0xvY2FsQXhpcyhsb2NhbEF4aXMsIHJlc3VsdCk7IC8vIFByb2plY3QgdGhlIHBvc2l0aW9uIG9mIHRoZSBib2R5IG9udG8gdGhlIGF4aXMgLSBuZWVkIHRvIGFkZCB0aGlzIHRvIHRoZSByZXN1bHQKCiAgICAgIGlmIChzaGFwZUFuZ2xlICE9PSAwKSB7CiAgICAgICAgdmVjMiRsLnJvdGF0ZSh3b3JsZEF4aXMsIGxvY2FsQXhpcywgc2hhcGVBbmdsZSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgd29ybGRBeGlzID0gbG9jYWxBeGlzOwogICAgICB9CgogICAgICB2YXIgb2Zmc2V0ID0gZG90JDIoc2hhcGVPZmZzZXQsIHdvcmxkQXhpcyk7CiAgICAgIHZlYzIkbC5zZXQocmVzdWx0LCByZXN1bHRbMF0gKyBvZmZzZXQsIHJlc3VsdFsxXSArIG9mZnNldCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIC50cmlhbmdsZXMgcHJvcGVydHkKICAgICAqIEBtZXRob2QgdXBkYXRlVHJpYW5nbGVzCiAgICAgKi8KCgogICAgQ29udmV4JDMucHJvdG90eXBlLnVwZGF0ZVRyaWFuZ2xlcyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy50cmlhbmdsZXMubGVuZ3RoID0gMDsgLy8gUmV3cml0ZSBvbiBwb2x5ayBub3RhdGlvbiwgYXJyYXkgb2YgbnVtYmVycwoKICAgICAgdmFyIHBvbHlrVmVydHMgPSBbXTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52ZXJ0aWNlcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciB2ID0gdGhpcy52ZXJ0aWNlc1tpXTsKICAgICAgICBwb2x5a1ZlcnRzLnB1c2godlswXSwgdlsxXSk7CiAgICAgIH0gLy8gVHJpYW5ndWxhdGUKCgogICAgICB2YXIgdHJpYW5nbGVzID0gcG9seWsuVHJpYW5ndWxhdGUocG9seWtWZXJ0cyk7IC8vIExvb3Agb3ZlciBhbGwgdHJpYW5nbGVzLCBhZGQgdGhlaXIgaW5lcnRpYSBjb250cmlidXRpb25zIHRvIEkKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7CiAgICAgICAgdmFyIGlkMSA9IHRyaWFuZ2xlc1tpXSwKICAgICAgICAgICAgaWQyID0gdHJpYW5nbGVzW2kgKyAxXSwKICAgICAgICAgICAgaWQzID0gdHJpYW5nbGVzW2kgKyAyXTsgLy8gQWRkIHRvIHRyaWFuZ2xlcwoKICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKFtpZDEsIGlkMiwgaWQzXSk7CiAgICAgIH0KICAgIH07CgogICAgdmFyIHVwZGF0ZUNlbnRlck9mTWFzc19jZW50cm9pZCA9IHZlYzIkbC5jcmVhdGUoKSwKICAgICAgICB1cGRhdGVDZW50ZXJPZk1hc3NfY2VudHJvaWRfdGltZXNfbWFzcyA9IHZlYzIkbC5jcmVhdGUoKSwKICAgICAgICB1cGRhdGVDZW50ZXJPZk1hc3NfYSA9IHZlYzIkbC5jcmVhdGUoKSwKICAgICAgICB1cGRhdGVDZW50ZXJPZk1hc3NfYiA9IHZlYzIkbC5jcmVhdGUoKSwKICAgICAgICB1cGRhdGVDZW50ZXJPZk1hc3NfYyA9IHZlYzIkbC5jcmVhdGUoKTsKICAgIC8qKgogICAgICogVXBkYXRlIHRoZSAuY2VudGVyT2ZNYXNzIHByb3BlcnR5LgogICAgICogQG1ldGhvZCB1cGRhdGVDZW50ZXJPZk1hc3MKICAgICAqLwoKICAgIENvbnZleCQzLnByb3RvdHlwZS51cGRhdGVDZW50ZXJPZk1hc3MgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciB0cmlhbmdsZXMgPSB0aGlzLnRyaWFuZ2xlcywKICAgICAgICAgIHZlcnRzID0gdGhpcy52ZXJ0aWNlcywKICAgICAgICAgIGNtID0gdGhpcy5jZW50ZXJPZk1hc3MsCiAgICAgICAgICBjZW50cm9pZCA9IHVwZGF0ZUNlbnRlck9mTWFzc19jZW50cm9pZCwKICAgICAgICAgIGEgPSB1cGRhdGVDZW50ZXJPZk1hc3NfYSwKICAgICAgICAgIGIgPSB1cGRhdGVDZW50ZXJPZk1hc3NfYiwKICAgICAgICAgIGMgPSB1cGRhdGVDZW50ZXJPZk1hc3NfYywKICAgICAgICAgIGNlbnRyb2lkX3RpbWVzX21hc3MgPSB1cGRhdGVDZW50ZXJPZk1hc3NfY2VudHJvaWRfdGltZXNfbWFzczsKICAgICAgdmVjMiRsLnNldChjbSwgMCwgMCk7CiAgICAgIHZhciB0b3RhbEFyZWEgPSAwOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IHRyaWFuZ2xlcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciB0ID0gdHJpYW5nbGVzW2ldLAogICAgICAgICAgICBhID0gdmVydHNbdFswXV0sCiAgICAgICAgICAgIGIgPSB2ZXJ0c1t0WzFdXSwKICAgICAgICAgICAgYyA9IHZlcnRzW3RbMl1dOwogICAgICAgIHZlYzIkbC5jZW50cm9pZChjZW50cm9pZCwgYSwgYiwgYyk7IC8vIEdldCBtYXNzIGZvciB0aGUgdHJpYW5nbGUgKGRlbnNpdHk9MSBpbiB0aGlzIGNhc2UpCiAgICAgICAgLy8gaHR0cDovL21hdGguc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzgwMTk4L2FyZWEtb2YtdHJpYW5nbGUtdmlhLXZlY3RvcnMKCiAgICAgICAgdmFyIG0gPSB0cmlhbmdsZUFyZWEoYSwgYiwgYyk7CiAgICAgICAgdG90YWxBcmVhICs9IG07IC8vIEFkZCB0byBjZW50ZXIgb2YgbWFzcwoKICAgICAgICB2ZWMyJGwuc2NhbGUoY2VudHJvaWRfdGltZXNfbWFzcywgY2VudHJvaWQsIG0pOwogICAgICAgIHZlYzIkbC5hZGQoY20sIGNtLCBjZW50cm9pZF90aW1lc19tYXNzKTsKICAgICAgfQoKICAgICAgdmVjMiRsLnNjYWxlKGNtLCBjbSwgMSAvIHRvdGFsQXJlYSk7CiAgICB9OwogICAgLyoqCiAgICAgKiBDb21wdXRlIHRoZSBtb21lbnQgb2YgaW5lcnRpYSBvZiB0aGUgQ29udmV4LgogICAgICogQG1ldGhvZCBjb21wdXRlTW9tZW50T2ZJbmVydGlhCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKiBAc2VlIGh0dHA6Ly93d3cuZ2FtZWRldi5uZXQvdG9waWMvMzQyODIyLW1vbWVudC1vZi1pbmVydGlhLW9mLWEtcG9seWdvbi0yZC8KICAgICAqLwoKCiAgICBDb252ZXgkMy5wcm90b3R5cGUuY29tcHV0ZU1vbWVudE9mSW5lcnRpYSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGRlbm9tID0gMC4wLAogICAgICAgICAgbnVtZXIgPSAwLjAsCiAgICAgICAgICBOID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7CgogICAgICBmb3IgKHZhciBqID0gTiAtIDEsIGkgPSAwOyBpIDwgTjsgaiA9IGksIGkrKykgewogICAgICAgIHZhciBwMCA9IHRoaXMudmVydGljZXNbal07CiAgICAgICAgdmFyIHAxID0gdGhpcy52ZXJ0aWNlc1tpXTsKICAgICAgICB2YXIgYSA9IE1hdGguYWJzKHZlYzIkbC5jcm9zc0xlbmd0aChwMCwgcDEpKTsKICAgICAgICB2YXIgYiA9IGRvdCQyKHAxLCBwMSkgKyBkb3QkMihwMSwgcDApICsgZG90JDIocDAsIHAwKTsKICAgICAgICBkZW5vbSArPSBhICogYjsKICAgICAgICBudW1lciArPSBhOwogICAgICB9CgogICAgICByZXR1cm4gMS4wIC8gNi4wICogKGRlbm9tIC8gbnVtZXIpOwogICAgfTsKICAgIC8qKgogICAgICogVXBkYXRlcyB0aGUgLmJvdW5kaW5nUmFkaXVzIHByb3BlcnR5CiAgICAgKiBAbWV0aG9kIHVwZGF0ZUJvdW5kaW5nUmFkaXVzCiAgICAgKi8KCgogICAgQ29udmV4JDMucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nUmFkaXVzID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgdmVydHMgPSB0aGlzLnZlcnRpY2VzLAogICAgICAgICAgcjIgPSAwOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IHZlcnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIGwyID0gdmVjMiRsLnNxdWFyZWRMZW5ndGgodmVydHNbaV0pOwoKICAgICAgICBpZiAobDIgPiByMikgewogICAgICAgICAgcjIgPSBsMjsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMuYm91bmRpbmdSYWRpdXMgPSBNYXRoLnNxcnQocjIpOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IHRoZSBhcmVhIG9mIHRoZSB0cmlhbmdsZSBzcGFubmVkIGJ5IHRoZSB0aHJlZSBwb2ludHMgYSwgYiwgYy4gVGhlIGFyZWEgaXMgcG9zaXRpdmUgaWYgdGhlIHBvaW50cyBhcmUgZ2l2ZW4gaW4gY291bnRlci1jbG9ja3dpc2Ugb3JkZXIsIG90aGVyd2lzZSBuZWdhdGl2ZS4KICAgICAqIEBzdGF0aWMKICAgICAqIEBtZXRob2QgdHJpYW5nbGVBcmVhCiAgICAgKiBAcGFyYW0ge0FycmF5fSBhCiAgICAgKiBAcGFyYW0ge0FycmF5fSBiCiAgICAgKiBAcGFyYW0ge0FycmF5fSBjCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKiBAZGVwcmVjYXRlZAogICAgICovCgoKICAgIENvbnZleCQzLnRyaWFuZ2xlQXJlYSA9IHRyaWFuZ2xlQXJlYTsKCiAgICBmdW5jdGlvbiB0cmlhbmdsZUFyZWEoYSwgYiwgYykgewogICAgICByZXR1cm4gKChiWzBdIC0gYVswXSkgKiAoY1sxXSAtIGFbMV0pIC0gKGNbMF0gLSBhWzBdKSAqIChiWzFdIC0gYVsxXSkpICogMC41OwogICAgfQogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIC5hcmVhCiAgICAgKiBAbWV0aG9kIHVwZGF0ZUFyZWEKICAgICAqLwoKCiAgICBDb252ZXgkMy5wcm90b3R5cGUudXBkYXRlQXJlYSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy51cGRhdGVUcmlhbmdsZXMoKTsKICAgICAgdGhpcy5hcmVhID0gMDsKICAgICAgdmFyIHRyaWFuZ2xlcyA9IHRoaXMudHJpYW5nbGVzLAogICAgICAgICAgdmVydHMgPSB0aGlzLnZlcnRpY2VzOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IHRyaWFuZ2xlcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciB0ID0gdHJpYW5nbGVzW2ldLAogICAgICAgICAgICBhID0gdmVydHNbdFswXV0sCiAgICAgICAgICAgIGIgPSB2ZXJ0c1t0WzFdXSwKICAgICAgICAgICAgYyA9IHZlcnRzW3RbMl1dOyAvLyBHZXQgbWFzcyBmb3IgdGhlIHRyaWFuZ2xlIChkZW5zaXR5PTEgaW4gdGhpcyBjYXNlKQoKICAgICAgICB2YXIgbSA9IHRyaWFuZ2xlQXJlYShhLCBiLCBjKTsKICAgICAgICB0aGlzLmFyZWEgKz0gbTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBjb21wdXRlQUFCQgogICAgICogQHBhcmFtICB7QUFCQn0gICBvdXQKICAgICAqIEBwYXJhbSAge0FycmF5fSAgcG9zaXRpb24KICAgICAqIEBwYXJhbSAge051bWJlcn0gYW5nbGUKICAgICAqIEB0b2RvOiBhcHByb3hpbWF0ZSB3aXRoIGEgbG9jYWwgQUFCQj8KICAgICAqLwoKCiAgICBDb252ZXgkMy5wcm90b3R5cGUuY29tcHV0ZUFBQkIgPSBmdW5jdGlvbiAob3V0LCBwb3NpdGlvbiwgYW5nbGUpIHsKICAgICAgb3V0LnNldEZyb21Qb2ludHModGhpcy52ZXJ0aWNlcywgcG9zaXRpb24sIGFuZ2xlLCAwKTsKICAgIH07CgogICAgdmFyIGludGVyc2VjdENvbnZleF9yYXlTdGFydCA9IHZlYzIkbC5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RDb252ZXhfcmF5RW5kID0gdmVjMiRsLmNyZWF0ZSgpOwogICAgdmFyIGludGVyc2VjdENvbnZleF9ub3JtYWwgPSB2ZWMyJGwuY3JlYXRlKCk7CiAgICAvKioKICAgICAqIEBtZXRob2QgcmF5Y2FzdAogICAgICogQHBhcmFtICB7UmF5Y2FzdFJlc3VsdH0gcmVzdWx0CiAgICAgKiBAcGFyYW0gIHtSYXl9IHJheQogICAgICogQHBhcmFtICB7YXJyYXl9IHBvc2l0aW9uCiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGFuZ2xlCiAgICAgKi8KCiAgICBDb252ZXgkMy5wcm90b3R5cGUucmF5Y2FzdCA9IGZ1bmN0aW9uIChyZXN1bHQsIHJheSwgcG9zaXRpb24sIGFuZ2xlKSB7CiAgICAgIHZhciByYXlTdGFydCA9IGludGVyc2VjdENvbnZleF9yYXlTdGFydDsKICAgICAgdmFyIHJheUVuZCA9IGludGVyc2VjdENvbnZleF9yYXlFbmQ7CiAgICAgIHZhciBub3JtYWwgPSBpbnRlcnNlY3RDb252ZXhfbm9ybWFsOwogICAgICB2YXIgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzOyAvLyBUcmFuc2Zvcm0gdG8gbG9jYWwgc2hhcGUgc3BhY2UKCiAgICAgIHZlYzIkbC50b0xvY2FsRnJhbWUocmF5U3RhcnQsIHJheS5mcm9tLCBwb3NpdGlvbiwgYW5nbGUpOwogICAgICB2ZWMyJGwudG9Mb2NhbEZyYW1lKHJheUVuZCwgcmF5LnRvLCBwb3NpdGlvbiwgYW5nbGUpOwogICAgICB2YXIgbiA9IHZlcnRpY2VzLmxlbmd0aDsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbiAmJiAhcmVzdWx0LnNob3VsZFN0b3AocmF5KTsgaSsrKSB7CiAgICAgICAgdmFyIHExID0gdmVydGljZXNbaV07CiAgICAgICAgdmFyIHEyID0gdmVydGljZXNbKGkgKyAxKSAlIG5dOwogICAgICAgIHZhciBkZWx0YSA9IHZlYzIkbC5nZXRMaW5lU2VnbWVudHNJbnRlcnNlY3Rpb25GcmFjdGlvbihyYXlTdGFydCwgcmF5RW5kLCBxMSwgcTIpOwoKICAgICAgICBpZiAoZGVsdGEgPj0gMCkgewogICAgICAgICAgdmVjMiRsLnN1YnRyYWN0KG5vcm1hbCwgcTIsIHExKTsKICAgICAgICAgIHZlYzIkbC5yb3RhdGUobm9ybWFsLCBub3JtYWwsIC1NYXRoLlBJIC8gMiArIGFuZ2xlKTsKICAgICAgICAgIHZlYzIkbC5ub3JtYWxpemUobm9ybWFsLCBub3JtYWwpOwogICAgICAgICAgcmF5LnJlcG9ydEludGVyc2VjdGlvbihyZXN1bHQsIGRlbHRhLCBub3JtYWwsIGkpOwogICAgICAgIH0KICAgICAgfQogICAgfTsKCiAgICB2YXIgcGljX3IwJDEgPSB2ZWMyJGwuY3JlYXRlKCk7CiAgICB2YXIgcGljX3IxJDEgPSB2ZWMyJGwuY3JlYXRlKCk7CgogICAgQ29udmV4JDMucHJvdG90eXBlLnBvaW50VGVzdCA9IGZ1bmN0aW9uIChsb2NhbFBvaW50KSB7CiAgICAgIHZhciByMCA9IHBpY19yMCQxLAogICAgICAgICAgcjEgPSBwaWNfcjEkMSwKICAgICAgICAgIHZlcnRzID0gdGhpcy52ZXJ0aWNlcywKICAgICAgICAgIGxhc3RDcm9zcyA9IG51bGwsCiAgICAgICAgICBudW1WZXJ0cyA9IHZlcnRzLmxlbmd0aDsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtVmVydHMgKyAxOyBpKyspIHsKICAgICAgICB2YXIgdjAgPSB2ZXJ0c1tpICUgbnVtVmVydHNdLAogICAgICAgICAgICB2MSA9IHZlcnRzWyhpICsgMSkgJSBudW1WZXJ0c107CiAgICAgICAgdmVjMiRsLnN1YnRyYWN0KHIwLCB2MCwgbG9jYWxQb2ludCk7CiAgICAgICAgdmVjMiRsLnN1YnRyYWN0KHIxLCB2MSwgbG9jYWxQb2ludCk7CiAgICAgICAgdmFyIGNyb3NzID0gdmVjMiRsLmNyb3NzTGVuZ3RoKHIwLCByMSk7CgogICAgICAgIGlmIChsYXN0Q3Jvc3MgPT09IG51bGwpIHsKICAgICAgICAgIGxhc3RDcm9zcyA9IGNyb3NzOwogICAgICAgIH0gLy8gSWYgd2UgZ290IGEgZGlmZmVyZW50IHNpZ24gb2YgdGhlIGRpc3RhbmNlIHZlY3RvciwgdGhlIHBvaW50IGlzIG91dCBvZiB0aGUgcG9seWdvbgoKCiAgICAgICAgaWYgKGNyb3NzICogbGFzdENyb3NzIDwgMCkgewogICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgIH0KCiAgICAgICAgbGFzdENyb3NzID0gY3Jvc3M7CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfTsKCiAgICB2YXIgUmF5XzEgPSBSYXkkMjsKCiAgICB2YXIgdmVjMiRrID0gdmVjMiRxLmV4cG9ydHM7CiAgICAvKioKICAgICAqIEEgbGluZSB3aXRoIGEgc3RhcnQgYW5kIGVuZCBwb2ludCB0aGF0IGlzIHVzZWQgdG8gaW50ZXJzZWN0IHNoYXBlcy4gRm9yIGFuIGV4YW1wbGUsIHNlZSB7eyNjcm9zc0xpbmsgIldvcmxkL3JheWNhc3Q6bWV0aG9kIn19V29ybGQucmF5Y2FzdHt7L2Nyb3NzTGlua319CiAgICAgKiBAY2xhc3MgUmF5CiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7YXJyYXl9IFtvcHRpb25zLmZyb21dCiAgICAgKiBAcGFyYW0ge2FycmF5fSBbb3B0aW9ucy50b10KICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY2hlY2tDb2xsaXNpb25SZXNwb25zZT10cnVlXQogICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5za2lwQmFja2ZhY2VzPWZhbHNlXQogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmNvbGxpc2lvbk1hc2s9LTFdCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuY29sbGlzaW9uR3JvdXA9LTFdCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubW9kZT1SYXkuQU5ZXQogICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuY2FsbGJhY2tdCiAgICAgKi8KCgogICAgZnVuY3Rpb24gUmF5JDIob3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsKICAgICAgLyoqCiAgICAgICAqIFJheSBzdGFydCBwb2ludC4KICAgICAgICogQHByb3BlcnR5IHthcnJheX0gZnJvbQogICAgICAgKi8KCiAgICAgIHRoaXMuZnJvbSA9IG9wdGlvbnMuZnJvbSA/IHZlYzIkay5jbG9uZShvcHRpb25zLmZyb20pIDogdmVjMiRrLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogUmF5IGVuZCBwb2ludAogICAgICAgKiBAcHJvcGVydHkge2FycmF5fSB0bwogICAgICAgKi8KCiAgICAgIHRoaXMudG8gPSBvcHRpb25zLnRvID8gdmVjMiRrLmNsb25lKG9wdGlvbnMudG8pIDogdmVjMiRrLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdGhlIFJheSB0byB0YWtlIC5jb2xsaXNpb25SZXNwb25zZSBmbGFncyBpbnRvIGFjY291bnQgb24gYm9kaWVzIGFuZCBzaGFwZXMuCiAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gY2hlY2tDb2xsaXNpb25SZXNwb25zZQogICAgICAgKi8KCiAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb25SZXNwb25zZSA9IG9wdGlvbnMuY2hlY2tDb2xsaXNpb25SZXNwb25zZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jaGVja0NvbGxpc2lvblJlc3BvbnNlIDogdHJ1ZTsKICAgICAgLyoqCiAgICAgICAqIElmIHNldCB0byB0cnVlLCB0aGUgcmF5IHNraXBzIGFueSBoaXRzIHdpdGggbm9ybWFsLmRvdChyYXlEaXJlY3Rpb24pIDwgMC4KICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBza2lwQmFja2ZhY2VzCiAgICAgICAqLwoKICAgICAgdGhpcy5za2lwQmFja2ZhY2VzID0gISFvcHRpb25zLnNraXBCYWNrZmFjZXM7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gY29sbGlzaW9uTWFzawogICAgICAgKiBAZGVmYXVsdCAtMQogICAgICAgKi8KCiAgICAgIHRoaXMuY29sbGlzaW9uTWFzayA9IG9wdGlvbnMuY29sbGlzaW9uTWFzayAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb2xsaXNpb25NYXNrIDogLTE7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gY29sbGlzaW9uR3JvdXAKICAgICAgICogQGRlZmF1bHQgLTEKICAgICAgICovCgogICAgICB0aGlzLmNvbGxpc2lvbkdyb3VwID0gb3B0aW9ucy5jb2xsaXNpb25Hcm91cCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb2xsaXNpb25Hcm91cCA6IC0xOwogICAgICAvKioKICAgICAgICogVGhlIGludGVyc2VjdGlvbiBtb2RlLiBTaG91bGQgYmUge3sjY3Jvc3NMaW5rICJSYXkvQU5ZOnByb3BlcnR5In19UmF5LkFOWXt7L2Nyb3NzTGlua319LCB7eyNjcm9zc0xpbmsgIlJheS9BTEw6cHJvcGVydHkifX1SYXkuQUxMe3svY3Jvc3NMaW5rfX0gb3Ige3sjY3Jvc3NMaW5rICJSYXkvQ0xPU0VTVDpwcm9wZXJ0eSJ9fVJheS5DTE9TRVNUe3svY3Jvc3NMaW5rfX0uCiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtb2RlCiAgICAgICAqLwoKICAgICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1vZGUgOiBSYXkkMi5BTlk7CiAgICAgIC8qKgogICAgICAgKiBDdXJyZW50LCB1c2VyLXByb3ZpZGVkIHJlc3VsdCBjYWxsYmFjay4gV2lsbCBiZSB1c2VkIGlmIG1vZGUgaXMgUmF5LkFMTC4KICAgICAgICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2FsbGJhY2sKICAgICAgICovCgogICAgICB0aGlzLmNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjayB8fCBmdW5jdGlvbgogICAgICAgIC8qcmVzdWx0Ki8KICAgICAgKCkge307CiAgICAgIC8qKgogICAgICAgKiBAcmVhZE9ubHkKICAgICAgICogQHByb3BlcnR5IHthcnJheX0gZGlyZWN0aW9uCiAgICAgICAqLwoKCiAgICAgIHRoaXMuZGlyZWN0aW9uID0gdmVjMiRrLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogTGVuZ3RoIG9mIHRoZSByYXkKICAgICAgICogQHJlYWRPbmx5CiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsZW5ndGgKICAgICAgICovCgogICAgICB0aGlzLmxlbmd0aCA9IDE7CiAgICAgIHRoaXMudXBkYXRlKCk7CiAgICB9CgogICAgUmF5JDIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmF5JDI7CiAgICAvKioKICAgICAqIFRoaXMgcmF5Y2FzdGluZyBtb2RlIHdpbGwgbWFrZSB0aGUgUmF5IHRyYXZlcnNlIHRocm91Z2ggYWxsIGludGVyc2VjdGlvbiBwb2ludHMgYW5kIG9ubHkgcmV0dXJuIHRoZSBjbG9zZXN0IG9uZS4KICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDTE9TRVNUCiAgICAgKi8KCiAgICBSYXkkMi5DTE9TRVNUID0gMTsKICAgIC8qKgogICAgICogVGhpcyByYXljYXN0aW5nIG1vZGUgd2lsbCBtYWtlIHRoZSBSYXkgc3RvcCB3aGVuIGl0IGZpbmRzIHRoZSBmaXJzdCBpbnRlcnNlY3Rpb24gcG9pbnQuCiAgICAgKiBAc3RhdGljCiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQU5ZCiAgICAgKi8KCiAgICBSYXkkMi5BTlkgPSAyOwogICAgLyoqCiAgICAgKiBUaGlzIHJheWNhc3RpbmcgbW9kZSB3aWxsIHRyYXZlcnNlIGFsbCBpbnRlcnNlY3Rpb24gcG9pbnRzIGFuZCBleGVjdXRlcyBhIGNhbGxiYWNrIGZvciBlYWNoIG9uZS4KICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTEwKICAgICAqLwoKICAgIFJheSQyLkFMTCA9IDQ7CiAgICAvKioKICAgICAqIFNob3VsZCBiZSBjYWxsZWQgaWYgeW91IGNoYW5nZSB0aGUgZnJvbSBvciB0byBwb2ludC4KICAgICAqIEBtZXRob2QgdXBkYXRlCiAgICAgKi8KCiAgICBSYXkkMi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgewogICAgICAvLyBVcGRhdGUgLmRpcmVjdGlvbiBhbmQgLmxlbmd0aAogICAgICB2YXIgZCA9IHRoaXMuZGlyZWN0aW9uOwogICAgICB2ZWMyJGsuc3VidHJhY3QoZCwgdGhpcy50bywgdGhpcy5mcm9tKTsKICAgICAgdGhpcy5sZW5ndGggPSB2ZWMyJGsubGVuZ3RoKGQpOwogICAgICB2ZWMyJGsubm9ybWFsaXplKGQsIGQpOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBpbnRlcnNlY3RCb2RpZXMKICAgICAqIEBwYXJhbSB7QXJyYXl9IGJvZGllcyBBbiBhcnJheSBvZiBCb2R5IG9iamVjdHMuCiAgICAgKi8KCgogICAgUmF5JDIucHJvdG90eXBlLmludGVyc2VjdEJvZGllcyA9IGZ1bmN0aW9uIChyZXN1bHQsIGJvZGllcykgewogICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJvZGllcy5sZW5ndGg7ICFyZXN1bHQuc2hvdWxkU3RvcCh0aGlzKSAmJiBpIDwgbDsgaSsrKSB7CiAgICAgICAgdmFyIGJvZHkgPSBib2RpZXNbaV07CiAgICAgICAgdmFyIGFhYmIgPSBib2R5LmdldEFBQkIoKTsKCiAgICAgICAgaWYgKGFhYmIub3ZlcmxhcHNSYXkodGhpcykgPj0gMCB8fCBhYWJiLmNvbnRhaW5zUG9pbnQodGhpcy5mcm9tKSkgewogICAgICAgICAgdGhpcy5pbnRlcnNlY3RCb2R5KHJlc3VsdCwgYm9keSk7CiAgICAgICAgfQogICAgICB9CiAgICB9OwoKICAgIHZhciBpbnRlcnNlY3RCb2R5X3dvcmxkUG9zaXRpb24gPSB2ZWMyJGsuY3JlYXRlKCk7CiAgICAvKioKICAgICAqIFNob290IGEgcmF5IGF0IGEgYm9keSwgZ2V0IGJhY2sgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGhpdC4KICAgICAqIEBtZXRob2QgaW50ZXJzZWN0Qm9keQogICAgICogQHByaXZhdGUKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keQogICAgICovCgogICAgUmF5JDIucHJvdG90eXBlLmludGVyc2VjdEJvZHkgPSBmdW5jdGlvbiAocmVzdWx0LCBib2R5KSB7CiAgICAgIHZhciBjaGVja0NvbGxpc2lvblJlc3BvbnNlID0gdGhpcy5jaGVja0NvbGxpc2lvblJlc3BvbnNlOwoKICAgICAgaWYgKGNoZWNrQ29sbGlzaW9uUmVzcG9uc2UgJiYgIWJvZHkuY29sbGlzaW9uUmVzcG9uc2UpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHZhciB3b3JsZFBvc2l0aW9uID0gaW50ZXJzZWN0Qm9keV93b3JsZFBvc2l0aW9uOwoKICAgICAgZm9yICh2YXIgaSA9IDAsIE4gPSBib2R5LnNoYXBlcy5sZW5ndGg7IGkgPCBOOyBpKyspIHsKICAgICAgICB2YXIgc2hhcGUgPSBib2R5LnNoYXBlc1tpXTsKCiAgICAgICAgaWYgKGNoZWNrQ29sbGlzaW9uUmVzcG9uc2UgJiYgIXNoYXBlLmNvbGxpc2lvblJlc3BvbnNlKSB7CiAgICAgICAgICBjb250aW51ZTsgLy8gU2tpcAogICAgICAgIH0KCiAgICAgICAgaWYgKCh0aGlzLmNvbGxpc2lvbkdyb3VwICYgc2hhcGUuY29sbGlzaW9uTWFzaykgPT09IDAgfHwgKHNoYXBlLmNvbGxpc2lvbkdyb3VwICYgdGhpcy5jb2xsaXNpb25NYXNrKSA9PT0gMCkgewogICAgICAgICAgY29udGludWU7CiAgICAgICAgfSAvLyBHZXQgd29ybGQgYW5nbGUgYW5kIHBvc2l0aW9uIG9mIHRoZSBzaGFwZQoKCiAgICAgICAgdmVjMiRrLnJvdGF0ZSh3b3JsZFBvc2l0aW9uLCBzaGFwZS5wb3NpdGlvbiwgYm9keS5hbmdsZSk7CiAgICAgICAgdmVjMiRrLmFkZCh3b3JsZFBvc2l0aW9uLCB3b3JsZFBvc2l0aW9uLCBib2R5LnBvc2l0aW9uKTsKICAgICAgICB2YXIgd29ybGRBbmdsZSA9IHNoYXBlLmFuZ2xlICsgYm9keS5hbmdsZTsKICAgICAgICB0aGlzLmludGVyc2VjdFNoYXBlKHJlc3VsdCwgc2hhcGUsIHdvcmxkQW5nbGUsIHdvcmxkUG9zaXRpb24sIGJvZHkpOwoKICAgICAgICBpZiAocmVzdWx0LnNob3VsZFN0b3AodGhpcykpIHsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBpbnRlcnNlY3RTaGFwZQogICAgICogQHByaXZhdGUKICAgICAqIEBwYXJhbSB7U2hhcGV9IHNoYXBlCiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUKICAgICAqIEBwYXJhbSB7YXJyYXl9IHBvc2l0aW9uCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHkKICAgICAqLwoKCiAgICBSYXkkMi5wcm90b3R5cGUuaW50ZXJzZWN0U2hhcGUgPSBmdW5jdGlvbiAocmVzdWx0LCBzaGFwZSwgYW5nbGUsIHBvc2l0aW9uLCBib2R5KSB7CiAgICAgIHZhciBmcm9tID0gdGhpcy5mcm9tOyAvLyBDaGVja2luZyByYWRpdXMKCiAgICAgIHZhciBkaXN0YW5jZSA9IGRpc3RhbmNlRnJvbUludGVyc2VjdGlvblNxdWFyZWQoZnJvbSwgdGhpcy5kaXJlY3Rpb24sIHBvc2l0aW9uKTsKCiAgICAgIGlmIChkaXN0YW5jZSA+IHNoYXBlLmJvdW5kaW5nUmFkaXVzICogc2hhcGUuYm91bmRpbmdSYWRpdXMpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHRoaXMuX2N1cnJlbnRCb2R5ID0gYm9keTsKICAgICAgdGhpcy5fY3VycmVudFNoYXBlID0gc2hhcGU7CiAgICAgIHNoYXBlLnJheWNhc3QocmVzdWx0LCB0aGlzLCBwb3NpdGlvbiwgYW5nbGUpOwogICAgICB0aGlzLl9jdXJyZW50Qm9keSA9IHRoaXMuX2N1cnJlbnRTaGFwZSA9IG51bGw7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIEFBQkIgb2YgdGhlIHJheS4KICAgICAqIEBtZXRob2QgZ2V0QUFCQgogICAgICogQHBhcmFtICB7QUFCQn0gYWFiYgogICAgICovCgoKICAgIFJheSQyLnByb3RvdHlwZS5nZXRBQUJCID0gZnVuY3Rpb24gKHJlc3VsdCkgewogICAgICB2YXIgdG8gPSB0aGlzLnRvOwogICAgICB2YXIgZnJvbSA9IHRoaXMuZnJvbTsKICAgICAgdmVjMiRrLnNldChyZXN1bHQubG93ZXJCb3VuZCwgTWF0aC5taW4odG9bMF0sIGZyb21bMF0pLCBNYXRoLm1pbih0b1sxXSwgZnJvbVsxXSkpOwogICAgICB2ZWMyJGsuc2V0KHJlc3VsdC51cHBlckJvdW5kLCBNYXRoLm1heCh0b1swXSwgZnJvbVswXSksIE1hdGgubWF4KHRvWzFdLCBmcm9tWzFdKSk7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIHJlcG9ydEludGVyc2VjdGlvbgogICAgICogQHByaXZhdGUKICAgICAqIEBwYXJhbSAge251bWJlcn0gZnJhY3Rpb24KICAgICAqIEBwYXJhbSAge2FycmF5fSBub3JtYWwKICAgICAqIEBwYXJhbSAge251bWJlcn0gW2ZhY2VJbmRleD0tMV0KICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGludGVyc2VjdGlvbnMgc2hvdWxkIGNvbnRpbnVlCiAgICAgKi8KCgogICAgUmF5JDIucHJvdG90eXBlLnJlcG9ydEludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChyZXN1bHQsIGZyYWN0aW9uLCBub3JtYWwsIGZhY2VJbmRleCkgewogICAgICB2YXIgc2hhcGUgPSB0aGlzLl9jdXJyZW50U2hhcGU7CiAgICAgIHZhciBib2R5ID0gdGhpcy5fY3VycmVudEJvZHk7IC8vIFNraXAgYmFjayBmYWNlcz8KCiAgICAgIGlmICh0aGlzLnNraXBCYWNrZmFjZXMgJiYgdmVjMiRrLmRvdChub3JtYWwsIHRoaXMuZGlyZWN0aW9uKSA+IDApIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7CiAgICAgICAgY2FzZSBSYXkkMi5BTEw6CiAgICAgICAgICByZXN1bHQuc2V0KG5vcm1hbCwgc2hhcGUsIGJvZHksIGZyYWN0aW9uLCBmYWNlSW5kZXgpOwogICAgICAgICAgdGhpcy5jYWxsYmFjayhyZXN1bHQpOwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgUmF5JDIuQ0xPU0VTVDoKICAgICAgICAgIC8vIFN0b3JlIGlmIGNsb3NlciB0aGFuIGN1cnJlbnQgY2xvc2VzdAogICAgICAgICAgaWYgKGZyYWN0aW9uIDwgcmVzdWx0LmZyYWN0aW9uIHx8ICFyZXN1bHQuaGFzSGl0KCkpIHsKICAgICAgICAgICAgcmVzdWx0LnNldChub3JtYWwsIHNoYXBlLCBib2R5LCBmcmFjdGlvbiwgZmFjZUluZGV4KTsKICAgICAgICAgIH0KCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSBSYXkkMi5BTlk6CiAgICAgICAgICAvLyBSZXBvcnQgYW5kIHN0b3AuCiAgICAgICAgICByZXN1bHQuc2V0KG5vcm1hbCwgc2hhcGUsIGJvZHksIGZyYWN0aW9uLCBmYWNlSW5kZXgpOwogICAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgIH07CgogICAgdmFyIHYwID0gdmVjMiRrLmNyZWF0ZSgpLAogICAgICAgIGludGVyc2VjdCA9IHZlYzIkay5jcmVhdGUoKTsKCiAgICBmdW5jdGlvbiBkaXN0YW5jZUZyb21JbnRlcnNlY3Rpb25TcXVhcmVkKGZyb20sIGRpcmVjdGlvbiwgcG9zaXRpb24pIHsKICAgICAgLy8gdjAgaXMgdmVjdG9yIGZyb20gZnJvbSB0byBwb3NpdGlvbgogICAgICB2ZWMyJGsuc3VidHJhY3QodjAsIHBvc2l0aW9uLCBmcm9tKTsKICAgICAgdmFyIGRvdCA9IHZlYzIkay5kb3QodjAsIGRpcmVjdGlvbik7IC8vIGludGVyc2VjdCA9IGRpcmVjdGlvbiAqIGRvdCArIGZyb20KCiAgICAgIHZlYzIkay5zY2FsZShpbnRlcnNlY3QsIGRpcmVjdGlvbiwgZG90KTsKICAgICAgdmVjMiRrLmFkZChpbnRlcnNlY3QsIGludGVyc2VjdCwgZnJvbSk7CiAgICAgIHJldHVybiB2ZWMyJGsuc3F1YXJlZERpc3RhbmNlKHBvc2l0aW9uLCBpbnRlcnNlY3QpOwogICAgfQoKICAgIHZhciB2ZWMyJGogPSB2ZWMyJHEuZXhwb3J0czsKCiAgICB2YXIgUmF5JDEgPSBSYXlfMTsKCiAgICB2YXIgUmF5Y2FzdFJlc3VsdF8xID0gUmF5Y2FzdFJlc3VsdCQxOwogICAgLyoqCiAgICAgKiBTdG9yYWdlIGZvciBSYXkgY2FzdGluZyBoaXQgZGF0YS4KICAgICAqIEBjbGFzcyBSYXljYXN0UmVzdWx0CiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqLwoKICAgIGZ1bmN0aW9uIFJheWNhc3RSZXN1bHQkMSgpIHsKICAgICAgLyoqCiAgICAgICAqIFRoZSBub3JtYWwgb2YgdGhlIGhpdCwgb3JpZW50ZWQgaW4gd29ybGQgc3BhY2UuCiAgICAgICAqIEBwcm9wZXJ0eSB7YXJyYXl9IG5vcm1hbAogICAgICAgKi8KICAgICAgdGhpcy5ub3JtYWwgPSB2ZWMyJGouY3JlYXRlKCk7CiAgICAgIC8qKgogICAgICAgKiBUaGUgaGl0IHNoYXBlLCBvciBudWxsLgogICAgICAgKiBAcHJvcGVydHkge1NoYXBlfSBzaGFwZQogICAgICAgKi8KCiAgICAgIHRoaXMuc2hhcGUgPSBudWxsOwogICAgICAvKioKICAgICAgICogVGhlIGhpdCBib2R5LCBvciBudWxsLgogICAgICAgKiBAcHJvcGVydHkge0JvZHl9IGJvZHkKICAgICAgICovCgogICAgICB0aGlzLmJvZHkgPSBudWxsOwogICAgICAvKioKICAgICAgICogVGhlIGluZGV4IG9mIHRoZSBoaXQgdHJpYW5nbGUsIGlmIHRoZSBoaXQgc2hhcGUgd2FzIGluZGV4YWJsZS4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGZhY2VJbmRleAogICAgICAgKiBAZGVmYXVsdCAtMQogICAgICAgKi8KCiAgICAgIHRoaXMuZmFjZUluZGV4ID0gLTE7CiAgICAgIC8qKgogICAgICAgKiBEaXN0YW5jZSB0byB0aGUgaGl0LCBhcyBhIGZyYWN0aW9uLiAwIGlzIGF0IHRoZSAiZnJvbSIgcG9pbnQsIDEgaXMgYXQgdGhlICJ0byIgcG9pbnQuIFdpbGwgYmUgc2V0IHRvIC0xIGlmIHRoZXJlIHdhcyBubyBoaXQgeWV0LgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gZnJhY3Rpb24KICAgICAgICogQGRlZmF1bHQgLTEKICAgICAgICovCgogICAgICB0aGlzLmZyYWN0aW9uID0gLTE7CiAgICAgIC8qKgogICAgICAgKiBJZiB0aGUgcmF5IHNob3VsZCBzdG9wIHRyYXZlcnNpbmcuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzU3RvcHBlZAogICAgICAgKi8KCiAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7CiAgICB9CiAgICAvKioKICAgICAqIFJlc2V0IGFsbCByZXN1bHQgZGF0YS4gTXVzdCBiZSBkb25lIGJlZm9yZSByZS11c2luZyB0aGUgcmVzdWx0IG9iamVjdC4KICAgICAqIEBtZXRob2QgcmVzZXQKICAgICAqLwoKCiAgICBSYXljYXN0UmVzdWx0JDEucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkgewogICAgICB2ZWMyJGouc2V0KHRoaXMubm9ybWFsLCAwLCAwKTsKICAgICAgdGhpcy5zaGFwZSA9IG51bGw7CiAgICAgIHRoaXMuYm9keSA9IG51bGw7CiAgICAgIHRoaXMuZmFjZUluZGV4ID0gLTE7CiAgICAgIHRoaXMuZnJhY3Rpb24gPSAtMTsKICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTsKICAgIH07CiAgICAvKioKICAgICAqIEdldCB0aGUgZGlzdGFuY2UgdG8gdGhlIGhpdCBwb2ludC4KICAgICAqIEBtZXRob2QgZ2V0SGl0RGlzdGFuY2UKICAgICAqIEBwYXJhbSB7UmF5fSByYXkKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwoKCiAgICBSYXljYXN0UmVzdWx0JDEucHJvdG90eXBlLmdldEhpdERpc3RhbmNlID0gZnVuY3Rpb24gKHJheSkgewogICAgICByZXR1cm4gdmVjMiRqLmRpc3RhbmNlKHJheS5mcm9tLCByYXkudG8pICogdGhpcy5mcmFjdGlvbjsKICAgIH07CiAgICAvKioKICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcmF5IGhpdCBzb21ldGhpbmcgc2luY2UgdGhlIGxhc3QgcmVzZXQoKS4KICAgICAqIEBtZXRob2QgaGFzSGl0CiAgICAgKiBAwq5ldHVybiB7Ym9vbGVhbn0KICAgICAqLwoKCiAgICBSYXljYXN0UmVzdWx0JDEucHJvdG90eXBlLmhhc0hpdCA9IGZ1bmN0aW9uICgpIHsKICAgICAgcmV0dXJuIHRoaXMuZnJhY3Rpb24gIT09IC0xOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IHdvcmxkIGhpdCBwb2ludC4KICAgICAqIEBtZXRob2QgZ2V0SGl0UG9pbnQKICAgICAqIEBwYXJhbSB7YXJyYXl9IG91dAogICAgICogQHBhcmFtIHtSYXl9IHJheQogICAgICovCgoKICAgIFJheWNhc3RSZXN1bHQkMS5wcm90b3R5cGUuZ2V0SGl0UG9pbnQgPSBmdW5jdGlvbiAob3V0LCByYXkpIHsKICAgICAgdmVjMiRqLmxlcnAob3V0LCByYXkuZnJvbSwgcmF5LnRvLCB0aGlzLmZyYWN0aW9uKTsKICAgIH07CiAgICAvKioKICAgICAqIENhbiBiZSBjYWxsZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgaGl0cyB0byBzdG9wIHNlYXJjaGluZyBmb3IgaGl0IHBvaW50cy4KICAgICAqIEBtZXRob2Qgc3RvcAogICAgICovCgoKICAgIFJheWNhc3RSZXN1bHQkMS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBzaG91bGRTdG9wCiAgICAgKiBAcHJpdmF0ZQogICAgICogQHBhcmFtIHtSYXl9IHJheQogICAgICogQHJldHVybiB7Ym9vbGVhbn0KICAgICAqLwoKCiAgICBSYXljYXN0UmVzdWx0JDEucHJvdG90eXBlLnNob3VsZFN0b3AgPSBmdW5jdGlvbiAocmF5KSB7CiAgICAgIHJldHVybiB0aGlzLmlzU3RvcHBlZCB8fCB0aGlzLmZyYWN0aW9uICE9PSAtMSAmJiByYXkubW9kZSA9PT0gUmF5JDEuQU5ZOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBzZXQKICAgICAqIEBwcml2YXRlCiAgICAgKiBAcGFyYW0ge2FycmF5fSBub3JtYWwKICAgICAqIEBwYXJhbSB7U2hhcGV9IHNoYXBlCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcmFjdGlvbgogICAgICogQHBhcmFtIHtudW1iZXJ9IGZhY2VJbmRleAogICAgICovCgoKICAgIFJheWNhc3RSZXN1bHQkMS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG5vcm1hbCwgc2hhcGUsIGJvZHksIGZyYWN0aW9uLCBmYWNlSW5kZXgpIHsKICAgICAgdmVjMiRqLmNvcHkodGhpcy5ub3JtYWwsIG5vcm1hbCk7CiAgICAgIHRoaXMuc2hhcGUgPSBzaGFwZTsKICAgICAgdGhpcy5ib2R5ID0gYm9keTsKICAgICAgdGhpcy5mcmFjdGlvbiA9IGZyYWN0aW9uOwogICAgICB0aGlzLmZhY2VJbmRleCA9IGZhY2VJbmRleDsKICAgIH07CgogICAgdmFyIEV2ZW50RW1pdHRlcl8xID0gRXZlbnRFbWl0dGVyJDM7CiAgICAvKioKICAgICAqIEJhc2UgY2xhc3MgZm9yIG9iamVjdHMgdGhhdCBkaXNwYXRjaGVzIGV2ZW50cy4KICAgICAqIEBjbGFzcyBFdmVudEVtaXR0ZXIKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTsKICAgICAqICAgICBlbWl0dGVyLm9uKCdteUV2ZW50JywgZnVuY3Rpb24oZXZ0KXsKICAgICAqICAgICAgICAgY29uc29sZS5sb2coZXZ0Lm1lc3NhZ2UpOwogICAgICogICAgIH0pOwogICAgICogICAgIGVtaXR0ZXIuZW1pdCh7CiAgICAgKiAgICAgICAgIHR5cGU6ICdteUV2ZW50JywKICAgICAqICAgICAgICAgbWVzc2FnZTogJ0hlbGxvIHdvcmxkIScKICAgICAqICAgICB9KTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIEV2ZW50RW1pdHRlciQzKCkgewogICAgICB0aGlzLnRtcEFycmF5ID0gW107CiAgICB9CgogICAgRXZlbnRFbWl0dGVyJDMucHJvdG90eXBlID0gewogICAgICBjb25zdHJ1Y3RvcjogRXZlbnRFbWl0dGVyJDMsCgogICAgICAvKioKICAgICAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyCiAgICAgICAqIEBtZXRob2Qgb24KICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0eXBlCiAgICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBsaXN0ZW5lcgogICAgICAgKiBAcmV0dXJuIHtFdmVudEVtaXR0ZXJ9IFRoZSBzZWxmIG9iamVjdCwgZm9yIGNoYWluYWJpbGl0eS4KICAgICAgICogQGV4YW1wbGUKICAgICAgICogICAgIGVtaXR0ZXIub24oJ215RXZlbnQnLCBmdW5jdGlvbihldnQpewogICAgICAgKiAgICAgICAgIGNvbnNvbGUubG9nKCdteUV2dCB3YXMgdHJpZ2dlcmVkIScpOwogICAgICAgKiAgICAgfSk7CiAgICAgICAqLwogICAgICBvbjogZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyLCBjb250ZXh0KSB7CiAgICAgICAgbGlzdGVuZXIuY29udGV4dCA9IGNvbnRleHQgfHwgdGhpczsKCiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTsKICAgICAgICB9CgogICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7CgogICAgICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gPT09IHVuZGVmaW5lZCkgewogICAgICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107CiAgICAgICAgfQoKICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkgewogICAgICAgICAgbGlzdGVuZXJzW3R5cGVdLnB1c2gobGlzdGVuZXIpOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIHRoaXM7CiAgICAgIH0sCgogICAgICAvKioKICAgICAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyCiAgICAgICAqIEBtZXRob2Qgb2ZmCiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdHlwZQogICAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gbGlzdGVuZXIKICAgICAgICogQHJldHVybiB7RXZlbnRFbWl0dGVyfSBUaGUgc2VsZiBvYmplY3QsIGZvciBjaGFpbmFiaWxpdHkuCiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqICAgICBlbWl0dGVyLm9uKCdteUV2ZW50JywgaGFuZGxlcik7IC8vIEFkZCBoYW5kbGVyCiAgICAgICAqICAgICBlbWl0dGVyLm9mZignbXlFdmVudCcsIGhhbmRsZXIpOyAvLyBSZW1vdmUgaGFuZGxlcgogICAgICAgKi8KICAgICAgb2ZmOiBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHsKICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzOwoKICAgICAgICBpZiAoIWxpc3RlbmVycyB8fCAhbGlzdGVuZXJzW3R5cGVdKSB7CiAgICAgICAgICByZXR1cm4gdGhpczsKICAgICAgICB9CgogICAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKTsKCiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgewogICAgICAgICAgbGlzdGVuZXJzW3R5cGVdLnNwbGljZShpbmRleCwgMSk7CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gdGhpczsKICAgICAgfSwKCiAgICAgIC8qKgogICAgICAgKiBDaGVjayBpZiBhbiBldmVudCBsaXN0ZW5lciBpcyBhZGRlZAogICAgICAgKiBAbWV0aG9kIGhhcwogICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHR5cGUKICAgICAgICogQHBhcmFtICB7RnVuY3Rpb259IGxpc3RlbmVyCiAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59CiAgICAgICAqLwogICAgICBoYXM6IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikgewogICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgewogICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgIH0KCiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyczsKCiAgICAgICAgaWYgKGxpc3RlbmVyKSB7CiAgICAgICAgICBpZiAobGlzdGVuZXJzW3R5cGVdICE9PSB1bmRlZmluZWQgJiYgbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpICE9PSAtMSkgewogICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgIH0KICAgICAgICB9IGVsc2UgewogICAgICAgICAgaWYgKGxpc3RlbmVyc1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIEVtaXQgYW4gZXZlbnQuCiAgICAgICAqIEBtZXRob2QgZW1pdAogICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50CiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gZXZlbnQudHlwZQogICAgICAgKiBAcmV0dXJuIHtFdmVudEVtaXR0ZXJ9IFRoZSBzZWxmIG9iamVjdCwgZm9yIGNoYWluYWJpbGl0eS4KICAgICAgICogQGV4YW1wbGUKICAgICAgICogICAgIGVtaXR0ZXIuZW1pdCh7CiAgICAgICAqICAgICAgICAgdHlwZTogJ215RXZlbnQnLAogICAgICAgKiAgICAgICAgIGN1c3RvbURhdGE6IDEyMwogICAgICAgKiAgICAgfSk7CiAgICAgICAqLwogICAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnQpIHsKICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHsKICAgICAgICAgIHJldHVybiB0aGlzOwogICAgICAgIH0KCiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyczsKICAgICAgICB2YXIgbGlzdGVuZXJBcnJheSA9IGxpc3RlbmVyc1tldmVudC50eXBlXTsKCiAgICAgICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkgewogICAgICAgICAgZXZlbnQudGFyZ2V0ID0gdGhpczsgLy8gTmVlZCB0byBjb3B5IHRoZSBsaXN0ZW5lciBhcnJheSwgaW4gY2FzZSBzb21lIGxpc3RlbmVyIHdhcyBhZGRlZC9yZW1vdmVkIGluc2lkZSBhIGxpc3RlbmVyCgogICAgICAgICAgdmFyIHRtcEFycmF5ID0gdGhpcy50bXBBcnJheTsKCiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVyQXJyYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7CiAgICAgICAgICAgIHRtcEFycmF5W2ldID0gbGlzdGVuZXJBcnJheVtpXTsKICAgICAgICAgIH0KCiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRtcEFycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKykgewogICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0bXBBcnJheVtpXTsKICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChsaXN0ZW5lci5jb250ZXh0LCBldmVudCk7CiAgICAgICAgICB9CgogICAgICAgICAgdG1wQXJyYXkubGVuZ3RoID0gMDsKICAgICAgICB9CgogICAgICAgIHJldHVybiB0aGlzOwogICAgICB9CiAgICB9OwoKICAgIHZhciB2ZWMyJGkgPSB2ZWMyJHEuZXhwb3J0cywKICAgICAgICBhZGQkMiA9IHZlYzIkaS5hZGQsCiAgICAgICAgc3ViJDIgPSB2ZWMyJGkuc3VidHJhY3QsCiAgICAgICAgdmVjMmNyZWF0ZSA9IHZlYzIkaS5jcmVhdGUsCiAgICAgICAgZGVjb21wID0gc3JjLAogICAgICAgIENvbnZleCQyID0gQ29udmV4XzEsCiAgICAgICAgUmF5Y2FzdFJlc3VsdCA9IFJheWNhc3RSZXN1bHRfMSwKICAgICAgICBSYXkgPSBSYXlfMSwKICAgICAgICBBQUJCJDEgPSBBQUJCXzEsCiAgICAgICAgRXZlbnRFbWl0dGVyJDIgPSBFdmVudEVtaXR0ZXJfMTsKCiAgICB2YXIgQm9keV8xID0gQm9keSQzOwogICAgLyoqCiAgICAgKiBBIHJpZ2lkIGJvZHkuIEhhcyBnb3QgYSBjZW50ZXIgb2YgbWFzcywgcG9zaXRpb24sIHZlbG9jaXR5IGFuZCBhIG51bWJlciBvZgogICAgICogc2hhcGVzIHRoYXQgYXJlIHVzZWQgZm9yIGNvbGxpc2lvbnMuCiAgICAgKgogICAgICogQGNsYXNzIEJvZHkKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyCiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFsbG93U2xlZXA9dHJ1ZV0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5hbmdsZT0wXQogICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmFuZ3VsYXJEYW1waW5nPTAuMV0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5hbmd1bGFyRm9yY2U9MF0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5hbmd1bGFyVmVsb2NpdHk9MF0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jY2RJdGVyYXRpb25zPTEwXQogICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNjZFNwZWVkVGhyZXNob2xkPS0xXQogICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb2xsaXNpb25SZXNwb25zZV0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kYW1waW5nPTAuMV0KICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZml4ZWRSb3RhdGlvbj1mYWxzZV0KICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZml4ZWRYPWZhbHNlXQogICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maXhlZFk9ZmFsc2VdCiAgICAgKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5mb3JjZV0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5ncmF2aXR5U2NhbGU9MV0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXNzPTBdIEEgbnVtYmVyID49IDAuIElmIHplcm8sIHRoZSAudHlwZSB3aWxsIGJlIHNldCB0byBCb2R5LlNUQVRJQy4KICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLnBvc2l0aW9uXQogICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNsZWVwU3BlZWRMaW1pdF0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zbGVlcFRpbWVMaW1pdF0KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy50eXBlXSBTZWUge3sjY3Jvc3NMaW5rICJCb2R5L3R5cGU6cHJvcGVydHkifX17ey9jcm9zc0xpbmt9fQogICAgICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMudmVsb2NpdHldCiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqCiAgICAgKiAgICAgLy8gQ3JlYXRlIGEgdHlwaWNhbCBkeW5hbWljIGJvZHkKICAgICAqICAgICB2YXIgYm9keSA9IG5ldyBCb2R5KHsKICAgICAqICAgICAgICAgbWFzczogMSwgLy8gbm9uLXplcm8gbWFzcyB3aWxsIHNldCB0eXBlIHRvIEJvZHkuRFlOQU1JQwogICAgICogICAgICAgICBwb3NpdGlvbjogWzAsIDVdLAogICAgICogICAgICAgICBhbmdsZTogMCwKICAgICAqICAgICAgICAgdmVsb2NpdHk6IFswLCAwXSwKICAgICAqICAgICAgICAgYW5ndWxhclZlbG9jaXR5OiAwCiAgICAgKiAgICAgfSk7CiAgICAgKgogICAgICogICAgIC8vIEFkZCBhIGNpcmN1bGFyIHNoYXBlIHRvIHRoZSBib2R5CiAgICAgKiAgICAgdmFyIGNpcmNsZVNoYXBlID0gbmV3IENpcmNsZSh7IHJhZGl1czogMC41IH0pOwogICAgICogICAgIGJvZHkuYWRkU2hhcGUoY2lyY2xlU2hhcGUpOwogICAgICoKICAgICAqICAgICAvLyBBZGQgdGhlIGJvZHkgdG8gdGhlIHdvcmxkCiAgICAgKiAgICAgd29ybGQuYWRkQm9keShib2R5KTsKICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICoKICAgICAqICAgICAvLyBDcmVhdGUgYSBzdGF0aWMgcGxhbmUgYm9keQogICAgICogICAgIHZhciBwbGFuZUJvZHkgPSBuZXcgQm9keSh7CiAgICAgKiAgICAgICAgIG1hc3M6IDAsIC8vIHplcm8gbWFzcyB3aWxsIHNldCB0eXBlIHRvIEJvZHkuU1RBVElDCiAgICAgKiAgICAgICAgIHBvc2l0aW9uOiBbMCwgMF0KICAgICAqICAgICB9KTsKICAgICAqICAgICB2YXIgcGxhbmVTaGFwZSA9IG5ldyBQbGFuZSgpOwogICAgICogICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTsKICAgICAqICAgICB3b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7CiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqCiAgICAgKiAgICAgLy8gQ3JlYXRlIGEgbW92aW5nIGtpbmVtYXRpYyBib3ggYm9keQogICAgICogICAgIHZhciBwbGF0Zm9ybUJvZHkgPSBuZXcgQm9keSh7CiAgICAgKiAgICAgICAgIHR5cGU6IEJvZHkuS0lORU1BVElDLAogICAgICogICAgICAgICBwb3NpdGlvbjogWzAsIDNdLAogICAgICogICAgICAgICB2ZWxvY2l0eTogWzEsIDBdCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgdmFyIGJveFNoYXBlID0gbmV3IEJveCh7IHdpZHRoOiAyLCBoZWlnaHQ6IDAuNSB9KTsKICAgICAqICAgICBwbGF0Zm9ybUJvZHkuYWRkU2hhcGUoYm94U2hhcGUpOwogICAgICogICAgIHdvcmxkLmFkZEJvZHkocGxhdGZvcm1Cb2R5KTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIEJvZHkkMyhvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICBFdmVudEVtaXR0ZXIkMi5jYWxsKHRoaXMpOwogICAgICAvKioKICAgICAgICogVGhlIGJvZHkgaWRlbnRpZmllci4gUmVhZCBvbmx5IQogICAgICAgKiBAcmVhZG9ubHkKICAgICAgICogQHByb3BlcnR5IGlkCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5pZCA9IG9wdGlvbnMuaWQgfHwgKytCb2R5JDMuX2lkQ291bnRlcjsKICAgICAgLyoqCiAgICAgICAqIEluZGV4IG9mIHRoZSBib2R5IGluIHRoZSBXb3JsZCAuYm9kaWVzIGFycmF5LiBJcyBzZXQgdG8gLTEgaWYgdGhlIGJvZHkgaXNuJ3QgYWRkZWQgdG8gYSBXb3JsZC4KICAgICAgICogQHJlYWRvbmx5CiAgICAgICAqIEBwcm9wZXJ0eSBpbmRleAogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMuaW5kZXggPSAtMTsKICAgICAgLyoqCiAgICAgICAqIFRoZSB3b3JsZCB0aGF0IHRoaXMgYm9keSBpcyBhZGRlZCB0byAocmVhZCBvbmx5KS4gVGhpcyBwcm9wZXJ0eSBpcyBzZXQgdG8gTlVMTCBpZiB0aGUgYm9keSBpcyBub3QgYWRkZWQgdG8gYW55IHdvcmxkLgogICAgICAgKiBAcmVhZG9ubHkKICAgICAgICogQHByb3BlcnR5IHdvcmxkCiAgICAgICAqIEB0eXBlIHtXb3JsZH0KICAgICAgICovCgogICAgICB0aGlzLndvcmxkID0gbnVsbDsKICAgICAgLyoqCiAgICAgICAqIFRoZSBzaGFwZXMgb2YgdGhlIGJvZHkuCiAgICAgICAqCiAgICAgICAqIEBwcm9wZXJ0eSBzaGFwZXMKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMuc2hhcGVzID0gW107CiAgICAgIC8qKgogICAgICAgKiBUaGUgbWFzcyBvZiB0aGUgYm9keS4gSWYgeW91IGNoYW5nZSB0aGlzIG51bWJlciwgeW91IHNob3VsZCBjYWxsIHt7I2Nyb3NzTGluayAiQm9keS91cGRhdGVNYXNzUHJvcGVydGllczptZXRob2QifX17ey9jcm9zc0xpbmt9fS4KICAgICAgICoKICAgICAgICogQHByb3BlcnR5IG1hc3MKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICoKICAgICAgICogQGV4YW1wbGUKICAgICAgICogICAgIGJvZHkubWFzcyA9IDE7CiAgICAgICAqICAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7CiAgICAgICAqLwoKICAgICAgdGhpcy5tYXNzID0gb3B0aW9ucy5tYXNzIHx8IDA7CiAgICAgIC8qKgogICAgICAgKiBUaGUgaW52ZXJzZSBtYXNzIG9mIHRoZSBib2R5LgogICAgICAgKgogICAgICAgKiBAcmVhZG9ubHkKICAgICAgICogQHByb3BlcnR5IGludk1hc3MKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmludk1hc3MgPSAwOwogICAgICAvKioKICAgICAgICogVGhlIGluZXJ0aWEgb2YgdGhlIGJvZHkgYXJvdW5kIHRoZSBaIGF4aXMuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgaW5lcnRpYQogICAgICAgKiBAdHlwZSB7bnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMuaW5lcnRpYSA9IDA7CiAgICAgIC8qKgogICAgICAgKiBUaGUgaW52ZXJzZSBpbmVydGlhIG9mIHRoZSBib2R5LgogICAgICAgKiBAcmVhZG9ubHkKICAgICAgICogQHByb3BlcnR5IGludkluZXJ0aWEKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmludkluZXJ0aWEgPSAwOwogICAgICB0aGlzLmludk1hc3NTb2x2ZSA9IDA7CiAgICAgIHRoaXMuaW52SW5lcnRpYVNvbHZlID0gMDsKICAgICAgLyoqCiAgICAgICAqIFNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIGZpeCB0aGUgcm90YXRpb24gb2YgdGhlIGJvZHkuCiAgICAgICAqCiAgICAgICAqIEBwcm9wZXJ0eSBmaXhlZFJvdGF0aW9uCiAgICAgICAqIEB0eXBlIHtCb29sZWFufQogICAgICAgKgogICAgICAgKiBAZXhhbXBsZQogICAgICAgKiAgICAgLy8gRml4IHJvdGF0aW9uIGR1cmluZyBydW50aW1lCiAgICAgICAqICAgICBib2R5LmZpeGVkUm90YXRpb24gPSB0cnVlOwogICAgICAgKiAgICAgYm9keS51cGRhdGVNYXNzUHJvcGVydGllcygpOwogICAgICAgKi8KCiAgICAgIHRoaXMuZml4ZWRSb3RhdGlvbiA9ICEhb3B0aW9ucy5maXhlZFJvdGF0aW9uOwogICAgICAvKioKICAgICAgICogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gZml4IHRoZSBib2R5IG1vdmVtZW50IGFsb25nIHRoZSBYIGF4aXMuIFRoZSBib2R5IHdpbGwgc3RpbGwgYmUgYWJsZSB0byBtb3ZlIGFsb25nIFkuCiAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZml4ZWRYCiAgICAgICAqCiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqICAgICAvLyBGaXggWCBtb3ZlbWVudCBvbiBib2R5IGNyZWF0aW9uCiAgICAgICAqICAgICB2YXIgYm9keSA9IG5ldyBCb2R5KHsgbWFzczogMSwgZml4ZWRYOiB0cnVlIH0pOwogICAgICAgKgogICAgICAgKiBAZXhhbXBsZQogICAgICAgKiAgICAgLy8gRml4IFggbW92ZW1lbnQgZHVyaW5nIHJ1bnRpbWUKICAgICAgICogICAgIGJvZHkuZml4ZWRYID0gdHJ1ZTsKICAgICAgICogICAgIGJvZHkudXBkYXRlTWFzc1Byb3BlcnRpZXMoKTsKICAgICAgICovCgogICAgICB0aGlzLmZpeGVkWCA9ICEhb3B0aW9ucy5maXhlZFg7CiAgICAgIC8qKgogICAgICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBmaXggdGhlIGJvZHkgbW92ZW1lbnQgYWxvbmcgdGhlIFkgYXhpcy4gVGhlIGJvZHkgd2lsbCBzdGlsbCBiZSBhYmxlIHRvIG1vdmUgYWxvbmcgWC4gU2VlIC5maXhlZFgKICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBmaXhlZFkKICAgICAgICovCgogICAgICB0aGlzLmZpeGVkWSA9ICEhb3B0aW9ucy5maXhlZFk7CiAgICAgIC8qKgogICAgICAgKiBAcHJpdmF0ZQogICAgICAgKiBAcHJvcGVydHkge2FycmF5fSBtYXNzTXVsdGlwbGllcgogICAgICAgKi8KCiAgICAgIHRoaXMubWFzc011bHRpcGxpZXIgPSB2ZWMyY3JlYXRlKCk7CiAgICAgIC8qKgogICAgICAgKiBUaGUgcG9zaXRpb24gb2YgdGhlIGJvZHkgaW4gdGhlIHdvcmxkLiBEb24ndCB1c2UgdGhpcyBmb3IgcmVuZGVyaW5nLCBpbnN0ZWFkIHVzZSAuaW50ZXJwb2xhdGVkUG9zaXRpb24KICAgICAgICogQHByb3BlcnR5IHBvc2l0aW9uCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLnBvc2l0aW9uID0gb3B0aW9ucy5wb3NpdGlvbiA/IHZlYzIkaS5jbG9uZShvcHRpb25zLnBvc2l0aW9uKSA6IHZlYzJjcmVhdGUoKTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGJvZHkuIFVzZSB0aGlzIGZvciByZW5kZXJpbmcuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgaW50ZXJwb2xhdGVkUG9zaXRpb24KICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMuaW50ZXJwb2xhdGVkUG9zaXRpb24gPSB2ZWMyJGkuY2xvbmUodGhpcy5wb3NpdGlvbik7CiAgICAgIC8qKgogICAgICAgKiBUaGUgcHJldmlvdXMgcG9zaXRpb24gb2YgdGhlIGJvZHkuCiAgICAgICAqIEBwcm9wZXJ0eSBwcmV2aW91c1Bvc2l0aW9uCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24gPSB2ZWMyJGkuY2xvbmUodGhpcy5wb3NpdGlvbik7CiAgICAgIC8qKgogICAgICAgKiBUaGUgY3VycmVudCB2ZWxvY2l0eSBvZiB0aGUgYm9keS4KICAgICAgICogQHByb3BlcnR5IHZlbG9jaXR5CiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLnZlbG9jaXR5ID0gb3B0aW9ucy52ZWxvY2l0eSA/IHZlYzIkaS5jbG9uZShvcHRpb25zLnZlbG9jaXR5KSA6IHZlYzJjcmVhdGUoKTsKICAgICAgLyoqCiAgICAgICAqIENvbnN0cmFpbnQgdmVsb2NpdHkgdGhhdCB3YXMgYWRkZWQgdG8gdGhlIGJvZHkgZHVyaW5nIHRoZSBsYXN0IHN0ZXAuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgdmxhbWJkYQogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy52bGFtYmRhID0gdmVjMmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogQW5ndWxhciBjb25zdHJhaW50IHZlbG9jaXR5IHRoYXQgd2FzIGFkZGVkIHRvIHRoZSBib2R5IGR1cmluZyBsYXN0IHN0ZXAuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgd2xhbWJkYQogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy53bGFtYmRhID0gMDsKICAgICAgLyoqCiAgICAgICAqIFRoZSBhbmdsZSBvZiB0aGUgYm9keSwgaW4gcmFkaWFucy4KICAgICAgICogQHByb3BlcnR5IGFuZ2xlCiAgICAgICAqIEB0eXBlIHtudW1iZXJ9CiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqICAgICAvLyBUaGUgYW5nbGUgcHJvcGVydHkgaXMgbm90IG5vcm1hbGl6ZWQgdG8gdGhlIGludGVydmFsIDAgdG8gMipwaSwgaXQgY2FuIGJlIGFueSB2YWx1ZS4KICAgICAgICogICAgIC8vIElmIHlvdSBuZWVkIGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAyKnBpLCB1c2UgdGhlIGZvbGxvd2luZyBmdW5jdGlvbiB0byBub3JtYWxpemUgaXQuCiAgICAgICAqICAgICBmdW5jdGlvbiBub3JtYWxpemVBbmdsZShhbmdsZSl7CiAgICAgICAqICAgICAgICAgYW5nbGUgPSBhbmdsZSAlICgyKk1hdGguUEkpOwogICAgICAgKiAgICAgICAgIGlmKGFuZ2xlIDwgMCl7CiAgICAgICAqICAgICAgICAgICAgIGFuZ2xlICs9ICgyKk1hdGguUEkpOwogICAgICAgKiAgICAgICAgIH0KICAgICAgICogICAgICAgICByZXR1cm4gYW5nbGU7CiAgICAgICAqICAgICB9CiAgICAgICAqLwoKICAgICAgdGhpcy5hbmdsZSA9IG9wdGlvbnMuYW5nbGUgfHwgMDsKICAgICAgLyoqCiAgICAgICAqIFRoZSBwcmV2aW91cyBhbmdsZSBvZiB0aGUgYm9keS4KICAgICAgICogQHJlYWRvbmx5CiAgICAgICAqIEBwcm9wZXJ0eSBwcmV2aW91c0FuZ2xlCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5wcmV2aW91c0FuZ2xlID0gdGhpcy5hbmdsZTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBpbnRlcnBvbGF0ZWQgYW5nbGUgb2YgdGhlIGJvZHkuIFVzZSB0aGlzIGZvciByZW5kZXJpbmcuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgaW50ZXJwb2xhdGVkQW5nbGUKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmludGVycG9sYXRlZEFuZ2xlID0gdGhpcy5hbmdsZTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBhbmd1bGFyIHZlbG9jaXR5IG9mIHRoZSBib2R5LCBpbiByYWRpYW5zIHBlciBzZWNvbmQuCiAgICAgICAqIEBwcm9wZXJ0eSBhbmd1bGFyVmVsb2NpdHkKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSA9IG9wdGlvbnMuYW5ndWxhclZlbG9jaXR5IHx8IDA7CiAgICAgIC8qKgogICAgICAgKiBUaGUgZm9yY2UgYWN0aW5nIG9uIHRoZSBib2R5LiBTaW5jZSB0aGUgYm9keSBmb3JjZSAoYW5kIHt7I2Nyb3NzTGluayAiQm9keS9hbmd1bGFyRm9yY2U6cHJvcGVydHkifX17ey9jcm9zc0xpbmt9fSkgd2lsbCBiZSB6ZXJvZWQgYWZ0ZXIgZWFjaCBzdGVwLCBzbyB5b3UgbmVlZCB0byBzZXQgdGhlIGZvcmNlIGJlZm9yZSBlYWNoIHN0ZXAuCiAgICAgICAqIEBwcm9wZXJ0eSBmb3JjZQogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqCiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqICAgICAvLyBUaGlzIHByb2R1Y2VzIGEgZm9yY2VmaWVsZCBvZiAxIE5ld3RvbiBpbiB0aGUgcG9zaXRpdmUgeCBkaXJlY3Rpb24uCiAgICAgICAqICAgICBmb3IodmFyIGk9MDsgaTxudW1TdGVwczsgaSsrKXsKICAgICAgICogICAgICAgICBib2R5LmZvcmNlWzBdID0gMTsKICAgICAgICogICAgICAgICB3b3JsZC5zdGVwKDEvNjApOwogICAgICAgKiAgICAgfQogICAgICAgKgogICAgICAgKiBAZXhhbXBsZQogICAgICAgKiAgICAgLy8gVGhpcyB3aWxsIGFwcGx5IGEgcm90YXRpb25hbCBmb3JjZSBvbiB0aGUgYm9keQogICAgICAgKiAgICAgZm9yKHZhciBpPTA7IGk8bnVtU3RlcHM7IGkrKyl7CiAgICAgICAqICAgICAgICAgYm9keS5hbmd1bGFyRm9yY2UgPSAtMzsKICAgICAgICogICAgICAgICB3b3JsZC5zdGVwKDEvNjApOwogICAgICAgKiAgICAgfQogICAgICAgKi8KCiAgICAgIHRoaXMuZm9yY2UgPSBvcHRpb25zLmZvcmNlID8gdmVjMiRpLmNsb25lKG9wdGlvbnMuZm9yY2UpIDogdmVjMmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogVGhlIGFuZ3VsYXIgZm9yY2UgYWN0aW5nIG9uIHRoZSBib2R5LiBTZWUge3sjY3Jvc3NMaW5rICJCb2R5L2ZvcmNlOnByb3BlcnR5In19e3svY3Jvc3NMaW5rfX0uCiAgICAgICAqIEBwcm9wZXJ0eSBhbmd1bGFyRm9yY2UKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmFuZ3VsYXJGb3JjZSA9IG9wdGlvbnMuYW5ndWxhckZvcmNlIHx8IDA7CiAgICAgIC8qKgogICAgICAgKiBUaGUgbGluZWFyIGRhbXBpbmcgYWN0aW5nIG9uIHRoZSBib2R5IGluIHRoZSB2ZWxvY2l0eSBkaXJlY3Rpb24uIFNob3VsZCBiZSBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMS4KICAgICAgICogQHByb3BlcnR5IGRhbXBpbmcKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICogQGRlZmF1bHQgMC4xCiAgICAgICAqLwoKICAgICAgdGhpcy5kYW1waW5nID0gb3B0aW9ucy5kYW1waW5nICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmRhbXBpbmcgOiAwLjE7CiAgICAgIC8qKgogICAgICAgKiBUaGUgYW5ndWxhciBmb3JjZSBhY3Rpbmcgb24gdGhlIGJvZHkuIFNob3VsZCBiZSBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMS4KICAgICAgICogQHByb3BlcnR5IGFuZ3VsYXJEYW1waW5nCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqIEBkZWZhdWx0IDAuMQogICAgICAgKi8KCiAgICAgIHRoaXMuYW5ndWxhckRhbXBpbmcgPSBvcHRpb25zLmFuZ3VsYXJEYW1waW5nICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmFuZ3VsYXJEYW1waW5nIDogMC4xOwogICAgICAvKioKICAgICAgICogVGhlIHR5cGUgb2YgbW90aW9uIHRoaXMgYm9keSBoYXMuIFNob3VsZCBiZSBvbmUgb2Y6IHt7I2Nyb3NzTGluayAiQm9keS9TVEFUSUM6cHJvcGVydHkifX1Cb2R5LlNUQVRJQ3t7L2Nyb3NzTGlua319LCB7eyNjcm9zc0xpbmsgIkJvZHkvRFlOQU1JQzpwcm9wZXJ0eSJ9fUJvZHkuRFlOQU1JQ3t7L2Nyb3NzTGlua319IGFuZCB7eyNjcm9zc0xpbmsgIkJvZHkvS0lORU1BVElDOnByb3BlcnR5In19Qm9keS5LSU5FTUFUSUN7ey9jcm9zc0xpbmt9fS4KICAgICAgICoKICAgICAgICogKiBTdGF0aWMgYm9kaWVzIGRvIG5vdCBtb3ZlLCBhbmQgdGhleSBkbyBub3QgcmVzcG9uZCB0byBmb3JjZXMgb3IgY29sbGlzaW9uLgogICAgICAgKiAqIER5bmFtaWMgYm9kaWVzIGJvZHkgY2FuIG1vdmUgYW5kIHJlc3BvbmQgdG8gY29sbGlzaW9ucyBhbmQgZm9yY2VzLgogICAgICAgKiAqIEtpbmVtYXRpYyBib2RpZXMgb25seSBtb3ZlcyBhY2NvcmRpbmcgdG8gaXRzIC52ZWxvY2l0eSwgYW5kIGRvZXMgbm90IHJlc3BvbmQgdG8gY29sbGlzaW9ucyBvciBmb3JjZS4KICAgICAgICoKICAgICAgICogQHByb3BlcnR5IHR5cGUKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICoKICAgICAgICogQGV4YW1wbGUKICAgICAgICogICAgIC8vIEJvZGllcyBhcmUgc3RhdGljIGJ5IGRlZmF1bHQuIFN0YXRpYyBib2RpZXMgd2lsbCBuZXZlciBtb3ZlLgogICAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSgpOwogICAgICAgKiAgICAgY29uc29sZS5sb2coYm9keS50eXBlID09IEJvZHkuU1RBVElDKTsgLy8gdHJ1ZQogICAgICAgKgogICAgICAgKiBAZXhhbXBsZQogICAgICAgKiAgICAgLy8gQnkgc2V0dGluZyB0aGUgbWFzcyBvZiBhIGJvZHkgdG8gYSBub256ZXJvIG51bWJlciwgdGhlIGJvZHkKICAgICAgICogICAgIC8vIHdpbGwgYmVjb21lIGR5bmFtaWMgYW5kIHdpbGwgbW92ZSBhbmQgaW50ZXJhY3Qgd2l0aCBvdGhlciBib2RpZXMuCiAgICAgICAqICAgICB2YXIgZHluYW1pY0JvZHkgPSBuZXcgQm9keSh7CiAgICAgICAqICAgICAgICAgbWFzcyA6IDEKICAgICAgICogICAgIH0pOwogICAgICAgKiAgICAgY29uc29sZS5sb2coZHluYW1pY0JvZHkudHlwZSA9PSBCb2R5LkRZTkFNSUMpOyAvLyB0cnVlCiAgICAgICAqCiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqICAgICAvLyBLaW5lbWF0aWMgYm9kaWVzIHdpbGwgb25seSBtb3ZlIGlmIHlvdSBjaGFuZ2UgdGhlaXIgdmVsb2NpdHkuCiAgICAgICAqICAgICB2YXIga2luZW1hdGljQm9keSA9IG5ldyBCb2R5KHsKICAgICAgICogICAgICAgICB0eXBlOiBCb2R5LktJTkVNQVRJQyAvLyBUeXBlIGNhbiBiZSBzZXQgdmlhIHRoZSBvcHRpb25zIG9iamVjdC4KICAgICAgICogICAgIH0pOwogICAgICAgKi8KCiAgICAgIHRoaXMudHlwZSA9IEJvZHkkMy5TVEFUSUM7CgogICAgICBpZiAob3B0aW9ucy50eXBlICE9PSB1bmRlZmluZWQpIHsKICAgICAgICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7CiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubWFzcykgewogICAgICAgIHRoaXMudHlwZSA9IEJvZHkkMy5TVEFUSUM7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy50eXBlID0gQm9keSQzLkRZTkFNSUM7CiAgICAgIH0KICAgICAgLyoqCiAgICAgICAqIEJvdW5kaW5nIGNpcmNsZSByYWRpdXMuIFVwZGF0ZSB3aXRoIHt7I2Nyb3NzTGluayAiQm9keS91cGRhdGVCb3VuZGluZ1JhZGl1czptZXRob2QifX17ey9jcm9zc0xpbmt9fS4KICAgICAgICogQHJlYWRvbmx5CiAgICAgICAqIEBwcm9wZXJ0eSBib3VuZGluZ1JhZGl1cwogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCgogICAgICB0aGlzLmJvdW5kaW5nUmFkaXVzID0gMDsKICAgICAgLyoqCiAgICAgICAqIEJvdW5kaW5nIGJveCBvZiB0aGlzIGJvZHkuIFVwZGF0ZSB3aXRoIHt7I2Nyb3NzTGluayAiQm9keS91cGRhdGVBQUJCOm1ldGhvZCJ9fXt7L2Nyb3NzTGlua319LgogICAgICAgKiBAcHJvcGVydHkgYWFiYgogICAgICAgKiBAdHlwZSB7QUFCQn0KICAgICAgICovCgogICAgICB0aGlzLmFhYmIgPSBuZXcgQUFCQiQxKCk7CiAgICAgIC8qKgogICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIEFBQkIgbmVlZHMgdXBkYXRlLiBVcGRhdGUgaXQgd2l0aCB7eyNjcm9zc0xpbmsgIkJvZHkvdXBkYXRlQUFCQjptZXRob2QifX17ey9jcm9zc0xpbmt9fS4KICAgICAgICogQHByb3BlcnR5IGFhYmJOZWVkc1VwZGF0ZQogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICogQHNlZSB1cGRhdGVBQUJCCiAgICAgICAqCiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqICAgICAvLyBGb3JjZSB1cGRhdGUgdGhlIEFBQkIKICAgICAgICogICAgIGJvZHkuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgICogICAgIGJvZHkudXBkYXRlQUFCQigpOwogICAgICAgKiAgICAgY29uc29sZS5sb2coYm9keS5hYWJiTmVlZHNVcGRhdGUpOyAvLyBmYWxzZQogICAgICAgKi8KCiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgLyoqCiAgICAgICAqIElmIHRydWUsIHRoZSBib2R5IHdpbGwgYXV0b21hdGljYWxseSBmYWxsIHRvIHNsZWVwLiBOb3RlIHRoYXQgeW91IG5lZWQgdG8gZW5hYmxlIHNsZWVwaW5nIGluIHRoZSB7eyNjcm9zc0xpbmsgIldvcmxkIn19e3svY3Jvc3NMaW5rfX0gYmVmb3JlIGFueXRoaW5nIHdpbGwgaGFwcGVuLgogICAgICAgKiBAcHJvcGVydHkgYWxsb3dTbGVlcAogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICogQGRlZmF1bHQgdHJ1ZQogICAgICAgKi8KCiAgICAgIHRoaXMuYWxsb3dTbGVlcCA9IG9wdGlvbnMuYWxsb3dTbGVlcCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5hbGxvd1NsZWVwIDogdHJ1ZTsKICAgICAgdGhpcy53YW50c1RvU2xlZXAgPSBmYWxzZTsKICAgICAgLyoqCiAgICAgICAqIE9uZSBvZiB7eyNjcm9zc0xpbmsgIkJvZHkvQVdBS0U6cHJvcGVydHkifX1Cb2R5LkFXQUtFe3svY3Jvc3NMaW5rfX0sIHt7I2Nyb3NzTGluayAiQm9keS9TTEVFUFk6cHJvcGVydHkifX1Cb2R5LlNMRUVQWXt7L2Nyb3NzTGlua319IGFuZCB7eyNjcm9zc0xpbmsgIkJvZHkvU0xFRVBJTkc6cHJvcGVydHkifX1Cb2R5LlNMRUVQSU5He3svY3Jvc3NMaW5rfX0uCiAgICAgICAqCiAgICAgICAqIFRoZSBib2R5IGlzIGluaXRpYWxseSBCb2R5LkFXQUtFLiBJZiBpdHMgdmVsb2NpdHkgbm9ybSBpcyBiZWxvdyAuc2xlZXBTcGVlZExpbWl0LCB0aGUgc2xlZXBTdGF0ZSB3aWxsIGJlY29tZSBCb2R5LlNMRUVQWS4gSWYgdGhlIGJvZHkgY29udGludWVzIHRvIGJlIEJvZHkuU0xFRVBZIGZvciAuc2xlZXBUaW1lTGltaXQgc2Vjb25kcywgaXQgd2lsbCBmYWxsIGFzbGVlcCAoQm9keS5TTEVFUFkpLgogICAgICAgKgogICAgICAgKiBAcHJvcGVydHkgc2xlZXBTdGF0ZQogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKiBAZGVmYXVsdCBCb2R5LkFXQUtFCiAgICAgICAqLwoKICAgICAgdGhpcy5zbGVlcFN0YXRlID0gQm9keSQzLkFXQUtFOwogICAgICAvKioKICAgICAgICogSWYgdGhlIHNwZWVkICh0aGUgbm9ybSBvZiB0aGUgdmVsb2NpdHkpIGlzIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGUgYm9keSBpcyBjb25zaWRlcmVkIHNsZWVweS4KICAgICAgICogQHByb3BlcnR5IHNsZWVwU3BlZWRMaW1pdAogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKiBAZGVmYXVsdCAwLjIKICAgICAgICovCgogICAgICB0aGlzLnNsZWVwU3BlZWRMaW1pdCA9IG9wdGlvbnMuc2xlZXBTcGVlZExpbWl0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnNsZWVwU3BlZWRMaW1pdCA6IDAuMjsKICAgICAgLyoqCiAgICAgICAqIElmIHRoZSBib2R5IGhhcyBiZWVuIHNsZWVweSBmb3IgdGhpcyBzbGVlcFRpbWVMaW1pdCBzZWNvbmRzLCBpdCBpcyBjb25zaWRlcmVkIHNsZWVwaW5nLgogICAgICAgKiBAcHJvcGVydHkgc2xlZXBUaW1lTGltaXQKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICogQGRlZmF1bHQgMQogICAgICAgKi8KCiAgICAgIHRoaXMuc2xlZXBUaW1lTGltaXQgPSBvcHRpb25zLnNsZWVwVGltZUxpbWl0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnNsZWVwVGltZUxpbWl0IDogMTsKICAgICAgLyoqCiAgICAgICAqIEdyYXZpdHkgc2NhbGluZyBmYWN0b3IuIElmIHlvdSB3YW50IHRoZSBib2R5IHRvIGlnbm9yZSBncmF2aXR5LCBzZXQgdGhpcyB0byB6ZXJvLiBJZiB5b3Ugd2FudCB0byByZXZlcnNlIGdyYXZpdHksIHNldCBpdCB0byAtMS4KICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGdyYXZpdHlTY2FsZQogICAgICAgKiBAZGVmYXVsdCAxCiAgICAgICAqLwoKICAgICAgdGhpcy5ncmF2aXR5U2NhbGUgPSBvcHRpb25zLmdyYXZpdHlTY2FsZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5ncmF2aXR5U2NhbGUgOiAxOwogICAgICAvKioKICAgICAgICogV2hldGhlciB0byBwcm9kdWNlIGNvbnRhY3QgZm9yY2VzIHdoZW4gaW4gY29udGFjdCB3aXRoIG90aGVyIGJvZGllcy4gTm90ZSB0aGF0IGNvbnRhY3RzIHdpbGwgYmUgZ2VuZXJhdGVkLCBidXQgdGhleSB3aWxsIGJlIGRpc2FibGVkLiBUaGF0IG1lYW5zIHRoYXQgdGhpcyBib2R5IHdpbGwgbW92ZSB0aHJvdWdoIG90aGVyIGJvZGllcywgYnV0IGl0IHdpbGwgc3RpbGwgdHJpZ2dlciBjb250YWN0IGV2ZW50cywgZXRjLgogICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGNvbGxpc2lvblJlc3BvbnNlCiAgICAgICAqLwoKICAgICAgdGhpcy5jb2xsaXNpb25SZXNwb25zZSA9IG9wdGlvbnMuY29sbGlzaW9uUmVzcG9uc2UgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY29sbGlzaW9uUmVzcG9uc2UgOiB0cnVlOwogICAgICAvKioKICAgICAgICogSG93IGxvbmcgdGhlIGJvZHkgaGFzIGJlZW4gc2xlZXBpbmcuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gaWRsZVRpbWUKICAgICAgICovCgogICAgICB0aGlzLmlkbGVUaW1lID0gMDsKICAgICAgLyoqCiAgICAgICAqIFRoZSBsYXN0IHRpbWUgd2hlbiB0aGUgYm9keSB3ZW50IHRvIFNMRUVQWSBzdGF0ZS4KICAgICAgICogQHJlYWRvbmx5CiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0aW1lTGFzdFNsZWVweQogICAgICAgKiBAcHJpdmF0ZQogICAgICAgKi8KCiAgICAgIHRoaXMudGltZUxhc3RTbGVlcHkgPSAwOwogICAgICAvKioKICAgICAgICogSWYgdGhlIGJvZHkgc3BlZWQgZXhjZWVkcyB0aGlzIHRocmVzaG9sZCwgQ0NEIChjb250aW51b3VzIGNvbGxpc2lvbiBkZXRlY3Rpb24pIHdpbGwgYmUgZW5hYmxlZC4gU2V0IGl0IHRvIGEgbmVnYXRpdmUgbnVtYmVyIHRvIGRpc2FibGUgQ0NEIGNvbXBsZXRlbHkgZm9yIHRoaXMgYm9keS4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGNjZFNwZWVkVGhyZXNob2xkCiAgICAgICAqIEBkZWZhdWx0IC0xCiAgICAgICAqLwoKICAgICAgdGhpcy5jY2RTcGVlZFRocmVzaG9sZCA9IG9wdGlvbnMuY2NkU3BlZWRUaHJlc2hvbGQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2NkU3BlZWRUaHJlc2hvbGQgOiAtMTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBudW1iZXIgb2YgaXRlcmF0aW9ucyB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgdGltZSBvZiBpbXBhY3QgZHVyaW5nIENDRC4gQSBsYXJnZXIgbnVtYmVyIHdpbGwgYXNzdXJlIHRoYXQgdGhlcmUncyBhIHNtYWxsIHBlbmV0cmF0aW9uIG9uIENDRCBjb2xsaXNpb24sIGJ1dCBhIHNtYWxsIG51bWJlciB3aWxsIGdpdmUgbW9yZSBwZXJmb3JtYW5jZS4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGNjZEl0ZXJhdGlvbnMKICAgICAgICogQGRlZmF1bHQgMTAKICAgICAgICovCgogICAgICB0aGlzLmNjZEl0ZXJhdGlvbnMgPSBvcHRpb25zLmNjZEl0ZXJhdGlvbnMgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2NkSXRlcmF0aW9ucyA6IDEwOwogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGlzbGFuZElkCiAgICAgICAqLwoKICAgICAgdGhpcy5pc2xhbmRJZCA9IC0xOwogICAgICB0aGlzLmNvbmNhdmVQYXRoID0gbnVsbDsKICAgICAgdGhpcy5fd2FrZVVwQWZ0ZXJOYXJyb3dwaGFzZSA9IGZhbHNlOwogICAgICB0aGlzLnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7CiAgICB9CgogICAgQm9keSQzLnByb3RvdHlwZSA9IG5ldyBFdmVudEVtaXR0ZXIkMigpOwogICAgQm9keSQzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJvZHkkMzsKICAgIEJvZHkkMy5faWRDb3VudGVyID0gMDsKICAgIC8qKgogICAgICogQGV2ZW50IHNsZWVweQogICAgICovCgogICAgdmFyIHNsZWVweUV2ZW50ID0gewogICAgICB0eXBlOiAic2xlZXB5IgogICAgfTsKICAgIC8qKgogICAgICogQGV2ZW50IHNsZWVwCiAgICAgKi8KCiAgICB2YXIgc2xlZXBFdmVudCA9IHsKICAgICAgdHlwZTogInNsZWVwIgogICAgfTsKICAgIC8qKgogICAgICogQGV2ZW50IHdha2V1cAogICAgICovCgogICAgdmFyIHdha2VVcEV2ZW50ID0gewogICAgICB0eXBlOiAid2FrZXVwIgogICAgfTsKICAgIC8qKgogICAgICogQHByaXZhdGUKICAgICAqIEBtZXRob2QgdXBkYXRlU29sdmVNYXNzUHJvcGVydGllcwogICAgICovCgogICAgQm9keSQzLnByb3RvdHlwZS51cGRhdGVTb2x2ZU1hc3NQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCkgewogICAgICBpZiAodGhpcy5zbGVlcFN0YXRlID09PSBCb2R5JDMuU0xFRVBJTkcgfHwgdGhpcy50eXBlID09PSBCb2R5JDMuS0lORU1BVElDKSB7CiAgICAgICAgdGhpcy5pbnZNYXNzU29sdmUgPSAwOwogICAgICAgIHRoaXMuaW52SW5lcnRpYVNvbHZlID0gMDsKICAgICAgfSBlbHNlIHsKICAgICAgICB0aGlzLmludk1hc3NTb2x2ZSA9IHRoaXMuaW52TWFzczsKICAgICAgICB0aGlzLmludkluZXJ0aWFTb2x2ZSA9IHRoaXMuaW52SW5lcnRpYTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogU2V0IHRoZSB0b3RhbCBkZW5zaXR5IG9mIHRoZSBib2R5CiAgICAgKiBAbWV0aG9kIHNldERlbnNpdHkKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZW5zaXR5CiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS5zZXREZW5zaXR5ID0gZnVuY3Rpb24gKGRlbnNpdHkpIHsKICAgICAgdmFyIHRvdGFsQXJlYSA9IHRoaXMuZ2V0QXJlYSgpOwogICAgICB0aGlzLm1hc3MgPSB0b3RhbEFyZWEgKiBkZW5zaXR5OwogICAgICB0aGlzLnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIHRvdGFsIGFyZWEgb2YgYWxsIHNoYXBlcyBpbiB0aGUgYm9keQogICAgICogQG1ldGhvZCBnZXRBcmVhCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS5nZXRBcmVhID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgdG90YWxBcmVhID0gMDsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICB0b3RhbEFyZWEgKz0gdGhpcy5zaGFwZXNbaV0uYXJlYTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRvdGFsQXJlYTsKICAgIH07CiAgICAvKioKICAgICAqIEdldCB0aGUgQUFCQiBmcm9tIHRoZSBib2R5LiBUaGUgQUFCQiBpcyB1cGRhdGVkIGlmIG5lY2Vzc2FyeS4KICAgICAqIEBtZXRob2QgZ2V0QUFCQgogICAgICogQHJldHVybiB7QUFCQn0gVGhlIEFBQkIgaW5zdGFuY2UgZnJvbSB0aGUgYm9keS4KICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLmdldEFBQkIgPSBmdW5jdGlvbiAoKSB7CiAgICAgIGlmICh0aGlzLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgIHRoaXMudXBkYXRlQUFCQigpOwogICAgICB9CgogICAgICByZXR1cm4gdGhpcy5hYWJiOwogICAgfTsKCiAgICB2YXIgc2hhcGVBQUJCID0gbmV3IEFBQkIkMSgpLAogICAgICAgIHRtcCQxID0gdmVjMmNyZWF0ZSgpOwogICAgLyoqCiAgICAgKiBVcGRhdGVzIHRoZSBBQUJCIG9mIHRoZSBCb2R5LCBhbmQgc2V0IC5hYWJiTmVlZHNVcGRhdGUgPSBmYWxzZS4KICAgICAqIEBtZXRob2QgdXBkYXRlQUFCQgogICAgICovCgogICAgQm9keSQzLnByb3RvdHlwZS51cGRhdGVBQUJCID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgc2hhcGVzID0gdGhpcy5zaGFwZXMsCiAgICAgICAgICBOID0gc2hhcGVzLmxlbmd0aCwKICAgICAgICAgIG9mZnNldCA9IHRtcCQxLAogICAgICAgICAgYm9keUFuZ2xlID0gdGhpcy5hbmdsZTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSBOOyBpKyspIHsKICAgICAgICB2YXIgc2hhcGUgPSBzaGFwZXNbaV0sCiAgICAgICAgICAgIGFuZ2xlID0gc2hhcGUuYW5nbGUgKyBib2R5QW5nbGU7IC8vIEdldCBzaGFwZSB3b3JsZCBvZmZzZXQKCiAgICAgICAgdmVjMiRpLnRvR2xvYmFsRnJhbWUob2Zmc2V0LCBzaGFwZS5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbiwgYm9keUFuZ2xlKTsgLy8gR2V0IHNoYXBlIEFBQkIKCiAgICAgICAgc2hhcGUuY29tcHV0ZUFBQkIoc2hhcGVBQUJCLCBvZmZzZXQsIGFuZ2xlKTsKCiAgICAgICAgaWYgKGkgPT09IDApIHsKICAgICAgICAgIHRoaXMuYWFiYi5jb3B5KHNoYXBlQUFCQik7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIHRoaXMuYWFiYi5leHRlbmQoc2hhcGVBQUJCKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gZmFsc2U7CiAgICB9OwogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIGJvdW5kaW5nIHJhZGl1cyBvZiB0aGUgYm9keSAodGhpcy5ib3VuZGluZ1JhZGl1cykuIFNob3VsZCBiZSBkb25lIGlmIGFueSBvZiB0aGUgc2hhcGUgZGltZW5zaW9ucyBvciBwb3NpdGlvbnMgYXJlIGNoYW5nZWQuCiAgICAgKiBAbWV0aG9kIHVwZGF0ZUJvdW5kaW5nUmFkaXVzCiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ1JhZGl1cyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIHNoYXBlcyA9IHRoaXMuc2hhcGVzLAogICAgICAgICAgTiA9IHNoYXBlcy5sZW5ndGgsCiAgICAgICAgICByYWRpdXMgPSAwOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIHZhciBzaGFwZSA9IHNoYXBlc1tpXSwKICAgICAgICAgICAgb2Zmc2V0ID0gdmVjMiRpLmxlbmd0aChzaGFwZS5wb3NpdGlvbiksCiAgICAgICAgICAgIHIgPSBzaGFwZS5ib3VuZGluZ1JhZGl1czsKCiAgICAgICAgaWYgKG9mZnNldCArIHIgPiByYWRpdXMpIHsKICAgICAgICAgIHJhZGl1cyA9IG9mZnNldCArIHI7CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLmJvdW5kaW5nUmFkaXVzID0gcmFkaXVzOwogICAgfTsKICAgIC8qKgogICAgICogQWRkIGEgc2hhcGUgdG8gdGhlIGJvZHkuIFlvdSBjYW4gcGFzcyBhIGxvY2FsIHRyYW5zZm9ybSB3aGVuIGFkZGluZyBhIHNoYXBlLAogICAgICogc28gdGhhdCB0aGUgc2hhcGUgZ2V0cyBhbiBvZmZzZXQgYW5kIGFuZ2xlIHJlbGF0aXZlIHRvIHRoZSBib2R5IGNlbnRlciBvZiBtYXNzLgogICAgICogV2lsbCBhdXRvbWF0aWNhbGx5IHVwZGF0ZSB0aGUgbWFzcyBwcm9wZXJ0aWVzIGFuZCBib3VuZGluZyByYWRpdXMuCiAgICAgKgogICAgICogQG1ldGhvZCBhZGRTaGFwZQogICAgICogQHBhcmFtICB7U2hhcGV9ICAgICAgICAgICAgICBzaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9IFtvZmZzZXRdIExvY2FsIGJvZHkgb2Zmc2V0IG9mIHRoZSBzaGFwZS4KICAgICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgW2FuZ2xlXSAgTG9jYWwgYm9keSBhbmdsZS4KICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoKSwKICAgICAqICAgICAgICAgc2hhcGUgPSBuZXcgQ2lyY2xlKHsgcmFkaXVzOiAxIH0pOwogICAgICoKICAgICAqICAgICAvLyBBZGQgdGhlIHNoYXBlIHRvIHRoZSBib2R5LCBwb3NpdGlvbmVkIGluIHRoZSBjZW50ZXIKICAgICAqICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTsKICAgICAqCiAgICAgKiAgICAgLy8gQWRkIGFub3RoZXIgc2hhcGUgdG8gdGhlIGJvZHksIHBvc2l0aW9uZWQgMSB1bml0IGxlbmd0aCBmcm9tIHRoZSBib2R5IGNlbnRlciBvZiBtYXNzIGFsb25nIHRoZSBsb2NhbCB4LWF4aXMuCiAgICAgKiAgICAgYm9keS5hZGRTaGFwZShzaGFwZSxbMSwwXSk7CiAgICAgKgogICAgICogICAgIC8vIEFkZCBhbm90aGVyIHNoYXBlIHRvIHRoZSBib2R5LCBwb3NpdGlvbmVkIDEgdW5pdCBsZW5ndGggZnJvbSB0aGUgYm9keSBjZW50ZXIgb2YgbWFzcyBhbG9uZyB0aGUgbG9jYWwgeS1heGlzLCBhbmQgcm90YXRlZCA5MCBkZWdyZWVzIENDVy4KICAgICAqICAgICBib2R5LmFkZFNoYXBlKHNoYXBlLFswLDFdLE1hdGguUEkvMik7CiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS5hZGRTaGFwZSA9IGZ1bmN0aW9uIChzaGFwZSwgb2Zmc2V0LCBhbmdsZSkgewogICAgICBpZiAoc2hhcGUuYm9keSkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignQSBzaGFwZSBjYW4gb25seSBiZSBhZGRlZCB0byBvbmUgYm9keS4nKTsKICAgICAgfQoKICAgICAgdmFyIHdvcmxkID0gdGhpcy53b3JsZDsKCiAgICAgIGlmICh3b3JsZCAmJiB3b3JsZC5zdGVwcGluZykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignQSBzaGFwZSBjYW5ub3QgYmUgYWRkZWQgZHVyaW5nIHN0ZXAuJyk7CiAgICAgIH0KCiAgICAgIHNoYXBlLmJvZHkgPSB0aGlzOyAvLyBDb3B5IHRoZSBvZmZzZXQgdmVjdG9yCgogICAgICBpZiAob2Zmc2V0KSB7CiAgICAgICAgdmVjMiRpLmNvcHkoc2hhcGUucG9zaXRpb24sIG9mZnNldCk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdmVjMiRpLnNldChzaGFwZS5wb3NpdGlvbiwgMCwgMCk7CiAgICAgIH0KCiAgICAgIHNoYXBlLmFuZ2xlID0gYW5nbGUgfHwgMDsKICAgICAgdGhpcy5zaGFwZXMucHVzaChzaGFwZSk7CiAgICAgIHRoaXMudXBkYXRlTWFzc1Byb3BlcnRpZXMoKTsKICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1JhZGl1cygpOwogICAgICB0aGlzLmFhYmJOZWVkc1VwZGF0ZSA9IHRydWU7CiAgICB9OwogICAgLyoqCiAgICAgKiBSZW1vdmUgYSBzaGFwZS4KICAgICAqIEBtZXRob2QgcmVtb3ZlU2hhcGUKICAgICAqIEBwYXJhbSAge1NoYXBlfSBzaGFwZQogICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgc2hhcGUgd2FzIGZvdW5kIGFuZCByZW1vdmVkLCBlbHNlIGZhbHNlLgogICAgICovCgoKICAgIEJvZHkkMy5wcm90b3R5cGUucmVtb3ZlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHsKICAgICAgdmFyIHdvcmxkID0gdGhpcy53b3JsZDsKCiAgICAgIGlmICh3b3JsZCAmJiB3b3JsZC5zdGVwcGluZykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignQSBzaGFwZSBjYW5ub3QgYmUgcmVtb3ZlZCBkdXJpbmcgc3RlcC4nKTsKICAgICAgfQoKICAgICAgdmFyIGlkeCA9IHRoaXMuc2hhcGVzLmluZGV4T2Yoc2hhcGUpOwoKICAgICAgaWYgKGlkeCAhPT0gLTEpIHsKICAgICAgICB0aGlzLnNoYXBlcy5zcGxpY2UoaWR4LCAxKTsKICAgICAgICB0aGlzLmFhYmJOZWVkc1VwZGF0ZSA9IHRydWU7CiAgICAgICAgc2hhcGUuYm9keSA9IG51bGw7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBVcGRhdGVzIC5pbmVydGlhLCAuaW52TWFzcywgLmludkluZXJ0aWEgZm9yIHRoaXMgQm9keS4gU2hvdWxkIGJlIGNhbGxlZCB3aGVuIGNoYW5naW5nIHRoZSBzdHJ1Y3R1cmUgb3IgbWFzcyBvZiB0aGUgQm9keS4KICAgICAqCiAgICAgKiBAbWV0aG9kIHVwZGF0ZU1hc3NQcm9wZXJ0aWVzCiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqICAgICBib2R5Lm1hc3MgKz0gMTsKICAgICAqICAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7CiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS51cGRhdGVNYXNzUHJvcGVydGllcyA9IGZ1bmN0aW9uICgpIHsKICAgICAgaWYgKHRoaXMudHlwZSA9PT0gQm9keSQzLlNUQVRJQyB8fCB0aGlzLnR5cGUgPT09IEJvZHkkMy5LSU5FTUFUSUMpIHsKICAgICAgICB0aGlzLm1hc3MgPSBOdW1iZXIuTUFYX1ZBTFVFOwogICAgICAgIHRoaXMuaW52TWFzcyA9IDA7CiAgICAgICAgdGhpcy5pbmVydGlhID0gTnVtYmVyLk1BWF9WQUxVRTsKICAgICAgICB0aGlzLmludkluZXJ0aWEgPSAwOwogICAgICB9IGVsc2UgewogICAgICAgIHZhciBzaGFwZXMgPSB0aGlzLnNoYXBlcywKICAgICAgICAgICAgTiA9IHNoYXBlcy5sZW5ndGgsCiAgICAgICAgICAgIEkgPSAwOwoKICAgICAgICBpZiAoIXRoaXMuZml4ZWRSb3RhdGlvbikgewogICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHsKICAgICAgICAgICAgdmFyIHNoYXBlID0gc2hhcGVzW2ldLAogICAgICAgICAgICAgICAgcjIgPSB2ZWMyJGkuc3F1YXJlZExlbmd0aChzaGFwZS5wb3NpdGlvbiksCiAgICAgICAgICAgICAgICBJY20gPSBzaGFwZS5jb21wdXRlTW9tZW50T2ZJbmVydGlhKCk7CiAgICAgICAgICAgIEkgKz0gSWNtICsgcjI7CiAgICAgICAgICB9CgogICAgICAgICAgdGhpcy5pbmVydGlhID0gdGhpcy5tYXNzICogSTsKICAgICAgICAgIHRoaXMuaW52SW5lcnRpYSA9IEkgPiAwID8gMSAvIEkgOiAwOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB0aGlzLmluZXJ0aWEgPSBOdW1iZXIuTUFYX1ZBTFVFOwogICAgICAgICAgdGhpcy5pbnZJbmVydGlhID0gMDsKICAgICAgICB9IC8vIEludmVyc2UgbWFzcyBwcm9wZXJ0aWVzIGFyZSBlYXN5CgoKICAgICAgICB0aGlzLmludk1hc3MgPSAxIC8gdGhpcy5tYXNzOwogICAgICAgIHZlYzIkaS5zZXQodGhpcy5tYXNzTXVsdGlwbGllciwgdGhpcy5maXhlZFggPyAwIDogMSwgdGhpcy5maXhlZFkgPyAwIDogMSk7CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIEFwcGx5IGZvcmNlIHRvIGEgcG9pbnQgcmVsYXRpdmUgdG8gdGhlIGNlbnRlciBvZiBtYXNzIG9mIHRoZSBib2R5LiBUaGlzIGNvdWxkIGZvciBleGFtcGxlIGJlIGEgcG9pbnQgb24gdGhlIEJvZHkgc3VyZmFjZS4gQXBwbHlpbmcgZm9yY2UgdGhpcyB3YXkgd2lsbCBhZGQgdG8gQm9keS5mb3JjZSBhbmQgQm9keS5hbmd1bGFyRm9yY2UuCiAgICAgKiBAbWV0aG9kIGFwcGx5Rm9yY2UKICAgICAqIEBwYXJhbSAge0FycmF5fSBmb3JjZSBUaGUgZm9yY2UgdmVjdG9yIHRvIGFkZCwgb3JpZW50ZWQgaW4gd29ybGQgc3BhY2UuCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gW3JlbGF0aXZlUG9pbnRdIEEgcG9pbnQgcmVsYXRpdmUgdG8gdGhlIGJvZHkgaW4gd29ybGQgc3BhY2UuIElmIG5vdCBnaXZlbiwgaXQgaXMgc2V0IHRvIHplcm8gYW5kIGFsbCBvZiB0aGUgZm9yY2Ugd2lsbCBiZSBleGVydGVkIG9uIHRoZSBjZW50ZXIgb2YgbWFzcy4KICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSk7CiAgICAgKiAgICAgdmFyIHJlbGF0aXZlUG9pbnQgPSBbMSwgMF07IC8vIFdpbGwgYXBwbHkgdGhlIGZvcmNlIGF0IFtib2R5LnBvc2l0aW9uWzBdICsgMSwgYm9keS5wb3NpdGlvblsxXV0KICAgICAqICAgICB2YXIgZm9yY2UgPSBbMCwgMV07IC8vIHVwCiAgICAgKiAgICAgYm9keS5hcHBseUZvcmNlKGZvcmNlLCByZWxhdGl2ZVBvaW50KTsKICAgICAqICAgICBjb25zb2xlLmxvZyhib2R5LmZvcmNlKTsgLy8gWzAsIDFdCiAgICAgKiAgICAgY29uc29sZS5sb2coYm9keS5hbmd1bGFyRm9yY2UpOyAvLyAxCiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gKGZvcmNlLCByZWxhdGl2ZVBvaW50KSB7CiAgICAgIC8vIEFkZCBsaW5lYXIgZm9yY2UKICAgICAgYWRkJDIodGhpcy5mb3JjZSwgdGhpcy5mb3JjZSwgZm9yY2UpOwoKICAgICAgaWYgKHJlbGF0aXZlUG9pbnQpIHsKICAgICAgICAvLyBDb21wdXRlIHByb2R1Y2VkIHJvdGF0aW9uYWwgZm9yY2UKICAgICAgICB2YXIgcm90Rm9yY2UgPSB2ZWMyJGkuY3Jvc3NMZW5ndGgocmVsYXRpdmVQb2ludCwgZm9yY2UpOyAvLyBBZGQgcm90YXRpb25hbCBmb3JjZQoKICAgICAgICB0aGlzLmFuZ3VsYXJGb3JjZSArPSByb3RGb3JjZTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogQXBwbHkgZm9yY2UgdG8gYSBwb2ludCByZWxhdGl2ZSB0byB0aGUgY2VudGVyIG9mIG1hc3Mgb2YgdGhlIGJvZHkuIFRoaXMgY291bGQgZm9yIGV4YW1wbGUgYmUgYSBwb2ludCBvbiB0aGUgQm9keSBzdXJmYWNlLiBBcHBseWluZyBmb3JjZSB0aGlzIHdheSB3aWxsIGFkZCB0byBCb2R5LmZvcmNlIGFuZCBCb2R5LmFuZ3VsYXJGb3JjZS4KICAgICAqIEBtZXRob2QgYXBwbHlGb3JjZUxvY2FsCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gbG9jYWxGb3JjZSBUaGUgZm9yY2UgdmVjdG9yIHRvIGFkZCwgb3JpZW50ZWQgaW4gbG9jYWwgYm9keSBzcGFjZS4KICAgICAqIEBwYXJhbSAge0FycmF5fSBbbG9jYWxQb2ludF0gQSBwb2ludCByZWxhdGl2ZSB0byB0aGUgYm9keSBpbiBsb2NhbCBib2R5IHNwYWNlLiBJZiBub3QgZ2l2ZW4sIGl0IGlzIHNldCB0byB6ZXJvIGFuZCBhbGwgb2YgdGhlIGZvcmNlIHdpbGwgYmUgZXhlcnRlZCBvbiB0aGUgY2VudGVyIG9mIG1hc3MuCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoeyBtYXNzOiAxIH0pOwogICAgICogICAgIHZhciBsb2NhbFBvaW50ID0gWzEsIDBdOyAvLyB4PTEgbG9jYWxseSBpbiB0aGUgYm9keQogICAgICogICAgIHZhciBsb2NhbEZvcmNlID0gWzAsIDFdOyAvLyB1cCwgbG9jYWxseSBpbiB0aGUgYm9keQogICAgICogICAgIGJvZHkuYXBwbHlGb3JjZUxvY2FsKGxvY2FsRm9yY2UsIGxvY2FsUG9pbnQpOwogICAgICogICAgIGNvbnNvbGUubG9nKGJvZHkuZm9yY2UpOyAvLyBbMCwgMV0KICAgICAqICAgICBjb25zb2xlLmxvZyhib2R5LmFuZ3VsYXJGb3JjZSk7IC8vIDEKICAgICAqLwoKCiAgICB2YXIgQm9keV9hcHBseUZvcmNlX2ZvcmNlV29ybGQgPSB2ZWMyY3JlYXRlKCk7CiAgICB2YXIgQm9keV9hcHBseUZvcmNlX3BvaW50V29ybGQgPSB2ZWMyY3JlYXRlKCk7CiAgICB2YXIgQm9keV9hcHBseUZvcmNlX3BvaW50TG9jYWwgPSB2ZWMyY3JlYXRlKCk7CgogICAgQm9keSQzLnByb3RvdHlwZS5hcHBseUZvcmNlTG9jYWwgPSBmdW5jdGlvbiAobG9jYWxGb3JjZSwgbG9jYWxQb2ludCkgewogICAgICBsb2NhbFBvaW50ID0gbG9jYWxQb2ludCB8fCBCb2R5X2FwcGx5Rm9yY2VfcG9pbnRMb2NhbDsKICAgICAgdmFyIHdvcmxkRm9yY2UgPSBCb2R5X2FwcGx5Rm9yY2VfZm9yY2VXb3JsZDsKICAgICAgdmFyIHdvcmxkUG9pbnQgPSBCb2R5X2FwcGx5Rm9yY2VfcG9pbnRXb3JsZDsKICAgICAgdGhpcy52ZWN0b3JUb1dvcmxkRnJhbWUod29ybGRGb3JjZSwgbG9jYWxGb3JjZSk7CiAgICAgIHRoaXMudmVjdG9yVG9Xb3JsZEZyYW1lKHdvcmxkUG9pbnQsIGxvY2FsUG9pbnQpOwogICAgICB0aGlzLmFwcGx5Rm9yY2Uod29ybGRGb3JjZSwgd29ybGRQb2ludCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBBcHBseSBpbXB1bHNlIHRvIGEgcG9pbnQgcmVsYXRpdmUgdG8gdGhlIGJvZHkuIFRoaXMgY291bGQgZm9yIGV4YW1wbGUgYmUgYSBwb2ludCBvbiB0aGUgQm9keSBzdXJmYWNlLiBBbiBpbXB1bHNlIGlzIGEgZm9yY2UgYWRkZWQgdG8gYSBib2R5IGR1cmluZyBhIHNob3J0IHBlcmlvZCBvZiB0aW1lIChpbXB1bHNlID0gZm9yY2UgKiB0aW1lKS4gSW1wdWxzZXMgd2lsbCBiZSBhZGRlZCB0byBCb2R5LnZlbG9jaXR5IGFuZCBCb2R5LmFuZ3VsYXJWZWxvY2l0eS4KICAgICAqIEBtZXRob2QgYXBwbHlJbXB1bHNlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gaW1wdWxzZVZlY3RvciBUaGUgaW1wdWxzZSB2ZWN0b3IgdG8gYWRkLCBvcmllbnRlZCBpbiB3b3JsZCBzcGFjZS4KICAgICAqIEBwYXJhbSAge0FycmF5fSBbcmVsYXRpdmVQb2ludF0gQSBwb2ludCByZWxhdGl2ZSB0byB0aGUgYm9keSBpbiB3b3JsZCBzcGFjZS4gSWYgbm90IGdpdmVuLCBpdCBpcyBzZXQgdG8gemVybyBhbmQgYWxsIG9mIHRoZSBpbXB1bHNlIHdpbGwgYmUgZXhlcnRlZCBvbiB0aGUgY2VudGVyIG9mIG1hc3MuCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoeyBtYXNzOiAxIH0pOwogICAgICogICAgIHZhciByZWxhdGl2ZVBvaW50ID0gWzAsIDBdOyAvLyBjZW50ZXIgb2YgdGhlIGJvZHkKICAgICAqICAgICB2YXIgaW1wdWxzZVZlY3RvciA9IFswLCAxXTsgLy8gd29ybGQgdXAKICAgICAqICAgICBib2R5LmFwcGx5SW1wdWxzZShpbXB1bHNlVmVjdG9yLCByZWxhdGl2ZVBvaW50KTsKICAgICAqLwoKCiAgICB2YXIgQm9keV9hcHBseUltcHVsc2VfdmVsbyA9IHZlYzJjcmVhdGUoKTsKCiAgICBCb2R5JDMucHJvdG90eXBlLmFwcGx5SW1wdWxzZSA9IGZ1bmN0aW9uIChpbXB1bHNlVmVjdG9yLCByZWxhdGl2ZVBvaW50KSB7CiAgICAgIGlmICh0aGlzLnR5cGUgIT09IEJvZHkkMy5EWU5BTUlDKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9IC8vIENvbXB1dGUgcHJvZHVjZWQgY2VudHJhbCBpbXB1bHNlIHZlbG9jaXR5CgoKICAgICAgdmFyIHZlbG8gPSBCb2R5X2FwcGx5SW1wdWxzZV92ZWxvOwogICAgICB2ZWMyJGkuc2NhbGUodmVsbywgaW1wdWxzZVZlY3RvciwgdGhpcy5pbnZNYXNzKTsKICAgICAgdmVjMiRpLm11bHRpcGx5KHZlbG8sIHRoaXMubWFzc011bHRpcGxpZXIsIHZlbG8pOyAvLyBBZGQgbGluZWFyIGltcHVsc2UKCiAgICAgIGFkZCQyKHRoaXMudmVsb2NpdHksIHZlbG8sIHRoaXMudmVsb2NpdHkpOwoKICAgICAgaWYgKHJlbGF0aXZlUG9pbnQpIHsKICAgICAgICAvLyBDb21wdXRlIHByb2R1Y2VkIHJvdGF0aW9uYWwgaW1wdWxzZSB2ZWxvY2l0eQogICAgICAgIHZhciByb3RWZWxvID0gdmVjMiRpLmNyb3NzTGVuZ3RoKHJlbGF0aXZlUG9pbnQsIGltcHVsc2VWZWN0b3IpOwogICAgICAgIHJvdFZlbG8gKj0gdGhpcy5pbnZJbmVydGlhOyAvLyBBZGQgcm90YXRpb25hbCBJbXB1bHNlCgogICAgICAgIHRoaXMuYW5ndWxhclZlbG9jaXR5ICs9IHJvdFZlbG87CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIEFwcGx5IGltcHVsc2UgdG8gYSBwb2ludCByZWxhdGl2ZSB0byB0aGUgYm9keS4gVGhpcyBjb3VsZCBmb3IgZXhhbXBsZSBiZSBhIHBvaW50IG9uIHRoZSBCb2R5IHN1cmZhY2UuIEFuIGltcHVsc2UgaXMgYSBmb3JjZSBhZGRlZCB0byBhIGJvZHkgZHVyaW5nIGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUgKGltcHVsc2UgPSBmb3JjZSAqIHRpbWUpLiBJbXB1bHNlcyB3aWxsIGJlIGFkZGVkIHRvIEJvZHkudmVsb2NpdHkgYW5kIEJvZHkuYW5ndWxhclZlbG9jaXR5LgogICAgICogQG1ldGhvZCBhcHBseUltcHVsc2VMb2NhbAogICAgICogQHBhcmFtICB7QXJyYXl9IGxvY2FsSW1wdWxzZSBUaGUgaW1wdWxzZSB2ZWN0b3IgdG8gYWRkLCBvcmllbnRlZCBpbiBsb2NhbCBib2R5IHNwYWNlLgogICAgICogQHBhcmFtICB7QXJyYXl9IFtsb2NhbFBvaW50XSBBIHBvaW50IHJlbGF0aXZlIHRvIHRoZSBib2R5IGluIGxvY2FsIGJvZHkgc3BhY2UuIElmIG5vdCBnaXZlbiwgaXQgaXMgc2V0IHRvIHplcm8gYW5kIGFsbCBvZiB0aGUgaW1wdWxzZSB3aWxsIGJlIGV4ZXJ0ZWQgb24gdGhlIGNlbnRlciBvZiBtYXNzLgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgYm9keSA9IG5ldyBCb2R5KHsgbWFzczogMSB9KTsKICAgICAqICAgICB2YXIgbG9jYWxQb2ludCA9IFsxLCAwXTsgLy8geD0xLCBsb2NhbGx5IGluIHRoZSBib2R5CiAgICAgKiAgICAgdmFyIGxvY2FsSW1wdWxzZSA9IFswLCAxXTsgLy8gdXAsIGxvY2FsbHkgaW4gdGhlIGJvZHkKICAgICAqICAgICBib2R5LmFwcGx5SW1wdWxzZUxvY2FsKGxvY2FsSW1wdWxzZSwgbG9jYWxQb2ludCk7CiAgICAgKiAgICAgY29uc29sZS5sb2coYm9keS52ZWxvY2l0eSk7IC8vIFsxLCAwXQogICAgICogICAgIGNvbnNvbGUubG9nKGJvZHkuYW5ndWxhclZlbG9jaXR5KTsgLy8gMQogICAgICovCgoKICAgIHZhciBCb2R5X2FwcGx5SW1wdWxzZV9pbXB1bHNlV29ybGQgPSB2ZWMyY3JlYXRlKCk7CiAgICB2YXIgQm9keV9hcHBseUltcHVsc2VfcG9pbnRXb3JsZCA9IHZlYzJjcmVhdGUoKTsKICAgIHZhciBCb2R5X2FwcGx5SW1wdWxzZV9wb2ludExvY2FsID0gdmVjMmNyZWF0ZSgpOwoKICAgIEJvZHkkMy5wcm90b3R5cGUuYXBwbHlJbXB1bHNlTG9jYWwgPSBmdW5jdGlvbiAobG9jYWxJbXB1bHNlLCBsb2NhbFBvaW50KSB7CiAgICAgIGxvY2FsUG9pbnQgPSBsb2NhbFBvaW50IHx8IEJvZHlfYXBwbHlJbXB1bHNlX3BvaW50TG9jYWw7CiAgICAgIHZhciB3b3JsZEltcHVsc2UgPSBCb2R5X2FwcGx5SW1wdWxzZV9pbXB1bHNlV29ybGQ7CiAgICAgIHZhciB3b3JsZFBvaW50ID0gQm9keV9hcHBseUltcHVsc2VfcG9pbnRXb3JsZDsKICAgICAgdGhpcy52ZWN0b3JUb1dvcmxkRnJhbWUod29ybGRJbXB1bHNlLCBsb2NhbEltcHVsc2UpOwogICAgICB0aGlzLnZlY3RvclRvV29ybGRGcmFtZSh3b3JsZFBvaW50LCBsb2NhbFBvaW50KTsKICAgICAgdGhpcy5hcHBseUltcHVsc2Uod29ybGRJbXB1bHNlLCB3b3JsZFBvaW50KTsKICAgIH07CiAgICAvKioKICAgICAqIFRyYW5zZm9ybSBhIHdvcmxkIHBvaW50IHRvIGxvY2FsIGJvZHkgZnJhbWUuCiAgICAgKiBAbWV0aG9kIHRvTG9jYWxGcmFtZQogICAgICogQHBhcmFtICB7QXJyYXl9IG91dCAgICAgICAgICBUaGUgcG9pbnQgdG8gc3RvcmUgdGhlIHJlc3VsdCBpbgogICAgICogQHBhcmFtICB7QXJyYXl9IHdvcmxkUG9pbnQgICBUaGUgaW5wdXQgd29ybGQgcG9pbnQKICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLnRvTG9jYWxGcmFtZSA9IGZ1bmN0aW9uIChvdXQsIHdvcmxkUG9pbnQpIHsKICAgICAgdmVjMiRpLnRvTG9jYWxGcmFtZShvdXQsIHdvcmxkUG9pbnQsIHRoaXMucG9zaXRpb24sIHRoaXMuYW5nbGUpOwogICAgfTsKICAgIC8qKgogICAgICogVHJhbnNmb3JtIGEgbG9jYWwgcG9pbnQgdG8gd29ybGQgZnJhbWUuCiAgICAgKiBAbWV0aG9kIHRvV29ybGRGcmFtZQogICAgICogQHBhcmFtICB7QXJyYXl9IG91dCAgICAgICAgICBUaGUgcG9pbnQgdG8gc3RvcmUgdGhlIHJlc3VsdCBpbgogICAgICogQHBhcmFtICB7QXJyYXl9IGxvY2FsUG9pbnQgICBUaGUgaW5wdXQgbG9jYWwgcG9pbnQKICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLnRvV29ybGRGcmFtZSA9IGZ1bmN0aW9uIChvdXQsIGxvY2FsUG9pbnQpIHsKICAgICAgdmVjMiRpLnRvR2xvYmFsRnJhbWUob3V0LCBsb2NhbFBvaW50LCB0aGlzLnBvc2l0aW9uLCB0aGlzLmFuZ2xlKTsKICAgIH07CiAgICAvKioKICAgICAqIFRyYW5zZm9ybSBhIHdvcmxkIHZlY3RvciB0byBsb2NhbCBib2R5IGZyYW1lLgogICAgICogQG1ldGhvZCB2ZWN0b3JUb0xvY2FsRnJhbWUKICAgICAqIEBwYXJhbSAge0FycmF5fSBvdXQgICAgICAgICAgVGhlIHZlY3RvciB0byBzdG9yZSB0aGUgcmVzdWx0IGluCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gd29ybGRWZWN0b3IgIFRoZSBpbnB1dCB3b3JsZCB2ZWN0b3IKICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLnZlY3RvclRvTG9jYWxGcmFtZSA9IGZ1bmN0aW9uIChvdXQsIHdvcmxkVmVjdG9yKSB7CiAgICAgIHZlYzIkaS52ZWN0b3JUb0xvY2FsRnJhbWUob3V0LCB3b3JsZFZlY3RvciwgdGhpcy5hbmdsZSk7CiAgICB9OwogICAgLyoqCiAgICAgKiBUcmFuc2Zvcm0gYSBsb2NhbCB2ZWN0b3IgdG8gd29ybGQgZnJhbWUuCiAgICAgKiBAbWV0aG9kIHZlY3RvclRvV29ybGRGcmFtZQogICAgICogQHBhcmFtICB7QXJyYXl9IG91dCAgICAgICAgICBUaGUgdmVjdG9yIHRvIHN0b3JlIHRoZSByZXN1bHQgaW4KICAgICAqIEBwYXJhbSAge0FycmF5fSBsb2NhbFZlY3RvciAgVGhlIGlucHV0IGxvY2FsIHZlY3RvcgogICAgICovCgoKICAgIEJvZHkkMy5wcm90b3R5cGUudmVjdG9yVG9Xb3JsZEZyYW1lID0gZnVuY3Rpb24gKG91dCwgbG9jYWxWZWN0b3IpIHsKICAgICAgdmVjMiRpLnZlY3RvclRvR2xvYmFsRnJhbWUob3V0LCBsb2NhbFZlY3RvciwgdGhpcy5hbmdsZSk7CiAgICB9OwogICAgLyoqCiAgICAgKiBSZWFkcyBhIHBvbHlnb24gc2hhcGUgcGF0aCwgYW5kIGFzc2VtYmxlcyBjb252ZXggc2hhcGVzIGZyb20gdGhhdCBhbmQgcHV0cyB0aGVtIGF0IHByb3BlciBvZmZzZXQgcG9pbnRzLgogICAgICogQG1ldGhvZCBmcm9tUG9seWdvbgogICAgICogQHBhcmFtIHtBcnJheX0gcGF0aCBBbiBhcnJheSBvZiAyZCB2ZWN0b3JzLCBlLmcuIFtbMCwwXSxbMCwxXSwuLi5dIHRoYXQgcmVzZW1ibGVzIGEgY29uY2F2ZSBvciBjb252ZXggcG9seWdvbi4gVGhlIHNoYXBlIG11c3QgYmUgc2ltcGxlIGFuZCB3aXRob3V0IGhvbGVzLgogICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXQogICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5vcHRpbWFsRGVjb21wPWZhbHNlXSAgIFNldCB0byB0cnVlIGlmIHlvdSBuZWVkIG9wdGltYWwgZGVjb21wb3NpdGlvbi4gV2FybmluZzogdmVyeSBzbG93IGZvciBwb2x5Z29ucyB3aXRoIG1vcmUgdGhhbiAxMCB2ZXJ0aWNlcy4KICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2tpcFNpbXBsZUNoZWNrPWZhbHNlXSBTZXQgdG8gdHJ1ZSBpZiB5b3UgYWxyZWFkeSBrbm93IHRoYXQgdGhlIHBhdGggaXMgbm90IGludGVyc2VjdGluZyBpdHNlbGYuCiAgICAgKiBAcGFyYW0ge0Jvb2xlYW58TnVtYmVyfSBbb3B0aW9ucy5yZW1vdmVDb2xsaW5lYXJQb2ludHM9ZmFsc2VdIFNldCB0byBhIG51bWJlciAoYW5nbGUgdGhyZXNob2xkIHZhbHVlKSB0byByZW1vdmUgY29sbGluZWFyIHBvaW50cywgb3IgZmFsc2UgdG8ga2VlcCBhbGwgcG9pbnRzLgogICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBvbiBzdWNjZXNzLCBlbHNlIGZhbHNlLgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgYm9keSA9IG5ldyBCb2R5KCk7CiAgICAgKiAgICAgdmFyIHBhdGggPSBbCiAgICAgKiAgICAgICAgIFstMSwgMV0sCiAgICAgKiAgICAgICAgIFstMSwgMF0sCiAgICAgKiAgICAgICAgIFsxLCAwXSwKICAgICAqICAgICAgICAgWzEsIDFdLAogICAgICogICAgICAgICBbMC41LCAwLjVdCiAgICAgKiAgICAgXTsKICAgICAqICAgICBib2R5LmZyb21Qb2x5Z29uKHBhdGgpOwogICAgICogICAgIGNvbnNvbGUubG9nKGJvZHkuc2hhcGVzKTsgLy8gW0NvbnZleCwgQ29udmV4LCAuLi5dCiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS5mcm9tUG9seWdvbiA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OyAvLyBSZW1vdmUgYWxsIHNoYXBlcwoKICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSA+PSAwOyAtLWkpIHsKICAgICAgICB0aGlzLnJlbW92ZVNoYXBlKHRoaXMuc2hhcGVzW2ldKTsKICAgICAgfSAvLyBDb3B5IHRoZSBwYXRoCgoKICAgICAgdmFyIHAgPSBbXTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykgewogICAgICAgIHBbaV0gPSB2ZWMyJGkuY2xvbmUocGF0aFtpXSk7CiAgICAgIH0gLy8gTWFrZSBpdCBjb3VudGVyLWNsb2Nrd2lzZQoKCiAgICAgIGRlY29tcC5tYWtlQ0NXKHApOwoKICAgICAgaWYgKG9wdGlvbnMucmVtb3ZlQ29sbGluZWFyUG9pbnRzICE9PSB1bmRlZmluZWQpIHsKICAgICAgICBkZWNvbXAucmVtb3ZlQ29sbGluZWFyUG9pbnRzKHAsIG9wdGlvbnMucmVtb3ZlQ29sbGluZWFyUG9pbnRzKTsKICAgICAgfSAvLyBDaGVjayBpZiBhbnkgbGluZSBzZWdtZW50IGludGVyc2VjdHMgdGhlIHBhdGggaXRzZWxmCgoKICAgICAgaWYgKCFvcHRpb25zLnNraXBTaW1wbGVDaGVjaykgewogICAgICAgIGlmICghZGVjb21wLmlzU2ltcGxlKHApKSB7CiAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgfQogICAgICB9IC8vIFNhdmUgdGhpcyBwYXRoIGZvciBsYXRlcgoKCiAgICAgIHZhciBjb25jYXZlUGF0aCA9IHRoaXMuY29uY2F2ZVBhdGggPSBbXTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbmNhdmVQYXRoW2ldID0gdmVjMiRpLmNsb25lKHBbaV0pOwogICAgICB9IC8vIFNsb3cgb3IgZmFzdCBkZWNvbXA/CgoKICAgICAgdmFyIGNvbnZleGVzOwoKICAgICAgaWYgKG9wdGlvbnMub3B0aW1hbERlY29tcCkgewogICAgICAgIGNvbnZleGVzID0gZGVjb21wLmRlY29tcChwKTsKICAgICAgfSBlbHNlIHsKICAgICAgICBjb252ZXhlcyA9IGRlY29tcC5xdWlja0RlY29tcChwKTsKICAgICAgfQoKICAgICAgdmFyIGNtID0gdmVjMmNyZWF0ZSgpOyAvLyBBZGQgY29udmV4ZXMKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSBjb252ZXhlcy5sZW5ndGg7IGkrKykgewogICAgICAgIC8vIENyZWF0ZSBjb252ZXgKICAgICAgICB2YXIgYyA9IG5ldyBDb252ZXgkMih7CiAgICAgICAgICB2ZXJ0aWNlczogY29udmV4ZXNbaV0KICAgICAgICB9KTsgLy8gTW92ZSBhbGwgdmVydGljZXMgc28gaXRzIGNlbnRlciBvZiBtYXNzIGlzIGluIHRoZSBsb2NhbCBjZW50ZXIgb2YgdGhlIGNvbnZleAoKICAgICAgICBmb3IgKHZhciBqID0gMDsgaiAhPT0gYy52ZXJ0aWNlcy5sZW5ndGg7IGorKykgewogICAgICAgICAgdmFyIHYgPSBjLnZlcnRpY2VzW2pdOwogICAgICAgICAgc3ViJDIodiwgdiwgYy5jZW50ZXJPZk1hc3MpOwogICAgICAgIH0KCiAgICAgICAgdmVjMiRpLmNvcHkoY20sIGMuY2VudGVyT2ZNYXNzKTsKICAgICAgICBjID0gbmV3IENvbnZleCQyKHsKICAgICAgICAgIHZlcnRpY2VzOiBjLnZlcnRpY2VzCiAgICAgICAgfSk7IC8vIEFkZCB0aGUgc2hhcGUKCiAgICAgICAgdGhpcy5hZGRTaGFwZShjLCBjbSk7CiAgICAgIH0KCiAgICAgIHRoaXMuYWRqdXN0Q2VudGVyT2ZNYXNzKCk7CiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgcmV0dXJuIHRydWU7CiAgICB9OwoKICAgIHZhciBhZGp1c3RDZW50ZXJPZk1hc3NfdG1wMiA9IHZlYzJjcmVhdGUoKSwKICAgICAgICBhZGp1c3RDZW50ZXJPZk1hc3NfdG1wMyA9IHZlYzJjcmVhdGUoKSwKICAgICAgICBhZGp1c3RDZW50ZXJPZk1hc3NfdG1wNCA9IHZlYzJjcmVhdGUoKTsKICAgIC8qKgogICAgICogTW92ZXMgdGhlIHNoYXBlIG9mZnNldHMgc28gdGhlaXIgY2VudGVyIG9mIG1hc3MgYmVjb21lcyB0aGUgYm9keSBjZW50ZXIgb2YgbWFzcy4KICAgICAqIEBtZXRob2QgYWRqdXN0Q2VudGVyT2ZNYXNzCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoeyBwb3NpdGlvbjogWzAsIDBdIH0pOwogICAgICogICAgIHZhciBzaGFwZSA9IG5ldyBDaXJjbGUoeyByYWRpdXM6IDEgfSk7CiAgICAgKiAgICAgYm9keS5hZGRTaGFwZShzaGFwZSwgWzEsIDBdLCAwKTsKICAgICAqICAgICBib2R5LmFkanVzdENlbnRlck9mTWFzcygpOwogICAgICogICAgIGNvbnNvbGUubG9nKGJvZHkucG9zaXRpb24pOyAvLyBbMSwgMF0KICAgICAqICAgICBjb25zb2xlLmxvZyhzaGFwZS5wb3NpdGlvbik7IC8vIFswLCAwXQogICAgICovCgogICAgQm9keSQzLnByb3RvdHlwZS5hZGp1c3RDZW50ZXJPZk1hc3MgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBvZmZzZXRfdGltZXNfYXJlYSA9IGFkanVzdENlbnRlck9mTWFzc190bXAyLAogICAgICAgICAgc3VtID0gYWRqdXN0Q2VudGVyT2ZNYXNzX3RtcDMsCiAgICAgICAgICBjbSA9IGFkanVzdENlbnRlck9mTWFzc190bXA0LAogICAgICAgICAgdG90YWxBcmVhID0gMDsKICAgICAgdmVjMiRpLnNldChzdW0sIDAsIDApOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIHMgPSB0aGlzLnNoYXBlc1tpXTsKICAgICAgICB2ZWMyJGkuc2NhbGUob2Zmc2V0X3RpbWVzX2FyZWEsIHMucG9zaXRpb24sIHMuYXJlYSk7CiAgICAgICAgYWRkJDIoc3VtLCBzdW0sIG9mZnNldF90aW1lc19hcmVhKTsKICAgICAgICB0b3RhbEFyZWEgKz0gcy5hcmVhOwogICAgICB9CgogICAgICB2ZWMyJGkuc2NhbGUoY20sIHN1bSwgMSAvIHRvdGFsQXJlYSk7IC8vIE5vdyBtb3ZlIGFsbCBzaGFwZXMKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciBzID0gdGhpcy5zaGFwZXNbaV07CiAgICAgICAgc3ViJDIocy5wb3NpdGlvbiwgcy5wb3NpdGlvbiwgY20pOwogICAgICB9IC8vIE1vdmUgdGhlIGJvZHkgcG9zaXRpb24gdG9vCgoKICAgICAgYWRkJDIodGhpcy5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbiwgY20pOyAvLyBBbmQgY29uY2F2ZSBwYXRoCgogICAgICBmb3IgKHZhciBpID0gMDsgdGhpcy5jb25jYXZlUGF0aCAmJiBpIDwgdGhpcy5jb25jYXZlUGF0aC5sZW5ndGg7IGkrKykgewogICAgICAgIHN1YiQyKHRoaXMuY29uY2F2ZVBhdGhbaV0sIHRoaXMuY29uY2F2ZVBhdGhbaV0sIGNtKTsKICAgICAgfQoKICAgICAgdGhpcy51cGRhdGVNYXNzUHJvcGVydGllcygpOwogICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nUmFkaXVzKCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBTZXRzIHRoZSBmb3JjZSBvbiB0aGUgYm9keSB0byB6ZXJvLgogICAgICogQG1ldGhvZCBzZXRaZXJvRm9yY2UKICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLnNldFplcm9Gb3JjZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGYgPSB0aGlzLmZvcmNlOwogICAgICBmWzBdID0gZlsxXSA9IHRoaXMuYW5ndWxhckZvcmNlID0gMDsKICAgIH07CgogICAgQm9keSQzLnByb3RvdHlwZS5yZXNldENvbnN0cmFpbnRWZWxvY2l0eSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGIgPSB0aGlzLAogICAgICAgICAgdmxhbWJkYSA9IGIudmxhbWJkYTsKICAgICAgdmVjMiRpLnNldCh2bGFtYmRhLCAwLCAwKTsKICAgICAgYi53bGFtYmRhID0gMDsKICAgIH07CgogICAgQm9keSQzLnByb3RvdHlwZS5hZGRDb25zdHJhaW50VmVsb2NpdHkgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBiID0gdGhpcywKICAgICAgICAgIHYgPSBiLnZlbG9jaXR5OwogICAgICBhZGQkMih2LCB2LCBiLnZsYW1iZGEpOwogICAgICBiLmFuZ3VsYXJWZWxvY2l0eSArPSBiLndsYW1iZGE7CiAgICB9OwogICAgLyoqCiAgICAgKiBBcHBseSBkYW1waW5nLCBzZWUgPGEgaHJlZj0iaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2J1bGxldC9pc3N1ZXMvZGV0YWlsP2lkPTc0Ij50aGlzPC9hPiBmb3IgZGV0YWlscy4KICAgICAqIEBtZXRob2QgYXBwbHlEYW1waW5nCiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGR0IEN1cnJlbnQgdGltZSBzdGVwCiAgICAgKi8KCgogICAgQm9keSQzLnByb3RvdHlwZS5hcHBseURhbXBpbmcgPSBmdW5jdGlvbiAoZHQpIHsKICAgICAgaWYgKHRoaXMudHlwZSA9PT0gQm9keSQzLkRZTkFNSUMpIHsKICAgICAgICAvLyBPbmx5IGZvciBkeW5hbWljIGJvZGllcwogICAgICAgIHZhciB2ID0gdGhpcy52ZWxvY2l0eTsKICAgICAgICB2ZWMyJGkuc2NhbGUodiwgdiwgTWF0aC5wb3coMSAtIHRoaXMuZGFtcGluZywgZHQpKTsKICAgICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSAqPSBNYXRoLnBvdygxIC0gdGhpcy5hbmd1bGFyRGFtcGluZywgZHQpOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBXYWtlIHRoZSBib2R5IHVwLiBOb3JtYWxseSB5b3Ugc2hvdWxkIG5vdCBuZWVkIHRoaXMsIGFzIHRoZSBib2R5IGlzIGF1dG9tYXRpY2FsbHkgYXdva2VuIGF0IGV2ZW50cyBzdWNoIGFzIGNvbGxpc2lvbnMuCiAgICAgKiBTZXRzIHRoZSBzbGVlcFN0YXRlIHRvIHt7I2Nyb3NzTGluayAiQm9keS9BV0FLRTpwcm9wZXJ0eSJ9fUJvZHkuQVdBS0V7ey9jcm9zc0xpbmt9fSBhbmQgZW1pdHMgdGhlIHdha2VVcCBldmVudCBpZiB0aGUgYm9keSB3YXNuJ3QgYXdha2UgYmVmb3JlLgogICAgICogQG1ldGhvZCB3YWtlVXAKICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLndha2VVcCA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIHMgPSB0aGlzLnNsZWVwU3RhdGU7CiAgICAgIHRoaXMuc2xlZXBTdGF0ZSA9IEJvZHkkMy5BV0FLRTsKICAgICAgdGhpcy5pZGxlVGltZSA9IDA7CgogICAgICBpZiAocyAhPT0gQm9keSQzLkFXQUtFKSB7CiAgICAgICAgdGhpcy5lbWl0KHdha2VVcEV2ZW50KTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogRm9yY2UgYm9keSBzbGVlcAogICAgICogQG1ldGhvZCBzbGVlcAogICAgICovCgoKICAgIEJvZHkkMy5wcm90b3R5cGUuc2xlZXAgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHRoaXMuc2xlZXBTdGF0ZSA9IEJvZHkkMy5TTEVFUElORzsKICAgICAgdGhpcy5hbmd1bGFyVmVsb2NpdHkgPSB0aGlzLmFuZ3VsYXJGb3JjZSA9IDA7CiAgICAgIHZlYzIkaS5zZXQodGhpcy52ZWxvY2l0eSwgMCwgMCk7CiAgICAgIHZlYzIkaS5zZXQodGhpcy5mb3JjZSwgMCwgMCk7CiAgICAgIHRoaXMuZW1pdChzbGVlcEV2ZW50KTsKICAgIH07CiAgICAvKioKICAgICAqIENhbGxlZCBldmVyeSB0aW1lc3RlcCB0byB1cGRhdGUgaW50ZXJuYWwgc2xlZXAgdGltZXIgYW5kIGNoYW5nZSBzbGVlcCBzdGF0ZSBpZiBuZWVkZWQuCiAgICAgKiBAbWV0aG9kIHNsZWVwVGljawogICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgVGhlIHdvcmxkIHRpbWUgaW4gc2Vjb25kcwogICAgICogQHBhcmFtIHtib29sZWFufSBkb250U2xlZXAKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdAogICAgICovCgoKICAgIEJvZHkkMy5wcm90b3R5cGUuc2xlZXBUaWNrID0gZnVuY3Rpb24gKHRpbWUsIGRvbnRTbGVlcCwgZHQpIHsKICAgICAgaWYgKCF0aGlzLmFsbG93U2xlZXAgfHwgdGhpcy50eXBlID09PSBCb2R5JDMuU0xFRVBJTkcpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHRoaXMud2FudHNUb1NsZWVwID0gZmFsc2U7CiAgICAgIHZhciBzcGVlZFNxdWFyZWQgPSB2ZWMyJGkuc3F1YXJlZExlbmd0aCh0aGlzLnZlbG9jaXR5KSArIE1hdGgucG93KHRoaXMuYW5ndWxhclZlbG9jaXR5LCAyKSwKICAgICAgICAgIHNwZWVkTGltaXRTcXVhcmVkID0gTWF0aC5wb3codGhpcy5zbGVlcFNwZWVkTGltaXQsIDIpOyAvLyBBZGQgdG8gaWRsZSB0aW1lCgogICAgICBpZiAoc3BlZWRTcXVhcmVkID49IHNwZWVkTGltaXRTcXVhcmVkKSB7CiAgICAgICAgdGhpcy5pZGxlVGltZSA9IDA7CiAgICAgICAgdGhpcy5zbGVlcFN0YXRlID0gQm9keSQzLkFXQUtFOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuaWRsZVRpbWUgKz0gZHQ7CgogICAgICAgIGlmICh0aGlzLnNsZWVwU3RhdGUgIT09IEJvZHkkMy5TTEVFUFkpIHsKICAgICAgICAgIHRoaXMuc2xlZXBTdGF0ZSA9IEJvZHkkMy5TTEVFUFk7CiAgICAgICAgICB0aGlzLmVtaXQoc2xlZXB5RXZlbnQpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHRoaXMuaWRsZVRpbWUgPiB0aGlzLnNsZWVwVGltZUxpbWl0KSB7CiAgICAgICAgaWYgKCFkb250U2xlZXApIHsKICAgICAgICAgIHRoaXMuc2xlZXAoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgdGhpcy53YW50c1RvU2xlZXAgPSB0cnVlOwogICAgICAgIH0KICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhlIGJvZHkgaXMgb3ZlcmxhcHBpbmcgYW5vdGhlciBib2R5LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgb25seSB3b3JrcyBpZiB0aGUgYm9keSB3YXMgYWRkZWQgdG8gYSBXb3JsZCBhbmQgaWYgYXQgbGVhc3Qgb25lIHN0ZXAgd2FzIHRha2VuLgogICAgICogQG1ldGhvZCBvdmVybGFwcwogICAgICogQHBhcmFtICB7Qm9keX0gYm9keQogICAgICogQHJldHVybiB7Ym9vbGVhbn0KICAgICAqLwoKCiAgICBCb2R5JDMucHJvdG90eXBlLm92ZXJsYXBzID0gZnVuY3Rpb24gKGJvZHkpIHsKICAgICAgcmV0dXJuIHRoaXMud29ybGQub3ZlcmxhcEtlZXBlci5ib2RpZXNBcmVPdmVybGFwcGluZyh0aGlzLCBib2R5KTsKICAgIH07CgogICAgdmFyIGludGVncmF0ZV9maE1pbnYgPSB2ZWMyY3JlYXRlKCk7CiAgICB2YXIgaW50ZWdyYXRlX3ZlbG9kdCA9IHZlYzJjcmVhdGUoKTsKICAgIC8qKgogICAgICogTW92ZSB0aGUgYm9keSBmb3J3YXJkIGluIHRpbWUgZ2l2ZW4gaXRzIGN1cnJlbnQgdmVsb2NpdHkuCiAgICAgKiBAbWV0aG9kIGludGVncmF0ZQogICAgICogQHBhcmFtICB7TnVtYmVyfSBkdAogICAgICovCgogICAgQm9keSQzLnByb3RvdHlwZS5pbnRlZ3JhdGUgPSBmdW5jdGlvbiAoZHQpIHsKICAgICAgdmFyIG1pbnYgPSB0aGlzLmludk1hc3MsCiAgICAgICAgICBmID0gdGhpcy5mb3JjZSwKICAgICAgICAgIHBvcyA9IHRoaXMucG9zaXRpb24sCiAgICAgICAgICB2ZWxvID0gdGhpcy52ZWxvY2l0eTsgLy8gU2F2ZSBvbGQgcG9zaXRpb24KCiAgICAgIHZlYzIkaS5jb3B5KHRoaXMucHJldmlvdXNQb3NpdGlvbiwgdGhpcy5wb3NpdGlvbik7CiAgICAgIHRoaXMucHJldmlvdXNBbmdsZSA9IHRoaXMuYW5nbGU7IC8vIFZlbG9jaXR5IHVwZGF0ZQoKICAgICAgaWYgKCF0aGlzLmZpeGVkUm90YXRpb24pIHsKICAgICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSArPSB0aGlzLmFuZ3VsYXJGb3JjZSAqIHRoaXMuaW52SW5lcnRpYSAqIGR0OwogICAgICB9CgogICAgICB2ZWMyJGkuc2NhbGUoaW50ZWdyYXRlX2ZoTWludiwgZiwgZHQgKiBtaW52KTsKICAgICAgdmVjMiRpLm11bHRpcGx5KGludGVncmF0ZV9maE1pbnYsIHRoaXMubWFzc011bHRpcGxpZXIsIGludGVncmF0ZV9maE1pbnYpOwogICAgICBhZGQkMih2ZWxvLCBpbnRlZ3JhdGVfZmhNaW52LCB2ZWxvKTsgLy8gQ0NECgogICAgICBpZiAoIXRoaXMuaW50ZWdyYXRlVG9UaW1lT2ZJbXBhY3QoZHQpKSB7CiAgICAgICAgLy8gUmVndWxhciBwb3NpdGlvbiB1cGRhdGUKICAgICAgICB2ZWMyJGkuc2NhbGUoaW50ZWdyYXRlX3ZlbG9kdCwgdmVsbywgZHQpOwogICAgICAgIGFkZCQyKHBvcywgcG9zLCBpbnRlZ3JhdGVfdmVsb2R0KTsKCiAgICAgICAgaWYgKCF0aGlzLmZpeGVkUm90YXRpb24pIHsKICAgICAgICAgIHRoaXMuYW5nbGUgKz0gdGhpcy5hbmd1bGFyVmVsb2NpdHkgKiBkdDsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgIH07CgogICAgdmFyIHJlc3VsdCA9IG5ldyBSYXljYXN0UmVzdWx0KCk7CiAgICB2YXIgcmF5ID0gbmV3IFJheSh7CiAgICAgIG1vZGU6IFJheS5DTE9TRVNULAogICAgICBza2lwQmFja2ZhY2VzOiB0cnVlCiAgICB9KTsKICAgIHZhciBkaXJlY3Rpb24gPSB2ZWMyY3JlYXRlKCk7CiAgICB2YXIgZW5kID0gdmVjMmNyZWF0ZSgpOwogICAgdmFyIHN0YXJ0VG9FbmQgPSB2ZWMyY3JlYXRlKCk7CiAgICB2YXIgcmVtZW1iZXJQb3NpdGlvbiA9IHZlYzJjcmVhdGUoKTsKCiAgICBCb2R5JDMucHJvdG90eXBlLmludGVncmF0ZVRvVGltZU9mSW1wYWN0ID0gZnVuY3Rpb24gKGR0KSB7CiAgICAgIGlmICh0aGlzLmNjZFNwZWVkVGhyZXNob2xkIDwgMCB8fCB2ZWMyJGkuc3F1YXJlZExlbmd0aCh0aGlzLnZlbG9jaXR5KSA8IE1hdGgucG93KHRoaXMuY2NkU3BlZWRUaHJlc2hvbGQsIDIpKSB7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9IC8vIElnbm9yZSBhbGwgdGhlIGlnbm9yZWQgYm9keSBwYWlycwogICAgICAvLyBUaGlzIHNob3VsZCBwcm9iYWJseSBiZSBkb25lIHNvbWV3aGVyZSBlbHNlIGZvciBvcHRpbWl6YXRpb24KCgogICAgICB2YXIgaWdub3JlQm9kaWVzID0gW107CiAgICAgIHZhciBkaXNhYmxlZFBhaXJzID0gdGhpcy53b3JsZC5kaXNhYmxlZEJvZHlDb2xsaXNpb25QYWlyczsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzYWJsZWRQYWlycy5sZW5ndGg7IGkgKz0gMikgewogICAgICAgIHZhciBib2R5QSA9IGRpc2FibGVkUGFpcnNbaV07CiAgICAgICAgdmFyIGJvZHlCID0gZGlzYWJsZWRQYWlyc1tpICsgMV07CgogICAgICAgIGlmIChib2R5QSA9PT0gdGhpcykgewogICAgICAgICAgaWdub3JlQm9kaWVzLnB1c2goYm9keUIpOwogICAgICAgIH0gZWxzZSBpZiAoYm9keUIgPT09IHRoaXMpIHsKICAgICAgICAgIGlnbm9yZUJvZGllcy5wdXNoKGJvZHlBKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHZlYzIkaS5ub3JtYWxpemUoZGlyZWN0aW9uLCB0aGlzLnZlbG9jaXR5KTsKICAgICAgdmVjMiRpLnNjYWxlKGVuZCwgdGhpcy52ZWxvY2l0eSwgZHQpOwogICAgICBhZGQkMihlbmQsIGVuZCwgdGhpcy5wb3NpdGlvbik7CiAgICAgIHN1YiQyKHN0YXJ0VG9FbmQsIGVuZCwgdGhpcy5wb3NpdGlvbik7CiAgICAgIHZhciBzdGFydFRvRW5kQW5nbGUgPSB0aGlzLmFuZ3VsYXJWZWxvY2l0eSAqIGR0OwogICAgICB2YXIgbGVuID0gdmVjMiRpLmxlbmd0aChzdGFydFRvRW5kKTsKICAgICAgdmFyIHRpbWVPZkltcGFjdCA9IDE7CiAgICAgIHZhciBoaXRCb2R5OwogICAgICB2ZWMyJGkuY29weShyYXkuZnJvbSwgdGhpcy5wb3NpdGlvbik7CiAgICAgIHZlYzIkaS5jb3B5KHJheS50bywgZW5kKTsKICAgICAgcmF5LnVwZGF0ZSgpOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciBzaGFwZSA9IHRoaXMuc2hhcGVzW2ldOwogICAgICAgIHJlc3VsdC5yZXNldCgpOwogICAgICAgIHJheS5jb2xsaXNpb25Hcm91cCA9IHNoYXBlLmNvbGxpc2lvbkdyb3VwOwogICAgICAgIHJheS5jb2xsaXNpb25NYXNrID0gc2hhcGUuY29sbGlzaW9uTWFzazsKICAgICAgICB0aGlzLndvcmxkLnJheWNhc3QocmVzdWx0LCByYXkpOwogICAgICAgIGhpdEJvZHkgPSByZXN1bHQuYm9keTsKCiAgICAgICAgaWYgKGhpdEJvZHkgPT09IHRoaXMgfHwgaWdub3JlQm9kaWVzLmluZGV4T2YoaGl0Qm9keSkgIT09IC0xKSB7CiAgICAgICAgICBoaXRCb2R5ID0gbnVsbDsKICAgICAgICB9CgogICAgICAgIGlmIChoaXRCb2R5KSB7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICghaGl0Qm9keSB8fCAhdGltZU9mSW1wYWN0KSB7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9CgogICAgICByZXN1bHQuZ2V0SGl0UG9pbnQoZW5kLCByYXkpOwogICAgICBzdWIkMihzdGFydFRvRW5kLCBlbmQsIHRoaXMucG9zaXRpb24pOwogICAgICB0aW1lT2ZJbXBhY3QgPSB2ZWMyJGkuZGlzdGFuY2UoZW5kLCB0aGlzLnBvc2l0aW9uKSAvIGxlbjsgLy8gZ3Vlc3MKCiAgICAgIHZhciByZW1lbWJlckFuZ2xlID0gdGhpcy5hbmdsZTsKICAgICAgdmVjMiRpLmNvcHkocmVtZW1iZXJQb3NpdGlvbiwgdGhpcy5wb3NpdGlvbik7IC8vIEdvdCBhIHN0YXJ0IGFuZCBlbmQgcG9pbnQuIEFwcHJveGltYXRlIHRpbWUgb2YgaW1wYWN0IHVzaW5nIGJpbmFyeSBzZWFyY2gKCiAgICAgIHZhciBpdGVyID0gMDsKICAgICAgdmFyIHRtaW4gPSAwOwogICAgICB2YXIgdG1pZCA9IHRpbWVPZkltcGFjdDsKICAgICAgdmFyIHRtYXggPSAxOwoKICAgICAgd2hpbGUgKHRtYXggPj0gdG1pbiAmJiBpdGVyIDwgdGhpcy5jY2RJdGVyYXRpb25zKSB7CiAgICAgICAgaXRlcisrOyAvLyBjYWxjdWxhdGUgdGhlIG1pZHBvaW50CgogICAgICAgIHRtaWQgPSAodG1heCArIHRtaW4pIC8gMjsgLy8gTW92ZSB0aGUgYm9keSB0byB0aGF0IHBvaW50CgogICAgICAgIHZlYzIkaS5zY2FsZShpbnRlZ3JhdGVfdmVsb2R0LCBzdGFydFRvRW5kLCB0bWlkKTsKICAgICAgICBhZGQkMih0aGlzLnBvc2l0aW9uLCByZW1lbWJlclBvc2l0aW9uLCBpbnRlZ3JhdGVfdmVsb2R0KTsKICAgICAgICB0aGlzLmFuZ2xlID0gcmVtZW1iZXJBbmdsZSArIHN0YXJ0VG9FbmRBbmdsZSAqIHRtaWQ7CiAgICAgICAgdGhpcy51cGRhdGVBQUJCKCk7IC8vIGNoZWNrIG92ZXJsYXAKCiAgICAgICAgdmFyIG92ZXJsYXBzID0gdGhpcy5hYWJiLm92ZXJsYXBzKGhpdEJvZHkuYWFiYikgJiYgdGhpcy53b3JsZC5uYXJyb3dwaGFzZS5ib2RpZXNPdmVybGFwKHRoaXMsIGhpdEJvZHksIHRydWUpOwoKICAgICAgICBpZiAob3ZlcmxhcHMpIHsKICAgICAgICAgIC8vIGNoYW5nZSBtYXggdG8gc2VhcmNoIGxvd2VyIGludGVydmFsCiAgICAgICAgICB0bWF4ID0gdG1pZDsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgLy8gY2hhbmdlIG1pbiB0byBzZWFyY2ggdXBwZXIgaW50ZXJ2YWwKICAgICAgICAgIHRtaW4gPSB0bWlkOwogICAgICAgIH0KICAgICAgfQoKICAgICAgdGltZU9mSW1wYWN0ID0gdG1heDsgLy8gTmVlZCB0byBndWFyYW50ZWUgb3ZlcmxhcCB0byByZXNvbHZlIGNvbGxpc2lvbnMKCiAgICAgIHZlYzIkaS5jb3B5KHRoaXMucG9zaXRpb24sIHJlbWVtYmVyUG9zaXRpb24pOwogICAgICB0aGlzLmFuZ2xlID0gcmVtZW1iZXJBbmdsZTsgLy8gbW92ZSB0byBUT0kKCiAgICAgIHZlYzIkaS5zY2FsZShpbnRlZ3JhdGVfdmVsb2R0LCBzdGFydFRvRW5kLCB0aW1lT2ZJbXBhY3QpOwogICAgICBhZGQkMih0aGlzLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uLCBpbnRlZ3JhdGVfdmVsb2R0KTsKCiAgICAgIGlmICghdGhpcy5maXhlZFJvdGF0aW9uKSB7CiAgICAgICAgdGhpcy5hbmdsZSArPSBzdGFydFRvRW5kQW5nbGUgKiB0aW1lT2ZJbXBhY3Q7CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IHZlbG9jaXR5IG9mIGEgcG9pbnQgaW4gdGhlIGJvZHkuCiAgICAgKiBAbWV0aG9kIGdldFZlbG9jaXR5QXRQb2ludAogICAgICogQHBhcmFtICB7QXJyYXl9IHJlc3VsdCBBIHZlY3RvciB0byBzdG9yZSB0aGUgcmVzdWx0IGluCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gcmVsYXRpdmVQb2ludCBBIHdvcmxkIG9yaWVudGVkIHZlY3RvciwgaW5kaWNhdGluZyB0aGUgcG9zaXRpb24gb2YgdGhlIHBvaW50IHRvIGdldCB0aGUgdmVsb2NpdHkgZnJvbQogICAgICogQHJldHVybiB7QXJyYXl9IFRoZSByZXN1bHQgdmVjdG9yCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoewogICAgICogICAgICAgICBtYXNzOiAxLAogICAgICogICAgICAgICB2ZWxvY2l0eTogWzEsIDBdLAogICAgICogICAgICAgICBhbmd1bGFyVmVsb2NpdHk6IDEKICAgICAqICAgICB9KTsKICAgICAqICAgICB2YXIgcmVzdWx0ID0gW107CiAgICAgKiAgICAgdmFyIHBvaW50ID0gWzEsIDBdOwogICAgICogICAgIGJvZHkuZ2V0VmVsb2NpdHlBdFBvaW50KHJlc3VsdCwgcG9pbnQpOwogICAgICogICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vIFsxLCAxXQogICAgICovCgoKICAgIEJvZHkkMy5wcm90b3R5cGUuZ2V0VmVsb2NpdHlBdFBvaW50ID0gZnVuY3Rpb24gKHJlc3VsdCwgcmVsYXRpdmVQb2ludCkgewogICAgICB2ZWMyJGkuY3Jvc3NWWihyZXN1bHQsIHJlbGF0aXZlUG9pbnQsIHRoaXMuYW5ndWxhclZlbG9jaXR5KTsKICAgICAgdmVjMiRpLnN1YnRyYWN0KHJlc3VsdCwgdGhpcy52ZWxvY2l0eSwgcmVzdWx0KTsKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH07CiAgICAvKioKICAgICAqIER5bmFtaWMgYm9keS4KICAgICAqIEBwcm9wZXJ0eSBEWU5BTUlDCiAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICogQHN0YXRpYwogICAgICovCgoKICAgIEJvZHkkMy5EWU5BTUlDID0gMTsKICAgIC8qKgogICAgICogU3RhdGljIGJvZHkuCiAgICAgKiBAcHJvcGVydHkgU1RBVElDCiAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICogQHN0YXRpYwogICAgICovCgogICAgQm9keSQzLlNUQVRJQyA9IDI7CiAgICAvKioKICAgICAqIEtpbmVtYXRpYyBib2R5LgogICAgICogQHByb3BlcnR5IEtJTkVNQVRJQwogICAgICogQHR5cGUge051bWJlcn0KICAgICAqIEBzdGF0aWMKICAgICAqLwoKICAgIEJvZHkkMy5LSU5FTUFUSUMgPSA0OwogICAgLyoqCiAgICAgKiBAcHJvcGVydHkgQVdBS0UKICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgKiBAc3RhdGljCiAgICAgKi8KCiAgICBCb2R5JDMuQVdBS0UgPSAwOwogICAgLyoqCiAgICAgKiBAcHJvcGVydHkgU0xFRVBZCiAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICogQHN0YXRpYwogICAgICovCgogICAgQm9keSQzLlNMRUVQWSA9IDE7CiAgICAvKioKICAgICAqIEBwcm9wZXJ0eSBTTEVFUElORwogICAgICogQHR5cGUge051bWJlcn0KICAgICAqIEBzdGF0aWMKICAgICAqLwoKICAgIEJvZHkkMy5TTEVFUElORyA9IDI7CgogICAgdmFyIHZlYzIkaCA9IHZlYzIkcS5leHBvcnRzOwoKICAgIHZhciBCb2R5JDIgPSBCb2R5XzE7CgogICAgdmFyIEJyb2FkcGhhc2VfMSA9IEJyb2FkcGhhc2UkMjsKICAgIC8qKgogICAgICogQmFzZSBjbGFzcyBmb3IgYnJvYWRwaGFzZSBpbXBsZW1lbnRhdGlvbnMuIERvbid0IHVzZSB0aGlzIGNsYXNzIGRpcmVjdGx5LgogICAgICogQGNsYXNzIEJyb2FkcGhhc2UKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICovCgogICAgZnVuY3Rpb24gQnJvYWRwaGFzZSQyKHR5cGUpIHsKICAgICAgdGhpcy50eXBlID0gdHlwZTsKICAgICAgLyoqCiAgICAgICAqIFRoZSByZXN1bHRpbmcgb3ZlcmxhcHBpbmcgcGFpcnMuIFdpbGwgYmUgZmlsbGVkIHdpdGggcmVzdWx0cyBkdXJpbmcgLmdldENvbGxpc2lvblBhaXJzKCkuCiAgICAgICAqIEBwcm9wZXJ0eSByZXN1bHQKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMucmVzdWx0ID0gW107CiAgICAgIC8qKgogICAgICAgKiBUaGUgd29ybGQgdG8gc2VhcmNoIGZvciBjb2xsaXNpb24gcGFpcnMgaW4uIFRvIGNoYW5nZSBpdCwgdXNlIC5zZXRXb3JsZCgpCiAgICAgICAqIEBwcm9wZXJ0eSB3b3JsZAogICAgICAgKiBAdHlwZSB7V29ybGR9CiAgICAgICAqIEByZWFkT25seQogICAgICAgKi8KCiAgICAgIHRoaXMud29ybGQgPSBudWxsOwogICAgICAvKioKICAgICAgICogVGhlIGJvdW5kaW5nIHZvbHVtZSB0eXBlIHRvIHVzZSBpbiB0aGUgYnJvYWRwaGFzZSBhbGdvcml0aG1zLiBTaG91bGQgYmUgc2V0IHRvIEJyb2FkcGhhc2UuQUFCQiBvciBCcm9hZHBoYXNlLkJPVU5ESU5HX0NJUkNMRS4KICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGJvdW5kaW5nVm9sdW1lVHlwZQogICAgICAgKi8KCiAgICAgIHRoaXMuYm91bmRpbmdWb2x1bWVUeXBlID0gQnJvYWRwaGFzZSQyLkFBQkI7CiAgICB9CiAgICAvKioKICAgICAqIEF4aXMgYWxpZ25lZCBib3VuZGluZyBib3ggdHlwZS4KICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBQUJCCiAgICAgKi8KCgogICAgQnJvYWRwaGFzZSQyLkFBQkIgPSAxOwogICAgLyoqCiAgICAgKiBCb3VuZGluZyBjaXJjbGUgdHlwZS4KICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCT1VORElOR19DSVJDTEUKICAgICAqLwoKICAgIEJyb2FkcGhhc2UkMi5CT1VORElOR19DSVJDTEUgPSAyOwogICAgLyoqCiAgICAgKiBTZXQgdGhlIHdvcmxkIHRoYXQgd2UgYXJlIHNlYXJjaGluZyBmb3IgY29sbGlzaW9uIHBhaXJzIGluLgogICAgICogQG1ldGhvZCBzZXRXb3JsZAogICAgICogQHBhcmFtICB7V29ybGR9IHdvcmxkCiAgICAgKi8KCiAgICBCcm9hZHBoYXNlJDIucHJvdG90eXBlLnNldFdvcmxkID0gZnVuY3Rpb24gKHdvcmxkKSB7CiAgICAgIHRoaXMud29ybGQgPSB3b3JsZDsKICAgIH07CiAgICAvKioKICAgICAqIEdldCBhbGwgcG90ZW50aWFsIGludGVyc2VjdGluZyBib2R5IHBhaXJzLgogICAgICogQG1ldGhvZCBnZXRDb2xsaXNpb25QYWlycwogICAgICogQHBhcmFtICB7V29ybGR9IHdvcmxkIFRoZSB3b3JsZCB0byBzZWFyY2ggaW4uCiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIGJvZGllcywgb3JkZXJlZCBpbiBwYWlycy4gRXhhbXBsZTogQSByZXN1bHQgb2YgW2EsYixjLGRdIG1lYW5zIHRoYXQgdGhlIHBvdGVudGlhbCBwYWlycyBhcmU6IChhLGIpLCAoYyxkKS4KICAgICAqLwoKCiAgICBCcm9hZHBoYXNlJDIucHJvdG90eXBlLmdldENvbGxpc2lvblBhaXJzID0gZnVuY3Rpb24KICAgICAgLyp3b3JsZCovCiAgICAoKSB7fTsKICAgIC8qKgogICAgICogQ2hlY2sgd2hldGhlciB0aGUgYm91bmRpbmcgcmFkaXVzIG9mIHR3byBib2RpZXMgb3ZlcmxhcC4KICAgICAqIEBtZXRob2QgIGJvdW5kaW5nUmFkaXVzQ2hlY2sKICAgICAqIEBwYXJhbSAge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QgogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKCiAgICBCcm9hZHBoYXNlJDIuYm91bmRpbmdSYWRpdXNDaGVjayA9IGZ1bmN0aW9uIChib2R5QSwgYm9keUIpIHsKICAgICAgdmFyIGQyID0gdmVjMiRoLnNxdWFyZWREaXN0YW5jZShib2R5QS5wb3NpdGlvbiwgYm9keUIucG9zaXRpb24pLAogICAgICAgICAgciA9IGJvZHlBLmJvdW5kaW5nUmFkaXVzICsgYm9keUIuYm91bmRpbmdSYWRpdXM7CiAgICAgIHJldHVybiBkMiA8PSByICogcjsKICAgIH07CiAgICAvKioKICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIEFBQkIgb2YgdHdvIGJvZGllcyBvdmVybGFwLgogICAgICogQG1ldGhvZCAgYWFiYkNoZWNrCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtICB7Qm9keX0gYm9keUIKICAgICAqIEByZXR1cm4ge0Jvb2xlYW59CiAgICAgKi8KCgogICAgQnJvYWRwaGFzZSQyLmFhYmJDaGVjayA9IGZ1bmN0aW9uIChib2R5QSwgYm9keUIpIHsKICAgICAgcmV0dXJuIGJvZHlBLmdldEFBQkIoKS5vdmVybGFwcyhib2R5Qi5nZXRBQUJCKCkpOwogICAgfTsKICAgIC8qKgogICAgICogQ2hlY2sgd2hldGhlciB0aGUgYm91bmRpbmcgdm9sdW1lcyBvZiB0d28gYm9kaWVzIG92ZXJsYXAuCiAgICAgKiBAbWV0aG9kICBib3VuZGluZ1ZvbHVtZUNoZWNrCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtICB7Qm9keX0gYm9keUIKICAgICAqIEByZXR1cm4ge0Jvb2xlYW59CiAgICAgKi8KCgogICAgQnJvYWRwaGFzZSQyLnByb3RvdHlwZS5ib3VuZGluZ1ZvbHVtZUNoZWNrID0gZnVuY3Rpb24gKGJvZHlBLCBib2R5QikgewogICAgICB2YXIgcmVzdWx0OwoKICAgICAgc3dpdGNoICh0aGlzLmJvdW5kaW5nVm9sdW1lVHlwZSkgewogICAgICAgIGNhc2UgQnJvYWRwaGFzZSQyLkJPVU5ESU5HX0NJUkNMRToKICAgICAgICAgIHJlc3VsdCA9IEJyb2FkcGhhc2UkMi5ib3VuZGluZ1JhZGl1c0NoZWNrKGJvZHlBLCBib2R5Qik7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSBCcm9hZHBoYXNlJDIuQUFCQjoKICAgICAgICAgIHJlc3VsdCA9IEJyb2FkcGhhc2UkMi5hYWJiQ2hlY2soYm9keUEsIGJvZHlCKTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBkZWZhdWx0OgogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3VuZGluZyB2b2x1bWUgdHlwZSBub3QgcmVjb2duaXplZDogJyArIHRoaXMuYm91bmRpbmdWb2x1bWVUeXBlKTsKICAgICAgfQoKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH07CiAgICAvKioKICAgICAqIENoZWNrIHdoZXRoZXIgdHdvIGJvZGllcyBhcmUgYWxsb3dlZCB0byBjb2xsaWRlIGF0IGFsbC4KICAgICAqIEBtZXRob2QgIGNhbkNvbGxpZGUKICAgICAqIEBwYXJhbSAge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QgogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKCiAgICBCcm9hZHBoYXNlJDIuY2FuQ29sbGlkZSA9IGZ1bmN0aW9uIChib2R5QSwgYm9keUIpIHsKICAgICAgdmFyIEtJTkVNQVRJQyA9IEJvZHkkMi5LSU5FTUFUSUM7CiAgICAgIHZhciBTVEFUSUMgPSBCb2R5JDIuU1RBVElDOwogICAgICB2YXIgdHlwZUEgPSBib2R5QS50eXBlOwogICAgICB2YXIgdHlwZUIgPSBib2R5Qi50eXBlOyAvLyBDYW5ub3QgY29sbGlkZSBzdGF0aWMgYm9kaWVzCgogICAgICBpZiAodHlwZUEgPT09IFNUQVRJQyAmJiB0eXBlQiA9PT0gU1RBVElDKSB7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9IC8vIENhbm5vdCBjb2xsaWRlIHN0YXRpYyB2cyBraW5lbWF0aWMgYm9kaWVzCgoKICAgICAgaWYgKHR5cGVBID09PSBLSU5FTUFUSUMgJiYgdHlwZUIgPT09IFNUQVRJQyB8fCB0eXBlQSA9PT0gU1RBVElDICYmIHR5cGVCID09PSBLSU5FTUFUSUMpIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0gLy8gQ2Fubm90IGNvbGxpZGUga2luZW1hdGljIHZzIGtpbmVtYXRpYwoKCiAgICAgIGlmICh0eXBlQSA9PT0gS0lORU1BVElDICYmIHR5cGVCID09PSBLSU5FTUFUSUMpIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0gLy8gQ2Fubm90IGNvbGxpZGUgYm90aCBzbGVlcGluZyBib2RpZXMKCgogICAgICBpZiAoYm9keUEuc2xlZXBTdGF0ZSA9PT0gQm9keSQyLlNMRUVQSU5HICYmIGJvZHlCLnNsZWVwU3RhdGUgPT09IEJvZHkkMi5TTEVFUElORykgewogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfSAvLyBDYW5ub3QgY29sbGlkZSBpZiBvbmUgaXMgc3RhdGljIGFuZCB0aGUgb3RoZXIgaXMgc2xlZXBpbmcKCgogICAgICBpZiAoYm9keUEuc2xlZXBTdGF0ZSA9PT0gQm9keSQyLlNMRUVQSU5HICYmIHR5cGVCID09PSBTVEFUSUMgfHwgYm9keUIuc2xlZXBTdGF0ZSA9PT0gQm9keSQyLlNMRUVQSU5HICYmIHR5cGVBID09PSBTVEFUSUMpIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfTsKCiAgICBCcm9hZHBoYXNlJDIuTkFJVkUgPSAxOwogICAgQnJvYWRwaGFzZSQyLlNBUCA9IDI7CiAgICAvKioKICAgICAqIFJldHVybnMgYWxsIHRoZSBib2RpZXMgd2l0aGluIGFuIEFBQkIuCiAgICAgKiBAbWV0aG9kIGFhYmJRdWVyeQogICAgICogQHBhcmFtICB7V29ybGR9IHdvcmxkCiAgICAgKiBAcGFyYW0gIHtBQUJCfSBhYWJiCiAgICAgKiBAcGFyYW0ge2FycmF5fSByZXN1bHQgQW4gYXJyYXkgdG8gc3RvcmUgcmVzdWx0aW5nIGJvZGllcyBpbi4KICAgICAqIEByZXR1cm4ge2FycmF5fQogICAgICovCgogICAgQnJvYWRwaGFzZSQyLnByb3RvdHlwZS5hYWJiUXVlcnkgPSBmdW5jdGlvbgogICAgICAvKndvcmxkLCBhYWJiLCByZXN1bHQqLwogICAgKCkgey8vIFRvIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXMKICAgIH07CgogICAgdmFyIFNoYXBlJDggPSBTaGFwZV8xLAogICAgICAgIHNoYWxsb3dDbG9uZSQ1ID0gVXRpbHNfMS5zaGFsbG93Q2xvbmUsCiAgICAgICAgdmVjMiRnID0gdmVjMiRxLmV4cG9ydHM7CgogICAgdmFyIENhcHN1bGVfMSA9IENhcHN1bGU7CiAgICAvKioKICAgICAqIENhcHN1bGUgc2hhcGUuCiAgICAgKiBAY2xhc3MgQ2Fwc3VsZQogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAZXh0ZW5kcyBTaGFwZQogICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAoTm90ZSB0aGF0IHRoaXMgb3B0aW9ucyBvYmplY3Qgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIHt7I2Nyb3NzTGluayAiU2hhcGUifX17ey9jcm9zc0xpbmt9fSBjb25zdHJ1Y3Rvci4pCiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubGVuZ3RoPTFdIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBlbmQgcG9pbnRzLCBleHRlbmRzIGFsb25nIHRoZSBYIGF4aXMuCiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmFkaXVzPTFdIFJhZGl1cyBvZiB0aGUgY2Fwc3VsZS4KICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSk7CiAgICAgKiAgICAgdmFyIGNhcHN1bGVTaGFwZSA9IG5ldyBDYXBzdWxlKHsKICAgICAqICAgICAgICAgbGVuZ3RoOiAxLAogICAgICogICAgICAgICByYWRpdXM6IDIKICAgICAqICAgICB9KTsKICAgICAqICAgICBib2R5LmFkZFNoYXBlKGNhcHN1bGVTaGFwZSk7CiAgICAgKi8KCiAgICBmdW5jdGlvbiBDYXBzdWxlKG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBzaGFsbG93Q2xvbmUkNShvcHRpb25zKSA6IHt9OwogICAgICAvKioKICAgICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGVuZCBwb2ludHMuCiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsZW5ndGgKICAgICAgICovCgogICAgICB0aGlzLmxlbmd0aCA9IG9wdGlvbnMubGVuZ3RoICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmxlbmd0aCA6IDE7CiAgICAgIC8qKgogICAgICAgKiBUaGUgcmFkaXVzIG9mIHRoZSBjYXBzdWxlLgogICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaXVzCiAgICAgICAqLwoKICAgICAgdGhpcy5yYWRpdXMgPSBvcHRpb25zLnJhZGl1cyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5yYWRpdXMgOiAxOwogICAgICBvcHRpb25zLnR5cGUgPSBTaGFwZSQ4LkNBUFNVTEU7CiAgICAgIFNoYXBlJDguY2FsbCh0aGlzLCBvcHRpb25zKTsKICAgIH0KCiAgICBDYXBzdWxlLnByb3RvdHlwZSA9IG5ldyBTaGFwZSQ4KCk7CiAgICBDYXBzdWxlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENhcHN1bGU7CiAgICAvKioKICAgICAqIENvbXB1dGUgdGhlIG1hc3MgbW9tZW50IG9mIGluZXJ0aWEgb2YgdGhlIENhcHN1bGUuCiAgICAgKiBAbWV0aG9kIGNvbnB1dGVNb21lbnRPZkluZXJ0aWEKICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAqIEB0b2RvCiAgICAgKi8KCiAgICBDYXBzdWxlLnByb3RvdHlwZS5jb21wdXRlTW9tZW50T2ZJbmVydGlhID0gZnVuY3Rpb24gKCkgewogICAgICAvLyBodHRwOi8vd3d3LmVmdW5kYS5jb20vbWF0aC9hcmVhcy9yZWN0YW5nbGUuY2ZtCiAgICAgIGZ1bmN0aW9uIGJveEkodywgaCkgewogICAgICAgIHJldHVybiB3ICogaCAqIChNYXRoLnBvdyh3LCAyKSArIE1hdGgucG93KGgsIDIpKSAvIDEyOwogICAgICB9CgogICAgICBmdW5jdGlvbiBzZW1pQShyKSB7CiAgICAgICAgcmV0dXJuIE1hdGguUEkgKiBNYXRoLnBvdyhyLCAyKSAvIDI7CiAgICAgIH0gLy8gaHR0cDovL3d3dy5lZnVuZGEuY29tL21hdGgvYXJlYXMvQ2lyY2xlSGFsZi5jZm0KCgogICAgICBmdW5jdGlvbiBzZW1pSShyKSB7CiAgICAgICAgcmV0dXJuIChNYXRoLlBJIC8gNCAtIDggLyAoOSAqIE1hdGguUEkpKSAqIE1hdGgucG93KHIsIDQpOwogICAgICB9CgogICAgICBmdW5jdGlvbiBzZW1pQyhyKSB7CiAgICAgICAgcmV0dXJuIDQgKiByIC8gKDMgKiBNYXRoLlBJKTsKICAgICAgfSAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TZWNvbmRfbW9tZW50X29mX2FyZWEjUGFyYWxsZWxfYXhpc190aGVvcmVtCgoKICAgICAgZnVuY3Rpb24gY2Fwc3VsZUEobCwgcikgewogICAgICAgIHJldHVybiBsICogMiAqIHIgKyBNYXRoLlBJICogTWF0aC5wb3cociwgMik7CiAgICAgIH0KCiAgICAgIGZ1bmN0aW9uIGNhcHN1bGVJKGwsIHIpIHsKICAgICAgICB2YXIgZCA9IGwgLyAyICsgc2VtaUMocik7CiAgICAgICAgcmV0dXJuIGJveEkobCwgMiAqIHIpICsgMiAqIChzZW1pSShyKSArIHNlbWlBKHIpICogTWF0aC5wb3coZCwgMikpOwogICAgICB9CgogICAgICB2YXIgciA9IHRoaXMucmFkaXVzLAogICAgICAgICAgbCA9IHRoaXMubGVuZ3RoLAogICAgICAgICAgYXJlYSA9IGNhcHN1bGVBKGwsIHIpOwogICAgICByZXR1cm4gYXJlYSA+IDAgPyBjYXBzdWxlSShsLCByKSAvIGFyZWEgOiAwOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCB1cGRhdGVCb3VuZGluZ1JhZGl1cwogICAgICovCgoKICAgIENhcHN1bGUucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nUmFkaXVzID0gZnVuY3Rpb24gKCkgewogICAgICB0aGlzLmJvdW5kaW5nUmFkaXVzID0gdGhpcy5yYWRpdXMgKyB0aGlzLmxlbmd0aCAvIDI7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIHVwZGF0ZUFyZWEKICAgICAqLwoKCiAgICBDYXBzdWxlLnByb3RvdHlwZS51cGRhdGVBcmVhID0gZnVuY3Rpb24gKCkgewogICAgICB0aGlzLmFyZWEgPSBNYXRoLlBJICogdGhpcy5yYWRpdXMgKiB0aGlzLnJhZGl1cyArIHRoaXMucmFkaXVzICogMiAqIHRoaXMubGVuZ3RoOwogICAgfTsKCiAgICB2YXIgciQxID0gdmVjMiRnLmNyZWF0ZSgpOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNvbXB1dGVBQUJCCiAgICAgKiBAcGFyYW0gIHtBQUJCfSAgIG91dCAgICAgIFRoZSByZXN1bHRpbmcgQUFCQi4KICAgICAqIEBwYXJhbSAge0FycmF5fSAgcG9zaXRpb24KICAgICAqIEBwYXJhbSAge051bWJlcn0gYW5nbGUKICAgICAqLwoKICAgIENhcHN1bGUucHJvdG90eXBlLmNvbXB1dGVBQUJCID0gZnVuY3Rpb24gKG91dCwgcG9zaXRpb24sIGFuZ2xlKSB7CiAgICAgIHZhciByYWRpdXMgPSB0aGlzLnJhZGl1czsgLy8gQ29tcHV0ZSBjZW50ZXIgcG9zaXRpb24gb2Ygb25lIG9mIHRoZSB0aGUgY2lyY2xlcywgd29ybGQgb3JpZW50ZWQsIGJ1dCB3aXRoIGxvY2FsIG9mZnNldAoKICAgICAgdmVjMiRnLnNldChyJDEsIHRoaXMubGVuZ3RoIC8gMiwgMCk7CgogICAgICBpZiAoYW5nbGUgIT09IDApIHsKICAgICAgICB2ZWMyJGcucm90YXRlKHIkMSwgciQxLCBhbmdsZSk7CiAgICAgIH0gLy8gR2V0IGJvdW5kcwoKCiAgICAgIHZlYzIkZy5zZXQob3V0LnVwcGVyQm91bmQsIE1hdGgubWF4KHIkMVswXSArIHJhZGl1cywgLXIkMVswXSArIHJhZGl1cyksIE1hdGgubWF4KHIkMVsxXSArIHJhZGl1cywgLXIkMVsxXSArIHJhZGl1cykpOwogICAgICB2ZWMyJGcuc2V0KG91dC5sb3dlckJvdW5kLCBNYXRoLm1pbihyJDFbMF0gLSByYWRpdXMsIC1yJDFbMF0gLSByYWRpdXMpLCBNYXRoLm1pbihyJDFbMV0gLSByYWRpdXMsIC1yJDFbMV0gLSByYWRpdXMpKTsgLy8gQWRkIG9mZnNldAoKICAgICAgdmVjMiRnLmFkZChvdXQubG93ZXJCb3VuZCwgb3V0Lmxvd2VyQm91bmQsIHBvc2l0aW9uKTsKICAgICAgdmVjMiRnLmFkZChvdXQudXBwZXJCb3VuZCwgb3V0LnVwcGVyQm91bmQsIHBvc2l0aW9uKTsKICAgIH07CgogICAgdmFyIGludGVyc2VjdENhcHN1bGVfaGl0UG9pbnRXb3JsZCA9IHZlYzIkZy5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RDYXBzdWxlX25vcm1hbCA9IHZlYzIkZy5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RDYXBzdWxlX2wwID0gdmVjMiRnLmNyZWF0ZSgpOwogICAgdmFyIGludGVyc2VjdENhcHN1bGVfbDEgPSB2ZWMyJGcuY3JlYXRlKCk7CiAgICB2YXIgaW50ZXJzZWN0Q2Fwc3VsZV91bml0X3kgPSB2ZWMyJGcuZnJvbVZhbHVlcygwLCAxKTsKICAgIC8qKgogICAgICogQG1ldGhvZCByYXljYXN0CiAgICAgKiBAcGFyYW0gIHtSYXljYXN0UmVzdWx0fSByZXN1bHQKICAgICAqIEBwYXJhbSAge1JheX0gcmF5CiAgICAgKiBAcGFyYW0gIHthcnJheX0gcG9zaXRpb24KICAgICAqIEBwYXJhbSAge251bWJlcn0gYW5nbGUKICAgICAqLwoKICAgIENhcHN1bGUucHJvdG90eXBlLnJheWNhc3QgPSBmdW5jdGlvbiAocmVzdWx0LCByYXksIHBvc2l0aW9uLCBhbmdsZSkgewogICAgICB2YXIgZnJvbSA9IHJheS5mcm9tOwogICAgICB2YXIgdG8gPSByYXkudG87CiAgICAgIHZhciBoaXRQb2ludFdvcmxkID0gaW50ZXJzZWN0Q2Fwc3VsZV9oaXRQb2ludFdvcmxkOwogICAgICB2YXIgbm9ybWFsID0gaW50ZXJzZWN0Q2Fwc3VsZV9ub3JtYWw7CiAgICAgIHZhciBsMCA9IGludGVyc2VjdENhcHN1bGVfbDA7CiAgICAgIHZhciBsMSA9IGludGVyc2VjdENhcHN1bGVfbDE7IC8vIFRoZSBzaWRlcwoKICAgICAgdmFyIGhhbGZMZW4gPSB0aGlzLmxlbmd0aCAvIDI7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykgewogICAgICAgIC8vIGdldCBzdGFydCBhbmQgZW5kIG9mIHRoZSBsaW5lCiAgICAgICAgdmFyIHkgPSB0aGlzLnJhZGl1cyAqIChpICogMiAtIDEpOwogICAgICAgIHZlYzIkZy5zZXQobDAsIC1oYWxmTGVuLCB5KTsKICAgICAgICB2ZWMyJGcuc2V0KGwxLCBoYWxmTGVuLCB5KTsKICAgICAgICB2ZWMyJGcudG9HbG9iYWxGcmFtZShsMCwgbDAsIHBvc2l0aW9uLCBhbmdsZSk7CiAgICAgICAgdmVjMiRnLnRvR2xvYmFsRnJhbWUobDEsIGwxLCBwb3NpdGlvbiwgYW5nbGUpOwogICAgICAgIHZhciBkZWx0YSA9IHZlYzIkZy5nZXRMaW5lU2VnbWVudHNJbnRlcnNlY3Rpb25GcmFjdGlvbihmcm9tLCB0bywgbDAsIGwxKTsKCiAgICAgICAgaWYgKGRlbHRhID49IDApIHsKICAgICAgICAgIHZlYzIkZy5yb3RhdGUobm9ybWFsLCBpbnRlcnNlY3RDYXBzdWxlX3VuaXRfeSwgYW5nbGUpOwogICAgICAgICAgdmVjMiRnLnNjYWxlKG5vcm1hbCwgbm9ybWFsLCBpICogMiAtIDEpOwogICAgICAgICAgcmF5LnJlcG9ydEludGVyc2VjdGlvbihyZXN1bHQsIGRlbHRhLCBub3JtYWwsIC0xKTsKCiAgICAgICAgICBpZiAocmVzdWx0LnNob3VsZFN0b3AocmF5KSkgewogICAgICAgICAgICByZXR1cm47CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IC8vIENpcmNsZXMKCgogICAgICB2YXIgZGlhZ29uYWxMZW5ndGhTcXVhcmVkID0gTWF0aC5wb3codGhpcy5yYWRpdXMsIDIpICsgTWF0aC5wb3coaGFsZkxlbiwgMik7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykgewogICAgICAgIHZlYzIkZy5zZXQobDAsIGhhbGZMZW4gKiAoaSAqIDIgLSAxKSwgMCk7CiAgICAgICAgdmVjMiRnLnRvR2xvYmFsRnJhbWUobDAsIGwwLCBwb3NpdGlvbiwgYW5nbGUpOwogICAgICAgIHZhciBhID0gTWF0aC5wb3codG9bMF0gLSBmcm9tWzBdLCAyKSArIE1hdGgucG93KHRvWzFdIC0gZnJvbVsxXSwgMik7CiAgICAgICAgdmFyIGIgPSAyICogKCh0b1swXSAtIGZyb21bMF0pICogKGZyb21bMF0gLSBsMFswXSkgKyAodG9bMV0gLSBmcm9tWzFdKSAqIChmcm9tWzFdIC0gbDBbMV0pKTsKICAgICAgICB2YXIgYyA9IE1hdGgucG93KGZyb21bMF0gLSBsMFswXSwgMikgKyBNYXRoLnBvdyhmcm9tWzFdIC0gbDBbMV0sIDIpIC0gTWF0aC5wb3codGhpcy5yYWRpdXMsIDIpOwogICAgICAgIHZhciBkZWx0YSA9IE1hdGgucG93KGIsIDIpIC0gNCAqIGEgKiBjOwoKICAgICAgICBpZiAoZGVsdGEgPCAwKSB7CiAgICAgICAgICAvLyBObyBpbnRlcnNlY3Rpb24KICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0gZWxzZSBpZiAoZGVsdGEgPT09IDApIHsKICAgICAgICAgIC8vIHNpbmdsZSBpbnRlcnNlY3Rpb24gcG9pbnQKICAgICAgICAgIHZlYzIkZy5sZXJwKGhpdFBvaW50V29ybGQsIGZyb20sIHRvLCBkZWx0YSk7CgogICAgICAgICAgaWYgKHZlYzIkZy5zcXVhcmVkRGlzdGFuY2UoaGl0UG9pbnRXb3JsZCwgcG9zaXRpb24pID4gZGlhZ29uYWxMZW5ndGhTcXVhcmVkKSB7CiAgICAgICAgICAgIHZlYzIkZy5zdWJ0cmFjdChub3JtYWwsIGhpdFBvaW50V29ybGQsIGwwKTsKICAgICAgICAgICAgdmVjMiRnLm5vcm1hbGl6ZShub3JtYWwsIG5vcm1hbCk7CiAgICAgICAgICAgIHJheS5yZXBvcnRJbnRlcnNlY3Rpb24ocmVzdWx0LCBkZWx0YSwgbm9ybWFsLCAtMSk7CgogICAgICAgICAgICBpZiAocmVzdWx0LnNob3VsZFN0b3AocmF5KSkgewogICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB2YXIgc3FydERlbHRhID0gTWF0aC5zcXJ0KGRlbHRhKTsKICAgICAgICAgIHZhciBpbnYyYSA9IDEgLyAoMiAqIGEpOwogICAgICAgICAgdmFyIGQxID0gKC1iIC0gc3FydERlbHRhKSAqIGludjJhOwogICAgICAgICAgdmFyIGQyID0gKC1iICsgc3FydERlbHRhKSAqIGludjJhOwoKICAgICAgICAgIGlmIChkMSA+PSAwICYmIGQxIDw9IDEpIHsKICAgICAgICAgICAgdmVjMiRnLmxlcnAoaGl0UG9pbnRXb3JsZCwgZnJvbSwgdG8sIGQxKTsKCiAgICAgICAgICAgIGlmICh2ZWMyJGcuc3F1YXJlZERpc3RhbmNlKGhpdFBvaW50V29ybGQsIHBvc2l0aW9uKSA+IGRpYWdvbmFsTGVuZ3RoU3F1YXJlZCkgewogICAgICAgICAgICAgIHZlYzIkZy5zdWJ0cmFjdChub3JtYWwsIGhpdFBvaW50V29ybGQsIGwwKTsKICAgICAgICAgICAgICB2ZWMyJGcubm9ybWFsaXplKG5vcm1hbCwgbm9ybWFsKTsKICAgICAgICAgICAgICByYXkucmVwb3J0SW50ZXJzZWN0aW9uKHJlc3VsdCwgZDEsIG5vcm1hbCwgLTEpOwoKICAgICAgICAgICAgICBpZiAocmVzdWx0LnNob3VsZFN0b3AocmF5KSkgewogICAgICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgfQoKICAgICAgICAgIGlmIChkMiA+PSAwICYmIGQyIDw9IDEpIHsKICAgICAgICAgICAgdmVjMiRnLmxlcnAoaGl0UG9pbnRXb3JsZCwgZnJvbSwgdG8sIGQyKTsKCiAgICAgICAgICAgIGlmICh2ZWMyJGcuc3F1YXJlZERpc3RhbmNlKGhpdFBvaW50V29ybGQsIHBvc2l0aW9uKSA+IGRpYWdvbmFsTGVuZ3RoU3F1YXJlZCkgewogICAgICAgICAgICAgIHZlYzIkZy5zdWJ0cmFjdChub3JtYWwsIGhpdFBvaW50V29ybGQsIGwwKTsKICAgICAgICAgICAgICB2ZWMyJGcubm9ybWFsaXplKG5vcm1hbCwgbm9ybWFsKTsKICAgICAgICAgICAgICByYXkucmVwb3J0SW50ZXJzZWN0aW9uKHJlc3VsdCwgZDIsIG5vcm1hbCwgLTEpOwoKICAgICAgICAgICAgICBpZiAocmVzdWx0LnNob3VsZFN0b3AocmF5KSkgewogICAgICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgfTsKCiAgICBDYXBzdWxlLnByb3RvdHlwZS5wb2ludFRlc3QgPSBmdW5jdGlvbiAobG9jYWxQb2ludCkgewogICAgICB2YXIgcmFkaXVzID0gdGhpcy5yYWRpdXM7CiAgICAgIHZhciBoYWxmTGVuZ3RoID0gdGhpcy5sZW5ndGggKiAwLjU7CgogICAgICBpZiAoTWF0aC5hYnMobG9jYWxQb2ludFswXSkgPD0gaGFsZkxlbmd0aCAmJiBNYXRoLmFicyhsb2NhbFBvaW50WzFdKSA8PSByYWRpdXMpIHsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgfQoKICAgICAgaWYgKE1hdGgucG93KGxvY2FsUG9pbnRbMF0gLSBoYWxmTGVuZ3RoLCAyKSArIE1hdGgucG93KGxvY2FsUG9pbnRbMV0sIDIpIDw9IHJhZGl1cyAqIHJhZGl1cykgewogICAgICAgIHJldHVybiB0cnVlOwogICAgICB9CgogICAgICBpZiAoTWF0aC5wb3cobG9jYWxQb2ludFswXSArIGhhbGZMZW5ndGgsIDIpICsgTWF0aC5wb3cobG9jYWxQb2ludFsxXSwgMikgPD0gcmFkaXVzICogcmFkaXVzKSB7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgIH0KCiAgICAgIHJldHVybiBmYWxzZTsKICAgIH07CgogICAgdmFyIFNoYXBlJDcgPSBTaGFwZV8xLAogICAgICAgIHZlYzIkZiA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIHNoYWxsb3dDbG9uZSQ0ID0gVXRpbHNfMS5zaGFsbG93Q2xvbmU7CgogICAgdmFyIENpcmNsZV8xID0gQ2lyY2xlJDE7CiAgICAvKioKICAgICAqIENpcmNsZSBzaGFwZSBjbGFzcy4KICAgICAqIEBjbGFzcyBDaXJjbGUKICAgICAqIEBleHRlbmRzIFNoYXBlCiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBwYXJhbSB7b3B0aW9uc30gW29wdGlvbnNdIChOb3RlIHRoYXQgdGhpcyBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUge3sjY3Jvc3NMaW5rICJTaGFwZSJ9fXt7L2Nyb3NzTGlua319IGNvbnN0cnVjdG9yLikKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5yYWRpdXM9MV0gVGhlIHJhZGl1cyBvZiB0aGlzIGNpcmNsZQogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSk7CiAgICAgKiAgICAgdmFyIGNpcmNsZVNoYXBlID0gbmV3IENpcmNsZSh7CiAgICAgKiAgICAgICAgIHJhZGl1czogMQogICAgICogICAgIH0pOwogICAgICogICAgIGJvZHkuYWRkU2hhcGUoY2lyY2xlU2hhcGUpOwogICAgICovCgogICAgZnVuY3Rpb24gQ2lyY2xlJDEob3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyA/IHNoYWxsb3dDbG9uZSQ0KG9wdGlvbnMpIDoge307CiAgICAgIC8qKgogICAgICAgKiBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGUuCiAgICAgICAqIEBwcm9wZXJ0eSByYWRpdXMKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLnJhZGl1cyA9IG9wdGlvbnMucmFkaXVzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnJhZGl1cyA6IDE7CiAgICAgIG9wdGlvbnMudHlwZSA9IFNoYXBlJDcuQ0lSQ0xFOwogICAgICBTaGFwZSQ3LmNhbGwodGhpcywgb3B0aW9ucyk7CiAgICB9CgogICAgQ2lyY2xlJDEucHJvdG90eXBlID0gbmV3IFNoYXBlJDcoKTsKICAgIENpcmNsZSQxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENpcmNsZSQxOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNvbXB1dGVNb21lbnRPZkluZXJ0aWEKICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAqLwoKICAgIENpcmNsZSQxLnByb3RvdHlwZS5jb21wdXRlTW9tZW50T2ZJbmVydGlhID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgciA9IHRoaXMucmFkaXVzOwogICAgICByZXR1cm4gciAqIHIgLyAyOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCB1cGRhdGVCb3VuZGluZ1JhZGl1cwogICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICovCgoKICAgIENpcmNsZSQxLnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ1JhZGl1cyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IHRoaXMucmFkaXVzOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCB1cGRhdGVBcmVhCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKi8KCgogICAgQ2lyY2xlJDEucHJvdG90eXBlLnVwZGF0ZUFyZWEgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHRoaXMuYXJlYSA9IE1hdGguUEkgKiB0aGlzLnJhZGl1cyAqIHRoaXMucmFkaXVzOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBjb21wdXRlQUFCQgogICAgICogQHBhcmFtICB7QUFCQn0gICBvdXQgICAgICBUaGUgcmVzdWx0aW5nIEFBQkIuCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gIHBvc2l0aW9uCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGFuZ2xlCiAgICAgKi8KCgogICAgQ2lyY2xlJDEucHJvdG90eXBlLmNvbXB1dGVBQUJCID0gZnVuY3Rpb24gKG91dCwgcG9zaXRpb24KICAgIC8qLCBhbmdsZSovCiAgICApIHsKICAgICAgdmFyIHIgPSB0aGlzLnJhZGl1czsKICAgICAgdmVjMiRmLnNldChvdXQudXBwZXJCb3VuZCwgciwgcik7CiAgICAgIHZlYzIkZi5zZXQob3V0Lmxvd2VyQm91bmQsIC1yLCAtcik7CgogICAgICBpZiAocG9zaXRpb24pIHsKICAgICAgICB2ZWMyJGYuYWRkKG91dC5sb3dlckJvdW5kLCBvdXQubG93ZXJCb3VuZCwgcG9zaXRpb24pOwogICAgICAgIHZlYzIkZi5hZGQob3V0LnVwcGVyQm91bmQsIG91dC51cHBlckJvdW5kLCBwb3NpdGlvbik7CiAgICAgIH0KICAgIH07CgogICAgdmFyIFJheV9pbnRlcnNlY3RTcGhlcmVfaW50ZXJzZWN0aW9uUG9pbnQgPSB2ZWMyJGYuY3JlYXRlKCk7CiAgICB2YXIgUmF5X2ludGVyc2VjdFNwaGVyZV9ub3JtYWwgPSB2ZWMyJGYuY3JlYXRlKCk7CiAgICAvKioKICAgICAqIEBtZXRob2QgcmF5Y2FzdAogICAgICogQHBhcmFtICB7UmF5Y2FzdFJlc3VsdH0gcmVzdWx0CiAgICAgKiBAcGFyYW0gIHtSYXl9IHJheQogICAgICogQHBhcmFtICB7YXJyYXl9IHBvc2l0aW9uCiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGFuZ2xlCiAgICAgKi8KCiAgICBDaXJjbGUkMS5wcm90b3R5cGUucmF5Y2FzdCA9IGZ1bmN0aW9uIChyZXN1bHQsIHJheSwgcG9zaXRpb24KICAgIC8qLCBhbmdsZSovCiAgICApIHsKICAgICAgdmFyIGZyb20gPSByYXkuZnJvbSwKICAgICAgICAgIHRvID0gcmF5LnRvLAogICAgICAgICAgciA9IHRoaXMucmFkaXVzOwogICAgICB2YXIgYSA9IE1hdGgucG93KHRvWzBdIC0gZnJvbVswXSwgMikgKyBNYXRoLnBvdyh0b1sxXSAtIGZyb21bMV0sIDIpOwogICAgICB2YXIgYiA9IDIgKiAoKHRvWzBdIC0gZnJvbVswXSkgKiAoZnJvbVswXSAtIHBvc2l0aW9uWzBdKSArICh0b1sxXSAtIGZyb21bMV0pICogKGZyb21bMV0gLSBwb3NpdGlvblsxXSkpOwogICAgICB2YXIgYyA9IE1hdGgucG93KGZyb21bMF0gLSBwb3NpdGlvblswXSwgMikgKyBNYXRoLnBvdyhmcm9tWzFdIC0gcG9zaXRpb25bMV0sIDIpIC0gTWF0aC5wb3cociwgMik7CiAgICAgIHZhciBkZWx0YSA9IE1hdGgucG93KGIsIDIpIC0gNCAqIGEgKiBjOwogICAgICB2YXIgaW50ZXJzZWN0aW9uUG9pbnQgPSBSYXlfaW50ZXJzZWN0U3BoZXJlX2ludGVyc2VjdGlvblBvaW50OwogICAgICB2YXIgbm9ybWFsID0gUmF5X2ludGVyc2VjdFNwaGVyZV9ub3JtYWw7CgogICAgICBpZiAoZGVsdGEgPCAwKSB7CiAgICAgICAgLy8gTm8gaW50ZXJzZWN0aW9uCiAgICAgICAgcmV0dXJuOwogICAgICB9IGVsc2UgaWYgKGRlbHRhID09PSAwKSB7CiAgICAgICAgLy8gc2luZ2xlIGludGVyc2VjdGlvbiBwb2ludAogICAgICAgIHZlYzIkZi5sZXJwKGludGVyc2VjdGlvblBvaW50LCBmcm9tLCB0bywgZGVsdGEpOwogICAgICAgIHZlYzIkZi5zdWJ0cmFjdChub3JtYWwsIGludGVyc2VjdGlvblBvaW50LCBwb3NpdGlvbik7CiAgICAgICAgdmVjMiRmLm5vcm1hbGl6ZShub3JtYWwsIG5vcm1hbCk7CiAgICAgICAgcmF5LnJlcG9ydEludGVyc2VjdGlvbihyZXN1bHQsIGRlbHRhLCBub3JtYWwsIC0xKTsKICAgICAgfSBlbHNlIHsKICAgICAgICB2YXIgc3FydERlbHRhID0gTWF0aC5zcXJ0KGRlbHRhKTsKICAgICAgICB2YXIgaW52MmEgPSAxIC8gKDIgKiBhKTsKICAgICAgICB2YXIgZDEgPSAoLWIgLSBzcXJ0RGVsdGEpICogaW52MmE7CiAgICAgICAgdmFyIGQyID0gKC1iICsgc3FydERlbHRhKSAqIGludjJhOwoKICAgICAgICBpZiAoZDEgPj0gMCAmJiBkMSA8PSAxKSB7CiAgICAgICAgICB2ZWMyJGYubGVycChpbnRlcnNlY3Rpb25Qb2ludCwgZnJvbSwgdG8sIGQxKTsKICAgICAgICAgIHZlYzIkZi5zdWJ0cmFjdChub3JtYWwsIGludGVyc2VjdGlvblBvaW50LCBwb3NpdGlvbik7CiAgICAgICAgICB2ZWMyJGYubm9ybWFsaXplKG5vcm1hbCwgbm9ybWFsKTsKICAgICAgICAgIHJheS5yZXBvcnRJbnRlcnNlY3Rpb24ocmVzdWx0LCBkMSwgbm9ybWFsLCAtMSk7CgogICAgICAgICAgaWYgKHJlc3VsdC5zaG91bGRTdG9wKHJheSkpIHsKICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgaWYgKGQyID49IDAgJiYgZDIgPD0gMSkgewogICAgICAgICAgdmVjMiRmLmxlcnAoaW50ZXJzZWN0aW9uUG9pbnQsIGZyb20sIHRvLCBkMik7CiAgICAgICAgICB2ZWMyJGYuc3VidHJhY3Qobm9ybWFsLCBpbnRlcnNlY3Rpb25Qb2ludCwgcG9zaXRpb24pOwogICAgICAgICAgdmVjMiRmLm5vcm1hbGl6ZShub3JtYWwsIG5vcm1hbCk7CiAgICAgICAgICByYXkucmVwb3J0SW50ZXJzZWN0aW9uKHJlc3VsdCwgZDIsIG5vcm1hbCwgLTEpOwogICAgICAgIH0KICAgICAgfQogICAgfTsKCiAgICBDaXJjbGUkMS5wcm90b3R5cGUucG9pbnRUZXN0ID0gZnVuY3Rpb24gKGxvY2FsUG9pbnQpIHsKICAgICAgdmFyIHJhZGl1cyA9IHRoaXMucmFkaXVzOwogICAgICByZXR1cm4gdmVjMiRmLnNxdWFyZWRMZW5ndGgobG9jYWxQb2ludCkgPD0gcmFkaXVzICogcmFkaXVzOwogICAgfTsKCiAgICB2YXIgQ29uc3RyYWludF8xID0gQ29uc3RyYWludCQ2OwogICAgLyoqCiAgICAgKiBCYXNlIGNvbnN0cmFpbnQgY2xhc3MuCiAgICAgKgogICAgICogQGNsYXNzIENvbnN0cmFpbnQKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGF1dGhvciBzY2h0ZXBwZQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUKICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5jb2xsaWRlQ29ubmVjdGVkPXRydWVdCiAgICAgKi8KCiAgICBmdW5jdGlvbiBDb25zdHJhaW50JDYoYm9keUEsIGJvZHlCLCB0eXBlLCBvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICAvKioKICAgICAgICogVGhlIHR5cGUgb2YgY29uc3RyYWludC4gTWF5IGJlIG9uZSBvZiBDb25zdHJhaW50LkRJU1RBTkNFLCBDb25zdHJhaW50LkdFQVIsIENvbnN0cmFpbnQuTE9DSywgQ29uc3RyYWludC5QUklTTUFUSUMgb3IgQ29uc3RyYWludC5SRVZPTFVURS4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHR5cGUKICAgICAgICovCgogICAgICB0aGlzLnR5cGUgPSB0eXBlOwogICAgICAvKioKICAgICAgICogRXF1YXRpb25zIHRvIGJlIHNvbHZlZCBpbiB0aGlzIGNvbnN0cmFpbnQKICAgICAgICoKICAgICAgICogQHByb3BlcnR5IGVxdWF0aW9ucwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5lcXVhdGlvbnMgPSBbXTsKICAgICAgLyoqCiAgICAgICAqIEZpcnN0IGJvZHkgcGFydGljaXBhdGluZyBpbiB0aGUgY29uc3RyYWludC4KICAgICAgICogQHByb3BlcnR5IGJvZHlBCiAgICAgICAqIEB0eXBlIHtCb2R5fQogICAgICAgKi8KCiAgICAgIHRoaXMuYm9keUEgPSBib2R5QTsKICAgICAgLyoqCiAgICAgICAqIFNlY29uZCBib2R5IHBhcnRpY2lwYXRpbmcgaW4gdGhlIGNvbnN0cmFpbnQuCiAgICAgICAqIEBwcm9wZXJ0eSBib2R5QgogICAgICAgKiBAdHlwZSB7Qm9keX0KICAgICAgICovCgogICAgICB0aGlzLmJvZHlCID0gYm9keUI7CiAgICAgIC8qKgogICAgICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0aGUgY29ubmVjdGVkIGJvZGllcyB0byBjb2xsaWRlLgogICAgICAgKiBAcHJvcGVydHkgY29sbGlkZUNvbm5lY3RlZAogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICogQGRlZmF1bHQgdHJ1ZQogICAgICAgKi8KCiAgICAgIHRoaXMuY29sbGlkZUNvbm5lY3RlZCA9IG9wdGlvbnMuY29sbGlkZUNvbm5lY3RlZCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb2xsaWRlQ29ubmVjdGVkIDogdHJ1ZTsgLy8gV2FrZSB1cCBib2RpZXMgd2hlbiBjb25uZWN0ZWQKCiAgICAgIGlmIChvcHRpb25zLndha2VVcEJvZGllcyAhPT0gZmFsc2UpIHsKICAgICAgICBpZiAoYm9keUEpIHsKICAgICAgICAgIGJvZHlBLndha2VVcCgpOwogICAgICAgIH0KCiAgICAgICAgaWYgKGJvZHlCKSB7CiAgICAgICAgICBib2R5Qi53YWtlVXAoKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlcyB0aGUgaW50ZXJuYWwgY29uc3RyYWludCBwYXJhbWV0ZXJzIGJlZm9yZSBzb2x2ZS4KICAgICAqIEBtZXRob2QgdXBkYXRlCiAgICAgKi8KCgogICAgQ29uc3RyYWludCQ2LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcigibWV0aG9kIHVwZGF0ZSgpIG5vdCBpbXBsbWVtZW50ZWQgaW4gdGhpcyBDb25zdHJhaW50IHN1YmNsYXNzISIpOwogICAgfTsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtudW1iZXJ9IERJU1RBTkNFCiAgICAgKi8KCgogICAgQ29uc3RyYWludCQ2LkRJU1RBTkNFID0gMTsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEdFQVIKICAgICAqLwoKICAgIENvbnN0cmFpbnQkNi5HRUFSID0gMjsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExPQ0sKICAgICAqLwoKICAgIENvbnN0cmFpbnQkNi5MT0NLID0gMzsKICAgIC8qKgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFBSSVNNQVRJQwogICAgICovCgogICAgQ29uc3RyYWludCQ2LlBSSVNNQVRJQyA9IDQ7CiAgICAvKioKICAgICAqIEBzdGF0aWMKICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBSRVZPTFVURQogICAgICovCgogICAgQ29uc3RyYWludCQ2LlJFVk9MVVRFID0gNTsKICAgIC8qKgogICAgICogU2V0IHN0aWZmbmVzcyBmb3IgdGhpcyBjb25zdHJhaW50LgogICAgICogQG1ldGhvZCBzZXRTdGlmZm5lc3MKICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGlmZm5lc3MKICAgICAqLwoKICAgIENvbnN0cmFpbnQkNi5wcm90b3R5cGUuc2V0U3RpZmZuZXNzID0gZnVuY3Rpb24gKHN0aWZmbmVzcykgewogICAgICB2YXIgZXFzID0gdGhpcy5lcXVhdGlvbnM7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gZXFzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIGVxID0gZXFzW2ldOwogICAgICAgIGVxLnN0aWZmbmVzcyA9IHN0aWZmbmVzczsKICAgICAgICBlcS5uZWVkc1VwZGF0ZSA9IHRydWU7CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIFNldCByZWxheGF0aW9uIGZvciB0aGlzIGNvbnN0cmFpbnQuCiAgICAgKiBAbWV0aG9kIHNldFJlbGF4YXRpb24KICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZWxheGF0aW9uCiAgICAgKi8KCgogICAgQ29uc3RyYWludCQ2LnByb3RvdHlwZS5zZXRSZWxheGF0aW9uID0gZnVuY3Rpb24gKHJlbGF4YXRpb24pIHsKICAgICAgdmFyIGVxcyA9IHRoaXMuZXF1YXRpb25zOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IGVxcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciBlcSA9IGVxc1tpXTsKICAgICAgICBlcS5yZWxheGF0aW9uID0gcmVsYXhhdGlvbjsKICAgICAgICBlcS5uZWVkc1VwZGF0ZSA9IHRydWU7CiAgICAgIH0KICAgIH07CiAgICAvKioKICAgICAqIEBtZXRob2Qgc2V0TWF4QmlhcwogICAgICogQHBhcmFtIHtOdW1iZXJ9IG1heEJpYXMKICAgICAqLwoKCiAgICBDb25zdHJhaW50JDYucHJvdG90eXBlLnNldE1heEJpYXMgPSBmdW5jdGlvbiAobWF4QmlhcykgewogICAgICB2YXIgZXFzID0gdGhpcy5lcXVhdGlvbnM7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gZXFzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIGVxID0gZXFzW2ldOwogICAgICAgIGVxLm1heEJpYXMgPSBtYXhCaWFzOwogICAgICB9CiAgICB9OwoKICAgIHZhciBFcXVhdGlvbiQ4ID0gRXF1YXRpb25fMSwKICAgICAgICB2ZWMyJGUgPSB2ZWMyJHEuZXhwb3J0czsKCiAgICB2YXIgQ29udGFjdEVxdWF0aW9uXzEgPSBDb250YWN0RXF1YXRpb24kMjsKICAgIC8qKgogICAgICogTm9uLXBlbmV0cmF0aW9uIGNvbnN0cmFpbnQgZXF1YXRpb24uIFRyaWVzIHRvIG1ha2UgdGhlIGNvbnRhY3RQb2ludEEgYW5kIGNvbnRhY3RQb2ludEIgdmVjdG9ycyBjb2luY2lkZSwgd2hpbGUga2VlcGluZyB0aGUgYXBwbGllZCBmb3JjZSByZXB1bHNpdmUuCiAgICAgKgogICAgICogQGNsYXNzIENvbnRhY3RFcXVhdGlvbgogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAZXh0ZW5kcyBFcXVhdGlvbgogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICovCgogICAgZnVuY3Rpb24gQ29udGFjdEVxdWF0aW9uJDIoYm9keUEsIGJvZHlCKSB7CiAgICAgIEVxdWF0aW9uJDguY2FsbCh0aGlzLCBib2R5QSwgYm9keUIsIDAsIE51bWJlci5NQVhfVkFMVUUpOwogICAgICAvKioKICAgICAgICogVmVjdG9yIGZyb20gYm9keSBpIGNlbnRlciBvZiBtYXNzIHRvIHRoZSBjb250YWN0IHBvaW50LgogICAgICAgKiBAcHJvcGVydHkgY29udGFjdFBvaW50QQogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5jb250YWN0UG9pbnRBID0gdmVjMiRlLmNyZWF0ZSgpOwogICAgICB0aGlzLnBlbmV0cmF0aW9uVmVjID0gdmVjMiRlLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogV29ybGQtb3JpZW50ZWQgdmVjdG9yIGZyb20gYm9keSBBIGNlbnRlciBvZiBtYXNzIHRvIHRoZSBjb250YWN0IHBvaW50LgogICAgICAgKiBAcHJvcGVydHkgY29udGFjdFBvaW50QgogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5jb250YWN0UG9pbnRCID0gdmVjMiRlLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogVGhlIG5vcm1hbCB2ZWN0b3IsIHBvaW50aW5nIG91dCBvZiBib2R5IGkKICAgICAgICogQHByb3BlcnR5IG5vcm1hbEEKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMubm9ybWFsQSA9IHZlYzIkZS5jcmVhdGUoKTsKICAgICAgLyoqCiAgICAgICAqIFRoZSByZXN0aXR1dGlvbiB0byB1c2UgKDA9bm8gYm91bmNpbmVzcywgMT1tYXggYm91bmNpbmVzcykuCiAgICAgICAqIEBwcm9wZXJ0eSByZXN0aXR1dGlvbgogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMucmVzdGl0dXRpb24gPSAwOwogICAgICAvKioKICAgICAgICogVGhpcyBwcm9wZXJ0eSBpcyBzZXQgdG8gdHJ1ZSBpZiB0aGlzIGlzIHRoZSBmaXJzdCBpbXBhY3QgYmV0d2VlbiB0aGUgYm9kaWVzIChub3QgcGVyc2lzdGFudCBjb250YWN0KS4KICAgICAgICogQHByb3BlcnR5IGZpcnN0SW1wYWN0CiAgICAgICAqIEB0eXBlIHtCb29sZWFufQogICAgICAgKiBAcmVhZE9ubHkKICAgICAgICovCgogICAgICB0aGlzLmZpcnN0SW1wYWN0ID0gZmFsc2U7CiAgICAgIC8qKgogICAgICAgKiBUaGUgc2hhcGUgaW4gYm9keSBpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgY29udGFjdC4KICAgICAgICogQHByb3BlcnR5IHNoYXBlQQogICAgICAgKiBAdHlwZSB7U2hhcGV9CiAgICAgICAqLwoKICAgICAgdGhpcy5zaGFwZUEgPSBudWxsOwogICAgICAvKioKICAgICAgICogVGhlIHNoYXBlIGluIGJvZHkgaiB0aGF0IHRyaWdnZXJlZCB0aGlzIGNvbnRhY3QuCiAgICAgICAqIEBwcm9wZXJ0eSBzaGFwZUIKICAgICAgICogQHR5cGUge1NoYXBlfQogICAgICAgKi8KCiAgICAgIHRoaXMuc2hhcGVCID0gbnVsbDsKICAgIH0KCiAgICBDb250YWN0RXF1YXRpb24kMi5wcm90b3R5cGUgPSBuZXcgRXF1YXRpb24kOCgpOwogICAgQ29udGFjdEVxdWF0aW9uJDIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29udGFjdEVxdWF0aW9uJDI7CgogICAgQ29udGFjdEVxdWF0aW9uJDIucHJvdG90eXBlLmNvbXB1dGVCID0gZnVuY3Rpb24gKGEsIGIsIGgpIHsKICAgICAgdmFyIGJpID0gdGhpcy5ib2R5QSwKICAgICAgICAgIGJqID0gdGhpcy5ib2R5QiwKICAgICAgICAgIHJpID0gdGhpcy5jb250YWN0UG9pbnRBLAogICAgICAgICAgcmogPSB0aGlzLmNvbnRhY3RQb2ludEIsCiAgICAgICAgICB4aSA9IGJpLnBvc2l0aW9uLAogICAgICAgICAgeGogPSBiai5wb3NpdGlvbjsKICAgICAgdmFyIG4gPSB0aGlzLm5vcm1hbEEsCiAgICAgICAgICBHID0gdGhpcy5HOyAvLyBDYWx1Y2xhdGUgY3Jvc3MgcHJvZHVjdHMKCiAgICAgIHZhciByaXhuID0gdmVjMiRlLmNyb3NzTGVuZ3RoKHJpLCBuKSwKICAgICAgICAgIHJqeG4gPSB2ZWMyJGUuY3Jvc3NMZW5ndGgocmosIG4pOyAvLyBHID0gWy1uIC1yaXhuIG4gcmp4bl0KCiAgICAgIEdbMF0gPSAtblswXTsKICAgICAgR1sxXSA9IC1uWzFdOwogICAgICBHWzJdID0gLXJpeG47CiAgICAgIEdbM10gPSBuWzBdOwogICAgICBHWzRdID0gblsxXTsKICAgICAgR1s1XSA9IHJqeG47IC8vIENvbXB1dGUgaXRlcmF0aW9uCgogICAgICB2YXIgR1csIEdxOwoKICAgICAgaWYgKHRoaXMuZmlyc3RJbXBhY3QgJiYgdGhpcy5yZXN0aXR1dGlvbiAhPT0gMCkgewogICAgICAgIEdxID0gMDsKICAgICAgICBHVyA9IDEgLyBiICogKDEgKyB0aGlzLnJlc3RpdHV0aW9uKSAqIHRoaXMuY29tcHV0ZUdXKCk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgLy8gQ2FsY3VsYXRlIHEgPSB4aityaiAtKHhpK3JpKSBpLmUuIHRoZSBwZW5ldHJhdGlvbiB2ZWN0b3IKICAgICAgICB2YXIgcGVuZXRyYXRpb25WZWMgPSB0aGlzLnBlbmV0cmF0aW9uVmVjOwogICAgICAgIGFkZFN1YlN1YihwZW5ldHJhdGlvblZlYywgeGosIHJqLCB4aSwgcmkpOwogICAgICAgIEdxID0gdmVjMiRlLmRvdChuLCBwZW5ldHJhdGlvblZlYykgKyB0aGlzLm9mZnNldDsKICAgICAgICBHVyA9IHRoaXMuY29tcHV0ZUdXKCk7CiAgICAgIH0KCiAgICAgIHZhciBHaU1mID0gdGhpcy5jb21wdXRlR2lNZigpOwogICAgICB2YXIgQiA9IC1HcSAqIGEgLSBHVyAqIGIgLSBoICogR2lNZjsKICAgICAgcmV0dXJuIEI7CiAgICB9OwoKICAgIGZ1bmN0aW9uIGFkZFN1YlN1YihvdXQsIGEsIGIsIGMsIGQpIHsKICAgICAgb3V0WzBdID0gYVswXSArIGJbMF0gLSBjWzBdIC0gZFswXTsKICAgICAgb3V0WzFdID0gYVsxXSArIGJbMV0gLSBjWzFdIC0gZFsxXTsKICAgIH0KCiAgICB2YXIgdmkgPSB2ZWMyJGUuY3JlYXRlKCk7CiAgICB2YXIgdmogPSB2ZWMyJGUuY3JlYXRlKCk7CiAgICB2YXIgcmVsVmVsID0gdmVjMiRlLmNyZWF0ZSgpOwogICAgLyoqCiAgICAgKiBHZXQgdGhlIHJlbGF0aXZlIHZlbG9jaXR5IGFsb25nIHRoZSBub3JtYWwgdmVjdG9yLgogICAgICogQG1ldGhvZCBnZXRWZWxvY2l0eUFsb25nTm9ybWFsCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KCiAgICBDb250YWN0RXF1YXRpb24kMi5wcm90b3R5cGUuZ2V0VmVsb2NpdHlBbG9uZ05vcm1hbCA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5ib2R5QS5nZXRWZWxvY2l0eUF0UG9pbnQodmksIHRoaXMuY29udGFjdFBvaW50QSk7CiAgICAgIHRoaXMuYm9keUIuZ2V0VmVsb2NpdHlBdFBvaW50KHZqLCB0aGlzLmNvbnRhY3RQb2ludEIpOwogICAgICB2ZWMyJGUuc3VidHJhY3QocmVsVmVsLCB2aSwgdmopOwogICAgICByZXR1cm4gdmVjMiRlLmRvdCh0aGlzLm5vcm1hbEEsIHJlbFZlbCk7CiAgICB9OwoKICAgIHZhciBQb29sXzEgPSBQb29sJDM7CiAgICAvKioKICAgICAqIE9iamVjdCBwb29saW5nIHV0aWxpdHkuCiAgICAgKiBAY2xhc3MgUG9vbAogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKi8KCiAgICBmdW5jdGlvbiBQb29sJDMob3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IG9iamVjdHMKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMub2JqZWN0cyA9IFtdOwoKICAgICAgaWYgKG9wdGlvbnMuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgdGhpcy5yZXNpemUob3B0aW9ucy5zaXplKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBAbWV0aG9kIHJlc2l6ZQogICAgICogQHBhcmFtIHtudW1iZXJ9IHNpemUKICAgICAqIEByZXR1cm4ge1Bvb2x9IFNlbGYsIGZvciBjaGFpbmluZwogICAgICovCgoKICAgIFBvb2wkMy5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKHNpemUpIHsKICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm9iamVjdHM7CgogICAgICB3aGlsZSAob2JqZWN0cy5sZW5ndGggPiBzaXplKSB7CiAgICAgICAgb2JqZWN0cy5wb3AoKTsKICAgICAgfQoKICAgICAgd2hpbGUgKG9iamVjdHMubGVuZ3RoIDwgc2l6ZSkgewogICAgICAgIG9iamVjdHMucHVzaCh0aGlzLmNyZWF0ZSgpKTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgYW4gb2JqZWN0IGZyb20gdGhlIHBvb2wgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLgogICAgICogQG1ldGhvZCBnZXQKICAgICAqIEByZXR1cm4ge09iamVjdH0KICAgICAqLwoKCiAgICBQb29sJDMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm9iamVjdHM7CiAgICAgIHJldHVybiBvYmplY3RzLmxlbmd0aCA/IG9iamVjdHMucG9wKCkgOiB0aGlzLmNyZWF0ZSgpOwogICAgfTsKICAgIC8qKgogICAgICogQ2xlYW4gdXAgYW5kIHB1dCB0aGUgb2JqZWN0IGJhY2sgaW50byB0aGUgcG9vbCBmb3IgbGF0ZXIgdXNlLgogICAgICogQG1ldGhvZCByZWxlYXNlCiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0CiAgICAgKiBAcmV0dXJuIHtQb29sfSBTZWxmIGZvciBjaGFpbmluZwogICAgICovCgoKICAgIFBvb2wkMy5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uIChvYmplY3QpIHsKICAgICAgdGhpcy5kZXN0cm95KG9iamVjdCk7CiAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iamVjdCk7CiAgICAgIHJldHVybiB0aGlzOwogICAgfTsKCiAgICB2YXIgQ29udGFjdEVxdWF0aW9uJDEgPSBDb250YWN0RXF1YXRpb25fMTsKCiAgICB2YXIgUG9vbCQyID0gUG9vbF8xOwoKICAgIHZhciBDb250YWN0RXF1YXRpb25Qb29sXzEgPSBDb250YWN0RXF1YXRpb25Qb29sJDE7CiAgICAvKioKICAgICAqIEBjbGFzcwogICAgICovCgogICAgZnVuY3Rpb24gQ29udGFjdEVxdWF0aW9uUG9vbCQxKCkgewogICAgICBQb29sJDIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsKICAgIH0KCiAgICBDb250YWN0RXF1YXRpb25Qb29sJDEucHJvdG90eXBlID0gbmV3IFBvb2wkMigpOwogICAgQ29udGFjdEVxdWF0aW9uUG9vbCQxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbnRhY3RFcXVhdGlvblBvb2wkMTsKICAgIC8qKgogICAgICogQG1ldGhvZCBjcmVhdGUKICAgICAqIEByZXR1cm4ge0NvbnRhY3RFcXVhdGlvbn0KICAgICAqLwoKICAgIENvbnRhY3RFcXVhdGlvblBvb2wkMS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkgewogICAgICByZXR1cm4gbmV3IENvbnRhY3RFcXVhdGlvbiQxKCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGRlc3Ryb3kKICAgICAqIEBwYXJhbSB7Q29udGFjdEVxdWF0aW9ufSBlcXVhdGlvbgogICAgICogQHJldHVybiB7Q29udGFjdEVxdWF0aW9uUG9vbH0KICAgICAqLwoKCiAgICBDb250YWN0RXF1YXRpb25Qb29sJDEucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoZXF1YXRpb24pIHsKICAgICAgZXF1YXRpb24uYm9keUEgPSBlcXVhdGlvbi5ib2R5QiA9IG51bGw7CiAgICAgIHJldHVybiB0aGlzOwogICAgfTsKCiAgICB2YXIgTWF0ZXJpYWxfMSA9IE1hdGVyaWFsJDI7CiAgICAvKioKICAgICAqIERlZmluZXMgYSBwaHlzaWNzIG1hdGVyaWFsLiBUbyBiZSB1c2VkIHdpdGgge3sjY3Jvc3NMaW5rICJDb250YWN0TWF0ZXJpYWwifX17ey9jcm9zc0xpbmt9fS4KICAgICAqIEBjbGFzcyBNYXRlcmlhbAogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAYXV0aG9yIHNjaHRlcHBlCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIENyZWF0ZSBhIHdvb2RlbiBib3gKICAgICAqICAgICB2YXIgd29vZE1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCk7CiAgICAgKiAgICAgdmFyIGJveFNoYXBlID0gbmV3IEJveCh7CiAgICAgKiAgICAgICAgIG1hdGVyaWFsOiB3b29kTWF0ZXJpYWwKICAgICAqICAgICB9KTsKICAgICAqICAgICBib2R5LmFkZFNoYXBlKGJveFNoYXBlKTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIE1hdGVyaWFsJDIoKSB7CiAgICAgIC8qKgogICAgICAgKiBUaGUgbWF0ZXJpYWwgaWRlbnRpZmllci4gUmVhZCBvbmx5LgogICAgICAgKiBAcmVhZG9ubHkKICAgICAgICogQHByb3BlcnR5IGlkCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwogICAgICB0aGlzLmlkID0gTWF0ZXJpYWwkMi5pZENvdW50ZXIrKzsKICAgIH0KCiAgICBNYXRlcmlhbCQyLmlkQ291bnRlciA9IDA7CgogICAgdmFyIE1hdGVyaWFsJDEgPSBNYXRlcmlhbF8xOwoKICAgIHZhciBFcXVhdGlvbiQ3ID0gRXF1YXRpb25fMTsKCiAgICB2YXIgQ29udGFjdE1hdGVyaWFsXzEgPSBDb250YWN0TWF0ZXJpYWwkMTsKICAgIC8qKgogICAgICogRGVmaW5lcyB3aGF0IGhhcHBlbnMgd2hlbiB0d28gbWF0ZXJpYWxzIG1lZXQsIHN1Y2ggYXMgd2hhdCBmcmljdGlvbiBjb2VmZmljaWVudCB0byB1c2UuIFlvdSBjYW4gYWxzbyBzZXQgb3RoZXIgdGhpbmdzIHN1Y2ggYXMgcmVzdGl0dXRpb24sIHN1cmZhY2UgdmVsb2NpdHkgYW5kIGNvbnN0cmFpbnQgcGFyYW1ldGVycy4gQWxzbyBzZWUge3sjY3Jvc3NMaW5rICJNYXRlcmlhbCJ9fXt7L2Nyb3NzTGlua319LgogICAgICogQGNsYXNzIENvbnRhY3RNYXRlcmlhbAogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge01hdGVyaWFsfSBtYXRlcmlhbEEKICAgICAqIEBwYXJhbSB7TWF0ZXJpYWx9IG1hdGVyaWFsQgogICAgICogQHBhcmFtIHtPYmplY3R9ICAgW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge051bWJlcn0gICBbb3B0aW9ucy5mcmljdGlvbj0wLjNdICAgICAgIEZyaWN0aW9uIGNvZWZmaWNpZW50LgogICAgICogQHBhcmFtIHtOdW1iZXJ9ICAgW29wdGlvbnMuZnJpY3Rpb25SZWxheGF0aW9uXSBGcmljdGlvbkVxdWF0aW9uIHJlbGF4YXRpb24uCiAgICAgKiBAcGFyYW0ge051bWJlcn0gICBbb3B0aW9ucy5mcmljdGlvblN0aWZmbmVzc10gIEZyaWN0aW9uRXF1YXRpb24gc3RpZmZuZXNzLgogICAgICogQHBhcmFtIHtOdW1iZXJ9ICAgW29wdGlvbnMucmVsYXhhdGlvbl0gICAgICAgICBDb250YWN0RXF1YXRpb24gcmVsYXhhdGlvbi4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgIFtvcHRpb25zLnJlc3RpdHV0aW9uPTBdICAgICAgUmVzdGl0dXRpb24gY29lZmZpY2llbnQgYWthICJib3VuY2luZXNzIi4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgIFtvcHRpb25zLnN0aWZmbmVzc10gICAgICAgICAgQ29udGFjdEVxdWF0aW9uIHN0aWZmbmVzcy4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgIFtvcHRpb25zLnN1cmZhY2VWZWxvY2l0eT0wXSAgU3VyZmFjZSB2ZWxvY2l0eS4KICAgICAqIEBhdXRob3Igc2NodGVwcGUKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGljZSA9IG5ldyBNYXRlcmlhbCgpOwogICAgICogICAgIHZhciB3b29kID0gbmV3IE1hdGVyaWFsKCk7CiAgICAgKiAgICAgdmFyIGljZVdvb2RDb250YWN0TWF0ZXJpYWwgPSBuZXcgQ29udGFjdE1hdGVyaWFsKGljZSwgd29vZCwgewogICAgICogICAgICAgICBmcmljdGlvbjogMC4yLAogICAgICogICAgICAgICByZXN0aXR1dGlvbjogMC4zCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGljZVdvb2RDb250YWN0TWF0ZXJpYWwpOwogICAgICovCgogICAgZnVuY3Rpb24gQ29udGFjdE1hdGVyaWFsJDEobWF0ZXJpYWxBLCBtYXRlcmlhbEIsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CgogICAgICBpZiAoIShtYXRlcmlhbEEgaW5zdGFuY2VvZiBNYXRlcmlhbCQxKSB8fCAhKG1hdGVyaWFsQiBpbnN0YW5jZW9mIE1hdGVyaWFsJDEpKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJGaXJzdCB0d28gYXJndW1lbnRzIG11c3QgYmUgTWF0ZXJpYWwgaW5zdGFuY2VzLiIpOwogICAgICB9CiAgICAgIC8qKgogICAgICAgKiBUaGUgY29udGFjdCBtYXRlcmlhbCBpZGVudGlmaWVyLiBSZWFkIG9ubHkuCiAgICAgICAqIEByZWFkb25seQogICAgICAgKiBAcHJvcGVydHkgaWQKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgoKICAgICAgdGhpcy5pZCA9IENvbnRhY3RNYXRlcmlhbCQxLmlkQ291bnRlcisrOwogICAgICAvKioKICAgICAgICogRmlyc3QgbWF0ZXJpYWwgcGFydGljaXBhdGluZyBpbiB0aGUgY29udGFjdCBtYXRlcmlhbAogICAgICAgKiBAcHJvcGVydHkgbWF0ZXJpYWxBCiAgICAgICAqIEB0eXBlIHtNYXRlcmlhbH0KICAgICAgICovCgogICAgICB0aGlzLm1hdGVyaWFsQSA9IG1hdGVyaWFsQTsKICAgICAgLyoqCiAgICAgICAqIFNlY29uZCBtYXRlcmlhbCBwYXJ0aWNpcGF0aW5nIGluIHRoZSBjb250YWN0IG1hdGVyaWFsCiAgICAgICAqIEBwcm9wZXJ0eSBtYXRlcmlhbEIKICAgICAgICogQHR5cGUge01hdGVyaWFsfQogICAgICAgKi8KCiAgICAgIHRoaXMubWF0ZXJpYWxCID0gbWF0ZXJpYWxCOwogICAgICAvKioKICAgICAgICogRnJpY3Rpb24gY29lZmZpY2llbnQgdG8gdXNlIGluIHRoZSBjb250YWN0IG9mIHRoZXNlIHR3byBtYXRlcmlhbHMuIEZyaWN0aW9uID0gMCB3aWxsIG1ha2UgdGhlIGludm9sdmVkIG9iamVjdHMgc3VwZXIgc2xpcHBlcnksIGFuZCBmcmljdGlvbiA9IDEgd2lsbCBtYWtlIGl0IG11Y2ggbGVzcyBzbGlwcGVyeS4gQSBmcmljdGlvbiBjb2VmZmljaWVudCBsYXJnZXIgdGhhbiAxIHdpbGwgYWxsb3cgZm9yIHZlcnkgbGFyZ2UgZnJpY3Rpb24gZm9yY2VzLCB3aGljaCBjYW4gYmUgY29udmVuaWVudCBmb3IgcHJldmVudGluZyBjYXIgdGlyZXMgbm90IHNsaXAgb24gdGhlIGdyb3VuZC4KICAgICAgICogQHByb3BlcnR5IGZyaWN0aW9uCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqIEBkZWZhdWx0IDAuMwogICAgICAgKi8KCiAgICAgIHRoaXMuZnJpY3Rpb24gPSBvcHRpb25zLmZyaWN0aW9uICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmZyaWN0aW9uIDogMC4zOwogICAgICAvKioKICAgICAgICogUmVzdGl0dXRpb24sIG9yICJib3VuY2luZXNzIiB0byB1c2UgaW4gdGhlIGNvbnRhY3Qgb2YgdGhlc2UgdHdvIG1hdGVyaWFscy4gQSByZXN0aXR1dGlvbiBvZiAwIHdpbGwgbWFrZSBubyBib3VuY2UsIHdoaWxlIHJlc3RpdHV0aW9uPTEgd2lsbCBhcHByb3hpbWF0ZWx5IGJvdW5jZSBiYWNrIHdpdGggdGhlIHNhbWUgdmVsb2NpdHkgdGhlIG9iamVjdCBjYW1lIHdpdGguCiAgICAgICAqIEBwcm9wZXJ0eSByZXN0aXR1dGlvbgogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKiBAZGVmYXVsdCAwCiAgICAgICAqLwoKICAgICAgdGhpcy5yZXN0aXR1dGlvbiA9IG9wdGlvbnMucmVzdGl0dXRpb24gIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucmVzdGl0dXRpb24gOiAwOwogICAgICAvKioKICAgICAgICogSGFyZG5lc3Mgb2YgdGhlIGNvbnRhY3QuIExlc3Mgc3RpZmZuZXNzIHdpbGwgbWFrZSB0aGUgb2JqZWN0cyBwZW5ldHJhdGUgbW9yZSwgYW5kIHdpbGwgbWFrZSB0aGUgY29udGFjdCBhY3QgbW9yZSBsaWtlIGEgc3ByaW5nIHRoYW4gYSBjb250YWN0IGZvcmNlLiBEZWZhdWx0IHZhbHVlIGlzIHt7I2Nyb3NzTGluayAiRXF1YXRpb24vREVGQVVMVF9TVElGRk5FU1M6cHJvcGVydHkifX1FcXVhdGlvbi5ERUZBVUxUX1NUSUZGTkVTU3t7L2Nyb3NzTGlua319LgogICAgICAgKiBAcHJvcGVydHkgc3RpZmZuZXNzCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5zdGlmZm5lc3MgPSBvcHRpb25zLnN0aWZmbmVzcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5zdGlmZm5lc3MgOiBFcXVhdGlvbiQ3LkRFRkFVTFRfU1RJRkZORVNTOwogICAgICAvKioKICAgICAgICogUmVsYXhhdGlvbiBvZiB0aGUgcmVzdWx0aW5nIENvbnRhY3RFcXVhdGlvbiB0aGF0IHRoaXMgQ29udGFjdE1hdGVyaWFsIGdlbmVyYXRlLiBEZWZhdWx0IHZhbHVlIGlzIHt7I2Nyb3NzTGluayAiRXF1YXRpb24vREVGQVVMVF9SRUxBWEFUSU9OOnByb3BlcnR5In19RXF1YXRpb24uREVGQVVMVF9SRUxBWEFUSU9Oe3svY3Jvc3NMaW5rfX0uCiAgICAgICAqIEBwcm9wZXJ0eSByZWxheGF0aW9uCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5yZWxheGF0aW9uID0gb3B0aW9ucy5yZWxheGF0aW9uICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnJlbGF4YXRpb24gOiBFcXVhdGlvbiQ3LkRFRkFVTFRfUkVMQVhBVElPTjsKICAgICAgLyoqCiAgICAgICAqIFN0aWZmbmVzcyBvZiB0aGUgcmVzdWx0aW5nIGZyaWN0aW9uIGZvcmNlLiBGb3IgbW9zdCBjYXNlcywgdGhlIHZhbHVlIG9mIHRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGEgbGFyZ2UgbnVtYmVyLiBJIGNhbm5vdCB0aGluayBvZiBhbnkgY2FzZSB3aGVyZSB5b3Ugd291bGQgd2FudCBsZXNzIGZyaWN0aW9uU3RpZmZuZXNzLiBEZWZhdWx0IHZhbHVlIGlzIHt7I2Nyb3NzTGluayAiRXF1YXRpb24vREVGQVVMVF9TVElGRk5FU1M6cHJvcGVydHkifX1FcXVhdGlvbi5ERUZBVUxUX1NUSUZGTkVTU3t7L2Nyb3NzTGlua319LgogICAgICAgKiBAcHJvcGVydHkgZnJpY3Rpb25TdGlmZm5lc3MKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmZyaWN0aW9uU3RpZmZuZXNzID0gb3B0aW9ucy5mcmljdGlvblN0aWZmbmVzcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5mcmljdGlvblN0aWZmbmVzcyA6IEVxdWF0aW9uJDcuREVGQVVMVF9TVElGRk5FU1M7CiAgICAgIC8qKgogICAgICAgKiBSZWxheGF0aW9uIG9mIHRoZSByZXN1bHRpbmcgZnJpY3Rpb24gZm9yY2UuIFRoZSBkZWZhdWx0IHZhbHVlIHNob3VsZCBiZSBnb29kIGZvciBtb3N0IHNpbXVsYXRpb25zLiBEZWZhdWx0IHZhbHVlIGlzIHt7I2Nyb3NzTGluayAiRXF1YXRpb24vREVGQVVMVF9SRUxBWEFUSU9OOnByb3BlcnR5In19RXF1YXRpb24uREVGQVVMVF9SRUxBWEFUSU9Oe3svY3Jvc3NMaW5rfX0uCiAgICAgICAqIEBwcm9wZXJ0eSBmcmljdGlvblJlbGF4YXRpb24KICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmZyaWN0aW9uUmVsYXhhdGlvbiA9IG9wdGlvbnMuZnJpY3Rpb25SZWxheGF0aW9uICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmZyaWN0aW9uUmVsYXhhdGlvbiA6IEVxdWF0aW9uJDcuREVGQVVMVF9SRUxBWEFUSU9OOwogICAgICAvKioKICAgICAgICogV2lsbCBhZGQgc3VyZmFjZSB2ZWxvY2l0eSB0byB0aGlzIG1hdGVyaWFsLiBJZiBib2R5QSByZXN0cyBvbiB0b3AgaWYgYm9keUIsIGFuZCB0aGUgc3VyZmFjZSB2ZWxvY2l0eSBpcyBwb3NpdGl2ZSwgYm9keUEgd2lsbCBzbGlkZSB0byB0aGUgcmlnaHQuCiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzdXJmYWNlVmVsb2NpdHkKICAgICAgICogQGRlZmF1bHQgMAogICAgICAgKi8KCiAgICAgIHRoaXMuc3VyZmFjZVZlbG9jaXR5ID0gb3B0aW9ucy5zdXJmYWNlVmVsb2NpdHkgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuc3VyZmFjZVZlbG9jaXR5IDogMDsKICAgICAgLyoqCiAgICAgICAqIE9mZnNldCB0byBiZSBzZXQgb24gQ29udGFjdEVxdWF0aW9ucy4gQSBwb3NpdGl2ZSB2YWx1ZSB3aWxsIG1ha2UgdGhlIGJvZGllcyBwZW5ldHJhdGUgbW9yZSBpbnRvIGVhY2ggb3RoZXIuIENhbiBiZSB1c2VmdWwgaW4gc2NlbmVzIHdoZXJlIGNvbnRhY3RzIG5lZWQgdG8gYmUgbW9yZSBwZXJzaXN0ZW50LCBmb3IgZXhhbXBsZSB3aGVuIHN0YWNraW5nLiBBa2EgImN1cmUgZm9yIG5lcnZvdXMgY29udGFjdHMiLgogICAgICAgKiBAcHJvcGVydHkgY29udGFjdFNraW5TaXplCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5jb250YWN0U2tpblNpemUgPSAwLjAwNTsKICAgIH0KCiAgICBDb250YWN0TWF0ZXJpYWwkMS5pZENvdW50ZXIgPSAwOwoKICAgIHZhciBDb25zdHJhaW50JDUgPSBDb25zdHJhaW50XzEsCiAgICAgICAgRXF1YXRpb24kNiA9IEVxdWF0aW9uXzEsCiAgICAgICAgdmVjMiRkID0gdmVjMiRxLmV4cG9ydHM7CgogICAgdmFyIERpc3RhbmNlQ29uc3RyYWludF8xID0gRGlzdGFuY2VDb25zdHJhaW50OwogICAgLyoqCiAgICAgKiBDb25zdHJhaW50IHRoYXQgdHJpZXMgdG8ga2VlcCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gYm9kaWVzIGNvbnN0YW50LgogICAgICoKICAgICAqIEBjbGFzcyBEaXN0YW5jZUNvbnN0cmFpbnQKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGF1dGhvciBzY2h0ZXBwZQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXQogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmRpc3RhbmNlXSBUaGUgZGlzdGFuY2UgdG8ga2VlcCBiZXR3ZWVuIHRoZSBhbmNob3IgcG9pbnRzLiBEZWZhdWx0cyB0byB0aGUgY3VycmVudCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBib2RpZXMuCiAgICAgKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5sb2NhbEFuY2hvckFdIFRoZSBhbmNob3IgcG9pbnQgZm9yIGJvZHlBLCBkZWZpbmVkIGxvY2FsbHkgaW4gYm9keUEgZnJhbWUuIERlZmF1bHRzIHRvIFswLDBdLgogICAgICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMubG9jYWxBbmNob3JCXSBUaGUgYW5jaG9yIHBvaW50IGZvciBib2R5QiwgZGVmaW5lZCBsb2NhbGx5IGluIGJvZHlCIGZyYW1lLiBEZWZhdWx0cyB0byBbMCwwXS4KICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5tYXhGb3JjZT1OdW1iZXIuTUFYX1ZBTFVFXSBNYXhpbXVtIGZvcmNlIHRvIGFwcGx5LgogICAgICogQGV4dGVuZHMgQ29uc3RyYWludAogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgLy8gSWYgZGlzdGFuY2UgaXMgbm90IGdpdmVuIGFzIGFuIG9wdGlvbiwgdGhlbiB0aGUgY3VycmVudCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBib2RpZXMgaXMgdXNlZC4KICAgICAqICAgICAvLyBJbiB0aGlzIGV4YW1wbGUsIHRoZSBib2RpZXMgd2lsbCBiZSBjb25zdHJhaW5lZCB0byBoYXZlIGEgZGlzdGFuY2Ugb2YgMiBiZXR3ZWVuIHRoZWlyIGNlbnRlcnMuCiAgICAgKiAgICAgdmFyIGJvZHlBID0gbmV3IEJvZHkoeyBtYXNzOiAxLCBwb3NpdGlvbjogWy0xLCAwXSB9KTsKICAgICAqICAgICB2YXIgYm9keUIgPSBuZXcgQm9keSh7IG1hc3M6IDEsIHBvc2l0aW9uOiBbMSwgMF0gfSk7CiAgICAgKiAgICAgdmFyIGNvbnN0cmFpbnQgPSBuZXcgRGlzdGFuY2VDb25zdHJhaW50KGJvZHlBLCBib2R5Qik7CiAgICAgKiAgICAgd29ybGQuYWRkQ29uc3RyYWludChjb25zdHJhaW50KTsKICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIE1hbnVhbGx5IHNldCB0aGUgZGlzdGFuY2UgYW5kIGFuY2hvcnMKICAgICAqICAgICB2YXIgY29uc3RyYWludCA9IG5ldyBEaXN0YW5jZUNvbnN0cmFpbnQoYm9keUEsIGJvZHlCLCB7CiAgICAgKiAgICAgICAgIGRpc3RhbmNlOiAxLCAgICAgICAgICAvLyBEaXN0YW5jZSB0byBrZWVwIGJldHdlZW4gdGhlIHBvaW50cwogICAgICogICAgICAgICBsb2NhbEFuY2hvckE6IFsxLCAwXSwgLy8gUG9pbnQgb24gYm9keUEKICAgICAqICAgICAgICAgbG9jYWxBbmNob3JCOiBbLTEsIDBdIC8vIFBvaW50IG9uIGJvZHlCCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgd29ybGQuYWRkQ29uc3RyYWludChjb25zdHJhaW50KTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIERpc3RhbmNlQ29uc3RyYWludChib2R5QSwgYm9keUIsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIENvbnN0cmFpbnQkNS5jYWxsKHRoaXMsIGJvZHlBLCBib2R5QiwgQ29uc3RyYWludCQ1LkRJU1RBTkNFLCBvcHRpb25zKTsKICAgICAgLyoqCiAgICAgICAqIExvY2FsIGFuY2hvciBpbiBib2R5IEEuCiAgICAgICAqIEBwcm9wZXJ0eSBsb2NhbEFuY2hvckEKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMubG9jYWxBbmNob3JBID0gb3B0aW9ucy5sb2NhbEFuY2hvckEgPyB2ZWMyJGQuY2xvbmUob3B0aW9ucy5sb2NhbEFuY2hvckEpIDogdmVjMiRkLmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogTG9jYWwgYW5jaG9yIGluIGJvZHkgQi4KICAgICAgICogQHByb3BlcnR5IGxvY2FsQW5jaG9yQgogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5sb2NhbEFuY2hvckIgPSBvcHRpb25zLmxvY2FsQW5jaG9yQiA/IHZlYzIkZC5jbG9uZShvcHRpb25zLmxvY2FsQW5jaG9yQikgOiB2ZWMyJGQuY3JlYXRlKCk7CiAgICAgIHZhciBsb2NhbEFuY2hvckEgPSB0aGlzLmxvY2FsQW5jaG9yQTsKICAgICAgdmFyIGxvY2FsQW5jaG9yQiA9IHRoaXMubG9jYWxBbmNob3JCOwogICAgICAvKioKICAgICAgICogVGhlIGRpc3RhbmNlIHRvIGtlZXAuCiAgICAgICAqIEBwcm9wZXJ0eSBkaXN0YW5jZQogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMuZGlzdGFuY2UgPSAwOwoKICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmRpc3RhbmNlID09PSAnbnVtYmVyJykgewogICAgICAgIHRoaXMuZGlzdGFuY2UgPSBvcHRpb25zLmRpc3RhbmNlOwogICAgICB9IGVsc2UgewogICAgICAgIC8vIFVzZSB0aGUgY3VycmVudCB3b3JsZCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB3b3JsZCBhbmNob3IgcG9pbnRzLgogICAgICAgIHZhciB3b3JsZEFuY2hvckEgPSB2ZWMyJGQuY3JlYXRlKCksCiAgICAgICAgICAgIHdvcmxkQW5jaG9yQiA9IHZlYzIkZC5jcmVhdGUoKSwKICAgICAgICAgICAgciA9IHZlYzIkZC5jcmVhdGUoKTsgLy8gVHJhbnNmb3JtIGxvY2FsIGFuY2hvcnMgdG8gd29ybGQKCiAgICAgICAgdmVjMiRkLnJvdGF0ZSh3b3JsZEFuY2hvckEsIGxvY2FsQW5jaG9yQSwgYm9keUEuYW5nbGUpOwogICAgICAgIHZlYzIkZC5yb3RhdGUod29ybGRBbmNob3JCLCBsb2NhbEFuY2hvckIsIGJvZHlCLmFuZ2xlKTsKICAgICAgICB2ZWMyJGQuYWRkKHIsIGJvZHlCLnBvc2l0aW9uLCB3b3JsZEFuY2hvckIpOwogICAgICAgIHZlYzIkZC5zdWJ0cmFjdChyLCByLCB3b3JsZEFuY2hvckEpOwogICAgICAgIHZlYzIkZC5zdWJ0cmFjdChyLCByLCBib2R5QS5wb3NpdGlvbik7CiAgICAgICAgdGhpcy5kaXN0YW5jZSA9IHZlYzIkZC5sZW5ndGgocik7CiAgICAgIH0KCiAgICAgIHZhciBtYXhGb3JjZTsKCiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYXhGb3JjZSA9PT0gInVuZGVmaW5lZCIpIHsKICAgICAgICBtYXhGb3JjZSA9IE51bWJlci5NQVhfVkFMVUU7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgbWF4Rm9yY2UgPSBvcHRpb25zLm1heEZvcmNlOwogICAgICB9CgogICAgICB2YXIgbm9ybWFsID0gbmV3IEVxdWF0aW9uJDYoYm9keUEsIGJvZHlCLCAtbWF4Rm9yY2UsIG1heEZvcmNlKTsgLy8gSnVzdCBpbiB0aGUgbm9ybWFsIGRpcmVjdGlvbgoKICAgICAgdGhpcy5lcXVhdGlvbnMgPSBbbm9ybWFsXTsKICAgICAgLyoqCiAgICAgICAqIE1heCBmb3JjZSB0byBhcHBseS4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1heEZvcmNlCiAgICAgICAqLwoKICAgICAgdGhpcy5tYXhGb3JjZSA9IG1heEZvcmNlOyAvLyBnID0gKHhpIC0geGopLmRvdChuKQogICAgICAvLyBkZy9kdCA9ICh2aSAtIHZqKS5kb3QobikgPSBHKlcgPSBbbiAwIC1uIDBdICogW3ZpIHdpIHZqIHdqXScKICAgICAgLy8gLi4uYW5kIGlmIHdlIHdlcmUgdG8gaW5jbHVkZSBvZmZzZXQgcG9pbnRzOgogICAgICAvLyBnID0KICAgICAgLy8gICAgICAoeGogKyByaiAtIHhpIC0gcmkpLmRvdChuKSAtIGRpc3RhbmNlCiAgICAgIC8vCiAgICAgIC8vIGRnL2R0ID0KICAgICAgLy8gICAgICAodmogKyB3aiB4IHJqIC0gdmkgLSB3aSB4IHJpKS5kb3QobikgPQogICAgICAvLyAgICAgIHsgdGVybSAyIGlzIG5lYXIgemVybyB9ID0KICAgICAgLy8gICAgICBbLW4gICAtcmkgeCBuICAgbiAgIHJqIHggbl0gKiBbdmkgd2kgdmogd2pdJyA9CiAgICAgIC8vICAgICAgRyAqIFcKICAgICAgLy8KICAgICAgLy8gPT4gRyA9IFstbiAtcml4biBuIHJqeG5dCgogICAgICB2YXIgciA9IHZlYzIkZC5jcmVhdGUoKTsKICAgICAgdmFyIHJpID0gdmVjMiRkLmNyZWF0ZSgpOyAvLyB3b3JsZEFuY2hvckEKCiAgICAgIHZhciByaiA9IHZlYzIkZC5jcmVhdGUoKTsgLy8gd29ybGRBbmNob3JCCgogICAgICB2YXIgdGhhdCA9IHRoaXM7CgogICAgICBub3JtYWwuY29tcHV0ZUdxID0gZnVuY3Rpb24gKCkgewogICAgICAgIHZhciBib2R5QSA9IHRoaXMuYm9keUEsCiAgICAgICAgICAgIGJvZHlCID0gdGhpcy5ib2R5QiwKICAgICAgICAgICAgeGkgPSBib2R5QS5wb3NpdGlvbiwKICAgICAgICAgICAgeGogPSBib2R5Qi5wb3NpdGlvbjsgLy8gVHJhbnNmb3JtIGxvY2FsIGFuY2hvcnMgdG8gd29ybGQKCiAgICAgICAgdmVjMiRkLnJvdGF0ZShyaSwgbG9jYWxBbmNob3JBLCBib2R5QS5hbmdsZSk7CiAgICAgICAgdmVjMiRkLnJvdGF0ZShyaiwgbG9jYWxBbmNob3JCLCBib2R5Qi5hbmdsZSk7CiAgICAgICAgdmVjMiRkLmFkZChyLCB4aiwgcmopOwogICAgICAgIHZlYzIkZC5zdWJ0cmFjdChyLCByLCByaSk7CiAgICAgICAgdmVjMiRkLnN1YnRyYWN0KHIsIHIsIHhpKTsgLy92ZWMyLnN1YnRyYWN0KHIsIGJvZHlCLnBvc2l0aW9uLCBib2R5QS5wb3NpdGlvbik7CgogICAgICAgIHJldHVybiB2ZWMyJGQubGVuZ3RoKHIpIC0gdGhhdC5kaXN0YW5jZTsKICAgICAgfTsgLy8gTWFrZSB0aGUgY29udGFjdCBjb25zdHJhaW50IGJpbGF0ZXJhbAoKCiAgICAgIHRoaXMuc2V0TWF4Rm9yY2UobWF4Rm9yY2UpOwogICAgICAvKioKICAgICAgICogSWYgdGhlIHVwcGVyIGxpbWl0IGlzIGVuYWJsZWQgb3Igbm90LgogICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHVwcGVyTGltaXRFbmFibGVkCiAgICAgICAqLwoKICAgICAgdGhpcy51cHBlckxpbWl0RW5hYmxlZCA9IGZhbHNlOwogICAgICAvKioKICAgICAgICogVGhlIHVwcGVyIGNvbnN0cmFpbnQgbGltaXQuCiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB1cHBlckxpbWl0CiAgICAgICAqLwoKICAgICAgdGhpcy51cHBlckxpbWl0ID0gMTsKICAgICAgLyoqCiAgICAgICAqIElmIHRoZSBsb3dlciBsaW1pdCBpcyBlbmFibGVkIG9yIG5vdC4KICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBsb3dlckxpbWl0RW5hYmxlZAogICAgICAgKi8KCiAgICAgIHRoaXMubG93ZXJMaW1pdEVuYWJsZWQgPSBmYWxzZTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBsb3dlciBjb25zdHJhaW50IGxpbWl0LgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbG93ZXJMaW1pdAogICAgICAgKi8KCiAgICAgIHRoaXMubG93ZXJMaW1pdCA9IDA7CiAgICAgIC8qKgogICAgICAgKiBDdXJyZW50IGNvbnN0cmFpbnQgcG9zaXRpb24uIFRoaXMgaXMgZXF1YWwgdG8gdGhlIGN1cnJlbnQgZGlzdGFuY2UgYmV0d2VlbiB0aGUgd29ybGQgYW5jaG9yIHBvaW50cy4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uCiAgICAgICAqLwoKICAgICAgdGhpcy5wb3NpdGlvbiA9IDA7CiAgICB9CgogICAgRGlzdGFuY2VDb25zdHJhaW50LnByb3RvdHlwZSA9IG5ldyBDb25zdHJhaW50JDUoKTsKICAgIERpc3RhbmNlQ29uc3RyYWludC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBEaXN0YW5jZUNvbnN0cmFpbnQ7CiAgICAvKioKICAgICAqIFVwZGF0ZSB0aGUgY29uc3RyYWludCBlcXVhdGlvbnMuIFNob3VsZCBiZSBkb25lIGlmIGFueSBvZiB0aGUgYm9kaWVzIGNoYW5nZWQgcG9zaXRpb24sIGJlZm9yZSBzb2x2aW5nLgogICAgICogQG1ldGhvZCB1cGRhdGUKICAgICAqLwoKICAgIHZhciBuID0gdmVjMiRkLmNyZWF0ZSgpOwogICAgdmFyIHJpID0gdmVjMiRkLmNyZWF0ZSgpOyAvLyB3b3JsZEFuY2hvckEKCiAgICB2YXIgcmogPSB2ZWMyJGQuY3JlYXRlKCk7IC8vIHdvcmxkQW5jaG9yQgoKICAgIERpc3RhbmNlQ29uc3RyYWludC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgbm9ybWFsID0gdGhpcy5lcXVhdGlvbnNbMF0sCiAgICAgICAgICBib2R5QSA9IHRoaXMuYm9keUEsCiAgICAgICAgICBib2R5QiA9IHRoaXMuYm9keUIsCiAgICAgICAgICB4aSA9IGJvZHlBLnBvc2l0aW9uLAogICAgICAgICAgeGogPSBib2R5Qi5wb3NpdGlvbiwKICAgICAgICAgIG5vcm1hbEVxdWF0aW9uID0gdGhpcy5lcXVhdGlvbnNbMF0sCiAgICAgICAgICBHID0gbm9ybWFsLkc7IC8vIFRyYW5zZm9ybSBsb2NhbCBhbmNob3JzIHRvIHdvcmxkCgogICAgICB2ZWMyJGQucm90YXRlKHJpLCB0aGlzLmxvY2FsQW5jaG9yQSwgYm9keUEuYW5nbGUpOwogICAgICB2ZWMyJGQucm90YXRlKHJqLCB0aGlzLmxvY2FsQW5jaG9yQiwgYm9keUIuYW5nbGUpOyAvLyBHZXQgd29ybGQgYW5jaG9yIHBvaW50cyBhbmQgbm9ybWFsCgogICAgICB2ZWMyJGQuYWRkKG4sIHhqLCByaik7CiAgICAgIHZlYzIkZC5zdWJ0cmFjdChuLCBuLCByaSk7CiAgICAgIHZlYzIkZC5zdWJ0cmFjdChuLCBuLCB4aSk7CiAgICAgIHRoaXMucG9zaXRpb24gPSB2ZWMyJGQubGVuZ3RoKG4pOwogICAgICB2YXIgdmlvbGF0aW5nID0gZmFsc2U7CgogICAgICBpZiAodGhpcy51cHBlckxpbWl0RW5hYmxlZCkgewogICAgICAgIGlmICh0aGlzLnBvc2l0aW9uID4gdGhpcy51cHBlckxpbWl0KSB7CiAgICAgICAgICBub3JtYWxFcXVhdGlvbi5tYXhGb3JjZSA9IDA7CiAgICAgICAgICBub3JtYWxFcXVhdGlvbi5taW5Gb3JjZSA9IC10aGlzLm1heEZvcmNlOwogICAgICAgICAgdGhpcy5kaXN0YW5jZSA9IHRoaXMudXBwZXJMaW1pdDsKICAgICAgICAgIHZpb2xhdGluZyA9IHRydWU7CiAgICAgICAgfQogICAgICB9CgogICAgICBpZiAodGhpcy5sb3dlckxpbWl0RW5hYmxlZCkgewogICAgICAgIGlmICh0aGlzLnBvc2l0aW9uIDwgdGhpcy5sb3dlckxpbWl0KSB7CiAgICAgICAgICBub3JtYWxFcXVhdGlvbi5tYXhGb3JjZSA9IHRoaXMubWF4Rm9yY2U7CiAgICAgICAgICBub3JtYWxFcXVhdGlvbi5taW5Gb3JjZSA9IDA7CiAgICAgICAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5sb3dlckxpbWl0OwogICAgICAgICAgdmlvbGF0aW5nID0gdHJ1ZTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICgodGhpcy5sb3dlckxpbWl0RW5hYmxlZCB8fCB0aGlzLnVwcGVyTGltaXRFbmFibGVkKSAmJiAhdmlvbGF0aW5nKSB7CiAgICAgICAgLy8gTm8gY29uc3RyYWludCBuZWVkZWQuCiAgICAgICAgbm9ybWFsRXF1YXRpb24uZW5hYmxlZCA9IGZhbHNlOwogICAgICAgIHJldHVybjsKICAgICAgfQoKICAgICAgbm9ybWFsRXF1YXRpb24uZW5hYmxlZCA9IHRydWU7CiAgICAgIHZlYzIkZC5ub3JtYWxpemUobiwgbik7IC8vIENhbHVjbGF0ZSBjcm9zcyBwcm9kdWN0cwoKICAgICAgdmFyIHJpeG4gPSB2ZWMyJGQuY3Jvc3NMZW5ndGgocmksIG4pLAogICAgICAgICAgcmp4biA9IHZlYzIkZC5jcm9zc0xlbmd0aChyaiwgbik7IC8vIEcgPSBbLW4gLXJpeG4gbiByanhuXQoKICAgICAgR1swXSA9IC1uWzBdOwogICAgICBHWzFdID0gLW5bMV07CiAgICAgIEdbMl0gPSAtcml4bjsKICAgICAgR1szXSA9IG5bMF07CiAgICAgIEdbNF0gPSBuWzFdOwogICAgICBHWzVdID0gcmp4bjsKICAgIH07CiAgICAvKioKICAgICAqIFNldCB0aGUgbWF4IGZvcmNlIHRvIGJlIHVzZWQKICAgICAqIEBtZXRob2Qgc2V0TWF4Rm9yY2UKICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhGb3JjZQogICAgICovCgoKICAgIERpc3RhbmNlQ29uc3RyYWludC5wcm90b3R5cGUuc2V0TWF4Rm9yY2UgPSBmdW5jdGlvbiAobWF4Rm9yY2UpIHsKICAgICAgdmFyIG5vcm1hbCA9IHRoaXMuZXF1YXRpb25zWzBdOwogICAgICBub3JtYWwubWluRm9yY2UgPSAtbWF4Rm9yY2U7CiAgICAgIG5vcm1hbC5tYXhGb3JjZSA9IG1heEZvcmNlOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IHRoZSBtYXggZm9yY2UKICAgICAqIEBtZXRob2QgZ2V0TWF4Rm9yY2UKICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAqLwoKCiAgICBEaXN0YW5jZUNvbnN0cmFpbnQucHJvdG90eXBlLmdldE1heEZvcmNlID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgbm9ybWFsID0gdGhpcy5lcXVhdGlvbnNbMF07CiAgICAgIHJldHVybiBub3JtYWwubWF4Rm9yY2U7CiAgICB9OwoKICAgIHZhciB2ZWMyJGMgPSB2ZWMyJHEuZXhwb3J0cywKICAgICAgICBFcXVhdGlvbiQ1ID0gRXF1YXRpb25fMTsKCiAgICB2YXIgRnJpY3Rpb25FcXVhdGlvbl8xID0gRnJpY3Rpb25FcXVhdGlvbiQzOwogICAgLyoqCiAgICAgKiBDb25zdHJhaW5zIHRoZSBzbGlwcGluZyBpbiBhIGNvbnRhY3QgYWxvbmcgYSB0YW5nZW50CiAgICAgKgogICAgICogQGNsYXNzIEZyaWN0aW9uRXF1YXRpb24KICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtIHtOdW1iZXJ9IHNsaXBGb3JjZQogICAgICogQGV4dGVuZHMgRXF1YXRpb24KICAgICAqLwoKICAgIGZ1bmN0aW9uIEZyaWN0aW9uRXF1YXRpb24kMyhib2R5QSwgYm9keUIsIHNsaXBGb3JjZSkgewogICAgICBFcXVhdGlvbiQ1LmNhbGwodGhpcywgYm9keUEsIGJvZHlCLCAtc2xpcEZvcmNlLCBzbGlwRm9yY2UpOwogICAgICAvKioKICAgICAgICogUmVsYXRpdmUgdmVjdG9yIGZyb20gY2VudGVyIG9mIGJvZHkgQSB0byB0aGUgY29udGFjdCBwb2ludCwgd29ybGQgb3JpZW50ZWQuCiAgICAgICAqIEBwcm9wZXJ0eSBjb250YWN0UG9pbnRBCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLmNvbnRhY3RQb2ludEEgPSB2ZWMyJGMuY3JlYXRlKCk7CiAgICAgIC8qKgogICAgICAgKiBSZWxhdGl2ZSB2ZWN0b3IgZnJvbSBjZW50ZXIgb2YgYm9keSBCIHRvIHRoZSBjb250YWN0IHBvaW50LCB3b3JsZCBvcmllbnRlZC4KICAgICAgICogQHByb3BlcnR5IGNvbnRhY3RQb2ludEIKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMuY29udGFjdFBvaW50QiA9IHZlYzIkYy5jcmVhdGUoKTsKICAgICAgLyoqCiAgICAgICAqIFRhbmdlbnQgdmVjdG9yIHRoYXQgdGhlIGZyaWN0aW9uIGZvcmNlIHdpbGwgYWN0IGFsb25nLiBXb3JsZCBvcmllbnRlZC4KICAgICAgICogQHByb3BlcnR5IHQKICAgICAgICogQHR5cGUge0FycmF5fQogICAgICAgKi8KCiAgICAgIHRoaXMudCA9IHZlYzIkYy5jcmVhdGUoKTsKICAgICAgLyoqCiAgICAgICAqIENvbnRhY3RFcXVhdGlvbnMgY29ubmVjdGVkIHRvIHRoaXMgZnJpY3Rpb24gZXF1YXRpb24uIFRoZSBjb250YWN0IGVxdWF0aW9ucyBjYW4gYmUgdXNlZCB0byByZXNjYWxlIHRoZSBtYXggZm9yY2UgZm9yIHRoZSBmcmljdGlvbi4gSWYgbW9yZSB0aGFuIG9uZSBjb250YWN0IGVxdWF0aW9uIGlzIGdpdmVuLCB0aGVuIHRoZSBtYXggZm9yY2UgY2FuIGJlIHNldCB0byB0aGUgYXZlcmFnZS4KICAgICAgICogQHByb3BlcnR5IGNvbnRhY3RFcXVhdGlvbnMKICAgICAgICogQHR5cGUge0NvbnRhY3RFcXVhdGlvbn0KICAgICAgICovCgogICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMgPSBbXTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBzaGFwZSBpbiBib2R5IGkgdGhhdCB0cmlnZ2VyZWQgdGhpcyBmcmljdGlvbi4KICAgICAgICogQHByb3BlcnR5IHNoYXBlQQogICAgICAgKiBAdHlwZSB7U2hhcGV9CiAgICAgICAqIEB0b2RvIE5lZWRlZD8gVGhlIHNoYXBlIGNhbiBiZSBsb29rZWQgdXAgdmlhIGNvbnRhY3RFcXVhdGlvbi5zaGFwZUEuLi4KICAgICAgICovCgogICAgICB0aGlzLnNoYXBlQSA9IG51bGw7CiAgICAgIC8qKgogICAgICAgKiBUaGUgc2hhcGUgaW4gYm9keSBqIHRoYXQgdHJpZ2dlcmVkIHRoaXMgZnJpY3Rpb24uCiAgICAgICAqIEBwcm9wZXJ0eSBzaGFwZUIKICAgICAgICogQHR5cGUge1NoYXBlfQogICAgICAgKiBAdG9kbyBOZWVkZWQ/IFRoZSBzaGFwZSBjYW4gYmUgbG9va2VkIHVwIHZpYSBjb250YWN0RXF1YXRpb24uc2hhcGVCLi4uCiAgICAgICAqLwoKICAgICAgdGhpcy5zaGFwZUIgPSBudWxsOwogICAgICAvKioKICAgICAgICogVGhlIGZyaWN0aW9uIGNvZWZmaWNpZW50IHRvIHVzZS4KICAgICAgICogQHByb3BlcnR5IGZyaWN0aW9uQ29lZmZpY2llbnQKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmZyaWN0aW9uQ29lZmZpY2llbnQgPSAwLjM7CiAgICB9CgogICAgRnJpY3Rpb25FcXVhdGlvbiQzLnByb3RvdHlwZSA9IG5ldyBFcXVhdGlvbiQ1KCk7CiAgICBGcmljdGlvbkVxdWF0aW9uJDMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRnJpY3Rpb25FcXVhdGlvbiQzOwogICAgLyoqCiAgICAgKiBTZXQgdGhlIHNsaXBwaW5nIGNvbmRpdGlvbiBmb3IgdGhlIGNvbnN0cmFpbnQuIFRoZSBmcmljdGlvbiBmb3JjZSBjYW5ub3QgYmUKICAgICAqIGxhcmdlciB0aGFuIHRoaXMgdmFsdWUuCiAgICAgKiBAbWV0aG9kIHNldFNsaXBGb3JjZQogICAgICogQHBhcmFtICB7TnVtYmVyfSBzbGlwRm9yY2UKICAgICAqLwoKICAgIEZyaWN0aW9uRXF1YXRpb24kMy5wcm90b3R5cGUuc2V0U2xpcEZvcmNlID0gZnVuY3Rpb24gKHNsaXBGb3JjZSkgewogICAgICB0aGlzLm1heEZvcmNlID0gc2xpcEZvcmNlOwogICAgICB0aGlzLm1pbkZvcmNlID0gLXNsaXBGb3JjZTsKICAgIH07CiAgICAvKioKICAgICAqIEdldCB0aGUgbWF4IGZvcmNlIGZvciB0aGUgY29uc3RyYWludC4KICAgICAqIEBtZXRob2QgZ2V0U2xpcEZvcmNlCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKi8KCgogICAgRnJpY3Rpb25FcXVhdGlvbiQzLnByb3RvdHlwZS5nZXRTbGlwRm9yY2UgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHJldHVybiB0aGlzLm1heEZvcmNlOwogICAgfTsKCiAgICBGcmljdGlvbkVxdWF0aW9uJDMucHJvdG90eXBlLmNvbXB1dGVCID0gZnVuY3Rpb24gKGEsIGIsIGgpIHsKICAgICAgdmFyIHJpID0gdGhpcy5jb250YWN0UG9pbnRBLAogICAgICAgICAgcmogPSB0aGlzLmNvbnRhY3RQb2ludEIsCiAgICAgICAgICB0ID0gdGhpcy50LAogICAgICAgICAgRyA9IHRoaXMuRzsgLy8gRyA9IFstdCAtcml4dCB0IHJqeHRdCiAgICAgIC8vIEFuZCByZW1lbWJlciwgdGhpcyBpcyBhIHB1cmUgdmVsb2NpdHkgY29uc3RyYWludCwgZyBpcyBhbHdheXMgemVybyEKCiAgICAgIEdbMF0gPSAtdFswXTsKICAgICAgR1sxXSA9IC10WzFdOwogICAgICBHWzJdID0gLXZlYzIkYy5jcm9zc0xlbmd0aChyaSwgdCk7CiAgICAgIEdbM10gPSB0WzBdOwogICAgICBHWzRdID0gdFsxXTsKICAgICAgR1s1XSA9IHZlYzIkYy5jcm9zc0xlbmd0aChyaiwgdCk7CiAgICAgIHZhciBHVyA9IHRoaXMuY29tcHV0ZUdXKCksCiAgICAgICAgICBHaU1mID0gdGhpcy5jb21wdXRlR2lNZigpOwogICAgICB2YXIgQiA9CiAgICAgIC8qIC0gZyAqIGEgICovCiAgICAgIC1HVyAqIGIgLSBoICogR2lNZjsKICAgICAgcmV0dXJuIEI7CiAgICB9OwoKICAgIHZhciBGcmljdGlvbkVxdWF0aW9uJDIgPSBGcmljdGlvbkVxdWF0aW9uXzE7CgogICAgdmFyIFBvb2wkMSA9IFBvb2xfMTsKCiAgICB2YXIgRnJpY3Rpb25FcXVhdGlvblBvb2xfMSA9IEZyaWN0aW9uRXF1YXRpb25Qb29sJDE7CiAgICAvKioKICAgICAqIEBjbGFzcwogICAgICovCgogICAgZnVuY3Rpb24gRnJpY3Rpb25FcXVhdGlvblBvb2wkMSgpIHsKICAgICAgUG9vbCQxLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7CiAgICB9CgogICAgRnJpY3Rpb25FcXVhdGlvblBvb2wkMS5wcm90b3R5cGUgPSBuZXcgUG9vbCQxKCk7CiAgICBGcmljdGlvbkVxdWF0aW9uUG9vbCQxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZyaWN0aW9uRXF1YXRpb25Qb29sJDE7CiAgICAvKioKICAgICAqIEBtZXRob2QgY3JlYXRlCiAgICAgKiBAcmV0dXJuIHtGcmljdGlvbkVxdWF0aW9ufQogICAgICovCgogICAgRnJpY3Rpb25FcXVhdGlvblBvb2wkMS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkgewogICAgICByZXR1cm4gbmV3IEZyaWN0aW9uRXF1YXRpb24kMigpOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBkZXN0cm95CiAgICAgKiBAcGFyYW0ge0ZyaWN0aW9uRXF1YXRpb259IGVxdWF0aW9uCiAgICAgKiBAcmV0dXJuIHtGcmljdGlvbkVxdWF0aW9uUG9vbH0KICAgICAqLwoKCiAgICBGcmljdGlvbkVxdWF0aW9uUG9vbCQxLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKGVxdWF0aW9uKSB7CiAgICAgIGVxdWF0aW9uLmJvZHlBID0gZXF1YXRpb24uYm9keUIgPSBudWxsOwogICAgICByZXR1cm4gdGhpczsKICAgIH07CgogICAgdmFyIENvbnN0cmFpbnQkNCA9IENvbnN0cmFpbnRfMSwKICAgICAgICBBbmdsZUxvY2tFcXVhdGlvbiA9IEFuZ2xlTG9ja0VxdWF0aW9uXzEsCiAgICAgICAgVXRpbHMkNCA9IFV0aWxzXzE7CgogICAgdmFyIEdlYXJDb25zdHJhaW50XzEgPSBHZWFyQ29uc3RyYWludDsKICAgIC8qKgogICAgICogQ29uc3RyYWlucyB0aGUgYW5nbGUgb2YgdHdvIGJvZGllcyB0byBlYWNoIG90aGVyIHRvIGJlIGVxdWFsLiBJZiBhIGdlYXIgcmF0aW8gaXMgbm90IG9uZSwgdGhlIGFuZ2xlIG9mIGJvZHlBIG11c3QgYmUgYSBtdWx0aXBsZSBvZiB0aGUgYW5nbGUgb2YgYm9keUIuCiAgICAgKiBAY2xhc3MgR2VhckNvbnN0cmFpbnQKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGF1dGhvciBzY2h0ZXBwZQogICAgICogQHBhcmFtIHtCb2R5fSAgICAgICAgICAgIGJvZHlBCiAgICAgKiBAcGFyYW0ge0JvZHl9ICAgICAgICAgICAgYm9keUIKICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICBbb3B0aW9ucy5hbmdsZT0wXSBSZWxhdGl2ZSBhbmdsZSBiZXR3ZWVuIHRoZSBib2RpZXMuIFdpbGwgYmUgc2V0IHRvIHRoZSBjdXJyZW50IGFuZ2xlIGJldHdlZW4gdGhlIGJvZGllcyAodGhlIGdlYXIgcmF0aW8gaXMgYWNjb3VudGVkIGZvcikuCiAgICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgW29wdGlvbnMucmF0aW89MV0gR2VhciByYXRpby4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICBbb3B0aW9ucy5tYXhUb3JxdWVdIE1heGltdW0gdG9ycXVlIHRvIGFwcGx5LgogICAgICogQGV4dGVuZHMgQ29uc3RyYWludAogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGNvbnN0cmFpbnQgPSBuZXcgR2VhckNvbnN0cmFpbnQoYm9keUEsIGJvZHlCKTsKICAgICAqICAgICB3b3JsZC5hZGRDb25zdHJhaW50KGNvbnN0cmFpbnQpOwogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGNvbnN0cmFpbnQgPSBuZXcgR2VhckNvbnN0cmFpbnQoYm9keUEsIGJvZHlCLCB7CiAgICAgKiAgICAgICAgIHJhdGlvOiAyLAogICAgICogICAgICAgICBtYXhUb3JxdWU6IDEwMDAKICAgICAqICAgICB9KTsKICAgICAqICAgICB3b3JsZC5hZGRDb25zdHJhaW50KGNvbnN0cmFpbnQpOwogICAgICovCgogICAgZnVuY3Rpb24gR2VhckNvbnN0cmFpbnQoYm9keUEsIGJvZHlCLCBvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICBDb25zdHJhaW50JDQuY2FsbCh0aGlzLCBib2R5QSwgYm9keUIsIENvbnN0cmFpbnQkNC5HRUFSLCBvcHRpb25zKTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBnZWFyIHJhdGlvLgogICAgICAgKiBAcHJvcGVydHkgcmF0aW8KICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLnJhdGlvID0gb3B0aW9ucy5yYXRpbyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5yYXRpbyA6IDE7CiAgICAgIC8qKgogICAgICAgKiBUaGUgcmVsYXRpdmUgYW5nbGUKICAgICAgICogQHByb3BlcnR5IGFuZ2xlCiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5hbmdsZSA9IG9wdGlvbnMuYW5nbGUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuYW5nbGUgOiBib2R5Qi5hbmdsZSAtIHRoaXMucmF0aW8gKiBib2R5QS5hbmdsZTsgLy8gU2VuZCBzYW1lIHBhcmFtZXRlcnMgdG8gdGhlIGVxdWF0aW9uCgogICAgICB2YXIgYW5nbGVMb2NrT3B0aW9ucyA9IFV0aWxzJDQuc2hhbGxvd0Nsb25lKG9wdGlvbnMpOwogICAgICBhbmdsZUxvY2tPcHRpb25zLmFuZ2xlID0gdGhpcy5hbmdsZTsKICAgICAgYW5nbGVMb2NrT3B0aW9ucy5yYXRpbyA9IHRoaXMucmF0aW87CiAgICAgIHRoaXMuZXF1YXRpb25zID0gW25ldyBBbmdsZUxvY2tFcXVhdGlvbihib2R5QSwgYm9keUIsIGFuZ2xlTG9ja09wdGlvbnMpXTsgLy8gU2V0IG1heCB0b3JxdWUKCiAgICAgIGlmIChvcHRpb25zLm1heFRvcnF1ZSAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgdGhpcy5zZXRNYXhUb3JxdWUob3B0aW9ucy5tYXhUb3JxdWUpOwogICAgICB9CiAgICB9CgogICAgR2VhckNvbnN0cmFpbnQucHJvdG90eXBlID0gbmV3IENvbnN0cmFpbnQkNCgpOwogICAgR2VhckNvbnN0cmFpbnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VhckNvbnN0cmFpbnQ7CgogICAgR2VhckNvbnN0cmFpbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGVxID0gdGhpcy5lcXVhdGlvbnNbMF07CiAgICAgIHZhciByYXRpbyA9IHRoaXMucmF0aW87CgogICAgICBpZiAoZXEucmF0aW8gIT09IHJhdGlvKSB7CiAgICAgICAgZXEuc2V0UmF0aW8ocmF0aW8pOwogICAgICB9CgogICAgICBlcS5hbmdsZSA9IHRoaXMuYW5nbGU7CiAgICB9OwogICAgLyoqCiAgICAgKiBTZXQgdGhlIG1heCB0b3JxdWUgZm9yIHRoZSBjb25zdHJhaW50LgogICAgICogQG1ldGhvZCBzZXRNYXhUb3JxdWUKICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b3JxdWUKICAgICAqLwoKCiAgICBHZWFyQ29uc3RyYWludC5wcm90b3R5cGUuc2V0TWF4VG9ycXVlID0gZnVuY3Rpb24gKHRvcnF1ZSkgewogICAgICB0aGlzLmVxdWF0aW9uc1swXS5zZXRNYXhUb3JxdWUodG9ycXVlKTsKICAgIH07CiAgICAvKioKICAgICAqIEdldCB0aGUgbWF4IHRvcnF1ZSBmb3IgdGhlIGNvbnN0cmFpbnQuCiAgICAgKiBAbWV0aG9kIGdldE1heFRvcnF1ZQogICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICovCgoKICAgIEdlYXJDb25zdHJhaW50LnByb3RvdHlwZS5nZXRNYXhUb3JxdWUgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHJldHVybiB0aGlzLmVxdWF0aW9uc1swXS5tYXhGb3JjZTsKICAgIH07CgogICAgdmFyIEV2ZW50RW1pdHRlciQxID0gRXZlbnRFbWl0dGVyXzE7CgogICAgdmFyIFNvbHZlcl8xID0gU29sdmVyJDE7CiAgICAvKioKICAgICAqIEJhc2UgY2xhc3MgZm9yIGNvbnN0cmFpbnQgc29sdmVycy4KICAgICAqIEBjbGFzcyBTb2x2ZXIKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyCiAgICAgKi8KCiAgICBmdW5jdGlvbiBTb2x2ZXIkMShvcHRpb25zLCB0eXBlKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICBFdmVudEVtaXR0ZXIkMS5jYWxsKHRoaXMpOwogICAgICB0aGlzLnR5cGUgPSB0eXBlOwogICAgICAvKioKICAgICAgICogQ3VycmVudCBlcXVhdGlvbnMgaW4gdGhlIHNvbHZlci4KICAgICAgICoKICAgICAgICogQHByb3BlcnR5IGVxdWF0aW9ucwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5lcXVhdGlvbnMgPSBbXTsKICAgICAgLyoqCiAgICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBzb3J0IGFsbCBlcXVhdGlvbnMgYmVmb3JlIGVhY2ggc29sdmUuCiAgICAgICAqIEBwcm9wZXJ0eSBlcXVhdGlvblNvcnRGdW5jdGlvbgogICAgICAgKiBAdHlwZSB7ZnVuY3Rpb258Ym9vbGVhbn0KICAgICAgICovCgogICAgICB0aGlzLmVxdWF0aW9uU29ydEZ1bmN0aW9uID0gb3B0aW9ucy5lcXVhdGlvblNvcnRGdW5jdGlvbiB8fCBmYWxzZTsKICAgIH0KCiAgICBTb2x2ZXIkMS5wcm90b3R5cGUgPSBuZXcgRXZlbnRFbWl0dGVyJDEoKTsKICAgIFNvbHZlciQxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNvbHZlciQxOwogICAgLyoqCiAgICAgKiBNZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgaW4gZWFjaCBzdWJjbGFzcwogICAgICogQG1ldGhvZCBzb2x2ZQogICAgICogQHBhcmFtICB7TnVtYmVyfSBkdAogICAgICogQHBhcmFtICB7V29ybGR9IHdvcmxkCiAgICAgKi8KCiAgICBTb2x2ZXIkMS5wcm90b3R5cGUuc29sdmUgPSBmdW5jdGlvbgogICAgICAvKmR0LHdvcmxkKi8KICAgICgpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKCJTb2x2ZXIuc29sdmUgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzZXMhIik7CiAgICB9OwogICAgLyoqCiAgICAgKiBTb3J0IGFsbCBlcXVhdGlvbnMgdXNpbmcgdGhlIC5lcXVhdGlvblNvcnRGdW5jdGlvbi4gU2hvdWxkIGJlIGNhbGxlZCBieSBzdWJjbGFzc2VzIGJlZm9yZSBzb2x2aW5nLgogICAgICogQG1ldGhvZCBzb3J0RXF1YXRpb25zCiAgICAgKi8KCgogICAgU29sdmVyJDEucHJvdG90eXBlLnNvcnRFcXVhdGlvbnMgPSBmdW5jdGlvbiAoKSB7CiAgICAgIGlmICh0aGlzLmVxdWF0aW9uU29ydEZ1bmN0aW9uKSB7CiAgICAgICAgdGhpcy5lcXVhdGlvbnMuc29ydCh0aGlzLmVxdWF0aW9uU29ydEZ1bmN0aW9uKTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogQWRkIGFuIGVxdWF0aW9uIHRvIGJlIHNvbHZlZC4KICAgICAqCiAgICAgKiBAbWV0aG9kIGFkZEVxdWF0aW9uCiAgICAgKiBAcGFyYW0ge0VxdWF0aW9ufSBlcQogICAgICovCgoKICAgIFNvbHZlciQxLnByb3RvdHlwZS5hZGRFcXVhdGlvbiA9IGZ1bmN0aW9uIChlcSkgewogICAgICBpZiAoZXEuZW5hYmxlZCkgewogICAgICAgIHRoaXMuZXF1YXRpb25zLnB1c2goZXEpOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBBZGQgZXF1YXRpb25zLiBTYW1lIGFzIC5hZGRFcXVhdGlvbiwgYnV0IHRoaXMgdGltZSB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXkgb2YgRXF1YXRpb25zCiAgICAgKgogICAgICogQG1ldGhvZCBhZGRFcXVhdGlvbnMKICAgICAqIEBwYXJhbSB7QXJyYXl9IGVxcwogICAgICovCgoKICAgIFNvbHZlciQxLnByb3RvdHlwZS5hZGRFcXVhdGlvbnMgPSBmdW5jdGlvbiAoZXFzKSB7CiAgICAgIGZvciAodmFyIGkgPSAwLCBOID0gZXFzLmxlbmd0aDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgdmFyIGVxID0gZXFzW2ldOwoKICAgICAgICBpZiAoZXEuZW5hYmxlZCkgewogICAgICAgICAgdGhpcy5lcXVhdGlvbnMucHVzaChlcSk7CiAgICAgICAgfQogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBSZW1vdmUgYW4gZXF1YXRpb24uCiAgICAgKgogICAgICogQG1ldGhvZCByZW1vdmVFcXVhdGlvbgogICAgICogQHBhcmFtIHtFcXVhdGlvbn0gZXEKICAgICAqLwoKCiAgICBTb2x2ZXIkMS5wcm90b3R5cGUucmVtb3ZlRXF1YXRpb24gPSBmdW5jdGlvbiAoZXEpIHsKICAgICAgdmFyIGkgPSB0aGlzLmVxdWF0aW9ucy5pbmRleE9mKGVxKTsKCiAgICAgIGlmIChpICE9PSAtMSkgewogICAgICAgIHRoaXMuZXF1YXRpb25zLnNwbGljZShpLCAxKTsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogUmVtb3ZlIGFsbCBjdXJyZW50bHkgYWRkZWQgZXF1YXRpb25zLgogICAgICoKICAgICAqIEBtZXRob2QgcmVtb3ZlQWxsRXF1YXRpb25zCiAgICAgKi8KCgogICAgU29sdmVyJDEucHJvdG90eXBlLnJlbW92ZUFsbEVxdWF0aW9ucyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5lcXVhdGlvbnMubGVuZ3RoID0gMDsKICAgIH07CiAgICAvKioKICAgICAqIEdhdXNzLVNlaWRlbCBzb2x2ZXIuCiAgICAgKiBAcHJvcGVydHkgR1MKICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgKiBAc3RhdGljCiAgICAgKi8KCgogICAgU29sdmVyJDEuR1MgPSAxOwoKICAgIHZhciBTb2x2ZXIgPSBTb2x2ZXJfMSwKICAgICAgICBGcmljdGlvbkVxdWF0aW9uJDEgPSBGcmljdGlvbkVxdWF0aW9uXzE7CgogICAgdmFyIEdTU29sdmVyXzEgPSBHU1NvbHZlciQxOwogICAgLyoqCiAgICAgKiBJdGVyYXRpdmUgR2F1c3MtU2VpZGVsIGNvbnN0cmFpbnQgZXF1YXRpb24gc29sdmVyLgogICAgICoKICAgICAqIEBjbGFzcyBHU1NvbHZlcgogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAZXh0ZW5kcyBTb2x2ZXIKICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5pdGVyYXRpb25zPTEwXQogICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRvbGVyYW5jZT0wXQogICAgICovCgogICAgZnVuY3Rpb24gR1NTb2x2ZXIkMShvcHRpb25zKSB7CiAgICAgIFNvbHZlci5jYWxsKHRoaXMsIG9wdGlvbnMsIFNvbHZlci5HUyk7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICAvKioKICAgICAgICogVGhlIG1heCBudW1iZXIgb2YgaXRlcmF0aW9ucyB0byBkbyB3aGVuIHNvbHZpbmcuIE1vcmUgZ2l2ZXMgYmV0dGVyIHJlc3VsdHMsIGJ1dCBpcyBtb3JlIGV4cGVuc2l2ZS4KICAgICAgICogQHByb3BlcnR5IGl0ZXJhdGlvbnMKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLml0ZXJhdGlvbnMgPSBvcHRpb25zLml0ZXJhdGlvbnMgfHwgMTA7CiAgICAgIC8qKgogICAgICAgKiBUaGUgZXJyb3IgdG9sZXJhbmNlLCBwZXIgY29uc3RyYWludC4gSWYgdGhlIHRvdGFsIGVycm9yIGlzIGJlbG93IHRoaXMgbGltaXQsIHRoZSBzb2x2ZXIgd2lsbCBzdG9wIGl0ZXJhdGluZy4gU2V0IHRvIHplcm8gZm9yIGFzIGdvb2Qgc29sdXRpb24gYXMgcG9zc2libGUsIGJ1dCB0byBzb21ldGhpbmcgbGFyZ2VyIHRoYW4gemVybyB0byBtYWtlIGNvbXB1dGF0aW9ucyBmYXN0ZXIuCiAgICAgICAqIEBwcm9wZXJ0eSB0b2xlcmFuY2UKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICogQGRlZmF1bHQgMWUtNwogICAgICAgKi8KCiAgICAgIHRoaXMudG9sZXJhbmNlID0gb3B0aW9ucy50b2xlcmFuY2UgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMudG9sZXJhbmNlIDogMWUtNzsKICAgICAgLyoqCiAgICAgICAqIE51bWJlciBvZiBzb2x2ZXIgaXRlcmF0aW9ucyB0aGF0IGFyZSB1c2VkIHRvIGFwcHJveGltYXRlIG5vcm1hbCBmb3JjZXMgdXNlZCBmb3IgZnJpY3Rpb24gKEZfZnJpY3Rpb24gPSBtdSAqIEZfbm9ybWFsKS4gVGhlc2UgZnJpY3Rpb24gZm9yY2VzIHdpbGwgb3ZlcnJpZGUgYW55IG90aGVyIGZyaWN0aW9uIGZvcmNlcyB0aGF0IGFyZSBzZXQuIElmIHlvdSBzZXQgZnJpY3Rpb25JdGVyYXRpb25zID0gMCwgdGhlbiB0aGlzIGZlYXR1cmUgd2lsbCBiZSBkaXNhYmxlZC4KICAgICAgICoKICAgICAgICogVXNlIG9ubHkgZnJpY3Rpb25JdGVyYXRpb25zID4gMCBpZiB0aGUgYXBwcm94aW1hdGVkIG5vcm1hbCBmb3JjZSAoRl9ub3JtYWwgPSBtYXNzICogZ3Jhdml0eSkgaXMgbm90IGdvb2QgZW5vdWdoLiBFeGFtcGxlcyBvZiB3aGVyZSBpdCBjYW4gaGFwcGVuIGlzIGluIHNwYWNlIGdhbWVzIHdoZXJlIGdyYXZpdHkgaXMgemVybywgb3IgaW4gdGFsbCBzdGFja3Mgd2hlcmUgdGhlIG5vcm1hbCBmb3JjZSBpcyBsYXJnZSBhdCBib3R0b20gYnV0IHNtYWxsIGF0IHRvcC4KICAgICAgICoKICAgICAgICogQHByb3BlcnR5IGZyaWN0aW9uSXRlcmF0aW9ucwogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKiBAZGVmYXVsdCAwCiAgICAgICAqLwoKICAgICAgdGhpcy5mcmljdGlvbkl0ZXJhdGlvbnMgPSBvcHRpb25zLmZyaWN0aW9uSXRlcmF0aW9ucyAhPT0gdW5kZWZpbmVkID8gMCA6IG9wdGlvbnMuZnJpY3Rpb25JdGVyYXRpb25zOwogICAgICAvKioKICAgICAgICogVGhlIG51bWJlciBvZiBpdGVyYXRpb25zIHRoYXQgd2VyZSBtYWRlIGR1cmluZyB0aGUgbGFzdCBzb2x2ZS4gSWYgLnRvbGVyYW5jZSBpcyB6ZXJvLCB0aGlzIHZhbHVlIHdpbGwgYWx3YXlzIGJlIGVxdWFsIHRvIC5pdGVyYXRpb25zLCBidXQgaWYgLnRvbGVyYW5jZSBpcyBsYXJnZXIgdGhhbiB6ZXJvLCBhbmQgdGhlIHNvbHZlciBjYW4gcXVpdCBlYXJseSwgdGhlbiB0aGlzIG51bWJlciB3aWxsIGJlIHNvbWV3aGVyZSBiZXR3ZWVuIDEgYW5kIC5pdGVyYXRpb25zLgogICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdXNlZEl0ZXJhdGlvbnMKICAgICAgICovCgogICAgICB0aGlzLnVzZWRJdGVyYXRpb25zID0gMDsKICAgIH0KCiAgICBHU1NvbHZlciQxLnByb3RvdHlwZSA9IG5ldyBTb2x2ZXIoKTsKICAgIEdTU29sdmVyJDEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR1NTb2x2ZXIkMTsKICAgIC8qKgogICAgICogU29sdmUgdGhlIHN5c3RlbSBvZiBlcXVhdGlvbnMKICAgICAqIEBtZXRob2Qgc29sdmUKICAgICAqIEBwYXJhbSAge051bWJlcn0gIGggICAgICAgVGltZSBzdGVwCiAgICAgKiBAcGFyYW0gIHtXb3JsZH0gICB3b3JsZCAgICBXb3JsZCB0byBzb2x2ZQogICAgICovCgogICAgR1NTb2x2ZXIkMS5wcm90b3R5cGUuc29sdmUgPSBmdW5jdGlvbiAoaCwgd29ybGQpIHsKICAgICAgdGhpcy5zb3J0RXF1YXRpb25zKCk7CiAgICAgIHZhciBpdGVyID0gMCwKICAgICAgICAgIG1heEl0ZXIgPSB0aGlzLml0ZXJhdGlvbnMsCiAgICAgICAgICBtYXhGcmljdGlvbkl0ZXIgPSB0aGlzLmZyaWN0aW9uSXRlcmF0aW9ucywKICAgICAgICAgIGVxdWF0aW9ucyA9IHRoaXMuZXF1YXRpb25zLAogICAgICAgICAgTmVxID0gZXF1YXRpb25zLmxlbmd0aCwKICAgICAgICAgIHRvbFNxdWFyZWQgPSBNYXRoLnBvdyh0aGlzLnRvbGVyYW5jZSAqIE5lcSwgMiksCiAgICAgICAgICBib2RpZXMgPSB3b3JsZC5ib2RpZXMsCiAgICAgICAgICBOYm9kaWVzID0gYm9kaWVzLmxlbmd0aDsKICAgICAgdGhpcy51c2VkSXRlcmF0aW9ucyA9IDA7CgogICAgICBpZiAoTmVxKSB7CiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IE5ib2RpZXM7IGkrKykgewogICAgICAgICAgdmFyIGIgPSBib2RpZXNbaV07IC8vIFVwZGF0ZSBzb2x2ZSBtYXNzCgogICAgICAgICAgYi51cGRhdGVTb2x2ZU1hc3NQcm9wZXJ0aWVzKCk7CiAgICAgICAgfQogICAgICB9CgogICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gTmVxOyBpKyspIHsKICAgICAgICB2YXIgYyA9IGVxdWF0aW9uc1tpXTsKICAgICAgICBjLmxhbWJkYSA9IDA7CgogICAgICAgIGlmIChjLnRpbWVTdGVwICE9PSBoIHx8IGMubmVlZHNVcGRhdGUpIHsKICAgICAgICAgIGMudGltZVN0ZXAgPSBoOwogICAgICAgICAgYy51cGRhdGUoKTsKICAgICAgICB9CgogICAgICAgIGMuQiA9IGMuY29tcHV0ZUIoYy5hLCBjLmIsIGgpOwogICAgICAgIGMuaW52QyA9IGMuY29tcHV0ZUludkMoYy5lcHNpbG9uKTsKICAgICAgICBjLm1heEZvcmNlRHQgPSBjLm1heEZvcmNlICogaDsKICAgICAgICBjLm1pbkZvcmNlRHQgPSBjLm1pbkZvcmNlICogaDsKICAgICAgfQoKICAgICAgdmFyIGMsIGRlbHRhbGFtYmRhVG90LCBpLCBqOwoKICAgICAgaWYgKE5lcSAhPT0gMCkgewogICAgICAgIGZvciAoaSA9IDA7IGkgIT09IE5ib2RpZXM7IGkrKykgewogICAgICAgICAgdmFyIGIgPSBib2RpZXNbaV07IC8vIFJlc2V0IHZsYW1iZGEKCiAgICAgICAgICBiLnJlc2V0Q29uc3RyYWludFZlbG9jaXR5KCk7CiAgICAgICAgfQoKICAgICAgICBpZiAobWF4RnJpY3Rpb25JdGVyKSB7CiAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgY29udGFjdCBlcXVhdGlvbnMgdG8gZ2V0IG5vcm1hbCBmb3JjZXMKICAgICAgICAgIGZvciAoaXRlciA9IDA7IGl0ZXIgIT09IG1heEZyaWN0aW9uSXRlcjsgaXRlcisrKSB7CiAgICAgICAgICAgIC8vIEFjY3VtdWxhdGUgdGhlIHRvdGFsIGVycm9yIGZvciBlYWNoIGl0ZXJhdGlvbi4KICAgICAgICAgICAgZGVsdGFsYW1iZGFUb3QgPSAwLjA7CgogICAgICAgICAgICBmb3IgKGogPSAwOyBqICE9PSBOZXE7IGorKykgewogICAgICAgICAgICAgIGMgPSBlcXVhdGlvbnNbal07CiAgICAgICAgICAgICAgdmFyIGRlbHRhbGFtYmRhID0gaXRlcmF0ZUVxdWF0aW9uKGMpOwogICAgICAgICAgICAgIGRlbHRhbGFtYmRhVG90ICs9IE1hdGguYWJzKGRlbHRhbGFtYmRhKTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgdGhpcy51c2VkSXRlcmF0aW9ucysrOyAvLyBJZiB0aGUgdG90YWwgZXJyb3IgaXMgc21hbGwgZW5vdWdoIC0gc3RvcCBpdGVyYXRlCgogICAgICAgICAgICBpZiAoZGVsdGFsYW1iZGFUb3QgKiBkZWx0YWxhbWJkYVRvdCA8PSB0b2xTcXVhcmVkKSB7CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICB1cGRhdGVNdWx0aXBsaWVycyhlcXVhdGlvbnMsIDEgLyBoKTsgLy8gU2V0IGNvbXB1dGVkIGZyaWN0aW9uIGZvcmNlCgogICAgICAgICAgZm9yIChqID0gMDsgaiAhPT0gTmVxOyBqKyspIHsKICAgICAgICAgICAgdmFyIGVxID0gZXF1YXRpb25zW2pdOwoKICAgICAgICAgICAgaWYgKGVxIGluc3RhbmNlb2YgRnJpY3Rpb25FcXVhdGlvbiQxKSB7CiAgICAgICAgICAgICAgdmFyIGYgPSAwLjA7CgogICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrICE9PSBlcS5jb250YWN0RXF1YXRpb25zLmxlbmd0aDsgaysrKSB7CiAgICAgICAgICAgICAgICBmICs9IGVxLmNvbnRhY3RFcXVhdGlvbnNba10ubXVsdGlwbGllcjsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIGYgKj0gZXEuZnJpY3Rpb25Db2VmZmljaWVudCAvIGVxLmNvbnRhY3RFcXVhdGlvbnMubGVuZ3RoOwogICAgICAgICAgICAgIGVxLm1heEZvcmNlID0gZjsKICAgICAgICAgICAgICBlcS5taW5Gb3JjZSA9IC1mOwogICAgICAgICAgICAgIGVxLm1heEZvcmNlRHQgPSBmICogaDsKICAgICAgICAgICAgICBlcS5taW5Gb3JjZUR0ID0gLWYgKiBoOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfSAvLyBJdGVyYXRlIG92ZXIgYWxsIGVxdWF0aW9ucwoKCiAgICAgICAgZm9yIChpdGVyID0gMDsgaXRlciAhPT0gbWF4SXRlcjsgaXRlcisrKSB7CiAgICAgICAgICAvLyBBY2N1bXVsYXRlIHRoZSB0b3RhbCBlcnJvciBmb3IgZWFjaCBpdGVyYXRpb24uCiAgICAgICAgICBkZWx0YWxhbWJkYVRvdCA9IDAuMDsKCiAgICAgICAgICBmb3IgKGogPSAwOyBqICE9PSBOZXE7IGorKykgewogICAgICAgICAgICBjID0gZXF1YXRpb25zW2pdOwogICAgICAgICAgICB2YXIgZGVsdGFsYW1iZGEgPSBpdGVyYXRlRXF1YXRpb24oYyk7CiAgICAgICAgICAgIGRlbHRhbGFtYmRhVG90ICs9IE1hdGguYWJzKGRlbHRhbGFtYmRhKTsKICAgICAgICAgIH0KCiAgICAgICAgICB0aGlzLnVzZWRJdGVyYXRpb25zKys7IC8vIElmIHRoZSB0b3RhbCBlcnJvciBpcyBzbWFsbCBlbm91Z2ggLSBzdG9wIGl0ZXJhdGUKCiAgICAgICAgICBpZiAoZGVsdGFsYW1iZGFUb3QgKiBkZWx0YWxhbWJkYVRvdCA8IHRvbFNxdWFyZWQpIHsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfSAvLyBBZGQgcmVzdWx0IHRvIHZlbG9jaXR5CgoKICAgICAgICBmb3IgKGkgPSAwOyBpICE9PSBOYm9kaWVzOyBpKyspIHsKICAgICAgICAgIGJvZGllc1tpXS5hZGRDb25zdHJhaW50VmVsb2NpdHkoKTsKICAgICAgICB9CgogICAgICAgIHVwZGF0ZU11bHRpcGxpZXJzKGVxdWF0aW9ucywgMSAvIGgpOwogICAgICB9CiAgICB9OyAvLyBTZXRzIHRoZSAubXVsdGlwbGllciBwcm9wZXJ0eSBvZiBlYWNoIGVxdWF0aW9uCgoKICAgIGZ1bmN0aW9uIHVwZGF0ZU11bHRpcGxpZXJzKGVxdWF0aW9ucywgaW52RHQpIHsKICAgICAgdmFyIGwgPSBlcXVhdGlvbnMubGVuZ3RoOwoKICAgICAgd2hpbGUgKGwtLSkgewogICAgICAgIHZhciBlcSA9IGVxdWF0aW9uc1tsXTsKICAgICAgICBlcS5tdWx0aXBsaWVyID0gZXEubGFtYmRhICogaW52RHQ7CiAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBpdGVyYXRlRXF1YXRpb24oZXEpIHsKICAgICAgLy8gQ29tcHV0ZSBpdGVyYXRpb24KICAgICAgdmFyIEIgPSBlcS5CLAogICAgICAgICAgZXBzID0gZXEuZXBzaWxvbiwKICAgICAgICAgIGludkMgPSBlcS5pbnZDLAogICAgICAgICAgbGFtYmRhaiA9IGVxLmxhbWJkYSwKICAgICAgICAgIEdXbGFtYmRhID0gZXEuY29tcHV0ZUdXbGFtYmRhKCksCiAgICAgICAgICBtYXhGb3JjZV9kdCA9IGVxLm1heEZvcmNlRHQsCiAgICAgICAgICBtaW5Gb3JjZV9kdCA9IGVxLm1pbkZvcmNlRHQ7CiAgICAgIHZhciBkZWx0YWxhbWJkYSA9IGludkMgKiAoQiAtIEdXbGFtYmRhIC0gZXBzICogbGFtYmRhaik7IC8vIENsYW1wIGlmIHdlIGFyZSBub3Qgd2l0aGluIHRoZSBtaW4vbWF4IGludGVydmFsCgogICAgICB2YXIgbGFtYmRhal9wbHVzX2RlbHRhbGFtYmRhID0gbGFtYmRhaiArIGRlbHRhbGFtYmRhOwoKICAgICAgaWYgKGxhbWJkYWpfcGx1c19kZWx0YWxhbWJkYSA8IG1pbkZvcmNlX2R0KSB7CiAgICAgICAgZGVsdGFsYW1iZGEgPSBtaW5Gb3JjZV9kdCAtIGxhbWJkYWo7CiAgICAgIH0gZWxzZSBpZiAobGFtYmRhal9wbHVzX2RlbHRhbGFtYmRhID4gbWF4Rm9yY2VfZHQpIHsKICAgICAgICBkZWx0YWxhbWJkYSA9IG1heEZvcmNlX2R0IC0gbGFtYmRhajsKICAgICAgfQoKICAgICAgZXEubGFtYmRhICs9IGRlbHRhbGFtYmRhOwogICAgICBlcS5hZGRUb1dsYW1iZGEoZGVsdGFsYW1iZGEpOwogICAgICByZXR1cm4gZGVsdGFsYW1iZGE7CiAgICB9CgogICAgdmFyIFNoYXBlJDYgPSBTaGFwZV8xLAogICAgICAgIHZlYzIkYiA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIHNoYWxsb3dDbG9uZSQzID0gVXRpbHNfMS5zaGFsbG93Q2xvbmU7CgogICAgdmFyIEhlaWdodGZpZWxkXzEgPSBIZWlnaHRmaWVsZDsKICAgIC8qKgogICAgICogSGVpZ2h0ZmllbGQgc2hhcGUgY2xhc3MuIEhlaWdodCBkYXRhIGlzIGdpdmVuIGFzIGFuIGFycmF5LiBUaGVzZSBkYXRhIHBvaW50cyBhcmUgc3ByZWFkIG91dCBldmVubHkgd2l0aCBhIGRpc3RhbmNlICJlbGVtZW50V2lkdGgiLgogICAgICogQGNsYXNzIEhlaWdodGZpZWxkCiAgICAgKiBAZXh0ZW5kcyBTaGFwZQogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIChOb3RlIHRoYXQgdGhpcyBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUge3sjY3Jvc3NMaW5rICJTaGFwZSJ9fXt7L2Nyb3NzTGlua319IGNvbnN0cnVjdG9yLikKICAgICAqIEBwYXJhbSB7YXJyYXl9IFtvcHRpb25zLmhlaWdodHNdIEFuIGFycmF5IG9mIFkgdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGNvbnN0cnVjdCB0aGUgdGVycmFpbi4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW5WYWx1ZV0gTWluaW11bSB2YWx1ZSBvZiB0aGUgZGF0YSBwb2ludHMgaW4gdGhlIGRhdGEgYXJyYXkuIFdpbGwgYmUgY29tcHV0ZWQgYXV0b21hdGljYWxseSBpZiBub3QgZ2l2ZW4uCiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4VmFsdWVdIE1heGltdW0gdmFsdWUuCiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZWxlbWVudFdpZHRoPTAuMV0gV29ybGQgc3BhY2luZyBiZXR3ZWVuIHRoZSBkYXRhIHBvaW50cyBpbiBYIGRpcmVjdGlvbi4KICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIEdlbmVyYXRlIHNvbWUgaGVpZ2h0IGRhdGEgKHktdmFsdWVzKS4KICAgICAqICAgICB2YXIgaGVpZ2h0cyA9IFtdOwogICAgICogICAgIGZvcih2YXIgaSA9IDA7IGkgPCAxMDAwOyBpKyspewogICAgICogICAgICAgICB2YXIgeSA9IDAuNSAqIE1hdGguY29zKDAuMiAqIGkpOwogICAgICogICAgICAgICBoZWlnaHRzLnB1c2goeSk7CiAgICAgKiAgICAgfQogICAgICoKICAgICAqICAgICAvLyBDcmVhdGUgdGhlIGhlaWdodGZpZWxkIHNoYXBlCiAgICAgKiAgICAgdmFyIHNoYXBlID0gbmV3IEhlaWdodGZpZWxkKHsKICAgICAqICAgICAgICAgaGVpZ2h0czogaGVpZ2h0cywKICAgICAqICAgICAgICAgZWxlbWVudFdpZHRoOiAxIC8vIERpc3RhbmNlIGJldHdlZW4gdGhlIGRhdGEgcG9pbnRzIGluIFggZGlyZWN0aW9uCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSgpOwogICAgICogICAgIGJvZHkuYWRkU2hhcGUoc2hhcGUpOwogICAgICogICAgIHdvcmxkLmFkZEJvZHkoYm9keSk7CiAgICAgKgogICAgICogQHRvZG8gU2hvdWxkIHVzZSBhIHNjYWxlIHByb3BlcnR5IHdpdGggWCBhbmQgWSBkaXJlY3Rpb24gaW5zdGVhZCBvZiBqdXN0IGVsZW1lbnRXaWR0aAogICAgICovCgogICAgZnVuY3Rpb24gSGVpZ2h0ZmllbGQob3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyA/IHNoYWxsb3dDbG9uZSQzKG9wdGlvbnMpIDoge307CiAgICAgIC8qKgogICAgICAgKiBBbiBhcnJheSBvZiBudW1iZXJzLCBvciBoZWlnaHQgdmFsdWVzLCB0aGF0IGFyZSBzcHJlYWQgb3V0IGFsb25nIHRoZSB4IGF4aXMuCiAgICAgICAqIEBwcm9wZXJ0eSB7YXJyYXl9IGhlaWdodHMKICAgICAgICovCgogICAgICB0aGlzLmhlaWdodHMgPSBvcHRpb25zLmhlaWdodHMgPyBvcHRpb25zLmhlaWdodHMuc2xpY2UoMCkgOiBbXTsKICAgICAgLyoqCiAgICAgICAqIE1heCB2YWx1ZSBvZiB0aGUgaGVpZ2h0cwogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbWF4VmFsdWUKICAgICAgICovCgogICAgICB0aGlzLm1heFZhbHVlID0gb3B0aW9ucy5tYXhWYWx1ZSB8fCBudWxsOwogICAgICAvKioKICAgICAgICogTWF4IHZhbHVlIG9mIHRoZSBoZWlnaHRzCiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtaW5WYWx1ZQogICAgICAgKi8KCiAgICAgIHRoaXMubWluVmFsdWUgPSBvcHRpb25zLm1pblZhbHVlIHx8IG51bGw7CiAgICAgIC8qKgogICAgICAgKiBUaGUgd2lkdGggb2YgZWFjaCBlbGVtZW50CiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlbGVtZW50V2lkdGgKICAgICAgICovCgogICAgICB0aGlzLmVsZW1lbnRXaWR0aCA9IG9wdGlvbnMuZWxlbWVudFdpZHRoICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmVsZW1lbnRXaWR0aCA6IDAuMTsKCiAgICAgIGlmIChvcHRpb25zLm1heFZhbHVlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5taW5WYWx1ZSA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgdGhpcy51cGRhdGVNYXhNaW5WYWx1ZXMoKTsKICAgICAgfQoKICAgICAgb3B0aW9ucy50eXBlID0gU2hhcGUkNi5IRUlHSFRGSUVMRDsKICAgICAgU2hhcGUkNi5jYWxsKHRoaXMsIG9wdGlvbnMpOwogICAgfQoKICAgIEhlaWdodGZpZWxkLnByb3RvdHlwZSA9IG5ldyBTaGFwZSQ2KCk7CiAgICBIZWlnaHRmaWVsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBIZWlnaHRmaWVsZDsKICAgIC8qKgogICAgICogVXBkYXRlIHRoZSAubWluVmFsdWUgYW5kIHRoZSAubWF4VmFsdWUKICAgICAqIEBtZXRob2QgdXBkYXRlTWF4TWluVmFsdWVzCiAgICAgKi8KCiAgICBIZWlnaHRmaWVsZC5wcm90b3R5cGUudXBkYXRlTWF4TWluVmFsdWVzID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgZGF0YSA9IHRoaXMuaGVpZ2h0czsKICAgICAgdmFyIG1heFZhbHVlID0gZGF0YVswXTsKICAgICAgdmFyIG1pblZhbHVlID0gZGF0YVswXTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSBkYXRhLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIHYgPSBkYXRhW2ldOwoKICAgICAgICBpZiAodiA+IG1heFZhbHVlKSB7CiAgICAgICAgICBtYXhWYWx1ZSA9IHY7CiAgICAgICAgfQoKICAgICAgICBpZiAodiA8IG1pblZhbHVlKSB7CiAgICAgICAgICBtaW5WYWx1ZSA9IHY7CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLm1heFZhbHVlID0gbWF4VmFsdWU7CiAgICAgIHRoaXMubWluVmFsdWUgPSBtaW5WYWx1ZTsKICAgIH07CiAgICAvKioKICAgICAqIEBtZXRob2QgY29tcHV0ZU1vbWVudE9mSW5lcnRpYQogICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICovCgoKICAgIEhlaWdodGZpZWxkLnByb3RvdHlwZS5jb21wdXRlTW9tZW50T2ZJbmVydGlhID0gZnVuY3Rpb24gKCkgewogICAgICByZXR1cm4gTnVtYmVyLk1BWF9WQUxVRTsKICAgIH07CgogICAgSGVpZ2h0ZmllbGQucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nUmFkaXVzID0gZnVuY3Rpb24gKCkgewogICAgICB0aGlzLmJvdW5kaW5nUmFkaXVzID0gTnVtYmVyLk1BWF9WQUxVRTsKICAgIH07CgogICAgSGVpZ2h0ZmllbGQucHJvdG90eXBlLnVwZGF0ZUFyZWEgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBkYXRhID0gdGhpcy5oZWlnaHRzLAogICAgICAgICAgYXJlYSA9IDA7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoIC0gMTsgaSsrKSB7CiAgICAgICAgYXJlYSArPSAoZGF0YVtpXSArIGRhdGFbaSArIDFdKSAvIDIgKiB0aGlzLmVsZW1lbnRXaWR0aDsKICAgICAgfQoKICAgICAgdGhpcy5hcmVhID0gYXJlYTsKICAgIH07CgogICAgdmFyIHBvaW50cyQxID0gW3ZlYzIkYi5jcmVhdGUoKSwgdmVjMiRiLmNyZWF0ZSgpLCB2ZWMyJGIuY3JlYXRlKCksIHZlYzIkYi5jcmVhdGUoKV07CiAgICAvKioKICAgICAqIEBtZXRob2QgY29tcHV0ZUFBQkIKICAgICAqIEBwYXJhbSAge0FBQkJ9ICAgb3V0ICAgICAgVGhlIHJlc3VsdGluZyBBQUJCLgogICAgICogQHBhcmFtICB7QXJyYXl9ICBwb3NpdGlvbgogICAgICogQHBhcmFtICB7TnVtYmVyfSBhbmdsZQogICAgICovCgogICAgSGVpZ2h0ZmllbGQucHJvdG90eXBlLmNvbXB1dGVBQUJCID0gZnVuY3Rpb24gKG91dCwgcG9zaXRpb24sIGFuZ2xlKSB7CiAgICAgIHZlYzIkYi5zZXQocG9pbnRzJDFbMF0sIDAsIHRoaXMubWF4VmFsdWUpOwogICAgICB2ZWMyJGIuc2V0KHBvaW50cyQxWzFdLCB0aGlzLmVsZW1lbnRXaWR0aCAqIHRoaXMuaGVpZ2h0cy5sZW5ndGgsIHRoaXMubWF4VmFsdWUpOwogICAgICB2ZWMyJGIuc2V0KHBvaW50cyQxWzJdLCB0aGlzLmVsZW1lbnRXaWR0aCAqIHRoaXMuaGVpZ2h0cy5sZW5ndGgsIHRoaXMubWluVmFsdWUpOwogICAgICB2ZWMyJGIuc2V0KHBvaW50cyQxWzNdLCAwLCB0aGlzLm1pblZhbHVlKTsKICAgICAgb3V0LnNldEZyb21Qb2ludHMocG9pbnRzJDEsIHBvc2l0aW9uLCBhbmdsZSk7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgYSBsaW5lIHNlZ21lbnQgaW4gdGhlIGhlaWdodGZpZWxkCiAgICAgKiBAbWV0aG9kIGdldExpbmVTZWdtZW50CiAgICAgKiBAcGFyYW0gIHthcnJheX0gc3RhcnQgV2hlcmUgdG8gc3RvcmUgdGhlIHJlc3VsdGluZyBzdGFydCBwb2ludAogICAgICogQHBhcmFtICB7YXJyYXl9IGVuZCBXaGVyZSB0byBzdG9yZSB0aGUgcmVzdWx0aW5nIGVuZCBwb2ludAogICAgICogQHBhcmFtICB7bnVtYmVyfSBpCiAgICAgKi8KCgogICAgSGVpZ2h0ZmllbGQucHJvdG90eXBlLmdldExpbmVTZWdtZW50ID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGkpIHsKICAgICAgdmFyIGRhdGEgPSB0aGlzLmhlaWdodHM7CiAgICAgIHZhciB3aWR0aCA9IHRoaXMuZWxlbWVudFdpZHRoOwogICAgICB2ZWMyJGIuc2V0KHN0YXJ0LCBpICogd2lkdGgsIGRhdGFbaV0pOwogICAgICB2ZWMyJGIuc2V0KGVuZCwgKGkgKyAxKSAqIHdpZHRoLCBkYXRhW2kgKyAxXSk7CiAgICB9OwoKICAgIEhlaWdodGZpZWxkLnByb3RvdHlwZS5nZXRTZWdtZW50SW5kZXggPSBmdW5jdGlvbiAocG9zaXRpb24pIHsKICAgICAgcmV0dXJuIE1hdGguZmxvb3IocG9zaXRpb25bMF0gLyB0aGlzLmVsZW1lbnRXaWR0aCk7CiAgICB9OwoKICAgIEhlaWdodGZpZWxkLnByb3RvdHlwZS5nZXRDbGFtcGVkU2VnbWVudEluZGV4ID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7CiAgICAgIHZhciBpID0gdGhpcy5nZXRTZWdtZW50SW5kZXgocG9zaXRpb24pOwogICAgICBpID0gTWF0aC5taW4odGhpcy5oZWlnaHRzLmxlbmd0aCwgTWF0aC5tYXgoaSwgMCkpOyAvLyBjbGFtcAoKICAgICAgcmV0dXJuIGk7CiAgICB9OwoKICAgIHZhciBpbnRlcnNlY3RIZWlnaHRmaWVsZF93b3JsZE5vcm1hbCA9IHZlYzIkYi5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RIZWlnaHRmaWVsZF9sMCA9IHZlYzIkYi5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RIZWlnaHRmaWVsZF9sMSA9IHZlYzIkYi5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RIZWlnaHRmaWVsZF9sb2NhbEZyb20gPSB2ZWMyJGIuY3JlYXRlKCk7CiAgICB2YXIgaW50ZXJzZWN0SGVpZ2h0ZmllbGRfbG9jYWxUbyA9IHZlYzIkYi5jcmVhdGUoKTsKICAgIC8qKgogICAgICogQG1ldGhvZCByYXljYXN0CiAgICAgKiBAcGFyYW0gIHtSYXlSZXN1bHR9IHJlc3VsdAogICAgICogQHBhcmFtICB7UmF5fSByYXkKICAgICAqIEBwYXJhbSAge2FycmF5fSBwb3NpdGlvbgogICAgICogQHBhcmFtICB7bnVtYmVyfSBhbmdsZQogICAgICovCgogICAgSGVpZ2h0ZmllbGQucHJvdG90eXBlLnJheWNhc3QgPSBmdW5jdGlvbiAocmVzdWx0LCByYXksIHBvc2l0aW9uLCBhbmdsZSkgewogICAgICB2YXIgZnJvbSA9IHJheS5mcm9tOwogICAgICB2YXIgdG8gPSByYXkudG87CiAgICAgIHZhciB3b3JsZE5vcm1hbCA9IGludGVyc2VjdEhlaWdodGZpZWxkX3dvcmxkTm9ybWFsOwogICAgICB2YXIgbDAgPSBpbnRlcnNlY3RIZWlnaHRmaWVsZF9sMDsKICAgICAgdmFyIGwxID0gaW50ZXJzZWN0SGVpZ2h0ZmllbGRfbDE7CiAgICAgIHZhciBsb2NhbEZyb20gPSBpbnRlcnNlY3RIZWlnaHRmaWVsZF9sb2NhbEZyb207CiAgICAgIHZhciBsb2NhbFRvID0gaW50ZXJzZWN0SGVpZ2h0ZmllbGRfbG9jYWxUbzsgLy8gZ2V0IGxvY2FsIHJheSBzdGFydCBhbmQgZW5kCgogICAgICB2ZWMyJGIudG9Mb2NhbEZyYW1lKGxvY2FsRnJvbSwgZnJvbSwgcG9zaXRpb24sIGFuZ2xlKTsKICAgICAgdmVjMiRiLnRvTG9jYWxGcmFtZShsb2NhbFRvLCB0bywgcG9zaXRpb24sIGFuZ2xlKTsgLy8gR2V0IHRoZSBzZWdtZW50IHJhbmdlCgogICAgICB0aGlzLmdldENsYW1wZWRTZWdtZW50SW5kZXgobG9jYWxGcm9tKTsKICAgICAgdGhpcy5nZXRDbGFtcGVkU2VnbWVudEluZGV4KGxvY2FsVG8pOwoKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oZWlnaHRzLmxlbmd0aCAtIDE7IGkrKykgewogICAgICAgIHRoaXMuZ2V0TGluZVNlZ21lbnQobDAsIGwxLCBpKTsKICAgICAgICB2YXIgdCA9IHZlYzIkYi5nZXRMaW5lU2VnbWVudHNJbnRlcnNlY3Rpb25GcmFjdGlvbihsb2NhbEZyb20sIGxvY2FsVG8sIGwwLCBsMSk7CgogICAgICAgIGlmICh0ID49IDApIHsKICAgICAgICAgIHZlYzIkYi5zdWJ0cmFjdCh3b3JsZE5vcm1hbCwgbDEsIGwwKTsKICAgICAgICAgIHZlYzIkYi5yb3RhdGUod29ybGROb3JtYWwsIHdvcmxkTm9ybWFsLCBhbmdsZSArIE1hdGguUEkgLyAyKTsKICAgICAgICAgIHZlYzIkYi5ub3JtYWxpemUod29ybGROb3JtYWwsIHdvcmxkTm9ybWFsKTsKICAgICAgICAgIHJheS5yZXBvcnRJbnRlcnNlY3Rpb24ocmVzdWx0LCB0LCB3b3JsZE5vcm1hbCwgLTEpOwoKICAgICAgICAgIGlmIChyZXN1bHQuc2hvdWxkU3RvcChyYXkpKSB7CiAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH07CgogICAgdmFyIFNoYXBlJDUgPSBTaGFwZV8xLAogICAgICAgIHNoYWxsb3dDbG9uZSQyID0gVXRpbHNfMS5zaGFsbG93Q2xvbmUsCiAgICAgICAgdmVjMiRhID0gdmVjMiRxLmV4cG9ydHM7CgogICAgdmFyIExpbmVfMSA9IExpbmU7CiAgICAvKioKICAgICAqIExpbmUgc2hhcGUgY2xhc3MuIFRoZSBsaW5lIHNoYXBlIGlzIGFsb25nIHRoZSB4IGRpcmVjdGlvbiwgYW5kIHN0cmV0Y2hlcyBmcm9tIFstbGVuZ3RoLzIsIDBdIHRvIFtsZW5ndGgvMiwwXS4KICAgICAqIEBjbGFzcyBMaW5lCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIChOb3RlIHRoYXQgdGhpcyBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUge3sjY3Jvc3NMaW5rICJTaGFwZSJ9fXt7L2Nyb3NzTGlua319IGNvbnN0cnVjdG9yLikKICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5sZW5ndGg9MV0gVGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgbGluZQogICAgICogQGV4dGVuZHMgU2hhcGUKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgYm9keSA9IG5ldyBCb2R5KCk7CiAgICAgKiAgICAgdmFyIGxpbmVTaGFwZSA9IG5ldyBMaW5lKHsKICAgICAqICAgICAgICAgbGVuZ3RoOiAxCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgYm9keS5hZGRTaGFwZShsaW5lU2hhcGUpOwogICAgICovCgogICAgZnVuY3Rpb24gTGluZShvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gc2hhbGxvd0Nsb25lJDIob3B0aW9ucykgOiB7fTsKICAgICAgLyoqCiAgICAgICAqIExlbmd0aCBvZiB0aGlzIGxpbmUKICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxlbmd0aAogICAgICAgKiBAZGVmYXVsdCAxCiAgICAgICAqLwoKICAgICAgdGhpcy5sZW5ndGggPSBvcHRpb25zLmxlbmd0aCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5sZW5ndGggOiAxOwogICAgICBvcHRpb25zLnR5cGUgPSBTaGFwZSQ1LkxJTkU7CiAgICAgIFNoYXBlJDUuY2FsbCh0aGlzLCBvcHRpb25zKTsKICAgIH0KCiAgICBMaW5lLnByb3RvdHlwZSA9IG5ldyBTaGFwZSQ1KCk7CiAgICBMaW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExpbmU7CgogICAgTGluZS5wcm90b3R5cGUuY29tcHV0ZU1vbWVudE9mSW5lcnRpYSA9IGZ1bmN0aW9uICgpIHsKICAgICAgcmV0dXJuIE1hdGgucG93KHRoaXMubGVuZ3RoLCAyKSAvIDEyOwogICAgfTsKCiAgICBMaW5lLnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ1JhZGl1cyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IHRoaXMubGVuZ3RoIC8gMjsKICAgIH07CgogICAgdmFyIHBvaW50cyA9IFt2ZWMyJGEuY3JlYXRlKCksIHZlYzIkYS5jcmVhdGUoKV07CiAgICAvKioKICAgICAqIEBtZXRob2QgY29tcHV0ZUFBQkIKICAgICAqIEBwYXJhbSAge0FBQkJ9ICAgb3V0ICAgICAgVGhlIHJlc3VsdGluZyBBQUJCLgogICAgICogQHBhcmFtICB7QXJyYXl9ICBwb3NpdGlvbgogICAgICogQHBhcmFtICB7TnVtYmVyfSBhbmdsZQogICAgICovCgogICAgTGluZS5wcm90b3R5cGUuY29tcHV0ZUFBQkIgPSBmdW5jdGlvbiAob3V0LCBwb3NpdGlvbiwgYW5nbGUpIHsKICAgICAgdmFyIGwyID0gdGhpcy5sZW5ndGggLyAyOwogICAgICB2ZWMyJGEuc2V0KHBvaW50c1swXSwgLWwyLCAwKTsKICAgICAgdmVjMiRhLnNldChwb2ludHNbMV0sIGwyLCAwKTsKICAgICAgb3V0LnNldEZyb21Qb2ludHMocG9pbnRzLCBwb3NpdGlvbiwgYW5nbGUsIDApOwogICAgfTsKCiAgICB2YXIgcmF5Y2FzdF9ub3JtYWwgPSB2ZWMyJGEuY3JlYXRlKCk7CiAgICB2YXIgcmF5Y2FzdF9sMCA9IHZlYzIkYS5jcmVhdGUoKTsKICAgIHZhciByYXljYXN0X2wxID0gdmVjMiRhLmNyZWF0ZSgpOwogICAgdmFyIHJheWNhc3RfdW5pdF95ID0gdmVjMiRhLmZyb21WYWx1ZXMoMCwgMSk7CiAgICAvKioKICAgICAqIEBtZXRob2QgcmF5Y2FzdAogICAgICogQHBhcmFtICB7UmF5Y2FzdFJlc3VsdH0gcmVzdWx0CiAgICAgKiBAcGFyYW0gIHtSYXl9IHJheQogICAgICogQHBhcmFtICB7bnVtYmVyfSBhbmdsZQogICAgICogQHBhcmFtICB7YXJyYXl9IHBvc2l0aW9uCiAgICAgKi8KCiAgICBMaW5lLnByb3RvdHlwZS5yYXljYXN0ID0gZnVuY3Rpb24gKHJlc3VsdCwgcmF5LCBwb3NpdGlvbiwgYW5nbGUpIHsKICAgICAgdmFyIGZyb20gPSByYXkuZnJvbTsKICAgICAgdmFyIHRvID0gcmF5LnRvOwogICAgICB2YXIgbDAgPSByYXljYXN0X2wwOwogICAgICB2YXIgbDEgPSByYXljYXN0X2wxOyAvLyBnZXQgc3RhcnQgYW5kIGVuZCBvZiB0aGUgbGluZQoKICAgICAgdmFyIGhhbGZMZW4gPSB0aGlzLmxlbmd0aCAvIDI7CiAgICAgIHZlYzIkYS5zZXQobDAsIC1oYWxmTGVuLCAwKTsKICAgICAgdmVjMiRhLnNldChsMSwgaGFsZkxlbiwgMCk7CiAgICAgIHZlYzIkYS50b0dsb2JhbEZyYW1lKGwwLCBsMCwgcG9zaXRpb24sIGFuZ2xlKTsKICAgICAgdmVjMiRhLnRvR2xvYmFsRnJhbWUobDEsIGwxLCBwb3NpdGlvbiwgYW5nbGUpOwogICAgICB2YXIgZnJhY3Rpb24gPSB2ZWMyJGEuZ2V0TGluZVNlZ21lbnRzSW50ZXJzZWN0aW9uRnJhY3Rpb24obDAsIGwxLCBmcm9tLCB0byk7CgogICAgICBpZiAoZnJhY3Rpb24gPj0gMCkgewogICAgICAgIHZhciBub3JtYWwgPSByYXljYXN0X25vcm1hbDsKICAgICAgICB2ZWMyJGEucm90YXRlKG5vcm1hbCwgcmF5Y2FzdF91bml0X3ksIGFuZ2xlKTsgLy8gdG9kbzogdGhpcyBzaG91bGQgZGVwZW5kIG9uIHdoaWNoIHNpZGUgdGhlIHJheSBjb21lcyBmcm9tCgogICAgICAgIHJheS5yZXBvcnRJbnRlcnNlY3Rpb24ocmVzdWx0LCBmcmFjdGlvbiwgbm9ybWFsLCAtMSk7CiAgICAgIH0KICAgIH07CgogICAgdmFyIENvbnN0cmFpbnQkMyA9IENvbnN0cmFpbnRfMSwKICAgICAgICB2ZWMyJDkgPSB2ZWMyJHEuZXhwb3J0cywKICAgICAgICBFcXVhdGlvbiQ0ID0gRXF1YXRpb25fMTsKCiAgICB2YXIgTG9ja0NvbnN0cmFpbnRfMSA9IExvY2tDb25zdHJhaW50OwogICAgLyoqCiAgICAgKiBMb2NrcyB0aGUgcmVsYXRpdmUgcG9zaXRpb24gYW5kIHJvdGF0aW9uIGJldHdlZW4gdHdvIGJvZGllcy4KICAgICAqCiAgICAgKiBAY2xhc3MgTG9ja0NvbnN0cmFpbnQKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGF1dGhvciBzY2h0ZXBwZQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXQogICAgICogQHBhcmFtIHtBcnJheX0gIFtvcHRpb25zLmxvY2FsT2Zmc2V0Ql0gVGhlIG9mZnNldCBvZiBib2R5QiBpbiBib2R5QSdzIGZyYW1lLiBJZiBub3QgZ2l2ZW4gdGhlIG9mZnNldCBpcyBjb21wdXRlZCBmcm9tIGN1cnJlbnQgcG9zaXRpb25zLgogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmxvY2FsQW5nbGVCXSBUaGUgYW5nbGUgb2YgYm9keUIgaW4gYm9keUEncyBmcmFtZS4gSWYgbm90IGdpdmVuLCB0aGUgYW5nbGUgaXMgY29tcHV0ZWQgZnJvbSBjdXJyZW50IGFuZ2xlcy4KICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhGb3JjZV0KICAgICAqIEBleHRlbmRzIENvbnN0cmFpbnQKICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIExvY2tzIHRoZSByZWxhdGl2ZSBwb3NpdGlvbiBhbmQgcm90YXRpb24gYmV0d2VlbiBib2R5QSBhbmQgYm9keUIKICAgICAqICAgICB2YXIgY29uc3RyYWludCA9IG5ldyBMb2NrQ29uc3RyYWludChib2R5QSwgYm9keUIpOwogICAgICogICAgIHdvcmxkLmFkZENvbnN0cmFpbnQoY29uc3RyYWludCk7CiAgICAgKi8KCiAgICBmdW5jdGlvbiBMb2NrQ29uc3RyYWludChib2R5QSwgYm9keUIsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIENvbnN0cmFpbnQkMy5jYWxsKHRoaXMsIGJvZHlBLCBib2R5QiwgQ29uc3RyYWludCQzLkxPQ0ssIG9wdGlvbnMpOwogICAgICB2YXIgbWF4Rm9yY2UgPSB0eXBlb2Ygb3B0aW9ucy5tYXhGb3JjZSA9PT0gInVuZGVmaW5lZCIgPyBOdW1iZXIuTUFYX1ZBTFVFIDogb3B0aW9ucy5tYXhGb3JjZTsgLy8gVXNlIDMgZXF1YXRpb25zOgogICAgICAvLyBneCA9ICAgKHhqIC0geGkgLSBsKSAqIHhoYXQgPSAwCiAgICAgIC8vIGd5ID0gICAoeGogLSB4aSAtIGwpICogeWhhdCA9IDAKICAgICAgLy8gZ3IgPSAgICh4aSAtIHhqICsgcikgKiB0aGF0ID0gMAogICAgICAvLwogICAgICAvLyAuLi53aGVyZToKICAgICAgLy8gICBsIGlzIHRoZSBsb2NhbE9mZnNldEIgdmVjdG9yIHJvdGF0ZWQgdG8gd29ybGQgaW4gYm9keUEgZnJhbWUKICAgICAgLy8gICByIGlzIHRoZSBzYW1lIHZlY3RvciBidXQgcmV2ZXJzZWQgYW5kIHJvdGF0ZWQgZnJvbSBib2R5QiBmcmFtZQogICAgICAvLyAgIHhoYXQsIHloYXQgYXJlIHdvcmxkIGF4aXMgdmVjdG9ycwogICAgICAvLyAgIHRoYXQgaXMgdGhlIHRhbmdlbnQgb2YgcgogICAgICAvLwogICAgICAvLyBGb3IgdGhlIGZpcnN0IHR3byBjb25zdHJhaW50cywgd2UgZ2V0CiAgICAgIC8vIEcqVyA9ICh2aiAtIHZpIC0gbGRvdCAgKSAqIHhoYXQKICAgICAgLy8gICAgID0gKHZqIC0gdmkgLSB3aSB4IGwpICogeGhhdAogICAgICAvLwogICAgICAvLyBTaW5jZSAod2kgeCBsKSAqIHhoYXQgPSAobCB4IHhoYXQpICogd2ksIHdlIGdldAogICAgICAvLyBHKlcgPSBbIC0xICAgMCAgICgtbCB4IHhoYXQpICAxICAgMCAgIDBdICogW3ZpIHdpIHZqIHdqXQogICAgICAvLwogICAgICAvLyBUaGUgbGFzdCBjb25zdHJhaW50IGdpdmVzCiAgICAgIC8vIEdXID0gKHZpIC0gdmogKyB3aiB4IHIpICogdGhhdAogICAgICAvLyAgICA9IFsgIHRoYXQgICAwICAtdGhhdCAgKHIgeCB0KSBdCgogICAgICB2YXIgeCA9IG5ldyBFcXVhdGlvbiQ0KGJvZHlBLCBib2R5QiwgLW1heEZvcmNlLCBtYXhGb3JjZSksCiAgICAgICAgICB5ID0gbmV3IEVxdWF0aW9uJDQoYm9keUEsIGJvZHlCLCAtbWF4Rm9yY2UsIG1heEZvcmNlKSwKICAgICAgICAgIHJvdCA9IG5ldyBFcXVhdGlvbiQ0KGJvZHlBLCBib2R5QiwgLW1heEZvcmNlLCBtYXhGb3JjZSk7CiAgICAgIHZhciBsID0gdmVjMiQ5LmNyZWF0ZSgpLAogICAgICAgICAgZyA9IHZlYzIkOS5jcmVhdGUoKSwKICAgICAgICAgIHRoYXQgPSB0aGlzOwoKICAgICAgeC5jb21wdXRlR3EgPSBmdW5jdGlvbiAoKSB7CiAgICAgICAgdmVjMiQ5LnJvdGF0ZShsLCB0aGF0LmxvY2FsT2Zmc2V0QiwgYm9keUEuYW5nbGUpOwogICAgICAgIHZlYzIkOS5zdWJ0cmFjdChnLCBib2R5Qi5wb3NpdGlvbiwgYm9keUEucG9zaXRpb24pOwogICAgICAgIHZlYzIkOS5zdWJ0cmFjdChnLCBnLCBsKTsKICAgICAgICByZXR1cm4gZ1swXTsKICAgICAgfTsKCiAgICAgIHkuY29tcHV0ZUdxID0gZnVuY3Rpb24gKCkgewogICAgICAgIHZlYzIkOS5yb3RhdGUobCwgdGhhdC5sb2NhbE9mZnNldEIsIGJvZHlBLmFuZ2xlKTsKICAgICAgICB2ZWMyJDkuc3VidHJhY3QoZywgYm9keUIucG9zaXRpb24sIGJvZHlBLnBvc2l0aW9uKTsKICAgICAgICB2ZWMyJDkuc3VidHJhY3QoZywgZywgbCk7CiAgICAgICAgcmV0dXJuIGdbMV07CiAgICAgIH07CgogICAgICB2YXIgciA9IHZlYzIkOS5jcmVhdGUoKSwKICAgICAgICAgIHQgPSB2ZWMyJDkuY3JlYXRlKCk7CgogICAgICByb3QuY29tcHV0ZUdxID0gZnVuY3Rpb24gKCkgewogICAgICAgIHZlYzIkOS5yb3RhdGUociwgdGhhdC5sb2NhbE9mZnNldEIsIGJvZHlCLmFuZ2xlIC0gdGhhdC5sb2NhbEFuZ2xlQik7CiAgICAgICAgdmVjMiQ5LnNjYWxlKHIsIHIsIC0xKTsKICAgICAgICB2ZWMyJDkuc3VidHJhY3QoZywgYm9keUEucG9zaXRpb24sIGJvZHlCLnBvc2l0aW9uKTsKICAgICAgICB2ZWMyJDkuYWRkKGcsIGcsIHIpOwogICAgICAgIHZlYzIkOS5yb3RhdGUodCwgciwgLU1hdGguUEkgLyAyKTsKICAgICAgICB2ZWMyJDkubm9ybWFsaXplKHQsIHQpOwogICAgICAgIHJldHVybiB2ZWMyJDkuZG90KGcsIHQpOwogICAgICB9OwogICAgICAvKioKICAgICAgICogVGhlIG9mZnNldCBvZiBib2R5QiBpbiBib2R5QSdzIGZyYW1lLgogICAgICAgKiBAcHJvcGVydHkge0FycmF5fSBsb2NhbE9mZnNldEIKICAgICAgICovCgoKICAgICAgdGhpcy5sb2NhbE9mZnNldEIgPSB2ZWMyJDkuY3JlYXRlKCk7CgogICAgICBpZiAob3B0aW9ucy5sb2NhbE9mZnNldEIpIHsKICAgICAgICB2ZWMyJDkuY29weSh0aGlzLmxvY2FsT2Zmc2V0Qiwgb3B0aW9ucy5sb2NhbE9mZnNldEIpOwogICAgICB9IGVsc2UgewogICAgICAgIC8vIENvbnN0cnVjdCBmcm9tIGN1cnJlbnQgcG9zaXRpb25zCiAgICAgICAgdmVjMiQ5LnN1YnRyYWN0KHRoaXMubG9jYWxPZmZzZXRCLCBib2R5Qi5wb3NpdGlvbiwgYm9keUEucG9zaXRpb24pOwogICAgICAgIHZlYzIkOS5yb3RhdGUodGhpcy5sb2NhbE9mZnNldEIsIHRoaXMubG9jYWxPZmZzZXRCLCAtYm9keUEuYW5nbGUpOwogICAgICB9CiAgICAgIC8qKgogICAgICAgKiBUaGUgb2Zmc2V0IGFuZ2xlIG9mIGJvZHlCIGluIGJvZHlBJ3MgZnJhbWUuCiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsb2NhbEFuZ2xlQgogICAgICAgKi8KCgogICAgICB0aGlzLmxvY2FsQW5nbGVCID0gMDsKCiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5sb2NhbEFuZ2xlQiA9PT0gJ251bWJlcicpIHsKICAgICAgICB0aGlzLmxvY2FsQW5nbGVCID0gb3B0aW9ucy5sb2NhbEFuZ2xlQjsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBDb25zdHJ1Y3QKICAgICAgICB0aGlzLmxvY2FsQW5nbGVCID0gYm9keUIuYW5nbGUgLSBib2R5QS5hbmdsZTsKICAgICAgfQoKICAgICAgdGhpcy5lcXVhdGlvbnMucHVzaCh4LCB5LCByb3QpOwogICAgICB0aGlzLnNldE1heEZvcmNlKG1heEZvcmNlKTsKICAgIH0KCiAgICBMb2NrQ29uc3RyYWludC5wcm90b3R5cGUgPSBuZXcgQ29uc3RyYWludCQzKCk7CiAgICBMb2NrQ29uc3RyYWludC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMb2NrQ29uc3RyYWludDsKICAgIC8qKgogICAgICogU2V0IHRoZSBtYXhpbXVtIGZvcmNlIHRvIGJlIGFwcGxpZWQuCiAgICAgKiBAbWV0aG9kIHNldE1heEZvcmNlCiAgICAgKiBAcGFyYW0ge051bWJlcn0gZm9yY2UKICAgICAqLwoKICAgIExvY2tDb25zdHJhaW50LnByb3RvdHlwZS5zZXRNYXhGb3JjZSA9IGZ1bmN0aW9uIChmb3JjZSkgewogICAgICB2YXIgZXFzID0gdGhpcy5lcXVhdGlvbnM7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXF1YXRpb25zLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgZXFzW2ldLm1heEZvcmNlID0gZm9yY2U7CiAgICAgICAgZXFzW2ldLm1pbkZvcmNlID0gLWZvcmNlOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIG1heCBmb3JjZS4KICAgICAqIEBtZXRob2QgZ2V0TWF4Rm9yY2UKICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAqLwoKCiAgICBMb2NrQ29uc3RyYWludC5wcm90b3R5cGUuZ2V0TWF4Rm9yY2UgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHJldHVybiB0aGlzLmVxdWF0aW9uc1swXS5tYXhGb3JjZTsKICAgIH07CgogICAgdmFyIGwgPSB2ZWMyJDkuY3JlYXRlKCk7CiAgICB2YXIgciA9IHZlYzIkOS5jcmVhdGUoKTsKICAgIHZhciB0ID0gdmVjMiQ5LmNyZWF0ZSgpOwogICAgdmFyIHhBeGlzJDIgPSB2ZWMyJDkuZnJvbVZhbHVlcygxLCAwKTsKICAgIHZhciB5QXhpcyQzID0gdmVjMiQ5LmZyb21WYWx1ZXMoMCwgMSk7CgogICAgTG9ja0NvbnN0cmFpbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIHggPSB0aGlzLmVxdWF0aW9uc1swXSwKICAgICAgICAgIHkgPSB0aGlzLmVxdWF0aW9uc1sxXSwKICAgICAgICAgIHJvdCA9IHRoaXMuZXF1YXRpb25zWzJdLAogICAgICAgICAgYm9keUEgPSB0aGlzLmJvZHlBLAogICAgICAgICAgYm9keUIgPSB0aGlzLmJvZHlCOwogICAgICB2ZWMyJDkucm90YXRlKGwsIHRoaXMubG9jYWxPZmZzZXRCLCBib2R5QS5hbmdsZSk7CiAgICAgIHZlYzIkOS5yb3RhdGUociwgdGhpcy5sb2NhbE9mZnNldEIsIGJvZHlCLmFuZ2xlIC0gdGhpcy5sb2NhbEFuZ2xlQik7CiAgICAgIHZlYzIkOS5zY2FsZShyLCByLCAtMSk7CiAgICAgIHZlYzIkOS5yb3RhdGUodCwgciwgTWF0aC5QSSAvIDIpOwogICAgICB2ZWMyJDkubm9ybWFsaXplKHQsIHQpOwogICAgICB4LkdbMF0gPSAtMTsKICAgICAgeC5HWzFdID0gMDsKICAgICAgeC5HWzJdID0gLXZlYzIkOS5jcm9zc0xlbmd0aChsLCB4QXhpcyQyKTsKICAgICAgeC5HWzNdID0gMTsKICAgICAgeS5HWzBdID0gMDsKICAgICAgeS5HWzFdID0gLTE7CiAgICAgIHkuR1syXSA9IC12ZWMyJDkuY3Jvc3NMZW5ndGgobCwgeUF4aXMkMyk7CiAgICAgIHkuR1s0XSA9IDE7CiAgICAgIHJvdC5HWzBdID0gLXRbMF07CiAgICAgIHJvdC5HWzFdID0gLXRbMV07CiAgICAgIHJvdC5HWzNdID0gdFswXTsKICAgICAgcm90LkdbNF0gPSB0WzFdOwogICAgICByb3QuR1s1XSA9IHZlYzIkOS5jcm9zc0xlbmd0aChyLCB0KTsKICAgIH07CgogICAgdmFyIFV0aWxzJDMgPSBVdGlsc18xOwoKICAgIHZhciBUdXBsZURpY3Rpb25hcnlfMSA9IFR1cGxlRGljdGlvbmFyeSQyOwogICAgLyoqCiAgICAgKiBAY2xhc3MgVHVwbGVEaWN0aW9uYXJ5CiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqLwoKICAgIGZ1bmN0aW9uIFR1cGxlRGljdGlvbmFyeSQyKCkgewogICAgICAvKioKICAgICAgICogVGhlIGRhdGEgc3RvcmFnZQogICAgICAgKiBAcHJvcGVydHkgZGF0YQogICAgICAgKiBAdHlwZSB7T2JqZWN0fQogICAgICAgKi8KICAgICAgdGhpcy5kYXRhID0ge307CiAgICAgIC8qKgogICAgICAgKiBLZXlzIHRoYXQgYXJlIGN1cnJlbnRseSB1c2VkLgogICAgICAgKiBAcHJvcGVydHkge0FycmF5fSBrZXlzCiAgICAgICAqLwoKICAgICAgdGhpcy5rZXlzID0gW107CiAgICB9CiAgICAvKioKICAgICAqIEdlbmVyYXRlIGEga2V5IGdpdmVuIHR3byBpbnRlZ2VycwogICAgICogQG1ldGhvZCBnZXRLZXkKICAgICAqIEBwYXJhbSAge251bWJlcn0gaQogICAgICogQHBhcmFtICB7bnVtYmVyfSBqCiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9CiAgICAgKi8KCgogICAgVHVwbGVEaWN0aW9uYXJ5JDIucHJvdG90eXBlLmdldEtleSA9IGZ1bmN0aW9uIChpZDEsIGlkMikgewogICAgICBpZDEgPSBpZDEgfCAwOwogICAgICBpZDIgPSBpZDIgfCAwOwoKICAgICAgaWYgKChpZDEgfCAwKSA9PT0gKGlkMiB8IDApKSB7CiAgICAgICAgcmV0dXJuIC0xOwogICAgICB9IC8vIHZhbGlkIGZvciB2YWx1ZXMgPCAyXjE2CgoKICAgICAgcmV0dXJuICgoaWQxIHwgMCkgPiAoaWQyIHwgMCkgPyBpZDEgPDwgMTYgfCBpZDIgJiAweEZGRkYgOiBpZDIgPDwgMTYgfCBpZDEgJiAweEZGRkYpIHwgMDsKICAgIH07CiAgICAvKioKICAgICAqIEBtZXRob2QgZ2V0QnlLZXkKICAgICAqIEBwYXJhbSAge051bWJlcn0ga2V5CiAgICAgKiBAcmV0dXJuIHtPYmplY3R9CiAgICAgKi8KCgogICAgVHVwbGVEaWN0aW9uYXJ5JDIucHJvdG90eXBlLmdldEJ5S2V5ID0gZnVuY3Rpb24gKGtleSkgewogICAgICBrZXkgPSBrZXkgfCAwOwogICAgICByZXR1cm4gdGhpcy5kYXRhW2tleV07CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGdldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBpCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGoKICAgICAqIEByZXR1cm4ge051bWJlcn0KICAgICAqLwoKCiAgICBUdXBsZURpY3Rpb25hcnkkMi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGksIGopIHsKICAgICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmdldEtleShpLCBqKV07CiAgICB9OwogICAgLyoqCiAgICAgKiBTZXQgYSB2YWx1ZS4KICAgICAqIEBtZXRob2Qgc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGkKICAgICAqIEBwYXJhbSAge051bWJlcn0gagogICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlCiAgICAgKi8KCgogICAgVHVwbGVEaWN0aW9uYXJ5JDIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpLCBqLCB2YWx1ZSkgewogICAgICBpZiAoIXZhbHVlKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJObyBkYXRhISIpOwogICAgICB9CgogICAgICB2YXIga2V5ID0gdGhpcy5nZXRLZXkoaSwgaik7IC8vIENoZWNrIGlmIGtleSBhbHJlYWR5IGV4aXN0cwoKICAgICAgaWYgKCF0aGlzLmRhdGFba2V5XSkgewogICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7CiAgICAgIH0KCiAgICAgIHRoaXMuZGF0YVtrZXldID0gdmFsdWU7CiAgICAgIHJldHVybiBrZXk7CiAgICB9OwogICAgLyoqCiAgICAgKiBSZW1vdmUgYWxsIGRhdGEuCiAgICAgKiBAbWV0aG9kIHJlc2V0CiAgICAgKi8KCgogICAgVHVwbGVEaWN0aW9uYXJ5JDIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSwKICAgICAgICAgIGtleXMgPSB0aGlzLmtleXM7CiAgICAgIHZhciBsID0ga2V5cy5sZW5ndGg7CgogICAgICB3aGlsZSAobC0tKSB7CiAgICAgICAgZGVsZXRlIGRhdGFba2V5c1tsXV07CiAgICAgIH0KCiAgICAgIGtleXMubGVuZ3RoID0gMDsKICAgIH07CiAgICAvKioKICAgICAqIENvcHkgYW5vdGhlciBUdXBsZURpY3Rpb25hcnkuIE5vdGUgdGhhdCBhbGwgZGF0YSBpbiB0aGlzIGRpY3Rpb25hcnkgd2lsbCBiZSByZW1vdmVkLgogICAgICogQG1ldGhvZCBjb3B5CiAgICAgKiBAcGFyYW0ge1R1cGxlRGljdGlvbmFyeX0gZGljdCBUaGUgVHVwbGVEaWN0aW9uYXJ5IHRvIGNvcHkgaW50byB0aGlzIG9uZS4KICAgICAqLwoKCiAgICBUdXBsZURpY3Rpb25hcnkkMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIChkaWN0KSB7CiAgICAgIHRoaXMucmVzZXQoKTsKICAgICAgVXRpbHMkMy5hcHBlbmRBcnJheSh0aGlzLmtleXMsIGRpY3Qua2V5cyk7CiAgICAgIHZhciBsID0gZGljdC5rZXlzLmxlbmd0aDsKCiAgICAgIHdoaWxlIChsLS0pIHsKICAgICAgICB2YXIga2V5ID0gZGljdC5rZXlzW2xdOwogICAgICAgIHRoaXMuZGF0YVtrZXldID0gZGljdC5kYXRhW2tleV07CiAgICAgIH0KICAgIH07CgogICAgdmFyIHZlYzIkOCA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIFNoYXBlJDQgPSBTaGFwZV8xLAogICAgICAgIHNoYWxsb3dDbG9uZSQxID0gVXRpbHNfMS5zaGFsbG93Q2xvbmUsCiAgICAgICAgQ29udmV4JDEgPSBDb252ZXhfMTsKCiAgICB2YXIgQm94XzEgPSBCb3gkMTsKICAgIC8qKgogICAgICogQm94IHNoYXBlIGNsYXNzLgogICAgICogQGNsYXNzIEJveAogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIChOb3RlIHRoYXQgdGhpcyBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUge3sjY3Jvc3NMaW5rICJTaGFwZSJ9fXt7L2Nyb3NzTGlua319IGNvbnN0cnVjdG9yLikKICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0xXSBUb3RhbCB3aWR0aCBvZiB0aGUgYm94CiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTFdIFRvdGFsIGhlaWdodCBvZiB0aGUgYm94CiAgICAgKiBAZXh0ZW5kcyBDb252ZXgKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSk7CiAgICAgKiAgICAgdmFyIGJveFNoYXBlID0gbmV3IEJveCh7CiAgICAgKiAgICAgICAgIHdpZHRoOiAyLAogICAgICogICAgICAgICBoZWlnaHQ6IDEKICAgICAqICAgICB9KTsKICAgICAqICAgICBib2R5LmFkZFNoYXBlKGJveFNoYXBlKTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIEJveCQxKG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIC8qKgogICAgICAgKiBUb3RhbCB3aWR0aCBvZiB0aGUgYm94CiAgICAgICAqIEBwcm9wZXJ0eSB3aWR0aAogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLndpZHRoIDogMTsKICAgICAgLyoqCiAgICAgICAqIFRvdGFsIGhlaWdodCBvZiB0aGUgYm94CiAgICAgICAqIEBwcm9wZXJ0eSBoZWlnaHQKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5oZWlnaHQgOiAxOwogICAgICB2YXIgdmVydHMgPSBbdmVjMiQ4LmZyb21WYWx1ZXMoLXdpZHRoIC8gMiwgLWhlaWdodCAvIDIpLCB2ZWMyJDguZnJvbVZhbHVlcyh3aWR0aCAvIDIsIC1oZWlnaHQgLyAyKSwgdmVjMiQ4LmZyb21WYWx1ZXMod2lkdGggLyAyLCBoZWlnaHQgLyAyKSwgdmVjMiQ4LmZyb21WYWx1ZXMoLXdpZHRoIC8gMiwgaGVpZ2h0IC8gMildOwogICAgICB2YXIgY29udmV4T3B0aW9ucyA9IHNoYWxsb3dDbG9uZSQxKG9wdGlvbnMpOwogICAgICBjb252ZXhPcHRpb25zLnZlcnRpY2VzID0gdmVydHM7CiAgICAgIGNvbnZleE9wdGlvbnMudHlwZSA9IFNoYXBlJDQuQk9YOwogICAgICBDb252ZXgkMS5jYWxsKHRoaXMsIGNvbnZleE9wdGlvbnMpOwogICAgfQoKICAgIEJveCQxLnByb3RvdHlwZSA9IG5ldyBDb252ZXgkMSgpOwogICAgQm94JDEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQm94JDE7CiAgICAvKioKICAgICAqIENvbXB1dGUgbW9tZW50IG9mIGluZXJ0aWEKICAgICAqIEBtZXRob2QgY29tcHV0ZU1vbWVudE9mSW5lcnRpYQogICAgICogQHJldHVybiB7TnVtYmVyfQogICAgICovCgogICAgQm94JDEucHJvdG90eXBlLmNvbXB1dGVNb21lbnRPZkluZXJ0aWEgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciB3ID0gdGhpcy53aWR0aCwKICAgICAgICAgIGggPSB0aGlzLmhlaWdodDsKICAgICAgcmV0dXJuIChoICogaCArIHcgKiB3KSAvIDEyOwogICAgfTsKICAgIC8qKgogICAgICogVXBkYXRlIHRoZSBib3VuZGluZyByYWRpdXMKICAgICAqIEBtZXRob2QgdXBkYXRlQm91bmRpbmdSYWRpdXMKICAgICAqLwoKCiAgICBCb3gkMS5wcm90b3R5cGUudXBkYXRlQm91bmRpbmdSYWRpdXMgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciB3ID0gdGhpcy53aWR0aCwKICAgICAgICAgIGggPSB0aGlzLmhlaWdodDsKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IE1hdGguc3FydCh3ICogdyArIGggKiBoKSAvIDI7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNvbXB1dGVBQUJCCiAgICAgKiBAcGFyYW0gIHtBQUJCfSAgIG91dCAgICAgIFRoZSByZXN1bHRpbmcgQUFCQi4KICAgICAqIEBwYXJhbSAge0FycmF5fSAgcG9zaXRpb24KICAgICAqIEBwYXJhbSAge051bWJlcn0gYW5nbGUKICAgICAqLwoKCiAgICBCb3gkMS5wcm90b3R5cGUuY29tcHV0ZUFBQkIgPSBmdW5jdGlvbiAob3V0LCBwb3NpdGlvbiwgYW5nbGUpIHsKICAgICAgdmFyIGMgPSBNYXRoLmFicyhNYXRoLmNvcyhhbmdsZSkpLAogICAgICAgICAgcyA9IE1hdGguYWJzKE1hdGguc2luKGFuZ2xlKSksCiAgICAgICAgICB3ID0gdGhpcy53aWR0aCwKICAgICAgICAgIGggPSB0aGlzLmhlaWdodDsKICAgICAgdmFyIGhlaWdodCA9ICh3ICogcyArIGggKiBjKSAqIDAuNTsKICAgICAgdmFyIHdpZHRoID0gKGggKiBzICsgdyAqIGMpICogMC41OwogICAgICB2YXIgbCA9IG91dC5sb3dlckJvdW5kOwogICAgICB2YXIgdSA9IG91dC51cHBlckJvdW5kOwogICAgICB2YXIgcHggPSBwb3NpdGlvblswXTsKICAgICAgdmFyIHB5ID0gcG9zaXRpb25bMV07CiAgICAgIGxbMF0gPSBweCAtIHdpZHRoOwogICAgICBsWzFdID0gcHkgLSBoZWlnaHQ7CiAgICAgIHVbMF0gPSBweCArIHdpZHRoOwogICAgICB1WzFdID0gcHkgKyBoZWlnaHQ7CiAgICB9OwoKICAgIEJveCQxLnByb3RvdHlwZS51cGRhdGVBcmVhID0gZnVuY3Rpb24gKCkgewogICAgICB0aGlzLmFyZWEgPSB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQ7CiAgICB9OwoKICAgIEJveCQxLnByb3RvdHlwZS5wb2ludFRlc3QgPSBmdW5jdGlvbiAobG9jYWxQb2ludCkgewogICAgICByZXR1cm4gTWF0aC5hYnMobG9jYWxQb2ludFswXSkgPD0gdGhpcy53aWR0aCAqIDAuNSAmJiBNYXRoLmFicyhsb2NhbFBvaW50WzFdKSA8PSB0aGlzLmhlaWdodCAqIDAuNTsKICAgIH07CgogICAgdmFyIHZlYzIkNyA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIHN1YiQxID0gdmVjMiQ3LnN1YnRyYWN0LAogICAgICAgIGFkZCQxID0gdmVjMiQ3LmFkZCwKICAgICAgICBkb3QkMSA9IHZlYzIkNy5kb3QsCiAgICAgICAgcm90YXRlJDEgPSB2ZWMyJDcucm90YXRlLAogICAgICAgIG5vcm1hbGl6ZSA9IHZlYzIkNy5ub3JtYWxpemUsCiAgICAgICAgY29weSQyID0gdmVjMiQ3LmNvcHksCiAgICAgICAgc2NhbGUgPSB2ZWMyJDcuc2NhbGUsCiAgICAgICAgc3F1YXJlZExlbmd0aCA9IHZlYzIkNy5zcXVhcmVkTGVuZ3RoLAogICAgICAgIGNyZWF0ZVZlYzIgPSB2ZWMyJDcuY3JlYXRlLAogICAgICAgIENvbnRhY3RFcXVhdGlvblBvb2wgPSBDb250YWN0RXF1YXRpb25Qb29sXzEsCiAgICAgICAgRnJpY3Rpb25FcXVhdGlvblBvb2wgPSBGcmljdGlvbkVxdWF0aW9uUG9vbF8xLAogICAgICAgIFR1cGxlRGljdGlvbmFyeSQxID0gVHVwbGVEaWN0aW9uYXJ5XzEsCiAgICAgICAgQ2lyY2xlID0gQ2lyY2xlXzEsCiAgICAgICAgQ29udmV4ID0gQ29udmV4XzEsCiAgICAgICAgU2hhcGUkMyA9IFNoYXBlXzEsCiAgICAgICAgQm94ID0gQm94XzE7CgogICAgdmFyIE5hcnJvd3BoYXNlXzEgPSBOYXJyb3dwaGFzZSQxOyAvLyBUZW1wIHRoaW5ncwoKICAgIHZhciB5QXhpcyQyID0gdmVjMiQ3LmZyb21WYWx1ZXMoMCwgMSk7CiAgICB2YXIgdG1wMSA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICB0bXAyID0gY3JlYXRlVmVjMigpLAogICAgICAgIHRtcDMgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wNCA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICB0bXA1ID0gY3JlYXRlVmVjMigpLAogICAgICAgIHRtcDYgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wNyA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICB0bXA4ID0gY3JlYXRlVmVjMigpLAogICAgICAgIHRtcDkgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wMTAgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wMTEgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wMTIgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wMTMgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wMTQgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wMTUgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgdG1wQXJyYXkkMSA9IFtdOwogICAgLyoqCiAgICAgKiBOYXJyb3dwaGFzZS4gQ3JlYXRlcyBjb250YWN0cyBhbmQgZnJpY3Rpb24gZ2l2ZW4gc2hhcGVzIGFuZCB0cmFuc2Zvcm1zLgogICAgICogQGNsYXNzIE5hcnJvd3BoYXNlCiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqLwoKICAgIGZ1bmN0aW9uIE5hcnJvd3BoYXNlJDEoKSB7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkgY29udGFjdEVxdWF0aW9ucwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwogICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMgPSBbXTsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSBmcmljdGlvbkVxdWF0aW9ucwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucyA9IFtdOwogICAgICAvKioKICAgICAgICogV2hldGhlciB0byBtYWtlIGZyaWN0aW9uIGVxdWF0aW9ucyBpbiB0aGUgdXBjb21pbmcgY29udGFjdHMuCiAgICAgICAqIEBwcm9wZXJ0eSBlbmFibGVGcmljdGlvbgogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICovCgogICAgICB0aGlzLmVuYWJsZUZyaWN0aW9uID0gdHJ1ZTsKICAgICAgLyoqCiAgICAgICAqIFdoZXRoZXIgdG8gbWFrZSBlcXVhdGlvbnMgZW5hYmxlZCBpbiB1cGNvbWluZyBjb250YWN0cy4KICAgICAgICogQHByb3BlcnR5IGVuYWJsZWRFcXVhdGlvbnMKICAgICAgICogQHR5cGUge0Jvb2xlYW59CiAgICAgICAqLwoKICAgICAgdGhpcy5lbmFibGVkRXF1YXRpb25zID0gdHJ1ZTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBmcmljdGlvbiBzbGlwIGZvcmNlIHRvIHVzZSB3aGVuIGNyZWF0aW5nIGZyaWN0aW9uIGVxdWF0aW9ucy4KICAgICAgICogQHByb3BlcnR5IHNsaXBGb3JjZQogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMuc2xpcEZvcmNlID0gMTAuMDsKICAgICAgLyoqCiAgICAgICAqIEtlZXBzIHRyYWNrIG9mIHRoZSBhbGxvY2F0ZWQgQ29udGFjdEVxdWF0aW9ucy4KICAgICAgICogQHByb3BlcnR5IHtDb250YWN0RXF1YXRpb25Qb29sfSBjb250YWN0RXF1YXRpb25Qb29sCiAgICAgICAqCiAgICAgICAqIEBleGFtcGxlCiAgICAgICAqCiAgICAgICAqICAgICAvLyBBbGxvY2F0ZSBhIGZldyBlcXVhdGlvbnMgYmVmb3JlIHN0YXJ0aW5nIHRoZSBzaW11bGF0aW9uLgogICAgICAgKiAgICAgLy8gVGhpcyB3YXksIG5vIGNvbnRhY3Qgb2JqZWN0cyBuZWVkIHRvIGJlIGNyZWF0ZWQgb24gdGhlIGZseSBpbiB0aGUgZ2FtZSBsb29wLgogICAgICAgKiAgICAgd29ybGQubmFycm93cGhhc2UuY29udGFjdEVxdWF0aW9uUG9vbC5yZXNpemUoMTAyNCk7CiAgICAgICAqICAgICB3b3JsZC5uYXJyb3dwaGFzZS5mcmljdGlvbkVxdWF0aW9uUG9vbC5yZXNpemUoMTAyNCk7CiAgICAgICAqLwoKICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25Qb29sID0gbmV3IENvbnRhY3RFcXVhdGlvblBvb2woewogICAgICAgIHNpemU6IDMyCiAgICAgIH0pOwogICAgICAvKioKICAgICAgICogS2VlcHMgdHJhY2sgb2YgdGhlIGFsbG9jYXRlZCBDb250YWN0RXF1YXRpb25zLgogICAgICAgKiBAcHJvcGVydHkge0ZyaWN0aW9uRXF1YXRpb25Qb29sfSBmcmljdGlvbkVxdWF0aW9uUG9vbAogICAgICAgKi8KCiAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvblBvb2wgPSBuZXcgRnJpY3Rpb25FcXVhdGlvblBvb2woewogICAgICAgIHNpemU6IDY0CiAgICAgIH0pOwogICAgICAvKioKICAgICAgICogRW5hYmxlIHJlZHVjdGlvbiBvZiBmcmljdGlvbiBlcXVhdGlvbnMuIElmIGRpc2FibGVkLCBhIGJveCBvbiBhIHBsYW5lIHdpbGwgZ2VuZXJhdGUgMiBjb250YWN0IGVxdWF0aW9ucyBhbmQgMiBmcmljdGlvbiBlcXVhdGlvbnMuIElmIGVuYWJsZWQsIHRoZXJlIHdpbGwgYmUgb25seSBvbmUgZnJpY3Rpb24gZXF1YXRpb24uIFNhbWUga2luZCBvZiBzaW1wbGlmaWNhdGlvbnMgYXJlIG1hZGUgIGZvciBhbGwgY29sbGlzaW9uIHR5cGVzLgogICAgICAgKiBAcHJvcGVydHkgZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24KICAgICAgICogQHR5cGUge0Jvb2xlYW59CiAgICAgICAqIEBkZXByZWNhdGVkIFRoaXMgZmxhZyB3aWxsIGJlIHJlbW92ZWQgd2hlbiB0aGUgZmVhdHVyZSBpcyBzdGFibGUgZW5vdWdoLgogICAgICAgKiBAZGVmYXVsdCB0cnVlCiAgICAgICAqLwoKICAgICAgdGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbiA9IHRydWU7CiAgICAgIC8qKgogICAgICAgKiBLZWVwcyB0cmFjayBvZiB0aGUgY29sbGlkaW5nIGJvZGllcyBsYXN0IHN0ZXAuCiAgICAgICAqIEBwcml2YXRlCiAgICAgICAqIEBwcm9wZXJ0eSBjb2xsaWRpbmdCb2RpZXNMYXN0U3RlcAogICAgICAgKiBAdHlwZSB7VHVwbGVEaWN0aW9uYXJ5fQogICAgICAgKi8KCiAgICAgIHRoaXMuY29sbGlkaW5nQm9kaWVzTGFzdFN0ZXAgPSBuZXcgVHVwbGVEaWN0aW9uYXJ5JDEoKTsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSBjdXJyZW50Q29udGFjdE1hdGVyaWFsCiAgICAgICAqIEB0eXBlIHtDb250YWN0TWF0ZXJpYWx9CiAgICAgICAqLwoKICAgICAgdGhpcy5jdXJyZW50Q29udGFjdE1hdGVyaWFsID0gbnVsbDsKICAgIH0KCiAgICB2YXIgYm9kaWVzT3ZlcmxhcF9zaGFwZVBvc2l0aW9uQSA9IGNyZWF0ZVZlYzIoKTsKICAgIHZhciBib2RpZXNPdmVybGFwX3NoYXBlUG9zaXRpb25CID0gY3JlYXRlVmVjMigpOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGJvZGllc092ZXJsYXAKICAgICAqIEBwYXJhbSAge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtICB7Ym9vbGVhbn0gW2NoZWNrQ29sbGlzaW9uTWFza3M9ZmFsc2VdCiAgICAgKiBAcmV0dXJuIHtCb29sZWFufQogICAgICovCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGUuYm9kaWVzT3ZlcmxhcCA9IGZ1bmN0aW9uIChib2R5QSwgYm9keUIsIGNoZWNrQ29sbGlzaW9uTWFza3MpIHsKICAgICAgdmFyIHNoYXBlUG9zaXRpb25BID0gYm9kaWVzT3ZlcmxhcF9zaGFwZVBvc2l0aW9uQTsKICAgICAgdmFyIHNoYXBlUG9zaXRpb25CID0gYm9kaWVzT3ZlcmxhcF9zaGFwZVBvc2l0aW9uQjsgLy8gTG9vcCBvdmVyIGFsbCBzaGFwZXMgb2YgYm9keUEKCiAgICAgIGZvciAodmFyIGsgPSAwLCBOc2hhcGVzaSA9IGJvZHlBLnNoYXBlcy5sZW5ndGg7IGsgIT09IE5zaGFwZXNpOyBrKyspIHsKICAgICAgICB2YXIgc2hhcGVBID0gYm9keUEuc2hhcGVzW2tdOyAvLyBBbGwgc2hhcGVzIG9mIGJvZHkgagoKICAgICAgICBmb3IgKHZhciBsID0gMCwgTnNoYXBlc2ogPSBib2R5Qi5zaGFwZXMubGVuZ3RoOyBsICE9PSBOc2hhcGVzajsgbCsrKSB7CiAgICAgICAgICB2YXIgc2hhcGVCID0gYm9keUIuc2hhcGVzW2xdOyAvLyBDaGVjayBjb2xsaXNpb24gZ3JvdXBzIGFuZCBtYXNrcwoKICAgICAgICAgIGlmIChjaGVja0NvbGxpc2lvbk1hc2tzICYmICEoKHNoYXBlQS5jb2xsaXNpb25Hcm91cCAmIHNoYXBlQi5jb2xsaXNpb25NYXNrKSAhPT0gMCAmJiAoc2hhcGVCLmNvbGxpc2lvbkdyb3VwICYgc2hhcGVBLmNvbGxpc2lvbk1hc2spICE9PSAwKSkgewogICAgICAgICAgICByZXR1cm47CiAgICAgICAgICB9CgogICAgICAgICAgYm9keUEudG9Xb3JsZEZyYW1lKHNoYXBlUG9zaXRpb25BLCBzaGFwZUEucG9zaXRpb24pOwogICAgICAgICAgYm9keUIudG9Xb3JsZEZyYW1lKHNoYXBlUG9zaXRpb25CLCBzaGFwZUIucG9zaXRpb24pOwoKICAgICAgICAgIGlmIChzaGFwZUEudHlwZSA8PSBzaGFwZUIudHlwZSkgewogICAgICAgICAgICBpZiAodGhpc1tzaGFwZUEudHlwZSB8IHNoYXBlQi50eXBlXShib2R5QSwgc2hhcGVBLCBzaGFwZVBvc2l0aW9uQSwgc2hhcGVBLmFuZ2xlICsgYm9keUEuYW5nbGUsIGJvZHlCLCBzaGFwZUIsIHNoYXBlUG9zaXRpb25CLCBzaGFwZUIuYW5nbGUgKyBib2R5Qi5hbmdsZSwgdHJ1ZSkpIHsKICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgICAgfQogICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgaWYgKHRoaXNbc2hhcGVBLnR5cGUgfCBzaGFwZUIudHlwZV0oYm9keUIsIHNoYXBlQiwgc2hhcGVQb3NpdGlvbkIsIHNoYXBlQi5hbmdsZSArIGJvZHlCLmFuZ2xlLCBib2R5QSwgc2hhcGVBLCBzaGFwZVBvc2l0aW9uQSwgc2hhcGVBLmFuZ2xlICsgYm9keUEuYW5nbGUsIHRydWUpKSB7CiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiBmYWxzZTsKICAgIH07CiAgICAvKioKICAgICAqIENoZWNrIGlmIHRoZSBib2RpZXMgd2VyZSBpbiBjb250YWN0IHNpbmNlIHRoZSBsYXN0IHJlc2V0KCkuCiAgICAgKiBAbWV0aG9kIGNvbGxpZGVkTGFzdFN0ZXAKICAgICAqIEBwYXJhbSAge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QgogICAgICogQHJldHVybiB7Qm9vbGVhbn0KICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5jb2xsaWRlZExhc3RTdGVwID0gZnVuY3Rpb24gKGJvZHlBLCBib2R5QikgewogICAgICB2YXIgaWQxID0gYm9keUEuaWQgfCAwLAogICAgICAgICAgaWQyID0gYm9keUIuaWQgfCAwOwogICAgICByZXR1cm4gISF0aGlzLmNvbGxpZGluZ0JvZGllc0xhc3RTdGVwLmdldChpZDEsIGlkMik7CiAgICB9OwogICAgLyoqCiAgICAgKiBUaHJvd3MgYXdheSB0aGUgb2xkIGVxdWF0aW9ucyBhbmQgZ2V0cyByZWFkeSB0byBjcmVhdGUgbmV3CiAgICAgKiBAbWV0aG9kIHJlc2V0CiAgICAgKi8KCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHRoaXMuY29sbGlkaW5nQm9kaWVzTGFzdFN0ZXAucmVzZXQoKTsKICAgICAgdmFyIGVxcyA9IHRoaXMuY29udGFjdEVxdWF0aW9uczsKICAgICAgdmFyIGwgPSBlcXMubGVuZ3RoOwoKICAgICAgd2hpbGUgKGwtLSkgewogICAgICAgIHZhciBlcSA9IGVxc1tsXSwKICAgICAgICAgICAgaWQxID0gZXEuYm9keUEuaWQsCiAgICAgICAgICAgIGlkMiA9IGVxLmJvZHlCLmlkOwogICAgICAgIHRoaXMuY29sbGlkaW5nQm9kaWVzTGFzdFN0ZXAuc2V0KGlkMSwgaWQyLCB0cnVlKTsKICAgICAgfQoKICAgICAgdmFyIGNlID0gdGhpcy5jb250YWN0RXF1YXRpb25zLAogICAgICAgICAgZmUgPSB0aGlzLmZyaWN0aW9uRXF1YXRpb25zOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjZS5sZW5ndGg7IGkrKykgewogICAgICAgIHRoaXMuY29udGFjdEVxdWF0aW9uUG9vbC5yZWxlYXNlKGNlW2ldKTsKICAgICAgfQoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmZS5sZW5ndGg7IGkrKykgewogICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvblBvb2wucmVsZWFzZShmZVtpXSk7CiAgICAgIH0gLy8gUmVzZXQKCgogICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMubGVuZ3RoID0gdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5sZW5ndGggPSAwOwogICAgfTsKICAgIC8qKgogICAgICogQ3JlYXRlcyBhIENvbnRhY3RFcXVhdGlvbiwgZWl0aGVyIGJ5IHJldXNpbmcgYW4gZXhpc3Rpbmcgb2JqZWN0IG9yIGNyZWF0aW5nIGEgbmV3IG9uZS4KICAgICAqIEBtZXRob2QgY3JlYXRlQ29udGFjdEVxdWF0aW9uCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtICB7Qm9keX0gYm9keUIKICAgICAqIEByZXR1cm4ge0NvbnRhY3RFcXVhdGlvbn0KICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5jcmVhdGVDb250YWN0RXF1YXRpb24gPSBmdW5jdGlvbiAoYm9keUEsIGJvZHlCLCBzaGFwZUEsIHNoYXBlQikgewogICAgICB2YXIgYyA9IHRoaXMuY29udGFjdEVxdWF0aW9uUG9vbC5nZXQoKTsKICAgICAgdmFyIGN1cnJlbnRDb250YWN0TWF0ZXJpYWwgPSB0aGlzLmN1cnJlbnRDb250YWN0TWF0ZXJpYWw7CiAgICAgIGMuYm9keUEgPSBib2R5QTsKICAgICAgYy5ib2R5QiA9IGJvZHlCOwogICAgICBjLnNoYXBlQSA9IHNoYXBlQTsKICAgICAgYy5zaGFwZUIgPSBzaGFwZUI7CiAgICAgIGMuZW5hYmxlZCA9IHRoaXMuZW5hYmxlZEVxdWF0aW9uczsKICAgICAgYy5maXJzdEltcGFjdCA9ICF0aGlzLmNvbGxpZGVkTGFzdFN0ZXAoYm9keUEsIGJvZHlCKTsKICAgICAgYy5yZXN0aXR1dGlvbiA9IGN1cnJlbnRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb247CiAgICAgIGMuc3RpZmZuZXNzID0gY3VycmVudENvbnRhY3RNYXRlcmlhbC5zdGlmZm5lc3M7CiAgICAgIGMucmVsYXhhdGlvbiA9IGN1cnJlbnRDb250YWN0TWF0ZXJpYWwucmVsYXhhdGlvbjsKICAgICAgYy5vZmZzZXQgPSBjdXJyZW50Q29udGFjdE1hdGVyaWFsLmNvbnRhY3RTa2luU2l6ZTsKICAgICAgYy5uZWVkc1VwZGF0ZSA9IHRydWU7CiAgICAgIHJldHVybiBjOwogICAgfTsKICAgIC8qKgogICAgICogQ3JlYXRlcyBhIEZyaWN0aW9uRXF1YXRpb24sIGVpdGhlciBieSByZXVzaW5nIGFuIGV4aXN0aW5nIG9iamVjdCBvciBjcmVhdGluZyBhIG5ldyBvbmUuCiAgICAgKiBAbWV0aG9kIGNyZWF0ZUZyaWN0aW9uRXF1YXRpb24KICAgICAqIEBwYXJhbSAge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QgogICAgICogQHJldHVybiB7RnJpY3Rpb25FcXVhdGlvbn0KICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5jcmVhdGVGcmljdGlvbkVxdWF0aW9uID0gZnVuY3Rpb24gKGJvZHlBLCBib2R5Qiwgc2hhcGVBLCBzaGFwZUIpIHsKICAgICAgdmFyIGMgPSB0aGlzLmZyaWN0aW9uRXF1YXRpb25Qb29sLmdldCgpOwogICAgICB2YXIgY3VycmVudENvbnRhY3RNYXRlcmlhbCA9IHRoaXMuY3VycmVudENvbnRhY3RNYXRlcmlhbDsKICAgICAgYy5ib2R5QSA9IGJvZHlBOwogICAgICBjLmJvZHlCID0gYm9keUI7CiAgICAgIGMuc2hhcGVBID0gc2hhcGVBOwogICAgICBjLnNoYXBlQiA9IHNoYXBlQjsKICAgICAgYy5zZXRTbGlwRm9yY2UodGhpcy5zbGlwRm9yY2UpOwogICAgICBjLmVuYWJsZWQgPSB0aGlzLmVuYWJsZWRFcXVhdGlvbnM7CiAgICAgIGMuZnJpY3Rpb25Db2VmZmljaWVudCA9IGN1cnJlbnRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb247CiAgICAgIGMucmVsYXRpdmVWZWxvY2l0eSA9IGN1cnJlbnRDb250YWN0TWF0ZXJpYWwuc3VyZmFjZVZlbG9jaXR5OwogICAgICBjLnN0aWZmbmVzcyA9IGN1cnJlbnRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb25TdGlmZm5lc3M7CiAgICAgIGMucmVsYXhhdGlvbiA9IGN1cnJlbnRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb25SZWxheGF0aW9uOwogICAgICBjLm5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgYy5jb250YWN0RXF1YXRpb25zLmxlbmd0aCA9IDA7CiAgICAgIHJldHVybiBjOwogICAgfTsKICAgIC8qKgogICAgICogQ3JlYXRlcyBhIEZyaWN0aW9uRXF1YXRpb24gZ2l2ZW4gdGhlIGRhdGEgaW4gdGhlIENvbnRhY3RFcXVhdGlvbi4gVXNlcyBzYW1lIG9mZnNldCB2ZWN0b3JzIHJpIGFuZCByaiwgYnV0IHRoZSB0YW5nZW50IHZlY3RvciB3aWxsIGJlIGNvbnN0cnVjdGVkIGZyb20gdGhlIGNvbGxpc2lvbiBub3JtYWwuCiAgICAgKiBAbWV0aG9kIGNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QKICAgICAqIEBwYXJhbSAge0NvbnRhY3RFcXVhdGlvbn0gY29udGFjdEVxdWF0aW9uCiAgICAgKiBAcmV0dXJuIHtGcmljdGlvbkVxdWF0aW9ufQogICAgICovCgoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QgPSBmdW5jdGlvbiAoYykgewogICAgICB2YXIgZXEgPSB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb24oYy5ib2R5QSwgYy5ib2R5QiwgYy5zaGFwZUEsIGMuc2hhcGVCKTsKICAgICAgY29weSQyKGVxLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSk7CiAgICAgIGNvcHkkMihlcS5jb250YWN0UG9pbnRCLCBjLmNvbnRhY3RQb2ludEIpOwogICAgICB2ZWMyJDcucm90YXRlOTBjdyhlcS50LCBjLm5vcm1hbEEpOwogICAgICBlcS5jb250YWN0RXF1YXRpb25zLnB1c2goYyk7CiAgICAgIHJldHVybiBlcTsKICAgIH07IC8vIFRha2UgdGhlIGF2ZXJhZ2UgTiBsYXRlc3QgY29udGFjdCBwb2ludCBvbiB0aGUgcGxhbmUuCgoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLmNyZWF0ZUZyaWN0aW9uRnJvbUF2ZXJhZ2UgPSBmdW5jdGlvbiAobnVtQ29udGFjdHMpIHsKICAgICAgdmFyIGMgPSB0aGlzLmNvbnRhY3RFcXVhdGlvbnNbdGhpcy5jb250YWN0RXF1YXRpb25zLmxlbmd0aCAtIDFdOwogICAgICB2YXIgZXEgPSB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb24oYy5ib2R5QSwgYy5ib2R5QiwgYy5zaGFwZUEsIGMuc2hhcGVCKTsKICAgICAgdmFyIGJvZHlBID0gYy5ib2R5QTsKICAgICAgdmVjMiQ3LnNldChlcS5jb250YWN0UG9pbnRBLCAwLCAwKTsKICAgICAgdmVjMiQ3LnNldChlcS5jb250YWN0UG9pbnRCLCAwLCAwKTsKICAgICAgdmVjMiQ3LnNldChlcS50LCAwLCAwKTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSBudW1Db250YWN0czsgaSsrKSB7CiAgICAgICAgYyA9IHRoaXMuY29udGFjdEVxdWF0aW9uc1t0aGlzLmNvbnRhY3RFcXVhdGlvbnMubGVuZ3RoIC0gMSAtIGldOwoKICAgICAgICBpZiAoYy5ib2R5QSA9PT0gYm9keUEpIHsKICAgICAgICAgIGFkZCQxKGVxLnQsIGVxLnQsIGMubm9ybWFsQSk7CiAgICAgICAgICBhZGQkMShlcS5jb250YWN0UG9pbnRBLCBlcS5jb250YWN0UG9pbnRBLCBjLmNvbnRhY3RQb2ludEEpOwogICAgICAgICAgYWRkJDEoZXEuY29udGFjdFBvaW50QiwgZXEuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgc3ViJDEoZXEudCwgZXEudCwgYy5ub3JtYWxBKTsKICAgICAgICAgIGFkZCQxKGVxLmNvbnRhY3RQb2ludEEsIGVxLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50Qik7CiAgICAgICAgICBhZGQkMShlcS5jb250YWN0UG9pbnRCLCBlcS5jb250YWN0UG9pbnRCLCBjLmNvbnRhY3RQb2ludEEpOwogICAgICAgIH0KCiAgICAgICAgZXEuY29udGFjdEVxdWF0aW9ucy5wdXNoKGMpOwogICAgICB9CgogICAgICB2YXIgaW52TnVtQ29udGFjdHMgPSAxIC8gbnVtQ29udGFjdHM7CiAgICAgIHNjYWxlKGVxLmNvbnRhY3RQb2ludEEsIGVxLmNvbnRhY3RQb2ludEEsIGludk51bUNvbnRhY3RzKTsKICAgICAgc2NhbGUoZXEuY29udGFjdFBvaW50QiwgZXEuY29udGFjdFBvaW50QiwgaW52TnVtQ29udGFjdHMpOwogICAgICBub3JtYWxpemUoZXEudCwgZXEudCk7CiAgICAgIHZlYzIkNy5yb3RhdGU5MGN3KGVxLnQsIGVxLnQpOwogICAgICByZXR1cm4gZXE7CiAgICB9OwogICAgLyoqCiAgICAgKiBDb252ZXgvbGluZSBuYXJyb3dwaGFzZQogICAgICogQG1ldGhvZCBjb252ZXhMaW5lCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICBjb252ZXhCb2R5CiAgICAgKiBAcGFyYW0gIHtDb252ZXh9ICAgICBjb252ZXhTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgY29udmV4T2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBjb252ZXhBbmdsZQogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgbGluZUJvZHkKICAgICAqIEBwYXJhbSAge0xpbmV9ICAgICAgIGxpbmVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgbGluZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgbGluZUFuZ2xlCiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59ICAgICBqdXN0VGVzdAogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICogQHRvZG8gSW1wbGVtZW50IG1lIQogICAgICovCgoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQ09OVkVYIHwgU2hhcGUkMy5MSU5FXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLmNvbnZleExpbmUgPSBmdW5jdGlvbgogICAgICAvKgogICAgICBjb252ZXhCb2R5LAogICAgICBjb252ZXhTaGFwZSwKICAgICAgY29udmV4T2Zmc2V0LAogICAgICBjb252ZXhBbmdsZSwKICAgICAgbGluZUJvZHksCiAgICAgIGxpbmVTaGFwZSwKICAgICAgbGluZU9mZnNldCwKICAgICAgbGluZUFuZ2xlLAogICAgICBqdXN0VGVzdAogICAgICAqLwogICAgKCkgewogICAgICAvLyBUT0RPCiAgICAgIHJldHVybiAwOwogICAgfTsKICAgIC8qKgogICAgICogTGluZS9ib3ggbmFycm93cGhhc2UKICAgICAqIEBtZXRob2QgbGluZUJveAogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgbGluZUJvZHkKICAgICAqIEBwYXJhbSAge0xpbmV9ICAgICAgIGxpbmVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgbGluZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgbGluZUFuZ2xlCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICBib3hCb2R5CiAgICAgKiBAcGFyYW0gIHtCb3h9ICBib3hTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgYm94T2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBib3hBbmdsZQogICAgICogQHBhcmFtICB7Qm9vbGVhbn0gICAganVzdFRlc3QKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqIEB0b2RvIEltcGxlbWVudCBtZSEKICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkxJTkUgfCBTaGFwZSQzLkJPWF0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5saW5lQm94ID0gZnVuY3Rpb24KICAgICAgLyoKICAgICAgbGluZUJvZHksCiAgICAgIGxpbmVTaGFwZSwKICAgICAgbGluZU9mZnNldCwKICAgICAgbGluZUFuZ2xlLAogICAgICBib3hCb2R5LAogICAgICBib3hTaGFwZSwKICAgICAgYm94T2Zmc2V0LAogICAgICBib3hBbmdsZSwKICAgICAganVzdFRlc3QKICAgICAgKi8KICAgICgpIHsKICAgICAgLy8gVE9ETwogICAgICByZXR1cm4gMDsKICAgIH07CgogICAgZnVuY3Rpb24gc2V0Q29udmV4VG9DYXBzdWxlU2hhcGVNaWRkbGUoY29udmV4U2hhcGUsIGNhcHN1bGVTaGFwZSkgewogICAgICB2YXIgY2Fwc3VsZVJhZGl1cyA9IGNhcHN1bGVTaGFwZS5yYWRpdXM7CiAgICAgIHZhciBoYWxmQ2Fwc3VsZUxlbmd0aCA9IGNhcHN1bGVTaGFwZS5sZW5ndGggKiAwLjU7CiAgICAgIHZhciB2ZXJ0cyA9IGNvbnZleFNoYXBlLnZlcnRpY2VzOwogICAgICB2ZWMyJDcuc2V0KHZlcnRzWzBdLCAtaGFsZkNhcHN1bGVMZW5ndGgsIC1jYXBzdWxlUmFkaXVzKTsKICAgICAgdmVjMiQ3LnNldCh2ZXJ0c1sxXSwgaGFsZkNhcHN1bGVMZW5ndGgsIC1jYXBzdWxlUmFkaXVzKTsKICAgICAgdmVjMiQ3LnNldCh2ZXJ0c1syXSwgaGFsZkNhcHN1bGVMZW5ndGgsIGNhcHN1bGVSYWRpdXMpOwogICAgICB2ZWMyJDcuc2V0KHZlcnRzWzNdLCAtaGFsZkNhcHN1bGVMZW5ndGgsIGNhcHN1bGVSYWRpdXMpOwogICAgfQoKICAgIHZhciBjb252ZXhDYXBzdWxlX3RlbXBSZWN0ID0gbmV3IEJveCh7CiAgICAgIHdpZHRoOiAxLAogICAgICBoZWlnaHQ6IDEKICAgIH0pLAogICAgICAgIGNvbnZleENhcHN1bGVfdGVtcFZlYyA9IGNyZWF0ZVZlYzIoKTsKICAgIC8qKgogICAgICogQ29udmV4L2NhcHN1bGUgbmFycm93cGhhc2UKICAgICAqIEBtZXRob2QgY29udmV4Q2Fwc3VsZQogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgY29udmV4Qm9keQogICAgICogQHBhcmFtICB7Q29udmV4fSAgICAgY29udmV4U2hhcGUKICAgICAqIEBwYXJhbSAge0FycmF5fSAgICAgIGNvbnZleFBvc2l0aW9uCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBjb252ZXhBbmdsZQogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgY2Fwc3VsZUJvZHkKICAgICAqIEBwYXJhbSAge0NhcHN1bGV9ICAgIGNhcHN1bGVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgY2Fwc3VsZVBvc2l0aW9uCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBjYXBzdWxlQW5nbGUKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQ09OVkVYIHwgU2hhcGUkMy5DQVBTVUxFXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQk9YIHwgU2hhcGUkMy5DQVBTVUxFXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLmNvbnZleENhcHN1bGUgPSBmdW5jdGlvbiAoY29udmV4Qm9keSwgY29udmV4U2hhcGUsIGNvbnZleFBvc2l0aW9uLCBjb252ZXhBbmdsZSwgY2Fwc3VsZUJvZHksIGNhcHN1bGVTaGFwZSwgY2Fwc3VsZVBvc2l0aW9uLCBjYXBzdWxlQW5nbGUsIGp1c3RUZXN0KSB7CiAgICAgIC8vIENoZWNrIHRoZSBjaXJjbGVzCiAgICAgIC8vIEFkZCBvZmZzZXRzIQogICAgICB2YXIgY2lyY2xlUG9zID0gY29udmV4Q2Fwc3VsZV90ZW1wVmVjOwogICAgICB2YXIgaGFsZkxlbmd0aCA9IGNhcHN1bGVTaGFwZS5sZW5ndGggLyAyOwogICAgICB2ZWMyJDcuc2V0KGNpcmNsZVBvcywgaGFsZkxlbmd0aCwgMCk7CiAgICAgIHZlYzIkNy50b0dsb2JhbEZyYW1lKGNpcmNsZVBvcywgY2lyY2xlUG9zLCBjYXBzdWxlUG9zaXRpb24sIGNhcHN1bGVBbmdsZSk7CiAgICAgIHZhciByZXN1bHQxID0gdGhpcy5jaXJjbGVDb252ZXgoY2Fwc3VsZUJvZHksIGNhcHN1bGVTaGFwZSwgY2lyY2xlUG9zLCBjYXBzdWxlQW5nbGUsIGNvbnZleEJvZHksIGNvbnZleFNoYXBlLCBjb252ZXhQb3NpdGlvbiwgY29udmV4QW5nbGUsIGp1c3RUZXN0LCBjYXBzdWxlU2hhcGUucmFkaXVzKTsKICAgICAgdmVjMiQ3LnNldChjaXJjbGVQb3MsIC1oYWxmTGVuZ3RoLCAwKTsKICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUoY2lyY2xlUG9zLCBjaXJjbGVQb3MsIGNhcHN1bGVQb3NpdGlvbiwgY2Fwc3VsZUFuZ2xlKTsKICAgICAgdmFyIHJlc3VsdDIgPSB0aGlzLmNpcmNsZUNvbnZleChjYXBzdWxlQm9keSwgY2Fwc3VsZVNoYXBlLCBjaXJjbGVQb3MsIGNhcHN1bGVBbmdsZSwgY29udmV4Qm9keSwgY29udmV4U2hhcGUsIGNvbnZleFBvc2l0aW9uLCBjb252ZXhBbmdsZSwganVzdFRlc3QsIGNhcHN1bGVTaGFwZS5yYWRpdXMpOwoKICAgICAgaWYgKGp1c3RUZXN0ICYmIHJlc3VsdDEgKyByZXN1bHQyICE9PSAwKSB7CiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0gLy8gQ2hlY2sgY2VudGVyIHJlY3QKCgogICAgICB2YXIgciA9IGNvbnZleENhcHN1bGVfdGVtcFJlY3Q7CiAgICAgIHNldENvbnZleFRvQ2Fwc3VsZVNoYXBlTWlkZGxlKHIsIGNhcHN1bGVTaGFwZSk7CiAgICAgIHZhciByZXN1bHQgPSB0aGlzLmNvbnZleENvbnZleChjb252ZXhCb2R5LCBjb252ZXhTaGFwZSwgY29udmV4UG9zaXRpb24sIGNvbnZleEFuZ2xlLCBjYXBzdWxlQm9keSwgciwgY2Fwc3VsZVBvc2l0aW9uLCBjYXBzdWxlQW5nbGUsIGp1c3RUZXN0KTsKICAgICAgcmV0dXJuIHJlc3VsdCArIHJlc3VsdDEgKyByZXN1bHQyOwogICAgfTsKICAgIC8qKgogICAgICogQ2Fwc3VsZS9saW5lIG5hcnJvd3BoYXNlCiAgICAgKiBAbWV0aG9kIGxpbmVDYXBzdWxlCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICBsaW5lQm9keQogICAgICogQHBhcmFtICB7TGluZX0gICAgICAgbGluZVNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gICAgICBsaW5lUG9zaXRpb24KICAgICAqIEBwYXJhbSAge051bWJlcn0gICAgIGxpbmVBbmdsZQogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgY2Fwc3VsZUJvZHkKICAgICAqIEBwYXJhbSAge0NhcHN1bGV9ICAgIGNhcHN1bGVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgY2Fwc3VsZVBvc2l0aW9uCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBjYXBzdWxlQW5nbGUKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqIEB0b2RvIEltcGxlbWVudCBtZSEKICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkxJTkUgfCBTaGFwZSQzLkNBUFNVTEVdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUubGluZUNhcHN1bGUgPSBmdW5jdGlvbgogICAgICAvKgogICAgICBsaW5lQm9keSwKICAgICAgbGluZVNoYXBlLAogICAgICBsaW5lUG9zaXRpb24sCiAgICAgIGxpbmVBbmdsZSwKICAgICAgY2Fwc3VsZUJvZHksCiAgICAgIGNhcHN1bGVTaGFwZSwKICAgICAgY2Fwc3VsZVBvc2l0aW9uLAogICAgICBjYXBzdWxlQW5nbGUsCiAgICAgIGp1c3RUZXN0CiAgICAgICovCiAgICAoKSB7CiAgICAgIC8vIFRPRE8KICAgICAgcmV0dXJuIDA7CiAgICB9OwoKICAgIHZhciBjYXBzdWxlQ2Fwc3VsZV90ZW1wVmVjMSA9IGNyZWF0ZVZlYzIoKTsKICAgIHZhciBjYXBzdWxlQ2Fwc3VsZV90ZW1wVmVjMiA9IGNyZWF0ZVZlYzIoKTsKICAgIHZhciBjYXBzdWxlQ2Fwc3VsZV90ZW1wUmVjdDEgPSBuZXcgQm94KHsKICAgICAgd2lkdGg6IDEsCiAgICAgIGhlaWdodDogMQogICAgfSk7CiAgICAvKioKICAgICAqIENhcHN1bGUvY2Fwc3VsZSBuYXJyb3dwaGFzZQogICAgICogQG1ldGhvZCBjYXBzdWxlQ2Fwc3VsZQogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgYmkKICAgICAqIEBwYXJhbSAge0NhcHN1bGV9ICAgIHNpCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gICAgICB4aQogICAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgYWkKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgICAgIGJqCiAgICAgKiBAcGFyYW0gIHtDYXBzdWxlfSAgICBzagogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgeGoKICAgICAqIEBwYXJhbSAge051bWJlcn0gICAgIGFqCiAgICAgKi8KCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkNBUFNVTEVdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUuY2Fwc3VsZUNhcHN1bGUgPSBmdW5jdGlvbiAoYmksIHNpLCB4aSwgYWksIGJqLCBzaiwgeGosIGFqLCBqdXN0VGVzdCkgewogICAgICB2YXIgZW5hYmxlRnJpY3Rpb25CZWZvcmU7IC8vIENoZWNrIHRoZSBjaXJjbGVzCiAgICAgIC8vIEFkZCBvZmZzZXRzIQoKICAgICAgdmFyIGNpcmNsZVBvc2kgPSBjYXBzdWxlQ2Fwc3VsZV90ZW1wVmVjMSwKICAgICAgICAgIGNpcmNsZVBvc2ogPSBjYXBzdWxlQ2Fwc3VsZV90ZW1wVmVjMjsKICAgICAgdmFyIG51bUNvbnRhY3RzID0gMDsgLy8gTmVlZCA0IGNpcmNsZSBjaGVja3MsIGJldHdlZW4gYWxsCgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykgewogICAgICAgIHZlYzIkNy5zZXQoY2lyY2xlUG9zaSwgKGkgPT09IDAgPyAtMSA6IDEpICogc2kubGVuZ3RoIC8gMiwgMCk7CiAgICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUoY2lyY2xlUG9zaSwgY2lyY2xlUG9zaSwgeGksIGFpKTsKCiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAyOyBqKyspIHsKICAgICAgICAgIHZlYzIkNy5zZXQoY2lyY2xlUG9zaiwgKGogPT09IDAgPyAtMSA6IDEpICogc2oubGVuZ3RoIC8gMiwgMCk7CiAgICAgICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZShjaXJjbGVQb3NqLCBjaXJjbGVQb3NqLCB4aiwgYWopOyAvLyBUZW1wb3JhcmlseSB0dXJuIG9mZiBmcmljdGlvbgoKICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgICAgIGVuYWJsZUZyaWN0aW9uQmVmb3JlID0gdGhpcy5lbmFibGVGcmljdGlvbjsKICAgICAgICAgICAgdGhpcy5lbmFibGVGcmljdGlvbiA9IGZhbHNlOwogICAgICAgICAgfQoKICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmNpcmNsZUNpcmNsZShiaSwgc2ksIGNpcmNsZVBvc2ksIGFpLCBiaiwgc2osIGNpcmNsZVBvc2osIGFqLCBqdXN0VGVzdCwgc2kucmFkaXVzLCBzai5yYWRpdXMpOwoKICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgICAgIHRoaXMuZW5hYmxlRnJpY3Rpb24gPSBlbmFibGVGcmljdGlvbkJlZm9yZTsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoanVzdFRlc3QgJiYgcmVzdWx0ICE9PSAwKSB7CiAgICAgICAgICAgIHJldHVybiAxOwogICAgICAgICAgfQoKICAgICAgICAgIG51bUNvbnRhY3RzICs9IHJlc3VsdDsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgLy8gVGVtcG9yYXJpbHkgdHVybiBvZmYgZnJpY3Rpb24KICAgICAgICBlbmFibGVGcmljdGlvbkJlZm9yZSA9IHRoaXMuZW5hYmxlRnJpY3Rpb247CiAgICAgICAgdGhpcy5lbmFibGVGcmljdGlvbiA9IGZhbHNlOwogICAgICB9IC8vIENoZWNrIGNpcmNsZXMgYWdhaW5zdCB0aGUgY2VudGVyIGJveHMKCgogICAgICB2YXIgcmVjdCA9IGNhcHN1bGVDYXBzdWxlX3RlbXBSZWN0MTsKICAgICAgc2V0Q29udmV4VG9DYXBzdWxlU2hhcGVNaWRkbGUocmVjdCwgc2kpOwogICAgICB2YXIgcmVzdWx0MSA9IHRoaXMuY29udmV4Q2Fwc3VsZShiaSwgcmVjdCwgeGksIGFpLCBiaiwgc2osIHhqLCBhaiwganVzdFRlc3QpOwoKICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24pIHsKICAgICAgICB0aGlzLmVuYWJsZUZyaWN0aW9uID0gZW5hYmxlRnJpY3Rpb25CZWZvcmU7CiAgICAgIH0KCiAgICAgIGlmIChqdXN0VGVzdCAmJiByZXN1bHQxICE9PSAwKSB7CiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0KCiAgICAgIG51bUNvbnRhY3RzICs9IHJlc3VsdDE7CgogICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbikgewogICAgICAgIC8vIFRlbXBvcmFyaWx5IHR1cm4gb2ZmIGZyaWN0aW9uCiAgICAgICAgdmFyIGVuYWJsZUZyaWN0aW9uQmVmb3JlID0gdGhpcy5lbmFibGVGcmljdGlvbjsKICAgICAgICB0aGlzLmVuYWJsZUZyaWN0aW9uID0gZmFsc2U7CiAgICAgIH0KCiAgICAgIHNldENvbnZleFRvQ2Fwc3VsZVNoYXBlTWlkZGxlKHJlY3QsIHNqKTsKICAgICAgdmFyIHJlc3VsdDIgPSB0aGlzLmNvbnZleENhcHN1bGUoYmosIHJlY3QsIHhqLCBhaiwgYmksIHNpLCB4aSwgYWksIGp1c3RUZXN0KTsKCiAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgdGhpcy5lbmFibGVGcmljdGlvbiA9IGVuYWJsZUZyaWN0aW9uQmVmb3JlOwogICAgICB9CgogICAgICBpZiAoanVzdFRlc3QgJiYgcmVzdWx0MiAhPT0gMCkgewogICAgICAgIHJldHVybiAxOwogICAgICB9CgogICAgICBudW1Db250YWN0cyArPSByZXN1bHQyOwoKICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24pIHsKICAgICAgICBpZiAobnVtQ29udGFjdHMgJiYgdGhpcy5lbmFibGVGcmljdGlvbikgewogICAgICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5wdXNoKHRoaXMuY3JlYXRlRnJpY3Rpb25Gcm9tQXZlcmFnZShudW1Db250YWN0cykpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG51bUNvbnRhY3RzOwogICAgfTsKICAgIC8qKgogICAgICogTGluZS9saW5lIG5hcnJvd3BoYXNlCiAgICAgKiBAbWV0aG9kIGxpbmVMaW5lCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICBib2R5QQogICAgICogQHBhcmFtICB7TGluZX0gICAgICAgc2hhcGVBCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gICAgICBwb3NpdGlvbkEKICAgICAqIEBwYXJhbSAge051bWJlcn0gICAgIGFuZ2xlQQogICAgICogQHBhcmFtICB7Qm9keX0gICAgICAgYm9keUIKICAgICAqIEBwYXJhbSAge0xpbmV9ICAgICAgIHNoYXBlQgogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgcG9zaXRpb25CCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBhbmdsZUIKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqIEB0b2RvIEltcGxlbWVudCBtZSEKICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkxJTkVdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUubGluZUxpbmUgPSBmdW5jdGlvbgogICAgICAvKiBib2R5QSwKICAgICAgIHNoYXBlQSwKICAgICAgIHBvc2l0aW9uQSwKICAgICAgIGFuZ2xlQSwKICAgICAgIGJvZHlCLAogICAgICAgc2hhcGVCLAogICAgICAgcG9zaXRpb25CLAogICAgICAgYW5nbGVCLAogICAgICAganVzdFRlc3QqLwogICAgKCkgewogICAgICAvLyBUT0RPCiAgICAgIHJldHVybiAwOwogICAgfTsKICAgIC8qKgogICAgICogUGxhbmUvbGluZSBOYXJyb3dwaGFzZQogICAgICogQG1ldGhvZCBwbGFuZUxpbmUKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgcGxhbmVCb2R5CiAgICAgKiBAcGFyYW0gIHtQbGFuZX0gIHBsYW5lU2hhcGUKICAgICAqIEBwYXJhbSAge0FycmF5fSAgcGxhbmVPZmZzZXQKICAgICAqIEBwYXJhbSAge051bWJlcn0gcGxhbmVBbmdsZQogICAgICogQHBhcmFtICB7Qm9keX0gICBsaW5lQm9keQogICAgICogQHBhcmFtICB7TGluZX0gICBsaW5lU2hhcGUKICAgICAqIEBwYXJhbSAge0FycmF5fSAgbGluZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBsaW5lQW5nbGUKICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLlBMQU5FIHwgU2hhcGUkMy5MSU5FXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLnBsYW5lTGluZSA9IGZ1bmN0aW9uIChwbGFuZUJvZHksIHBsYW5lU2hhcGUsIHBsYW5lT2Zmc2V0LCBwbGFuZUFuZ2xlLCBsaW5lQm9keSwgbGluZVNoYXBlLCBsaW5lT2Zmc2V0LCBsaW5lQW5nbGUsIGp1c3RUZXN0KSB7CiAgICAgIHZhciB3b3JsZFZlcnRleDAgPSB0bXAxLAogICAgICAgICAgd29ybGRWZXJ0ZXgxID0gdG1wMiwKICAgICAgICAgIHdvcmxkVmVydGV4MDEgPSB0bXAzLAogICAgICAgICAgd29ybGRWZXJ0ZXgxMSA9IHRtcDQsCiAgICAgICAgICB3b3JsZEVkZ2UgPSB0bXA1LAogICAgICAgICAgd29ybGRFZGdlVW5pdCA9IHRtcDYsCiAgICAgICAgICBkaXN0ID0gdG1wNywKICAgICAgICAgIHdvcmxkTm9ybWFsID0gdG1wOCwKICAgICAgICAgIHdvcmxkVGFuZ2VudCA9IHRtcDksCiAgICAgICAgICB2ZXJ0cyA9IHRtcEFycmF5JDEsCiAgICAgICAgICBudW1Db250YWN0cyA9IDA7IC8vIEdldCBzdGFydCBhbmQgZW5kIHBvaW50cwoKICAgICAgdmVjMiQ3LnNldCh3b3JsZFZlcnRleDAsIC1saW5lU2hhcGUubGVuZ3RoIC8gMiwgMCk7CiAgICAgIHZlYzIkNy5zZXQod29ybGRWZXJ0ZXgxLCBsaW5lU2hhcGUubGVuZ3RoIC8gMiwgMCk7IC8vIE5vdCBzdXJlIHdoeSB3ZSBoYXZlIHRvIHVzZSB3b3JsZFZlcnRleCoxIGhlcmUsIGJ1dCBpdCB3b24ndCB3b3JrIG90aGVyd2lzZS4gVGlyZWQuCgogICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZSh3b3JsZFZlcnRleDAxLCB3b3JsZFZlcnRleDAsIGxpbmVPZmZzZXQsIGxpbmVBbmdsZSk7CiAgICAgIHZlYzIkNy50b0dsb2JhbEZyYW1lKHdvcmxkVmVydGV4MTEsIHdvcmxkVmVydGV4MSwgbGluZU9mZnNldCwgbGluZUFuZ2xlKTsKICAgICAgY29weSQyKHdvcmxkVmVydGV4MCwgd29ybGRWZXJ0ZXgwMSk7CiAgICAgIGNvcHkkMih3b3JsZFZlcnRleDEsIHdvcmxkVmVydGV4MTEpOyAvLyBHZXQgdmVjdG9yIGFsb25nIHRoZSBsaW5lCgogICAgICBzdWIkMSh3b3JsZEVkZ2UsIHdvcmxkVmVydGV4MSwgd29ybGRWZXJ0ZXgwKTsKICAgICAgbm9ybWFsaXplKHdvcmxkRWRnZVVuaXQsIHdvcmxkRWRnZSk7IC8vIEdldCB0YW5nZW50IHRvIHRoZSBlZGdlLgoKICAgICAgdmVjMiQ3LnJvdGF0ZTkwY3cod29ybGRUYW5nZW50LCB3b3JsZEVkZ2VVbml0KTsKICAgICAgcm90YXRlJDEod29ybGROb3JtYWwsIHlBeGlzJDIsIHBsYW5lQW5nbGUpOyAvLyBDaGVjayBsaW5lIGVuZHMKCiAgICAgIHZlcnRzWzBdID0gd29ybGRWZXJ0ZXgwOwogICAgICB2ZXJ0c1sxXSA9IHdvcmxkVmVydGV4MTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmVydHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgdiA9IHZlcnRzW2ldOwogICAgICAgIHN1YiQxKGRpc3QsIHYsIHBsYW5lT2Zmc2V0KTsKICAgICAgICB2YXIgZCA9IGRvdCQxKGRpc3QsIHdvcmxkTm9ybWFsKTsKCiAgICAgICAgaWYgKGQgPCAwKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgICB9CgogICAgICAgICAgdmFyIGMgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihwbGFuZUJvZHksIGxpbmVCb2R5LCBwbGFuZVNoYXBlLCBsaW5lU2hhcGUpOwogICAgICAgICAgbnVtQ29udGFjdHMrKzsKICAgICAgICAgIGNvcHkkMihjLm5vcm1hbEEsIHdvcmxkTm9ybWFsKTsKICAgICAgICAgIG5vcm1hbGl6ZShjLm5vcm1hbEEsIGMubm9ybWFsQSk7IC8vIGRpc3RhbmNlIHZlY3RvciBhbG9uZyBwbGFuZSBub3JtYWwKCiAgICAgICAgICBzY2FsZShkaXN0LCB3b3JsZE5vcm1hbCwgZCk7IC8vIFZlY3RvciBmcm9tIHBsYW5lIGNlbnRlciB0byBjb250YWN0CgogICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRBLCB2LCBkaXN0KTsKICAgICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QSwgYy5jb250YWN0UG9pbnRBLCBwbGFuZUJvZHkucG9zaXRpb24pOyAvLyBGcm9tIGxpbmUgY2VudGVyIHRvIGNvbnRhY3QKCiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEIsIHYsIGxpbmVPZmZzZXQpOwogICAgICAgICAgYWRkJDEoYy5jb250YWN0UG9pbnRCLCBjLmNvbnRhY3RQb2ludEIsIGxpbmVPZmZzZXQpOwogICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRCLCBjLmNvbnRhY3RQb2ludEIsIGxpbmVCb2R5LnBvc2l0aW9uKTsKICAgICAgICAgIHRoaXMuY29udGFjdEVxdWF0aW9ucy5wdXNoKGMpOwoKICAgICAgICAgIGlmICghdGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbikgewogICAgICAgICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvbikgewogICAgICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICByZXR1cm4gMDsKICAgICAgfQoKICAgICAgaWYgKCF0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgaWYgKG51bUNvbnRhY3RzICYmIHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUF2ZXJhZ2UobnVtQ29udGFjdHMpKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiBudW1Db250YWN0czsKICAgIH07CgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5QQVJUSUNMRSB8IFNoYXBlJDMuQ0FQU1VMRV0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5wYXJ0aWNsZUNhcHN1bGUgPSBmdW5jdGlvbiAocGFydGljbGVCb2R5LCBwYXJ0aWNsZVNoYXBlLCBwYXJ0aWNsZVBvc2l0aW9uLCBwYXJ0aWNsZUFuZ2xlLCBjYXBzdWxlQm9keSwgY2Fwc3VsZVNoYXBlLCBjYXBzdWxlUG9zaXRpb24sIGNhcHN1bGVBbmdsZSwganVzdFRlc3QpIHsKICAgICAgcmV0dXJuIHRoaXMuY2lyY2xlTGluZShwYXJ0aWNsZUJvZHksIHBhcnRpY2xlU2hhcGUsIHBhcnRpY2xlUG9zaXRpb24sIHBhcnRpY2xlQW5nbGUsIGNhcHN1bGVCb2R5LCBjYXBzdWxlU2hhcGUsIGNhcHN1bGVQb3NpdGlvbiwgY2Fwc3VsZUFuZ2xlLCBqdXN0VGVzdCwgY2Fwc3VsZVNoYXBlLnJhZGl1cywgMCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBDaXJjbGUvbGluZSBOYXJyb3dwaGFzZQogICAgICogQG1ldGhvZCBjaXJjbGVMaW5lCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBjaXJjbGVCb2R5CiAgICAgKiBAcGFyYW0gIHtDaXJjbGV9IGNpcmNsZVNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gY2lyY2xlT2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGNpcmNsZUFuZ2xlCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBsaW5lQm9keQogICAgICogQHBhcmFtICB7TGluZX0gbGluZVNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gbGluZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBsaW5lQW5nbGUKICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0ganVzdFRlc3QgSWYgc2V0IHRvIHRydWUsIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCAoaW50ZXJzZWN0aW9uIG9yIG5vdCkgd2l0aG91dCBhZGRpbmcgZXF1YXRpb25zLgogICAgICogQHBhcmFtIHtOdW1iZXJ9IGxpbmVSYWRpdXMgUmFkaXVzIHRvIGFkZCB0byB0aGUgbGluZS4gQ2FuIGJlIHVzZWQgdG8gdGVzdCBDYXBzdWxlcy4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjaXJjbGVSYWRpdXMgSWYgc2V0LCB0aGlzIHZhbHVlIG92ZXJyaWRlcyB0aGUgY2lyY2xlIHNoYXBlIHJhZGl1cy4KICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkNJUkNMRSB8IFNoYXBlJDMuTElORV0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5jaXJjbGVMaW5lID0gZnVuY3Rpb24gKGNpcmNsZUJvZHksIGNpcmNsZVNoYXBlLCBjaXJjbGVPZmZzZXQsIGNpcmNsZUFuZ2xlLCBsaW5lQm9keSwgbGluZVNoYXBlLCBsaW5lT2Zmc2V0LCBsaW5lQW5nbGUsIGp1c3RUZXN0LCBsaW5lUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHsKICAgICAgdmFyIGxpbmVSYWRpdXMgPSBsaW5lUmFkaXVzIHx8IDAsCiAgICAgICAgICBjaXJjbGVSYWRpdXMgPSBjaXJjbGVSYWRpdXMgIT09IHVuZGVmaW5lZCA/IGNpcmNsZVJhZGl1cyA6IGNpcmNsZVNoYXBlLnJhZGl1cywKICAgICAgICAgIG9ydGhvRGlzdCA9IHRtcDEsCiAgICAgICAgICBsaW5lVG9DaXJjbGVPcnRob1VuaXQgPSB0bXAyLAogICAgICAgICAgcHJvamVjdGVkUG9pbnQgPSB0bXAzLAogICAgICAgICAgY2VudGVyRGlzdCA9IHRtcDQsCiAgICAgICAgICB3b3JsZFRhbmdlbnQgPSB0bXA1LAogICAgICAgICAgd29ybGRFZGdlID0gdG1wNiwKICAgICAgICAgIHdvcmxkRWRnZVVuaXQgPSB0bXA3LAogICAgICAgICAgd29ybGRWZXJ0ZXgwID0gdG1wOCwKICAgICAgICAgIHdvcmxkVmVydGV4MSA9IHRtcDksCiAgICAgICAgICB3b3JsZFZlcnRleDAxID0gdG1wMTAsCiAgICAgICAgICB3b3JsZFZlcnRleDExID0gdG1wMTEsCiAgICAgICAgICBkaXN0ID0gdG1wMTIsCiAgICAgICAgICBsaW5lVG9DaXJjbGUgPSB0bXAxMywKICAgICAgICAgIGxpbmVFbmRUb0xpbmVSYWRpdXMgPSB0bXAxNCwKICAgICAgICAgIHZlcnRzID0gdG1wQXJyYXkkMTsKICAgICAgdmFyIGhhbGZMaW5lTGVuZ3RoID0gbGluZVNoYXBlLmxlbmd0aCAvIDI7IC8vIEdldCBzdGFydCBhbmQgZW5kIHBvaW50cwoKICAgICAgdmVjMiQ3LnNldCh3b3JsZFZlcnRleDAsIC1oYWxmTGluZUxlbmd0aCwgMCk7CiAgICAgIHZlYzIkNy5zZXQod29ybGRWZXJ0ZXgxLCBoYWxmTGluZUxlbmd0aCwgMCk7IC8vIE5vdCBzdXJlIHdoeSB3ZSBoYXZlIHRvIHVzZSB3b3JsZFZlcnRleCoxIGhlcmUsIGJ1dCBpdCB3b24ndCB3b3JrIG90aGVyd2lzZS4gVGlyZWQuCgogICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZSh3b3JsZFZlcnRleDAxLCB3b3JsZFZlcnRleDAsIGxpbmVPZmZzZXQsIGxpbmVBbmdsZSk7CiAgICAgIHZlYzIkNy50b0dsb2JhbEZyYW1lKHdvcmxkVmVydGV4MTEsIHdvcmxkVmVydGV4MSwgbGluZU9mZnNldCwgbGluZUFuZ2xlKTsKICAgICAgY29weSQyKHdvcmxkVmVydGV4MCwgd29ybGRWZXJ0ZXgwMSk7CiAgICAgIGNvcHkkMih3b3JsZFZlcnRleDEsIHdvcmxkVmVydGV4MTEpOyAvLyBHZXQgdmVjdG9yIGFsb25nIHRoZSBsaW5lCgogICAgICBzdWIkMSh3b3JsZEVkZ2UsIHdvcmxkVmVydGV4MSwgd29ybGRWZXJ0ZXgwKTsKICAgICAgbm9ybWFsaXplKHdvcmxkRWRnZVVuaXQsIHdvcmxkRWRnZSk7IC8vIEdldCB0YW5nZW50IHRvIHRoZSBlZGdlLgoKICAgICAgdmVjMiQ3LnJvdGF0ZTkwY3cod29ybGRUYW5nZW50LCB3b3JsZEVkZ2VVbml0KTsgLy8gQ2hlY2sgZGlzdGFuY2UgZnJvbSB0aGUgcGxhbmUgc3Bhbm5lZCBieSB0aGUgZWRnZSB2cyB0aGUgY2lyY2xlCgogICAgICBzdWIkMShkaXN0LCBjaXJjbGVPZmZzZXQsIHdvcmxkVmVydGV4MCk7CiAgICAgIHZhciBkID0gZG90JDEoZGlzdCwgd29ybGRUYW5nZW50KTsgLy8gRGlzdGFuY2UgZnJvbSBjZW50ZXIgb2YgbGluZSB0byBjaXJjbGUgY2VudGVyCgogICAgICBzdWIkMShjZW50ZXJEaXN0LCB3b3JsZFZlcnRleDAsIGxpbmVPZmZzZXQpOwogICAgICBzdWIkMShsaW5lVG9DaXJjbGUsIGNpcmNsZU9mZnNldCwgbGluZU9mZnNldCk7CiAgICAgIHZhciByYWRpdXNTdW0gPSBjaXJjbGVSYWRpdXMgKyBsaW5lUmFkaXVzOwoKICAgICAgaWYgKE1hdGguYWJzKGQpIDwgcmFkaXVzU3VtKSB7CiAgICAgICAgLy8gTm93IHByb2plY3QgdGhlIGNpcmNsZSBvbnRvIHRoZSBlZGdlCiAgICAgICAgc2NhbGUob3J0aG9EaXN0LCB3b3JsZFRhbmdlbnQsIGQpOwogICAgICAgIHN1YiQxKHByb2plY3RlZFBvaW50LCBjaXJjbGVPZmZzZXQsIG9ydGhvRGlzdCk7IC8vIEFkZCB0aGUgbWlzc2luZyBsaW5lIHJhZGl1cwoKICAgICAgICBzY2FsZShsaW5lVG9DaXJjbGVPcnRob1VuaXQsIHdvcmxkVGFuZ2VudCwgZG90JDEod29ybGRUYW5nZW50LCBsaW5lVG9DaXJjbGUpKTsKICAgICAgICBub3JtYWxpemUobGluZVRvQ2lyY2xlT3J0aG9Vbml0LCBsaW5lVG9DaXJjbGVPcnRob1VuaXQpOwogICAgICAgIHNjYWxlKGxpbmVUb0NpcmNsZU9ydGhvVW5pdCwgbGluZVRvQ2lyY2xlT3J0aG9Vbml0LCBsaW5lUmFkaXVzKTsKICAgICAgICBhZGQkMShwcm9qZWN0ZWRQb2ludCwgcHJvamVjdGVkUG9pbnQsIGxpbmVUb0NpcmNsZU9ydGhvVW5pdCk7IC8vIENoZWNrIGlmIHRoZSBwb2ludCBpcyB3aXRoaW4gdGhlIGVkZ2Ugc3BhbgoKICAgICAgICB2YXIgcG9zID0gZG90JDEod29ybGRFZGdlVW5pdCwgcHJvamVjdGVkUG9pbnQpOwogICAgICAgIHZhciBwb3MwID0gZG90JDEod29ybGRFZGdlVW5pdCwgd29ybGRWZXJ0ZXgwKTsKICAgICAgICB2YXIgcG9zMSA9IGRvdCQxKHdvcmxkRWRnZVVuaXQsIHdvcmxkVmVydGV4MSk7CgogICAgICAgIGlmIChwb3MgPiBwb3MwICYmIHBvcyA8IHBvczEpIHsKICAgICAgICAgIC8vIFdlIGdvdCBjb250YWN0IQogICAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICAgIHJldHVybiAxOwogICAgICAgICAgfQoKICAgICAgICAgIHZhciBjID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oY2lyY2xlQm9keSwgbGluZUJvZHksIGNpcmNsZVNoYXBlLCBsaW5lU2hhcGUpOwogICAgICAgICAgc2NhbGUoYy5ub3JtYWxBLCBvcnRob0Rpc3QsIC0xKTsKICAgICAgICAgIG5vcm1hbGl6ZShjLm5vcm1hbEEsIGMubm9ybWFsQSk7CiAgICAgICAgICBzY2FsZShjLmNvbnRhY3RQb2ludEEsIGMubm9ybWFsQSwgY2lyY2xlUmFkaXVzKTsKICAgICAgICAgIGFkZCQxKGMuY29udGFjdFBvaW50QSwgYy5jb250YWN0UG9pbnRBLCBjaXJjbGVPZmZzZXQpOwogICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRBLCBjLmNvbnRhY3RQb2ludEEsIGNpcmNsZUJvZHkucG9zaXRpb24pOwogICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRCLCBwcm9qZWN0ZWRQb2ludCwgbGluZU9mZnNldCk7CiAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgbGluZU9mZnNldCk7CiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgbGluZUJvZHkucG9zaXRpb24pOwogICAgICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25zLnB1c2goYyk7CgogICAgICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5wdXNoKHRoaXMuY3JlYXRlRnJpY3Rpb25Gcm9tQ29udGFjdChjKSk7CiAgICAgICAgICB9CgogICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgfQogICAgICB9IC8vIEFkZCBjb3JuZXIKCgogICAgICB2ZXJ0c1swXSA9IHdvcmxkVmVydGV4MDsKICAgICAgdmVydHNbMV0gPSB3b3JsZFZlcnRleDE7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIHYgPSB2ZXJ0c1tpXTsKICAgICAgICBzdWIkMShkaXN0LCB2LCBjaXJjbGVPZmZzZXQpOwoKICAgICAgICBpZiAoc3F1YXJlZExlbmd0aChkaXN0KSA8IE1hdGgucG93KHJhZGl1c1N1bSwgMikpIHsKICAgICAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgICAgICByZXR1cm4gMTsKICAgICAgICAgIH0KCiAgICAgICAgICB2YXIgYyA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGNpcmNsZUJvZHksIGxpbmVCb2R5LCBjaXJjbGVTaGFwZSwgbGluZVNoYXBlKTsKICAgICAgICAgIGNvcHkkMihjLm5vcm1hbEEsIGRpc3QpOwogICAgICAgICAgbm9ybWFsaXplKGMubm9ybWFsQSwgYy5ub3JtYWxBKTsgLy8gVmVjdG9yIGZyb20gY2lyY2xlIHRvIGNvbnRhY3QgcG9pbnQgaXMgdGhlIG5vcm1hbCB0aW1lcyB0aGUgY2lyY2xlIHJhZGl1cwoKICAgICAgICAgIHNjYWxlKGMuY29udGFjdFBvaW50QSwgYy5ub3JtYWxBLCBjaXJjbGVSYWRpdXMpOwogICAgICAgICAgYWRkJDEoYy5jb250YWN0UG9pbnRBLCBjLmNvbnRhY3RQb2ludEEsIGNpcmNsZU9mZnNldCk7CiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgY2lyY2xlQm9keS5wb3NpdGlvbik7CiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEIsIHYsIGxpbmVPZmZzZXQpOwogICAgICAgICAgc2NhbGUobGluZUVuZFRvTGluZVJhZGl1cywgYy5ub3JtYWxBLCAtbGluZVJhZGl1cyk7CiAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgbGluZUVuZFRvTGluZVJhZGl1cyk7CiAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgbGluZU9mZnNldCk7CiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgbGluZUJvZHkucG9zaXRpb24pOwogICAgICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25zLnB1c2goYyk7CgogICAgICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5wdXNoKHRoaXMuY3JlYXRlRnJpY3Rpb25Gcm9tQ29udGFjdChjKSk7CiAgICAgICAgICB9CgogICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gMDsKICAgIH07CiAgICAvKioKICAgICAqIENpcmNsZS9jYXBzdWxlIE5hcnJvd3BoYXNlCiAgICAgKiBAbWV0aG9kIGNpcmNsZUNhcHN1bGUKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgYmkKICAgICAqIEBwYXJhbSAge0NpcmNsZX0gc2kKICAgICAqIEBwYXJhbSAge0FycmF5fSAgeGkKICAgICAqIEBwYXJhbSAge051bWJlcn0gYWkKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgYmoKICAgICAqIEBwYXJhbSAge0xpbmV9ICAgc2oKICAgICAqIEBwYXJhbSAge0FycmF5fSAgeGoKICAgICAqIEBwYXJhbSAge051bWJlcn0gYWoKICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkNJUkNMRSB8IFNoYXBlJDMuQ0FQU1VMRV0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5jaXJjbGVDYXBzdWxlID0gZnVuY3Rpb24gKGJpLCBzaSwgeGksIGFpLCBiaiwgc2osIHhqLCBhaiwganVzdFRlc3QpIHsKICAgICAgcmV0dXJuIHRoaXMuY2lyY2xlTGluZShiaSwgc2ksIHhpLCBhaSwgYmosIHNqLCB4aiwgYWosIGp1c3RUZXN0LCBzai5yYWRpdXMpOwogICAgfTsKICAgIC8qKgogICAgICogQ2lyY2xlL2NvbnZleCBOYXJyb3dwaGFzZS4KICAgICAqIEBtZXRob2QgY2lyY2xlQ29udmV4CiAgICAgKiBAcGFyYW0gIHtCb2R5fSBjaXJjbGVCb2R5CiAgICAgKiBAcGFyYW0gIHtDaXJjbGV9IGNpcmNsZVNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gY2lyY2xlT2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGNpcmNsZUFuZ2xlCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBjb252ZXhCb2R5CiAgICAgKiBAcGFyYW0gIHtDb252ZXh9IGNvbnZleFNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gY29udmV4T2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGNvbnZleEFuZ2xlCiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBqdXN0VGVzdAogICAgICogQHBhcmFtICB7TnVtYmVyfSBjaXJjbGVSYWRpdXMKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqIEB0b2RvIFNob3VsZCBwcm9iYWJseSBkbyBhIHNlcGFyYXRpbmcgYXhpcyB0ZXN0IGxpa2UgaHR0cHM6Ly9naXRodWIuY29tL2VyaW5jYXR0by9Cb3gyRC9ibG9iL21hc3Rlci9Cb3gyRC9Cb3gyRC9Db2xsaXNpb24vYjJDb2xsaWRlQ2lyY2xlLmNwcCNMNjIKICAgICAqLwoKCiAgICBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkNJUkNMRSB8IFNoYXBlJDMuQ09OVkVYXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQ0lSQ0xFIHwgU2hhcGUkMy5CT1hdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUuY2lyY2xlQ29udmV4ID0gZnVuY3Rpb24gKGNpcmNsZUJvZHksIGNpcmNsZVNoYXBlLCBjaXJjbGVPZmZzZXQsIGNpcmNsZUFuZ2xlLCBjb252ZXhCb2R5LCBjb252ZXhTaGFwZSwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSwganVzdFRlc3QsIGNpcmNsZVJhZGl1cykgewogICAgICB2YXIgY2lyY2xlUmFkaXVzID0gY2lyY2xlUmFkaXVzICE9PSB1bmRlZmluZWQgPyBjaXJjbGVSYWRpdXMgOiBjaXJjbGVTaGFwZS5yYWRpdXM7CiAgICAgIHZhciB3b3JsZFZlcnRleDAgPSB0bXAxLAogICAgICAgICAgd29ybGRWZXJ0ZXgxID0gdG1wMiwKICAgICAgICAgIGVkZ2UgPSB0bXAzLAogICAgICAgICAgZWRnZVVuaXQgPSB0bXA0LAogICAgICAgICAgbm9ybWFsID0gdG1wNSwKICAgICAgICAgIHplcm8gPSB0bXA2LAogICAgICAgICAgbG9jYWxDaXJjbGVQb3NpdGlvbiA9IHRtcDcsCiAgICAgICAgICByID0gdG1wOCwKICAgICAgICAgIGRpc3QgPSB0bXAxMCwKICAgICAgICAgIHdvcmxkVmVydGV4ID0gdG1wMTEsCiAgICAgICAgICBjbG9zZXN0RWRnZVByb2plY3RlZFBvaW50ID0gdG1wMTMsCiAgICAgICAgICBjYW5kaWRhdGUgPSB0bXAxNCwKICAgICAgICAgIGNhbmRpZGF0ZURpc3QgPSB0bXAxNSwKICAgICAgICAgIGZvdW5kID0gLTEsCiAgICAgICAgICBtaW5DYW5kaWRhdGVEaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7CiAgICAgIHZlYzIkNy5zZXQoemVybywgMCwgMCk7IC8vIE5ldyBhbGdvcml0aG06CiAgICAgIC8vIDEuIENoZWNrIHNvIGNlbnRlciBvZiBjaXJjbGUgaXMgbm90IGluc2lkZSB0aGUgcG9seWdvbi4gSWYgaXQgaXMsIHRoaXMgd29udCB3b3JrLi4uCiAgICAgIC8vIDIuIEZvciBlYWNoIGVkZ2UKICAgICAgLy8gMi4gMS4gR2V0IHBvaW50IG9uIGNpcmNsZSB0aGF0IGlzIGNsb3Nlc3QgdG8gdGhlIGVkZ2UgKHNjYWxlIG5vcm1hbCB3aXRoIC1yYWRpdXMpCiAgICAgIC8vIDIuIDIuIENoZWNrIGlmIHBvaW50IGlzIGluc2lkZS4KCiAgICAgIHZlYzIkNy50b0xvY2FsRnJhbWUobG9jYWxDaXJjbGVQb3NpdGlvbiwgY2lyY2xlT2Zmc2V0LCBjb252ZXhPZmZzZXQsIGNvbnZleEFuZ2xlKTsKICAgICAgdmFyIHZlcnRpY2VzID0gY29udmV4U2hhcGUudmVydGljZXM7CiAgICAgIHZhciBub3JtYWxzID0gY29udmV4U2hhcGUubm9ybWFsczsKICAgICAgdmFyIG51bVZlcnRpY2VzID0gdmVydGljZXMubGVuZ3RoOwogICAgICB2YXIgbm9ybWFsSW5kZXggPSAtMTsgLy8gRmluZCB0aGUgbWluIHNlcGFyYXRpbmcgZWRnZS4KCiAgICAgIHZhciBzZXBhcmF0aW9uID0gLU51bWJlci5NQVhfVkFMVUU7CiAgICAgIHZhciByYWRpdXMgPSBjb252ZXhTaGFwZS5ib3VuZGluZ1JhZGl1cyArIGNpcmNsZVJhZGl1czsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtVmVydGljZXM7IGkrKykgewogICAgICAgIHN1YiQxKHIsIGxvY2FsQ2lyY2xlUG9zaXRpb24sIHZlcnRpY2VzW2ldKTsKICAgICAgICB2YXIgcyA9IGRvdCQxKG5vcm1hbHNbaV0sIHIpOwoKICAgICAgICBpZiAocyA+IHJhZGl1cykgewogICAgICAgICAgLy8gRWFybHkgb3V0LgogICAgICAgICAgcmV0dXJuIDA7CiAgICAgICAgfQoKICAgICAgICBpZiAocyA+IHNlcGFyYXRpb24pIHsKICAgICAgICAgIHNlcGFyYXRpb24gPSBzOwogICAgICAgICAgbm9ybWFsSW5kZXggPSBpOwogICAgICAgIH0KICAgICAgfSAvLyBDaGVjayBlZGdlcyBmaXJzdAoKCiAgICAgIGZvciAodmFyIGkgPSBub3JtYWxJbmRleCArIG51bVZlcnRpY2VzIC0gMTsgaSA8IG5vcm1hbEluZGV4ICsgbnVtVmVydGljZXMgKyAyOyBpKyspIHsKICAgICAgICB2YXIgdjAgPSB2ZXJ0aWNlc1tpICUgbnVtVmVydGljZXNdLAogICAgICAgICAgICBuID0gbm9ybWFsc1tpICUgbnVtVmVydGljZXNdOyAvLyBHZXQgcG9pbnQgb24gY2lyY2xlLCBjbG9zZXN0IHRvIHRoZSBjb252ZXgKCiAgICAgICAgc2NhbGUoY2FuZGlkYXRlLCBuLCAtY2lyY2xlUmFkaXVzKTsKICAgICAgICBhZGQkMShjYW5kaWRhdGUsIGNhbmRpZGF0ZSwgbG9jYWxDaXJjbGVQb3NpdGlvbik7CgogICAgICAgIGlmIChwb2ludEluQ29udmV4TG9jYWwoY2FuZGlkYXRlLCBjb252ZXhTaGFwZSkpIHsKICAgICAgICAgIHN1YiQxKGNhbmRpZGF0ZURpc3QsIHYwLCBjYW5kaWRhdGUpOwogICAgICAgICAgdmFyIGNhbmRpZGF0ZURpc3RhbmNlID0gTWF0aC5hYnMoZG90JDEoY2FuZGlkYXRlRGlzdCwgbikpOwoKICAgICAgICAgIGlmIChjYW5kaWRhdGVEaXN0YW5jZSA8IG1pbkNhbmRpZGF0ZURpc3RhbmNlKSB7CiAgICAgICAgICAgIG1pbkNhbmRpZGF0ZURpc3RhbmNlID0gY2FuZGlkYXRlRGlzdGFuY2U7CiAgICAgICAgICAgIGZvdW5kID0gaTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmIChmb3VuZCAhPT0gLTEpIHsKICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgIHJldHVybiAxOwogICAgICAgIH0KCiAgICAgICAgdmFyIHYwID0gdmVydGljZXNbZm91bmQgJSBudW1WZXJ0aWNlc10sCiAgICAgICAgICAgIHYxID0gdmVydGljZXNbKGZvdW5kICsgMSkgJSBudW1WZXJ0aWNlc107CiAgICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUod29ybGRWZXJ0ZXgwLCB2MCwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSk7CiAgICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUod29ybGRWZXJ0ZXgxLCB2MSwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSk7CiAgICAgICAgc3ViJDEoZWRnZSwgd29ybGRWZXJ0ZXgxLCB3b3JsZFZlcnRleDApOwogICAgICAgIG5vcm1hbGl6ZShlZGdlVW5pdCwgZWRnZSk7IC8vIEdldCB0YW5nZW50IHRvIHRoZSBlZGdlLiBQb2ludHMgb3V0IG9mIHRoZSBDb252ZXgKCiAgICAgICAgdmVjMiQ3LnJvdGF0ZTkwY3cobm9ybWFsLCBlZGdlVW5pdCk7IC8vIEdldCBwb2ludCBvbiBjaXJjbGUsIGNsb3Nlc3QgdG8gdGhlIGNvbnZleAoKICAgICAgICBzY2FsZShjYW5kaWRhdGUsIG5vcm1hbCwgLWNpcmNsZVJhZGl1cyk7CiAgICAgICAgYWRkJDEoY2FuZGlkYXRlLCBjYW5kaWRhdGUsIGNpcmNsZU9mZnNldCk7CiAgICAgICAgc2NhbGUoY2xvc2VzdEVkZ2VQcm9qZWN0ZWRQb2ludCwgbm9ybWFsLCBtaW5DYW5kaWRhdGVEaXN0YW5jZSk7CiAgICAgICAgYWRkJDEoY2xvc2VzdEVkZ2VQcm9qZWN0ZWRQb2ludCwgY2xvc2VzdEVkZ2VQcm9qZWN0ZWRQb2ludCwgY2FuZGlkYXRlKTsKICAgICAgICB2YXIgYyA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGNpcmNsZUJvZHksIGNvbnZleEJvZHksIGNpcmNsZVNoYXBlLCBjb252ZXhTaGFwZSk7CiAgICAgICAgc3ViJDEoYy5ub3JtYWxBLCBjYW5kaWRhdGUsIGNpcmNsZU9mZnNldCk7CiAgICAgICAgbm9ybWFsaXplKGMubm9ybWFsQSwgYy5ub3JtYWxBKTsKICAgICAgICBzY2FsZShjLmNvbnRhY3RQb2ludEEsIGMubm9ybWFsQSwgY2lyY2xlUmFkaXVzKTsKICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgY2lyY2xlT2Zmc2V0KTsKICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgY2lyY2xlQm9keS5wb3NpdGlvbik7CiAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRCLCBjbG9zZXN0RWRnZVByb2plY3RlZFBvaW50LCBjb252ZXhPZmZzZXQpOwogICAgICAgIGFkZCQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBjb252ZXhPZmZzZXQpOwogICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBjb252ZXhCb2R5LnBvc2l0aW9uKTsKICAgICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMucHVzaChjKTsKCiAgICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0gLy8gQ2hlY2sgY2xvc2VzdCB2ZXJ0aWNlcwoKCiAgICAgIGlmIChjaXJjbGVSYWRpdXMgPiAwICYmIG5vcm1hbEluZGV4ICE9PSAtMSkgewogICAgICAgIGZvciAodmFyIGkgPSBub3JtYWxJbmRleCArIG51bVZlcnRpY2VzOyBpIDwgbm9ybWFsSW5kZXggKyBudW1WZXJ0aWNlcyArIDI7IGkrKykgewogICAgICAgICAgdmFyIGxvY2FsVmVydGV4ID0gdmVydGljZXNbaSAlIG51bVZlcnRpY2VzXTsKICAgICAgICAgIHN1YiQxKGRpc3QsIGxvY2FsVmVydGV4LCBsb2NhbENpcmNsZVBvc2l0aW9uKTsKCiAgICAgICAgICBpZiAoc3F1YXJlZExlbmd0aChkaXN0KSA8IGNpcmNsZVJhZGl1cyAqIGNpcmNsZVJhZGl1cykgewogICAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgICByZXR1cm4gMTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUod29ybGRWZXJ0ZXgsIGxvY2FsVmVydGV4LCBjb252ZXhPZmZzZXQsIGNvbnZleEFuZ2xlKTsKICAgICAgICAgICAgc3ViJDEoZGlzdCwgd29ybGRWZXJ0ZXgsIGNpcmNsZU9mZnNldCk7CiAgICAgICAgICAgIHZhciBjID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oY2lyY2xlQm9keSwgY29udmV4Qm9keSwgY2lyY2xlU2hhcGUsIGNvbnZleFNoYXBlKTsKICAgICAgICAgICAgY29weSQyKGMubm9ybWFsQSwgZGlzdCk7CiAgICAgICAgICAgIG5vcm1hbGl6ZShjLm5vcm1hbEEsIGMubm9ybWFsQSk7IC8vIFZlY3RvciBmcm9tIGNpcmNsZSB0byBjb250YWN0IHBvaW50IGlzIHRoZSBub3JtYWwgdGltZXMgdGhlIGNpcmNsZSByYWRpdXMKCiAgICAgICAgICAgIHNjYWxlKGMuY29udGFjdFBvaW50QSwgYy5ub3JtYWxBLCBjaXJjbGVSYWRpdXMpOwogICAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgY2lyY2xlT2Zmc2V0KTsKICAgICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRBLCBjLmNvbnRhY3RQb2ludEEsIGNpcmNsZUJvZHkucG9zaXRpb24pOwogICAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEIsIHdvcmxkVmVydGV4LCBjb252ZXhPZmZzZXQpOwogICAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgY29udmV4T2Zmc2V0KTsKICAgICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRCLCBjLmNvbnRhY3RQb2ludEIsIGNvbnZleEJvZHkucG9zaXRpb24pOwogICAgICAgICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMucHVzaChjKTsKCiAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uKSB7CiAgICAgICAgICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5wdXNoKHRoaXMuY3JlYXRlRnJpY3Rpb25Gcm9tQ29udGFjdChjKSk7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIHJldHVybiAxOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIDA7CiAgICB9OwoKICAgIHZhciBwaWNfbG9jYWxQb2ludCA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICBwaWNfcjAgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgcGljX3IxID0gY3JlYXRlVmVjMigpOwogICAgLyoKICAgICAqIENoZWNrIGlmIGEgcG9pbnQgaXMgaW4gYSBwb2x5Z29uCiAgICAgKi8KCiAgICBmdW5jdGlvbiBwb2ludEluQ29udmV4KHdvcmxkUG9pbnQsIGNvbnZleFNoYXBlLCBjb252ZXhPZmZzZXQsIGNvbnZleEFuZ2xlKSB7CiAgICAgIHZhciBsb2NhbFBvaW50ID0gcGljX2xvY2FsUG9pbnQsCiAgICAgICAgICByMCA9IHBpY19yMCwKICAgICAgICAgIHIxID0gcGljX3IxLAogICAgICAgICAgdmVydHMgPSBjb252ZXhTaGFwZS52ZXJ0aWNlcywKICAgICAgICAgIGxhc3RDcm9zcyA9IG51bGw7CiAgICAgIHZlYzIkNy50b0xvY2FsRnJhbWUobG9jYWxQb2ludCwgd29ybGRQb2ludCwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSk7CgogICAgICBmb3IgKHZhciBpID0gMCwgbnVtVmVydHMgPSB2ZXJ0cy5sZW5ndGg7IGkgIT09IG51bVZlcnRzICsgMTsgaSsrKSB7CiAgICAgICAgdmFyIHYwID0gdmVydHNbaSAlIG51bVZlcnRzXSwKICAgICAgICAgICAgdjEgPSB2ZXJ0c1soaSArIDEpICUgbnVtVmVydHNdOwogICAgICAgIHN1YiQxKHIwLCB2MCwgbG9jYWxQb2ludCk7CiAgICAgICAgc3ViJDEocjEsIHYxLCBsb2NhbFBvaW50KTsKICAgICAgICB2YXIgY3Jvc3MgPSB2ZWMyJDcuY3Jvc3NMZW5ndGgocjAsIHIxKTsKCiAgICAgICAgaWYgKGxhc3RDcm9zcyA9PT0gbnVsbCkgewogICAgICAgICAgbGFzdENyb3NzID0gY3Jvc3M7CiAgICAgICAgfSAvLyBJZiB3ZSBnb3QgYSBkaWZmZXJlbnQgc2lnbiBvZiB0aGUgZGlzdGFuY2UgdmVjdG9yLCB0aGUgcG9pbnQgaXMgb3V0IG9mIHRoZSBwb2x5Z29uCgoKICAgICAgICBpZiAoY3Jvc3MgKiBsYXN0Q3Jvc3MgPCAwKSB7CiAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgfQoKICAgICAgICBsYXN0Q3Jvc3MgPSBjcm9zczsKICAgICAgfQoKICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAvKgogICAgICogQ2hlY2sgaWYgYSBwb2ludCBpcyBpbiBhIHBvbHlnb24KICAgICAqLwoKCiAgICBmdW5jdGlvbiBwb2ludEluQ29udmV4TG9jYWwobG9jYWxQb2ludCwgY29udmV4U2hhcGUpIHsKICAgICAgdmFyIHIwID0gcGljX3IwLAogICAgICAgICAgcjEgPSBwaWNfcjEsCiAgICAgICAgICB2ZXJ0cyA9IGNvbnZleFNoYXBlLnZlcnRpY2VzLAogICAgICAgICAgbGFzdENyb3NzID0gbnVsbCwKICAgICAgICAgIG51bVZlcnRzID0gdmVydHMubGVuZ3RoOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1WZXJ0cyArIDE7IGkrKykgewogICAgICAgIHZhciB2MCA9IHZlcnRzW2kgJSBudW1WZXJ0c10sCiAgICAgICAgICAgIHYxID0gdmVydHNbKGkgKyAxKSAlIG51bVZlcnRzXTsKICAgICAgICBzdWIkMShyMCwgdjAsIGxvY2FsUG9pbnQpOwogICAgICAgIHN1YiQxKHIxLCB2MSwgbG9jYWxQb2ludCk7CiAgICAgICAgdmFyIGNyb3NzID0gdmVjMiQ3LmNyb3NzTGVuZ3RoKHIwLCByMSk7CgogICAgICAgIGlmIChsYXN0Q3Jvc3MgPT09IG51bGwpIHsKICAgICAgICAgIGxhc3RDcm9zcyA9IGNyb3NzOwogICAgICAgIH0gLy8gSWYgd2UgZ290IGEgZGlmZmVyZW50IHNpZ24gb2YgdGhlIGRpc3RhbmNlIHZlY3RvciwgdGhlIHBvaW50IGlzIG91dCBvZiB0aGUgcG9seWdvbgoKCiAgICAgICAgaWYgKGNyb3NzICogbGFzdENyb3NzIDwgMCkgewogICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgIH0KCiAgICAgICAgbGFzdENyb3NzID0gY3Jvc3M7CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfQogICAgLyoqCiAgICAgKiBQYXJ0aWNsZS9jb252ZXggTmFycm93cGhhc2UKICAgICAqIEBtZXRob2QgcGFydGljbGVDb252ZXgKICAgICAqIEBwYXJhbSAge0JvZHl9IHBhcnRpY2xlQm9keQogICAgICogQHBhcmFtICB7UGFydGljbGV9IHBhcnRpY2xlU2hhcGUKICAgICAqIEBwYXJhbSAge0FycmF5fSBwYXJ0aWNsZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBwYXJ0aWNsZUFuZ2xlCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBjb252ZXhCb2R5CiAgICAgKiBAcGFyYW0gIHtDb252ZXh9IGNvbnZleFNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gY29udmV4T2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGNvbnZleEFuZ2xlCiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGp1c3RUZXN0CiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKiBAdG9kbyB1c2UgcG9pbnRJbkNvbnZleCBhbmQgY29kZSBtb3JlIHNpbWlsYXIgdG8gY2lyY2xlQ29udmV4CiAgICAgKiBAdG9kbyBkb24ndCB0cmFuc2Zvcm0gZWFjaCB2ZXJ0ZXgsIGJ1dCB0cmFuc2Zvcm0gdGhlIHBhcnRpY2xlIHBvc2l0aW9uIHRvIGNvbnZleC1sb2NhbCBpbnN0ZWFkCiAgICAgKi8KCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5QQVJUSUNMRSB8IFNoYXBlJDMuQ09OVkVYXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuUEFSVElDTEUgfCBTaGFwZSQzLkJPWF0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5wYXJ0aWNsZUNvbnZleCA9IGZ1bmN0aW9uIChwYXJ0aWNsZUJvZHksIHBhcnRpY2xlU2hhcGUsIHBhcnRpY2xlT2Zmc2V0LCBwYXJ0aWNsZUFuZ2xlLCBjb252ZXhCb2R5LCBjb252ZXhTaGFwZSwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSwganVzdFRlc3QpIHsKICAgICAgdmFyIHdvcmxkVmVydGV4MCA9IHRtcDEsCiAgICAgICAgICB3b3JsZFZlcnRleDEgPSB0bXAyLAogICAgICAgICAgd29ybGRFZGdlID0gdG1wMywKICAgICAgICAgIHdvcmxkRWRnZVVuaXQgPSB0bXA0LAogICAgICAgICAgd29ybGRUYW5nZW50ID0gdG1wNSwKICAgICAgICAgIGNlbnRlckRpc3QgPSB0bXA2LAogICAgICAgICAgY29udmV4VG9wYXJ0aWNsZSA9IHRtcDcsCiAgICAgICAgICBjbG9zZXN0RWRnZVByb2plY3RlZFBvaW50ID0gdG1wMTMsCiAgICAgICAgICBjYW5kaWRhdGVEaXN0ID0gdG1wMTQsCiAgICAgICAgICBtaW5FZGdlTm9ybWFsID0gdG1wMTUsCiAgICAgICAgICBtaW5DYW5kaWRhdGVEaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUUsCiAgICAgICAgICBmb3VuZCA9IGZhbHNlLAogICAgICAgICAgdmVydHMgPSBjb252ZXhTaGFwZS52ZXJ0aWNlczsgLy8gQ2hlY2sgaWYgdGhlIHBhcnRpY2xlIGlzIGluIHRoZSBwb2x5Z29uIGF0IGFsbAoKICAgICAgaWYgKCFwb2ludEluQ29udmV4KHBhcnRpY2xlT2Zmc2V0LCBjb252ZXhTaGFwZSwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSkpIHsKICAgICAgICByZXR1cm4gMDsKICAgICAgfQoKICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0gLy8gQ2hlY2sgZWRnZXMgZmlyc3QKCgogICAgICBmb3IgKHZhciBpID0gMCwgbnVtVmVydHMgPSB2ZXJ0cy5sZW5ndGg7IGkgIT09IG51bVZlcnRzICsgMTsgaSsrKSB7CiAgICAgICAgdmFyIHYwID0gdmVydHNbaSAlIG51bVZlcnRzXSwKICAgICAgICAgICAgdjEgPSB2ZXJ0c1soaSArIDEpICUgbnVtVmVydHNdOyAvLyBUcmFuc2Zvcm0gdmVydGljZXMgdG8gd29ybGQKICAgICAgICAvLyBAdG9kbyB0cmFuc2Zvcm0gcG9pbnQgdG8gbG9jYWwgc3BhY2UgaW5zdGVhZAoKICAgICAgICByb3RhdGUkMSh3b3JsZFZlcnRleDAsIHYwLCBjb252ZXhBbmdsZSk7CiAgICAgICAgcm90YXRlJDEod29ybGRWZXJ0ZXgxLCB2MSwgY29udmV4QW5nbGUpOwogICAgICAgIGFkZCQxKHdvcmxkVmVydGV4MCwgd29ybGRWZXJ0ZXgwLCBjb252ZXhPZmZzZXQpOwogICAgICAgIGFkZCQxKHdvcmxkVmVydGV4MSwgd29ybGRWZXJ0ZXgxLCBjb252ZXhPZmZzZXQpOyAvLyBHZXQgd29ybGQgZWRnZQoKICAgICAgICBzdWIkMSh3b3JsZEVkZ2UsIHdvcmxkVmVydGV4MSwgd29ybGRWZXJ0ZXgwKTsKICAgICAgICBub3JtYWxpemUod29ybGRFZGdlVW5pdCwgd29ybGRFZGdlKTsgLy8gR2V0IHRhbmdlbnQgdG8gdGhlIGVkZ2UuIFBvaW50cyBvdXQgb2YgdGhlIENvbnZleAoKICAgICAgICB2ZWMyJDcucm90YXRlOTBjdyh3b3JsZFRhbmdlbnQsIHdvcmxkRWRnZVVuaXQpOyAvLyBDaGVjayBkaXN0YW5jZSBmcm9tIHRoZSBpbmZpbml0ZSBsaW5lIChzcGFubmVkIGJ5IHRoZSBlZGdlKSB0byB0aGUgcGFydGljbGUKICAgICAgICAvL3N1YihkaXN0LCBwYXJ0aWNsZU9mZnNldCwgd29ybGRWZXJ0ZXgwKTsKICAgICAgICAvL3ZhciBkID0gZG90KGRpc3QsIHdvcmxkVGFuZ2VudCk7CgogICAgICAgIHN1YiQxKGNlbnRlckRpc3QsIHdvcmxkVmVydGV4MCwgY29udmV4T2Zmc2V0KTsKICAgICAgICBzdWIkMShjb252ZXhUb3BhcnRpY2xlLCBwYXJ0aWNsZU9mZnNldCwgY29udmV4T2Zmc2V0KTsKICAgICAgICBzdWIkMShjYW5kaWRhdGVEaXN0LCB3b3JsZFZlcnRleDAsIHBhcnRpY2xlT2Zmc2V0KTsKICAgICAgICB2YXIgY2FuZGlkYXRlRGlzdGFuY2UgPSBNYXRoLmFicyhkb3QkMShjYW5kaWRhdGVEaXN0LCB3b3JsZFRhbmdlbnQpKTsKCiAgICAgICAgaWYgKGNhbmRpZGF0ZURpc3RhbmNlIDwgbWluQ2FuZGlkYXRlRGlzdGFuY2UpIHsKICAgICAgICAgIG1pbkNhbmRpZGF0ZURpc3RhbmNlID0gY2FuZGlkYXRlRGlzdGFuY2U7CiAgICAgICAgICBzY2FsZShjbG9zZXN0RWRnZVByb2plY3RlZFBvaW50LCB3b3JsZFRhbmdlbnQsIGNhbmRpZGF0ZURpc3RhbmNlKTsKICAgICAgICAgIGFkZCQxKGNsb3Nlc3RFZGdlUHJvamVjdGVkUG9pbnQsIGNsb3Nlc3RFZGdlUHJvamVjdGVkUG9pbnQsIHBhcnRpY2xlT2Zmc2V0KTsKICAgICAgICAgIGNvcHkkMihtaW5FZGdlTm9ybWFsLCB3b3JsZFRhbmdlbnQpOwogICAgICAgICAgZm91bmQgPSB0cnVlOwogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKGZvdW5kKSB7CiAgICAgICAgdmFyIGMgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihwYXJ0aWNsZUJvZHksIGNvbnZleEJvZHksIHBhcnRpY2xlU2hhcGUsIGNvbnZleFNoYXBlKTsKICAgICAgICBzY2FsZShjLm5vcm1hbEEsIG1pbkVkZ2VOb3JtYWwsIC0xKTsKICAgICAgICBub3JtYWxpemUoYy5ub3JtYWxBLCBjLm5vcm1hbEEpOyAvLyBQYXJ0aWNsZSBoYXMgbm8gZXh0ZW50IHRvIHRoZSBjb250YWN0IHBvaW50CgogICAgICAgIHZlYzIkNy5zZXQoYy5jb250YWN0UG9pbnRBLCAwLCAwKTsKICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgcGFydGljbGVPZmZzZXQpOwogICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QSwgYy5jb250YWN0UG9pbnRBLCBwYXJ0aWNsZUJvZHkucG9zaXRpb24pOyAvLyBGcm9tIGNvbnZleCBjZW50ZXIgdG8gcG9pbnQKCiAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRCLCBjbG9zZXN0RWRnZVByb2plY3RlZFBvaW50LCBjb252ZXhPZmZzZXQpOwogICAgICAgIGFkZCQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBjb252ZXhPZmZzZXQpOwogICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBjb252ZXhCb2R5LnBvc2l0aW9uKTsKICAgICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMucHVzaChjKTsKCiAgICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0KCiAgICAgIHJldHVybiAwOwogICAgfTsKICAgIC8qKgogICAgICogQ2lyY2xlL2NpcmNsZSBOYXJyb3dwaGFzZQogICAgICogQG1ldGhvZCBjaXJjbGVDaXJjbGUKICAgICAqIEBwYXJhbSAge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0gIHtDaXJjbGV9IHNoYXBlQQogICAgICogQHBhcmFtICB7QXJyYXl9IG9mZnNldEEKICAgICAqIEBwYXJhbSAge051bWJlcn0gYW5nbGVBCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtICB7Q2lyY2xlfSBzaGFwZUIKICAgICAqIEBwYXJhbSAge0FycmF5fSBvZmZzZXRCCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGFuZ2xlQgogICAgICogQHBhcmFtIHtCb29sZWFufSBqdXN0VGVzdAogICAgICogQHBhcmFtIHtOdW1iZXJ9IFtyYWRpdXNBXSBPcHRpb25hbCByYWRpdXMgdG8gdXNlIGZvciBzaGFwZUEKICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcmFkaXVzQl0gT3B0aW9uYWwgcmFkaXVzIHRvIHVzZSBmb3Igc2hhcGVCCiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5DSVJDTEVdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUuY2lyY2xlQ2lyY2xlID0gZnVuY3Rpb24gKGJvZHlBLCBzaGFwZUEsIG9mZnNldEEsIGFuZ2xlQSwgYm9keUIsIHNoYXBlQiwgb2Zmc2V0QiwgYW5nbGVCLCBqdXN0VGVzdCwgcmFkaXVzQSwgcmFkaXVzQikgewogICAgICB2YXIgZGlzdCA9IHRtcDEsCiAgICAgICAgICByYWRpdXNBID0gcmFkaXVzQSB8fCBzaGFwZUEucmFkaXVzLAogICAgICAgICAgcmFkaXVzQiA9IHJhZGl1c0IgfHwgc2hhcGVCLnJhZGl1czsKICAgICAgc3ViJDEoZGlzdCwgb2Zmc2V0QSwgb2Zmc2V0Qik7CiAgICAgIHZhciByID0gcmFkaXVzQSArIHJhZGl1c0I7CgogICAgICBpZiAoc3F1YXJlZExlbmd0aChkaXN0KSA+IHIgKiByKSB7CiAgICAgICAgcmV0dXJuIDA7CiAgICAgIH0KCiAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgIHJldHVybiAxOwogICAgICB9CgogICAgICB2YXIgYyA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGJvZHlBLCBib2R5Qiwgc2hhcGVBLCBzaGFwZUIpOwogICAgICB2YXIgY3BBID0gYy5jb250YWN0UG9pbnRBOwogICAgICB2YXIgY3BCID0gYy5jb250YWN0UG9pbnRCOwogICAgICB2YXIgbm9ybWFsQSA9IGMubm9ybWFsQTsKICAgICAgc3ViJDEobm9ybWFsQSwgb2Zmc2V0Qiwgb2Zmc2V0QSk7CiAgICAgIG5vcm1hbGl6ZShub3JtYWxBLCBub3JtYWxBKTsKICAgICAgc2NhbGUoY3BBLCBub3JtYWxBLCByYWRpdXNBKTsKICAgICAgc2NhbGUoY3BCLCBub3JtYWxBLCAtcmFkaXVzQik7CiAgICAgIGFkZFN1YihjcEEsIGNwQSwgb2Zmc2V0QSwgYm9keUEucG9zaXRpb24pOwogICAgICBhZGRTdWIoY3BCLCBjcEIsIG9mZnNldEIsIGJvZHlCLnBvc2l0aW9uKTsKICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25zLnB1c2goYyk7CgogICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvbikgewogICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICB9CgogICAgICByZXR1cm4gMTsKICAgIH07CgogICAgZnVuY3Rpb24gYWRkU3ViKG91dCwgYSwgYiwgYykgewogICAgICBvdXRbMF0gPSBhWzBdICsgYlswXSAtIGNbMF07CiAgICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdIC0gY1sxXTsKICAgIH0KICAgIC8qKgogICAgICogUGxhbmUvQ29udmV4IE5hcnJvd3BoYXNlCiAgICAgKiBAbWV0aG9kIHBsYW5lQ29udmV4CiAgICAgKiBAcGFyYW0gIHtCb2R5fSBwbGFuZUJvZHkKICAgICAqIEBwYXJhbSAge1BsYW5lfSBwbGFuZVNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gcGxhbmVPZmZzZXQKICAgICAqIEBwYXJhbSAge051bWJlcn0gcGxhbmVBbmdsZQogICAgICogQHBhcmFtICB7Qm9keX0gY29udmV4Qm9keQogICAgICogQHBhcmFtICB7Q29udmV4fSBjb252ZXhTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9IGNvbnZleE9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBjb252ZXhBbmdsZQogICAgICogQHBhcmFtIHtCb29sZWFufSBqdXN0VGVzdAogICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICogQHRvZG8gb25seSB1c2UgdGhlIGRlZXBlc3QgY29udGFjdCBwb2ludCArIHRoZSBjb250YWN0IHBvaW50IGZ1cnRoZXN0IGF3YXkgZnJvbSBpdAogICAgICovCgoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuUExBTkUgfCBTaGFwZSQzLkNPTlZFWF0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLlBMQU5FIHwgU2hhcGUkMy5CT1hdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUucGxhbmVDb252ZXggPSBmdW5jdGlvbiAocGxhbmVCb2R5LCBwbGFuZVNoYXBlLCBwbGFuZU9mZnNldCwgcGxhbmVBbmdsZSwgY29udmV4Qm9keSwgY29udmV4U2hhcGUsIGNvbnZleE9mZnNldCwgY29udmV4QW5nbGUsIGp1c3RUZXN0KSB7CiAgICAgIHZhciB3b3JsZFZlcnRleCA9IHRtcDEsCiAgICAgICAgICB3b3JsZE5vcm1hbCA9IHRtcDIsCiAgICAgICAgICBkaXN0ID0gdG1wMywKICAgICAgICAgIGxvY2FsUGxhbmVPZmZzZXQgPSB0bXA0LAogICAgICAgICAgbG9jYWxQbGFuZU5vcm1hbCA9IHRtcDUsCiAgICAgICAgICBsb2NhbERpc3QgPSB0bXA2OwogICAgICB2YXIgbnVtUmVwb3J0ZWQgPSAwOwogICAgICByb3RhdGUkMSh3b3JsZE5vcm1hbCwgeUF4aXMkMiwgcGxhbmVBbmdsZSk7IC8vIEdldCBjb252ZXgtbG9jYWwgcGxhbmUgb2Zmc2V0IGFuZCBub3JtYWwKCiAgICAgIHZlYzIkNy52ZWN0b3JUb0xvY2FsRnJhbWUobG9jYWxQbGFuZU5vcm1hbCwgd29ybGROb3JtYWwsIGNvbnZleEFuZ2xlKTsKICAgICAgdmVjMiQ3LnRvTG9jYWxGcmFtZShsb2NhbFBsYW5lT2Zmc2V0LCBwbGFuZU9mZnNldCwgY29udmV4T2Zmc2V0LCBjb252ZXhBbmdsZSk7CiAgICAgIHZhciB2ZXJ0aWNlcyA9IGNvbnZleFNoYXBlLnZlcnRpY2VzOwoKICAgICAgZm9yICh2YXIgaSA9IDAsIG51bVZlcnRzID0gdmVydGljZXMubGVuZ3RoOyBpICE9PSBudW1WZXJ0czsgaSsrKSB7CiAgICAgICAgdmFyIHYgPSB2ZXJ0aWNlc1tpXTsKICAgICAgICBzdWIkMShsb2NhbERpc3QsIHYsIGxvY2FsUGxhbmVPZmZzZXQpOwoKICAgICAgICBpZiAoZG90JDEobG9jYWxEaXN0LCBsb2NhbFBsYW5lTm9ybWFsKSA8PSAwKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgICB9CgogICAgICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUod29ybGRWZXJ0ZXgsIHYsIGNvbnZleE9mZnNldCwgY29udmV4QW5nbGUpOwogICAgICAgICAgc3ViJDEoZGlzdCwgd29ybGRWZXJ0ZXgsIHBsYW5lT2Zmc2V0KTsgLy8gRm91bmQgdmVydGV4CgogICAgICAgICAgbnVtUmVwb3J0ZWQrKzsKICAgICAgICAgIHZhciBjID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24ocGxhbmVCb2R5LCBjb252ZXhCb2R5LCBwbGFuZVNoYXBlLCBjb252ZXhTaGFwZSk7CiAgICAgICAgICBzdWIkMShkaXN0LCB3b3JsZFZlcnRleCwgcGxhbmVPZmZzZXQpOwogICAgICAgICAgY29weSQyKGMubm9ybWFsQSwgd29ybGROb3JtYWwpOwogICAgICAgICAgdmFyIGQgPSBkb3QkMShkaXN0LCBjLm5vcm1hbEEpOwogICAgICAgICAgc2NhbGUoZGlzdCwgYy5ub3JtYWxBLCBkKTsgLy8gcmogaXMgZnJvbSBjb252ZXggY2VudGVyIHRvIGNvbnRhY3QKCiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEIsIHdvcmxkVmVydGV4LCBjb252ZXhCb2R5LnBvc2l0aW9uKTsgLy8gcmkgaXMgZnJvbSBwbGFuZSBjZW50ZXIgdG8gY29udGFjdAoKICAgICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QSwgd29ybGRWZXJ0ZXgsIGRpc3QpOwogICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRBLCBjLmNvbnRhY3RQb2ludEEsIHBsYW5lQm9keS5wb3NpdGlvbik7CiAgICAgICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvbnMucHVzaChjKTsKCiAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24pIHsKICAgICAgICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICAgICAgICB0aGlzLmZyaWN0aW9uRXF1YXRpb25zLnB1c2godGhpcy5jcmVhdGVGcmljdGlvbkZyb21Db250YWN0KGMpKTsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24pIHsKICAgICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvbiAmJiBudW1SZXBvcnRlZCkgewogICAgICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5wdXNoKHRoaXMuY3JlYXRlRnJpY3Rpb25Gcm9tQXZlcmFnZShudW1SZXBvcnRlZCkpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG51bVJlcG9ydGVkOwogICAgfTsKICAgIC8qKgogICAgICogTmFycm93cGhhc2UgZm9yIHBhcnRpY2xlIHZzIHBsYW5lCiAgICAgKiBAbWV0aG9kIHBhcnRpY2xlUGxhbmUKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgICAgIHBhcnRpY2xlQm9keQogICAgICogQHBhcmFtICB7UGFydGljbGV9ICAgcGFydGljbGVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgcGFydGljbGVPZmZzZXQKICAgICAqIEBwYXJhbSAge051bWJlcn0gICAgIHBhcnRpY2xlQW5nbGUKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgICAgIHBsYW5lQm9keQogICAgICogQHBhcmFtICB7UGxhbmV9ICAgICAgcGxhbmVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgcGxhbmVPZmZzZXQKICAgICAqIEBwYXJhbSAge051bWJlcn0gICAgIHBsYW5lQW5nbGUKICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgIGp1c3RUZXN0CiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5QQVJUSUNMRSB8IFNoYXBlJDMuUExBTkVdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUucGFydGljbGVQbGFuZSA9IGZ1bmN0aW9uIChwYXJ0aWNsZUJvZHksIHBhcnRpY2xlU2hhcGUsIHBhcnRpY2xlT2Zmc2V0LCBwYXJ0aWNsZUFuZ2xlLCBwbGFuZUJvZHksIHBsYW5lU2hhcGUsIHBsYW5lT2Zmc2V0LCBwbGFuZUFuZ2xlLCBqdXN0VGVzdCkgewogICAgICB2YXIgZGlzdCA9IHRtcDEsCiAgICAgICAgICB3b3JsZE5vcm1hbCA9IHRtcDI7CiAgICAgIHBsYW5lQW5nbGUgPSBwbGFuZUFuZ2xlIHx8IDA7CiAgICAgIHN1YiQxKGRpc3QsIHBhcnRpY2xlT2Zmc2V0LCBwbGFuZU9mZnNldCk7CiAgICAgIHJvdGF0ZSQxKHdvcmxkTm9ybWFsLCB5QXhpcyQyLCBwbGFuZUFuZ2xlKTsKICAgICAgdmFyIGQgPSBkb3QkMShkaXN0LCB3b3JsZE5vcm1hbCk7CgogICAgICBpZiAoZCA+IDApIHsKICAgICAgICByZXR1cm4gMDsKICAgICAgfQoKICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0KCiAgICAgIHZhciBjID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24ocGxhbmVCb2R5LCBwYXJ0aWNsZUJvZHksIHBsYW5lU2hhcGUsIHBhcnRpY2xlU2hhcGUpOwogICAgICBjb3B5JDIoYy5ub3JtYWxBLCB3b3JsZE5vcm1hbCk7CiAgICAgIHNjYWxlKGRpc3QsIGMubm9ybWFsQSwgZCk7IC8vIGRpc3QgaXMgbm93IHRoZSBkaXN0YW5jZSB2ZWN0b3IgaW4gdGhlIG5vcm1hbCBkaXJlY3Rpb24KICAgICAgLy8gcmkgaXMgdGhlIHBhcnRpY2xlIHBvc2l0aW9uIHByb2plY3RlZCBkb3duIG9udG8gdGhlIHBsYW5lLCBmcm9tIHRoZSBwbGFuZSBjZW50ZXIKCiAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QSwgcGFydGljbGVPZmZzZXQsIGRpc3QpOwogICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgcGxhbmVCb2R5LnBvc2l0aW9uKTsgLy8gcmogaXMgZnJvbSB0aGUgYm9keSBjZW50ZXIgdG8gdGhlIHBhcnRpY2xlIGNlbnRlcgoKICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRCLCBwYXJ0aWNsZU9mZnNldCwgcGFydGljbGVCb2R5LnBvc2l0aW9uKTsKICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25zLnB1c2goYyk7CgogICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvbikgewogICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICB9CgogICAgICByZXR1cm4gMTsKICAgIH07CiAgICAvKioKICAgICAqIENpcmNsZS9QYXJ0aWNsZSBOYXJyb3dwaGFzZQogICAgICogQG1ldGhvZCBjaXJjbGVQYXJ0aWNsZQogICAgICogQHBhcmFtICB7Qm9keX0gY2lyY2xlQm9keQogICAgICogQHBhcmFtICB7Q2lyY2xlfSBjaXJjbGVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9IGNpcmNsZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBjaXJjbGVBbmdsZQogICAgICogQHBhcmFtICB7Qm9keX0gcGFydGljbGVCb2R5CiAgICAgKiBAcGFyYW0gIHtQYXJ0aWNsZX0gcGFydGljbGVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9IHBhcnRpY2xlT2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHBhcnRpY2xlQW5nbGUKICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGp1c3RUZXN0CiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5DSVJDTEUgfCBTaGFwZSQzLlBBUlRJQ0xFXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLmNpcmNsZVBhcnRpY2xlID0gZnVuY3Rpb24gKGNpcmNsZUJvZHksIGNpcmNsZVNoYXBlLCBjaXJjbGVPZmZzZXQsIGNpcmNsZUFuZ2xlLCBwYXJ0aWNsZUJvZHksIHBhcnRpY2xlU2hhcGUsIHBhcnRpY2xlT2Zmc2V0LCBwYXJ0aWNsZUFuZ2xlLCBqdXN0VGVzdCkgewogICAgICB2YXIgZGlzdCA9IHRtcDE7CiAgICAgIHZhciBjaXJjbGVSYWRpdXMgPSBjaXJjbGVTaGFwZS5yYWRpdXM7CiAgICAgIHN1YiQxKGRpc3QsIHBhcnRpY2xlT2Zmc2V0LCBjaXJjbGVPZmZzZXQpOwoKICAgICAgaWYgKHNxdWFyZWRMZW5ndGgoZGlzdCkgPiBjaXJjbGVSYWRpdXMgKiBjaXJjbGVSYWRpdXMpIHsKICAgICAgICByZXR1cm4gMDsKICAgICAgfQoKICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgcmV0dXJuIDE7CiAgICAgIH0KCiAgICAgIHZhciBjID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oY2lyY2xlQm9keSwgcGFydGljbGVCb2R5LCBjaXJjbGVTaGFwZSwgcGFydGljbGVTaGFwZSk7CiAgICAgIHZhciBub3JtYWxBID0gYy5ub3JtYWxBOwogICAgICB2YXIgY29udGFjdFBvaW50QSA9IGMuY29udGFjdFBvaW50QTsKICAgICAgdmFyIGNvbnRhY3RQb2ludEIgPSBjLmNvbnRhY3RQb2ludEI7CiAgICAgIGNvcHkkMihub3JtYWxBLCBkaXN0KTsKICAgICAgbm9ybWFsaXplKG5vcm1hbEEsIG5vcm1hbEEpOyAvLyBWZWN0b3IgZnJvbSBjaXJjbGUgdG8gY29udGFjdCBwb2ludCBpcyB0aGUgbm9ybWFsIHRpbWVzIHRoZSBjaXJjbGUgcmFkaXVzCgogICAgICBzY2FsZShjb250YWN0UG9pbnRBLCBub3JtYWxBLCBjaXJjbGVSYWRpdXMpOwogICAgICBhZGQkMShjb250YWN0UG9pbnRBLCBjb250YWN0UG9pbnRBLCBjaXJjbGVPZmZzZXQpOwogICAgICBzdWIkMShjb250YWN0UG9pbnRBLCBjb250YWN0UG9pbnRBLCBjaXJjbGVCb2R5LnBvc2l0aW9uKTsgLy8gVmVjdG9yIGZyb20gcGFydGljbGUgY2VudGVyIHRvIGNvbnRhY3QgcG9pbnQgaXMgemVybwoKICAgICAgc3ViJDEoY29udGFjdFBvaW50QiwgcGFydGljbGVPZmZzZXQsIHBhcnRpY2xlQm9keS5wb3NpdGlvbik7CiAgICAgIHRoaXMuY29udGFjdEVxdWF0aW9ucy5wdXNoKGMpOwoKICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb24pIHsKICAgICAgICB0aGlzLmZyaWN0aW9uRXF1YXRpb25zLnB1c2godGhpcy5jcmVhdGVGcmljdGlvbkZyb21Db250YWN0KGMpKTsKICAgICAgfQoKICAgICAgcmV0dXJuIDE7CiAgICB9OwoKICAgIHZhciBwbGFuZUNhcHN1bGVfdG1wQ2lyY2xlID0gbmV3IENpcmNsZSh7CiAgICAgIHJhZGl1czogMQogICAgfSksCiAgICAgICAgcGxhbmVDYXBzdWxlX3RtcDEgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgcGxhbmVDYXBzdWxlX3RtcDIgPSBjcmVhdGVWZWMyKCk7CiAgICAvKioKICAgICAqIEBtZXRob2QgcGxhbmVDYXBzdWxlCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBwbGFuZUJvZHkKICAgICAqIEBwYXJhbSAge0NpcmNsZX0gcGxhbmVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9IHBsYW5lT2Zmc2V0CiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHBsYW5lQW5nbGUKICAgICAqIEBwYXJhbSAge0JvZHl9IGNhcHN1bGVCb2R5CiAgICAgKiBAcGFyYW0gIHtQYXJ0aWNsZX0gY2Fwc3VsZVNoYXBlCiAgICAgKiBAcGFyYW0gIHtBcnJheX0gY2Fwc3VsZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSBjYXBzdWxlQW5nbGUKICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0ganVzdFRlc3QKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuUExBTkUgfCBTaGFwZSQzLkNBUFNVTEVdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUucGxhbmVDYXBzdWxlID0gZnVuY3Rpb24gKHBsYW5lQm9keSwgcGxhbmVTaGFwZSwgcGxhbmVPZmZzZXQsIHBsYW5lQW5nbGUsIGNhcHN1bGVCb2R5LCBjYXBzdWxlU2hhcGUsIGNhcHN1bGVPZmZzZXQsIGNhcHN1bGVBbmdsZSwganVzdFRlc3QpIHsKICAgICAgdmFyIGVuZDEgPSBwbGFuZUNhcHN1bGVfdG1wMSwKICAgICAgICAgIGVuZDIgPSBwbGFuZUNhcHN1bGVfdG1wMiwKICAgICAgICAgIGNpcmNsZSA9IHBsYW5lQ2Fwc3VsZV90bXBDaXJjbGUsCiAgICAgICAgICBoYWxmTGVuZ3RoID0gY2Fwc3VsZVNoYXBlLmxlbmd0aCAvIDI7IC8vIENvbXB1dGUgd29ybGQgZW5kIHBvc2l0aW9ucwoKICAgICAgdmVjMiQ3LnNldChlbmQxLCAtaGFsZkxlbmd0aCwgMCk7CiAgICAgIHZlYzIkNy5zZXQoZW5kMiwgaGFsZkxlbmd0aCwgMCk7CiAgICAgIHZlYzIkNy50b0dsb2JhbEZyYW1lKGVuZDEsIGVuZDEsIGNhcHN1bGVPZmZzZXQsIGNhcHN1bGVBbmdsZSk7CiAgICAgIHZlYzIkNy50b0dsb2JhbEZyYW1lKGVuZDIsIGVuZDIsIGNhcHN1bGVPZmZzZXQsIGNhcHN1bGVBbmdsZSk7CiAgICAgIGNpcmNsZS5yYWRpdXMgPSBjYXBzdWxlU2hhcGUucmFkaXVzOwogICAgICB2YXIgZW5hYmxlRnJpY3Rpb25CZWZvcmU7IC8vIFRlbXBvcmFyaWx5IHR1cm4gb2ZmIGZyaWN0aW9uCgogICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbikgewogICAgICAgIGVuYWJsZUZyaWN0aW9uQmVmb3JlID0gdGhpcy5lbmFibGVGcmljdGlvbjsKICAgICAgICB0aGlzLmVuYWJsZUZyaWN0aW9uID0gZmFsc2U7CiAgICAgIH0gLy8gRG8gTmFycm93cGhhc2UgYXMgdHdvIGNpcmNsZXMKCgogICAgICB2YXIgbnVtQ29udGFjdHMxID0gdGhpcy5jaXJjbGVQbGFuZShjYXBzdWxlQm9keSwgY2lyY2xlLCBlbmQxLCAwLCBwbGFuZUJvZHksIHBsYW5lU2hhcGUsIHBsYW5lT2Zmc2V0LCBwbGFuZUFuZ2xlLCBqdXN0VGVzdCksCiAgICAgICAgICBudW1Db250YWN0czIgPSB0aGlzLmNpcmNsZVBsYW5lKGNhcHN1bGVCb2R5LCBjaXJjbGUsIGVuZDIsIDAsIHBsYW5lQm9keSwgcGxhbmVTaGFwZSwgcGxhbmVPZmZzZXQsIHBsYW5lQW5nbGUsIGp1c3RUZXN0KTsgLy8gUmVzdG9yZSBmcmljdGlvbgoKICAgICAgaWYgKHRoaXMuZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24pIHsKICAgICAgICB0aGlzLmVuYWJsZUZyaWN0aW9uID0gZW5hYmxlRnJpY3Rpb25CZWZvcmU7CiAgICAgIH0KCiAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgIHJldHVybiBudW1Db250YWN0czEgKyBudW1Db250YWN0czI7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdmFyIG51bVRvdGFsID0gbnVtQ29udGFjdHMxICsgbnVtQ29udGFjdHMyOwoKICAgICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbikgewogICAgICAgICAgaWYgKG51bVRvdGFsKSB7CiAgICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUF2ZXJhZ2UobnVtVG90YWwpKTsKICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIHJldHVybiBudW1Ub3RhbDsKICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBjaXJjbGVQbGFuZQogICAgICogQHBhcmFtICB7Qm9keX0gICAgY2lyY2xlQm9keQogICAgICogQHBhcmFtICB7Q2lyY2xlfSAgY2lyY2xlU2hhcGUKICAgICAqIEBwYXJhbSAge0FycmF5fSAgIGNpcmNsZU9mZnNldAogICAgICogQHBhcmFtICB7TnVtYmVyfSAgY2lyY2xlQW5nbGUKICAgICAqIEBwYXJhbSAge0JvZHl9ICAgIHBsYW5lQm9keQogICAgICogQHBhcmFtICB7UGxhbmV9ICAgcGxhbmVTaGFwZQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgcGxhbmVPZmZzZXQKICAgICAqIEBwYXJhbSAge051bWJlcn0gIHBsYW5lQW5nbGUKICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGp1c3RUZXN0CiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgKi8KCgogICAgTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5DSVJDTEUgfCBTaGFwZSQzLlBMQU5FXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlLmNpcmNsZVBsYW5lID0gZnVuY3Rpb24gKGNpcmNsZUJvZHksIGNpcmNsZVNoYXBlLCBjaXJjbGVPZmZzZXQsIGNpcmNsZUFuZ2xlLCBwbGFuZUJvZHksIHBsYW5lU2hhcGUsIHBsYW5lT2Zmc2V0LCBwbGFuZUFuZ2xlLCBqdXN0VGVzdCkgewogICAgICB2YXIgY2lyY2xlUmFkaXVzID0gY2lyY2xlU2hhcGUucmFkaXVzOyAvLyBWZWN0b3IgZnJvbSBwbGFuZSB0byBjaXJjbGUKCiAgICAgIHZhciBwbGFuZVRvQ2lyY2xlID0gdG1wMSwKICAgICAgICAgIHdvcmxkTm9ybWFsID0gdG1wMiwKICAgICAgICAgIHRlbXAgPSB0bXAzOwogICAgICBzdWIkMShwbGFuZVRvQ2lyY2xlLCBjaXJjbGVPZmZzZXQsIHBsYW5lT2Zmc2V0KTsgLy8gV29ybGQgcGxhbmUgbm9ybWFsCgogICAgICByb3RhdGUkMSh3b3JsZE5vcm1hbCwgeUF4aXMkMiwgcGxhbmVBbmdsZSk7IC8vIE5vcm1hbCBkaXJlY3Rpb24gZGlzdGFuY2UKCiAgICAgIHZhciBkID0gZG90JDEod29ybGROb3JtYWwsIHBsYW5lVG9DaXJjbGUpOwoKICAgICAgaWYgKGQgPiBjaXJjbGVSYWRpdXMpIHsKICAgICAgICByZXR1cm4gMDsgLy8gTm8gb3ZlcmxhcC4gQWJvcnQuCiAgICAgIH0KCiAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgIHJldHVybiAxOwogICAgICB9IC8vIENyZWF0ZSBjb250YWN0CgoKICAgICAgdmFyIGNvbnRhY3QgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihwbGFuZUJvZHksIGNpcmNsZUJvZHksIHBsYW5lU2hhcGUsIGNpcmNsZVNoYXBlKTsgLy8gbmkgaXMgdGhlIHBsYW5lIHdvcmxkIG5vcm1hbAoKICAgICAgY29weSQyKGNvbnRhY3Qubm9ybWFsQSwgd29ybGROb3JtYWwpOyAvLyByaiBpcyB0aGUgdmVjdG9yIGZyb20gY2lyY2xlIGNlbnRlciB0byB0aGUgY29udGFjdCBwb2ludAoKICAgICAgdmFyIGNwQiA9IGNvbnRhY3QuY29udGFjdFBvaW50QjsKICAgICAgc2NhbGUoY3BCLCBjb250YWN0Lm5vcm1hbEEsIC1jaXJjbGVSYWRpdXMpOwogICAgICBhZGQkMShjcEIsIGNwQiwgY2lyY2xlT2Zmc2V0KTsKICAgICAgc3ViJDEoY3BCLCBjcEIsIGNpcmNsZUJvZHkucG9zaXRpb24pOyAvLyByaSBpcyB0aGUgZGlzdGFuY2UgZnJvbSBwbGFuZSBjZW50ZXIgdG8gY29udGFjdC4KCiAgICAgIHZhciBjcEEgPSBjb250YWN0LmNvbnRhY3RQb2ludEE7CiAgICAgIHNjYWxlKHRlbXAsIGNvbnRhY3Qubm9ybWFsQSwgZCk7CiAgICAgIHN1YiQxKGNwQSwgcGxhbmVUb0NpcmNsZSwgdGVtcCk7IC8vIFN1YnRyYWN0IG5vcm1hbCBkaXN0YW5jZSB2ZWN0b3IgZnJvbSB0aGUgZGlzdGFuY2UgdmVjdG9yCgogICAgICBhZGQkMShjcEEsIGNwQSwgcGxhbmVPZmZzZXQpOwogICAgICBzdWIkMShjcEEsIGNwQSwgcGxhbmVCb2R5LnBvc2l0aW9uKTsKICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25zLnB1c2goY29udGFjdCk7CgogICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvbikgewogICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoY29udGFjdCkpOwogICAgICB9CgogICAgICByZXR1cm4gMTsKICAgIH07IC8vIEZpbmQgdGhlIG1heCBzZXBhcmF0aW9uIGJldHdlZW4gcG9seTEgYW5kIHBvbHkyIHVzaW5nIGVkZ2Ugbm9ybWFscyBmcm9tIHBvbHkxLgoKCiAgICB2YXIgZmluZE1heFNlcGFyYXRpb25fbiA9IHZlYzIkNy5jcmVhdGUoKTsKICAgIHZhciBmaW5kTWF4U2VwYXJhdGlvbl92MSA9IHZlYzIkNy5jcmVhdGUoKTsKICAgIHZhciBmaW5kTWF4U2VwYXJhdGlvbl90bXAgPSB2ZWMyJDcuY3JlYXRlKCk7CiAgICB2YXIgZmluZE1heFNlcGFyYXRpb25fdG1wMiA9IHZlYzIkNy5jcmVhdGUoKTsKCiAgICBmdW5jdGlvbiBmaW5kTWF4U2VwYXJhdGlvbihtYXhTZXBhcmF0aW9uT3V0LCBwb2x5MSwgcG9zaXRpb24xLCBhbmdsZTEsIHBvbHkyLCBwb3NpdGlvbjIsIGFuZ2xlMikgewogICAgICB2YXIgY291bnQxID0gcG9seTEudmVydGljZXMubGVuZ3RoOwogICAgICB2YXIgY291bnQyID0gcG9seTIudmVydGljZXMubGVuZ3RoOwogICAgICB2YXIgbjFzID0gcG9seTEubm9ybWFsczsKICAgICAgdmFyIHYxcyA9IHBvbHkxLnZlcnRpY2VzOwogICAgICB2YXIgdjJzID0gcG9seTIudmVydGljZXM7CiAgICAgIHZhciBuID0gZmluZE1heFNlcGFyYXRpb25fbjsKICAgICAgdmFyIHYxID0gZmluZE1heFNlcGFyYXRpb25fdjE7CiAgICAgIHZhciB0bXAgPSBmaW5kTWF4U2VwYXJhdGlvbl90bXA7CiAgICAgIHZhciB0bXAyID0gZmluZE1heFNlcGFyYXRpb25fdG1wMjsKICAgICAgdmFyIGFuZ2xlID0gYW5nbGUxIC0gYW5nbGUyOwogICAgICB2YXIgYmVzdEluZGV4ID0gMDsKICAgICAgdmFyIG1heFNlcGFyYXRpb24gPSAtTnVtYmVyLk1BWF9WQUxVRTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQxOyArK2kpIHsKICAgICAgICAvLyBHZXQgcG9seTEgbm9ybWFsIGluIGZyYW1lMi4KICAgICAgICB2ZWMyJDcucm90YXRlKG4sIG4xc1tpXSwgYW5nbGUpOyAvLyBHZXQgcG9seTEgdmVydGV4IGluIGZyYW1lMgoKICAgICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZSh0bXAyLCB2MXNbaV0sIHBvc2l0aW9uMSwgYW5nbGUxKTsKICAgICAgICB2ZWMyJDcudG9Mb2NhbEZyYW1lKHYxLCB0bXAyLCBwb3NpdGlvbjIsIGFuZ2xlMik7IC8vIEZpbmQgZGVlcGVzdCBwb2ludCBmb3Igbm9ybWFsIGkuCgogICAgICAgIHZhciBzaSA9IE51bWJlci5NQVhfVkFMVUU7CgogICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY291bnQyOyArK2opIHsKICAgICAgICAgIHZlYzIkNy5zdWJ0cmFjdCh0bXAsIHYyc1tqXSwgdjEpOwogICAgICAgICAgdmFyIHNpaiA9IHZlYzIkNy5kb3QobiwgdG1wKTsKCiAgICAgICAgICBpZiAoc2lqIDwgc2kpIHsKICAgICAgICAgICAgc2kgPSBzaWo7CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBpZiAoc2kgPiBtYXhTZXBhcmF0aW9uKSB7CiAgICAgICAgICBtYXhTZXBhcmF0aW9uID0gc2k7CiAgICAgICAgICBiZXN0SW5kZXggPSBpOwogICAgICAgIH0KICAgICAgfSAvLyBVc2UgYSB2ZWMyIGZvciBzdG9yaW5nIHRoZSBmbG9hdCB2YWx1ZSBhbmQgYWx3YXlzIHJldHVybiBpbnQsIGZvciBwZXJmCgoKICAgICAgbWF4U2VwYXJhdGlvbk91dFswXSA9IG1heFNlcGFyYXRpb247CiAgICAgIHJldHVybiBiZXN0SW5kZXg7CiAgICB9CgogICAgdmFyIGZpbmRJbmNpZGVudEVkZ2Vfbm9ybWFsMSA9IHZlYzIkNy5jcmVhdGUoKTsKCiAgICBmdW5jdGlvbiBmaW5kSW5jaWRlbnRFZGdlKGNsaXBWZXJ0aWNlc091dCwgcG9seTEsIHBvc2l0aW9uMSwgYW5nbGUxLCBlZGdlMSwgcG9seTIsIHBvc2l0aW9uMiwgYW5nbGUyKSB7CiAgICAgIHZhciBub3JtYWxzMSA9IHBvbHkxLm5vcm1hbHM7CiAgICAgIHZhciBjb3VudDIgPSBwb2x5Mi52ZXJ0aWNlcy5sZW5ndGg7CiAgICAgIHZhciB2ZXJ0aWNlczIgPSBwb2x5Mi52ZXJ0aWNlczsKICAgICAgdmFyIG5vcm1hbHMyID0gcG9seTIubm9ybWFsczsgLy8gR2V0IHRoZSBub3JtYWwgb2YgdGhlIHJlZmVyZW5jZSBlZGdlIGluIHBvbHkyJ3MgZnJhbWUuCgogICAgICB2YXIgbm9ybWFsMSA9IGZpbmRJbmNpZGVudEVkZ2Vfbm9ybWFsMTsKICAgICAgdmVjMiQ3LnJvdGF0ZShub3JtYWwxLCBub3JtYWxzMVtlZGdlMV0sIGFuZ2xlMSAtIGFuZ2xlMik7IC8vIEZpbmQgdGhlIGluY2lkZW50IGVkZ2Ugb24gcG9seTIuCgogICAgICB2YXIgaW5kZXggPSAwOwogICAgICB2YXIgbWluRG90ID0gTnVtYmVyLk1BWF9WQUxVRTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQyOyArK2kpIHsKICAgICAgICB2YXIgZG90ID0gdmVjMiQ3LmRvdChub3JtYWwxLCBub3JtYWxzMltpXSk7CgogICAgICAgIGlmIChkb3QgPCBtaW5Eb3QpIHsKICAgICAgICAgIG1pbkRvdCA9IGRvdDsKICAgICAgICAgIGluZGV4ID0gaTsKICAgICAgICB9CiAgICAgIH0gLy8gQnVpbGQgdGhlIGNsaXAgdmVydGljZXMgZm9yIHRoZSBpbmNpZGVudCBlZGdlLgoKCiAgICAgIHZhciBpMSA9IGluZGV4OwogICAgICB2YXIgaTIgPSBpMSArIDEgPCBjb3VudDIgPyBpMSArIDEgOiAwOwogICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZShjbGlwVmVydGljZXNPdXRbMF0sIHZlcnRpY2VzMltpMV0sIHBvc2l0aW9uMiwgYW5nbGUyKTsKICAgICAgdmVjMiQ3LnRvR2xvYmFsRnJhbWUoY2xpcFZlcnRpY2VzT3V0WzFdLCB2ZXJ0aWNlczJbaTJdLCBwb3NpdGlvbjIsIGFuZ2xlMik7CiAgICB9IC8vIEZpbmQgZWRnZSBub3JtYWwgb2YgbWF4IHNlcGFyYXRpb24gb24gQSAtIHJldHVybiBpZiBzZXBhcmF0aW5nIGF4aXMgaXMgZm91bmQKICAgIC8vIEZpbmQgZWRnZSBub3JtYWwgb2YgbWF4IHNlcGFyYXRpb24gb24gQiAtIHJldHVybiBpZiBzZXBhcmF0aW9uIGF4aXMgaXMgZm91bmQKICAgIC8vIENob29zZSByZWZlcmVuY2UgZWRnZSBhcyBtaW4obWluQSwgbWluQikKICAgIC8vIEZpbmQgaW5jaWRlbnQgZWRnZQogICAgLy8gQ2xpcAogICAgLy8gVGhlIG5vcm1hbCBwb2ludHMgZnJvbSAxIHRvIDIKCgogICAgdmFyIGNvbGxpZGVQb2x5Z29uc190ZW1wVmVjID0gdmVjMiQ3LmNyZWF0ZSgpOwogICAgdmFyIGNvbGxpZGVQb2x5Z29uc190bXBWZWMgPSB2ZWMyJDcuY3JlYXRlKCk7CiAgICB2YXIgY29sbGlkZVBvbHlnb25zX2xvY2FsVGFuZ2VudCA9IHZlYzIkNy5jcmVhdGUoKTsKICAgIHZhciBjb2xsaWRlUG9seWdvbnNfbG9jYWxOb3JtYWwgPSB2ZWMyJDcuY3JlYXRlKCk7CiAgICB2YXIgY29sbGlkZVBvbHlnb25zX3BsYW5lUG9pbnQgPSB2ZWMyJDcuY3JlYXRlKCk7CiAgICB2YXIgY29sbGlkZVBvbHlnb25zX3RhbmdlbnQgPSB2ZWMyJDcuY3JlYXRlKCk7CiAgICB2YXIgY29sbGlkZVBvbHlnb25zX25vcm1hbCA9IHZlYzIkNy5jcmVhdGUoKTsKICAgIHZhciBjb2xsaWRlUG9seWdvbnNfbmVnYXRpdmVUYW5nZW50ID0gdmVjMiQ3LmNyZWF0ZSgpOwogICAgdmFyIGNvbGxpZGVQb2x5Z29uc192MTEgPSB2ZWMyJDcuY3JlYXRlKCk7CiAgICB2YXIgY29sbGlkZVBvbHlnb25zX3YxMiA9IHZlYzIkNy5jcmVhdGUoKTsKICAgIHZhciBjb2xsaWRlUG9seWdvbnNfZGlzdCA9IHZlYzIkNy5jcmVhdGUoKTsKICAgIHZhciBjb2xsaWRlUG9seWdvbnNfY2xpcFBvaW50czEgPSBbdmVjMiQ3LmNyZWF0ZSgpLCB2ZWMyJDcuY3JlYXRlKCldOwogICAgdmFyIGNvbGxpZGVQb2x5Z29uc19jbGlwUG9pbnRzMiA9IFt2ZWMyJDcuY3JlYXRlKCksIHZlYzIkNy5jcmVhdGUoKV07CiAgICB2YXIgY29sbGlkZVBvbHlnb25zX2luY2lkZW50RWRnZSA9IFt2ZWMyJDcuY3JlYXRlKCksIHZlYzIkNy5jcmVhdGUoKV07CiAgICB2YXIgbWF4TWFuaWZvbGRQb2ludHMgPSAyOwogICAgLypmdW5jdGlvbiBjb2xsaWRlUG9seWdvbnMoCiAgICAgICAgbWFuaWZvbGQsCiAgICAgICAgcG9seUEsIHBvc2l0aW9uQSwgYW5nbGVBLAogICAgICAgIHBvbHlCLCBwb3NpdGlvbkIsIGFuZ2xlQiwKICAgICAgICBpbmNpZGVudEVkZ2UKICAgICkgeyovCgogICAgLyoqCiAgICAgKiBDb252ZXgvY29udmV4IE5hcnJvd3BoYXNlLlNlZSA8YSBocmVmPSJodHRwOi8vd3d3LmFsdGRldmJsb2dhZGF5LmNvbS8yMDExLzA1LzEzL2NvbnRhY3QtZ2VuZXJhdGlvbi1iZXR3ZWVuLTNkLWNvbnZleC1tZXNoZXMvIj50aGlzIGFydGljbGU8L2E+IGZvciBtb3JlIGluZm8uCiAgICAgKiBAbWV0aG9kIGNvbnZleENvbnZleAogICAgICogQHBhcmFtICB7Qm9keX0gYmkKICAgICAqIEBwYXJhbSAge0NvbnZleH0gc2kKICAgICAqIEBwYXJhbSAge0FycmF5fSB4aQogICAgICogQHBhcmFtICB7TnVtYmVyfSBhaQogICAgICogQHBhcmFtICB7Qm9keX0gYmoKICAgICAqIEBwYXJhbSAge0NvbnZleH0gc2oKICAgICAqIEBwYXJhbSAge0FycmF5fSB4agogICAgICogQHBhcmFtICB7TnVtYmVyfSBhagogICAgICogQHBhcmFtICB7Qm9vbGVhbn0ganVzdFRlc3QKICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAqLwoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQ09OVkVYXSA9IE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQ09OVkVYIHwgU2hhcGUkMy5CT1hdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGVbU2hhcGUkMy5CT1hdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUuY29udmV4Q29udmV4ID0gZnVuY3Rpb24gKGJvZHlBLCBwb2x5QSwgcG9zaXRpb25BLCBhbmdsZUEsIGJvZHlCLCBwb2x5QiwgcG9zaXRpb25CLCBhbmdsZUIsIGp1c3RUZXN0KSB7CiAgICAgIHZhciB0b3RhbFJhZGl1cyA9IDA7CiAgICAgIHZhciBkaXN0ID0gY29sbGlkZVBvbHlnb25zX2Rpc3Q7CiAgICAgIHZhciB0ZW1wVmVjID0gY29sbGlkZVBvbHlnb25zX3RlbXBWZWM7CiAgICAgIHZhciB0bXBWZWMgPSBjb2xsaWRlUG9seWdvbnNfdG1wVmVjOwogICAgICB2YXIgZWRnZUEgPSBmaW5kTWF4U2VwYXJhdGlvbih0ZW1wVmVjLCBwb2x5QSwgcG9zaXRpb25BLCBhbmdsZUEsIHBvbHlCLCBwb3NpdGlvbkIsIGFuZ2xlQik7CiAgICAgIHZhciBzZXBhcmF0aW9uQSA9IHRlbXBWZWNbMF07CgogICAgICBpZiAoc2VwYXJhdGlvbkEgPiB0b3RhbFJhZGl1cykgewogICAgICAgIHJldHVybiAwOwogICAgICB9CgogICAgICB2YXIgZWRnZUIgPSBmaW5kTWF4U2VwYXJhdGlvbih0bXBWZWMsIHBvbHlCLCBwb3NpdGlvbkIsIGFuZ2xlQiwgcG9seUEsIHBvc2l0aW9uQSwgYW5nbGVBKTsKICAgICAgdmFyIHNlcGFyYXRpb25CID0gdG1wVmVjWzBdOwoKICAgICAgaWYgKHNlcGFyYXRpb25CID4gdG90YWxSYWRpdXMpIHsKICAgICAgICByZXR1cm4gMDsKICAgICAgfQoKICAgICAgdmFyIHBvbHkxOyAvLyByZWZlcmVuY2UgcG9seWdvbgoKICAgICAgdmFyIHBvbHkyOyAvLyBpbmNpZGVudCBwb2x5Z29uCgogICAgICB2YXIgcG9zaXRpb24xOwogICAgICB2YXIgcG9zaXRpb24yOwogICAgICB2YXIgYW5nbGUxOwogICAgICB2YXIgYW5nbGUyOwogICAgICB2YXIgYm9keTE7CiAgICAgIHZhciBib2R5MjsKICAgICAgdmFyIGVkZ2UxOyAvLyByZWZlcmVuY2UgZWRnZQoKICAgICAgaWYgKHNlcGFyYXRpb25CID4gc2VwYXJhdGlvbkEpIHsKICAgICAgICBwb2x5MSA9IHBvbHlCOwogICAgICAgIHBvbHkyID0gcG9seUE7CiAgICAgICAgYm9keTEgPSBib2R5QjsKICAgICAgICBib2R5MiA9IGJvZHlBOwogICAgICAgIHBvc2l0aW9uMSA9IHBvc2l0aW9uQjsKICAgICAgICBhbmdsZTEgPSBhbmdsZUI7CiAgICAgICAgcG9zaXRpb24yID0gcG9zaXRpb25BOwogICAgICAgIGFuZ2xlMiA9IGFuZ2xlQTsKICAgICAgICBlZGdlMSA9IGVkZ2VCOwogICAgICB9IGVsc2UgewogICAgICAgIHBvbHkxID0gcG9seUE7CiAgICAgICAgcG9seTIgPSBwb2x5QjsKICAgICAgICBib2R5MSA9IGJvZHlBOwogICAgICAgIGJvZHkyID0gYm9keUI7CiAgICAgICAgcG9zaXRpb24xID0gcG9zaXRpb25BOwogICAgICAgIGFuZ2xlMSA9IGFuZ2xlQTsKICAgICAgICBwb3NpdGlvbjIgPSBwb3NpdGlvbkI7CiAgICAgICAgYW5nbGUyID0gYW5nbGVCOwogICAgICAgIGVkZ2UxID0gZWRnZUE7CiAgICAgIH0KCiAgICAgIHZhciBpbmNpZGVudEVkZ2UgPSBjb2xsaWRlUG9seWdvbnNfaW5jaWRlbnRFZGdlOwogICAgICBmaW5kSW5jaWRlbnRFZGdlKGluY2lkZW50RWRnZSwgcG9seTEsIHBvc2l0aW9uMSwgYW5nbGUxLCBlZGdlMSwgcG9seTIsIHBvc2l0aW9uMiwgYW5nbGUyKTsKICAgICAgdmFyIGNvdW50MSA9IHBvbHkxLnZlcnRpY2VzLmxlbmd0aDsKICAgICAgdmFyIHZlcnRpY2VzMSA9IHBvbHkxLnZlcnRpY2VzOwogICAgICB2YXIgaXYxID0gZWRnZTE7CiAgICAgIHZhciBpdjIgPSBlZGdlMSArIDEgPCBjb3VudDEgPyBlZGdlMSArIDEgOiAwOwogICAgICB2YXIgdjExID0gY29sbGlkZVBvbHlnb25zX3YxMTsKICAgICAgdmFyIHYxMiA9IGNvbGxpZGVQb2x5Z29uc192MTI7CiAgICAgIHZlYzIkNy5jb3B5KHYxMSwgdmVydGljZXMxW2l2MV0pOwogICAgICB2ZWMyJDcuY29weSh2MTIsIHZlcnRpY2VzMVtpdjJdKTsKICAgICAgdmFyIGxvY2FsVGFuZ2VudCA9IGNvbGxpZGVQb2x5Z29uc19sb2NhbFRhbmdlbnQ7CiAgICAgIHZlYzIkNy5zdWJ0cmFjdChsb2NhbFRhbmdlbnQsIHYxMiwgdjExKTsKICAgICAgdmVjMiQ3Lm5vcm1hbGl6ZShsb2NhbFRhbmdlbnQsIGxvY2FsVGFuZ2VudCk7CiAgICAgIHZhciBsb2NhbE5vcm1hbCA9IGNvbGxpZGVQb2x5Z29uc19sb2NhbE5vcm1hbDsKICAgICAgdmVjMiQ3LmNyb3NzVloobG9jYWxOb3JtYWwsIGxvY2FsVGFuZ2VudCwgMS4wKTsKICAgICAgdmFyIHBsYW5lUG9pbnQgPSBjb2xsaWRlUG9seWdvbnNfcGxhbmVQb2ludDsKICAgICAgdmVjMiQ3LmFkZChwbGFuZVBvaW50LCB2MTEsIHYxMik7CiAgICAgIHZlYzIkNy5zY2FsZShwbGFuZVBvaW50LCBwbGFuZVBvaW50LCAwLjUpOwogICAgICB2YXIgdGFuZ2VudCA9IGNvbGxpZGVQb2x5Z29uc190YW5nZW50OyAvLyB0YW5nZW50IGluIHdvcmxkIHNwYWNlCgogICAgICB2ZWMyJDcucm90YXRlKHRhbmdlbnQsIGxvY2FsVGFuZ2VudCwgYW5nbGUxKTsKICAgICAgdmFyIG5vcm1hbCA9IGNvbGxpZGVQb2x5Z29uc19ub3JtYWw7IC8vIG5vcm1hbCBpbiB3b3JsZCBzcGFjZQoKICAgICAgdmVjMiQ3LmNyb3NzVloobm9ybWFsLCB0YW5nZW50LCAxLjApOwogICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZSh2MTEsIHYxMSwgcG9zaXRpb24xLCBhbmdsZTEpOwogICAgICB2ZWMyJDcudG9HbG9iYWxGcmFtZSh2MTIsIHYxMiwgcG9zaXRpb24xLCBhbmdsZTEpOyAvLyBGYWNlIG9mZnNldC4KCiAgICAgIHZhciBmcm9udE9mZnNldCA9IHZlYzIkNy5kb3Qobm9ybWFsLCB2MTEpOyAvLyBTaWRlIG9mZnNldHMsIGV4dGVuZGVkIGJ5IHBvbHl0b3BlIHNraW4gdGhpY2tuZXNzLgoKICAgICAgdmFyIHNpZGVPZmZzZXQxID0gLXZlYzIkNy5kb3QodGFuZ2VudCwgdjExKSArIHRvdGFsUmFkaXVzOwogICAgICB2YXIgc2lkZU9mZnNldDIgPSB2ZWMyJDcuZG90KHRhbmdlbnQsIHYxMikgKyB0b3RhbFJhZGl1czsgLy8gQ2xpcCBpbmNpZGVudCBlZGdlIGFnYWluc3QgZXh0cnVkZWQgZWRnZTEgc2lkZSBlZGdlcy4KCiAgICAgIHZhciBjbGlwUG9pbnRzMSA9IGNvbGxpZGVQb2x5Z29uc19jbGlwUG9pbnRzMTsKICAgICAgdmFyIGNsaXBQb2ludHMyID0gY29sbGlkZVBvbHlnb25zX2NsaXBQb2ludHMyOwogICAgICB2YXIgbnAgPSAwOyAvLyBDbGlwIHRvIGJveCBzaWRlIDEKCiAgICAgIHZhciBuZWdhdGl2ZVRhbmdlbnQgPSBjb2xsaWRlUG9seWdvbnNfbmVnYXRpdmVUYW5nZW50OwogICAgICB2ZWMyJDcuc2NhbGUobmVnYXRpdmVUYW5nZW50LCB0YW5nZW50LCAtMSk7CiAgICAgIG5wID0gY2xpcFNlZ21lbnRUb0xpbmUoY2xpcFBvaW50czEsIGluY2lkZW50RWRnZSwgbmVnYXRpdmVUYW5nZW50LCBzaWRlT2Zmc2V0MSk7CgogICAgICBpZiAobnAgPCAyKSB7CiAgICAgICAgcmV0dXJuIDA7CiAgICAgIH0gLy8gQ2xpcCB0byBuZWdhdGl2ZSBib3ggc2lkZSAxCgoKICAgICAgbnAgPSBjbGlwU2VnbWVudFRvTGluZShjbGlwUG9pbnRzMiwgY2xpcFBvaW50czEsIHRhbmdlbnQsIHNpZGVPZmZzZXQyKTsKCiAgICAgIGlmIChucCA8IDIpIHsKICAgICAgICByZXR1cm4gMDsKICAgICAgfQoKICAgICAgdmFyIHBvaW50Q291bnQgPSAwOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhNYW5pZm9sZFBvaW50czsgKytpKSB7CiAgICAgICAgdmFyIHNlcGFyYXRpb24gPSB2ZWMyJDcuZG90KG5vcm1hbCwgY2xpcFBvaW50czJbaV0pIC0gZnJvbnRPZmZzZXQ7CgogICAgICAgIGlmIChzZXBhcmF0aW9uIDw9IHRvdGFsUmFkaXVzKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgICB9CgogICAgICAgICAgKytwb2ludENvdW50OwogICAgICAgICAgdmFyIGMgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihib2R5MSwgYm9keTIsIHBvbHkxLCBwb2x5Mik7CiAgICAgICAgICB2ZWMyJDcuY29weShjLm5vcm1hbEEsIG5vcm1hbCk7CiAgICAgICAgICB2ZWMyJDcuY29weShjLmNvbnRhY3RQb2ludEIsIGNsaXBQb2ludHMyW2ldKTsKICAgICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBib2R5Mi5wb3NpdGlvbik7CiAgICAgICAgICB2ZWMyJDcuc2NhbGUoZGlzdCwgbm9ybWFsLCAtc2VwYXJhdGlvbik7CiAgICAgICAgICB2ZWMyJDcuYWRkKGMuY29udGFjdFBvaW50QSwgY2xpcFBvaW50czJbaV0sIGRpc3QpOwogICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRBLCBjLmNvbnRhY3RQb2ludEEsIGJvZHkxLnBvc2l0aW9uKTsKICAgICAgICAgIHRoaXMuY29udGFjdEVxdWF0aW9ucy5wdXNoKGMpOwoKICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uICYmICF0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHBvaW50Q291bnQgJiYgdGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbiAmJiB0aGlzLmVuYWJsZUZyaWN0aW9uKSB7CiAgICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9ucy5wdXNoKHRoaXMuY3JlYXRlRnJpY3Rpb25Gcm9tQXZlcmFnZShwb2ludENvdW50KSk7CiAgICAgIH0KCiAgICAgIHJldHVybiBwb2ludENvdW50OwogICAgfTsKCiAgICBmdW5jdGlvbiBjbGlwU2VnbWVudFRvTGluZSh2T3V0LCB2SW4sIG5vcm1hbCwgb2Zmc2V0KSB7CiAgICAgIC8vIFN0YXJ0IHdpdGggbm8gb3V0cHV0IHBvaW50cwogICAgICB2YXIgbnVtT3V0ID0gMDsgLy8gQ2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBvZiBlbmQgcG9pbnRzIHRvIHRoZSBsaW5lCgogICAgICB2YXIgZGlzdGFuY2UwID0gdmVjMiQ3LmRvdChub3JtYWwsIHZJblswXSkgLSBvZmZzZXQ7CiAgICAgIHZhciBkaXN0YW5jZTEgPSB2ZWMyJDcuZG90KG5vcm1hbCwgdkluWzFdKSAtIG9mZnNldDsgLy8gSWYgdGhlIHBvaW50cyBhcmUgYmVoaW5kIHRoZSBwbGFuZQoKICAgICAgaWYgKGRpc3RhbmNlMCA8PSAwLjApIHsKICAgICAgICB2ZWMyJDcuY29weSh2T3V0W251bU91dCsrXSwgdkluWzBdKTsKICAgICAgfQoKICAgICAgaWYgKGRpc3RhbmNlMSA8PSAwLjApIHsKICAgICAgICB2ZWMyJDcuY29weSh2T3V0W251bU91dCsrXSwgdkluWzFdKTsKICAgICAgfSAvLyBJZiB0aGUgcG9pbnRzIGFyZSBvbiBkaWZmZXJlbnQgc2lkZXMgb2YgdGhlIHBsYW5lCgoKICAgICAgaWYgKGRpc3RhbmNlMCAqIGRpc3RhbmNlMSA8IDAuMCkgewogICAgICAgIC8vIEZpbmQgaW50ZXJzZWN0aW9uIHBvaW50IG9mIGVkZ2UgYW5kIHBsYW5lCiAgICAgICAgdmFyIGludGVycCA9IGRpc3RhbmNlMCAvIChkaXN0YW5jZTAgLSBkaXN0YW5jZTEpOwogICAgICAgIHZhciB2ID0gdk91dFtudW1PdXRdOwogICAgICAgIHZlYzIkNy5zdWJ0cmFjdCh2LCB2SW5bMV0sIHZJblswXSk7CiAgICAgICAgdmVjMiQ3LnNjYWxlKHYsIHYsIGludGVycCk7CiAgICAgICAgdmVjMiQ3LmFkZCh2LCB2LCB2SW5bMF0pOwogICAgICAgICsrbnVtT3V0OwogICAgICB9CgogICAgICByZXR1cm4gbnVtT3V0OwogICAgfQoKICAgIHZhciBjaXJjbGVIZWlnaHRmaWVsZF9jYW5kaWRhdGUgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgY2lyY2xlSGVpZ2h0ZmllbGRfZGlzdCA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICBjaXJjbGVIZWlnaHRmaWVsZF92MCA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICBjaXJjbGVIZWlnaHRmaWVsZF92MSA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICBjaXJjbGVIZWlnaHRmaWVsZF9taW5DYW5kaWRhdGUgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgY2lyY2xlSGVpZ2h0ZmllbGRfd29ybGROb3JtYWwgPSBjcmVhdGVWZWMyKCksCiAgICAgICAgY2lyY2xlSGVpZ2h0ZmllbGRfbWluQ2FuZGlkYXRlTm9ybWFsID0gY3JlYXRlVmVjMigpOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNpcmNsZUhlaWdodGZpZWxkCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICAgICAgYmkKICAgICAqIEBwYXJhbSAge0NpcmNsZX0gICAgICAgICBzaQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgIHhpCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICAgICAgYmoKICAgICAqIEBwYXJhbSAge0hlaWdodGZpZWxkfSAgICBzagogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgIHhqCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgYWoKICAgICAqLwoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQ0lSQ0xFIHwgU2hhcGUkMy5IRUlHSFRGSUVMRF0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZS5jaXJjbGVIZWlnaHRmaWVsZCA9IGZ1bmN0aW9uIChjaXJjbGVCb2R5LCBjaXJjbGVTaGFwZSwgY2lyY2xlUG9zLCBjaXJjbGVBbmdsZSwgaGZCb2R5LCBoZlNoYXBlLCBoZlBvcywgaGZBbmdsZSwganVzdFRlc3QsIHJhZGl1cykgewogICAgICB2YXIgZGF0YSA9IGhmU2hhcGUuaGVpZ2h0cywKICAgICAgICAgIHJhZGl1cyA9IHJhZGl1cyB8fCBjaXJjbGVTaGFwZS5yYWRpdXMsCiAgICAgICAgICB3ID0gaGZTaGFwZS5lbGVtZW50V2lkdGgsCiAgICAgICAgICBkaXN0ID0gY2lyY2xlSGVpZ2h0ZmllbGRfZGlzdCwKICAgICAgICAgIGNhbmRpZGF0ZSA9IGNpcmNsZUhlaWdodGZpZWxkX2NhbmRpZGF0ZSwKICAgICAgICAgIG1pbkNhbmRpZGF0ZSA9IGNpcmNsZUhlaWdodGZpZWxkX21pbkNhbmRpZGF0ZSwKICAgICAgICAgIG1pbkNhbmRpZGF0ZU5vcm1hbCA9IGNpcmNsZUhlaWdodGZpZWxkX21pbkNhbmRpZGF0ZU5vcm1hbCwKICAgICAgICAgIHdvcmxkTm9ybWFsID0gY2lyY2xlSGVpZ2h0ZmllbGRfd29ybGROb3JtYWwsCiAgICAgICAgICB2MCA9IGNpcmNsZUhlaWdodGZpZWxkX3YwLAogICAgICAgICAgdjEgPSBjaXJjbGVIZWlnaHRmaWVsZF92MTsgLy8gR2V0IHRoZSBpbmRleCBvZiB0aGUgcG9pbnRzIHRvIHRlc3QgYWdhaW5zdAoKICAgICAgdmFyIGlkeEEgPSBNYXRoLmZsb29yKChjaXJjbGVQb3NbMF0gLSByYWRpdXMgLSBoZlBvc1swXSkgLyB3KSwKICAgICAgICAgIGlkeEIgPSBNYXRoLmNlaWwoKGNpcmNsZVBvc1swXSArIHJhZGl1cyAtIGhmUG9zWzBdKSAvIHcpOwogICAgICAvKmlmKGlkeEIgPCAwIHx8IGlkeEEgPj0gZGF0YS5sZW5ndGgpCiAgICAgICAgICByZXR1cm4ganVzdFRlc3QgPyBmYWxzZSA6IDA7Ki8KCiAgICAgIGlmIChpZHhBIDwgMCkgewogICAgICAgIGlkeEEgPSAwOwogICAgICB9CgogICAgICBpZiAoaWR4QiA+PSBkYXRhLmxlbmd0aCkgewogICAgICAgIGlkeEIgPSBkYXRhLmxlbmd0aCAtIDE7CiAgICAgIH0gLy8gR2V0IG1heCBhbmQgbWluCgoKICAgICAgdmFyIG1heCA9IGRhdGFbaWR4QV0sCiAgICAgICAgICBtaW4gPSBkYXRhW2lkeEJdOwoKICAgICAgZm9yICh2YXIgaSA9IGlkeEE7IGkgPCBpZHhCOyBpKyspIHsKICAgICAgICBpZiAoZGF0YVtpXSA8IG1pbikgewogICAgICAgICAgbWluID0gZGF0YVtpXTsKICAgICAgICB9CgogICAgICAgIGlmIChkYXRhW2ldID4gbWF4KSB7CiAgICAgICAgICBtYXggPSBkYXRhW2ldOwogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKGNpcmNsZVBvc1sxXSAtIHJhZGl1cyA+IG1heCkgewogICAgICAgIHJldHVybiAwOwogICAgICB9CiAgICAgIC8qCiAgICAgIGlmKGNpcmNsZVBvc1sxXStyYWRpdXMgPCBtaW4pewogICAgICAgICAgLy8gQmVsb3cgdGhlIG1pbmltdW0gcG9pbnQuLi4gV2UgY2FuIGp1c3QgZ3Vlc3MuCiAgICAgICAgICAvLyBUT0RPCiAgICAgIH0KICAgICAgKi8KICAgICAgLy8gMS4gQ2hlY2sgc28gY2VudGVyIG9mIGNpcmNsZSBpcyBub3QgaW5zaWRlIHRoZSBmaWVsZC4gSWYgaXQgaXMsIHRoaXMgd29udCB3b3JrLi4uCiAgICAgIC8vIDIuIEZvciBlYWNoIGVkZ2UKICAgICAgLy8gMi4gMS4gR2V0IHBvaW50IG9uIGNpcmNsZSB0aGF0IGlzIGNsb3Nlc3QgdG8gdGhlIGVkZ2UgKHNjYWxlIG5vcm1hbCB3aXRoIC1yYWRpdXMpCiAgICAgIC8vIDIuIDIuIENoZWNrIGlmIHBvaW50IGlzIGluc2lkZS4KCgogICAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gQ2hlY2sgYWxsIGVkZ2VzIGZpcnN0CgogICAgICBmb3IgKHZhciBpID0gaWR4QTsgaSA8IGlkeEI7IGkrKykgewogICAgICAgIC8vIEdldCBwb2ludHMKICAgICAgICB2ZWMyJDcuc2V0KHYwLCBpICogdywgZGF0YVtpXSk7CiAgICAgICAgdmVjMiQ3LnNldCh2MSwgKGkgKyAxKSAqIHcsIGRhdGFbaSArIDFdKTsKICAgICAgICBhZGQkMSh2MCwgdjAsIGhmUG9zKTsgLy8gQHRvZG8gdHJhbnNmb3JtIGNpcmNsZSB0byBsb2NhbCBoZWlnaHRmaWVsZCBzcGFjZSBpbnN0ZWFkCgogICAgICAgIGFkZCQxKHYxLCB2MSwgaGZQb3MpOyAvLyBHZXQgbm9ybWFsCgogICAgICAgIHN1YiQxKHdvcmxkTm9ybWFsLCB2MSwgdjApOwogICAgICAgIHJvdGF0ZSQxKHdvcmxkTm9ybWFsLCB3b3JsZE5vcm1hbCwgTWF0aC5QSSAvIDIpOwogICAgICAgIG5vcm1hbGl6ZSh3b3JsZE5vcm1hbCwgd29ybGROb3JtYWwpOyAvLyBHZXQgcG9pbnQgb24gY2lyY2xlLCBjbG9zZXN0IHRvIHRoZSBlZGdlCgogICAgICAgIHNjYWxlKGNhbmRpZGF0ZSwgd29ybGROb3JtYWwsIC1yYWRpdXMpOwogICAgICAgIGFkZCQxKGNhbmRpZGF0ZSwgY2FuZGlkYXRlLCBjaXJjbGVQb3MpOyAvLyBEaXN0YW5jZSBmcm9tIHYwIHRvIHRoZSBjYW5kaWRhdGUgcG9pbnQKCiAgICAgICAgc3ViJDEoZGlzdCwgY2FuZGlkYXRlLCB2MCk7IC8vIENoZWNrIGlmIGl0IGlzIGluIHRoZSBlbGVtZW50ICJzdGljayIKCiAgICAgICAgdmFyIGQgPSBkb3QkMShkaXN0LCB3b3JsZE5vcm1hbCk7CgogICAgICAgIGlmIChjYW5kaWRhdGVbMF0gPj0gdjBbMF0gJiYgY2FuZGlkYXRlWzBdIDwgdjFbMF0gJiYgZCA8PSAwKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgICB9CgogICAgICAgICAgZm91bmQgPSB0cnVlOyAvLyBTdG9yZSB0aGUgY2FuZGlkYXRlIHBvaW50LCBwcm9qZWN0ZWQgdG8gdGhlIGVkZ2UKCiAgICAgICAgICBzY2FsZShkaXN0LCB3b3JsZE5vcm1hbCwgLWQpOwogICAgICAgICAgYWRkJDEobWluQ2FuZGlkYXRlLCBjYW5kaWRhdGUsIGRpc3QpOwogICAgICAgICAgY29weSQyKG1pbkNhbmRpZGF0ZU5vcm1hbCwgd29ybGROb3JtYWwpOwogICAgICAgICAgdmFyIGMgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihoZkJvZHksIGNpcmNsZUJvZHksIGhmU2hhcGUsIGNpcmNsZVNoYXBlKTsgLy8gTm9ybWFsIGlzIG91dCBvZiB0aGUgaGVpZ2h0ZmllbGQKCiAgICAgICAgICBjb3B5JDIoYy5ub3JtYWxBLCBtaW5DYW5kaWRhdGVOb3JtYWwpOyAvLyBWZWN0b3IgZnJvbSBjaXJjbGUgdG8gaGVpZ2h0ZmllbGQKCiAgICAgICAgICBzY2FsZShjLmNvbnRhY3RQb2ludEIsIGMubm9ybWFsQSwgLXJhZGl1cyk7CiAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEIsIGMuY29udGFjdFBvaW50QiwgY2lyY2xlUG9zKTsKICAgICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBjaXJjbGVCb2R5LnBvc2l0aW9uKTsKICAgICAgICAgIGNvcHkkMihjLmNvbnRhY3RQb2ludEEsIG1pbkNhbmRpZGF0ZSk7CiAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgaGZCb2R5LnBvc2l0aW9uKTsKICAgICAgICAgIHRoaXMuY29udGFjdEVxdWF0aW9ucy5wdXNoKGMpOwoKICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uKSB7CiAgICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSAvLyBDaGVjayBhbGwgdmVydGljZXMKCgogICAgICBmb3VuZCA9IGZhbHNlOwoKICAgICAgaWYgKHJhZGl1cyA+IDApIHsKICAgICAgICBmb3IgKHZhciBpID0gaWR4QTsgaSA8PSBpZHhCOyBpKyspIHsKICAgICAgICAgIC8vIEdldCBwb2ludAogICAgICAgICAgdmVjMiQ3LnNldCh2MCwgaSAqIHcsIGRhdGFbaV0pOwogICAgICAgICAgYWRkJDEodjAsIHYwLCBoZlBvcyk7CiAgICAgICAgICBzdWIkMShkaXN0LCBjaXJjbGVQb3MsIHYwKTsKCiAgICAgICAgICBpZiAoc3F1YXJlZExlbmd0aChkaXN0KSA8IE1hdGgucG93KHJhZGl1cywgMikpIHsKICAgICAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICAgICAgcmV0dXJuIDE7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTsKICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihoZkJvZHksIGNpcmNsZUJvZHksIGhmU2hhcGUsIGNpcmNsZVNoYXBlKTsgLy8gQ29uc3RydWN0IG5vcm1hbCAtIG91dCBvZiBoZWlnaHRmaWVsZAoKICAgICAgICAgICAgY29weSQyKGMubm9ybWFsQSwgZGlzdCk7CiAgICAgICAgICAgIG5vcm1hbGl6ZShjLm5vcm1hbEEsIGMubm9ybWFsQSk7CiAgICAgICAgICAgIHNjYWxlKGMuY29udGFjdFBvaW50QiwgYy5ub3JtYWxBLCAtcmFkaXVzKTsKICAgICAgICAgICAgYWRkJDEoYy5jb250YWN0UG9pbnRCLCBjLmNvbnRhY3RQb2ludEIsIGNpcmNsZVBvcyk7CiAgICAgICAgICAgIHN1YiQxKGMuY29udGFjdFBvaW50QiwgYy5jb250YWN0UG9pbnRCLCBjaXJjbGVCb2R5LnBvc2l0aW9uKTsKICAgICAgICAgICAgc3ViJDEoYy5jb250YWN0UG9pbnRBLCB2MCwgaGZQb3MpOwogICAgICAgICAgICBhZGQkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgaGZQb3MpOwogICAgICAgICAgICBzdWIkMShjLmNvbnRhY3RQb2ludEEsIGMuY29udGFjdFBvaW50QSwgaGZCb2R5LnBvc2l0aW9uKTsKICAgICAgICAgICAgdGhpcy5jb250YWN0RXF1YXRpb25zLnB1c2goYyk7CgogICAgICAgICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvbikgewogICAgICAgICAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMucHVzaCh0aGlzLmNyZWF0ZUZyaWN0aW9uRnJvbUNvbnRhY3QoYykpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICBpZiAoZm91bmQpIHsKICAgICAgICByZXR1cm4gMTsKICAgICAgfQoKICAgICAgcmV0dXJuIDA7CiAgICB9OwoKICAgIHZhciBjb252ZXhIZWlnaHRmaWVsZF92MCA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICBjb252ZXhIZWlnaHRmaWVsZF92MSA9IGNyZWF0ZVZlYzIoKSwKICAgICAgICBjb252ZXhIZWlnaHRmaWVsZF90aWxlUG9zID0gY3JlYXRlVmVjMigpLAogICAgICAgIGNvbnZleEhlaWdodGZpZWxkX3RlbXBDb252ZXhTaGFwZSA9IG5ldyBDb252ZXgoewogICAgICB2ZXJ0aWNlczogW2NyZWF0ZVZlYzIoKSwgY3JlYXRlVmVjMigpLCBjcmVhdGVWZWMyKCksIGNyZWF0ZVZlYzIoKV0KICAgIH0pOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNpcmNsZUhlaWdodGZpZWxkCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICAgICAgYmkKICAgICAqIEBwYXJhbSAge0NpcmNsZX0gICAgICAgICBzaQogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgIHhpCiAgICAgKiBAcGFyYW0gIHtCb2R5fSAgICAgICAgICAgYmoKICAgICAqIEBwYXJhbSAge0hlaWdodGZpZWxkfSAgICBzagogICAgICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgIHhqCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgYWoKICAgICAqLwoKICAgIE5hcnJvd3BoYXNlJDEucHJvdG90eXBlW1NoYXBlJDMuQk9YIHwgU2hhcGUkMy5IRUlHSFRGSUVMRF0gPSBOYXJyb3dwaGFzZSQxLnByb3RvdHlwZVtTaGFwZSQzLkNPTlZFWCB8IFNoYXBlJDMuSEVJR0hURklFTERdID0gTmFycm93cGhhc2UkMS5wcm90b3R5cGUuY29udmV4SGVpZ2h0ZmllbGQgPSBmdW5jdGlvbiAoY29udmV4Qm9keSwgY29udmV4U2hhcGUsIGNvbnZleFBvcywgY29udmV4QW5nbGUsIGhmQm9keSwgaGZTaGFwZSwgaGZQb3MsIGhmQW5nbGUsIGp1c3RUZXN0KSB7CiAgICAgIHZhciBkYXRhID0gaGZTaGFwZS5oZWlnaHRzLAogICAgICAgICAgdyA9IGhmU2hhcGUuZWxlbWVudFdpZHRoLAogICAgICAgICAgdjAgPSBjb252ZXhIZWlnaHRmaWVsZF92MCwKICAgICAgICAgIHYxID0gY29udmV4SGVpZ2h0ZmllbGRfdjEsCiAgICAgICAgICB0aWxlUG9zID0gY29udmV4SGVpZ2h0ZmllbGRfdGlsZVBvcywKICAgICAgICAgIHRpbGVDb252ZXggPSBjb252ZXhIZWlnaHRmaWVsZF90ZW1wQ29udmV4U2hhcGU7IC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIHBvaW50cyB0byB0ZXN0IGFnYWluc3QKCiAgICAgIHZhciBpZHhBID0gTWF0aC5mbG9vcigoY29udmV4Qm9keS5hYWJiLmxvd2VyQm91bmRbMF0gLSBoZlBvc1swXSkgLyB3KSwKICAgICAgICAgIGlkeEIgPSBNYXRoLmNlaWwoKGNvbnZleEJvZHkuYWFiYi51cHBlckJvdW5kWzBdIC0gaGZQb3NbMF0pIC8gdyk7CgogICAgICBpZiAoaWR4QSA8IDApIHsKICAgICAgICBpZHhBID0gMDsKICAgICAgfQoKICAgICAgaWYgKGlkeEIgPj0gZGF0YS5sZW5ndGgpIHsKICAgICAgICBpZHhCID0gZGF0YS5sZW5ndGggLSAxOwogICAgICB9IC8vIEdldCBtYXggYW5kIG1pbgoKCiAgICAgIHZhciBtYXggPSBkYXRhW2lkeEFdLAogICAgICAgICAgbWluID0gZGF0YVtpZHhCXTsKCiAgICAgIGZvciAodmFyIGkgPSBpZHhBOyBpIDwgaWR4QjsgaSsrKSB7CiAgICAgICAgaWYgKGRhdGFbaV0gPCBtaW4pIHsKICAgICAgICAgIG1pbiA9IGRhdGFbaV07CiAgICAgICAgfQoKICAgICAgICBpZiAoZGF0YVtpXSA+IG1heCkgewogICAgICAgICAgbWF4ID0gZGF0YVtpXTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmIChjb252ZXhCb2R5LmFhYmIubG93ZXJCb3VuZFsxXSA+IG1heCkgewogICAgICAgIHJldHVybiAwOwogICAgICB9CgogICAgICB2YXIgbnVtQ29udGFjdHMgPSAwOyAvLyBMb29wIG92ZXIgYWxsIGVkZ2VzCiAgICAgIC8vIEB0b2RvIElmIHBvc3NpYmxlLCBjb25zdHJ1Y3QgYSBjb252ZXggZnJvbSBzZXZlcmFsIGRhdGEgcG9pbnRzIChuZWVkIG8gY2hlY2sgaWYgdGhlIHBvaW50cyBtYWtlIGEgY29udmV4IHNoYXBlKQogICAgICAvLyBAdG9kbyB0cmFuc2Zvcm0gY29udmV4IHRvIGxvY2FsIGhlaWdodGZpZWxkIHNwYWNlLgogICAgICAvLyBAdG9kbyBiYWlsIG91dCBpZiB0aGUgaGVpZ2h0ZmllbGQgdGlsZSBpcyBub3QgdGFsbCBlbm91Z2guCgogICAgICBmb3IgKHZhciBpID0gaWR4QTsgaSA8IGlkeEI7IGkrKykgewogICAgICAgIC8vIEdldCBwb2ludHMKICAgICAgICB2ZWMyJDcuc2V0KHYwLCBpICogdywgZGF0YVtpXSk7CiAgICAgICAgdmVjMiQ3LnNldCh2MSwgKGkgKyAxKSAqIHcsIGRhdGFbaSArIDFdKTsKICAgICAgICBhZGQkMSh2MCwgdjAsIGhmUG9zKTsKICAgICAgICBhZGQkMSh2MSwgdjEsIGhmUG9zKTsgLy8gQ29uc3RydWN0IGEgY29udmV4CgogICAgICAgIHZhciB0aWxlSGVpZ2h0ID0gMTAwOyAvLyB0b2RvCgogICAgICAgIHZlYzIkNy5zZXQodGlsZVBvcywgKHYxWzBdICsgdjBbMF0pICogMC41LCAodjFbMV0gKyB2MFsxXSAtIHRpbGVIZWlnaHQpICogMC41KTsKICAgICAgICBzdWIkMSh0aWxlQ29udmV4LnZlcnRpY2VzWzBdLCB2MSwgdGlsZVBvcyk7CiAgICAgICAgc3ViJDEodGlsZUNvbnZleC52ZXJ0aWNlc1sxXSwgdjAsIHRpbGVQb3MpOwogICAgICAgIGNvcHkkMih0aWxlQ29udmV4LnZlcnRpY2VzWzJdLCB0aWxlQ29udmV4LnZlcnRpY2VzWzFdKTsKICAgICAgICBjb3B5JDIodGlsZUNvbnZleC52ZXJ0aWNlc1szXSwgdGlsZUNvbnZleC52ZXJ0aWNlc1swXSk7CiAgICAgICAgdGlsZUNvbnZleC52ZXJ0aWNlc1syXVsxXSAtPSB0aWxlSGVpZ2h0OwogICAgICAgIHRpbGVDb252ZXgudmVydGljZXNbM11bMV0gLT0gdGlsZUhlaWdodDsKICAgICAgICB0aWxlQ29udmV4LnVwZGF0ZU5vcm1hbHMoKTsgLy8gRG8gY29udmV4IGNvbGxpc2lvbgoKICAgICAgICBudW1Db250YWN0cyArPSB0aGlzLmNvbnZleENvbnZleChjb252ZXhCb2R5LCBjb252ZXhTaGFwZSwgY29udmV4UG9zLCBjb252ZXhBbmdsZSwgaGZCb2R5LCB0aWxlQ29udmV4LCB0aWxlUG9zLCAwLCBqdXN0VGVzdCk7CiAgICAgIH0KCiAgICAgIHJldHVybiBudW1Db250YWN0czsKICAgIH07CgogICAgdmFyIEJyb2FkcGhhc2UkMSA9IEJyb2FkcGhhc2VfMTsKCiAgICB2YXIgTmFpdmVCcm9hZHBoYXNlXzEgPSBOYWl2ZUJyb2FkcGhhc2U7CiAgICAvKioKICAgICAqIE5haXZlIGJyb2FkcGhhc2UgaW1wbGVtZW50YXRpb24uIERvZXMgTl4yIHRlc3RzLgogICAgICoKICAgICAqIEBjbGFzcyBOYWl2ZUJyb2FkcGhhc2UKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4dGVuZHMgQnJvYWRwaGFzZQogICAgICovCgogICAgZnVuY3Rpb24gTmFpdmVCcm9hZHBoYXNlKCkgewogICAgICBCcm9hZHBoYXNlJDEuY2FsbCh0aGlzLCBCcm9hZHBoYXNlJDEuTkFJVkUpOwogICAgfQoKICAgIE5haXZlQnJvYWRwaGFzZS5wcm90b3R5cGUgPSBuZXcgQnJvYWRwaGFzZSQxKCk7CiAgICBOYWl2ZUJyb2FkcGhhc2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTmFpdmVCcm9hZHBoYXNlOwogICAgLyoqCiAgICAgKiBHZXQgdGhlIGNvbGxpZGluZyBwYWlycwogICAgICogQG1ldGhvZCBnZXRDb2xsaXNpb25QYWlycwogICAgICogQHBhcmFtICB7V29ybGR9IHdvcmxkCiAgICAgKiBAcmV0dXJuIHtBcnJheX0KICAgICAqLwoKICAgIE5haXZlQnJvYWRwaGFzZS5wcm90b3R5cGUuZ2V0Q29sbGlzaW9uUGFpcnMgPSBmdW5jdGlvbiAod29ybGQpIHsKICAgICAgdmFyIGJvZGllcyA9IHdvcmxkLmJvZGllcywKICAgICAgICAgIHJlc3VsdCA9IHRoaXMucmVzdWx0OwogICAgICByZXN1bHQubGVuZ3RoID0gMDsKCiAgICAgIGZvciAodmFyIGkgPSAwLCBOY29sbGlkaW5nID0gYm9kaWVzLmxlbmd0aDsgaSAhPT0gTmNvbGxpZGluZzsgaSsrKSB7CiAgICAgICAgdmFyIGJpID0gYm9kaWVzW2ldOwoKICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykgewogICAgICAgICAgdmFyIGJqID0gYm9kaWVzW2pdOwoKICAgICAgICAgIGlmIChCcm9hZHBoYXNlJDEuY2FuQ29sbGlkZShiaSwgYmopICYmIHRoaXMuYm91bmRpbmdWb2x1bWVDaGVjayhiaSwgYmopKSB7CiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGJpLCBiaik7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gcmVzdWx0OwogICAgfTsKICAgIC8qKgogICAgICogUmV0dXJucyBhbGwgdGhlIGJvZGllcyB3aXRoaW4gYW4gQUFCQi4KICAgICAqIEBtZXRob2QgYWFiYlF1ZXJ5CiAgICAgKiBAcGFyYW0gIHtXb3JsZH0gd29ybGQKICAgICAqIEBwYXJhbSAge0FBQkJ9IGFhYmIKICAgICAqIEBwYXJhbSB7YXJyYXl9IHJlc3VsdCBBbiBhcnJheSB0byBzdG9yZSByZXN1bHRpbmcgYm9kaWVzIGluLgogICAgICogQHJldHVybiB7YXJyYXl9CiAgICAgKi8KCgogICAgTmFpdmVCcm9hZHBoYXNlLnByb3RvdHlwZS5hYWJiUXVlcnkgPSBmdW5jdGlvbiAod29ybGQsIGFhYmIsIHJlc3VsdCkgewogICAgICByZXN1bHQgPSByZXN1bHQgfHwgW107CiAgICAgIHZhciBib2RpZXMgPSB3b3JsZC5ib2RpZXM7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvZGllcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciBiID0gYm9kaWVzW2ldOwoKICAgICAgICBpZiAoYi5hYWJiTmVlZHNVcGRhdGUpIHsKICAgICAgICAgIGIudXBkYXRlQUFCQigpOwogICAgICAgIH0KCiAgICAgICAgaWYgKGIuYWFiYi5vdmVybGFwcyhhYWJiKSkgewogICAgICAgICAgcmVzdWx0LnB1c2goYik7CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gcmVzdWx0OwogICAgfTsKCiAgICB2YXIgU2hhcGUkMiA9IFNoYXBlXzEsCiAgICAgICAgc2hhbGxvd0Nsb25lID0gVXRpbHNfMS5zaGFsbG93Q2xvbmUsCiAgICAgICAgY29weSQxID0gdmVjMiRxLmV4cG9ydHMuY29weTsKCiAgICB2YXIgUGFydGljbGVfMSA9IFBhcnRpY2xlOwogICAgLyoqCiAgICAgKiBQYXJ0aWNsZSBzaGFwZSBjbGFzcy4KICAgICAqIEBjbGFzcyBQYXJ0aWNsZQogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIChOb3RlIHRoYXQgdGhpcyBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUge3sjY3Jvc3NMaW5rICJTaGFwZSJ9fXt7L2Nyb3NzTGlua319IGNvbnN0cnVjdG9yLikKICAgICAqIEBleHRlbmRzIFNoYXBlCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoKTsKICAgICAqICAgICB2YXIgc2hhcGUgPSBuZXcgUGFydGljbGUoKTsKICAgICAqICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIFBhcnRpY2xlKG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBzaGFsbG93Q2xvbmUob3B0aW9ucykgOiB7fTsKICAgICAgb3B0aW9ucy50eXBlID0gU2hhcGUkMi5QQVJUSUNMRTsKICAgICAgU2hhcGUkMi5jYWxsKHRoaXMsIG9wdGlvbnMpOwogICAgfQoKICAgIFBhcnRpY2xlLnByb3RvdHlwZSA9IG5ldyBTaGFwZSQyKCk7CiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQYXJ0aWNsZTsKCiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY29tcHV0ZU1vbWVudE9mSW5lcnRpYSA9IGZ1bmN0aW9uICgpIHsKICAgICAgcmV0dXJuIDA7IC8vIENhbid0IHJvdGF0ZSBhIHBhcnRpY2xlCiAgICB9OwoKICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ1JhZGl1cyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IDA7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNvbXB1dGVBQUJCCiAgICAgKiBAcGFyYW0gIHtBQUJCfSAgIG91dAogICAgICogQHBhcmFtICB7QXJyYXl9ICBwb3NpdGlvbgogICAgICogQHBhcmFtICB7TnVtYmVyfSBhbmdsZQogICAgICovCgoKICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jb21wdXRlQUFCQiA9IGZ1bmN0aW9uIChvdXQsIHBvc2l0aW9uCiAgICAvKiwgYW5nbGUqLwogICAgKSB7CiAgICAgIGNvcHkkMShvdXQubG93ZXJCb3VuZCwgcG9zaXRpb24pOwogICAgICBjb3B5JDEob3V0LnVwcGVyQm91bmQsIHBvc2l0aW9uKTsKICAgIH07CgogICAgdmFyIFNoYXBlJDEgPSBTaGFwZV8xLAogICAgICAgIHZlYzIkNiA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIFV0aWxzJDIgPSBVdGlsc18xOwoKICAgIHZhciBQbGFuZV8xID0gUGxhbmU7CiAgICAvKioKICAgICAqIFBsYW5lIHNoYXBlIGNsYXNzLiBUaGUgcGxhbmUgaXMgZmFjaW5nIGluIHRoZSBZIGRpcmVjdGlvbi4KICAgICAqIEBjbGFzcyBQbGFuZQogICAgICogQGV4dGVuZHMgU2hhcGUKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAoTm90ZSB0aGF0IHRoaXMgb3B0aW9ucyBvYmplY3Qgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIHt7I2Nyb3NzTGluayAiU2hhcGUifX17ey9jcm9zc0xpbmt9fSBjb25zdHJ1Y3Rvci4pCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBib2R5ID0gbmV3IEJvZHkoKTsKICAgICAqICAgICB2YXIgc2hhcGUgPSBuZXcgUGxhbmUoKTsKICAgICAqICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIFBsYW5lKG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBVdGlscyQyLnNoYWxsb3dDbG9uZShvcHRpb25zKSA6IHt9OwogICAgICBvcHRpb25zLnR5cGUgPSBTaGFwZSQxLlBMQU5FOwogICAgICBTaGFwZSQxLmNhbGwodGhpcywgb3B0aW9ucyk7CiAgICB9CgogICAgUGxhbmUucHJvdG90eXBlID0gbmV3IFNoYXBlJDEoKTsKICAgIFBsYW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBsYW5lOwogICAgLyoqCiAgICAgKiBDb21wdXRlIG1vbWVudCBvZiBpbmVydGlhCiAgICAgKiBAbWV0aG9kIGNvbXB1dGVNb21lbnRPZkluZXJ0aWEKICAgICAqLwoKICAgIFBsYW5lLnByb3RvdHlwZS5jb21wdXRlTW9tZW50T2ZJbmVydGlhID0gZnVuY3Rpb24gKCkgewogICAgICByZXR1cm4gMDsgLy8gUGxhbmUgaXMgaW5maW5pdGUuIFRoZSBpbmVydGlhIHNob3VsZCB0aGVyZWZvcmUgYmUgaW5maW50eSBidXQgYnkgY29udmVudGlvbiB3ZSBzZXQgMCBoZXJlCiAgICB9OwogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIGJvdW5kaW5nIHJhZGl1cwogICAgICogQG1ldGhvZCB1cGRhdGVCb3VuZGluZ1JhZGl1cwogICAgICovCgoKICAgIFBsYW5lLnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ1JhZGl1cyA9IGZ1bmN0aW9uICgpIHsKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IE51bWJlci5NQVhfVkFMVUU7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNvbXB1dGVBQUJCCiAgICAgKiBAcGFyYW0gIHtBQUJCfSAgIG91dAogICAgICogQHBhcmFtICB7QXJyYXl9ICBwb3NpdGlvbgogICAgICogQHBhcmFtICB7TnVtYmVyfSBhbmdsZQogICAgICovCgoKICAgIFBsYW5lLnByb3RvdHlwZS5jb21wdXRlQUFCQiA9IGZ1bmN0aW9uIChvdXQsIHBvc2l0aW9uLCBhbmdsZSkgewogICAgICB2YXIgYSA9IGFuZ2xlICUgKDIgKiBNYXRoLlBJKTsKICAgICAgdmFyIHNldCA9IHZlYzIkNi5zZXQ7CiAgICAgIHZhciBtYXggPSAxZTc7CiAgICAgIHZhciBsb3dlckJvdW5kID0gb3V0Lmxvd2VyQm91bmQ7CiAgICAgIHZhciB1cHBlckJvdW5kID0gb3V0LnVwcGVyQm91bmQ7IC8vIFNldCBtYXggYm91bmRzCgogICAgICBzZXQobG93ZXJCb3VuZCwgLW1heCwgLW1heCk7CiAgICAgIHNldCh1cHBlckJvdW5kLCBtYXgsIG1heCk7CgogICAgICBpZiAoYSA9PT0gMCkgewogICAgICAgIC8vIHkgZ29lcyBmcm9tIC1pbmYgdG8gMAogICAgICAgIHVwcGVyQm91bmRbMV0gPSBwb3NpdGlvblsxXTsKICAgICAgfSBlbHNlIGlmIChhID09PSBNYXRoLlBJIC8gMikgewogICAgICAgIC8vIHggZ29lcyBmcm9tIDAgdG8gaW5mCiAgICAgICAgbG93ZXJCb3VuZFswXSA9IHBvc2l0aW9uWzBdOwogICAgICB9IGVsc2UgaWYgKGEgPT09IE1hdGguUEkpIHsKICAgICAgICAvLyB5IGdvZXMgZnJvbSAwIHRvIGluZgogICAgICAgIGxvd2VyQm91bmRbMV0gPSBwb3NpdGlvblsxXTsKICAgICAgfSBlbHNlIGlmIChhID09PSAzICogTWF0aC5QSSAvIDIpIHsKICAgICAgICAvLyB4IGdvZXMgZnJvbSAtaW5mIHRvIDAKICAgICAgICB1cHBlckJvdW5kWzBdID0gcG9zaXRpb25bMF07CiAgICAgIH0KICAgIH07CgogICAgUGxhbmUucHJvdG90eXBlLnVwZGF0ZUFyZWEgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHRoaXMuYXJlYSA9IE51bWJlci5NQVhfVkFMVUU7CiAgICB9OwoKICAgIHZhciBpbnRlcnNlY3RQbGFuZV9wbGFuZVBvaW50VG9Gcm9tID0gdmVjMiQ2LmNyZWF0ZSgpOwogICAgdmFyIGludGVyc2VjdFBsYW5lX25vcm1hbCA9IHZlYzIkNi5jcmVhdGUoKTsKICAgIHZhciBpbnRlcnNlY3RQbGFuZV9sZW4gPSB2ZWMyJDYuY3JlYXRlKCk7CiAgICAvKioKICAgICAqIEBtZXRob2QgcmF5Y2FzdAogICAgICogQHBhcmFtICB7UmF5UmVzdWx0fSByZXN1bHQKICAgICAqIEBwYXJhbSAge1JheX0gcmF5CiAgICAgKiBAcGFyYW0gIHthcnJheX0gcG9zaXRpb24KICAgICAqIEBwYXJhbSAge251bWJlcn0gYW5nbGUKICAgICAqLwoKICAgIFBsYW5lLnByb3RvdHlwZS5yYXljYXN0ID0gZnVuY3Rpb24gKHJlc3VsdCwgcmF5LCBwb3NpdGlvbiwgYW5nbGUpIHsKICAgICAgdmFyIGZyb20gPSByYXkuZnJvbTsKICAgICAgdmFyIHRvID0gcmF5LnRvOwogICAgICB2YXIgZGlyZWN0aW9uID0gcmF5LmRpcmVjdGlvbjsKICAgICAgdmFyIHBsYW5lUG9pbnRUb0Zyb20gPSBpbnRlcnNlY3RQbGFuZV9wbGFuZVBvaW50VG9Gcm9tOwogICAgICB2YXIgbm9ybWFsID0gaW50ZXJzZWN0UGxhbmVfbm9ybWFsOwogICAgICB2YXIgbGVuID0gaW50ZXJzZWN0UGxhbmVfbGVuOyAvLyBHZXQgcGxhbmUgbm9ybWFsCgogICAgICB2ZWMyJDYuc2V0KG5vcm1hbCwgMCwgMSk7CiAgICAgIHZlYzIkNi5yb3RhdGUobm9ybWFsLCBub3JtYWwsIGFuZ2xlKTsKICAgICAgdmVjMiQ2LnN1YnRyYWN0KGxlbiwgZnJvbSwgcG9zaXRpb24pOwogICAgICB2YXIgcGxhbmVUb0Zyb20gPSB2ZWMyJDYuZG90KGxlbiwgbm9ybWFsKTsKICAgICAgdmVjMiQ2LnN1YnRyYWN0KGxlbiwgdG8sIHBvc2l0aW9uKTsKICAgICAgdmFyIHBsYW5lVG9UbyA9IHZlYzIkNi5kb3QobGVuLCBub3JtYWwpOwoKICAgICAgaWYgKHBsYW5lVG9Gcm9tICogcGxhbmVUb1RvID4gMCkgewogICAgICAgIC8vICJmcm9tIiBhbmQgInRvIiBhcmUgb24gdGhlIHNhbWUgc2lkZSBvZiB0aGUgcGxhbmUuLi4gYmFpbCBvdXQKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGlmICh2ZWMyJDYuc3F1YXJlZERpc3RhbmNlKGZyb20sIHRvKSA8IHBsYW5lVG9Gcm9tICogcGxhbmVUb0Zyb20pIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHZhciBuX2RvdF9kaXIgPSB2ZWMyJDYuZG90KG5vcm1hbCwgZGlyZWN0aW9uKTsKICAgICAgdmVjMiQ2LnN1YnRyYWN0KHBsYW5lUG9pbnRUb0Zyb20sIGZyb20sIHBvc2l0aW9uKTsKICAgICAgdmFyIHQgPSAtdmVjMiQ2LmRvdChub3JtYWwsIHBsYW5lUG9pbnRUb0Zyb20pIC8gbl9kb3RfZGlyIC8gcmF5Lmxlbmd0aDsKICAgICAgcmF5LnJlcG9ydEludGVyc2VjdGlvbihyZXN1bHQsIHQsIG5vcm1hbCwgLTEpOwogICAgfTsKCiAgICBQbGFuZS5wcm90b3R5cGUucG9pbnRUZXN0ID0gZnVuY3Rpb24gKGxvY2FsUG9pbnQpIHsKICAgICAgcmV0dXJuIGxvY2FsUG9pbnRbMV0gPD0gMDsKICAgIH07CgogICAgdmFyIEVxdWF0aW9uJDMgPSBFcXVhdGlvbl8xOwoKICAgIHZhciBSb3RhdGlvbmFsVmVsb2NpdHlFcXVhdGlvbl8xID0gUm90YXRpb25hbFZlbG9jaXR5RXF1YXRpb24kMTsKICAgIC8qKgogICAgICogU3luY3Mgcm90YXRpb25hbCB2ZWxvY2l0eSBvZiB0d28gYm9kaWVzLCBvciBzZXRzIGEgcmVsYXRpdmUgdmVsb2NpdHkgKG1vdG9yKS4KICAgICAqCiAgICAgKiBAY2xhc3MgUm90YXRpb25hbFZlbG9jaXR5RXF1YXRpb24KICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4dGVuZHMgRXF1YXRpb24KICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUEKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUIKICAgICAqLwoKICAgIGZ1bmN0aW9uIFJvdGF0aW9uYWxWZWxvY2l0eUVxdWF0aW9uJDEoYm9keUEsIGJvZHlCKSB7CiAgICAgIEVxdWF0aW9uJDMuY2FsbCh0aGlzLCBib2R5QSwgYm9keUIsIC1OdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFKTsKICAgICAgdGhpcy5yZWxhdGl2ZVZlbG9jaXR5ID0gMTsKICAgICAgdGhpcy5yYXRpbyA9IDE7CiAgICB9CgogICAgUm90YXRpb25hbFZlbG9jaXR5RXF1YXRpb24kMS5wcm90b3R5cGUgPSBuZXcgRXF1YXRpb24kMygpOwogICAgUm90YXRpb25hbFZlbG9jaXR5RXF1YXRpb24kMS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSb3RhdGlvbmFsVmVsb2NpdHlFcXVhdGlvbiQxOwoKICAgIFJvdGF0aW9uYWxWZWxvY2l0eUVxdWF0aW9uJDEucHJvdG90eXBlLmNvbXB1dGVCID0gZnVuY3Rpb24gKGEsIGIsIGgpIHsKICAgICAgdmFyIEcgPSB0aGlzLkc7CiAgICAgIEdbMl0gPSAtMTsKICAgICAgR1s1XSA9IHRoaXMucmF0aW87CiAgICAgIHZhciBHaU1mID0gdGhpcy5jb21wdXRlR2lNZigpOwogICAgICB2YXIgR1cgPSB0aGlzLmNvbXB1dGVHVygpOwogICAgICB2YXIgQiA9IC1HVyAqIGIgLSBoICogR2lNZjsKICAgICAgcmV0dXJuIEI7CiAgICB9OwoKICAgIHZhciBFcXVhdGlvbiQyID0gRXF1YXRpb25fMSwKICAgICAgICB2ZWMyJDUgPSB2ZWMyJHEuZXhwb3J0czsKCiAgICB2YXIgUm90YXRpb25hbExvY2tFcXVhdGlvbl8xID0gUm90YXRpb25hbExvY2tFcXVhdGlvbiQyOwogICAgLyoqCiAgICAgKiBMb2NrcyB0aGUgcmVsYXRpdmUgYW5nbGUgYmV0d2VlbiB0d28gYm9kaWVzLiBUaGUgY29uc3RyYWludCB0cmllcyB0byBrZWVwIHRoZSBkb3QgcHJvZHVjdCBiZXR3ZWVuIHR3byB2ZWN0b3JzLCBsb2NhbCBpbiBlYWNoIGJvZHksIHRvIHplcm8uIFRoZSBsb2NhbCBhbmdsZSBpbiBib2R5IGkgaXMgYSBwYXJhbWV0ZXIuCiAgICAgKgogICAgICogQGNsYXNzIFJvdGF0aW9uYWxMb2NrRXF1YXRpb24KICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGV4dGVuZHMgRXF1YXRpb24KICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUEKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUIKICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5hbmdsZV0gQW5nbGUgdG8gYWRkIHRvIHRoZSBsb2NhbCB2ZWN0b3IgaW4gYm9keUEuCiAgICAgKi8KCiAgICBmdW5jdGlvbiBSb3RhdGlvbmFsTG9ja0VxdWF0aW9uJDIoYm9keUEsIGJvZHlCLCBvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICBFcXVhdGlvbiQyLmNhbGwodGhpcywgYm9keUEsIGJvZHlCLCAtTnVtYmVyLk1BWF9WQUxVRSwgTnVtYmVyLk1BWF9WQUxVRSk7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYW5nbGUKICAgICAgICovCgogICAgICB0aGlzLmFuZ2xlID0gb3B0aW9ucy5hbmdsZSB8fCAwOwogICAgICB2YXIgRyA9IHRoaXMuRzsKICAgICAgR1syXSA9IDE7CiAgICAgIEdbNV0gPSAtMTsKICAgIH0KCiAgICBSb3RhdGlvbmFsTG9ja0VxdWF0aW9uJDIucHJvdG90eXBlID0gbmV3IEVxdWF0aW9uJDIoKTsKICAgIFJvdGF0aW9uYWxMb2NrRXF1YXRpb24kMi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSb3RhdGlvbmFsTG9ja0VxdWF0aW9uJDI7CiAgICB2YXIgd29ybGRWZWN0b3JBID0gdmVjMiQ1LmNyZWF0ZSgpLAogICAgICAgIHdvcmxkVmVjdG9yQiA9IHZlYzIkNS5jcmVhdGUoKSwKICAgICAgICB4QXhpcyQxID0gdmVjMiQ1LmZyb21WYWx1ZXMoMSwgMCksCiAgICAgICAgeUF4aXMkMSA9IHZlYzIkNS5mcm9tVmFsdWVzKDAsIDEpOwoKICAgIFJvdGF0aW9uYWxMb2NrRXF1YXRpb24kMi5wcm90b3R5cGUuY29tcHV0ZUdxID0gZnVuY3Rpb24gKCkgewogICAgICB2ZWMyJDUucm90YXRlKHdvcmxkVmVjdG9yQSwgeEF4aXMkMSwgdGhpcy5ib2R5QS5hbmdsZSArIHRoaXMuYW5nbGUpOwogICAgICB2ZWMyJDUucm90YXRlKHdvcmxkVmVjdG9yQiwgeUF4aXMkMSwgdGhpcy5ib2R5Qi5hbmdsZSk7CiAgICAgIHJldHVybiB2ZWMyJDUuZG90KHdvcmxkVmVjdG9yQSwgd29ybGRWZWN0b3JCKTsKICAgIH07CgogICAgdmFyIENvbnN0cmFpbnQkMiA9IENvbnN0cmFpbnRfMSwKICAgICAgICBFcXVhdGlvbiQxID0gRXF1YXRpb25fMSwKICAgICAgICBSb3RhdGlvbmFsVmVsb2NpdHlFcXVhdGlvbiA9IFJvdGF0aW9uYWxWZWxvY2l0eUVxdWF0aW9uXzEsCiAgICAgICAgUm90YXRpb25hbExvY2tFcXVhdGlvbiQxID0gUm90YXRpb25hbExvY2tFcXVhdGlvbl8xLAogICAgICAgIHZlYzIkNCA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIHN1YiA9IHZlYzIkNC5zdWJ0cmFjdCwKICAgICAgICBhZGQgPSB2ZWMyJDQuYWRkLAogICAgICAgIHJvdGF0ZSA9IHZlYzIkNC5yb3RhdGUsCiAgICAgICAgZG90ID0gdmVjMiQ0LmRvdCwKICAgICAgICBjb3B5ID0gdmVjMiQ0LmNvcHksCiAgICAgICAgY3Jvc3NMZW5ndGggPSB2ZWMyJDQuY3Jvc3NMZW5ndGg7CgogICAgdmFyIFJldm9sdXRlQ29uc3RyYWludF8xID0gUmV2b2x1dGVDb25zdHJhaW50OwogICAgdmFyIHdvcmxkUGl2b3RBID0gdmVjMiQ0LmNyZWF0ZSgpLAogICAgICAgIHdvcmxkUGl2b3RCID0gdmVjMiQ0LmNyZWF0ZSgpLAogICAgICAgIHhBeGlzID0gdmVjMiQ0LmZyb21WYWx1ZXMoMSwgMCksCiAgICAgICAgeUF4aXMgPSB2ZWMyJDQuZnJvbVZhbHVlcygwLCAxKSwKICAgICAgICBnID0gdmVjMiQ0LmNyZWF0ZSgpOwogICAgLyoqCiAgICAgKiBDb25uZWN0cyB0d28gYm9kaWVzIGF0IGdpdmVuIG9mZnNldCBwb2ludHMsIGxldHRpbmcgdGhlbSByb3RhdGUgcmVsYXRpdmUgdG8gZWFjaCBvdGhlciBhcm91bmQgdGhpcyBwb2ludC4KICAgICAqIEBjbGFzcyBSZXZvbHV0ZUNvbnN0cmFpbnQKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQGF1dGhvciBzY2h0ZXBwZQogICAgICogQHBhcmFtIHtCb2R5fSAgICBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSAgICBib2R5QgogICAgICogQHBhcmFtIHtPYmplY3R9ICBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7QXJyYXl9ICAgW29wdGlvbnMud29ybGRQaXZvdF0gQSBwaXZvdCBwb2ludCBnaXZlbiBpbiB3b3JsZCBjb29yZGluYXRlcy4gSWYgc3BlY2lmaWVkLCBsb2NhbFBpdm90QSBhbmQgbG9jYWxQaXZvdEIgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWQgZnJvbSB0aGlzIHZhbHVlLgogICAgICogQHBhcmFtIHtBcnJheX0gICBbb3B0aW9ucy5sb2NhbFBpdm90QV0gVGhlIHBvaW50IHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgbWFzcyBvZiBib2R5QSB3aGljaCBib2R5QSBpcyBjb25zdHJhaW5lZCB0by4KICAgICAqIEBwYXJhbSB7QXJyYXl9ICAgW29wdGlvbnMubG9jYWxQaXZvdEJdIFNlZSBsb2NhbFBpdm90QS4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgW29wdGlvbnMubWF4Rm9yY2VdIFRoZSBtYXhpbXVtIGZvcmNlIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gY29uc3RyYWluIHRoZSBib2RpZXMuCiAgICAgKiBAZXh0ZW5kcyBDb25zdHJhaW50CiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqICAgICAvLyBUaGlzIHdpbGwgY3JlYXRlIGEgcmV2b2x1dGUgY29uc3RyYWludCBiZXR3ZWVuIHR3byBib2RpZXMgd2l0aCBwaXZvdCBwb2ludCBpbiBiZXR3ZWVuIHRoZW0uCiAgICAgKiAgICAgdmFyIGJvZHlBID0gbmV3IEJvZHkoeyBtYXNzOiAxLCBwb3NpdGlvbjogWy0xLCAwXSB9KTsKICAgICAqICAgICB3b3JsZC5hZGRCb2R5KGJvZHlBKTsKICAgICAqCiAgICAgKiAgICAgdmFyIGJvZHlCID0gbmV3IEJvZHkoeyBtYXNzOiAxLCBwb3NpdGlvbjogWzEsIDBdIH0pOwogICAgICogICAgIHdvcmxkLmFkZEJvZHkoYm9keUIpOwogICAgICoKICAgICAqICAgICB2YXIgY29uc3RyYWludCA9IG5ldyBSZXZvbHV0ZUNvbnN0cmFpbnQoYm9keUEsIGJvZHlCLCB7CiAgICAgKiAgICAgICAgIHdvcmxkUGl2b3Q6IFswLCAwXQogICAgICogICAgIH0pOwogICAgICogICAgIHdvcmxkLmFkZENvbnN0cmFpbnQoY29uc3RyYWludCk7CiAgICAgKgogICAgICogICAgIC8vIFVzaW5nIGJvZHktbG9jYWwgcGl2b3QgcG9pbnRzLCB0aGUgY29uc3RyYWludCBjb3VsZCBoYXZlIGJlZW4gY29uc3RydWN0ZWQgbGlrZSB0aGlzOgogICAgICogICAgIHZhciBjb25zdHJhaW50ID0gbmV3IFJldm9sdXRlQ29uc3RyYWludChib2R5QSwgYm9keUIsIHsKICAgICAqICAgICAgICAgbG9jYWxQaXZvdEE6IFsxLCAwXSwKICAgICAqICAgICAgICAgbG9jYWxQaXZvdEI6IFstMSwgMF0KICAgICAqICAgICB9KTsKICAgICAqLwoKICAgIGZ1bmN0aW9uIFJldm9sdXRlQ29uc3RyYWludChib2R5QSwgYm9keUIsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIENvbnN0cmFpbnQkMi5jYWxsKHRoaXMsIGJvZHlBLCBib2R5QiwgQ29uc3RyYWludCQyLlJFVk9MVVRFLCBvcHRpb25zKTsKICAgICAgdmFyIG1heEZvcmNlID0gdGhpcy5tYXhGb3JjZSA9IG9wdGlvbnMubWF4Rm9yY2UgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubWF4Rm9yY2UgOiBOdW1iZXIuTUFYX1ZBTFVFOwogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtBcnJheX0gcGl2b3RBCiAgICAgICAqLwoKICAgICAgdmFyIHBpdm90QSA9IHRoaXMucGl2b3RBID0gdmVjMiQ0LmNyZWF0ZSgpOwogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtBcnJheX0gcGl2b3RCCiAgICAgICAqLwoKICAgICAgdmFyIHBpdm90QiA9IHRoaXMucGl2b3RCID0gdmVjMiQ0LmNyZWF0ZSgpOwoKICAgICAgaWYgKG9wdGlvbnMud29ybGRQaXZvdCkgewogICAgICAgIC8vIENvbXB1dGUgcGl2b3RBIGFuZCBwaXZvdEIKICAgICAgICBzdWIocGl2b3RBLCBvcHRpb25zLndvcmxkUGl2b3QsIGJvZHlBLnBvc2l0aW9uKTsKICAgICAgICBzdWIocGl2b3RCLCBvcHRpb25zLndvcmxkUGl2b3QsIGJvZHlCLnBvc2l0aW9uKTsgLy8gUm90YXRlIHRvIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtCgogICAgICAgIHJvdGF0ZShwaXZvdEEsIHBpdm90QSwgLWJvZHlBLmFuZ2xlKTsKICAgICAgICByb3RhdGUocGl2b3RCLCBwaXZvdEIsIC1ib2R5Qi5hbmdsZSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgLy8gR2V0IHBpdm90QSBhbmQgcGl2b3RCCiAgICAgICAgaWYgKG9wdGlvbnMubG9jYWxQaXZvdEEpIHsKICAgICAgICAgIGNvcHkocGl2b3RBLCBvcHRpb25zLmxvY2FsUGl2b3RBKTsKICAgICAgICB9CgogICAgICAgIGlmIChvcHRpb25zLmxvY2FsUGl2b3RCKSB7CiAgICAgICAgICBjb3B5KHBpdm90Qiwgb3B0aW9ucy5sb2NhbFBpdm90Qik7CiAgICAgICAgfQogICAgICB9CgogICAgICB2YXIgbW90b3JFcXVhdGlvbiA9IHRoaXMubW90b3JFcXVhdGlvbiA9IG5ldyBSb3RhdGlvbmFsVmVsb2NpdHlFcXVhdGlvbihib2R5QSwgYm9keUIpOwogICAgICBtb3RvckVxdWF0aW9uLmVuYWJsZWQgPSBmYWxzZTsKICAgICAgdmFyIHVwcGVyTGltaXRFcXVhdGlvbiA9IHRoaXMudXBwZXJMaW1pdEVxdWF0aW9uID0gbmV3IFJvdGF0aW9uYWxMb2NrRXF1YXRpb24kMShib2R5QSwgYm9keUIpOwogICAgICB2YXIgbG93ZXJMaW1pdEVxdWF0aW9uID0gdGhpcy5sb3dlckxpbWl0RXF1YXRpb24gPSBuZXcgUm90YXRpb25hbExvY2tFcXVhdGlvbiQxKGJvZHlBLCBib2R5Qik7CiAgICAgIHVwcGVyTGltaXRFcXVhdGlvbi5taW5Gb3JjZSA9IGxvd2VyTGltaXRFcXVhdGlvbi5tYXhGb3JjZSA9IDA7IC8vIEVxdWF0aW9ucyB0byBiZSBmZWQgdG8gdGhlIHNvbHZlcgoKICAgICAgdmFyIGVxcyA9IHRoaXMuZXF1YXRpb25zID0gW25ldyBFcXVhdGlvbiQxKGJvZHlBLCBib2R5QiwgLW1heEZvcmNlLCBtYXhGb3JjZSksIG5ldyBFcXVhdGlvbiQxKGJvZHlBLCBib2R5QiwgLW1heEZvcmNlLCBtYXhGb3JjZSksIG1vdG9yRXF1YXRpb24sIHVwcGVyTGltaXRFcXVhdGlvbiwgbG93ZXJMaW1pdEVxdWF0aW9uXTsKICAgICAgdmFyIHggPSBlcXNbMF07CiAgICAgIHZhciB5ID0gZXFzWzFdOwoKICAgICAgeC5jb21wdXRlR3EgPSBmdW5jdGlvbiAoKSB7CiAgICAgICAgcm90YXRlKHdvcmxkUGl2b3RBLCBwaXZvdEEsIGJvZHlBLmFuZ2xlKTsKICAgICAgICByb3RhdGUod29ybGRQaXZvdEIsIHBpdm90QiwgYm9keUIuYW5nbGUpOwogICAgICAgIGFkZChnLCBib2R5Qi5wb3NpdGlvbiwgd29ybGRQaXZvdEIpOwogICAgICAgIHN1YihnLCBnLCBib2R5QS5wb3NpdGlvbik7CiAgICAgICAgc3ViKGcsIGcsIHdvcmxkUGl2b3RBKTsKICAgICAgICByZXR1cm4gZG90KGcsIHhBeGlzKTsKICAgICAgfTsKCiAgICAgIHkuY29tcHV0ZUdxID0gZnVuY3Rpb24gKCkgewogICAgICAgIHJvdGF0ZSh3b3JsZFBpdm90QSwgcGl2b3RBLCBib2R5QS5hbmdsZSk7CiAgICAgICAgcm90YXRlKHdvcmxkUGl2b3RCLCBwaXZvdEIsIGJvZHlCLmFuZ2xlKTsKICAgICAgICBhZGQoZywgYm9keUIucG9zaXRpb24sIHdvcmxkUGl2b3RCKTsKICAgICAgICBzdWIoZywgZywgYm9keUEucG9zaXRpb24pOwogICAgICAgIHN1YihnLCBnLCB3b3JsZFBpdm90QSk7CiAgICAgICAgcmV0dXJuIGRvdChnLCB5QXhpcyk7CiAgICAgIH07CgogICAgICB5Lm1pbkZvcmNlID0geC5taW5Gb3JjZSA9IC1tYXhGb3JjZTsKICAgICAgeS5tYXhGb3JjZSA9IHgubWF4Rm9yY2UgPSBtYXhGb3JjZTsgLy8gVGhlc2UgbmV2ZXIgY2hhbmdlIGJ1dCB0aGUgYW5ndWxhciBwYXJ0cyBkbwoKICAgICAgeC5HWzBdID0gLTE7CiAgICAgIHguR1sxXSA9IDA7CiAgICAgIHguR1szXSA9IDE7CiAgICAgIHguR1s0XSA9IDA7CiAgICAgIHkuR1swXSA9IDA7CiAgICAgIHkuR1sxXSA9IC0xOwogICAgICB5LkdbM10gPSAwOwogICAgICB5LkdbNF0gPSAxOwogICAgICAvKioKICAgICAgICogVGhlIGNvbnN0cmFpbnQgcG9zaXRpb24uCiAgICAgICAqIEBwcm9wZXJ0eSBhbmdsZQogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKiBAcmVhZE9ubHkKICAgICAgICovCgogICAgICB0aGlzLmFuZ2xlID0gMDsKICAgICAgLyoqCiAgICAgICAqIFNldCB0byB0cnVlIHRvIGVuYWJsZSBsb3dlciBsaW1pdAogICAgICAgKiBAcHJvcGVydHkgbG93ZXJMaW1pdEVuYWJsZWQKICAgICAgICogQHR5cGUge0Jvb2xlYW59CiAgICAgICAqLwoKICAgICAgdGhpcy5sb3dlckxpbWl0RW5hYmxlZCA9IGZhbHNlOwogICAgICAvKioKICAgICAgICogU2V0IHRvIHRydWUgdG8gZW5hYmxlIHVwcGVyIGxpbWl0CiAgICAgICAqIEBwcm9wZXJ0eSB1cHBlckxpbWl0RW5hYmxlZAogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICovCgogICAgICB0aGlzLnVwcGVyTGltaXRFbmFibGVkID0gZmFsc2U7CiAgICAgIC8qKgogICAgICAgKiBUaGUgbG93ZXIgbGltaXQgb24gdGhlIGNvbnN0cmFpbnQgYW5nbGUuCiAgICAgICAqIEBwcm9wZXJ0eSBsb3dlckxpbWl0CiAgICAgICAqIEB0eXBlIHtCb29sZWFufQogICAgICAgKi8KCiAgICAgIHRoaXMubG93ZXJMaW1pdCA9IDA7CiAgICAgIC8qKgogICAgICAgKiBUaGUgdXBwZXIgbGltaXQgb24gdGhlIGNvbnN0cmFpbnQgYW5nbGUuCiAgICAgICAqIEBwcm9wZXJ0eSB1cHBlckxpbWl0CiAgICAgICAqIEB0eXBlIHtCb29sZWFufQogICAgICAgKi8KCiAgICAgIHRoaXMudXBwZXJMaW1pdCA9IDA7CiAgICB9CgogICAgUmV2b2x1dGVDb25zdHJhaW50LnByb3RvdHlwZSA9IG5ldyBDb25zdHJhaW50JDIoKTsKICAgIFJldm9sdXRlQ29uc3RyYWludC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZXZvbHV0ZUNvbnN0cmFpbnQ7CiAgICAvKioKICAgICAqIFNldCB0aGUgY29uc3RyYWludCBhbmdsZSBsaW1pdHMsIGFuZCBlbmFibGUgdGhlbS4KICAgICAqIEBtZXRob2Qgc2V0TGltaXRzCiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG93ZXIgTG93ZXIgYW5nbGUgbGltaXQuCiAgICAgKiBAcGFyYW0ge251bWJlcn0gdXBwZXIgVXBwZXIgYW5nbGUgbGltaXQuCiAgICAgKi8KCiAgICBSZXZvbHV0ZUNvbnN0cmFpbnQucHJvdG90eXBlLnNldExpbWl0cyA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHsKICAgICAgdGhpcy5sb3dlckxpbWl0ID0gbG93ZXI7CiAgICAgIHRoaXMudXBwZXJMaW1pdCA9IHVwcGVyOwogICAgICB0aGlzLmxvd2VyTGltaXRFbmFibGVkID0gdGhpcy51cHBlckxpbWl0RW5hYmxlZCA9IHRydWU7CiAgICB9OwoKICAgIFJldm9sdXRlQ29uc3RyYWludC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgYm9keUEgPSB0aGlzLmJvZHlBLAogICAgICAgICAgYm9keUIgPSB0aGlzLmJvZHlCLAogICAgICAgICAgcGl2b3RBID0gdGhpcy5waXZvdEEsCiAgICAgICAgICBwaXZvdEIgPSB0aGlzLnBpdm90QiwKICAgICAgICAgIGVxcyA9IHRoaXMuZXF1YXRpb25zLAogICAgICAgICAgeCA9IGVxc1swXSwKICAgICAgICAgIHkgPSBlcXNbMV0sCiAgICAgICAgICB1cHBlckxpbWl0ID0gdGhpcy51cHBlckxpbWl0LAogICAgICAgICAgbG93ZXJMaW1pdCA9IHRoaXMubG93ZXJMaW1pdCwKICAgICAgICAgIHVwcGVyTGltaXRFcXVhdGlvbiA9IHRoaXMudXBwZXJMaW1pdEVxdWF0aW9uLAogICAgICAgICAgbG93ZXJMaW1pdEVxdWF0aW9uID0gdGhpcy5sb3dlckxpbWl0RXF1YXRpb247CiAgICAgIHZhciByZWxBbmdsZSA9IHRoaXMuYW5nbGUgPSBib2R5Qi5hbmdsZSAtIGJvZHlBLmFuZ2xlOwogICAgICB1cHBlckxpbWl0RXF1YXRpb24uYW5nbGUgPSB1cHBlckxpbWl0OwogICAgICB1cHBlckxpbWl0RXF1YXRpb24uZW5hYmxlZCA9IHRoaXMudXBwZXJMaW1pdEVuYWJsZWQgJiYgcmVsQW5nbGUgPiB1cHBlckxpbWl0OwogICAgICBsb3dlckxpbWl0RXF1YXRpb24uYW5nbGUgPSBsb3dlckxpbWl0OwogICAgICBsb3dlckxpbWl0RXF1YXRpb24uZW5hYmxlZCA9IHRoaXMubG93ZXJMaW1pdEVuYWJsZWQgJiYgcmVsQW5nbGUgPCBsb3dlckxpbWl0OwogICAgICAvKgogICAgICAgVGhlIGNvbnN0cmFpbnQgdmlvbGF0aW9uIGlzCiAgICAgICAgICAgZyA9IHhqICsgcmogLSB4aSAtIHJpCiAgICAgICAuLi53aGVyZSB4aSBhbmQgeGogYXJlIHRoZSBib2R5IHBvc2l0aW9ucyBhbmQgcmkgYW5kIHJqIHdvcmxkLW9yaWVudGVkIG9mZnNldCB2ZWN0b3JzLiBEaWZmZXJlbnRpYXRlOgogICAgICAgICAgIGdkb3QgPSB2aiArIHdqIHggcmogLSB2aSAtIHdpIHggcmkKICAgICAgIFdlIHNwbGl0IHRoaXMgaW50byB4IGFuZCB5IGRpcmVjdGlvbnMuIChsZXQgeCBhbmQgeSBiZSB1bml0IHZlY3RvcnMgYWxvbmcgdGhlIHJlc3BlY3RpdmUgYXhlcykKICAgICAgICAgICBnZG90ICogeCA9ICggdmogKyB3aiB4IHJqIC0gdmkgLSB3aSB4IHJpICkgKiB4CiAgICAgICAgICAgICAgICAgICA9ICggdmoqeCArICh3aiB4IHJqKSp4IC12aSp4IC0od2kgeCByaSkqeAogICAgICAgICAgICAgICAgICAgPSAoIHZqKnggKyAocmogeCB4KSp3aiAtdmkqeCAtKHJpIHggeCkqd2kKICAgICAgICAgICAgICAgICAgID0gWyAteCAgIC0ocmkgeCB4KSAgIHggICAocmogeCB4KV0gKiBbdmkgd2kgdmogd2pdCiAgICAgICAgICAgICAgICAgICA9IEcqVwogICAgICAgLi4uYW5kIHNpbWlsYXIgZm9yIHkuIFdlIGhhdmUgdGhlbiBpZGVudGlmaWVkIHRoZSBqYWNvYmlhbiBlbnRyaWVzIGZvciB4IGFuZCB5IGRpcmVjdGlvbnM6CiAgICAgICAgICAgR3ggPSBbIHggICAocmogeCB4KSAgIC14ICAgLShyaSB4IHgpXQogICAgICAgICAgR3kgPSBbIHkgICAocmogeCB5KSAgIC15ICAgLShyaSB4IHkpXQogICAgICAgU28gZm9yIGV4YW1wbGUsIGluIHRoZSBYIGRpcmVjdGlvbiB3ZSB3b3VsZCBnZXQgaW4gMiBkaW1lbnNpb25zCiAgICAgICAgICAgRyA9IFsgWzEgICAwICAgKHJqIHggWzEsMF0pICAgLTEgICAwICAgLShyaSB4IFsxLDBdKV0KICAgICAgICAgICAgICAgIFswICAgMSAgIChyaiB4IFswLDFdKSAgICAwICAtMSAgIC0ocmkgeCBbMCwxXSldCiAgICAgICAqLwoKICAgICAgcm90YXRlKHdvcmxkUGl2b3RBLCBwaXZvdEEsIGJvZHlBLmFuZ2xlKTsKICAgICAgcm90YXRlKHdvcmxkUGl2b3RCLCBwaXZvdEIsIGJvZHlCLmFuZ2xlKTsgLy8gQHRvZG86IHRoZXNlIGFyZSBhIGJpdCBzcGFyc2UuIFdlIGNvdWxkIHNhdmUgc29tZSBjb21wdXRhdGlvbnMgb24gbWFraW5nIGN1c3RvbSBlcS5jb21wdXRlR1cgZnVuY3Rpb25zLCBldGMKCiAgICAgIHZhciB4RyA9IHguRzsKICAgICAgeEdbMl0gPSAtY3Jvc3NMZW5ndGgod29ybGRQaXZvdEEsIHhBeGlzKTsKICAgICAgeEdbNV0gPSBjcm9zc0xlbmd0aCh3b3JsZFBpdm90QiwgeEF4aXMpOwogICAgICB2YXIgeUcgPSB5Lkc7CiAgICAgIHlHWzJdID0gLWNyb3NzTGVuZ3RoKHdvcmxkUGl2b3RBLCB5QXhpcyk7CiAgICAgIHlHWzVdID0gY3Jvc3NMZW5ndGgod29ybGRQaXZvdEIsIHlBeGlzKTsKICAgIH07CgogICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmV2b2x1dGVDb25zdHJhaW50LnByb3RvdHlwZSwgewogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtib29sZWFufSBtb3RvckVuYWJsZWQKICAgICAgICovCiAgICAgIG1vdG9yRW5hYmxlZDogewogICAgICAgIGdldDogZnVuY3Rpb24gKCkgewogICAgICAgICAgcmV0dXJuIHRoaXMubW90b3JFcXVhdGlvbi5lbmFibGVkOwogICAgICAgIH0sCiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHsKICAgICAgICAgIHRoaXMubW90b3JFcXVhdGlvbi5lbmFibGVkID0gdmFsdWU7CiAgICAgICAgfQogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtb3RvclNwZWVkCiAgICAgICAqLwogICAgICBtb3RvclNwZWVkOiB7CiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7CiAgICAgICAgICByZXR1cm4gdGhpcy5tb3RvckVxdWF0aW9uLnJlbGF0aXZlVmVsb2NpdHk7CiAgICAgICAgfSwKICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkgewogICAgICAgICAgdGhpcy5tb3RvckVxdWF0aW9uLnJlbGF0aXZlVmVsb2NpdHkgPSB2YWx1ZTsKICAgICAgICB9CiAgICAgIH0sCgogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1vdG9yTWF4Rm9yY2UKICAgICAgICovCiAgICAgIG1vdG9yTWF4Rm9yY2U6IHsKICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsKICAgICAgICAgIHJldHVybiB0aGlzLm1vdG9yRXF1YXRpb24ubWF4Rm9yY2U7CiAgICAgICAgfSwKICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkgewogICAgICAgICAgdmFyIGVxID0gdGhpcy5tb3RvckVxdWF0aW9uOwogICAgICAgICAgZXEubWF4Rm9yY2UgPSB2YWx1ZTsKICAgICAgICAgIGVxLm1pbkZvcmNlID0gLXZhbHVlOwogICAgICAgIH0KICAgICAgfQogICAgfSk7CiAgICAvKioKICAgICAqIEVuYWJsZSB0aGUgcm90YXRpb25hbCBtb3RvcgogICAgICogQGRlcHJlY2F0ZWQgVXNlIG1vdG9yRW5hYmxlZCBpbnN0ZWFkCiAgICAgKiBAbWV0aG9kIGVuYWJsZU1vdG9yCiAgICAgKi8KCiAgICBSZXZvbHV0ZUNvbnN0cmFpbnQucHJvdG90eXBlLmVuYWJsZU1vdG9yID0gZnVuY3Rpb24gKCkgewogICAgICBjb25zb2xlLndhcm4oInJldm9sdXRlLmVuYWJsZU1vdG9yKCkgaXMgZGVwcmVjYXRlZCwgZG8gcmV2b2x1dGUubW90b3JFbmFibGVkID0gdHJ1ZTsgaW5zdGVhZC4iKTsKICAgICAgdGhpcy5tb3RvckVuYWJsZWQgPSB0cnVlOwogICAgfTsKICAgIC8qKgogICAgICogRGlzYWJsZSB0aGUgcm90YXRpb25hbCBtb3RvcgogICAgICogQGRlcHJlY2F0ZWQgVXNlIG1vdG9yRW5hYmxlZCBpbnN0ZWFkCiAgICAgKiBAbWV0aG9kIGRpc2FibGVNb3RvcgogICAgICovCgoKICAgIFJldm9sdXRlQ29uc3RyYWludC5wcm90b3R5cGUuZGlzYWJsZU1vdG9yID0gZnVuY3Rpb24gKCkgewogICAgICBjb25zb2xlLndhcm4oInJldm9sdXRlLmRpc2FibGVNb3RvcigpIGlzIGRlcHJlY2F0ZWQsIGRvIHJldm9sdXRlLm1vdG9yRW5hYmxlZCA9IGZhbHNlOyBpbnN0ZWFkLiIpOwogICAgICB0aGlzLm1vdG9yRW5hYmxlZCA9IGZhbHNlOwogICAgfTsKICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhlIG1vdG9yIGlzIGVuYWJsZWQuCiAgICAgKiBAbWV0aG9kIG1vdG9ySXNFbmFibGVkCiAgICAgKiBAZGVwcmVjYXRlZCBVc2UgbW90b3JFbmFibGVkIGluc3RlYWQKICAgICAqIEByZXR1cm4ge0Jvb2xlYW59CiAgICAgKi8KCgogICAgUmV2b2x1dGVDb25zdHJhaW50LnByb3RvdHlwZS5tb3RvcklzRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHsKICAgICAgY29uc29sZS53YXJuKCJyZXZvbHV0ZS5tb3RvcklzRW5hYmxlZCgpIGlzIGRlcHJlY2F0ZWQsIHVzZSByZXZvbHV0ZS5tb3RvckVuYWJsZWQgaW5zdGVhZC4iKTsKICAgICAgcmV0dXJuIHRoaXMubW90b3JFbmFibGVkOwogICAgfTsKICAgIC8qKgogICAgICogU2V0IHRoZSBzcGVlZCBvZiB0aGUgcm90YXRpb25hbCBjb25zdHJhaW50IG1vdG9yCiAgICAgKiBAbWV0aG9kIHNldE1vdG9yU3BlZWQKICAgICAqIEBkZXByZWNhdGVkIFVzZSAubW90b3JTcGVlZCBpbnN0ZWFkCiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQKICAgICAqLwoKCiAgICBSZXZvbHV0ZUNvbnN0cmFpbnQucHJvdG90eXBlLnNldE1vdG9yU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHsKICAgICAgY29uc29sZS53YXJuKCJyZXZvbHV0ZS5zZXRNb3RvclNwZWVkKHNwZWVkKSBpcyBkZXByZWNhdGVkLCBkbyByZXZvbHV0ZS5tb3RvclNwZWVkID0gc3BlZWQ7IGluc3RlYWQuIik7CiAgICAgIHRoaXMubW90b3JTcGVlZCA9IHNwZWVkOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IHRoZSBzcGVlZCBvZiB0aGUgcm90YXRpb25hbCBjb25zdHJhaW50IG1vdG9yCiAgICAgKiBAZGVwcmVjYXRlZCBVc2UgLm1vdG9yU3BlZWQgaW5zdGVhZAogICAgICogQG1ldGhvZCBnZXRNb3RvclNwZWVkCiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9CiAgICAgKi8KCgogICAgUmV2b2x1dGVDb25zdHJhaW50LnByb3RvdHlwZS5nZXRNb3RvclNwZWVkID0gZnVuY3Rpb24gKCkgewogICAgICBjb25zb2xlLndhcm4oInJldm9sdXRlLmdldE1vdG9yU3BlZWQoKSBpcyBkZXByZWNhdGVkLCB1c2UgcmV2b2x1dGUubW90b3JTcGVlZCBpbnN0ZWFkLiIpOwogICAgICByZXR1cm4gdGhpcy5tb3RvclNwZWVkOwogICAgfTsKCiAgICB2YXIgQ29uc3RyYWludCQxID0gQ29uc3RyYWludF8xLAogICAgICAgIENvbnRhY3RFcXVhdGlvbiA9IENvbnRhY3RFcXVhdGlvbl8xLAogICAgICAgIEVxdWF0aW9uID0gRXF1YXRpb25fMSwKICAgICAgICB2ZWMyJDMgPSB2ZWMyJHEuZXhwb3J0cywKICAgICAgICBSb3RhdGlvbmFsTG9ja0VxdWF0aW9uID0gUm90YXRpb25hbExvY2tFcXVhdGlvbl8xOwoKICAgIHZhciBQcmlzbWF0aWNDb25zdHJhaW50XzEgPSBQcmlzbWF0aWNDb25zdHJhaW50OwogICAgLyoqCiAgICAgKiBDb25zdHJhaW50IHRoYXQgb25seSBhbGxvd3MgYm9kaWVzIHRvIG1vdmUgYWxvbmcgYSBsaW5lLCByZWxhdGl2ZSB0byBlYWNoIG90aGVyLiBTZWUgPGEgaHJlZj0iaHR0cDovL3d3dy5pZm9yY2UyZC5uZXQvYjJkdHV0L2pvaW50cy1wcmlzbWF0aWMiPnRoaXMgdHV0b3JpYWw8L2E+LiBBbHNvIGNhbGxlZCAic2xpZGVyIGNvbnN0cmFpbnQiLgogICAgICoKICAgICAqIEBjbGFzcyBQcmlzbWF0aWNDb25zdHJhaW50CiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBleHRlbmRzIENvbnN0cmFpbnQKICAgICAqIEBhdXRob3Igc2NodGVwcGUKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUEKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUIKICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhGb3JjZV0gTWF4IGZvcmNlIHRvIGJlIGFwcGxpZWQgYnkgdGhlIGNvbnN0cmFpbnQKICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLmxvY2FsQW5jaG9yQV0gQm9keSBBJ3MgYW5jaG9yIHBvaW50LCBkZWZpbmVkIGluIGl0cyBvd24gbG9jYWwgZnJhbWUuCiAgICAgKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5sb2NhbEFuY2hvckJdIEJvZHkgQidzIGFuY2hvciBwb2ludCwgZGVmaW5lZCBpbiBpdHMgb3duIGxvY2FsIGZyYW1lLgogICAgICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMubG9jYWxBeGlzQV0gQW4gYXhpcywgZGVmaW5lZCBpbiBib2R5IEEgZnJhbWUsIHRoYXQgYm9keSBCJ3MgYW5jaG9yIHBvaW50IG1heSBzbGlkZSBhbG9uZy4KICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZGlzYWJsZVJvdGF0aW9uYWxMb2NrXSBJZiBzZXQgdG8gdHJ1ZSwgYm9keUIgd2lsbCBiZSBmcmVlIHRvIHJvdGF0ZSBhcm91bmQgaXRzIGFuY2hvciBwb2ludC4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy51cHBlckxpbWl0XQogICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxvd2VyTGltaXRdCiAgICAgKiBAdG9kbyBBYmlsaXR5IHRvIGNyZWF0ZSB1c2luZyBvbmx5IGEgcG9pbnQgYW5kIGEgd29ybGRBeGlzCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciBjb25zdHJhaW50ID0gbmV3IFByaXNtYXRpY0NvbnN0cmFpbnQoYm9keUEsIGJvZHlCLCB7CiAgICAgKiAgICAgICAgIGxvY2FsQXhpc0E6IFswLCAxXQogICAgICogICAgIH0pOwogICAgICogICAgIHdvcmxkLmFkZENvbnN0cmFpbnQoY29uc3RyYWludCk7CiAgICAgKi8KCiAgICBmdW5jdGlvbiBQcmlzbWF0aWNDb25zdHJhaW50KGJvZHlBLCBib2R5Qiwgb3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsKICAgICAgQ29uc3RyYWludCQxLmNhbGwodGhpcywgYm9keUEsIGJvZHlCLCBDb25zdHJhaW50JDEuUFJJU01BVElDLCBvcHRpb25zKTsgLy8gR2V0IGFuY2hvcnMKCiAgICAgIHZhciBsb2NhbEFuY2hvckEgPSB2ZWMyJDMuY3JlYXRlKCksCiAgICAgICAgICBsb2NhbEF4aXNBID0gdmVjMiQzLmZyb21WYWx1ZXMoMSwgMCksCiAgICAgICAgICBsb2NhbEFuY2hvckIgPSB2ZWMyJDMuY3JlYXRlKCk7CgogICAgICBpZiAob3B0aW9ucy5sb2NhbEFuY2hvckEpIHsKICAgICAgICB2ZWMyJDMuY29weShsb2NhbEFuY2hvckEsIG9wdGlvbnMubG9jYWxBbmNob3JBKTsKICAgICAgfQoKICAgICAgaWYgKG9wdGlvbnMubG9jYWxBeGlzQSkgewogICAgICAgIHZlYzIkMy5jb3B5KGxvY2FsQXhpc0EsIG9wdGlvbnMubG9jYWxBeGlzQSk7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLmxvY2FsQW5jaG9yQikgewogICAgICAgIHZlYzIkMy5jb3B5KGxvY2FsQW5jaG9yQiwgb3B0aW9ucy5sb2NhbEFuY2hvckIpOwogICAgICB9CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkgbG9jYWxBbmNob3JBCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgoKICAgICAgdGhpcy5sb2NhbEFuY2hvckEgPSBsb2NhbEFuY2hvckE7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkgbG9jYWxBbmNob3JCCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLmxvY2FsQW5jaG9yQiA9IGxvY2FsQW5jaG9yQjsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSBsb2NhbEF4aXNBCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLmxvY2FsQXhpc0EgPSBsb2NhbEF4aXNBOwogICAgICAvKgogICAgICAgVGhlIGNvbnN0cmFpbnQgdmlvbGF0aW9uIGZvciB0aGUgY29tbW9uIGF4aXMgcG9pbnQgaXMKICAgICAgICAgICBnID0gKCB4aiArIHJqIC0geGkgLSByaSApICogdCAgIDo9ICBnZyp0CiAgICAgICB3aGVyZSByIGFyZSBib2R5LWxvY2FsIGFuY2hvciBwb2ludHMsIGFuZCB0IGlzIGEgdGFuZ2VudCB0byB0aGUgY29uc3RyYWludCBheGlzIGRlZmluZWQgaW4gYm9keSBpIGZyYW1lLgogICAgICAgICAgIGdkb3QgPSAgKCB2aiArIHdqIHggcmogLSB2aSAtIHdpIHggcmkgKSAqIHQgKyAoIHhqICsgcmogLSB4aSAtIHJpICkgKiAoIHdpIHggdCApCiAgICAgICBOb3RlIHRoZSB1c2Ugb2YgdGhlIGNoYWluIHJ1bGUuIE5vdyB3ZSBpZGVudGlmeSB0aGUgamFjb2JpYW4KICAgICAgICAgICBHKlcgPSBbIC10ICAgICAgLXJpIHggdCArIHQgeCBnZyAgICAgdCAgICByaiB4IHQgXSAqIFt2aSB3aSB2aiB3al0KICAgICAgIFRoZSByb3RhdGlvbmFsIHBhcnQgaXMganVzdCBhIHJvdGF0aW9uIGxvY2suCiAgICAgICAgKi8KCiAgICAgIHZhciBtYXhGb3JjZSA9IHRoaXMubWF4Rm9yY2UgPSBvcHRpb25zLm1heEZvcmNlICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1heEZvcmNlIDogTnVtYmVyLk1BWF9WQUxVRTsgLy8gVHJhbnNsYXRpb25hbCBwYXJ0CgogICAgICB2YXIgdHJhbnMgPSBuZXcgRXF1YXRpb24oYm9keUEsIGJvZHlCLCAtbWF4Rm9yY2UsIG1heEZvcmNlKTsKICAgICAgdmFyIHJpID0gbmV3IHZlYzIkMy5jcmVhdGUoKSwKICAgICAgICAgIHJqID0gbmV3IHZlYzIkMy5jcmVhdGUoKSwKICAgICAgICAgIGdnID0gbmV3IHZlYzIkMy5jcmVhdGUoKSwKICAgICAgICAgIHQgPSBuZXcgdmVjMiQzLmNyZWF0ZSgpOwoKICAgICAgdHJhbnMuY29tcHV0ZUdxID0gZnVuY3Rpb24gKCkgewogICAgICAgIC8vIGcgPSAoIHhqICsgcmogLSB4aSAtIHJpICkgKiB0CiAgICAgICAgcmV0dXJuIHZlYzIkMy5kb3QoZ2csIHQpOwogICAgICB9OwoKICAgICAgdHJhbnMudXBkYXRlSmFjb2JpYW4gPSBmdW5jdGlvbiAoKSB7CiAgICAgICAgdmFyIEcgPSB0aGlzLkcsCiAgICAgICAgICAgIHhpID0gYm9keUEucG9zaXRpb24sCiAgICAgICAgICAgIHhqID0gYm9keUIucG9zaXRpb247CiAgICAgICAgdmVjMiQzLnJvdGF0ZShyaSwgbG9jYWxBbmNob3JBLCBib2R5QS5hbmdsZSk7CiAgICAgICAgdmVjMiQzLnJvdGF0ZShyaiwgbG9jYWxBbmNob3JCLCBib2R5Qi5hbmdsZSk7CiAgICAgICAgdmVjMiQzLmFkZChnZywgeGosIHJqKTsKICAgICAgICB2ZWMyJDMuc3VidHJhY3QoZ2csIGdnLCB4aSk7CiAgICAgICAgdmVjMiQzLnN1YnRyYWN0KGdnLCBnZywgcmkpOwogICAgICAgIHZlYzIkMy5yb3RhdGUodCwgbG9jYWxBeGlzQSwgYm9keUEuYW5nbGUgKyBNYXRoLlBJIC8gMik7CiAgICAgICAgR1swXSA9IC10WzBdOwogICAgICAgIEdbMV0gPSAtdFsxXTsKICAgICAgICBHWzJdID0gLXZlYzIkMy5jcm9zc0xlbmd0aChyaSwgdCkgKyB2ZWMyJDMuY3Jvc3NMZW5ndGgodCwgZ2cpOwogICAgICAgIEdbM10gPSB0WzBdOwogICAgICAgIEdbNF0gPSB0WzFdOwogICAgICAgIEdbNV0gPSB2ZWMyJDMuY3Jvc3NMZW5ndGgocmosIHQpOwogICAgICB9OwoKICAgICAgdGhpcy5lcXVhdGlvbnMucHVzaCh0cmFucyk7IC8vIFJvdGF0aW9uYWwgcGFydAoKICAgICAgaWYgKCFvcHRpb25zLmRpc2FibGVSb3RhdGlvbmFsTG9jaykgewogICAgICAgIHZhciByb3QgPSBuZXcgUm90YXRpb25hbExvY2tFcXVhdGlvbihib2R5QSwgYm9keUIsIC1tYXhGb3JjZSwgbWF4Rm9yY2UpOwogICAgICAgIHRoaXMuZXF1YXRpb25zLnB1c2gocm90KTsKICAgICAgfQogICAgICAvKioKICAgICAgICogVGhlIHBvc2l0aW9uIG9mIGFuY2hvciBBIHJlbGF0aXZlIHRvIGFuY2hvciBCLCBhbG9uZyB0aGUgY29uc3RyYWludCBheGlzLgogICAgICAgKiBAcHJvcGVydHkgcG9zaXRpb24KICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgoKICAgICAgdGhpcy5wb3NpdGlvbiA9IDA7IC8vIElzIHRoaXMgb25lIHVzZWQgYXQgYWxsPwoKICAgICAgdGhpcy52ZWxvY2l0eSA9IDA7CiAgICAgIC8qKgogICAgICAgKiBTZXQgdG8gdHJ1ZSB0byBlbmFibGUgbG93ZXIgbGltaXQuCiAgICAgICAqIEBwcm9wZXJ0eSBsb3dlckxpbWl0RW5hYmxlZAogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICovCgogICAgICB0aGlzLmxvd2VyTGltaXRFbmFibGVkID0gb3B0aW9ucy5sb3dlckxpbWl0ICE9PSB1bmRlZmluZWQgPyB0cnVlIDogZmFsc2U7CiAgICAgIC8qKgogICAgICAgKiBTZXQgdG8gdHJ1ZSB0byBlbmFibGUgdXBwZXIgbGltaXQuCiAgICAgICAqIEBwcm9wZXJ0eSB1cHBlckxpbWl0RW5hYmxlZAogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICovCgogICAgICB0aGlzLnVwcGVyTGltaXRFbmFibGVkID0gb3B0aW9ucy51cHBlckxpbWl0ICE9PSB1bmRlZmluZWQgPyB0cnVlIDogZmFsc2U7CiAgICAgIC8qKgogICAgICAgKiBMb3dlciBjb25zdHJhaW50IGxpbWl0LiBUaGUgY29uc3RyYWludCBwb3NpdGlvbiBpcyBmb3JjZWQgdG8gYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZS4KICAgICAgICogQHByb3BlcnR5IGxvd2VyTGltaXQKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmxvd2VyTGltaXQgPSBvcHRpb25zLmxvd2VyTGltaXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubG93ZXJMaW1pdCA6IDA7CiAgICAgIC8qKgogICAgICAgKiBVcHBlciBjb25zdHJhaW50IGxpbWl0LiBUaGUgY29uc3RyYWludCBwb3NpdGlvbiBpcyBmb3JjZWQgdG8gYmUgc21hbGxlciB0aGFuIHRoaXMgdmFsdWUuCiAgICAgICAqIEBwcm9wZXJ0eSB1cHBlckxpbWl0CiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy51cHBlckxpbWl0ID0gb3B0aW9ucy51cHBlckxpbWl0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnVwcGVyTGltaXQgOiAxOyAvLyBFcXVhdGlvbnMgdXNlZCBmb3IgbGltaXRzCgogICAgICB0aGlzLnVwcGVyTGltaXRFcXVhdGlvbiA9IG5ldyBDb250YWN0RXF1YXRpb24oYm9keUEsIGJvZHlCKTsKICAgICAgdGhpcy5sb3dlckxpbWl0RXF1YXRpb24gPSBuZXcgQ29udGFjdEVxdWF0aW9uKGJvZHlBLCBib2R5Qik7IC8vIFNldCBtYXgvbWluIGZvcmNlcwoKICAgICAgdGhpcy51cHBlckxpbWl0RXF1YXRpb24ubWluRm9yY2UgPSB0aGlzLmxvd2VyTGltaXRFcXVhdGlvbi5taW5Gb3JjZSA9IDA7CiAgICAgIHRoaXMudXBwZXJMaW1pdEVxdWF0aW9uLm1heEZvcmNlID0gdGhpcy5sb3dlckxpbWl0RXF1YXRpb24ubWF4Rm9yY2UgPSBtYXhGb3JjZTsKICAgICAgLyoqCiAgICAgICAqIEVxdWF0aW9uIHVzZWQgZm9yIHRoZSBtb3Rvci4KICAgICAgICogQHByb3BlcnR5IG1vdG9yRXF1YXRpb24KICAgICAgICogQHR5cGUge0VxdWF0aW9ufQogICAgICAgKi8KCiAgICAgIHRoaXMubW90b3JFcXVhdGlvbiA9IG5ldyBFcXVhdGlvbihib2R5QSwgYm9keUIpOwogICAgICAvKioKICAgICAgICogVGhlIGN1cnJlbnQgbW90b3Igc3RhdGUuIEVuYWJsZSBvciBkaXNhYmxlIHRoZSBtb3RvciB1c2luZyAuZW5hYmxlTW90b3IKICAgICAgICogQHByb3BlcnR5IG1vdG9yRW5hYmxlZAogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICovCgogICAgICB0aGlzLm1vdG9yRW5hYmxlZCA9IGZhbHNlOwogICAgICAvKioKICAgICAgICogU2V0IHRoZSB0YXJnZXQgc3BlZWQgZm9yIHRoZSBtb3Rvci4KICAgICAgICogQHByb3BlcnR5IG1vdG9yU3BlZWQKICAgICAgICogQHR5cGUge051bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLm1vdG9yU3BlZWQgPSAwOwogICAgICB2YXIgdGhhdCA9IHRoaXM7CiAgICAgIHZhciBtb3RvckVxdWF0aW9uID0gdGhpcy5tb3RvckVxdWF0aW9uOwoKICAgICAgbW90b3JFcXVhdGlvbi5jb21wdXRlR3EgPSBmdW5jdGlvbiAoKSB7CiAgICAgICAgcmV0dXJuIDA7CiAgICAgIH07CgogICAgICBtb3RvckVxdWF0aW9uLmNvbXB1dGVHVyA9IGZ1bmN0aW9uICgpIHsKICAgICAgICB2YXIgRyA9IHRoaXMuRywKICAgICAgICAgICAgYmkgPSB0aGlzLmJvZHlBLAogICAgICAgICAgICBiaiA9IHRoaXMuYm9keUIsCiAgICAgICAgICAgIHZpID0gYmkudmVsb2NpdHksCiAgICAgICAgICAgIHZqID0gYmoudmVsb2NpdHksCiAgICAgICAgICAgIHdpID0gYmkuYW5ndWxhclZlbG9jaXR5LAogICAgICAgICAgICB3aiA9IGJqLmFuZ3VsYXJWZWxvY2l0eTsKICAgICAgICByZXR1cm4gdGhpcy5nbXVsdChHLCB2aSwgd2ksIHZqLCB3aikgKyB0aGF0Lm1vdG9yU3BlZWQ7CiAgICAgIH07CiAgICB9CgogICAgUHJpc21hdGljQ29uc3RyYWludC5wcm90b3R5cGUgPSBuZXcgQ29uc3RyYWludCQxKCk7CiAgICBQcmlzbWF0aWNDb25zdHJhaW50LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByaXNtYXRpY0NvbnN0cmFpbnQ7CiAgICB2YXIgd29ybGRBeGlzQSA9IHZlYzIkMy5jcmVhdGUoKSwKICAgICAgICB3b3JsZEFuY2hvckEgPSB2ZWMyJDMuY3JlYXRlKCksCiAgICAgICAgd29ybGRBbmNob3JCID0gdmVjMiQzLmNyZWF0ZSgpLAogICAgICAgIG9yaWVudGVkQW5jaG9yQSA9IHZlYzIkMy5jcmVhdGUoKSwKICAgICAgICBvcmllbnRlZEFuY2hvckIgPSB2ZWMyJDMuY3JlYXRlKCksCiAgICAgICAgdG1wID0gdmVjMiQzLmNyZWF0ZSgpOwogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIGNvbnN0cmFpbnQgZXF1YXRpb25zLiBTaG91bGQgYmUgZG9uZSBpZiBhbnkgb2YgdGhlIGJvZGllcyBjaGFuZ2VkIHBvc2l0aW9uLCBiZWZvcmUgc29sdmluZy4KICAgICAqIEBtZXRob2QgdXBkYXRlCiAgICAgKi8KCiAgICBQcmlzbWF0aWNDb25zdHJhaW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBlcXMgPSB0aGlzLmVxdWF0aW9ucywKICAgICAgICAgIHRyYW5zID0gZXFzWzBdLAogICAgICAgICAgdXBwZXJMaW1pdCA9IHRoaXMudXBwZXJMaW1pdCwKICAgICAgICAgIGxvd2VyTGltaXQgPSB0aGlzLmxvd2VyTGltaXQsCiAgICAgICAgICB1cHBlckxpbWl0RXF1YXRpb24gPSB0aGlzLnVwcGVyTGltaXRFcXVhdGlvbiwKICAgICAgICAgIGxvd2VyTGltaXRFcXVhdGlvbiA9IHRoaXMubG93ZXJMaW1pdEVxdWF0aW9uLAogICAgICAgICAgYm9keUEgPSB0aGlzLmJvZHlBLAogICAgICAgICAgYm9keUIgPSB0aGlzLmJvZHlCLAogICAgICAgICAgbG9jYWxBeGlzQSA9IHRoaXMubG9jYWxBeGlzQSwKICAgICAgICAgIGxvY2FsQW5jaG9yQSA9IHRoaXMubG9jYWxBbmNob3JBLAogICAgICAgICAgbG9jYWxBbmNob3JCID0gdGhpcy5sb2NhbEFuY2hvckI7CiAgICAgIHRyYW5zLnVwZGF0ZUphY29iaWFuKCk7IC8vIFRyYW5zZm9ybSBsb2NhbCB0aGluZ3MgdG8gd29ybGQKCiAgICAgIHZlYzIkMy5yb3RhdGUod29ybGRBeGlzQSwgbG9jYWxBeGlzQSwgYm9keUEuYW5nbGUpOwogICAgICB2ZWMyJDMucm90YXRlKG9yaWVudGVkQW5jaG9yQSwgbG9jYWxBbmNob3JBLCBib2R5QS5hbmdsZSk7CiAgICAgIHZlYzIkMy5hZGQod29ybGRBbmNob3JBLCBvcmllbnRlZEFuY2hvckEsIGJvZHlBLnBvc2l0aW9uKTsKICAgICAgdmVjMiQzLnJvdGF0ZShvcmllbnRlZEFuY2hvckIsIGxvY2FsQW5jaG9yQiwgYm9keUIuYW5nbGUpOwogICAgICB2ZWMyJDMuYWRkKHdvcmxkQW5jaG9yQiwgb3JpZW50ZWRBbmNob3JCLCBib2R5Qi5wb3NpdGlvbik7CiAgICAgIHZhciByZWxQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24gPSB2ZWMyJDMuZG90KHdvcmxkQW5jaG9yQiwgd29ybGRBeGlzQSkgLSB2ZWMyJDMuZG90KHdvcmxkQW5jaG9yQSwgd29ybGRBeGlzQSk7IC8vIE1vdG9yCgogICAgICBpZiAodGhpcy5tb3RvckVuYWJsZWQpIHsKICAgICAgICAvLyBHID0gWyBhICAgICBhIHggcmkgICAtYSAgIC1hIHggcmogXQogICAgICAgIHZhciBHID0gdGhpcy5tb3RvckVxdWF0aW9uLkc7CiAgICAgICAgR1swXSA9IHdvcmxkQXhpc0FbMF07CiAgICAgICAgR1sxXSA9IHdvcmxkQXhpc0FbMV07CiAgICAgICAgR1syXSA9IHZlYzIkMy5jcm9zc0xlbmd0aCh3b3JsZEF4aXNBLCBvcmllbnRlZEFuY2hvckIpOwogICAgICAgIEdbM10gPSAtd29ybGRBeGlzQVswXTsKICAgICAgICBHWzRdID0gLXdvcmxkQXhpc0FbMV07CiAgICAgICAgR1s1XSA9IC12ZWMyJDMuY3Jvc3NMZW5ndGgod29ybGRBeGlzQSwgb3JpZW50ZWRBbmNob3JBKTsKICAgICAgfQogICAgICAvKgogICAgICAgICAgTGltaXRzIHN0cmF0ZWd5OgogICAgICAgICAgQWRkIGNvbnRhY3QgZXF1YXRpb24sIHdpdGggbm9ybWFsIGFsb25nIHRoZSBjb25zdHJhaW50IGF4aXMuCiAgICAgICAgICBtaW4vbWF4Rm9yY2UgaXMgc2V0IHNvIHRoZSBjb25zdHJhaW50IGlzIHJlcHVsc2l2ZSBpbiB0aGUgY29ycmVjdCBkaXJlY3Rpb24uCiAgICAgICAgICBTb21lIG9mZnNldCBpcyBhZGRlZCB0byBlaXRoZXIgZXF1YXRpb24uY29udGFjdFBvaW50QSBvciAuY29udGFjdFBvaW50QiB0byBnZXQgdGhlIGNvcnJlY3QgdXBwZXIvbG93ZXIgbGltaXQuCiAgICAgICAgICAgICAgICAgICAgXgogICAgICAgICAgICAgICAgICAgfAogICAgICAgIHVwcGVyTGltaXQgeAogICAgICAgICAgICAgICAgICAgfCAgICAtLS0tLS0KICAgICAgICAgICBhbmNob3JCIHg8LS0tfCAgQiB8CiAgICAgICAgICAgICAgICAgICB8ICAgIHwgICAgfAogICAgICAgICAgLS0tLS0tICAgfCAgICAtLS0tLS0KICAgICAgICAgIHwgICAgfCAgIHwKICAgICAgICAgIHwgIEEgfC0tPnggYW5jaG9yQQogICAgICAgICAgLS0tLS0tICAgfAogICAgICAgICAgICAgICAgICAgeCBsb3dlckxpbWl0CiAgICAgICAgICAgICAgICAgICB8CiAgICAgICAgICAgICAgICAgIGF4aXMKICAgICAgICovCgoKICAgICAgaWYgKHRoaXMudXBwZXJMaW1pdEVuYWJsZWQgJiYgcmVsUG9zaXRpb24gPiB1cHBlckxpbWl0KSB7CiAgICAgICAgLy8gVXBkYXRlIGNvbnRhY3QgY29uc3RyYWludCBub3JtYWwsIGV0YwogICAgICAgIHZlYzIkMy5zY2FsZSh1cHBlckxpbWl0RXF1YXRpb24ubm9ybWFsQSwgd29ybGRBeGlzQSwgLTEpOwogICAgICAgIHZlYzIkMy5zdWJ0cmFjdCh1cHBlckxpbWl0RXF1YXRpb24uY29udGFjdFBvaW50QSwgd29ybGRBbmNob3JBLCBib2R5QS5wb3NpdGlvbik7CiAgICAgICAgdmVjMiQzLnN1YnRyYWN0KHVwcGVyTGltaXRFcXVhdGlvbi5jb250YWN0UG9pbnRCLCB3b3JsZEFuY2hvckIsIGJvZHlCLnBvc2l0aW9uKTsKICAgICAgICB2ZWMyJDMuc2NhbGUodG1wLCB3b3JsZEF4aXNBLCB1cHBlckxpbWl0KTsKICAgICAgICB2ZWMyJDMuYWRkKHVwcGVyTGltaXRFcXVhdGlvbi5jb250YWN0UG9pbnRBLCB1cHBlckxpbWl0RXF1YXRpb24uY29udGFjdFBvaW50QSwgdG1wKTsKCiAgICAgICAgaWYgKGVxcy5pbmRleE9mKHVwcGVyTGltaXRFcXVhdGlvbikgPT09IC0xKSB7CiAgICAgICAgICBlcXMucHVzaCh1cHBlckxpbWl0RXF1YXRpb24pOwogICAgICAgIH0KICAgICAgfSBlbHNlIHsKICAgICAgICB2YXIgaWR4ID0gZXFzLmluZGV4T2YodXBwZXJMaW1pdEVxdWF0aW9uKTsKCiAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHsKICAgICAgICAgIGVxcy5zcGxpY2UoaWR4LCAxKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLmxvd2VyTGltaXRFbmFibGVkICYmIHJlbFBvc2l0aW9uIDwgbG93ZXJMaW1pdCkgewogICAgICAgIC8vIFVwZGF0ZSBjb250YWN0IGNvbnN0cmFpbnQgbm9ybWFsLCBldGMKICAgICAgICB2ZWMyJDMuc2NhbGUobG93ZXJMaW1pdEVxdWF0aW9uLm5vcm1hbEEsIHdvcmxkQXhpc0EsIDEpOwogICAgICAgIHZlYzIkMy5zdWJ0cmFjdChsb3dlckxpbWl0RXF1YXRpb24uY29udGFjdFBvaW50QSwgd29ybGRBbmNob3JBLCBib2R5QS5wb3NpdGlvbik7CiAgICAgICAgdmVjMiQzLnN1YnRyYWN0KGxvd2VyTGltaXRFcXVhdGlvbi5jb250YWN0UG9pbnRCLCB3b3JsZEFuY2hvckIsIGJvZHlCLnBvc2l0aW9uKTsKICAgICAgICB2ZWMyJDMuc2NhbGUodG1wLCB3b3JsZEF4aXNBLCBsb3dlckxpbWl0KTsKICAgICAgICB2ZWMyJDMuc3VidHJhY3QobG93ZXJMaW1pdEVxdWF0aW9uLmNvbnRhY3RQb2ludEIsIGxvd2VyTGltaXRFcXVhdGlvbi5jb250YWN0UG9pbnRCLCB0bXApOwoKICAgICAgICBpZiAoZXFzLmluZGV4T2YobG93ZXJMaW1pdEVxdWF0aW9uKSA9PT0gLTEpIHsKICAgICAgICAgIGVxcy5wdXNoKGxvd2VyTGltaXRFcXVhdGlvbik7CiAgICAgICAgfQogICAgICB9IGVsc2UgewogICAgICAgIHZhciBpZHggPSBlcXMuaW5kZXhPZihsb3dlckxpbWl0RXF1YXRpb24pOwoKICAgICAgICBpZiAoaWR4ICE9PSAtMSkgewogICAgICAgICAgZXFzLnNwbGljZShpZHgsIDEpOwogICAgICAgIH0KICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogRW5hYmxlIHRoZSBtb3RvcgogICAgICogQG1ldGhvZCBlbmFibGVNb3RvcgogICAgICovCgoKICAgIFByaXNtYXRpY0NvbnN0cmFpbnQucHJvdG90eXBlLmVuYWJsZU1vdG9yID0gZnVuY3Rpb24gKCkgewogICAgICBpZiAodGhpcy5tb3RvckVuYWJsZWQpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHRoaXMuZXF1YXRpb25zLnB1c2godGhpcy5tb3RvckVxdWF0aW9uKTsKICAgICAgdGhpcy5tb3RvckVuYWJsZWQgPSB0cnVlOwogICAgfTsKICAgIC8qKgogICAgICogRGlzYWJsZSB0aGUgcm90YXRpb25hbCBtb3RvcgogICAgICogQG1ldGhvZCBkaXNhYmxlTW90b3IKICAgICAqLwoKCiAgICBQcmlzbWF0aWNDb25zdHJhaW50LnByb3RvdHlwZS5kaXNhYmxlTW90b3IgPSBmdW5jdGlvbiAoKSB7CiAgICAgIGlmICghdGhpcy5tb3RvckVuYWJsZWQpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIHZhciBpID0gdGhpcy5lcXVhdGlvbnMuaW5kZXhPZih0aGlzLm1vdG9yRXF1YXRpb24pOwogICAgICB0aGlzLmVxdWF0aW9ucy5zcGxpY2UoaSwgMSk7CiAgICAgIHRoaXMubW90b3JFbmFibGVkID0gZmFsc2U7CiAgICB9OwogICAgLyoqCiAgICAgKiBTZXQgdGhlIGNvbnN0cmFpbnQgbGltaXRzLgogICAgICogQG1ldGhvZCBzZXRMaW1pdHMKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb3dlciBMb3dlciBsaW1pdC4KICAgICAqIEBwYXJhbSB7bnVtYmVyfSB1cHBlciBVcHBlciBsaW1pdC4KICAgICAqLwoKCiAgICBQcmlzbWF0aWNDb25zdHJhaW50LnByb3RvdHlwZS5zZXRMaW1pdHMgPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyKSB7CiAgICAgIGlmICh0eXBlb2YgbG93ZXIgPT09ICdudW1iZXInKSB7CiAgICAgICAgdGhpcy5sb3dlckxpbWl0ID0gbG93ZXI7CiAgICAgICAgdGhpcy5sb3dlckxpbWl0RW5hYmxlZCA9IHRydWU7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5sb3dlckxpbWl0ID0gbG93ZXI7CiAgICAgICAgdGhpcy5sb3dlckxpbWl0RW5hYmxlZCA9IGZhbHNlOwogICAgICB9CgogICAgICBpZiAodHlwZW9mIHVwcGVyID09PSAnbnVtYmVyJykgewogICAgICAgIHRoaXMudXBwZXJMaW1pdCA9IHVwcGVyOwogICAgICAgIHRoaXMudXBwZXJMaW1pdEVuYWJsZWQgPSB0cnVlOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMudXBwZXJMaW1pdCA9IHVwcGVyOwogICAgICAgIHRoaXMudXBwZXJMaW1pdEVuYWJsZWQgPSBmYWxzZTsKICAgICAgfQogICAgfTsKCiAgICB2YXIgVXRpbHMkMSA9IFV0aWxzXzEsCiAgICAgICAgQnJvYWRwaGFzZSA9IEJyb2FkcGhhc2VfMTsKCiAgICB2YXIgU0FQQnJvYWRwaGFzZV8xID0gU0FQQnJvYWRwaGFzZSQxOwogICAgLyoqCiAgICAgKiBTd2VlcCBhbmQgcHJ1bmUgYnJvYWRwaGFzZSBhbG9uZyBvbmUgYXhpcy4KICAgICAqCiAgICAgKiBAY2xhc3MgU0FQQnJvYWRwaGFzZQogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAZXh0ZW5kcyBCcm9hZHBoYXNlCiAgICAgKi8KCiAgICBmdW5jdGlvbiBTQVBCcm9hZHBoYXNlJDEoKSB7CiAgICAgIEJyb2FkcGhhc2UuY2FsbCh0aGlzLCBCcm9hZHBoYXNlLlNBUCk7CiAgICAgIC8qKgogICAgICAgKiBMaXN0IG9mIGJvZGllcyBjdXJyZW50bHkgaW4gdGhlIGJyb2FkcGhhc2UuCiAgICAgICAqIEBwcm9wZXJ0eSBheGlzTGlzdAogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5heGlzTGlzdCA9IFtdOwogICAgICAvKioKICAgICAgICogVGhlIGF4aXMgdG8gc29ydCBhbG9uZy4gMCBtZWFucyB4LWF4aXMgYW5kIDEgeS1heGlzLiBJZiB5b3VyIGJvZGllcyBhcmUgbW9yZSBzcHJlYWQgb3V0IG92ZXIgdGhlIFggYXhpcywgc2V0IGF4aXNJbmRleCB0byAwLCBhbmQgeW91IHdpbGwgZ2FpbiBzb21lIHBlcmZvcm1hbmNlLgogICAgICAgKiBAcHJvcGVydHkgYXhpc0luZGV4CiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9CiAgICAgICAqLwoKICAgICAgdGhpcy5heGlzSW5kZXggPSAwOwogICAgICB2YXIgdGhhdCA9IHRoaXM7CgogICAgICB0aGlzLl9hZGRCb2R5SGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7CiAgICAgICAgdGhhdC5heGlzTGlzdC5wdXNoKGUuYm9keSk7CiAgICAgIH07CgogICAgICB0aGlzLl9yZW1vdmVCb2R5SGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7CiAgICAgICAgLy8gUmVtb3ZlIGZyb20gbGlzdAogICAgICAgIHZhciBpZHggPSB0aGF0LmF4aXNMaXN0LmluZGV4T2YoZS5ib2R5KTsKCiAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHsKICAgICAgICAgIHRoYXQuYXhpc0xpc3Quc3BsaWNlKGlkeCwgMSk7CiAgICAgICAgfQogICAgICB9OwogICAgfQoKICAgIFNBUEJyb2FkcGhhc2UkMS5wcm90b3R5cGUgPSBuZXcgQnJvYWRwaGFzZSgpOwogICAgU0FQQnJvYWRwaGFzZSQxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNBUEJyb2FkcGhhc2UkMTsKICAgIC8qKgogICAgICogQ2hhbmdlIHRoZSB3b3JsZAogICAgICogQG1ldGhvZCBzZXRXb3JsZAogICAgICogQHBhcmFtIHtXb3JsZH0gd29ybGQKICAgICAqLwoKICAgIFNBUEJyb2FkcGhhc2UkMS5wcm90b3R5cGUuc2V0V29ybGQgPSBmdW5jdGlvbiAod29ybGQpIHsKICAgICAgLy8gQ2xlYXIgdGhlIG9sZCBheGlzIGFycmF5CiAgICAgIHRoaXMuYXhpc0xpc3QubGVuZ3RoID0gMDsgLy8gQWRkIGFsbCBib2RpZXMgZnJvbSB0aGUgbmV3IHdvcmxkCgogICAgICBVdGlscyQxLmFwcGVuZEFycmF5KHRoaXMuYXhpc0xpc3QsIHdvcmxkLmJvZGllcyk7IC8vIFJlbW92ZSBvbGQgaGFuZGxlcnMsIGlmIGFueQoKICAgICAgd29ybGQub2ZmKCJhZGRCb2R5IiwgdGhpcy5fYWRkQm9keUhhbmRsZXIpLm9mZigicmVtb3ZlQm9keSIsIHRoaXMuX3JlbW92ZUJvZHlIYW5kbGVyKTsgLy8gQWRkIGhhbmRsZXJzIHRvIHVwZGF0ZSB0aGUgbGlzdCBvZiBib2RpZXMuCgogICAgICB3b3JsZC5vbigiYWRkQm9keSIsIHRoaXMuX2FkZEJvZHlIYW5kbGVyKS5vbigicmVtb3ZlQm9keSIsIHRoaXMuX3JlbW92ZUJvZHlIYW5kbGVyKTsKICAgICAgdGhpcy53b3JsZCA9IHdvcmxkOwogICAgfTsKCiAgICBmdW5jdGlvbiBzb3J0QXhpc0xpc3QoYSwgYXhpc0luZGV4KSB7CiAgICAgIGF4aXNJbmRleCA9IGF4aXNJbmRleCB8IDA7CgogICAgICBmb3IgKHZhciBpID0gMSwgbCA9IGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7CiAgICAgICAgdmFyIHYgPSBhW2ldOwoKICAgICAgICBmb3IgKHZhciBqID0gaSAtIDE7IGogPj0gMDsgai0tKSB7CiAgICAgICAgICBpZiAoYVtqXS5hYWJiLmxvd2VyQm91bmRbYXhpc0luZGV4XSA8PSB2LmFhYmIubG93ZXJCb3VuZFtheGlzSW5kZXhdKSB7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfQoKICAgICAgICAgIGFbaiArIDFdID0gYVtqXTsKICAgICAgICB9CgogICAgICAgIGFbaiArIDFdID0gdjsKICAgICAgfQoKICAgICAgcmV0dXJuIGE7CiAgICB9CgogICAgU0FQQnJvYWRwaGFzZSQxLnByb3RvdHlwZS5zb3J0TGlzdCA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGJvZGllcyA9IHRoaXMuYXhpc0xpc3QsCiAgICAgICAgICBheGlzSW5kZXggPSB0aGlzLmF4aXNJbmRleDsgLy8gU29ydCB0aGUgbGlzdHMKCiAgICAgIHNvcnRBeGlzTGlzdChib2RpZXMsIGF4aXNJbmRleCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIGNvbGxpZGluZyBwYWlycwogICAgICogQG1ldGhvZCBnZXRDb2xsaXNpb25QYWlycwogICAgICogQHBhcmFtICB7V29ybGR9IHdvcmxkCiAgICAgKiBAcmV0dXJuIHtBcnJheX0KICAgICAqLwoKCiAgICBTQVBCcm9hZHBoYXNlJDEucHJvdG90eXBlLmdldENvbGxpc2lvblBhaXJzID0gZnVuY3Rpb24KICAgICAgLyp3b3JsZCovCiAgICAoKSB7CiAgICAgIHZhciBib2RpZXMgPSB0aGlzLmF4aXNMaXN0LAogICAgICAgICAgcmVzdWx0ID0gdGhpcy5yZXN1bHQsCiAgICAgICAgICBheGlzSW5kZXggPSB0aGlzLmF4aXNJbmRleDsKICAgICAgcmVzdWx0Lmxlbmd0aCA9IDA7IC8vIFVwZGF0ZSBhbGwgQUFCQnMgaWYgbmVlZGVkCgogICAgICB2YXIgbCA9IGJvZGllcy5sZW5ndGg7CgogICAgICB3aGlsZSAobC0tKSB7CiAgICAgICAgdmFyIGIgPSBib2RpZXNbbF07CgogICAgICAgIGlmIChiLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgICAgYi51cGRhdGVBQUJCKCk7CiAgICAgICAgfQogICAgICB9IC8vIFNvcnQgdGhlIGxpc3RzCgoKICAgICAgdGhpcy5zb3J0TGlzdCgpOyAvLyBMb29rIHRocm91Z2ggdGhlIFggbGlzdAoKICAgICAgZm9yICh2YXIgaSA9IDAsIE4gPSBib2RpZXMubGVuZ3RoIHwgMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgdmFyIGJpID0gYm9kaWVzW2ldOwoKICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPCBOOyBqKyspIHsKICAgICAgICAgIHZhciBiaiA9IGJvZGllc1tqXTsgLy8gQm91bmRzIG92ZXJsYXA/CgogICAgICAgICAgdmFyIG92ZXJsYXBzID0gYmouYWFiYi5sb3dlckJvdW5kW2F4aXNJbmRleF0gPD0gYmkuYWFiYi51cHBlckJvdW5kW2F4aXNJbmRleF07CgogICAgICAgICAgaWYgKCFvdmVybGFwcykgewogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoQnJvYWRwaGFzZS5jYW5Db2xsaWRlKGJpLCBiaikgJiYgdGhpcy5ib3VuZGluZ1ZvbHVtZUNoZWNrKGJpLCBiaikpIHsKICAgICAgICAgICAgcmVzdWx0LnB1c2goYmksIGJqKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBSZXR1cm5zIGFsbCB0aGUgYm9kaWVzIHdpdGhpbiBhbiBBQUJCLgogICAgICogQG1ldGhvZCBhYWJiUXVlcnkKICAgICAqIEBwYXJhbSAge1dvcmxkfSB3b3JsZAogICAgICogQHBhcmFtICB7QUFCQn0gYWFiYgogICAgICogQHBhcmFtIHthcnJheX0gcmVzdWx0IEFuIGFycmF5IHRvIHN0b3JlIHJlc3VsdGluZyBib2RpZXMgaW4uCiAgICAgKiBAcmV0dXJuIHthcnJheX0KICAgICAqIEB0b2RvIHNpbmNlIHRoZSBsaXN0IGlzIHNvcnRlZCwgb3B0aW1pemF0aW9uIGNhbiBiZSBkb25lCiAgICAgKi8KCgogICAgU0FQQnJvYWRwaGFzZSQxLnByb3RvdHlwZS5hYWJiUXVlcnkgPSBmdW5jdGlvbiAod29ybGQsIGFhYmIsIHJlc3VsdCkgewogICAgICByZXN1bHQgPSByZXN1bHQgfHwgW107CiAgICAgIHRoaXMuc29ydExpc3QoKTsKICAgICAgdmFyIGF4aXNMaXN0ID0gdGhpcy5heGlzTGlzdDsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXhpc0xpc3QubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgYiA9IGF4aXNMaXN0W2ldOwoKICAgICAgICBpZiAoYi5hYWJiTmVlZHNVcGRhdGUpIHsKICAgICAgICAgIGIudXBkYXRlQUFCQigpOwogICAgICAgIH0KCiAgICAgICAgaWYgKGIuYWFiYi5vdmVybGFwcyhhYWJiKSkgewogICAgICAgICAgcmVzdWx0LnB1c2goYik7CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gcmVzdWx0OwogICAgfTsKCiAgICB2YXIgU3ByaW5nXzEgPSBTcHJpbmckMjsKICAgIC8qKgogICAgICogQmFzZSBjbGFzcyBmb3Ige3sjY3Jvc3NMaW5rICJMaW5lYXJTcHJpbmcifX17ey9jcm9zc0xpbmt9fSBhbmQge3sjY3Jvc3NMaW5rICJSb3RhdGlvbmFsU3ByaW5nIn19e3svY3Jvc3NMaW5rfX0uIE5vdCBzdXBwb3NlZCB0byBiZSB1c2VkIGRpcmVjdGx5LgogICAgICoKICAgICAqIEBjbGFzcyBTcHJpbmcKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXQogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnN0aWZmbmVzcz0xMDBdICBTcHJpbmcgY29uc3RhbnQgKHNlZSBIb29rZXMgTGF3KS4gQSBudW1iZXIgPj0gMC4KICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5kYW1waW5nPTFdICAgICAgQSBudW1iZXIgPj0gMC4gRGVmYXVsdDogMQogICAgICogQHBhcmFtIHtBcnJheX0gIFtvcHRpb25zLmxvY2FsQW5jaG9yQV0gICBXaGVyZSB0byBob29rIHRoZSBzcHJpbmcgdG8gYm9keSBBLCBpbiBsb2NhbCBib2R5IGNvb3JkaW5hdGVzLiBEZWZhdWx0cyB0byB0aGUgYm9keSBjZW50ZXIuCiAgICAgKiBAcGFyYW0ge0FycmF5fSAgW29wdGlvbnMubG9jYWxBbmNob3JCXQogICAgICogQHBhcmFtIHtBcnJheX0gIFtvcHRpb25zLndvcmxkQW5jaG9yQV0gICBXaGVyZSB0byBob29rIHRoZSBzcHJpbmcgdG8gYm9keSBBLCBpbiB3b3JsZCBjb29yZGluYXRlcy4gT3ZlcnJpZGVzIHRoZSBvcHRpb24gImxvY2FsQW5jaG9yQSIgaWYgZ2l2ZW4uCiAgICAgKiBAcGFyYW0ge0FycmF5fSAgW29wdGlvbnMud29ybGRBbmNob3JCXQogICAgICovCgogICAgZnVuY3Rpb24gU3ByaW5nJDIoYm9keUEsIGJvZHlCLCBvcHRpb25zKSB7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICAvKioKICAgICAgICogU3RpZmZuZXNzIG9mIHRoZSBzcHJpbmcuCiAgICAgICAqIEBwcm9wZXJ0eSBzdGlmZm5lc3MKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLnN0aWZmbmVzcyA9IG9wdGlvbnMuc3RpZmZuZXNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnN0aWZmbmVzcyA6IDEwMDsKICAgICAgLyoqCiAgICAgICAqIERhbXBpbmcgb2YgdGhlIHNwcmluZy4KICAgICAgICogQHByb3BlcnR5IGRhbXBpbmcKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLmRhbXBpbmcgPSBvcHRpb25zLmRhbXBpbmcgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuZGFtcGluZyA6IDE7CiAgICAgIC8qKgogICAgICAgKiBGaXJzdCBjb25uZWN0ZWQgYm9keS4KICAgICAgICogQHByb3BlcnR5IGJvZHlBCiAgICAgICAqIEB0eXBlIHtCb2R5fQogICAgICAgKi8KCiAgICAgIHRoaXMuYm9keUEgPSBib2R5QTsKICAgICAgLyoqCiAgICAgICAqIFNlY29uZCBjb25uZWN0ZWQgYm9keS4KICAgICAgICogQHByb3BlcnR5IGJvZHlCCiAgICAgICAqIEB0eXBlIHtCb2R5fQogICAgICAgKi8KCiAgICAgIHRoaXMuYm9keUIgPSBib2R5QjsKICAgIH0KICAgIC8qKgogICAgICogQXBwbHkgdGhlIHNwcmluZyBmb3JjZSB0byB0aGUgY29ubmVjdGVkIGJvZGllcy4gQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIFdvcmxkLgogICAgICogQHByaXZhdGUKICAgICAqIEBtZXRob2QgYXBwbHlGb3JjZQogICAgICovCgoKICAgIFNwcmluZyQyLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gKCkgey8vIFRvIGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzZXMKICAgIH07CgogICAgdmFyIHZlYzIkMiA9IHZlYzIkcS5leHBvcnRzOwoKICAgIHZhciBDb25zdHJhaW50ID0gQ29uc3RyYWludF8xOwoKICAgIHZhciBGcmljdGlvbkVxdWF0aW9uID0gRnJpY3Rpb25FcXVhdGlvbl8xOwoKICAgIHZhciBCb2R5JDEgPSBCb2R5XzE7CgogICAgdmFyIFRvcERvd25WZWhpY2xlXzEgPSBUb3BEb3duVmVoaWNsZTsKICAgIC8qKgogICAgICogQGNsYXNzIFRvcERvd25WZWhpY2xlCiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqCiAgICAgKiBAZGVwcmVjYXRlZCBUaGlzIGNsYXNzIHdpbGwgYmUgbW92ZWQgb3V0IG9mIHRoZSBjb3JlIGxpYnJhcnkgaW4gZnV0dXJlIHZlcnNpb25zLgogICAgICoKICAgICAqIEBwYXJhbSB7Qm9keX0gY2hhc3Npc0JvZHkgQSBkeW5hbWljIGJvZHksIGFscmVhZHkgYWRkZWQgdG8gdGhlIHdvcmxkLgogICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXQogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKgogICAgICogICAgIC8vIENyZWF0ZSBhIGR5bmFtaWMgYm9keSBmb3IgdGhlIGNoYXNzaXMKICAgICAqICAgICB2YXIgY2hhc3Npc0JvZHkgPSBuZXcgQm9keSh7CiAgICAgKiAgICAgICAgIG1hc3M6IDEKICAgICAqICAgICB9KTsKICAgICAqICAgICB2YXIgYm94U2hhcGUgPSBuZXcgQm94KHsgd2lkdGg6IDAuNSwgaGVpZ2h0OiAxIH0pOwogICAgICogICAgIGNoYXNzaXNCb2R5LmFkZFNoYXBlKGJveFNoYXBlKTsKICAgICAqICAgICB3b3JsZC5hZGRCb2R5KGNoYXNzaXNCb2R5KTsKICAgICAqCiAgICAgKiAgICAgLy8gQ3JlYXRlIHRoZSB2ZWhpY2xlCiAgICAgKiAgICAgdmFyIHZlaGljbGUgPSBuZXcgVG9wRG93blZlaGljbGUoY2hhc3Npc0JvZHkpOwogICAgICoKICAgICAqICAgICAvLyBBZGQgb25lIGZyb250IHdoZWVsIGFuZCBvbmUgYmFjayB3aGVlbCAtIHdlIGRvbid0IGFjdHVhbGx5IG5lZWQgZm91ciA6KQogICAgICogICAgIHZhciBmcm9udFdoZWVsID0gdmVoaWNsZS5hZGRXaGVlbCh7CiAgICAgKiAgICAgICAgIGxvY2FsUG9zaXRpb246IFswLCAwLjVdIC8vIGZyb250CiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgZnJvbnRXaGVlbC5zZXRTaWRlRnJpY3Rpb24oNCk7CiAgICAgKgogICAgICogICAgIC8vIEJhY2sgd2hlZWwKICAgICAqICAgICB2YXIgYmFja1doZWVsID0gdmVoaWNsZS5hZGRXaGVlbCh7CiAgICAgKiAgICAgICAgIGxvY2FsUG9zaXRpb246IFswLCAtMC41XSAvLyBiYWNrCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgYmFja1doZWVsLnNldFNpZGVGcmljdGlvbigzKTsgLy8gTGVzcyBzaWRlIGZyaWN0aW9uIG9uIGJhY2sgd2hlZWwgbWFrZXMgaXQgZWFzaWVyIHRvIGRyaWZ0CiAgICAgKiAgICAgdmVoaWNsZS5hZGRUb1dvcmxkKHdvcmxkKTsKICAgICAqCiAgICAgKiAgICAgLy8gU3RlZXIgdmFsdWUgemVybyBtZWFucyBzdHJhaWdodCBmb3J3YXJkLiBQb3NpdGl2ZSBpcyBsZWZ0IGFuZCBuZWdhdGl2ZSByaWdodC4KICAgICAqICAgICBmcm9udFdoZWVsLnN0ZWVyVmFsdWUgPSBNYXRoLlBJIC8gMTY7CiAgICAgKgogICAgICogICAgIC8vIEVuZ2luZSBmb3JjZSBmb3J3YXJkCiAgICAgKiAgICAgYmFja1doZWVsLmVuZ2luZUZvcmNlID0gMTA7CiAgICAgKiAgICAgYmFja1doZWVsLnNldEJyYWtlRm9yY2UoMCk7CiAgICAgKi8KCiAgICBmdW5jdGlvbiBUb3BEb3duVmVoaWNsZShjaGFzc2lzQm9keSwgb3B0aW9ucykgewogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtCb2R5fSBjaGFzc2lzQm9keQogICAgICAgKi8KCiAgICAgIHRoaXMuY2hhc3Npc0JvZHkgPSBjaGFzc2lzQm9keTsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdoZWVscwogICAgICAgKi8KCiAgICAgIHRoaXMud2hlZWxzID0gW107IC8vIEEgZHVtbXkgYm9keSB0byBjb25zdHJhaW4gdGhlIGNoYXNzaXMgdG8KCiAgICAgIHRoaXMuZ3JvdW5kQm9keSA9IG5ldyBCb2R5JDEoewogICAgICAgIG1hc3M6IDAKICAgICAgfSk7CiAgICAgIHRoaXMud29ybGQgPSBudWxsOwogICAgICB2YXIgdGhhdCA9IHRoaXM7CgogICAgICB0aGlzLnByZVN0ZXBDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsKICAgICAgICB0aGF0LnVwZGF0ZSgpOwogICAgICB9OwogICAgfQogICAgLyoqCiAgICAgKiBAbWV0aG9kIGFkZFRvV29ybGQKICAgICAqIEBwYXJhbSB7V29ybGR9IHdvcmxkCiAgICAgKi8KCgogICAgVG9wRG93blZlaGljbGUucHJvdG90eXBlLmFkZFRvV29ybGQgPSBmdW5jdGlvbiAod29ybGQpIHsKICAgICAgdGhpcy53b3JsZCA9IHdvcmxkOwogICAgICB3b3JsZC5hZGRCb2R5KHRoaXMuZ3JvdW5kQm9keSk7CiAgICAgIHdvcmxkLm9uKCdwcmVTdGVwJywgdGhpcy5wcmVTdGVwQ2FsbGJhY2spOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndoZWVscy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciB3aGVlbCA9IHRoaXMud2hlZWxzW2ldOwogICAgICAgIHdvcmxkLmFkZENvbnN0cmFpbnQod2hlZWwpOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIHJlbW92ZUZyb21Xb3JsZAogICAgICogQHBhcmFtIHtXb3JsZH0gd29ybGQKICAgICAqLwoKCiAgICBUb3BEb3duVmVoaWNsZS5wcm90b3R5cGUucmVtb3ZlRnJvbVdvcmxkID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgd29ybGQgPSB0aGlzLndvcmxkOwogICAgICB3b3JsZC5yZW1vdmVCb2R5KHRoaXMuZ3JvdW5kQm9keSk7CiAgICAgIHdvcmxkLm9mZigncHJlU3RlcCcsIHRoaXMucHJlU3RlcENhbGxiYWNrKTsKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53aGVlbHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgd2hlZWwgPSB0aGlzLndoZWVsc1tpXTsKICAgICAgICB3b3JsZC5yZW1vdmVDb25zdHJhaW50KHdoZWVsKTsKICAgICAgfQoKICAgICAgdGhpcy53b3JsZCA9IG51bGw7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGFkZFdoZWVsCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3doZWVsT3B0aW9uc10KICAgICAqIEByZXR1cm4ge1doZWVsQ29uc3RyYWludH0KICAgICAqLwoKCiAgICBUb3BEb3duVmVoaWNsZS5wcm90b3R5cGUuYWRkV2hlZWwgPSBmdW5jdGlvbiAod2hlZWxPcHRpb25zKSB7CiAgICAgIHZhciB3aGVlbCA9IG5ldyBXaGVlbENvbnN0cmFpbnQodGhpcywgd2hlZWxPcHRpb25zKTsKICAgICAgdGhpcy53aGVlbHMucHVzaCh3aGVlbCk7CiAgICAgIHJldHVybiB3aGVlbDsKICAgIH07CiAgICAvKioKICAgICAqIEBtZXRob2QgdXBkYXRlCiAgICAgKi8KCgogICAgVG9wRG93blZlaGljbGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndoZWVscy5sZW5ndGg7IGkrKykgewogICAgICAgIHRoaXMud2hlZWxzW2ldLnVwZGF0ZSgpOwogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBAY2xhc3MgV2hlZWxDb25zdHJhaW50CiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqIEBleHRlbmRzIHtDb25zdHJhaW50fQogICAgICogQHBhcmFtIHtWZWhpY2xlfSB2ZWhpY2xlCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5sb2NhbEZvcndhcmRWZWN0b3JdVGhlIGxvY2FsIHdoZWVsIGZvcndhcmQgdmVjdG9yIGluIGxvY2FsIGJvZHkgc3BhY2UuIERlZmF1bHQgaXMgemVyby4KICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLmxvY2FsUG9zaXRpb25dIFRoZSBsb2NhbCBwb3NpdGlvbiBvZiB0aGUgd2hlZW4gaW4gdGhlIGNoYXNzaXMgYm9keS4gRGVmYXVsdCBpcyB6ZXJvIC0gdGhlIGNlbnRlciBvZiB0aGUgYm9keS4KICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLnNpZGVGcmljdGlvbj01XSBUaGUgbWF4IGZyaWN0aW9uIGZvcmNlIGluIHRoZSBzaWRld2F5cyBkaXJlY3Rpb24uCiAgICAgKi8KCgogICAgZnVuY3Rpb24gV2hlZWxDb25zdHJhaW50KHZlaGljbGUsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIHRoaXMudmVoaWNsZSA9IHZlaGljbGU7CiAgICAgIHRoaXMuZm9yd2FyZEVxdWF0aW9uID0gbmV3IEZyaWN0aW9uRXF1YXRpb24odmVoaWNsZS5jaGFzc2lzQm9keSwgdmVoaWNsZS5ncm91bmRCb2R5KTsKICAgICAgdGhpcy5zaWRlRXF1YXRpb24gPSBuZXcgRnJpY3Rpb25FcXVhdGlvbih2ZWhpY2xlLmNoYXNzaXNCb2R5LCB2ZWhpY2xlLmdyb3VuZEJvZHkpOwogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHN0ZWVyVmFsdWUKICAgICAgICovCgogICAgICB0aGlzLnN0ZWVyVmFsdWUgPSAwOwogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGVuZ2luZUZvcmNlCiAgICAgICAqLwoKICAgICAgdGhpcy5lbmdpbmVGb3JjZSA9IDA7CiAgICAgIHRoaXMuc2V0U2lkZUZyaWN0aW9uKG9wdGlvbnMuc2lkZUZyaWN0aW9uICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnNpZGVGcmljdGlvbiA6IDUpOwogICAgICAvKioKICAgICAgICogQHByb3BlcnR5IHtBcnJheX0gbG9jYWxGb3J3YXJkVmVjdG9yCiAgICAgICAqLwoKICAgICAgdGhpcy5sb2NhbEZvcndhcmRWZWN0b3IgPSB2ZWMyJDIuZnJvbVZhbHVlcygwLCAxKTsKCiAgICAgIGlmIChvcHRpb25zLmxvY2FsRm9yd2FyZFZlY3RvcikgewogICAgICAgIHZlYzIkMi5jb3B5KHRoaXMubG9jYWxGb3J3YXJkVmVjdG9yLCBvcHRpb25zLmxvY2FsRm9yd2FyZFZlY3Rvcik7CiAgICAgIH0KICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IGxvY2FsUG9zaXRpb24KICAgICAgICovCgoKICAgICAgdGhpcy5sb2NhbFBvc2l0aW9uID0gdmVjMiQyLmNyZWF0ZSgpOwoKICAgICAgaWYgKG9wdGlvbnMubG9jYWxQb3NpdGlvbikgewogICAgICAgIHZlYzIkMi5jb3B5KHRoaXMubG9jYWxQb3NpdGlvbiwgb3B0aW9ucy5sb2NhbFBvc2l0aW9uKTsKICAgICAgfQoKICAgICAgQ29uc3RyYWludC5jYWxsKHRoaXMsIHZlaGljbGUuY2hhc3Npc0JvZHksIHZlaGljbGUuZ3JvdW5kQm9keSk7CiAgICAgIHRoaXMuZXF1YXRpb25zLnB1c2godGhpcy5mb3J3YXJkRXF1YXRpb24sIHRoaXMuc2lkZUVxdWF0aW9uKTsKICAgICAgdGhpcy5zZXRCcmFrZUZvcmNlKDApOwogICAgfQoKICAgIFdoZWVsQ29uc3RyYWludC5wcm90b3R5cGUgPSBuZXcgQ29uc3RyYWludCgpOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIHNldEJyYWtlRm9yY2UKICAgICAqLwoKICAgIFdoZWVsQ29uc3RyYWludC5wcm90b3R5cGUuc2V0QnJha2VGb3JjZSA9IGZ1bmN0aW9uIChmb3JjZSkgewogICAgICB0aGlzLmZvcndhcmRFcXVhdGlvbi5zZXRTbGlwRm9yY2UoZm9yY2UpOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBzZXRTaWRlRnJpY3Rpb24KICAgICAqLwoKCiAgICBXaGVlbENvbnN0cmFpbnQucHJvdG90eXBlLnNldFNpZGVGcmljdGlvbiA9IGZ1bmN0aW9uIChmb3JjZSkgewogICAgICB0aGlzLnNpZGVFcXVhdGlvbi5zZXRTbGlwRm9yY2UoZm9yY2UpOwogICAgfTsKCiAgICB2YXIgd29ybGRWZWxvY2l0eSA9IHZlYzIkMi5jcmVhdGUoKTsKICAgIHZhciByZWxhdGl2ZVBvaW50ID0gdmVjMiQyLmNyZWF0ZSgpOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGdldFNwZWVkCiAgICAgKi8KCiAgICBXaGVlbENvbnN0cmFpbnQucHJvdG90eXBlLmdldFNwZWVkID0gZnVuY3Rpb24gKCkgewogICAgICB2YXIgYm9keSA9IHRoaXMudmVoaWNsZS5jaGFzc2lzQm9keTsKICAgICAgYm9keS52ZWN0b3JUb1dvcmxkRnJhbWUocmVsYXRpdmVQb2ludCwgdGhpcy5sb2NhbEZvcndhcmRWZWN0b3IpOwogICAgICBib2R5LmdldFZlbG9jaXR5QXRQb2ludCh3b3JsZFZlbG9jaXR5LCByZWxhdGl2ZVBvaW50KTsKICAgICAgcmV0dXJuIHZlYzIkMi5kb3Qod29ybGRWZWxvY2l0eSwgcmVsYXRpdmVQb2ludCk7CiAgICB9OwoKICAgIHZhciB0bXBWZWMgPSB2ZWMyJDIuY3JlYXRlKCk7CiAgICAvKioKICAgICAqIEBtZXRob2QgdXBkYXRlCiAgICAgKi8KCiAgICBXaGVlbENvbnN0cmFpbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGJvZHkgPSB0aGlzLnZlaGljbGUuY2hhc3Npc0JvZHk7CiAgICAgIHZhciBmb3J3YXJkRXF1YXRpb24gPSB0aGlzLmZvcndhcmRFcXVhdGlvbjsKICAgICAgdmFyIHNpZGVFcXVhdGlvbiA9IHRoaXMuc2lkZUVxdWF0aW9uOwogICAgICB2YXIgc3RlZXJWYWx1ZSA9IHRoaXMuc3RlZXJWYWx1ZTsgLy8gRGlyZWN0aW9uYWwKCiAgICAgIGJvZHkudmVjdG9yVG9Xb3JsZEZyYW1lKGZvcndhcmRFcXVhdGlvbi50LCB0aGlzLmxvY2FsRm9yd2FyZFZlY3Rvcik7CiAgICAgIHZlYzIkMi5yb3RhdGUoc2lkZUVxdWF0aW9uLnQsIHRoaXMubG9jYWxGb3J3YXJkVmVjdG9yLCBNYXRoLlBJIC8gMik7CiAgICAgIGJvZHkudmVjdG9yVG9Xb3JsZEZyYW1lKHNpZGVFcXVhdGlvbi50LCBzaWRlRXF1YXRpb24udCk7CiAgICAgIHZlYzIkMi5yb3RhdGUoZm9yd2FyZEVxdWF0aW9uLnQsIGZvcndhcmRFcXVhdGlvbi50LCBzdGVlclZhbHVlKTsKICAgICAgdmVjMiQyLnJvdGF0ZShzaWRlRXF1YXRpb24udCwgc2lkZUVxdWF0aW9uLnQsIHN0ZWVyVmFsdWUpOyAvLyBBdHRhY2htZW50IHBvaW50CgogICAgICBib2R5LnRvV29ybGRGcmFtZShmb3J3YXJkRXF1YXRpb24uY29udGFjdFBvaW50QiwgdGhpcy5sb2NhbFBvc2l0aW9uKTsKICAgICAgdmVjMiQyLmNvcHkoc2lkZUVxdWF0aW9uLmNvbnRhY3RQb2ludEIsIGZvcndhcmRFcXVhdGlvbi5jb250YWN0UG9pbnRCKTsKICAgICAgYm9keS52ZWN0b3JUb1dvcmxkRnJhbWUoZm9yd2FyZEVxdWF0aW9uLmNvbnRhY3RQb2ludEEsIHRoaXMubG9jYWxQb3NpdGlvbik7CiAgICAgIHZlYzIkMi5jb3B5KHNpZGVFcXVhdGlvbi5jb250YWN0UG9pbnRBLCBmb3J3YXJkRXF1YXRpb24uY29udGFjdFBvaW50QSk7IC8vIEFkZCBlbmdpbmUgZm9yY2UKCiAgICAgIHZlYzIkMi5ub3JtYWxpemUodG1wVmVjLCBmb3J3YXJkRXF1YXRpb24udCk7CiAgICAgIHZlYzIkMi5zY2FsZSh0bXBWZWMsIHRtcFZlYywgdGhpcy5lbmdpbmVGb3JjZSk7CiAgICAgIHRoaXMudmVoaWNsZS5jaGFzc2lzQm9keS5hcHBseUZvcmNlKHRtcFZlYywgZm9yd2FyZEVxdWF0aW9uLmNvbnRhY3RQb2ludEEpOwogICAgfTsKCiAgICB2YXIgdmVjMiQxID0gdmVjMiRxLmV4cG9ydHM7CgogICAgdmFyIFNwcmluZyQxID0gU3ByaW5nXzE7CgogICAgdmFyIExpbmVhclNwcmluZ18xID0gTGluZWFyU3ByaW5nOwogICAgLyoqCiAgICAgKiBBIHNwcmluZywgY29ubmVjdGluZyB0d28gYm9kaWVzLgogICAgICoKICAgICAqIFRoZSBTcHJpbmcgZXhwbGljaXRseSBhZGRzIGZvcmNlIGFuZCBhbmd1bGFyRm9yY2UgdG8gdGhlIGJvZGllcy4KICAgICAqCiAgICAgKiBAY2xhc3MgTGluZWFyU3ByaW5nCiAgICAgKiBAZXh0ZW5kcyBTcHJpbmcKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QgogICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXQogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnJlc3RMZW5ndGhdICAgQSBudW1iZXIgPiAwLiBEZWZhdWx0IGlzIHRoZSBjdXJyZW50IGRpc3RhbmNlIGJldHdlZW4gdGhlIHdvcmxkIGFuY2hvciBwb2ludHMuCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc3RpZmZuZXNzPTEwMF0gIFNwcmluZyBjb25zdGFudCAoc2VlIEhvb2tlcyBMYXcpLiBBIG51bWJlciA+PSAwLgogICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmRhbXBpbmc9MV0gICAgICBBIG51bWJlciA+PSAwLiBEZWZhdWx0OiAxCiAgICAgKiBAcGFyYW0ge0FycmF5fSAgW29wdGlvbnMud29ybGRBbmNob3JBXSAgIFdoZXJlIHRvIGhvb2sgdGhlIHNwcmluZyB0byBib2R5IEEsIGluIHdvcmxkIGNvb3JkaW5hdGVzLiBPdmVycmlkZXMgdGhlIG9wdGlvbiAibG9jYWxBbmNob3JBIiBpZiBnaXZlbi4KICAgICAqIEBwYXJhbSB7QXJyYXl9ICBbb3B0aW9ucy53b3JsZEFuY2hvckJdCiAgICAgKiBAcGFyYW0ge0FycmF5fSAgW29wdGlvbnMubG9jYWxBbmNob3JBXSAgIFdoZXJlIHRvIGhvb2sgdGhlIHNwcmluZyB0byBib2R5IEEsIGluIGxvY2FsIGJvZHkgY29vcmRpbmF0ZXMuIERlZmF1bHRzIHRvIHRoZSBib2R5IGNlbnRlci4KICAgICAqIEBwYXJhbSB7QXJyYXl9ICBbb3B0aW9ucy5sb2NhbEFuY2hvckJdCiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgc3ByaW5nID0gbmV3IExpbmVhclNwcmluZyhib2R5QSwgYm9keUIsIHsKICAgICAqICAgICAgICAgc3RpZmZuZXNzOiAxMDAsCiAgICAgKiAgICAgICAgIGRhbXBpbmc6IDEsCiAgICAgKiAgICAgICAgIGxvY2FsQW5jaG9yQTogWzAsMF0sIC8vIGNlbnRlciBvZiBib2R5QQogICAgICogICAgICAgICBsb2NhbEFuY2hvckI6IFswLDBdIC8vIGNlbnRlciBvZiBib2R5QgogICAgICogICAgIH0pOwogICAgICogICAgIHdvcmxkLmFkZFNwcmluZyhzcHJpbmcpOwogICAgICovCgogICAgZnVuY3Rpb24gTGluZWFyU3ByaW5nKGJvZHlBLCBib2R5Qiwgb3B0aW9ucykgewogICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsKICAgICAgU3ByaW5nJDEuY2FsbCh0aGlzLCBib2R5QSwgYm9keUIsIG9wdGlvbnMpOwogICAgICAvKioKICAgICAgICogQW5jaG9yIGZvciBib2R5QSBpbiBsb2NhbCBib2R5QSBjb29yZGluYXRlcy4KICAgICAgICogQHByb3BlcnR5IGxvY2FsQW5jaG9yQQogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5sb2NhbEFuY2hvckEgPSB2ZWMyJDEuY3JlYXRlKCk7CiAgICAgIC8qKgogICAgICAgKiBBbmNob3IgZm9yIGJvZHlCIGluIGxvY2FsIGJvZHlCIGNvb3JkaW5hdGVzLgogICAgICAgKiBAcHJvcGVydHkgbG9jYWxBbmNob3JCCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLmxvY2FsQW5jaG9yQiA9IHZlYzIkMS5jcmVhdGUoKTsKCiAgICAgIGlmIChvcHRpb25zLmxvY2FsQW5jaG9yQSkgewogICAgICAgIHZlYzIkMS5jb3B5KHRoaXMubG9jYWxBbmNob3JBLCBvcHRpb25zLmxvY2FsQW5jaG9yQSk7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLmxvY2FsQW5jaG9yQikgewogICAgICAgIHZlYzIkMS5jb3B5KHRoaXMubG9jYWxBbmNob3JCLCBvcHRpb25zLmxvY2FsQW5jaG9yQik7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLndvcmxkQW5jaG9yQSkgewogICAgICAgIHRoaXMuc2V0V29ybGRBbmNob3JBKG9wdGlvbnMud29ybGRBbmNob3JBKTsKICAgICAgfQoKICAgICAgaWYgKG9wdGlvbnMud29ybGRBbmNob3JCKSB7CiAgICAgICAgdGhpcy5zZXRXb3JsZEFuY2hvckIob3B0aW9ucy53b3JsZEFuY2hvckIpOwogICAgICB9CgogICAgICB2YXIgd29ybGRBbmNob3JBID0gdmVjMiQxLmNyZWF0ZSgpOwogICAgICB2YXIgd29ybGRBbmNob3JCID0gdmVjMiQxLmNyZWF0ZSgpOwogICAgICB0aGlzLmdldFdvcmxkQW5jaG9yQSh3b3JsZEFuY2hvckEpOwogICAgICB0aGlzLmdldFdvcmxkQW5jaG9yQih3b3JsZEFuY2hvckIpOwogICAgICB2YXIgd29ybGREaXN0YW5jZSA9IHZlYzIkMS5kaXN0YW5jZSh3b3JsZEFuY2hvckEsIHdvcmxkQW5jaG9yQik7CiAgICAgIC8qKgogICAgICAgKiBSZXN0IGxlbmd0aCBvZiB0aGUgc3ByaW5nLiBDYW4gYmUgc2V0IGR5bmFtaWNhbGx5LgogICAgICAgKiBAcHJvcGVydHkgcmVzdExlbmd0aAogICAgICAgKiBAdHlwZSB7bnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMucmVzdExlbmd0aCA9IG9wdGlvbnMucmVzdExlbmd0aCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5yZXN0TGVuZ3RoIDogd29ybGREaXN0YW5jZTsKICAgIH0KCiAgICBMaW5lYXJTcHJpbmcucHJvdG90eXBlID0gbmV3IFNwcmluZyQxKCk7CiAgICBMaW5lYXJTcHJpbmcucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGluZWFyU3ByaW5nOwogICAgLyoqCiAgICAgKiBTZXQgdGhlIGFuY2hvciBwb2ludCBvbiBib2R5IEEsIHVzaW5nIHdvcmxkIGNvb3JkaW5hdGVzLgogICAgICogQG1ldGhvZCBzZXRXb3JsZEFuY2hvckEKICAgICAqIEBwYXJhbSB7QXJyYXl9IHdvcmxkQW5jaG9yQQogICAgICovCgogICAgTGluZWFyU3ByaW5nLnByb3RvdHlwZS5zZXRXb3JsZEFuY2hvckEgPSBmdW5jdGlvbiAod29ybGRBbmNob3JBKSB7CiAgICAgIHRoaXMuYm9keUEudG9Mb2NhbEZyYW1lKHRoaXMubG9jYWxBbmNob3JBLCB3b3JsZEFuY2hvckEpOwogICAgfTsKICAgIC8qKgogICAgICogU2V0IHRoZSBhbmNob3IgcG9pbnQgb24gYm9keSBCLCB1c2luZyB3b3JsZCBjb29yZGluYXRlcy4KICAgICAqIEBtZXRob2Qgc2V0V29ybGRBbmNob3JCCiAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JsZEFuY2hvckIKICAgICAqLwoKCiAgICBMaW5lYXJTcHJpbmcucHJvdG90eXBlLnNldFdvcmxkQW5jaG9yQiA9IGZ1bmN0aW9uICh3b3JsZEFuY2hvckIpIHsKICAgICAgdGhpcy5ib2R5Qi50b0xvY2FsRnJhbWUodGhpcy5sb2NhbEFuY2hvckIsIHdvcmxkQW5jaG9yQik7CiAgICB9OwogICAgLyoqCiAgICAgKiBHZXQgdGhlIGFuY2hvciBwb2ludCBvbiBib2R5IEEsIGluIHdvcmxkIGNvb3JkaW5hdGVzLgogICAgICogQG1ldGhvZCBnZXRXb3JsZEFuY2hvckEKICAgICAqIEBwYXJhbSB7QXJyYXl9IHJlc3VsdCBUaGUgdmVjdG9yIHRvIHN0b3JlIHRoZSByZXN1bHQgaW4uCiAgICAgKi8KCgogICAgTGluZWFyU3ByaW5nLnByb3RvdHlwZS5nZXRXb3JsZEFuY2hvckEgPSBmdW5jdGlvbiAocmVzdWx0KSB7CiAgICAgIHRoaXMuYm9keUEudG9Xb3JsZEZyYW1lKHJlc3VsdCwgdGhpcy5sb2NhbEFuY2hvckEpOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IHRoZSBhbmNob3IgcG9pbnQgb24gYm9keSBCLCBpbiB3b3JsZCBjb29yZGluYXRlcy4KICAgICAqIEBtZXRob2QgZ2V0V29ybGRBbmNob3JCCiAgICAgKiBAcGFyYW0ge0FycmF5fSByZXN1bHQgVGhlIHZlY3RvciB0byBzdG9yZSB0aGUgcmVzdWx0IGluLgogICAgICovCgoKICAgIExpbmVhclNwcmluZy5wcm90b3R5cGUuZ2V0V29ybGRBbmNob3JCID0gZnVuY3Rpb24gKHJlc3VsdCkgewogICAgICB0aGlzLmJvZHlCLnRvV29ybGRGcmFtZShyZXN1bHQsIHRoaXMubG9jYWxBbmNob3JCKTsKICAgIH07CgogICAgdmFyIGFwcGx5Rm9yY2VfciA9IHZlYzIkMS5jcmVhdGUoKSwKICAgICAgICBhcHBseUZvcmNlX3JfdW5pdCA9IHZlYzIkMS5jcmVhdGUoKSwKICAgICAgICBhcHBseUZvcmNlX3UgPSB2ZWMyJDEuY3JlYXRlKCksCiAgICAgICAgYXBwbHlGb3JjZV9mID0gdmVjMiQxLmNyZWF0ZSgpLAogICAgICAgIGFwcGx5Rm9yY2Vfd29ybGRBbmNob3JBID0gdmVjMiQxLmNyZWF0ZSgpLAogICAgICAgIGFwcGx5Rm9yY2Vfd29ybGRBbmNob3JCID0gdmVjMiQxLmNyZWF0ZSgpLAogICAgICAgIGFwcGx5Rm9yY2VfcmkgPSB2ZWMyJDEuY3JlYXRlKCksCiAgICAgICAgYXBwbHlGb3JjZV9yaiA9IHZlYzIkMS5jcmVhdGUoKSwKICAgICAgICBhcHBseUZvcmNlX3RtcCA9IHZlYzIkMS5jcmVhdGUoKTsKICAgIC8qKgogICAgICogQXBwbHkgdGhlIHNwcmluZyBmb3JjZSB0byB0aGUgY29ubmVjdGVkIGJvZGllcy4KICAgICAqIEBwcml2YXRlCiAgICAgKiBAbWV0aG9kIGFwcGx5Rm9yY2UKICAgICAqLwoKICAgIExpbmVhclNwcmluZy5wcm90b3R5cGUuYXBwbHlGb3JjZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgdmFyIGsgPSB0aGlzLnN0aWZmbmVzcywKICAgICAgICAgIGQgPSB0aGlzLmRhbXBpbmcsCiAgICAgICAgICBsID0gdGhpcy5yZXN0TGVuZ3RoLAogICAgICAgICAgYm9keUEgPSB0aGlzLmJvZHlBLAogICAgICAgICAgYm9keUIgPSB0aGlzLmJvZHlCLAogICAgICAgICAgciA9IGFwcGx5Rm9yY2VfciwKICAgICAgICAgIHJfdW5pdCA9IGFwcGx5Rm9yY2Vfcl91bml0LAogICAgICAgICAgdSA9IGFwcGx5Rm9yY2VfdSwKICAgICAgICAgIGYgPSBhcHBseUZvcmNlX2YsCiAgICAgICAgICB0bXAgPSBhcHBseUZvcmNlX3RtcDsKICAgICAgdmFyIHdvcmxkQW5jaG9yQSA9IGFwcGx5Rm9yY2Vfd29ybGRBbmNob3JBLAogICAgICAgICAgd29ybGRBbmNob3JCID0gYXBwbHlGb3JjZV93b3JsZEFuY2hvckIsCiAgICAgICAgICByaSA9IGFwcGx5Rm9yY2VfcmksCiAgICAgICAgICByaiA9IGFwcGx5Rm9yY2Vfcmo7IC8vIEdldCB3b3JsZCBhbmNob3JzCgogICAgICB0aGlzLmdldFdvcmxkQW5jaG9yQSh3b3JsZEFuY2hvckEpOwogICAgICB0aGlzLmdldFdvcmxkQW5jaG9yQih3b3JsZEFuY2hvckIpOyAvLyBHZXQgb2Zmc2V0IHBvaW50cwoKICAgICAgdmVjMiQxLnN1YnRyYWN0KHJpLCB3b3JsZEFuY2hvckEsIGJvZHlBLnBvc2l0aW9uKTsKICAgICAgdmVjMiQxLnN1YnRyYWN0KHJqLCB3b3JsZEFuY2hvckIsIGJvZHlCLnBvc2l0aW9uKTsgLy8gQ29tcHV0ZSBkaXN0YW5jZSB2ZWN0b3IgYmV0d2VlbiB3b3JsZCBhbmNob3IgcG9pbnRzCgogICAgICB2ZWMyJDEuc3VidHJhY3Qociwgd29ybGRBbmNob3JCLCB3b3JsZEFuY2hvckEpOwogICAgICB2YXIgcmxlbiA9IHZlYzIkMS5sZW5ndGgocik7CiAgICAgIHZlYzIkMS5ub3JtYWxpemUocl91bml0LCByKTsgLy8gQ29tcHV0ZSByZWxhdGl2ZSB2ZWxvY2l0eSBvZiB0aGUgYW5jaG9yIHBvaW50cywgdQoKICAgICAgdmVjMiQxLnN1YnRyYWN0KHUsIGJvZHlCLnZlbG9jaXR5LCBib2R5QS52ZWxvY2l0eSk7CiAgICAgIHZlYzIkMS5jcm9zc1pWKHRtcCwgYm9keUIuYW5ndWxhclZlbG9jaXR5LCByaik7CiAgICAgIHZlYzIkMS5hZGQodSwgdSwgdG1wKTsKICAgICAgdmVjMiQxLmNyb3NzWlYodG1wLCBib2R5QS5hbmd1bGFyVmVsb2NpdHksIHJpKTsKICAgICAgdmVjMiQxLnN1YnRyYWN0KHUsIHUsIHRtcCk7IC8vIEYgPSAtIGsgKiAoIHggLSBMICkgLSBEICogKCB1ICkKCiAgICAgIHZlYzIkMS5zY2FsZShmLCByX3VuaXQsIC1rICogKHJsZW4gLSBsKSAtIGQgKiB2ZWMyJDEuZG90KHUsIHJfdW5pdCkpOyAvLyBBZGQgZm9yY2VzIHRvIGJvZGllcwoKICAgICAgdmVjMiQxLnN1YnRyYWN0KGJvZHlBLmZvcmNlLCBib2R5QS5mb3JjZSwgZik7CiAgICAgIHZlYzIkMS5hZGQoYm9keUIuZm9yY2UsIGJvZHlCLmZvcmNlLCBmKTsgLy8gQW5ndWxhciBmb3JjZQoKICAgICAgdmFyIHJpX3hfZiA9IHZlYzIkMS5jcm9zc0xlbmd0aChyaSwgZik7CiAgICAgIHZhciByal94X2YgPSB2ZWMyJDEuY3Jvc3NMZW5ndGgocmosIGYpOwogICAgICBib2R5QS5hbmd1bGFyRm9yY2UgLT0gcmlfeF9mOwogICAgICBib2R5Qi5hbmd1bGFyRm9yY2UgKz0gcmpfeF9mOwogICAgfTsKCiAgICB2YXIgU3ByaW5nID0gU3ByaW5nXzE7CgogICAgdmFyIFJvdGF0aW9uYWxTcHJpbmdfMSA9IFJvdGF0aW9uYWxTcHJpbmc7CiAgICAvKioKICAgICAqIEEgcm90YXRpb25hbCBzcHJpbmcsIGNvbm5lY3RpbmcgdHdvIGJvZGllcyByb3RhdGlvbi4gVGhpcyBzcHJpbmcgZXhwbGljaXRseSBhZGRzIGFuZ3VsYXJGb3JjZSAodG9ycXVlKSB0byB0aGUgYm9kaWVzLgogICAgICoKICAgICAqIFRoZSBzcHJpbmcgY2FuIGJlIGNvbWJpbmVkIHdpdGggYSB7eyNjcm9zc0xpbmsgIlJldm9sdXRlQ29uc3RyYWludCJ9fXt7L2Nyb3NzTGlua319IHRvIG1ha2UsIGZvciBleGFtcGxlLCBhIG1vdXNlIHRyYXAuCiAgICAgKgogICAgICogQGNsYXNzIFJvdGF0aW9uYWxTcHJpbmcKICAgICAqIEBleHRlbmRzIFNwcmluZwogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlCCiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMucmVzdEFuZ2xlXSBUaGUgcmVsYXRpdmUgYW5nbGUgb2YgYm9kaWVzIGF0IHdoaWNoIHRoZSBzcHJpbmcgaXMgYXQgcmVzdC4gSWYgbm90IGdpdmVuLCBpdCdzIHNldCB0byB0aGUgY3VycmVudCByZWxhdGl2ZSBhbmdsZSBiZXR3ZWVuIHRoZSBib2RpZXMuCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc3RpZmZuZXNzPTEwMF0gU3ByaW5nIGNvbnN0YW50IChzZWUgSG9va2VzIExhdykuIEEgbnVtYmVyID49IDAuCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZGFtcGluZz0xXSBBIG51bWJlciA+PSAwLgogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIHNwcmluZyA9IG5ldyBSb3RhdGlvbmFsU3ByaW5nKGJvZHlBLCBib2R5QiwgewogICAgICogICAgICAgICBzdGlmZm5lc3M6IDEwMCwKICAgICAqICAgICAgICAgZGFtcGluZzogMQogICAgICogICAgIH0pOwogICAgICogICAgIHdvcmxkLmFkZFNwcmluZyhzcHJpbmcpOwogICAgICovCgogICAgZnVuY3Rpb24gUm90YXRpb25hbFNwcmluZyhib2R5QSwgYm9keUIsIG9wdGlvbnMpIHsKICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307CiAgICAgIFNwcmluZy5jYWxsKHRoaXMsIGJvZHlBLCBib2R5Qiwgb3B0aW9ucyk7CiAgICAgIC8qKgogICAgICAgKiBSZXN0IGFuZ2xlIG9mIHRoZSBzcHJpbmcuCiAgICAgICAqIEBwcm9wZXJ0eSByZXN0QW5nbGUKICAgICAgICogQHR5cGUge251bWJlcn0KICAgICAgICovCgogICAgICB0aGlzLnJlc3RBbmdsZSA9IG9wdGlvbnMucmVzdEFuZ2xlICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnJlc3RBbmdsZSA6IGJvZHlCLmFuZ2xlIC0gYm9keUEuYW5nbGU7CiAgICB9CgogICAgUm90YXRpb25hbFNwcmluZy5wcm90b3R5cGUgPSBuZXcgU3ByaW5nKCk7CiAgICBSb3RhdGlvbmFsU3ByaW5nLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJvdGF0aW9uYWxTcHJpbmc7CiAgICAvKioKICAgICAqIEFwcGx5IHRoZSBzcHJpbmcgZm9yY2UgdG8gdGhlIGNvbm5lY3RlZCBib2RpZXMuCiAgICAgKiBAbWV0aG9kIGFwcGx5Rm9yY2UKICAgICAqLwoKICAgIFJvdGF0aW9uYWxTcHJpbmcucHJvdG90eXBlLmFwcGx5Rm9yY2UgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBrID0gdGhpcy5zdGlmZm5lc3MsCiAgICAgICAgICBkID0gdGhpcy5kYW1waW5nLAogICAgICAgICAgbCA9IHRoaXMucmVzdEFuZ2xlLAogICAgICAgICAgYm9keUEgPSB0aGlzLmJvZHlBLAogICAgICAgICAgYm9keUIgPSB0aGlzLmJvZHlCLAogICAgICAgICAgeCA9IGJvZHlCLmFuZ2xlIC0gYm9keUEuYW5nbGUsCiAgICAgICAgICB1ID0gYm9keUIuYW5ndWxhclZlbG9jaXR5IC0gYm9keUEuYW5ndWxhclZlbG9jaXR5OwogICAgICB2YXIgdG9ycXVlID0gLWsgKiAoeCAtIGwpIC0gZCAqIHU7CiAgICAgIGJvZHlBLmFuZ3VsYXJGb3JjZSAtPSB0b3JxdWU7CiAgICAgIGJvZHlCLmFuZ3VsYXJGb3JjZSArPSB0b3JxdWU7CiAgICB9OwoKICAgIHZhciBPdmVybGFwS2VlcGVyUmVjb3JkXzEgPSBPdmVybGFwS2VlcGVyUmVjb3JkJDE7CiAgICAvKioKICAgICAqIE92ZXJsYXAgZGF0YSBjb250YWluZXIgZm9yIHRoZSBPdmVybGFwS2VlcGVyCiAgICAgKiBAY2xhc3MgT3ZlcmxhcEtlZXBlclJlY29yZAogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge1NoYXBlfSBzaGFwZUEKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUIKICAgICAqIEBwYXJhbSB7U2hhcGV9IHNoYXBlQgogICAgICovCgogICAgZnVuY3Rpb24gT3ZlcmxhcEtlZXBlclJlY29yZCQxKGJvZHlBLCBzaGFwZUEsIGJvZHlCLCBzaGFwZUIpIHsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7U2hhcGV9IHNoYXBlQQogICAgICAgKi8KICAgICAgdGhpcy5zaGFwZUEgPSBzaGFwZUE7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkge1NoYXBlfSBzaGFwZUIKICAgICAgICovCgogICAgICB0aGlzLnNoYXBlQiA9IHNoYXBlQjsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7Qm9keX0gYm9keUEKICAgICAgICovCgogICAgICB0aGlzLmJvZHlBID0gYm9keUE7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkge0JvZHl9IGJvZHlCCiAgICAgICAqLwoKICAgICAgdGhpcy5ib2R5QiA9IGJvZHlCOwogICAgfQogICAgLyoqCiAgICAgKiBTZXQgdGhlIGRhdGEgZm9yIHRoZSByZWNvcmQKICAgICAqIEBtZXRob2Qgc2V0CiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge1NoYXBlfSBzaGFwZUEKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUIKICAgICAqIEBwYXJhbSB7U2hhcGV9IHNoYXBlQgogICAgICovCgoKICAgIE92ZXJsYXBLZWVwZXJSZWNvcmQkMS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGJvZHlBLCBzaGFwZUEsIGJvZHlCLCBzaGFwZUIpIHsKICAgICAgT3ZlcmxhcEtlZXBlclJlY29yZCQxLmNhbGwodGhpcywgYm9keUEsIHNoYXBlQSwgYm9keUIsIHNoYXBlQik7CiAgICB9OwoKICAgIHZhciBPdmVybGFwS2VlcGVyUmVjb3JkID0gT3ZlcmxhcEtlZXBlclJlY29yZF8xOwoKICAgIHZhciBQb29sID0gUG9vbF8xOwoKICAgIHZhciBPdmVybGFwS2VlcGVyUmVjb3JkUG9vbF8xID0gT3ZlcmxhcEtlZXBlclJlY29yZFBvb2wkMTsKICAgIC8qKgogICAgICogQGNsYXNzCiAgICAgKi8KCiAgICBmdW5jdGlvbiBPdmVybGFwS2VlcGVyUmVjb3JkUG9vbCQxKCkgewogICAgICBQb29sLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7CiAgICB9CgogICAgT3ZlcmxhcEtlZXBlclJlY29yZFBvb2wkMS5wcm90b3R5cGUgPSBuZXcgUG9vbCgpOwogICAgT3ZlcmxhcEtlZXBlclJlY29yZFBvb2wkMS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBPdmVybGFwS2VlcGVyUmVjb3JkUG9vbCQxOwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGNyZWF0ZQogICAgICogQHJldHVybiB7T3ZlcmxhcEtlZXBlclJlY29yZH0KICAgICAqLwoKICAgIE92ZXJsYXBLZWVwZXJSZWNvcmRQb29sJDEucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHsKICAgICAgcmV0dXJuIG5ldyBPdmVybGFwS2VlcGVyUmVjb3JkKCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBAbWV0aG9kIGRlc3Ryb3kKICAgICAqIEBwYXJhbSB7T3ZlcmxhcEtlZXBlclJlY29yZH0gcmVjb3JkCiAgICAgKiBAcmV0dXJuIHtPdmVybGFwS2VlcGVyUmVjb3JkUG9vbH0KICAgICAqLwoKCiAgICBPdmVybGFwS2VlcGVyUmVjb3JkUG9vbCQxLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKHJlY29yZCkgewogICAgICByZWNvcmQuYm9keUEgPSByZWNvcmQuYm9keUIgPSByZWNvcmQuc2hhcGVBID0gcmVjb3JkLnNoYXBlQiA9IG51bGw7CiAgICAgIHJldHVybiB0aGlzOwogICAgfTsKCiAgICB2YXIgVHVwbGVEaWN0aW9uYXJ5ID0gVHVwbGVEaWN0aW9uYXJ5XzE7CgogICAgdmFyIE92ZXJsYXBLZWVwZXJSZWNvcmRQb29sID0gT3ZlcmxhcEtlZXBlclJlY29yZFBvb2xfMTsKCiAgICB2YXIgT3ZlcmxhcEtlZXBlcl8xID0gT3ZlcmxhcEtlZXBlciQxOwogICAgLyoqCiAgICAgKiBLZWVwcyB0cmFjayBvZiBvdmVybGFwcyBpbiB0aGUgY3VycmVudCBzdGF0ZSBhbmQgdGhlIGxhc3Qgc3RlcCBzdGF0ZS4KICAgICAqIEBjbGFzcyBPdmVybGFwS2VlcGVyCiAgICAgKiBAY29uc3RydWN0b3IKICAgICAqLwoKICAgIGZ1bmN0aW9uIE92ZXJsYXBLZWVwZXIkMSgpIHsKICAgICAgdGhpcy5vdmVybGFwcGluZ1NoYXBlc0xhc3RTdGF0ZSA9IG5ldyBUdXBsZURpY3Rpb25hcnkoKTsKICAgICAgdGhpcy5vdmVybGFwcGluZ1NoYXBlc0N1cnJlbnRTdGF0ZSA9IG5ldyBUdXBsZURpY3Rpb25hcnkoKTsKICAgICAgdGhpcy5yZWNvcmRQb29sID0gbmV3IE92ZXJsYXBLZWVwZXJSZWNvcmRQb29sKHsKICAgICAgICBzaXplOiAxNgogICAgICB9KTsKICAgICAgdGhpcy50bXBEaWN0ID0gbmV3IFR1cGxlRGljdGlvbmFyeSgpOwogICAgICB0aGlzLnRtcEFycmF5MSA9IFtdOwogICAgfQogICAgLyoqCiAgICAgKiBUaWNrcyBvbmUgc3RlcCBmb3J3YXJkIGluIHRpbWUuIFRoaXMgd2lsbCBtb3ZlIHRoZSBjdXJyZW50IG92ZXJsYXAgc3RhdGUgdG8gdGhlICJvbGQiIG92ZXJsYXAgc3RhdGUsIGFuZCBjcmVhdGUgYSBuZXcgb25lIGFzIGN1cnJlbnQuCiAgICAgKiBAbWV0aG9kIHRpY2sKICAgICAqLwoKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbiAoKSB7CiAgICAgIHZhciBsYXN0ID0gdGhpcy5vdmVybGFwcGluZ1NoYXBlc0xhc3RTdGF0ZTsKICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLm92ZXJsYXBwaW5nU2hhcGVzQ3VycmVudFN0YXRlOyAvLyBTYXZlIG9sZCBvYmplY3RzIGludG8gcG9vbAoKICAgICAgdmFyIGwgPSBsYXN0LmtleXMubGVuZ3RoOwoKICAgICAgd2hpbGUgKGwtLSkgewogICAgICAgIHZhciBrZXkgPSBsYXN0LmtleXNbbF07CiAgICAgICAgdmFyIGxhc3RPYmplY3QgPSBsYXN0LmdldEJ5S2V5KGtleSk7CgogICAgICAgIGlmIChsYXN0T2JqZWN0KSB7CiAgICAgICAgICAvLyBUaGUgcmVjb3JkIGlzIG9ubHkgdXNlZCBpbiB0aGUgImxhc3QiIGRpY3QsIGFuZCB3aWxsIGJlIHJlbW92ZWQuIFdlIG1pZ2h0IGFzIHdlbGwgcG9vbCBpdC4KICAgICAgICAgIHRoaXMucmVjb3JkUG9vbC5yZWxlYXNlKGxhc3RPYmplY3QpOwogICAgICAgIH0KICAgICAgfSAvLyBDbGVhciBsYXN0IG9iamVjdAoKCiAgICAgIGxhc3QucmVzZXQoKTsgLy8gVHJhbnNmZXIgZnJvbSBuZXcgb2JqZWN0IHRvIG9sZAoKICAgICAgbGFzdC5jb3B5KGN1cnJlbnQpOyAvLyBDbGVhciBjdXJyZW50IG9iamVjdAoKICAgICAgY3VycmVudC5yZXNldCgpOwogICAgfTsKICAgIC8qKgogICAgICogQG1ldGhvZCBzZXRPdmVybGFwcGluZwogICAgICogQHBhcmFtIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSBzaGFwZUEKICAgICAqIEBwYXJhbSB7Qm9keX0gYm9keUIKICAgICAqIEBwYXJhbSB7Qm9keX0gc2hhcGVCCiAgICAgKi8KCgogICAgT3ZlcmxhcEtlZXBlciQxLnByb3RvdHlwZS5zZXRPdmVybGFwcGluZyA9IGZ1bmN0aW9uIChib2R5QSwgc2hhcGVBLCBib2R5Qiwgc2hhcGVCKSB7CiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5vdmVybGFwcGluZ1NoYXBlc0N1cnJlbnRTdGF0ZTsgLy8gU3RvcmUgY3VycmVudCBjb250YWN0IHN0YXRlCgogICAgICBpZiAoIWN1cnJlbnQuZ2V0KHNoYXBlQS5pZCwgc2hhcGVCLmlkKSkgewogICAgICAgIHZhciBkYXRhID0gdGhpcy5yZWNvcmRQb29sLmdldCgpOwogICAgICAgIGRhdGEuc2V0KGJvZHlBLCBzaGFwZUEsIGJvZHlCLCBzaGFwZUIpOwogICAgICAgIGN1cnJlbnQuc2V0KHNoYXBlQS5pZCwgc2hhcGVCLmlkLCBkYXRhKTsKICAgICAgfQogICAgfTsKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLmdldE5ld092ZXJsYXBzID0gZnVuY3Rpb24gKHJlc3VsdCkgewogICAgICByZXR1cm4gdGhpcy5nZXREaWZmKHRoaXMub3ZlcmxhcHBpbmdTaGFwZXNMYXN0U3RhdGUsIHRoaXMub3ZlcmxhcHBpbmdTaGFwZXNDdXJyZW50U3RhdGUsIHJlc3VsdCk7CiAgICB9OwoKICAgIE92ZXJsYXBLZWVwZXIkMS5wcm90b3R5cGUuZ2V0RW5kT3ZlcmxhcHMgPSBmdW5jdGlvbiAocmVzdWx0KSB7CiAgICAgIHJldHVybiB0aGlzLmdldERpZmYodGhpcy5vdmVybGFwcGluZ1NoYXBlc0N1cnJlbnRTdGF0ZSwgdGhpcy5vdmVybGFwcGluZ1NoYXBlc0xhc3RTdGF0ZSwgcmVzdWx0KTsKICAgIH07CiAgICAvKioKICAgICAqIENoZWNrcyBpZiB0d28gYm9kaWVzIGFyZSBjdXJyZW50bHkgb3ZlcmxhcHBpbmcuCiAgICAgKiBAbWV0aG9kIGJvZGllc0FyZU92ZXJsYXBwaW5nCiAgICAgKiBAcGFyYW0gIHtCb2R5fSBib2R5QQogICAgICogQHBhcmFtICB7Qm9keX0gYm9keUIKICAgICAqIEByZXR1cm4ge2Jvb2xlYW59CiAgICAgKi8KCgogICAgT3ZlcmxhcEtlZXBlciQxLnByb3RvdHlwZS5ib2RpZXNBcmVPdmVybGFwcGluZyA9IGZ1bmN0aW9uIChib2R5QSwgYm9keUIpIHsKICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLm92ZXJsYXBwaW5nU2hhcGVzQ3VycmVudFN0YXRlOwogICAgICB2YXIgbCA9IGN1cnJlbnQua2V5cy5sZW5ndGg7CgogICAgICB3aGlsZSAobC0tKSB7CiAgICAgICAgdmFyIGtleSA9IGN1cnJlbnQua2V5c1tsXTsKICAgICAgICB2YXIgZGF0YSA9IGN1cnJlbnQuZGF0YVtrZXldOwoKICAgICAgICBpZiAoZGF0YS5ib2R5QSA9PT0gYm9keUEgJiYgZGF0YS5ib2R5QiA9PT0gYm9keUIgfHwgZGF0YS5ib2R5QSA9PT0gYm9keUIgJiYgZGF0YS5ib2R5QiA9PT0gYm9keUEpIHsKICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIGZhbHNlOwogICAgfTsKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLmdldERpZmYgPSBmdW5jdGlvbiAoZGljdEEsIGRpY3RCLCByZXN1bHQpIHsKICAgICAgdmFyIHJlc3VsdCA9IHJlc3VsdCB8fCBbXTsKICAgICAgdmFyIGxhc3QgPSBkaWN0QTsKICAgICAgdmFyIGN1cnJlbnQgPSBkaWN0QjsKICAgICAgcmVzdWx0Lmxlbmd0aCA9IDA7CiAgICAgIHZhciBsID0gY3VycmVudC5rZXlzLmxlbmd0aDsKCiAgICAgIHdoaWxlIChsLS0pIHsKICAgICAgICB2YXIga2V5ID0gY3VycmVudC5rZXlzW2xdOwogICAgICAgIHZhciBkYXRhID0gY3VycmVudC5kYXRhW2tleV07CgogICAgICAgIGlmICghZGF0YSkgewogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgJyArIGtleSArICcgaGFkIG5vIGRhdGEhJyk7CiAgICAgICAgfQoKICAgICAgICB2YXIgbGFzdERhdGEgPSBsYXN0LmRhdGFba2V5XTsKCiAgICAgICAgaWYgKCFsYXN0RGF0YSkgewogICAgICAgICAgLy8gTm90IG92ZXJsYXBwaW5nIGluIGxhc3Qgc3RhdGUsIGJ1dCBpbiBjdXJyZW50LgogICAgICAgICAgcmVzdWx0LnB1c2goZGF0YSk7CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gcmVzdWx0OwogICAgfTsKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLmlzTmV3T3ZlcmxhcCA9IGZ1bmN0aW9uIChzaGFwZUEsIHNoYXBlQikgewogICAgICB2YXIgaWRBID0gc2hhcGVBLmlkIHwgMCwKICAgICAgICAgIGlkQiA9IHNoYXBlQi5pZCB8IDA7CiAgICAgIHZhciBsYXN0ID0gdGhpcy5vdmVybGFwcGluZ1NoYXBlc0xhc3RTdGF0ZTsKICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLm92ZXJsYXBwaW5nU2hhcGVzQ3VycmVudFN0YXRlOyAvLyBOb3QgaW4gbGFzdCBidXQgaW4gbmV3CgogICAgICByZXR1cm4gISEhbGFzdC5nZXQoaWRBLCBpZEIpICYmICEhY3VycmVudC5nZXQoaWRBLCBpZEIpOwogICAgfTsKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLmdldE5ld0JvZHlPdmVybGFwcyA9IGZ1bmN0aW9uIChyZXN1bHQpIHsKICAgICAgdGhpcy50bXBBcnJheTEubGVuZ3RoID0gMDsKICAgICAgdmFyIG92ZXJsYXBzID0gdGhpcy5nZXROZXdPdmVybGFwcyh0aGlzLnRtcEFycmF5MSk7CiAgICAgIHJldHVybiB0aGlzLmdldEJvZHlEaWZmKG92ZXJsYXBzLCByZXN1bHQpOwogICAgfTsKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLmdldEVuZEJvZHlPdmVybGFwcyA9IGZ1bmN0aW9uIChyZXN1bHQpIHsKICAgICAgdGhpcy50bXBBcnJheTEubGVuZ3RoID0gMDsKICAgICAgdmFyIG92ZXJsYXBzID0gdGhpcy5nZXRFbmRPdmVybGFwcyh0aGlzLnRtcEFycmF5MSk7CiAgICAgIHJldHVybiB0aGlzLmdldEJvZHlEaWZmKG92ZXJsYXBzLCByZXN1bHQpOwogICAgfTsKCiAgICBPdmVybGFwS2VlcGVyJDEucHJvdG90eXBlLmdldEJvZHlEaWZmID0gZnVuY3Rpb24gKG92ZXJsYXBzLCByZXN1bHQpIHsKICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IFtdOwogICAgICB2YXIgYWNjdW11bGF0b3IgPSB0aGlzLnRtcERpY3Q7CiAgICAgIHZhciBsID0gb3ZlcmxhcHMubGVuZ3RoOwoKICAgICAgd2hpbGUgKGwtLSkgewogICAgICAgIHZhciBkYXRhID0gb3ZlcmxhcHNbbF07IC8vIFNpbmNlIHdlIHVzZSBib2R5IGlkJ3MgZm9yIHRoZSBhY2N1bXVsYXRvciwgdGhlc2Ugd2lsbCBiZSBhIHN1YnNldCBvZiB0aGUgb3JpZ2luYWwgb25lCgogICAgICAgIGFjY3VtdWxhdG9yLnNldChkYXRhLmJvZHlBLmlkIHwgMCwgZGF0YS5ib2R5Qi5pZCB8IDAsIGRhdGEpOwogICAgICB9CgogICAgICBsID0gYWNjdW11bGF0b3Iua2V5cy5sZW5ndGg7CgogICAgICB3aGlsZSAobC0tKSB7CiAgICAgICAgdmFyIGRhdGEgPSBhY2N1bXVsYXRvci5nZXRCeUtleShhY2N1bXVsYXRvci5rZXlzW2xdKTsKCiAgICAgICAgaWYgKGRhdGEpIHsKICAgICAgICAgIHJlc3VsdC5wdXNoKGRhdGEuYm9keUEsIGRhdGEuYm9keUIpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgYWNjdW11bGF0b3IucmVzZXQoKTsKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH07CgogICAgdmFyIFVuaW9uRmluZF8xID0gVW5pb25GaW5kJDE7CiAgICAvKioKICAgICAqIFdlaWdodGVkIFF1aWNrIFVuaW9uLUZpbmQgd2l0aCBQYXRoIENvbXByZXNzaW9uLiBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vanV6ZXJhbGkvdW5pb25maW5kLCBidXQgb3B0aW1pemVkIGZvciBwZXJmb3JtYW5jZS4KICAgICAqIEBjbGFzcyBVbmlvbkZpbmQKICAgICAqIEBjb25zdHJ1Y3RvcgogICAgICogQHBhcmFtIHtudW1iZXJ9IHNpemUKICAgICAqLwoKICAgIGZ1bmN0aW9uIFVuaW9uRmluZCQxKHNpemUpIHsKICAgICAgdGhpcy5pZCA9IFtdOwogICAgICB0aGlzLnN6ID0gW107CiAgICAgIC8qKgogICAgICAgKiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzLgogICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gc2l6ZQogICAgICAgKi8KCiAgICAgIHRoaXMuc2l6ZSA9IHNpemU7CiAgICAgIC8qKgogICAgICAgKiBUaGUgbnVtYmVyIG9mIGRpc3RpbmN0IGdyb3Vwcy4KICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGNvdW50CiAgICAgICAqLwoKICAgICAgdGhpcy5jb3VudCA9IHNpemU7CiAgICAgIHRoaXMucmVzaXplKHNpemUpOwogICAgfQoKICAgIFVuaW9uRmluZCQxLnByb3RvdHlwZSA9IHsKICAgICAgLyoqCiAgICAgICAqIEluaXRpYWxpemUgdGhlIFVuaW9uRmluZCBkYXRhIHN0cnVjdHVyZSB3aXRoIG51bWJlciBvZiBkaXN0aW5jdCBncm91cHMgdG8gYmVnaW4gd2l0aC4gRWFjaCBncm91cCB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIGluZGV4IG9mIHRoZSBhcnJheSBvZiBzaXplIHNpemUgc3RhcnRpbmcgYXQgMC4KICAgICAgICogQG1ldGhvZCByZXNpemUKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNpemUKICAgICAgICovCiAgICAgIHJlc2l6ZTogZnVuY3Rpb24gKHNpemUpIHsKICAgICAgICB0aGlzLmNvdW50ID0gdGhpcy5zaXplID0gc2l6ZTsKICAgICAgICB2YXIgc3ogPSB0aGlzLnN6OwogICAgICAgIHZhciBpZCA9IHRoaXMuaWQ7CgogICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7CiAgICAgICAgICBpZFtpXSA9IGk7CiAgICAgICAgICBzeltpXSA9IDE7CiAgICAgICAgfQogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIFJldHVybiB0aGUgcm9vdCAodmFsdWUpIG9mIHRoZSBncm91cCBpbiB3aGljaCBwIGlzLgogICAgICAgKiBAbWV0aG9kIGZpbmQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHAKICAgICAgICovCiAgICAgIGZpbmQ6IGZ1bmN0aW9uIChwKSB7CiAgICAgICAgdmFyIGlkID0gdGhpcy5pZDsKCiAgICAgICAgd2hpbGUgKHAgIT09IGlkW3BdKSB7CiAgICAgICAgICBpZFtwXSA9IGlkW2lkW3BdXTsKICAgICAgICAgIHAgPSBpZFtwXTsKICAgICAgICB9CgogICAgICAgIHJldHVybiBwOwogICAgICB9LAoKICAgICAgLyoqCiAgICAgICAqIENvbWJpbmUgZWxlbWVudHMgaW4gZ3JvdXBzIHAgYW5kIHEgaW50byBhIHNpbmdsZSBncm91cC4gSW4gb3RoZXIgd29yZHMgY29ubmVjdCB0aGUgdHdvIGdyb3Vwcy4KICAgICAgICogQG1ldGhvZCB1bmlvbgogICAgICAgKiBAcGFyYW0ge251bWJlcn0gcAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gcQogICAgICAgKi8KICAgICAgdW5pb246IGZ1bmN0aW9uIChwLCBxKSB7CiAgICAgICAgdmFyIGkgPSB0aGlzLmZpbmQocCksCiAgICAgICAgICAgIGogPSB0aGlzLmZpbmQocSk7CgogICAgICAgIGlmIChpID09PSBqKSB7CiAgICAgICAgICByZXR1cm47CiAgICAgICAgfQoKICAgICAgICB2YXIgc3ogPSB0aGlzLnN6OwogICAgICAgIHZhciBpZCA9IHRoaXMuaWQ7CgogICAgICAgIGlmIChzeltpXSA8IHN6W2pdKSB7CiAgICAgICAgICBpZFtpXSA9IGo7CiAgICAgICAgICBzeltqXSArPSBzeltpXTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgaWRbal0gPSBpOwogICAgICAgICAgc3pbaV0gKz0gc3pbal07CiAgICAgICAgfQoKICAgICAgICB0aGlzLmNvdW50LS07CiAgICAgICAgcmV0dXJuOwogICAgICB9CiAgICB9OwoKICAgIHZhciBHU1NvbHZlciA9IEdTU29sdmVyXzEsCiAgICAgICAgdmVjMiA9IHZlYzIkcS5leHBvcnRzLAogICAgICAgIFNoYXBlID0gU2hhcGVfMSwKICAgICAgICBFdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXJfMSwKICAgICAgICBCb2R5ID0gQm9keV8xLAogICAgICAgIE1hdGVyaWFsID0gTWF0ZXJpYWxfMSwKICAgICAgICBDb250YWN0TWF0ZXJpYWwgPSBDb250YWN0TWF0ZXJpYWxfMSwKICAgICAgICBBQUJCID0gQUFCQl8xLAogICAgICAgIFNBUEJyb2FkcGhhc2UgPSBTQVBCcm9hZHBoYXNlXzEsCiAgICAgICAgTmFycm93cGhhc2UgPSBOYXJyb3dwaGFzZV8xLAogICAgICAgIFV0aWxzID0gVXRpbHNfMSwKICAgICAgICBhcnJheVJlbW92ZSA9IFV0aWxzLmFycmF5UmVtb3ZlLAogICAgICAgIE92ZXJsYXBLZWVwZXIgPSBPdmVybGFwS2VlcGVyXzEsCiAgICAgICAgVW5pb25GaW5kID0gVW5pb25GaW5kXzE7CgogICAgdmFyIFdvcmxkXzEgPSBXb3JsZDsKICAgIC8qKgogICAgICogVGhlIGR5bmFtaWNzIHdvcmxkLCB3aGVyZSBhbGwgYm9kaWVzIGFuZCBjb25zdHJhaW50cyBsaXZlLgogICAgICoKICAgICAqIEBjbGFzcyBXb3JsZAogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge1NvbHZlcn0gW29wdGlvbnMuc29sdmVyXSBEZWZhdWx0cyB0byBHU1NvbHZlci4KICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLmdyYXZpdHldIERlZmF1bHRzIHRvIHk9LTkuNzguCiAgICAgKiBAcGFyYW0ge0Jyb2FkcGhhc2V9IFtvcHRpb25zLmJyb2FkcGhhc2VdIERlZmF1bHRzIHRvIFNBUEJyb2FkcGhhc2UKICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaXNsYW5kU3BsaXQ9dHJ1ZV0KICAgICAqIEBleHRlbmRzIEV2ZW50RW1pdHRlcgogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIHdvcmxkID0gbmV3IFdvcmxkKHsKICAgICAqICAgICAgICAgZ3Jhdml0eTogWzAsIC0xMF0sCiAgICAgKiAgICAgICAgIGJyb2FkcGhhc2U6IG5ldyBTQVBCcm9hZHBoYXNlKCkKICAgICAqICAgICB9KTsKICAgICAqICAgICB3b3JsZC5hZGRCb2R5KG5ldyBCb2R5KCkpOwogICAgICovCgogICAgZnVuY3Rpb24gV29ybGQob3B0aW9ucykgewogICAgICBFdmVudEVtaXR0ZXIuYXBwbHkodGhpcyk7CiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OwogICAgICAvKioKICAgICAgICogQWxsIHNwcmluZ3MgaW4gdGhlIHdvcmxkLiBUbyBhZGQgYSBzcHJpbmcgdG8gdGhlIHdvcmxkLCB1c2Uge3sjY3Jvc3NMaW5rICJXb3JsZC9hZGRTcHJpbmc6bWV0aG9kIn19e3svY3Jvc3NMaW5rfX0uCiAgICAgICAqCiAgICAgICAqIEBwcm9wZXJ0eSBzcHJpbmdzCiAgICAgICAqIEB0eXBlIHtBcnJheX0KICAgICAgICovCgogICAgICB0aGlzLnNwcmluZ3MgPSBbXTsKICAgICAgLyoqCiAgICAgICAqIEFsbCBib2RpZXMgaW4gdGhlIHdvcmxkLiBUbyBhZGQgYSBib2R5IHRvIHRoZSB3b3JsZCwgdXNlIHt7I2Nyb3NzTGluayAiV29ybGQvYWRkQm9keTptZXRob2QifX17ey9jcm9zc0xpbmt9fS4KICAgICAgICogQHByb3BlcnR5IHtBcnJheX0gYm9kaWVzCiAgICAgICAqLwoKICAgICAgdGhpcy5ib2RpZXMgPSBbXTsKICAgICAgLyoqCiAgICAgICAqIERpc2FibGVkIGJvZHkgY29sbGlzaW9uIHBhaXJzLiBTZWUge3sjY3Jvc3NMaW5rICJXb3JsZC9kaXNhYmxlQm9keUNvbGxpc2lvbjptZXRob2QifX0uCiAgICAgICAqIEBwcml2YXRlCiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IGRpc2FibGVkQm9keUNvbGxpc2lvblBhaXJzCiAgICAgICAqLwoKICAgICAgdGhpcy5kaXNhYmxlZEJvZHlDb2xsaXNpb25QYWlycyA9IFtdOwogICAgICAvKioKICAgICAgICogVGhlIHNvbHZlciB1c2VkIHRvIHNhdGlzZnkgY29uc3RyYWludHMgYW5kIGNvbnRhY3RzLiBEZWZhdWx0IGlzIHt7I2Nyb3NzTGluayAiR1NTb2x2ZXIifX17ey9jcm9zc0xpbmt9fS4KICAgICAgICogQHByb3BlcnR5IHtTb2x2ZXJ9IHNvbHZlcgogICAgICAgKi8KCiAgICAgIHRoaXMuc29sdmVyID0gb3B0aW9ucy5zb2x2ZXIgfHwgbmV3IEdTU29sdmVyKCk7CiAgICAgIC8qKgogICAgICAgKiBUaGUgbmFycm93cGhhc2UgdG8gdXNlIHRvIGdlbmVyYXRlIGNvbnRhY3RzLgogICAgICAgKgogICAgICAgKiBAcHJvcGVydHkgbmFycm93cGhhc2UKICAgICAgICogQHR5cGUge05hcnJvd3BoYXNlfQogICAgICAgKi8KCiAgICAgIHRoaXMubmFycm93cGhhc2UgPSBuZXcgTmFycm93cGhhc2UoKTsKICAgICAgLyoqCiAgICAgICAqIEdyYXZpdHkgaW4gdGhlIHdvcmxkLiBUaGlzIGlzIGFwcGxpZWQgb24gYWxsIGJvZGllcyBpbiB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggc3RlcCgpLgogICAgICAgKgogICAgICAgKiBAcHJvcGVydHkgZ3Jhdml0eQogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5ncmF2aXR5ID0gdmVjMi5mcm9tVmFsdWVzKDAsIC05Ljc4KTsKCiAgICAgIGlmIChvcHRpb25zLmdyYXZpdHkpIHsKICAgICAgICB2ZWMyLmNvcHkodGhpcy5ncmF2aXR5LCBvcHRpb25zLmdyYXZpdHkpOwogICAgICB9CiAgICAgIC8qKgogICAgICAgKiBHcmF2aXR5IHRvIHVzZSB3aGVuIGFwcHJveGltYXRpbmcgdGhlIGZyaWN0aW9uIG1heCBmb3JjZSAobXUqbWFzcypncmF2aXR5KS4KICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyaWN0aW9uR3Jhdml0eQogICAgICAgKi8KCgogICAgICB0aGlzLmZyaWN0aW9uR3Jhdml0eSA9IHZlYzIubGVuZ3RoKHRoaXMuZ3Jhdml0eSkgfHwgMTA7CiAgICAgIC8qKgogICAgICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCAuZnJpY3Rpb25HcmF2aXR5IHRvIGJlIGF1dG9tYXRpY2FsbHkgc2V0IHRvIHRoZSBsZW5ndGggb2YgLmdyYXZpdHkuCiAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlV29ybGRHcmF2aXR5QXNGcmljdGlvbkdyYXZpdHkKICAgICAgICogQGRlZmF1bHQgdHJ1ZQogICAgICAgKi8KCiAgICAgIHRoaXMudXNlV29ybGRHcmF2aXR5QXNGcmljdGlvbkdyYXZpdHkgPSB0cnVlOwogICAgICAvKioKICAgICAgICogSWYgdGhlIGxlbmd0aCBvZiAuZ3Jhdml0eSBpcyB6ZXJvLCBhbmQgLnVzZVdvcmxkR3Jhdml0eUFzRnJpY3Rpb25HcmF2aXR5PXRydWUsIHRoZW4gc3dpdGNoIHRvIHVzaW5nIC5mcmljdGlvbkdyYXZpdHkgZm9yIGZyaWN0aW9uIGluc3RlYWQuIFRoaXMgZmFsbGJhY2sgaXMgdXNlZnVsIGZvciBncmF2aXR5bGVzcyBnYW1lcy4KICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSB1c2VGcmljdGlvbkdyYXZpdHlPblplcm9HcmF2aXR5CiAgICAgICAqIEBkZWZhdWx0IHRydWUKICAgICAgICovCgogICAgICB0aGlzLnVzZUZyaWN0aW9uR3Jhdml0eU9uWmVyb0dyYXZpdHkgPSB0cnVlOwogICAgICAvKioKICAgICAgICogVGhlIGJyb2FkcGhhc2UgYWxnb3JpdGhtIHRvIHVzZS4KICAgICAgICoKICAgICAgICogQHByb3BlcnR5IGJyb2FkcGhhc2UKICAgICAgICogQHR5cGUge0Jyb2FkcGhhc2V9CiAgICAgICAqLwoKICAgICAgdGhpcy5icm9hZHBoYXNlID0gb3B0aW9ucy5icm9hZHBoYXNlIHx8IG5ldyBTQVBCcm9hZHBoYXNlKCk7CiAgICAgIHRoaXMuYnJvYWRwaGFzZS5zZXRXb3JsZCh0aGlzKTsKICAgICAgLyoqCiAgICAgICAqIFVzZXItYWRkZWQgY29uc3RyYWludHMuCiAgICAgICAqCiAgICAgICAqIEBwcm9wZXJ0eSBjb25zdHJhaW50cwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5jb25zdHJhaW50cyA9IFtdOwogICAgICAvKioKICAgICAgICogRHVtbXkgZGVmYXVsdCBtYXRlcmlhbCBpbiB0aGUgd29ybGQsIHVzZWQgaW4gLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwKICAgICAgICogQHByb3BlcnR5IHtNYXRlcmlhbH0gZGVmYXVsdE1hdGVyaWFsCiAgICAgICAqLwoKICAgICAgdGhpcy5kZWZhdWx0TWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoKTsKICAgICAgLyoqCiAgICAgICAqIFRoZSBkZWZhdWx0IGNvbnRhY3QgbWF0ZXJpYWwgdG8gdXNlLCBpZiBubyBjb250YWN0IG1hdGVyaWFsIHdhcyBzZXQgZm9yIHRoZSBjb2xsaWRpbmcgbWF0ZXJpYWxzLgogICAgICAgKiBAcHJvcGVydHkge0NvbnRhY3RNYXRlcmlhbH0gZGVmYXVsdENvbnRhY3RNYXRlcmlhbAogICAgICAgKi8KCiAgICAgIHRoaXMuZGVmYXVsdENvbnRhY3RNYXRlcmlhbCA9IG5ldyBDb250YWN0TWF0ZXJpYWwodGhpcy5kZWZhdWx0TWF0ZXJpYWwsIHRoaXMuZGVmYXVsdE1hdGVyaWFsKTsKICAgICAgLyoqCiAgICAgICAqIEZvciBrZWVwaW5nIHRyYWNrIG9mIHdoYXQgdGltZSBzdGVwIHNpemUgd2UgdXNlZCBsYXN0IHN0ZXAKICAgICAgICogQHByb3BlcnR5IGxhc3RUaW1lU3RlcAogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMubGFzdFRpbWVTdGVwID0gMSAvIDYwOwogICAgICAvKioKICAgICAgICogRW5hYmxlIHRvIGF1dG9tYXRpY2FsbHkgYXBwbHkgc3ByaW5nIGZvcmNlcyBlYWNoIHN0ZXAuCiAgICAgICAqIEBwcm9wZXJ0eSBhcHBseVNwcmluZ0ZvcmNlcwogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICogQGRlZmF1bHQgdHJ1ZQogICAgICAgKi8KCiAgICAgIHRoaXMuYXBwbHlTcHJpbmdGb3JjZXMgPSB0cnVlOwogICAgICAvKioKICAgICAgICogRW5hYmxlIHRvIGF1dG9tYXRpY2FsbHkgYXBwbHkgYm9keSBkYW1waW5nIGVhY2ggc3RlcC4KICAgICAgICogQHByb3BlcnR5IGFwcGx5RGFtcGluZwogICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0KICAgICAgICogQGRlZmF1bHQgdHJ1ZQogICAgICAgKi8KCiAgICAgIHRoaXMuYXBwbHlEYW1waW5nID0gdHJ1ZTsKICAgICAgLyoqCiAgICAgICAqIEVuYWJsZSB0byBhdXRvbWF0aWNhbGx5IGFwcGx5IGdyYXZpdHkgZWFjaCBzdGVwLgogICAgICAgKiBAcHJvcGVydHkgYXBwbHlHcmF2aXR5CiAgICAgICAqIEB0eXBlIHtCb29sZWFufQogICAgICAgKiBAZGVmYXVsdCB0cnVlCiAgICAgICAqLwoKICAgICAgdGhpcy5hcHBseUdyYXZpdHkgPSB0cnVlOwogICAgICAvKioKICAgICAgICogRW5hYmxlL2Rpc2FibGUgY29uc3RyYWludCBzb2x2aW5nIGluIGVhY2ggc3RlcC4KICAgICAgICogQHByb3BlcnR5IHNvbHZlQ29uc3RyYWludHMKICAgICAgICogQHR5cGUge0Jvb2xlYW59CiAgICAgICAqIEBkZWZhdWx0IHRydWUKICAgICAgICovCgogICAgICB0aGlzLnNvbHZlQ29uc3RyYWludHMgPSB0cnVlOwogICAgICAvKioKICAgICAgICogVGhlIENvbnRhY3RNYXRlcmlhbHMgYWRkZWQgdG8gdGhlIFdvcmxkLgogICAgICAgKiBAcHJvcGVydHkgY29udGFjdE1hdGVyaWFscwogICAgICAgKiBAdHlwZSB7QXJyYXl9CiAgICAgICAqLwoKICAgICAgdGhpcy5jb250YWN0TWF0ZXJpYWxzID0gW107CiAgICAgIC8qKgogICAgICAgKiBXb3JsZCB0aW1lLgogICAgICAgKiBAcHJvcGVydHkgdGltZQogICAgICAgKiBAdHlwZSB7TnVtYmVyfQogICAgICAgKi8KCiAgICAgIHRoaXMudGltZSA9IDAuMDsKICAgICAgdGhpcy5hY2N1bXVsYXRvciA9IDA7CiAgICAgIC8qKgogICAgICAgKiBJcyB0cnVlIGR1cmluZyBzdGVwKCkuCiAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc3RlcHBpbmcKICAgICAgICovCgogICAgICB0aGlzLnN0ZXBwaW5nID0gZmFsc2U7CiAgICAgIC8qKgogICAgICAgKiBXaGV0aGVyIHRvIGVuYWJsZSBpc2xhbmQgc3BsaXR0aW5nLiBJc2xhbmQgc3BsaXR0aW5nIGNhbiBiZSBhbiBhZHZhbnRhZ2UgZm9yIGJvdGggcHJlY2lzaW9uIGFuZCBwZXJmb3JtYW5jZS4KICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc2xhbmRTcGxpdAogICAgICAgKiBAZGVmYXVsdCBmYWxzZQogICAgICAgKi8KCiAgICAgIHRoaXMuaXNsYW5kU3BsaXQgPSBvcHRpb25zLmlzbGFuZFNwbGl0ICE9PSB1bmRlZmluZWQgPyAhIW9wdGlvbnMuaXNsYW5kU3BsaXQgOiB0cnVlOwogICAgICAvKioKICAgICAgICogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gdGhlIHdvcmxkIHRvIGVtaXQgdGhlICJpbXBhY3QiIGV2ZW50LiBUdXJuaW5nIHRoaXMgb2ZmIGNvdWxkIGltcHJvdmUgcGVyZm9ybWFuY2UuCiAgICAgICAqIEBwcm9wZXJ0eSBlbWl0SW1wYWN0RXZlbnQKICAgICAgICogQHR5cGUge0Jvb2xlYW59CiAgICAgICAqIEBkZWZhdWx0IHRydWUKICAgICAgICogQGRlcHJlY2F0ZWQgSW1wYWN0IGV2ZW50IHdpbGwgYmUgcmVtb3ZlZC4gVXNlIGJlZ2luQ29udGFjdCBpbnN0ZWFkLgogICAgICAgKi8KCiAgICAgIHRoaXMuZW1pdEltcGFjdEV2ZW50ID0gdHJ1ZTsKICAgICAgLyoqCiAgICAgICAqIEhvdyB0byBkZWFjdGl2YXRlIGJvZGllcyBkdXJpbmcgc2ltdWxhdGlvbi4gUG9zc2libGUgbW9kZXMgYXJlOiB7eyNjcm9zc0xpbmsgIldvcmxkL05PX1NMRUVQSU5HOnByb3BlcnR5In19V29ybGQuTk9fU0xFRVBJTkd7ey9jcm9zc0xpbmt9fSwge3sjY3Jvc3NMaW5rICJXb3JsZC9CT0RZX1NMRUVQSU5HOnByb3BlcnR5In19V29ybGQuQk9EWV9TTEVFUElOR3t7L2Nyb3NzTGlua319IGFuZCB7eyNjcm9zc0xpbmsgIldvcmxkL0lTTEFORF9TTEVFUElORzpwcm9wZXJ0eSJ9fVdvcmxkLklTTEFORF9TTEVFUElOR3t7L2Nyb3NzTGlua319LgogICAgICAgKiBJZiBzbGVlcGluZyBpcyBlbmFibGVkLCB5b3UgbWlnaHQgbmVlZCB0byB7eyNjcm9zc0xpbmsgIkJvZHkvd2FrZVVwOm1ldGhvZCJ9fXdha2UgdXB7ey9jcm9zc0xpbmt9fSB0aGUgYm9kaWVzIGlmIHRoZXkgZmFsbCBhc2xlZXAgd2hlbiB0aGV5IHNob3VsZG4ndC4gSWYgeW91IHdhbnQgdG8gZW5hYmxlIHNsZWVwaW5nIGluIHRoZSB3b3JsZCwgYnV0IHdhbnQgdG8gZGlzYWJsZSBpdCBmb3IgYSBwYXJ0aWN1bGFyIGJvZHksIHNlZSB7eyNjcm9zc0xpbmsgIkJvZHkvYWxsb3dTbGVlcDpwcm9wZXJ0eSJ9fUJvZHkuYWxsb3dTbGVlcHt7L2Nyb3NzTGlua319LgogICAgICAgKiBAcHJvcGVydHkgc2xlZXBNb2RlCiAgICAgICAqIEB0eXBlIHtudW1iZXJ9CiAgICAgICAqIEBkZWZhdWx0IFdvcmxkLk5PX1NMRUVQSU5HCiAgICAgICAqLwoKICAgICAgdGhpcy5zbGVlcE1vZGUgPSBXb3JsZC5OT19TTEVFUElORzsKICAgICAgLyoqCiAgICAgICAqIEBwcm9wZXJ0eSB7VW5pb25GaW5kfSB1bmlvbkZpbmQKICAgICAgICovCgogICAgICB0aGlzLnVuaW9uRmluZCA9IG5ldyBVbmlvbkZpbmQoMSk7IC8vIElkIGNvdW50ZXJzCgogICAgICB0aGlzLl9jb25zdHJhaW50SWRDb3VudGVyID0gMDsKICAgICAgdGhpcy5fYm9keUlkQ291bnRlciA9IDA7CiAgICAgIC8qKgogICAgICAgKiBAcHJvcGVydHkge092ZXJsYXBLZWVwZXJ9IG92ZXJsYXBLZWVwZXIKICAgICAgICovCgogICAgICB0aGlzLm92ZXJsYXBLZWVwZXIgPSBuZXcgT3ZlcmxhcEtlZXBlcigpOwogICAgfQoKICAgIFdvcmxkLnByb3RvdHlwZSA9IG5ldyBPYmplY3QoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7CiAgICBXb3JsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBXb3JsZDsKICAgIC8qKgogICAgICogRmlyZWQgYWZ0ZXIgdGhlIHN0ZXAoKS4KICAgICAqIEBldmVudCBwb3N0U3RlcAogICAgICovCgogICAgdmFyIHBvc3RTdGVwRXZlbnQgPSB7CiAgICAgIHR5cGU6ICJwb3N0U3RlcCIKICAgIH07CiAgICAvKioKICAgICAqIEZpcmVkIHdoZW4gYSBib2R5IGlzIGFkZGVkIHRvIHRoZSB3b3JsZC4KICAgICAqIEBldmVudCBhZGRCb2R5CiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHkKICAgICAqLwoKICAgIHZhciBhZGRCb2R5RXZlbnQgPSB7CiAgICAgIHR5cGU6ICJhZGRCb2R5IiwKICAgICAgYm9keTogbnVsbAogICAgfTsKICAgIC8qKgogICAgICogRmlyZWQgd2hlbiBhIGJvZHkgaXMgcmVtb3ZlZCBmcm9tIHRoZSB3b3JsZC4KICAgICAqIEBldmVudCByZW1vdmVCb2R5CiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHkKICAgICAqLwoKICAgIHZhciByZW1vdmVCb2R5RXZlbnQgPSB7CiAgICAgIHR5cGU6ICJyZW1vdmVCb2R5IiwKICAgICAgYm9keTogbnVsbAogICAgfTsKICAgIC8qKgogICAgICogRmlyZWQgd2hlbiBhIHNwcmluZyBpcyBhZGRlZCB0byB0aGUgd29ybGQuCiAgICAgKiBAZXZlbnQgYWRkU3ByaW5nCiAgICAgKiBAcGFyYW0ge1NwcmluZ30gc3ByaW5nCiAgICAgKi8KCiAgICB2YXIgYWRkU3ByaW5nRXZlbnQgPSB7CiAgICAgIHR5cGU6ICJhZGRTcHJpbmciLAogICAgICBzcHJpbmc6IG51bGwKICAgIH07CiAgICAvKioKICAgICAqIEZpcmVkIHdoZW4gYSBmaXJzdCBjb250YWN0IGlzIGNyZWF0ZWQgYmV0d2VlbiB0d28gYm9kaWVzLiBUaGlzIGV2ZW50IGlzIGZpcmVkIGFmdGVyIHRoZSBzdGVwIGhhcyBiZWVuIGRvbmUuCiAgICAgKiBAZXZlbnQgaW1wYWN0CiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlCCiAgICAgKiBAZGVwcmVjYXRlZCBJbXBhY3QgZXZlbnQgd2lsbCBiZSByZW1vdmVkLiBVc2UgYmVnaW5Db250YWN0IGluc3RlYWQuCiAgICAgKi8KCiAgICB2YXIgaW1wYWN0RXZlbnQgPSB7CiAgICAgIHR5cGU6ICJpbXBhY3QiLAogICAgICBib2R5QTogbnVsbCwKICAgICAgYm9keUI6IG51bGwsCiAgICAgIHNoYXBlQTogbnVsbCwKICAgICAgc2hhcGVCOiBudWxsLAogICAgICBjb250YWN0RXF1YXRpb246IG51bGwKICAgIH07CiAgICAvKioKICAgICAqIEZpcmVkIGFmdGVyIHRoZSBCcm9hZHBoYXNlIGhhcyBjb2xsZWN0ZWQgY29sbGlzaW9uIHBhaXJzIGluIHRoZSB3b3JsZC4KICAgICAqIEluc2lkZSB0aGUgZXZlbnQgaGFuZGxlciwgeW91IGNhbiBtb2RpZnkgdGhlIHBhaXJzIGFycmF5IGFzIHlvdSBsaWtlLCB0bwogICAgICogcHJldmVudCBjb2xsaXNpb25zIGJldHdlZW4gb2JqZWN0cyB0aGF0IHlvdSBkb24ndCB3YW50LgogICAgICogQGV2ZW50IHBvc3RCcm9hZHBoYXNlCiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYWlycyBBbiBhcnJheSBvZiBjb2xsaXNpb24gcGFpcnMuIElmIHRoaXMgYXJyYXkgaXMgW2JvZHkxLGJvZHkyLGJvZHkzLGJvZHk0XSwgdGhlbiB0aGUgYm9keSBwYWlycyAxLDIgYW5kIDMsNCB3b3VsZCBhZHZhbmNlIHRvIG5hcnJvd3BoYXNlLgogICAgICovCgogICAgdmFyIHBvc3RCcm9hZHBoYXNlRXZlbnQgPSB7CiAgICAgIHR5cGU6ICJwb3N0QnJvYWRwaGFzZSIsCiAgICAgIHBhaXJzOiBudWxsCiAgICB9OwogICAgLyoqCiAgICAgKiBGaXJlZCB3aGVuIHR3byBzaGFwZXMgc3RhcnRzIHN0YXJ0IHRvIG92ZXJsYXAuIEZpcmVkIGluIHRoZSBuYXJyb3dwaGFzZSwgZHVyaW5nIHN0ZXAuCiAgICAgKiBAZXZlbnQgYmVnaW5Db250YWN0CiAgICAgKiBAcGFyYW0ge1NoYXBlfSBzaGFwZUEKICAgICAqIEBwYXJhbSB7U2hhcGV9IHNoYXBlQgogICAgICogQHBhcmFtIHtCb2R5fSAgYm9keUEKICAgICAqIEBwYXJhbSB7Qm9keX0gIGJvZHlCCiAgICAgKiBAcGFyYW0ge0FycmF5fSBjb250YWN0RXF1YXRpb25zCiAgICAgKi8KCiAgICB2YXIgYmVnaW5Db250YWN0RXZlbnQgPSB7CiAgICAgIHR5cGU6ICJiZWdpbkNvbnRhY3QiLAogICAgICBzaGFwZUE6IG51bGwsCiAgICAgIHNoYXBlQjogbnVsbCwKICAgICAgYm9keUE6IG51bGwsCiAgICAgIGJvZHlCOiBudWxsLAogICAgICBjb250YWN0RXF1YXRpb25zOiBbXQogICAgfTsKICAgIC8qKgogICAgICogRmlyZWQgd2hlbiB0d28gc2hhcGVzIHN0b3Agb3ZlcmxhcHBpbmcsIGFmdGVyIHRoZSBuYXJyb3dwaGFzZSAoZHVyaW5nIHN0ZXApLgogICAgICogQGV2ZW50IGVuZENvbnRhY3QKICAgICAqIEBwYXJhbSB7U2hhcGV9IHNoYXBlQQogICAgICogQHBhcmFtIHtTaGFwZX0gc2hhcGVCCiAgICAgKiBAcGFyYW0ge0JvZHl9ICBib2R5QQogICAgICogQHBhcmFtIHtCb2R5fSAgYm9keUIKICAgICAqLwoKICAgIHZhciBlbmRDb250YWN0RXZlbnQgPSB7CiAgICAgIHR5cGU6ICJlbmRDb250YWN0IiwKICAgICAgc2hhcGVBOiBudWxsLAogICAgICBzaGFwZUI6IG51bGwsCiAgICAgIGJvZHlBOiBudWxsLAogICAgICBib2R5QjogbnVsbAogICAgfTsKICAgIC8qKgogICAgICogRmlyZWQganVzdCBiZWZvcmUgZXF1YXRpb25zIGFyZSBhZGRlZCB0byB0aGUgc29sdmVyIHRvIGJlIHNvbHZlZC4gQ2FuIGJlIHVzZWQgdG8gY29udHJvbCB3aGF0IGVxdWF0aW9ucyBnb2VzIGludG8gdGhlIHNvbHZlci4KICAgICAqIEBldmVudCBwcmVTb2x2ZQogICAgICogQHBhcmFtIHtBcnJheX0gY29udGFjdEVxdWF0aW9ucyAgQW4gYXJyYXkgb2YgY29udGFjdHMgdG8gYmUgc29sdmVkLgogICAgICogQHBhcmFtIHtBcnJheX0gZnJpY3Rpb25FcXVhdGlvbnMgQW4gYXJyYXkgb2YgZnJpY3Rpb24gZXF1YXRpb25zIHRvIGJlIHNvbHZlZC4KICAgICAqLwoKICAgIHZhciBwcmVTb2x2ZUV2ZW50ID0gewogICAgICB0eXBlOiAicHJlU29sdmUiLAogICAgICBjb250YWN0RXF1YXRpb25zOiBudWxsLAogICAgICBmcmljdGlvbkVxdWF0aW9uczogbnVsbAogICAgfTsKICAgIC8qKgogICAgICogTmV2ZXIgZGVhY3RpdmF0ZSBib2RpZXMuCiAgICAgKiBAc3RhdGljCiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTk9fU0xFRVBJTkcKICAgICAqLwoKICAgIFdvcmxkLk5PX1NMRUVQSU5HID0gMTsKICAgIC8qKgogICAgICogRGVhY3RpdmF0ZSBpbmRpdmlkdWFsIGJvZGllcyBpZiB0aGV5IGFyZSBzbGVlcHkuCiAgICAgKiBAc3RhdGljCiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQk9EWV9TTEVFUElORwogICAgICovCgogICAgV29ybGQuQk9EWV9TTEVFUElORyA9IDI7CiAgICAvKioKICAgICAqIERlYWN0aXZhdGVzIGJvZGllcyB0aGF0IGFyZSBpbiBjb250YWN0LCBpZiBhbGwgb2YgdGhlbSBhcmUgc2xlZXB5LiBOb3RlIHRoYXQgeW91IG11c3QgZW5hYmxlIHt7I2Nyb3NzTGluayAiV29ybGQvaXNsYW5kU3BsaXQ6cHJvcGVydHkifX0uaXNsYW5kU3BsaXR7ey9jcm9zc0xpbmt9fSBmb3IgdGhpcyB0byB3b3JrLgogICAgICogQHN0YXRpYwogICAgICogQHByb3BlcnR5IHtudW1iZXJ9IElTTEFORF9TTEVFUElORwogICAgICovCgogICAgV29ybGQuSVNMQU5EX1NMRUVQSU5HID0gNDsKICAgIC8qKgogICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgc2ltdWxhdGlvbi4gTm90ZSB0aGF0IGJvdGggYm9kaWVzIGNvbm5lY3RlZCB0byB0aGUgY29uc3RyYWludCBtdXN0IGJlIGFkZGVkIHRvIHRoZSB3b3JsZCBmaXJzdC4gQWxzbyBub3RlIHRoYXQgeW91IGNhbid0IHJ1biB0aGlzIG1ldGhvZCBkdXJpbmcgc3RlcC4KICAgICAqCiAgICAgKiBAbWV0aG9kIGFkZENvbnN0cmFpbnQKICAgICAqIEBwYXJhbSB7Q29uc3RyYWludH0gY29uc3RyYWludAogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgY29uc3RyYWludCA9IG5ldyBMb2NrQ29uc3RyYWludChib2R5QSwgYm9keUIpOwogICAgICogICAgIHdvcmxkLmFkZENvbnN0cmFpbnQoY29uc3RyYWludCk7CiAgICAgKi8KCiAgICBXb3JsZC5wcm90b3R5cGUuYWRkQ29uc3RyYWludCA9IGZ1bmN0aW9uIChjb25zdHJhaW50KSB7CiAgICAgIGlmICh0aGlzLnN0ZXBwaW5nKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25zdHJhaW50cyBjYW5ub3QgYmUgYWRkZWQgZHVyaW5nIHN0ZXAuJyk7CiAgICAgIH0KCiAgICAgIHZhciBib2RpZXMgPSB0aGlzLmJvZGllczsKCiAgICAgIGlmIChib2RpZXMuaW5kZXhPZihjb25zdHJhaW50LmJvZHlBKSA9PT0gLTEpIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgQ29uc3RyYWludDogYm9keUEgaXMgbm90IGFkZGVkIHRvIHRoZSBXb3JsZC4nKTsKICAgICAgfQoKICAgICAgaWYgKGJvZGllcy5pbmRleE9mKGNvbnN0cmFpbnQuYm9keUIpID09PSAtMSkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBDb25zdHJhaW50OiBib2R5QiBpcyBub3QgYWRkZWQgdG8gdGhlIFdvcmxkLicpOwogICAgICB9CgogICAgICB0aGlzLmNvbnN0cmFpbnRzLnB1c2goY29uc3RyYWludCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBBZGQgYSBDb250YWN0TWF0ZXJpYWwgdG8gdGhlIHNpbXVsYXRpb24uCiAgICAgKiBAbWV0aG9kIGFkZENvbnRhY3RNYXRlcmlhbAogICAgICogQHBhcmFtIHtDb250YWN0TWF0ZXJpYWx9IGNvbnRhY3RNYXRlcmlhbAogICAgICovCgoKICAgIFdvcmxkLnByb3RvdHlwZS5hZGRDb250YWN0TWF0ZXJpYWwgPSBmdW5jdGlvbiAoY29udGFjdE1hdGVyaWFsKSB7CiAgICAgIHRoaXMuY29udGFjdE1hdGVyaWFscy5wdXNoKGNvbnRhY3RNYXRlcmlhbCk7CiAgICB9OwogICAgLyoqCiAgICAgKiBSZW1vdmVzIGEgY29udGFjdCBtYXRlcmlhbAogICAgICoKICAgICAqIEBtZXRob2QgcmVtb3ZlQ29udGFjdE1hdGVyaWFsCiAgICAgKiBAcGFyYW0ge0NvbnRhY3RNYXRlcmlhbH0gY20KICAgICAqLwoKCiAgICBXb3JsZC5wcm90b3R5cGUucmVtb3ZlQ29udGFjdE1hdGVyaWFsID0gZnVuY3Rpb24gKGNtKSB7CiAgICAgIGFycmF5UmVtb3ZlKHRoaXMuY29udGFjdE1hdGVyaWFscywgY20pOwogICAgfTsKICAgIC8qKgogICAgICogR2V0IGEgY29udGFjdCBtYXRlcmlhbCBnaXZlbiB0d28gbWF0ZXJpYWxzCiAgICAgKiBAbWV0aG9kIGdldENvbnRhY3RNYXRlcmlhbAogICAgICogQHBhcmFtIHtNYXRlcmlhbH0gbWF0ZXJpYWxBCiAgICAgKiBAcGFyYW0ge01hdGVyaWFsfSBtYXRlcmlhbEIKICAgICAqIEByZXR1cm4ge0NvbnRhY3RNYXRlcmlhbH0gVGhlIG1hdGNoaW5nIENvbnRhY3RNYXRlcmlhbCwgb3IgZmFsc2Ugb24gZmFpbC4KICAgICAqIEB0b2RvIFVzZSBmYXN0ZXIgaGFzaCBtYXAgdG8gbG9va3VwIGZyb20gbWF0ZXJpYWwgaWQncwogICAgICovCgoKICAgIFdvcmxkLnByb3RvdHlwZS5nZXRDb250YWN0TWF0ZXJpYWwgPSBmdW5jdGlvbiAobWF0ZXJpYWxBLCBtYXRlcmlhbEIpIHsKICAgICAgdmFyIGNtYXRzID0gdGhpcy5jb250YWN0TWF0ZXJpYWxzOwoKICAgICAgZm9yICh2YXIgaSA9IDAsIE4gPSBjbWF0cy5sZW5ndGg7IGkgIT09IE47IGkrKykgewogICAgICAgIHZhciBjbSA9IGNtYXRzW2ldOwoKICAgICAgICBpZiAoY20ubWF0ZXJpYWxBID09PSBtYXRlcmlhbEEgJiYgY20ubWF0ZXJpYWxCID09PSBtYXRlcmlhbEIgfHwgY20ubWF0ZXJpYWxBID09PSBtYXRlcmlhbEIgJiYgY20ubWF0ZXJpYWxCID09PSBtYXRlcmlhbEEpIHsKICAgICAgICAgIHJldHVybiBjbTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiBmYWxzZTsKICAgIH07CiAgICAvKioKICAgICAqIFJlbW92ZXMgYSBjb25zdHJhaW50LiBOb3RlIHRoYXQgeW91IGNhbid0IHJ1biB0aGlzIG1ldGhvZCBkdXJpbmcgc3RlcC4KICAgICAqCiAgICAgKiBAbWV0aG9kIHJlbW92ZUNvbnN0cmFpbnQKICAgICAqIEBwYXJhbSB7Q29uc3RyYWludH0gY29uc3RyYWludAogICAgICovCgoKICAgIFdvcmxkLnByb3RvdHlwZS5yZW1vdmVDb25zdHJhaW50ID0gZnVuY3Rpb24gKGNvbnN0cmFpbnQpIHsKICAgICAgaWYgKHRoaXMuc3RlcHBpbmcpIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnN0cmFpbnRzIGNhbm5vdCBiZSByZW1vdmVkIGR1cmluZyBzdGVwLicpOwogICAgICB9CgogICAgICBhcnJheVJlbW92ZSh0aGlzLmNvbnN0cmFpbnRzLCBjb25zdHJhaW50KTsKICAgIH07CgogICAgdmFyIHN0ZXBfbWcgPSB2ZWMyLmNyZWF0ZSgpLAogICAgICAgIHhpdyA9IHZlYzIuY3JlYXRlKCksCiAgICAgICAgeGp3ID0gdmVjMi5jcmVhdGUoKTsKICAgIC8qKgogICAgICogU3RlcCB0aGUgcGh5c2ljcyB3b3JsZCBmb3J3YXJkIGluIHRpbWUuCiAgICAgKgogICAgICogVGhlcmUgYXJlIHR3byBtb2Rlcy4gVGhlIHNpbXBsZSBtb2RlIGlzIGZpeGVkIHRpbWVzdGVwcGluZyB3aXRob3V0IGludGVycG9sYXRpb24uIEluIHRoaXMgY2FzZSB5b3Ugb25seSB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50LiBUaGUgc2Vjb25kIGNhc2UgdXNlcyBpbnRlcnBvbGF0aW9uLiBJbiB0aGF0IHlvdSBhbHNvIHByb3ZpZGUgdGhlIHRpbWUgc2luY2UgdGhlIGZ1bmN0aW9uIHdhcyBsYXN0IHVzZWQsIGFzIHdlbGwgYXMgdGhlIG1heGltdW0gZml4ZWQgdGltZXN0ZXBzIHRvIHRha2UuCiAgICAgKgogICAgICogQG1ldGhvZCBzdGVwCiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHQgICAgICAgICAgICAgICAgICAgICAgIFRoZSBmaXhlZCB0aW1lIHN0ZXAgc2l6ZSB0byB1c2UuCiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVTaW5jZUxhc3RDYWxsZWQ9MF0gIFRoZSB0aW1lIGVsYXBzZWQgc2luY2UgdGhlIGZ1bmN0aW9uIHdhcyBsYXN0IGNhbGxlZC4KICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbbWF4U3ViU3RlcHM9MTBdICAgICAgICAgTWF4aW11bSBudW1iZXIgb2YgZml4ZWQgc3RlcHMgdG8gdGFrZSBwZXIgZnVuY3Rpb24gY2FsbC4KICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIFNpbXBsZSBmaXhlZCB0aW1lc3RlcHBpbmcgd2l0aG91dCBpbnRlcnBvbGF0aW9uCiAgICAgKiAgICAgdmFyIGZpeGVkVGltZVN0ZXAgPSAxIC8gNjA7CiAgICAgKiAgICAgdmFyIHdvcmxkID0gbmV3IFdvcmxkKCk7CiAgICAgKiAgICAgdmFyIGJvZHkgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSk7CiAgICAgKiAgICAgd29ybGQuYWRkQm9keShib2R5KTsKICAgICAqCiAgICAgKiAgICAgZnVuY3Rpb24gYW5pbWF0ZSgpewogICAgICogICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7CiAgICAgKiAgICAgICAgIHdvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCk7CiAgICAgKiAgICAgICAgIHJlbmRlckJvZHkoYm9keS5wb3NpdGlvbiwgYm9keS5hbmdsZSk7CiAgICAgKiAgICAgfQogICAgICoKICAgICAqICAgICAvLyBTdGFydCBhbmltYXRpb24gbG9vcAogICAgICogICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTsKICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIEZpeGVkIHRpbWVzdGVwcGluZyB3aXRoIGludGVycG9sYXRpb24KICAgICAqICAgICB2YXIgbWF4U3ViU3RlcHMgPSAxMDsKICAgICAqICAgICB2YXIgbGFzdFRpbWVTZWNvbmRzOwogICAgICoKICAgICAqICAgICBmdW5jdGlvbiBhbmltYXRlKHRpbWUpewogICAgICogICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7CiAgICAgKiAgICAgICAgIHZhciB0aW1lU2Vjb25kcyA9IHRpbWUgLyAxMDAwOwogICAgICoKICAgICAqICAgICAgICAgaWYobGFzdFRpbWVTZWNvbmRzKXsKICAgICAqICAgICAgICAgICAgIHZhciBkZWx0YVRpbWUgPSB0aW1lU2Vjb25kcyAtIGxhc3RUaW1lU2Vjb25kczsKICAgICAqICAgICAgICAgICAgIHdvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZGVsdGFUaW1lLCBtYXhTdWJTdGVwcyk7CiAgICAgKiAgICAgICAgIH0KICAgICAqCiAgICAgKiAgICAgICAgIGxhc3RUaW1lU2Vjb25kcyA9IHRpbWVTZWNvbmRzOwogICAgICoKICAgICAqICAgICAgICAgcmVuZGVyQm9keShib2R5LmludGVycG9sYXRlZFBvc2l0aW9uLCBib2R5LmludGVycG9sYXRlZEFuZ2xlKTsKICAgICAqICAgICB9CiAgICAgKgogICAgICogICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBsb29wCiAgICAgKiAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpOwogICAgICoKICAgICAqIEBzZWUgaHR0cDovL2J1bGxldHBoeXNpY3Mub3JnL21lZGlhd2lraS0xLjUuOC9pbmRleC5waHAvU3RlcHBpbmdfVGhlX1dvcmxkCiAgICAgKi8KCiAgICBXb3JsZC5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uIChkdCwgdGltZVNpbmNlTGFzdENhbGxlZCwgbWF4U3ViU3RlcHMpIHsKICAgICAgbWF4U3ViU3RlcHMgPSBtYXhTdWJTdGVwcyB8fCAxMDsKICAgICAgdGltZVNpbmNlTGFzdENhbGxlZCA9IHRpbWVTaW5jZUxhc3RDYWxsZWQgfHwgMDsKCiAgICAgIGlmICh0aW1lU2luY2VMYXN0Q2FsbGVkID09PSAwKSB7CiAgICAgICAgLy8gRml4ZWQsIHNpbXBsZSBzdGVwcGluZwogICAgICAgIHRoaXMuaW50ZXJuYWxTdGVwKGR0KTsgLy8gSW5jcmVtZW50IHRpbWUKCiAgICAgICAgdGhpcy50aW1lICs9IGR0OwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuYWNjdW11bGF0b3IgKz0gdGltZVNpbmNlTGFzdENhbGxlZDsKICAgICAgICB2YXIgc3Vic3RlcHMgPSAwOwoKICAgICAgICB3aGlsZSAodGhpcy5hY2N1bXVsYXRvciA+PSBkdCAmJiBzdWJzdGVwcyA8IG1heFN1YlN0ZXBzKSB7CiAgICAgICAgICAvLyBEbyBmaXhlZCBzdGVwcyB0byBjYXRjaCB1cAogICAgICAgICAgdGhpcy5pbnRlcm5hbFN0ZXAoZHQpOwogICAgICAgICAgdGhpcy50aW1lICs9IGR0OwogICAgICAgICAgdGhpcy5hY2N1bXVsYXRvciAtPSBkdDsKICAgICAgICAgIHN1YnN0ZXBzKys7CiAgICAgICAgfQoKICAgICAgICB2YXIgdCA9IHRoaXMuYWNjdW11bGF0b3IgJSBkdCAvIGR0OwoKICAgICAgICBmb3IgKHZhciBqID0gMDsgaiAhPT0gdGhpcy5ib2RpZXMubGVuZ3RoOyBqKyspIHsKICAgICAgICAgIHZhciBiID0gdGhpcy5ib2RpZXNbal07CiAgICAgICAgICB2ZWMyLmxlcnAoYi5pbnRlcnBvbGF0ZWRQb3NpdGlvbiwgYi5wcmV2aW91c1Bvc2l0aW9uLCBiLnBvc2l0aW9uLCB0KTsKICAgICAgICAgIGIuaW50ZXJwb2xhdGVkQW5nbGUgPSBiLnByZXZpb3VzQW5nbGUgKyB0ICogKGIuYW5nbGUgLSBiLnByZXZpb3VzQW5nbGUpOwogICAgICAgIH0KICAgICAgfQogICAgfTsKCiAgICB2YXIgZW5kT3ZlcmxhcHMgPSBbXTsKICAgIC8qKgogICAgICogTWFrZSBhIGZpeGVkIHN0ZXAuCiAgICAgKiBAbWV0aG9kIGludGVybmFsU3RlcAogICAgICogQHBhcmFtICB7bnVtYmVyfSBkdAogICAgICogQHByaXZhdGUKICAgICAqLwoKICAgIFdvcmxkLnByb3RvdHlwZS5pbnRlcm5hbFN0ZXAgPSBmdW5jdGlvbiAoZHQpIHsKICAgICAgdGhpcy5zdGVwcGluZyA9IHRydWU7CiAgICAgIHZhciBOc3ByaW5ncyA9IHRoaXMuc3ByaW5ncy5sZW5ndGgsCiAgICAgICAgICBzcHJpbmdzID0gdGhpcy5zcHJpbmdzLAogICAgICAgICAgYm9kaWVzID0gdGhpcy5ib2RpZXMsCiAgICAgICAgICBnID0gdGhpcy5ncmF2aXR5LAogICAgICAgICAgc29sdmVyID0gdGhpcy5zb2x2ZXIsCiAgICAgICAgICBOYm9kaWVzID0gdGhpcy5ib2RpZXMubGVuZ3RoLAogICAgICAgICAgYnJvYWRwaGFzZSA9IHRoaXMuYnJvYWRwaGFzZSwKICAgICAgICAgIG5wID0gdGhpcy5uYXJyb3dwaGFzZSwKICAgICAgICAgIGNvbnN0cmFpbnRzID0gdGhpcy5jb25zdHJhaW50cywKICAgICAgICAgIG1nID0gc3RlcF9tZywKICAgICAgICAgIGFkZCA9IHZlYzIuYWRkOwogICAgICB0aGlzLm92ZXJsYXBLZWVwZXIudGljaygpOwogICAgICB0aGlzLmxhc3RUaW1lU3RlcCA9IGR0OyAvLyBVcGRhdGUgYXBwcm94aW1hdGUgZnJpY3Rpb24gZ3Jhdml0eS4KCiAgICAgIGlmICh0aGlzLnVzZVdvcmxkR3Jhdml0eUFzRnJpY3Rpb25HcmF2aXR5KSB7CiAgICAgICAgdmFyIGdyYXZpdHlMZW4gPSB2ZWMyLmxlbmd0aCh0aGlzLmdyYXZpdHkpOwoKICAgICAgICBpZiAoIShncmF2aXR5TGVuID09PSAwICYmIHRoaXMudXNlRnJpY3Rpb25HcmF2aXR5T25aZXJvR3Jhdml0eSkpIHsKICAgICAgICAgIC8vIE5vbnplcm8gZ3Jhdml0eS4gVXNlIGl0LgogICAgICAgICAgdGhpcy5mcmljdGlvbkdyYXZpdHkgPSBncmF2aXR5TGVuOwogICAgICAgIH0KICAgICAgfSAvLyBBZGQgZ3Jhdml0eSB0byBib2RpZXMKCgogICAgICBpZiAodGhpcy5hcHBseUdyYXZpdHkpIHsKICAgICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgICB2YXIgYiA9IGJvZGllc1tpXSwKICAgICAgICAgICAgICBmaSA9IGIuZm9yY2U7CgogICAgICAgICAgaWYgKGIudHlwZSAhPT0gQm9keS5EWU5BTUlDIHx8IGIuc2xlZXBTdGF0ZSA9PT0gQm9keS5TTEVFUElORykgewogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIH0KCiAgICAgICAgICB2ZWMyLnNjYWxlKG1nLCBnLCBiLm1hc3MgKiBiLmdyYXZpdHlTY2FsZSk7IC8vIEY9bSpnCgogICAgICAgICAgYWRkKGZpLCBmaSwgbWcpOwogICAgICAgIH0KICAgICAgfSAvLyBBZGQgc3ByaW5nIGZvcmNlcwoKCiAgICAgIGlmICh0aGlzLmFwcGx5U3ByaW5nRm9yY2VzKSB7CiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IE5zcHJpbmdzOyBpKyspIHsKICAgICAgICAgIHZhciBzID0gc3ByaW5nc1tpXTsKICAgICAgICAgIHMuYXBwbHlGb3JjZSgpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHRoaXMuYXBwbHlEYW1waW5nKSB7CiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IE5ib2RpZXM7IGkrKykgewogICAgICAgICAgdmFyIGIgPSBib2RpZXNbaV07CgogICAgICAgICAgaWYgKGIudHlwZSA9PT0gQm9keS5EWU5BTUlDKSB7CiAgICAgICAgICAgIGIuYXBwbHlEYW1waW5nKGR0KTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0gLy8gQnJvYWRwaGFzZQoKCiAgICAgIHZhciByZXN1bHQgPSBicm9hZHBoYXNlLmdldENvbGxpc2lvblBhaXJzKHRoaXMpOyAvLyBSZW1vdmUgaWdub3JlZCBjb2xsaXNpb24gcGFpcnMKCiAgICAgIHZhciBpZ25vcmVkUGFpcnMgPSB0aGlzLmRpc2FibGVkQm9keUNvbGxpc2lvblBhaXJzOwoKICAgICAgZm9yICh2YXIgaSA9IGlnbm9yZWRQYWlycy5sZW5ndGggLSAyOyBpID49IDA7IGkgLT0gMikgewogICAgICAgIGZvciAodmFyIGogPSByZXN1bHQubGVuZ3RoIC0gMjsgaiA+PSAwOyBqIC09IDIpIHsKICAgICAgICAgIGlmIChpZ25vcmVkUGFpcnNbaV0gPT09IHJlc3VsdFtqXSAmJiBpZ25vcmVkUGFpcnNbaSArIDFdID09PSByZXN1bHRbaiArIDFdIHx8IGlnbm9yZWRQYWlyc1tpICsgMV0gPT09IHJlc3VsdFtqXSAmJiBpZ25vcmVkUGFpcnNbaV0gPT09IHJlc3VsdFtqICsgMV0pIHsKICAgICAgICAgICAgcmVzdWx0LnNwbGljZShqLCAyKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0gLy8gUmVtb3ZlIGNvbnN0cmFpbmVkIHBhaXJzIHdpdGggY29sbGlkZUNvbm5lY3RlZCA9PSBmYWxzZQoKCiAgICAgIHZhciBOY29uc3RyYWludHMgPSBjb25zdHJhaW50cy5sZW5ndGg7CgogICAgICBmb3IgKGkgPSAwOyBpICE9PSBOY29uc3RyYWludHM7IGkrKykgewogICAgICAgIHZhciBjID0gY29uc3RyYWludHNbaV07CgogICAgICAgIGlmICghYy5jb2xsaWRlQ29ubmVjdGVkKSB7CiAgICAgICAgICBmb3IgKHZhciBqID0gcmVzdWx0Lmxlbmd0aCAtIDI7IGogPj0gMDsgaiAtPSAyKSB7CiAgICAgICAgICAgIGlmIChjLmJvZHlBID09PSByZXN1bHRbal0gJiYgYy5ib2R5QiA9PT0gcmVzdWx0W2ogKyAxXSB8fCBjLmJvZHlCID09PSByZXN1bHRbal0gJiYgYy5ib2R5QSA9PT0gcmVzdWx0W2ogKyAxXSkgewogICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoaiwgMik7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0gLy8gcG9zdEJyb2FkcGhhc2UgZXZlbnQKCgogICAgICBwb3N0QnJvYWRwaGFzZUV2ZW50LnBhaXJzID0gcmVzdWx0OwogICAgICB0aGlzLmVtaXQocG9zdEJyb2FkcGhhc2VFdmVudCk7CiAgICAgIHBvc3RCcm9hZHBoYXNlRXZlbnQucGFpcnMgPSBudWxsOyAvLyBOYXJyb3dwaGFzZQoKICAgICAgbnAucmVzZXQoKTsKICAgICAgdmFyIGRlZmF1bHRDb250YWN0TWF0ZXJpYWwgPSB0aGlzLmRlZmF1bHRDb250YWN0TWF0ZXJpYWw7CiAgICAgIHZhciBmcmljdGlvbkdyYXZpdHkgPSB0aGlzLmZyaWN0aW9uR3Jhdml0eTsKCiAgICAgIGZvciAodmFyIGkgPSAwLCBOcmVzdWx0cyA9IHJlc3VsdC5sZW5ndGg7IGkgIT09IE5yZXN1bHRzOyBpICs9IDIpIHsKICAgICAgICB2YXIgYmkgPSByZXN1bHRbaV0sCiAgICAgICAgICAgIGJqID0gcmVzdWx0W2kgKyAxXTsgLy8gTG9vcCBvdmVyIGFsbCBzaGFwZXMgb2YgYm9keSBpCgogICAgICAgIGZvciAodmFyIGsgPSAwLCBOc2hhcGVzaSA9IGJpLnNoYXBlcy5sZW5ndGg7IGsgIT09IE5zaGFwZXNpOyBrKyspIHsKICAgICAgICAgIHZhciBzaSA9IGJpLnNoYXBlc1trXSwKICAgICAgICAgICAgICB4aSA9IHNpLnBvc2l0aW9uLAogICAgICAgICAgICAgIGFpID0gc2kuYW5nbGU7IC8vIEFsbCBzaGFwZXMgb2YgYm9keSBqCgogICAgICAgICAgZm9yICh2YXIgbCA9IDAsIE5zaGFwZXNqID0gYmouc2hhcGVzLmxlbmd0aDsgbCAhPT0gTnNoYXBlc2o7IGwrKykgewogICAgICAgICAgICB2YXIgc2ogPSBiai5zaGFwZXNbbF0sCiAgICAgICAgICAgICAgICB4aiA9IHNqLnBvc2l0aW9uLAogICAgICAgICAgICAgICAgYWogPSBzai5hbmdsZTsKICAgICAgICAgICAgdmFyIGNvbnRhY3RNYXRlcmlhbCA9IG51bGw7CgogICAgICAgICAgICBpZiAoc2kubWF0ZXJpYWwgJiYgc2oubWF0ZXJpYWwpIHsKICAgICAgICAgICAgICBjb250YWN0TWF0ZXJpYWwgPSB0aGlzLmdldENvbnRhY3RNYXRlcmlhbChzaS5tYXRlcmlhbCwgc2oubWF0ZXJpYWwpOwogICAgICAgICAgICB9CgogICAgICAgICAgICBydW5OYXJyb3dwaGFzZSh0aGlzLCBucCwgYmksIHNpLCB4aSwgYWksIGJqLCBzaiwgeGosIGFqLCBjb250YWN0TWF0ZXJpYWwgfHwgZGVmYXVsdENvbnRhY3RNYXRlcmlhbCwgZnJpY3Rpb25HcmF2aXR5KTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0gLy8gV2FrZSB1cCBib2RpZXMKCgogICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgdmFyIGJvZHkgPSBib2RpZXNbaV07CgogICAgICAgIGlmIChib2R5Ll93YWtlVXBBZnRlck5hcnJvd3BoYXNlKSB7CiAgICAgICAgICBib2R5Lndha2VVcCgpOwogICAgICAgICAgYm9keS5fd2FrZVVwQWZ0ZXJOYXJyb3dwaGFzZSA9IGZhbHNlOwogICAgICAgIH0KICAgICAgfSAvLyBFbWl0IGVuZCBvdmVybGFwIGV2ZW50cwoKCiAgICAgIGlmICh0aGlzLmhhcygnZW5kQ29udGFjdCcpKSB7CiAgICAgICAgdGhpcy5vdmVybGFwS2VlcGVyLmdldEVuZE92ZXJsYXBzKGVuZE92ZXJsYXBzKTsKICAgICAgICB2YXIgZSA9IGVuZENvbnRhY3RFdmVudDsKICAgICAgICB2YXIgbCA9IGVuZE92ZXJsYXBzLmxlbmd0aDsKCiAgICAgICAgd2hpbGUgKGwtLSkgewogICAgICAgICAgdmFyIGRhdGEgPSBlbmRPdmVybGFwc1tsXTsKICAgICAgICAgIGUuc2hhcGVBID0gZGF0YS5zaGFwZUE7CiAgICAgICAgICBlLnNoYXBlQiA9IGRhdGEuc2hhcGVCOwogICAgICAgICAgZS5ib2R5QSA9IGRhdGEuYm9keUE7CiAgICAgICAgICBlLmJvZHlCID0gZGF0YS5ib2R5QjsKICAgICAgICAgIHRoaXMuZW1pdChlKTsKICAgICAgICB9CgogICAgICAgIGVuZE92ZXJsYXBzLmxlbmd0aCA9IDA7CiAgICAgIH0KCiAgICAgIHByZVNvbHZlRXZlbnQuY29udGFjdEVxdWF0aW9ucyA9IG5wLmNvbnRhY3RFcXVhdGlvbnM7CiAgICAgIHByZVNvbHZlRXZlbnQuZnJpY3Rpb25FcXVhdGlvbnMgPSBucC5mcmljdGlvbkVxdWF0aW9uczsKICAgICAgdGhpcy5lbWl0KHByZVNvbHZlRXZlbnQpOwogICAgICBwcmVTb2x2ZUV2ZW50LmNvbnRhY3RFcXVhdGlvbnMgPSBwcmVTb2x2ZUV2ZW50LmZyaWN0aW9uRXF1YXRpb25zID0gbnVsbDsgLy8gdXBkYXRlIGNvbnN0cmFpbnQgZXF1YXRpb25zCgogICAgICB2YXIgTmNvbnN0cmFpbnRzID0gY29uc3RyYWludHMubGVuZ3RoOwoKICAgICAgZm9yIChpID0gMDsgaSAhPT0gTmNvbnN0cmFpbnRzOyBpKyspIHsKICAgICAgICBjb25zdHJhaW50c1tpXS51cGRhdGUoKTsKICAgICAgfQoKICAgICAgaWYgKG5wLmNvbnRhY3RFcXVhdGlvbnMubGVuZ3RoIHx8IG5wLmZyaWN0aW9uRXF1YXRpb25zLmxlbmd0aCB8fCBOY29uc3RyYWludHMpIHsKICAgICAgICAvLyBHZXQgYWxsIGVxdWF0aW9ucwogICAgICAgIHZhciBlcXVhdGlvbnMgPSBbXTsKICAgICAgICBVdGlscy5hcHBlbmRBcnJheShlcXVhdGlvbnMsIG5wLmNvbnRhY3RFcXVhdGlvbnMpOwogICAgICAgIFV0aWxzLmFwcGVuZEFycmF5KGVxdWF0aW9ucywgbnAuZnJpY3Rpb25FcXVhdGlvbnMpOwoKICAgICAgICBmb3IgKGkgPSAwOyBpICE9PSBOY29uc3RyYWludHM7IGkrKykgewogICAgICAgICAgVXRpbHMuYXBwZW5kQXJyYXkoZXF1YXRpb25zLCBjb25zdHJhaW50c1tpXS5lcXVhdGlvbnMpOwogICAgICAgIH0KCiAgICAgICAgaWYgKHRoaXMuaXNsYW5kU3BsaXQpIHsKICAgICAgICAgIC8vIEluaXRpYWxpemUgdGhlIFVuaW9uRmluZAogICAgICAgICAgdmFyIHVuaW9uRmluZCA9IHRoaXMudW5pb25GaW5kOwogICAgICAgICAgdW5pb25GaW5kLnJlc2l6ZSh0aGlzLmJvZGllcy5sZW5ndGggKyAxKTsgLy8gVXBkYXRlIGVxdWF0aW9uIGluZGV4CgogICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcXVhdGlvbnMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgZXF1YXRpb25zW2ldLmluZGV4ID0gaTsKICAgICAgICAgIH0gLy8gVW5pdGUgYm9kaWVzIGlmIHRoZXkgYXJlIGNvbm5lY3RlZCBieSBhbiBlcXVhdGlvbgoKCiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVxdWF0aW9ucy5sZW5ndGg7IGkrKykgewogICAgICAgICAgICB2YXIgYm9keUEgPSBlcXVhdGlvbnNbaV0uYm9keUE7CiAgICAgICAgICAgIHZhciBib2R5QiA9IGVxdWF0aW9uc1tpXS5ib2R5QjsKCiAgICAgICAgICAgIGlmIChib2R5QS50eXBlID09PSBCb2R5LkRZTkFNSUMgJiYgYm9keUIudHlwZSA9PT0gQm9keS5EWU5BTUlDKSB7CiAgICAgICAgICAgICAgdW5pb25GaW5kLnVuaW9uKGJvZHlBLmluZGV4LCBib2R5Qi5pbmRleCk7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0gLy8gRmluZCB0aGUgYm9keSBpc2xhbmRzCgoKICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9kaWVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICAgIHZhciBib2R5ID0gYm9kaWVzW2ldOwogICAgICAgICAgICBib2R5LmlzbGFuZElkID0gYm9keS50eXBlID09PSBCb2R5LkRZTkFNSUMgPyB1bmlvbkZpbmQuZmluZChib2R5LmluZGV4KSA6IC0xOwogICAgICAgICAgfSAvLyBTb3J0IGVxdWF0aW9ucyBieSBpc2xhbmQKCgogICAgICAgICAgZXF1YXRpb25zID0gZXF1YXRpb25zLnNvcnQoc29ydEVxdWF0aW9uc0J5SXNsYW5kKTsKICAgICAgICAgIHZhciBlcXVhdGlvbkluZGV4ID0gMDsKCiAgICAgICAgICB3aGlsZSAoZXF1YXRpb25JbmRleCA8IGVxdWF0aW9ucy5sZW5ndGgpIHsKICAgICAgICAgICAgdmFyIGVxdWF0aW9uID0gZXF1YXRpb25zW2VxdWF0aW9uSW5kZXgrK107CiAgICAgICAgICAgIHNvbHZlci5hZGRFcXVhdGlvbihlcXVhdGlvbik7CiAgICAgICAgICAgIHZhciBjdXJyZW50SXNsYW5kSWQgPSBlcXVhdGlvbi5ib2R5QS5pc2xhbmRJZCA+IDAgPyBlcXVhdGlvbi5ib2R5QS5pc2xhbmRJZCA6IGVxdWF0aW9uLmJvZHlCLmlzbGFuZElkOwogICAgICAgICAgICB2YXIgbmV4dElzbGFuZElkID0gLTE7CgogICAgICAgICAgICBpZiAoZXF1YXRpb25zW2VxdWF0aW9uSW5kZXhdKSB7CiAgICAgICAgICAgICAgbmV4dElzbGFuZElkID0gZXF1YXRpb25zW2VxdWF0aW9uSW5kZXhdLmJvZHlBLmlzbGFuZElkID4gMCA/IGVxdWF0aW9uc1tlcXVhdGlvbkluZGV4XS5ib2R5QS5pc2xhbmRJZCA6IGVxdWF0aW9uc1tlcXVhdGlvbkluZGV4XS5ib2R5Qi5pc2xhbmRJZDsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgaWYgKG5leHRJc2xhbmRJZCAhPT0gY3VycmVudElzbGFuZElkIHx8IGVxdWF0aW9uSW5kZXggPT09IGVxdWF0aW9ucy5sZW5ndGgpIHsKICAgICAgICAgICAgICAvLyBTb2x2ZSB0aGlzIGlzbGFuZAogICAgICAgICAgICAgIGlmICh0aGlzLnNvbHZlQ29uc3RyYWludHMpIHsKICAgICAgICAgICAgICAgIHNvbHZlci5zb2x2ZShkdCwgdGhpcyk7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICBzb2x2ZXIucmVtb3ZlQWxsRXF1YXRpb25zKCk7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9IGVsc2UgewogICAgICAgICAgLy8gU29sdmUgYWxsIGFzIG9uZSBpc2xhbmQKICAgICAgICAgIHNvbHZlci5hZGRFcXVhdGlvbnMoZXF1YXRpb25zKTsKCiAgICAgICAgICBpZiAodGhpcy5zb2x2ZUNvbnN0cmFpbnRzKSB7CiAgICAgICAgICAgIHNvbHZlci5zb2x2ZShkdCwgdGhpcyk7CiAgICAgICAgICB9CgogICAgICAgICAgc29sdmVyLnJlbW92ZUFsbEVxdWF0aW9ucygpOwogICAgICAgIH0KICAgICAgfSAvLyBTdGVwIGZvcndhcmQKCgogICAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgdmFyIGJvZHkgPSBib2RpZXNbaV07CgogICAgICAgIGlmIChib2R5LnR5cGUgPT09IEJvZHkuRFlOQU1JQyB8fCBib2R5LnR5cGUgPT09IEJvZHkuS0lORU1BVElDKSB7CiAgICAgICAgICBib2R5LmludGVncmF0ZShkdCk7CiAgICAgICAgfQogICAgICB9IC8vIFJlc2V0IGZvcmNlCgoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IE5ib2RpZXM7IGkrKykgewogICAgICAgIGJvZGllc1tpXS5zZXRaZXJvRm9yY2UoKTsKICAgICAgfSAvLyBFbWl0IGltcGFjdCBldmVudAoKCiAgICAgIGlmICh0aGlzLmVtaXRJbXBhY3RFdmVudCAmJiB0aGlzLmhhcygnaW1wYWN0JykpIHsKICAgICAgICB2YXIgZXYgPSBpbXBhY3RFdmVudDsKCiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IG5wLmNvbnRhY3RFcXVhdGlvbnMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIHZhciBlcSA9IG5wLmNvbnRhY3RFcXVhdGlvbnNbaV07CgogICAgICAgICAgaWYgKGVxLmZpcnN0SW1wYWN0KSB7CiAgICAgICAgICAgIGV2LmJvZHlBID0gZXEuYm9keUE7CiAgICAgICAgICAgIGV2LmJvZHlCID0gZXEuYm9keUI7CiAgICAgICAgICAgIGV2LnNoYXBlQSA9IGVxLnNoYXBlQTsKICAgICAgICAgICAgZXYuc2hhcGVCID0gZXEuc2hhcGVCOwogICAgICAgICAgICBldi5jb250YWN0RXF1YXRpb24gPSBlcTsKICAgICAgICAgICAgdGhpcy5lbWl0KGV2KTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0gLy8gU2xlZXBpbmcgdXBkYXRlCgoKICAgICAgaWYgKHRoaXMuc2xlZXBNb2RlID09PSBXb3JsZC5CT0RZX1NMRUVQSU5HKSB7CiAgICAgICAgZm9yIChpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgICBib2RpZXNbaV0uc2xlZXBUaWNrKHRoaXMudGltZSwgZmFsc2UsIGR0KTsKICAgICAgICB9CiAgICAgIH0gZWxzZSBpZiAodGhpcy5zbGVlcE1vZGUgPT09IFdvcmxkLklTTEFORF9TTEVFUElORyAmJiB0aGlzLmlzbGFuZFNwbGl0KSB7CiAgICAgICAgLy8gVGVsbCBhbGwgYm9kaWVzIHRvIHNsZWVwIHRpY2sgYnV0IGRvbnQgc2xlZXAgeWV0CiAgICAgICAgZm9yIChpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgICBib2RpZXNbaV0uc2xlZXBUaWNrKHRoaXMudGltZSwgdHJ1ZSwgZHQpOwogICAgICAgIH0gLy8gU2xlZXAgaXNsYW5kcwoKCiAgICAgICAgdmFyIGJvZGllc1NvcnRlZEJ5SXNsYW5kID0gYm9kaWVzLnNvcnQoc29ydEJvZGllc0J5SXNsYW5kKTsKICAgICAgICB2YXIgaXNsYW5kRW5kID0gMTsKCiAgICAgICAgZm9yICh2YXIgaXNsYW5kU3RhcnQgPSAwOyBpc2xhbmRTdGFydCA8IGJvZGllc1NvcnRlZEJ5SXNsYW5kLmxlbmd0aDsgaXNsYW5kU3RhcnQgPSBpc2xhbmRFbmQpIHsKICAgICAgICAgIHZhciBpc2xhbmRJZCA9IGJvZGllc1NvcnRlZEJ5SXNsYW5kW2lzbGFuZFN0YXJ0XS5pc2xhbmRJZDsgLy8gR2V0IGlzbGFuZEVuZCBpbmRleAoKICAgICAgICAgIC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi8KCiAgICAgICAgICBmb3IgKGlzbGFuZEVuZCA9IGlzbGFuZFN0YXJ0ICsgMTsgaXNsYW5kRW5kIDwgYm9kaWVzU29ydGVkQnlJc2xhbmQubGVuZ3RoICYmIGJvZGllc1NvcnRlZEJ5SXNsYW5kW2lzbGFuZEVuZF0uaXNsYW5kSWQgPT09IGlzbGFuZElkOyBpc2xhbmRFbmQrKykge30KICAgICAgICAgIC8qIGpzaGludCBpZ25vcmU6ZW5kICovCiAgICAgICAgICAvLyBEb24ndCBjaGVjayBzdGF0aWMgb2JqZWN0cwoKCiAgICAgICAgICBpZiAoaXNsYW5kSWQgPT09IC0xKSB7CiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgfQoKICAgICAgICAgIHZhciBpc2xhbmRTaG91bGRTbGVlcCA9IHRydWU7CgogICAgICAgICAgZm9yICh2YXIgaSA9IGlzbGFuZFN0YXJ0OyBpIDwgaXNsYW5kRW5kOyBpKyspIHsKICAgICAgICAgICAgaWYgKCFib2RpZXNTb3J0ZWRCeUlzbGFuZFtpXS53YW50c1RvU2xlZXApIHsKICAgICAgICAgICAgICBpc2xhbmRTaG91bGRTbGVlcCA9IGZhbHNlOwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGlzbGFuZFNob3VsZFNsZWVwKSB7CiAgICAgICAgICAgIGZvciAodmFyIGkgPSBpc2xhbmRTdGFydDsgaSA8IGlzbGFuZEVuZDsgaSsrKSB7CiAgICAgICAgICAgICAgYm9kaWVzU29ydGVkQnlJc2xhbmRbaV0uc2xlZXAoKTsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgdGhpcy5zdGVwcGluZyA9IGZhbHNlOwogICAgICB0aGlzLmVtaXQocG9zdFN0ZXBFdmVudCk7CiAgICB9OwoKICAgIGZ1bmN0aW9uIHNvcnRCb2RpZXNCeUlzbGFuZChhLCBiKSB7CiAgICAgIHJldHVybiBhLmlzbGFuZElkIC0gYi5pc2xhbmRJZDsKICAgIH0KCiAgICBmdW5jdGlvbiBzb3J0RXF1YXRpb25zQnlJc2xhbmQoZXF1YXRpb25BLCBlcXVhdGlvbkIpIHsKICAgICAgdmFyIGlzbGFuZEEgPSBlcXVhdGlvbkEuYm9keUEuaXNsYW5kSWQgPiAwID8gZXF1YXRpb25BLmJvZHlBLmlzbGFuZElkIDogZXF1YXRpb25BLmJvZHlCLmlzbGFuZElkOwogICAgICB2YXIgaXNsYW5kQiA9IGVxdWF0aW9uQi5ib2R5QS5pc2xhbmRJZCA+IDAgPyBlcXVhdGlvbkIuYm9keUEuaXNsYW5kSWQgOiBlcXVhdGlvbkIuYm9keUIuaXNsYW5kSWQ7CgogICAgICBpZiAoaXNsYW5kQSAhPT0gaXNsYW5kQikgewogICAgICAgIHJldHVybiBpc2xhbmRBIC0gaXNsYW5kQjsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBTb3J0IGJ5IGVxdWF0aW9uIHR5cGUgaWYgc2FtZSBpc2xhbmQKICAgICAgICByZXR1cm4gZXF1YXRpb25BLmluZGV4IC0gZXF1YXRpb25CLmluZGV4OwogICAgICB9CiAgICB9CgogICAgZnVuY3Rpb24gcnVuTmFycm93cGhhc2Uod29ybGQsIG5wLCBiaSwgc2ksIHhpLCBhaSwgYmosIHNqLCB4aiwgYWosIGNtLCBnbGVuKSB7CiAgICAgIC8vIENoZWNrIGNvbGxpc2lvbiBncm91cHMgYW5kIG1hc2tzCiAgICAgIGlmICghKChzaS5jb2xsaXNpb25Hcm91cCAmIHNqLmNvbGxpc2lvbk1hc2spICE9PSAwICYmIChzai5jb2xsaXNpb25Hcm91cCAmIHNpLmNvbGxpc2lvbk1hc2spICE9PSAwKSkgewogICAgICAgIHJldHVybjsKICAgICAgfSAvLyBHZXQgd29ybGQgcG9zaXRpb24gYW5kIGFuZ2xlIG9mIGVhY2ggc2hhcGUKCgogICAgICB2ZWMyLnRvR2xvYmFsRnJhbWUoeGl3LCB4aSwgYmkucG9zaXRpb24sIGJpLmFuZ2xlKTsKICAgICAgdmVjMi50b0dsb2JhbEZyYW1lKHhqdywgeGosIGJqLnBvc2l0aW9uLCBiai5hbmdsZSk7CgogICAgICBpZiAodmVjMi5kaXN0YW5jZSh4aXcsIHhqdykgPiBzaS5ib3VuZGluZ1JhZGl1cyArIHNqLmJvdW5kaW5nUmFkaXVzKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICB2YXIgYWl3ID0gYWkgKyBiaS5hbmdsZTsKICAgICAgdmFyIGFqdyA9IGFqICsgYmouYW5nbGU7CiAgICAgIG5wLmVuYWJsZUZyaWN0aW9uID0gY20uZnJpY3Rpb24gPiAwOwogICAgICB2YXIgcmVkdWNlZE1hc3M7CgogICAgICBpZiAoYmkudHlwZSA9PT0gQm9keS5TVEFUSUMgfHwgYmkudHlwZSA9PT0gQm9keS5LSU5FTUFUSUMpIHsKICAgICAgICByZWR1Y2VkTWFzcyA9IGJqLm1hc3M7CiAgICAgIH0gZWxzZSBpZiAoYmoudHlwZSA9PT0gQm9keS5TVEFUSUMgfHwgYmoudHlwZSA9PT0gQm9keS5LSU5FTUFUSUMpIHsKICAgICAgICByZWR1Y2VkTWFzcyA9IGJpLm1hc3M7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgcmVkdWNlZE1hc3MgPSBiaS5tYXNzICogYmoubWFzcyAvIChiaS5tYXNzICsgYmoubWFzcyk7CiAgICAgIH0KCiAgICAgIG5wLnNsaXBGb3JjZSA9IGNtLmZyaWN0aW9uICogZ2xlbiAqIHJlZHVjZWRNYXNzOwogICAgICBucC5jdXJyZW50Q29udGFjdE1hdGVyaWFsID0gY207CiAgICAgIG5wLmVuYWJsZWRFcXVhdGlvbnMgPSBiaS5jb2xsaXNpb25SZXNwb25zZSAmJiBiai5jb2xsaXNpb25SZXNwb25zZSAmJiBzaS5jb2xsaXNpb25SZXNwb25zZSAmJiBzai5jb2xsaXNpb25SZXNwb25zZTsKICAgICAgdmFyIHJlc29sdmVyID0gbnBbc2kudHlwZSB8IHNqLnR5cGVdLAogICAgICAgICAgbnVtQ29udGFjdHMgPSAwOwoKICAgICAgaWYgKHJlc29sdmVyKSB7CiAgICAgICAgdmFyIHNlbnNvciA9IHNpLnNlbnNvciB8fCBzai5zZW5zb3I7CiAgICAgICAgdmFyIG51bUZyaWN0aW9uQmVmb3JlID0gbnAuZnJpY3Rpb25FcXVhdGlvbnMubGVuZ3RoOwoKICAgICAgICBpZiAoc2kudHlwZSA8IHNqLnR5cGUpIHsKICAgICAgICAgIG51bUNvbnRhY3RzID0gcmVzb2x2ZXIuY2FsbChucCwgYmksIHNpLCB4aXcsIGFpdywgYmosIHNqLCB4ancsIGFqdywgc2Vuc29yKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgbnVtQ29udGFjdHMgPSByZXNvbHZlci5jYWxsKG5wLCBiaiwgc2osIHhqdywgYWp3LCBiaSwgc2ksIHhpdywgYWl3LCBzZW5zb3IpOwogICAgICAgIH0KCiAgICAgICAgdmFyIG51bUZyaWN0aW9uRXF1YXRpb25zID0gbnAuZnJpY3Rpb25FcXVhdGlvbnMubGVuZ3RoIC0gbnVtRnJpY3Rpb25CZWZvcmU7CgogICAgICAgIGlmIChudW1Db250YWN0cykgewogICAgICAgICAgaWYgKGJpLmFsbG93U2xlZXAgJiYgYmkudHlwZSA9PT0gQm9keS5EWU5BTUlDICYmIGJpLnNsZWVwU3RhdGUgPT09IEJvZHkuU0xFRVBJTkcgJiYgYmouc2xlZXBTdGF0ZSA9PT0gQm9keS5BV0FLRSAmJiBiai50eXBlICE9PSBCb2R5LlNUQVRJQykgewogICAgICAgICAgICB2YXIgc3BlZWRTcXVhcmVkQiA9IHZlYzIuc3F1YXJlZExlbmd0aChiai52ZWxvY2l0eSkgKyBNYXRoLnBvdyhiai5hbmd1bGFyVmVsb2NpdHksIDIpOwogICAgICAgICAgICB2YXIgc3BlZWRMaW1pdFNxdWFyZWRCID0gTWF0aC5wb3coYmouc2xlZXBTcGVlZExpbWl0LCAyKTsKCiAgICAgICAgICAgIGlmIChzcGVlZFNxdWFyZWRCID49IHNwZWVkTGltaXRTcXVhcmVkQiAqIDIpIHsKICAgICAgICAgICAgICBiaS5fd2FrZVVwQWZ0ZXJOYXJyb3dwaGFzZSA9IHRydWU7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoYmouYWxsb3dTbGVlcCAmJiBiai50eXBlID09PSBCb2R5LkRZTkFNSUMgJiYgYmouc2xlZXBTdGF0ZSA9PT0gQm9keS5TTEVFUElORyAmJiBiaS5zbGVlcFN0YXRlID09PSBCb2R5LkFXQUtFICYmIGJpLnR5cGUgIT09IEJvZHkuU1RBVElDKSB7CiAgICAgICAgICAgIHZhciBzcGVlZFNxdWFyZWRBID0gdmVjMi5zcXVhcmVkTGVuZ3RoKGJpLnZlbG9jaXR5KSArIE1hdGgucG93KGJpLmFuZ3VsYXJWZWxvY2l0eSwgMik7CiAgICAgICAgICAgIHZhciBzcGVlZExpbWl0U3F1YXJlZEEgPSBNYXRoLnBvdyhiaS5zbGVlcFNwZWVkTGltaXQsIDIpOwoKICAgICAgICAgICAgaWYgKHNwZWVkU3F1YXJlZEEgPj0gc3BlZWRMaW1pdFNxdWFyZWRBICogMikgewogICAgICAgICAgICAgIGJqLl93YWtlVXBBZnRlck5hcnJvd3BoYXNlID0gdHJ1ZTsKICAgICAgICAgICAgfQogICAgICAgICAgfQoKICAgICAgICAgIHdvcmxkLm92ZXJsYXBLZWVwZXIuc2V0T3ZlcmxhcHBpbmcoYmksIHNpLCBiaiwgc2opOwoKICAgICAgICAgIGlmICh3b3JsZC5oYXMoJ2JlZ2luQ29udGFjdCcpICYmIHdvcmxkLm92ZXJsYXBLZWVwZXIuaXNOZXdPdmVybGFwKHNpLCBzaikpIHsKICAgICAgICAgICAgLy8gUmVwb3J0IG5ldyBzaGFwZSBvdmVybGFwCiAgICAgICAgICAgIHZhciBlID0gYmVnaW5Db250YWN0RXZlbnQ7CiAgICAgICAgICAgIGUuc2hhcGVBID0gc2k7CiAgICAgICAgICAgIGUuc2hhcGVCID0gc2o7CiAgICAgICAgICAgIGUuYm9keUEgPSBiaTsKICAgICAgICAgICAgZS5ib2R5QiA9IGJqOyAvLyBSZXNldCBjb250YWN0IGVxdWF0aW9ucwoKICAgICAgICAgICAgZS5jb250YWN0RXF1YXRpb25zLmxlbmd0aCA9IDA7CgogICAgICAgICAgICBpZiAoIXNlbnNvcikgewogICAgICAgICAgICAgIGZvciAodmFyIGkgPSBucC5jb250YWN0RXF1YXRpb25zLmxlbmd0aCAtIG51bUNvbnRhY3RzOyBpIDwgbnAuY29udGFjdEVxdWF0aW9ucy5sZW5ndGg7IGkrKykgewogICAgICAgICAgICAgICAgZS5jb250YWN0RXF1YXRpb25zLnB1c2gobnAuY29udGFjdEVxdWF0aW9uc1tpXSk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CgogICAgICAgICAgICB3b3JsZC5lbWl0KGUpOwogICAgICAgICAgfSAvLyBkaXZpZGUgdGhlIG1heCBmcmljdGlvbiBmb3JjZSBieSB0aGUgbnVtYmVyIG9mIGNvbnRhY3RzCgoKICAgICAgICAgIGlmICghc2Vuc29yICYmIG51bUZyaWN0aW9uRXF1YXRpb25zID4gMSkgewogICAgICAgICAgICAvLyBXaHkgZGl2aWRlIGJ5IDE/CiAgICAgICAgICAgIGZvciAodmFyIGkgPSBucC5mcmljdGlvbkVxdWF0aW9ucy5sZW5ndGggLSBudW1GcmljdGlvbkVxdWF0aW9uczsgaSA8IG5wLmZyaWN0aW9uRXF1YXRpb25zLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICAgICAgdmFyIGYgPSBucC5mcmljdGlvbkVxdWF0aW9uc1tpXTsKICAgICAgICAgICAgICBmLnNldFNsaXBGb3JjZShmLmdldFNsaXBGb3JjZSgpIC8gbnVtRnJpY3Rpb25FcXVhdGlvbnMpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEFkZCBhIHNwcmluZyB0byB0aGUgc2ltdWxhdGlvbi4gTm90ZSB0aGF0IHRoaXMgb3BlcmF0aW9uIGNhbid0IGJlIGRvbmUgZHVyaW5nIHN0ZXAuCiAgICAgKgogICAgICogQG1ldGhvZCBhZGRTcHJpbmcKICAgICAqIEBwYXJhbSB7U3ByaW5nfSBzcHJpbmcKICAgICAqLwoKCiAgICBXb3JsZC5wcm90b3R5cGUuYWRkU3ByaW5nID0gZnVuY3Rpb24gKHNwcmluZykgewogICAgICBpZiAodGhpcy5zdGVwcGluZykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignU3ByaW5ncyBjYW5ub3QgYmUgYWRkZWQgZHVyaW5nIHN0ZXAuJyk7CiAgICAgIH0KCiAgICAgIHRoaXMuc3ByaW5ncy5wdXNoKHNwcmluZyk7CiAgICAgIGFkZFNwcmluZ0V2ZW50LnNwcmluZyA9IHNwcmluZzsKICAgICAgdGhpcy5lbWl0KGFkZFNwcmluZ0V2ZW50KTsKICAgICAgYWRkU3ByaW5nRXZlbnQuc3ByaW5nID0gbnVsbDsKICAgIH07CiAgICAvKioKICAgICAqIFJlbW92ZSBhIHNwcmluZy4gTm90ZSB0aGF0IHRoaXMgb3BlcmF0aW9uIGNhbid0IGJlIGRvbmUgZHVyaW5nIHN0ZXAuCiAgICAgKgogICAgICogQG1ldGhvZCByZW1vdmVTcHJpbmcKICAgICAqIEBwYXJhbSB7U3ByaW5nfSBzcHJpbmcKICAgICAqLwoKCiAgICBXb3JsZC5wcm90b3R5cGUucmVtb3ZlU3ByaW5nID0gZnVuY3Rpb24gKHNwcmluZykgewogICAgICBpZiAodGhpcy5zdGVwcGluZykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignU3ByaW5ncyBjYW5ub3QgYmUgcmVtb3ZlZCBkdXJpbmcgc3RlcC4nKTsKICAgICAgfQoKICAgICAgYXJyYXlSZW1vdmUodGhpcy5zcHJpbmdzLCBzcHJpbmcpOwogICAgfTsKICAgIC8qKgogICAgICogQWRkIGEgYm9keSB0byB0aGUgc2ltdWxhdGlvbi4gTm90ZSB0aGF0IHlvdSBjYW4ndCBhZGQgYSBib2R5IGR1cmluZyBzdGVwOiB5b3UgaGF2ZSB0byB3YWl0IHVudGlsIGFmdGVyIHRoZSBzdGVwIChzZWUgdGhlIHBvc3RTdGVwIGV2ZW50KS4KICAgICAqIEFsc28gbm90ZSB0aGF0IGJvZGllcyBjYW4gb25seSBiZSBhZGRlZCB0byBvbmUgV29ybGQgYXQgYSB0aW1lLgogICAgICoKICAgICAqIEBtZXRob2QgYWRkQm9keQogICAgICogQHBhcmFtIHtCb2R5fSBib2R5CiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgd29ybGQgPSBuZXcgV29ybGQoKSwKICAgICAqICAgICAgICAgYm9keSA9IG5ldyBCb2R5KCk7CiAgICAgKiAgICAgd29ybGQuYWRkQm9keShib2R5KTsKICAgICAqLwoKCiAgICBXb3JsZC5wcm90b3R5cGUuYWRkQm9keSA9IGZ1bmN0aW9uIChib2R5KSB7CiAgICAgIGlmICh0aGlzLnN0ZXBwaW5nKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb2RpZXMgY2Fubm90IGJlIGFkZGVkIGR1cmluZyBzdGVwLicpOwogICAgICB9IC8vIEFscmVhZHkgYWRkZWQ/CgoKICAgICAgaWYgKGJvZHkud29ybGQpIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvZHkgaXMgYWxyZWFkeSBhZGRlZCB0byBhIFdvcmxkLicpOwogICAgICB9CgogICAgICBib2R5LmluZGV4ID0gdGhpcy5ib2RpZXMubGVuZ3RoOwogICAgICB0aGlzLmJvZGllcy5wdXNoKGJvZHkpOwogICAgICBib2R5LndvcmxkID0gdGhpczsKICAgICAgYWRkQm9keUV2ZW50LmJvZHkgPSBib2R5OwogICAgICB0aGlzLmVtaXQoYWRkQm9keUV2ZW50KTsKICAgICAgYWRkQm9keUV2ZW50LmJvZHkgPSBudWxsOwogICAgfTsKICAgIC8qKgogICAgICogUmVtb3ZlIGEgYm9keSBmcm9tIHRoZSBzaW11bGF0aW9uLiBOb3RlIHRoYXQgYm9kaWVzIGNhbm5vdCBiZSByZW1vdmVkIGR1cmluZyBzdGVwIChmb3IgZXhhbXBsZSwgaW5zaWRlIHRoZSBiZWdpbkNvbnRhY3QgZXZlbnQpLiBJbiB0aGF0IGNhc2UgeW91IG5lZWQgdG8gd2FpdCB1bnRpbCB0aGUgc3RlcCBpcyBkb25lIChzZWUgdGhlIHBvc3RTdGVwIGV2ZW50KS4KICAgICAqCiAgICAgKiBBbHNvIG5vdGUgdGhhdCBhbnkgY29uc3RyYWludHMgY29ubmVjdGVkIHRvIHRoZSBib2R5IG11c3QgYmUgcmVtb3ZlZCBiZWZvcmUgdGhlIGJvZHkuCiAgICAgKgogICAgICogQG1ldGhvZCByZW1vdmVCb2R5CiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHkKICAgICAqCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIHZhciByZW1vdmVCb2R5OwogICAgICogICAgIHdvcmxkLm9uKCJiZWdpbkNvbnRhY3QiLGZ1bmN0aW9uKGV2ZW50KXsKICAgICAqICAgICAgICAgLy8gV2UgY2Fubm90IHJlbW92ZSB0aGUgYm9keSBoZXJlIHNpbmNlIHRoZSB3b3JsZCBpcyBzdGlsbCBzdGVwcGluZy4KICAgICAqICAgICAgICAgLy8gSW5zdGVhZCwgc2NoZWR1bGUgdGhlIGJvZHkgdG8gYmUgcmVtb3ZlZCBhZnRlciB0aGUgc3RlcCBpcyBkb25lLgogICAgICogICAgICAgICByZW1vdmVCb2R5ID0gYm9keTsKICAgICAqICAgICB9KTsKICAgICAqICAgICB3b3JsZC5vbigicG9zdFN0ZXAiLGZ1bmN0aW9uKGV2ZW50KXsKICAgICAqICAgICAgICAgaWYocmVtb3ZlQm9keSl7CiAgICAgKiAgICAgICAgICAgICAvLyBTYWZlbHkgcmVtb3ZlIHRoZSBib2R5IGZyb20gdGhlIHdvcmxkLgogICAgICogICAgICAgICAgICAgd29ybGQucmVtb3ZlQm9keShyZW1vdmVCb2R5KTsKICAgICAqICAgICAgICAgICAgIHJlbW92ZUJvZHkgPSBudWxsOwogICAgICogICAgICAgICB9CiAgICAgKiAgICAgfSk7CiAgICAgKi8KCgogICAgV29ybGQucHJvdG90eXBlLnJlbW92ZUJvZHkgPSBmdW5jdGlvbiAoYm9keSkgewogICAgICBpZiAodGhpcy5zdGVwcGluZykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignQm9kaWVzIGNhbm5vdCBiZSByZW1vdmVkIGR1cmluZyBzdGVwLicpOwogICAgICB9IC8vIFRPRE86IHdvdWxkIGl0IGJlIHNtYXJ0IHRvIGhhdmUgYSAuY29uc3RyYWludHMgYXJyYXkgb24gdGhlIGJvZHk/CgoKICAgICAgdmFyIGNvbnN0cmFpbnRzID0gdGhpcy5jb25zdHJhaW50czsKICAgICAgdmFyIGwgPSBjb25zdHJhaW50cy5sZW5ndGg7CgogICAgICB3aGlsZSAobC0tKSB7CiAgICAgICAgaWYgKGNvbnN0cmFpbnRzW2xdLmJvZHlBID09PSB0aGlzIHx8IGNvbnN0cmFpbnRzW2xdLmJvZHlCID09PSB0aGlzKSB7CiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZW1vdmUgQm9keSBmcm9tIFdvcmxkOiBpdCBzdGlsbCBoYXMgY29uc3RyYWludHMgY29ubmVjdGVkIHRvIGl0LicpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgYm9keS53b3JsZCA9IG51bGw7CiAgICAgIHZhciBib2RpZXMgPSB0aGlzLmJvZGllczsKICAgICAgYXJyYXlSZW1vdmUoYm9kaWVzLCBib2R5KTsKICAgICAgYm9keS5pbmRleCA9IC0xOwogICAgICB2YXIgbCA9IGJvZGllcy5sZW5ndGg7CgogICAgICB3aGlsZSAobC0tKSB7CiAgICAgICAgYm9kaWVzW2xdLmluZGV4ID0gbDsKICAgICAgfSAvLyBFbWl0IHJlbW92ZUJvZHkgZXZlbnQKCgogICAgICByZW1vdmVCb2R5RXZlbnQuYm9keSA9IGJvZHk7CiAgICAgIGJvZHkucmVzZXRDb25zdHJhaW50VmVsb2NpdHkoKTsKICAgICAgdGhpcy5lbWl0KHJlbW92ZUJvZHlFdmVudCk7CiAgICAgIHJlbW92ZUJvZHlFdmVudC5ib2R5ID0gbnVsbDsgLy8gUmVtb3ZlIGRpc2FibGVkIGJvZHkgY29sbGlzaW9uIHBhaXJzIHRoYXQgaW52b2x2ZSBib2R5CgogICAgICB2YXIgcGFpcnMgPSB0aGlzLmRpc2FibGVkQm9keUNvbGxpc2lvblBhaXJzOwogICAgICB2YXIgaSA9IDA7CgogICAgICB3aGlsZSAoaSA8IHBhaXJzLmxlbmd0aCkgewogICAgICAgIGlmIChwYWlyc1tpXSA9PT0gYm9keSB8fCBwYWlyc1tpICsgMV0gPT09IGJvZHkpIHsKICAgICAgICAgIHBhaXJzLnNwbGljZShpLCAyKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgaSArPSAyOwogICAgICAgIH0KICAgICAgfQogICAgfTsKICAgIC8qKgogICAgICogR2V0IGEgYm9keSBieSBpdHMgaWQuCiAgICAgKiBAbWV0aG9kIGdldEJvZHlCeUlkCiAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQKICAgICAqIEByZXR1cm4ge0JvZHl9IFRoZSBib2R5LCBvciBmYWxzZSBpZiBpdCB3YXMgbm90IGZvdW5kLgogICAgICovCgoKICAgIFdvcmxkLnByb3RvdHlwZS5nZXRCb2R5QnlJZCA9IGZ1bmN0aW9uIChpZCkgewogICAgICB2YXIgYm9kaWVzID0gdGhpcy5ib2RpZXM7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvZGllcy5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciBiID0gYm9kaWVzW2ldOwoKICAgICAgICBpZiAoYi5pZCA9PT0gaWQpIHsKICAgICAgICAgIHJldHVybiBiOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIGZhbHNlOwogICAgfTsKICAgIC8qKgogICAgICogRGlzYWJsZSBjb2xsaXNpb24gYmV0d2VlbiB0d28gYm9kaWVzCiAgICAgKiBAbWV0aG9kIGRpc2FibGVCb2R5Q29sbGlzaW9uCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlCCiAgICAgKi8KCgogICAgV29ybGQucHJvdG90eXBlLmRpc2FibGVCb2R5Q29sbGlzaW9uID0gZnVuY3Rpb24gKGJvZHlBLCBib2R5QikgewogICAgICB0aGlzLmRpc2FibGVkQm9keUNvbGxpc2lvblBhaXJzLnB1c2goYm9keUEsIGJvZHlCKTsKICAgIH07CiAgICAvKioKICAgICAqIEVuYWJsZSBjb2xsaXNpb25zIGJldHdlZW4gdGhlIGdpdmVuIHR3byBib2RpZXMsIGlmIHRoZXkgd2VyZSBwcmV2aW91c2x5IGRpc2FibGVkIHVzaW5nIC5kaXNhYmxlQm9keUNvbGxpc2lvbigpLgogICAgICogQG1ldGhvZCBlbmFibGVCb2R5Q29sbGlzaW9uCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlBCiAgICAgKiBAcGFyYW0ge0JvZHl9IGJvZHlCCiAgICAgKi8KCgogICAgV29ybGQucHJvdG90eXBlLmVuYWJsZUJvZHlDb2xsaXNpb24gPSBmdW5jdGlvbiAoYm9keUEsIGJvZHlCKSB7CiAgICAgIHZhciBwYWlycyA9IHRoaXMuZGlzYWJsZWRCb2R5Q29sbGlzaW9uUGFpcnM7CgogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhaXJzLmxlbmd0aDsgaSArPSAyKSB7CiAgICAgICAgaWYgKHBhaXJzW2ldID09PSBib2R5QSAmJiBwYWlyc1tpICsgMV0gPT09IGJvZHlCIHx8IHBhaXJzW2kgKyAxXSA9PT0gYm9keUEgJiYgcGFpcnNbaV0gPT09IGJvZHlCKSB7CiAgICAgICAgICBwYWlycy5zcGxpY2UoaSwgMik7CiAgICAgICAgICByZXR1cm47CiAgICAgICAgfQogICAgICB9CiAgICB9OwogICAgLyoqCiAgICAgKiBSZW1vdmVzIGFsbCBib2RpZXMsIGNvbnN0cmFpbnRzLCBzcHJpbmdzLCBhbmQgY29udGFjdCBtYXRlcmlhbHMgZnJvbSB0aGUgd29ybGQuCiAgICAgKiBAbWV0aG9kIGNsZWFyCiAgICAgKi8KCgogICAgV29ybGQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkgewogICAgICAvLyBSZW1vdmUgYWxsIHNvbHZlciBlcXVhdGlvbnMKICAgICAgdGhpcy5zb2x2ZXIucmVtb3ZlQWxsRXF1YXRpb25zKCk7IC8vIFJlbW92ZSBhbGwgY29uc3RyYWludHMKCiAgICAgIHZhciBjcyA9IHRoaXMuY29uc3RyYWludHM7CiAgICAgIHZhciBpID0gY3MubGVuZ3RoOwoKICAgICAgd2hpbGUgKGktLSkgewogICAgICAgIHRoaXMucmVtb3ZlQ29uc3RyYWludChjc1tpXSk7CiAgICAgIH0gLy8gUmVtb3ZlIGFsbCBib2RpZXMKCgogICAgICB2YXIgYm9kaWVzID0gdGhpcy5ib2RpZXM7CiAgICAgIGkgPSBib2RpZXMubGVuZ3RoOwoKICAgICAgd2hpbGUgKGktLSkgewogICAgICAgIHRoaXMucmVtb3ZlQm9keShib2RpZXNbaV0pOwogICAgICB9IC8vIFJlbW92ZSBhbGwgc3ByaW5ncwoKCiAgICAgIHZhciBzcHJpbmdzID0gdGhpcy5zcHJpbmdzOwogICAgICBpID0gc3ByaW5ncy5sZW5ndGg7CgogICAgICB3aGlsZSAoaS0tKSB7CiAgICAgICAgdGhpcy5yZW1vdmVTcHJpbmcoc3ByaW5nc1tpXSk7CiAgICAgIH0gLy8gUmVtb3ZlIGFsbCBjb250YWN0IG1hdGVyaWFscwoKCiAgICAgIHZhciBjbXMgPSB0aGlzLmNvbnRhY3RNYXRlcmlhbHM7CiAgICAgIGkgPSBjbXMubGVuZ3RoOwoKICAgICAgd2hpbGUgKGktLSkgewogICAgICAgIHRoaXMucmVtb3ZlQ29udGFjdE1hdGVyaWFsKGNtc1tpXSk7CiAgICAgIH0KICAgIH07CgogICAgdmFyIGhpdFRlc3RfdG1wMSA9IHZlYzIuY3JlYXRlKCksCiAgICAgICAgaGl0VGVzdF90bXAyID0gdmVjMi5jcmVhdGUoKTsKICAgIC8qKgogICAgICogVGVzdCBpZiBhIHdvcmxkIHBvaW50IG92ZXJsYXBzIGJvZGllcwogICAgICogQG1ldGhvZCBoaXRUZXN0CiAgICAgKiBAcGFyYW0gIHtBcnJheX0gd29ybGRQb2ludCBQb2ludCB0byB1c2UgZm9yIGludGVyc2VjdGlvbiB0ZXN0cwogICAgICogQHBhcmFtICB7QXJyYXl9IGJvZGllcyBBIGxpc3Qgb2Ygb2JqZWN0cyB0byBjaGVjayBmb3IgaW50ZXJzZWN0aW9uCiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHByZWNpc2lvbiBVc2VkIGZvciBtYXRjaGluZyBhZ2FpbnN0IHBhcnRpY2xlcyBhbmQgbGluZXMuIEFkZHMgc29tZSBtYXJnaW4gdG8gdGhlc2UgaW5maW5pdGVzaW1hbCBvYmplY3RzLgogICAgICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIGJvZGllcyB0aGF0IG92ZXJsYXAgdGhlIHBvaW50CiAgICAgKiBAdG9kbyBTaG91bGQgdXNlIGFuIGFwaSBzaW1pbGFyIHRvIHRoZSByYXljYXN0IGZ1bmN0aW9uCiAgICAgKiBAdG9kbyBTaG91bGQgcHJvYmFibHkgaW1wbGVtZW50IGEgLmNvbnRhaW5zUG9pbnQgbWV0aG9kIGZvciBhbGwgc2hhcGVzLiBXb3VsZCBiZSBtb3JlIGVmZmljaWVudAogICAgICogQHRvZG8gU2hvdWxkIHVzZSB0aGUgYnJvYWRwaGFzZQogICAgICogQHRvZG8gUmV0dXJuaW5nIHRoZSBoaXQgc2hhcGUgd291bGQgYmUgZmluZSAtIGl0IGNhcnJpZXMgYSByZWZlcmVuY2UgdG8gdGhlIGJvZHkgbm93CiAgICAgKi8KCiAgICBXb3JsZC5wcm90b3R5cGUuaGl0VGVzdCA9IGZ1bmN0aW9uICh3b3JsZFBvaW50LCBib2RpZXMsIHByZWNpc2lvbikgewogICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gfHwgMDsgLy8gQ3JlYXRlIGEgZHVtbXkgcGFydGljbGUgYm9keSB3aXRoIGEgcGFydGljbGUgc2hhcGUgdG8gdGVzdCBhZ2FpbnN0IHRoZSBib2RpZXMKCiAgICAgIHZhciBzaGFwZVdvcmxkUG9zaXRpb24gPSBoaXRUZXN0X3RtcDEsCiAgICAgICAgICBzaGFwZUxvY2FsUG9pbnQgPSBoaXRUZXN0X3RtcDI7CiAgICAgIHZhciByZXN1bHQgPSBbXTsgLy8gQ2hlY2sgYm9kaWVzCgogICAgICBmb3IgKHZhciBpID0gMCwgTiA9IGJvZGllcy5sZW5ndGg7IGkgIT09IE47IGkrKykgewogICAgICAgIHZhciBib2R5ID0gYm9kaWVzW2ldOwoKICAgICAgICBmb3IgKHZhciBqID0gMCwgTlMgPSBib2R5LnNoYXBlcy5sZW5ndGg7IGogIT09IE5TOyBqKyspIHsKICAgICAgICAgIHZhciBzaGFwZSA9IGJvZHkuc2hhcGVzW2pdOyAvLyBHZXQgbG9jYWwgcG9pbnQgcG9zaXRpb24gaW4gdGhlIHNoYXBlCgogICAgICAgICAgc2hhcGUud29ybGRQb2ludFRvTG9jYWwoc2hhcGVMb2NhbFBvaW50LCB3b3JsZFBvaW50KTsKCiAgICAgICAgICBpZiAoc2hhcGUucG9pbnRUZXN0KHNoYXBlTG9jYWxQb2ludCkpIHsKICAgICAgICAgICAgcmVzdWx0LnB1c2goYm9keSk7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAvLyBHZXQgc2hhcGUgd29ybGQgcG9zaXRpb24KICAgICAgICAgICAgdmVjMi5yb3RhdGUoc2hhcGVXb3JsZFBvc2l0aW9uLCBzaGFwZS5wb3NpdGlvbiwgYm9keS5hbmdsZSk7CiAgICAgICAgICAgIHZlYzIuYWRkKHNoYXBlV29ybGRQb3NpdGlvbiwgc2hhcGVXb3JsZFBvc2l0aW9uLCBib2R5LnBvc2l0aW9uKTsKCiAgICAgICAgICAgIGlmIChzaGFwZS50eXBlID09PSBTaGFwZS5QQVJUSUNMRSAmJiB2ZWMyLnNxdWFyZWREaXN0YW5jZShzaGFwZVdvcmxkUG9zaXRpb24sIHdvcmxkUG9pbnQpIDwgcHJlY2lzaW9uICogcHJlY2lzaW9uKSB7CiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYm9keSk7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9OwogICAgLyoqCiAgICAgKiBTZXQgdGhlIHN0aWZmbmVzcyBmb3IgYWxsIGVxdWF0aW9ucyBhbmQgY29udGFjdCBtYXRlcmlhbHMuCiAgICAgKiBAbWV0aG9kIHNldEdsb2JhbFN0aWZmbmVzcwogICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0aWZmbmVzcwogICAgICovCgoKICAgIFdvcmxkLnByb3RvdHlwZS5zZXRHbG9iYWxTdGlmZm5lc3MgPSBmdW5jdGlvbiAoc3RpZmZuZXNzKSB7CiAgICAgIHNldEdsb2JhbEVxdWF0aW9uUGFyYW1zKHRoaXMsIHsKICAgICAgICBzdGlmZm5lc3M6IHN0aWZmbmVzcwogICAgICB9KTsgLy8gU2V0IGZvciBhbGwgY29udGFjdCBtYXRlcmlhbHMKCiAgICAgIHZhciBjb250YWN0TWF0ZXJpYWxzID0gdGhpcy5jb250YWN0TWF0ZXJpYWxzOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IGNvbnRhY3RNYXRlcmlhbHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgYyA9IGNvbnRhY3RNYXRlcmlhbHNbaV07CiAgICAgICAgYy5zdGlmZm5lc3MgPSBjLmZyaWN0aW9uU3RpZmZuZXNzID0gc3RpZmZuZXNzOwogICAgICB9IC8vIFNldCBmb3IgZGVmYXVsdCBjb250YWN0IG1hdGVyaWFsCgoKICAgICAgdmFyIGMgPSB0aGlzLmRlZmF1bHRDb250YWN0TWF0ZXJpYWw7CiAgICAgIGMuc3RpZmZuZXNzID0gYy5mcmljdGlvblN0aWZmbmVzcyA9IHN0aWZmbmVzczsKICAgIH07CiAgICAvKioKICAgICAqIFNldCB0aGUgcmVsYXhhdGlvbiBmb3IgYWxsIGVxdWF0aW9ucyBhbmQgY29udGFjdCBtYXRlcmlhbHMuCiAgICAgKiBAbWV0aG9kIHNldEdsb2JhbFJlbGF4YXRpb24KICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZWxheGF0aW9uCiAgICAgKi8KCgogICAgV29ybGQucHJvdG90eXBlLnNldEdsb2JhbFJlbGF4YXRpb24gPSBmdW5jdGlvbiAocmVsYXhhdGlvbikgewogICAgICBzZXRHbG9iYWxFcXVhdGlvblBhcmFtcyh0aGlzLCB7CiAgICAgICAgcmVsYXhhdGlvbjogcmVsYXhhdGlvbgogICAgICB9KTsgLy8gU2V0IGZvciBhbGwgY29udGFjdCBtYXRlcmlhbHMKCiAgICAgIGZvciAodmFyIGkgPSAwOyBpICE9PSB0aGlzLmNvbnRhY3RNYXRlcmlhbHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB2YXIgYyA9IHRoaXMuY29udGFjdE1hdGVyaWFsc1tpXTsKICAgICAgICBjLnJlbGF4YXRpb24gPSBjLmZyaWN0aW9uUmVsYXhhdGlvbiA9IHJlbGF4YXRpb247CiAgICAgIH0gLy8gU2V0IGZvciBkZWZhdWx0IGNvbnRhY3QgbWF0ZXJpYWwKCgogICAgICB2YXIgYyA9IHRoaXMuZGVmYXVsdENvbnRhY3RNYXRlcmlhbDsKICAgICAgYy5yZWxheGF0aW9uID0gYy5mcmljdGlvblJlbGF4YXRpb24gPSByZWxheGF0aW9uOwogICAgfTsKCiAgICBmdW5jdGlvbiBzZXRHbG9iYWxFcXVhdGlvblBhcmFtcyh3b3JsZCwgcGFyYW1zKSB7CiAgICAgIHZhciBjb25zdHJhaW50cyA9IHdvcmxkLmNvbnN0cmFpbnRzOwoKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IGNvbnN0cmFpbnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIGMgPSBjb25zdHJhaW50c1tpXTsKICAgICAgICB2YXIgZXFzID0gYy5lcXVhdGlvbnM7CgogICAgICAgIGZvciAodmFyIGogPSAwOyBqICE9PSBlcXMubGVuZ3RoOyBqKyspIHsKICAgICAgICAgIHZhciBlcSA9IGVxc1tqXTsKICAgICAgICAgIGVxLnJlbGF4YXRpb24gPSBwYXJhbXMucmVsYXhhdGlvbiAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnJlbGF4YXRpb24gOiBlcS5yZWxheGF0aW9uOwogICAgICAgICAgZXEuc3RpZmZuZXNzID0gcGFyYW1zLnN0aWZmbmVzcyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnN0aWZmbmVzcyA6IGVxLnN0aWZmbmVzczsKICAgICAgICAgIGVxLm5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICB2YXIgdG1wQUFCQiA9IG5ldyBBQUJCKCk7CiAgICB2YXIgdG1wQXJyYXkgPSBbXTsKICAgIC8qKgogICAgICogUmF5IGNhc3QgYWdhaW5zdCBhbGwgYm9kaWVzIGluIHRoZSB3b3JsZC4KICAgICAqIEBtZXRob2QgcmF5Y2FzdAogICAgICogQHBhcmFtICB7UmF5Y2FzdFJlc3VsdH0gcmVzdWx0CiAgICAgKiBAcGFyYW0gIHtSYXl9IHJheQogICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBhbnkgYm9keSB3YXMgaGl0LgogICAgICoKICAgICAqIEBleGFtcGxlCiAgICAgKiAgICAgdmFyIHJheSA9IG5ldyBSYXkoewogICAgICogICAgICAgICBtb2RlOiBSYXkuQ0xPU0VTVCwgLy8gb3IgQU5ZCiAgICAgKiAgICAgICAgIGZyb206IFswLCAwXSwKICAgICAqICAgICAgICAgdG86IFsxMCwgMF0sCiAgICAgKiAgICAgfSk7CiAgICAgKiAgICAgdmFyIHJlc3VsdCA9IG5ldyBSYXljYXN0UmVzdWx0KCk7CiAgICAgKiAgICAgd29ybGQucmF5Y2FzdChyZXN1bHQsIHJheSk7CiAgICAgKgogICAgICogICAgIC8vIEdldCB0aGUgaGl0IHBvaW50CiAgICAgKiAgICAgdmFyIGhpdFBvaW50ID0gdmVjMi5jcmVhdGUoKTsKICAgICAqICAgICByZXN1bHQuZ2V0SGl0UG9pbnQoaGl0UG9pbnQsIHJheSk7CiAgICAgKiAgICAgY29uc29sZS5sb2coJ0hpdCBwb2ludDogJywgaGl0UG9pbnRbMF0sIGhpdFBvaW50WzFdLCAnIGF0IGRpc3RhbmNlICcgKyByZXN1bHQuZ2V0SGl0RGlzdGFuY2UocmF5KSk7CiAgICAgKgogICAgICogQGV4YW1wbGUKICAgICAqICAgICB2YXIgcmF5ID0gbmV3IFJheSh7CiAgICAgKiAgICAgICAgIG1vZGU6IFJheS5BTEwsCiAgICAgKiAgICAgICAgIGZyb206IFswLCAwXSwKICAgICAqICAgICAgICAgdG86IFsxMCwgMF0sCiAgICAgKiAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXN1bHQpewogICAgICoKICAgICAqICAgICAgICAgICAgIC8vIFByaW50IHNvbWUgaW5mbyBhYm91dCB0aGUgaGl0CiAgICAgKiAgICAgICAgICAgICBjb25zb2xlLmxvZygnSGl0IGJvZHkgYW5kIHNoYXBlOiAnLCByZXN1bHQuYm9keSwgcmVzdWx0LnNoYXBlKTsKICAgICAqCiAgICAgKiAgICAgICAgICAgICAvLyBHZXQgdGhlIGhpdCBwb2ludAogICAgICogICAgICAgICAgICAgdmFyIGhpdFBvaW50ID0gdmVjMi5jcmVhdGUoKTsKICAgICAqICAgICAgICAgICAgIHJlc3VsdC5nZXRIaXRQb2ludChoaXRQb2ludCwgcmF5KTsKICAgICAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIaXQgcG9pbnQ6ICcsIGhpdFBvaW50WzBdLCBoaXRQb2ludFsxXSwgJyBhdCBkaXN0YW5jZSAnICsgcmVzdWx0LmdldEhpdERpc3RhbmNlKHJheSkpOwogICAgICoKICAgICAqICAgICAgICAgICAgIC8vIElmIHlvdSBhcmUgaGFwcHkgd2l0aCB0aGUgaGl0cyB5b3UgZ290IHRoaXMgZmFyLCB5b3UgY2FuIHN0b3AgdGhlIHRyYXZlcnNhbCBoZXJlOgogICAgICogICAgICAgICAgICAgcmVzdWx0LnN0b3AoKTsKICAgICAqICAgICAgICAgfQogICAgICogICAgIH0pOwogICAgICogICAgIHZhciByZXN1bHQgPSBuZXcgUmF5Y2FzdFJlc3VsdCgpOwogICAgICogICAgIHdvcmxkLnJheWNhc3QocmVzdWx0LCByYXkpOwogICAgICovCgogICAgV29ybGQucHJvdG90eXBlLnJheWNhc3QgPSBmdW5jdGlvbiAocmVzdWx0LCByYXkpIHsKICAgICAgLy8gR2V0IGFsbCBib2RpZXMgd2l0aGluIHRoZSByYXkgQUFCQgogICAgICByYXkuZ2V0QUFCQih0bXBBQUJCKTsKICAgICAgdGhpcy5icm9hZHBoYXNlLmFhYmJRdWVyeSh0aGlzLCB0bXBBQUJCLCB0bXBBcnJheSk7CiAgICAgIHJheS5pbnRlcnNlY3RCb2RpZXMocmVzdWx0LCB0bXBBcnJheSk7CiAgICAgIHRtcEFycmF5Lmxlbmd0aCA9IDA7CiAgICAgIHJldHVybiByZXN1bHQuaGFzSGl0KCk7CiAgICB9OwoKICAgIC8vIEV4cG9ydCBwMiBjbGFzc2VzCiAgICBwMi5leHBvcnRzID0gewogICAgICBBQUJCOiBBQUJCXzEsCiAgICAgIEFuZ2xlTG9ja0VxdWF0aW9uOiBBbmdsZUxvY2tFcXVhdGlvbl8xLAogICAgICBCb2R5OiBCb2R5XzEsCiAgICAgIEJyb2FkcGhhc2U6IEJyb2FkcGhhc2VfMSwKICAgICAgQ2Fwc3VsZTogQ2Fwc3VsZV8xLAogICAgICBDaXJjbGU6IENpcmNsZV8xLAogICAgICBDb25zdHJhaW50OiBDb25zdHJhaW50XzEsCiAgICAgIENvbnRhY3RFcXVhdGlvbjogQ29udGFjdEVxdWF0aW9uXzEsCiAgICAgIENvbnRhY3RFcXVhdGlvblBvb2w6IENvbnRhY3RFcXVhdGlvblBvb2xfMSwKICAgICAgQ29udGFjdE1hdGVyaWFsOiBDb250YWN0TWF0ZXJpYWxfMSwKICAgICAgQ29udmV4OiBDb252ZXhfMSwKICAgICAgRGlzdGFuY2VDb25zdHJhaW50OiBEaXN0YW5jZUNvbnN0cmFpbnRfMSwKICAgICAgRXF1YXRpb246IEVxdWF0aW9uXzEsCiAgICAgIEV2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyXzEsCiAgICAgIEZyaWN0aW9uRXF1YXRpb246IEZyaWN0aW9uRXF1YXRpb25fMSwKICAgICAgRnJpY3Rpb25FcXVhdGlvblBvb2w6IEZyaWN0aW9uRXF1YXRpb25Qb29sXzEsCiAgICAgIEdlYXJDb25zdHJhaW50OiBHZWFyQ29uc3RyYWludF8xLAogICAgICBHU1NvbHZlcjogR1NTb2x2ZXJfMSwKICAgICAgSGVpZ2h0ZmllbGQ6IEhlaWdodGZpZWxkXzEsCiAgICAgIExpbmU6IExpbmVfMSwKICAgICAgTG9ja0NvbnN0cmFpbnQ6IExvY2tDb25zdHJhaW50XzEsCiAgICAgIE1hdGVyaWFsOiBNYXRlcmlhbF8xLAogICAgICBOYXJyb3dwaGFzZTogTmFycm93cGhhc2VfMSwKICAgICAgTmFpdmVCcm9hZHBoYXNlOiBOYWl2ZUJyb2FkcGhhc2VfMSwKICAgICAgUGFydGljbGU6IFBhcnRpY2xlXzEsCiAgICAgIFBsYW5lOiBQbGFuZV8xLAogICAgICBQb29sOiBQb29sXzEsCiAgICAgIFJldm9sdXRlQ29uc3RyYWludDogUmV2b2x1dGVDb25zdHJhaW50XzEsCiAgICAgIFByaXNtYXRpY0NvbnN0cmFpbnQ6IFByaXNtYXRpY0NvbnN0cmFpbnRfMSwKICAgICAgUmF5OiBSYXlfMSwKICAgICAgUmF5Y2FzdFJlc3VsdDogUmF5Y2FzdFJlc3VsdF8xLAogICAgICBCb3g6IEJveF8xLAogICAgICBSb3RhdGlvbmFsVmVsb2NpdHlFcXVhdGlvbjogUm90YXRpb25hbFZlbG9jaXR5RXF1YXRpb25fMSwKICAgICAgU0FQQnJvYWRwaGFzZTogU0FQQnJvYWRwaGFzZV8xLAogICAgICBTaGFwZTogU2hhcGVfMSwKICAgICAgU29sdmVyOiBTb2x2ZXJfMSwKICAgICAgU3ByaW5nOiBTcHJpbmdfMSwKICAgICAgVG9wRG93blZlaGljbGU6IFRvcERvd25WZWhpY2xlXzEsCiAgICAgIExpbmVhclNwcmluZzogTGluZWFyU3ByaW5nXzEsCiAgICAgIFJvdGF0aW9uYWxTcHJpbmc6IFJvdGF0aW9uYWxTcHJpbmdfMSwKICAgICAgVXRpbHM6IFV0aWxzXzEsCiAgICAgIFdvcmxkOiBXb3JsZF8xLAogICAgICB2ZWMyOiB2ZWMyJHEuZXhwb3J0cywKICAgICAgdmVyc2lvbjogJzAuNy4xJwogICAgfTsKCiAgICBmdW5jdGlvbiBleHBhbmRBQUJCKF9yZWYsIGFtb3VudCkgewogICAgICBsZXQgewogICAgICAgIGxvd2VyQm91bmQsCiAgICAgICAgdXBwZXJCb3VuZAogICAgICB9ID0gX3JlZjsKICAgICAgY29uc3QgaGFsZkFtb3VudCA9IGFtb3VudCAqIDAuNTsKICAgICAgbG93ZXJCb3VuZFswXSAtPSBoYWxmQW1vdW50OwogICAgICBsb3dlckJvdW5kWzFdIC09IGhhbGZBbW91bnQ7CiAgICAgIHVwcGVyQm91bmRbMF0gKz0gaGFsZkFtb3VudDsKICAgICAgdXBwZXJCb3VuZFsxXSArPSBoYWxmQW1vdW50OwogICAgfQoKICAgIGNsYXNzIFJheWNhc3RDb250cm9sbGVyIGV4dGVuZHMgcDIuZXhwb3J0cy5FdmVudEVtaXR0ZXIgewogICAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7CiAgICAgICAgc3VwZXIoKTsKICAgICAgICB0aGlzLndvcmxkID0gb3B0aW9ucy53b3JsZDsKICAgICAgICB0aGlzLmJvZHkgPSBvcHRpb25zLmJvZHk7CiAgICAgICAgdGhpcy5ib3VuZHMgPSBuZXcgcDIuZXhwb3J0cy5BQUJCKCk7CiAgICAgICAgdGhpcy5jb2xsaXNpb25NYXNrID0gb3B0aW9ucy5jb2xsaXNpb25NYXNrIHx8IC0xOwogICAgICAgIHRoaXMuc2tpbldpZHRoID0gb3B0aW9ucy5za2luV2lkdGggfHwgMC4wMTU7CiAgICAgICAgdGhpcy5kc3RCZXR3ZWVuUmF5cyA9IG9wdGlvbnMuZHN0QmV0d2VlblJheXMgfHwgMC4yNTsKICAgICAgICB0aGlzLmhvcml6b250YWxSYXlDb3VudCA9IDQ7CiAgICAgICAgdGhpcy52ZXJ0aWNhbFJheUNvdW50ID0gNDsKICAgICAgICB0aGlzLmhvcml6b250YWxSYXlTcGFjaW5nID0gMDsKICAgICAgICB0aGlzLnZlcnRpY2FsUmF5U3BhY2luZyA9IDA7CiAgICAgICAgdGhpcy5yYXljYXN0T3JpZ2lucyA9IHsKICAgICAgICAgIGJvdHRvbUxlZnQ6IHAyLmV4cG9ydHMudmVjMi5jcmVhdGUoKSwKICAgICAgICAgIGJvdHRvbVJpZ2h0OiBwMi5leHBvcnRzLnZlYzIuY3JlYXRlKCksCiAgICAgICAgICB0b3BMZWZ0OiBwMi5leHBvcnRzLnZlYzIuY3JlYXRlKCksCiAgICAgICAgICB0b3BSaWdodDogcDIuZXhwb3J0cy52ZWMyLmNyZWF0ZSgpCiAgICAgICAgfTsKICAgICAgICB0aGlzLmNhbGN1bGF0ZVJheVNwYWNpbmcoKTsKICAgICAgfQoKICAgICAgY2FsY3VsYXRlUmF5U3BhY2luZygpIHsKICAgICAgICB0aGlzLmJvZHkuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgICB0aGlzLmJvdW5kcy5jb3B5KHRoaXMuYm9keS5nZXRBQUJCKCkpOwogICAgICAgIGV4cGFuZEFBQkIodGhpcy5ib3VuZHMsIHRoaXMuc2tpbldpZHRoICogLTIpOwogICAgICAgIGNvbnN0IGJvdW5kc1dpZHRoID0gdGhpcy5ib3VuZHMudXBwZXJCb3VuZFswXSAtIHRoaXMuYm91bmRzLmxvd2VyQm91bmRbMF07CiAgICAgICAgY29uc3QgYm91bmRzSGVpZ2h0ID0gdGhpcy5ib3VuZHMudXBwZXJCb3VuZFsxXSAtIHRoaXMuYm91bmRzLmxvd2VyQm91bmRbMV07CiAgICAgICAgdGhpcy5ob3Jpem9udGFsUmF5Q291bnQgPSBNYXRoLnJvdW5kKGJvdW5kc0hlaWdodCAvIHRoaXMuZHN0QmV0d2VlblJheXMpOwogICAgICAgIHRoaXMudmVydGljYWxSYXlDb3VudCA9IE1hdGgucm91bmQoYm91bmRzV2lkdGggLyB0aGlzLmRzdEJldHdlZW5SYXlzKTsKICAgICAgICB0aGlzLmhvcml6b250YWxSYXlTcGFjaW5nID0gYm91bmRzSGVpZ2h0IC8gKHRoaXMuaG9yaXpvbnRhbFJheUNvdW50IC0gMSk7CiAgICAgICAgdGhpcy52ZXJ0aWNhbFJheVNwYWNpbmcgPSBib3VuZHNXaWR0aCAvICh0aGlzLnZlcnRpY2FsUmF5Q291bnQgLSAxKTsKICAgICAgfQoKICAgICAgdXBkYXRlUmF5Y2FzdE9yaWdpbnMoKSB7CiAgICAgICAgdGhpcy5jYWxjdWxhdGVSYXlTcGFjaW5nKCk7CiAgICAgICAgcDIuZXhwb3J0cy52ZWMyLnNldCh0aGlzLnJheWNhc3RPcmlnaW5zLmJvdHRvbUxlZnQsIHRoaXMuYm91bmRzLmxvd2VyQm91bmRbMF0sIHRoaXMuYm91bmRzLmxvd2VyQm91bmRbMV0pOwogICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQodGhpcy5yYXljYXN0T3JpZ2lucy5ib3R0b21SaWdodCwgdGhpcy5ib3VuZHMudXBwZXJCb3VuZFswXSwgdGhpcy5ib3VuZHMubG93ZXJCb3VuZFsxXSk7CiAgICAgICAgcDIuZXhwb3J0cy52ZWMyLnNldCh0aGlzLnJheWNhc3RPcmlnaW5zLnRvcExlZnQsIHRoaXMuYm91bmRzLmxvd2VyQm91bmRbMF0sIHRoaXMuYm91bmRzLnVwcGVyQm91bmRbMV0pOwogICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQodGhpcy5yYXljYXN0T3JpZ2lucy50b3BSaWdodCwgdGhpcy5ib3VuZHMudXBwZXJCb3VuZFswXSwgdGhpcy5ib3VuZHMudXBwZXJCb3VuZFsxXSk7CiAgICAgIH0KCiAgICB9CgogICAgY29uc3QgWkVSTyQxID0gcDIuZXhwb3J0cy52ZWMyLmNyZWF0ZSgpOwogICAgY29uc3QgVU5JVF9ZID0gcDIuZXhwb3J0cy52ZWMyLmZyb21WYWx1ZXMoMCwgMSk7IC8vIG1hdGggaGVscGVycwoKICAgIGZ1bmN0aW9uIHNpZ24kMSh4KSB7CiAgICAgIHJldHVybiB4ID49IDAgPyAxIDogLTE7CiAgICB9CgogICAgZnVuY3Rpb24gYW5nbGUoYSwgYikgewogICAgICByZXR1cm4gTWF0aC5hY29zKHAyLmV4cG9ydHMudmVjMi5kb3QoYSwgYikpOwogICAgfQogICAgLyoqCiAgICAgKiBAY2xhc3MgQ29udHJvbGxlcgogICAgICogQGV4dGVuZHMge1JheWNhc3RDb250cm9sbGVyfQogICAgICogQGNvbnN0cnVjdG9yCiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdCiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4Q2xpbWJBbmdsZV0KICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhEZXNjZW5kQW5nbGVdCiAgICAgKi8KCgogICAgY2xhc3MgQ29udHJvbGxlciBleHRlbmRzIFJheWNhc3RDb250cm9sbGVyIHsKICAgICAgY29uc3RydWN0b3IoX3JlZikgewogICAgICAgIGxldCB7CiAgICAgICAgICB3b3JsZCwKICAgICAgICAgIGJvZHksCiAgICAgICAgICBjb2xsaXNpb25NYXNrLAogICAgICAgICAgc2tpbldpZHRoLAogICAgICAgICAgZHN0QmV0d2VlblJheXMsCiAgICAgICAgICBtYXhDbGltYkFuZ2xlLAogICAgICAgICAgbWF4RGVzY2VuZEFuZ2xlCiAgICAgICAgfSA9IF9yZWY7CiAgICAgICAgc3VwZXIoewogICAgICAgICAgYm9keSwKICAgICAgICAgIGNvbGxpc2lvbk1hc2ssCiAgICAgICAgICBkc3RCZXR3ZWVuUmF5cywKICAgICAgICAgIHNraW5XaWR0aCwKICAgICAgICAgIHdvcmxkCiAgICAgICAgfSk7CiAgICAgICAgY29uc3QgREVHX1RPX1JBRCA9IE1hdGguUEkgLyAxODA7CiAgICAgICAgdGhpcy5tYXhDbGltYkFuZ2xlID0gbWF4Q2xpbWJBbmdsZSAhPT0gdW5kZWZpbmVkID8gbWF4Q2xpbWJBbmdsZSA6IDgwICogREVHX1RPX1JBRDsKICAgICAgICB0aGlzLm1heERlc2NlbmRBbmdsZSA9IG1heERlc2NlbmRBbmdsZSAhPT0gdW5kZWZpbmVkID8gbWF4RGVzY2VuZEFuZ2xlIDogODAgKiBERUdfVE9fUkFEOwogICAgICAgIHRoaXMuY29sbGlzaW9ucyA9IHsKICAgICAgICAgIGFib3ZlOiBmYWxzZSwKICAgICAgICAgIGJlbG93OiBmYWxzZSwKICAgICAgICAgIGNsaW1iaW5nU2xvcGU6IGZhbHNlLAogICAgICAgICAgZGVzY2VuZGluZ1Nsb3BlOiBmYWxzZSwKICAgICAgICAgIGZhY2VEaXI6IDEsCiAgICAgICAgICBmYWxsaW5nVGhyb3VnaFBsYXRmb3JtOiBmYWxzZSwKICAgICAgICAgIGxlZnQ6IGZhbHNlLAogICAgICAgICAgcmlnaHQ6IGZhbHNlLAogICAgICAgICAgc2xvcGVBbmdsZTogMCwKICAgICAgICAgIHNsb3BlQW5nbGVPbGQ6IDAsCiAgICAgICAgICB2ZWxvY2l0eU9sZDogcDIuZXhwb3J0cy52ZWMyLmNyZWF0ZSgpCiAgICAgICAgfTsKICAgICAgICB0aGlzLnJheSA9IG5ldyBwMi5leHBvcnRzLlJheSh7CiAgICAgICAgICBmcm9tOiBbMCwgMF0sCiAgICAgICAgICBtb2RlOiBwMi5leHBvcnRzLlJheS5DTE9TRVNULAogICAgICAgICAgc2tpcEJhY2tmYWNlczogdHJ1ZSwKICAgICAgICAgIHRvOiBbMCwgMF0KICAgICAgICB9KTsKICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQgPSBuZXcgcDIuZXhwb3J0cy5SYXljYXN0UmVzdWx0KCk7CiAgICAgICAgdGhpcy5yYXlzRGF0YSA9IFtdOwogICAgICB9CgogICAgICBjbGltYlNsb3BlKHZlbG9jaXR5LCBzbG9wZUFuZ2xlKSB7CiAgICAgICAgY29uc3QgY29sbGlzaW9ucyA9IHRoaXMuY29sbGlzaW9uczsKICAgICAgICBjb25zdCBtb3ZlRGlzdGFuY2UgPSBNYXRoLmFicyh2ZWxvY2l0eVswXSk7CiAgICAgICAgY29uc3QgY2xpbWJWZWxvY2l0eVkgPSBNYXRoLnNpbihzbG9wZUFuZ2xlKSAqIG1vdmVEaXN0YW5jZTsKCiAgICAgICAgaWYgKHZlbG9jaXR5WzFdIDw9IGNsaW1iVmVsb2NpdHlZKSB7CiAgICAgICAgICB2ZWxvY2l0eVsxXSA9IGNsaW1iVmVsb2NpdHlZOwogICAgICAgICAgdmVsb2NpdHlbMF0gPSBNYXRoLmNvcyhzbG9wZUFuZ2xlKSAqIG1vdmVEaXN0YW5jZSAqIHNpZ24kMSh2ZWxvY2l0eVswXSk7CiAgICAgICAgICBjb2xsaXNpb25zLmJlbG93ID0gdHJ1ZTsKICAgICAgICAgIGNvbGxpc2lvbnMuY2xpbWJpbmdTbG9wZSA9IHRydWU7CiAgICAgICAgICBjb2xsaXNpb25zLnNsb3BlQW5nbGUgPSBzbG9wZUFuZ2xlOwogICAgICAgIH0KICAgICAgfQoKICAgICAgZGVzY2VuZFNsb3BlKHZlbG9jaXR5KSB7CiAgICAgICAgY29uc3QgcmF5Y2FzdE9yaWdpbnMgPSB0aGlzLnJheWNhc3RPcmlnaW5zOwogICAgICAgIGNvbnN0IGRpcmVjdGlvblggPSBzaWduJDEodmVsb2NpdHlbMF0pOwogICAgICAgIGNvbnN0IGNvbGxpc2lvbnMgPSB0aGlzLmNvbGxpc2lvbnM7CiAgICAgICAgY29uc3QgcmF5ID0gdGhpcy5yYXk7CiAgICAgICAgcmF5LmNvbGxpc2lvbk1hc2sgPSB0aGlzLmNvbGxpc2lvbk1hc2s7CiAgICAgICAgcDIuZXhwb3J0cy52ZWMyLmNvcHkocmF5LmZyb20sIGRpcmVjdGlvblggPT09IC0xID8gcmF5Y2FzdE9yaWdpbnMuYm90dG9tUmlnaHQgOiByYXljYXN0T3JpZ2lucy5ib3R0b21MZWZ0KTsKICAgICAgICBwMi5leHBvcnRzLnZlYzIuc2V0KHJheS50bywgcmF5LmZyb21bMF0sIHJheS5mcm9tWzFdIC0gMWU2KTsKICAgICAgICByYXkudXBkYXRlKCk7CiAgICAgICAgdGhpcy53b3JsZC5yYXljYXN0KHRoaXMucmF5Y2FzdFJlc3VsdCwgcmF5KTsKCiAgICAgICAgaWYgKHRoaXMucmF5Y2FzdFJlc3VsdC5ib2R5KSB7CiAgICAgICAgICBjb25zdCBzbG9wZUFuZ2xlID0gYW5nbGUodGhpcy5yYXljYXN0UmVzdWx0Lm5vcm1hbCwgVU5JVF9ZKTsKCiAgICAgICAgICBpZiAoc2xvcGVBbmdsZSAhPT0gMCAmJiBzbG9wZUFuZ2xlIDw9IHRoaXMubWF4RGVzY2VuZEFuZ2xlKSB7CiAgICAgICAgICAgIGlmIChzaWduJDEodGhpcy5yYXljYXN0UmVzdWx0Lm5vcm1hbFswXSkgPT09IGRpcmVjdGlvblgpIHsKICAgICAgICAgICAgICBpZiAodGhpcy5yYXljYXN0UmVzdWx0LmdldEhpdERpc3RhbmNlKHJheSkgLSB0aGlzLnNraW5XaWR0aCA8PSBNYXRoLnRhbihzbG9wZUFuZ2xlKSAqIE1hdGguYWJzKHZlbG9jaXR5WzBdKSkgewogICAgICAgICAgICAgICAgY29uc3QgbW92ZURpc3RhbmNlID0gTWF0aC5hYnModmVsb2NpdHlbMF0pOwogICAgICAgICAgICAgICAgY29uc3QgZGVzY2VuZFZlbG9jaXR5WSA9IE1hdGguc2luKHNsb3BlQW5nbGUpICogbW92ZURpc3RhbmNlOwogICAgICAgICAgICAgICAgdmVsb2NpdHlbMF0gPSBNYXRoLmNvcyhzbG9wZUFuZ2xlKSAqIG1vdmVEaXN0YW5jZSAqIHNpZ24kMSh2ZWxvY2l0eVswXSk7CiAgICAgICAgICAgICAgICB2ZWxvY2l0eVsxXSAtPSBkZXNjZW5kVmVsb2NpdHlZOwogICAgICAgICAgICAgICAgY29sbGlzaW9ucy5zbG9wZUFuZ2xlID0gc2xvcGVBbmdsZTsKICAgICAgICAgICAgICAgIGNvbGxpc2lvbnMuZGVzY2VuZGluZ1Nsb3BlID0gdHJ1ZTsKICAgICAgICAgICAgICAgIGNvbGxpc2lvbnMuYmVsb3cgPSB0cnVlOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgdGhpcy5yYXljYXN0UmVzdWx0LnJlc2V0KCk7CiAgICAgIH0KCiAgICAgIGhvcml6b250YWxDb2xsaXNpb25zKHZlbG9jaXR5KSB7CiAgICAgICAgY29uc3QgY29sbGlzaW9ucyA9IHRoaXMuY29sbGlzaW9uczsKICAgICAgICBjb25zdCBtYXhDbGltYkFuZ2xlID0gdGhpcy5tYXhDbGltYkFuZ2xlOwogICAgICAgIGNvbnN0IGRpcmVjdGlvblggPSBjb2xsaXNpb25zLmZhY2VEaXI7CiAgICAgICAgY29uc3Qgc2tpbldpZHRoID0gdGhpcy5za2luV2lkdGg7CiAgICAgICAgY29uc3QgcmF5TGVuZ3RoID0gTWF0aC5hYnModmVsb2NpdHlbMF0pICsgc2tpbldpZHRoOwogICAgICAgIGNvbnN0IHJheWNhc3RPcmlnaW5zID0gdGhpcy5yYXljYXN0T3JpZ2luczsgLy8gaWYgKE1hdGguYWJzKHZlbG9jaXR5WzBdKSA8IHNraW5XaWR0aCkgewogICAgICAgIC8vIHJheUxlbmd0aCA9IDIgKiBza2luV2lkdGg7CiAgICAgICAgLy8gfQoKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG9yaXpvbnRhbFJheUNvdW50OyBpKyspIHsKICAgICAgICAgIGNvbnN0IHJheSA9IHRoaXMucmF5OwogICAgICAgICAgcmF5LmNvbGxpc2lvbk1hc2sgPSB0aGlzLmNvbGxpc2lvbk1hc2s7CiAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuY29weShyYXkuZnJvbSwgZGlyZWN0aW9uWCA9PT0gLTEgPyByYXljYXN0T3JpZ2lucy5ib3R0b21MZWZ0IDogcmF5Y2FzdE9yaWdpbnMuYm90dG9tUmlnaHQpOwogICAgICAgICAgcmF5LmZyb21bMV0gKz0gdGhpcy5ob3Jpem9udGFsUmF5U3BhY2luZyAqIGk7CiAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuY29weShyYXkudG8sIFtyYXkuZnJvbVswXSArIGRpcmVjdGlvblggKiByYXlMZW5ndGgsIHJheS5mcm9tWzFdXSk7CiAgICAgICAgICByYXkudXBkYXRlKCk7CiAgICAgICAgICB0aGlzLndvcmxkLnJheWNhc3QodGhpcy5yYXljYXN0UmVzdWx0LCByYXkpOwogICAgICAgICAgdGhpcy5yYXlzRGF0YVtpXSA9IFtbLi4ucmF5LmZyb21dLCBbLi4ucmF5LnRvXSwgWzAsIDBdXTsKCiAgICAgICAgICBpZiAodGhpcy5yYXljYXN0UmVzdWx0LmJvZHkpIHsKICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnJheWNhc3RSZXN1bHQuZ2V0SGl0RGlzdGFuY2UocmF5KTsKICAgICAgICAgICAgdGhpcy5yYXljYXN0UmVzdWx0LmdldEhpdFBvaW50KHRoaXMucmF5c0RhdGFbaV1bMl0sIHJheSk7CiAgICAgICAgICAgIGlmIChkaXN0YW5jZSA9PT0gMCkgY29udGludWU7CiAgICAgICAgICAgIGNvbnN0IHNsb3BlQW5nbGUgPSBhbmdsZSh0aGlzLnJheWNhc3RSZXN1bHQubm9ybWFsLCBVTklUX1kpOwoKICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgc2xvcGVBbmdsZSA8PSBtYXhDbGltYkFuZ2xlKSB7CiAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnMuZGVzY2VuZGluZ1Nsb3BlKSB7CiAgICAgICAgICAgICAgICBjb2xsaXNpb25zLmRlc2NlbmRpbmdTbG9wZSA9IGZhbHNlOwogICAgICAgICAgICAgICAgcDIuZXhwb3J0cy52ZWMyLmNvcHkodmVsb2NpdHksIGNvbGxpc2lvbnMudmVsb2NpdHlPbGQpOwogICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlVG9TbG9wZVN0YXJ0ID0gMDsKCiAgICAgICAgICAgICAgaWYgKHNsb3BlQW5nbGUgIT09IGNvbGxpc2lvbnMuc2xvcGVBbmdsZU9sZCkgewogICAgICAgICAgICAgICAgZGlzdGFuY2VUb1Nsb3BlU3RhcnQgPSBkaXN0YW5jZSAtIHNraW5XaWR0aDsKICAgICAgICAgICAgICAgIHZlbG9jaXR5WzBdIC09IGRpc3RhbmNlVG9TbG9wZVN0YXJ0ICogZGlyZWN0aW9uWDsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIHRoaXMuY2xpbWJTbG9wZSh2ZWxvY2l0eSwgc2xvcGVBbmdsZSk7CiAgICAgICAgICAgICAgdmVsb2NpdHlbMF0gKz0gZGlzdGFuY2VUb1Nsb3BlU3RhcnQgKiBkaXJlY3Rpb25YOwogICAgICAgICAgICB9CgogICAgICAgICAgICBpZiAoIWNvbGxpc2lvbnMuY2xpbWJpbmdTbG9wZSB8fCBzbG9wZUFuZ2xlID4gbWF4Q2xpbWJBbmdsZSkgewogICAgICAgICAgICAgIHZlbG9jaXR5WzBdID0gKGRpc3RhbmNlIC0gc2tpbldpZHRoKSAqIGRpcmVjdGlvblg7IC8vcmF5TGVuZ3RoID0gZGlzdGFuY2UKCiAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnMuY2xpbWJpbmdTbG9wZSkgewogICAgICAgICAgICAgICAgdmVsb2NpdHlbMV0gPSBNYXRoLnRhbihjb2xsaXNpb25zLnNsb3BlQW5nbGUpICogTWF0aC5hYnModmVsb2NpdHlbMF0pOwogICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgY29sbGlzaW9ucy5sZWZ0ID0gZGlyZWN0aW9uWCA9PT0gLTE7CiAgICAgICAgICAgICAgY29sbGlzaW9ucy5yaWdodCA9IGRpcmVjdGlvblggPT09IDE7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQucmVzZXQoKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIG1vdmUodmVsb2NpdHksIGlucHV0LCBzdGFuZGluZ09uUGxhdGZvcm0pIHsKICAgICAgICBjb25zdCBjb2xsaXNpb25zID0gdGhpcy5jb2xsaXNpb25zOwogICAgICAgIHRoaXMudXBkYXRlUmF5Y2FzdE9yaWdpbnMoKTsKICAgICAgICB0aGlzLnJlc2V0Q29sbGlzaW9ucyh2ZWxvY2l0eSk7CgogICAgICAgIGlmICh2ZWxvY2l0eVswXSAhPT0gMCkgewogICAgICAgICAgY29sbGlzaW9ucy5mYWNlRGlyID0gc2lnbiQxKHZlbG9jaXR5WzBdKTsKICAgICAgICB9CgogICAgICAgIGlmICh2ZWxvY2l0eVsxXSA8IDApIHsKICAgICAgICAgIHRoaXMuZGVzY2VuZFNsb3BlKHZlbG9jaXR5KTsKICAgICAgICB9CgogICAgICAgIHRoaXMuaG9yaXpvbnRhbENvbGxpc2lvbnModmVsb2NpdHkpOwoKICAgICAgICBpZiAodmVsb2NpdHlbMV0gIT09IDApIHsKICAgICAgICAgIHRoaXMudmVydGljYWxDb2xsaXNpb25zKHZlbG9jaXR5KTsKICAgICAgICB9CgogICAgICAgIHAyLmV4cG9ydHMudmVjMi5hZGQodGhpcy5ib2R5LnBvc2l0aW9uLCB0aGlzLmJvZHkucG9zaXRpb24sIHZlbG9jaXR5KTsKCiAgICAgICAgaWYgKHN0YW5kaW5nT25QbGF0Zm9ybSkgewogICAgICAgICAgY29sbGlzaW9ucy5iZWxvdyA9IHRydWU7CiAgICAgICAgfQogICAgICB9CgogICAgICBtb3ZlV2l0aFplcm9JbnB1dCh2ZWxvY2l0eSwgc3RhbmRpbmdPblBsYXRmb3JtKSB7CiAgICAgICAgcmV0dXJuIHRoaXMubW92ZSh2ZWxvY2l0eSwgWkVSTyQxLCBzdGFuZGluZ09uUGxhdGZvcm0pOwogICAgICB9CgogICAgICByZXNldENvbGxpc2lvbnModmVsb2NpdHkpIHsKICAgICAgICBjb25zdCBjb2xsaXNpb25zID0gdGhpcy5jb2xsaXNpb25zOwogICAgICAgIGNvbGxpc2lvbnMuYWJvdmUgPSBjb2xsaXNpb25zLmJlbG93ID0gZmFsc2U7CiAgICAgICAgY29sbGlzaW9ucy5sZWZ0ID0gY29sbGlzaW9ucy5yaWdodCA9IGZhbHNlOwogICAgICAgIGNvbGxpc2lvbnMuY2xpbWJpbmdTbG9wZSA9IGZhbHNlOwogICAgICAgIGNvbGxpc2lvbnMuZGVzY2VuZGluZ1Nsb3BlID0gZmFsc2U7CiAgICAgICAgY29sbGlzaW9ucy5zbG9wZUFuZ2xlT2xkID0gY29sbGlzaW9ucy5zbG9wZUFuZ2xlOwogICAgICAgIGNvbGxpc2lvbnMuc2xvcGVBbmdsZSA9IDA7CiAgICAgICAgcDIuZXhwb3J0cy52ZWMyLmNvcHkoY29sbGlzaW9ucy52ZWxvY2l0eU9sZCwgdmVsb2NpdHkpOwogICAgICB9CgogICAgICByZXNldEZhbGxpbmdUaHJvdWdoUGxhdGZvcm0oKSB7CiAgICAgICAgdGhpcy5jb2xsaXNpb25zLmZhbGxpbmdUaHJvdWdoUGxhdGZvcm0gPSBmYWxzZTsKICAgICAgfQoKICAgICAgdmVydGljYWxDb2xsaXNpb25zKHZlbG9jaXR5KSB7CiAgICAgICAgY29uc3QgY29sbGlzaW9ucyA9IHRoaXMuY29sbGlzaW9uczsKICAgICAgICBjb25zdCBza2luV2lkdGggPSB0aGlzLnNraW5XaWR0aDsKICAgICAgICBjb25zdCByYXljYXN0T3JpZ2lucyA9IHRoaXMucmF5Y2FzdE9yaWdpbnM7CiAgICAgICAgY29uc3QgZGlyZWN0aW9uWSA9IHNpZ24kMSh2ZWxvY2l0eVsxXSk7CiAgICAgICAgbGV0IHJheUxlbmd0aCA9IE1hdGguYWJzKHZlbG9jaXR5WzFdKSArIHNraW5XaWR0aDsKICAgICAgICBjb25zdCByYXkgPSB0aGlzLnJheTsKCiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZlcnRpY2FsUmF5Q291bnQ7IGkrKykgewogICAgICAgICAgcmF5LmNvbGxpc2lvbk1hc2sgPSB0aGlzLmNvbGxpc2lvbk1hc2s7CiAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuY29weShyYXkuZnJvbSwgZGlyZWN0aW9uWSA9PT0gLTEgPyByYXljYXN0T3JpZ2lucy5ib3R0b21MZWZ0IDogcmF5Y2FzdE9yaWdpbnMudG9wTGVmdCk7CiAgICAgICAgICByYXkuZnJvbVswXSArPSB0aGlzLnZlcnRpY2FsUmF5U3BhY2luZyAqIGkgKyB2ZWxvY2l0eVswXTsKICAgICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQocmF5LnRvLCByYXkuZnJvbVswXSwgcmF5LmZyb21bMV0gKyBkaXJlY3Rpb25ZICogcmF5TGVuZ3RoKTsKICAgICAgICAgIHJheS51cGRhdGUoKTsKICAgICAgICAgIHRoaXMud29ybGQucmF5Y2FzdCh0aGlzLnJheWNhc3RSZXN1bHQsIHJheSk7CiAgICAgICAgICB0aGlzLnJheXNEYXRhW3RoaXMuaG9yaXpvbnRhbFJheUNvdW50ICsgaV0gPSBbWy4uLnJheS5mcm9tXSwgWy4uLnJheS50b10sIFswLCAwXV07CgogICAgICAgICAgaWYgKHRoaXMucmF5Y2FzdFJlc3VsdC5ib2R5KSB7CiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5yYXljYXN0UmVzdWx0LmdldEhpdERpc3RhbmNlKHJheSk7CiAgICAgICAgICAgIHRoaXMucmF5Y2FzdFJlc3VsdC5nZXRIaXRQb2ludCh0aGlzLnJheXNEYXRhW3RoaXMuaG9yaXpvbnRhbFJheUNvdW50ICsgaV1bMl0sIHJheSk7CiAgICAgICAgICAgIHZlbG9jaXR5WzFdID0gKGRpc3RhbmNlIC0gc2tpbldpZHRoKSAqIGRpcmVjdGlvblk7CiAgICAgICAgICAgIHJheUxlbmd0aCA9IGRpc3RhbmNlOwoKICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnMuY2xpbWJpbmdTbG9wZSkgewogICAgICAgICAgICAgIHZlbG9jaXR5WzBdID0gdmVsb2NpdHlbMV0gLyBNYXRoLnRhbihjb2xsaXNpb25zLnNsb3BlQW5nbGUpICogc2lnbiQxKHZlbG9jaXR5WzBdKTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgY29sbGlzaW9ucy5iZWxvdyA9IGRpcmVjdGlvblkgPT09IC0xOwogICAgICAgICAgICBjb2xsaXNpb25zLmFib3ZlID0gZGlyZWN0aW9uWSA9PT0gMTsKICAgICAgICAgIH0KCiAgICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQucmVzZXQoKTsKICAgICAgICB9CgogICAgICAgIGlmIChjb2xsaXNpb25zLmNsaW1iaW5nU2xvcGUpIHsKICAgICAgICAgIGNvbnN0IGRpcmVjdGlvblggPSBzaWduJDEodmVsb2NpdHlbMF0pOwogICAgICAgICAgcmF5TGVuZ3RoID0gTWF0aC5hYnModmVsb2NpdHlbMF0pICsgc2tpbldpZHRoOwogICAgICAgICAgcmF5LmNvbGxpc2lvbk1hc2sgPSB0aGlzLmNvbGxpc2lvbk1hc2s7CiAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuY29weShyYXkuZnJvbSwgZGlyZWN0aW9uWCA9PT0gLTEgPyByYXljYXN0T3JpZ2lucy5ib3R0b21MZWZ0IDogcmF5Y2FzdE9yaWdpbnMuYm90dG9tUmlnaHQpOwogICAgICAgICAgcmF5LmZyb21bMV0gKz0gdmVsb2NpdHlbMV07CiAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuc2V0KHJheS50bywgcmF5LmZyb21bMF0gKyBkaXJlY3Rpb25YICogcmF5TGVuZ3RoLCByYXkuZnJvbVsxXSk7CiAgICAgICAgICByYXkudXBkYXRlKCk7CiAgICAgICAgICB0aGlzLndvcmxkLnJheWNhc3QodGhpcy5yYXljYXN0UmVzdWx0LCByYXkpOwoKICAgICAgICAgIGlmICh0aGlzLnJheWNhc3RSZXN1bHQuYm9keSkgewogICAgICAgICAgICBjb25zdCBzbG9wZUFuZ2xlID0gYW5nbGUodGhpcy5yYXljYXN0UmVzdWx0Lm5vcm1hbCwgVU5JVF9ZKTsKCiAgICAgICAgICAgIGlmIChzbG9wZUFuZ2xlICE9PSBjb2xsaXNpb25zLnNsb3BlQW5nbGUpIHsKICAgICAgICAgICAgICB2ZWxvY2l0eVswXSA9ICh0aGlzLnJheWNhc3RSZXN1bHQuZ2V0SGl0RGlzdGFuY2UocmF5KSAtIHNraW5XaWR0aCkgKiBkaXJlY3Rpb25YOwogICAgICAgICAgICAgIGNvbGxpc2lvbnMuc2xvcGVBbmdsZSA9IHNsb3BlQW5nbGU7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICB9CgogICAgLyoqCiAgICAgKiBBdHRhY2hlcyBhIENvbnRyb2xsZXJzIGNsYXNzIG9uIHRoZSBnbG9iYWwgInAyIiBvYmplY3QuCiAgICAgKiBPcmlnaW5hbCBjb2RlIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9TZWJMYWd1ZS8yRFBsYXRmb3JtZXItVHV0b3JpYWwKICAgICAqLwoKICAgIGZ1bmN0aW9uIGxlcnAoZmFjdG9yLCBzdGFydCwgZW5kKSB7CiAgICAgIHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiBmYWN0b3I7CiAgICB9CgogICAgY2xhc3MgS2luZW1hdGljQ2hhcmFjdGVyQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIgewogICAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7CiAgICAgICAgc3VwZXIob3B0aW9ucyk7CiAgICAgICAgdGhpcy5pbnB1dCA9IHAyLmV4cG9ydHMudmVjMi5jcmVhdGUoKTsKICAgICAgICB0aGlzLmFjY2VsZXJhdGlvblRpbWVBaXJib3JuZSA9IG9wdGlvbnMuYWNjZWxlcmF0aW9uVGltZUFpcmJvcm5lIHx8IDAuMjsKICAgICAgICB0aGlzLmFjY2VsZXJhdGlvblRpbWVHcm91bmRlZCA9IG9wdGlvbnMuYWNjZWxlcmF0aW9uVGltZUdyb3VuZGVkIHx8IDAuMTsKICAgICAgICB0aGlzLm1vdmVTcGVlZCA9IG9wdGlvbnMubW92ZVNwZWVkIHx8IDY7CiAgICAgICAgdGhpcy53YWxsU2xpZGVTcGVlZE1heCA9IG9wdGlvbnMud2FsbFNsaWRlU3BlZWRNYXggfHwgMzsKICAgICAgICB0aGlzLndhbGxTdGlja1RpbWUgPSBvcHRpb25zLndhbGxTdGlja1RpbWUgfHwgMC4yNTsKICAgICAgICB0aGlzLndhbGxKdW1wQ2xpbWIgPSBwMi5leHBvcnRzLnZlYzIuY2xvbmUob3B0aW9ucy53YWxsSnVtcENsaW1iIHx8IFsxMCwgMTBdKTsKICAgICAgICB0aGlzLndhbGxKdW1wT2ZmID0gcDIuZXhwb3J0cy52ZWMyLmNsb25lKG9wdGlvbnMud2FsbEp1bXBPZmYgfHwgWzEwLCAxMF0pOwogICAgICAgIHRoaXMud2FsbExlYXAgPSBwMi5leHBvcnRzLnZlYzIuY2xvbmUob3B0aW9ucy53YWxsTGVhcCB8fCBbMTAsIDE1XSk7CiAgICAgICAgY29uc3QgdGltZVRvSnVtcEFwZXggPSBvcHRpb25zLnRpbWVUb0p1bXBBcGV4IHx8IDAuNDsKICAgICAgICBjb25zdCBtYXhKdW1wSGVpZ2h0ID0gb3B0aW9ucy5tYXhKdW1wSGVpZ2h0IHx8IDQ7CiAgICAgICAgY29uc3QgbWluSnVtcEhlaWdodCA9IG9wdGlvbnMubWluSnVtcEhlaWdodCB8fCAxOwogICAgICAgIHRoaXMuZ3Jhdml0eSA9IC0oMiAqIG1heEp1bXBIZWlnaHQpIC8gdGltZVRvSnVtcEFwZXggKiogMjsKICAgICAgICB0aGlzLm1heEp1bXBWZWxvY2l0eSA9IE1hdGguYWJzKHRoaXMuZ3Jhdml0eSkgKiB0aW1lVG9KdW1wQXBleDsKICAgICAgICB0aGlzLm1pbkp1bXBWZWxvY2l0eSA9IE1hdGguc3FydCgyICogTWF0aC5hYnModGhpcy5ncmF2aXR5KSAqIG1pbkp1bXBIZWlnaHQpOwogICAgICAgIHRoaXMudmVsb2NpdHkgPSBwMi5leHBvcnRzLnZlYzIuY3JlYXRlKCk7CiAgICAgICAgdGhpcy52ZWxvY2l0eVhTbW9vdGhpbmcgPSBvcHRpb25zLnZlbG9jaXR5WFNtb290aGluZyB8fCAwLjI7CiAgICAgICAgdGhpcy52ZWxvY2l0eVhNaW4gPSBvcHRpb25zLnZlbG9jaXR5WE1pbiB8fCAwLjAwMDE7CiAgICAgICAgdGhpcy50aW1lVG9XYWxsVW5zdGljayA9IDA7CiAgICAgICAgdGhpcy5fcmVxdWVzdEp1bXAgPSBmYWxzZTsKICAgICAgICB0aGlzLl9yZXF1ZXN0VW5KdW1wID0gZmFsc2U7CiAgICAgICAgY29uc3QgdXBkYXRlID0gdGhpcy51cGRhdGUoKTsKICAgICAgICB0aGlzLndvcmxkLm9uKCdwb3N0U3RlcCcsICgpID0+IHVwZGF0ZSgxIC8gNjApKTsKICAgICAgfQogICAgICAvKioKICAgICAgICogU2V0IHRoZSBqdW1wIGJ1dHRvbiBzdGF0ZS4gSWYgaXQgaXMgZG93biwgcGFzcyB0cnVlLCBlbHNlIGZhbHNlLgogICAgICAgKiBAbWV0aG9kIHNldEp1bXBLZXlTdGF0ZQogICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzRG93bgogICAgICAgKi8KCgogICAgICBzZXRKdW1wS2V5U3RhdGUoaXNEb3duKSB7CiAgICAgICAgaWYgKGlzRG93bikgewogICAgICAgICAgdGhpcy5fcmVxdWVzdEp1bXAgPSB0cnVlOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB0aGlzLl9yZXF1ZXN0VW5KdW1wID0gdHJ1ZTsKICAgICAgICB9CiAgICAgIH0KICAgICAgLyoqCiAgICAgICAqIFNob3VsZCBiZSBleGVjdXRlZCBhZnRlciBlYWNoIHBoeXNpY3MgdGljaywgdXNpbmcgdGhlIHBoeXNpY3MgZGVsdGFUaW1lLgogICAgICAgKi8KCgogICAgICB1cGRhdGUoKSB7CiAgICAgICAgY29uc3Qgc2NhbGVkVmVsb2NpdHkgPSBwMi5leHBvcnRzLnZlYzIuY3JlYXRlKCk7CiAgICAgICAgcmV0dXJuIGRlbHRhVGltZSA9PiB7CiAgICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW5wdXQ7CiAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMudmVsb2NpdHk7CiAgICAgICAgICBjb25zdCB7CiAgICAgICAgICAgIGNvbGxpc2lvbnMKICAgICAgICAgIH0gPSB0aGlzOwogICAgICAgICAgY29uc3Qgd2FsbERpclggPSBjb2xsaXNpb25zLmxlZnQgPyAtMSA6IDE7CiAgICAgICAgICBjb25zdCB0YXJnZXRWZWxvY2l0eVggPSBpbnB1dFswXSAqIHRoaXMubW92ZVNwZWVkOwogICAgICAgICAgbGV0IHNtb290aGluZyA9IHRoaXMudmVsb2NpdHlYU21vb3RoaW5nOwogICAgICAgICAgc21vb3RoaW5nICo9IGNvbGxpc2lvbnMuYmVsb3cgPyB0aGlzLmFjY2VsZXJhdGlvblRpbWVHcm91bmRlZCA6IHRoaXMuYWNjZWxlcmF0aW9uVGltZUFpcmJvcm5lOwogICAgICAgICAgY29uc3QgZmFjdG9yID0gMSAtIHNtb290aGluZyAqKiBkZWx0YVRpbWU7CiAgICAgICAgICB2ZWxvY2l0eVswXSA9IGxlcnAoZmFjdG9yLCB2ZWxvY2l0eVswXSwgdGFyZ2V0VmVsb2NpdHlYKTsKCiAgICAgICAgICBpZiAoTWF0aC5hYnModmVsb2NpdHlbMF0pIDwgdGhpcy52ZWxvY2l0eVhNaW4pIHsKICAgICAgICAgICAgdmVsb2NpdHlbMF0gPSAwOwogICAgICAgICAgfQoKICAgICAgICAgIGxldCB3YWxsU2xpZGluZyA9IGZhbHNlOwoKICAgICAgICAgIGlmICgoY29sbGlzaW9ucy5sZWZ0IHx8IGNvbGxpc2lvbnMucmlnaHQpICYmICFjb2xsaXNpb25zLmJlbG93ICYmIHZlbG9jaXR5WzFdIDwgMCkgewogICAgICAgICAgICB3YWxsU2xpZGluZyA9IHRydWU7CgogICAgICAgICAgICBpZiAodmVsb2NpdHlbMV0gPCAtdGhpcy53YWxsU2xpZGVTcGVlZE1heCkgewogICAgICAgICAgICAgIHZlbG9jaXR5WzFdID0gLXRoaXMud2FsbFNsaWRlU3BlZWRNYXg7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVUb1dhbGxVbnN0aWNrID4gMCkgewogICAgICAgICAgICAgIHZlbG9jaXR5WzBdID0gMDsKCiAgICAgICAgICAgICAgaWYgKGlucHV0WzBdICE9PSB3YWxsRGlyWCAmJiBpbnB1dFswXSAhPT0gMCkgewogICAgICAgICAgICAgICAgdGhpcy50aW1lVG9XYWxsVW5zdGljayAtPSBkZWx0YVRpbWU7CiAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgIHRoaXMudGltZVRvV2FsbFVuc3RpY2sgPSB0aGlzLndhbGxTdGlja1RpbWU7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgIHRoaXMudGltZVRvV2FsbFVuc3RpY2sgPSB0aGlzLndhbGxTdGlja1RpbWU7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICBpZiAodGhpcy5fcmVxdWVzdEp1bXApIHsKICAgICAgICAgICAgdGhpcy5fcmVxdWVzdEp1bXAgPSBmYWxzZTsKCiAgICAgICAgICAgIGlmICh3YWxsU2xpZGluZykgewogICAgICAgICAgICAgIGlmICh3YWxsRGlyWCA9PT0gaW5wdXRbMF0pIHsKICAgICAgICAgICAgICAgIHZlbG9jaXR5WzBdID0gLXdhbGxEaXJYICogdGhpcy53YWxsSnVtcENsaW1iWzBdOwogICAgICAgICAgICAgICAgdmVsb2NpdHlbMV0gPSB0aGlzLndhbGxKdW1wQ2xpbWJbMV07CiAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dFswXSA9PT0gMCkgewogICAgICAgICAgICAgICAgdmVsb2NpdHlbMF0gPSAtd2FsbERpclggKiB0aGlzLndhbGxKdW1wT2ZmWzBdOwogICAgICAgICAgICAgICAgdmVsb2NpdHlbMV0gPSB0aGlzLndhbGxKdW1wT2ZmWzFdOwogICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICB2ZWxvY2l0eVswXSA9IC13YWxsRGlyWCAqIHRoaXMud2FsbExlYXBbMF07CiAgICAgICAgICAgICAgICB2ZWxvY2l0eVsxXSA9IHRoaXMud2FsbExlYXBbMV07CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CgogICAgICAgICAgICBpZiAoY29sbGlzaW9ucy5iZWxvdykgewogICAgICAgICAgICAgIHZlbG9jaXR5WzFdID0gdGhpcy5tYXhKdW1wVmVsb2NpdHk7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICBpZiAodGhpcy5fcmVxdWVzdFVuSnVtcCkgewogICAgICAgICAgICB0aGlzLl9yZXF1ZXN0VW5KdW1wID0gZmFsc2U7CgogICAgICAgICAgICBpZiAodmVsb2NpdHlbMV0gPiB0aGlzLm1pbkp1bXBWZWxvY2l0eSkgewogICAgICAgICAgICAgIHZlbG9jaXR5WzFdID0gdGhpcy5taW5KdW1wVmVsb2NpdHk7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICB2ZWxvY2l0eVsxXSArPSB0aGlzLmdyYXZpdHkgKiBkZWx0YVRpbWU7CiAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuc2NhbGUoc2NhbGVkVmVsb2NpdHksIHZlbG9jaXR5LCBkZWx0YVRpbWUpOwogICAgICAgICAgdGhpcy5tb3ZlKHNjYWxlZFZlbG9jaXR5LCBpbnB1dCk7CgogICAgICAgICAgaWYgKGNvbGxpc2lvbnMuYWJvdmUgfHwgY29sbGlzaW9ucy5iZWxvdykgewogICAgICAgICAgICB2ZWxvY2l0eVsxXSA9IDA7CiAgICAgICAgICB9CiAgICAgICAgfTsKICAgICAgfQoKICAgIH0KCiAgICAvLyBtYXRoIGhlbHBlcnMKICAgIGZ1bmN0aW9uIHNpZ24oeCkgewogICAgICByZXR1cm4geCA+PSAwID8gMSA6IC0xOwogICAgfQoKICAgIGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkgewogICAgICByZXR1cm4gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIHZhbHVlKSk7CiAgICB9IC8vIGNvbnN0YW50cwoKCiAgICBjb25zdCBaRVJPID0gcDIuZXhwb3J0cy52ZWMyLmNyZWF0ZSgpOwogICAgY2xhc3MgUGxhdGZvcm1Db250cm9sbGVyIGV4dGVuZHMgUmF5Y2FzdENvbnRyb2xsZXIgewogICAgICAvL1tSYW5nZSgwLDIpXQogICAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7CiAgICAgICAgc3VwZXIob3B0aW9ucyk7CiAgICAgICAgdGhpcy5wYXNzZW5nZXJNYXNrID0gb3B0aW9ucy5wYXNzZW5nZXJNYXNrIHx8IC0xOwogICAgICAgIHRoaXMubG9jYWxXYXlwb2ludHMgPSBvcHRpb25zLmxvY2FsV2F5cG9pbnRzOwogICAgICAgIHRoaXMuZ2xvYmFsV2F5cG9pbnRzID0gW107CiAgICAgICAgdGhpcy5zcGVlZCA9IG9wdGlvbnMuc3BlZWQgfHwgNTsKICAgICAgICB0aGlzLmN5Y2xpYyA9IGZhbHNlOwogICAgICAgIHRoaXMud2FpdFRpbWUgPSAwOyAvLyBSYW5nZSgwLDIpCgogICAgICAgIHRoaXMuZWFzZUFtb3VudCA9IDA7CiAgICAgICAgdGhpcy5mcm9tV2F5cG9pbnRJbmRleCA9IDA7CiAgICAgICAgdGhpcy5wZXJjZW50QmV0d2VlbldheXBvaW50cyA9IDA7CiAgICAgICAgdGhpcy5uZXh0TW92ZVRpbWUgPSAwOwogICAgICAgIHRoaXMucGFzc2VuZ2VyTW92ZW1lbnQgPSBbXTsKICAgICAgICB0aGlzLnBhc3NlbmdlckRpY3Rpb25hcnkgPSB7fTsKICAgICAgICB0aGlzLnRpbWUgPSAwOwogICAgICAgIHRoaXMucmF5ID0gbmV3IHAyLmV4cG9ydHMuUmF5KHsKICAgICAgICAgIGZyb206IFswLCAwXSwKICAgICAgICAgIG1vZGU6IHAyLmV4cG9ydHMuUmF5LkNMT1NFU1QsCiAgICAgICAgICBza2lwQmFja2ZhY2VzOiB0cnVlLAogICAgICAgICAgdG86IFswLCAtMV0KICAgICAgICB9KTsKICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQgPSBuZXcgcDIuZXhwb3J0cy5SYXljYXN0UmVzdWx0KCk7CiAgICAgICAgdGhpcy5yYXlzRGF0YSA9IFtdOwogICAgICAgIHRoaXMuZ2xvYmFsV2F5cG9pbnRzID0gbmV3IEFycmF5KHRoaXMubG9jYWxXYXlwb2ludHMubGVuZ3RoKTsKCiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvY2FsV2F5cG9pbnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBjb25zdCB0ZW1wID0gcDIuZXhwb3J0cy52ZWMyLmNyZWF0ZSgpOwogICAgICAgICAgcDIuZXhwb3J0cy52ZWMyLmFkZCh0ZW1wLCB0aGlzLmxvY2FsV2F5cG9pbnRzW2ldLCB0aGlzLmJvZHkucG9zaXRpb24pOwogICAgICAgICAgdGhpcy5nbG9iYWxXYXlwb2ludHNbaV0gPSB0ZW1wOwogICAgICAgIH0KCiAgICAgICAgT2JqZWN0LnZhbHVlcyhvcHRpb25zLmNvbnRyb2xsZXJzKS5tYXAoYyA9PiB7CiAgICAgICAgICBjb25zdCBib2R5ID0gYy5jb250cm9sbGVyLmJvZHk7CiAgICAgICAgICBpZiAoYy5jb250cm9sbGVyLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdLaW5lbWF0aWNDaGFyYWN0ZXJDb250cm9sbGVyJykgdGhpcy5wYXNzZW5nZXJEaWN0aW9uYXJ5W2JvZHkudXVpZF0gPSBjLmNvbnRyb2xsZXI7CiAgICAgICAgfSk7CiAgICAgICAgdGhpcy53b3JsZC5vbigncG9zdFN0ZXAnLCAoKSA9PiB0aGlzLnVwZGF0ZSgxIC8gNjApKTsKICAgICAgfQoKICAgICAgY2FsY3VsYXRlUGFzc2VuZ2VyTW92ZW1lbnQodmVsb2NpdHkpIHsKICAgICAgICBjb25zdCBtb3ZlZFBhc3NlbmdlcnMgPSBuZXcgU2V0KCk7CiAgICAgICAgdGhpcy5wYXNzZW5nZXJNb3ZlbWVudCA9IFtdOwogICAgICAgIGNvbnN0IGRpcmVjdGlvblggPSBzaWduKHZlbG9jaXR5WzBdKTsKICAgICAgICBjb25zdCBkaXJlY3Rpb25ZID0gc2lnbih2ZWxvY2l0eVsxXSk7IC8vIFZlcnRpY2FsbHkgbW92aW5nIHBsYXRmb3JtCgogICAgICAgIGlmICh2ZWxvY2l0eVsxXSAhPT0gMCkgewogICAgICAgICAgY29uc3QgcmF5TGVuZ3RoID0gTWF0aC5hYnModmVsb2NpdHlbMV0pICsgdGhpcy5za2luV2lkdGg7CgogICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZlcnRpY2FsUmF5Q291bnQ7IGkrKykgewogICAgICAgICAgICBjb25zdCByYXkgPSB0aGlzLnJheTsKICAgICAgICAgICAgcmF5LmNvbGxpc2lvbk1hc2sgPSB0aGlzLnBhc3Nlbmdlck1hc2s7CiAgICAgICAgICAgIHAyLmV4cG9ydHMudmVjMi5jb3B5KHJheS5mcm9tLCBkaXJlY3Rpb25ZID09PSAtMSA/IHRoaXMucmF5Y2FzdE9yaWdpbnMuYm90dG9tTGVmdCA6IHRoaXMucmF5Y2FzdE9yaWdpbnMudG9wTGVmdCk7CiAgICAgICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQocmF5LmZyb20sIHJheS5mcm9tWzBdICsgdGhpcy52ZXJ0aWNhbFJheVNwYWNpbmcgKiBpLCByYXkuZnJvbVsxXSk7CiAgICAgICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQocmF5LnRvLCByYXkuZnJvbVswXSwgcmF5LmZyb21bMV0gKyBkaXJlY3Rpb25ZICogcmF5TGVuZ3RoKTsKICAgICAgICAgICAgcmF5LnVwZGF0ZSgpOwogICAgICAgICAgICB0aGlzLndvcmxkLnJheWNhc3QodGhpcy5yYXljYXN0UmVzdWx0LCByYXkpOwogICAgICAgICAgICB0aGlzLnJheXNEYXRhW2ldID0gW1suLi5yYXkuZnJvbV0sIFsuLi5yYXkudG9dLCB1bmRlZmluZWRdOwoKICAgICAgICAgICAgaWYgKHRoaXMucmF5Y2FzdFJlc3VsdC5ib2R5KSB7CiAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnJheWNhc3RSZXN1bHQuZ2V0SGl0RGlzdGFuY2UocmF5KTsKICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDApIGNvbnRpbnVlOwogICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLnJheWNhc3RSZXN1bHQuYm9keTsKCiAgICAgICAgICAgICAgaWYgKCFtb3ZlZFBhc3NlbmdlcnMuaGFzKGJvZHkudXVpZCkpIHsKICAgICAgICAgICAgICAgIG1vdmVkUGFzc2VuZ2Vycy5hZGQoYm9keS51dWlkKTsKICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hYID0gZGlyZWN0aW9uWSA9PT0gMSA/IHZlbG9jaXR5WzBdIDogMDsKICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hZID0gdmVsb2NpdHlbMV0gLSAoZGlzdGFuY2UgLSB0aGlzLnNraW5XaWR0aCkgKiBkaXJlY3Rpb25ZOwogICAgICAgICAgICAgICAgdGhpcy5wYXNzZW5nZXJNb3ZlbWVudC5wdXNoKG5ldyBQYXNzZW5nZXJNb3ZlbWVudCh7CiAgICAgICAgICAgICAgICAgIG1vdmVCZWZvcmVQbGF0Zm9ybTogdHJ1ZSwKICAgICAgICAgICAgICAgICAgc3RhbmRpbmdPblBsYXRmb3JtOiBkaXJlY3Rpb25ZID09PSAxLAogICAgICAgICAgICAgICAgICB1dWlkOiBib2R5LnV1aWQsCiAgICAgICAgICAgICAgICAgIHZlbG9jaXR5OiBwMi5leHBvcnRzLnZlYzIuZnJvbVZhbHVlcyhwdXNoWCwgcHVzaFkpCiAgICAgICAgICAgICAgICB9KSk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CgogICAgICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQucmVzZXQoKTsKICAgICAgICAgIH0KICAgICAgICB9IC8vIEhvcml6b250YWxseSBtb3ZpbmcgcGxhdGZvcm0KCgogICAgICAgIGlmICh2ZWxvY2l0eVswXSAhPT0gMCkgewogICAgICAgICAgY29uc3QgcmF5TGVuZ3RoID0gTWF0aC5hYnModmVsb2NpdHlbMF0pICsgdGhpcy5za2luV2lkdGg7CgogICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvcml6b250YWxSYXlDb3VudDsgaSsrKSB7CiAgICAgICAgICAgIGNvbnN0IHJheSA9IHRoaXMucmF5OwogICAgICAgICAgICByYXkuY29sbGlzaW9uTWFzayA9IHRoaXMucGFzc2VuZ2VyTWFzazsKICAgICAgICAgICAgcDIuZXhwb3J0cy52ZWMyLmNvcHkocmF5LmZyb20sIGRpcmVjdGlvblggPT09IC0xID8gdGhpcy5yYXljYXN0T3JpZ2lucy5ib3R0b21MZWZ0IDogdGhpcy5yYXljYXN0T3JpZ2lucy5ib3R0b21SaWdodCk7CiAgICAgICAgICAgIHJheS5mcm9tWzFdICs9IHRoaXMuaG9yaXpvbnRhbFJheVNwYWNpbmcgKiBpOwogICAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuY29weShyYXkudG8sIHJheS5mcm9tKTsKICAgICAgICAgICAgcmF5LnRvWzBdICs9IGRpcmVjdGlvblggKiByYXlMZW5ndGg7CiAgICAgICAgICAgIHJheS51cGRhdGUoKTsKICAgICAgICAgICAgdGhpcy53b3JsZC5yYXljYXN0KHRoaXMucmF5Y2FzdFJlc3VsdCwgcmF5KTsKICAgICAgICAgICAgdGhpcy5yYXlzRGF0YVt0aGlzLnZlcnRpY2FsUmF5Q291bnQgKyBpXSA9IFtbLi4ucmF5LmZyb21dLCBbLi4ucmF5LnRvXSwgdW5kZWZpbmVkXTsKCiAgICAgICAgICAgIGlmICh0aGlzLnJheWNhc3RSZXN1bHQuYm9keSkgewogICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLnJheWNhc3RSZXN1bHQuYm9keTsKICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMucmF5Y2FzdFJlc3VsdC5nZXRIaXREaXN0YW5jZShyYXkpOwoKICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDApIHsKICAgICAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgaWYgKCFtb3ZlZFBhc3NlbmdlcnMuaGFzKGJvZHkudXVpZCkpIHsKICAgICAgICAgICAgICAgIG1vdmVkUGFzc2VuZ2Vycy5hZGQoYm9keS51dWlkKTsKICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hYID0gdmVsb2NpdHlbMF0gLSAoZGlzdGFuY2UgLSB0aGlzLnNraW5XaWR0aCkgKiBkaXJlY3Rpb25YOwogICAgICAgICAgICAgICAgY29uc3QgcHVzaFkgPSAtdGhpcy5za2luV2lkdGg7CiAgICAgICAgICAgICAgICB0aGlzLnBhc3Nlbmdlck1vdmVtZW50LnB1c2gobmV3IFBhc3Nlbmdlck1vdmVtZW50KHsKICAgICAgICAgICAgICAgICAgbW92ZUJlZm9yZVBsYXRmb3JtOiB0cnVlLAogICAgICAgICAgICAgICAgICBzdGFuZGluZ09uUGxhdGZvcm06IGZhbHNlLAogICAgICAgICAgICAgICAgICB1dWlkOiBib2R5LnV1aWQsCiAgICAgICAgICAgICAgICAgIHZlbG9jaXR5OiBwMi5leHBvcnRzLnZlYzIuZnJvbVZhbHVlcyhwdXNoWCwgcHVzaFkpCiAgICAgICAgICAgICAgICB9KSk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CgogICAgICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQucmVzZXQoKTsKICAgICAgICAgIH0KICAgICAgICB9IC8vIFBhc3NlbmdlciBvbiB0b3Agb2YgYSBob3Jpem9udGFsbHkgb3IgZG93bndhcmQgbW92aW5nIHBsYXRmb3JtCgoKICAgICAgICBpZiAoZGlyZWN0aW9uWSA9PT0gLTEgfHwgdmVsb2NpdHlbMV0gPT09IDAgJiYgdmVsb2NpdHlbMF0gIT09IDApIHsKICAgICAgICAgIGNvbnN0IHJheUxlbmd0aCA9IHRoaXMuc2tpbldpZHRoICogMjsKCiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmVydGljYWxSYXlDb3VudDsgaSsrKSB7CiAgICAgICAgICAgIGNvbnN0IHJheSA9IHRoaXMucmF5OwogICAgICAgICAgICByYXkuY29sbGlzaW9uTWFzayA9IHRoaXMucGFzc2VuZ2VyTWFzazsKICAgICAgICAgICAgcDIuZXhwb3J0cy52ZWMyLnNldChyYXkuZnJvbSwgdGhpcy5yYXljYXN0T3JpZ2lucy50b3BMZWZ0WzBdICsgdGhpcy52ZXJ0aWNhbFJheVNwYWNpbmcgKiBpLCB0aGlzLnJheWNhc3RPcmlnaW5zLnRvcExlZnRbMV0pOwogICAgICAgICAgICBwMi5leHBvcnRzLnZlYzIuc2V0KHJheS50bywgcmF5LmZyb21bMF0sIHJheS5mcm9tWzFdICsgcmF5TGVuZ3RoKTsKICAgICAgICAgICAgcmF5LnVwZGF0ZSgpOwogICAgICAgICAgICB0aGlzLndvcmxkLnJheWNhc3QodGhpcy5yYXljYXN0UmVzdWx0LCByYXkpOwogICAgICAgICAgICB0aGlzLnJheXNEYXRhW3RoaXMudmVydGljYWxSYXlDb3VudCArIHRoaXMuaG9yaXpvbnRhbFJheUNvdW50ICsgaV0gPSBbWy4uLnJheS5mcm9tXSwgWy4uLnJheS50b10sIHVuZGVmaW5lZF07CgogICAgICAgICAgICBpZiAodGhpcy5yYXljYXN0UmVzdWx0LmJvZHkpIHsKICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMucmF5Y2FzdFJlc3VsdC5nZXRIaXREaXN0YW5jZShyYXkpOwoKICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDApIHsKICAgICAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMucmF5Y2FzdFJlc3VsdC5ib2R5OwoKICAgICAgICAgICAgICBpZiAoIW1vdmVkUGFzc2VuZ2Vycy5oYXMoYm9keS51dWlkKSkgewogICAgICAgICAgICAgICAgbW92ZWRQYXNzZW5nZXJzLmFkZChib2R5LnV1aWQpOwogICAgICAgICAgICAgICAgY29uc3QgcHVzaFggPSB2ZWxvY2l0eVswXTsKICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hZID0gdmVsb2NpdHlbMV07CiAgICAgICAgICAgICAgICB0aGlzLnBhc3Nlbmdlck1vdmVtZW50LnB1c2gobmV3IFBhc3Nlbmdlck1vdmVtZW50KHsKICAgICAgICAgICAgICAgICAgbW92ZUJlZm9yZVBsYXRmb3JtOiBmYWxzZSwKICAgICAgICAgICAgICAgICAgc3RhbmRpbmdPblBsYXRmb3JtOiB0cnVlLAogICAgICAgICAgICAgICAgICB1dWlkOiBib2R5LnV1aWQsCiAgICAgICAgICAgICAgICAgIHZlbG9jaXR5OiBwMi5leHBvcnRzLnZlYzIuZnJvbVZhbHVlcyhwdXNoWCwgcHVzaFkpCiAgICAgICAgICAgICAgICB9KSk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CgogICAgICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHQucmVzZXQoKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIGNhbGN1bGF0ZVBsYXRmb3JtTW92ZW1lbnQoZGVsdGFUaW1lKSB7CiAgICAgICAgaWYgKHRoaXMudGltZSA8IHRoaXMubmV4dE1vdmVUaW1lKSB7CiAgICAgICAgICByZXR1cm4gWkVSTzsKICAgICAgICB9CgogICAgICAgIGNvbnN0IHsKICAgICAgICAgIGdsb2JhbFdheXBvaW50cywKICAgICAgICAgIHNwZWVkCiAgICAgICAgfSA9IHRoaXM7CiAgICAgICAgdGhpcy5mcm9tV2F5cG9pbnRJbmRleCAlPSBnbG9iYWxXYXlwb2ludHMubGVuZ3RoOwogICAgICAgIGNvbnN0IHRvV2F5cG9pbnRJbmRleCA9ICh0aGlzLmZyb21XYXlwb2ludEluZGV4ICsgMSkgJSBnbG9iYWxXYXlwb2ludHMubGVuZ3RoOwogICAgICAgIGNvbnN0IGRpc3RhbmNlQmV0d2VlbldheXBvaW50cyA9IHAyLmV4cG9ydHMudmVjMi5kaXN0YW5jZShnbG9iYWxXYXlwb2ludHNbdGhpcy5mcm9tV2F5cG9pbnRJbmRleF0sIGdsb2JhbFdheXBvaW50c1t0b1dheXBvaW50SW5kZXhdKTsKICAgICAgICB0aGlzLnBlcmNlbnRCZXR3ZWVuV2F5cG9pbnRzICs9IGRlbHRhVGltZSAqIHNwZWVkIC8gZGlzdGFuY2VCZXR3ZWVuV2F5cG9pbnRzOwogICAgICAgIHRoaXMucGVyY2VudEJldHdlZW5XYXlwb2ludHMgPSBjbGFtcCh0aGlzLnBlcmNlbnRCZXR3ZWVuV2F5cG9pbnRzLCAwLCAxKTsKICAgICAgICBjb25zdCBlYXNlZFBlcmNlbnRCZXR3ZWVuV2F5cG9pbnRzID0gdGhpcy5lYXNlKHRoaXMucGVyY2VudEJldHdlZW5XYXlwb2ludHMpOwogICAgICAgIGNvbnN0IG5ld1BvcyA9IHAyLmV4cG9ydHMudmVjMi5jcmVhdGUoKTsKICAgICAgICBwMi5leHBvcnRzLnZlYzIubGVycChuZXdQb3MsIGdsb2JhbFdheXBvaW50c1t0aGlzLmZyb21XYXlwb2ludEluZGV4XSwgZ2xvYmFsV2F5cG9pbnRzW3RvV2F5cG9pbnRJbmRleF0sIGVhc2VkUGVyY2VudEJldHdlZW5XYXlwb2ludHMpOwoKICAgICAgICBpZiAodGhpcy5wZXJjZW50QmV0d2VlbldheXBvaW50cyA+PSAxKSB7CiAgICAgICAgICB0aGlzLnBlcmNlbnRCZXR3ZWVuV2F5cG9pbnRzID0gMDsKICAgICAgICAgIHRoaXMuZnJvbVdheXBvaW50SW5kZXgrKzsKCiAgICAgICAgICBpZiAoIXRoaXMuY3ljbGljKSB7CiAgICAgICAgICAgIGlmICh0aGlzLmZyb21XYXlwb2ludEluZGV4ID49IGdsb2JhbFdheXBvaW50cy5sZW5ndGggLSAxKSB7CiAgICAgICAgICAgICAgdGhpcy5mcm9tV2F5cG9pbnRJbmRleCA9IDA7CiAgICAgICAgICAgICAgZ2xvYmFsV2F5cG9pbnRzLnJldmVyc2UoKTsKICAgICAgICAgICAgfQogICAgICAgICAgfQoKICAgICAgICAgIHRoaXMubmV4dE1vdmVUaW1lID0gdGhpcy50aW1lICsgdGhpcy53YWl0VGltZTsKICAgICAgICB9CgogICAgICAgIGNvbnN0IHJlc3VsdCA9IHAyLmV4cG9ydHMudmVjMi5jcmVhdGUoKTsKICAgICAgICBwMi5leHBvcnRzLnZlYzIuc3VidHJhY3QocmVzdWx0LCBuZXdQb3MsIHRoaXMuYm9keS5wb3NpdGlvbik7CiAgICAgICAgcmV0dXJuIHJlc3VsdDsKICAgICAgfQoKICAgICAgZWFzZSh4KSB7CiAgICAgICAgY29uc3QgYSA9IHRoaXMuZWFzZUFtb3VudCArIDE7CiAgICAgICAgcmV0dXJuIE1hdGgucG93KHgsIGEpIC8gKE1hdGgucG93KHgsIGEpICsgTWF0aC5wb3coMSAtIHgsIGEpKTsKICAgICAgfQoKICAgICAgbW92ZVBhc3NlbmdlcnMoYmVmb3JlTW92ZVBsYXRmb3JtKSB7CiAgICAgICAgdGhpcy5wYXNzZW5nZXJNb3ZlbWVudC5tYXAocGFzc2VuZ2VyID0+IHsKICAgICAgICAgIGlmICghKHBhc3Nlbmdlci51dWlkIGluIHRoaXMucGFzc2VuZ2VyRGljdGlvbmFyeSkpIHsKICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ3Bhc3NlbmdlciB1dWlkIG5vdCBpbiBwYXNzZW5nZXJEaWN0aW9uYXJ5Jyk7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKHBhc3Nlbmdlci5tb3ZlQmVmb3JlUGxhdGZvcm0gPT09IGJlZm9yZU1vdmVQbGF0Zm9ybSkgewogICAgICAgICAgICB0aGlzLnBhc3NlbmdlckRpY3Rpb25hcnlbcGFzc2VuZ2VyLnV1aWRdLm1vdmVXaXRoWmVyb0lucHV0KHBhc3Nlbmdlci52ZWxvY2l0eSwgcGFzc2VuZ2VyLnN0YW5kaW5nT25QbGF0Zm9ybSk7CiAgICAgICAgICB9CiAgICAgICAgfSk7CiAgICAgIH0KCiAgICAgIHVwZGF0ZShkZWx0YVRpbWUpIHsKICAgICAgICB0aGlzLnRpbWUgKz0gZGVsdGFUaW1lOwogICAgICAgIHN1cGVyLnVwZGF0ZVJheWNhc3RPcmlnaW5zKCk7CiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLmNhbGN1bGF0ZVBsYXRmb3JtTW92ZW1lbnQoZGVsdGFUaW1lKTsKICAgICAgICB0aGlzLnVwZGF0ZVJheWNhc3RPcmlnaW5zKCk7CiAgICAgICAgdGhpcy5jYWxjdWxhdGVQYXNzZW5nZXJNb3ZlbWVudCh2ZWxvY2l0eSk7CiAgICAgICAgdGhpcy5tb3ZlUGFzc2VuZ2Vycyh0cnVlKTsKICAgICAgICBwMi5leHBvcnRzLnZlYzIuc2V0KHRoaXMuYm9keS5wb3NpdGlvbiwgdGhpcy5ib2R5LnBvc2l0aW9uWzBdICsgdmVsb2NpdHlbMF0sIHRoaXMuYm9keS5wb3NpdGlvblsxXSArIHZlbG9jaXR5WzFdKTsKICAgICAgICB0aGlzLm1vdmVQYXNzZW5nZXJzKGZhbHNlKTsKICAgICAgfQoKICAgIH0KCiAgICBjbGFzcyBQYXNzZW5nZXJNb3ZlbWVudCB7CiAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHsKICAgICAgICB0aGlzLnZlbG9jaXR5ID0gb3B0aW9ucy52ZWxvY2l0eSB8fCBbMCwgMF07CiAgICAgICAgdGhpcy5zdGFuZGluZ09uUGxhdGZvcm0gPSBvcHRpb25zLnN0YW5kaW5nT25QbGF0Zm9ybSB8fCBmYWxzZTsKICAgICAgICB0aGlzLm1vdmVCZWZvcmVQbGF0Zm9ybSA9IG9wdGlvbnMubW92ZUJlZm9yZVBsYXRmb3JtIHx8IGZhbHNlOwogICAgICAgIHRoaXMudXVpZCA9IG9wdGlvbnMudXVpZCB8fCAnJzsKICAgICAgfQoKICAgIH0KCiAgICBjb25zdCBhZGRDb250YWN0TWF0ZXJpYWwgPSAod29ybGQsIGNyZWF0ZU1hdGVyaWFsLCBfcmVmLCB1dWlkKSA9PiB7CiAgICAgIGxldCBbbWF0ZXJpYWxBLCBtYXRlcmlhbEIsIG9wdGlvbnNdID0gX3JlZjsKICAgICAgY29uc3QgbWF0QSA9IGNyZWF0ZU1hdGVyaWFsKG1hdGVyaWFsQSk7CiAgICAgIGNvbnN0IG1hdEIgPSBjcmVhdGVNYXRlcmlhbChtYXRlcmlhbEIpOwogICAgICBjb25zdCBjb250YWN0TWF0ZXJpYWwgPSBuZXcgcDIuZXhwb3J0cy5Db250YWN0TWF0ZXJpYWwobWF0QSwgbWF0Qiwgb3B0aW9ucyk7CiAgICAgIGNvbnRhY3RNYXRlcmlhbC51dWlkID0gdXVpZDsKICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGNvbnRhY3RNYXRlcmlhbCk7CiAgICB9OwogICAgY29uc3QgcmVtb3ZlQ29udGFjdE1hdGVyaWFsID0gKHdvcmxkLCBjbVVVSUQpID0+IHsKICAgICAgY29uc3QgaW5kZXggPSB3b3JsZC5jb250YWN0TWF0ZXJpYWxzLmZpbmRJbmRleChfcmVmMiA9PiB7CiAgICAgICAgbGV0IHsKICAgICAgICAgIHV1aWQKICAgICAgICB9ID0gX3JlZjI7CiAgICAgICAgcmV0dXJuIHV1aWQgPT09IGNtVVVJRDsKICAgICAgfSk7IC8vY29uc3QgW3sgaWQ6IGkgfSwgeyBpZDogaiB9XSA9IHdvcmxkLmNvbnRhY3RtYXRlcmlhbHNbaW5kZXhdLm1hdGVyaWFscwoKICAgICAgd29ybGQuY29udGFjdE1hdGVyaWFscy5zcGxpY2UoaW5kZXgsIDEpOyAvL2RlbGV0ZSB3b3JsZC5jb250YWN0TWF0ZXJpYWxUYWJsZS5kYXRhW2kgPCBqID8gYCR7aX0tJHtqfWAgOiBgJHtqfS0ke2l9YF0KICAgIH07CgogICAgbGV0IG1hdGVyaWFsSWQgPSAwOwogICAgY29uc3QgY3JlYXRlTWF0ZXJpYWxGYWN0b3J5ID0gbWF0ZXJpYWxzID0+IGZ1bmN0aW9uIChuYW1lT3JPcHRpb25zKSB7CiAgICAgIGlmIChuYW1lT3JPcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBuYW1lT3JPcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIGNvbnN0IG1hdGVyaWFsT3B0aW9ucyA9IHR5cGVvZiBuYW1lT3JPcHRpb25zID09PSAnbnVtYmVyJyA/IHsKICAgICAgICBpZDogbmFtZU9yT3B0aW9ucwogICAgICB9IDogeyAuLi5uYW1lT3JPcHRpb25zCiAgICAgIH07IC8vbmFtZTogU3ltYm9sLmZvcihgTWF0ZXJpYWwke21hdGVyaWFsSWQrK31gKSwKCiAgICAgIGNvbnN0IHsKICAgICAgICBpZCA9IG1hdGVyaWFsSWQrKwogICAgICB9ID0gbWF0ZXJpYWxPcHRpb25zOwogICAgICBtYXRlcmlhbHNbaWRdID0gbWF0ZXJpYWxzW2lkXSB8fCBuZXcgcDIuZXhwb3J0cy5NYXRlcmlhbChpZCk7CiAgICAgIHJldHVybiBtYXRlcmlhbHNbaWRdOwogICAgfTsKCiAgICAvKioKICAgICAqIEB0eXBlZGVmIHsgaW1wb3J0KCdwMi1lcycpLk1hdGVyaWFsT3B0aW9ucyB9IE1hdGVyaWFsT3B0aW9ucwogICAgICovCgogICAgZnVuY3Rpb24gY3JlYXRlU2hhcGUodHlwZSwgYXJncykgewogICAgICBzd2l0Y2ggKHR5cGUpIHsKICAgICAgICBjYXNlICdCb3gnOgogICAgICAgICAgcmV0dXJuIG5ldyBwMi5leHBvcnRzLkJveCh7CiAgICAgICAgICAgIGhlaWdodDogYXJnc1sxXSwKICAgICAgICAgICAgd2lkdGg6IGFyZ3NbMF0KICAgICAgICAgIH0pOwoKICAgICAgICBjYXNlICdDYXBzdWxlJzoKICAgICAgICAgIHJldHVybiBuZXcgcDIuZXhwb3J0cy5DYXBzdWxlKHsKICAgICAgICAgICAgbGVuZ3RoOiBhcmdzWzBdLAogICAgICAgICAgICByYWRpdXM6IGFyZ3NbMV0KICAgICAgICAgIH0pOwoKICAgICAgICBjYXNlICdDaXJjbGUnOgogICAgICAgICAgcmV0dXJuIG5ldyBwMi5leHBvcnRzLkNpcmNsZSh7CiAgICAgICAgICAgIHJhZGl1czogYXJnc1swXQogICAgICAgICAgfSk7CgogICAgICAgIGNhc2UgJ0NvbnZleCc6CiAgICAgICAgICByZXR1cm4gbmV3IHAyLmV4cG9ydHMuQ29udmV4KHsKICAgICAgICAgICAgYXhlczogYXJnc1sxXSwKICAgICAgICAgICAgdmVydGljZXM6IGFyZ3NbMF0KICAgICAgICAgIH0pOwoKICAgICAgICBjYXNlICdQYXJ0aWNsZSc6CiAgICAgICAgICByZXR1cm4gbmV3IHAyLmV4cG9ydHMuUGFydGljbGUoKTsKCiAgICAgICAgY2FzZSAnUGxhbmUnOgogICAgICAgICAgcmV0dXJuIG5ldyBwMi5leHBvcnRzLlBsYW5lKCk7CgogICAgICAgIGNhc2UgJ0xpbmUnOgogICAgICAgICAgcmV0dXJuIG5ldyBwMi5leHBvcnRzLkxpbmUoewogICAgICAgICAgICBsZW5ndGg6IGFyZ3NbMF0KICAgICAgICAgIH0pOwoKICAgICAgICBjYXNlICdIZWlnaHRmaWVsZCc6CiAgICAgICAgICByZXR1cm4gbmV3IHAyLmV4cG9ydHMuSGVpZ2h0ZmllbGQoewogICAgICAgICAgICBlbGVtZW50V2lkdGg6IGFyZ3NbMV0uZWxlbWVudFdpZHRoLAogICAgICAgICAgICBoZWlnaHRzOiBhcmdzWzBdCiAgICAgICAgICB9KTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBAZnVuY3Rpb24KICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zCiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy51dWlkCiAgICAgKiBAcGFyYW0ge0JvZHlQcm9wc30gb3B0aW9ucy5wcm9wcwogICAgICogQHBhcmFtIHtCb2R5U2hhcGVUeXBlfSBvcHRpb25zLnR5cGUKICAgICAqIEBwYXJhbSB7KG1hdGVyaWFsT3B0aW9uczogTWF0ZXJpYWxPcHRpb25zKSA9PiBNYXRlcmlhbCA9fSBvcHRpb25zLmNyZWF0ZU1hdGVyaWFsCiAgICAgKiBAcmV0dXJucyB7Qm9keX0KICAgICAqLwoKCiAgICBjb25zdCBwcm9wc1RvQm9keSA9IG9wdGlvbnMgPT4gewogICAgICBjb25zdCB7CiAgICAgICAgdXVpZCwKICAgICAgICBwcm9wcywKICAgICAgICB0eXBlLAogICAgICAgIGNyZWF0ZU1hdGVyaWFsID0gbWF0ZXJpYWxPcHRpb25zID0+IG5ldyBwMi5leHBvcnRzLk1hdGVyaWFsKG1hdGVyaWFsT3B0aW9ucykKICAgICAgfSA9IG9wdGlvbnM7CiAgICAgIGNvbnN0IHsKICAgICAgICBhcmdzID0gW10sCiAgICAgICAgcG9zaXRpb24gPSBbMCwgMF0sCiAgICAgICAgYW5nbGUgPSAwLAogICAgICAgIHZlbG9jaXR5ID0gWzAsIDBdLAogICAgICAgIGFuZ3VsYXJWZWxvY2l0eSA9IDAsCiAgICAgICAgdHlwZTogYm9keVR5cGUsCiAgICAgICAgaXNUcmlnZ2VyLAogICAgICAgIG1hc3MsCiAgICAgICAgbWF0ZXJpYWwsCiAgICAgICAgc2hhcGVzLAogICAgICAgIG9uQ29sbGlkZSwKICAgICAgICBjb2xsaXNpb25SZXNwb25zZSwKICAgICAgICBjb2xsaXNpb25Hcm91cCA9IC0xLAogICAgICAgIC4uLmV4dHJhCiAgICAgIH0gPSBwcm9wczsKICAgICAgY29uc3QgYm9keSA9IG5ldyBwMi5leHBvcnRzLkJvZHkoeyAuLi5leHRyYSwKICAgICAgICBtYXNzOiBib2R5VHlwZSA9PT0gJ1N0YXRpYycgPyAwIDogbWFzcywKICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWwgPyBjcmVhdGVNYXRlcmlhbChtYXRlcmlhbCkgOiB1bmRlZmluZWQsCiAgICAgICAgdHlwZTogYm9keVR5cGUgPyBwMi5leHBvcnRzLkJvZHlbYm9keVR5cGUudG9VcHBlckNhc2UoKV0gOiB1bmRlZmluZWQKICAgICAgfSk7CiAgICAgIGJvZHkudXVpZCA9IHV1aWQ7CgogICAgICBpZiAoY29sbGlzaW9uUmVzcG9uc2UgIT09IHVuZGVmaW5lZCkgewogICAgICAgIGJvZHkuY29sbGlzaW9uUmVzcG9uc2UgPSBjb2xsaXNpb25SZXNwb25zZTsKICAgICAgfQoKICAgICAgaWYgKHR5cGUgPT09ICdDb21wb3VuZCcpIHsKICAgICAgICBzaGFwZXMuZm9yRWFjaCgoX3JlZiwgaSkgPT4gewogICAgICAgICAgbGV0IHsKICAgICAgICAgICAgdHlwZSwKICAgICAgICAgICAgYXJncywKICAgICAgICAgICAgcG9zaXRpb24sCiAgICAgICAgICAgIGFuZ2xlLAogICAgICAgICAgICBtYXRlcmlhbCwKICAgICAgICAgICAgLi4uZXh0cmEKICAgICAgICAgIH0gPSBfcmVmOwogICAgICAgICAgYm9keS5hZGRTaGFwZShjcmVhdGVTaGFwZSh0eXBlLCBhcmdzKSwgcG9zaXRpb24gPyBwMi5leHBvcnRzLnZlYzIuZnJvbVZhbHVlcyguLi5wb3NpdGlvbikgOiB1bmRlZmluZWQsIGFuZ2xlKTsKICAgICAgICAgIGlmIChtYXRlcmlhbCkgYm9keS5zaGFwZXNbaV0ubWF0ZXJpYWwgPSBjcmVhdGVNYXRlcmlhbChtYXRlcmlhbCk7CiAgICAgICAgICBpZiAoaXNUcmlnZ2VyKSBib2R5LnNoYXBlc1tpXS5zZW5zb3IgPSBpc1RyaWdnZXI7CiAgICAgICAgICBPYmplY3QuYXNzaWduKGJvZHksIGV4dHJhKTsKICAgICAgICB9KTsKICAgICAgfSBlbHNlIHsKICAgICAgICBjb25zdCBzaGFwZSA9IGNyZWF0ZVNoYXBlKHR5cGUsIGFyZ3MpOwogICAgICAgIHNoYXBlLmNvbGxpc2lvbkdyb3VwID0gY29sbGlzaW9uR3JvdXA7CiAgICAgICAgaWYgKG1hdGVyaWFsKSBzaGFwZS5tYXRlcmlhbCA9IGNyZWF0ZU1hdGVyaWFsKG1hdGVyaWFsKTsKICAgICAgICBpZiAoaXNUcmlnZ2VyKSBzaGFwZS5zZW5zb3IgPSBpc1RyaWdnZXI7CiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7CiAgICAgIH0KCiAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQoYm9keS5wb3NpdGlvbiwgcG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdKTsKICAgICAgYm9keS5hbmdsZSA9IGFuZ2xlOwogICAgICBwMi5leHBvcnRzLnZlYzIuc2V0KGJvZHkudmVsb2NpdHksIHZlbG9jaXR5WzBdLCB2ZWxvY2l0eVsxXSk7CiAgICAgIGJvZHkuYW5ndWxhclZlbG9jaXR5ID0gYW5ndWxhclZlbG9jaXR5OwogICAgICByZXR1cm4gYm9keTsKICAgIH07CgogICAgdmFyIHByb3BzVG9Cb2R5JDEgPSBwcm9wc1RvQm9keTsKCiAgICAvL2ltcG9ydCB0eXBlIHsgQ2Fubm9uQ29sbGlkZUV2ZW50IH0gZnJvbSAnLi4vdHlwZXMnCiAgICBjb25zdCBhZGRCb2RpZXMgPSAoc3RhdGUsIGNyZWF0ZU1hdGVyaWFsLCBfcmVmKSA9PiB7CiAgICAgIGxldCB7CiAgICAgICAgcHJvcHMsCiAgICAgICAgdHlwZSwKICAgICAgICB1dWlkCiAgICAgIH0gPSBfcmVmOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1dWlkLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgYm9keSA9IHByb3BzVG9Cb2R5JDEoewogICAgICAgICAgY3JlYXRlTWF0ZXJpYWwsCiAgICAgICAgICBwcm9wczogcHJvcHNbaV0sCiAgICAgICAgICB0eXBlLAogICAgICAgICAgdXVpZDogdXVpZFtpXQogICAgICAgIH0pOwogICAgICAgIHN0YXRlLndvcmxkLmFkZEJvZHkoYm9keSk7CiAgICAgICAgLyppbiBwMiB0aGVyZSBpcyBvbmx5IGFuIGltcGFjdCBlbWl0dGVkIGJ5IHRoZSB3b3JsZCB3aGljaCB3ZSB1c2UqLwoKICAgICAgICAvKmlmIChwcm9wc1tpXS5vbkNvbGxpZGUpCiAgICAgICAgICAgICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbGxpZGUnLCAoeyB0eXBlLCBib2R5LCB0YXJnZXQsIGNvbnRhY3QgfTogQ2Fubm9uQ29sbGlkZUV2ZW50KSA9PiB7CiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBuaSwgcmksIHJqLCBiaSwgYmosIGlkIH0gPSBjb250YWN0CiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFjdFBvaW50ID0gYmkucG9zaXRpb24udmFkZChyaSkKICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250YWN0Tm9ybWFsID0gYmkgPT09IGJvZHkgPyBuaSA6IG5pLnNjYWxlKC0xKQogICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBib2R5LnV1aWQhLAogICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25GaWx0ZXJzOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5RmlsdGVyR3JvdXA6IGJvZHkuY29sbGlzaW9uRmlsdGVyR3JvdXAsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5RmlsdGVyTWFzazogYm9keS5jb2xsaXNpb25GaWx0ZXJNYXNrLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RmlsdGVyR3JvdXA6IHRhcmdldC5jb2xsaXNpb25GaWx0ZXJHcm91cCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEZpbHRlck1hc2s6IHRhcmdldC5jb2xsaXNpb25GaWx0ZXJNYXNrLAogICAgICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0OiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRPRE86IHVzZSBpZCBpbnN0ZWFkIG9mIHV1aWQKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpOiBiaS51dWlkLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiB1c2UgaWQgaW5zdGVhZCBvZiB1dWlkCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiajogYmoudXVpZCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vcm1hbCBvZiB0aGUgY29udGFjdCwgcmVsYXRpdmUgdG8gdGhlIGNvbGxpZGluZyBib2R5CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0Tm9ybWFsOiBjb250YWN0Tm9ybWFsLnRvQXJyYXkoKSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdvcmxkIHBvc2l0aW9uIG9mIHRoZSBjb250YWN0CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0UG9pbnQ6IGNvbnRhY3RQb2ludC50b0FycmF5KCksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcGFjdFZlbG9jaXR5OiBjb250YWN0LmdldEltcGFjdFZlbG9jaXR5QWxvbmdOb3JtYWwoKSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pOiBuaS50b0FycmF5KCksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICByaTogcmkudG9BcnJheSgpLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmo6IHJqLnRvQXJyYXkoKSwKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdldmVudCcsCiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LnV1aWQhLAogICAgICAgICAgICAgICAgICAgICAgICB0eXBlLAogICAgICAgICAgICAgICAgICAgIH0pCiAgICAgICAgICAgICAgICB9KSovCiAgICAgIH0KICAgIH07CgogICAgY29uc3QgYWRkQ29uc3RyYWludCA9IChzdGF0ZSwgX3JlZikgPT4gewogICAgICBsZXQgewogICAgICAgIHByb3BzOiBbYm9keUEsIGJvZHlCLCB7CiAgICAgICAgICBhbmdsZSwKICAgICAgICAgIGRpc2FibGVSb3RhdGlvbmFsTG9jaywKICAgICAgICAgIHVwcGVyTGltaXQsCiAgICAgICAgICBsb3dlckxpbWl0LAogICAgICAgICAgZGlzdGFuY2UsCiAgICAgICAgICBtYXhGb3JjZSwKICAgICAgICAgIG1heFRvcnF1ZSwKICAgICAgICAgIGxvY2FsQW5jaG9yQSwKICAgICAgICAgIGxvY2FsQW5jaG9yQiwKICAgICAgICAgIGxvY2FsQW5nbGVCLAogICAgICAgICAgbG9jYWxBeGlzQSwKICAgICAgICAgIGxvY2FsUGl2b3RBLAogICAgICAgICAgbG9jYWxQaXZvdEIsCiAgICAgICAgICBsb2NhbE9mZnNldEIsCiAgICAgICAgICByYXRpbywKICAgICAgICAgIHdvcmxkUGl2b3QKICAgICAgICB9XSwKICAgICAgICB0eXBlLAogICAgICAgIHV1aWQKICAgICAgfSA9IF9yZWY7CiAgICAgIGxldCBjb25zdHJhaW50OwoKICAgICAgc3dpdGNoICh0eXBlKSB7CiAgICAgICAgY2FzZSAnRGlzdGFuY2UnOgogICAgICAgICAgY29uc3RyYWludCA9IG5ldyBwMi5leHBvcnRzLkRpc3RhbmNlQ29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCBzdGF0ZS5ib2RpZXNbYm9keUJdLCB7CiAgICAgICAgICAgIGRpc3RhbmNlLAogICAgICAgICAgICBsb2NhbEFuY2hvckEsCiAgICAgICAgICAgIGxvY2FsQW5jaG9yQgogICAgICAgICAgfSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnR2Vhcic6CiAgICAgICAgICBjb25zdHJhaW50ID0gbmV3IHAyLmV4cG9ydHMuR2VhckNvbnN0cmFpbnQoc3RhdGUuYm9kaWVzW2JvZHlBXSwgc3RhdGUuYm9kaWVzW2JvZHlCXSwgewogICAgICAgICAgICBhbmdsZSwKICAgICAgICAgICAgbWF4VG9ycXVlLAogICAgICAgICAgICByYXRpbwogICAgICAgICAgfSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnTG9jayc6CiAgICAgICAgICBjb25zdHJhaW50ID0gbmV3IHAyLmV4cG9ydHMuTG9ja0NvbnN0cmFpbnQoc3RhdGUuYm9kaWVzW2JvZHlBXSwgc3RhdGUuYm9kaWVzW2JvZHlCXSwgewogICAgICAgICAgICBsb2NhbEFuZ2xlQiwKICAgICAgICAgICAgbG9jYWxPZmZzZXRCLAogICAgICAgICAgICBtYXhGb3JjZQogICAgICAgICAgfSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnUmV2b2x1dGUnOgogICAgICAgICAgY29uc3RyYWludCA9IG5ldyBwMi5leHBvcnRzLlJldm9sdXRlQ29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCBzdGF0ZS5ib2RpZXNbYm9keUJdLCB7CiAgICAgICAgICAgIGxvY2FsUGl2b3RBLAogICAgICAgICAgICBsb2NhbFBpdm90QiwKICAgICAgICAgICAgbWF4Rm9yY2UsCiAgICAgICAgICAgIHdvcmxkUGl2b3QKICAgICAgICAgIH0pOwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgJ1ByaXNtYXRpYyc6CiAgICAgICAgICBjb25zdHJhaW50ID0gbmV3IHAyLmV4cG9ydHMuUHJpc21hdGljQ29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCBzdGF0ZS5ib2RpZXNbYm9keUJdLCB7CiAgICAgICAgICAgIGRpc2FibGVSb3RhdGlvbmFsTG9jaywKICAgICAgICAgICAgbG9jYWxBbmNob3JBLAogICAgICAgICAgICBsb2NhbEFuY2hvckIsCiAgICAgICAgICAgIGxvY2FsQXhpc0EsCiAgICAgICAgICAgIGxvd2VyTGltaXQsCiAgICAgICAgICAgIG1heEZvcmNlLAogICAgICAgICAgICB1cHBlckxpbWl0CiAgICAgICAgICB9KTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBkZWZhdWx0OgogICAgICAgICAgY29uc3RyYWludCA9IG5ldyBwMi5leHBvcnRzLkNvbnN0cmFpbnQoc3RhdGUuYm9kaWVzW2JvZHlBXSwgc3RhdGUuYm9kaWVzW2JvZHlCXSwgcDIuZXhwb3J0cy5Db25zdHJhaW50W3R5cGVdLCB7fSk7CiAgICAgICAgICBicmVhazsKICAgICAgfQoKICAgICAgY29uc3RyYWludC51dWlkID0gdXVpZDsKICAgICAgc3RhdGUud29ybGQuYWRkQ29uc3RyYWludChjb25zdHJhaW50KTsKICAgICAgLyp3ZSBkb250IHVzZSBpdCB5ZXQqLwoKICAgICAgLyppZiAobWF4TXVsdGlwbGllciAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgY29uc3QgcG9zdFN0ZXBDb25zdHJhaW50ID0gKCkgPT4gewogICAgICAgICAgLy8gVGhlIG11bHRpcGxpZXIgaXMgcHJvcG9ydGlvbmFsIHRvIGhvdyBtdWNoIGZvcmNlIGlzIGFkZGVkIHRvIHRoZSBib2RpZXMgYnkgdGhlIGNvbnN0cmFpbnQuCiAgICAgICAgICAvLyBJZiB0aGlzIGV4Y2VlZHMgYSBsaW1pdCB0aGUgY29uc3RyYWludCBpcyBkaXNhYmxlZC4KICAgICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSBNYXRoLmFicyhjb25zdHJhaW50LmVxdWF0aW9uc1swXS5tdWx0aXBsaWVyKQogICAgICAgICAgaWYgKG11bHRpcGxpZXIgPiBtYXhNdWx0aXBsaWVyKSB7CiAgICAgICAgICAgIGNvbnN0cmFpbnQuZGlzYWJsZSgpCiAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIHN0YXRlLmNvbnN0cmFpbnRzW3V1aWRdID0gcG9zdFN0ZXBDb25zdHJhaW50CiAgICAgICAgc3RhdGUud29ybGQuYWRkRXZlbnRMaXN0ZW5lcigncG9zdFN0ZXAnLCBzdGF0ZS5jb25zdHJhaW50c1t1dWlkXSkKICAgICAgfSovCiAgICB9OwoKICAgIGZ1bmN0aW9uIHRvVXBwZXJjYXNlKHN0cikgewogICAgICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7CiAgICB9CgogICAgY29uc3QgYWRkUmF5ID0gKHN0YXRlLCBfcmVmKSA9PiB7CiAgICAgIGxldCB7CiAgICAgICAgcHJvcHM6IHsKICAgICAgICAgIGZyb20sCiAgICAgICAgICBtb2RlLAogICAgICAgICAgdG8sCiAgICAgICAgICAuLi5yYXlPcHRpb25zCiAgICAgICAgfSwKICAgICAgICB1dWlkCiAgICAgIH0gPSBfcmVmOwogICAgICBjb25zdCByYXkgPSBuZXcgcDIuZXhwb3J0cy5SYXkoewogICAgICAgIGZyb20sCiAgICAgICAgbW9kZTogcDIuZXhwb3J0cy5SYXlbdG9VcHBlcmNhc2UobW9kZSldLAogICAgICAgIHRvLAogICAgICAgIC4uLnJheU9wdGlvbnMKICAgICAgfSk7CiAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBwMi5leHBvcnRzLlJheWNhc3RSZXN1bHQoKTsKICAgICAgY29uc3QgaGl0UG9pbnRXb3JsZCA9IHAyLmV4cG9ydHMudmVjMi5jcmVhdGUoKTsKCiAgICAgIHN0YXRlLnJheXNbdXVpZF0gPSAoKSA9PiB7CiAgICAgICAgY29uc3QgaGFzSGl0ID0gc3RhdGUud29ybGQucmF5Y2FzdChyZXN1bHQsIHJheSk7CiAgICAgICAgaWYgKGhhc0hpdCkgcmVzdWx0LmdldEhpdFBvaW50KGhpdFBvaW50V29ybGQsIHJheSk7CiAgICAgICAgY29uc3QgewogICAgICAgICAgYm9keSwKICAgICAgICAgIHNoYXBlLAogICAgICAgICAgLi4ucmVzdAogICAgICAgIH0gPSByZXN1bHQ7CiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICAgICAgICBib2R5OiBib2R5ID8gYm9keS51dWlkIDogbnVsbCwKICAgICAgICAgIGhhc0hpdDogaGFzSGl0LAogICAgICAgICAgaGl0RGlzdGFuY2U6IHJlc3VsdC5nZXRIaXREaXN0YW5jZShyYXkpLAogICAgICAgICAgLy9oaXROb3JtYWxXb3JsZDogaGl0Tm9ybWFsV29ybGQudG9BcnJheSgpLAogICAgICAgICAgaGl0UG9pbnRXb3JsZCwKICAgICAgICAgIG9wOiAnZXZlbnQnLAogICAgICAgICAgcmF5OiB7CiAgICAgICAgICAgIGNvbGxpc2lvbkdyb3VwOiByYXkuY29sbGlzaW9uR3JvdXAsCiAgICAgICAgICAgIGNvbGxpc2lvbk1hc2s6IHJheS5jb2xsaXNpb25NYXNrLAogICAgICAgICAgICBkaXJlY3Rpb246IHJheS5kaXJlY3Rpb24sCiAgICAgICAgICAgIGZyb206IHJheS5mcm9tLAogICAgICAgICAgICB0bzogcmF5LnRvLAogICAgICAgICAgICB1dWlkLAogICAgICAgICAgICAuLi5yZXN0CiAgICAgICAgICB9LAogICAgICAgICAgLy9yYXlGcm9tV29ybGQ6IHJheUZyb21Xb3JsZC50b0FycmF5KCksCiAgICAgICAgICAvL3JheVRvV29ybGQ6IHJheVRvV29ybGQudG9BcnJheSgpLAogICAgICAgICAgc2hhcGU6IHNoYXBlID8geyAuLi5zaGFwZSwKICAgICAgICAgICAgYm9keTogYm9keS51dWlkCiAgICAgICAgICB9IDogbnVsbCwKICAgICAgICAgIHR5cGU6ICdyYXloaXQnCiAgICAgICAgfSk7CiAgICAgIH07CgogICAgICBzdGF0ZS53b3JsZC5vbigncHJlU29sdmUnLCBzdGF0ZS5yYXlzW3V1aWRdKTsKICAgIH07CgogICAgY29uc3QgYWRkU3ByaW5nID0gKHN0YXRlLCBfcmVmKSA9PiB7CiAgICAgIGxldCB7CiAgICAgICAgcHJvcHM6IFtib2R5QSwgYm9keUIsIHsKICAgICAgICAgIGRhbXBpbmcsCiAgICAgICAgICBsb2NhbEFuY2hvckEsCiAgICAgICAgICBsb2NhbEFuY2hvckIsCiAgICAgICAgICBzdGlmZm5lc3MsCiAgICAgICAgICB3b3JsZEFuY2hvckEsCiAgICAgICAgICB3b3JsZEFuY2hvckIKICAgICAgICB9XSwKICAgICAgICB1dWlkCiAgICAgIH0gPSBfcmVmOwogICAgICBjb25zdCBzcHJpbmcgPSBuZXcgcDIuZXhwb3J0cy5TcHJpbmcoc3RhdGUuYm9kaWVzW2JvZHlBXSwgc3RhdGUuYm9kaWVzW2JvZHlCXSwgewogICAgICAgIGRhbXBpbmcsCiAgICAgICAgbG9jYWxBbmNob3JBLAogICAgICAgIGxvY2FsQW5jaG9yQiwKICAgICAgICBzdGlmZm5lc3MsCiAgICAgICAgd29ybGRBbmNob3JBLAogICAgICAgIHdvcmxkQW5jaG9yQgogICAgICB9KTsKICAgICAgc3ByaW5nLnV1aWQgPSB1dWlkOwoKICAgICAgY29uc3QgcG9zdFN0ZXBTcHJpbmcgPSAoKSA9PiBzcHJpbmcuYXBwbHlGb3JjZSgpOwoKICAgICAgc3RhdGUuc3ByaW5nc1t1dWlkXSA9IHBvc3RTdGVwU3ByaW5nOwogICAgICBzdGF0ZS5zcHJpbmdJbnN0YW5jZXNbdXVpZF0gPSBzcHJpbmc7IC8vIENvbXB1dGUgdGhlIGZvcmNlIGFmdGVyIGVhY2ggc3RlcAoKICAgICAgc3RhdGUud29ybGQub24oJ3Bvc3RTdGVwJywgc3RhdGUuc3ByaW5nc1t1dWlkXSk7CiAgICB9OwoKICAgIGNvbnN0IGFkZFRvcERvd25WZWhpY2xlID0gKHN0YXRlLCBkYXRhKSA9PiB7CiAgICAgIGNvbnN0IFtjaGFzc2lzQm9keSwgd2hlZWxJbmZvc10gPSBkYXRhLnByb3BzOwogICAgICBjb25zdCB2ZWhpY2xlID0gbmV3IHAyLmV4cG9ydHMuVG9wRG93blZlaGljbGUoc3RhdGUuYm9kaWVzW2NoYXNzaXNCb2R5XSk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdoZWVsSW5mb3MubGVuZ3RoOyBpKyspIHsKICAgICAgICBjb25zdCB3aGVlbCA9IHdoZWVsSW5mb3NbaV07CiAgICAgICAgdmVoaWNsZS5hZGRXaGVlbCh3aGVlbCk7CiAgICAgIH0KCiAgICAgIHZlaGljbGUuYWRkVG9Xb3JsZChzdGF0ZS53b3JsZCk7CiAgICAgIHN0YXRlLnZlaGljbGVzW2RhdGEudXVpZF0gPSB7CiAgICAgICAgdmVoaWNsZQogICAgICB9OwogICAgfTsKCiAgICBjb25zdCBhZGRLaW5lbWF0aWNDaGFyYWN0ZXJDb250cm9sbGVyID0gKHN0YXRlLCBkYXRhKSA9PiB7CiAgICAgIGNvbnN0IFtib2R5LCBjb2xsaXNpb25NYXNrLCBhY2NlbGVyYXRpb25UaW1lQWlyYm9ybmUsIGFjY2VsZXJhdGlvblRpbWVHcm91bmRlZCwgbW92ZVNwZWVkLCB3YWxsU2xpZGVTcGVlZE1heCwgd2FsbFN0aWNrVGltZSwgd2FsbEp1bXBDbGltYiwgd2FsbEp1bXBPZmYsIHdhbGxMZWFwLCB0aW1lVG9KdW1wQXBleCwgbWF4SnVtcEhlaWdodCwgbWluSnVtcEhlaWdodCwgdmVsb2NpdHlYU21vb3RoaW5nLCB2ZWxvY2l0eVhNaW4sIG1heENsaW1iQW5nbGUsIG1heERlc2NlbmRBbmdsZSwgc2tpbldpZHRoLCBkc3RCZXR3ZWVuUmF5c10gPSBkYXRhLnByb3BzOwogICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXIoewogICAgICAgIGFjY2VsZXJhdGlvblRpbWVBaXJib3JuZSwKICAgICAgICBhY2NlbGVyYXRpb25UaW1lR3JvdW5kZWQsCiAgICAgICAgYm9keTogc3RhdGUuYm9kaWVzW2JvZHldLAogICAgICAgIGNvbGxpc2lvbk1hc2ssCiAgICAgICAgZHN0QmV0d2VlblJheXMsCiAgICAgICAgbWF4Q2xpbWJBbmdsZSwKICAgICAgICBtYXhEZXNjZW5kQW5nbGUsCiAgICAgICAgbWF4SnVtcEhlaWdodCwKICAgICAgICBtaW5KdW1wSGVpZ2h0LAogICAgICAgIG1vdmVTcGVlZCwKICAgICAgICBza2luV2lkdGgsCiAgICAgICAgdGltZVRvSnVtcEFwZXgsCiAgICAgICAgdmVsb2NpdHlYTWluLAogICAgICAgIHZlbG9jaXR5WFNtb290aGluZywKICAgICAgICB3YWxsSnVtcENsaW1iLAogICAgICAgIHdhbGxKdW1wT2ZmLAogICAgICAgIHdhbGxMZWFwLAogICAgICAgIHdhbGxTbGlkZVNwZWVkTWF4LAogICAgICAgIHdhbGxTdGlja1RpbWUsCiAgICAgICAgd29ybGQ6IHN0YXRlLndvcmxkCiAgICAgIH0pOwogICAgICBzdGF0ZS5jb250cm9sbGVyc1tkYXRhLnV1aWRdID0gewogICAgICAgIGNvbnRyb2xsZXIKICAgICAgfTsKICAgIH07CgogICAgZnVuY3Rpb24gZW1pdEJlZ2luQ29udGFjdChfcmVmKSB7CiAgICAgIGxldCB7CiAgICAgICAgYm9keUEsCiAgICAgICAgYm9keUIKICAgICAgfSA9IF9yZWY7CiAgICAgIGlmICghYm9keUEgfHwgIWJvZHlCKSByZXR1cm47CiAgICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICAgIGJvZHlBOiBib2R5QS51dWlkLAogICAgICAgIGJvZHlCOiBib2R5Qi51dWlkLAogICAgICAgIG9wOiAnZXZlbnQnLAogICAgICAgIHR5cGU6ICdjb2xsaWRlQmVnaW4nCiAgICAgIH0pOwogICAgfQoKICAgIGZ1bmN0aW9uIGVtaXRFbmRDb250YWN0KF9yZWYyKSB7CiAgICAgIGxldCB7CiAgICAgICAgYm9keUEsCiAgICAgICAgYm9keUIKICAgICAgfSA9IF9yZWYyOwogICAgICBpZiAoIWJvZHlBIHx8ICFib2R5QikgcmV0dXJuOwogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBib2R5QTogYm9keUEudXVpZCwKICAgICAgICBib2R5QjogYm9keUIudXVpZCwKICAgICAgICBvcDogJ2V2ZW50JywKICAgICAgICB0eXBlOiAnY29sbGlkZUVuZCcKICAgICAgfSk7CiAgICB9CgogICAgY29uc3QgaW5pdCA9IChzdGF0ZSwgX3JlZjMpID0+IHsKICAgICAgbGV0IHsKICAgICAgICAvL2FsbG93U2xlZXAsCiAgICAgICAgYXhpc0luZGV4ID0gMCwKICAgICAgICBicm9hZHBoYXNlLAogICAgICAgIGRlZmF1bHRDb250YWN0TWF0ZXJpYWwsCiAgICAgICAgZ3Jhdml0eSwKICAgICAgICBpdGVyYXRpb25zLAogICAgICAgIG5vcm1hbEluZGV4LAogICAgICAgIC8vcXVhdE5vcm1hbGl6ZUZhc3QsCiAgICAgICAgLy9xdWF0Tm9ybWFsaXplU2tpcCwKICAgICAgICAvL3NvbHZlciwKICAgICAgICB0b2xlcmFuY2UKICAgICAgfSA9IF9yZWYzOwogICAgICAvL3N0YXRlLndvcmxkLmFsbG93U2xlZXAgPSBhbGxvd1NsZWVwCiAgICAgIHN0YXRlLndvcmxkLmdyYXZpdHkgPSBbZ3Jhdml0eVswXSwgZ3Jhdml0eVsxXV07IC8vc3RhdGUud29ybGQucXVhdE5vcm1hbGl6ZUZhc3QgPSBxdWF0Tm9ybWFsaXplRmFzdAogICAgICAvL3N0YXRlLndvcmxkLnF1YXROb3JtYWxpemVTa2lwID0gcXVhdE5vcm1hbGl6ZVNraXAKCiAgICAgIHN0YXRlLm5vcm1hbEluZGV4ID0gbm9ybWFsSW5kZXg7CiAgICAgIHN0YXRlLm5vcm1hbC5zcGxpY2Uobm9ybWFsSW5kZXgsIDEsIDEpOwogICAgICAvKmlmIChzb2x2ZXIgPT09ICdTcGxpdCcpIHsKICAgICAgICBzdGF0ZS53b3JsZC5zb2x2ZXIgPSBuZXcgU3BsaXRTb2x2ZXIobmV3IEdTU29sdmVyKCkpCiAgICAgIH0qLwoKICAgICAgaWYgKHN0YXRlLndvcmxkLnNvbHZlciBpbnN0YW5jZW9mIHAyLmV4cG9ydHMuR1NTb2x2ZXIpIHsKICAgICAgICBzdGF0ZS53b3JsZC5zb2x2ZXIudG9sZXJhbmNlID0gdG9sZXJhbmNlOwogICAgICAgIHN0YXRlLndvcmxkLnNvbHZlci5pdGVyYXRpb25zID0gaXRlcmF0aW9uczsKICAgICAgfQoKICAgICAgc3RhdGUud29ybGQuYnJvYWRwaGFzZSA9IGJyb2FkcGhhc2UgPT09ICdTQVAnID8gbmV3IHAyLmV4cG9ydHMuU0FQQnJvYWRwaGFzZShwMi5leHBvcnRzLkJyb2FkcGhhc2UuU0FQKSA6IG5ldyBwMi5leHBvcnRzLk5haXZlQnJvYWRwaGFzZShwMi5leHBvcnRzLkJyb2FkcGhhc2UuTkFJVkUpOwoKICAgICAgaWYgKHN0YXRlLndvcmxkLmJyb2FkcGhhc2UgaW5zdGFuY2VvZiBwMi5leHBvcnRzLlNBUEJyb2FkcGhhc2UpIHsKICAgICAgICBzdGF0ZS53b3JsZC5icm9hZHBoYXNlLmF4aXNJbmRleCA9IGF4aXNJbmRleDsKICAgICAgfQoKICAgICAgc3RhdGUud29ybGQub24oJ2JlZ2luQ29udGFjdCcsIGVtaXRCZWdpbkNvbnRhY3QpOwogICAgICBzdGF0ZS53b3JsZC5vbignZW5kQ29udGFjdCcsIGVtaXRFbmRDb250YWN0KTsKICAgICAgc3RhdGUud29ybGQub24oJ2ltcGFjdCcsIGV2ZW50ID0+IHsKICAgICAgICBjb25zdCB7CiAgICAgICAgICBib2R5QSwKICAgICAgICAgIGJvZHlCLAogICAgICAgICAgY29udGFjdEVxdWF0aW9uCiAgICAgICAgfSA9IGV2ZW50OwogICAgICAgIGNvbnN0IHsKICAgICAgICAgIG5vcm1hbEEsCiAgICAgICAgICBjb250YWN0UG9pbnRBLAogICAgICAgICAgY29udGFjdFBvaW50QiwKICAgICAgICAgIGluZGV4LAogICAgICAgICAgc2hhcGVBLAogICAgICAgICAgc2hhcGVCCiAgICAgICAgfSA9IGNvbnRhY3RFcXVhdGlvbjsKICAgICAgICBjb25zdCBjb250YWN0UG9pbnQgPSBbYm9keUEucG9zaXRpb25bMF0gKyBjb250YWN0UG9pbnRBWzBdLCBib2R5QS5wb3NpdGlvblsxXSArIGNvbnRhY3RQb2ludEFbMV1dOwogICAgICAgIGNvbnN0IGNvbnRhY3ROb3JtYWwgPSBub3JtYWxBOyAvL2JvZHlBID09PSBib2R5ID8gbm9ybWFsQSA6IHZlYzIuc2NhbGUobm9ybWFsQSwgbm9ybWFsQSwgLTEpCgogICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICAgICAgYm9keTogYm9keUEudXVpZCwKICAgICAgICAgIGNvbGxpc2lvbkZpbHRlcnM6IHsKICAgICAgICAgICAgYm9keUZpbHRlckdyb3VwOiBzaGFwZUEuY29sbGlzaW9uR3JvdXAsCiAgICAgICAgICAgIGJvZHlGaWx0ZXJNYXNrOiBzaGFwZUEuY29sbGlzaW9uTWFzaywKICAgICAgICAgICAgdGFyZ2V0RmlsdGVyR3JvdXA6IHNoYXBlQi5jb2xsaXNpb25Hcm91cCwKICAgICAgICAgICAgdGFyZ2V0RmlsdGVyTWFzazogc2hhcGVCLmNvbGxpc2lvbk1hc2sKICAgICAgICAgIH0sCiAgICAgICAgICBjb250YWN0OiB7CiAgICAgICAgICAgIGJpOiBib2R5QS51dWlkLAogICAgICAgICAgICBiajogYm9keUIudXVpZCwKICAgICAgICAgICAgLy8gTm9ybWFsIG9mIHRoZSBjb250YWN0LCByZWxhdGl2ZSB0byB0aGUgY29sbGlkaW5nIGJvZHkKICAgICAgICAgICAgY29udGFjdE5vcm1hbDogY29udGFjdE5vcm1hbCwKICAgICAgICAgICAgLy8gV29ybGQgcG9zaXRpb24gb2YgdGhlIGNvbnRhY3QKICAgICAgICAgICAgY29udGFjdFBvaW50OiBjb250YWN0UG9pbnQsCiAgICAgICAgICAgIGltcGFjdFZlbG9jaXR5OiBjb250YWN0RXF1YXRpb24uZ2V0VmVsb2NpdHlBbG9uZ05vcm1hbCgpLAogICAgICAgICAgICBpbmRleCwKICAgICAgICAgICAgbmk6IG5vcm1hbEEsCiAgICAgICAgICAgIHJpOiBjb250YWN0UG9pbnRBLAogICAgICAgICAgICByajogY29udGFjdFBvaW50QgogICAgICAgICAgfSwKICAgICAgICAgIG9wOiAnZXZlbnQnLAogICAgICAgICAgdGFyZ2V0OiBib2R5Qi51dWlkLAogICAgICAgICAgdHlwZTogJ2NvbGxpZGUnIC8vZXZlbnQudHlwZQoKICAgICAgICB9KTsKICAgICAgfSk7CiAgICAgIE9iamVjdC5hc3NpZ24oc3RhdGUud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbCwgZGVmYXVsdENvbnRhY3RNYXRlcmlhbCk7CiAgICB9OwoKICAgIGNvbnN0IHN0ZXAgPSAoc3RhdGUsIF9yZWYpID0+IHsKICAgICAgbGV0IHsKICAgICAgICBwb3NpdGlvbnMsCiAgICAgICAgcHJvcHM6IHsKICAgICAgICAgIG1heFN1YlN0ZXBzLAogICAgICAgICAgc3RlcFNpemUsCiAgICAgICAgICB0aW1lU2luY2VMYXN0Q2FsbGVkCiAgICAgICAgfSwKICAgICAgICBxdWF0ZXJuaW9ucwogICAgICB9ID0gX3JlZjsKICAgICAgc3RhdGUud29ybGQuc3RlcChzdGVwU2l6ZSwgdGltZVNpbmNlTGFzdENhbGxlZCwgbWF4U3ViU3RlcHMpOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS53b3JsZC5ib2RpZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgICAgICBjb25zdCBiID0gc3RhdGUud29ybGQuYm9kaWVzW2ldOwogICAgICAgIGNvbnN0IHAgPSBbLi4uYi5wb3NpdGlvbl07CiAgICAgICAgcC5zcGxpY2Uoc3RhdGUubm9ybWFsSW5kZXgsIDAsIDApOwogICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihiLmFuZ2xlICogMC41KTsKICAgICAgICBwb3NpdGlvbnNbMyAqIGkgKyAwXSA9IHBbMF07CiAgICAgICAgcG9zaXRpb25zWzMgKiBpICsgMV0gPSBwWzFdOwogICAgICAgIHBvc2l0aW9uc1szICogaSArIDJdID0gcFsyXTsKICAgICAgICBxdWF0ZXJuaW9uc1s0ICogaSArIDBdID0gcyAqIC1zdGF0ZS5ub3JtYWxbMF07CiAgICAgICAgcXVhdGVybmlvbnNbNCAqIGkgKyAxXSA9IHMgKiBzdGF0ZS5ub3JtYWxbMV07CiAgICAgICAgcXVhdGVybmlvbnNbNCAqIGkgKyAyXSA9IHMgKiAtc3RhdGUubm9ybWFsWzJdOwogICAgICAgIHF1YXRlcm5pb25zWzQgKiBpICsgM10gPSAtTWF0aC5jb3MoYi5hbmdsZSAqIDAuNSk7CiAgICAgIH0KCiAgICAgIGNvbnN0IG9ic2VydmF0aW9ucyA9IFtdOwoKICAgICAgZm9yIChjb25zdCBpZCBvZiBPYmplY3Qua2V5cyhzdGF0ZS5zdWJzY3JpcHRpb25zKSkgewogICAgICAgIGNvbnN0IFt1dWlkLCB0eXBlLCB0YXJnZXQgPSAnYm9kaWVzJ10gPSBzdGF0ZS5zdWJzY3JpcHRpb25zW2lkXTsKICAgICAgICBjb25zdCB7CiAgICAgICAgICBib2RpZXMsCiAgICAgICAgICBjb250cm9sbGVycywKICAgICAgICAgIHZlaGljbGVzCiAgICAgICAgfSA9IHN0YXRlOwogICAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0ID09PSAndmVoaWNsZXMnID8gLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiBEaWZmZXJlbnRpYXRlIHRoZXNlICJ0eXBlcyIKICAgICAgICB2ZWhpY2xlc1t1dWlkXS52ZWhpY2xlW3R5cGVdIDogdGFyZ2V0ID09PSAnY29udHJvbGxlcnMnID8gLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiBEaWZmZXJlbnRpYXRlIHRoZXNlICJ0eXBlcyIKICAgICAgICBjb250cm9sbGVyc1t1dWlkXS5jb250cm9sbGVyW3R5cGVdIDogLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiBEaWZmZXJlbnRpYXRlIHRoZXNlICJ0eXBlcyIKICAgICAgICBib2RpZXNbdXVpZF1bdHlwZV07IC8vY29uc3Qgc2VyaWFsaXphYmxlVmFsdWU6IFByb3BWYWx1ZTx0eXBlb2YgdHlwZT4gPSBpc1FvclYodmFsdWUpID8gdmFsdWUudG9BcnJheSgpIDogdmFsdWUKCiAgICAgICAgb2JzZXJ2YXRpb25zLnB1c2goW051bWJlcihpZCksIHZhbHVlLCAvLyBAdHMtZXhwZWN0LWVycm9yIFRPRE86IERpZmZlcmVudGlhdGUgdGhlc2UgInR5cGVzIgogICAgICAgIHR5cGVdKTsKICAgICAgfQoKICAgICAgY29uc3QgbWVzc2FnZSA9IHsKICAgICAgICBhY3RpdmU6IHN0YXRlLndvcmxkLmJvZGllcy5zb21lKGJvZHkgPT4gYm9keS5zbGVlcFN0YXRlICE9PSBwMi5leHBvcnRzLkJvZHkuU0xFRVBJTkcpLAogICAgICAgIG9ic2VydmF0aW9ucywKICAgICAgICBvcDogJ2ZyYW1lJywKICAgICAgICBwb3NpdGlvbnMsCiAgICAgICAgcXVhdGVybmlvbnMKICAgICAgfTsKCiAgICAgIGlmIChzdGF0ZS5ib2RpZXNOZWVkU3luY2luZykgewogICAgICAgIG1lc3NhZ2UuYm9kaWVzID0gc3RhdGUud29ybGQuYm9kaWVzLnJlZHVjZSgoYm9kaWVzLCBib2R5KSA9PiB7CiAgICAgICAgICBpZiAoYm9keS51dWlkKSBib2RpZXMucHVzaChib2R5LnV1aWQpOwogICAgICAgICAgcmV0dXJuIGJvZGllczsKICAgICAgICB9LCBbXSk7CiAgICAgICAgc3RhdGUuYm9kaWVzTmVlZFN5bmNpbmcgPSBmYWxzZTsKICAgICAgfQoKICAgICAgc2VsZi5wb3N0TWVzc2FnZShtZXNzYWdlLCBbcG9zaXRpb25zLmJ1ZmZlciwgcXVhdGVybmlvbnMuYnVmZmVyXSk7CiAgICB9OwoKICAgIGNvbnN0IHN0YXRlID0gewogICAgICBib2RpZXM6IHt9LAogICAgICBib2RpZXNOZWVkU3luY2luZzogZmFsc2UsCiAgICAgIGNvbnN0cmFpbnRzOiB7fSwKICAgICAgY29udHJvbGxlcnM6IHt9LAogICAgICBtYXRlcmlhbHM6IHt9LAogICAgICBub3JtYWw6IFswLCAwLCAwXSwKICAgICAgbm9ybWFsSW5kZXg6IDAsCiAgICAgIHJheXM6IHt9LAogICAgICBzcHJpbmdJbnN0YW5jZXM6IHt9LAogICAgICBzcHJpbmdzOiB7fSwKICAgICAgc3Vic2NyaXB0aW9uczoge30sCiAgICAgIHZlaGljbGVzOiB7fSwKICAgICAgd29ybGQ6IG5ldyBwMi5leHBvcnRzLldvcmxkKCkKICAgIH07CgogICAgLy8vIDxyZWZlcmVuY2Ugbm8tZGVmYXVsdC1saWI9InRydWUiLz4KCiAgICBjb25zdCBpc1ByaXNtYXRpY0NvbnN0cmFpbnQgPSBjID0+IGMgaW5zdGFuY2VvZiBwMi5leHBvcnRzLlByaXNtYXRpY0NvbnN0cmFpbnQ7CgogICAgY29uc3QgaXNSZXZvbHV0ZUNvbnN0cmFpbnQgPSBjID0+IGMgaW5zdGFuY2VvZiBwMi5leHBvcnRzLlJldm9sdXRlQ29uc3RyYWludDsKCiAgICBmdW5jdGlvbiBzeW5jQm9kaWVzKCkgewogICAgICBzdGF0ZS5ib2RpZXNOZWVkU3luY2luZyA9IHRydWU7CiAgICAgIHN0YXRlLmJvZGllcyA9IHN0YXRlLndvcmxkLmJvZGllcy5yZWR1Y2UoKGJvZGllcywgYm9keSkgPT4gKHsgLi4uYm9kaWVzLAogICAgICAgIFtib2R5LnV1aWRdOiBib2R5CiAgICAgIH0pLCB7fSk7CiAgICB9IC8vY29uc3QgYnJvYWRwaGFzZXMgPSB7IE5haXZlQnJvYWRwaGFzZSwgU0FQQnJvYWRwaGFzZSB9CgoKICAgIGNvbnN0IGNyZWF0ZU1hdGVyaWFsID0gY3JlYXRlTWF0ZXJpYWxGYWN0b3J5KHN0YXRlLm1hdGVyaWFscyk7CgogICAgc2VsZi5vbm1lc3NhZ2UgPSBfcmVmID0+IHsKICAgICAgbGV0IHsKICAgICAgICBkYXRhCiAgICAgIH0gPSBfcmVmOwoKICAgICAgc3dpdGNoIChkYXRhLm9wKSB7CiAgICAgICAgY2FzZSAnaW5pdCc6CiAgICAgICAgICB7CiAgICAgICAgICAgIGluaXQoc3RhdGUsIGRhdGEucHJvcHMpOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnc3RlcCc6CiAgICAgICAgICB7CiAgICAgICAgICAgIHN0ZXAoc3RhdGUsIGRhdGEpOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnYWRkQm9kaWVzJzoKICAgICAgICAgIHsKICAgICAgICAgICAgYWRkQm9kaWVzKHN0YXRlLCBjcmVhdGVNYXRlcmlhbCwgZGF0YSk7CiAgICAgICAgICAgIHN5bmNCb2RpZXMoKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3JlbW92ZUJvZGllcyc6CiAgICAgICAgICB7CiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS51dWlkLmxlbmd0aDsgaSsrKSBzdGF0ZS53b3JsZC5yZW1vdmVCb2R5KHN0YXRlLmJvZGllc1tkYXRhLnV1aWRbaV1dKTsKCiAgICAgICAgICAgIHN5bmNCb2RpZXMoKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3N1YnNjcmliZSc6CiAgICAgICAgICB7CiAgICAgICAgICAgIGNvbnN0IHsKICAgICAgICAgICAgICBpZCwKICAgICAgICAgICAgICB0YXJnZXQsCiAgICAgICAgICAgICAgdHlwZQogICAgICAgICAgICB9ID0gZGF0YS5wcm9wczsKICAgICAgICAgICAgc3RhdGUuc3Vic2NyaXB0aW9uc1tpZF0gPSBbZGF0YS51dWlkLCB0eXBlLCB0YXJnZXRdOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAndW5zdWJzY3JpYmUnOgogICAgICAgICAgewogICAgICAgICAgICBkZWxldGUgc3RhdGUuc3Vic2NyaXB0aW9uc1tkYXRhLnByb3BzXTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3NldFBvc2l0aW9uJzoKICAgICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQoc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0ucG9zaXRpb24sIGRhdGEucHJvcHNbMF0sIGRhdGEucHJvcHNbMV0pOwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgJ3NldEFuZ2xlJzoKICAgICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmFuZ2xlID0gZGF0YS5wcm9wczsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRWZWxvY2l0eSc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS52ZWxvY2l0eSA9IFtkYXRhLnByb3BzWzBdLCBkYXRhLnByb3BzWzFdXTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRBbmd1bGFyVmVsb2NpdHknOgogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uYW5ndWxhclZlbG9jaXR5ID0gZGF0YS5wcm9wczsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRNYXNzJzoKICAgICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLm1hc3MgPSBkYXRhLnByb3BzOwogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0udXBkYXRlTWFzc1Byb3BlcnRpZXMoKTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRNYXRlcmlhbCc6CiAgICAgICAgICAvLyB0b2RvIG1hdGVyaWFsIGlzIHBlciBzaGFwZSBub3QgcGVyIGJvZHkKICAgICAgICAgIC8vc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0ubWF0ZXJpYWwgPSBkYXRhLnByb3BzID8gY3JlYXRlTWF0ZXJpYWwoZGF0YS5wcm9wcykgOiBudWxsCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0TGluZWFyRGFtcGluZyc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5kYW1waW5nID0gZGF0YS5wcm9wczsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRBbmd1bGFyRGFtcGluZyc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hbmd1bGFyRGFtcGluZyA9IGRhdGEucHJvcHM7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0QWxsb3dTbGVlcCc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hbGxvd1NsZWVwID0gZGF0YS5wcm9wczsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRTbGVlcFNwZWVkTGltaXQnOgogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uc2xlZXBTcGVlZExpbWl0ID0gZGF0YS5wcm9wczsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRTbGVlcFRpbWVMaW1pdCc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5zbGVlcFRpbWVMaW1pdCA9IGRhdGEucHJvcHM7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0Q29sbGlzaW9uRmlsdGVyR3JvdXAnOgogICAgICAgICAgLy8gc2hhcGVzIGhhdmUgdGhpcyBwcm9wCiAgICAgICAgICAvL3N0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmNvbGxpc2lvbkdyb3VwID0gZGF0YS5wcm9wcwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgJ3NldENvbGxpc2lvbkZpbHRlck1hc2snOgogICAgICAgICAgLy8gc2hhcGVzIGhhdmUgdGhpcyBwcm9wCiAgICAgICAgICAvL3N0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmNvbGxpc2lvbk1hc2sgPSBkYXRhLnByb3BzCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0Q29sbGlzaW9uUmVzcG9uc2UnOgogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uY29sbGlzaW9uUmVzcG9uc2UgPSBkYXRhLnByb3BzOwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgJ3NldEZpeGVkUm90YXRpb24nOgogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uZml4ZWRSb3RhdGlvbiA9IGRhdGEucHJvcHM7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0SXNUcmlnZ2VyJzoKICAgICAgICAgIC8vIHNoYXBlcyBoYXZlIHNlbnNvciBwcm9wCiAgICAgICAgICAvL3N0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmlzVHJpZ2dlciA9IGRhdGEucHJvcHMKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRHcmF2aXR5JzoKICAgICAgICAgIHAyLmV4cG9ydHMudmVjMi5zZXQoc3RhdGUud29ybGQuZ3Jhdml0eSwgZGF0YS5wcm9wc1swXSwgZGF0YS5wcm9wc1sxXSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0VG9sZXJhbmNlJzoKICAgICAgICAgIGlmIChzdGF0ZS53b3JsZC5zb2x2ZXIgaW5zdGFuY2VvZiBwMi5leHBvcnRzLkdTU29sdmVyKSB7CiAgICAgICAgICAgIHN0YXRlLndvcmxkLnNvbHZlci50b2xlcmFuY2UgPSBkYXRhLnByb3BzOwogICAgICAgICAgfQoKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdzZXRJdGVyYXRpb25zJzoKICAgICAgICAgIGlmIChzdGF0ZS53b3JsZC5zb2x2ZXIgaW5zdGFuY2VvZiBwMi5leHBvcnRzLkdTU29sdmVyKSB7CiAgICAgICAgICAgIHN0YXRlLndvcmxkLnNvbHZlci5pdGVyYXRpb25zID0gZGF0YS5wcm9wczsKICAgICAgICAgIH0KCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0QnJvYWRwaGFzZSc6CiAgICAgICAgICBzdGF0ZS53b3JsZC5icm9hZHBoYXNlID0gZGF0YS5wcm9wcyA9PT0gJ1NBUCcgPyBuZXcgcDIuZXhwb3J0cy5TQVBCcm9hZHBoYXNlKHAyLmV4cG9ydHMuQnJvYWRwaGFzZS5TQVApIDogbmV3IHAyLmV4cG9ydHMuTmFpdmVCcm9hZHBoYXNlKHAyLmV4cG9ydHMuQnJvYWRwaGFzZS5OQUlWRSk7IC8vc3RhdGUud29ybGQuYnJvYWRwaGFzZSA9IG5ldyAoYnJvYWRwaGFzZXNbYCR7ZGF0YS5wcm9wc31Ccm9hZHBoYXNlYF0gfHwgTmFpdmVCcm9hZHBoYXNlKShzdGF0ZS53b3JsZCkKCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnc2V0QXhpc0luZGV4JzoKICAgICAgICAgIGlmIChzdGF0ZS53b3JsZC5icm9hZHBoYXNlIGluc3RhbmNlb2YgcDIuZXhwb3J0cy5TQVBCcm9hZHBoYXNlKSB7CiAgICAgICAgICAgIHN0YXRlLndvcmxkLmJyb2FkcGhhc2UuYXhpc0luZGV4ID0gZGF0YS5wcm9wcyA9PT0gdW5kZWZpbmVkIHx8IGRhdGEucHJvcHMgPT09IG51bGwgPyAwIDogZGF0YS5wcm9wczsKICAgICAgICAgIH0KCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnYXBwbHlGb3JjZSc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hcHBseUZvcmNlKHAyLmV4cG9ydHMudmVjMi5mcm9tVmFsdWVzKC4uLmRhdGEucHJvcHNbMF0pLCBkYXRhLnByb3BzWzFdICYmIHAyLmV4cG9ydHMudmVjMi5mcm9tVmFsdWVzKC4uLmRhdGEucHJvcHNbMV0pKTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdhcHBseUltcHVsc2UnOgogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uYXBwbHlJbXB1bHNlKHAyLmV4cG9ydHMudmVjMi5mcm9tVmFsdWVzKC4uLmRhdGEucHJvcHNbMF0pLCBkYXRhLnByb3BzWzFdICYmIHAyLmV4cG9ydHMudmVjMi5mcm9tVmFsdWVzKC4uLmRhdGEucHJvcHNbMV0pKTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdhcHBseUxvY2FsRm9yY2UnOgogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uYXBwbHlGb3JjZUxvY2FsKHAyLmV4cG9ydHMudmVjMi5mcm9tVmFsdWVzKC4uLmRhdGEucHJvcHNbMF0pLCBkYXRhLnByb3BzWzFdICYmIHAyLmV4cG9ydHMudmVjMi5mcm9tVmFsdWVzKC4uLmRhdGEucHJvcHNbMV0pKTsKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBjYXNlICdhcHBseUxvY2FsSW1wdWxzZSc6CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hcHBseUltcHVsc2VMb2NhbChwMi5leHBvcnRzLnZlYzIuZnJvbVZhbHVlcyguLi5kYXRhLnByb3BzWzBdKSwgZGF0YS5wcm9wc1sxXSAmJiBwMi5leHBvcnRzLnZlYzIuZnJvbVZhbHVlcyguLi5kYXRhLnByb3BzWzFdKSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnYXBwbHlUb3JxdWUnOgogICAgICAgICAgLy9zdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hcHBseVRvcnF1ZSh2ZWMyLmZyb21WYWx1ZXMoLi4uZGF0YS5wcm9wc1swXSkpCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnYWRkQ29uc3RyYWludCc6CiAgICAgICAgICB7CiAgICAgICAgICAgIGFkZENvbnN0cmFpbnQoc3RhdGUsIGRhdGEpOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAncmVtb3ZlQ29uc3RyYWludCc6CiAgICAgICAgICBzdGF0ZS53b3JsZC5jb25zdHJhaW50cy5maWx0ZXIoX3JlZjIgPT4gewogICAgICAgICAgICBsZXQgewogICAgICAgICAgICAgIHV1aWQKICAgICAgICAgICAgfSA9IF9yZWYyOwogICAgICAgICAgICByZXR1cm4gdXVpZCA9PT0gZGF0YS51dWlkOwogICAgICAgICAgfSkubWFwKGMgPT4gc3RhdGUud29ybGQucmVtb3ZlQ29uc3RyYWludChjKSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnZW5hYmxlQ29uc3RyYWludE1vdG9yJzoKICAgICAgICAgIHN0YXRlLndvcmxkLmNvbnN0cmFpbnRzLmZpbHRlcihjID0+IGMudXVpZCA9PT0gZGF0YS51dWlkKS5maWx0ZXIoaXNQcmlzbWF0aWNDb25zdHJhaW50IHx8IGlzUmV2b2x1dGVDb25zdHJhaW50KS5tYXAoYyA9PiBjLmVuYWJsZU1vdG9yKCkpOwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgJ2Rpc2FibGVDb25zdHJhaW50TW90b3InOgogICAgICAgICAgc3RhdGUud29ybGQuY29uc3RyYWludHMuZmlsdGVyKGMgPT4gYy51dWlkID09PSBkYXRhLnV1aWQpLmZpbHRlcihpc1ByaXNtYXRpY0NvbnN0cmFpbnQgfHwgaXNSZXZvbHV0ZUNvbnN0cmFpbnQpLm1hcChjID0+IGMuZGlzYWJsZU1vdG9yKCkpOwogICAgICAgICAgYnJlYWs7CgogICAgICAgIGNhc2UgJ3NldENvbnN0cmFpbnRNb3RvclNwZWVkJzoKICAgICAgICAgIHN0YXRlLndvcmxkLmNvbnN0cmFpbnRzLmZpbHRlcihjID0+IGMudXVpZCA9PT0gZGF0YS51dWlkKS5maWx0ZXIoaXNSZXZvbHV0ZUNvbnN0cmFpbnQpLm1hcChjID0+IGMuc2V0TW90b3JTcGVlZChkYXRhLnByb3BzKSk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSAnYWRkU3ByaW5nJzoKICAgICAgICAgIHsKICAgICAgICAgICAgYWRkU3ByaW5nKHN0YXRlLCBkYXRhKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3NldFNwcmluZ1N0aWZmbmVzcyc6CiAgICAgICAgICB7CiAgICAgICAgICAgIHN0YXRlLnNwcmluZ0luc3RhbmNlc1tkYXRhLnV1aWRdLnN0aWZmbmVzcyA9IGRhdGEucHJvcHM7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfQoKICAgICAgICBjYXNlICdzZXRTcHJpbmdSZXN0TGVuZ3RoJzoKICAgICAgICAgIHsKICAgICAgICAgICAgLy8gb25seSBMaW5lYXJTcHJpbmcKICAgICAgICAgICAgLy9zdGF0ZS5zcHJpbmdJbnN0YW5jZXNbZGF0YS51dWlkXS5yZXN0TGVuZ3RoID0gZGF0YS5wcm9wcwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnc2V0U3ByaW5nRGFtcGluZyc6CiAgICAgICAgICB7CiAgICAgICAgICAgIHN0YXRlLnNwcmluZ0luc3RhbmNlc1tkYXRhLnV1aWRdLmRhbXBpbmcgPSBkYXRhLnByb3BzOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAncmVtb3ZlU3ByaW5nJzoKICAgICAgICAgIHsKICAgICAgICAgICAgLy8gbm90IG5lZWRlZCBpbiBwMj8KICAgICAgICAgICAgLy9zdGF0ZS53b3JsZC5vZmYoJ3Bvc3RTdGVwJywgc3RhdGUuc3ByaW5nc1tkYXRhLnV1aWRdKQogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnYWRkUmF5JzoKICAgICAgICAgIHsKICAgICAgICAgICAgYWRkUmF5KHN0YXRlLCBkYXRhKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3JlbW92ZVJheSc6CiAgICAgICAgICB7CiAgICAgICAgICAgIHN0YXRlLndvcmxkLm9mZigncHJlU29sdmUnLCBzdGF0ZS5yYXlzW2RhdGEudXVpZF0pOwogICAgICAgICAgICBkZWxldGUgc3RhdGUucmF5c1tkYXRhLnV1aWRdOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnYWRkQ29udGFjdE1hdGVyaWFsJzoKICAgICAgICAgIHsKICAgICAgICAgICAgYWRkQ29udGFjdE1hdGVyaWFsKHN0YXRlLndvcmxkLCBjcmVhdGVNYXRlcmlhbCwgZGF0YS5wcm9wcywgZGF0YS51dWlkKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3JlbW92ZUNvbnRhY3RNYXRlcmlhbCc6CiAgICAgICAgICB7CiAgICAgICAgICAgIHJlbW92ZUNvbnRhY3RNYXRlcmlhbChzdGF0ZS53b3JsZCwgZGF0YS51dWlkKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ2FkZFRvcERvd25WZWhpY2xlJzoKICAgICAgICAgIHsKICAgICAgICAgICAgYWRkVG9wRG93blZlaGljbGUoc3RhdGUsIGRhdGEpOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAncmVtb3ZlVG9wRG93blZlaGljbGUnOgogICAgICAgICAgewogICAgICAgICAgICBzdGF0ZS52ZWhpY2xlc1tkYXRhLnV1aWRdLnZlaGljbGUucmVtb3ZlRnJvbVdvcmxkKCk7CiAgICAgICAgICAgIGRlbGV0ZSBzdGF0ZS52ZWhpY2xlc1tkYXRhLnV1aWRdOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnc2V0VG9wRG93blZlaGljbGVTdGVlcmluZ1ZhbHVlJzoKICAgICAgICAgIHsKICAgICAgICAgICAgY29uc3QgW3ZhbHVlLCB3aGVlbEluZGV4XSA9IGRhdGEucHJvcHM7CiAgICAgICAgICAgIHN0YXRlLnZlaGljbGVzW2RhdGEudXVpZF0udmVoaWNsZS53aGVlbHNbd2hlZWxJbmRleF0uc3RlZXJWYWx1ZSA9IHZhbHVlOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnYXBwbHlUb3BEb3duVmVoaWNsZUVuZ2luZUZvcmNlJzoKICAgICAgICAgIHsKICAgICAgICAgICAgY29uc3QgW3ZhbHVlLCB3aGVlbEluZGV4XSA9IGRhdGEucHJvcHM7CiAgICAgICAgICAgIHN0YXRlLnZlaGljbGVzW2RhdGEudXVpZF0udmVoaWNsZS53aGVlbHNbd2hlZWxJbmRleF0uZW5naW5lRm9yY2UgPSB2YWx1ZTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3NldFRvcERvd25WZWhpY2xlQnJha2UnOgogICAgICAgICAgewogICAgICAgICAgICBjb25zdCBbYnJha2UsIHdoZWVsSW5kZXhdID0gZGF0YS5wcm9wczsKICAgICAgICAgICAgc3RhdGUudmVoaWNsZXNbZGF0YS51dWlkXS52ZWhpY2xlLndoZWVsc1t3aGVlbEluZGV4XS5zZXRCcmFrZUZvcmNlKGJyYWtlKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ2FkZEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXInOgogICAgICAgICAgewogICAgICAgICAgICBhZGRLaW5lbWF0aWNDaGFyYWN0ZXJDb250cm9sbGVyKHN0YXRlLCBkYXRhKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3JlbW92ZUtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXInOgogICAgICAgICAgewogICAgICAgICAgICBkZWxldGUgc3RhdGUuY29udHJvbGxlcnNbZGF0YS51dWlkXTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3NldEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXJJbnB1dCc6CiAgICAgICAgICB7CiAgICAgICAgICAgIGlmIChzdGF0ZS5jb250cm9sbGVyc1tkYXRhLnV1aWRdLmNvbnRyb2xsZXIgaW5zdGFuY2VvZiBLaW5lbWF0aWNDaGFyYWN0ZXJDb250cm9sbGVyKSB7CiAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IHN0YXRlLmNvbnRyb2xsZXJzW2RhdGEudXVpZF0uY29udHJvbGxlcjsKICAgICAgICAgICAgICBjb250cm9sbGVyLmlucHV0ID0gZGF0YS5wcm9wczsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3NldEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXJKdW1wJzoKICAgICAgICAgIHsKICAgICAgICAgICAgaWYgKHN0YXRlLmNvbnRyb2xsZXJzW2RhdGEudXVpZF0uY29udHJvbGxlciBpbnN0YW5jZW9mIEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXIpIHsKICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gc3RhdGUuY29udHJvbGxlcnNbZGF0YS51dWlkXS5jb250cm9sbGVyOwogICAgICAgICAgICAgIGNvbnRyb2xsZXIuc2V0SnVtcEtleVN0YXRlKGRhdGEucHJvcHMpOwogICAgICAgICAgICB9CgogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAnYWRkUGxhdGZvcm1Db250cm9sbGVyJzoKICAgICAgICAgIHsKICAgICAgICAgICAgY29uc3QgW2JvZHksIHBhc3Nlbmdlck1hc2ssIGxvY2FsV2F5cG9pbnRzLCBzcGVlZCwgc2tpbldpZHRoLCBkc3RCZXR3ZWVuUmF5c10gPSBkYXRhLnByb3BzOwogICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IFBsYXRmb3JtQ29udHJvbGxlcih7CiAgICAgICAgICAgICAgYm9keTogc3RhdGUuYm9kaWVzW2JvZHldLAogICAgICAgICAgICAgIC8vY29udHJvbGxlcnM6IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhzdGF0ZS5jb250cm9sbGVycykuZmlsdGVyKChbLCB2YWxdKSA9PiB2YWwuY29udHJvbGxlciBpbnN0YW5jZW9mIEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXIpKSBhcyB7IFt1dWlkOiBzdHJpbmddOiB7IGNvbnRyb2xsZXI6IEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXIgfSB9LAogICAgICAgICAgICAgIGNvbnRyb2xsZXJzOiBzdGF0ZS5jb250cm9sbGVycywKICAgICAgICAgICAgICBkc3RCZXR3ZWVuUmF5cywKICAgICAgICAgICAgICBsb2NhbFdheXBvaW50cywKICAgICAgICAgICAgICBwYXNzZW5nZXJNYXNrLAogICAgICAgICAgICAgIHNraW5XaWR0aCwKICAgICAgICAgICAgICBzcGVlZCwKICAgICAgICAgICAgICB3b3JsZDogc3RhdGUud29ybGQKICAgICAgICAgICAgfSk7CiAgICAgICAgICAgIHN0YXRlLmNvbnRyb2xsZXJzW2RhdGEudXVpZF0gPSB7CiAgICAgICAgICAgICAgY29udHJvbGxlcgogICAgICAgICAgICB9OwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgY2FzZSAncmVtb3ZlUGxhdGZvcm1Db250cm9sbGVyJzoKICAgICAgICAgIHsKICAgICAgICAgICAgZGVsZXRlIHN0YXRlLmNvbnRyb2xsZXJzW2RhdGEudXVpZF07CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfQoKICAgICAgICBjYXNlICd3YWtlVXAnOgogICAgICAgICAgewogICAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS53YWtlVXAoKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgIGNhc2UgJ3NsZWVwJzoKICAgICAgICAgIHsKICAgICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uc2xlZXAoKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgIH0KICAgIH07Cgp9KSgpOwoK", null, false);
var CannonWorkerAPI = class extends import_events.default {
  get axisIndex() {
    return this.config.axisIndex;
  }
  set axisIndex(value) {
    this.config.axisIndex = value;
    this.worker.postMessage({
      op: "setAxisIndex",
      props: value
    });
  }
  get broadphase() {
    return this.config.broadphase;
  }
  set broadphase(value) {
    this.config.broadphase = value;
    this.worker.postMessage({
      op: "setBroadphase",
      props: value
    });
  }
  get gravity() {
    return this.config.gravity;
  }
  set gravity(value) {
    this.config.gravity = value;
    this.worker.postMessage({
      op: "setGravity",
      props: value
    });
  }
  get iterations() {
    return this.config.iterations;
  }
  set iterations(value) {
    this.config.iterations = value;
    this.worker.postMessage({
      op: "setIterations",
      props: value
    });
  }
  get tolerance() {
    return this.config.tolerance;
  }
  set tolerance(value) {
    this.config.tolerance = value;
    this.worker.postMessage({
      op: "setTolerance",
      props: value
    });
  }
  constructor(_ref) {
    let {
      allowSleep = false,
      axisIndex = 0,
      broadphase = "Naive",
      defaultContactMaterial = {
        friction: 0.3,
        restitution: 0
      },
      gravity = [0, -9.81],
      iterations = 5,
      normalIndex = 0,
      quatNormalizeFast = false,
      quatNormalizeSkip = 0,
      size = 1e3,
      solver = "GS",
      tolerance = 1e-3
    } = _ref;
    super();
    this.worker = new WorkerFactory();
    this.config = {
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      gravity,
      iterations,
      normalIndex,
      quatNormalizeFast,
      quatNormalizeSkip,
      size,
      solver,
      tolerance
    };
    this.buffers = {
      positions: new Float32Array(size * 3),
      quaternions: new Float32Array(size * 4)
    };
    this.worker.onmessage = (message) => {
      if (message.data.op === "frame") {
        this.buffers.positions = message.data.positions;
        this.buffers.quaternions = message.data.quaternions;
        this.emit(message.data.op, message.data);
        return;
      }
      this.emit(message.data.type, message.data);
    };
  }
  addBodies(_ref2) {
    let {
      props,
      type,
      uuid
    } = _ref2;
    this.worker.postMessage({
      op: "addBodies",
      props,
      type,
      uuid
    });
  }
  addConstraint(_ref3) {
    let {
      props: [refA, refB, optns],
      type,
      uuid
    } = _ref3;
    this.worker.postMessage({
      op: "addConstraint",
      props: [refA, refB, optns],
      type,
      uuid
    });
  }
  addContactMaterial(_ref4) {
    let {
      props,
      uuid
    } = _ref4;
    this.worker.postMessage({
      op: "addContactMaterial",
      props,
      uuid
    });
  }
  addKinematicCharacterController(_ref5) {
    let {
      props: [accelerationTimeAirborne, accelerationTimeGrounded, body, collisionMask, dstBetweenRays, maxClimbAngle, maxDescendAngle, maxJumpHeight, minJumpHeight, moveSpeed, skinWidth, timeToJumpApex, velocityXMin, velocityXSmoothing, wallJumpClimb, wallJumpOff, wallLeap, wallSlideSpeedMax, wallStickTime],
      uuid
    } = _ref5;
    this.worker.postMessage({
      op: "addKinematicCharacterController",
      props: [accelerationTimeAirborne, accelerationTimeGrounded, body, collisionMask, dstBetweenRays, maxClimbAngle, maxDescendAngle, maxJumpHeight, minJumpHeight, moveSpeed, skinWidth, timeToJumpApex, velocityXMin, velocityXSmoothing, wallJumpClimb, wallJumpOff, wallLeap, wallSlideSpeedMax, wallStickTime],
      uuid
    });
  }
  addPlatformController(_ref6) {
    let {
      props: [body, passengerMask, localWaypoints, speed, skinWidth, dstBetweenRays],
      uuid
    } = _ref6;
    this.worker.postMessage({
      op: "addPlatformController",
      props: [body, passengerMask, localWaypoints, speed, skinWidth, dstBetweenRays],
      uuid
    });
  }
  addRay(_ref7) {
    let {
      props,
      uuid
    } = _ref7;
    this.worker.postMessage({
      op: "addRay",
      props,
      uuid
    });
  }
  addSpring(_ref8) {
    let {
      props: [refA, refB, optns],
      uuid
    } = _ref8;
    this.worker.postMessage({
      op: "addSpring",
      props: [refA, refB, optns],
      uuid
    });
  }
  addTopDownVehicle(_ref9) {
    let {
      props: [chassisBodyUUID, wheelInfos],
      uuid
    } = _ref9;
    this.worker.postMessage({
      op: "addTopDownVehicle",
      props: [chassisBodyUUID, wheelInfos],
      uuid
    });
  }
  applyForce(_ref10) {
    let {
      props,
      uuid
    } = _ref10;
    this.worker.postMessage({
      op: "applyForce",
      props,
      uuid
    });
  }
  applyImpulse(_ref11) {
    let {
      props,
      uuid
    } = _ref11;
    this.worker.postMessage({
      op: "applyImpulse",
      props,
      uuid
    });
  }
  applyLocalForce(_ref12) {
    let {
      props,
      uuid
    } = _ref12;
    this.worker.postMessage({
      op: "applyLocalForce",
      props,
      uuid
    });
  }
  applyLocalImpulse(_ref13) {
    let {
      props,
      uuid
    } = _ref13;
    this.worker.postMessage({
      op: "applyLocalImpulse",
      props,
      uuid
    });
  }
  applyTopDownVehicleEngineForce(_ref14) {
    let {
      props,
      uuid
    } = _ref14;
    this.worker.postMessage({
      op: "applyTopDownVehicleEngineForce",
      props,
      uuid
    });
  }
  applyTorque(_ref15) {
    let {
      props,
      uuid
    } = _ref15;
    this.worker.postMessage({
      op: "applyTorque",
      props,
      uuid
    });
  }
  disableConstraintMotor(_ref16) {
    let {
      uuid
    } = _ref16;
    this.worker.postMessage({
      op: "disableConstraintMotor",
      uuid
    });
  }
  enableConstraintMotor(_ref17) {
    let {
      uuid
    } = _ref17;
    this.worker.postMessage({
      op: "enableConstraintMotor",
      uuid
    });
  }
  init() {
    const {
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      gravity,
      iterations,
      normalIndex,
      quatNormalizeFast,
      quatNormalizeSkip,
      solver,
      tolerance
    } = this.config;
    this.worker.postMessage({
      op: "init",
      props: {
        allowSleep,
        axisIndex,
        broadphase,
        defaultContactMaterial,
        gravity,
        iterations,
        normalIndex,
        quatNormalizeFast,
        quatNormalizeSkip,
        solver,
        tolerance
      }
    });
  }
  removeBodies(_ref18) {
    let {
      uuid
    } = _ref18;
    this.worker.postMessage({
      op: "removeBodies",
      uuid
    });
  }
  removeConstraint(_ref19) {
    let {
      uuid
    } = _ref19;
    this.worker.postMessage({
      op: "removeConstraint",
      uuid
    });
  }
  removeContactMaterial(_ref20) {
    let {
      uuid
    } = _ref20;
    this.worker.postMessage({
      op: "removeContactMaterial",
      uuid
    });
  }
  removeKinematicCharacterController(_ref21) {
    let {
      uuid
    } = _ref21;
    this.worker.postMessage({
      op: "removeKinematicCharacterController",
      uuid
    });
  }
  removePlatformController(_ref22) {
    let {
      uuid
    } = _ref22;
    this.worker.postMessage({
      op: "removePlatformController",
      uuid
    });
  }
  removeRay(_ref23) {
    let {
      uuid
    } = _ref23;
    this.worker.postMessage({
      op: "removeRay",
      uuid
    });
  }
  removeSpring(_ref24) {
    let {
      uuid
    } = _ref24;
    this.worker.postMessage({
      op: "removeSpring",
      uuid
    });
  }
  removeTopDownVehicle(_ref25) {
    let {
      uuid
    } = _ref25;
    this.worker.postMessage({
      op: "removeTopDownVehicle",
      uuid
    });
  }
  setAllowSleep(_ref26) {
    let {
      props,
      uuid
    } = _ref26;
    this.worker.postMessage({
      op: "setAllowSleep",
      props,
      uuid
    });
  }
  setAngle(_ref27) {
    let {
      props,
      uuid
    } = _ref27;
    this.worker.postMessage({
      op: "setAngle",
      props,
      uuid
    });
  }
  setAngularDamping(_ref28) {
    let {
      props,
      uuid
    } = _ref28;
    this.worker.postMessage({
      op: "setAngularDamping",
      props,
      uuid
    });
  }
  setAngularVelocity(_ref29) {
    let {
      props,
      uuid
    } = _ref29;
    this.worker.postMessage({
      op: "setAngularVelocity",
      props,
      uuid
    });
  }
  setCollisionFilterGroup(_ref30) {
    let {
      props,
      uuid
    } = _ref30;
    this.worker.postMessage({
      op: "setCollisionFilterGroup",
      props,
      uuid
    });
  }
  setCollisionFilterMask(_ref31) {
    let {
      props,
      uuid
    } = _ref31;
    this.worker.postMessage({
      op: "setCollisionFilterMask",
      props,
      uuid
    });
  }
  setCollisionResponse(_ref32) {
    let {
      props,
      uuid
    } = _ref32;
    this.worker.postMessage({
      op: "setCollisionResponse",
      props,
      uuid
    });
  }
  setConstraintMotorSpeed(_ref33) {
    let {
      props,
      uuid
    } = _ref33;
    this.worker.postMessage({
      op: "setConstraintMotorSpeed",
      props,
      uuid
    });
  }
  setFixedRotation(_ref34) {
    let {
      props,
      uuid
    } = _ref34;
    this.worker.postMessage({
      op: "setFixedRotation",
      props,
      uuid
    });
  }
  setIsTrigger(_ref35) {
    let {
      props,
      uuid
    } = _ref35;
    this.worker.postMessage({
      op: "setIsTrigger",
      props,
      uuid
    });
  }
  setKinematicCharacterControllerInput(_ref36) {
    let {
      props,
      uuid
    } = _ref36;
    this.worker.postMessage({
      op: "setKinematicCharacterControllerInput",
      props,
      uuid
    });
  }
  setKinematicCharacterControllerJump(_ref37) {
    let {
      props,
      uuid
    } = _ref37;
    this.worker.postMessage({
      op: "setKinematicCharacterControllerJump",
      props,
      uuid
    });
  }
  setLinearDamping(_ref38) {
    let {
      props,
      uuid
    } = _ref38;
    this.worker.postMessage({
      op: "setLinearDamping",
      props,
      uuid
    });
  }
  setMass(_ref39) {
    let {
      props,
      uuid
    } = _ref39;
    this.worker.postMessage({
      op: "setMass",
      props,
      uuid
    });
  }
  setMaterial(_ref40) {
    let {
      props,
      uuid
    } = _ref40;
    this.worker.postMessage({
      op: "setMaterial",
      props,
      uuid
    });
  }
  setPosition(_ref41) {
    let {
      props,
      uuid
    } = _ref41;
    this.worker.postMessage({
      op: "setPosition",
      props,
      uuid
    });
  }
  setSleepSpeedLimit(_ref42) {
    let {
      props,
      uuid
    } = _ref42;
    this.worker.postMessage({
      op: "setSleepSpeedLimit",
      props,
      uuid
    });
  }
  setSleepTimeLimit(_ref43) {
    let {
      props,
      uuid
    } = _ref43;
    this.worker.postMessage({
      op: "setSleepTimeLimit",
      props,
      uuid
    });
  }
  setSpringDamping(_ref44) {
    let {
      props,
      uuid
    } = _ref44;
    this.worker.postMessage({
      op: "setSpringDamping",
      props,
      uuid
    });
  }
  setSpringRestLength(_ref45) {
    let {
      props,
      uuid
    } = _ref45;
    this.worker.postMessage({
      op: "setSpringRestLength",
      props,
      uuid
    });
  }
  setSpringStiffness(_ref46) {
    let {
      props,
      uuid
    } = _ref46;
    this.worker.postMessage({
      op: "setSpringStiffness",
      props,
      uuid
    });
  }
  setTopDownVehicleBrake(_ref47) {
    let {
      props,
      uuid
    } = _ref47;
    this.worker.postMessage({
      op: "setTopDownVehicleBrake",
      props,
      uuid
    });
  }
  setTopDownVehicleSteeringValue(_ref48) {
    let {
      props,
      uuid
    } = _ref48;
    this.worker.postMessage({
      op: "setTopDownVehicleSteeringValue",
      props,
      uuid
    });
  }
  setUserData(_ref49) {
    let {
      props,
      uuid
    } = _ref49;
    this.worker.postMessage({
      op: "setUserData",
      props,
      uuid
    });
  }
  setVelocity(_ref50) {
    let {
      props,
      uuid
    } = _ref50;
    this.worker.postMessage({
      op: "setVelocity",
      props,
      uuid
    });
  }
  sleep(_ref51) {
    let {
      uuid
    } = _ref51;
    this.worker.postMessage({
      op: "sleep",
      uuid
    });
  }
  step(props) {
    const {
      buffers: {
        positions,
        quaternions
      }
    } = this;
    if (!positions.byteLength && !quaternions.byteLength) return;
    this.worker.postMessage({
      op: "step",
      positions,
      props,
      quaternions
    }, [positions.buffer, quaternions.buffer]);
  }
  subscribe(_ref52) {
    let {
      props: {
        id,
        target,
        type
      },
      uuid
    } = _ref52;
    this.worker.postMessage({
      op: "subscribe",
      props: {
        id,
        target,
        type
      },
      uuid
    });
  }
  terminate() {
    this.worker.terminate();
  }
  unsubscribe(_ref53) {
    let {
      props
    } = _ref53;
    this.worker.postMessage({
      op: "unsubscribe",
      props
    });
  }
  wakeUp(_ref54) {
    let {
      uuid
    } = _ref54;
    this.worker.postMessage({
      op: "wakeUp",
      uuid
    });
  }
};
var v$1 = new Vector3();
var s$1 = new Vector3(1, 1, 1);
var q$1 = new Quaternion();
var m = new Matrix4();
function apply(index, positions, quaternions, object) {
  if (index !== void 0) {
    m.compose(v$1.fromArray(positions, index * 3), q$1.fromArray(quaternions, index * 4), object ? object.scale : s$1);
    if (object) {
      object.matrixAutoUpdate = false;
      object.matrix.copy(m);
    }
    return m;
  }
  return m.identity();
}
var Provider = (_ref) => {
  let {
    allowSleep = false,
    axisIndex = 0,
    broadphase = "Naive",
    children,
    defaultContactMaterial = {
      friction: 0.3,
      restitution: 0
    },
    gravity = [0, -9.81],
    isPaused = false,
    iterations = 5,
    maxSubSteps = 10,
    normalIndex = 0,
    quatNormalizeFast = false,
    quatNormalizeSkip = 0,
    shouldInvalidate = true,
    size = 1e3,
    solver = "GS",
    stepSize = 1 / 60,
    tolerance = 1e-3
  } = _ref;
  const {
    invalidate
  } = useThree();
  const [worker] = (0, import_react.useState)(() => new CannonWorkerAPI({
    allowSleep,
    axisIndex,
    broadphase,
    defaultContactMaterial,
    gravity,
    iterations,
    normalIndex,
    quatNormalizeFast,
    quatNormalizeSkip,
    size,
    solver,
    tolerance
  }));
  const [refs] = (0, import_react.useState)({});
  const [events] = (0, import_react.useState)({});
  const [subscriptions] = (0, import_react.useState)({});
  const bodies = (0, import_react.useRef)({});
  let timeSinceLastCalled = 0;
  const loop = (0, import_react.useCallback)((_, delta) => {
    if (isPaused) return;
    timeSinceLastCalled += delta;
    worker.step({
      maxSubSteps,
      stepSize,
      timeSinceLastCalled
    });
    timeSinceLastCalled = 0;
  }, [isPaused, maxSubSteps, stepSize]);
  const collideHandler = (_ref2) => {
    var _a;
    let {
      body,
      contact: {
        bi,
        bj,
        ...contactRest
      },
      target,
      ...rest
    } = _ref2;
    const cb = (_a = events[target]) == null ? void 0 : _a.collide;
    cb && cb({
      body: refs[body],
      contact: {
        bi: refs[bi],
        bj: refs[bj],
        ...contactRest
      },
      target: refs[target],
      ...rest
    });
  };
  const collideBeginHandler = (_ref3) => {
    var _a, _b;
    let {
      bodyA,
      bodyB
    } = _ref3;
    const cbA = (_a = events[bodyA]) == null ? void 0 : _a.collideBegin;
    cbA && cbA({
      body: refs[bodyB],
      op: "event",
      target: refs[bodyA],
      type: "collideBegin"
    });
    const cbB = (_b = events[bodyB]) == null ? void 0 : _b.collideBegin;
    cbB && cbB({
      body: refs[bodyA],
      op: "event",
      target: refs[bodyB],
      type: "collideBegin"
    });
  };
  const collideEndHandler = (_ref4) => {
    var _a, _b;
    let {
      bodyA,
      bodyB
    } = _ref4;
    const cbA = (_a = events[bodyA]) == null ? void 0 : _a.collideEnd;
    cbA && cbA({
      body: refs[bodyB],
      op: "event",
      target: refs[bodyA],
      type: "collideEnd"
    });
    const cbB = (_b = events[bodyB]) == null ? void 0 : _b.collideEnd;
    cbB && cbB({
      body: refs[bodyA],
      op: "event",
      target: refs[bodyB],
      type: "collideEnd"
    });
  };
  const frameHandler = (_ref5) => {
    let {
      active,
      bodies: uuids = [],
      observations,
      positions,
      quaternions
    } = _ref5;
    for (let i = 0; i < uuids.length; i++) {
      bodies.current[uuids[i]] = i;
    }
    observations.forEach((_ref6) => {
      let [id, value2, type] = _ref6;
      const subscription = subscriptions[id] || {};
      const cb = subscription[type];
      cb && cb(value2);
    });
    if (active) {
      for (const ref of Object.values(refs)) {
        if (ref instanceof InstancedMesh) {
          for (let i = 0; i < ref.count; i++) {
            const index = bodies.current[`${ref.uuid}/${i}`];
            if (index !== void 0) {
              ref.setMatrixAt(i, apply(index, positions, quaternions));
            }
            ref.instanceMatrix.needsUpdate = true;
          }
        } else {
          apply(bodies.current[ref.uuid], positions, quaternions, ref);
        }
      }
      if (shouldInvalidate) {
        invalidate();
      }
    }
  };
  const rayhitHandler = (_ref7) => {
    var _a;
    let {
      body,
      ray: {
        uuid,
        ...rayRest
      },
      ...rest
    } = _ref7;
    const cb = (_a = events[uuid]) == null ? void 0 : _a.rayhit;
    cb && cb({
      body: body ? refs[body] : null,
      ray: {
        uuid,
        ...rayRest
      },
      ...rest
    });
  };
  useFrame(loop);
  (0, import_react.useLayoutEffect)(() => {
    worker.init();
    worker.on("collide", collideHandler);
    worker.on("collideBegin", collideBeginHandler);
    worker.on("collideEnd", collideEndHandler);
    worker.on("frame", frameHandler);
    worker.on("rayhit", rayhitHandler);
    return () => {
      worker.terminate();
      worker.removeAllListeners();
    };
  }, []);
  useUpdateWorldPropsEffect({
    axisIndex,
    broadphase,
    gravity,
    iterations,
    tolerance,
    worker
  });
  const value = (0, import_react.useMemo)(() => ({
    bodies,
    events,
    refs,
    subscriptions,
    worker
  }), [bodies, events, refs, subscriptions, worker]);
  return (0, import_jsx_runtime.jsx)(context.Provider, {
    value,
    children
  });
};
var p2 = { exports: {} };
var vec2$q = { exports: {} };
var Utils_1 = Utils$7;
function Utils$7() {
}
Utils$7.appendArray = function(a, b) {
  if (b.length < 15e4) {
    a.push.apply(a, b);
  } else {
    for (var i = 0, len = b.length; i !== len; ++i) {
      a.push(b[i]);
    }
  }
};
Utils$7.splice = function(array, index, howmany) {
  howmany = howmany || 1;
  for (var i = index, len = array.length - howmany; i < len; i++) {
    array[i] = array[i + howmany];
  }
  array.length = len;
};
Utils$7.arrayRemove = function(array, element) {
  var idx = array.indexOf(element);
  if (idx !== -1) {
    Utils$7.splice(array, idx, 1);
  }
};
if (typeof P2_ARRAY_TYPE !== "undefined") {
  Utils$7.ARRAY_TYPE = P2_ARRAY_TYPE;
} else if (typeof Float32Array !== "undefined") {
  Utils$7.ARRAY_TYPE = Float32Array;
} else {
  Utils$7.ARRAY_TYPE = Array;
}
Utils$7.extend = function(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
};
Utils$7.shallowClone = function(obj) {
  var newObj = {};
  Utils$7.extend(newObj, obj);
  return newObj;
};
Utils$7.defaults = function(options, defaults) {
  console.warn("Utils.defaults is deprecated.");
  options = options || {};
  for (var key in defaults) {
    if (!(key in options)) {
      options[key] = defaults[key];
    }
  }
  return options;
};
var vec2$p = vec2$q.exports = {};
var Utils$6 = Utils_1;
vec2$p.crossLength = function(a, b) {
  return a[0] * b[1] - a[1] * b[0];
};
vec2$p.crossVZ = function(out, vec, zcomp) {
  vec2$p.rotate(out, vec, -Math.PI / 2);
  vec2$p.scale(out, out, zcomp);
  return out;
};
vec2$p.crossZV = function(out, zcomp, vec) {
  vec2$p.rotate(out, vec, Math.PI / 2);
  vec2$p.scale(out, out, zcomp);
  return out;
};
vec2$p.rotate = function(out, a, angle) {
  if (angle !== 0) {
    var c = Math.cos(angle), s2 = Math.sin(angle), x = a[0], y = a[1];
    out[0] = c * x - s2 * y;
    out[1] = s2 * x + c * y;
  } else {
    out[0] = a[0];
    out[1] = a[1];
  }
  return out;
};
vec2$p.rotate90cw = function(out, a) {
  var x = a[0];
  var y = a[1];
  out[0] = y;
  out[1] = -x;
  return out;
};
vec2$p.toLocalFrame = function(out, worldPoint, framePosition, frameAngle) {
  var c = Math.cos(-frameAngle), s2 = Math.sin(-frameAngle), x = worldPoint[0] - framePosition[0], y = worldPoint[1] - framePosition[1];
  out[0] = c * x - s2 * y;
  out[1] = s2 * x + c * y;
  return out;
};
vec2$p.toGlobalFrame = function(out, localPoint, framePosition, frameAngle) {
  var c = Math.cos(frameAngle), s2 = Math.sin(frameAngle), x = localPoint[0], y = localPoint[1], addX = framePosition[0], addY = framePosition[1];
  out[0] = c * x - s2 * y + addX;
  out[1] = s2 * x + c * y + addY;
};
vec2$p.vectorToLocalFrame = function(out, worldVector, frameAngle) {
  var c = Math.cos(-frameAngle), s2 = Math.sin(-frameAngle), x = worldVector[0], y = worldVector[1];
  out[0] = c * x - s2 * y;
  out[1] = s2 * x + c * y;
  return out;
};
vec2$p.vectorToGlobalFrame = vec2$p.rotate;
vec2$p.centroid = function(out, a, b, c) {
  vec2$p.add(out, a, b);
  vec2$p.add(out, out, c);
  vec2$p.scale(out, out, 1 / 3);
  return out;
};
vec2$p.create = function() {
  var out = new Utils$6.ARRAY_TYPE(2);
  out[0] = 0;
  out[1] = 0;
  return out;
};
vec2$p.clone = function(a) {
  var out = new Utils$6.ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
};
vec2$p.fromValues = function(x, y) {
  var out = new Utils$6.ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
};
vec2$p.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
};
vec2$p.set = function(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
};
vec2$p.add = function(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
};
vec2$p.subtract = function(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
};
vec2$p.multiply = function(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};
vec2$p.divide = function(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};
vec2$p.scale = function(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};
vec2$p.distance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
};
vec2$p.squaredDistance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return x * x + y * y;
};
vec2$p.length = function(a) {
  var x = a[0], y = a[1];
  return Math.sqrt(x * x + y * y);
};
vec2$p.squaredLength = function(a) {
  var x = a[0], y = a[1];
  return x * x + y * y;
};
vec2$p.negate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};
vec2$p.normalize = function(out, a) {
  var x = a[0], y = a[1];
  var len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};
vec2$p.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1];
};
vec2$p.str = function(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
};
vec2$p.lerp = function(out, a, b, t2) {
  var ax = a[0], ay = a[1];
  out[0] = ax + t2 * (b[0] - ax);
  out[1] = ay + t2 * (b[1] - ay);
  return out;
};
vec2$p.reflect = function(out, vector, normal) {
  var dot2 = vector[0] * normal[0] + vector[1] * normal[1];
  out[0] = vector[0] - 2 * normal[0] * dot2;
  out[1] = vector[1] - 2 * normal[1] * dot2;
};
vec2$p.getLineSegmentsIntersection = function(out, p0, p1, p22, p3) {
  var t2 = vec2$p.getLineSegmentsIntersectionFraction(p0, p1, p22, p3);
  if (t2 < 0) {
    return false;
  } else {
    out[0] = p0[0] + t2 * (p1[0] - p0[0]);
    out[1] = p0[1] + t2 * (p1[1] - p0[1]);
    return true;
  }
};
vec2$p.getLineSegmentsIntersectionFraction = function(p0, p1, p22, p3) {
  var s1_x = p1[0] - p0[0];
  var s1_y = p1[1] - p0[1];
  var s2_x = p3[0] - p22[0];
  var s2_y = p3[1] - p22[1];
  var s2, t2;
  s2 = (-s1_y * (p0[0] - p22[0]) + s1_x * (p0[1] - p22[1])) / (-s2_x * s1_y + s1_x * s2_y);
  t2 = (s2_x * (p0[1] - p22[1]) - s2_y * (p0[0] - p22[0])) / (-s2_x * s1_y + s1_x * s2_y);
  if (s2 >= 0 && s2 <= 1 && t2 >= 0 && t2 <= 1) {
    return t2;
  }
  return -1;
};
var vec2$o = vec2$q.exports;
var AABB_1 = AABB$2;
function AABB$2(options) {
  options = options || {};
  this.lowerBound = options.lowerBound ? vec2$o.clone(options.lowerBound) : vec2$o.create();
  this.upperBound = options.upperBound ? vec2$o.clone(options.upperBound) : vec2$o.create();
}
var tmp$2 = vec2$o.create();
AABB$2.prototype.setFromPoints = function(points2, position, angle, skinSize) {
  var l2 = this.lowerBound, u = this.upperBound;
  angle = angle || 0;
  if (angle !== 0) {
    vec2$o.rotate(l2, points2[0], angle);
  } else {
    vec2$o.copy(l2, points2[0]);
  }
  vec2$o.copy(u, l2);
  var cosAngle = Math.cos(angle), sinAngle = Math.sin(angle);
  for (var i = 1; i < points2.length; i++) {
    var p = points2[i];
    if (angle !== 0) {
      var x = p[0], y = p[1];
      tmp$2[0] = cosAngle * x - sinAngle * y;
      tmp$2[1] = sinAngle * x + cosAngle * y;
      p = tmp$2;
    }
    for (var j = 0; j < 2; j++) {
      if (p[j] > u[j]) {
        u[j] = p[j];
      }
      if (p[j] < l2[j]) {
        l2[j] = p[j];
      }
    }
  }
  if (position) {
    vec2$o.add(l2, l2, position);
    vec2$o.add(u, u, position);
  }
  if (skinSize) {
    l2[0] -= skinSize;
    l2[1] -= skinSize;
    u[0] += skinSize;
    u[1] += skinSize;
  }
};
AABB$2.prototype.copy = function(aabb) {
  vec2$o.copy(this.lowerBound, aabb.lowerBound);
  vec2$o.copy(this.upperBound, aabb.upperBound);
};
AABB$2.prototype.extend = function(aabb) {
  var lower = this.lowerBound, upper = this.upperBound;
  var i = 2;
  while (i--) {
    var l2 = aabb.lowerBound[i];
    if (lower[i] > l2) {
      lower[i] = l2;
    }
    var u = aabb.upperBound[i];
    if (upper[i] < u) {
      upper[i] = u;
    }
  }
};
AABB$2.prototype.overlaps = function(aabb) {
  var l1 = this.lowerBound, u1 = this.upperBound, l2 = aabb.lowerBound, u2 = aabb.upperBound;
  return (l2[0] <= u1[0] && u1[0] <= u2[0] || l1[0] <= u2[0] && u2[0] <= u1[0]) && (l2[1] <= u1[1] && u1[1] <= u2[1] || l1[1] <= u2[1] && u2[1] <= u1[1]);
};
AABB$2.prototype.containsPoint = function(point) {
  var l2 = this.lowerBound, u = this.upperBound;
  return l2[0] <= point[0] && point[0] <= u[0] && l2[1] <= point[1] && point[1] <= u[1];
};
AABB$2.prototype.overlapsRay = function(ray2) {
  var dirFracX = 1 / ray2.direction[0];
  var dirFracY = 1 / ray2.direction[1];
  var from = ray2.from;
  var lowerBound = this.lowerBound;
  var upperBound = this.upperBound;
  var t1 = (lowerBound[0] - from[0]) * dirFracX;
  var t2 = (upperBound[0] - from[0]) * dirFracX;
  var t3 = (lowerBound[1] - from[1]) * dirFracY;
  var t4 = (upperBound[1] - from[1]) * dirFracY;
  var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)));
  var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)));
  if (tmax < 0) {
    return -1;
  }
  if (tmin > tmax) {
    return -1;
  }
  return tmin / ray2.length;
};
var Equation_1 = Equation$a;
var vec2$n = vec2$q.exports;
var scale$1 = vec2$n.scale;
var multiply = vec2$n.multiply;
var createVec2$1 = vec2$n.create;
var Utils$5 = Utils_1;
function Equation$a(bodyA, bodyB, minForce, maxForce) {
  this.minForce = minForce === void 0 ? -Number.MAX_VALUE : minForce;
  this.maxForce = maxForce === void 0 ? Number.MAX_VALUE : maxForce;
  this.maxBias = Number.MAX_VALUE;
  this.bodyA = bodyA;
  this.bodyB = bodyB;
  this.stiffness = Equation$a.DEFAULT_STIFFNESS;
  this.relaxation = Equation$a.DEFAULT_RELAXATION;
  this.G = new Utils$5.ARRAY_TYPE(6);
  for (var i = 0; i < 6; i++) {
    this.G[i] = 0;
  }
  this.offset = 0;
  this.a = 0;
  this.b = 0;
  this.epsilon = 0;
  this.timeStep = 1 / 60;
  this.needsUpdate = true;
  this.multiplier = 0;
  this.relativeVelocity = 0;
  this.enabled = true;
  this.lambda = this.B = this.invC = this.minForceDt = this.maxForceDt = 0;
  this.index = -1;
}
Equation$a.DEFAULT_STIFFNESS = 1e6;
Equation$a.DEFAULT_RELAXATION = 4;
var qi = createVec2$1();
var qj = createVec2$1();
var iMfi = createVec2$1();
var iMfj = createVec2$1();
Equation$a.prototype = {
  /**
   * Compute SPOOK parameters .a, .b and .epsilon according to the current parameters. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
   * @method update
   */
  update: function() {
    var k = this.stiffness, d = this.relaxation, h = this.timeStep;
    this.a = 4 / (h * (1 + 4 * d));
    this.b = 4 * d / (1 + 4 * d);
    this.epsilon = 4 / (h * h * k * (1 + 4 * d));
    this.needsUpdate = false;
  },
  /**
   * Multiply a jacobian entry with corresponding positions or velocities
   * @method gmult
   * @return {Number}
   */
  gmult: function(G, vi2, wi, vj2, wj) {
    return G[0] * vi2[0] + G[1] * vi2[1] + G[2] * wi + G[3] * vj2[0] + G[4] * vj2[1] + G[5] * wj;
  },
  /**
   * Computes the RHS of the SPOOK equation
   * @method computeB
   * @return {Number}
   */
  computeB: function(a, b, h) {
    var GW = this.computeGW();
    var Gq = this.computeGq();
    var maxBias = this.maxBias;
    if (Math.abs(Gq) > maxBias) {
      Gq = Gq > 0 ? maxBias : -maxBias;
    }
    var GiMf = this.computeGiMf();
    var B = -Gq * a - GW * b - GiMf * h;
    return B;
  },
  /**
   * Computes G\*q, where q are the generalized body coordinates
   * @method computeGq
   * @return {Number}
   */
  computeGq: function() {
    var G = this.G, bi = this.bodyA, bj = this.bodyB, ai = bi.angle, aj = bj.angle;
    return this.gmult(G, qi, ai, qj, aj) + this.offset;
  },
  /**
   * Computes G\*W, where W are the body velocities
   * @method computeGW
   * @return {Number}
   */
  computeGW: function() {
    var G = this.G, bi = this.bodyA, bj = this.bodyB, vi2 = bi.velocity, vj2 = bj.velocity, wi = bi.angularVelocity, wj = bj.angularVelocity;
    return this.gmult(G, vi2, wi, vj2, wj) + this.relativeVelocity;
  },
  /**
   * Computes G\*Wlambda, where W are the body velocities
   * @method computeGWlambda
   * @return {Number}
   */
  computeGWlambda: function() {
    var G = this.G, bi = this.bodyA, bj = this.bodyB, vi2 = bi.vlambda, vj2 = bj.vlambda, wi = bi.wlambda, wj = bj.wlambda;
    return this.gmult(G, vi2, wi, vj2, wj);
  },
  /**
   * Computes G\*inv(M)\*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
   * @method computeGiMf
   * @return {Number}
   */
  computeGiMf: function() {
    var bi = this.bodyA, bj = this.bodyB, fi = bi.force, ti = bi.angularForce, fj = bj.force, tj = bj.angularForce, invMassi = bi.invMassSolve, invMassj = bj.invMassSolve, invIi = bi.invInertiaSolve, invIj = bj.invInertiaSolve, G = this.G;
    scale$1(iMfi, fi, invMassi);
    multiply(iMfi, bi.massMultiplier, iMfi);
    scale$1(iMfj, fj, invMassj);
    multiply(iMfj, bj.massMultiplier, iMfj);
    return this.gmult(G, iMfi, ti * invIi, iMfj, tj * invIj);
  },
  /**
   * Computes G\*inv(M)\*G'
   * @method computeGiMGt
   * @return {Number}
   */
  computeGiMGt: function() {
    var bi = this.bodyA, bj = this.bodyB, invMassi = bi.invMassSolve, invMassj = bj.invMassSolve, invIi = bi.invInertiaSolve, invIj = bj.invInertiaSolve, G = this.G;
    return G[0] * G[0] * invMassi * bi.massMultiplier[0] + G[1] * G[1] * invMassi * bi.massMultiplier[1] + G[2] * G[2] * invIi + G[3] * G[3] * invMassj * bj.massMultiplier[0] + G[4] * G[4] * invMassj * bj.massMultiplier[1] + G[5] * G[5] * invIj;
  },
  /**
   * Add constraint velocity to the bodies.
   * @method addToWlambda
   * @param {Number} deltalambda
   */
  addToWlambda: function(deltalambda) {
    var bi = this.bodyA, bj = this.bodyB, invMassi = bi.invMassSolve, invMassj = bj.invMassSolve, invIi = bi.invInertiaSolve, invIj = bj.invInertiaSolve, G = this.G;
    addToVLambda(bi.vlambda, G[0], G[1], invMassi, deltalambda, bi.massMultiplier);
    bi.wlambda += invIi * G[2] * deltalambda;
    addToVLambda(bj.vlambda, G[3], G[4], invMassj, deltalambda, bj.massMultiplier);
    bj.wlambda += invIj * G[5] * deltalambda;
  },
  /**
   * Compute the denominator part of the SPOOK equation: C = G\*inv(M)\*G' + eps
   * @method computeInvC
   * @param  {Number} eps
   * @return {Number}
   */
  computeInvC: function(eps) {
    var invC = 1 / (this.computeGiMGt() + eps);
    return invC;
  }
};
function addToVLambda(vlambda, Gx, Gy, invMass, deltalambda, massMultiplier) {
  vlambda[0] += Gx * invMass * deltalambda * massMultiplier[0];
  vlambda[1] += Gy * invMass * deltalambda * massMultiplier[1];
}
var Equation$9 = Equation_1;
var AngleLockEquation_1 = AngleLockEquation$1;
function AngleLockEquation$1(bodyA, bodyB, options) {
  options = options || {};
  Equation$9.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
  this.angle = options.angle || 0;
  this.ratio = options.ratio !== void 0 ? options.ratio : 1;
  this.setRatio(this.ratio);
}
AngleLockEquation$1.prototype = new Equation$9();
AngleLockEquation$1.prototype.constructor = AngleLockEquation$1;
AngleLockEquation$1.prototype.computeGq = function() {
  return this.ratio * this.bodyA.angle - this.bodyB.angle + this.angle;
};
AngleLockEquation$1.prototype.setRatio = function(ratio) {
  var G = this.G;
  G[2] = ratio;
  G[5] = -1;
  this.ratio = ratio;
};
AngleLockEquation$1.prototype.setMaxTorque = function(torque) {
  this.maxForce = torque;
  this.minForce = -torque;
};
var src = {
  decomp: polygonDecomp,
  quickDecomp: polygonQuickDecomp,
  isSimple: polygonIsSimple,
  removeCollinearPoints: polygonRemoveCollinearPoints,
  makeCCW: polygonMakeCCW
};
function lineInt(l1, l2, precision) {
  precision = precision || 0;
  var i = [0, 0];
  var a1, b1, c1, a2, b2, c2, det;
  a1 = l1[1][1] - l1[0][1];
  b1 = l1[0][0] - l1[1][0];
  c1 = a1 * l1[0][0] + b1 * l1[0][1];
  a2 = l2[1][1] - l2[0][1];
  b2 = l2[0][0] - l2[1][0];
  c2 = a2 * l2[0][0] + b2 * l2[0][1];
  det = a1 * b2 - a2 * b1;
  if (!scalar_eq(det, 0, precision)) {
    i[0] = (b2 * c1 - b1 * c2) / det;
    i[1] = (a1 * c2 - a2 * c1) / det;
  }
  return i;
}
function lineSegmentsIntersect(p1, p22, q1, q2) {
  var dx = p22[0] - p1[0];
  var dy = p22[1] - p1[1];
  var da = q2[0] - q1[0];
  var db = q2[1] - q1[1];
  if (da * dy - db * dx === 0) {
    return false;
  }
  var s2 = (dx * (q1[1] - p1[1]) + dy * (p1[0] - q1[0])) / (da * dy - db * dx);
  var t2 = (da * (p1[1] - q1[1]) + db * (q1[0] - p1[0])) / (db * dx - da * dy);
  return s2 >= 0 && s2 <= 1 && t2 >= 0 && t2 <= 1;
}
function triangleArea$1(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
}
function isLeft(a, b, c) {
  return triangleArea$1(a, b, c) > 0;
}
function isLeftOn(a, b, c) {
  return triangleArea$1(a, b, c) >= 0;
}
function isRight(a, b, c) {
  return triangleArea$1(a, b, c) < 0;
}
function isRightOn(a, b, c) {
  return triangleArea$1(a, b, c) <= 0;
}
var tmpPoint1 = [];
var tmpPoint2 = [];
function collinear(a, b, c, thresholdAngle) {
  if (!thresholdAngle) {
    return triangleArea$1(a, b, c) === 0;
  } else {
    var ab = tmpPoint1, bc = tmpPoint2;
    ab[0] = b[0] - a[0];
    ab[1] = b[1] - a[1];
    bc[0] = c[0] - b[0];
    bc[1] = c[1] - b[1];
    var dot2 = ab[0] * bc[0] + ab[1] * bc[1], magA = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]), magB = Math.sqrt(bc[0] * bc[0] + bc[1] * bc[1]), angle = Math.acos(dot2 / (magA * magB));
    return angle < thresholdAngle;
  }
}
function sqdist(a, b) {
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  return dx * dx + dy * dy;
}
function polygonAt(polygon, i) {
  var s2 = polygon.length;
  return polygon[i < 0 ? i % s2 + s2 : i % s2];
}
function polygonClear(polygon) {
  polygon.length = 0;
}
function polygonAppend(polygon, poly, from, to) {
  for (var i = from; i < to; i++) {
    polygon.push(poly[i]);
  }
}
function polygonMakeCCW(polygon) {
  var br = 0, v2 = polygon;
  for (var i = 1; i < polygon.length; ++i) {
    if (v2[i][1] < v2[br][1] || v2[i][1] === v2[br][1] && v2[i][0] > v2[br][0]) {
      br = i;
    }
  }
  if (!isLeft(polygonAt(polygon, br - 1), polygonAt(polygon, br), polygonAt(polygon, br + 1))) {
    polygonReverse(polygon);
  }
}
function polygonReverse(polygon) {
  var tmp16 = [];
  var N = polygon.length;
  for (var i = 0; i !== N; i++) {
    tmp16.push(polygon.pop());
  }
  for (var i = 0; i !== N; i++) {
    polygon[i] = tmp16[i];
  }
}
function polygonIsReflex(polygon, i) {
  return isRight(polygonAt(polygon, i - 1), polygonAt(polygon, i), polygonAt(polygon, i + 1));
}
var tmpLine1 = [];
var tmpLine2 = [];
function polygonCanSee(polygon, a, b) {
  var p, dist, l1 = tmpLine1, l2 = tmpLine2;
  if (isLeftOn(polygonAt(polygon, a + 1), polygonAt(polygon, a), polygonAt(polygon, b)) && isRightOn(polygonAt(polygon, a - 1), polygonAt(polygon, a), polygonAt(polygon, b))) {
    return false;
  }
  dist = sqdist(polygonAt(polygon, a), polygonAt(polygon, b));
  for (var i = 0; i !== polygon.length; ++i) {
    if ((i + 1) % polygon.length === a || i === a) {
      continue;
    }
    if (isLeftOn(polygonAt(polygon, a), polygonAt(polygon, b), polygonAt(polygon, i + 1)) && isRightOn(polygonAt(polygon, a), polygonAt(polygon, b), polygonAt(polygon, i))) {
      l1[0] = polygonAt(polygon, a);
      l1[1] = polygonAt(polygon, b);
      l2[0] = polygonAt(polygon, i);
      l2[1] = polygonAt(polygon, i + 1);
      p = lineInt(l1, l2);
      if (sqdist(polygonAt(polygon, a), p) < dist) {
        return false;
      }
    }
  }
  return true;
}
function polygonCopy(polygon, i, j, targetPoly) {
  var p = targetPoly || [];
  polygonClear(p);
  if (i < j) {
    for (var k = i; k <= j; k++) {
      p.push(polygon[k]);
    }
  } else {
    for (var k = 0; k <= j; k++) {
      p.push(polygon[k]);
    }
    for (var k = i; k < polygon.length; k++) {
      p.push(polygon[k]);
    }
  }
  return p;
}
function polygonGetCutEdges(polygon) {
  var min = [], tmp16 = [], tmp22 = [], tmpPoly = [];
  var nDiags = Number.MAX_VALUE;
  for (var i = 0; i < polygon.length; ++i) {
    if (polygonIsReflex(polygon, i)) {
      for (var j = 0; j < polygon.length; ++j) {
        if (polygonCanSee(polygon, i, j)) {
          tmp16 = polygonGetCutEdges(polygonCopy(polygon, i, j, tmpPoly));
          tmp22 = polygonGetCutEdges(polygonCopy(polygon, j, i, tmpPoly));
          for (var k = 0; k < tmp22.length; k++) {
            tmp16.push(tmp22[k]);
          }
          if (tmp16.length < nDiags) {
            min = tmp16;
            nDiags = tmp16.length;
            min.push([polygonAt(polygon, i), polygonAt(polygon, j)]);
          }
        }
      }
    }
  }
  return min;
}
function polygonDecomp(polygon) {
  var edges = polygonGetCutEdges(polygon);
  if (edges.length > 0) {
    return polygonSlice(polygon, edges);
  } else {
    return [polygon];
  }
}
function polygonSlice(polygon, cutEdges) {
  if (cutEdges.length === 0) {
    return [polygon];
  }
  if (cutEdges instanceof Array && cutEdges.length && cutEdges[0] instanceof Array && cutEdges[0].length === 2 && cutEdges[0][0] instanceof Array) {
    var polys = [polygon];
    for (var i = 0; i < cutEdges.length; i++) {
      var cutEdge = cutEdges[i];
      for (var j = 0; j < polys.length; j++) {
        var poly = polys[j];
        var result2 = polygonSlice(poly, cutEdge);
        if (result2) {
          polys.splice(j, 1);
          polys.push(result2[0], result2[1]);
          break;
        }
      }
    }
    return polys;
  } else {
    var cutEdge = cutEdges;
    var i = polygon.indexOf(cutEdge[0]);
    var j = polygon.indexOf(cutEdge[1]);
    if (i !== -1 && j !== -1) {
      return [polygonCopy(polygon, i, j), polygonCopy(polygon, j, i)];
    } else {
      return false;
    }
  }
}
function polygonIsSimple(polygon) {
  var path = polygon, i;
  for (i = 0; i < path.length - 1; i++) {
    for (var j = 0; j < i - 1; j++) {
      if (lineSegmentsIntersect(path[i], path[i + 1], path[j], path[j + 1])) {
        return false;
      }
    }
  }
  for (i = 1; i < path.length - 2; i++) {
    if (lineSegmentsIntersect(path[0], path[path.length - 1], path[i], path[i + 1])) {
      return false;
    }
  }
  return true;
}
function getIntersectionPoint(p1, p22, q1, q2, delta) {
  delta = delta || 0;
  var a1 = p22[1] - p1[1];
  var b1 = p1[0] - p22[0];
  var c1 = a1 * p1[0] + b1 * p1[1];
  var a2 = q2[1] - q1[1];
  var b2 = q1[0] - q2[0];
  var c2 = a2 * q1[0] + b2 * q1[1];
  var det = a1 * b2 - a2 * b1;
  if (!scalar_eq(det, 0, delta)) {
    return [(b2 * c1 - b1 * c2) / det, (a1 * c2 - a2 * c1) / det];
  } else {
    return [0, 0];
  }
}
function polygonQuickDecomp(polygon, result2, reflexVertices, steinerPoints, delta, maxlevel, level) {
  maxlevel = maxlevel || 100;
  level = level || 0;
  delta = delta || 25;
  result2 = typeof result2 !== "undefined" ? result2 : [];
  reflexVertices = reflexVertices || [];
  steinerPoints = steinerPoints || [];
  var upperInt = [0, 0], lowerInt = [0, 0], p = [0, 0];
  var upperDist = 0, lowerDist = 0, d = 0, closestDist = 0;
  var upperIndex = 0, lowerIndex = 0, closestIndex = 0;
  var lowerPoly = [], upperPoly = [];
  var poly = polygon, v2 = polygon;
  if (v2.length < 3) {
    return result2;
  }
  level++;
  if (level > maxlevel) {
    console.warn("quickDecomp: max level (" + maxlevel + ") reached.");
    return result2;
  }
  for (var i = 0; i < polygon.length; ++i) {
    if (polygonIsReflex(poly, i)) {
      reflexVertices.push(poly[i]);
      upperDist = lowerDist = Number.MAX_VALUE;
      for (var j = 0; j < polygon.length; ++j) {
        if (isLeft(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j)) && isRightOn(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j - 1))) {
          p = getIntersectionPoint(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j), polygonAt(poly, j - 1));
          if (isRight(polygonAt(poly, i + 1), polygonAt(poly, i), p)) {
            d = sqdist(poly[i], p);
            if (d < lowerDist) {
              lowerDist = d;
              lowerInt = p;
              lowerIndex = j;
            }
          }
        }
        if (isLeft(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j + 1)) && isRightOn(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j))) {
          p = getIntersectionPoint(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j), polygonAt(poly, j + 1));
          if (isLeft(polygonAt(poly, i - 1), polygonAt(poly, i), p)) {
            d = sqdist(poly[i], p);
            if (d < upperDist) {
              upperDist = d;
              upperInt = p;
              upperIndex = j;
            }
          }
        }
      }
      if (lowerIndex === (upperIndex + 1) % polygon.length) {
        p[0] = (lowerInt[0] + upperInt[0]) / 2;
        p[1] = (lowerInt[1] + upperInt[1]) / 2;
        steinerPoints.push(p);
        if (i < upperIndex) {
          polygonAppend(lowerPoly, poly, i, upperIndex + 1);
          lowerPoly.push(p);
          upperPoly.push(p);
          if (lowerIndex !== 0) {
            polygonAppend(upperPoly, poly, lowerIndex, poly.length);
          }
          polygonAppend(upperPoly, poly, 0, i + 1);
        } else {
          if (i !== 0) {
            polygonAppend(lowerPoly, poly, i, poly.length);
          }
          polygonAppend(lowerPoly, poly, 0, upperIndex + 1);
          lowerPoly.push(p);
          upperPoly.push(p);
          polygonAppend(upperPoly, poly, lowerIndex, i + 1);
        }
      } else {
        if (lowerIndex > upperIndex) {
          upperIndex += polygon.length;
        }
        closestDist = Number.MAX_VALUE;
        if (upperIndex < lowerIndex) {
          return result2;
        }
        for (var j = lowerIndex; j <= upperIndex; ++j) {
          if (isLeftOn(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j)) && isRightOn(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j))) {
            d = sqdist(polygonAt(poly, i), polygonAt(poly, j));
            if (d < closestDist) {
              closestDist = d;
              closestIndex = j % polygon.length;
            }
          }
        }
        if (i < closestIndex) {
          polygonAppend(lowerPoly, poly, i, closestIndex + 1);
          if (closestIndex !== 0) {
            polygonAppend(upperPoly, poly, closestIndex, v2.length);
          }
          polygonAppend(upperPoly, poly, 0, i + 1);
        } else {
          if (i !== 0) {
            polygonAppend(lowerPoly, poly, i, v2.length);
          }
          polygonAppend(lowerPoly, poly, 0, closestIndex + 1);
          polygonAppend(upperPoly, poly, closestIndex, i + 1);
        }
      }
      if (lowerPoly.length < upperPoly.length) {
        polygonQuickDecomp(lowerPoly, result2, reflexVertices, steinerPoints, delta, maxlevel, level);
        polygonQuickDecomp(upperPoly, result2, reflexVertices, steinerPoints, delta, maxlevel, level);
      } else {
        polygonQuickDecomp(upperPoly, result2, reflexVertices, steinerPoints, delta, maxlevel, level);
        polygonQuickDecomp(lowerPoly, result2, reflexVertices, steinerPoints, delta, maxlevel, level);
      }
      return result2;
    }
  }
  result2.push(polygon);
  return result2;
}
function polygonRemoveCollinearPoints(polygon, precision) {
  var num = 0;
  for (var i = polygon.length - 1; polygon.length > 3 && i >= 0; --i) {
    if (collinear(polygonAt(polygon, i - 1), polygonAt(polygon, i), polygonAt(polygon, i + 1), precision)) {
      polygon.splice(i % polygon.length, 1);
      num++;
    }
  }
  return num;
}
function scalar_eq(a, b, precision) {
  precision = precision || 0;
  return Math.abs(a - b) < precision;
}
var Shape_1 = Shape$a;
var vec2$m = vec2$q.exports;
function Shape$a(options) {
  options = options || {};
  this.body = null;
  this.position = vec2$m.create();
  if (options.position) {
    vec2$m.copy(this.position, options.position);
  }
  this.angle = options.angle || 0;
  this.type = options.type || 0;
  this.id = Shape$a.idCounter++;
  this.boundingRadius = 0;
  this.collisionGroup = options.collisionGroup !== void 0 ? options.collisionGroup : 1;
  this.collisionResponse = options.collisionResponse !== void 0 ? options.collisionResponse : true;
  this.collisionMask = options.collisionMask !== void 0 ? options.collisionMask : 1;
  this.material = options.material || null;
  this.area = 0;
  this.sensor = options.sensor !== void 0 ? options.sensor : false;
  if (this.type) {
    this.updateBoundingRadius();
  }
  this.updateArea();
}
Shape$a.idCounter = 0;
Shape$a.CIRCLE = 1;
Shape$a.PARTICLE = 2;
Shape$a.PLANE = 4;
Shape$a.CONVEX = 8;
Shape$a.LINE = 16;
Shape$a.BOX = 32;
Shape$a.CAPSULE = 64;
Shape$a.HEIGHTFIELD = 128;
Shape$a.prototype = {
  /**
   * Should return the moment of inertia around the Z axis of the body. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
   * @method computeMomentOfInertia
   * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
   */
  computeMomentOfInertia: function() {
  },
  /**
   * Returns the bounding circle radius of this shape.
   * @method updateBoundingRadius
   * @return {Number}
   */
  updateBoundingRadius: function() {
  },
  /**
   * Update the .area property of the shape.
   * @method updateArea
   */
  updateArea: function() {
  },
  /**
   * Compute the world axis-aligned bounding box (AABB) of this shape.
   * @method computeAABB
   * @param  {AABB} out The resulting AABB.
   * @param  {Array} position World position of the shape.
   * @param  {Number} angle World angle of the shape.
   */
  computeAABB: function() {
  },
  /**
   * Perform raycasting on this shape.
   * @method raycast
   * @param  {RayResult} result Where to store the resulting data.
   * @param  {Ray} ray The Ray that you want to use for raycasting.
   * @param  {array} position World position of the shape (the .position property will be ignored).
   * @param  {number} angle World angle of the shape (the .angle property will be ignored).
   */
  raycast: function() {
  },
  /**
   * Test if a point is inside this shape.
   * @method pointTest
   * @param {array} localPoint
   * @return {boolean}
   */
  pointTest: function() {
    return false;
  },
  /**
   * Transform a world point to local shape space (assumed the shape is transformed by both itself and the body).
   * @method worldPointToLocal
   * @param {array} out
   * @param {array} worldPoint
   */
  worldPointToLocal: function() {
    var shapeWorldPosition = vec2$m.create();
    return function(out, worldPoint) {
      var body = this.body;
      vec2$m.rotate(shapeWorldPosition, this.position, body.angle);
      vec2$m.add(shapeWorldPosition, shapeWorldPosition, body.position);
      vec2$m.toLocalFrame(out, worldPoint, shapeWorldPosition, this.body.angle + this.angle);
    };
  }()
};
var PolyK = {};
PolyK.GetArea = function(p) {
  if (p.length < 6) return 0;
  var l2 = p.length - 2;
  var sum = 0;
  for (var i = 0; i < l2; i += 2) sum += (p[i + 2] - p[i]) * (p[i + 1] + p[i + 3]);
  sum += (p[0] - p[l2]) * (p[l2 + 1] + p[1]);
  return -sum * 0.5;
};
PolyK.Triangulate = function(p) {
  var n2 = p.length >> 1;
  if (n2 < 3) return [];
  var tgs = [];
  var avl = [];
  for (var i = 0; i < n2; i++) avl.push(i);
  var i = 0;
  var al = n2;
  while (al > 3) {
    var i0 = avl[(i + 0) % al];
    var i1 = avl[(i + 1) % al];
    var i2 = avl[(i + 2) % al];
    var ax = p[2 * i0], ay = p[2 * i0 + 1];
    var bx = p[2 * i1], by = p[2 * i1 + 1];
    var cx = p[2 * i2], cy = p[2 * i2 + 1];
    var earFound = false;
    if (PolyK._convex(ax, ay, bx, by, cx, cy)) {
      earFound = true;
      for (var j = 0; j < al; j++) {
        var vi2 = avl[j];
        if (vi2 == i0 || vi2 == i1 || vi2 == i2) continue;
        if (PolyK._PointInTriangle(p[2 * vi2], p[2 * vi2 + 1], ax, ay, bx, by, cx, cy)) {
          earFound = false;
          break;
        }
      }
    }
    if (earFound) {
      tgs.push(i0, i1, i2);
      avl.splice((i + 1) % al, 1);
      al--;
      i = 0;
    } else if (i++ > 3 * al) break;
  }
  tgs.push(avl[0], avl[1], avl[2]);
  return tgs;
};
PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy) {
  var v0x = cx - ax;
  var v0y = cy - ay;
  var v1x = bx - ax;
  var v1y = by - ay;
  var v2x = px - ax;
  var v2y = py - ay;
  var dot00 = v0x * v0x + v0y * v0y;
  var dot01 = v0x * v1x + v0y * v1y;
  var dot02 = v0x * v2x + v0y * v2y;
  var dot11 = v1x * v1x + v1y * v1y;
  var dot12 = v1x * v2x + v1y * v2y;
  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  var v2 = (dot00 * dot12 - dot01 * dot02) * invDenom;
  return u >= 0 && v2 >= 0 && u + v2 < 1;
};
PolyK._convex = function(ax, ay, bx, by, cx, cy) {
  return (ay - by) * (cx - bx) + (bx - ax) * (cy - by) >= 0;
};
var polyk$1 = PolyK;
var Shape$9 = Shape_1;
var vec2$l = vec2$q.exports;
var dot$2 = vec2$l.dot;
var polyk = polyk$1;
var shallowClone$6 = Utils_1.shallowClone;
var Convex_1 = Convex$3;
function Convex$3(options) {
  options = options ? shallowClone$6(options) : {};
  this.vertices = [];
  var vertices = options.vertices !== void 0 ? options.vertices : [];
  for (var i = 0; i < vertices.length; i++) {
    this.vertices.push(vec2$l.clone(vertices[i]));
  }
  var normals = this.normals = [];
  for (var i = 0; i < vertices.length; i++) {
    normals.push(vec2$l.create());
  }
  this.updateNormals();
  this.centerOfMass = vec2$l.create();
  this.triangles = [];
  if (this.vertices.length) {
    this.updateTriangles();
    this.updateCenterOfMass();
  }
  this.boundingRadius = 0;
  options.type = options.type || Shape$9.CONVEX;
  Shape$9.call(this, options);
  this.updateBoundingRadius();
  this.updateArea();
  if (this.area < 0) {
    throw new Error("Convex vertices must be given in counter-clockwise winding.");
  }
}
Convex$3.prototype = new Shape$9();
Convex$3.prototype.constructor = Convex$3;
var tmpVec1 = vec2$l.create();
var tmpVec2 = vec2$l.create();
Convex$3.prototype.updateNormals = function() {
  var vertices = this.vertices;
  var normals = this.normals;
  for (var i = 0; i < vertices.length; i++) {
    var worldPoint0 = vertices[i];
    var worldPoint1 = vertices[(i + 1) % vertices.length];
    var normal = normals[i];
    vec2$l.subtract(normal, worldPoint1, worldPoint0);
    vec2$l.rotate90cw(normal, normal);
    vec2$l.normalize(normal, normal);
  }
};
Convex$3.prototype.projectOntoLocalAxis = function(localAxis, result2) {
  var max = null, min = null, v2, value, localAxis = tmpVec1;
  for (var i = 0; i < this.vertices.length; i++) {
    v2 = this.vertices[i];
    value = dot$2(v2, localAxis);
    if (max === null || value > max) {
      max = value;
    }
    if (min === null || value < min) {
      min = value;
    }
  }
  if (min > max) {
    var t2 = min;
    min = max;
    max = t2;
  }
  vec2$l.set(result2, min, max);
};
Convex$3.prototype.projectOntoWorldAxis = function(localAxis, shapeOffset, shapeAngle, result2) {
  var worldAxis = tmpVec2;
  this.projectOntoLocalAxis(localAxis, result2);
  if (shapeAngle !== 0) {
    vec2$l.rotate(worldAxis, localAxis, shapeAngle);
  } else {
    worldAxis = localAxis;
  }
  var offset = dot$2(shapeOffset, worldAxis);
  vec2$l.set(result2, result2[0] + offset, result2[1] + offset);
};
Convex$3.prototype.updateTriangles = function() {
  this.triangles.length = 0;
  var polykVerts = [];
  for (var i = 0; i < this.vertices.length; i++) {
    var v2 = this.vertices[i];
    polykVerts.push(v2[0], v2[1]);
  }
  var triangles = polyk.Triangulate(polykVerts);
  for (var i = 0; i < triangles.length; i += 3) {
    var id1 = triangles[i], id2 = triangles[i + 1], id3 = triangles[i + 2];
    this.triangles.push([id1, id2, id3]);
  }
};
var updateCenterOfMass_centroid = vec2$l.create();
var updateCenterOfMass_centroid_times_mass = vec2$l.create();
var updateCenterOfMass_a = vec2$l.create();
var updateCenterOfMass_b = vec2$l.create();
var updateCenterOfMass_c = vec2$l.create();
Convex$3.prototype.updateCenterOfMass = function() {
  var triangles = this.triangles, verts = this.vertices, cm = this.centerOfMass, centroid = updateCenterOfMass_centroid, a = updateCenterOfMass_a, b = updateCenterOfMass_b, c = updateCenterOfMass_c, centroid_times_mass = updateCenterOfMass_centroid_times_mass;
  vec2$l.set(cm, 0, 0);
  var totalArea = 0;
  for (var i = 0; i !== triangles.length; i++) {
    var t2 = triangles[i], a = verts[t2[0]], b = verts[t2[1]], c = verts[t2[2]];
    vec2$l.centroid(centroid, a, b, c);
    var m2 = triangleArea(a, b, c);
    totalArea += m2;
    vec2$l.scale(centroid_times_mass, centroid, m2);
    vec2$l.add(cm, cm, centroid_times_mass);
  }
  vec2$l.scale(cm, cm, 1 / totalArea);
};
Convex$3.prototype.computeMomentOfInertia = function() {
  var denom = 0, numer = 0, N = this.vertices.length;
  for (var j = N - 1, i = 0; i < N; j = i, i++) {
    var p0 = this.vertices[j];
    var p1 = this.vertices[i];
    var a = Math.abs(vec2$l.crossLength(p0, p1));
    var b = dot$2(p1, p1) + dot$2(p1, p0) + dot$2(p0, p0);
    denom += a * b;
    numer += a;
  }
  return 1 / 6 * (denom / numer);
};
Convex$3.prototype.updateBoundingRadius = function() {
  var verts = this.vertices, r2 = 0;
  for (var i = 0; i !== verts.length; i++) {
    var l2 = vec2$l.squaredLength(verts[i]);
    if (l2 > r2) {
      r2 = l2;
    }
  }
  this.boundingRadius = Math.sqrt(r2);
};
Convex$3.triangleArea = triangleArea;
function triangleArea(a, b, c) {
  return ((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) * 0.5;
}
Convex$3.prototype.updateArea = function() {
  this.updateTriangles();
  this.area = 0;
  var triangles = this.triangles, verts = this.vertices;
  for (var i = 0; i !== triangles.length; i++) {
    var t2 = triangles[i], a = verts[t2[0]], b = verts[t2[1]], c = verts[t2[2]];
    var m2 = triangleArea(a, b, c);
    this.area += m2;
  }
};
Convex$3.prototype.computeAABB = function(out, position, angle) {
  out.setFromPoints(this.vertices, position, angle, 0);
};
var intersectConvex_rayStart = vec2$l.create();
var intersectConvex_rayEnd = vec2$l.create();
var intersectConvex_normal = vec2$l.create();
Convex$3.prototype.raycast = function(result2, ray2, position, angle) {
  var rayStart = intersectConvex_rayStart;
  var rayEnd = intersectConvex_rayEnd;
  var normal = intersectConvex_normal;
  var vertices = this.vertices;
  vec2$l.toLocalFrame(rayStart, ray2.from, position, angle);
  vec2$l.toLocalFrame(rayEnd, ray2.to, position, angle);
  var n2 = vertices.length;
  for (var i = 0; i < n2 && !result2.shouldStop(ray2); i++) {
    var q1 = vertices[i];
    var q2 = vertices[(i + 1) % n2];
    var delta = vec2$l.getLineSegmentsIntersectionFraction(rayStart, rayEnd, q1, q2);
    if (delta >= 0) {
      vec2$l.subtract(normal, q2, q1);
      vec2$l.rotate(normal, normal, -Math.PI / 2 + angle);
      vec2$l.normalize(normal, normal);
      ray2.reportIntersection(result2, delta, normal, i);
    }
  }
};
var pic_r0$1 = vec2$l.create();
var pic_r1$1 = vec2$l.create();
Convex$3.prototype.pointTest = function(localPoint) {
  var r0 = pic_r0$1, r1 = pic_r1$1, verts = this.vertices, lastCross = null, numVerts = verts.length;
  for (var i = 0; i < numVerts + 1; i++) {
    var v02 = verts[i % numVerts], v1 = verts[(i + 1) % numVerts];
    vec2$l.subtract(r0, v02, localPoint);
    vec2$l.subtract(r1, v1, localPoint);
    var cross = vec2$l.crossLength(r0, r1);
    if (lastCross === null) {
      lastCross = cross;
    }
    if (cross * lastCross < 0) {
      return false;
    }
    lastCross = cross;
  }
  return true;
};
var Ray_1 = Ray$2;
var vec2$k = vec2$q.exports;
function Ray$2(options) {
  options = options || {};
  this.from = options.from ? vec2$k.clone(options.from) : vec2$k.create();
  this.to = options.to ? vec2$k.clone(options.to) : vec2$k.create();
  this.checkCollisionResponse = options.checkCollisionResponse !== void 0 ? options.checkCollisionResponse : true;
  this.skipBackfaces = !!options.skipBackfaces;
  this.collisionMask = options.collisionMask !== void 0 ? options.collisionMask : -1;
  this.collisionGroup = options.collisionGroup !== void 0 ? options.collisionGroup : -1;
  this.mode = options.mode !== void 0 ? options.mode : Ray$2.ANY;
  this.callback = options.callback || function() {
  };
  this.direction = vec2$k.create();
  this.length = 1;
  this.update();
}
Ray$2.prototype.constructor = Ray$2;
Ray$2.CLOSEST = 1;
Ray$2.ANY = 2;
Ray$2.ALL = 4;
Ray$2.prototype.update = function() {
  var d = this.direction;
  vec2$k.subtract(d, this.to, this.from);
  this.length = vec2$k.length(d);
  vec2$k.normalize(d, d);
};
Ray$2.prototype.intersectBodies = function(result2, bodies) {
  for (var i = 0, l2 = bodies.length; !result2.shouldStop(this) && i < l2; i++) {
    var body = bodies[i];
    var aabb = body.getAABB();
    if (aabb.overlapsRay(this) >= 0 || aabb.containsPoint(this.from)) {
      this.intersectBody(result2, body);
    }
  }
};
var intersectBody_worldPosition = vec2$k.create();
Ray$2.prototype.intersectBody = function(result2, body) {
  var checkCollisionResponse = this.checkCollisionResponse;
  if (checkCollisionResponse && !body.collisionResponse) {
    return;
  }
  var worldPosition = intersectBody_worldPosition;
  for (var i = 0, N = body.shapes.length; i < N; i++) {
    var shape = body.shapes[i];
    if (checkCollisionResponse && !shape.collisionResponse) {
      continue;
    }
    if ((this.collisionGroup & shape.collisionMask) === 0 || (shape.collisionGroup & this.collisionMask) === 0) {
      continue;
    }
    vec2$k.rotate(worldPosition, shape.position, body.angle);
    vec2$k.add(worldPosition, worldPosition, body.position);
    var worldAngle = shape.angle + body.angle;
    this.intersectShape(result2, shape, worldAngle, worldPosition, body);
    if (result2.shouldStop(this)) {
      break;
    }
  }
};
Ray$2.prototype.intersectShape = function(result2, shape, angle, position, body) {
  var from = this.from;
  var distance = distanceFromIntersectionSquared(from, this.direction, position);
  if (distance > shape.boundingRadius * shape.boundingRadius) {
    return;
  }
  this._currentBody = body;
  this._currentShape = shape;
  shape.raycast(result2, this, position, angle);
  this._currentBody = this._currentShape = null;
};
Ray$2.prototype.getAABB = function(result2) {
  var to = this.to;
  var from = this.from;
  vec2$k.set(result2.lowerBound, Math.min(to[0], from[0]), Math.min(to[1], from[1]));
  vec2$k.set(result2.upperBound, Math.max(to[0], from[0]), Math.max(to[1], from[1]));
};
Ray$2.prototype.reportIntersection = function(result2, fraction, normal, faceIndex) {
  var shape = this._currentShape;
  var body = this._currentBody;
  if (this.skipBackfaces && vec2$k.dot(normal, this.direction) > 0) {
    return;
  }
  switch (this.mode) {
    case Ray$2.ALL:
      result2.set(normal, shape, body, fraction, faceIndex);
      this.callback(result2);
      break;
    case Ray$2.CLOSEST:
      if (fraction < result2.fraction || !result2.hasHit()) {
        result2.set(normal, shape, body, fraction, faceIndex);
      }
      break;
    case Ray$2.ANY:
      result2.set(normal, shape, body, fraction, faceIndex);
      break;
  }
};
var v0 = vec2$k.create();
var intersect = vec2$k.create();
function distanceFromIntersectionSquared(from, direction2, position) {
  vec2$k.subtract(v0, position, from);
  var dot2 = vec2$k.dot(v0, direction2);
  vec2$k.scale(intersect, direction2, dot2);
  vec2$k.add(intersect, intersect, from);
  return vec2$k.squaredDistance(position, intersect);
}
var vec2$j = vec2$q.exports;
var Ray$1 = Ray_1;
var RaycastResult_1 = RaycastResult$1;
function RaycastResult$1() {
  this.normal = vec2$j.create();
  this.shape = null;
  this.body = null;
  this.faceIndex = -1;
  this.fraction = -1;
  this.isStopped = false;
}
RaycastResult$1.prototype.reset = function() {
  vec2$j.set(this.normal, 0, 0);
  this.shape = null;
  this.body = null;
  this.faceIndex = -1;
  this.fraction = -1;
  this.isStopped = false;
};
RaycastResult$1.prototype.getHitDistance = function(ray2) {
  return vec2$j.distance(ray2.from, ray2.to) * this.fraction;
};
RaycastResult$1.prototype.hasHit = function() {
  return this.fraction !== -1;
};
RaycastResult$1.prototype.getHitPoint = function(out, ray2) {
  vec2$j.lerp(out, ray2.from, ray2.to, this.fraction);
};
RaycastResult$1.prototype.stop = function() {
  this.isStopped = true;
};
RaycastResult$1.prototype.shouldStop = function(ray2) {
  return this.isStopped || this.fraction !== -1 && ray2.mode === Ray$1.ANY;
};
RaycastResult$1.prototype.set = function(normal, shape, body, fraction, faceIndex) {
  vec2$j.copy(this.normal, normal);
  this.shape = shape;
  this.body = body;
  this.fraction = fraction;
  this.faceIndex = faceIndex;
};
var EventEmitter_1 = EventEmitter$3;
function EventEmitter$3() {
  this.tmpArray = [];
}
EventEmitter$3.prototype = {
  constructor: EventEmitter$3,
  /**
   * Add an event listener
   * @method on
   * @param  {String} type
   * @param  {Function} listener
   * @return {EventEmitter} The self object, for chainability.
   * @example
   *     emitter.on('myEvent', function(evt){
   *         console.log('myEvt was triggered!');
   *     });
   */
  on: function(type, listener, context2) {
    listener.context = context2 || this;
    if (this._listeners === void 0) {
      this._listeners = {};
    }
    var listeners = this._listeners;
    if (listeners[type] === void 0) {
      listeners[type] = [];
    }
    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
    return this;
  },
  /**
   * Remove an event listener
   * @method off
   * @param  {String} type
   * @param  {Function} listener
   * @return {EventEmitter} The self object, for chainability.
   * @example
   *     emitter.on('myEvent', handler); // Add handler
   *     emitter.off('myEvent', handler); // Remove handler
   */
  off: function(type, listener) {
    var listeners = this._listeners;
    if (!listeners || !listeners[type]) {
      return this;
    }
    var index = listeners[type].indexOf(listener);
    if (index !== -1) {
      listeners[type].splice(index, 1);
    }
    return this;
  },
  /**
   * Check if an event listener is added
   * @method has
   * @param  {String} type
   * @param  {Function} listener
   * @return {Boolean}
   */
  has: function(type, listener) {
    if (this._listeners === void 0) {
      return false;
    }
    var listeners = this._listeners;
    if (listener) {
      if (listeners[type] !== void 0 && listeners[type].indexOf(listener) !== -1) {
        return true;
      }
    } else {
      if (listeners[type] !== void 0) {
        return true;
      }
    }
    return false;
  },
  /**
   * Emit an event.
   * @method emit
   * @param  {Object} event
   * @param  {String} event.type
   * @return {EventEmitter} The self object, for chainability.
   * @example
   *     emitter.emit({
   *         type: 'myEvent',
   *         customData: 123
   *     });
   */
  emit: function(event) {
    if (this._listeners === void 0) {
      return this;
    }
    var listeners = this._listeners;
    var listenerArray = listeners[event.type];
    if (listenerArray !== void 0) {
      event.target = this;
      var tmpArray2 = this.tmpArray;
      for (var i = 0, l2 = listenerArray.length; i < l2; i++) {
        tmpArray2[i] = listenerArray[i];
      }
      for (var i = 0, l2 = tmpArray2.length; i < l2; i++) {
        var listener = tmpArray2[i];
        listener.call(listener.context, event);
      }
      tmpArray2.length = 0;
    }
    return this;
  }
};
var vec2$i = vec2$q.exports;
var add$2 = vec2$i.add;
var sub$2 = vec2$i.subtract;
var vec2create = vec2$i.create;
var decomp = src;
var Convex$2 = Convex_1;
var RaycastResult = RaycastResult_1;
var Ray = Ray_1;
var AABB$1 = AABB_1;
var EventEmitter$2 = EventEmitter_1;
var Body_1 = Body$3;
function Body$3(options) {
  options = options || {};
  EventEmitter$2.call(this);
  this.id = options.id || ++Body$3._idCounter;
  this.index = -1;
  this.world = null;
  this.shapes = [];
  this.mass = options.mass || 0;
  this.invMass = 0;
  this.inertia = 0;
  this.invInertia = 0;
  this.invMassSolve = 0;
  this.invInertiaSolve = 0;
  this.fixedRotation = !!options.fixedRotation;
  this.fixedX = !!options.fixedX;
  this.fixedY = !!options.fixedY;
  this.massMultiplier = vec2create();
  this.position = options.position ? vec2$i.clone(options.position) : vec2create();
  this.interpolatedPosition = vec2$i.clone(this.position);
  this.previousPosition = vec2$i.clone(this.position);
  this.velocity = options.velocity ? vec2$i.clone(options.velocity) : vec2create();
  this.vlambda = vec2create();
  this.wlambda = 0;
  this.angle = options.angle || 0;
  this.previousAngle = this.angle;
  this.interpolatedAngle = this.angle;
  this.angularVelocity = options.angularVelocity || 0;
  this.force = options.force ? vec2$i.clone(options.force) : vec2create();
  this.angularForce = options.angularForce || 0;
  this.damping = options.damping !== void 0 ? options.damping : 0.1;
  this.angularDamping = options.angularDamping !== void 0 ? options.angularDamping : 0.1;
  this.type = Body$3.STATIC;
  if (options.type !== void 0) {
    this.type = options.type;
  } else if (!options.mass) {
    this.type = Body$3.STATIC;
  } else {
    this.type = Body$3.DYNAMIC;
  }
  this.boundingRadius = 0;
  this.aabb = new AABB$1();
  this.aabbNeedsUpdate = true;
  this.allowSleep = options.allowSleep !== void 0 ? options.allowSleep : true;
  this.wantsToSleep = false;
  this.sleepState = Body$3.AWAKE;
  this.sleepSpeedLimit = options.sleepSpeedLimit !== void 0 ? options.sleepSpeedLimit : 0.2;
  this.sleepTimeLimit = options.sleepTimeLimit !== void 0 ? options.sleepTimeLimit : 1;
  this.gravityScale = options.gravityScale !== void 0 ? options.gravityScale : 1;
  this.collisionResponse = options.collisionResponse !== void 0 ? options.collisionResponse : true;
  this.idleTime = 0;
  this.timeLastSleepy = 0;
  this.ccdSpeedThreshold = options.ccdSpeedThreshold !== void 0 ? options.ccdSpeedThreshold : -1;
  this.ccdIterations = options.ccdIterations !== void 0 ? options.ccdIterations : 10;
  this.islandId = -1;
  this.concavePath = null;
  this._wakeUpAfterNarrowphase = false;
  this.updateMassProperties();
}
Body$3.prototype = new EventEmitter$2();
Body$3.prototype.constructor = Body$3;
Body$3._idCounter = 0;
var sleepyEvent = {
  type: "sleepy"
};
var sleepEvent = {
  type: "sleep"
};
var wakeUpEvent = {
  type: "wakeup"
};
Body$3.prototype.updateSolveMassProperties = function() {
  if (this.sleepState === Body$3.SLEEPING || this.type === Body$3.KINEMATIC) {
    this.invMassSolve = 0;
    this.invInertiaSolve = 0;
  } else {
    this.invMassSolve = this.invMass;
    this.invInertiaSolve = this.invInertia;
  }
};
Body$3.prototype.setDensity = function(density) {
  var totalArea = this.getArea();
  this.mass = totalArea * density;
  this.updateMassProperties();
};
Body$3.prototype.getArea = function() {
  var totalArea = 0;
  for (var i = 0; i < this.shapes.length; i++) {
    totalArea += this.shapes[i].area;
  }
  return totalArea;
};
Body$3.prototype.getAABB = function() {
  if (this.aabbNeedsUpdate) {
    this.updateAABB();
  }
  return this.aabb;
};
var shapeAABB = new AABB$1();
var tmp$1 = vec2create();
Body$3.prototype.updateAABB = function() {
  var shapes = this.shapes, N = shapes.length, offset = tmp$1, bodyAngle = this.angle;
  for (var i = 0; i !== N; i++) {
    var shape = shapes[i], angle = shape.angle + bodyAngle;
    vec2$i.toGlobalFrame(offset, shape.position, this.position, bodyAngle);
    shape.computeAABB(shapeAABB, offset, angle);
    if (i === 0) {
      this.aabb.copy(shapeAABB);
    } else {
      this.aabb.extend(shapeAABB);
    }
  }
  this.aabbNeedsUpdate = false;
};
Body$3.prototype.updateBoundingRadius = function() {
  var shapes = this.shapes, N = shapes.length, radius = 0;
  for (var i = 0; i !== N; i++) {
    var shape = shapes[i], offset = vec2$i.length(shape.position), r2 = shape.boundingRadius;
    if (offset + r2 > radius) {
      radius = offset + r2;
    }
  }
  this.boundingRadius = radius;
};
Body$3.prototype.addShape = function(shape, offset, angle) {
  if (shape.body) {
    throw new Error("A shape can only be added to one body.");
  }
  var world = this.world;
  if (world && world.stepping) {
    throw new Error("A shape cannot be added during step.");
  }
  shape.body = this;
  if (offset) {
    vec2$i.copy(shape.position, offset);
  } else {
    vec2$i.set(shape.position, 0, 0);
  }
  shape.angle = angle || 0;
  this.shapes.push(shape);
  this.updateMassProperties();
  this.updateBoundingRadius();
  this.aabbNeedsUpdate = true;
};
Body$3.prototype.removeShape = function(shape) {
  var world = this.world;
  if (world && world.stepping) {
    throw new Error("A shape cannot be removed during step.");
  }
  var idx = this.shapes.indexOf(shape);
  if (idx !== -1) {
    this.shapes.splice(idx, 1);
    this.aabbNeedsUpdate = true;
    shape.body = null;
    return true;
  } else {
    return false;
  }
};
Body$3.prototype.updateMassProperties = function() {
  if (this.type === Body$3.STATIC || this.type === Body$3.KINEMATIC) {
    this.mass = Number.MAX_VALUE;
    this.invMass = 0;
    this.inertia = Number.MAX_VALUE;
    this.invInertia = 0;
  } else {
    var shapes = this.shapes, N = shapes.length, I = 0;
    if (!this.fixedRotation) {
      for (var i = 0; i < N; i++) {
        var shape = shapes[i], r2 = vec2$i.squaredLength(shape.position), Icm = shape.computeMomentOfInertia();
        I += Icm + r2;
      }
      this.inertia = this.mass * I;
      this.invInertia = I > 0 ? 1 / I : 0;
    } else {
      this.inertia = Number.MAX_VALUE;
      this.invInertia = 0;
    }
    this.invMass = 1 / this.mass;
    vec2$i.set(this.massMultiplier, this.fixedX ? 0 : 1, this.fixedY ? 0 : 1);
  }
};
Body$3.prototype.applyForce = function(force, relativePoint2) {
  add$2(this.force, this.force, force);
  if (relativePoint2) {
    var rotForce = vec2$i.crossLength(relativePoint2, force);
    this.angularForce += rotForce;
  }
};
var Body_applyForce_forceWorld = vec2create();
var Body_applyForce_pointWorld = vec2create();
var Body_applyForce_pointLocal = vec2create();
Body$3.prototype.applyForceLocal = function(localForce, localPoint) {
  localPoint = localPoint || Body_applyForce_pointLocal;
  var worldForce = Body_applyForce_forceWorld;
  var worldPoint = Body_applyForce_pointWorld;
  this.vectorToWorldFrame(worldForce, localForce);
  this.vectorToWorldFrame(worldPoint, localPoint);
  this.applyForce(worldForce, worldPoint);
};
var Body_applyImpulse_velo = vec2create();
Body$3.prototype.applyImpulse = function(impulseVector, relativePoint2) {
  if (this.type !== Body$3.DYNAMIC) {
    return;
  }
  var velo = Body_applyImpulse_velo;
  vec2$i.scale(velo, impulseVector, this.invMass);
  vec2$i.multiply(velo, this.massMultiplier, velo);
  add$2(this.velocity, velo, this.velocity);
  if (relativePoint2) {
    var rotVelo = vec2$i.crossLength(relativePoint2, impulseVector);
    rotVelo *= this.invInertia;
    this.angularVelocity += rotVelo;
  }
};
var Body_applyImpulse_impulseWorld = vec2create();
var Body_applyImpulse_pointWorld = vec2create();
var Body_applyImpulse_pointLocal = vec2create();
Body$3.prototype.applyImpulseLocal = function(localImpulse, localPoint) {
  localPoint = localPoint || Body_applyImpulse_pointLocal;
  var worldImpulse = Body_applyImpulse_impulseWorld;
  var worldPoint = Body_applyImpulse_pointWorld;
  this.vectorToWorldFrame(worldImpulse, localImpulse);
  this.vectorToWorldFrame(worldPoint, localPoint);
  this.applyImpulse(worldImpulse, worldPoint);
};
Body$3.prototype.toLocalFrame = function(out, worldPoint) {
  vec2$i.toLocalFrame(out, worldPoint, this.position, this.angle);
};
Body$3.prototype.toWorldFrame = function(out, localPoint) {
  vec2$i.toGlobalFrame(out, localPoint, this.position, this.angle);
};
Body$3.prototype.vectorToLocalFrame = function(out, worldVector) {
  vec2$i.vectorToLocalFrame(out, worldVector, this.angle);
};
Body$3.prototype.vectorToWorldFrame = function(out, localVector) {
  vec2$i.vectorToGlobalFrame(out, localVector, this.angle);
};
Body$3.prototype.fromPolygon = function(path, options) {
  options = options || {};
  for (var i = this.shapes.length; i >= 0; --i) {
    this.removeShape(this.shapes[i]);
  }
  var p = [];
  for (var i = 0; i < path.length; i++) {
    p[i] = vec2$i.clone(path[i]);
  }
  decomp.makeCCW(p);
  if (options.removeCollinearPoints !== void 0) {
    decomp.removeCollinearPoints(p, options.removeCollinearPoints);
  }
  if (!options.skipSimpleCheck) {
    if (!decomp.isSimple(p)) {
      return false;
    }
  }
  var concavePath = this.concavePath = [];
  for (var i = 0; i < p.length; i++) {
    concavePath[i] = vec2$i.clone(p[i]);
  }
  var convexes;
  if (options.optimalDecomp) {
    convexes = decomp.decomp(p);
  } else {
    convexes = decomp.quickDecomp(p);
  }
  var cm = vec2create();
  for (var i = 0; i !== convexes.length; i++) {
    var c = new Convex$2({
      vertices: convexes[i]
    });
    for (var j = 0; j !== c.vertices.length; j++) {
      var v2 = c.vertices[j];
      sub$2(v2, v2, c.centerOfMass);
    }
    vec2$i.copy(cm, c.centerOfMass);
    c = new Convex$2({
      vertices: c.vertices
    });
    this.addShape(c, cm);
  }
  this.adjustCenterOfMass();
  this.aabbNeedsUpdate = true;
  return true;
};
var adjustCenterOfMass_tmp2 = vec2create();
var adjustCenterOfMass_tmp3 = vec2create();
var adjustCenterOfMass_tmp4 = vec2create();
Body$3.prototype.adjustCenterOfMass = function() {
  var offset_times_area = adjustCenterOfMass_tmp2, sum = adjustCenterOfMass_tmp3, cm = adjustCenterOfMass_tmp4, totalArea = 0;
  vec2$i.set(sum, 0, 0);
  for (var i = 0; i !== this.shapes.length; i++) {
    var s2 = this.shapes[i];
    vec2$i.scale(offset_times_area, s2.position, s2.area);
    add$2(sum, sum, offset_times_area);
    totalArea += s2.area;
  }
  vec2$i.scale(cm, sum, 1 / totalArea);
  for (var i = 0; i !== this.shapes.length; i++) {
    var s2 = this.shapes[i];
    sub$2(s2.position, s2.position, cm);
  }
  add$2(this.position, this.position, cm);
  for (var i = 0; this.concavePath && i < this.concavePath.length; i++) {
    sub$2(this.concavePath[i], this.concavePath[i], cm);
  }
  this.updateMassProperties();
  this.updateBoundingRadius();
};
Body$3.prototype.setZeroForce = function() {
  var f = this.force;
  f[0] = f[1] = this.angularForce = 0;
};
Body$3.prototype.resetConstraintVelocity = function() {
  var b = this, vlambda = b.vlambda;
  vec2$i.set(vlambda, 0, 0);
  b.wlambda = 0;
};
Body$3.prototype.addConstraintVelocity = function() {
  var b = this, v2 = b.velocity;
  add$2(v2, v2, b.vlambda);
  b.angularVelocity += b.wlambda;
};
Body$3.prototype.applyDamping = function(dt) {
  if (this.type === Body$3.DYNAMIC) {
    var v2 = this.velocity;
    vec2$i.scale(v2, v2, Math.pow(1 - this.damping, dt));
    this.angularVelocity *= Math.pow(1 - this.angularDamping, dt);
  }
};
Body$3.prototype.wakeUp = function() {
  var s2 = this.sleepState;
  this.sleepState = Body$3.AWAKE;
  this.idleTime = 0;
  if (s2 !== Body$3.AWAKE) {
    this.emit(wakeUpEvent);
  }
};
Body$3.prototype.sleep = function() {
  this.sleepState = Body$3.SLEEPING;
  this.angularVelocity = this.angularForce = 0;
  vec2$i.set(this.velocity, 0, 0);
  vec2$i.set(this.force, 0, 0);
  this.emit(sleepEvent);
};
Body$3.prototype.sleepTick = function(time, dontSleep, dt) {
  if (!this.allowSleep || this.type === Body$3.SLEEPING) {
    return;
  }
  this.wantsToSleep = false;
  var speedSquared = vec2$i.squaredLength(this.velocity) + Math.pow(this.angularVelocity, 2), speedLimitSquared = Math.pow(this.sleepSpeedLimit, 2);
  if (speedSquared >= speedLimitSquared) {
    this.idleTime = 0;
    this.sleepState = Body$3.AWAKE;
  } else {
    this.idleTime += dt;
    if (this.sleepState !== Body$3.SLEEPY) {
      this.sleepState = Body$3.SLEEPY;
      this.emit(sleepyEvent);
    }
  }
  if (this.idleTime > this.sleepTimeLimit) {
    if (!dontSleep) {
      this.sleep();
    } else {
      this.wantsToSleep = true;
    }
  }
};
Body$3.prototype.overlaps = function(body) {
  return this.world.overlapKeeper.bodiesAreOverlapping(this, body);
};
var integrate_fhMinv = vec2create();
var integrate_velodt = vec2create();
Body$3.prototype.integrate = function(dt) {
  var minv = this.invMass, f = this.force, pos = this.position, velo = this.velocity;
  vec2$i.copy(this.previousPosition, this.position);
  this.previousAngle = this.angle;
  if (!this.fixedRotation) {
    this.angularVelocity += this.angularForce * this.invInertia * dt;
  }
  vec2$i.scale(integrate_fhMinv, f, dt * minv);
  vec2$i.multiply(integrate_fhMinv, this.massMultiplier, integrate_fhMinv);
  add$2(velo, integrate_fhMinv, velo);
  if (!this.integrateToTimeOfImpact(dt)) {
    vec2$i.scale(integrate_velodt, velo, dt);
    add$2(pos, pos, integrate_velodt);
    if (!this.fixedRotation) {
      this.angle += this.angularVelocity * dt;
    }
  }
  this.aabbNeedsUpdate = true;
};
var result = new RaycastResult();
var ray = new Ray({
  mode: Ray.CLOSEST,
  skipBackfaces: true
});
var direction = vec2create();
var end = vec2create();
var startToEnd = vec2create();
var rememberPosition = vec2create();
Body$3.prototype.integrateToTimeOfImpact = function(dt) {
  if (this.ccdSpeedThreshold < 0 || vec2$i.squaredLength(this.velocity) < Math.pow(this.ccdSpeedThreshold, 2)) {
    return false;
  }
  var ignoreBodies = [];
  var disabledPairs = this.world.disabledBodyCollisionPairs;
  for (var i = 0; i < disabledPairs.length; i += 2) {
    var bodyA = disabledPairs[i];
    var bodyB = disabledPairs[i + 1];
    if (bodyA === this) {
      ignoreBodies.push(bodyB);
    } else if (bodyB === this) {
      ignoreBodies.push(bodyA);
    }
  }
  vec2$i.normalize(direction, this.velocity);
  vec2$i.scale(end, this.velocity, dt);
  add$2(end, end, this.position);
  sub$2(startToEnd, end, this.position);
  var startToEndAngle = this.angularVelocity * dt;
  var len = vec2$i.length(startToEnd);
  var timeOfImpact = 1;
  var hitBody;
  vec2$i.copy(ray.from, this.position);
  vec2$i.copy(ray.to, end);
  ray.update();
  for (var i = 0; i < this.shapes.length; i++) {
    var shape = this.shapes[i];
    result.reset();
    ray.collisionGroup = shape.collisionGroup;
    ray.collisionMask = shape.collisionMask;
    this.world.raycast(result, ray);
    hitBody = result.body;
    if (hitBody === this || ignoreBodies.indexOf(hitBody) !== -1) {
      hitBody = null;
    }
    if (hitBody) {
      break;
    }
  }
  if (!hitBody || !timeOfImpact) {
    return false;
  }
  result.getHitPoint(end, ray);
  sub$2(startToEnd, end, this.position);
  timeOfImpact = vec2$i.distance(end, this.position) / len;
  var rememberAngle = this.angle;
  vec2$i.copy(rememberPosition, this.position);
  var iter = 0;
  var tmin = 0;
  var tmid = timeOfImpact;
  var tmax = 1;
  while (tmax >= tmin && iter < this.ccdIterations) {
    iter++;
    tmid = (tmax + tmin) / 2;
    vec2$i.scale(integrate_velodt, startToEnd, tmid);
    add$2(this.position, rememberPosition, integrate_velodt);
    this.angle = rememberAngle + startToEndAngle * tmid;
    this.updateAABB();
    var overlaps = this.aabb.overlaps(hitBody.aabb) && this.world.narrowphase.bodiesOverlap(this, hitBody, true);
    if (overlaps) {
      tmax = tmid;
    } else {
      tmin = tmid;
    }
  }
  timeOfImpact = tmax;
  vec2$i.copy(this.position, rememberPosition);
  this.angle = rememberAngle;
  vec2$i.scale(integrate_velodt, startToEnd, timeOfImpact);
  add$2(this.position, this.position, integrate_velodt);
  if (!this.fixedRotation) {
    this.angle += startToEndAngle * timeOfImpact;
  }
  return true;
};
Body$3.prototype.getVelocityAtPoint = function(result2, relativePoint2) {
  vec2$i.crossVZ(result2, relativePoint2, this.angularVelocity);
  vec2$i.subtract(result2, this.velocity, result2);
  return result2;
};
Body$3.DYNAMIC = 1;
Body$3.STATIC = 2;
Body$3.KINEMATIC = 4;
Body$3.AWAKE = 0;
Body$3.SLEEPY = 1;
Body$3.SLEEPING = 2;
var vec2$h = vec2$q.exports;
var Body$2 = Body_1;
var Broadphase_1 = Broadphase$2;
function Broadphase$2(type) {
  this.type = type;
  this.result = [];
  this.world = null;
  this.boundingVolumeType = Broadphase$2.AABB;
}
Broadphase$2.AABB = 1;
Broadphase$2.BOUNDING_CIRCLE = 2;
Broadphase$2.prototype.setWorld = function(world) {
  this.world = world;
};
Broadphase$2.prototype.getCollisionPairs = function() {
};
Broadphase$2.boundingRadiusCheck = function(bodyA, bodyB) {
  var d2 = vec2$h.squaredDistance(bodyA.position, bodyB.position), r2 = bodyA.boundingRadius + bodyB.boundingRadius;
  return d2 <= r2 * r2;
};
Broadphase$2.aabbCheck = function(bodyA, bodyB) {
  return bodyA.getAABB().overlaps(bodyB.getAABB());
};
Broadphase$2.prototype.boundingVolumeCheck = function(bodyA, bodyB) {
  var result2;
  switch (this.boundingVolumeType) {
    case Broadphase$2.BOUNDING_CIRCLE:
      result2 = Broadphase$2.boundingRadiusCheck(bodyA, bodyB);
      break;
    case Broadphase$2.AABB:
      result2 = Broadphase$2.aabbCheck(bodyA, bodyB);
      break;
    default:
      throw new Error("Bounding volume type not recognized: " + this.boundingVolumeType);
  }
  return result2;
};
Broadphase$2.canCollide = function(bodyA, bodyB) {
  var KINEMATIC = Body$2.KINEMATIC;
  var STATIC = Body$2.STATIC;
  var typeA = bodyA.type;
  var typeB = bodyB.type;
  if (typeA === STATIC && typeB === STATIC) {
    return false;
  }
  if (typeA === KINEMATIC && typeB === STATIC || typeA === STATIC && typeB === KINEMATIC) {
    return false;
  }
  if (typeA === KINEMATIC && typeB === KINEMATIC) {
    return false;
  }
  if (bodyA.sleepState === Body$2.SLEEPING && bodyB.sleepState === Body$2.SLEEPING) {
    return false;
  }
  if (bodyA.sleepState === Body$2.SLEEPING && typeB === STATIC || bodyB.sleepState === Body$2.SLEEPING && typeA === STATIC) {
    return false;
  }
  return true;
};
Broadphase$2.NAIVE = 1;
Broadphase$2.SAP = 2;
Broadphase$2.prototype.aabbQuery = function() {
};
var Shape$8 = Shape_1;
var shallowClone$5 = Utils_1.shallowClone;
var vec2$g = vec2$q.exports;
var Capsule_1 = Capsule;
function Capsule(options) {
  options = options ? shallowClone$5(options) : {};
  this.length = options.length !== void 0 ? options.length : 1;
  this.radius = options.radius !== void 0 ? options.radius : 1;
  options.type = Shape$8.CAPSULE;
  Shape$8.call(this, options);
}
Capsule.prototype = new Shape$8();
Capsule.prototype.constructor = Capsule;
Capsule.prototype.computeMomentOfInertia = function() {
  function boxI(w, h) {
    return w * h * (Math.pow(w, 2) + Math.pow(h, 2)) / 12;
  }
  function semiA(r3) {
    return Math.PI * Math.pow(r3, 2) / 2;
  }
  function semiI(r3) {
    return (Math.PI / 4 - 8 / (9 * Math.PI)) * Math.pow(r3, 4);
  }
  function semiC(r3) {
    return 4 * r3 / (3 * Math.PI);
  }
  function capsuleA(l3, r3) {
    return l3 * 2 * r3 + Math.PI * Math.pow(r3, 2);
  }
  function capsuleI(l3, r3) {
    var d = l3 / 2 + semiC(r3);
    return boxI(l3, 2 * r3) + 2 * (semiI(r3) + semiA(r3) * Math.pow(d, 2));
  }
  var r2 = this.radius, l2 = this.length, area = capsuleA(l2, r2);
  return area > 0 ? capsuleI(l2, r2) / area : 0;
};
Capsule.prototype.updateBoundingRadius = function() {
  this.boundingRadius = this.radius + this.length / 2;
};
Capsule.prototype.updateArea = function() {
  this.area = Math.PI * this.radius * this.radius + this.radius * 2 * this.length;
};
var r$1 = vec2$g.create();
Capsule.prototype.computeAABB = function(out, position, angle) {
  var radius = this.radius;
  vec2$g.set(r$1, this.length / 2, 0);
  if (angle !== 0) {
    vec2$g.rotate(r$1, r$1, angle);
  }
  vec2$g.set(out.upperBound, Math.max(r$1[0] + radius, -r$1[0] + radius), Math.max(r$1[1] + radius, -r$1[1] + radius));
  vec2$g.set(out.lowerBound, Math.min(r$1[0] - radius, -r$1[0] - radius), Math.min(r$1[1] - radius, -r$1[1] - radius));
  vec2$g.add(out.lowerBound, out.lowerBound, position);
  vec2$g.add(out.upperBound, out.upperBound, position);
};
var intersectCapsule_hitPointWorld = vec2$g.create();
var intersectCapsule_normal = vec2$g.create();
var intersectCapsule_l0 = vec2$g.create();
var intersectCapsule_l1 = vec2$g.create();
var intersectCapsule_unit_y = vec2$g.fromValues(0, 1);
Capsule.prototype.raycast = function(result2, ray2, position, angle) {
  var from = ray2.from;
  var to = ray2.to;
  var hitPointWorld = intersectCapsule_hitPointWorld;
  var normal = intersectCapsule_normal;
  var l0 = intersectCapsule_l0;
  var l1 = intersectCapsule_l1;
  var halfLen = this.length / 2;
  for (var i = 0; i < 2; i++) {
    var y = this.radius * (i * 2 - 1);
    vec2$g.set(l0, -halfLen, y);
    vec2$g.set(l1, halfLen, y);
    vec2$g.toGlobalFrame(l0, l0, position, angle);
    vec2$g.toGlobalFrame(l1, l1, position, angle);
    var delta = vec2$g.getLineSegmentsIntersectionFraction(from, to, l0, l1);
    if (delta >= 0) {
      vec2$g.rotate(normal, intersectCapsule_unit_y, angle);
      vec2$g.scale(normal, normal, i * 2 - 1);
      ray2.reportIntersection(result2, delta, normal, -1);
      if (result2.shouldStop(ray2)) {
        return;
      }
    }
  }
  var diagonalLengthSquared = Math.pow(this.radius, 2) + Math.pow(halfLen, 2);
  for (var i = 0; i < 2; i++) {
    vec2$g.set(l0, halfLen * (i * 2 - 1), 0);
    vec2$g.toGlobalFrame(l0, l0, position, angle);
    var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
    var b = 2 * ((to[0] - from[0]) * (from[0] - l0[0]) + (to[1] - from[1]) * (from[1] - l0[1]));
    var c = Math.pow(from[0] - l0[0], 2) + Math.pow(from[1] - l0[1], 2) - Math.pow(this.radius, 2);
    var delta = Math.pow(b, 2) - 4 * a * c;
    if (delta < 0) {
      continue;
    } else if (delta === 0) {
      vec2$g.lerp(hitPointWorld, from, to, delta);
      if (vec2$g.squaredDistance(hitPointWorld, position) > diagonalLengthSquared) {
        vec2$g.subtract(normal, hitPointWorld, l0);
        vec2$g.normalize(normal, normal);
        ray2.reportIntersection(result2, delta, normal, -1);
        if (result2.shouldStop(ray2)) {
          return;
        }
      }
    } else {
      var sqrtDelta = Math.sqrt(delta);
      var inv2a = 1 / (2 * a);
      var d1 = (-b - sqrtDelta) * inv2a;
      var d2 = (-b + sqrtDelta) * inv2a;
      if (d1 >= 0 && d1 <= 1) {
        vec2$g.lerp(hitPointWorld, from, to, d1);
        if (vec2$g.squaredDistance(hitPointWorld, position) > diagonalLengthSquared) {
          vec2$g.subtract(normal, hitPointWorld, l0);
          vec2$g.normalize(normal, normal);
          ray2.reportIntersection(result2, d1, normal, -1);
          if (result2.shouldStop(ray2)) {
            return;
          }
        }
      }
      if (d2 >= 0 && d2 <= 1) {
        vec2$g.lerp(hitPointWorld, from, to, d2);
        if (vec2$g.squaredDistance(hitPointWorld, position) > diagonalLengthSquared) {
          vec2$g.subtract(normal, hitPointWorld, l0);
          vec2$g.normalize(normal, normal);
          ray2.reportIntersection(result2, d2, normal, -1);
          if (result2.shouldStop(ray2)) {
            return;
          }
        }
      }
    }
  }
};
Capsule.prototype.pointTest = function(localPoint) {
  var radius = this.radius;
  var halfLength = this.length * 0.5;
  if (Math.abs(localPoint[0]) <= halfLength && Math.abs(localPoint[1]) <= radius) {
    return true;
  }
  if (Math.pow(localPoint[0] - halfLength, 2) + Math.pow(localPoint[1], 2) <= radius * radius) {
    return true;
  }
  if (Math.pow(localPoint[0] + halfLength, 2) + Math.pow(localPoint[1], 2) <= radius * radius) {
    return true;
  }
  return false;
};
var Shape$7 = Shape_1;
var vec2$f = vec2$q.exports;
var shallowClone$4 = Utils_1.shallowClone;
var Circle_1 = Circle$1;
function Circle$1(options) {
  options = options ? shallowClone$4(options) : {};
  this.radius = options.radius !== void 0 ? options.radius : 1;
  options.type = Shape$7.CIRCLE;
  Shape$7.call(this, options);
}
Circle$1.prototype = new Shape$7();
Circle$1.prototype.constructor = Circle$1;
Circle$1.prototype.computeMomentOfInertia = function() {
  var r2 = this.radius;
  return r2 * r2 / 2;
};
Circle$1.prototype.updateBoundingRadius = function() {
  this.boundingRadius = this.radius;
};
Circle$1.prototype.updateArea = function() {
  this.area = Math.PI * this.radius * this.radius;
};
Circle$1.prototype.computeAABB = function(out, position) {
  var r2 = this.radius;
  vec2$f.set(out.upperBound, r2, r2);
  vec2$f.set(out.lowerBound, -r2, -r2);
  if (position) {
    vec2$f.add(out.lowerBound, out.lowerBound, position);
    vec2$f.add(out.upperBound, out.upperBound, position);
  }
};
var Ray_intersectSphere_intersectionPoint = vec2$f.create();
var Ray_intersectSphere_normal = vec2$f.create();
Circle$1.prototype.raycast = function(result2, ray2, position) {
  var from = ray2.from, to = ray2.to, r2 = this.radius;
  var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
  var b = 2 * ((to[0] - from[0]) * (from[0] - position[0]) + (to[1] - from[1]) * (from[1] - position[1]));
  var c = Math.pow(from[0] - position[0], 2) + Math.pow(from[1] - position[1], 2) - Math.pow(r2, 2);
  var delta = Math.pow(b, 2) - 4 * a * c;
  var intersectionPoint = Ray_intersectSphere_intersectionPoint;
  var normal = Ray_intersectSphere_normal;
  if (delta < 0) {
    return;
  } else if (delta === 0) {
    vec2$f.lerp(intersectionPoint, from, to, delta);
    vec2$f.subtract(normal, intersectionPoint, position);
    vec2$f.normalize(normal, normal);
    ray2.reportIntersection(result2, delta, normal, -1);
  } else {
    var sqrtDelta = Math.sqrt(delta);
    var inv2a = 1 / (2 * a);
    var d1 = (-b - sqrtDelta) * inv2a;
    var d2 = (-b + sqrtDelta) * inv2a;
    if (d1 >= 0 && d1 <= 1) {
      vec2$f.lerp(intersectionPoint, from, to, d1);
      vec2$f.subtract(normal, intersectionPoint, position);
      vec2$f.normalize(normal, normal);
      ray2.reportIntersection(result2, d1, normal, -1);
      if (result2.shouldStop(ray2)) {
        return;
      }
    }
    if (d2 >= 0 && d2 <= 1) {
      vec2$f.lerp(intersectionPoint, from, to, d2);
      vec2$f.subtract(normal, intersectionPoint, position);
      vec2$f.normalize(normal, normal);
      ray2.reportIntersection(result2, d2, normal, -1);
    }
  }
};
Circle$1.prototype.pointTest = function(localPoint) {
  var radius = this.radius;
  return vec2$f.squaredLength(localPoint) <= radius * radius;
};
var Constraint_1 = Constraint$6;
function Constraint$6(bodyA, bodyB, type, options) {
  options = options || {};
  this.type = type;
  this.equations = [];
  this.bodyA = bodyA;
  this.bodyB = bodyB;
  this.collideConnected = options.collideConnected !== void 0 ? options.collideConnected : true;
  if (options.wakeUpBodies !== false) {
    if (bodyA) {
      bodyA.wakeUp();
    }
    if (bodyB) {
      bodyB.wakeUp();
    }
  }
}
Constraint$6.prototype.update = function() {
  throw new Error("method update() not implmemented in this Constraint subclass!");
};
Constraint$6.DISTANCE = 1;
Constraint$6.GEAR = 2;
Constraint$6.LOCK = 3;
Constraint$6.PRISMATIC = 4;
Constraint$6.REVOLUTE = 5;
Constraint$6.prototype.setStiffness = function(stiffness) {
  var eqs = this.equations;
  for (var i = 0; i !== eqs.length; i++) {
    var eq = eqs[i];
    eq.stiffness = stiffness;
    eq.needsUpdate = true;
  }
};
Constraint$6.prototype.setRelaxation = function(relaxation) {
  var eqs = this.equations;
  for (var i = 0; i !== eqs.length; i++) {
    var eq = eqs[i];
    eq.relaxation = relaxation;
    eq.needsUpdate = true;
  }
};
Constraint$6.prototype.setMaxBias = function(maxBias) {
  var eqs = this.equations;
  for (var i = 0; i !== eqs.length; i++) {
    var eq = eqs[i];
    eq.maxBias = maxBias;
  }
};
var Equation$8 = Equation_1;
var vec2$e = vec2$q.exports;
var ContactEquation_1 = ContactEquation$2;
function ContactEquation$2(bodyA, bodyB) {
  Equation$8.call(this, bodyA, bodyB, 0, Number.MAX_VALUE);
  this.contactPointA = vec2$e.create();
  this.penetrationVec = vec2$e.create();
  this.contactPointB = vec2$e.create();
  this.normalA = vec2$e.create();
  this.restitution = 0;
  this.firstImpact = false;
  this.shapeA = null;
  this.shapeB = null;
}
ContactEquation$2.prototype = new Equation$8();
ContactEquation$2.prototype.constructor = ContactEquation$2;
ContactEquation$2.prototype.computeB = function(a, b, h) {
  var bi = this.bodyA, bj = this.bodyB, ri2 = this.contactPointA, rj2 = this.contactPointB, xi = bi.position, xj = bj.position;
  var n2 = this.normalA, G = this.G;
  var rixn = vec2$e.crossLength(ri2, n2), rjxn = vec2$e.crossLength(rj2, n2);
  G[0] = -n2[0];
  G[1] = -n2[1];
  G[2] = -rixn;
  G[3] = n2[0];
  G[4] = n2[1];
  G[5] = rjxn;
  var GW, Gq;
  if (this.firstImpact && this.restitution !== 0) {
    Gq = 0;
    GW = 1 / b * (1 + this.restitution) * this.computeGW();
  } else {
    var penetrationVec = this.penetrationVec;
    addSubSub(penetrationVec, xj, rj2, xi, ri2);
    Gq = vec2$e.dot(n2, penetrationVec) + this.offset;
    GW = this.computeGW();
  }
  var GiMf = this.computeGiMf();
  var B = -Gq * a - GW * b - h * GiMf;
  return B;
};
function addSubSub(out, a, b, c, d) {
  out[0] = a[0] + b[0] - c[0] - d[0];
  out[1] = a[1] + b[1] - c[1] - d[1];
}
var vi = vec2$e.create();
var vj = vec2$e.create();
var relVel = vec2$e.create();
ContactEquation$2.prototype.getVelocityAlongNormal = function() {
  this.bodyA.getVelocityAtPoint(vi, this.contactPointA);
  this.bodyB.getVelocityAtPoint(vj, this.contactPointB);
  vec2$e.subtract(relVel, vi, vj);
  return vec2$e.dot(this.normalA, relVel);
};
var Pool_1 = Pool$3;
function Pool$3(options) {
  options = options || {};
  this.objects = [];
  if (options.size !== void 0) {
    this.resize(options.size);
  }
}
Pool$3.prototype.resize = function(size) {
  var objects = this.objects;
  while (objects.length > size) {
    objects.pop();
  }
  while (objects.length < size) {
    objects.push(this.create());
  }
  return this;
};
Pool$3.prototype.get = function() {
  var objects = this.objects;
  return objects.length ? objects.pop() : this.create();
};
Pool$3.prototype.release = function(object) {
  this.destroy(object);
  this.objects.push(object);
  return this;
};
var ContactEquation$1 = ContactEquation_1;
var Pool$2 = Pool_1;
var ContactEquationPool_1 = ContactEquationPool$1;
function ContactEquationPool$1() {
  Pool$2.apply(this, arguments);
}
ContactEquationPool$1.prototype = new Pool$2();
ContactEquationPool$1.prototype.constructor = ContactEquationPool$1;
ContactEquationPool$1.prototype.create = function() {
  return new ContactEquation$1();
};
ContactEquationPool$1.prototype.destroy = function(equation) {
  equation.bodyA = equation.bodyB = null;
  return this;
};
var Material_1 = Material$2;
function Material$2() {
  this.id = Material$2.idCounter++;
}
Material$2.idCounter = 0;
var Material$1 = Material_1;
var Equation$7 = Equation_1;
var ContactMaterial_1 = ContactMaterial$1;
function ContactMaterial$1(materialA, materialB, options) {
  options = options || {};
  if (!(materialA instanceof Material$1) || !(materialB instanceof Material$1)) {
    throw new Error("First two arguments must be Material instances.");
  }
  this.id = ContactMaterial$1.idCounter++;
  this.materialA = materialA;
  this.materialB = materialB;
  this.friction = options.friction !== void 0 ? options.friction : 0.3;
  this.restitution = options.restitution !== void 0 ? options.restitution : 0;
  this.stiffness = options.stiffness !== void 0 ? options.stiffness : Equation$7.DEFAULT_STIFFNESS;
  this.relaxation = options.relaxation !== void 0 ? options.relaxation : Equation$7.DEFAULT_RELAXATION;
  this.frictionStiffness = options.frictionStiffness !== void 0 ? options.frictionStiffness : Equation$7.DEFAULT_STIFFNESS;
  this.frictionRelaxation = options.frictionRelaxation !== void 0 ? options.frictionRelaxation : Equation$7.DEFAULT_RELAXATION;
  this.surfaceVelocity = options.surfaceVelocity !== void 0 ? options.surfaceVelocity : 0;
  this.contactSkinSize = 5e-3;
}
ContactMaterial$1.idCounter = 0;
var Constraint$5 = Constraint_1;
var Equation$6 = Equation_1;
var vec2$d = vec2$q.exports;
var DistanceConstraint_1 = DistanceConstraint;
function DistanceConstraint(bodyA, bodyB, options) {
  options = options || {};
  Constraint$5.call(this, bodyA, bodyB, Constraint$5.DISTANCE, options);
  this.localAnchorA = options.localAnchorA ? vec2$d.clone(options.localAnchorA) : vec2$d.create();
  this.localAnchorB = options.localAnchorB ? vec2$d.clone(options.localAnchorB) : vec2$d.create();
  var localAnchorA = this.localAnchorA;
  var localAnchorB = this.localAnchorB;
  this.distance = 0;
  if (typeof options.distance === "number") {
    this.distance = options.distance;
  } else {
    var worldAnchorA2 = vec2$d.create(), worldAnchorB2 = vec2$d.create(), r2 = vec2$d.create();
    vec2$d.rotate(worldAnchorA2, localAnchorA, bodyA.angle);
    vec2$d.rotate(worldAnchorB2, localAnchorB, bodyB.angle);
    vec2$d.add(r2, bodyB.position, worldAnchorB2);
    vec2$d.subtract(r2, r2, worldAnchorA2);
    vec2$d.subtract(r2, r2, bodyA.position);
    this.distance = vec2$d.length(r2);
  }
  var maxForce;
  if (typeof options.maxForce === "undefined") {
    maxForce = Number.MAX_VALUE;
  } else {
    maxForce = options.maxForce;
  }
  var normal = new Equation$6(bodyA, bodyB, -maxForce, maxForce);
  this.equations = [normal];
  this.maxForce = maxForce;
  var r2 = vec2$d.create();
  var ri2 = vec2$d.create();
  var rj2 = vec2$d.create();
  var that = this;
  normal.computeGq = function() {
    var bodyA2 = this.bodyA, bodyB2 = this.bodyB, xi = bodyA2.position, xj = bodyB2.position;
    vec2$d.rotate(ri2, localAnchorA, bodyA2.angle);
    vec2$d.rotate(rj2, localAnchorB, bodyB2.angle);
    vec2$d.add(r2, xj, rj2);
    vec2$d.subtract(r2, r2, ri2);
    vec2$d.subtract(r2, r2, xi);
    return vec2$d.length(r2) - that.distance;
  };
  this.setMaxForce(maxForce);
  this.upperLimitEnabled = false;
  this.upperLimit = 1;
  this.lowerLimitEnabled = false;
  this.lowerLimit = 0;
  this.position = 0;
}
DistanceConstraint.prototype = new Constraint$5();
DistanceConstraint.prototype.constructor = DistanceConstraint;
var n = vec2$d.create();
var ri = vec2$d.create();
var rj = vec2$d.create();
DistanceConstraint.prototype.update = function() {
  var normal = this.equations[0], bodyA = this.bodyA, bodyB = this.bodyB, xi = bodyA.position, xj = bodyB.position, normalEquation = this.equations[0], G = normal.G;
  vec2$d.rotate(ri, this.localAnchorA, bodyA.angle);
  vec2$d.rotate(rj, this.localAnchorB, bodyB.angle);
  vec2$d.add(n, xj, rj);
  vec2$d.subtract(n, n, ri);
  vec2$d.subtract(n, n, xi);
  this.position = vec2$d.length(n);
  var violating = false;
  if (this.upperLimitEnabled) {
    if (this.position > this.upperLimit) {
      normalEquation.maxForce = 0;
      normalEquation.minForce = -this.maxForce;
      this.distance = this.upperLimit;
      violating = true;
    }
  }
  if (this.lowerLimitEnabled) {
    if (this.position < this.lowerLimit) {
      normalEquation.maxForce = this.maxForce;
      normalEquation.minForce = 0;
      this.distance = this.lowerLimit;
      violating = true;
    }
  }
  if ((this.lowerLimitEnabled || this.upperLimitEnabled) && !violating) {
    normalEquation.enabled = false;
    return;
  }
  normalEquation.enabled = true;
  vec2$d.normalize(n, n);
  var rixn = vec2$d.crossLength(ri, n), rjxn = vec2$d.crossLength(rj, n);
  G[0] = -n[0];
  G[1] = -n[1];
  G[2] = -rixn;
  G[3] = n[0];
  G[4] = n[1];
  G[5] = rjxn;
};
DistanceConstraint.prototype.setMaxForce = function(maxForce) {
  var normal = this.equations[0];
  normal.minForce = -maxForce;
  normal.maxForce = maxForce;
};
DistanceConstraint.prototype.getMaxForce = function() {
  var normal = this.equations[0];
  return normal.maxForce;
};
var vec2$c = vec2$q.exports;
var Equation$5 = Equation_1;
var FrictionEquation_1 = FrictionEquation$3;
function FrictionEquation$3(bodyA, bodyB, slipForce) {
  Equation$5.call(this, bodyA, bodyB, -slipForce, slipForce);
  this.contactPointA = vec2$c.create();
  this.contactPointB = vec2$c.create();
  this.t = vec2$c.create();
  this.contactEquations = [];
  this.shapeA = null;
  this.shapeB = null;
  this.frictionCoefficient = 0.3;
}
FrictionEquation$3.prototype = new Equation$5();
FrictionEquation$3.prototype.constructor = FrictionEquation$3;
FrictionEquation$3.prototype.setSlipForce = function(slipForce) {
  this.maxForce = slipForce;
  this.minForce = -slipForce;
};
FrictionEquation$3.prototype.getSlipForce = function() {
  return this.maxForce;
};
FrictionEquation$3.prototype.computeB = function(a, b, h) {
  var ri2 = this.contactPointA, rj2 = this.contactPointB, t2 = this.t, G = this.G;
  G[0] = -t2[0];
  G[1] = -t2[1];
  G[2] = -vec2$c.crossLength(ri2, t2);
  G[3] = t2[0];
  G[4] = t2[1];
  G[5] = vec2$c.crossLength(rj2, t2);
  var GW = this.computeGW(), GiMf = this.computeGiMf();
  var B = (
    /* - g * a  */
    -GW * b - h * GiMf
  );
  return B;
};
var FrictionEquation$2 = FrictionEquation_1;
var Pool$1 = Pool_1;
var FrictionEquationPool_1 = FrictionEquationPool$1;
function FrictionEquationPool$1() {
  Pool$1.apply(this, arguments);
}
FrictionEquationPool$1.prototype = new Pool$1();
FrictionEquationPool$1.prototype.constructor = FrictionEquationPool$1;
FrictionEquationPool$1.prototype.create = function() {
  return new FrictionEquation$2();
};
FrictionEquationPool$1.prototype.destroy = function(equation) {
  equation.bodyA = equation.bodyB = null;
  return this;
};
var Constraint$4 = Constraint_1;
var AngleLockEquation = AngleLockEquation_1;
var Utils$4 = Utils_1;
var GearConstraint_1 = GearConstraint;
function GearConstraint(bodyA, bodyB, options) {
  options = options || {};
  Constraint$4.call(this, bodyA, bodyB, Constraint$4.GEAR, options);
  this.ratio = options.ratio !== void 0 ? options.ratio : 1;
  this.angle = options.angle !== void 0 ? options.angle : bodyB.angle - this.ratio * bodyA.angle;
  var angleLockOptions = Utils$4.shallowClone(options);
  angleLockOptions.angle = this.angle;
  angleLockOptions.ratio = this.ratio;
  this.equations = [new AngleLockEquation(bodyA, bodyB, angleLockOptions)];
  if (options.maxTorque !== void 0) {
    this.setMaxTorque(options.maxTorque);
  }
}
GearConstraint.prototype = new Constraint$4();
GearConstraint.prototype.constructor = GearConstraint;
GearConstraint.prototype.update = function() {
  var eq = this.equations[0];
  var ratio = this.ratio;
  if (eq.ratio !== ratio) {
    eq.setRatio(ratio);
  }
  eq.angle = this.angle;
};
GearConstraint.prototype.setMaxTorque = function(torque) {
  this.equations[0].setMaxTorque(torque);
};
GearConstraint.prototype.getMaxTorque = function() {
  return this.equations[0].maxForce;
};
var EventEmitter$1 = EventEmitter_1;
var Solver_1 = Solver$1;
function Solver$1(options, type) {
  options = options || {};
  EventEmitter$1.call(this);
  this.type = type;
  this.equations = [];
  this.equationSortFunction = options.equationSortFunction || false;
}
Solver$1.prototype = new EventEmitter$1();
Solver$1.prototype.constructor = Solver$1;
Solver$1.prototype.solve = function() {
  throw new Error("Solver.solve should be implemented by subclasses!");
};
Solver$1.prototype.sortEquations = function() {
  if (this.equationSortFunction) {
    this.equations.sort(this.equationSortFunction);
  }
};
Solver$1.prototype.addEquation = function(eq) {
  if (eq.enabled) {
    this.equations.push(eq);
  }
};
Solver$1.prototype.addEquations = function(eqs) {
  for (var i = 0, N = eqs.length; i !== N; i++) {
    var eq = eqs[i];
    if (eq.enabled) {
      this.equations.push(eq);
    }
  }
};
Solver$1.prototype.removeEquation = function(eq) {
  var i = this.equations.indexOf(eq);
  if (i !== -1) {
    this.equations.splice(i, 1);
  }
};
Solver$1.prototype.removeAllEquations = function() {
  this.equations.length = 0;
};
Solver$1.GS = 1;
var Solver = Solver_1;
var FrictionEquation$1 = FrictionEquation_1;
var GSSolver_1 = GSSolver$1;
function GSSolver$1(options) {
  Solver.call(this, options, Solver.GS);
  options = options || {};
  this.iterations = options.iterations || 10;
  this.tolerance = options.tolerance !== void 0 ? options.tolerance : 1e-7;
  this.frictionIterations = options.frictionIterations !== void 0 ? 0 : options.frictionIterations;
  this.usedIterations = 0;
}
GSSolver$1.prototype = new Solver();
GSSolver$1.prototype.constructor = GSSolver$1;
GSSolver$1.prototype.solve = function(h, world) {
  this.sortEquations();
  var iter = 0, maxIter = this.iterations, maxFrictionIter = this.frictionIterations, equations = this.equations, Neq = equations.length, tolSquared = Math.pow(this.tolerance * Neq, 2), bodies = world.bodies, Nbodies = bodies.length;
  this.usedIterations = 0;
  if (Neq) {
    for (var i = 0; i !== Nbodies; i++) {
      var b = bodies[i];
      b.updateSolveMassProperties();
    }
  }
  for (var i = 0; i !== Neq; i++) {
    var c = equations[i];
    c.lambda = 0;
    if (c.timeStep !== h || c.needsUpdate) {
      c.timeStep = h;
      c.update();
    }
    c.B = c.computeB(c.a, c.b, h);
    c.invC = c.computeInvC(c.epsilon);
    c.maxForceDt = c.maxForce * h;
    c.minForceDt = c.minForce * h;
  }
  var c, deltalambdaTot, i, j;
  if (Neq !== 0) {
    for (i = 0; i !== Nbodies; i++) {
      var b = bodies[i];
      b.resetConstraintVelocity();
    }
    if (maxFrictionIter) {
      for (iter = 0; iter !== maxFrictionIter; iter++) {
        deltalambdaTot = 0;
        for (j = 0; j !== Neq; j++) {
          c = equations[j];
          var deltalambda = iterateEquation(c);
          deltalambdaTot += Math.abs(deltalambda);
        }
        this.usedIterations++;
        if (deltalambdaTot * deltalambdaTot <= tolSquared) {
          break;
        }
      }
      updateMultipliers(equations, 1 / h);
      for (j = 0; j !== Neq; j++) {
        var eq = equations[j];
        if (eq instanceof FrictionEquation$1) {
          var f = 0;
          for (var k = 0; k !== eq.contactEquations.length; k++) {
            f += eq.contactEquations[k].multiplier;
          }
          f *= eq.frictionCoefficient / eq.contactEquations.length;
          eq.maxForce = f;
          eq.minForce = -f;
          eq.maxForceDt = f * h;
          eq.minForceDt = -f * h;
        }
      }
    }
    for (iter = 0; iter !== maxIter; iter++) {
      deltalambdaTot = 0;
      for (j = 0; j !== Neq; j++) {
        c = equations[j];
        var deltalambda = iterateEquation(c);
        deltalambdaTot += Math.abs(deltalambda);
      }
      this.usedIterations++;
      if (deltalambdaTot * deltalambdaTot < tolSquared) {
        break;
      }
    }
    for (i = 0; i !== Nbodies; i++) {
      bodies[i].addConstraintVelocity();
    }
    updateMultipliers(equations, 1 / h);
  }
};
function updateMultipliers(equations, invDt) {
  var l2 = equations.length;
  while (l2--) {
    var eq = equations[l2];
    eq.multiplier = eq.lambda * invDt;
  }
}
function iterateEquation(eq) {
  var B = eq.B, eps = eq.epsilon, invC = eq.invC, lambdaj = eq.lambda, GWlambda = eq.computeGWlambda(), maxForce_dt = eq.maxForceDt, minForce_dt = eq.minForceDt;
  var deltalambda = invC * (B - GWlambda - eps * lambdaj);
  var lambdaj_plus_deltalambda = lambdaj + deltalambda;
  if (lambdaj_plus_deltalambda < minForce_dt) {
    deltalambda = minForce_dt - lambdaj;
  } else if (lambdaj_plus_deltalambda > maxForce_dt) {
    deltalambda = maxForce_dt - lambdaj;
  }
  eq.lambda += deltalambda;
  eq.addToWlambda(deltalambda);
  return deltalambda;
}
var Shape$6 = Shape_1;
var vec2$b = vec2$q.exports;
var shallowClone$3 = Utils_1.shallowClone;
var Heightfield_1 = Heightfield;
function Heightfield(options) {
  options = options ? shallowClone$3(options) : {};
  this.heights = options.heights ? options.heights.slice(0) : [];
  this.maxValue = options.maxValue || null;
  this.minValue = options.minValue || null;
  this.elementWidth = options.elementWidth !== void 0 ? options.elementWidth : 0.1;
  if (options.maxValue === void 0 || options.minValue === void 0) {
    this.updateMaxMinValues();
  }
  options.type = Shape$6.HEIGHTFIELD;
  Shape$6.call(this, options);
}
Heightfield.prototype = new Shape$6();
Heightfield.prototype.constructor = Heightfield;
Heightfield.prototype.updateMaxMinValues = function() {
  var data = this.heights;
  var maxValue = data[0];
  var minValue = data[0];
  for (var i = 0; i !== data.length; i++) {
    var v2 = data[i];
    if (v2 > maxValue) {
      maxValue = v2;
    }
    if (v2 < minValue) {
      minValue = v2;
    }
  }
  this.maxValue = maxValue;
  this.minValue = minValue;
};
Heightfield.prototype.computeMomentOfInertia = function() {
  return Number.MAX_VALUE;
};
Heightfield.prototype.updateBoundingRadius = function() {
  this.boundingRadius = Number.MAX_VALUE;
};
Heightfield.prototype.updateArea = function() {
  var data = this.heights, area = 0;
  for (var i = 0; i < data.length - 1; i++) {
    area += (data[i] + data[i + 1]) / 2 * this.elementWidth;
  }
  this.area = area;
};
var points$1 = [vec2$b.create(), vec2$b.create(), vec2$b.create(), vec2$b.create()];
Heightfield.prototype.computeAABB = function(out, position, angle) {
  vec2$b.set(points$1[0], 0, this.maxValue);
  vec2$b.set(points$1[1], this.elementWidth * this.heights.length, this.maxValue);
  vec2$b.set(points$1[2], this.elementWidth * this.heights.length, this.minValue);
  vec2$b.set(points$1[3], 0, this.minValue);
  out.setFromPoints(points$1, position, angle);
};
Heightfield.prototype.getLineSegment = function(start, end2, i) {
  var data = this.heights;
  var width = this.elementWidth;
  vec2$b.set(start, i * width, data[i]);
  vec2$b.set(end2, (i + 1) * width, data[i + 1]);
};
Heightfield.prototype.getSegmentIndex = function(position) {
  return Math.floor(position[0] / this.elementWidth);
};
Heightfield.prototype.getClampedSegmentIndex = function(position) {
  var i = this.getSegmentIndex(position);
  i = Math.min(this.heights.length, Math.max(i, 0));
  return i;
};
var intersectHeightfield_worldNormal = vec2$b.create();
var intersectHeightfield_l0 = vec2$b.create();
var intersectHeightfield_l1 = vec2$b.create();
var intersectHeightfield_localFrom = vec2$b.create();
var intersectHeightfield_localTo = vec2$b.create();
Heightfield.prototype.raycast = function(result2, ray2, position, angle) {
  var from = ray2.from;
  var to = ray2.to;
  var worldNormal = intersectHeightfield_worldNormal;
  var l0 = intersectHeightfield_l0;
  var l1 = intersectHeightfield_l1;
  var localFrom = intersectHeightfield_localFrom;
  var localTo = intersectHeightfield_localTo;
  vec2$b.toLocalFrame(localFrom, from, position, angle);
  vec2$b.toLocalFrame(localTo, to, position, angle);
  this.getClampedSegmentIndex(localFrom);
  this.getClampedSegmentIndex(localTo);
  for (var i = 0; i < this.heights.length - 1; i++) {
    this.getLineSegment(l0, l1, i);
    var t2 = vec2$b.getLineSegmentsIntersectionFraction(localFrom, localTo, l0, l1);
    if (t2 >= 0) {
      vec2$b.subtract(worldNormal, l1, l0);
      vec2$b.rotate(worldNormal, worldNormal, angle + Math.PI / 2);
      vec2$b.normalize(worldNormal, worldNormal);
      ray2.reportIntersection(result2, t2, worldNormal, -1);
      if (result2.shouldStop(ray2)) {
        return;
      }
    }
  }
};
var Shape$5 = Shape_1;
var shallowClone$2 = Utils_1.shallowClone;
var vec2$a = vec2$q.exports;
var Line_1 = Line;
function Line(options) {
  options = options ? shallowClone$2(options) : {};
  this.length = options.length !== void 0 ? options.length : 1;
  options.type = Shape$5.LINE;
  Shape$5.call(this, options);
}
Line.prototype = new Shape$5();
Line.prototype.constructor = Line;
Line.prototype.computeMomentOfInertia = function() {
  return Math.pow(this.length, 2) / 12;
};
Line.prototype.updateBoundingRadius = function() {
  this.boundingRadius = this.length / 2;
};
var points = [vec2$a.create(), vec2$a.create()];
Line.prototype.computeAABB = function(out, position, angle) {
  var l2 = this.length / 2;
  vec2$a.set(points[0], -l2, 0);
  vec2$a.set(points[1], l2, 0);
  out.setFromPoints(points, position, angle, 0);
};
var raycast_normal = vec2$a.create();
var raycast_l0 = vec2$a.create();
var raycast_l1 = vec2$a.create();
var raycast_unit_y = vec2$a.fromValues(0, 1);
Line.prototype.raycast = function(result2, ray2, position, angle) {
  var from = ray2.from;
  var to = ray2.to;
  var l0 = raycast_l0;
  var l1 = raycast_l1;
  var halfLen = this.length / 2;
  vec2$a.set(l0, -halfLen, 0);
  vec2$a.set(l1, halfLen, 0);
  vec2$a.toGlobalFrame(l0, l0, position, angle);
  vec2$a.toGlobalFrame(l1, l1, position, angle);
  var fraction = vec2$a.getLineSegmentsIntersectionFraction(l0, l1, from, to);
  if (fraction >= 0) {
    var normal = raycast_normal;
    vec2$a.rotate(normal, raycast_unit_y, angle);
    ray2.reportIntersection(result2, fraction, normal, -1);
  }
};
var Constraint$3 = Constraint_1;
var vec2$9 = vec2$q.exports;
var Equation$4 = Equation_1;
var LockConstraint_1 = LockConstraint;
function LockConstraint(bodyA, bodyB, options) {
  options = options || {};
  Constraint$3.call(this, bodyA, bodyB, Constraint$3.LOCK, options);
  var maxForce = typeof options.maxForce === "undefined" ? Number.MAX_VALUE : options.maxForce;
  var x = new Equation$4(bodyA, bodyB, -maxForce, maxForce), y = new Equation$4(bodyA, bodyB, -maxForce, maxForce), rot = new Equation$4(bodyA, bodyB, -maxForce, maxForce);
  var l2 = vec2$9.create(), g2 = vec2$9.create(), that = this;
  x.computeGq = function() {
    vec2$9.rotate(l2, that.localOffsetB, bodyA.angle);
    vec2$9.subtract(g2, bodyB.position, bodyA.position);
    vec2$9.subtract(g2, g2, l2);
    return g2[0];
  };
  y.computeGq = function() {
    vec2$9.rotate(l2, that.localOffsetB, bodyA.angle);
    vec2$9.subtract(g2, bodyB.position, bodyA.position);
    vec2$9.subtract(g2, g2, l2);
    return g2[1];
  };
  var r2 = vec2$9.create(), t2 = vec2$9.create();
  rot.computeGq = function() {
    vec2$9.rotate(r2, that.localOffsetB, bodyB.angle - that.localAngleB);
    vec2$9.scale(r2, r2, -1);
    vec2$9.subtract(g2, bodyA.position, bodyB.position);
    vec2$9.add(g2, g2, r2);
    vec2$9.rotate(t2, r2, -Math.PI / 2);
    vec2$9.normalize(t2, t2);
    return vec2$9.dot(g2, t2);
  };
  this.localOffsetB = vec2$9.create();
  if (options.localOffsetB) {
    vec2$9.copy(this.localOffsetB, options.localOffsetB);
  } else {
    vec2$9.subtract(this.localOffsetB, bodyB.position, bodyA.position);
    vec2$9.rotate(this.localOffsetB, this.localOffsetB, -bodyA.angle);
  }
  this.localAngleB = 0;
  if (typeof options.localAngleB === "number") {
    this.localAngleB = options.localAngleB;
  } else {
    this.localAngleB = bodyB.angle - bodyA.angle;
  }
  this.equations.push(x, y, rot);
  this.setMaxForce(maxForce);
}
LockConstraint.prototype = new Constraint$3();
LockConstraint.prototype.constructor = LockConstraint;
LockConstraint.prototype.setMaxForce = function(force) {
  var eqs = this.equations;
  for (var i = 0; i < this.equations.length; i++) {
    eqs[i].maxForce = force;
    eqs[i].minForce = -force;
  }
};
LockConstraint.prototype.getMaxForce = function() {
  return this.equations[0].maxForce;
};
var l = vec2$9.create();
var r = vec2$9.create();
var t = vec2$9.create();
var xAxis$2 = vec2$9.fromValues(1, 0);
var yAxis$3 = vec2$9.fromValues(0, 1);
LockConstraint.prototype.update = function() {
  var x = this.equations[0], y = this.equations[1], rot = this.equations[2], bodyA = this.bodyA, bodyB = this.bodyB;
  vec2$9.rotate(l, this.localOffsetB, bodyA.angle);
  vec2$9.rotate(r, this.localOffsetB, bodyB.angle - this.localAngleB);
  vec2$9.scale(r, r, -1);
  vec2$9.rotate(t, r, Math.PI / 2);
  vec2$9.normalize(t, t);
  x.G[0] = -1;
  x.G[1] = 0;
  x.G[2] = -vec2$9.crossLength(l, xAxis$2);
  x.G[3] = 1;
  y.G[0] = 0;
  y.G[1] = -1;
  y.G[2] = -vec2$9.crossLength(l, yAxis$3);
  y.G[4] = 1;
  rot.G[0] = -t[0];
  rot.G[1] = -t[1];
  rot.G[3] = t[0];
  rot.G[4] = t[1];
  rot.G[5] = vec2$9.crossLength(r, t);
};
var Utils$3 = Utils_1;
var TupleDictionary_1 = TupleDictionary$2;
function TupleDictionary$2() {
  this.data = {};
  this.keys = [];
}
TupleDictionary$2.prototype.getKey = function(id1, id2) {
  id1 = id1 | 0;
  id2 = id2 | 0;
  if ((id1 | 0) === (id2 | 0)) {
    return -1;
  }
  return ((id1 | 0) > (id2 | 0) ? id1 << 16 | id2 & 65535 : id2 << 16 | id1 & 65535) | 0;
};
TupleDictionary$2.prototype.getByKey = function(key) {
  key = key | 0;
  return this.data[key];
};
TupleDictionary$2.prototype.get = function(i, j) {
  return this.data[this.getKey(i, j)];
};
TupleDictionary$2.prototype.set = function(i, j, value) {
  if (!value) {
    throw new Error("No data!");
  }
  var key = this.getKey(i, j);
  if (!this.data[key]) {
    this.keys.push(key);
  }
  this.data[key] = value;
  return key;
};
TupleDictionary$2.prototype.reset = function() {
  var data = this.data, keys = this.keys;
  var l2 = keys.length;
  while (l2--) {
    delete data[keys[l2]];
  }
  keys.length = 0;
};
TupleDictionary$2.prototype.copy = function(dict) {
  this.reset();
  Utils$3.appendArray(this.keys, dict.keys);
  var l2 = dict.keys.length;
  while (l2--) {
    var key = dict.keys[l2];
    this.data[key] = dict.data[key];
  }
};
var vec2$8 = vec2$q.exports;
var Shape$4 = Shape_1;
var shallowClone$1 = Utils_1.shallowClone;
var Convex$1 = Convex_1;
var Box_1 = Box$1;
function Box$1(options) {
  options = options || {};
  var width = this.width = options.width !== void 0 ? options.width : 1;
  var height = this.height = options.height !== void 0 ? options.height : 1;
  var verts = [vec2$8.fromValues(-width / 2, -height / 2), vec2$8.fromValues(width / 2, -height / 2), vec2$8.fromValues(width / 2, height / 2), vec2$8.fromValues(-width / 2, height / 2)];
  var convexOptions = shallowClone$1(options);
  convexOptions.vertices = verts;
  convexOptions.type = Shape$4.BOX;
  Convex$1.call(this, convexOptions);
}
Box$1.prototype = new Convex$1();
Box$1.prototype.constructor = Box$1;
Box$1.prototype.computeMomentOfInertia = function() {
  var w = this.width, h = this.height;
  return (h * h + w * w) / 12;
};
Box$1.prototype.updateBoundingRadius = function() {
  var w = this.width, h = this.height;
  this.boundingRadius = Math.sqrt(w * w + h * h) / 2;
};
Box$1.prototype.computeAABB = function(out, position, angle) {
  var c = Math.abs(Math.cos(angle)), s2 = Math.abs(Math.sin(angle)), w = this.width, h = this.height;
  var height = (w * s2 + h * c) * 0.5;
  var width = (h * s2 + w * c) * 0.5;
  var l2 = out.lowerBound;
  var u = out.upperBound;
  var px = position[0];
  var py = position[1];
  l2[0] = px - width;
  l2[1] = py - height;
  u[0] = px + width;
  u[1] = py + height;
};
Box$1.prototype.updateArea = function() {
  this.area = this.width * this.height;
};
Box$1.prototype.pointTest = function(localPoint) {
  return Math.abs(localPoint[0]) <= this.width * 0.5 && Math.abs(localPoint[1]) <= this.height * 0.5;
};
var vec2$7 = vec2$q.exports;
var sub$1 = vec2$7.subtract;
var add$1 = vec2$7.add;
var dot$1 = vec2$7.dot;
var rotate$1 = vec2$7.rotate;
var normalize = vec2$7.normalize;
var copy$2 = vec2$7.copy;
var scale = vec2$7.scale;
var squaredLength = vec2$7.squaredLength;
var createVec2 = vec2$7.create;
var ContactEquationPool = ContactEquationPool_1;
var FrictionEquationPool = FrictionEquationPool_1;
var TupleDictionary$1 = TupleDictionary_1;
var Circle = Circle_1;
var Convex = Convex_1;
var Shape$3 = Shape_1;
var Box = Box_1;
var Narrowphase_1 = Narrowphase$1;
var yAxis$2 = vec2$7.fromValues(0, 1);
var tmp1 = createVec2();
var tmp2 = createVec2();
var tmp3 = createVec2();
var tmp4 = createVec2();
var tmp5 = createVec2();
var tmp6 = createVec2();
var tmp7 = createVec2();
var tmp8 = createVec2();
var tmp9 = createVec2();
var tmp10 = createVec2();
var tmp11 = createVec2();
var tmp12 = createVec2();
var tmp13 = createVec2();
var tmp14 = createVec2();
var tmp15 = createVec2();
var tmpArray$1 = [];
function Narrowphase$1() {
  this.contactEquations = [];
  this.frictionEquations = [];
  this.enableFriction = true;
  this.enabledEquations = true;
  this.slipForce = 10;
  this.contactEquationPool = new ContactEquationPool({
    size: 32
  });
  this.frictionEquationPool = new FrictionEquationPool({
    size: 64
  });
  this.enableFrictionReduction = true;
  this.collidingBodiesLastStep = new TupleDictionary$1();
  this.currentContactMaterial = null;
}
var bodiesOverlap_shapePositionA = createVec2();
var bodiesOverlap_shapePositionB = createVec2();
Narrowphase$1.prototype.bodiesOverlap = function(bodyA, bodyB, checkCollisionMasks) {
  var shapePositionA = bodiesOverlap_shapePositionA;
  var shapePositionB = bodiesOverlap_shapePositionB;
  for (var k = 0, Nshapesi = bodyA.shapes.length; k !== Nshapesi; k++) {
    var shapeA = bodyA.shapes[k];
    for (var l2 = 0, Nshapesj = bodyB.shapes.length; l2 !== Nshapesj; l2++) {
      var shapeB = bodyB.shapes[l2];
      if (checkCollisionMasks && !((shapeA.collisionGroup & shapeB.collisionMask) !== 0 && (shapeB.collisionGroup & shapeA.collisionMask) !== 0)) {
        return;
      }
      bodyA.toWorldFrame(shapePositionA, shapeA.position);
      bodyB.toWorldFrame(shapePositionB, shapeB.position);
      if (shapeA.type <= shapeB.type) {
        if (this[shapeA.type | shapeB.type](bodyA, shapeA, shapePositionA, shapeA.angle + bodyA.angle, bodyB, shapeB, shapePositionB, shapeB.angle + bodyB.angle, true)) {
          return true;
        }
      } else {
        if (this[shapeA.type | shapeB.type](bodyB, shapeB, shapePositionB, shapeB.angle + bodyB.angle, bodyA, shapeA, shapePositionA, shapeA.angle + bodyA.angle, true)) {
          return true;
        }
      }
    }
  }
  return false;
};
Narrowphase$1.prototype.collidedLastStep = function(bodyA, bodyB) {
  var id1 = bodyA.id | 0, id2 = bodyB.id | 0;
  return !!this.collidingBodiesLastStep.get(id1, id2);
};
Narrowphase$1.prototype.reset = function() {
  this.collidingBodiesLastStep.reset();
  var eqs = this.contactEquations;
  var l2 = eqs.length;
  while (l2--) {
    var eq = eqs[l2], id1 = eq.bodyA.id, id2 = eq.bodyB.id;
    this.collidingBodiesLastStep.set(id1, id2, true);
  }
  var ce = this.contactEquations, fe = this.frictionEquations;
  for (var i = 0; i < ce.length; i++) {
    this.contactEquationPool.release(ce[i]);
  }
  for (var i = 0; i < fe.length; i++) {
    this.frictionEquationPool.release(fe[i]);
  }
  this.contactEquations.length = this.frictionEquations.length = 0;
};
Narrowphase$1.prototype.createContactEquation = function(bodyA, bodyB, shapeA, shapeB) {
  var c = this.contactEquationPool.get();
  var currentContactMaterial = this.currentContactMaterial;
  c.bodyA = bodyA;
  c.bodyB = bodyB;
  c.shapeA = shapeA;
  c.shapeB = shapeB;
  c.enabled = this.enabledEquations;
  c.firstImpact = !this.collidedLastStep(bodyA, bodyB);
  c.restitution = currentContactMaterial.restitution;
  c.stiffness = currentContactMaterial.stiffness;
  c.relaxation = currentContactMaterial.relaxation;
  c.offset = currentContactMaterial.contactSkinSize;
  c.needsUpdate = true;
  return c;
};
Narrowphase$1.prototype.createFrictionEquation = function(bodyA, bodyB, shapeA, shapeB) {
  var c = this.frictionEquationPool.get();
  var currentContactMaterial = this.currentContactMaterial;
  c.bodyA = bodyA;
  c.bodyB = bodyB;
  c.shapeA = shapeA;
  c.shapeB = shapeB;
  c.setSlipForce(this.slipForce);
  c.enabled = this.enabledEquations;
  c.frictionCoefficient = currentContactMaterial.friction;
  c.relativeVelocity = currentContactMaterial.surfaceVelocity;
  c.stiffness = currentContactMaterial.frictionStiffness;
  c.relaxation = currentContactMaterial.frictionRelaxation;
  c.needsUpdate = true;
  c.contactEquations.length = 0;
  return c;
};
Narrowphase$1.prototype.createFrictionFromContact = function(c) {
  var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
  copy$2(eq.contactPointA, c.contactPointA);
  copy$2(eq.contactPointB, c.contactPointB);
  vec2$7.rotate90cw(eq.t, c.normalA);
  eq.contactEquations.push(c);
  return eq;
};
Narrowphase$1.prototype.createFrictionFromAverage = function(numContacts) {
  var c = this.contactEquations[this.contactEquations.length - 1];
  var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
  var bodyA = c.bodyA;
  vec2$7.set(eq.contactPointA, 0, 0);
  vec2$7.set(eq.contactPointB, 0, 0);
  vec2$7.set(eq.t, 0, 0);
  for (var i = 0; i !== numContacts; i++) {
    c = this.contactEquations[this.contactEquations.length - 1 - i];
    if (c.bodyA === bodyA) {
      add$1(eq.t, eq.t, c.normalA);
      add$1(eq.contactPointA, eq.contactPointA, c.contactPointA);
      add$1(eq.contactPointB, eq.contactPointB, c.contactPointB);
    } else {
      sub$1(eq.t, eq.t, c.normalA);
      add$1(eq.contactPointA, eq.contactPointA, c.contactPointB);
      add$1(eq.contactPointB, eq.contactPointB, c.contactPointA);
    }
    eq.contactEquations.push(c);
  }
  var invNumContacts = 1 / numContacts;
  scale(eq.contactPointA, eq.contactPointA, invNumContacts);
  scale(eq.contactPointB, eq.contactPointB, invNumContacts);
  normalize(eq.t, eq.t);
  vec2$7.rotate90cw(eq.t, eq.t);
  return eq;
};
Narrowphase$1.prototype[Shape$3.CONVEX | Shape$3.LINE] = Narrowphase$1.prototype.convexLine = function() {
  return 0;
};
Narrowphase$1.prototype[Shape$3.LINE | Shape$3.BOX] = Narrowphase$1.prototype.lineBox = function() {
  return 0;
};
function setConvexToCapsuleShapeMiddle(convexShape, capsuleShape) {
  var capsuleRadius = capsuleShape.radius;
  var halfCapsuleLength = capsuleShape.length * 0.5;
  var verts = convexShape.vertices;
  vec2$7.set(verts[0], -halfCapsuleLength, -capsuleRadius);
  vec2$7.set(verts[1], halfCapsuleLength, -capsuleRadius);
  vec2$7.set(verts[2], halfCapsuleLength, capsuleRadius);
  vec2$7.set(verts[3], -halfCapsuleLength, capsuleRadius);
}
var convexCapsule_tempRect = new Box({
  width: 1,
  height: 1
});
var convexCapsule_tempVec = createVec2();
Narrowphase$1.prototype[Shape$3.CONVEX | Shape$3.CAPSULE] = Narrowphase$1.prototype[Shape$3.BOX | Shape$3.CAPSULE] = Narrowphase$1.prototype.convexCapsule = function(convexBody, convexShape, convexPosition, convexAngle, capsuleBody, capsuleShape, capsulePosition, capsuleAngle, justTest) {
  var circlePos = convexCapsule_tempVec;
  var halfLength = capsuleShape.length / 2;
  vec2$7.set(circlePos, halfLength, 0);
  vec2$7.toGlobalFrame(circlePos, circlePos, capsulePosition, capsuleAngle);
  var result1 = this.circleConvex(capsuleBody, capsuleShape, circlePos, capsuleAngle, convexBody, convexShape, convexPosition, convexAngle, justTest, capsuleShape.radius);
  vec2$7.set(circlePos, -halfLength, 0);
  vec2$7.toGlobalFrame(circlePos, circlePos, capsulePosition, capsuleAngle);
  var result2 = this.circleConvex(capsuleBody, capsuleShape, circlePos, capsuleAngle, convexBody, convexShape, convexPosition, convexAngle, justTest, capsuleShape.radius);
  if (justTest && result1 + result2 !== 0) {
    return 1;
  }
  var r2 = convexCapsule_tempRect;
  setConvexToCapsuleShapeMiddle(r2, capsuleShape);
  var result3 = this.convexConvex(convexBody, convexShape, convexPosition, convexAngle, capsuleBody, r2, capsulePosition, capsuleAngle, justTest);
  return result3 + result1 + result2;
};
Narrowphase$1.prototype[Shape$3.LINE | Shape$3.CAPSULE] = Narrowphase$1.prototype.lineCapsule = function() {
  return 0;
};
var capsuleCapsule_tempVec1 = createVec2();
var capsuleCapsule_tempVec2 = createVec2();
var capsuleCapsule_tempRect1 = new Box({
  width: 1,
  height: 1
});
Narrowphase$1.prototype[Shape$3.CAPSULE] = Narrowphase$1.prototype.capsuleCapsule = function(bi, si, xi, ai, bj, sj, xj, aj, justTest) {
  var enableFrictionBefore;
  var circlePosi = capsuleCapsule_tempVec1, circlePosj = capsuleCapsule_tempVec2;
  var numContacts = 0;
  for (var i = 0; i < 2; i++) {
    vec2$7.set(circlePosi, (i === 0 ? -1 : 1) * si.length / 2, 0);
    vec2$7.toGlobalFrame(circlePosi, circlePosi, xi, ai);
    for (var j = 0; j < 2; j++) {
      vec2$7.set(circlePosj, (j === 0 ? -1 : 1) * sj.length / 2, 0);
      vec2$7.toGlobalFrame(circlePosj, circlePosj, xj, aj);
      if (this.enableFrictionReduction) {
        enableFrictionBefore = this.enableFriction;
        this.enableFriction = false;
      }
      var result2 = this.circleCircle(bi, si, circlePosi, ai, bj, sj, circlePosj, aj, justTest, si.radius, sj.radius);
      if (this.enableFrictionReduction) {
        this.enableFriction = enableFrictionBefore;
      }
      if (justTest && result2 !== 0) {
        return 1;
      }
      numContacts += result2;
    }
  }
  if (this.enableFrictionReduction) {
    enableFrictionBefore = this.enableFriction;
    this.enableFriction = false;
  }
  var rect = capsuleCapsule_tempRect1;
  setConvexToCapsuleShapeMiddle(rect, si);
  var result1 = this.convexCapsule(bi, rect, xi, ai, bj, sj, xj, aj, justTest);
  if (this.enableFrictionReduction) {
    this.enableFriction = enableFrictionBefore;
  }
  if (justTest && result1 !== 0) {
    return 1;
  }
  numContacts += result1;
  if (this.enableFrictionReduction) {
    var enableFrictionBefore = this.enableFriction;
    this.enableFriction = false;
  }
  setConvexToCapsuleShapeMiddle(rect, sj);
  var result22 = this.convexCapsule(bj, rect, xj, aj, bi, si, xi, ai, justTest);
  if (this.enableFrictionReduction) {
    this.enableFriction = enableFrictionBefore;
  }
  if (justTest && result22 !== 0) {
    return 1;
  }
  numContacts += result22;
  if (this.enableFrictionReduction) {
    if (numContacts && this.enableFriction) {
      this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
    }
  }
  return numContacts;
};
Narrowphase$1.prototype[Shape$3.LINE] = Narrowphase$1.prototype.lineLine = function() {
  return 0;
};
Narrowphase$1.prototype[Shape$3.PLANE | Shape$3.LINE] = Narrowphase$1.prototype.planeLine = function(planeBody, planeShape, planeOffset, planeAngle, lineBody, lineShape, lineOffset, lineAngle, justTest) {
  var worldVertex0 = tmp1, worldVertex1 = tmp2, worldVertex01 = tmp3, worldVertex11 = tmp4, worldEdge = tmp5, worldEdgeUnit = tmp6, dist = tmp7, worldNormal = tmp8, worldTangent = tmp9, verts = tmpArray$1, numContacts = 0;
  vec2$7.set(worldVertex0, -lineShape.length / 2, 0);
  vec2$7.set(worldVertex1, lineShape.length / 2, 0);
  vec2$7.toGlobalFrame(worldVertex01, worldVertex0, lineOffset, lineAngle);
  vec2$7.toGlobalFrame(worldVertex11, worldVertex1, lineOffset, lineAngle);
  copy$2(worldVertex0, worldVertex01);
  copy$2(worldVertex1, worldVertex11);
  sub$1(worldEdge, worldVertex1, worldVertex0);
  normalize(worldEdgeUnit, worldEdge);
  vec2$7.rotate90cw(worldTangent, worldEdgeUnit);
  rotate$1(worldNormal, yAxis$2, planeAngle);
  verts[0] = worldVertex0;
  verts[1] = worldVertex1;
  for (var i = 0; i < verts.length; i++) {
    var v2 = verts[i];
    sub$1(dist, v2, planeOffset);
    var d = dot$1(dist, worldNormal);
    if (d < 0) {
      if (justTest) {
        return 1;
      }
      var c = this.createContactEquation(planeBody, lineBody, planeShape, lineShape);
      numContacts++;
      copy$2(c.normalA, worldNormal);
      normalize(c.normalA, c.normalA);
      scale(dist, worldNormal, d);
      sub$1(c.contactPointA, v2, dist);
      sub$1(c.contactPointA, c.contactPointA, planeBody.position);
      sub$1(c.contactPointB, v2, lineOffset);
      add$1(c.contactPointB, c.contactPointB, lineOffset);
      sub$1(c.contactPointB, c.contactPointB, lineBody.position);
      this.contactEquations.push(c);
      if (!this.enableFrictionReduction) {
        if (this.enableFriction) {
          this.frictionEquations.push(this.createFrictionFromContact(c));
        }
      }
    }
  }
  if (justTest) {
    return 0;
  }
  if (!this.enableFrictionReduction) {
    if (numContacts && this.enableFriction) {
      this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
    }
  }
  return numContacts;
};
Narrowphase$1.prototype[Shape$3.PARTICLE | Shape$3.CAPSULE] = Narrowphase$1.prototype.particleCapsule = function(particleBody, particleShape, particlePosition, particleAngle, capsuleBody, capsuleShape, capsulePosition, capsuleAngle, justTest) {
  return this.circleLine(particleBody, particleShape, particlePosition, particleAngle, capsuleBody, capsuleShape, capsulePosition, capsuleAngle, justTest, capsuleShape.radius, 0);
};
Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.LINE] = Narrowphase$1.prototype.circleLine = function(circleBody, circleShape, circleOffset, circleAngle, lineBody, lineShape, lineOffset, lineAngle, justTest, lineRadius, circleRadius) {
  var lineRadius = lineRadius || 0, circleRadius = circleRadius !== void 0 ? circleRadius : circleShape.radius, orthoDist = tmp1, lineToCircleOrthoUnit = tmp2, projectedPoint = tmp3, centerDist = tmp4, worldTangent = tmp5, worldEdge = tmp6, worldEdgeUnit = tmp7, worldVertex0 = tmp8, worldVertex1 = tmp9, worldVertex01 = tmp10, worldVertex11 = tmp11, dist = tmp12, lineToCircle = tmp13, lineEndToLineRadius = tmp14, verts = tmpArray$1;
  var halfLineLength = lineShape.length / 2;
  vec2$7.set(worldVertex0, -halfLineLength, 0);
  vec2$7.set(worldVertex1, halfLineLength, 0);
  vec2$7.toGlobalFrame(worldVertex01, worldVertex0, lineOffset, lineAngle);
  vec2$7.toGlobalFrame(worldVertex11, worldVertex1, lineOffset, lineAngle);
  copy$2(worldVertex0, worldVertex01);
  copy$2(worldVertex1, worldVertex11);
  sub$1(worldEdge, worldVertex1, worldVertex0);
  normalize(worldEdgeUnit, worldEdge);
  vec2$7.rotate90cw(worldTangent, worldEdgeUnit);
  sub$1(dist, circleOffset, worldVertex0);
  var d = dot$1(dist, worldTangent);
  sub$1(centerDist, worldVertex0, lineOffset);
  sub$1(lineToCircle, circleOffset, lineOffset);
  var radiusSum = circleRadius + lineRadius;
  if (Math.abs(d) < radiusSum) {
    scale(orthoDist, worldTangent, d);
    sub$1(projectedPoint, circleOffset, orthoDist);
    scale(lineToCircleOrthoUnit, worldTangent, dot$1(worldTangent, lineToCircle));
    normalize(lineToCircleOrthoUnit, lineToCircleOrthoUnit);
    scale(lineToCircleOrthoUnit, lineToCircleOrthoUnit, lineRadius);
    add$1(projectedPoint, projectedPoint, lineToCircleOrthoUnit);
    var pos = dot$1(worldEdgeUnit, projectedPoint);
    var pos0 = dot$1(worldEdgeUnit, worldVertex0);
    var pos1 = dot$1(worldEdgeUnit, worldVertex1);
    if (pos > pos0 && pos < pos1) {
      if (justTest) {
        return 1;
      }
      var c = this.createContactEquation(circleBody, lineBody, circleShape, lineShape);
      scale(c.normalA, orthoDist, -1);
      normalize(c.normalA, c.normalA);
      scale(c.contactPointA, c.normalA, circleRadius);
      add$1(c.contactPointA, c.contactPointA, circleOffset);
      sub$1(c.contactPointA, c.contactPointA, circleBody.position);
      sub$1(c.contactPointB, projectedPoint, lineOffset);
      add$1(c.contactPointB, c.contactPointB, lineOffset);
      sub$1(c.contactPointB, c.contactPointB, lineBody.position);
      this.contactEquations.push(c);
      if (this.enableFriction) {
        this.frictionEquations.push(this.createFrictionFromContact(c));
      }
      return 1;
    }
  }
  verts[0] = worldVertex0;
  verts[1] = worldVertex1;
  for (var i = 0; i < verts.length; i++) {
    var v2 = verts[i];
    sub$1(dist, v2, circleOffset);
    if (squaredLength(dist) < Math.pow(radiusSum, 2)) {
      if (justTest) {
        return 1;
      }
      var c = this.createContactEquation(circleBody, lineBody, circleShape, lineShape);
      copy$2(c.normalA, dist);
      normalize(c.normalA, c.normalA);
      scale(c.contactPointA, c.normalA, circleRadius);
      add$1(c.contactPointA, c.contactPointA, circleOffset);
      sub$1(c.contactPointA, c.contactPointA, circleBody.position);
      sub$1(c.contactPointB, v2, lineOffset);
      scale(lineEndToLineRadius, c.normalA, -lineRadius);
      add$1(c.contactPointB, c.contactPointB, lineEndToLineRadius);
      add$1(c.contactPointB, c.contactPointB, lineOffset);
      sub$1(c.contactPointB, c.contactPointB, lineBody.position);
      this.contactEquations.push(c);
      if (this.enableFriction) {
        this.frictionEquations.push(this.createFrictionFromContact(c));
      }
      return 1;
    }
  }
  return 0;
};
Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.CAPSULE] = Narrowphase$1.prototype.circleCapsule = function(bi, si, xi, ai, bj, sj, xj, aj, justTest) {
  return this.circleLine(bi, si, xi, ai, bj, sj, xj, aj, justTest, sj.radius);
};
Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.CONVEX] = Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.BOX] = Narrowphase$1.prototype.circleConvex = function(circleBody, circleShape, circleOffset, circleAngle, convexBody, convexShape, convexOffset, convexAngle, justTest, circleRadius) {
  var circleRadius = circleRadius !== void 0 ? circleRadius : circleShape.radius;
  var worldVertex0 = tmp1, worldVertex1 = tmp2, edge = tmp3, edgeUnit = tmp4, normal = tmp5, zero = tmp6, localCirclePosition = tmp7, r2 = tmp8, dist = tmp10, worldVertex = tmp11, closestEdgeProjectedPoint = tmp13, candidate = tmp14, candidateDist = tmp15, found = -1, minCandidateDistance = Number.MAX_VALUE;
  vec2$7.set(zero, 0, 0);
  vec2$7.toLocalFrame(localCirclePosition, circleOffset, convexOffset, convexAngle);
  var vertices = convexShape.vertices;
  var normals = convexShape.normals;
  var numVertices = vertices.length;
  var normalIndex = -1;
  var separation = -Number.MAX_VALUE;
  var radius = convexShape.boundingRadius + circleRadius;
  for (var i = 0; i < numVertices; i++) {
    sub$1(r2, localCirclePosition, vertices[i]);
    var s2 = dot$1(normals[i], r2);
    if (s2 > radius) {
      return 0;
    }
    if (s2 > separation) {
      separation = s2;
      normalIndex = i;
    }
  }
  for (var i = normalIndex + numVertices - 1; i < normalIndex + numVertices + 2; i++) {
    var v02 = vertices[i % numVertices], n2 = normals[i % numVertices];
    scale(candidate, n2, -circleRadius);
    add$1(candidate, candidate, localCirclePosition);
    if (pointInConvexLocal(candidate, convexShape)) {
      sub$1(candidateDist, v02, candidate);
      var candidateDistance = Math.abs(dot$1(candidateDist, n2));
      if (candidateDistance < minCandidateDistance) {
        minCandidateDistance = candidateDistance;
        found = i;
      }
    }
  }
  if (found !== -1) {
    if (justTest) {
      return 1;
    }
    var v02 = vertices[found % numVertices], v1 = vertices[(found + 1) % numVertices];
    vec2$7.toGlobalFrame(worldVertex0, v02, convexOffset, convexAngle);
    vec2$7.toGlobalFrame(worldVertex1, v1, convexOffset, convexAngle);
    sub$1(edge, worldVertex1, worldVertex0);
    normalize(edgeUnit, edge);
    vec2$7.rotate90cw(normal, edgeUnit);
    scale(candidate, normal, -circleRadius);
    add$1(candidate, candidate, circleOffset);
    scale(closestEdgeProjectedPoint, normal, minCandidateDistance);
    add$1(closestEdgeProjectedPoint, closestEdgeProjectedPoint, candidate);
    var c = this.createContactEquation(circleBody, convexBody, circleShape, convexShape);
    sub$1(c.normalA, candidate, circleOffset);
    normalize(c.normalA, c.normalA);
    scale(c.contactPointA, c.normalA, circleRadius);
    add$1(c.contactPointA, c.contactPointA, circleOffset);
    sub$1(c.contactPointA, c.contactPointA, circleBody.position);
    sub$1(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
    add$1(c.contactPointB, c.contactPointB, convexOffset);
    sub$1(c.contactPointB, c.contactPointB, convexBody.position);
    this.contactEquations.push(c);
    if (this.enableFriction) {
      this.frictionEquations.push(this.createFrictionFromContact(c));
    }
    return 1;
  }
  if (circleRadius > 0 && normalIndex !== -1) {
    for (var i = normalIndex + numVertices; i < normalIndex + numVertices + 2; i++) {
      var localVertex = vertices[i % numVertices];
      sub$1(dist, localVertex, localCirclePosition);
      if (squaredLength(dist) < circleRadius * circleRadius) {
        if (justTest) {
          return 1;
        }
        vec2$7.toGlobalFrame(worldVertex, localVertex, convexOffset, convexAngle);
        sub$1(dist, worldVertex, circleOffset);
        var c = this.createContactEquation(circleBody, convexBody, circleShape, convexShape);
        copy$2(c.normalA, dist);
        normalize(c.normalA, c.normalA);
        scale(c.contactPointA, c.normalA, circleRadius);
        add$1(c.contactPointA, c.contactPointA, circleOffset);
        sub$1(c.contactPointA, c.contactPointA, circleBody.position);
        sub$1(c.contactPointB, worldVertex, convexOffset);
        add$1(c.contactPointB, c.contactPointB, convexOffset);
        sub$1(c.contactPointB, c.contactPointB, convexBody.position);
        this.contactEquations.push(c);
        if (this.enableFriction) {
          this.frictionEquations.push(this.createFrictionFromContact(c));
        }
        return 1;
      }
    }
  }
  return 0;
};
var pic_localPoint = createVec2();
var pic_r0 = createVec2();
var pic_r1 = createVec2();
function pointInConvex(worldPoint, convexShape, convexOffset, convexAngle) {
  var localPoint = pic_localPoint, r0 = pic_r0, r1 = pic_r1, verts = convexShape.vertices, lastCross = null;
  vec2$7.toLocalFrame(localPoint, worldPoint, convexOffset, convexAngle);
  for (var i = 0, numVerts = verts.length; i !== numVerts + 1; i++) {
    var v02 = verts[i % numVerts], v1 = verts[(i + 1) % numVerts];
    sub$1(r0, v02, localPoint);
    sub$1(r1, v1, localPoint);
    var cross = vec2$7.crossLength(r0, r1);
    if (lastCross === null) {
      lastCross = cross;
    }
    if (cross * lastCross < 0) {
      return false;
    }
    lastCross = cross;
  }
  return true;
}
function pointInConvexLocal(localPoint, convexShape) {
  var r0 = pic_r0, r1 = pic_r1, verts = convexShape.vertices, lastCross = null, numVerts = verts.length;
  for (var i = 0; i < numVerts + 1; i++) {
    var v02 = verts[i % numVerts], v1 = verts[(i + 1) % numVerts];
    sub$1(r0, v02, localPoint);
    sub$1(r1, v1, localPoint);
    var cross = vec2$7.crossLength(r0, r1);
    if (lastCross === null) {
      lastCross = cross;
    }
    if (cross * lastCross < 0) {
      return false;
    }
    lastCross = cross;
  }
  return true;
}
Narrowphase$1.prototype[Shape$3.PARTICLE | Shape$3.CONVEX] = Narrowphase$1.prototype[Shape$3.PARTICLE | Shape$3.BOX] = Narrowphase$1.prototype.particleConvex = function(particleBody, particleShape, particleOffset, particleAngle, convexBody, convexShape, convexOffset, convexAngle, justTest) {
  var worldVertex0 = tmp1, worldVertex1 = tmp2, worldEdge = tmp3, worldEdgeUnit = tmp4, worldTangent = tmp5, centerDist = tmp6, convexToparticle = tmp7, closestEdgeProjectedPoint = tmp13, candidateDist = tmp14, minEdgeNormal = tmp15, minCandidateDistance = Number.MAX_VALUE, found = false, verts = convexShape.vertices;
  if (!pointInConvex(particleOffset, convexShape, convexOffset, convexAngle)) {
    return 0;
  }
  if (justTest) {
    return 1;
  }
  for (var i = 0, numVerts = verts.length; i !== numVerts + 1; i++) {
    var v02 = verts[i % numVerts], v1 = verts[(i + 1) % numVerts];
    rotate$1(worldVertex0, v02, convexAngle);
    rotate$1(worldVertex1, v1, convexAngle);
    add$1(worldVertex0, worldVertex0, convexOffset);
    add$1(worldVertex1, worldVertex1, convexOffset);
    sub$1(worldEdge, worldVertex1, worldVertex0);
    normalize(worldEdgeUnit, worldEdge);
    vec2$7.rotate90cw(worldTangent, worldEdgeUnit);
    sub$1(centerDist, worldVertex0, convexOffset);
    sub$1(convexToparticle, particleOffset, convexOffset);
    sub$1(candidateDist, worldVertex0, particleOffset);
    var candidateDistance = Math.abs(dot$1(candidateDist, worldTangent));
    if (candidateDistance < minCandidateDistance) {
      minCandidateDistance = candidateDistance;
      scale(closestEdgeProjectedPoint, worldTangent, candidateDistance);
      add$1(closestEdgeProjectedPoint, closestEdgeProjectedPoint, particleOffset);
      copy$2(minEdgeNormal, worldTangent);
      found = true;
    }
  }
  if (found) {
    var c = this.createContactEquation(particleBody, convexBody, particleShape, convexShape);
    scale(c.normalA, minEdgeNormal, -1);
    normalize(c.normalA, c.normalA);
    vec2$7.set(c.contactPointA, 0, 0);
    add$1(c.contactPointA, c.contactPointA, particleOffset);
    sub$1(c.contactPointA, c.contactPointA, particleBody.position);
    sub$1(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
    add$1(c.contactPointB, c.contactPointB, convexOffset);
    sub$1(c.contactPointB, c.contactPointB, convexBody.position);
    this.contactEquations.push(c);
    if (this.enableFriction) {
      this.frictionEquations.push(this.createFrictionFromContact(c));
    }
    return 1;
  }
  return 0;
};
Narrowphase$1.prototype[Shape$3.CIRCLE] = Narrowphase$1.prototype.circleCircle = function(bodyA, shapeA, offsetA, angleA, bodyB, shapeB, offsetB, angleB, justTest, radiusA, radiusB) {
  var dist = tmp1, radiusA = radiusA || shapeA.radius, radiusB = radiusB || shapeB.radius;
  sub$1(dist, offsetA, offsetB);
  var r2 = radiusA + radiusB;
  if (squaredLength(dist) > r2 * r2) {
    return 0;
  }
  if (justTest) {
    return 1;
  }
  var c = this.createContactEquation(bodyA, bodyB, shapeA, shapeB);
  var cpA = c.contactPointA;
  var cpB = c.contactPointB;
  var normalA = c.normalA;
  sub$1(normalA, offsetB, offsetA);
  normalize(normalA, normalA);
  scale(cpA, normalA, radiusA);
  scale(cpB, normalA, -radiusB);
  addSub(cpA, cpA, offsetA, bodyA.position);
  addSub(cpB, cpB, offsetB, bodyB.position);
  this.contactEquations.push(c);
  if (this.enableFriction) {
    this.frictionEquations.push(this.createFrictionFromContact(c));
  }
  return 1;
};
function addSub(out, a, b, c) {
  out[0] = a[0] + b[0] - c[0];
  out[1] = a[1] + b[1] - c[1];
}
Narrowphase$1.prototype[Shape$3.PLANE | Shape$3.CONVEX] = Narrowphase$1.prototype[Shape$3.PLANE | Shape$3.BOX] = Narrowphase$1.prototype.planeConvex = function(planeBody, planeShape, planeOffset, planeAngle, convexBody, convexShape, convexOffset, convexAngle, justTest) {
  var worldVertex = tmp1, worldNormal = tmp2, dist = tmp3, localPlaneOffset = tmp4, localPlaneNormal = tmp5, localDist = tmp6;
  var numReported = 0;
  rotate$1(worldNormal, yAxis$2, planeAngle);
  vec2$7.vectorToLocalFrame(localPlaneNormal, worldNormal, convexAngle);
  vec2$7.toLocalFrame(localPlaneOffset, planeOffset, convexOffset, convexAngle);
  var vertices = convexShape.vertices;
  for (var i = 0, numVerts = vertices.length; i !== numVerts; i++) {
    var v2 = vertices[i];
    sub$1(localDist, v2, localPlaneOffset);
    if (dot$1(localDist, localPlaneNormal) <= 0) {
      if (justTest) {
        return 1;
      }
      vec2$7.toGlobalFrame(worldVertex, v2, convexOffset, convexAngle);
      sub$1(dist, worldVertex, planeOffset);
      numReported++;
      var c = this.createContactEquation(planeBody, convexBody, planeShape, convexShape);
      sub$1(dist, worldVertex, planeOffset);
      copy$2(c.normalA, worldNormal);
      var d = dot$1(dist, c.normalA);
      scale(dist, c.normalA, d);
      sub$1(c.contactPointB, worldVertex, convexBody.position);
      sub$1(c.contactPointA, worldVertex, dist);
      sub$1(c.contactPointA, c.contactPointA, planeBody.position);
      this.contactEquations.push(c);
      if (!this.enableFrictionReduction) {
        if (this.enableFriction) {
          this.frictionEquations.push(this.createFrictionFromContact(c));
        }
      }
    }
  }
  if (this.enableFrictionReduction) {
    if (this.enableFriction && numReported) {
      this.frictionEquations.push(this.createFrictionFromAverage(numReported));
    }
  }
  return numReported;
};
Narrowphase$1.prototype[Shape$3.PARTICLE | Shape$3.PLANE] = Narrowphase$1.prototype.particlePlane = function(particleBody, particleShape, particleOffset, particleAngle, planeBody, planeShape, planeOffset, planeAngle, justTest) {
  var dist = tmp1, worldNormal = tmp2;
  planeAngle = planeAngle || 0;
  sub$1(dist, particleOffset, planeOffset);
  rotate$1(worldNormal, yAxis$2, planeAngle);
  var d = dot$1(dist, worldNormal);
  if (d > 0) {
    return 0;
  }
  if (justTest) {
    return 1;
  }
  var c = this.createContactEquation(planeBody, particleBody, planeShape, particleShape);
  copy$2(c.normalA, worldNormal);
  scale(dist, c.normalA, d);
  sub$1(c.contactPointA, particleOffset, dist);
  sub$1(c.contactPointA, c.contactPointA, planeBody.position);
  sub$1(c.contactPointB, particleOffset, particleBody.position);
  this.contactEquations.push(c);
  if (this.enableFriction) {
    this.frictionEquations.push(this.createFrictionFromContact(c));
  }
  return 1;
};
Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.PARTICLE] = Narrowphase$1.prototype.circleParticle = function(circleBody, circleShape, circleOffset, circleAngle, particleBody, particleShape, particleOffset, particleAngle, justTest) {
  var dist = tmp1;
  var circleRadius = circleShape.radius;
  sub$1(dist, particleOffset, circleOffset);
  if (squaredLength(dist) > circleRadius * circleRadius) {
    return 0;
  }
  if (justTest) {
    return 1;
  }
  var c = this.createContactEquation(circleBody, particleBody, circleShape, particleShape);
  var normalA = c.normalA;
  var contactPointA = c.contactPointA;
  var contactPointB = c.contactPointB;
  copy$2(normalA, dist);
  normalize(normalA, normalA);
  scale(contactPointA, normalA, circleRadius);
  add$1(contactPointA, contactPointA, circleOffset);
  sub$1(contactPointA, contactPointA, circleBody.position);
  sub$1(contactPointB, particleOffset, particleBody.position);
  this.contactEquations.push(c);
  if (this.enableFriction) {
    this.frictionEquations.push(this.createFrictionFromContact(c));
  }
  return 1;
};
var planeCapsule_tmpCircle = new Circle({
  radius: 1
});
var planeCapsule_tmp1 = createVec2();
var planeCapsule_tmp2 = createVec2();
Narrowphase$1.prototype[Shape$3.PLANE | Shape$3.CAPSULE] = Narrowphase$1.prototype.planeCapsule = function(planeBody, planeShape, planeOffset, planeAngle, capsuleBody, capsuleShape, capsuleOffset, capsuleAngle, justTest) {
  var end1 = planeCapsule_tmp1, end2 = planeCapsule_tmp2, circle = planeCapsule_tmpCircle, halfLength = capsuleShape.length / 2;
  vec2$7.set(end1, -halfLength, 0);
  vec2$7.set(end2, halfLength, 0);
  vec2$7.toGlobalFrame(end1, end1, capsuleOffset, capsuleAngle);
  vec2$7.toGlobalFrame(end2, end2, capsuleOffset, capsuleAngle);
  circle.radius = capsuleShape.radius;
  var enableFrictionBefore;
  if (this.enableFrictionReduction) {
    enableFrictionBefore = this.enableFriction;
    this.enableFriction = false;
  }
  var numContacts1 = this.circlePlane(capsuleBody, circle, end1, 0, planeBody, planeShape, planeOffset, planeAngle, justTest), numContacts2 = this.circlePlane(capsuleBody, circle, end2, 0, planeBody, planeShape, planeOffset, planeAngle, justTest);
  if (this.enableFrictionReduction) {
    this.enableFriction = enableFrictionBefore;
  }
  if (justTest) {
    return numContacts1 + numContacts2;
  } else {
    var numTotal = numContacts1 + numContacts2;
    if (this.enableFrictionReduction) {
      if (numTotal) {
        this.frictionEquations.push(this.createFrictionFromAverage(numTotal));
      }
    }
    return numTotal;
  }
};
Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.PLANE] = Narrowphase$1.prototype.circlePlane = function(circleBody, circleShape, circleOffset, circleAngle, planeBody, planeShape, planeOffset, planeAngle, justTest) {
  var circleRadius = circleShape.radius;
  var planeToCircle = tmp1, worldNormal = tmp2, temp2 = tmp3;
  sub$1(planeToCircle, circleOffset, planeOffset);
  rotate$1(worldNormal, yAxis$2, planeAngle);
  var d = dot$1(worldNormal, planeToCircle);
  if (d > circleRadius) {
    return 0;
  }
  if (justTest) {
    return 1;
  }
  var contact = this.createContactEquation(planeBody, circleBody, planeShape, circleShape);
  copy$2(contact.normalA, worldNormal);
  var cpB = contact.contactPointB;
  scale(cpB, contact.normalA, -circleRadius);
  add$1(cpB, cpB, circleOffset);
  sub$1(cpB, cpB, circleBody.position);
  var cpA = contact.contactPointA;
  scale(temp2, contact.normalA, d);
  sub$1(cpA, planeToCircle, temp2);
  add$1(cpA, cpA, planeOffset);
  sub$1(cpA, cpA, planeBody.position);
  this.contactEquations.push(contact);
  if (this.enableFriction) {
    this.frictionEquations.push(this.createFrictionFromContact(contact));
  }
  return 1;
};
var findMaxSeparation_n = vec2$7.create();
var findMaxSeparation_v1 = vec2$7.create();
var findMaxSeparation_tmp = vec2$7.create();
var findMaxSeparation_tmp2 = vec2$7.create();
function findMaxSeparation(maxSeparationOut, poly1, position1, angle1, poly2, position2, angle2) {
  var count1 = poly1.vertices.length;
  var count2 = poly2.vertices.length;
  var n1s = poly1.normals;
  var v1s = poly1.vertices;
  var v2s = poly2.vertices;
  var n2 = findMaxSeparation_n;
  var v1 = findMaxSeparation_v1;
  var tmp16 = findMaxSeparation_tmp;
  var tmp22 = findMaxSeparation_tmp2;
  var angle = angle1 - angle2;
  var bestIndex = 0;
  var maxSeparation = -Number.MAX_VALUE;
  for (var i = 0; i < count1; ++i) {
    vec2$7.rotate(n2, n1s[i], angle);
    vec2$7.toGlobalFrame(tmp22, v1s[i], position1, angle1);
    vec2$7.toLocalFrame(v1, tmp22, position2, angle2);
    var si = Number.MAX_VALUE;
    for (var j = 0; j < count2; ++j) {
      vec2$7.subtract(tmp16, v2s[j], v1);
      var sij = vec2$7.dot(n2, tmp16);
      if (sij < si) {
        si = sij;
      }
    }
    if (si > maxSeparation) {
      maxSeparation = si;
      bestIndex = i;
    }
  }
  maxSeparationOut[0] = maxSeparation;
  return bestIndex;
}
var findIncidentEdge_normal1 = vec2$7.create();
function findIncidentEdge(clipVerticesOut, poly1, position1, angle1, edge1, poly2, position2, angle2) {
  var normals1 = poly1.normals;
  var count2 = poly2.vertices.length;
  var vertices2 = poly2.vertices;
  var normals2 = poly2.normals;
  var normal1 = findIncidentEdge_normal1;
  vec2$7.rotate(normal1, normals1[edge1], angle1 - angle2);
  var index = 0;
  var minDot = Number.MAX_VALUE;
  for (var i = 0; i < count2; ++i) {
    var dot2 = vec2$7.dot(normal1, normals2[i]);
    if (dot2 < minDot) {
      minDot = dot2;
      index = i;
    }
  }
  var i1 = index;
  var i2 = i1 + 1 < count2 ? i1 + 1 : 0;
  vec2$7.toGlobalFrame(clipVerticesOut[0], vertices2[i1], position2, angle2);
  vec2$7.toGlobalFrame(clipVerticesOut[1], vertices2[i2], position2, angle2);
}
var collidePolygons_tempVec = vec2$7.create();
var collidePolygons_tmpVec = vec2$7.create();
var collidePolygons_localTangent = vec2$7.create();
var collidePolygons_localNormal = vec2$7.create();
var collidePolygons_planePoint = vec2$7.create();
var collidePolygons_tangent = vec2$7.create();
var collidePolygons_normal = vec2$7.create();
var collidePolygons_negativeTangent = vec2$7.create();
var collidePolygons_v11 = vec2$7.create();
var collidePolygons_v12 = vec2$7.create();
var collidePolygons_dist = vec2$7.create();
var collidePolygons_clipPoints1 = [vec2$7.create(), vec2$7.create()];
var collidePolygons_clipPoints2 = [vec2$7.create(), vec2$7.create()];
var collidePolygons_incidentEdge = [vec2$7.create(), vec2$7.create()];
var maxManifoldPoints = 2;
Narrowphase$1.prototype[Shape$3.CONVEX] = Narrowphase$1.prototype[Shape$3.CONVEX | Shape$3.BOX] = Narrowphase$1.prototype[Shape$3.BOX] = Narrowphase$1.prototype.convexConvex = function(bodyA, polyA, positionA, angleA, bodyB, polyB, positionB, angleB, justTest) {
  var totalRadius = 0;
  var dist = collidePolygons_dist;
  var tempVec = collidePolygons_tempVec;
  var tmpVec3 = collidePolygons_tmpVec;
  var edgeA = findMaxSeparation(tempVec, polyA, positionA, angleA, polyB, positionB, angleB);
  var separationA = tempVec[0];
  if (separationA > totalRadius) {
    return 0;
  }
  var edgeB = findMaxSeparation(tmpVec3, polyB, positionB, angleB, polyA, positionA, angleA);
  var separationB = tmpVec3[0];
  if (separationB > totalRadius) {
    return 0;
  }
  var poly1;
  var poly2;
  var position1;
  var position2;
  var angle1;
  var angle2;
  var body1;
  var body2;
  var edge1;
  if (separationB > separationA) {
    poly1 = polyB;
    poly2 = polyA;
    body1 = bodyB;
    body2 = bodyA;
    position1 = positionB;
    angle1 = angleB;
    position2 = positionA;
    angle2 = angleA;
    edge1 = edgeB;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    body1 = bodyA;
    body2 = bodyB;
    position1 = positionA;
    angle1 = angleA;
    position2 = positionB;
    angle2 = angleB;
    edge1 = edgeA;
  }
  var incidentEdge = collidePolygons_incidentEdge;
  findIncidentEdge(incidentEdge, poly1, position1, angle1, edge1, poly2, position2, angle2);
  var count1 = poly1.vertices.length;
  var vertices1 = poly1.vertices;
  var iv1 = edge1;
  var iv2 = edge1 + 1 < count1 ? edge1 + 1 : 0;
  var v11 = collidePolygons_v11;
  var v12 = collidePolygons_v12;
  vec2$7.copy(v11, vertices1[iv1]);
  vec2$7.copy(v12, vertices1[iv2]);
  var localTangent = collidePolygons_localTangent;
  vec2$7.subtract(localTangent, v12, v11);
  vec2$7.normalize(localTangent, localTangent);
  var localNormal = collidePolygons_localNormal;
  vec2$7.crossVZ(localNormal, localTangent, 1);
  var planePoint = collidePolygons_planePoint;
  vec2$7.add(planePoint, v11, v12);
  vec2$7.scale(planePoint, planePoint, 0.5);
  var tangent = collidePolygons_tangent;
  vec2$7.rotate(tangent, localTangent, angle1);
  var normal = collidePolygons_normal;
  vec2$7.crossVZ(normal, tangent, 1);
  vec2$7.toGlobalFrame(v11, v11, position1, angle1);
  vec2$7.toGlobalFrame(v12, v12, position1, angle1);
  var frontOffset = vec2$7.dot(normal, v11);
  var sideOffset1 = -vec2$7.dot(tangent, v11) + totalRadius;
  var sideOffset2 = vec2$7.dot(tangent, v12) + totalRadius;
  var clipPoints1 = collidePolygons_clipPoints1;
  var clipPoints2 = collidePolygons_clipPoints2;
  var np = 0;
  var negativeTangent = collidePolygons_negativeTangent;
  vec2$7.scale(negativeTangent, tangent, -1);
  np = clipSegmentToLine(clipPoints1, incidentEdge, negativeTangent, sideOffset1);
  if (np < 2) {
    return 0;
  }
  np = clipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2);
  if (np < 2) {
    return 0;
  }
  var pointCount = 0;
  for (var i = 0; i < maxManifoldPoints; ++i) {
    var separation = vec2$7.dot(normal, clipPoints2[i]) - frontOffset;
    if (separation <= totalRadius) {
      if (justTest) {
        return 1;
      }
      ++pointCount;
      var c = this.createContactEquation(body1, body2, poly1, poly2);
      vec2$7.copy(c.normalA, normal);
      vec2$7.copy(c.contactPointB, clipPoints2[i]);
      sub$1(c.contactPointB, c.contactPointB, body2.position);
      vec2$7.scale(dist, normal, -separation);
      vec2$7.add(c.contactPointA, clipPoints2[i], dist);
      sub$1(c.contactPointA, c.contactPointA, body1.position);
      this.contactEquations.push(c);
      if (this.enableFriction && !this.enableFrictionReduction) {
        this.frictionEquations.push(this.createFrictionFromContact(c));
      }
    }
  }
  if (pointCount && this.enableFrictionReduction && this.enableFriction) {
    this.frictionEquations.push(this.createFrictionFromAverage(pointCount));
  }
  return pointCount;
};
function clipSegmentToLine(vOut, vIn, normal, offset) {
  var numOut = 0;
  var distance0 = vec2$7.dot(normal, vIn[0]) - offset;
  var distance1 = vec2$7.dot(normal, vIn[1]) - offset;
  if (distance0 <= 0) {
    vec2$7.copy(vOut[numOut++], vIn[0]);
  }
  if (distance1 <= 0) {
    vec2$7.copy(vOut[numOut++], vIn[1]);
  }
  if (distance0 * distance1 < 0) {
    var interp = distance0 / (distance0 - distance1);
    var v2 = vOut[numOut];
    vec2$7.subtract(v2, vIn[1], vIn[0]);
    vec2$7.scale(v2, v2, interp);
    vec2$7.add(v2, v2, vIn[0]);
    ++numOut;
  }
  return numOut;
}
var circleHeightfield_candidate = createVec2();
var circleHeightfield_dist = createVec2();
var circleHeightfield_v0 = createVec2();
var circleHeightfield_v1 = createVec2();
var circleHeightfield_minCandidate = createVec2();
var circleHeightfield_worldNormal = createVec2();
var circleHeightfield_minCandidateNormal = createVec2();
Narrowphase$1.prototype[Shape$3.CIRCLE | Shape$3.HEIGHTFIELD] = Narrowphase$1.prototype.circleHeightfield = function(circleBody, circleShape, circlePos, circleAngle, hfBody, hfShape, hfPos, hfAngle, justTest, radius) {
  var data = hfShape.heights, radius = radius || circleShape.radius, w = hfShape.elementWidth, dist = circleHeightfield_dist, candidate = circleHeightfield_candidate, minCandidate = circleHeightfield_minCandidate, minCandidateNormal = circleHeightfield_minCandidateNormal, worldNormal = circleHeightfield_worldNormal, v02 = circleHeightfield_v0, v1 = circleHeightfield_v1;
  var idxA = Math.floor((circlePos[0] - radius - hfPos[0]) / w), idxB = Math.ceil((circlePos[0] + radius - hfPos[0]) / w);
  if (idxA < 0) {
    idxA = 0;
  }
  if (idxB >= data.length) {
    idxB = data.length - 1;
  }
  var max = data[idxA], min = data[idxB];
  for (var i = idxA; i < idxB; i++) {
    if (data[i] < min) {
      min = data[i];
    }
    if (data[i] > max) {
      max = data[i];
    }
  }
  if (circlePos[1] - radius > max) {
    return 0;
  }
  var found = false;
  for (var i = idxA; i < idxB; i++) {
    vec2$7.set(v02, i * w, data[i]);
    vec2$7.set(v1, (i + 1) * w, data[i + 1]);
    add$1(v02, v02, hfPos);
    add$1(v1, v1, hfPos);
    sub$1(worldNormal, v1, v02);
    rotate$1(worldNormal, worldNormal, Math.PI / 2);
    normalize(worldNormal, worldNormal);
    scale(candidate, worldNormal, -radius);
    add$1(candidate, candidate, circlePos);
    sub$1(dist, candidate, v02);
    var d = dot$1(dist, worldNormal);
    if (candidate[0] >= v02[0] && candidate[0] < v1[0] && d <= 0) {
      if (justTest) {
        return 1;
      }
      found = true;
      scale(dist, worldNormal, -d);
      add$1(minCandidate, candidate, dist);
      copy$2(minCandidateNormal, worldNormal);
      var c = this.createContactEquation(hfBody, circleBody, hfShape, circleShape);
      copy$2(c.normalA, minCandidateNormal);
      scale(c.contactPointB, c.normalA, -radius);
      add$1(c.contactPointB, c.contactPointB, circlePos);
      sub$1(c.contactPointB, c.contactPointB, circleBody.position);
      copy$2(c.contactPointA, minCandidate);
      sub$1(c.contactPointA, c.contactPointA, hfBody.position);
      this.contactEquations.push(c);
      if (this.enableFriction) {
        this.frictionEquations.push(this.createFrictionFromContact(c));
      }
    }
  }
  found = false;
  if (radius > 0) {
    for (var i = idxA; i <= idxB; i++) {
      vec2$7.set(v02, i * w, data[i]);
      add$1(v02, v02, hfPos);
      sub$1(dist, circlePos, v02);
      if (squaredLength(dist) < Math.pow(radius, 2)) {
        if (justTest) {
          return 1;
        }
        found = true;
        var c = this.createContactEquation(hfBody, circleBody, hfShape, circleShape);
        copy$2(c.normalA, dist);
        normalize(c.normalA, c.normalA);
        scale(c.contactPointB, c.normalA, -radius);
        add$1(c.contactPointB, c.contactPointB, circlePos);
        sub$1(c.contactPointB, c.contactPointB, circleBody.position);
        sub$1(c.contactPointA, v02, hfPos);
        add$1(c.contactPointA, c.contactPointA, hfPos);
        sub$1(c.contactPointA, c.contactPointA, hfBody.position);
        this.contactEquations.push(c);
        if (this.enableFriction) {
          this.frictionEquations.push(this.createFrictionFromContact(c));
        }
      }
    }
  }
  if (found) {
    return 1;
  }
  return 0;
};
var convexHeightfield_v0 = createVec2();
var convexHeightfield_v1 = createVec2();
var convexHeightfield_tilePos = createVec2();
var convexHeightfield_tempConvexShape = new Convex({
  vertices: [createVec2(), createVec2(), createVec2(), createVec2()]
});
Narrowphase$1.prototype[Shape$3.BOX | Shape$3.HEIGHTFIELD] = Narrowphase$1.prototype[Shape$3.CONVEX | Shape$3.HEIGHTFIELD] = Narrowphase$1.prototype.convexHeightfield = function(convexBody, convexShape, convexPos, convexAngle, hfBody, hfShape, hfPos, hfAngle, justTest) {
  var data = hfShape.heights, w = hfShape.elementWidth, v02 = convexHeightfield_v0, v1 = convexHeightfield_v1, tilePos = convexHeightfield_tilePos, tileConvex = convexHeightfield_tempConvexShape;
  var idxA = Math.floor((convexBody.aabb.lowerBound[0] - hfPos[0]) / w), idxB = Math.ceil((convexBody.aabb.upperBound[0] - hfPos[0]) / w);
  if (idxA < 0) {
    idxA = 0;
  }
  if (idxB >= data.length) {
    idxB = data.length - 1;
  }
  var max = data[idxA], min = data[idxB];
  for (var i = idxA; i < idxB; i++) {
    if (data[i] < min) {
      min = data[i];
    }
    if (data[i] > max) {
      max = data[i];
    }
  }
  if (convexBody.aabb.lowerBound[1] > max) {
    return 0;
  }
  var numContacts = 0;
  for (var i = idxA; i < idxB; i++) {
    vec2$7.set(v02, i * w, data[i]);
    vec2$7.set(v1, (i + 1) * w, data[i + 1]);
    add$1(v02, v02, hfPos);
    add$1(v1, v1, hfPos);
    var tileHeight = 100;
    vec2$7.set(tilePos, (v1[0] + v02[0]) * 0.5, (v1[1] + v02[1] - tileHeight) * 0.5);
    sub$1(tileConvex.vertices[0], v1, tilePos);
    sub$1(tileConvex.vertices[1], v02, tilePos);
    copy$2(tileConvex.vertices[2], tileConvex.vertices[1]);
    copy$2(tileConvex.vertices[3], tileConvex.vertices[0]);
    tileConvex.vertices[2][1] -= tileHeight;
    tileConvex.vertices[3][1] -= tileHeight;
    tileConvex.updateNormals();
    numContacts += this.convexConvex(convexBody, convexShape, convexPos, convexAngle, hfBody, tileConvex, tilePos, 0, justTest);
  }
  return numContacts;
};
var Broadphase$1 = Broadphase_1;
var NaiveBroadphase_1 = NaiveBroadphase;
function NaiveBroadphase() {
  Broadphase$1.call(this, Broadphase$1.NAIVE);
}
NaiveBroadphase.prototype = new Broadphase$1();
NaiveBroadphase.prototype.constructor = NaiveBroadphase;
NaiveBroadphase.prototype.getCollisionPairs = function(world) {
  var bodies = world.bodies, result2 = this.result;
  result2.length = 0;
  for (var i = 0, Ncolliding = bodies.length; i !== Ncolliding; i++) {
    var bi = bodies[i];
    for (var j = 0; j < i; j++) {
      var bj = bodies[j];
      if (Broadphase$1.canCollide(bi, bj) && this.boundingVolumeCheck(bi, bj)) {
        result2.push(bi, bj);
      }
    }
  }
  return result2;
};
NaiveBroadphase.prototype.aabbQuery = function(world, aabb, result2) {
  result2 = result2 || [];
  var bodies = world.bodies;
  for (var i = 0; i < bodies.length; i++) {
    var b = bodies[i];
    if (b.aabbNeedsUpdate) {
      b.updateAABB();
    }
    if (b.aabb.overlaps(aabb)) {
      result2.push(b);
    }
  }
  return result2;
};
var Shape$2 = Shape_1;
var shallowClone = Utils_1.shallowClone;
var copy$1 = vec2$q.exports.copy;
var Particle_1 = Particle;
function Particle(options) {
  options = options ? shallowClone(options) : {};
  options.type = Shape$2.PARTICLE;
  Shape$2.call(this, options);
}
Particle.prototype = new Shape$2();
Particle.prototype.constructor = Particle;
Particle.prototype.computeMomentOfInertia = function() {
  return 0;
};
Particle.prototype.updateBoundingRadius = function() {
  this.boundingRadius = 0;
};
Particle.prototype.computeAABB = function(out, position) {
  copy$1(out.lowerBound, position);
  copy$1(out.upperBound, position);
};
var Shape$1 = Shape_1;
var vec2$6 = vec2$q.exports;
var Utils$2 = Utils_1;
var Plane_1 = Plane;
function Plane(options) {
  options = options ? Utils$2.shallowClone(options) : {};
  options.type = Shape$1.PLANE;
  Shape$1.call(this, options);
}
Plane.prototype = new Shape$1();
Plane.prototype.constructor = Plane;
Plane.prototype.computeMomentOfInertia = function() {
  return 0;
};
Plane.prototype.updateBoundingRadius = function() {
  this.boundingRadius = Number.MAX_VALUE;
};
Plane.prototype.computeAABB = function(out, position, angle) {
  var a = angle % (2 * Math.PI);
  var set = vec2$6.set;
  var max = 1e7;
  var lowerBound = out.lowerBound;
  var upperBound = out.upperBound;
  set(lowerBound, -max, -max);
  set(upperBound, max, max);
  if (a === 0) {
    upperBound[1] = position[1];
  } else if (a === Math.PI / 2) {
    lowerBound[0] = position[0];
  } else if (a === Math.PI) {
    lowerBound[1] = position[1];
  } else if (a === 3 * Math.PI / 2) {
    upperBound[0] = position[0];
  }
};
Plane.prototype.updateArea = function() {
  this.area = Number.MAX_VALUE;
};
var intersectPlane_planePointToFrom = vec2$6.create();
var intersectPlane_normal = vec2$6.create();
var intersectPlane_len = vec2$6.create();
Plane.prototype.raycast = function(result2, ray2, position, angle) {
  var from = ray2.from;
  var to = ray2.to;
  var direction2 = ray2.direction;
  var planePointToFrom = intersectPlane_planePointToFrom;
  var normal = intersectPlane_normal;
  var len = intersectPlane_len;
  vec2$6.set(normal, 0, 1);
  vec2$6.rotate(normal, normal, angle);
  vec2$6.subtract(len, from, position);
  var planeToFrom = vec2$6.dot(len, normal);
  vec2$6.subtract(len, to, position);
  var planeToTo = vec2$6.dot(len, normal);
  if (planeToFrom * planeToTo > 0) {
    return;
  }
  if (vec2$6.squaredDistance(from, to) < planeToFrom * planeToFrom) {
    return;
  }
  var n_dot_dir = vec2$6.dot(normal, direction2);
  vec2$6.subtract(planePointToFrom, from, position);
  var t2 = -vec2$6.dot(normal, planePointToFrom) / n_dot_dir / ray2.length;
  ray2.reportIntersection(result2, t2, normal, -1);
};
Plane.prototype.pointTest = function(localPoint) {
  return localPoint[1] <= 0;
};
var Equation$3 = Equation_1;
var RotationalVelocityEquation_1 = RotationalVelocityEquation$1;
function RotationalVelocityEquation$1(bodyA, bodyB) {
  Equation$3.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
  this.relativeVelocity = 1;
  this.ratio = 1;
}
RotationalVelocityEquation$1.prototype = new Equation$3();
RotationalVelocityEquation$1.prototype.constructor = RotationalVelocityEquation$1;
RotationalVelocityEquation$1.prototype.computeB = function(a, b, h) {
  var G = this.G;
  G[2] = -1;
  G[5] = this.ratio;
  var GiMf = this.computeGiMf();
  var GW = this.computeGW();
  var B = -GW * b - h * GiMf;
  return B;
};
var Equation$2 = Equation_1;
var vec2$5 = vec2$q.exports;
var RotationalLockEquation_1 = RotationalLockEquation$2;
function RotationalLockEquation$2(bodyA, bodyB, options) {
  options = options || {};
  Equation$2.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
  this.angle = options.angle || 0;
  var G = this.G;
  G[2] = 1;
  G[5] = -1;
}
RotationalLockEquation$2.prototype = new Equation$2();
RotationalLockEquation$2.prototype.constructor = RotationalLockEquation$2;
var worldVectorA = vec2$5.create();
var worldVectorB = vec2$5.create();
var xAxis$1 = vec2$5.fromValues(1, 0);
var yAxis$1 = vec2$5.fromValues(0, 1);
RotationalLockEquation$2.prototype.computeGq = function() {
  vec2$5.rotate(worldVectorA, xAxis$1, this.bodyA.angle + this.angle);
  vec2$5.rotate(worldVectorB, yAxis$1, this.bodyB.angle);
  return vec2$5.dot(worldVectorA, worldVectorB);
};
var Constraint$2 = Constraint_1;
var Equation$1 = Equation_1;
var RotationalVelocityEquation = RotationalVelocityEquation_1;
var RotationalLockEquation$1 = RotationalLockEquation_1;
var vec2$4 = vec2$q.exports;
var sub = vec2$4.subtract;
var add = vec2$4.add;
var rotate = vec2$4.rotate;
var dot = vec2$4.dot;
var copy = vec2$4.copy;
var crossLength = vec2$4.crossLength;
var RevoluteConstraint_1 = RevoluteConstraint;
var worldPivotA = vec2$4.create();
var worldPivotB = vec2$4.create();
var xAxis = vec2$4.fromValues(1, 0);
var yAxis = vec2$4.fromValues(0, 1);
var g = vec2$4.create();
function RevoluteConstraint(bodyA, bodyB, options) {
  options = options || {};
  Constraint$2.call(this, bodyA, bodyB, Constraint$2.REVOLUTE, options);
  var maxForce = this.maxForce = options.maxForce !== void 0 ? options.maxForce : Number.MAX_VALUE;
  var pivotA = this.pivotA = vec2$4.create();
  var pivotB = this.pivotB = vec2$4.create();
  if (options.worldPivot) {
    sub(pivotA, options.worldPivot, bodyA.position);
    sub(pivotB, options.worldPivot, bodyB.position);
    rotate(pivotA, pivotA, -bodyA.angle);
    rotate(pivotB, pivotB, -bodyB.angle);
  } else {
    if (options.localPivotA) {
      copy(pivotA, options.localPivotA);
    }
    if (options.localPivotB) {
      copy(pivotB, options.localPivotB);
    }
  }
  var motorEquation = this.motorEquation = new RotationalVelocityEquation(bodyA, bodyB);
  motorEquation.enabled = false;
  var upperLimitEquation = this.upperLimitEquation = new RotationalLockEquation$1(bodyA, bodyB);
  var lowerLimitEquation = this.lowerLimitEquation = new RotationalLockEquation$1(bodyA, bodyB);
  upperLimitEquation.minForce = lowerLimitEquation.maxForce = 0;
  var eqs = this.equations = [new Equation$1(bodyA, bodyB, -maxForce, maxForce), new Equation$1(bodyA, bodyB, -maxForce, maxForce), motorEquation, upperLimitEquation, lowerLimitEquation];
  var x = eqs[0];
  var y = eqs[1];
  x.computeGq = function() {
    rotate(worldPivotA, pivotA, bodyA.angle);
    rotate(worldPivotB, pivotB, bodyB.angle);
    add(g, bodyB.position, worldPivotB);
    sub(g, g, bodyA.position);
    sub(g, g, worldPivotA);
    return dot(g, xAxis);
  };
  y.computeGq = function() {
    rotate(worldPivotA, pivotA, bodyA.angle);
    rotate(worldPivotB, pivotB, bodyB.angle);
    add(g, bodyB.position, worldPivotB);
    sub(g, g, bodyA.position);
    sub(g, g, worldPivotA);
    return dot(g, yAxis);
  };
  y.minForce = x.minForce = -maxForce;
  y.maxForce = x.maxForce = maxForce;
  x.G[0] = -1;
  x.G[1] = 0;
  x.G[3] = 1;
  x.G[4] = 0;
  y.G[0] = 0;
  y.G[1] = -1;
  y.G[3] = 0;
  y.G[4] = 1;
  this.angle = 0;
  this.lowerLimitEnabled = false;
  this.upperLimitEnabled = false;
  this.lowerLimit = 0;
  this.upperLimit = 0;
}
RevoluteConstraint.prototype = new Constraint$2();
RevoluteConstraint.prototype.constructor = RevoluteConstraint;
RevoluteConstraint.prototype.setLimits = function(lower, upper) {
  this.lowerLimit = lower;
  this.upperLimit = upper;
  this.lowerLimitEnabled = this.upperLimitEnabled = true;
};
RevoluteConstraint.prototype.update = function() {
  var bodyA = this.bodyA, bodyB = this.bodyB, pivotA = this.pivotA, pivotB = this.pivotB, eqs = this.equations, x = eqs[0], y = eqs[1], upperLimit = this.upperLimit, lowerLimit = this.lowerLimit, upperLimitEquation = this.upperLimitEquation, lowerLimitEquation = this.lowerLimitEquation;
  var relAngle = this.angle = bodyB.angle - bodyA.angle;
  upperLimitEquation.angle = upperLimit;
  upperLimitEquation.enabled = this.upperLimitEnabled && relAngle > upperLimit;
  lowerLimitEquation.angle = lowerLimit;
  lowerLimitEquation.enabled = this.lowerLimitEnabled && relAngle < lowerLimit;
  rotate(worldPivotA, pivotA, bodyA.angle);
  rotate(worldPivotB, pivotB, bodyB.angle);
  var xG = x.G;
  xG[2] = -crossLength(worldPivotA, xAxis);
  xG[5] = crossLength(worldPivotB, xAxis);
  var yG = y.G;
  yG[2] = -crossLength(worldPivotA, yAxis);
  yG[5] = crossLength(worldPivotB, yAxis);
};
Object.defineProperties(RevoluteConstraint.prototype, {
  /**
   * @property {boolean} motorEnabled
   */
  motorEnabled: {
    get: function() {
      return this.motorEquation.enabled;
    },
    set: function(value) {
      this.motorEquation.enabled = value;
    }
  },
  /**
   * @property {number} motorSpeed
   */
  motorSpeed: {
    get: function() {
      return this.motorEquation.relativeVelocity;
    },
    set: function(value) {
      this.motorEquation.relativeVelocity = value;
    }
  },
  /**
   * @property {number} motorMaxForce
   */
  motorMaxForce: {
    get: function() {
      return this.motorEquation.maxForce;
    },
    set: function(value) {
      var eq = this.motorEquation;
      eq.maxForce = value;
      eq.minForce = -value;
    }
  }
});
RevoluteConstraint.prototype.enableMotor = function() {
  console.warn("revolute.enableMotor() is deprecated, do revolute.motorEnabled = true; instead.");
  this.motorEnabled = true;
};
RevoluteConstraint.prototype.disableMotor = function() {
  console.warn("revolute.disableMotor() is deprecated, do revolute.motorEnabled = false; instead.");
  this.motorEnabled = false;
};
RevoluteConstraint.prototype.motorIsEnabled = function() {
  console.warn("revolute.motorIsEnabled() is deprecated, use revolute.motorEnabled instead.");
  return this.motorEnabled;
};
RevoluteConstraint.prototype.setMotorSpeed = function(speed) {
  console.warn("revolute.setMotorSpeed(speed) is deprecated, do revolute.motorSpeed = speed; instead.");
  this.motorSpeed = speed;
};
RevoluteConstraint.prototype.getMotorSpeed = function() {
  console.warn("revolute.getMotorSpeed() is deprecated, use revolute.motorSpeed instead.");
  return this.motorSpeed;
};
var Constraint$1 = Constraint_1;
var ContactEquation = ContactEquation_1;
var Equation = Equation_1;
var vec2$3 = vec2$q.exports;
var RotationalLockEquation = RotationalLockEquation_1;
var PrismaticConstraint_1 = PrismaticConstraint;
function PrismaticConstraint(bodyA, bodyB, options) {
  options = options || {};
  Constraint$1.call(this, bodyA, bodyB, Constraint$1.PRISMATIC, options);
  var localAnchorA = vec2$3.create(), localAxisA = vec2$3.fromValues(1, 0), localAnchorB = vec2$3.create();
  if (options.localAnchorA) {
    vec2$3.copy(localAnchorA, options.localAnchorA);
  }
  if (options.localAxisA) {
    vec2$3.copy(localAxisA, options.localAxisA);
  }
  if (options.localAnchorB) {
    vec2$3.copy(localAnchorB, options.localAnchorB);
  }
  this.localAnchorA = localAnchorA;
  this.localAnchorB = localAnchorB;
  this.localAxisA = localAxisA;
  var maxForce = this.maxForce = options.maxForce !== void 0 ? options.maxForce : Number.MAX_VALUE;
  var trans = new Equation(bodyA, bodyB, -maxForce, maxForce);
  var ri2 = new vec2$3.create(), rj2 = new vec2$3.create(), gg = new vec2$3.create(), t2 = new vec2$3.create();
  trans.computeGq = function() {
    return vec2$3.dot(gg, t2);
  };
  trans.updateJacobian = function() {
    var G = this.G, xi = bodyA.position, xj = bodyB.position;
    vec2$3.rotate(ri2, localAnchorA, bodyA.angle);
    vec2$3.rotate(rj2, localAnchorB, bodyB.angle);
    vec2$3.add(gg, xj, rj2);
    vec2$3.subtract(gg, gg, xi);
    vec2$3.subtract(gg, gg, ri2);
    vec2$3.rotate(t2, localAxisA, bodyA.angle + Math.PI / 2);
    G[0] = -t2[0];
    G[1] = -t2[1];
    G[2] = -vec2$3.crossLength(ri2, t2) + vec2$3.crossLength(t2, gg);
    G[3] = t2[0];
    G[4] = t2[1];
    G[5] = vec2$3.crossLength(rj2, t2);
  };
  this.equations.push(trans);
  if (!options.disableRotationalLock) {
    var rot = new RotationalLockEquation(bodyA, bodyB, -maxForce, maxForce);
    this.equations.push(rot);
  }
  this.position = 0;
  this.velocity = 0;
  this.lowerLimitEnabled = options.lowerLimit !== void 0 ? true : false;
  this.upperLimitEnabled = options.upperLimit !== void 0 ? true : false;
  this.lowerLimit = options.lowerLimit !== void 0 ? options.lowerLimit : 0;
  this.upperLimit = options.upperLimit !== void 0 ? options.upperLimit : 1;
  this.upperLimitEquation = new ContactEquation(bodyA, bodyB);
  this.lowerLimitEquation = new ContactEquation(bodyA, bodyB);
  this.upperLimitEquation.minForce = this.lowerLimitEquation.minForce = 0;
  this.upperLimitEquation.maxForce = this.lowerLimitEquation.maxForce = maxForce;
  this.motorEquation = new Equation(bodyA, bodyB);
  this.motorEnabled = false;
  this.motorSpeed = 0;
  var that = this;
  var motorEquation = this.motorEquation;
  motorEquation.computeGq = function() {
    return 0;
  };
  motorEquation.computeGW = function() {
    var G = this.G, bi = this.bodyA, bj = this.bodyB, vi2 = bi.velocity, vj2 = bj.velocity, wi = bi.angularVelocity, wj = bj.angularVelocity;
    return this.gmult(G, vi2, wi, vj2, wj) + that.motorSpeed;
  };
}
PrismaticConstraint.prototype = new Constraint$1();
PrismaticConstraint.prototype.constructor = PrismaticConstraint;
var worldAxisA = vec2$3.create();
var worldAnchorA = vec2$3.create();
var worldAnchorB = vec2$3.create();
var orientedAnchorA = vec2$3.create();
var orientedAnchorB = vec2$3.create();
var tmp = vec2$3.create();
PrismaticConstraint.prototype.update = function() {
  var eqs = this.equations, trans = eqs[0], upperLimit = this.upperLimit, lowerLimit = this.lowerLimit, upperLimitEquation = this.upperLimitEquation, lowerLimitEquation = this.lowerLimitEquation, bodyA = this.bodyA, bodyB = this.bodyB, localAxisA = this.localAxisA, localAnchorA = this.localAnchorA, localAnchorB = this.localAnchorB;
  trans.updateJacobian();
  vec2$3.rotate(worldAxisA, localAxisA, bodyA.angle);
  vec2$3.rotate(orientedAnchorA, localAnchorA, bodyA.angle);
  vec2$3.add(worldAnchorA, orientedAnchorA, bodyA.position);
  vec2$3.rotate(orientedAnchorB, localAnchorB, bodyB.angle);
  vec2$3.add(worldAnchorB, orientedAnchorB, bodyB.position);
  var relPosition = this.position = vec2$3.dot(worldAnchorB, worldAxisA) - vec2$3.dot(worldAnchorA, worldAxisA);
  if (this.motorEnabled) {
    var G = this.motorEquation.G;
    G[0] = worldAxisA[0];
    G[1] = worldAxisA[1];
    G[2] = vec2$3.crossLength(worldAxisA, orientedAnchorB);
    G[3] = -worldAxisA[0];
    G[4] = -worldAxisA[1];
    G[5] = -vec2$3.crossLength(worldAxisA, orientedAnchorA);
  }
  if (this.upperLimitEnabled && relPosition > upperLimit) {
    vec2$3.scale(upperLimitEquation.normalA, worldAxisA, -1);
    vec2$3.subtract(upperLimitEquation.contactPointA, worldAnchorA, bodyA.position);
    vec2$3.subtract(upperLimitEquation.contactPointB, worldAnchorB, bodyB.position);
    vec2$3.scale(tmp, worldAxisA, upperLimit);
    vec2$3.add(upperLimitEquation.contactPointA, upperLimitEquation.contactPointA, tmp);
    if (eqs.indexOf(upperLimitEquation) === -1) {
      eqs.push(upperLimitEquation);
    }
  } else {
    var idx = eqs.indexOf(upperLimitEquation);
    if (idx !== -1) {
      eqs.splice(idx, 1);
    }
  }
  if (this.lowerLimitEnabled && relPosition < lowerLimit) {
    vec2$3.scale(lowerLimitEquation.normalA, worldAxisA, 1);
    vec2$3.subtract(lowerLimitEquation.contactPointA, worldAnchorA, bodyA.position);
    vec2$3.subtract(lowerLimitEquation.contactPointB, worldAnchorB, bodyB.position);
    vec2$3.scale(tmp, worldAxisA, lowerLimit);
    vec2$3.subtract(lowerLimitEquation.contactPointB, lowerLimitEquation.contactPointB, tmp);
    if (eqs.indexOf(lowerLimitEquation) === -1) {
      eqs.push(lowerLimitEquation);
    }
  } else {
    var idx = eqs.indexOf(lowerLimitEquation);
    if (idx !== -1) {
      eqs.splice(idx, 1);
    }
  }
};
PrismaticConstraint.prototype.enableMotor = function() {
  if (this.motorEnabled) {
    return;
  }
  this.equations.push(this.motorEquation);
  this.motorEnabled = true;
};
PrismaticConstraint.prototype.disableMotor = function() {
  if (!this.motorEnabled) {
    return;
  }
  var i = this.equations.indexOf(this.motorEquation);
  this.equations.splice(i, 1);
  this.motorEnabled = false;
};
PrismaticConstraint.prototype.setLimits = function(lower, upper) {
  if (typeof lower === "number") {
    this.lowerLimit = lower;
    this.lowerLimitEnabled = true;
  } else {
    this.lowerLimit = lower;
    this.lowerLimitEnabled = false;
  }
  if (typeof upper === "number") {
    this.upperLimit = upper;
    this.upperLimitEnabled = true;
  } else {
    this.upperLimit = upper;
    this.upperLimitEnabled = false;
  }
};
var Utils$1 = Utils_1;
var Broadphase = Broadphase_1;
var SAPBroadphase_1 = SAPBroadphase$1;
function SAPBroadphase$1() {
  Broadphase.call(this, Broadphase.SAP);
  this.axisList = [];
  this.axisIndex = 0;
  var that = this;
  this._addBodyHandler = function(e) {
    that.axisList.push(e.body);
  };
  this._removeBodyHandler = function(e) {
    var idx = that.axisList.indexOf(e.body);
    if (idx !== -1) {
      that.axisList.splice(idx, 1);
    }
  };
}
SAPBroadphase$1.prototype = new Broadphase();
SAPBroadphase$1.prototype.constructor = SAPBroadphase$1;
SAPBroadphase$1.prototype.setWorld = function(world) {
  this.axisList.length = 0;
  Utils$1.appendArray(this.axisList, world.bodies);
  world.off("addBody", this._addBodyHandler).off("removeBody", this._removeBodyHandler);
  world.on("addBody", this._addBodyHandler).on("removeBody", this._removeBodyHandler);
  this.world = world;
};
function sortAxisList(a, axisIndex) {
  axisIndex = axisIndex | 0;
  for (var i = 1, l2 = a.length; i < l2; i++) {
    var v2 = a[i];
    for (var j = i - 1; j >= 0; j--) {
      if (a[j].aabb.lowerBound[axisIndex] <= v2.aabb.lowerBound[axisIndex]) {
        break;
      }
      a[j + 1] = a[j];
    }
    a[j + 1] = v2;
  }
  return a;
}
SAPBroadphase$1.prototype.sortList = function() {
  var bodies = this.axisList, axisIndex = this.axisIndex;
  sortAxisList(bodies, axisIndex);
};
SAPBroadphase$1.prototype.getCollisionPairs = function() {
  var bodies = this.axisList, result2 = this.result, axisIndex = this.axisIndex;
  result2.length = 0;
  var l2 = bodies.length;
  while (l2--) {
    var b = bodies[l2];
    if (b.aabbNeedsUpdate) {
      b.updateAABB();
    }
  }
  this.sortList();
  for (var i = 0, N = bodies.length | 0; i !== N; i++) {
    var bi = bodies[i];
    for (var j = i + 1; j < N; j++) {
      var bj = bodies[j];
      var overlaps = bj.aabb.lowerBound[axisIndex] <= bi.aabb.upperBound[axisIndex];
      if (!overlaps) {
        break;
      }
      if (Broadphase.canCollide(bi, bj) && this.boundingVolumeCheck(bi, bj)) {
        result2.push(bi, bj);
      }
    }
  }
  return result2;
};
SAPBroadphase$1.prototype.aabbQuery = function(world, aabb, result2) {
  result2 = result2 || [];
  this.sortList();
  var axisList = this.axisList;
  for (var i = 0; i < axisList.length; i++) {
    var b = axisList[i];
    if (b.aabbNeedsUpdate) {
      b.updateAABB();
    }
    if (b.aabb.overlaps(aabb)) {
      result2.push(b);
    }
  }
  return result2;
};
var Spring_1 = Spring$2;
function Spring$2(bodyA, bodyB, options) {
  options = options || {};
  this.stiffness = options.stiffness !== void 0 ? options.stiffness : 100;
  this.damping = options.damping !== void 0 ? options.damping : 1;
  this.bodyA = bodyA;
  this.bodyB = bodyB;
}
Spring$2.prototype.applyForce = function() {
};
var vec2$2 = vec2$q.exports;
var Constraint = Constraint_1;
var FrictionEquation = FrictionEquation_1;
var Body$1 = Body_1;
var TopDownVehicle_1 = TopDownVehicle;
function TopDownVehicle(chassisBody, options) {
  this.chassisBody = chassisBody;
  this.wheels = [];
  this.groundBody = new Body$1({
    mass: 0
  });
  this.world = null;
  var that = this;
  this.preStepCallback = function() {
    that.update();
  };
}
TopDownVehicle.prototype.addToWorld = function(world) {
  this.world = world;
  world.addBody(this.groundBody);
  world.on("preStep", this.preStepCallback);
  for (var i = 0; i < this.wheels.length; i++) {
    var wheel = this.wheels[i];
    world.addConstraint(wheel);
  }
};
TopDownVehicle.prototype.removeFromWorld = function() {
  var world = this.world;
  world.removeBody(this.groundBody);
  world.off("preStep", this.preStepCallback);
  for (var i = 0; i < this.wheels.length; i++) {
    var wheel = this.wheels[i];
    world.removeConstraint(wheel);
  }
  this.world = null;
};
TopDownVehicle.prototype.addWheel = function(wheelOptions) {
  var wheel = new WheelConstraint(this, wheelOptions);
  this.wheels.push(wheel);
  return wheel;
};
TopDownVehicle.prototype.update = function() {
  for (var i = 0; i < this.wheels.length; i++) {
    this.wheels[i].update();
  }
};
function WheelConstraint(vehicle, options) {
  options = options || {};
  this.vehicle = vehicle;
  this.forwardEquation = new FrictionEquation(vehicle.chassisBody, vehicle.groundBody);
  this.sideEquation = new FrictionEquation(vehicle.chassisBody, vehicle.groundBody);
  this.steerValue = 0;
  this.engineForce = 0;
  this.setSideFriction(options.sideFriction !== void 0 ? options.sideFriction : 5);
  this.localForwardVector = vec2$2.fromValues(0, 1);
  if (options.localForwardVector) {
    vec2$2.copy(this.localForwardVector, options.localForwardVector);
  }
  this.localPosition = vec2$2.create();
  if (options.localPosition) {
    vec2$2.copy(this.localPosition, options.localPosition);
  }
  Constraint.call(this, vehicle.chassisBody, vehicle.groundBody);
  this.equations.push(this.forwardEquation, this.sideEquation);
  this.setBrakeForce(0);
}
WheelConstraint.prototype = new Constraint();
WheelConstraint.prototype.setBrakeForce = function(force) {
  this.forwardEquation.setSlipForce(force);
};
WheelConstraint.prototype.setSideFriction = function(force) {
  this.sideEquation.setSlipForce(force);
};
var worldVelocity = vec2$2.create();
var relativePoint = vec2$2.create();
WheelConstraint.prototype.getSpeed = function() {
  var body = this.vehicle.chassisBody;
  body.vectorToWorldFrame(relativePoint, this.localForwardVector);
  body.getVelocityAtPoint(worldVelocity, relativePoint);
  return vec2$2.dot(worldVelocity, relativePoint);
};
var tmpVec = vec2$2.create();
WheelConstraint.prototype.update = function() {
  var body = this.vehicle.chassisBody;
  var forwardEquation = this.forwardEquation;
  var sideEquation = this.sideEquation;
  var steerValue = this.steerValue;
  body.vectorToWorldFrame(forwardEquation.t, this.localForwardVector);
  vec2$2.rotate(sideEquation.t, this.localForwardVector, Math.PI / 2);
  body.vectorToWorldFrame(sideEquation.t, sideEquation.t);
  vec2$2.rotate(forwardEquation.t, forwardEquation.t, steerValue);
  vec2$2.rotate(sideEquation.t, sideEquation.t, steerValue);
  body.toWorldFrame(forwardEquation.contactPointB, this.localPosition);
  vec2$2.copy(sideEquation.contactPointB, forwardEquation.contactPointB);
  body.vectorToWorldFrame(forwardEquation.contactPointA, this.localPosition);
  vec2$2.copy(sideEquation.contactPointA, forwardEquation.contactPointA);
  vec2$2.normalize(tmpVec, forwardEquation.t);
  vec2$2.scale(tmpVec, tmpVec, this.engineForce);
  this.vehicle.chassisBody.applyForce(tmpVec, forwardEquation.contactPointA);
};
var vec2$1 = vec2$q.exports;
var Spring$1 = Spring_1;
var LinearSpring_1 = LinearSpring;
function LinearSpring(bodyA, bodyB, options) {
  options = options || {};
  Spring$1.call(this, bodyA, bodyB, options);
  this.localAnchorA = vec2$1.create();
  this.localAnchorB = vec2$1.create();
  if (options.localAnchorA) {
    vec2$1.copy(this.localAnchorA, options.localAnchorA);
  }
  if (options.localAnchorB) {
    vec2$1.copy(this.localAnchorB, options.localAnchorB);
  }
  if (options.worldAnchorA) {
    this.setWorldAnchorA(options.worldAnchorA);
  }
  if (options.worldAnchorB) {
    this.setWorldAnchorB(options.worldAnchorB);
  }
  var worldAnchorA2 = vec2$1.create();
  var worldAnchorB2 = vec2$1.create();
  this.getWorldAnchorA(worldAnchorA2);
  this.getWorldAnchorB(worldAnchorB2);
  var worldDistance = vec2$1.distance(worldAnchorA2, worldAnchorB2);
  this.restLength = options.restLength !== void 0 ? options.restLength : worldDistance;
}
LinearSpring.prototype = new Spring$1();
LinearSpring.prototype.constructor = LinearSpring;
LinearSpring.prototype.setWorldAnchorA = function(worldAnchorA2) {
  this.bodyA.toLocalFrame(this.localAnchorA, worldAnchorA2);
};
LinearSpring.prototype.setWorldAnchorB = function(worldAnchorB2) {
  this.bodyB.toLocalFrame(this.localAnchorB, worldAnchorB2);
};
LinearSpring.prototype.getWorldAnchorA = function(result2) {
  this.bodyA.toWorldFrame(result2, this.localAnchorA);
};
LinearSpring.prototype.getWorldAnchorB = function(result2) {
  this.bodyB.toWorldFrame(result2, this.localAnchorB);
};
var applyForce_r = vec2$1.create();
var applyForce_r_unit = vec2$1.create();
var applyForce_u = vec2$1.create();
var applyForce_f = vec2$1.create();
var applyForce_worldAnchorA = vec2$1.create();
var applyForce_worldAnchorB = vec2$1.create();
var applyForce_ri = vec2$1.create();
var applyForce_rj = vec2$1.create();
var applyForce_tmp = vec2$1.create();
LinearSpring.prototype.applyForce = function() {
  var k = this.stiffness, d = this.damping, l2 = this.restLength, bodyA = this.bodyA, bodyB = this.bodyB, r2 = applyForce_r, r_unit = applyForce_r_unit, u = applyForce_u, f = applyForce_f, tmp16 = applyForce_tmp;
  var worldAnchorA2 = applyForce_worldAnchorA, worldAnchorB2 = applyForce_worldAnchorB, ri2 = applyForce_ri, rj2 = applyForce_rj;
  this.getWorldAnchorA(worldAnchorA2);
  this.getWorldAnchorB(worldAnchorB2);
  vec2$1.subtract(ri2, worldAnchorA2, bodyA.position);
  vec2$1.subtract(rj2, worldAnchorB2, bodyB.position);
  vec2$1.subtract(r2, worldAnchorB2, worldAnchorA2);
  var rlen = vec2$1.length(r2);
  vec2$1.normalize(r_unit, r2);
  vec2$1.subtract(u, bodyB.velocity, bodyA.velocity);
  vec2$1.crossZV(tmp16, bodyB.angularVelocity, rj2);
  vec2$1.add(u, u, tmp16);
  vec2$1.crossZV(tmp16, bodyA.angularVelocity, ri2);
  vec2$1.subtract(u, u, tmp16);
  vec2$1.scale(f, r_unit, -k * (rlen - l2) - d * vec2$1.dot(u, r_unit));
  vec2$1.subtract(bodyA.force, bodyA.force, f);
  vec2$1.add(bodyB.force, bodyB.force, f);
  var ri_x_f = vec2$1.crossLength(ri2, f);
  var rj_x_f = vec2$1.crossLength(rj2, f);
  bodyA.angularForce -= ri_x_f;
  bodyB.angularForce += rj_x_f;
};
var Spring = Spring_1;
var RotationalSpring_1 = RotationalSpring;
function RotationalSpring(bodyA, bodyB, options) {
  options = options || {};
  Spring.call(this, bodyA, bodyB, options);
  this.restAngle = options.restAngle !== void 0 ? options.restAngle : bodyB.angle - bodyA.angle;
}
RotationalSpring.prototype = new Spring();
RotationalSpring.prototype.constructor = RotationalSpring;
RotationalSpring.prototype.applyForce = function() {
  var k = this.stiffness, d = this.damping, l2 = this.restAngle, bodyA = this.bodyA, bodyB = this.bodyB, x = bodyB.angle - bodyA.angle, u = bodyB.angularVelocity - bodyA.angularVelocity;
  var torque = -k * (x - l2) - d * u;
  bodyA.angularForce -= torque;
  bodyB.angularForce += torque;
};
var OverlapKeeperRecord_1 = OverlapKeeperRecord$1;
function OverlapKeeperRecord$1(bodyA, shapeA, bodyB, shapeB) {
  this.shapeA = shapeA;
  this.shapeB = shapeB;
  this.bodyA = bodyA;
  this.bodyB = bodyB;
}
OverlapKeeperRecord$1.prototype.set = function(bodyA, shapeA, bodyB, shapeB) {
  OverlapKeeperRecord$1.call(this, bodyA, shapeA, bodyB, shapeB);
};
var OverlapKeeperRecord = OverlapKeeperRecord_1;
var Pool = Pool_1;
var OverlapKeeperRecordPool_1 = OverlapKeeperRecordPool$1;
function OverlapKeeperRecordPool$1() {
  Pool.apply(this, arguments);
}
OverlapKeeperRecordPool$1.prototype = new Pool();
OverlapKeeperRecordPool$1.prototype.constructor = OverlapKeeperRecordPool$1;
OverlapKeeperRecordPool$1.prototype.create = function() {
  return new OverlapKeeperRecord();
};
OverlapKeeperRecordPool$1.prototype.destroy = function(record) {
  record.bodyA = record.bodyB = record.shapeA = record.shapeB = null;
  return this;
};
var TupleDictionary = TupleDictionary_1;
var OverlapKeeperRecordPool = OverlapKeeperRecordPool_1;
var OverlapKeeper_1 = OverlapKeeper$1;
function OverlapKeeper$1() {
  this.overlappingShapesLastState = new TupleDictionary();
  this.overlappingShapesCurrentState = new TupleDictionary();
  this.recordPool = new OverlapKeeperRecordPool({
    size: 16
  });
  this.tmpDict = new TupleDictionary();
  this.tmpArray1 = [];
}
OverlapKeeper$1.prototype.tick = function() {
  var last = this.overlappingShapesLastState;
  var current = this.overlappingShapesCurrentState;
  var l2 = last.keys.length;
  while (l2--) {
    var key = last.keys[l2];
    var lastObject = last.getByKey(key);
    if (lastObject) {
      this.recordPool.release(lastObject);
    }
  }
  last.reset();
  last.copy(current);
  current.reset();
};
OverlapKeeper$1.prototype.setOverlapping = function(bodyA, shapeA, bodyB, shapeB) {
  var current = this.overlappingShapesCurrentState;
  if (!current.get(shapeA.id, shapeB.id)) {
    var data = this.recordPool.get();
    data.set(bodyA, shapeA, bodyB, shapeB);
    current.set(shapeA.id, shapeB.id, data);
  }
};
OverlapKeeper$1.prototype.getNewOverlaps = function(result2) {
  return this.getDiff(this.overlappingShapesLastState, this.overlappingShapesCurrentState, result2);
};
OverlapKeeper$1.prototype.getEndOverlaps = function(result2) {
  return this.getDiff(this.overlappingShapesCurrentState, this.overlappingShapesLastState, result2);
};
OverlapKeeper$1.prototype.bodiesAreOverlapping = function(bodyA, bodyB) {
  var current = this.overlappingShapesCurrentState;
  var l2 = current.keys.length;
  while (l2--) {
    var key = current.keys[l2];
    var data = current.data[key];
    if (data.bodyA === bodyA && data.bodyB === bodyB || data.bodyA === bodyB && data.bodyB === bodyA) {
      return true;
    }
  }
  return false;
};
OverlapKeeper$1.prototype.getDiff = function(dictA, dictB, result2) {
  var result2 = result2 || [];
  var last = dictA;
  var current = dictB;
  result2.length = 0;
  var l2 = current.keys.length;
  while (l2--) {
    var key = current.keys[l2];
    var data = current.data[key];
    if (!data) {
      throw new Error("Key " + key + " had no data!");
    }
    var lastData = last.data[key];
    if (!lastData) {
      result2.push(data);
    }
  }
  return result2;
};
OverlapKeeper$1.prototype.isNewOverlap = function(shapeA, shapeB) {
  var idA = shapeA.id | 0, idB = shapeB.id | 0;
  var last = this.overlappingShapesLastState;
  var current = this.overlappingShapesCurrentState;
  return !!!last.get(idA, idB) && !!current.get(idA, idB);
};
OverlapKeeper$1.prototype.getNewBodyOverlaps = function(result2) {
  this.tmpArray1.length = 0;
  var overlaps = this.getNewOverlaps(this.tmpArray1);
  return this.getBodyDiff(overlaps, result2);
};
OverlapKeeper$1.prototype.getEndBodyOverlaps = function(result2) {
  this.tmpArray1.length = 0;
  var overlaps = this.getEndOverlaps(this.tmpArray1);
  return this.getBodyDiff(overlaps, result2);
};
OverlapKeeper$1.prototype.getBodyDiff = function(overlaps, result2) {
  result2 = result2 || [];
  var accumulator = this.tmpDict;
  var l2 = overlaps.length;
  while (l2--) {
    var data = overlaps[l2];
    accumulator.set(data.bodyA.id | 0, data.bodyB.id | 0, data);
  }
  l2 = accumulator.keys.length;
  while (l2--) {
    var data = accumulator.getByKey(accumulator.keys[l2]);
    if (data) {
      result2.push(data.bodyA, data.bodyB);
    }
  }
  accumulator.reset();
  return result2;
};
var UnionFind_1 = UnionFind$1;
function UnionFind$1(size) {
  this.id = [];
  this.sz = [];
  this.size = size;
  this.count = size;
  this.resize(size);
}
UnionFind$1.prototype = {
  /**
   * Initialize the UnionFind data structure with number of distinct groups to begin with. Each group will be referred to as index of the array of size size starting at 0.
   * @method resize
   * @param {number} size
   */
  resize: function(size) {
    this.count = this.size = size;
    var sz = this.sz;
    var id = this.id;
    for (var i = 0; i < size; i++) {
      id[i] = i;
      sz[i] = 1;
    }
  },
  /**
   * Return the root (value) of the group in which p is.
   * @method find
   * @param {number} p
   */
  find: function(p) {
    var id = this.id;
    while (p !== id[p]) {
      id[p] = id[id[p]];
      p = id[p];
    }
    return p;
  },
  /**
   * Combine elements in groups p and q into a single group. In other words connect the two groups.
   * @method union
   * @param {number} p
   * @param {number} q
   */
  union: function(p, q2) {
    var i = this.find(p), j = this.find(q2);
    if (i === j) {
      return;
    }
    var sz = this.sz;
    var id = this.id;
    if (sz[i] < sz[j]) {
      id[i] = j;
      sz[j] += sz[i];
    } else {
      id[j] = i;
      sz[i] += sz[j];
    }
    this.count--;
    return;
  }
};
var GSSolver = GSSolver_1;
var vec2 = vec2$q.exports;
var Shape = Shape_1;
var EventEmitter = EventEmitter_1;
var Body = Body_1;
var Material = Material_1;
var ContactMaterial = ContactMaterial_1;
var AABB = AABB_1;
var SAPBroadphase = SAPBroadphase_1;
var Narrowphase = Narrowphase_1;
var Utils = Utils_1;
var arrayRemove = Utils.arrayRemove;
var OverlapKeeper = OverlapKeeper_1;
var UnionFind = UnionFind_1;
var World_1 = World;
function World(options) {
  EventEmitter.apply(this);
  options = options || {};
  this.springs = [];
  this.bodies = [];
  this.disabledBodyCollisionPairs = [];
  this.solver = options.solver || new GSSolver();
  this.narrowphase = new Narrowphase();
  this.gravity = vec2.fromValues(0, -9.78);
  if (options.gravity) {
    vec2.copy(this.gravity, options.gravity);
  }
  this.frictionGravity = vec2.length(this.gravity) || 10;
  this.useWorldGravityAsFrictionGravity = true;
  this.useFrictionGravityOnZeroGravity = true;
  this.broadphase = options.broadphase || new SAPBroadphase();
  this.broadphase.setWorld(this);
  this.constraints = [];
  this.defaultMaterial = new Material();
  this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial, this.defaultMaterial);
  this.lastTimeStep = 1 / 60;
  this.applySpringForces = true;
  this.applyDamping = true;
  this.applyGravity = true;
  this.solveConstraints = true;
  this.contactMaterials = [];
  this.time = 0;
  this.accumulator = 0;
  this.stepping = false;
  this.islandSplit = options.islandSplit !== void 0 ? !!options.islandSplit : true;
  this.emitImpactEvent = true;
  this.sleepMode = World.NO_SLEEPING;
  this.unionFind = new UnionFind(1);
  this._constraintIdCounter = 0;
  this._bodyIdCounter = 0;
  this.overlapKeeper = new OverlapKeeper();
}
World.prototype = new Object(EventEmitter.prototype);
World.prototype.constructor = World;
var postStepEvent = {
  type: "postStep"
};
var addBodyEvent = {
  type: "addBody",
  body: null
};
var removeBodyEvent = {
  type: "removeBody",
  body: null
};
var addSpringEvent = {
  type: "addSpring",
  spring: null
};
var impactEvent = {
  type: "impact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null,
  contactEquation: null
};
var postBroadphaseEvent = {
  type: "postBroadphase",
  pairs: null
};
var beginContactEvent = {
  type: "beginContact",
  shapeA: null,
  shapeB: null,
  bodyA: null,
  bodyB: null,
  contactEquations: []
};
var endContactEvent = {
  type: "endContact",
  shapeA: null,
  shapeB: null,
  bodyA: null,
  bodyB: null
};
var preSolveEvent = {
  type: "preSolve",
  contactEquations: null,
  frictionEquations: null
};
World.NO_SLEEPING = 1;
World.BODY_SLEEPING = 2;
World.ISLAND_SLEEPING = 4;
World.prototype.addConstraint = function(constraint) {
  if (this.stepping) {
    throw new Error("Constraints cannot be added during step.");
  }
  var bodies = this.bodies;
  if (bodies.indexOf(constraint.bodyA) === -1) {
    throw new Error("Cannot add Constraint: bodyA is not added to the World.");
  }
  if (bodies.indexOf(constraint.bodyB) === -1) {
    throw new Error("Cannot add Constraint: bodyB is not added to the World.");
  }
  this.constraints.push(constraint);
};
World.prototype.addContactMaterial = function(contactMaterial) {
  this.contactMaterials.push(contactMaterial);
};
World.prototype.removeContactMaterial = function(cm) {
  arrayRemove(this.contactMaterials, cm);
};
World.prototype.getContactMaterial = function(materialA, materialB) {
  var cmats = this.contactMaterials;
  for (var i = 0, N = cmats.length; i !== N; i++) {
    var cm = cmats[i];
    if (cm.materialA === materialA && cm.materialB === materialB || cm.materialA === materialB && cm.materialB === materialA) {
      return cm;
    }
  }
  return false;
};
World.prototype.removeConstraint = function(constraint) {
  if (this.stepping) {
    throw new Error("Constraints cannot be removed during step.");
  }
  arrayRemove(this.constraints, constraint);
};
var step_mg = vec2.create();
var xiw = vec2.create();
var xjw = vec2.create();
World.prototype.step = function(dt, timeSinceLastCalled, maxSubSteps) {
  maxSubSteps = maxSubSteps || 10;
  timeSinceLastCalled = timeSinceLastCalled || 0;
  if (timeSinceLastCalled === 0) {
    this.internalStep(dt);
    this.time += dt;
  } else {
    this.accumulator += timeSinceLastCalled;
    var substeps = 0;
    while (this.accumulator >= dt && substeps < maxSubSteps) {
      this.internalStep(dt);
      this.time += dt;
      this.accumulator -= dt;
      substeps++;
    }
    var t2 = this.accumulator % dt / dt;
    for (var j = 0; j !== this.bodies.length; j++) {
      var b = this.bodies[j];
      vec2.lerp(b.interpolatedPosition, b.previousPosition, b.position, t2);
      b.interpolatedAngle = b.previousAngle + t2 * (b.angle - b.previousAngle);
    }
  }
};
var endOverlaps = [];
World.prototype.internalStep = function(dt) {
  this.stepping = true;
  var Nsprings = this.springs.length, springs = this.springs, bodies = this.bodies, g2 = this.gravity, solver = this.solver, Nbodies = this.bodies.length, broadphase = this.broadphase, np = this.narrowphase, constraints = this.constraints, mg = step_mg, add2 = vec2.add;
  this.overlapKeeper.tick();
  this.lastTimeStep = dt;
  if (this.useWorldGravityAsFrictionGravity) {
    var gravityLen = vec2.length(this.gravity);
    if (!(gravityLen === 0 && this.useFrictionGravityOnZeroGravity)) {
      this.frictionGravity = gravityLen;
    }
  }
  if (this.applyGravity) {
    for (var i = 0; i !== Nbodies; i++) {
      var b = bodies[i], fi = b.force;
      if (b.type !== Body.DYNAMIC || b.sleepState === Body.SLEEPING) {
        continue;
      }
      vec2.scale(mg, g2, b.mass * b.gravityScale);
      add2(fi, fi, mg);
    }
  }
  if (this.applySpringForces) {
    for (var i = 0; i !== Nsprings; i++) {
      var s2 = springs[i];
      s2.applyForce();
    }
  }
  if (this.applyDamping) {
    for (var i = 0; i !== Nbodies; i++) {
      var b = bodies[i];
      if (b.type === Body.DYNAMIC) {
        b.applyDamping(dt);
      }
    }
  }
  var result2 = broadphase.getCollisionPairs(this);
  var ignoredPairs = this.disabledBodyCollisionPairs;
  for (var i = ignoredPairs.length - 2; i >= 0; i -= 2) {
    for (var j = result2.length - 2; j >= 0; j -= 2) {
      if (ignoredPairs[i] === result2[j] && ignoredPairs[i + 1] === result2[j + 1] || ignoredPairs[i + 1] === result2[j] && ignoredPairs[i] === result2[j + 1]) {
        result2.splice(j, 2);
      }
    }
  }
  var Nconstraints = constraints.length;
  for (i = 0; i !== Nconstraints; i++) {
    var c = constraints[i];
    if (!c.collideConnected) {
      for (var j = result2.length - 2; j >= 0; j -= 2) {
        if (c.bodyA === result2[j] && c.bodyB === result2[j + 1] || c.bodyB === result2[j] && c.bodyA === result2[j + 1]) {
          result2.splice(j, 2);
        }
      }
    }
  }
  postBroadphaseEvent.pairs = result2;
  this.emit(postBroadphaseEvent);
  postBroadphaseEvent.pairs = null;
  np.reset();
  var defaultContactMaterial = this.defaultContactMaterial;
  var frictionGravity = this.frictionGravity;
  for (var i = 0, Nresults = result2.length; i !== Nresults; i += 2) {
    var bi = result2[i], bj = result2[i + 1];
    for (var k = 0, Nshapesi = bi.shapes.length; k !== Nshapesi; k++) {
      var si = bi.shapes[k], xi = si.position, ai = si.angle;
      for (var l2 = 0, Nshapesj = bj.shapes.length; l2 !== Nshapesj; l2++) {
        var sj = bj.shapes[l2], xj = sj.position, aj = sj.angle;
        var contactMaterial = null;
        if (si.material && sj.material) {
          contactMaterial = this.getContactMaterial(si.material, sj.material);
        }
        runNarrowphase(this, np, bi, si, xi, ai, bj, sj, xj, aj, contactMaterial || defaultContactMaterial, frictionGravity);
      }
    }
  }
  for (var i = 0; i !== Nbodies; i++) {
    var body = bodies[i];
    if (body._wakeUpAfterNarrowphase) {
      body.wakeUp();
      body._wakeUpAfterNarrowphase = false;
    }
  }
  if (this.has("endContact")) {
    this.overlapKeeper.getEndOverlaps(endOverlaps);
    var e = endContactEvent;
    var l2 = endOverlaps.length;
    while (l2--) {
      var data = endOverlaps[l2];
      e.shapeA = data.shapeA;
      e.shapeB = data.shapeB;
      e.bodyA = data.bodyA;
      e.bodyB = data.bodyB;
      this.emit(e);
    }
    endOverlaps.length = 0;
  }
  preSolveEvent.contactEquations = np.contactEquations;
  preSolveEvent.frictionEquations = np.frictionEquations;
  this.emit(preSolveEvent);
  preSolveEvent.contactEquations = preSolveEvent.frictionEquations = null;
  var Nconstraints = constraints.length;
  for (i = 0; i !== Nconstraints; i++) {
    constraints[i].update();
  }
  if (np.contactEquations.length || np.frictionEquations.length || Nconstraints) {
    var equations = [];
    Utils.appendArray(equations, np.contactEquations);
    Utils.appendArray(equations, np.frictionEquations);
    for (i = 0; i !== Nconstraints; i++) {
      Utils.appendArray(equations, constraints[i].equations);
    }
    if (this.islandSplit) {
      var unionFind = this.unionFind;
      unionFind.resize(this.bodies.length + 1);
      for (var i = 0; i < equations.length; i++) {
        equations[i].index = i;
      }
      for (var i = 0; i < equations.length; i++) {
        var bodyA = equations[i].bodyA;
        var bodyB = equations[i].bodyB;
        if (bodyA.type === Body.DYNAMIC && bodyB.type === Body.DYNAMIC) {
          unionFind.union(bodyA.index, bodyB.index);
        }
      }
      for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        body.islandId = body.type === Body.DYNAMIC ? unionFind.find(body.index) : -1;
      }
      equations = equations.sort(sortEquationsByIsland);
      var equationIndex = 0;
      while (equationIndex < equations.length) {
        var equation = equations[equationIndex++];
        solver.addEquation(equation);
        var currentIslandId = equation.bodyA.islandId > 0 ? equation.bodyA.islandId : equation.bodyB.islandId;
        var nextIslandId = -1;
        if (equations[equationIndex]) {
          nextIslandId = equations[equationIndex].bodyA.islandId > 0 ? equations[equationIndex].bodyA.islandId : equations[equationIndex].bodyB.islandId;
        }
        if (nextIslandId !== currentIslandId || equationIndex === equations.length) {
          if (this.solveConstraints) {
            solver.solve(dt, this);
          }
          solver.removeAllEquations();
        }
      }
    } else {
      solver.addEquations(equations);
      if (this.solveConstraints) {
        solver.solve(dt, this);
      }
      solver.removeAllEquations();
    }
  }
  for (var i = 0; i !== Nbodies; i++) {
    var body = bodies[i];
    if (body.type === Body.DYNAMIC || body.type === Body.KINEMATIC) {
      body.integrate(dt);
    }
  }
  for (var i = 0; i !== Nbodies; i++) {
    bodies[i].setZeroForce();
  }
  if (this.emitImpactEvent && this.has("impact")) {
    var ev = impactEvent;
    for (var i = 0; i !== np.contactEquations.length; i++) {
      var eq = np.contactEquations[i];
      if (eq.firstImpact) {
        ev.bodyA = eq.bodyA;
        ev.bodyB = eq.bodyB;
        ev.shapeA = eq.shapeA;
        ev.shapeB = eq.shapeB;
        ev.contactEquation = eq;
        this.emit(ev);
      }
    }
  }
  if (this.sleepMode === World.BODY_SLEEPING) {
    for (i = 0; i !== Nbodies; i++) {
      bodies[i].sleepTick(this.time, false, dt);
    }
  } else if (this.sleepMode === World.ISLAND_SLEEPING && this.islandSplit) {
    for (i = 0; i !== Nbodies; i++) {
      bodies[i].sleepTick(this.time, true, dt);
    }
    var bodiesSortedByIsland = bodies.sort(sortBodiesByIsland);
    var islandEnd = 1;
    for (var islandStart = 0; islandStart < bodiesSortedByIsland.length; islandStart = islandEnd) {
      var islandId = bodiesSortedByIsland[islandStart].islandId;
      for (islandEnd = islandStart + 1; islandEnd < bodiesSortedByIsland.length && bodiesSortedByIsland[islandEnd].islandId === islandId; islandEnd++) {
      }
      if (islandId === -1) {
        continue;
      }
      var islandShouldSleep = true;
      for (var i = islandStart; i < islandEnd; i++) {
        if (!bodiesSortedByIsland[i].wantsToSleep) {
          islandShouldSleep = false;
          break;
        }
      }
      if (islandShouldSleep) {
        for (var i = islandStart; i < islandEnd; i++) {
          bodiesSortedByIsland[i].sleep();
        }
      }
    }
  }
  this.stepping = false;
  this.emit(postStepEvent);
};
function sortBodiesByIsland(a, b) {
  return a.islandId - b.islandId;
}
function sortEquationsByIsland(equationA, equationB) {
  var islandA = equationA.bodyA.islandId > 0 ? equationA.bodyA.islandId : equationA.bodyB.islandId;
  var islandB = equationB.bodyA.islandId > 0 ? equationB.bodyA.islandId : equationB.bodyB.islandId;
  if (islandA !== islandB) {
    return islandA - islandB;
  } else {
    return equationA.index - equationB.index;
  }
}
function runNarrowphase(world, np, bi, si, xi, ai, bj, sj, xj, aj, cm, glen) {
  if (!((si.collisionGroup & sj.collisionMask) !== 0 && (sj.collisionGroup & si.collisionMask) !== 0)) {
    return;
  }
  vec2.toGlobalFrame(xiw, xi, bi.position, bi.angle);
  vec2.toGlobalFrame(xjw, xj, bj.position, bj.angle);
  if (vec2.distance(xiw, xjw) > si.boundingRadius + sj.boundingRadius) {
    return;
  }
  var aiw = ai + bi.angle;
  var ajw = aj + bj.angle;
  np.enableFriction = cm.friction > 0;
  var reducedMass;
  if (bi.type === Body.STATIC || bi.type === Body.KINEMATIC) {
    reducedMass = bj.mass;
  } else if (bj.type === Body.STATIC || bj.type === Body.KINEMATIC) {
    reducedMass = bi.mass;
  } else {
    reducedMass = bi.mass * bj.mass / (bi.mass + bj.mass);
  }
  np.slipForce = cm.friction * glen * reducedMass;
  np.currentContactMaterial = cm;
  np.enabledEquations = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;
  var resolver = np[si.type | sj.type], numContacts = 0;
  if (resolver) {
    var sensor = si.sensor || sj.sensor;
    var numFrictionBefore = np.frictionEquations.length;
    if (si.type < sj.type) {
      numContacts = resolver.call(np, bi, si, xiw, aiw, bj, sj, xjw, ajw, sensor);
    } else {
      numContacts = resolver.call(np, bj, sj, xjw, ajw, bi, si, xiw, aiw, sensor);
    }
    var numFrictionEquations = np.frictionEquations.length - numFrictionBefore;
    if (numContacts) {
      if (bi.allowSleep && bi.type === Body.DYNAMIC && bi.sleepState === Body.SLEEPING && bj.sleepState === Body.AWAKE && bj.type !== Body.STATIC) {
        var speedSquaredB = vec2.squaredLength(bj.velocity) + Math.pow(bj.angularVelocity, 2);
        var speedLimitSquaredB = Math.pow(bj.sleepSpeedLimit, 2);
        if (speedSquaredB >= speedLimitSquaredB * 2) {
          bi._wakeUpAfterNarrowphase = true;
        }
      }
      if (bj.allowSleep && bj.type === Body.DYNAMIC && bj.sleepState === Body.SLEEPING && bi.sleepState === Body.AWAKE && bi.type !== Body.STATIC) {
        var speedSquaredA = vec2.squaredLength(bi.velocity) + Math.pow(bi.angularVelocity, 2);
        var speedLimitSquaredA = Math.pow(bi.sleepSpeedLimit, 2);
        if (speedSquaredA >= speedLimitSquaredA * 2) {
          bj._wakeUpAfterNarrowphase = true;
        }
      }
      world.overlapKeeper.setOverlapping(bi, si, bj, sj);
      if (world.has("beginContact") && world.overlapKeeper.isNewOverlap(si, sj)) {
        var e = beginContactEvent;
        e.shapeA = si;
        e.shapeB = sj;
        e.bodyA = bi;
        e.bodyB = bj;
        e.contactEquations.length = 0;
        if (!sensor) {
          for (var i = np.contactEquations.length - numContacts; i < np.contactEquations.length; i++) {
            e.contactEquations.push(np.contactEquations[i]);
          }
        }
        world.emit(e);
      }
      if (!sensor && numFrictionEquations > 1) {
        for (var i = np.frictionEquations.length - numFrictionEquations; i < np.frictionEquations.length; i++) {
          var f = np.frictionEquations[i];
          f.setSlipForce(f.getSlipForce() / numFrictionEquations);
        }
      }
    }
  }
}
World.prototype.addSpring = function(spring) {
  if (this.stepping) {
    throw new Error("Springs cannot be added during step.");
  }
  this.springs.push(spring);
  addSpringEvent.spring = spring;
  this.emit(addSpringEvent);
  addSpringEvent.spring = null;
};
World.prototype.removeSpring = function(spring) {
  if (this.stepping) {
    throw new Error("Springs cannot be removed during step.");
  }
  arrayRemove(this.springs, spring);
};
World.prototype.addBody = function(body) {
  if (this.stepping) {
    throw new Error("Bodies cannot be added during step.");
  }
  if (body.world) {
    throw new Error("Body is already added to a World.");
  }
  body.index = this.bodies.length;
  this.bodies.push(body);
  body.world = this;
  addBodyEvent.body = body;
  this.emit(addBodyEvent);
  addBodyEvent.body = null;
};
World.prototype.removeBody = function(body) {
  if (this.stepping) {
    throw new Error("Bodies cannot be removed during step.");
  }
  var constraints = this.constraints;
  var l2 = constraints.length;
  while (l2--) {
    if (constraints[l2].bodyA === this || constraints[l2].bodyB === this) {
      throw new Error("Cannot remove Body from World: it still has constraints connected to it.");
    }
  }
  body.world = null;
  var bodies = this.bodies;
  arrayRemove(bodies, body);
  body.index = -1;
  var l2 = bodies.length;
  while (l2--) {
    bodies[l2].index = l2;
  }
  removeBodyEvent.body = body;
  body.resetConstraintVelocity();
  this.emit(removeBodyEvent);
  removeBodyEvent.body = null;
  var pairs = this.disabledBodyCollisionPairs;
  var i = 0;
  while (i < pairs.length) {
    if (pairs[i] === body || pairs[i + 1] === body) {
      pairs.splice(i, 2);
    } else {
      i += 2;
    }
  }
};
World.prototype.getBodyById = function(id) {
  var bodies = this.bodies;
  for (var i = 0; i < bodies.length; i++) {
    var b = bodies[i];
    if (b.id === id) {
      return b;
    }
  }
  return false;
};
World.prototype.disableBodyCollision = function(bodyA, bodyB) {
  this.disabledBodyCollisionPairs.push(bodyA, bodyB);
};
World.prototype.enableBodyCollision = function(bodyA, bodyB) {
  var pairs = this.disabledBodyCollisionPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    if (pairs[i] === bodyA && pairs[i + 1] === bodyB || pairs[i + 1] === bodyA && pairs[i] === bodyB) {
      pairs.splice(i, 2);
      return;
    }
  }
};
World.prototype.clear = function() {
  this.solver.removeAllEquations();
  var cs = this.constraints;
  var i = cs.length;
  while (i--) {
    this.removeConstraint(cs[i]);
  }
  var bodies = this.bodies;
  i = bodies.length;
  while (i--) {
    this.removeBody(bodies[i]);
  }
  var springs = this.springs;
  i = springs.length;
  while (i--) {
    this.removeSpring(springs[i]);
  }
  var cms = this.contactMaterials;
  i = cms.length;
  while (i--) {
    this.removeContactMaterial(cms[i]);
  }
};
var hitTest_tmp1 = vec2.create();
var hitTest_tmp2 = vec2.create();
World.prototype.hitTest = function(worldPoint, bodies, precision) {
  precision = precision || 0;
  var shapeWorldPosition = hitTest_tmp1, shapeLocalPoint = hitTest_tmp2;
  var result2 = [];
  for (var i = 0, N = bodies.length; i !== N; i++) {
    var body = bodies[i];
    for (var j = 0, NS = body.shapes.length; j !== NS; j++) {
      var shape = body.shapes[j];
      shape.worldPointToLocal(shapeLocalPoint, worldPoint);
      if (shape.pointTest(shapeLocalPoint)) {
        result2.push(body);
      } else {
        vec2.rotate(shapeWorldPosition, shape.position, body.angle);
        vec2.add(shapeWorldPosition, shapeWorldPosition, body.position);
        if (shape.type === Shape.PARTICLE && vec2.squaredDistance(shapeWorldPosition, worldPoint) < precision * precision) {
          result2.push(body);
        }
      }
    }
  }
  return result2;
};
World.prototype.setGlobalStiffness = function(stiffness) {
  setGlobalEquationParams(this, {
    stiffness
  });
  var contactMaterials = this.contactMaterials;
  for (var i = 0; i !== contactMaterials.length; i++) {
    var c = contactMaterials[i];
    c.stiffness = c.frictionStiffness = stiffness;
  }
  var c = this.defaultContactMaterial;
  c.stiffness = c.frictionStiffness = stiffness;
};
World.prototype.setGlobalRelaxation = function(relaxation) {
  setGlobalEquationParams(this, {
    relaxation
  });
  for (var i = 0; i !== this.contactMaterials.length; i++) {
    var c = this.contactMaterials[i];
    c.relaxation = c.frictionRelaxation = relaxation;
  }
  var c = this.defaultContactMaterial;
  c.relaxation = c.frictionRelaxation = relaxation;
};
function setGlobalEquationParams(world, params) {
  var constraints = world.constraints;
  for (var i = 0; i !== constraints.length; i++) {
    var c = constraints[i];
    var eqs = c.equations;
    for (var j = 0; j !== eqs.length; j++) {
      var eq = eqs[j];
      eq.relaxation = params.relaxation !== void 0 ? params.relaxation : eq.relaxation;
      eq.stiffness = params.stiffness !== void 0 ? params.stiffness : eq.stiffness;
      eq.needsUpdate = true;
    }
  }
}
var tmpAABB = new AABB();
var tmpArray = [];
World.prototype.raycast = function(result2, ray2) {
  ray2.getAABB(tmpAABB);
  this.broadphase.aabbQuery(this, tmpAABB, tmpArray);
  ray2.intersectBodies(result2, tmpArray);
  tmpArray.length = 0;
  return result2.hasHit();
};
p2.exports = {
  AABB: AABB_1,
  AngleLockEquation: AngleLockEquation_1,
  Body: Body_1,
  Broadphase: Broadphase_1,
  Capsule: Capsule_1,
  Circle: Circle_1,
  Constraint: Constraint_1,
  ContactEquation: ContactEquation_1,
  ContactEquationPool: ContactEquationPool_1,
  ContactMaterial: ContactMaterial_1,
  Convex: Convex_1,
  DistanceConstraint: DistanceConstraint_1,
  Equation: Equation_1,
  EventEmitter: EventEmitter_1,
  FrictionEquation: FrictionEquation_1,
  FrictionEquationPool: FrictionEquationPool_1,
  GearConstraint: GearConstraint_1,
  GSSolver: GSSolver_1,
  Heightfield: Heightfield_1,
  Line: Line_1,
  LockConstraint: LockConstraint_1,
  Material: Material_1,
  Narrowphase: Narrowphase_1,
  NaiveBroadphase: NaiveBroadphase_1,
  Particle: Particle_1,
  Plane: Plane_1,
  Pool: Pool_1,
  RevoluteConstraint: RevoluteConstraint_1,
  PrismaticConstraint: PrismaticConstraint_1,
  Ray: Ray_1,
  RaycastResult: RaycastResult_1,
  Box: Box_1,
  RotationalVelocityEquation: RotationalVelocityEquation_1,
  SAPBroadphase: SAPBroadphase_1,
  Shape: Shape_1,
  Solver: Solver_1,
  Spring: Spring_1,
  TopDownVehicle: TopDownVehicle_1,
  LinearSpring: LinearSpring_1,
  RotationalSpring: RotationalSpring_1,
  Utils: Utils_1,
  World: World_1,
  vec2: vec2$q.exports,
  version: "0.7.1"
};
var _box$1 = new Box3();
var _vector = new Vector3();
var LineSegmentsGeometry = class extends InstancedBufferGeometry {
  constructor() {
    super();
    this.type = "LineSegmentsGeometry";
    const positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
    const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
    const index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
    this.setIndex(index);
    this.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }
  applyMatrix4(matrix) {
    const start = this.attributes.instanceStart;
    const end2 = this.attributes.instanceEnd;
    if (start !== void 0) {
      start.applyMatrix4(matrix);
      end2.applyMatrix4(matrix);
      start.needsUpdate = true;
    }
    if (this.boundingBox !== null) {
      this.computeBoundingBox();
    }
    if (this.boundingSphere !== null) {
      this.computeBoundingSphere();
    }
    return this;
  }
  setPositions(array) {
    let lineSegments;
    if (array instanceof Float32Array) {
      lineSegments = array;
    } else if (Array.isArray(array)) {
      lineSegments = new Float32Array(array);
    }
    const instanceBuffer = new InstancedInterleavedBuffer(lineSegments, 6, 1);
    this.setAttribute("instanceStart", new InterleavedBufferAttribute(instanceBuffer, 3, 0));
    this.setAttribute("instanceEnd", new InterleavedBufferAttribute(instanceBuffer, 3, 3));
    this.computeBoundingBox();
    this.computeBoundingSphere();
    return this;
  }
  setColors(array) {
    let colors;
    if (array instanceof Float32Array) {
      colors = array;
    } else if (Array.isArray(array)) {
      colors = new Float32Array(array);
    }
    const instanceColorBuffer = new InstancedInterleavedBuffer(colors, 6, 1);
    this.setAttribute("instanceColorStart", new InterleavedBufferAttribute(instanceColorBuffer, 3, 0));
    this.setAttribute("instanceColorEnd", new InterleavedBufferAttribute(instanceColorBuffer, 3, 3));
    return this;
  }
  fromWireframeGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array);
    return this;
  }
  fromEdgesGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array);
    return this;
  }
  fromMesh(mesh) {
    this.fromWireframeGeometry(new WireframeGeometry(mesh.geometry));
    return this;
  }
  fromLineSegments(lineSegments) {
    const geometry = lineSegments.geometry;
    if (geometry.isGeometry) {
      console.error("THREE.LineSegmentsGeometry no longer supports Geometry. Use THREE.BufferGeometry instead.");
      return;
    } else if (geometry.isBufferGeometry) {
      this.setPositions(geometry.attributes.position.array);
    }
    return this;
  }
  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3();
    }
    const start = this.attributes.instanceStart;
    const end2 = this.attributes.instanceEnd;
    if (start !== void 0 && end2 !== void 0) {
      this.boundingBox.setFromBufferAttribute(start);
      _box$1.setFromBufferAttribute(end2);
      this.boundingBox.union(_box$1);
    }
  }
  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }
    if (this.boundingBox === null) {
      this.computeBoundingBox();
    }
    const start = this.attributes.instanceStart;
    const end2 = this.attributes.instanceEnd;
    if (start !== void 0 && end2 !== void 0) {
      const center = this.boundingSphere.center;
      this.boundingBox.getCenter(center);
      let maxRadiusSq = 0;
      for (let i = 0, il = start.count; i < il; i++) {
        _vector.fromBufferAttribute(start, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
        _vector.fromBufferAttribute(end2, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
      }
      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
      if (isNaN(this.boundingSphere.radius)) {
        console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.", this);
      }
    }
  }
  toJSON() {
  }
  applyMatrix(matrix) {
    console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().");
    return this.applyMatrix4(matrix);
  }
};
LineSegmentsGeometry.prototype.isLineSegmentsGeometry = true;
UniformsLib.line = {
  worldUnits: {
    value: 1
  },
  linewidth: {
    value: 1
  },
  resolution: {
    value: new Vector2(1, 1)
  },
  dashOffset: {
    value: 0
  },
  dashScale: {
    value: 1
  },
  dashSize: {
    value: 1
  },
  gapSize: {
    value: 1
  }
  // todo FIX - maybe change to totalSize
};
ShaderLib["line"] = {
  uniforms: UniformsUtils.merge([UniformsLib.common, UniformsLib.fog, UniformsLib.line]),
  vertexShader: (
    /* glsl */
    `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segements overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`
  ),
  fragmentShader: (
    /* glsl */
    `
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`
  )
};
var LineMaterial = class extends ShaderMaterial {
  constructor(parameters) {
    super({
      type: "LineMaterial",
      uniforms: UniformsUtils.clone(ShaderLib["line"].uniforms),
      vertexShader: ShaderLib["line"].vertexShader,
      fragmentShader: ShaderLib["line"].fragmentShader,
      clipping: true
      // required for clipping support
    });
    Object.defineProperties(this, {
      color: {
        enumerable: true,
        get: function() {
          return this.uniforms.diffuse.value;
        },
        set: function(value) {
          this.uniforms.diffuse.value = value;
        }
      },
      worldUnits: {
        enumerable: true,
        get: function() {
          return "WORLD_UNITS" in this.defines;
        },
        set: function(value) {
          if (value === true) {
            this.defines.WORLD_UNITS = "";
          } else {
            delete this.defines.WORLD_UNITS;
          }
        }
      },
      linewidth: {
        enumerable: true,
        get: function() {
          return this.uniforms.linewidth.value;
        },
        set: function(value) {
          this.uniforms.linewidth.value = value;
        }
      },
      dashed: {
        enumerable: true,
        get: function() {
          return Boolean("USE_DASH" in this.defines);
        },
        set(value) {
          if (Boolean(value) !== Boolean("USE_DASH" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_DASH = "";
          } else {
            delete this.defines.USE_DASH;
          }
        }
      },
      dashScale: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashScale.value;
        },
        set: function(value) {
          this.uniforms.dashScale.value = value;
        }
      },
      dashSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashSize.value;
        },
        set: function(value) {
          this.uniforms.dashSize.value = value;
        }
      },
      dashOffset: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashOffset.value;
        },
        set: function(value) {
          this.uniforms.dashOffset.value = value;
        }
      },
      gapSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.gapSize.value;
        },
        set: function(value) {
          this.uniforms.gapSize.value = value;
        }
      },
      opacity: {
        enumerable: true,
        get: function() {
          return this.uniforms.opacity.value;
        },
        set: function(value) {
          this.uniforms.opacity.value = value;
        }
      },
      resolution: {
        enumerable: true,
        get: function() {
          return this.uniforms.resolution.value;
        },
        set: function(value) {
          this.uniforms.resolution.value.copy(value);
        }
      },
      alphaToCoverage: {
        enumerable: true,
        get: function() {
          return Boolean("USE_ALPHA_TO_COVERAGE" in this.defines);
        },
        set: function(value) {
          if (Boolean(value) !== Boolean("USE_ALPHA_TO_COVERAGE" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_ALPHA_TO_COVERAGE = "";
            this.extensions.derivatives = true;
          } else {
            delete this.defines.USE_ALPHA_TO_COVERAGE;
            this.extensions.derivatives = false;
          }
        }
      }
    });
    this.setValues(parameters);
  }
};
LineMaterial.prototype.isLineMaterial = true;
var _start = new Vector3();
var _end = new Vector3();
var _start4 = new Vector4();
var _end4 = new Vector4();
var _ssOrigin = new Vector4();
var _ssOrigin3 = new Vector3();
var _mvMatrix = new Matrix4();
var _line = new Line3();
var _closestPoint = new Vector3();
var _box = new Box3();
var _sphere = new Sphere();
var _clipToWorldVector = new Vector4();
function getWorldSpaceHalfWidth(camera, distance, lineWidth, resolution) {
  _clipToWorldVector.set(0, 0, -distance, 1).applyMatrix4(camera.projectionMatrix);
  _clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
  _clipToWorldVector.x = lineWidth / resolution.width;
  _clipToWorldVector.y = lineWidth / resolution.height;
  _clipToWorldVector.applyMatrix4(camera.projectionMatrixInverse);
  _clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
  return Math.abs(Math.max(_clipToWorldVector.x, _clipToWorldVector.y));
}
var LineSegments2 = class extends Mesh {
  constructor(geometry, material) {
    if (geometry === void 0) {
      geometry = new LineSegmentsGeometry();
    }
    if (material === void 0) {
      material = new LineMaterial({
        color: Math.random() * 16777215
      });
    }
    super(geometry, material);
    this.type = "LineSegments2";
  }
  // for backwards-compatability, but could be a method of LineSegmentsGeometry...
  computeLineDistances() {
    const geometry = this.geometry;
    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const lineDistances = new Float32Array(2 * instanceStart.count);
    for (let i = 0, j = 0, l2 = instanceStart.count; i < l2; i++, j += 2) {
      _start.fromBufferAttribute(instanceStart, i);
      _end.fromBufferAttribute(instanceEnd, i);
      lineDistances[j] = j === 0 ? 0 : lineDistances[j - 1];
      lineDistances[j + 1] = lineDistances[j] + _start.distanceTo(_end);
    }
    const instanceDistanceBuffer = new InstancedInterleavedBuffer(lineDistances, 2, 1);
    geometry.setAttribute("instanceDistanceStart", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
    geometry.setAttribute("instanceDistanceEnd", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
    return this;
  }
  raycast(raycaster, intersects) {
    if (raycaster.camera === null) {
      console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2.');
    }
    const threshold = raycaster.params.Line2 !== void 0 ? raycaster.params.Line2.threshold || 0 : 0;
    const ray2 = raycaster.ray;
    const camera = raycaster.camera;
    const projectionMatrix = camera.projectionMatrix;
    const matrixWorld = this.matrixWorld;
    const geometry = this.geometry;
    const material = this.material;
    const resolution = material.resolution;
    const lineWidth = material.linewidth + threshold;
    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const near = -camera.near;
    if (geometry.boundingSphere === null) {
      geometry.computeBoundingSphere();
    }
    _sphere.copy(geometry.boundingSphere).applyMatrix4(matrixWorld);
    const distanceToSphere = Math.max(camera.near, _sphere.distanceToPoint(ray2.origin));
    const sphereMargin = getWorldSpaceHalfWidth(camera, distanceToSphere, lineWidth, resolution);
    _sphere.radius += sphereMargin;
    if (raycaster.ray.intersectsSphere(_sphere) === false) {
      return;
    }
    if (geometry.boundingBox === null) {
      geometry.computeBoundingBox();
    }
    _box.copy(geometry.boundingBox).applyMatrix4(matrixWorld);
    const distanceToBox = Math.max(camera.near, _box.distanceToPoint(ray2.origin));
    const boxMargin = getWorldSpaceHalfWidth(camera, distanceToBox, lineWidth, resolution);
    _box.max.x += boxMargin;
    _box.max.y += boxMargin;
    _box.max.z += boxMargin;
    _box.min.x -= boxMargin;
    _box.min.y -= boxMargin;
    _box.min.z -= boxMargin;
    if (raycaster.ray.intersectsBox(_box) === false) {
      return;
    }
    ray2.at(1, _ssOrigin);
    _ssOrigin.w = 1;
    _ssOrigin.applyMatrix4(camera.matrixWorldInverse);
    _ssOrigin.applyMatrix4(projectionMatrix);
    _ssOrigin.multiplyScalar(1 / _ssOrigin.w);
    _ssOrigin.x *= resolution.x / 2;
    _ssOrigin.y *= resolution.y / 2;
    _ssOrigin.z = 0;
    _ssOrigin3.copy(_ssOrigin);
    _mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
    for (let i = 0, l2 = instanceStart.count; i < l2; i++) {
      _start4.fromBufferAttribute(instanceStart, i);
      _end4.fromBufferAttribute(instanceEnd, i);
      _start4.w = 1;
      _end4.w = 1;
      _start4.applyMatrix4(_mvMatrix);
      _end4.applyMatrix4(_mvMatrix);
      var isBehindCameraNear = _start4.z > near && _end4.z > near;
      if (isBehindCameraNear) {
        continue;
      }
      if (_start4.z > near) {
        const deltaDist = _start4.z - _end4.z;
        const t2 = (_start4.z - near) / deltaDist;
        _start4.lerp(_end4, t2);
      } else if (_end4.z > near) {
        const deltaDist = _end4.z - _start4.z;
        const t2 = (_end4.z - near) / deltaDist;
        _end4.lerp(_start4, t2);
      }
      _start4.applyMatrix4(projectionMatrix);
      _end4.applyMatrix4(projectionMatrix);
      _start4.multiplyScalar(1 / _start4.w);
      _end4.multiplyScalar(1 / _end4.w);
      _start4.x *= resolution.x / 2;
      _start4.y *= resolution.y / 2;
      _end4.x *= resolution.x / 2;
      _end4.y *= resolution.y / 2;
      _line.start.copy(_start4);
      _line.start.z = 0;
      _line.end.copy(_end4);
      _line.end.z = 0;
      const param = _line.closestPointToPointParameter(_ssOrigin3, true);
      _line.at(param, _closestPoint);
      const zPos = MathUtils.lerp(_start4.z, _end4.z, param);
      const isInClipSpace = zPos >= -1 && zPos <= 1;
      const isInside = _ssOrigin3.distanceTo(_closestPoint) < lineWidth * 0.5;
      if (isInClipSpace && isInside) {
        _line.start.fromBufferAttribute(instanceStart, i);
        _line.end.fromBufferAttribute(instanceEnd, i);
        _line.start.applyMatrix4(matrixWorld);
        _line.end.applyMatrix4(matrixWorld);
        const pointOnLine = new Vector3();
        const point = new Vector3();
        ray2.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
        intersects.push({
          point,
          pointOnLine,
          distance: ray2.origin.distanceTo(point),
          object: this,
          face: null,
          faceIndex: i,
          uv: null,
          uv2: null
        });
      }
    }
  }
};
LineSegments2.prototype.isLineSegments2 = true;
var LineGeometry = class extends LineSegmentsGeometry {
  constructor() {
    super();
    this.type = "LineGeometry";
  }
  setPositions(array) {
    var length = array.length - 3;
    var points2 = new Float32Array(2 * length);
    for (var i = 0; i < length; i += 3) {
      points2[2 * i] = array[i];
      points2[2 * i + 1] = array[i + 1];
      points2[2 * i + 2] = array[i + 2];
      points2[2 * i + 3] = array[i + 3];
      points2[2 * i + 4] = array[i + 4];
      points2[2 * i + 5] = array[i + 5];
    }
    super.setPositions(points2);
    return this;
  }
  setColors(array) {
    var length = array.length - 3;
    var colors = new Float32Array(2 * length);
    for (var i = 0; i < length; i += 3) {
      colors[2 * i] = array[i];
      colors[2 * i + 1] = array[i + 1];
      colors[2 * i + 2] = array[i + 2];
      colors[2 * i + 3] = array[i + 3];
      colors[2 * i + 4] = array[i + 4];
      colors[2 * i + 5] = array[i + 5];
    }
    super.setColors(colors);
    return this;
  }
  fromLine(line) {
    var geometry = line.geometry;
    if (geometry.isGeometry) {
      console.error("THREE.LineGeometry no longer supports Geometry. Use THREE.BufferGeometry instead.");
      return;
    } else if (geometry.isBufferGeometry) {
      this.setPositions(geometry.attributes.position.array);
    }
    return this;
  }
};
LineGeometry.prototype.isLineGeometry = true;
var Line2 = class extends LineSegments2 {
  constructor(geometry, material) {
    if (geometry === void 0) {
      geometry = new LineGeometry();
    }
    if (material === void 0) {
      material = new LineMaterial({
        color: Math.random() * 16777215
      });
    }
    super(geometry, material);
    this.type = "Line2";
  }
};
Line2.prototype.isLine2 = true;
function CannonDebugger(scene, world, _temp) {
  let {
    color = 16777215,
    linewidth = 2e-3,
    normalIndex = 0,
    onInit,
    onUpdate,
    scale: scale2 = 1
  } = _temp === void 0 ? {} : _temp;
  const _meshes = [];
  const _tempVec0 = p2.exports.vec2.create();
  const _tempVec1 = p2.exports.vec2.create();
  const _tempVec2 = [0, 0];
  const _lineMaterial = new LineMaterial({
    color,
    depthTest: false,
    depthWrite: false,
    linewidth,
    transparent: true
  });
  const _normal = [0, 0, 0];
  _normal.splice(normalIndex, 1, 1);
  const _boxPoints = new Array(5).fill({}).map((u, i) => {
    const arr = [1 / Math.sqrt(2) * Math.cos(i * 2 * Math.PI / 4 + Math.PI / 4), 1 / Math.sqrt(2) * Math.sin(i * 2 * Math.PI / 4 + Math.PI / 4)];
    arr.splice(normalIndex, 0, 0);
    return arr;
  });
  const _boxGeometry = new LineGeometry().setPositions(_boxPoints.flat(1));
  const _circlePrecision = 24;
  const _circlePoints = new Array(_circlePrecision + 1).fill({}).map((u, i) => {
    const arr = [Math.cos(i * 2 * Math.PI / _circlePrecision), Math.sin(i * 2 * Math.PI / _circlePrecision)];
    arr.splice(normalIndex, 0, 0);
    return arr;
  });
  const _circleGeometry = new LineGeometry().setPositions(_circlePoints.flat(1));
  const _capsulePoints = new Array(_circlePrecision + 1).fill({}).map((u, i) => {
    const arr = [Math.sin(i * 2 * Math.PI / _circlePrecision), -Math.cos(i * 2 * Math.PI / _circlePrecision)];
    arr.splice(normalIndex, 0, 0);
    return arr;
  });
  _capsulePoints.splice(_circlePrecision / 2, 0, _capsulePoints[_circlePrecision / 2]);
  _capsulePoints.push(_capsulePoints[0]);
  const _capsuleGeometry = new LineGeometry().setPositions(_capsulePoints.flat(1));
  const _particlePrecision = 6;
  const _particleRadius = 0.05;
  const _particlePoints = new Array(_particlePrecision + 1).fill({}).map((u, i) => {
    const arr = [_particleRadius * Math.cos(i * 2 * Math.PI / _particlePrecision), _particleRadius * Math.sin(i * 2 * Math.PI / _particlePrecision)];
    arr.splice(normalIndex, 0, 0);
    return arr;
  });
  const _particleGeometry = new LineGeometry().setPositions(_particlePoints.flat(1));
  const _linePositions = [[-0.5, 0], [0.5, 0]].map((v2) => {
    const temp2 = [...v2];
    temp2.splice(normalIndex, 0, 0);
    return temp2;
  });
  const _lineGeometry = new LineGeometry().setPositions(_linePositions.flat(1));
  function createMesh(shape) {
    let mesh = new Mesh();
    const {
      BOX,
      CAPSULE,
      CIRCLE,
      CONVEX,
      HEIGHTFIELD,
      LINE,
      PARTICLE,
      PLANE
    } = p2.exports.Shape;
    switch (shape.type) {
      case BOX: {
        mesh = new Line2(_boxGeometry, _lineMaterial);
        break;
      }
      case CAPSULE: {
        mesh = new Line2(_capsuleGeometry, _lineMaterial);
        break;
      }
      case CIRCLE: {
        mesh = new Line2(_circleGeometry, _lineMaterial);
        break;
      }
      case CONVEX: {
        const positions = [];
        shape.vertices.map((v2) => {
          const w = [...v2];
          w.splice(normalIndex, 0, 0);
          positions.push(w);
        });
        positions.push(positions[0]);
        const _convexGeometry = new LineGeometry().setPositions(positions.flat(1));
        mesh = new Line2(_convexGeometry, _lineMaterial);
        break;
      }
      case HEIGHTFIELD: {
        const positions = [];
        shape.heights.map((v2, i) => {
          const w = [i * shape.elementWidth, v2];
          w.splice(normalIndex, 0, 0);
          positions.push(w);
        });
        const _geometry = new LineGeometry().setPositions(positions.flat(1));
        mesh = new Line2(_geometry, _lineMaterial);
        break;
      }
      case LINE:
      case PLANE: {
        mesh = new Line2(_lineGeometry, _lineMaterial);
        break;
      }
      case PARTICLE: {
        mesh = new Line2(_particleGeometry, _lineMaterial);
        break;
      }
    }
    scene.add(mesh);
    return mesh;
  }
  function scaleMesh(mesh, shape) {
    const {
      BOX,
      CAPSULE,
      CIRCLE,
      LINE,
      PLANE
    } = p2.exports.Shape;
    switch (shape.type) {
      case BOX: {
        const scale3 = [shape.width, shape.height];
        scale3.splice(normalIndex, 0, 1);
        mesh.scale.set(...scale3);
        break;
      }
      case CAPSULE: {
        const {
          length,
          radius
        } = shape;
        const positions = _capsulePoints.flat(1);
        for (let i = 0, l2 = positions.length; i < l2; i++) {
          positions[i] *= radius;
          if (i % 3 === 0) positions[i] += length / 2 * (i > l2 / 2 - 1 && i < l2 - 3 ? -1 : 1);
        }
        mesh.geometry = new LineGeometry().setPositions(positions);
        break;
      }
      case CIRCLE: {
        const {
          radius
        } = shape;
        mesh.scale.set(radius * scale2, radius * scale2, radius * scale2);
        break;
      }
      case LINE: {
        const {
          length
        } = shape;
        mesh.scale.set(length * scale2, length * scale2, length * scale2);
        break;
      }
      case PLANE: {
        mesh.scale.set(100 * scale2, 100 * scale2, 100 * scale2);
        break;
      }
    }
  }
  function typeMatch(mesh) {
    if (!mesh) return false;
    return mesh.type === "Line2";
  }
  function updateMesh(index, shape) {
    let mesh = _meshes[index];
    let didCreateNewMesh = false;
    if (!typeMatch(mesh)) {
      if (mesh) scene.remove(mesh);
      _meshes[index] = mesh = createMesh(shape);
      didCreateNewMesh = true;
    }
    scaleMesh(mesh, shape);
    return didCreateNewMesh;
  }
  function update() {
    const meshes = _meshes;
    const shapeOffset = _tempVec0;
    const shapeWorldPosition = _tempVec1;
    const shape3position = _tempVec2;
    let meshIndex = 0;
    for (const body of world.bodies) {
      for (let i = 0; i !== body.shapes.length; i++) {
        const shape = body.shapes[i];
        const didCreateNewMesh = updateMesh(meshIndex, shape);
        const mesh = meshes[meshIndex];
        if (mesh) {
          p2.exports.vec2.rotate(shapeOffset, shape.position, body.angle);
          p2.exports.vec2.add(shapeWorldPosition, body.position, shapeOffset);
          p2.exports.vec2.copy(shape3position, shapeWorldPosition);
          shape3position.splice(normalIndex, 0, 0);
          mesh.position.set(...shape3position);
          const s2 = Math.sin(body.angle * 0.5);
          mesh.quaternion.set(s2 * _normal[0], s2 * _normal[1], s2 * _normal[2], Math.cos(body.angle * 0.5));
          if (didCreateNewMesh && onInit instanceof Function) onInit(body, mesh, shape);
          if (!didCreateNewMesh && onUpdate instanceof Function) onUpdate(body, mesh, shape);
        }
        meshIndex++;
      }
    }
    for (let i = meshIndex; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (mesh) scene.remove(mesh);
    }
    meshes.length = meshIndex;
  }
  return {
    update
  };
}
function createShape(type, args) {
  switch (type) {
    case "Box":
      return new p2.exports.Box({
        height: args[1],
        width: args[0]
      });
    case "Capsule":
      return new p2.exports.Capsule({
        length: args[0],
        radius: args[1]
      });
    case "Circle":
      return new p2.exports.Circle({
        radius: args[0]
      });
    case "Convex":
      return new p2.exports.Convex({
        axes: args[1],
        vertices: args[0]
      });
    case "Particle":
      return new p2.exports.Particle();
    case "Plane":
      return new p2.exports.Plane();
    case "Line":
      return new p2.exports.Line({
        length: args[0]
      });
    case "Heightfield":
      return new p2.exports.Heightfield({
        elementWidth: args[1].elementWidth,
        heights: args[0]
      });
  }
}
var propsToBody = (options) => {
  const {
    uuid,
    props,
    type,
    createMaterial = (materialOptions) => new p2.exports.Material(materialOptions)
  } = options;
  const {
    args = [],
    position = [0, 0],
    angle = 0,
    velocity = [0, 0],
    angularVelocity = 0,
    type: bodyType,
    isTrigger,
    mass,
    material,
    shapes,
    onCollide,
    collisionResponse,
    collisionGroup = -1,
    ...extra
  } = props;
  const body = new p2.exports.Body({
    ...extra,
    mass: bodyType === "Static" ? 0 : mass,
    material: material ? createMaterial(material) : void 0,
    type: bodyType ? p2.exports.Body[bodyType.toUpperCase()] : void 0
  });
  body.uuid = uuid;
  if (collisionResponse !== void 0) {
    body.collisionResponse = collisionResponse;
  }
  if (type === "Compound") {
    shapes.forEach((_ref, i) => {
      let {
        type: type2,
        args: args2,
        position: position2,
        angle: angle2,
        material: material2,
        ...extra2
      } = _ref;
      body.addShape(createShape(type2, args2), position2 ? p2.exports.vec2.fromValues(...position2) : void 0, angle2);
      if (material2) body.shapes[i].material = createMaterial(material2);
      if (isTrigger) body.shapes[i].sensor = isTrigger;
      Object.assign(body, extra2);
    });
  } else {
    const shape = createShape(type, args);
    shape.collisionGroup = collisionGroup;
    if (material) shape.material = createMaterial(material);
    if (isTrigger) shape.sensor = isTrigger;
    body.addShape(shape);
  }
  p2.exports.vec2.set(body.position, position[0], position[1]);
  body.angle = angle;
  p2.exports.vec2.set(body.velocity, velocity[0], velocity[1]);
  body.angularVelocity = angularVelocity;
  return body;
};
var propsToBody$1 = propsToBody;
var v = new Vector3();
var s = new Vector3(1, 1, 1);
var q = new Quaternion();
var _v = [];
var Debug = (_ref) => {
  let {
    children,
    color = 16777215,
    normalIndex = 0,
    linewidth = 2e-3,
    scale: scale2 = 1,
    impl = CannonDebugger
  } = _ref;
  const [{
    bodies,
    bodyMap
  }] = (0, import_react.useState)({
    bodies: [],
    bodyMap: {}
  });
  const {
    refs
  } = (0, import_react.useContext)(context);
  const [scene] = (0, import_react.useState)(() => new Scene());
  const p2DebuggerRef = (0, import_react.useRef)(impl(scene, {
    bodies
  }, {
    color,
    linewidth,
    normalIndex,
    scale: scale2
  }));
  const euler = new Euler();
  const order = ["XYZ", "YZX", "ZXY"];
  useFrame(() => {
    for (const uuid in bodyMap) {
      refs[uuid].matrix.decompose(v, q, s);
      _v = [v.x, v.y, v.z];
      _v.splice(normalIndex, 1);
      p2.exports.vec2.set(bodyMap[uuid].position, _v[0], _v[1]);
      euler.setFromQuaternion(q, order[normalIndex]);
      bodyMap[uuid].angle = euler.toArray()[normalIndex];
    }
    p2DebuggerRef.current.update();
  });
  const api = (0, import_react.useMemo)(() => ({
    add(uuid, props, type) {
      const body = propsToBody$1({
        props,
        type,
        uuid
      });
      bodies.push(body);
      bodyMap[uuid] = body;
    },
    remove(uuid) {
      const index = bodies.indexOf(bodyMap[uuid]);
      if (index !== -1) bodies.splice(index, 1);
      delete bodyMap[uuid];
    }
  }), []);
  return (0, import_jsx_runtime.jsxs)(debugContext.Provider, {
    value: api,
    children: [(0, import_jsx_runtime.jsx)("primitive", {
      object: scene
    }), children]
  });
};
var temp = new Object3D();
function useForwardedRef(ref) {
  const nullRef = (0, import_react.useRef)(null);
  return ref && typeof ref !== "function" ? ref : nullRef;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getUUID(ref, index) {
  const suffix = index === void 0 ? "" : `/${index}`;
  if (typeof ref === "function") return null;
  return ref && ref.current && `${ref.current.uuid}${suffix}`;
}
var incrementingId = 0;
function subscribe(ref, worker, subscriptions, type, index, target) {
  if (target === void 0) {
    target = "bodies";
  }
  return (callback) => {
    const id = incrementingId++;
    subscriptions[id] = {
      [type]: callback
    };
    const uuid = getUUID(ref, index);
    uuid && worker.subscribe({
      props: {
        id,
        target,
        type
      },
      uuid
    });
    return () => {
      delete subscriptions[id];
      worker.unsubscribe({
        props: id
      });
    };
  };
}
function prepare(object, props) {
  object.userData = props.userData || {};
  object.updateMatrix();
}
function setupCollision(events, _ref, uuid) {
  let {
    onCollide,
    onCollideBegin,
    onCollideEnd
  } = _ref;
  events[uuid] = {
    collide: onCollide,
    collideBegin: onCollideBegin,
    collideEnd: onCollideEnd
  };
}
function useBody(type, fn, argsFn, fwdRef, deps) {
  if (deps === void 0) {
    deps = [];
  }
  const ref = useForwardedRef(fwdRef);
  const {
    worker,
    refs,
    events,
    subscriptions
  } = (0, import_react.useContext)(context);
  const debugApi = (0, import_react.useContext)(debugContext);
  (0, import_react.useLayoutEffect)(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }
    const object = ref.current;
    const currentWorker = worker;
    const objectCount = object instanceof InstancedMesh ? (object.instanceMatrix.setUsage(DynamicDrawUsage), object.count) : 1;
    const uuid = object instanceof InstancedMesh ? new Array(objectCount).fill(0).map((_, i) => `${object.uuid}/${i}`) : [object.uuid];
    const props = object instanceof InstancedMesh ? uuid.map((id, i) => {
      const props2 = fn(i);
      prepare(temp, props2);
      object.setMatrixAt(i, temp.matrix);
      object.instanceMatrix.needsUpdate = true;
      refs[id] = object;
      if (debugApi) debugApi.add(id, props2, type);
      setupCollision(events, props2, id);
      return {
        ...props2,
        args: argsFn(props2.args)
      };
    }) : uuid.map((id, i) => {
      const props2 = fn(i);
      prepare(object, props2);
      refs[id] = object;
      if (debugApi) debugApi.add(id, props2, type);
      setupCollision(events, props2, id);
      return {
        ...props2,
        args: argsFn(props2.args)
      };
    });
    currentWorker.addBodies({
      props: props.map((_ref2) => {
        let {
          onCollide,
          onCollideBegin,
          onCollideEnd,
          ...serializableProps
        } = _ref2;
        return {
          onCollide: Boolean(onCollide),
          ...serializableProps
        };
      }),
      type,
      uuid
    });
    return () => {
      uuid.forEach((id) => {
        delete refs[id];
        if (debugApi) debugApi.remove(id);
        delete events[id];
      });
      currentWorker.removeBodies({
        uuid
      });
    };
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    const makeAtomic = (type2, index) => {
      const op = `set${capitalize(type2)}`;
      return {
        set: (value) => {
          const uuid = getUUID(ref, index);
          uuid && worker[op]({
            props: value,
            uuid
          });
        },
        subscribe: subscribe(ref, worker, subscriptions, type2, index)
      };
    };
    const makeVec = (type2, index) => {
      const op = `set${capitalize(type2)}`;
      return {
        copy: (vec) => {
          const uuid = getUUID(ref, index);
          uuid && worker[op]({
            props: [vec[0], vec[1]],
            uuid
          });
        },
        set: (x, y) => {
          const uuid = getUUID(ref, index);
          uuid && worker[op]({
            props: [x, y],
            uuid
          });
        },
        subscribe: subscribe(ref, worker, subscriptions, type2, index)
      };
    };
    function makeApi(index) {
      return {
        allowSleep: makeAtomic("allowSleep", index),
        angle: makeAtomic("angle", index),
        angularDamping: makeAtomic("angularDamping", index),
        angularVelocity: makeAtomic("angularVelocity", index),
        applyForce(force, worldPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyForce({
            props: [force, worldPoint],
            uuid
          });
        },
        applyImpulse(impulse, worldPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyImpulse({
            props: [impulse, worldPoint],
            uuid
          });
        },
        applyLocalForce(force, localPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyLocalForce({
            props: [force, localPoint],
            uuid
          });
        },
        applyLocalImpulse(impulse, localPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyLocalImpulse({
            props: [impulse, localPoint],
            uuid
          });
        },
        applyTorque(torque) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyTorque({
            props: [torque],
            uuid
          });
        },
        collisionFilterGroup: makeAtomic("collisionFilterGroup", index),
        collisionFilterMask: makeAtomic("collisionFilterMask", index),
        collisionResponse: makeAtomic("collisionResponse", index),
        fixedRotation: makeAtomic("fixedRotation", index),
        isTrigger: makeAtomic("isTrigger", index),
        linearDamping: makeAtomic("linearDamping", index),
        mass: makeAtomic("mass", index),
        material: makeAtomic("material", index),
        position: makeVec("position", index),
        sleep() {
          const uuid = getUUID(ref, index);
          uuid && worker.sleep({
            uuid
          });
        },
        sleepSpeedLimit: makeAtomic("sleepSpeedLimit", index),
        sleepTimeLimit: makeAtomic("sleepTimeLimit", index),
        userData: makeAtomic("userData", index),
        velocity: makeVec("velocity", index),
        wakeUp() {
          const uuid = getUUID(ref, index);
          uuid && worker.wakeUp({
            uuid
          });
        }
      };
    }
    const cache = {};
    return {
      ...makeApi(void 0),
      at: (index) => cache[index] || (cache[index] = makeApi(index))
    };
  }, []);
  return [ref, api];
}
function usePlane(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Plane", fn, () => [], fwdRef, deps);
}
function useBox(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Box", fn, function(args) {
    if (args === void 0) {
      args = [];
    }
    return args;
  }, fwdRef, deps);
}
function useCapsule(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Capsule", fn, function(args) {
    if (args === void 0) {
      args = [];
    }
    return args;
  }, fwdRef, deps);
}
function useCircle(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Circle", fn, function(args) {
    if (args === void 0) {
      args = [];
    }
    return args;
  }, fwdRef, deps);
}
function useConvex(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Convex", fn, function(args) {
    if (args === void 0) {
      args = [[], []];
    }
    return args;
  }, fwdRef, deps);
}
function useHeightfield(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Heightfield", fn, function(args) {
    if (args === void 0) {
      args = [[], {}];
    }
    return args;
  }, fwdRef, deps);
}
function useLine(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Line", fn, function(args) {
    if (args === void 0) {
      args = [];
    }
    return args;
  }, fwdRef, deps);
}
function useParticle(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Particle", fn, () => [], fwdRef, deps);
}
function useCompoundBody(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  return useBody("Compound", fn, (args) => args, fwdRef, deps);
}
function useConstraint(type, bodyA, bodyB, optns, deps) {
  if (optns === void 0) {
    optns = {};
  }
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker
  } = (0, import_react.useContext)(context);
  const uuid = MathUtils.generateUUID();
  const refA = useForwardedRef(bodyA);
  const refB = useForwardedRef(bodyB);
  (0, import_react.useEffect)(() => {
    if (refA.current && refB.current) {
      worker.addConstraint({
        props: [refA.current.uuid, refB.current.uuid, optns],
        type,
        uuid
      });
      return () => worker.removeConstraint({
        uuid
      });
    }
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    if (type === "Prismatic" || type === "Revolute") {
      return {
        disableMotor: () => worker.disableConstraintMotor({
          uuid
        }),
        enableMotor: () => worker.enableConstraintMotor({
          uuid
        }),
        setMotorSpeed: (value) => worker.setConstraintMotorSpeed({
          props: value,
          uuid
        })
      };
    }
    return {};
  }, deps);
  return [refA, refB, api];
}
function useDistanceConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Distance", bodyA, bodyB, optns, deps);
}
function useGearConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Gear", bodyA, bodyB, optns, deps);
}
function useLockConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Lock", bodyA, bodyB, optns, deps);
}
function usePrismaticConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Prismatic", bodyA, bodyB, optns, deps);
}
function useRevoluteConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Revolute", bodyA, bodyB, optns, deps);
}
function useSpring(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker
  } = (0, import_react.useContext)(context);
  const [uuid] = (0, import_react.useState)(() => MathUtils.generateUUID());
  const refA = useForwardedRef(bodyA);
  const refB = useForwardedRef(bodyB);
  (0, import_react.useEffect)(() => {
    if (refA.current && refB.current) {
      worker.addSpring({
        props: [refA.current.uuid, refB.current.uuid, optns],
        uuid
      });
      return () => {
        worker.removeSpring({
          uuid
        });
      };
    }
  }, deps);
  const api = (0, import_react.useMemo)(() => ({
    setDamping: (value) => worker.setSpringDamping({
      props: value,
      uuid
    }),
    setRestLength: (value) => worker.setSpringRestLength({
      props: value,
      uuid
    }),
    setStiffness: (value) => worker.setSpringStiffness({
      props: value,
      uuid
    })
  }), deps);
  return [refA, refB, api];
}
function useRay(mode, options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker,
    events
  } = (0, import_react.useContext)(context);
  const [uuid] = (0, import_react.useState)(() => MathUtils.generateUUID());
  (0, import_react.useEffect)(() => {
    events[uuid] = {
      rayhit: callback
    };
    worker.addRay({
      props: {
        ...options,
        mode
      },
      uuid
    });
    return () => {
      worker.removeRay({
        uuid
      });
      delete events[uuid];
    };
  }, deps);
}
function useRaycastClosest(options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  useRay("Closest", options, callback, deps);
}
function useRaycastAny(options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  useRay("Any", options, callback, deps);
}
function useRaycastAll(options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  useRay("All", options, callback, deps);
}
function useTopDownVehicle(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const ref = useForwardedRef(fwdRef);
  const {
    worker
  } = (0, import_react.useContext)(context);
  (0, import_react.useLayoutEffect)(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }
    const currentWorker = worker;
    const uuid = ref.current.uuid;
    const {
      chassisBody,
      wheels
    } = fn();
    const chassisBodyUUID = getUUID(chassisBody);
    if (!chassisBodyUUID) return;
    currentWorker.addTopDownVehicle({
      props: [chassisBodyUUID, wheels],
      uuid
    });
    return () => {
      currentWorker.removeTopDownVehicle({
        uuid
      });
    };
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    return {
      applyEngineForce(value, wheelIndex) {
        const uuid = getUUID(ref);
        uuid && worker.applyTopDownVehicleEngineForce({
          props: [value, wheelIndex],
          uuid
        });
      },
      setBrake(brake, wheelIndex) {
        const uuid = getUUID(ref);
        uuid && worker.setTopDownVehicleBrake({
          props: [brake, wheelIndex],
          uuid
        });
      },
      setSteeringValue(value, wheelIndex) {
        const uuid = getUUID(ref);
        uuid && worker.setTopDownVehicleSteeringValue({
          props: [value, wheelIndex],
          uuid
        });
      }
    };
  }, deps);
  return [ref, api];
}
function useContactMaterial(materialA, materialB, options, deps) {
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker
  } = (0, import_react.useContext)(context);
  const [uuid] = (0, import_react.useState)(() => MathUtils.generateUUID());
  (0, import_react.useEffect)(() => {
    worker.addContactMaterial({
      props: [materialA, materialB, options],
      uuid
    });
    return () => {
      worker.removeContactMaterial({
        uuid
      });
    };
  }, deps);
}
function useKinematicCharacterController(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const ref = useForwardedRef(fwdRef);
  const {
    worker,
    subscriptions
  } = (0, import_react.useContext)(context);
  (0, import_react.useLayoutEffect)(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }
    const currentWorker = worker;
    const uuid = ref.current.uuid;
    const kinematicCharacterControllerProps = fn();
    const bodyUUID = getUUID(kinematicCharacterControllerProps.body);
    if (!bodyUUID) return;
    currentWorker.addKinematicCharacterController({
      props: [bodyUUID, kinematicCharacterControllerProps.collisionMask, kinematicCharacterControllerProps.accelerationTimeAirborne, kinematicCharacterControllerProps.accelerationTimeGrounded, kinematicCharacterControllerProps.moveSpeed, kinematicCharacterControllerProps.wallSlideSpeedMax, kinematicCharacterControllerProps.wallStickTime, kinematicCharacterControllerProps.wallJumpClimb, kinematicCharacterControllerProps.wallJumpOff, kinematicCharacterControllerProps.wallLeap, kinematicCharacterControllerProps.timeToJumpApex, kinematicCharacterControllerProps.maxJumpHeight, kinematicCharacterControllerProps.minJumpHeight, kinematicCharacterControllerProps.velocityXSmoothing, kinematicCharacterControllerProps.velocityXMin, kinematicCharacterControllerProps.maxClimbAngle, kinematicCharacterControllerProps.maxDescendAngle, kinematicCharacterControllerProps.skinWidth, kinematicCharacterControllerProps.dstBetweenRays],
      uuid
    });
    return () => {
      currentWorker.removeKinematicCharacterController({
        uuid
      });
    };
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    return {
      collisions: {
        subscribe: subscribe(ref, worker, subscriptions, "collisions", void 0, "controllers")
      },
      raysData: {
        subscribe: subscribe(ref, worker, subscriptions, "raysData", void 0, "controllers")
      },
      setInput(input) {
        const uuid = getUUID(ref);
        uuid && worker.setKinematicCharacterControllerInput({
          props: input,
          uuid
        });
      },
      setJump(isDown) {
        const uuid = getUUID(ref);
        uuid && worker.setKinematicCharacterControllerJump({
          props: isDown,
          uuid
        });
      }
    };
  }, deps);
  return [ref, api];
}
function usePlatformController(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const ref = useForwardedRef(fwdRef);
  const {
    worker,
    subscriptions
  } = (0, import_react.useContext)(context);
  (0, import_react.useLayoutEffect)(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }
    const currentWorker = worker;
    const uuid = ref.current.uuid;
    const platformControllerProps = fn();
    const bodyUUID = getUUID(platformControllerProps.body);
    if (!bodyUUID) return;
    currentWorker.addPlatformController({
      props: [bodyUUID, platformControllerProps.passengerMask, platformControllerProps.localWaypoints, platformControllerProps.speed, platformControllerProps.skinWidth, platformControllerProps.dstBetweenRays],
      uuid
    });
    return () => {
      currentWorker.removePlatformController({
        uuid
      });
    };
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    return {
      collisions: {
        subscribe: subscribe(ref, worker, subscriptions, "collisions", void 0, "controllers")
      },
      raysData: {
        subscribe: subscribe(ref, worker, subscriptions, "raysData", void 0, "controllers")
      }
    };
  }, deps);
  return [ref, api];
}
var Physics = (props) => (0, import_jsx_runtime.jsx)(import_react.Suspense, {
  fallback: null,
  children: (0, import_jsx_runtime.jsx)(Provider, {
    ...props
  })
});
export {
  Debug,
  Physics,
  atomicNames,
  context,
  debugContext,
  subscriptionNames,
  useBox,
  useCapsule,
  useCircle,
  useCompoundBody,
  useContactMaterial,
  useConvex,
  useDistanceConstraint,
  useGearConstraint,
  useHeightfield,
  useKinematicCharacterController,
  useLine,
  useLockConstraint,
  useParticle,
  usePlane,
  usePlatformController,
  usePrismaticConstraint,
  useRaycastAll,
  useRaycastAny,
  useRaycastClosest,
  useRevoluteConstraint,
  useSpring,
  useTopDownVehicle,
  vectorNames
};
//# sourceMappingURL=@react-three_p2.js.map
