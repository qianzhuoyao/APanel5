import {
  require_react
} from "./chunk-ECT2SSAV.js";
import {
  __commonJS,
  __reExport,
  __toESM
} from "./chunk-DLJ4GP37.js";

// ../../node_modules/.pnpm/proxy-compare@3.0.1/node_modules/proxy-compare/dist/cjs/index.js
var require_cjs = __commonJS({
  "../../node_modules/.pnpm/proxy-compare@3.0.1/node_modules/proxy-compare/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.replaceNewProxy = exports.affectedToPathList = exports.markToTrack = exports.getUntracked = exports.trackMemo = exports.isChanged = exports.createProxy = void 0;
    var TRACK_MEMO_SYMBOL = Symbol();
    var GET_ORIGINAL_SYMBOL = Symbol();
    var AFFECTED_PROPERTY = "a";
    var IS_TARGET_COPIED_PROPERTY = "f";
    var PROXY_PROPERTY = "p";
    var PROXY_CACHE_PROPERTY = "c";
    var TARGET_CACHE_PROPERTY = "t";
    var HAS_KEY_PROPERTY = "h";
    var ALL_OWN_KEYS_PROPERTY = "w";
    var HAS_OWN_KEY_PROPERTY = "o";
    var KEYS_PROPERTY = "k";
    var newProxy = (target, handler) => new Proxy(target, handler);
    var getProto = Object.getPrototypeOf;
    var objectsToTrack = /* @__PURE__ */ new WeakMap();
    var isObjectToTrack = (obj) => obj && (objectsToTrack.has(obj) ? objectsToTrack.get(obj) : getProto(obj) === Object.prototype || getProto(obj) === Array.prototype);
    var isObject = (x) => typeof x === "object" && x !== null;
    var needsToCopyTargetObject = (obj) => Object.values(Object.getOwnPropertyDescriptors(obj)).some((descriptor) => !descriptor.configurable && !descriptor.writable);
    var copyTargetObject = (obj) => {
      if (Array.isArray(obj)) {
        return Array.from(obj);
      }
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      Object.values(descriptors).forEach((desc) => {
        desc.configurable = true;
      });
      return Object.create(getProto(obj), descriptors);
    };
    var createProxyHandler = (origObj, isTargetCopied) => {
      const state = {
        [IS_TARGET_COPIED_PROPERTY]: isTargetCopied
      };
      let trackObject = false;
      const recordUsage = (type, key) => {
        if (!trackObject) {
          let used = state[AFFECTED_PROPERTY].get(origObj);
          if (!used) {
            used = {};
            state[AFFECTED_PROPERTY].set(origObj, used);
          }
          if (type === ALL_OWN_KEYS_PROPERTY) {
            used[ALL_OWN_KEYS_PROPERTY] = true;
          } else {
            let set = used[type];
            if (!set) {
              set = /* @__PURE__ */ new Set();
              used[type] = set;
            }
            set.add(key);
          }
        }
      };
      const recordObjectAsUsed = () => {
        trackObject = true;
        state[AFFECTED_PROPERTY].delete(origObj);
      };
      const handler = {
        get(target, key) {
          if (key === GET_ORIGINAL_SYMBOL) {
            return origObj;
          }
          recordUsage(KEYS_PROPERTY, key);
          return (0, exports.createProxy)(Reflect.get(target, key), state[AFFECTED_PROPERTY], state[PROXY_CACHE_PROPERTY], state[TARGET_CACHE_PROPERTY]);
        },
        has(target, key) {
          if (key === TRACK_MEMO_SYMBOL) {
            recordObjectAsUsed();
            return true;
          }
          recordUsage(HAS_KEY_PROPERTY, key);
          return Reflect.has(target, key);
        },
        getOwnPropertyDescriptor(target, key) {
          recordUsage(HAS_OWN_KEY_PROPERTY, key);
          return Reflect.getOwnPropertyDescriptor(target, key);
        },
        ownKeys(target) {
          recordUsage(ALL_OWN_KEYS_PROPERTY);
          return Reflect.ownKeys(target);
        }
      };
      if (isTargetCopied) {
        handler.set = handler.deleteProperty = () => false;
      }
      return [handler, state];
    };
    var getOriginalObject = (obj) => (
      // unwrap proxy
      obj[GET_ORIGINAL_SYMBOL] || // otherwise
      obj
    );
    var createProxy = (obj, affected, proxyCache, targetCache) => {
      if (!isObjectToTrack(obj))
        return obj;
      let targetAndCopied = targetCache && targetCache.get(obj);
      if (!targetAndCopied) {
        const target2 = getOriginalObject(obj);
        if (needsToCopyTargetObject(target2)) {
          targetAndCopied = [target2, copyTargetObject(target2)];
        } else {
          targetAndCopied = [target2];
        }
        targetCache === null || targetCache === void 0 ? void 0 : targetCache.set(obj, targetAndCopied);
      }
      const [target, copiedTarget] = targetAndCopied;
      let handlerAndState = proxyCache && proxyCache.get(target);
      if (!handlerAndState || handlerAndState[1][IS_TARGET_COPIED_PROPERTY] !== !!copiedTarget) {
        handlerAndState = createProxyHandler(target, !!copiedTarget);
        handlerAndState[1][PROXY_PROPERTY] = newProxy(copiedTarget || target, handlerAndState[0]);
        if (proxyCache) {
          proxyCache.set(target, handlerAndState);
        }
      }
      handlerAndState[1][AFFECTED_PROPERTY] = affected;
      handlerAndState[1][PROXY_CACHE_PROPERTY] = proxyCache;
      handlerAndState[1][TARGET_CACHE_PROPERTY] = targetCache;
      return handlerAndState[1][PROXY_PROPERTY];
    };
    exports.createProxy = createProxy;
    var isAllOwnKeysChanged = (prevObj, nextObj) => {
      const prevKeys = Reflect.ownKeys(prevObj);
      const nextKeys = Reflect.ownKeys(nextObj);
      return prevKeys.length !== nextKeys.length || prevKeys.some((k, i) => k !== nextKeys[i]);
    };
    var isChanged = (prevObj, nextObj, affected, cache, isEqual = Object.is) => {
      if (isEqual(prevObj, nextObj)) {
        return false;
      }
      if (!isObject(prevObj) || !isObject(nextObj))
        return true;
      const used = affected.get(getOriginalObject(prevObj));
      if (!used)
        return true;
      if (cache) {
        const hit = cache.get(prevObj);
        if (hit === nextObj) {
          return false;
        }
        cache.set(prevObj, nextObj);
      }
      let changed = null;
      for (const key of used[HAS_KEY_PROPERTY] || []) {
        changed = Reflect.has(prevObj, key) !== Reflect.has(nextObj, key);
        if (changed)
          return changed;
      }
      if (used[ALL_OWN_KEYS_PROPERTY] === true) {
        changed = isAllOwnKeysChanged(prevObj, nextObj);
        if (changed)
          return changed;
      } else {
        for (const key of used[HAS_OWN_KEY_PROPERTY] || []) {
          const hasPrev = !!Reflect.getOwnPropertyDescriptor(prevObj, key);
          const hasNext = !!Reflect.getOwnPropertyDescriptor(nextObj, key);
          changed = hasPrev !== hasNext;
          if (changed)
            return changed;
        }
      }
      for (const key of used[KEYS_PROPERTY] || []) {
        changed = (0, exports.isChanged)(prevObj[key], nextObj[key], affected, cache, isEqual);
        if (changed)
          return changed;
      }
      if (changed === null)
        throw new Error("invalid used");
      return changed;
    };
    exports.isChanged = isChanged;
    var trackMemo = (obj) => {
      if (isObjectToTrack(obj)) {
        return TRACK_MEMO_SYMBOL in obj;
      }
      return false;
    };
    exports.trackMemo = trackMemo;
    var getUntracked = (obj) => {
      if (isObjectToTrack(obj)) {
        return obj[GET_ORIGINAL_SYMBOL] || null;
      }
      return null;
    };
    exports.getUntracked = getUntracked;
    var markToTrack = (obj, mark = true) => {
      objectsToTrack.set(obj, mark);
    };
    exports.markToTrack = markToTrack;
    var affectedToPathList = (obj, affected, onlyWithValues) => {
      const list = [];
      const seen = /* @__PURE__ */ new WeakSet();
      const walk = (x, path) => {
        var _a, _b, _c;
        if (seen.has(x)) {
          return;
        }
        if (isObject(x)) {
          seen.add(x);
        }
        const used = isObject(x) && affected.get(getOriginalObject(x));
        if (used) {
          (_a = used[HAS_KEY_PROPERTY]) === null || _a === void 0 ? void 0 : _a.forEach((key) => {
            const segment = `:has(${String(key)})`;
            list.push(path ? [...path, segment] : [segment]);
          });
          if (used[ALL_OWN_KEYS_PROPERTY] === true) {
            const segment = ":ownKeys";
            list.push(path ? [...path, segment] : [segment]);
          } else {
            (_b = used[HAS_OWN_KEY_PROPERTY]) === null || _b === void 0 ? void 0 : _b.forEach((key) => {
              const segment = `:hasOwn(${String(key)})`;
              list.push(path ? [...path, segment] : [segment]);
            });
          }
          (_c = used[KEYS_PROPERTY]) === null || _c === void 0 ? void 0 : _c.forEach((key) => {
            if (!onlyWithValues || "value" in (Object.getOwnPropertyDescriptor(x, key) || {})) {
              walk(x[key], path ? [...path, key] : [key]);
            }
          });
        } else if (path) {
          list.push(path);
        }
      };
      walk(obj);
      return list;
    };
    exports.affectedToPathList = affectedToPathList;
    var replaceNewProxy = (fn) => {
      newProxy = fn;
    };
    exports.replaceNewProxy = replaceNewProxy;
  }
});

// ../../node_modules/.pnpm/valtio@2.3.2_@types+react@19.1.0_react@19.2.0/node_modules/valtio/vanilla.js
var require_vanilla = __commonJS({
  "../../node_modules/.pnpm/valtio@2.3.2_@types+react@19.1.0_react@19.2.0/node_modules/valtio/vanilla.js"(exports) {
    "use strict";
    var proxyCompare = require_cjs();
    var isObject = (x) => typeof x === "object" && x !== null;
    var canProxyDefault = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer) && !(x instanceof Promise);
    var createSnapshotDefault = (target, version) => {
      const cache = snapCache.get(target);
      if ((cache == null ? void 0 : cache[0]) === version) {
        return cache[1];
      }
      const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
      proxyCompare.markToTrack(snap, true);
      snapCache.set(target, [version, snap]);
      Reflect.ownKeys(target).forEach((key) => {
        if (Object.getOwnPropertyDescriptor(snap, key)) {
          return;
        }
        const value = Reflect.get(target, key);
        const { enumerable } = Reflect.getOwnPropertyDescriptor(
          target,
          key
        );
        const desc = {
          value,
          enumerable,
          // This is intentional to avoid copying with proxy-compare.
          // It's still non-writable, so it avoids assigning a value.
          configurable: true
        };
        if (refSet.has(value)) {
          proxyCompare.markToTrack(value, false);
        } else if (proxyStateMap.has(value)) {
          const [target2, ensureVersion] = proxyStateMap.get(
            value
          );
          desc.value = createSnapshotDefault(target2, ensureVersion());
        }
        Object.defineProperty(snap, key, desc);
      });
      return snap;
    };
    var createHandlerDefault = (isInitializing, addPropListener, removePropListener, notifyUpdate) => ({
      deleteProperty(target, prop) {
        const prevValue = Reflect.get(target, prop);
        removePropListener(prop);
        const deleted = Reflect.deleteProperty(target, prop);
        if (deleted) {
          notifyUpdate(createOp == null ? void 0 : createOp("delete", prop, prevValue));
        }
        return deleted;
      },
      set(target, prop, value, receiver) {
        const hasPrevValue = !isInitializing() && Reflect.has(target, prop);
        const prevValue = Reflect.get(target, prop, receiver);
        if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
          return true;
        }
        removePropListener(prop);
        if (isObject(value)) {
          value = proxyCompare.getUntracked(value) || value;
        }
        const nextValue = !proxyStateMap.has(value) && canProxy(value) ? proxy(value) : value;
        addPropListener(prop, nextValue);
        Reflect.set(target, prop, nextValue, receiver);
        notifyUpdate(createOp == null ? void 0 : createOp("set", prop, value, prevValue));
        return true;
      }
    });
    var createOpDefault = (type, prop, ...args) => [type, [prop], ...args];
    var proxyStateMap = /* @__PURE__ */ new WeakMap();
    var refSet = /* @__PURE__ */ new WeakSet();
    var snapCache = /* @__PURE__ */ new WeakMap();
    var versionHolder = [1];
    var proxyCache = /* @__PURE__ */ new WeakMap();
    var objectIs = Object.is;
    var newProxy = (target, handler) => new Proxy(target, handler);
    var canProxy = canProxyDefault;
    var createSnapshot = createSnapshotDefault;
    var createHandler = createHandlerDefault;
    var createOp;
    function proxy(baseObject = {}) {
      if (!isObject(baseObject)) {
        throw new Error("object required");
      }
      const found = proxyCache.get(baseObject);
      if (found) {
        return found;
      }
      let version = versionHolder[0];
      const listeners = /* @__PURE__ */ new Set();
      const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
        if (version !== nextVersion) {
          checkVersion = version = nextVersion;
          listeners.forEach((listener) => listener(op, nextVersion));
        }
      };
      let checkVersion = version;
      const ensureVersion = (nextCheckVersion = versionHolder[0]) => {
        if (checkVersion !== nextCheckVersion) {
          checkVersion = nextCheckVersion;
          propProxyStates.forEach(([propProxyState]) => {
            const propVersion = propProxyState[1](nextCheckVersion);
            if (propVersion > version) {
              version = propVersion;
            }
          });
        }
        return version;
      };
      const createPropListener = (prop) => (op, nextVersion) => {
        let newOp;
        if (op) {
          newOp = [...op];
          newOp[1] = [prop, ...newOp[1]];
        }
        notifyUpdate(newOp, nextVersion);
      };
      const propProxyStates = /* @__PURE__ */ new Map();
      const addPropListener = (prop, propValue) => {
        const propProxyState = !refSet.has(propValue) && proxyStateMap.get(propValue);
        if (propProxyState) {
          if (propProxyStates.has(prop)) {
            throw new Error("prop listener already exists");
          }
          if (listeners.size) {
            const remove = propProxyState[2](createPropListener(prop));
            propProxyStates.set(prop, [propProxyState, remove]);
          } else {
            propProxyStates.set(prop, [propProxyState]);
          }
        }
      };
      const removePropListener = (prop) => {
        var _a;
        const entry = propProxyStates.get(prop);
        if (entry) {
          propProxyStates.delete(prop);
          (_a = entry[1]) == null ? void 0 : _a.call(entry);
        }
      };
      const addListener = (listener) => {
        listeners.add(listener);
        if (listeners.size === 1) {
          propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
            if (prevRemove) {
              throw new Error("remove already exists");
            }
            const remove = propProxyState[2](createPropListener(prop));
            propProxyStates.set(prop, [propProxyState, remove]);
          });
        }
        const removeListener = () => {
          listeners.delete(listener);
          if (listeners.size === 0) {
            propProxyStates.forEach(([propProxyState, remove], prop) => {
              if (remove) {
                remove();
                propProxyStates.set(prop, [propProxyState]);
              }
            });
          }
        };
        return removeListener;
      };
      let initializing = true;
      const handler = createHandler(
        () => initializing,
        addPropListener,
        removePropListener,
        notifyUpdate
      );
      const proxyObject = newProxy(baseObject, handler);
      proxyCache.set(baseObject, proxyObject);
      const proxyState = [baseObject, ensureVersion, addListener];
      proxyStateMap.set(proxyObject, proxyState);
      Reflect.ownKeys(baseObject).forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(
          baseObject,
          key
        );
        if ("value" in desc && desc.writable) {
          proxyObject[key] = baseObject[key];
        }
      });
      initializing = false;
      return proxyObject;
    }
    function getVersion(proxyObject) {
      const proxyState = proxyStateMap.get(proxyObject);
      return proxyState == null ? void 0 : proxyState[1]();
    }
    function subscribe(proxyObject, callback, notifyInSync) {
      const proxyState = proxyStateMap.get(proxyObject);
      if (!proxyState) {
        console.warn("Please use proxy object");
      }
      let promise;
      const ops = [];
      const addListener = proxyState[2];
      let isListenerActive = false;
      const listener = (op) => {
        if (op) {
          ops.push(op);
        }
        if (notifyInSync) {
          callback(ops.splice(0));
          return;
        }
        if (!promise) {
          promise = Promise.resolve().then(() => {
            promise = void 0;
            if (isListenerActive) {
              callback(ops.splice(0));
            }
          });
        }
      };
      const removeListener = addListener(listener);
      isListenerActive = true;
      return () => {
        isListenerActive = false;
        removeListener();
      };
    }
    function snapshot(proxyObject) {
      const proxyState = proxyStateMap.get(proxyObject);
      if (!proxyState) {
        console.warn("Please use proxy object");
      }
      const [target, ensureVersion] = proxyState;
      return createSnapshot(target, ensureVersion());
    }
    function ref(obj) {
      refSet.add(obj);
      return obj;
    }
    function unstable_getInternalStates() {
      return {
        proxyStateMap,
        refSet,
        snapCache,
        versionHolder,
        proxyCache
      };
    }
    function unstable_replaceInternalFunction(name, fn) {
      switch (name) {
        case "objectIs":
          objectIs = fn(objectIs);
          break;
        case "newProxy":
          newProxy = fn(newProxy);
          break;
        case "canProxy":
          canProxy = fn(canProxy);
          break;
        case "createSnapshot":
          createSnapshot = fn(createSnapshot);
          break;
        case "createHandler":
          createHandler = fn(createHandler);
          break;
        default:
          throw new Error("unknown function");
      }
    }
    function unstable_enableOp(enabled = true) {
      if (enabled === true) {
        createOp = createOpDefault;
      } else if (enabled === false) {
        createOp = void 0;
      } else {
        createOp = enabled;
      }
    }
    exports.getVersion = getVersion;
    exports.proxy = proxy;
    exports.ref = ref;
    exports.snapshot = snapshot;
    exports.subscribe = subscribe;
    exports.unstable_enableOp = unstable_enableOp;
    exports.unstable_getInternalStates = unstable_getInternalStates;
    exports.unstable_replaceInternalFunction = unstable_replaceInternalFunction;
  }
});

// ../../node_modules/.pnpm/valtio@2.3.2_@types+react@19.1.0_react@19.2.0/node_modules/valtio/react.js
var require_react2 = __commonJS({
  "../../node_modules/.pnpm/valtio@2.3.2_@types+react@19.1.0_react@19.2.0/node_modules/valtio/react.js"(exports) {
    "use strict";
    var react = require_react();
    var proxyCompare = require_cjs();
    var vanilla = require_vanilla();
    var useAffectedDebugValue = (state, affected) => {
      const pathList = react.useRef(void 0);
      react.useEffect(() => {
        pathList.current = proxyCompare.affectedToPathList(state, affected, true);
      });
      react.useDebugValue(pathList.current);
    };
    var condUseAffectedDebugValue = useAffectedDebugValue;
    var targetCache = /* @__PURE__ */ new WeakMap();
    function useSnapshot(proxyObject, options) {
      const notifyInSync = options == null ? void 0 : options.sync;
      const affected = react.useMemo(
        () => proxyObject && /* @__PURE__ */ new WeakMap(),
        [proxyObject]
      );
      const lastSnapshot = react.useRef(void 0);
      let inRender = true;
      const currSnapshot = react.useSyncExternalStore(
        react.useCallback(
          (callback) => {
            const unsub = vanilla.subscribe(proxyObject, callback, notifyInSync);
            callback();
            return unsub;
          },
          [proxyObject, notifyInSync]
        ),
        () => {
          const nextSnapshot = vanilla.snapshot(proxyObject);
          try {
            if (!inRender && lastSnapshot.current && !proxyCompare.isChanged(
              lastSnapshot.current,
              nextSnapshot,
              affected,
              /* @__PURE__ */ new WeakMap()
            )) {
              return lastSnapshot.current;
            }
          } catch (e) {
          }
          return nextSnapshot;
        },
        () => vanilla.snapshot(proxyObject)
      );
      inRender = false;
      react.useLayoutEffect(() => {
        lastSnapshot.current = currSnapshot;
      });
      if (true) {
        condUseAffectedDebugValue(currSnapshot, affected);
      }
      const proxyCache = react.useMemo(() => /* @__PURE__ */ new WeakMap(), []);
      return proxyCompare.createProxy(currSnapshot, affected, proxyCache, targetCache);
    }
    exports.useSnapshot = useSnapshot;
  }
});

// ../../node_modules/.pnpm/valtio@2.3.2_@types+react@19.1.0_react@19.2.0/node_modules/valtio/esm/index.mjs
var esm_exports = {};
__reExport(esm_exports, __toESM(require_vanilla(), 1));
__reExport(esm_exports, __toESM(require_react2(), 1));
//# sourceMappingURL=valtio.js.map
