import {
  _extends
} from "./chunk-XFKGX6KM.js";
import {
  useFrame,
  useThree
} from "./chunk-NOMVIORJ.js";
import "./chunk-QA3FA25W.js";
import "./chunk-2NVUNDZI.js";
import {
  require_react
} from "./chunk-ECT2SSAV.js";
import {
  Box3,
  Matrix4,
  Vector3
} from "./chunk-WCOX6VFL.js";
import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-DLJ4GP37.js";

// ../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/dist/YGEnums.js
var require_YGEnums = __commonJS({
  "../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/dist/YGEnums.js"(exports2, module2) {
    "use strict";
    var CONSTANTS = {
      ALIGN_COUNT: 8,
      ALIGN_AUTO: 0,
      ALIGN_FLEX_START: 1,
      ALIGN_CENTER: 2,
      ALIGN_FLEX_END: 3,
      ALIGN_STRETCH: 4,
      ALIGN_BASELINE: 5,
      ALIGN_SPACE_BETWEEN: 6,
      ALIGN_SPACE_AROUND: 7,
      DIMENSION_COUNT: 2,
      DIMENSION_WIDTH: 0,
      DIMENSION_HEIGHT: 1,
      DIRECTION_COUNT: 3,
      DIRECTION_INHERIT: 0,
      DIRECTION_LTR: 1,
      DIRECTION_RTL: 2,
      DISPLAY_COUNT: 2,
      DISPLAY_FLEX: 0,
      DISPLAY_NONE: 1,
      EDGE_COUNT: 9,
      EDGE_LEFT: 0,
      EDGE_TOP: 1,
      EDGE_RIGHT: 2,
      EDGE_BOTTOM: 3,
      EDGE_START: 4,
      EDGE_END: 5,
      EDGE_HORIZONTAL: 6,
      EDGE_VERTICAL: 7,
      EDGE_ALL: 8,
      EXPERIMENTAL_FEATURE_COUNT: 1,
      EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS: 0,
      FLEX_DIRECTION_COUNT: 4,
      FLEX_DIRECTION_COLUMN: 0,
      FLEX_DIRECTION_COLUMN_REVERSE: 1,
      FLEX_DIRECTION_ROW: 2,
      FLEX_DIRECTION_ROW_REVERSE: 3,
      JUSTIFY_COUNT: 6,
      JUSTIFY_FLEX_START: 0,
      JUSTIFY_CENTER: 1,
      JUSTIFY_FLEX_END: 2,
      JUSTIFY_SPACE_BETWEEN: 3,
      JUSTIFY_SPACE_AROUND: 4,
      JUSTIFY_SPACE_EVENLY: 5,
      LOG_LEVEL_COUNT: 6,
      LOG_LEVEL_ERROR: 0,
      LOG_LEVEL_WARN: 1,
      LOG_LEVEL_INFO: 2,
      LOG_LEVEL_DEBUG: 3,
      LOG_LEVEL_VERBOSE: 4,
      LOG_LEVEL_FATAL: 5,
      MEASURE_MODE_COUNT: 3,
      MEASURE_MODE_UNDEFINED: 0,
      MEASURE_MODE_EXACTLY: 1,
      MEASURE_MODE_AT_MOST: 2,
      NODE_TYPE_COUNT: 2,
      NODE_TYPE_DEFAULT: 0,
      NODE_TYPE_TEXT: 1,
      OVERFLOW_COUNT: 3,
      OVERFLOW_VISIBLE: 0,
      OVERFLOW_HIDDEN: 1,
      OVERFLOW_SCROLL: 2,
      POSITION_TYPE_COUNT: 2,
      POSITION_TYPE_RELATIVE: 0,
      POSITION_TYPE_ABSOLUTE: 1,
      PRINT_OPTIONS_COUNT: 3,
      PRINT_OPTIONS_LAYOUT: 1,
      PRINT_OPTIONS_STYLE: 2,
      PRINT_OPTIONS_CHILDREN: 4,
      UNIT_COUNT: 4,
      UNIT_UNDEFINED: 0,
      UNIT_POINT: 1,
      UNIT_PERCENT: 2,
      UNIT_AUTO: 3,
      WRAP_COUNT: 3,
      WRAP_NO_WRAP: 0,
      WRAP_WRAP: 1,
      WRAP_WRAP_REVERSE: 2
    };
    module2.exports = CONSTANTS;
  }
});

// ../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/dist/entry-common.js
var require_entry_common = __commonJS({
  "../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/dist/entry-common.js"(exports2, module2) {
    "use strict";
    var _extends2 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key2 in source) {
          if (Object.prototype.hasOwnProperty.call(source, key2)) {
            target[key2] = source[key2];
          }
        }
      }
      return target;
    };
    var _createClass = /* @__PURE__ */ function() {
      function defineProperties(target, props) {
        for (var i3 = 0; i3 < props.length; i3++) {
          var descriptor = props[i3];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _defineProperty(obj, key2, value) {
      if (key2 in obj) {
        Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key2] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var CONSTANTS = require_YGEnums();
    var Layout = function() {
      function Layout2(left, right, top, bottom, width, height) {
        _classCallCheck(this, Layout2);
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.width = width;
        this.height = height;
      }
      _createClass(Layout2, [{
        key: "fromJS",
        value: function fromJS(expose) {
          expose(this.left, this.right, this.top, this.bottom, this.width, this.height);
        }
      }, {
        key: "toString",
        value: function toString() {
          return "<Layout#" + this.left + ":" + this.right + ";" + this.top + ":" + this.bottom + ";" + this.width + ":" + this.height + ">";
        }
      }]);
      return Layout2;
    }();
    var Size = function() {
      _createClass(Size2, null, [{
        key: "fromJS",
        value: function fromJS(_ref) {
          var width = _ref.width, height = _ref.height;
          return new Size2(width, height);
        }
      }]);
      function Size2(width, height) {
        _classCallCheck(this, Size2);
        this.width = width;
        this.height = height;
      }
      _createClass(Size2, [{
        key: "fromJS",
        value: function fromJS(expose) {
          expose(this.width, this.height);
        }
      }, {
        key: "toString",
        value: function toString() {
          return "<Size#" + this.width + "x" + this.height + ">";
        }
      }]);
      return Size2;
    }();
    var Value = function() {
      function Value2(unit, value) {
        _classCallCheck(this, Value2);
        this.unit = unit;
        this.value = value;
      }
      _createClass(Value2, [{
        key: "fromJS",
        value: function fromJS(expose) {
          expose(this.unit, this.value);
        }
      }, {
        key: "toString",
        value: function toString() {
          switch (this.unit) {
            case CONSTANTS.UNIT_POINT:
              return String(this.value);
            case CONSTANTS.UNIT_PERCENT:
              return this.value + "%";
            case CONSTANTS.UNIT_AUTO:
              return "auto";
            default: {
              return this.value + "?";
            }
          }
        }
      }, {
        key: "valueOf",
        value: function valueOf() {
          return this.value;
        }
      }]);
      return Value2;
    }();
    module2.exports = function(bind, lib) {
      function patch(prototype, name, fn) {
        var original = prototype[name];
        prototype[name] = function() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return fn.call.apply(fn, [this, original].concat(args));
        };
      }
      var _arr = ["setPosition", "setMargin", "setFlexBasis", "setWidth", "setHeight", "setMinWidth", "setMinHeight", "setMaxWidth", "setMaxHeight", "setPadding"];
      var _loop = function _loop2() {
        var _methods;
        var fnName = _arr[_i];
        var methods = (_methods = {}, _defineProperty(_methods, CONSTANTS.UNIT_POINT, lib.Node.prototype[fnName]), _defineProperty(_methods, CONSTANTS.UNIT_PERCENT, lib.Node.prototype[fnName + "Percent"]), _defineProperty(_methods, CONSTANTS.UNIT_AUTO, lib.Node.prototype[fnName + "Auto"]), _methods);
        patch(lib.Node.prototype, fnName, function(original) {
          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          var value = args.pop();
          var unit = void 0, asNumber = void 0;
          if (value === "auto") {
            unit = CONSTANTS.UNIT_AUTO;
            asNumber = void 0;
          } else if (value instanceof Value) {
            unit = value.unit;
            asNumber = value.valueOf();
          } else {
            unit = typeof value === "string" && value.endsWith("%") ? CONSTANTS.UNIT_PERCENT : CONSTANTS.UNIT_POINT;
            asNumber = parseFloat(value);
            if (!Number.isNaN(value) && Number.isNaN(asNumber)) {
              throw new Error("Invalid value " + value + " for " + fnName);
            }
          }
          if (!methods[unit]) throw new Error('Failed to execute "' + fnName + `": Unsupported unit '` + value + "'");
          if (asNumber !== void 0) {
            var _methods$unit;
            return (_methods$unit = methods[unit]).call.apply(_methods$unit, [this].concat(args, [asNumber]));
          } else {
            var _methods$unit2;
            return (_methods$unit2 = methods[unit]).call.apply(_methods$unit2, [this].concat(args));
          }
        });
      };
      for (var _i = 0; _i < _arr.length; _i++) {
        _loop();
      }
      patch(lib.Config.prototype, "free", function() {
        lib.Config.destroy(this);
      });
      patch(lib.Node, "create", function(_, config) {
        return config ? lib.Node.createWithConfig(config) : lib.Node.createDefault();
      });
      patch(lib.Node.prototype, "free", function() {
        lib.Node.destroy(this);
      });
      patch(lib.Node.prototype, "freeRecursive", function() {
        for (var t2 = 0, T2 = this.getChildCount(); t2 < T2; ++t2) {
          this.getChild(0).freeRecursive();
        }
        this.free();
      });
      patch(lib.Node.prototype, "setMeasureFunc", function(original, measureFunc) {
        if (measureFunc) {
          return original.call(this, function() {
            return Size.fromJS(measureFunc.apply(void 0, arguments));
          });
        } else {
          return this.unsetMeasureFunc();
        }
      });
      patch(lib.Node.prototype, "calculateLayout", function(original) {
        var width = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : NaN;
        var height = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : NaN;
        var direction = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : CONSTANTS.DIRECTION_LTR;
        return original.call(this, width, height, direction);
      });
      return _extends2({
        Config: lib.Config,
        Node: lib.Node,
        Layout: bind("Layout", Layout),
        Size: bind("Size", Size),
        Value: bind("Value", Value),
        getInstanceCount: function getInstanceCount() {
          return lib.getInstanceCount.apply(lib, arguments);
        }
      }, CONSTANTS);
    };
  }
});

// ../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/build/Release/nbind.js
var require_nbind = __commonJS({
  "../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/build/Release/nbind.js"(exports, module) {
    (function(root, wrapper) {
      if (typeof define == "function" && define.amd) define([], function() {
        return wrapper;
      });
      else if (typeof module == "object" && module.exports) module.exports = wrapper;
      else (root.nbind = root.nbind || {}).init = wrapper;
    })(exports, function(Module, cb) {
      if (typeof Module == "function") {
        cb = Module;
        Module = {};
      }
      Module.onRuntimeInitialized = /* @__PURE__ */ function(init, cb2) {
        return function() {
          if (init) init.apply(this, arguments);
          try {
            Module.ccall("nbind_init");
          } catch (err2) {
            cb2(err2);
            return;
          }
          cb2(null, { bind: Module._nbind_value, reflect: Module.NBind.reflect, queryType: Module.NBind.queryType, toggleLightGC: Module.toggleLightGC, lib: Module });
        };
      }(Module.onRuntimeInitialized, cb);
      var Module;
      if (!Module) Module = (typeof Module !== "undefined" ? Module : null) || {};
      var moduleOverrides = {};
      for (var key in Module) {
        if (Module.hasOwnProperty(key)) {
          moduleOverrides[key] = Module[key];
        }
      }
      var ENVIRONMENT_IS_WEB = false;
      var ENVIRONMENT_IS_WORKER = false;
      var ENVIRONMENT_IS_NODE = false;
      var ENVIRONMENT_IS_SHELL = false;
      if (Module["ENVIRONMENT"]) {
        if (Module["ENVIRONMENT"] === "WEB") {
          ENVIRONMENT_IS_WEB = true;
        } else if (Module["ENVIRONMENT"] === "WORKER") {
          ENVIRONMENT_IS_WORKER = true;
        } else if (Module["ENVIRONMENT"] === "NODE") {
          ENVIRONMENT_IS_NODE = true;
        } else if (Module["ENVIRONMENT"] === "SHELL") {
          ENVIRONMENT_IS_SHELL = true;
        } else {
          throw new Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");
        }
      } else {
        ENVIRONMENT_IS_WEB = typeof window === "object";
        ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        ENVIRONMENT_IS_NODE = typeof process === "object" && typeof __require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
        ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
      }
      if (ENVIRONMENT_IS_NODE) {
        if (!Module["print"]) Module["print"] = console.log;
        if (!Module["printErr"]) Module["printErr"] = console.warn;
        var nodeFS;
        var nodePath;
        Module["read"] = function shell_read(filename, binary) {
          if (!nodeFS) nodeFS = {}("");
          if (!nodePath) nodePath = {}("");
          filename = nodePath["normalize"](filename);
          var ret = nodeFS["readFileSync"](filename);
          return binary ? ret : ret.toString();
        };
        Module["readBinary"] = function readBinary(filename) {
          var ret = Module["read"](filename, true);
          if (!ret.buffer) {
            ret = new Uint8Array(ret);
          }
          assert(ret.buffer);
          return ret;
        };
        Module["load"] = function load(f) {
          globalEval(read(f));
        };
        if (!Module["thisProgram"]) {
          if (process["argv"].length > 1) {
            Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
          } else {
            Module["thisProgram"] = "unknown-program";
          }
        }
        Module["arguments"] = process["argv"].slice(2);
        if (typeof module !== "undefined") {
          module["exports"] = Module;
        }
        process["on"]("uncaughtException", function(ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex;
          }
        });
        Module["inspect"] = function() {
          return "[Emscripten Module object]";
        };
      } else if (ENVIRONMENT_IS_SHELL) {
        if (!Module["print"]) Module["print"] = print;
        if (typeof printErr != "undefined") Module["printErr"] = printErr;
        if (typeof read != "undefined") {
          Module["read"] = read;
        } else {
          Module["read"] = function shell_read() {
            throw "no read() available";
          };
        }
        Module["readBinary"] = function readBinary(f) {
          if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f));
          }
          var data = read(f, "binary");
          assert(typeof data === "object");
          return data;
        };
        if (typeof scriptArgs != "undefined") {
          Module["arguments"] = scriptArgs;
        } else if (typeof arguments != "undefined") {
          Module["arguments"] = arguments;
        }
        if (typeof quit === "function") {
          Module["quit"] = function(status, toThrow) {
            quit(status);
          };
        }
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        Module["read"] = function shell_read(url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          Module["readBinary"] = function readBinary(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        Module["readAsync"] = function readAsync(url, onload, onerror) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
            } else {
              onerror();
            }
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
        if (typeof arguments != "undefined") {
          Module["arguments"] = arguments;
        }
        if (typeof console !== "undefined") {
          if (!Module["print"]) Module["print"] = function shell_print(x2) {
            console.log(x2);
          };
          if (!Module["printErr"]) Module["printErr"] = function shell_printErr(x2) {
            console.warn(x2);
          };
        } else {
          var TRY_USE_DUMP = false;
          if (!Module["print"]) Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? function(x2) {
            dump(x2);
          } : function(x2) {
          };
        }
        if (ENVIRONMENT_IS_WORKER) {
          Module["load"] = importScripts;
        }
        if (typeof Module["setWindowTitle"] === "undefined") {
          Module["setWindowTitle"] = function(title) {
            document.title = title;
          };
        }
      } else {
        throw "Unknown runtime environment. Where are we?";
      }
      function globalEval(x2) {
        eval.call(null, x2);
      }
      if (!Module["load"] && Module["read"]) {
        Module["load"] = function load(f) {
          globalEval(Module["read"](f));
        };
      }
      if (!Module["print"]) {
        Module["print"] = function() {
        };
      }
      if (!Module["printErr"]) {
        Module["printErr"] = Module["print"];
      }
      if (!Module["arguments"]) {
        Module["arguments"] = [];
      }
      if (!Module["thisProgram"]) {
        Module["thisProgram"] = "./this.program";
      }
      if (!Module["quit"]) {
        Module["quit"] = function(status, toThrow) {
          throw toThrow;
        };
      }
      Module.print = Module["print"];
      Module.printErr = Module["printErr"];
      Module["preRun"] = [];
      Module["postRun"] = [];
      for (var key in moduleOverrides) {
        if (moduleOverrides.hasOwnProperty(key)) {
          Module[key] = moduleOverrides[key];
        }
      }
      moduleOverrides = void 0;
      var Runtime = { setTempRet0: function(value) {
        tempRet0 = value;
        return value;
      }, getTempRet0: function() {
        return tempRet0;
      }, stackSave: function() {
        return STACKTOP;
      }, stackRestore: function(stackTop) {
        STACKTOP = stackTop;
      }, getNativeTypeSize: function(type2) {
        switch (type2) {
          case "i1":
          case "i8":
            return 1;
          case "i16":
            return 2;
          case "i32":
            return 4;
          case "i64":
            return 8;
          case "float":
            return 4;
          case "double":
            return 8;
          default: {
            if (type2[type2.length - 1] === "*") {
              return Runtime.QUANTUM_SIZE;
            } else if (type2[0] === "i") {
              var bits = parseInt(type2.substr(1));
              assert(bits % 8 === 0);
              return bits / 8;
            } else {
              return 0;
            }
          }
        }
      }, getNativeFieldSize: function(type2) {
        return Math.max(Runtime.getNativeTypeSize(type2), Runtime.QUANTUM_SIZE);
      }, STACK_ALIGN: 16, prepVararg: function(ptr2, type2) {
        if (type2 === "double" || type2 === "i64") {
          if (ptr2 & 7) {
            assert((ptr2 & 7) === 4);
            ptr2 += 4;
          }
        } else {
          assert((ptr2 & 3) === 0);
        }
        return ptr2;
      }, getAlignSize: function(type2, size, vararg) {
        if (!vararg && (type2 == "i64" || type2 == "double")) return 8;
        if (!type2) return Math.min(size, 8);
        return Math.min(size || (type2 ? Runtime.getNativeFieldSize(type2) : 0), Runtime.QUANTUM_SIZE);
      }, dynCall: function(sig, ptr2, args) {
        if (args && args.length) {
          return Module["dynCall_" + sig].apply(null, [ptr2].concat(args));
        } else {
          return Module["dynCall_" + sig].call(null, ptr2);
        }
      }, functionPointers: [], addFunction: function(func2) {
        for (var i3 = 0; i3 < Runtime.functionPointers.length; i3++) {
          if (!Runtime.functionPointers[i3]) {
            Runtime.functionPointers[i3] = func2;
            return 2 * (1 + i3);
          }
        }
        throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
      }, removeFunction: function(index) {
        Runtime.functionPointers[(index - 2) / 2] = null;
      }, warnOnce: function(text) {
        if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
        if (!Runtime.warnOnce.shown[text]) {
          Runtime.warnOnce.shown[text] = 1;
          Module.printErr(text);
        }
      }, funcWrappers: {}, getFuncWrapper: function(func2, sig) {
        if (!func2) return;
        assert(sig);
        if (!Runtime.funcWrappers[sig]) {
          Runtime.funcWrappers[sig] = {};
        }
        var sigCache = Runtime.funcWrappers[sig];
        if (!sigCache[func2]) {
          if (sig.length === 1) {
            sigCache[func2] = function dynCall_wrapper() {
              return Runtime.dynCall(sig, func2);
            };
          } else if (sig.length === 2) {
            sigCache[func2] = function dynCall_wrapper(arg2) {
              return Runtime.dynCall(sig, func2, [arg2]);
            };
          } else {
            sigCache[func2] = function dynCall_wrapper() {
              return Runtime.dynCall(sig, func2, Array.prototype.slice.call(arguments));
            };
          }
        }
        return sigCache[func2];
      }, getCompilerSetting: function(name) {
        throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
      }, stackAlloc: function(size) {
        var ret = STACKTOP;
        STACKTOP = STACKTOP + size | 0;
        STACKTOP = STACKTOP + 15 & -16;
        return ret;
      }, staticAlloc: function(size) {
        var ret = STATICTOP;
        STATICTOP = STATICTOP + size | 0;
        STATICTOP = STATICTOP + 15 & -16;
        return ret;
      }, dynamicAlloc: function(size) {
        var ret = HEAP32[DYNAMICTOP_PTR >> 2];
        var end = (ret + size + 15 | 0) & -16;
        HEAP32[DYNAMICTOP_PTR >> 2] = end;
        if (end >= TOTAL_MEMORY) {
          var success = enlargeMemory();
          if (!success) {
            HEAP32[DYNAMICTOP_PTR >> 2] = ret;
            return 0;
          }
        }
        return ret;
      }, alignMemory: function(size, quantum) {
        var ret = size = Math.ceil(size / (quantum ? quantum : 16)) * (quantum ? quantum : 16);
        return ret;
      }, makeBigInt: function(low, high, unsigned) {
        var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296;
        return ret;
      }, GLOBAL_BASE: 8, QUANTUM_SIZE: 4, __dummy__: 0 };
      Module["Runtime"] = Runtime;
      var ABORT = 0;
      var EXITSTATUS = 0;
      function assert(condition, text) {
        if (!condition) {
          abort("Assertion failed: " + text);
        }
      }
      function getCFunc(ident) {
        var func = Module["_" + ident];
        if (!func) {
          try {
            func = eval("_" + ident);
          } catch (e) {
          }
        }
        assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
        return func;
      }
      var cwrap, ccall;
      (function() {
        var JSfuncs = { "stackSave": function() {
          Runtime.stackSave();
        }, "stackRestore": function() {
          Runtime.stackRestore();
        }, "arrayToC": function(arr) {
          var ret = Runtime.stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }, "stringToC": function(str) {
          var ret = 0;
          if (str !== null && str !== void 0 && str !== 0) {
            var len = (str.length << 2) + 1;
            ret = Runtime.stackAlloc(len);
            stringToUTF8(str, ret, len);
          }
          return ret;
        } };
        var toC = { "string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"] };
        ccall = function ccallFunc(ident2, returnType2, argTypes2, args, opts) {
          var func2 = getCFunc(ident2);
          var cArgs = [];
          var stack = 0;
          if (args) {
            for (var i3 = 0; i3 < args.length; i3++) {
              var converter = toC[argTypes2[i3]];
              if (converter) {
                if (stack === 0) stack = Runtime.stackSave();
                cArgs[i3] = converter(args[i3]);
              } else {
                cArgs[i3] = args[i3];
              }
            }
          }
          var ret = func2.apply(null, cArgs);
          if (returnType2 === "string") ret = Pointer_stringify(ret);
          if (stack !== 0) {
            if (opts && opts.async) {
              EmterpreterAsync.asyncFinalizers.push(function() {
                Runtime.stackRestore(stack);
              });
              return;
            }
            Runtime.stackRestore(stack);
          }
          return ret;
        };
        var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
        function parseJSFunc(jsfunc) {
          var parsed = jsfunc.toString().match(sourceRegex).slice(1);
          return { arguments: parsed[0], body: parsed[1], returnValue: parsed[2] };
        }
        var JSsource = null;
        function ensureJSsource() {
          if (!JSsource) {
            JSsource = {};
            for (var fun in JSfuncs) {
              if (JSfuncs.hasOwnProperty(fun)) {
                JSsource[fun] = parseJSFunc(JSfuncs[fun]);
              }
            }
          }
        }
        cwrap = function cwrap(ident, returnType, argTypes) {
          argTypes = argTypes || [];
          var cfunc = getCFunc(ident);
          var numericArgs = argTypes.every(function(type2) {
            return type2 === "number";
          });
          var numericRet = returnType !== "string";
          if (numericRet && numericArgs) {
            return cfunc;
          }
          var argNames = argTypes.map(function(x2, i3) {
            return "$" + i3;
          });
          var funcstr = "(function(" + argNames.join(",") + ") {";
          var nargs = argTypes.length;
          if (!numericArgs) {
            ensureJSsource();
            funcstr += "var stack = " + JSsource["stackSave"].body + ";";
            for (var i = 0; i < nargs; i++) {
              var arg = argNames[i], type = argTypes[i];
              if (type === "number") continue;
              var convertCode = JSsource[type + "ToC"];
              funcstr += "var " + convertCode.arguments + " = " + arg + ";";
              funcstr += convertCode.body + ";";
              funcstr += arg + "=(" + convertCode.returnValue + ");";
            }
          }
          var cfuncname = parseJSFunc(function() {
            return cfunc;
          }).returnValue;
          funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
          if (!numericRet) {
            var strgfy = parseJSFunc(function() {
              return Pointer_stringify;
            }).returnValue;
            funcstr += "ret = " + strgfy + "(ret);";
          }
          if (!numericArgs) {
            ensureJSsource();
            funcstr += JSsource["stackRestore"].body.replace("()", "(stack)") + ";";
          }
          funcstr += "return ret})";
          return eval(funcstr);
        };
      })();
      Module["ccall"] = ccall;
      Module["cwrap"] = cwrap;
      function setValue(ptr2, value, type2, noSafe) {
        type2 = type2 || "i8";
        if (type2.charAt(type2.length - 1) === "*") type2 = "i32";
        switch (type2) {
          case "i1":
            HEAP8[ptr2 >> 0] = value;
            break;
          case "i8":
            HEAP8[ptr2 >> 0] = value;
            break;
          case "i16":
            HEAP16[ptr2 >> 1] = value;
            break;
          case "i32":
            HEAP32[ptr2 >> 2] = value;
            break;
          case "i64":
            tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr2 >> 2] = tempI64[0], HEAP32[ptr2 + 4 >> 2] = tempI64[1];
            break;
          case "float":
            HEAPF32[ptr2 >> 2] = value;
            break;
          case "double":
            HEAPF64[ptr2 >> 3] = value;
            break;
          default:
            abort("invalid type for setValue: " + type2);
        }
      }
      Module["setValue"] = setValue;
      function getValue(ptr2, type2, noSafe) {
        type2 = type2 || "i8";
        if (type2.charAt(type2.length - 1) === "*") type2 = "i32";
        switch (type2) {
          case "i1":
            return HEAP8[ptr2 >> 0];
          case "i8":
            return HEAP8[ptr2 >> 0];
          case "i16":
            return HEAP16[ptr2 >> 1];
          case "i32":
            return HEAP32[ptr2 >> 2];
          case "i64":
            return HEAP32[ptr2 >> 2];
          case "float":
            return HEAPF32[ptr2 >> 2];
          case "double":
            return HEAPF64[ptr2 >> 3];
          default:
            abort("invalid type for setValue: " + type2);
        }
        return null;
      }
      Module["getValue"] = getValue;
      var ALLOC_NORMAL = 0;
      var ALLOC_STACK = 1;
      var ALLOC_STATIC = 2;
      var ALLOC_DYNAMIC = 3;
      var ALLOC_NONE = 4;
      Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
      Module["ALLOC_STACK"] = ALLOC_STACK;
      Module["ALLOC_STATIC"] = ALLOC_STATIC;
      Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
      Module["ALLOC_NONE"] = ALLOC_NONE;
      function allocate(slab, types, allocator, ptr2) {
        var zeroinit, size;
        if (typeof slab === "number") {
          zeroinit = true;
          size = slab;
        } else {
          zeroinit = false;
          size = slab.length;
        }
        var singleType = typeof types === "string" ? types : null;
        var ret;
        if (allocator == ALLOC_NONE) {
          ret = ptr2;
        } else {
          ret = [typeof _malloc === "function" ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === void 0 ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
        }
        if (zeroinit) {
          var ptr2 = ret, stop;
          assert((ret & 3) == 0);
          stop = ret + (size & ~3);
          for (; ptr2 < stop; ptr2 += 4) {
            HEAP32[ptr2 >> 2] = 0;
          }
          stop = ret + size;
          while (ptr2 < stop) {
            HEAP8[ptr2++ >> 0] = 0;
          }
          return ret;
        }
        if (singleType === "i8") {
          if (slab.subarray || slab.slice) {
            HEAPU8.set(slab, ret);
          } else {
            HEAPU8.set(new Uint8Array(slab), ret);
          }
          return ret;
        }
        var i3 = 0, type2, typeSize, previousType;
        while (i3 < size) {
          var curr = slab[i3];
          if (typeof curr === "function") {
            curr = Runtime.getFunctionIndex(curr);
          }
          type2 = singleType || types[i3];
          if (type2 === 0) {
            i3++;
            continue;
          }
          if (type2 == "i64") type2 = "i32";
          setValue(ret + i3, curr, type2);
          if (previousType !== type2) {
            typeSize = Runtime.getNativeTypeSize(type2);
            previousType = type2;
          }
          i3 += typeSize;
        }
        return ret;
      }
      Module["allocate"] = allocate;
      function getMemory(size) {
        if (!staticSealed) return Runtime.staticAlloc(size);
        if (!runtimeInitialized) return Runtime.dynamicAlloc(size);
        return _malloc(size);
      }
      Module["getMemory"] = getMemory;
      function Pointer_stringify(ptr2, length) {
        if (length === 0 || !ptr2) return "";
        var hasUtf = 0;
        var t2;
        var i3 = 0;
        while (1) {
          t2 = HEAPU8[ptr2 + i3 >> 0];
          hasUtf |= t2;
          if (t2 == 0 && !length) break;
          i3++;
          if (length && i3 == length) break;
        }
        if (!length) length = i3;
        var ret = "";
        if (hasUtf < 128) {
          var MAX_CHUNK = 1024;
          var curr;
          while (length > 0) {
            curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr2, ptr2 + Math.min(length, MAX_CHUNK)));
            ret = ret ? ret + curr : curr;
            ptr2 += MAX_CHUNK;
            length -= MAX_CHUNK;
          }
          return ret;
        }
        return Module["UTF8ToString"](ptr2);
      }
      Module["Pointer_stringify"] = Pointer_stringify;
      function AsciiToString(ptr2) {
        var str = "";
        while (1) {
          var ch = HEAP8[ptr2++ >> 0];
          if (!ch) return str;
          str += String.fromCharCode(ch);
        }
      }
      Module["AsciiToString"] = AsciiToString;
      function stringToAscii(str, outPtr) {
        return writeAsciiToMemory(str, outPtr, false);
      }
      Module["stringToAscii"] = stringToAscii;
      var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
      function UTF8ArrayToString(u8Array, idx) {
        var endPtr = idx;
        while (u8Array[endPtr]) ++endPtr;
        if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
          return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
        } else {
          var u0, u1, u2, u3, u4, u5;
          var str = "";
          while (1) {
            u0 = u8Array[idx++];
            if (!u0) return str;
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            u1 = u8Array[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            u2 = u8Array[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              u3 = u8Array[idx++] & 63;
              if ((u0 & 248) == 240) {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3;
              } else {
                u4 = u8Array[idx++] & 63;
                if ((u0 & 252) == 248) {
                  u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4;
                } else {
                  u5 = u8Array[idx++] & 63;
                  u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5;
                }
              }
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
        }
      }
      Module["UTF8ArrayToString"] = UTF8ArrayToString;
      function UTF8ToString(ptr2) {
        return UTF8ArrayToString(HEAPU8, ptr2);
      }
      Module["UTF8ToString"] = UTF8ToString;
      function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i3 = 0; i3 < str.length; ++i3) {
          var u = str.charCodeAt(i3);
          if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i3) & 1023;
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63;
          } else if (u <= 2097151) {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63;
          } else if (u <= 67108863) {
            if (outIdx + 4 >= endIdx) break;
            outU8Array[outIdx++] = 248 | u >> 24;
            outU8Array[outIdx++] = 128 | u >> 18 & 63;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63;
          } else {
            if (outIdx + 5 >= endIdx) break;
            outU8Array[outIdx++] = 252 | u >> 30;
            outU8Array[outIdx++] = 128 | u >> 24 & 63;
            outU8Array[outIdx++] = 128 | u >> 18 & 63;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63;
          }
        }
        outU8Array[outIdx] = 0;
        return outIdx - startIdx;
      }
      Module["stringToUTF8Array"] = stringToUTF8Array;
      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }
      Module["stringToUTF8"] = stringToUTF8;
      function lengthBytesUTF8(str) {
        var len = 0;
        for (var i3 = 0; i3 < str.length; ++i3) {
          var u = str.charCodeAt(i3);
          if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i3) & 1023;
          if (u <= 127) {
            ++len;
          } else if (u <= 2047) {
            len += 2;
          } else if (u <= 65535) {
            len += 3;
          } else if (u <= 2097151) {
            len += 4;
          } else if (u <= 67108863) {
            len += 5;
          } else {
            len += 6;
          }
        }
        return len;
      }
      Module["lengthBytesUTF8"] = lengthBytesUTF8;
      var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
      function demangle(func2) {
        var __cxa_demangle_func = Module["___cxa_demangle"] || Module["__cxa_demangle"];
        if (__cxa_demangle_func) {
          try {
            var s2 = func2.substr(1);
            var len = lengthBytesUTF8(s2) + 1;
            var buf = _malloc(len);
            stringToUTF8(s2, buf, len);
            var status = _malloc(4);
            var ret = __cxa_demangle_func(buf, 0, 0, status);
            if (getValue(status, "i32") === 0 && ret) {
              return Pointer_stringify(ret);
            }
          } catch (e) {
          } finally {
            if (buf) _free(buf);
            if (status) _free(status);
            if (ret) _free(ret);
          }
          return func2;
        }
        Runtime.warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
        return func2;
      }
      function demangleAll(text) {
        var regex = /__Z[\w\d_]+/g;
        return text.replace(regex, function(x2) {
          var y2 = demangle(x2);
          return x2 === y2 ? x2 : x2 + " [" + y2 + "]";
        });
      }
      function jsStackTrace() {
        var err2 = new Error();
        if (!err2.stack) {
          try {
            throw new Error(0);
          } catch (e) {
            err2 = e;
          }
          if (!err2.stack) {
            return "(no stack trace available)";
          }
        }
        return err2.stack.toString();
      }
      function stackTrace() {
        var js = jsStackTrace();
        if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
        return demangleAll(js);
      }
      Module["stackTrace"] = stackTrace;
      var HEAP, buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
      function updateGlobalBufferViews() {
        Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
        Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
        Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
        Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
        Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
        Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
        Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
        Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
      }
      var STATIC_BASE, STATICTOP, staticSealed;
      var STACK_BASE, STACKTOP, STACK_MAX;
      var DYNAMIC_BASE, DYNAMICTOP_PTR;
      STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
      staticSealed = false;
      function abortOnCannotGrowMemory() {
        abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
      }
      function enlargeMemory() {
        abortOnCannotGrowMemory();
      }
      var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
      var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 268435456;
      if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
      if (Module["buffer"]) {
        buffer = Module["buffer"];
      } else {
        {
          buffer = new ArrayBuffer(TOTAL_MEMORY);
        }
      }
      updateGlobalBufferViews();
      function getTotalMemory() {
        return TOTAL_MEMORY;
      }
      HEAP32[0] = 1668509029;
      HEAP16[1] = 25459;
      if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";
      Module["HEAP"] = HEAP;
      Module["buffer"] = buffer;
      Module["HEAP8"] = HEAP8;
      Module["HEAP16"] = HEAP16;
      Module["HEAP32"] = HEAP32;
      Module["HEAPU8"] = HEAPU8;
      Module["HEAPU16"] = HEAPU16;
      Module["HEAPU32"] = HEAPU32;
      Module["HEAPF32"] = HEAPF32;
      Module["HEAPF64"] = HEAPF64;
      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback == "function") {
            callback();
            continue;
          }
          var func2 = callback.func;
          if (typeof func2 === "number") {
            if (callback.arg === void 0) {
              Module["dynCall_v"](func2);
            } else {
              Module["dynCall_vi"](func2, callback.arg);
            }
          } else {
            func2(callback.arg === void 0 ? null : callback.arg);
          }
        }
      }
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATMAIN__ = [];
      var __ATEXIT__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      var runtimeExited = false;
      function preRun() {
        if (Module["preRun"]) {
          if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
          while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function ensureInitRuntime() {
        if (runtimeInitialized) return;
        runtimeInitialized = true;
        callRuntimeCallbacks(__ATINIT__);
      }
      function preMain() {
        callRuntimeCallbacks(__ATMAIN__);
      }
      function exitRuntime() {
        callRuntimeCallbacks(__ATEXIT__);
        runtimeExited = true;
      }
      function postRun() {
        if (Module["postRun"]) {
          if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
          while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(cb2) {
        __ATPRERUN__.unshift(cb2);
      }
      Module["addOnPreRun"] = addOnPreRun;
      function addOnInit(cb2) {
        __ATINIT__.unshift(cb2);
      }
      Module["addOnInit"] = addOnInit;
      function addOnPreMain(cb2) {
        __ATMAIN__.unshift(cb2);
      }
      Module["addOnPreMain"] = addOnPreMain;
      function addOnExit(cb2) {
        __ATEXIT__.unshift(cb2);
      }
      Module["addOnExit"] = addOnExit;
      function addOnPostRun(cb2) {
        __ATPOSTRUN__.unshift(cb2);
      }
      Module["addOnPostRun"] = addOnPostRun;
      function intArrayFromString(stringy, dontAddNull, length) {
        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        if (dontAddNull) u8array.length = numBytesWritten;
        return u8array;
      }
      Module["intArrayFromString"] = intArrayFromString;
      function intArrayToString(array) {
        var ret = [];
        for (var i3 = 0; i3 < array.length; i3++) {
          var chr = array[i3];
          if (chr > 255) {
            chr &= 255;
          }
          ret.push(String.fromCharCode(chr));
        }
        return ret.join("");
      }
      Module["intArrayToString"] = intArrayToString;
      function writeStringToMemory(string, buffer2, dontAddNull) {
        Runtime.warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
        var lastChar, end;
        if (dontAddNull) {
          end = buffer2 + lengthBytesUTF8(string);
          lastChar = HEAP8[end];
        }
        stringToUTF8(string, buffer2, Infinity);
        if (dontAddNull) HEAP8[end] = lastChar;
      }
      Module["writeStringToMemory"] = writeStringToMemory;
      function writeArrayToMemory(array, buffer2) {
        HEAP8.set(array, buffer2);
      }
      Module["writeArrayToMemory"] = writeArrayToMemory;
      function writeAsciiToMemory(str, buffer2, dontAddNull) {
        for (var i3 = 0; i3 < str.length; ++i3) {
          HEAP8[buffer2++ >> 0] = str.charCodeAt(i3);
        }
        if (!dontAddNull) HEAP8[buffer2 >> 0] = 0;
      }
      Module["writeAsciiToMemory"] = writeAsciiToMemory;
      if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5) Math["imul"] = function imul(a2, b2) {
        var ah = a2 >>> 16;
        var al = a2 & 65535;
        var bh = b2 >>> 16;
        var bl = b2 & 65535;
        return al * bl + (ah * bl + al * bh << 16) | 0;
      };
      Math.imul = Math["imul"];
      if (!Math["fround"]) {
        var froundBuffer = new Float32Array(1);
        Math["fround"] = function(x2) {
          froundBuffer[0] = x2;
          return froundBuffer[0];
        };
      }
      Math.fround = Math["fround"];
      if (!Math["clz32"]) Math["clz32"] = function(x2) {
        x2 = x2 >>> 0;
        for (var i3 = 0; i3 < 32; i3++) {
          if (x2 & 1 << 31 - i3) return i3;
        }
        return 32;
      };
      Math.clz32 = Math["clz32"];
      if (!Math["trunc"]) Math["trunc"] = function(x2) {
        return x2 < 0 ? Math.ceil(x2) : Math.floor(x2);
      };
      Math.trunc = Math["trunc"];
      var Math_abs = Math.abs;
      var Math_cos = Math.cos;
      var Math_sin = Math.sin;
      var Math_tan = Math.tan;
      var Math_acos = Math.acos;
      var Math_asin = Math.asin;
      var Math_atan = Math.atan;
      var Math_atan2 = Math.atan2;
      var Math_exp = Math.exp;
      var Math_log = Math.log;
      var Math_sqrt = Math.sqrt;
      var Math_ceil = Math.ceil;
      var Math_floor = Math.floor;
      var Math_pow = Math.pow;
      var Math_imul = Math.imul;
      var Math_fround = Math.fround;
      var Math_round = Math.round;
      var Math_min = Math.min;
      var Math_clz32 = Math.clz32;
      var Math_trunc = Math.trunc;
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;
      function getUniqueRunDependency(id) {
        return id;
      }
      function addRunDependency(id) {
        runDependencies++;
        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies);
        }
      }
      Module["addRunDependency"] = addRunDependency;
      function removeRunDependency(id) {
        runDependencies--;
        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies);
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      Module["removeRunDependency"] = removeRunDependency;
      Module["preloadedImages"] = {};
      Module["preloadedAudios"] = {};
      var ASM_CONSTS = [function($0, $1, $2, $3, $4, $5, $6, $7) {
        return _nbind.callbackSignatureList[$0].apply(this, arguments);
      }];
      function _emscripten_asm_const_iiiiiiii(code, a0, a1, a2, a3, a4, a5, a6) {
        return ASM_CONSTS[code](a0, a1, a2, a3, a4, a5, a6);
      }
      function _emscripten_asm_const_iiiii(code, a0, a1, a2, a3) {
        return ASM_CONSTS[code](a0, a1, a2, a3);
      }
      function _emscripten_asm_const_iiidddddd(code, a0, a1, a2, a3, a4, a5, a6, a7) {
        return ASM_CONSTS[code](a0, a1, a2, a3, a4, a5, a6, a7);
      }
      function _emscripten_asm_const_iiididi(code, a0, a1, a2, a3, a4, a5) {
        return ASM_CONSTS[code](a0, a1, a2, a3, a4, a5);
      }
      function _emscripten_asm_const_iiii(code, a0, a1, a2) {
        return ASM_CONSTS[code](a0, a1, a2);
      }
      function _emscripten_asm_const_iiiid(code, a0, a1, a2, a3) {
        return ASM_CONSTS[code](a0, a1, a2, a3);
      }
      function _emscripten_asm_const_iiiiii(code, a0, a1, a2, a3, a4) {
        return ASM_CONSTS[code](a0, a1, a2, a3, a4);
      }
      STATIC_BASE = Runtime.GLOBAL_BASE;
      STATICTOP = STATIC_BASE + 12800;
      __ATINIT__.push({ func: function() {
        __GLOBAL__sub_I_Yoga_cpp();
      } }, { func: function() {
        __GLOBAL__sub_I_nbind_cc();
      } }, { func: function() {
        __GLOBAL__sub_I_common_cc();
      } }, { func: function() {
        __GLOBAL__sub_I_Binding_cc();
      } });
      allocate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 192, 127, 3, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 3, 0, 0, 0, 0, 0, 192, 127, 3, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 128, 191, 0, 0, 128, 191, 0, 0, 192, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 63, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 190, 12, 0, 0, 200, 12, 0, 0, 208, 12, 0, 0, 216, 12, 0, 0, 230, 12, 0, 0, 242, 12, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 192, 127, 3, 0, 0, 0, 180, 45, 0, 0, 181, 45, 0, 0, 182, 45, 0, 0, 181, 45, 0, 0, 182, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 183, 45, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 184, 45, 0, 0, 185, 45, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 182, 45, 0, 0, 186, 45, 0, 0, 185, 45, 0, 0, 148, 4, 0, 0, 3, 0, 0, 0, 187, 45, 0, 0, 164, 4, 0, 0, 188, 45, 0, 0, 2, 0, 0, 0, 189, 45, 0, 0, 164, 4, 0, 0, 188, 45, 0, 0, 185, 45, 0, 0, 164, 4, 0, 0, 185, 45, 0, 0, 164, 4, 0, 0, 188, 45, 0, 0, 181, 45, 0, 0, 182, 45, 0, 0, 181, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 7, 0, 0, 0, 183, 45, 0, 0, 182, 45, 0, 0, 181, 45, 0, 0, 190, 45, 0, 0, 190, 45, 0, 0, 182, 45, 0, 0, 182, 45, 0, 0, 185, 45, 0, 0, 181, 45, 0, 0, 185, 45, 0, 0, 182, 45, 0, 0, 181, 45, 0, 0, 185, 45, 0, 0, 182, 45, 0, 0, 185, 45, 0, 0, 48, 5, 0, 0, 3, 0, 0, 0, 56, 5, 0, 0, 1, 0, 0, 0, 189, 45, 0, 0, 185, 45, 0, 0, 164, 4, 0, 0, 76, 5, 0, 0, 2, 0, 0, 0, 191, 45, 0, 0, 186, 45, 0, 0, 182, 45, 0, 0, 185, 45, 0, 0, 192, 45, 0, 0, 185, 45, 0, 0, 182, 45, 0, 0, 186, 45, 0, 0, 185, 45, 0, 0, 76, 5, 0, 0, 76, 5, 0, 0, 136, 5, 0, 0, 182, 45, 0, 0, 181, 45, 0, 0, 2, 0, 0, 0, 190, 45, 0, 0, 136, 5, 0, 0, 56, 19, 0, 0, 156, 5, 0, 0, 2, 0, 0, 0, 184, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 1, 0, 0, 0, 10, 0, 0, 0, 204, 5, 0, 0, 181, 45, 0, 0, 181, 45, 0, 0, 2, 0, 0, 0, 180, 45, 0, 0, 204, 5, 0, 0, 2, 0, 0, 0, 195, 45, 0, 0, 236, 5, 0, 0, 97, 19, 0, 0, 198, 45, 0, 0, 211, 45, 0, 0, 212, 45, 0, 0, 213, 45, 0, 0, 214, 45, 0, 0, 215, 45, 0, 0, 188, 45, 0, 0, 182, 45, 0, 0, 216, 45, 0, 0, 217, 45, 0, 0, 218, 45, 0, 0, 219, 45, 0, 0, 192, 45, 0, 0, 181, 45, 0, 0, 0, 0, 0, 0, 185, 45, 0, 0, 110, 19, 0, 0, 186, 45, 0, 0, 115, 19, 0, 0, 221, 45, 0, 0, 120, 19, 0, 0, 148, 4, 0, 0, 132, 19, 0, 0, 96, 6, 0, 0, 145, 19, 0, 0, 222, 45, 0, 0, 164, 19, 0, 0, 223, 45, 0, 0, 173, 19, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 104, 6, 0, 0, 1, 0, 0, 0, 187, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 11, 0, 0, 0, 12, 0, 0, 0, 1, 0, 0, 0, 13, 0, 0, 0, 185, 45, 0, 0, 224, 45, 0, 0, 164, 6, 0, 0, 188, 45, 0, 0, 172, 6, 0, 0, 180, 6, 0, 0, 2, 0, 0, 0, 188, 6, 0, 0, 7, 0, 0, 0, 224, 45, 0, 0, 7, 0, 0, 0, 164, 6, 0, 0, 1, 0, 0, 0, 213, 45, 0, 0, 185, 45, 0, 0, 224, 45, 0, 0, 172, 6, 0, 0, 185, 45, 0, 0, 224, 45, 0, 0, 164, 6, 0, 0, 185, 45, 0, 0, 224, 45, 0, 0, 211, 45, 0, 0, 211, 45, 0, 0, 222, 45, 0, 0, 211, 45, 0, 0, 224, 45, 0, 0, 222, 45, 0, 0, 211, 45, 0, 0, 224, 45, 0, 0, 172, 6, 0, 0, 222, 45, 0, 0, 211, 45, 0, 0, 224, 45, 0, 0, 188, 45, 0, 0, 222, 45, 0, 0, 211, 45, 0, 0, 40, 7, 0, 0, 188, 45, 0, 0, 2, 0, 0, 0, 224, 45, 0, 0, 185, 45, 0, 0, 188, 45, 0, 0, 188, 45, 0, 0, 188, 45, 0, 0, 188, 45, 0, 0, 222, 45, 0, 0, 224, 45, 0, 0, 148, 4, 0, 0, 185, 45, 0, 0, 148, 4, 0, 0, 148, 4, 0, 0, 148, 4, 0, 0, 148, 4, 0, 0, 148, 4, 0, 0, 185, 45, 0, 0, 164, 6, 0, 0, 148, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 14, 0, 0, 0, 15, 0, 0, 0, 1, 0, 0, 0, 16, 0, 0, 0, 148, 7, 0, 0, 2, 0, 0, 0, 225, 45, 0, 0, 183, 45, 0, 0, 188, 45, 0, 0, 168, 7, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 234, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 148, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 9, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 242, 45, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 111, 117, 108, 100, 32, 110, 111, 116, 32, 97, 108, 108, 111, 99, 97, 116, 101, 32, 109, 101, 109, 111, 114, 121, 32, 102, 111, 114, 32, 110, 111, 100, 101, 0, 67, 97, 110, 110, 111, 116, 32, 114, 101, 115, 101, 116, 32, 97, 32, 110, 111, 100, 101, 32, 119, 104, 105, 99, 104, 32, 115, 116, 105, 108, 108, 32, 104, 97, 115, 32, 99, 104, 105, 108, 100, 114, 101, 110, 32, 97, 116, 116, 97, 99, 104, 101, 100, 0, 67, 97, 110, 110, 111, 116, 32, 114, 101, 115, 101, 116, 32, 97, 32, 110, 111, 100, 101, 32, 115, 116, 105, 108, 108, 32, 97, 116, 116, 97, 99, 104, 101, 100, 32, 116, 111, 32, 97, 32, 112, 97, 114, 101, 110, 116, 0, 67, 111, 117, 108, 100, 32, 110, 111, 116, 32, 97, 108, 108, 111, 99, 97, 116, 101, 32, 109, 101, 109, 111, 114, 121, 32, 102, 111, 114, 32, 99, 111, 110, 102, 105, 103, 0, 67, 97, 110, 110, 111, 116, 32, 115, 101, 116, 32, 109, 101, 97, 115, 117, 114, 101, 32, 102, 117, 110, 99, 116, 105, 111, 110, 58, 32, 78, 111, 100, 101, 115, 32, 119, 105, 116, 104, 32, 109, 101, 97, 115, 117, 114, 101, 32, 102, 117, 110, 99, 116, 105, 111, 110, 115, 32, 99, 97, 110, 110, 111, 116, 32, 104, 97, 118, 101, 32, 99, 104, 105, 108, 100, 114, 101, 110, 46, 0, 67, 104, 105, 108, 100, 32, 97, 108, 114, 101, 97, 100, 121, 32, 104, 97, 115, 32, 97, 32, 112, 97, 114, 101, 110, 116, 44, 32, 105, 116, 32, 109, 117, 115, 116, 32, 98, 101, 32, 114, 101, 109, 111, 118, 101, 100, 32, 102, 105, 114, 115, 116, 46, 0, 67, 97, 110, 110, 111, 116, 32, 97, 100, 100, 32, 99, 104, 105, 108, 100, 58, 32, 78, 111, 100, 101, 115, 32, 119, 105, 116, 104, 32, 109, 101, 97, 115, 117, 114, 101, 32, 102, 117, 110, 99, 116, 105, 111, 110, 115, 32, 99, 97, 110, 110, 111, 116, 32, 104, 97, 118, 101, 32, 99, 104, 105, 108, 100, 114, 101, 110, 46, 0, 79, 110, 108, 121, 32, 108, 101, 97, 102, 32, 110, 111, 100, 101, 115, 32, 119, 105, 116, 104, 32, 99, 117, 115, 116, 111, 109, 32, 109, 101, 97, 115, 117, 114, 101, 32, 102, 117, 110, 99, 116, 105, 111, 110, 115, 115, 104, 111, 117, 108, 100, 32, 109, 97, 110, 117, 97, 108, 108, 121, 32, 109, 97, 114, 107, 32, 116, 104, 101, 109, 115, 101, 108, 118, 101, 115, 32, 97, 115, 32, 100, 105, 114, 116, 121, 0, 67, 97, 110, 110, 111, 116, 32, 103, 101, 116, 32, 108, 97, 121, 111, 117, 116, 32, 112, 114, 111, 112, 101, 114, 116, 105, 101, 115, 32, 111, 102, 32, 109, 117, 108, 116, 105, 45, 101, 100, 103, 101, 32, 115, 104, 111, 114, 116, 104, 97, 110, 100, 115, 0, 37, 115, 37, 100, 46, 123, 91, 115, 107, 105, 112, 112, 101, 100, 93, 32, 0, 119, 109, 58, 32, 37, 115, 44, 32, 104, 109, 58, 32, 37, 115, 44, 32, 97, 119, 58, 32, 37, 102, 32, 97, 104, 58, 32, 37, 102, 32, 61, 62, 32, 100, 58, 32, 40, 37, 102, 44, 32, 37, 102, 41, 32, 37, 115, 10, 0, 37, 115, 37, 100, 46, 123, 37, 115, 0, 42, 0, 119, 109, 58, 32, 37, 115, 44, 32, 104, 109, 58, 32, 37, 115, 44, 32, 97, 119, 58, 32, 37, 102, 32, 97, 104, 58, 32, 37, 102, 32, 37, 115, 10, 0, 37, 115, 37, 100, 46, 125, 37, 115, 0, 119, 109, 58, 32, 37, 115, 44, 32, 104, 109, 58, 32, 37, 115, 44, 32, 100, 58, 32, 40, 37, 102, 44, 32, 37, 102, 41, 32, 37, 115, 10, 0, 79, 117, 116, 32, 111, 102, 32, 99, 97, 99, 104, 101, 32, 101, 110, 116, 114, 105, 101, 115, 33, 10, 0, 83, 99, 97, 108, 101, 32, 102, 97, 99, 116, 111, 114, 32, 115, 104, 111, 117, 108, 100, 32, 110, 111, 116, 32, 98, 101, 32, 108, 101, 115, 115, 32, 116, 104, 97, 110, 32, 122, 101, 114, 111, 0, 105, 110, 105, 116, 105, 97, 108, 0, 37, 115, 10, 0, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 85, 78, 68, 69, 70, 73, 78, 69, 68, 0, 69, 88, 65, 67, 84, 76, 89, 0, 65, 84, 95, 77, 79, 83, 84, 0, 76, 65, 89, 95, 85, 78, 68, 69, 70, 73, 78, 69, 68, 0, 76, 65, 89, 95, 69, 88, 65, 67, 84, 76, 89, 0, 76, 65, 89, 95, 65, 84, 95, 77, 79, 83, 84, 0, 97, 118, 97, 105, 108, 97, 98, 108, 101, 87, 105, 100, 116, 104, 32, 105, 115, 32, 105, 110, 100, 101, 102, 105, 110, 105, 116, 101, 32, 115, 111, 32, 119, 105, 100, 116, 104, 77, 101, 97, 115, 117, 114, 101, 77, 111, 100, 101, 32, 109, 117, 115, 116, 32, 98, 101, 32, 89, 71, 77, 101, 97, 115, 117, 114, 101, 77, 111, 100, 101, 85, 110, 100, 101, 102, 105, 110, 101, 100, 0, 97, 118, 97, 105, 108, 97, 98, 108, 101, 72, 101, 105, 103, 104, 116, 32, 105, 115, 32, 105, 110, 100, 101, 102, 105, 110, 105, 116, 101, 32, 115, 111, 32, 104, 101, 105, 103, 104, 116, 77, 101, 97, 115, 117, 114, 101, 77, 111, 100, 101, 32, 109, 117, 115, 116, 32, 98, 101, 32, 89, 71, 77, 101, 97, 115, 117, 114, 101, 77, 111, 100, 101, 85, 110, 100, 101, 102, 105, 110, 101, 100, 0, 102, 108, 101, 120, 0, 115, 116, 114, 101, 116, 99, 104, 0, 109, 117, 108, 116, 105, 108, 105, 110, 101, 45, 115, 116, 114, 101, 116, 99, 104, 0, 69, 120, 112, 101, 99, 116, 101, 100, 32, 110, 111, 100, 101, 32, 116, 111, 32, 104, 97, 118, 101, 32, 99, 117, 115, 116, 111, 109, 32, 109, 101, 97, 115, 117, 114, 101, 32, 102, 117, 110, 99, 116, 105, 111, 110, 0, 109, 101, 97, 115, 117, 114, 101, 0, 69, 120, 112, 101, 99, 116, 32, 99, 117, 115, 116, 111, 109, 32, 98, 97, 115, 101, 108, 105, 110, 101, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 116, 111, 32, 110, 111, 116, 32, 114, 101, 116, 117, 114, 110, 32, 78, 97, 78, 0, 97, 98, 115, 45, 109, 101, 97, 115, 117, 114, 101, 0, 97, 98, 115, 45, 108, 97, 121, 111, 117, 116, 0, 78, 111, 100, 101, 0, 99, 114, 101, 97, 116, 101, 68, 101, 102, 97, 117, 108, 116, 0, 99, 114, 101, 97, 116, 101, 87, 105, 116, 104, 67, 111, 110, 102, 105, 103, 0, 100, 101, 115, 116, 114, 111, 121, 0, 114, 101, 115, 101, 116, 0, 99, 111, 112, 121, 83, 116, 121, 108, 101, 0, 115, 101, 116, 80, 111, 115, 105, 116, 105, 111, 110, 84, 121, 112, 101, 0, 115, 101, 116, 80, 111, 115, 105, 116, 105, 111, 110, 0, 115, 101, 116, 80, 111, 115, 105, 116, 105, 111, 110, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 65, 108, 105, 103, 110, 67, 111, 110, 116, 101, 110, 116, 0, 115, 101, 116, 65, 108, 105, 103, 110, 73, 116, 101, 109, 115, 0, 115, 101, 116, 65, 108, 105, 103, 110, 83, 101, 108, 102, 0, 115, 101, 116, 70, 108, 101, 120, 68, 105, 114, 101, 99, 116, 105, 111, 110, 0, 115, 101, 116, 70, 108, 101, 120, 87, 114, 97, 112, 0, 115, 101, 116, 74, 117, 115, 116, 105, 102, 121, 67, 111, 110, 116, 101, 110, 116, 0, 115, 101, 116, 77, 97, 114, 103, 105, 110, 0, 115, 101, 116, 77, 97, 114, 103, 105, 110, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 77, 97, 114, 103, 105, 110, 65, 117, 116, 111, 0, 115, 101, 116, 79, 118, 101, 114, 102, 108, 111, 119, 0, 115, 101, 116, 68, 105, 115, 112, 108, 97, 121, 0, 115, 101, 116, 70, 108, 101, 120, 0, 115, 101, 116, 70, 108, 101, 120, 66, 97, 115, 105, 115, 0, 115, 101, 116, 70, 108, 101, 120, 66, 97, 115, 105, 115, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 70, 108, 101, 120, 71, 114, 111, 119, 0, 115, 101, 116, 70, 108, 101, 120, 83, 104, 114, 105, 110, 107, 0, 115, 101, 116, 87, 105, 100, 116, 104, 0, 115, 101, 116, 87, 105, 100, 116, 104, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 87, 105, 100, 116, 104, 65, 117, 116, 111, 0, 115, 101, 116, 72, 101, 105, 103, 104, 116, 0, 115, 101, 116, 72, 101, 105, 103, 104, 116, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 72, 101, 105, 103, 104, 116, 65, 117, 116, 111, 0, 115, 101, 116, 77, 105, 110, 87, 105, 100, 116, 104, 0, 115, 101, 116, 77, 105, 110, 87, 105, 100, 116, 104, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 77, 105, 110, 72, 101, 105, 103, 104, 116, 0, 115, 101, 116, 77, 105, 110, 72, 101, 105, 103, 104, 116, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 77, 97, 120, 87, 105, 100, 116, 104, 0, 115, 101, 116, 77, 97, 120, 87, 105, 100, 116, 104, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 77, 97, 120, 72, 101, 105, 103, 104, 116, 0, 115, 101, 116, 77, 97, 120, 72, 101, 105, 103, 104, 116, 80, 101, 114, 99, 101, 110, 116, 0, 115, 101, 116, 65, 115, 112, 101, 99, 116, 82, 97, 116, 105, 111, 0, 115, 101, 116, 66, 111, 114, 100, 101, 114, 0, 115, 101, 116, 80, 97, 100, 100, 105, 110, 103, 0, 115, 101, 116, 80, 97, 100, 100, 105, 110, 103, 80, 101, 114, 99, 101, 110, 116, 0, 103, 101, 116, 80, 111, 115, 105, 116, 105, 111, 110, 84, 121, 112, 101, 0, 103, 101, 116, 80, 111, 115, 105, 116, 105, 111, 110, 0, 103, 101, 116, 65, 108, 105, 103, 110, 67, 111, 110, 116, 101, 110, 116, 0, 103, 101, 116, 65, 108, 105, 103, 110, 73, 116, 101, 109, 115, 0, 103, 101, 116, 65, 108, 105, 103, 110, 83, 101, 108, 102, 0, 103, 101, 116, 70, 108, 101, 120, 68, 105, 114, 101, 99, 116, 105, 111, 110, 0, 103, 101, 116, 70, 108, 101, 120, 87, 114, 97, 112, 0, 103, 101, 116, 74, 117, 115, 116, 105, 102, 121, 67, 111, 110, 116, 101, 110, 116, 0, 103, 101, 116, 77, 97, 114, 103, 105, 110, 0, 103, 101, 116, 70, 108, 101, 120, 66, 97, 115, 105, 115, 0, 103, 101, 116, 70, 108, 101, 120, 71, 114, 111, 119, 0, 103, 101, 116, 70, 108, 101, 120, 83, 104, 114, 105, 110, 107, 0, 103, 101, 116, 87, 105, 100, 116, 104, 0, 103, 101, 116, 72, 101, 105, 103, 104, 116, 0, 103, 101, 116, 77, 105, 110, 87, 105, 100, 116, 104, 0, 103, 101, 116, 77, 105, 110, 72, 101, 105, 103, 104, 116, 0, 103, 101, 116, 77, 97, 120, 87, 105, 100, 116, 104, 0, 103, 101, 116, 77, 97, 120, 72, 101, 105, 103, 104, 116, 0, 103, 101, 116, 65, 115, 112, 101, 99, 116, 82, 97, 116, 105, 111, 0, 103, 101, 116, 66, 111, 114, 100, 101, 114, 0, 103, 101, 116, 79, 118, 101, 114, 102, 108, 111, 119, 0, 103, 101, 116, 68, 105, 115, 112, 108, 97, 121, 0, 103, 101, 116, 80, 97, 100, 100, 105, 110, 103, 0, 105, 110, 115, 101, 114, 116, 67, 104, 105, 108, 100, 0, 114, 101, 109, 111, 118, 101, 67, 104, 105, 108, 100, 0, 103, 101, 116, 67, 104, 105, 108, 100, 67, 111, 117, 110, 116, 0, 103, 101, 116, 80, 97, 114, 101, 110, 116, 0, 103, 101, 116, 67, 104, 105, 108, 100, 0, 115, 101, 116, 77, 101, 97, 115, 117, 114, 101, 70, 117, 110, 99, 0, 117, 110, 115, 101, 116, 77, 101, 97, 115, 117, 114, 101, 70, 117, 110, 99, 0, 109, 97, 114, 107, 68, 105, 114, 116, 121, 0, 105, 115, 68, 105, 114, 116, 121, 0, 99, 97, 108, 99, 117, 108, 97, 116, 101, 76, 97, 121, 111, 117, 116, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 76, 101, 102, 116, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 82, 105, 103, 104, 116, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 84, 111, 112, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 66, 111, 116, 116, 111, 109, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 87, 105, 100, 116, 104, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 72, 101, 105, 103, 104, 116, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 76, 97, 121, 111, 117, 116, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 77, 97, 114, 103, 105, 110, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 66, 111, 114, 100, 101, 114, 0, 103, 101, 116, 67, 111, 109, 112, 117, 116, 101, 100, 80, 97, 100, 100, 105, 110, 103, 0, 67, 111, 110, 102, 105, 103, 0, 99, 114, 101, 97, 116, 101, 0, 115, 101, 116, 69, 120, 112, 101, 114, 105, 109, 101, 110, 116, 97, 108, 70, 101, 97, 116, 117, 114, 101, 69, 110, 97, 98, 108, 101, 100, 0, 115, 101, 116, 80, 111, 105, 110, 116, 83, 99, 97, 108, 101, 70, 97, 99, 116, 111, 114, 0, 105, 115, 69, 120, 112, 101, 114, 105, 109, 101, 110, 116, 97, 108, 70, 101, 97, 116, 117, 114, 101, 69, 110, 97, 98, 108, 101, 100, 0, 86, 97, 108, 117, 101, 0, 76, 97, 121, 111, 117, 116, 0, 83, 105, 122, 101, 0, 103, 101, 116, 73, 110, 115, 116, 97, 110, 99, 101, 67, 111, 117, 110, 116, 0, 73, 110, 116, 54, 52, 0, 1, 1, 1, 2, 2, 4, 4, 4, 4, 8, 8, 4, 8, 118, 111, 105, 100, 0, 98, 111, 111, 108, 0, 115, 116, 100, 58, 58, 115, 116, 114, 105, 110, 103, 0, 99, 98, 70, 117, 110, 99, 116, 105, 111, 110, 32, 38, 0, 99, 111, 110, 115, 116, 32, 99, 98, 70, 117, 110, 99, 116, 105, 111, 110, 32, 38, 0, 69, 120, 116, 101, 114, 110, 97, 108, 0, 66, 117, 102, 102, 101, 114, 0, 78, 66, 105, 110, 100, 73, 68, 0, 78, 66, 105, 110, 100, 0, 98, 105, 110, 100, 95, 118, 97, 108, 117, 101, 0, 114, 101, 102, 108, 101, 99, 116, 0, 113, 117, 101, 114, 121, 84, 121, 112, 101, 0, 108, 97, 108, 108, 111, 99, 0, 108, 114, 101, 115, 101, 116, 0, 123, 114, 101, 116, 117, 114, 110, 40, 95, 110, 98, 105, 110, 100, 46, 99, 97, 108, 108, 98, 97, 99, 107, 83, 105, 103, 110, 97, 116, 117, 114, 101, 76, 105, 115, 116, 91, 36, 48, 93, 46, 97, 112, 112, 108, 121, 40, 116, 104, 105, 115, 44, 97, 114, 103, 117, 109, 101, 110, 116, 115, 41, 41, 59, 125, 0, 95, 110, 98, 105, 110, 100, 95, 110, 101, 119, 0, 17, 0, 10, 0, 17, 17, 17, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 15, 10, 17, 17, 17, 3, 10, 7, 0, 1, 19, 9, 11, 11, 0, 0, 9, 6, 11, 0, 0, 11, 0, 6, 17, 0, 0, 0, 17, 17, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 10, 10, 17, 17, 17, 0, 10, 0, 0, 2, 0, 9, 11, 0, 0, 0, 9, 0, 11, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 12, 0, 0, 0, 0, 9, 12, 0, 0, 0, 0, 0, 12, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 4, 13, 0, 0, 0, 0, 9, 14, 0, 0, 0, 0, 0, 14, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 0, 9, 16, 0, 0, 0, 0, 0, 16, 0, 0, 16, 0, 0, 18, 0, 0, 0, 18, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 18, 18, 18, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 11, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 12, 0, 0, 0, 0, 9, 12, 0, 0, 0, 0, 0, 12, 0, 0, 12, 0, 0, 45, 43, 32, 32, 32, 48, 88, 48, 120, 0, 40, 110, 117, 108, 108, 41, 0, 45, 48, 88, 43, 48, 88, 32, 48, 88, 45, 48, 120, 43, 48, 120, 32, 48, 120, 0, 105, 110, 102, 0, 73, 78, 70, 0, 110, 97, 110, 0, 78, 65, 78, 0, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 46, 0, 84, 33, 34, 25, 13, 1, 2, 3, 17, 75, 28, 12, 16, 4, 11, 29, 18, 30, 39, 104, 110, 111, 112, 113, 98, 32, 5, 6, 15, 19, 20, 21, 26, 8, 22, 7, 40, 36, 23, 24, 9, 10, 14, 27, 31, 37, 35, 131, 130, 125, 38, 42, 43, 60, 61, 62, 63, 67, 71, 74, 77, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 105, 106, 107, 108, 114, 115, 116, 121, 122, 123, 124, 0, 73, 108, 108, 101, 103, 97, 108, 32, 98, 121, 116, 101, 32, 115, 101, 113, 117, 101, 110, 99, 101, 0, 68, 111, 109, 97, 105, 110, 32, 101, 114, 114, 111, 114, 0, 82, 101, 115, 117, 108, 116, 32, 110, 111, 116, 32, 114, 101, 112, 114, 101, 115, 101, 110, 116, 97, 98, 108, 101, 0, 78, 111, 116, 32, 97, 32, 116, 116, 121, 0, 80, 101, 114, 109, 105, 115, 115, 105, 111, 110, 32, 100, 101, 110, 105, 101, 100, 0, 79, 112, 101, 114, 97, 116, 105, 111, 110, 32, 110, 111, 116, 32, 112, 101, 114, 109, 105, 116, 116, 101, 100, 0, 78, 111, 32, 115, 117, 99, 104, 32, 102, 105, 108, 101, 32, 111, 114, 32, 100, 105, 114, 101, 99, 116, 111, 114, 121, 0, 78, 111, 32, 115, 117, 99, 104, 32, 112, 114, 111, 99, 101, 115, 115, 0, 70, 105, 108, 101, 32, 101, 120, 105, 115, 116, 115, 0, 86, 97, 108, 117, 101, 32, 116, 111, 111, 32, 108, 97, 114, 103, 101, 32, 102, 111, 114, 32, 100, 97, 116, 97, 32, 116, 121, 112, 101, 0, 78, 111, 32, 115, 112, 97, 99, 101, 32, 108, 101, 102, 116, 32, 111, 110, 32, 100, 101, 118, 105, 99, 101, 0, 79, 117, 116, 32, 111, 102, 32, 109, 101, 109, 111, 114, 121, 0, 82, 101, 115, 111, 117, 114, 99, 101, 32, 98, 117, 115, 121, 0, 73, 110, 116, 101, 114, 114, 117, 112, 116, 101, 100, 32, 115, 121, 115, 116, 101, 109, 32, 99, 97, 108, 108, 0, 82, 101, 115, 111, 117, 114, 99, 101, 32, 116, 101, 109, 112, 111, 114, 97, 114, 105, 108, 121, 32, 117, 110, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 73, 110, 118, 97, 108, 105, 100, 32, 115, 101, 101, 107, 0, 67, 114, 111, 115, 115, 45, 100, 101, 118, 105, 99, 101, 32, 108, 105, 110, 107, 0, 82, 101, 97, 100, 45, 111, 110, 108, 121, 32, 102, 105, 108, 101, 32, 115, 121, 115, 116, 101, 109, 0, 68, 105, 114, 101, 99, 116, 111, 114, 121, 32, 110, 111, 116, 32, 101, 109, 112, 116, 121, 0, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 32, 114, 101, 115, 101, 116, 32, 98, 121, 32, 112, 101, 101, 114, 0, 79, 112, 101, 114, 97, 116, 105, 111, 110, 32, 116, 105, 109, 101, 100, 32, 111, 117, 116, 0, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 32, 114, 101, 102, 117, 115, 101, 100, 0, 72, 111, 115, 116, 32, 105, 115, 32, 100, 111, 119, 110, 0, 72, 111, 115, 116, 32, 105, 115, 32, 117, 110, 114, 101, 97, 99, 104, 97, 98, 108, 101, 0, 65, 100, 100, 114, 101, 115, 115, 32, 105, 110, 32, 117, 115, 101, 0, 66, 114, 111, 107, 101, 110, 32, 112, 105, 112, 101, 0, 73, 47, 79, 32, 101, 114, 114, 111, 114, 0, 78, 111, 32, 115, 117, 99, 104, 32, 100, 101, 118, 105, 99, 101, 32, 111, 114, 32, 97, 100, 100, 114, 101, 115, 115, 0, 66, 108, 111, 99, 107, 32, 100, 101, 118, 105, 99, 101, 32, 114, 101, 113, 117, 105, 114, 101, 100, 0, 78, 111, 32, 115, 117, 99, 104, 32, 100, 101, 118, 105, 99, 101, 0, 78, 111, 116, 32, 97, 32, 100, 105, 114, 101, 99, 116, 111, 114, 121, 0, 73, 115, 32, 97, 32, 100, 105, 114, 101, 99, 116, 111, 114, 121, 0, 84, 101, 120, 116, 32, 102, 105, 108, 101, 32, 98, 117, 115, 121, 0, 69, 120, 101, 99, 32, 102, 111, 114, 109, 97, 116, 32, 101, 114, 114, 111, 114, 0, 73, 110, 118, 97, 108, 105, 100, 32, 97, 114, 103, 117, 109, 101, 110, 116, 0, 65, 114, 103, 117, 109, 101, 110, 116, 32, 108, 105, 115, 116, 32, 116, 111, 111, 32, 108, 111, 110, 103, 0, 83, 121, 109, 98, 111, 108, 105, 99, 32, 108, 105, 110, 107, 32, 108, 111, 111, 112, 0, 70, 105, 108, 101, 110, 97, 109, 101, 32, 116, 111, 111, 32, 108, 111, 110, 103, 0, 84, 111, 111, 32, 109, 97, 110, 121, 32, 111, 112, 101, 110, 32, 102, 105, 108, 101, 115, 32, 105, 110, 32, 115, 121, 115, 116, 101, 109, 0, 78, 111, 32, 102, 105, 108, 101, 32, 100, 101, 115, 99, 114, 105, 112, 116, 111, 114, 115, 32, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 66, 97, 100, 32, 102, 105, 108, 101, 32, 100, 101, 115, 99, 114, 105, 112, 116, 111, 114, 0, 78, 111, 32, 99, 104, 105, 108, 100, 32, 112, 114, 111, 99, 101, 115, 115, 0, 66, 97, 100, 32, 97, 100, 100, 114, 101, 115, 115, 0, 70, 105, 108, 101, 32, 116, 111, 111, 32, 108, 97, 114, 103, 101, 0, 84, 111, 111, 32, 109, 97, 110, 121, 32, 108, 105, 110, 107, 115, 0, 78, 111, 32, 108, 111, 99, 107, 115, 32, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 82, 101, 115, 111, 117, 114, 99, 101, 32, 100, 101, 97, 100, 108, 111, 99, 107, 32, 119, 111, 117, 108, 100, 32, 111, 99, 99, 117, 114, 0, 83, 116, 97, 116, 101, 32, 110, 111, 116, 32, 114, 101, 99, 111, 118, 101, 114, 97, 98, 108, 101, 0, 80, 114, 101, 118, 105, 111, 117, 115, 32, 111, 119, 110, 101, 114, 32, 100, 105, 101, 100, 0, 79, 112, 101, 114, 97, 116, 105, 111, 110, 32, 99, 97, 110, 99, 101, 108, 101, 100, 0, 70, 117, 110, 99, 116, 105, 111, 110, 32, 110, 111, 116, 32, 105, 109, 112, 108, 101, 109, 101, 110, 116, 101, 100, 0, 78, 111, 32, 109, 101, 115, 115, 97, 103, 101, 32, 111, 102, 32, 100, 101, 115, 105, 114, 101, 100, 32, 116, 121, 112, 101, 0, 73, 100, 101, 110, 116, 105, 102, 105, 101, 114, 32, 114, 101, 109, 111, 118, 101, 100, 0, 68, 101, 118, 105, 99, 101, 32, 110, 111, 116, 32, 97, 32, 115, 116, 114, 101, 97, 109, 0, 78, 111, 32, 100, 97, 116, 97, 32, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 68, 101, 118, 105, 99, 101, 32, 116, 105, 109, 101, 111, 117, 116, 0, 79, 117, 116, 32, 111, 102, 32, 115, 116, 114, 101, 97, 109, 115, 32, 114, 101, 115, 111, 117, 114, 99, 101, 115, 0, 76, 105, 110, 107, 32, 104, 97, 115, 32, 98, 101, 101, 110, 32, 115, 101, 118, 101, 114, 101, 100, 0, 80, 114, 111, 116, 111, 99, 111, 108, 32, 101, 114, 114, 111, 114, 0, 66, 97, 100, 32, 109, 101, 115, 115, 97, 103, 101, 0, 70, 105, 108, 101, 32, 100, 101, 115, 99, 114, 105, 112, 116, 111, 114, 32, 105, 110, 32, 98, 97, 100, 32, 115, 116, 97, 116, 101, 0, 78, 111, 116, 32, 97, 32, 115, 111, 99, 107, 101, 116, 0, 68, 101, 115, 116, 105, 110, 97, 116, 105, 111, 110, 32, 97, 100, 100, 114, 101, 115, 115, 32, 114, 101, 113, 117, 105, 114, 101, 100, 0, 77, 101, 115, 115, 97, 103, 101, 32, 116, 111, 111, 32, 108, 97, 114, 103, 101, 0, 80, 114, 111, 116, 111, 99, 111, 108, 32, 119, 114, 111, 110, 103, 32, 116, 121, 112, 101, 32, 102, 111, 114, 32, 115, 111, 99, 107, 101, 116, 0, 80, 114, 111, 116, 111, 99, 111, 108, 32, 110, 111, 116, 32, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 80, 114, 111, 116, 111, 99, 111, 108, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 0, 83, 111, 99, 107, 101, 116, 32, 116, 121, 112, 101, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 0, 78, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 0, 80, 114, 111, 116, 111, 99, 111, 108, 32, 102, 97, 109, 105, 108, 121, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 0, 65, 100, 100, 114, 101, 115, 115, 32, 102, 97, 109, 105, 108, 121, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 32, 98, 121, 32, 112, 114, 111, 116, 111, 99, 111, 108, 0, 65, 100, 100, 114, 101, 115, 115, 32, 110, 111, 116, 32, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 78, 101, 116, 119, 111, 114, 107, 32, 105, 115, 32, 100, 111, 119, 110, 0, 78, 101, 116, 119, 111, 114, 107, 32, 117, 110, 114, 101, 97, 99, 104, 97, 98, 108, 101, 0, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 32, 114, 101, 115, 101, 116, 32, 98, 121, 32, 110, 101, 116, 119, 111, 114, 107, 0, 67, 111, 110, 110, 101, 99, 116, 105, 111, 110, 32, 97, 98, 111, 114, 116, 101, 100, 0, 78, 111, 32, 98, 117, 102, 102, 101, 114, 32, 115, 112, 97, 99, 101, 32, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 83, 111, 99, 107, 101, 116, 32, 105, 115, 32, 99, 111, 110, 110, 101, 99, 116, 101, 100, 0, 83, 111, 99, 107, 101, 116, 32, 110, 111, 116, 32, 99, 111, 110, 110, 101, 99, 116, 101, 100, 0, 67, 97, 110, 110, 111, 116, 32, 115, 101, 110, 100, 32, 97, 102, 116, 101, 114, 32, 115, 111, 99, 107, 101, 116, 32, 115, 104, 117, 116, 100, 111, 119, 110, 0, 79, 112, 101, 114, 97, 116, 105, 111, 110, 32, 97, 108, 114, 101, 97, 100, 121, 32, 105, 110, 32, 112, 114, 111, 103, 114, 101, 115, 115, 0, 79, 112, 101, 114, 97, 116, 105, 111, 110, 32, 105, 110, 32, 112, 114, 111, 103, 114, 101, 115, 115, 0, 83, 116, 97, 108, 101, 32, 102, 105, 108, 101, 32, 104, 97, 110, 100, 108, 101, 0, 82, 101, 109, 111, 116, 101, 32, 73, 47, 79, 32, 101, 114, 114, 111, 114, 0, 81, 117, 111, 116, 97, 32, 101, 120, 99, 101, 101, 100, 101, 100, 0, 78, 111, 32, 109, 101, 100, 105, 117, 109, 32, 102, 111, 117, 110, 100, 0, 87, 114, 111, 110, 103, 32, 109, 101, 100, 105, 117, 109, 32, 116, 121, 112, 101, 0, 78, 111, 32, 101, 114, 114, 111, 114, 32, 105, 110, 102, 111, 114, 109, 97, 116, 105, 111, 110, 0, 0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
      var tempDoublePtr = STATICTOP;
      STATICTOP += 16;
      function _atexit(func2, arg2) {
        __ATEXIT__.unshift({ func: func2, arg: arg2 });
      }
      function ___cxa_atexit() {
        return _atexit.apply(null, arguments);
      }
      function _abort() {
        Module["abort"]();
      }
      function __ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj() {
        Module["printErr"]("missing function: _ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj");
        abort(-1);
      }
      function __decorate(decorators, target, key2, desc) {
        var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key2) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key2, desc);
        else for (var i3 = decorators.length - 1; i3 >= 0; i3--) if (d = decorators[i3]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key2, r2) : d(target, key2)) || r2;
        return c2 > 3 && r2 && Object.defineProperty(target, key2, r2), r2;
      }
      function _defineHidden(value) {
        return function(target, key2) {
          Object.defineProperty(target, key2, { configurable: false, enumerable: false, value, writable: true });
        };
      }
      var _nbind = {};
      function __nbind_free_external(num2) {
        _nbind.externalList[num2].dereference(num2);
      }
      function __nbind_reference_external(num2) {
        _nbind.externalList[num2].reference();
      }
      function _llvm_stackrestore(p) {
        var self2 = _llvm_stacksave;
        var ret = self2.LLVM_SAVEDSTACKS[p];
        self2.LLVM_SAVEDSTACKS.splice(p, 1);
        Runtime.stackRestore(ret);
      }
      function __nbind_register_pool(pageSize, usedPtr, rootPtr, pagePtr) {
        _nbind.Pool.pageSize = pageSize;
        _nbind.Pool.usedPtr = usedPtr / 4;
        _nbind.Pool.rootPtr = rootPtr;
        _nbind.Pool.pagePtr = pagePtr / 4;
        HEAP32[usedPtr / 4] = 16909060;
        if (HEAP8[usedPtr] == 1) _nbind.bigEndian = true;
        HEAP32[usedPtr / 4] = 0;
        _nbind.makeTypeKindTbl = (_a2 = {}, _a2[1024] = _nbind.PrimitiveType, _a2[64] = _nbind.Int64Type, _a2[2048] = _nbind.BindClass, _a2[3072] = _nbind.BindClassPtr, _a2[4096] = _nbind.SharedClassPtr, _a2[5120] = _nbind.ArrayType, _a2[6144] = _nbind.ArrayType, _a2[7168] = _nbind.CStringType, _a2[9216] = _nbind.CallbackType, _a2[10240] = _nbind.BindType, _a2);
        _nbind.makeTypeNameTbl = { "Buffer": _nbind.BufferType, "External": _nbind.ExternalType, "Int64": _nbind.Int64Type, "_nbind_new": _nbind.CreateValueType, "bool": _nbind.BooleanType, "cbFunction &": _nbind.CallbackType, "const cbFunction &": _nbind.CallbackType, "const std::string &": _nbind.StringType, "std::string": _nbind.StringType };
        Module["toggleLightGC"] = _nbind.toggleLightGC;
        _nbind.callUpcast = Module["dynCall_ii"];
        var globalScope = _nbind.makeType(_nbind.constructType, { flags: 2048, id: 0, name: "" });
        globalScope.proto = Module;
        _nbind.BindClass.list.push(globalScope);
        var _a2;
      }
      function _emscripten_set_main_loop_timing(mode, value) {
        Browser.mainLoop.timingMode = mode;
        Browser.mainLoop.timingValue = value;
        if (!Browser.mainLoop.func) {
          return 1;
        }
        if (mode == 0) {
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
          };
          Browser.mainLoop.method = "timeout";
        } else if (mode == 1) {
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner);
          };
          Browser.mainLoop.method = "rAF";
        } else if (mode == 2) {
          if (!window["setImmediate"]) {
            let Browser_setImmediate_messageHandler2 = function(event) {
              if (event.source === window && event.data === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            };
            var Browser_setImmediate_messageHandler = Browser_setImmediate_messageHandler2;
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";
            window.addEventListener("message", Browser_setImmediate_messageHandler2, true);
            window["setImmediate"] = function Browser_emulated_setImmediate(func2) {
              setImmediates.push(func2);
              if (ENVIRONMENT_IS_WORKER) {
                if (Module["setImmediates"] === void 0) Module["setImmediates"] = [];
                Module["setImmediates"].push(func2);
                window.postMessage({ target: emscriptenMainLoopMessageId });
              } else window.postMessage(emscriptenMainLoopMessageId, "*");
            };
          }
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            window["setImmediate"](Browser.mainLoop.runner);
          };
          Browser.mainLoop.method = "immediate";
        }
        return 0;
      }
      function _emscripten_get_now() {
        abort();
      }
      function _emscripten_set_main_loop(func2, fps, simulateInfiniteLoop, arg2, noSetTiming) {
        Module["noExitRuntime"] = true;
        assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
        Browser.mainLoop.func = func2;
        Browser.mainLoop.arg = arg2;
        var browserIterationFunc;
        if (typeof arg2 !== "undefined") {
          browserIterationFunc = function() {
            Module["dynCall_vi"](func2, arg2);
          };
        } else {
          browserIterationFunc = function() {
            Module["dynCall_v"](func2);
          };
        }
        var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
        Browser.mainLoop.runner = function Browser_mainLoop_runner() {
          if (ABORT) return;
          if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
              var remaining = Browser.mainLoop.remainingBlockers;
              var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
              if (blocker.counted) {
                Browser.mainLoop.remainingBlockers = next;
              } else {
                next = next + 0.5;
                Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
              }
            }
            console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
            setTimeout(Browser.mainLoop.runner, 0);
            return;
          }
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
          Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
          if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return;
          } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now();
          }
          if (Browser.mainLoop.method === "timeout" && Module.ctx) {
            Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
            Browser.mainLoop.method = "";
          }
          Browser.mainLoop.runIter(browserIterationFunc);
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
          if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
          Browser.mainLoop.scheduler();
        };
        if (!noSetTiming) {
          if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
          else _emscripten_set_main_loop_timing(1, 1);
          Browser.mainLoop.scheduler();
        }
        if (simulateInfiniteLoop) {
          throw "SimulateInfiniteLoop";
        }
      }
      var Browser = { mainLoop: { scheduler: null, method: "", currentlyRunningMainloop: 0, func: null, arg: 0, timingMode: 0, timingValue: 0, currentFrameNumber: 0, queue: [], pause: function() {
        Browser.mainLoop.scheduler = null;
        Browser.mainLoop.currentlyRunningMainloop++;
      }, resume: function() {
        Browser.mainLoop.currentlyRunningMainloop++;
        var timingMode = Browser.mainLoop.timingMode;
        var timingValue = Browser.mainLoop.timingValue;
        var func2 = Browser.mainLoop.func;
        Browser.mainLoop.func = null;
        _emscripten_set_main_loop(func2, 0, false, Browser.mainLoop.arg, true);
        _emscripten_set_main_loop_timing(timingMode, timingValue);
        Browser.mainLoop.scheduler();
      }, updateStatus: function() {
        if (Module["setStatus"]) {
          var message = Module["statusMessage"] || "Please wait...";
          var remaining = Browser.mainLoop.remainingBlockers;
          var expected = Browser.mainLoop.expectedBlockers;
          if (remaining) {
            if (remaining < expected) {
              Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")");
            } else {
              Module["setStatus"](message);
            }
          } else {
            Module["setStatus"]("");
          }
        }
      }, runIter: function(func2) {
        if (ABORT) return;
        if (Module["preMainLoop"]) {
          var preRet = Module["preMainLoop"]();
          if (preRet === false) {
            return;
          }
        }
        try {
          func2();
        } catch (e) {
          if (e instanceof ExitStatus) {
            return;
          } else {
            if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [e, e.stack]);
            throw e;
          }
        }
        if (Module["postMainLoop"]) Module["postMainLoop"]();
      } }, isFullscreen: false, pointerLock: false, moduleContextCreatedCallbacks: [], workers: [], init: function() {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        if (Browser.initted) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch (e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
        Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : void 0;
        if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b2 = null;
          if (Browser.hasBlobConstructor) {
            try {
              b2 = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b2.size !== byteArray.length) {
                b2 = new Blob([new Uint8Array(byteArray).buffer], { type: Browser.getMimetype(name) });
              }
            } catch (e) {
              Runtime.warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder");
            }
          }
          if (!b2) {
            var bb = new Browser.BlobBuilder();
            bb.append(new Uint8Array(byteArray).buffer);
            b2 = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b2);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, "Image " + name + " could not be decoded");
            var canvas2 = document.createElement("canvas");
            canvas2.width = img.width;
            canvas2.height = img.height;
            var ctx = canvas2.getContext("2d");
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas2;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log("Image " + url + " could not be decoded");
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module["preloadPlugins"].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 };
        };
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio2) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio2;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio();
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b2 = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch (e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b2);
            var audio = new Audio();
            audio.addEventListener("canplaythrough", function() {
              finish(audio);
            }, false);
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");
              function encode64(data) {
                var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var PAD = "=";
                var ret = "";
                var leftchar = 0;
                var leftbits = 0;
                for (var i3 = 0; i3 < data.length; i3++) {
                  leftchar = leftchar << 8 | data[i3];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = leftchar >> leftbits - 6 & 63;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar & 3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar & 15) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
              finish(audio);
            };
            audio.src = url;
            Browser.safeSetTimeout(function() {
              finish(audio);
            }, 1e4);
          } else {
            return fail();
          }
        };
        Module["preloadPlugins"].push(audioPlugin);
        function pointerLockChange() {
          Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"];
        }
        var canvas = Module["canvas"];
        if (canvas) {
          canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || function() {
          };
          canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || function() {
          };
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
          document.addEventListener("pointerlockchange", pointerLockChange, false);
          document.addEventListener("mozpointerlockchange", pointerLockChange, false);
          document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
          document.addEventListener("mspointerlockchange", pointerLockChange, false);
          if (Module["elementPointerLock"]) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                Module["canvas"].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      }, createContext: function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
          var contextAttributes = { antialias: false, alpha: false };
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
          contextHandle = GL.createContext(canvas, contextAttributes);
          if (contextHandle) {
            ctx = GL.getContext(contextHandle).GLctx;
          }
        } else {
          ctx = canvas.getContext("2d");
        }
        if (!ctx) return null;
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) {
            callback();
          });
          Browser.init();
        }
        return ctx;
      }, destroyContext: function(canvas, useWebGL, setInModule) {
      }, fullscreenHandlersInstalled: false, lockPointer: void 0, resizeCanvas: void 0, requestFullscreen: function(lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === "undefined") Browser.vrDevice = null;
        var canvas = Module["canvas"];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer2 = canvas.parentNode;
          if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer2) {
            canvas.exitFullscreen = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || function() {
            };
            canvas.exitFullscreen = canvas.exitFullscreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) Browser.setFullscreenCanvasSize();
          } else {
            canvasContainer2.parentNode.insertBefore(canvas, canvasContainer2);
            canvasContainer2.parentNode.removeChild(canvasContainer2);
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
          if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen);
          Browser.updateCanvasDimensions(canvas);
        }
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener("fullscreenchange", fullscreenChange, false);
          document.addEventListener("mozfullscreenchange", fullscreenChange, false);
          document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
          document.addEventListener("MSFullscreenChange", fullscreenChange, false);
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? function() {
          canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]);
        } : null) || (canvasContainer["webkitRequestFullScreen"] ? function() {
          canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
        } : null);
        if (vrDevice) {
          canvasContainer.requestFullscreen({ vrDisplay: vrDevice });
        } else {
          canvasContainer.requestFullscreen();
        }
      }, requestFullScreen: function(lockPointer, resizeCanvas, vrDevice) {
        Module.printErr("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");
        Browser.requestFullScreen = function(lockPointer2, resizeCanvas2, vrDevice2) {
          return Browser.requestFullscreen(lockPointer2, resizeCanvas2, vrDevice2);
        };
        return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
      }, nextRAF: 0, fakeRequestAnimationFrame: function(func2) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1e3 / 60;
        } else {
          while (now + 2 >= Browser.nextRAF) {
            Browser.nextRAF += 1e3 / 60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func2, delay);
      }, requestAnimationFrame: function requestAnimationFrame(func2) {
        if (typeof window === "undefined") {
          Browser.fakeRequestAnimationFrame(func2);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame;
          }
          window.requestAnimationFrame(func2);
        }
      }, safeCallback: function(func2) {
        return function() {
          if (!ABORT) return func2.apply(null, arguments);
        };
      }, allowAsyncCallbacks: true, queuedAsyncCallbacks: [], pauseAsyncCallbacks: function() {
        Browser.allowAsyncCallbacks = false;
      }, resumeAsyncCallbacks: function() {
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
          var callbacks = Browser.queuedAsyncCallbacks;
          Browser.queuedAsyncCallbacks = [];
          callbacks.forEach(function(func2) {
            func2();
          });
        }
      }, safeRequestAnimationFrame: function(func2) {
        return Browser.requestAnimationFrame(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func2();
          } else {
            Browser.queuedAsyncCallbacks.push(func2);
          }
        });
      }, safeSetTimeout: function(func2, timeout) {
        Module["noExitRuntime"] = true;
        return setTimeout(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func2();
          } else {
            Browser.queuedAsyncCallbacks.push(func2);
          }
        }, timeout);
      }, safeSetInterval: function(func2, timeout) {
        Module["noExitRuntime"] = true;
        return setInterval(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func2();
          }
        }, timeout);
      }, getMimetype: function(name) {
        return { "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "bmp": "image/bmp", "ogg": "audio/ogg", "wav": "audio/wav", "mp3": "audio/mpeg" }[name.substr(name.lastIndexOf(".") + 1)];
      }, getUserMedia: function(func2) {
        if (!window.getUserMedia) {
          window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"];
        }
        window.getUserMedia(func2);
      }, getMovementX: function(event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
      }, getMovementY: function(event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
      }, getMouseWheelDelta: function(event) {
        var delta = 0;
        switch (event.type) {
          case "DOMMouseScroll":
            delta = event.detail;
            break;
          case "mousewheel":
            delta = event.wheelDelta;
            break;
          case "wheel":
            delta = event["deltaY"];
            break;
          default:
            throw "unrecognized mouse wheel event: " + event.type;
        }
        return delta;
      }, mouseX: 0, mouseY: 0, mouseMovementX: 0, mouseMovementY: 0, touches: {}, lastTouches: {}, calculateMouseEvent: function(event) {
        if (Browser.pointerLock) {
          if (event.type != "mousemove" && "mozMovementX" in event) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
            Browser.mouseX += Browser.mouseMovementX;
            Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
          var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
          if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
            var touch = event.touch;
            if (touch === void 0) {
              return;
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
            var coords = { x: adjustedX, y: adjustedY };
            if (event.type === "touchstart") {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === "touchend" || event.type === "touchmove") {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
          var x2 = event.pageX - (scrollX + rect.left);
          var y2 = event.pageY - (scrollY + rect.top);
          x2 = x2 * (cw / rect.width);
          y2 = y2 * (ch / rect.height);
          Browser.mouseMovementX = x2 - Browser.mouseX;
          Browser.mouseMovementY = y2 - Browser.mouseY;
          Browser.mouseX = x2;
          Browser.mouseY = y2;
        }
      }, asyncLoad: function(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
        Module["readAsync"](url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep) addRunDependency(dep);
      }, resizeListeners: [], updateResizeListeners: function() {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      }, setCanvasSize: function(width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      }, windowedWidth: 0, windowedHeight: 0, setFullscreenCanvasSize: function() {
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
          flags = flags | 8388608;
          HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags;
        }
        Browser.updateResizeListeners();
      }, setWindowedCanvasSize: function() {
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
          flags = flags & ~8388608;
          HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags;
        }
        Browser.updateResizeListeners();
      }, updateCanvasDimensions: function(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w2 = wNative;
        var h2 = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
          if (w2 / h2 < Module["forcedAspectRatio"]) {
            w2 = Math.round(h2 * Module["forcedAspectRatio"]);
          } else {
            h2 = Math.round(w2 / Module["forcedAspectRatio"]);
          }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
          var factor = Math.min(screen.width / w2, screen.height / h2);
          w2 = Math.round(w2 * factor);
          h2 = Math.round(h2 * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width != w2) canvas.width = w2;
          if (canvas.height != h2) canvas.height = h2;
          if (typeof canvas.style != "undefined") {
            canvas.style.removeProperty("width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width != wNative) canvas.width = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != "undefined") {
            if (w2 != wNative || h2 != hNative) {
              canvas.style.setProperty("width", w2 + "px", "important");
              canvas.style.setProperty("height", h2 + "px", "important");
            } else {
              canvas.style.removeProperty("width");
              canvas.style.removeProperty("height");
            }
          }
        }
      }, wgetRequests: {}, nextWgetRequestHandle: 0, getNextWgetRequestHandle: function() {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle;
      } };
      var SYSCALLS = { varargs: 0, get: function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret;
      }, getStr: function() {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret;
      }, get64: function() {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      }, getZero: function() {
        assert(SYSCALLS.get() === 0);
      } };
      function ___syscall6(which, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD();
          FS.close(stream);
          return 0;
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return -e.errno;
        }
      }
      function ___syscall54(which, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          return 0;
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return -e.errno;
        }
      }
      function _typeModule(self2) {
        var structureList = [[0, 1, "X"], [1, 1, "const X"], [128, 1, "X *"], [256, 1, "X &"], [384, 1, "X &&"], [512, 1, "std::shared_ptr<X>"], [640, 1, "std::unique_ptr<X>"], [5120, 1, "std::vector<X>"], [6144, 2, "std::array<X, Y>"], [9216, -1, "std::function<X (Y)>"]];
        function applyStructure(outerName, outerFlags, innerName, innerFlags, param, flip) {
          if (outerFlags == 1) {
            var ref = innerFlags & 896;
            if (ref == 128 || ref == 256 || ref == 384) outerName = "X const";
          }
          var name;
          if (flip) {
            name = innerName.replace("X", outerName).replace("Y", param);
          } else {
            name = outerName.replace("X", innerName).replace("Y", param);
          }
          return name.replace(/([*&]) (?=[*&])/g, "$1");
        }
        function reportProblem(problem, id, kind, structureType, place) {
          throw new Error(problem + " type " + kind.replace("X", id + "?") + (structureType ? " with flag " + structureType : "") + " in " + place);
        }
        function getComplexType(id, constructType2, getType2, queryType2, place, kind, prevStructure, depth) {
          if (kind === void 0) {
            kind = "X";
          }
          if (depth === void 0) {
            depth = 1;
          }
          var result = getType2(id);
          if (result) return result;
          var query = queryType2(id);
          var structureType = query.placeholderFlag;
          var structure = structureList[structureType];
          if (prevStructure && structure) {
            kind = applyStructure(prevStructure[2], prevStructure[0], kind, structure[0], "?", true);
          }
          var problem;
          if (structureType == 0) problem = "Unbound";
          if (structureType >= 10) problem = "Corrupt";
          if (depth > 20) problem = "Deeply nested";
          if (problem) reportProblem(problem, id, kind, structureType, place || "?");
          var subId = query.paramList[0];
          var subType = getComplexType(subId, constructType2, getType2, queryType2, place, kind, structure, depth + 1);
          var srcSpec;
          var spec = { flags: structure[0], id, name: "", paramList: [subType] };
          var argList2 = [];
          var structureParam = "?";
          switch (query.placeholderFlag) {
            case 1:
              srcSpec = subType.spec;
              break;
            case 2:
              if ((subType.flags & 15360) == 1024 && subType.spec.ptrSize == 1) {
                spec.flags = 7168;
                break;
              }
              ;
            case 3:
            case 6:
            case 5:
              srcSpec = subType.spec;
              if ((subType.flags & 15360) != 2048) {
              }
              break;
            case 8:
              structureParam = "" + query.paramList[1];
              spec.paramList.push(query.paramList[1]);
              break;
            case 9:
              for (var _i = 0, _a2 = query.paramList[1]; _i < _a2.length; _i++) {
                var paramId = _a2[_i];
                var paramType = getComplexType(paramId, constructType2, getType2, queryType2, place, kind, structure, depth + 1);
                argList2.push(paramType.name);
                spec.paramList.push(paramType);
              }
              structureParam = argList2.join(", ");
              break;
            default:
              break;
          }
          spec.name = applyStructure(structure[2], structure[0], subType.name, subType.flags, structureParam);
          if (srcSpec) {
            for (var _b = 0, _c = Object.keys(srcSpec); _b < _c.length; _b++) {
              var key2 = _c[_b];
              spec[key2] = spec[key2] || srcSpec[key2];
            }
            spec.flags |= srcSpec.flags;
          }
          return makeType(constructType2, spec);
        }
        function makeType(constructType2, spec) {
          var flags = spec.flags;
          var refKind = flags & 896;
          var kind = flags & 15360;
          if (!spec.name && kind == 1024) {
            if (spec.ptrSize == 1) {
              spec.name = (flags & 16 ? "" : (flags & 8 ? "un" : "") + "signed ") + "char";
            } else {
              spec.name = (flags & 8 ? "u" : "") + (flags & 32 ? "float" : "int") + (spec.ptrSize * 8 + "_t");
            }
          }
          if (spec.ptrSize == 8 && !(flags & 32)) kind = 64;
          if (kind == 2048) {
            if (refKind == 512 || refKind == 640) {
              kind = 4096;
            } else if (refKind) kind = 3072;
          }
          return constructType2(kind, spec);
        }
        var Type = function() {
          function Type2(spec) {
            this.id = spec.id;
            this.name = spec.name;
            this.flags = spec.flags;
            this.spec = spec;
          }
          Type2.prototype.toString = function() {
            return this.name;
          };
          return Type2;
        }();
        var output = { Type, getComplexType, makeType, structureList };
        self2.output = output;
        return self2.output || output;
      }
      function __nbind_register_type(id, namePtr) {
        var name = _nbind.readAsciiString(namePtr);
        var spec = { flags: 10240, id, name };
        _nbind.makeType(_nbind.constructType, spec);
      }
      function __nbind_register_callback_signature(typeListPtr, typeCount) {
        var typeList = _nbind.readTypeIdList(typeListPtr, typeCount);
        var num2 = _nbind.callbackSignatureList.length;
        _nbind.callbackSignatureList[num2] = _nbind.makeJSCaller(typeList);
        return num2;
      }
      function __extends(Class, Parent) {
        for (var key2 in Parent) if (Parent.hasOwnProperty(key2)) Class[key2] = Parent[key2];
        function Base() {
          this.constructor = Class;
        }
        Base.prototype = Parent.prototype;
        Class.prototype = new Base();
      }
      function __nbind_register_class(idListPtr, policyListPtr, superListPtr, upcastListPtr, superCount, destructorPtr, namePtr) {
        var name = _nbind.readAsciiString(namePtr);
        var policyTbl2 = _nbind.readPolicyList(policyListPtr);
        var idList = HEAPU32.subarray(idListPtr / 4, idListPtr / 4 + 2);
        var spec = { flags: 2048 | (policyTbl2["Value"] ? 2 : 0), id: idList[0], name };
        var bindClass = _nbind.makeType(_nbind.constructType, spec);
        bindClass.ptrType = _nbind.getComplexType(idList[1], _nbind.constructType, _nbind.getType, _nbind.queryType);
        bindClass.destroy = _nbind.makeMethodCaller(bindClass.ptrType, { boundID: spec.id, flags: 0, name: "destroy", num: 0, ptr: destructorPtr, title: bindClass.name + ".free", typeList: ["void", "uint32_t", "uint32_t"] });
        if (superCount) {
          bindClass.superIdList = Array.prototype.slice.call(HEAPU32.subarray(superListPtr / 4, superListPtr / 4 + superCount));
          bindClass.upcastList = Array.prototype.slice.call(HEAPU32.subarray(upcastListPtr / 4, upcastListPtr / 4 + superCount));
        }
        Module[bindClass.name] = bindClass.makeBound(policyTbl2);
        _nbind.BindClass.list.push(bindClass);
      }
      function _removeAccessorPrefix(name) {
        var prefixMatcher = /^[Gg]et_?([A-Z]?([A-Z]?))/;
        return name.replace(prefixMatcher, function(match, initial, second) {
          return second ? initial : initial.toLowerCase();
        });
      }
      function __nbind_register_function(boundID, policyListPtr, typeListPtr, typeCount, ptr2, direct, signatureType, namePtr, num2, flags) {
        var bindClass = _nbind.getType(boundID);
        var policyTbl2 = _nbind.readPolicyList(policyListPtr);
        var typeList = _nbind.readTypeIdList(typeListPtr, typeCount);
        var specList;
        if (signatureType == 5) {
          specList = [{ direct: ptr2, name: "__nbindConstructor", ptr: 0, title: bindClass.name + " constructor", typeList: ["uint32_t"].concat(typeList.slice(1)) }, { direct, name: "__nbindValueConstructor", ptr: 0, title: bindClass.name + " value constructor", typeList: ["void", "uint32_t"].concat(typeList.slice(1)) }];
        } else {
          var name_1 = _nbind.readAsciiString(namePtr);
          var title = (bindClass.name && bindClass.name + ".") + name_1;
          if (signatureType == 3 || signatureType == 4) {
            name_1 = _removeAccessorPrefix(name_1);
          }
          specList = [{ boundID, direct, name: name_1, ptr: ptr2, title, typeList }];
        }
        for (var _i = 0, specList_1 = specList; _i < specList_1.length; _i++) {
          var spec = specList_1[_i];
          spec.signatureType = signatureType;
          spec.policyTbl = policyTbl2;
          spec.num = num2;
          spec.flags = flags;
          bindClass.addMethod(spec);
        }
      }
      function _nbind_value(name, proto) {
        if (!_nbind.typeNameTbl[name]) _nbind.throwError("Unknown value type " + name);
        Module["NBind"].bind_value(name, proto);
        _defineHidden(_nbind.typeNameTbl[name].proto.prototype.__nbindValueConstructor)(proto.prototype, "__nbindValueConstructor");
      }
      Module["_nbind_value"] = _nbind_value;
      function __nbind_get_value_object(num2, ptr2) {
        var obj = _nbind.popValue(num2);
        if (!obj.fromJS) {
          throw new Error("Object " + obj + " has no fromJS function");
        }
        obj.fromJS(function() {
          obj.__nbindValueConstructor.apply(this, Array.prototype.concat.apply([ptr2], arguments));
        });
      }
      function _emscripten_memcpy_big(dest, src, num2) {
        HEAPU8.set(HEAPU8.subarray(src, src + num2), dest);
        return dest;
      }
      function __nbind_register_primitive(id, size, flags) {
        var spec = { flags: 1024 | flags, id, ptrSize: size };
        _nbind.makeType(_nbind.constructType, spec);
      }
      var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_STATIC);
      function ___setErrNo(value) {
        if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
        return value;
      }
      function _llvm_stacksave() {
        var self2 = _llvm_stacksave;
        if (!self2.LLVM_SAVEDSTACKS) {
          self2.LLVM_SAVEDSTACKS = [];
        }
        self2.LLVM_SAVEDSTACKS.push(Runtime.stackSave());
        return self2.LLVM_SAVEDSTACKS.length - 1;
      }
      function ___syscall140(which, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
          var offset = offset_low;
          FS.llseek(stream, offset, whence);
          HEAP32[result >> 2] = stream.position;
          if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
          return 0;
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return -e.errno;
        }
      }
      function ___syscall146(which, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
          var ret = 0;
          if (!___syscall146.buffer) {
            ___syscall146.buffers = [null, [], []];
            ___syscall146.printChar = function(stream2, curr) {
              var buffer2 = ___syscall146.buffers[stream2];
              assert(buffer2);
              if (curr === 0 || curr === 10) {
                (stream2 === 1 ? Module["print"] : Module["printErr"])(UTF8ArrayToString(buffer2, 0));
                buffer2.length = 0;
              } else {
                buffer2.push(curr);
              }
            };
          }
          for (var i3 = 0; i3 < iovcnt; i3++) {
            var ptr2 = HEAP32[iov + i3 * 8 >> 2];
            var len = HEAP32[iov + (i3 * 8 + 4) >> 2];
            for (var j = 0; j < len; j++) {
              ___syscall146.printChar(stream, HEAPU8[ptr2 + j]);
            }
            ret += len;
          }
          return ret;
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
          return -e.errno;
        }
      }
      function __nbind_finish() {
        for (var _i = 0, _a2 = _nbind.BindClass.list; _i < _a2.length; _i++) {
          var bindClass = _a2[_i];
          bindClass.finish();
        }
      }
      var ___dso_handle = STATICTOP;
      STATICTOP += 16;
      (function(_nbind) {
        var typeIdTbl = {};
        _nbind.typeNameTbl = {};
        var Pool = function() {
          function Pool2() {
          }
          Pool2.lalloc = function(size) {
            size = size + 7 & ~7;
            var used = HEAPU32[Pool2.usedPtr];
            if (size > Pool2.pageSize / 2 || size > Pool2.pageSize - used) {
              var NBind = _nbind.typeNameTbl["NBind"].proto;
              return NBind.lalloc(size);
            } else {
              HEAPU32[Pool2.usedPtr] = used + size;
              return Pool2.rootPtr + used;
            }
          };
          Pool2.lreset = function(used, page) {
            var topPage = HEAPU32[Pool2.pagePtr];
            if (topPage) {
              var NBind = _nbind.typeNameTbl["NBind"].proto;
              NBind.lreset(used, page);
            } else {
              HEAPU32[Pool2.usedPtr] = used;
            }
          };
          return Pool2;
        }();
        _nbind.Pool = Pool;
        function constructType(kind, spec) {
          var construct = kind == 10240 ? _nbind.makeTypeNameTbl[spec.name] || _nbind.BindType : _nbind.makeTypeKindTbl[kind];
          var bindType = new construct(spec);
          typeIdTbl[spec.id] = bindType;
          _nbind.typeNameTbl[spec.name] = bindType;
          return bindType;
        }
        _nbind.constructType = constructType;
        function getType(id) {
          return typeIdTbl[id];
        }
        _nbind.getType = getType;
        function queryType(id) {
          var placeholderFlag = HEAPU8[id];
          var paramCount = _nbind.structureList[placeholderFlag][1];
          id /= 4;
          if (paramCount < 0) {
            ++id;
            paramCount = HEAPU32[id] + 1;
          }
          var paramList = Array.prototype.slice.call(HEAPU32.subarray(id + 1, id + 1 + paramCount));
          if (placeholderFlag == 9) {
            paramList = [paramList[0], paramList.slice(1)];
          }
          return { paramList, placeholderFlag };
        }
        _nbind.queryType = queryType;
        function getTypes(idList, place) {
          return idList.map(function(id) {
            return typeof id == "number" ? _nbind.getComplexType(id, constructType, getType, queryType, place) : _nbind.typeNameTbl[id];
          });
        }
        _nbind.getTypes = getTypes;
        function readTypeIdList(typeListPtr, typeCount) {
          return Array.prototype.slice.call(HEAPU32, typeListPtr / 4, typeListPtr / 4 + typeCount);
        }
        _nbind.readTypeIdList = readTypeIdList;
        function readAsciiString(ptr2) {
          var endPtr = ptr2;
          while (HEAPU8[endPtr++]) ;
          return String.fromCharCode.apply("", HEAPU8.subarray(ptr2, endPtr - 1));
        }
        _nbind.readAsciiString = readAsciiString;
        function readPolicyList(policyListPtr) {
          var policyTbl2 = {};
          if (policyListPtr) {
            while (1) {
              var namePtr = HEAPU32[policyListPtr / 4];
              if (!namePtr) break;
              policyTbl2[readAsciiString(namePtr)] = true;
              policyListPtr += 4;
            }
          }
          return policyTbl2;
        }
        _nbind.readPolicyList = readPolicyList;
        function getDynCall(typeList, name) {
          var mangleMap = { float32_t: "d", float64_t: "d", int64_t: "d", uint64_t: "d", "void": "v" };
          var signature = typeList.map(function(type2) {
            return mangleMap[type2.name] || "i";
          }).join("");
          var dynCall2 = Module["dynCall_" + signature];
          if (!dynCall2) {
            throw new Error("dynCall_" + signature + " not found for " + name + "(" + typeList.map(function(type2) {
              return type2.name;
            }).join(", ") + ")");
          }
          return dynCall2;
        }
        _nbind.getDynCall = getDynCall;
        function addMethod(obj, name, func2, arity) {
          var overload = obj[name];
          if (obj.hasOwnProperty(name) && overload) {
            if (overload.arity || overload.arity === 0) {
              overload = _nbind.makeOverloader(overload, overload.arity);
              obj[name] = overload;
            }
            overload.addMethod(func2, arity);
          } else {
            func2.arity = arity;
            obj[name] = func2;
          }
        }
        _nbind.addMethod = addMethod;
        function throwError(message) {
          throw new Error(message);
        }
        _nbind.throwError = throwError;
        _nbind.bigEndian = false;
        var _a = _typeModule(_typeModule);
        _nbind.Type = _a.Type, _nbind.makeType = _a.makeType, _nbind.getComplexType = _a.getComplexType, _nbind.structureList = _a.structureList;
        var BindType = function(_super) {
          __extends(BindType2, _super);
          function BindType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.heap = HEAPU32;
            _this.ptrSize = 4;
            return _this;
          }
          BindType2.prototype.needsWireRead = function(policyTbl2) {
            return !!this.wireRead || !!this.makeWireRead;
          };
          BindType2.prototype.needsWireWrite = function(policyTbl2) {
            return !!this.wireWrite || !!this.makeWireWrite;
          };
          return BindType2;
        }(_nbind.Type);
        _nbind.BindType = BindType;
        var PrimitiveType = function(_super) {
          __extends(PrimitiveType2, _super);
          function PrimitiveType2(spec) {
            var _this = _super.call(this, spec) || this;
            var heapTbl = spec.flags & 32 ? { 32: HEAPF32, 64: HEAPF64 } : spec.flags & 8 ? { 8: HEAPU8, 16: HEAPU16, 32: HEAPU32 } : { 8: HEAP8, 16: HEAP16, 32: HEAP32 };
            _this.heap = heapTbl[spec.ptrSize * 8];
            _this.ptrSize = spec.ptrSize;
            return _this;
          }
          PrimitiveType2.prototype.needsWireWrite = function(policyTbl2) {
            return !!policyTbl2 && !!policyTbl2["Strict"];
          };
          PrimitiveType2.prototype.makeWireWrite = function(expr, policyTbl2) {
            return policyTbl2 && policyTbl2["Strict"] && function(arg2) {
              if (typeof arg2 == "number") return arg2;
              throw new Error("Type mismatch");
            };
          };
          return PrimitiveType2;
        }(BindType);
        _nbind.PrimitiveType = PrimitiveType;
        function pushCString(str, policyTbl2) {
          if (str === null || str === void 0) {
            if (policyTbl2 && policyTbl2["Nullable"]) {
              return 0;
            } else throw new Error("Type mismatch");
          }
          if (policyTbl2 && policyTbl2["Strict"]) {
            if (typeof str != "string") throw new Error("Type mismatch");
          } else str = str.toString();
          var length = Module.lengthBytesUTF8(str) + 1;
          var result = _nbind.Pool.lalloc(length);
          Module.stringToUTF8Array(str, HEAPU8, result, length);
          return result;
        }
        _nbind.pushCString = pushCString;
        function popCString(ptr2) {
          if (ptr2 === 0) return null;
          return Module.Pointer_stringify(ptr2);
        }
        _nbind.popCString = popCString;
        var CStringType = function(_super) {
          __extends(CStringType2, _super);
          function CStringType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireRead = popCString;
            _this.wireWrite = pushCString;
            _this.readResources = [_nbind.resources.pool];
            _this.writeResources = [_nbind.resources.pool];
            return _this;
          }
          CStringType2.prototype.makeWireWrite = function(expr, policyTbl2) {
            return function(arg2) {
              return pushCString(arg2, policyTbl2);
            };
          };
          return CStringType2;
        }(BindType);
        _nbind.CStringType = CStringType;
        var BooleanType = function(_super) {
          __extends(BooleanType2, _super);
          function BooleanType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireRead = function(arg2) {
              return !!arg2;
            };
            return _this;
          }
          BooleanType2.prototype.needsWireWrite = function(policyTbl2) {
            return !!policyTbl2 && !!policyTbl2["Strict"];
          };
          BooleanType2.prototype.makeWireRead = function(expr) {
            return "!!(" + expr + ")";
          };
          BooleanType2.prototype.makeWireWrite = function(expr, policyTbl2) {
            return policyTbl2 && policyTbl2["Strict"] && function(arg2) {
              if (typeof arg2 == "boolean") return arg2;
              throw new Error("Type mismatch");
            } || expr;
          };
          return BooleanType2;
        }(BindType);
        _nbind.BooleanType = BooleanType;
        var Wrapper = function() {
          function Wrapper2() {
          }
          Wrapper2.prototype.persist = function() {
            this.__nbindState |= 1;
          };
          return Wrapper2;
        }();
        _nbind.Wrapper = Wrapper;
        function makeBound(policyTbl2, bindClass) {
          var Bound = function(_super) {
            __extends(Bound2, _super);
            function Bound2(marker, flags, ptr2, shared) {
              var _this = _super.call(this) || this;
              if (!(_this instanceof Bound2)) {
                return new (Function.prototype.bind.apply(Bound2, Array.prototype.concat.apply([null], arguments)))();
              }
              var nbindFlags = flags;
              var nbindPtr = ptr2;
              var nbindShared = shared;
              if (marker !== _nbind.ptrMarker) {
                var wirePtr = _this.__nbindConstructor.apply(_this, arguments);
                nbindFlags = 4096 | 512;
                nbindShared = HEAPU32[wirePtr / 4];
                nbindPtr = HEAPU32[wirePtr / 4 + 1];
              }
              var spec = { configurable: true, enumerable: false, value: null, writable: false };
              var propTbl = { "__nbindFlags": nbindFlags, "__nbindPtr": nbindPtr };
              if (nbindShared) {
                propTbl["__nbindShared"] = nbindShared;
                _nbind.mark(_this);
              }
              for (var _i = 0, _a2 = Object.keys(propTbl); _i < _a2.length; _i++) {
                var key2 = _a2[_i];
                spec.value = propTbl[key2];
                Object.defineProperty(_this, key2, spec);
              }
              _defineHidden(0)(_this, "__nbindState");
              return _this;
            }
            Bound2.prototype.free = function() {
              bindClass.destroy.call(this, this.__nbindShared, this.__nbindFlags);
              this.__nbindState |= 2;
              disableMember(this, "__nbindShared");
              disableMember(this, "__nbindPtr");
            };
            return Bound2;
          }(Wrapper);
          __decorate([_defineHidden()], Bound.prototype, "__nbindConstructor", void 0);
          __decorate([_defineHidden()], Bound.prototype, "__nbindValueConstructor", void 0);
          __decorate([_defineHidden(policyTbl2)], Bound.prototype, "__nbindPolicies", void 0);
          return Bound;
        }
        _nbind.makeBound = makeBound;
        function disableMember(obj, name) {
          function die() {
            throw new Error("Accessing deleted object");
          }
          Object.defineProperty(obj, name, { configurable: false, enumerable: false, get: die, set: die });
        }
        _nbind.ptrMarker = {};
        var BindClass = function(_super) {
          __extends(BindClass2, _super);
          function BindClass2(spec) {
            var _this = _super.call(this, spec) || this;
            _this.wireRead = function(arg2) {
              return _nbind.popValue(arg2, _this.ptrType);
            };
            _this.wireWrite = function(arg2) {
              return pushPointer(arg2, _this.ptrType, true);
            };
            _this.pendingSuperCount = 0;
            _this.ready = false;
            _this.methodTbl = {};
            if (spec.paramList) {
              _this.classType = spec.paramList[0].classType;
              _this.proto = _this.classType.proto;
            } else _this.classType = _this;
            return _this;
          }
          BindClass2.prototype.makeBound = function(policyTbl2) {
            var Bound = _nbind.makeBound(policyTbl2, this);
            this.proto = Bound;
            this.ptrType.proto = Bound;
            return Bound;
          };
          BindClass2.prototype.addMethod = function(spec) {
            var overloadList = this.methodTbl[spec.name] || [];
            overloadList.push(spec);
            this.methodTbl[spec.name] = overloadList;
          };
          BindClass2.prototype.registerMethods = function(src, staticOnly) {
            var setter;
            for (var _i = 0, _a2 = Object.keys(src.methodTbl); _i < _a2.length; _i++) {
              var name_1 = _a2[_i];
              var overloadList = src.methodTbl[name_1];
              for (var _b = 0, overloadList_1 = overloadList; _b < overloadList_1.length; _b++) {
                var spec = overloadList_1[_b];
                var target = void 0;
                var caller = void 0;
                target = this.proto.prototype;
                if (staticOnly && spec.signatureType != 1) continue;
                switch (spec.signatureType) {
                  case 1:
                    target = this.proto;
                  case 5:
                    caller = _nbind.makeCaller(spec);
                    _nbind.addMethod(target, spec.name, caller, spec.typeList.length - 1);
                    break;
                  case 4:
                    setter = _nbind.makeMethodCaller(src.ptrType, spec);
                    break;
                  case 3:
                    Object.defineProperty(target, spec.name, { configurable: true, enumerable: false, get: _nbind.makeMethodCaller(src.ptrType, spec), set: setter });
                    break;
                  case 2:
                    caller = _nbind.makeMethodCaller(src.ptrType, spec);
                    _nbind.addMethod(target, spec.name, caller, spec.typeList.length - 1);
                    break;
                  default:
                    break;
                }
              }
            }
          };
          BindClass2.prototype.registerSuperMethods = function(src, firstSuper, visitTbl) {
            if (visitTbl[src.name]) return;
            visitTbl[src.name] = true;
            var superNum = 0;
            var nextFirst;
            for (var _i = 0, _a2 = src.superIdList || []; _i < _a2.length; _i++) {
              var superId = _a2[_i];
              var superClass = _nbind.getType(superId);
              if (superNum++ < firstSuper || firstSuper < 0) {
                nextFirst = -1;
              } else {
                nextFirst = 0;
              }
              this.registerSuperMethods(superClass, nextFirst, visitTbl);
            }
            this.registerMethods(src, firstSuper < 0);
          };
          BindClass2.prototype.finish = function() {
            if (this.ready) return this;
            this.ready = true;
            this.superList = (this.superIdList || []).map(function(superId) {
              return _nbind.getType(superId).finish();
            });
            var Bound = this.proto;
            if (this.superList.length) {
              var Proto = function() {
                this.constructor = Bound;
              };
              Proto.prototype = this.superList[0].proto.prototype;
              Bound.prototype = new Proto();
            }
            if (Bound != Module) Bound.prototype.__nbindType = this;
            this.registerSuperMethods(this, 1, {});
            return this;
          };
          BindClass2.prototype.upcastStep = function(dst, ptr2) {
            if (dst == this) return ptr2;
            for (var i3 = 0; i3 < this.superList.length; ++i3) {
              var superPtr = this.superList[i3].upcastStep(dst, _nbind.callUpcast(this.upcastList[i3], ptr2));
              if (superPtr) return superPtr;
            }
            return 0;
          };
          return BindClass2;
        }(_nbind.BindType);
        BindClass.list = [];
        _nbind.BindClass = BindClass;
        function popPointer(ptr2, type2) {
          return ptr2 ? new type2.proto(_nbind.ptrMarker, type2.flags, ptr2) : null;
        }
        _nbind.popPointer = popPointer;
        function pushPointer(obj, type2, tryValue) {
          if (!(obj instanceof _nbind.Wrapper)) {
            if (tryValue) {
              return _nbind.pushValue(obj);
            } else throw new Error("Type mismatch");
          }
          var ptr2 = obj.__nbindPtr;
          var objType = obj.__nbindType.classType;
          var classType = type2.classType;
          if (obj instanceof type2.proto) {
            while (objType != classType) {
              ptr2 = _nbind.callUpcast(objType.upcastList[0], ptr2);
              objType = objType.superList[0];
            }
          } else {
            ptr2 = objType.upcastStep(classType, ptr2);
            if (!ptr2) throw new Error("Type mismatch");
          }
          return ptr2;
        }
        _nbind.pushPointer = pushPointer;
        function pushMutablePointer(obj, type2) {
          var ptr2 = pushPointer(obj, type2);
          if (obj.__nbindFlags & 1) {
            throw new Error("Passing a const value as a non-const argument");
          }
          return ptr2;
        }
        var BindClassPtr = function(_super) {
          __extends(BindClassPtr2, _super);
          function BindClassPtr2(spec) {
            var _this = _super.call(this, spec) || this;
            _this.classType = spec.paramList[0].classType;
            _this.proto = _this.classType.proto;
            var isConst = spec.flags & 1;
            var isValue = (_this.flags & 896) == 256 && spec.flags & 2;
            var push = isConst ? pushPointer : pushMutablePointer;
            var pop = isValue ? _nbind.popValue : popPointer;
            _this.makeWireWrite = function(expr, policyTbl2) {
              return policyTbl2["Nullable"] ? function(arg2) {
                return arg2 ? push(arg2, _this) : 0;
              } : function(arg2) {
                return push(arg2, _this);
              };
            };
            _this.wireRead = function(arg2) {
              return pop(arg2, _this);
            };
            _this.wireWrite = function(arg2) {
              return push(arg2, _this);
            };
            return _this;
          }
          return BindClassPtr2;
        }(_nbind.BindType);
        _nbind.BindClassPtr = BindClassPtr;
        function popShared(ptr2, type2) {
          var shared = HEAPU32[ptr2 / 4];
          var unsafe = HEAPU32[ptr2 / 4 + 1];
          return unsafe ? new type2.proto(_nbind.ptrMarker, type2.flags, unsafe, shared) : null;
        }
        _nbind.popShared = popShared;
        function pushShared(obj, type2) {
          if (!(obj instanceof type2.proto)) throw new Error("Type mismatch");
          return obj.__nbindShared;
        }
        function pushMutableShared(obj, type2) {
          if (!(obj instanceof type2.proto)) throw new Error("Type mismatch");
          if (obj.__nbindFlags & 1) {
            throw new Error("Passing a const value as a non-const argument");
          }
          return obj.__nbindShared;
        }
        var SharedClassPtr = function(_super) {
          __extends(SharedClassPtr2, _super);
          function SharedClassPtr2(spec) {
            var _this = _super.call(this, spec) || this;
            _this.readResources = [_nbind.resources.pool];
            _this.classType = spec.paramList[0].classType;
            _this.proto = _this.classType.proto;
            var isConst = spec.flags & 1;
            var push = isConst ? pushShared : pushMutableShared;
            _this.wireRead = function(arg2) {
              return popShared(arg2, _this);
            };
            _this.wireWrite = function(arg2) {
              return push(arg2, _this);
            };
            return _this;
          }
          return SharedClassPtr2;
        }(_nbind.BindType);
        _nbind.SharedClassPtr = SharedClassPtr;
        _nbind.externalList = [0];
        var firstFreeExternal = 0;
        var External = function() {
          function External2(data) {
            this.refCount = 1;
            this.data = data;
          }
          External2.prototype.register = function() {
            var num2 = firstFreeExternal;
            if (num2) {
              firstFreeExternal = _nbind.externalList[num2];
            } else num2 = _nbind.externalList.length;
            _nbind.externalList[num2] = this;
            return num2;
          };
          External2.prototype.reference = function() {
            ++this.refCount;
          };
          External2.prototype.dereference = function(num2) {
            if (--this.refCount == 0) {
              if (this.free) this.free();
              _nbind.externalList[num2] = firstFreeExternal;
              firstFreeExternal = num2;
            }
          };
          return External2;
        }();
        _nbind.External = External;
        function popExternal(num2) {
          var obj = _nbind.externalList[num2];
          obj.dereference(num2);
          return obj.data;
        }
        function pushExternal(obj) {
          var external = new External(obj);
          external.reference();
          return external.register();
        }
        var ExternalType = function(_super) {
          __extends(ExternalType2, _super);
          function ExternalType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireRead = popExternal;
            _this.wireWrite = pushExternal;
            return _this;
          }
          return ExternalType2;
        }(_nbind.BindType);
        _nbind.ExternalType = ExternalType;
        _nbind.callbackSignatureList = [];
        var CallbackType = function(_super) {
          __extends(CallbackType2, _super);
          function CallbackType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireWrite = function(func2) {
              if (typeof func2 != "function") _nbind.throwError("Type mismatch");
              return new _nbind.External(func2).register();
            };
            return _this;
          }
          return CallbackType2;
        }(_nbind.BindType);
        _nbind.CallbackType = CallbackType;
        _nbind.valueList = [0];
        var firstFreeValue = 0;
        function pushValue(value) {
          var num2 = firstFreeValue;
          if (num2) {
            firstFreeValue = _nbind.valueList[num2];
          } else num2 = _nbind.valueList.length;
          _nbind.valueList[num2] = value;
          return num2 * 2 + 1;
        }
        _nbind.pushValue = pushValue;
        function popValue(num2, type2) {
          if (!num2) _nbind.throwError("Value type JavaScript class is missing or not registered");
          if (num2 & 1) {
            num2 >>= 1;
            var obj = _nbind.valueList[num2];
            _nbind.valueList[num2] = firstFreeValue;
            firstFreeValue = num2;
            return obj;
          } else if (type2) {
            return _nbind.popShared(num2, type2);
          } else throw new Error("Invalid value slot " + num2);
        }
        _nbind.popValue = popValue;
        var valueBase = 18446744073709552e3;
        function push64(num2) {
          if (typeof num2 == "number") return num2;
          return pushValue(num2) * 4096 + valueBase;
        }
        function pop64(num2) {
          if (num2 < valueBase) return num2;
          return popValue((num2 - valueBase) / 4096);
        }
        var CreateValueType = function(_super) {
          __extends(CreateValueType2, _super);
          function CreateValueType2() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          CreateValueType2.prototype.makeWireWrite = function(expr) {
            return "(_nbind.pushValue(new " + expr + "))";
          };
          return CreateValueType2;
        }(_nbind.BindType);
        _nbind.CreateValueType = CreateValueType;
        var Int64Type = function(_super) {
          __extends(Int64Type2, _super);
          function Int64Type2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireWrite = push64;
            _this.wireRead = pop64;
            return _this;
          }
          return Int64Type2;
        }(_nbind.BindType);
        _nbind.Int64Type = Int64Type;
        function pushArray(arr, type2) {
          if (!arr) return 0;
          var length = arr.length;
          if ((type2.size || type2.size === 0) && length < type2.size) {
            throw new Error("Type mismatch");
          }
          var ptrSize = type2.memberType.ptrSize;
          var result = _nbind.Pool.lalloc(4 + length * ptrSize);
          HEAPU32[result / 4] = length;
          var heap = type2.memberType.heap;
          var ptr2 = (result + 4) / ptrSize;
          var wireWrite = type2.memberType.wireWrite;
          var num2 = 0;
          if (wireWrite) {
            while (num2 < length) {
              heap[ptr2++] = wireWrite(arr[num2++]);
            }
          } else {
            while (num2 < length) {
              heap[ptr2++] = arr[num2++];
            }
          }
          return result;
        }
        _nbind.pushArray = pushArray;
        function popArray(ptr2, type2) {
          if (ptr2 === 0) return null;
          var length = HEAPU32[ptr2 / 4];
          var arr = new Array(length);
          var heap = type2.memberType.heap;
          ptr2 = (ptr2 + 4) / type2.memberType.ptrSize;
          var wireRead = type2.memberType.wireRead;
          var num2 = 0;
          if (wireRead) {
            while (num2 < length) {
              arr[num2++] = wireRead(heap[ptr2++]);
            }
          } else {
            while (num2 < length) {
              arr[num2++] = heap[ptr2++];
            }
          }
          return arr;
        }
        _nbind.popArray = popArray;
        var ArrayType = function(_super) {
          __extends(ArrayType2, _super);
          function ArrayType2(spec) {
            var _this = _super.call(this, spec) || this;
            _this.wireRead = function(arg2) {
              return popArray(arg2, _this);
            };
            _this.wireWrite = function(arg2) {
              return pushArray(arg2, _this);
            };
            _this.readResources = [_nbind.resources.pool];
            _this.writeResources = [_nbind.resources.pool];
            _this.memberType = spec.paramList[0];
            if (spec.paramList[1]) _this.size = spec.paramList[1];
            return _this;
          }
          return ArrayType2;
        }(_nbind.BindType);
        _nbind.ArrayType = ArrayType;
        function pushString(str, policyTbl2) {
          if (str === null || str === void 0) {
            if (policyTbl2 && policyTbl2["Nullable"]) {
              str = "";
            } else throw new Error("Type mismatch");
          }
          if (policyTbl2 && policyTbl2["Strict"]) {
            if (typeof str != "string") throw new Error("Type mismatch");
          } else str = str.toString();
          var length = Module.lengthBytesUTF8(str);
          var result = _nbind.Pool.lalloc(4 + length + 1);
          HEAPU32[result / 4] = length;
          Module.stringToUTF8Array(str, HEAPU8, result + 4, length + 1);
          return result;
        }
        _nbind.pushString = pushString;
        function popString(ptr2) {
          if (ptr2 === 0) return null;
          var length = HEAPU32[ptr2 / 4];
          return Module.Pointer_stringify(ptr2 + 4, length);
        }
        _nbind.popString = popString;
        var StringType = function(_super) {
          __extends(StringType2, _super);
          function StringType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireRead = popString;
            _this.wireWrite = pushString;
            _this.readResources = [_nbind.resources.pool];
            _this.writeResources = [_nbind.resources.pool];
            return _this;
          }
          StringType2.prototype.makeWireWrite = function(expr, policyTbl2) {
            return function(arg2) {
              return pushString(arg2, policyTbl2);
            };
          };
          return StringType2;
        }(_nbind.BindType);
        _nbind.StringType = StringType;
        function makeArgList(argCount) {
          return Array.apply(null, Array(argCount)).map(function(dummy, num2) {
            return "a" + (num2 + 1);
          });
        }
        function anyNeedsWireWrite(typeList, policyTbl2) {
          return typeList.reduce(function(result, type2) {
            return result || type2.needsWireWrite(policyTbl2);
          }, false);
        }
        function anyNeedsWireRead(typeList, policyTbl2) {
          return typeList.reduce(function(result, type2) {
            return result || !!type2.needsWireRead(policyTbl2);
          }, false);
        }
        function makeWireRead(convertParamList2, policyTbl2, type2, expr) {
          var paramNum = convertParamList2.length;
          if (type2.makeWireRead) {
            return type2.makeWireRead(expr, convertParamList2, paramNum);
          } else if (type2.wireRead) {
            convertParamList2[paramNum] = type2.wireRead;
            return "(convertParamList[" + paramNum + "](" + expr + "))";
          } else return expr;
        }
        function makeWireWrite(convertParamList2, policyTbl2, type2, expr) {
          var wireWrite;
          var paramNum = convertParamList2.length;
          if (type2.makeWireWrite) {
            wireWrite = type2.makeWireWrite(expr, policyTbl2, convertParamList2, paramNum);
          } else wireWrite = type2.wireWrite;
          if (wireWrite) {
            if (typeof wireWrite == "string") {
              return wireWrite;
            } else {
              convertParamList2[paramNum] = wireWrite;
              return "(convertParamList[" + paramNum + "](" + expr + "))";
            }
          } else return expr;
        }
        function buildCallerFunction(dynCall, ptrType, ptr, num, policyTbl, needsWireWrite, prefix, returnType, argTypeList, mask, err) {
          var argList = makeArgList(argTypeList.length);
          var convertParamList = [];
          var callExpression = makeWireRead(convertParamList, policyTbl, returnType, "dynCall(" + [prefix].concat(argList.map(function(name, index) {
            return makeWireWrite(convertParamList, policyTbl, argTypeList[index], name);
          })).join(",") + ")");
          var resourceSet = _nbind.listResources([returnType], argTypeList);
          var sourceCode = "function(" + argList.join(",") + "){" + (mask ? "this.__nbindFlags&mask&&err();" : "") + resourceSet.makeOpen() + "var r=" + callExpression + ";" + resourceSet.makeClose() + "return r;}";
          return eval("(" + sourceCode + ")");
        }
        function buildJSCallerFunction(returnType, argTypeList) {
          var argList = makeArgList(argTypeList.length);
          var convertParamList = [];
          var callExpression = makeWireWrite(convertParamList, null, returnType, "_nbind.externalList[num].data(" + argList.map(function(name, index) {
            return makeWireRead(convertParamList, null, argTypeList[index], name);
          }).join(",") + ")");
          var resourceSet = _nbind.listResources(argTypeList, [returnType]);
          resourceSet.remove(_nbind.resources.pool);
          var sourceCode = "function(" + ["dummy", "num"].concat(argList).join(",") + "){" + resourceSet.makeOpen() + "var r=" + callExpression + ";" + resourceSet.makeClose() + "return r;}";
          return eval("(" + sourceCode + ")");
        }
        _nbind.buildJSCallerFunction = buildJSCallerFunction;
        function makeJSCaller(idList) {
          var argCount = idList.length - 1;
          var typeList = _nbind.getTypes(idList, "callback");
          var returnType2 = typeList[0];
          var argTypeList2 = typeList.slice(1);
          var needsWireRead = anyNeedsWireRead(argTypeList2, null);
          var needsWireWrite2 = returnType2.needsWireWrite(null);
          if (!needsWireWrite2 && !needsWireRead) {
            switch (argCount) {
              case 0:
                return function(dummy, num2) {
                  return _nbind.externalList[num2].data();
                };
              case 1:
                return function(dummy, num2, a1) {
                  return _nbind.externalList[num2].data(a1);
                };
              case 2:
                return function(dummy, num2, a1, a2) {
                  return _nbind.externalList[num2].data(a1, a2);
                };
              case 3:
                return function(dummy, num2, a1, a2, a3) {
                  return _nbind.externalList[num2].data(a1, a2, a3);
                };
              default:
                break;
            }
          }
          return buildJSCallerFunction(returnType2, argTypeList2);
        }
        _nbind.makeJSCaller = makeJSCaller;
        function makeMethodCaller(ptrType2, spec) {
          var argCount = spec.typeList.length - 1;
          var typeIdList = spec.typeList.slice(0);
          typeIdList.splice(1, 0, "uint32_t", spec.boundID);
          var typeList = _nbind.getTypes(typeIdList, spec.title);
          var returnType2 = typeList[0];
          var argTypeList2 = typeList.slice(3);
          var needsWireRead = returnType2.needsWireRead(spec.policyTbl);
          var needsWireWrite2 = anyNeedsWireWrite(argTypeList2, spec.policyTbl);
          var ptr2 = spec.ptr;
          var num2 = spec.num;
          var dynCall2 = _nbind.getDynCall(typeList, spec.title);
          var mask2 = ~spec.flags & 1;
          function err2() {
            throw new Error("Calling a non-const method on a const object");
          }
          if (!needsWireRead && !needsWireWrite2) {
            switch (argCount) {
              case 0:
                return function() {
                  return this.__nbindFlags & mask2 ? err2() : dynCall2(ptr2, num2, _nbind.pushPointer(this, ptrType2));
                };
              case 1:
                return function(a1) {
                  return this.__nbindFlags & mask2 ? err2() : dynCall2(ptr2, num2, _nbind.pushPointer(this, ptrType2), a1);
                };
              case 2:
                return function(a1, a2) {
                  return this.__nbindFlags & mask2 ? err2() : dynCall2(ptr2, num2, _nbind.pushPointer(this, ptrType2), a1, a2);
                };
              case 3:
                return function(a1, a2, a3) {
                  return this.__nbindFlags & mask2 ? err2() : dynCall2(ptr2, num2, _nbind.pushPointer(this, ptrType2), a1, a2, a3);
                };
              default:
                break;
            }
          }
          return buildCallerFunction(dynCall2, ptrType2, ptr2, num2, spec.policyTbl, needsWireWrite2, "ptr,num,pushPointer(this,ptrType)", returnType2, argTypeList2, mask2, err2);
        }
        _nbind.makeMethodCaller = makeMethodCaller;
        function makeCaller(spec) {
          var argCount = spec.typeList.length - 1;
          var typeList = _nbind.getTypes(spec.typeList, spec.title);
          var returnType2 = typeList[0];
          var argTypeList2 = typeList.slice(1);
          var needsWireRead = returnType2.needsWireRead(spec.policyTbl);
          var needsWireWrite2 = anyNeedsWireWrite(argTypeList2, spec.policyTbl);
          var direct = spec.direct;
          var ptr2 = spec.ptr;
          if (spec.direct && !needsWireRead && !needsWireWrite2) {
            var dynCall_1 = _nbind.getDynCall(typeList, spec.title);
            switch (argCount) {
              case 0:
                return function() {
                  return dynCall_1(direct);
                };
              case 1:
                return function(a1) {
                  return dynCall_1(direct, a1);
                };
              case 2:
                return function(a1, a2) {
                  return dynCall_1(direct, a1, a2);
                };
              case 3:
                return function(a1, a2, a3) {
                  return dynCall_1(direct, a1, a2, a3);
                };
              default:
                break;
            }
            ptr2 = 0;
          }
          var prefix2;
          if (ptr2) {
            var typeIdList = spec.typeList.slice(0);
            typeIdList.splice(1, 0, "uint32_t");
            typeList = _nbind.getTypes(typeIdList, spec.title);
            prefix2 = "ptr,num";
          } else {
            ptr2 = direct;
            prefix2 = "ptr";
          }
          var dynCall2 = _nbind.getDynCall(typeList, spec.title);
          return buildCallerFunction(dynCall2, null, ptr2, spec.num, spec.policyTbl, needsWireWrite2, prefix2, returnType2, argTypeList2);
        }
        _nbind.makeCaller = makeCaller;
        function makeOverloader(func2, arity) {
          var callerList = [];
          function call() {
            return callerList[arguments.length].apply(this, arguments);
          }
          call.addMethod = function(_func, _arity) {
            callerList[_arity] = _func;
          };
          call.addMethod(func2, arity);
          return call;
        }
        _nbind.makeOverloader = makeOverloader;
        var Resource = function() {
          function Resource2(open, close) {
            var _this = this;
            this.makeOpen = function() {
              return Object.keys(_this.openTbl).join("");
            };
            this.makeClose = function() {
              return Object.keys(_this.closeTbl).join("");
            };
            this.openTbl = {};
            this.closeTbl = {};
            if (open) this.openTbl[open] = true;
            if (close) this.closeTbl[close] = true;
          }
          Resource2.prototype.add = function(other) {
            for (var _i = 0, _a2 = Object.keys(other.openTbl); _i < _a2.length; _i++) {
              var key2 = _a2[_i];
              this.openTbl[key2] = true;
            }
            for (var _b = 0, _c = Object.keys(other.closeTbl); _b < _c.length; _b++) {
              var key2 = _c[_b];
              this.closeTbl[key2] = true;
            }
          };
          Resource2.prototype.remove = function(other) {
            for (var _i = 0, _a2 = Object.keys(other.openTbl); _i < _a2.length; _i++) {
              var key2 = _a2[_i];
              delete this.openTbl[key2];
            }
            for (var _b = 0, _c = Object.keys(other.closeTbl); _b < _c.length; _b++) {
              var key2 = _c[_b];
              delete this.closeTbl[key2];
            }
          };
          return Resource2;
        }();
        _nbind.Resource = Resource;
        function listResources(readList, writeList) {
          var result = new Resource();
          for (var _i = 0, readList_1 = readList; _i < readList_1.length; _i++) {
            var bindType = readList_1[_i];
            for (var _a2 = 0, _b = bindType.readResources || []; _a2 < _b.length; _a2++) {
              var resource = _b[_a2];
              result.add(resource);
            }
          }
          for (var _c = 0, writeList_1 = writeList; _c < writeList_1.length; _c++) {
            var bindType = writeList_1[_c];
            for (var _d = 0, _e = bindType.writeResources || []; _d < _e.length; _d++) {
              var resource = _e[_d];
              result.add(resource);
            }
          }
          return result;
        }
        _nbind.listResources = listResources;
        _nbind.resources = { pool: new Resource("var used=HEAPU32[_nbind.Pool.usedPtr],page=HEAPU32[_nbind.Pool.pagePtr];", "_nbind.Pool.lreset(used,page);") };
        var ExternalBuffer = function(_super) {
          __extends(ExternalBuffer2, _super);
          function ExternalBuffer2(buf, ptr2) {
            var _this = _super.call(this, buf) || this;
            _this.ptr = ptr2;
            return _this;
          }
          ExternalBuffer2.prototype.free = function() {
            _free(this.ptr);
          };
          return ExternalBuffer2;
        }(_nbind.External);
        function getBuffer(buf) {
          if (buf instanceof ArrayBuffer) {
            return new Uint8Array(buf);
          } else if (buf instanceof DataView) {
            return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
          } else return buf;
        }
        function pushBuffer(buf, policyTbl2) {
          if (buf === null || buf === void 0) {
            if (policyTbl2 && policyTbl2["Nullable"]) buf = [];
          }
          if (typeof buf != "object") throw new Error("Type mismatch");
          var b2 = buf;
          var length = b2.byteLength || b2.length;
          if (!length && length !== 0 && b2.byteLength !== 0) throw new Error("Type mismatch");
          var result = _nbind.Pool.lalloc(8);
          var data = _malloc(length);
          var ptr2 = result / 4;
          HEAPU32[ptr2++] = length;
          HEAPU32[ptr2++] = data;
          HEAPU32[ptr2++] = new ExternalBuffer(buf, data).register();
          HEAPU8.set(getBuffer(buf), data);
          return result;
        }
        var BufferType = function(_super) {
          __extends(BufferType2, _super);
          function BufferType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireWrite = pushBuffer;
            _this.readResources = [_nbind.resources.pool];
            _this.writeResources = [_nbind.resources.pool];
            return _this;
          }
          BufferType2.prototype.makeWireWrite = function(expr, policyTbl2) {
            return function(arg2) {
              return pushBuffer(arg2, policyTbl2);
            };
          };
          return BufferType2;
        }(_nbind.BindType);
        _nbind.BufferType = BufferType;
        function commitBuffer(num2, data, length) {
          var buf = _nbind.externalList[num2].data;
          var NodeBuffer = Buffer;
          if (typeof Buffer != "function") NodeBuffer = function() {
          };
          if (buf instanceof Array) {
          } else {
            var src = HEAPU8.subarray(data, data + length);
            if (buf instanceof NodeBuffer) {
              var srcBuf = void 0;
              if (typeof Buffer.from == "function" && Buffer.from.length >= 3) {
                srcBuf = Buffer.from(src);
              } else srcBuf = Buffer.from(src);
              srcBuf.copy(buf);
            } else getBuffer(buf).set(src);
          }
        }
        _nbind.commitBuffer = commitBuffer;
        var dirtyList = [];
        var gcTimer = 0;
        function sweep() {
          for (var _i = 0, dirtyList_1 = dirtyList; _i < dirtyList_1.length; _i++) {
            var obj = dirtyList_1[_i];
            if (!(obj.__nbindState & (1 | 2))) {
              obj.free();
            }
          }
          dirtyList = [];
          gcTimer = 0;
        }
        _nbind.mark = function(obj) {
        };
        function toggleLightGC(enable) {
          if (enable) {
            _nbind.mark = function(obj) {
              dirtyList.push(obj);
              if (!gcTimer) gcTimer = setTimeout(sweep, 0);
            };
          } else {
            _nbind.mark = function(obj) {
            };
          }
        }
        _nbind.toggleLightGC = toggleLightGC;
      })(_nbind);
      Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) {
        Module.printErr("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");
        Module["requestFullScreen"] = Module["requestFullscreen"];
        Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice);
      };
      Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) {
        Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
      };
      Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func2) {
        Browser.requestAnimationFrame(func2);
      };
      Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
        Browser.setCanvasSize(width, height, noUpdates);
      };
      Module["pauseMainLoop"] = function Module_pauseMainLoop() {
        Browser.mainLoop.pause();
      };
      Module["resumeMainLoop"] = function Module_resumeMainLoop() {
        Browser.mainLoop.resume();
      };
      Module["getUserMedia"] = function Module_getUserMedia() {
        Browser.getUserMedia();
      };
      Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
        return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes);
      };
      if (ENVIRONMENT_IS_NODE) {
        _emscripten_get_now = function _emscripten_get_now_actual() {
          var t2 = process["hrtime"]();
          return t2[0] * 1e3 + t2[1] / 1e6;
        };
      } else if (typeof dateNow !== "undefined") {
        _emscripten_get_now = dateNow;
      } else if (typeof self === "object" && self["performance"] && typeof self["performance"]["now"] === "function") {
        _emscripten_get_now = function() {
          return self["performance"]["now"]();
        };
      } else if (typeof performance === "object" && typeof performance["now"] === "function") {
        _emscripten_get_now = function() {
          return performance["now"]();
        };
      } else {
        _emscripten_get_now = Date.now;
      }
      __ATEXIT__.push(function() {
        var fflush = Module["_fflush"];
        if (fflush) fflush(0);
        var printChar = ___syscall146.printChar;
        if (!printChar) return;
        var buffers = ___syscall146.buffers;
        if (buffers[1].length) printChar(1, 10);
        if (buffers[2].length) printChar(2, 10);
      });
      DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC);
      STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
      STACK_MAX = STACK_BASE + TOTAL_STACK;
      DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX);
      HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
      staticSealed = true;
      function invoke_viiiii(index, a1, a2, a3, a4, a5) {
        try {
          Module["dynCall_viiiii"](index, a1, a2, a3, a4, a5);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_vif(index, a1, a2) {
        try {
          Module["dynCall_vif"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_vid(index, a1, a2) {
        try {
          Module["dynCall_vid"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_fiff(index, a1, a2, a3) {
        try {
          return Module["dynCall_fiff"](index, a1, a2, a3);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_vi(index, a1) {
        try {
          Module["dynCall_vi"](index, a1);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_vii(index, a1, a2) {
        try {
          Module["dynCall_vii"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_ii(index, a1) {
        try {
          return Module["dynCall_ii"](index, a1);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viddi(index, a1, a2, a3, a4) {
        try {
          Module["dynCall_viddi"](index, a1, a2, a3, a4);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_vidd(index, a1, a2, a3) {
        try {
          Module["dynCall_vidd"](index, a1, a2, a3);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_iiii(index, a1, a2, a3) {
        try {
          return Module["dynCall_iiii"](index, a1, a2, a3);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_diii(index, a1, a2, a3) {
        try {
          return Module["dynCall_diii"](index, a1, a2, a3);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_di(index, a1) {
        try {
          return Module["dynCall_di"](index, a1);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_iid(index, a1, a2) {
        try {
          return Module["dynCall_iid"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_iii(index, a1, a2) {
        try {
          return Module["dynCall_iii"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viiddi(index, a1, a2, a3, a4, a5) {
        try {
          Module["dynCall_viiddi"](index, a1, a2, a3, a4, a5);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
        try {
          Module["dynCall_viiiiii"](index, a1, a2, a3, a4, a5, a6);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_dii(index, a1, a2) {
        try {
          return Module["dynCall_dii"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_i(index) {
        try {
          return Module["dynCall_i"](index);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
        try {
          return Module["dynCall_iiiiii"](index, a1, a2, a3, a4, a5);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viiid(index, a1, a2, a3, a4) {
        try {
          Module["dynCall_viiid"](index, a1, a2, a3, a4);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viififi(index, a1, a2, a3, a4, a5, a6) {
        try {
          Module["dynCall_viififi"](index, a1, a2, a3, a4, a5, a6);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viii(index, a1, a2, a3) {
        try {
          Module["dynCall_viii"](index, a1, a2, a3);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_v(index) {
        try {
          Module["dynCall_v"](index);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viid(index, a1, a2, a3) {
        try {
          Module["dynCall_viid"](index, a1, a2, a3);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_idd(index, a1, a2) {
        try {
          return Module["dynCall_idd"](index, a1, a2);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      function invoke_viiii(index, a1, a2, a3, a4) {
        try {
          Module["dynCall_viiii"](index, a1, a2, a3, a4);
        } catch (e) {
          if (typeof e !== "number" && e !== "longjmp") throw e;
          Module["setThrew"](1, 0);
        }
      }
      Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array, "NaN": NaN, "Infinity": Infinity };
      Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "invoke_viiiii": invoke_viiiii, "invoke_vif": invoke_vif, "invoke_vid": invoke_vid, "invoke_fiff": invoke_fiff, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_viddi": invoke_viddi, "invoke_vidd": invoke_vidd, "invoke_iiii": invoke_iiii, "invoke_diii": invoke_diii, "invoke_di": invoke_di, "invoke_iid": invoke_iid, "invoke_iii": invoke_iii, "invoke_viiddi": invoke_viiddi, "invoke_viiiiii": invoke_viiiiii, "invoke_dii": invoke_dii, "invoke_i": invoke_i, "invoke_iiiiii": invoke_iiiiii, "invoke_viiid": invoke_viiid, "invoke_viififi": invoke_viififi, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_viid": invoke_viid, "invoke_idd": invoke_idd, "invoke_viiii": invoke_viiii, "_emscripten_asm_const_iiiii": _emscripten_asm_const_iiiii, "_emscripten_asm_const_iiidddddd": _emscripten_asm_const_iiidddddd, "_emscripten_asm_const_iiiid": _emscripten_asm_const_iiiid, "__nbind_reference_external": __nbind_reference_external, "_emscripten_asm_const_iiiiiiii": _emscripten_asm_const_iiiiiiii, "_removeAccessorPrefix": _removeAccessorPrefix, "_typeModule": _typeModule, "__nbind_register_pool": __nbind_register_pool, "__decorate": __decorate, "_llvm_stackrestore": _llvm_stackrestore, "___cxa_atexit": ___cxa_atexit, "__extends": __extends, "__nbind_get_value_object": __nbind_get_value_object, "__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj": __ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj, "_emscripten_set_main_loop_timing": _emscripten_set_main_loop_timing, "__nbind_register_primitive": __nbind_register_primitive, "__nbind_register_type": __nbind_register_type, "_emscripten_memcpy_big": _emscripten_memcpy_big, "__nbind_register_function": __nbind_register_function, "___setErrNo": ___setErrNo, "__nbind_register_class": __nbind_register_class, "__nbind_finish": __nbind_finish, "_abort": _abort, "_nbind_value": _nbind_value, "_llvm_stacksave": _llvm_stacksave, "___syscall54": ___syscall54, "_defineHidden": _defineHidden, "_emscripten_set_main_loop": _emscripten_set_main_loop, "_emscripten_get_now": _emscripten_get_now, "__nbind_register_callback_signature": __nbind_register_callback_signature, "_emscripten_asm_const_iiiiii": _emscripten_asm_const_iiiiii, "__nbind_free_external": __nbind_free_external, "_emscripten_asm_const_iiii": _emscripten_asm_const_iiii, "_emscripten_asm_const_iiididi": _emscripten_asm_const_iiididi, "___syscall6": ___syscall6, "_atexit": _atexit, "___syscall140": ___syscall140, "___syscall146": ___syscall146, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "cttz_i8": cttz_i8, "___dso_handle": ___dso_handle };
      var asm = function(global, env, buffer2) {
        ;
        var a2 = new global.Int8Array(buffer2);
        var b2 = new global.Int16Array(buffer2);
        var c2 = new global.Int32Array(buffer2);
        var d = new global.Uint8Array(buffer2);
        var e = new global.Uint16Array(buffer2);
        var f = new global.Uint32Array(buffer2);
        var g = new global.Float32Array(buffer2);
        var h2 = new global.Float64Array(buffer2);
        var i3 = env.DYNAMICTOP_PTR | 0;
        var j = env.tempDoublePtr | 0;
        var k = env.ABORT | 0;
        var l2 = env.STACKTOP | 0;
        var m = env.STACK_MAX | 0;
        var n2 = env.cttz_i8 | 0;
        var o2 = env.___dso_handle | 0;
        var p = 0;
        var q = 0;
        var r2 = 0;
        var s2 = 0;
        var t2 = global.NaN, u = global.Infinity;
        var v = 0, w2 = 0, x2 = 0, y2 = 0, z = 0;
        var A2 = 0;
        var B2 = global.Math.floor;
        var C2 = global.Math.abs;
        var D2 = global.Math.sqrt;
        var E2 = global.Math.pow;
        var F2 = global.Math.cos;
        var G2 = global.Math.sin;
        var H = global.Math.tan;
        var I2 = global.Math.acos;
        var J = global.Math.asin;
        var K = global.Math.atan;
        var L2 = global.Math.atan2;
        var M = global.Math.exp;
        var N = global.Math.log;
        var O = global.Math.ceil;
        var P = global.Math.imul;
        var Q = global.Math.min;
        var R2 = global.Math.max;
        var S = global.Math.clz32;
        var T2 = global.Math.fround;
        var U = env.abort;
        var V = env.assert;
        var W2 = env.enlargeMemory;
        var X = env.getTotalMemory;
        var Y = env.abortOnCannotGrowMemory;
        var Z = env.invoke_viiiii;
        var _ = env.invoke_vif;
        var $ = env.invoke_vid;
        var aa = env.invoke_fiff;
        var ba = env.invoke_vi;
        var ca = env.invoke_vii;
        var da = env.invoke_ii;
        var ea = env.invoke_viddi;
        var fa = env.invoke_vidd;
        var ga = env.invoke_iiii;
        var ha = env.invoke_diii;
        var ia = env.invoke_di;
        var ja = env.invoke_iid;
        var ka = env.invoke_iii;
        var la = env.invoke_viiddi;
        var ma = env.invoke_viiiiii;
        var na = env.invoke_dii;
        var oa = env.invoke_i;
        var pa = env.invoke_iiiiii;
        var qa = env.invoke_viiid;
        var ra = env.invoke_viififi;
        var sa = env.invoke_viii;
        var ta = env.invoke_v;
        var ua = env.invoke_viid;
        var va = env.invoke_idd;
        var wa = env.invoke_viiii;
        var xa = env._emscripten_asm_const_iiiii;
        var ya = env._emscripten_asm_const_iiidddddd;
        var za = env._emscripten_asm_const_iiiid;
        var Aa = env.__nbind_reference_external;
        var Ba = env._emscripten_asm_const_iiiiiiii;
        var Ca = env._removeAccessorPrefix;
        var Da = env._typeModule;
        var Ea = env.__nbind_register_pool;
        var Fa = env.__decorate;
        var Ga = env._llvm_stackrestore;
        var Ha = env.___cxa_atexit;
        var Ia = env.__extends;
        var Ja = env.__nbind_get_value_object;
        var Ka = env.__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj;
        var La = env._emscripten_set_main_loop_timing;
        var Ma = env.__nbind_register_primitive;
        var Na = env.__nbind_register_type;
        var Oa = env._emscripten_memcpy_big;
        var Pa = env.__nbind_register_function;
        var Qa = env.___setErrNo;
        var Ra = env.__nbind_register_class;
        var Sa = env.__nbind_finish;
        var Ta = env._abort;
        var Ua = env._nbind_value;
        var Va = env._llvm_stacksave;
        var Wa = env.___syscall54;
        var Xa = env._defineHidden;
        var Ya = env._emscripten_set_main_loop;
        var Za = env._emscripten_get_now;
        var _a2 = env.__nbind_register_callback_signature;
        var $a = env._emscripten_asm_const_iiiiii;
        var ab = env.__nbind_free_external;
        var bb = env._emscripten_asm_const_iiii;
        var cb2 = env._emscripten_asm_const_iiididi;
        var db = env.___syscall6;
        var eb = env._atexit;
        var fb = env.___syscall140;
        var gb = env.___syscall146;
        var hb = T2(0);
        const ib = T2(0);
        function Jb(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = l2;
          l2 = l2 + a3 | 0;
          l2 = l2 + 15 & -16;
          return b3 | 0;
        }
        function Kb() {
          return l2 | 0;
        }
        function Lb(a3) {
          a3 = a3 | 0;
          l2 = a3;
        }
        function Mb(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          l2 = a3;
          m = b3;
        }
        function Nb(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (!p) {
            p = a3;
            q = b3;
          }
        }
        function Ob(a3) {
          a3 = a3 | 0;
          A2 = a3;
        }
        function Pb() {
          return A2 | 0;
        }
        function Qb() {
          var b3 = 0, d2 = 0;
          BC(8104, 8, 400) | 0;
          BC(8504, 408, 540) | 0;
          b3 = 9044;
          d2 = b3 + 44 | 0;
          do {
            c2[b3 >> 2] = 0;
            b3 = b3 + 4 | 0;
          } while ((b3 | 0) < (d2 | 0));
          a2[9088] = 0;
          a2[9089] = 1;
          c2[2273] = 0;
          c2[2274] = 948;
          c2[2275] = 948;
          Ha(17, 8104, o2 | 0) | 0;
          return;
        }
        function Rb(a3) {
          a3 = a3 | 0;
          oc(a3 + 948 | 0);
          return;
        }
        function Sb(a3) {
          a3 = T2(a3);
          return ((af(a3) | 0) & 2147483647) >>> 0 > 2139095040 | 0;
        }
        function Tb(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          a: do
            if (!(c2[a3 + (b3 << 3) + 4 >> 2] | 0)) {
              if ((b3 | 2 | 0) == 3 ? c2[a3 + 60 >> 2] | 0 : 0) {
                a3 = a3 + 56 | 0;
                break;
              }
              switch (b3 | 0) {
                case 0:
                case 2:
                case 4:
                case 5: {
                  if (c2[a3 + 52 >> 2] | 0) {
                    a3 = a3 + 48 | 0;
                    break a;
                  }
                  break;
                }
                default: {
                }
              }
              if (!(c2[a3 + 68 >> 2] | 0)) {
                a3 = (b3 | 1 | 0) == 5 ? 948 : d2;
                break;
              } else {
                a3 = a3 + 64 | 0;
                break;
              }
            } else a3 = a3 + (b3 << 3) | 0;
          while (0);
          return a3 | 0;
        }
        function Ub(b3) {
          b3 = b3 | 0;
          var d2 = 0;
          d2 = oB(1e3) | 0;
          Vb(b3, (d2 | 0) != 0, 2456);
          c2[2276] = (c2[2276] | 0) + 1;
          BC(d2 | 0, 8104, 1e3) | 0;
          if (a2[b3 + 2 >> 0] | 0) {
            c2[d2 + 4 >> 2] = 2;
            c2[d2 + 12 >> 2] = 4;
          }
          c2[d2 + 976 >> 2] = b3;
          return d2 | 0;
        }
        function Vb(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          e2 = f2;
          if (!b3) {
            c2[e2 >> 2] = d2;
            fe(a3, 5, 3197, e2);
          }
          l2 = f2;
          return;
        }
        function Wb() {
          return Ub(956) | 0;
        }
        function Xb(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = qC(1e3) | 0;
          Yb(b3, a3);
          Vb(c2[a3 + 976 >> 2] | 0, 1, 2456);
          c2[2276] = (c2[2276] | 0) + 1;
          c2[b3 + 944 >> 2] = 0;
          return b3 | 0;
        }
        function Yb(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          BC(a3 | 0, b3 | 0, 948) | 0;
          ie(a3 + 948 | 0, b3 + 948 | 0);
          d2 = a3 + 960 | 0;
          a3 = b3 + 960 | 0;
          b3 = d2 + 40 | 0;
          do {
            c2[d2 >> 2] = c2[a3 >> 2];
            d2 = d2 + 4 | 0;
            a3 = a3 + 4 | 0;
          } while ((d2 | 0) < (b3 | 0));
          return;
        }
        function Zb(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0;
          b3 = a3 + 944 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 | 0) {
            _b(d2 + 948 | 0, a3) | 0;
            c2[b3 >> 2] = 0;
          }
          d2 = $b(a3) | 0;
          if (d2 | 0) {
            b3 = 0;
            do {
              c2[(ac(a3, b3) | 0) + 944 >> 2] = 0;
              b3 = b3 + 1 | 0;
            } while ((b3 | 0) != (d2 | 0));
          }
          d2 = a3 + 948 | 0;
          e2 = c2[d2 >> 2] | 0;
          f2 = a3 + 952 | 0;
          b3 = c2[f2 >> 2] | 0;
          if ((b3 | 0) != (e2 | 0)) c2[f2 >> 2] = b3 + (~((b3 + -4 - e2 | 0) >>> 2) << 2);
          bc(d2);
          pB(a3);
          c2[2276] = (c2[2276] | 0) + -1;
          return;
        }
        function _b(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = c2[a3 >> 2] | 0;
          i4 = a3 + 4 | 0;
          d2 = c2[i4 >> 2] | 0;
          g2 = d2;
          a: do
            if ((e2 | 0) == (d2 | 0)) {
              f2 = e2;
              h3 = 4;
            } else {
              a3 = e2;
              while (1) {
                if ((c2[a3 >> 2] | 0) == (b3 | 0)) {
                  f2 = a3;
                  h3 = 4;
                  break a;
                }
                a3 = a3 + 4 | 0;
                if ((a3 | 0) == (d2 | 0)) {
                  a3 = 0;
                  break;
                }
              }
            }
          while (0);
          if ((h3 | 0) == 4) if ((f2 | 0) != (d2 | 0)) {
            e2 = f2 + 4 | 0;
            a3 = g2 - e2 | 0;
            b3 = a3 >> 2;
            if (b3) {
              GC(f2 | 0, e2 | 0, a3 | 0) | 0;
              d2 = c2[i4 >> 2] | 0;
            }
            a3 = f2 + (b3 << 2) | 0;
            if ((d2 | 0) == (a3 | 0)) a3 = 1;
            else {
              c2[i4 >> 2] = d2 + (~((d2 + -4 - a3 | 0) >>> 2) << 2);
              a3 = 1;
            }
          } else a3 = 0;
          return a3 | 0;
        }
        function $b(a3) {
          a3 = a3 | 0;
          return (c2[a3 + 952 >> 2] | 0) - (c2[a3 + 948 >> 2] | 0) >> 2 | 0;
        }
        function ac(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[a3 + 948 >> 2] | 0;
          if ((c2[a3 + 952 >> 2] | 0) - d2 >> 2 >>> 0 > b3 >>> 0) a3 = c2[d2 + (b3 << 2) >> 2] | 0;
          else a3 = 0;
          return a3 | 0;
        }
        function bc(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          b3 = e2;
          f2 = c2[a3 >> 2] | 0;
          d2 = (c2[a3 + 4 >> 2] | 0) - f2 | 0;
          if (((c2[a3 + 8 >> 2] | 0) - f2 | 0) >>> 0 > d2 >>> 0) {
            f2 = d2 >> 2;
            bf(b3, f2, f2, a3 + 8 | 0);
            cf(a3, b3);
            df(b3);
          }
          l2 = e2;
          return;
        }
        function cc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0;
          k2 = $b(a3) | 0;
          do
            if (k2 | 0) {
              if ((c2[(ac(a3, 0) | 0) + 944 >> 2] | 0) == (a3 | 0)) {
                if (!(_b(a3 + 948 | 0, b3) | 0)) break;
                BC(b3 + 400 | 0, 8504, 540) | 0;
                c2[b3 + 944 >> 2] = 0;
                nc(a3);
                break;
              }
              h3 = c2[(c2[a3 + 976 >> 2] | 0) + 12 >> 2] | 0;
              i4 = a3 + 948 | 0;
              j2 = (h3 | 0) == 0;
              d2 = 0;
              g2 = 0;
              do {
                e2 = c2[(c2[i4 >> 2] | 0) + (g2 << 2) >> 2] | 0;
                if ((e2 | 0) == (b3 | 0)) nc(a3);
                else {
                  f2 = Xb(e2) | 0;
                  c2[(c2[i4 >> 2] | 0) + (d2 << 2) >> 2] = f2;
                  c2[f2 + 944 >> 2] = a3;
                  if (!j2) Ib[h3 & 15](e2, f2, a3, d2);
                  d2 = d2 + 1 | 0;
                }
                g2 = g2 + 1 | 0;
              } while ((g2 | 0) != (k2 | 0));
              if (d2 >>> 0 < k2 >>> 0) {
                j2 = a3 + 948 | 0;
                i4 = a3 + 952 | 0;
                h3 = d2;
                d2 = c2[i4 >> 2] | 0;
                do {
                  g2 = (c2[j2 >> 2] | 0) + (h3 << 2) | 0;
                  e2 = g2 + 4 | 0;
                  f2 = d2 - e2 | 0;
                  b3 = f2 >> 2;
                  if (!b3) f2 = d2;
                  else {
                    GC(g2 | 0, e2 | 0, f2 | 0) | 0;
                    d2 = c2[i4 >> 2] | 0;
                    f2 = d2;
                  }
                  e2 = g2 + (b3 << 2) | 0;
                  if ((f2 | 0) != (e2 | 0)) {
                    d2 = f2 + (~((f2 + -4 - e2 | 0) >>> 2) << 2) | 0;
                    c2[i4 >> 2] = d2;
                  }
                  h3 = h3 + 1 | 0;
                } while ((h3 | 0) != (k2 | 0));
              }
            }
          while (0);
          return;
        }
        function dc(b3) {
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          ec(b3, ($b(b3) | 0) == 0, 2491);
          ec(b3, (c2[b3 + 944 >> 2] | 0) == 0, 2545);
          d2 = b3 + 948 | 0;
          e2 = c2[d2 >> 2] | 0;
          f2 = b3 + 952 | 0;
          g2 = c2[f2 >> 2] | 0;
          if ((g2 | 0) != (e2 | 0)) c2[f2 >> 2] = g2 + (~((g2 + -4 - e2 | 0) >>> 2) << 2);
          bc(d2);
          d2 = b3 + 976 | 0;
          e2 = c2[d2 >> 2] | 0;
          BC(b3 | 0, 8104, 1e3) | 0;
          if (a2[e2 + 2 >> 0] | 0) {
            c2[b3 + 4 >> 2] = 2;
            c2[b3 + 12 >> 2] = 4;
          }
          c2[d2 >> 2] = e2;
          return;
        }
        function ec(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          e2 = f2;
          if (!b3) {
            c2[e2 >> 2] = d2;
            Vd(a3, 5, 3197, e2);
          }
          l2 = f2;
          return;
        }
        function fc() {
          return c2[2276] | 0;
        }
        function gc() {
          var a3 = 0;
          a3 = oB(20) | 0;
          hc((a3 | 0) != 0, 2592);
          c2[2277] = (c2[2277] | 0) + 1;
          c2[a3 >> 2] = c2[239];
          c2[a3 + 4 >> 2] = c2[240];
          c2[a3 + 8 >> 2] = c2[241];
          c2[a3 + 12 >> 2] = c2[242];
          c2[a3 + 16 >> 2] = c2[243];
          return a3 | 0;
        }
        function hc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          d2 = e2;
          if (!a3) {
            c2[d2 >> 2] = b3;
            Vd(0, 5, 3197, d2);
          }
          l2 = e2;
          return;
        }
        function ic(a3) {
          a3 = a3 | 0;
          pB(a3);
          c2[2277] = (c2[2277] | 0) + -1;
          return;
        }
        function jc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          if (!b3) {
            d2 = 0;
            b3 = 0;
          } else {
            ec(a3, ($b(a3) | 0) == 0, 2629);
            d2 = 1;
          }
          c2[a3 + 964 >> 2] = b3;
          c2[a3 + 988 >> 2] = d2;
          return;
        }
        function kc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          g2 = e2 + 8 | 0;
          f2 = e2 + 4 | 0;
          h3 = e2;
          c2[f2 >> 2] = b3;
          ec(a3, (c2[b3 + 944 >> 2] | 0) == 0, 2709);
          ec(a3, (c2[a3 + 964 >> 2] | 0) == 0, 2763);
          lc(a3);
          b3 = a3 + 948 | 0;
          c2[h3 >> 2] = (c2[b3 >> 2] | 0) + (d2 << 2);
          c2[g2 >> 2] = c2[h3 >> 2];
          mc(b3, g2, f2) | 0;
          c2[(c2[f2 >> 2] | 0) + 944 >> 2] = a3;
          nc(a3);
          l2 = e2;
          return;
        }
        function lc(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          d2 = $b(a3) | 0;
          if (d2 | 0 ? (c2[(ac(a3, 0) | 0) + 944 >> 2] | 0) != (a3 | 0) : 0) {
            e2 = c2[(c2[a3 + 976 >> 2] | 0) + 12 >> 2] | 0;
            f2 = a3 + 948 | 0;
            g2 = (e2 | 0) == 0;
            b3 = 0;
            do {
              h3 = c2[(c2[f2 >> 2] | 0) + (b3 << 2) >> 2] | 0;
              i4 = Xb(h3) | 0;
              c2[(c2[f2 >> 2] | 0) + (b3 << 2) >> 2] = i4;
              c2[i4 + 944 >> 2] = a3;
              if (!g2) Ib[e2 & 15](h3, i4, a3, b3);
              b3 = b3 + 1 | 0;
            } while ((b3 | 0) != (d2 | 0));
          }
          return;
        }
        function mc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0;
          s3 = l2;
          l2 = l2 + 64 | 0;
          n3 = s3 + 52 | 0;
          i4 = s3 + 48 | 0;
          o3 = s3 + 28 | 0;
          p2 = s3 + 24 | 0;
          q2 = s3 + 20 | 0;
          r3 = s3;
          e2 = c2[a3 >> 2] | 0;
          g2 = e2;
          b3 = e2 + ((c2[b3 >> 2] | 0) - g2 >> 2 << 2) | 0;
          e2 = a3 + 4 | 0;
          f2 = c2[e2 >> 2] | 0;
          h3 = a3 + 8 | 0;
          do
            if (f2 >>> 0 < (c2[h3 >> 2] | 0) >>> 0) {
              if ((b3 | 0) == (f2 | 0)) {
                c2[b3 >> 2] = c2[d2 >> 2];
                c2[e2 >> 2] = (c2[e2 >> 2] | 0) + 4;
                break;
              }
              ef(a3, b3, f2, b3 + 4 | 0);
              if (b3 >>> 0 <= d2 >>> 0) d2 = (c2[e2 >> 2] | 0) >>> 0 > d2 >>> 0 ? d2 + 4 | 0 : d2;
              c2[b3 >> 2] = c2[d2 >> 2];
            } else {
              e2 = (f2 - g2 >> 2) + 1 | 0;
              f2 = le(a3) | 0;
              if (f2 >>> 0 < e2 >>> 0) jC(a3);
              m2 = c2[a3 >> 2] | 0;
              k2 = (c2[h3 >> 2] | 0) - m2 | 0;
              g2 = k2 >> 1;
              bf(r3, k2 >> 2 >>> 0 < f2 >>> 1 >>> 0 ? g2 >>> 0 < e2 >>> 0 ? e2 : g2 : f2, b3 - m2 >> 2, a3 + 8 | 0);
              m2 = r3 + 8 | 0;
              e2 = c2[m2 >> 2] | 0;
              g2 = r3 + 12 | 0;
              k2 = c2[g2 >> 2] | 0;
              h3 = k2;
              j2 = e2;
              do
                if ((e2 | 0) == (k2 | 0)) {
                  k2 = r3 + 4 | 0;
                  e2 = c2[k2 >> 2] | 0;
                  t3 = c2[r3 >> 2] | 0;
                  f2 = t3;
                  if (e2 >>> 0 <= t3 >>> 0) {
                    e2 = h3 - f2 >> 1;
                    e2 = (e2 | 0) == 0 ? 1 : e2;
                    bf(o3, e2, e2 >>> 2, c2[r3 + 16 >> 2] | 0);
                    c2[p2 >> 2] = c2[k2 >> 2];
                    c2[q2 >> 2] = c2[m2 >> 2];
                    c2[i4 >> 2] = c2[p2 >> 2];
                    c2[n3 >> 2] = c2[q2 >> 2];
                    gf(o3, i4, n3);
                    e2 = c2[r3 >> 2] | 0;
                    c2[r3 >> 2] = c2[o3 >> 2];
                    c2[o3 >> 2] = e2;
                    e2 = o3 + 4 | 0;
                    t3 = c2[k2 >> 2] | 0;
                    c2[k2 >> 2] = c2[e2 >> 2];
                    c2[e2 >> 2] = t3;
                    e2 = o3 + 8 | 0;
                    t3 = c2[m2 >> 2] | 0;
                    c2[m2 >> 2] = c2[e2 >> 2];
                    c2[e2 >> 2] = t3;
                    e2 = o3 + 12 | 0;
                    t3 = c2[g2 >> 2] | 0;
                    c2[g2 >> 2] = c2[e2 >> 2];
                    c2[e2 >> 2] = t3;
                    df(o3);
                    e2 = c2[m2 >> 2] | 0;
                    break;
                  }
                  g2 = e2;
                  h3 = ((g2 - f2 >> 2) + 1 | 0) / -2 | 0;
                  i4 = e2 + (h3 << 2) | 0;
                  f2 = j2 - g2 | 0;
                  g2 = f2 >> 2;
                  if (g2) {
                    GC(i4 | 0, e2 | 0, f2 | 0) | 0;
                    e2 = c2[k2 >> 2] | 0;
                  }
                  t3 = i4 + (g2 << 2) | 0;
                  c2[m2 >> 2] = t3;
                  c2[k2 >> 2] = e2 + (h3 << 2);
                  e2 = t3;
                }
              while (0);
              c2[e2 >> 2] = c2[d2 >> 2];
              c2[m2 >> 2] = (c2[m2 >> 2] | 0) + 4;
              b3 = ff(a3, r3, b3) | 0;
              df(r3);
            }
          while (0);
          l2 = s3;
          return b3 | 0;
        }
        function nc(b3) {
          b3 = b3 | 0;
          var d2 = 0;
          do {
            d2 = b3 + 984 | 0;
            if (a2[d2 >> 0] | 0) break;
            a2[d2 >> 0] = 1;
            g[b3 + 504 >> 2] = T2(t2);
            b3 = c2[b3 + 944 >> 2] | 0;
          } while ((b3 | 0) != 0);
          return;
        }
        function oc(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -4 - e2 | 0) >>> 2) << 2);
            sC(d2);
          }
          return;
        }
        function pc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 944 >> 2] | 0;
        }
        function qc(a3) {
          a3 = a3 | 0;
          ec(a3, (c2[a3 + 964 >> 2] | 0) != 0, 2832);
          nc(a3);
          return;
        }
        function rc(b3) {
          b3 = b3 | 0;
          return (a2[b3 + 984 >> 0] | 0) != 0 | 0;
        }
        function sc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (BB(a3, b3, 400) | 0) {
            BC(a3 | 0, b3 | 0, 400) | 0;
            nc(a3);
          }
          return;
        }
        function tc(a3) {
          a3 = a3 | 0;
          var b3 = ib;
          b3 = T2(g[a3 + 44 >> 2]);
          a3 = Sb(b3) | 0;
          return T2(a3 ? T2(0) : b3);
        }
        function uc(b3) {
          b3 = b3 | 0;
          var d2 = ib;
          d2 = T2(g[b3 + 48 >> 2]);
          if (Sb(d2) | 0) d2 = a2[(c2[b3 + 976 >> 2] | 0) + 2 >> 0] | 0 ? T2(1) : T2(0);
          return T2(d2);
        }
        function vc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 + 980 >> 2] = b3;
          return;
        }
        function wc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 980 >> 2] | 0;
        }
        function xc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 4 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function yc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 4 >> 2] | 0;
        }
        function zc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 8 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Ac(a3) {
          a3 = a3 | 0;
          return c2[a3 + 8 >> 2] | 0;
        }
        function Bc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 12 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Cc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 12 >> 2] | 0;
        }
        function Dc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 16 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Ec(a3) {
          a3 = a3 | 0;
          return c2[a3 + 16 >> 2] | 0;
        }
        function Fc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 20 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Gc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 20 >> 2] | 0;
        }
        function Hc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 24 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Ic(a3) {
          a3 = a3 | 0;
          return c2[a3 + 24 >> 2] | 0;
        }
        function Jc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 28 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Kc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 28 >> 2] | 0;
        }
        function Lc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 32 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Mc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 32 >> 2] | 0;
        }
        function Nc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 36 | 0;
          if ((c2[d2 >> 2] | 0) != (b3 | 0)) {
            c2[d2 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Oc(a3) {
          a3 = a3 | 0;
          return c2[a3 + 36 >> 2] | 0;
        }
        function Pc(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var c3 = 0;
          c3 = a3 + 40 | 0;
          if (T2(g[c3 >> 2]) != b3) {
            g[c3 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Qc(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var c3 = 0;
          c3 = a3 + 44 | 0;
          if (T2(g[c3 >> 2]) != b3) {
            g[c3 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Rc(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var c3 = 0;
          c3 = a3 + 48 | 0;
          if (T2(g[c3 >> 2]) != b3) {
            g[c3 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Sc(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 52 | 0;
          f2 = a3 + 56 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function Tc(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0;
          e2 = a3 + 52 | 0;
          d2 = a3 + 56 | 0;
          if (!(!(T2(g[e2 >> 2]) != b3) ? (c2[d2 >> 2] | 0) == 2 : 0)) {
            g[e2 >> 2] = b3;
            e2 = Sb(b3) | 0;
            c2[d2 >> 2] = e2 ? 3 : 2;
            nc(a3);
          }
          return;
        }
        function Uc(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 52 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function Vc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = (h3 ^ 1) & 1;
          f2 = a3 + 132 + (b3 << 3) | 0;
          b3 = a3 + 132 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function Wc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = h3 ? 0 : 2;
          f2 = a3 + 132 + (b3 << 3) | 0;
          b3 = a3 + 132 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function Xc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = b3 + 132 + (d2 << 3) | 0;
          b3 = c2[e2 + 4 >> 2] | 0;
          d2 = a3;
          c2[d2 >> 2] = c2[e2 >> 2];
          c2[d2 + 4 >> 2] = b3;
          return;
        }
        function Yc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = (h3 ^ 1) & 1;
          f2 = a3 + 60 + (b3 << 3) | 0;
          b3 = a3 + 60 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function Zc(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = h3 ? 0 : 2;
          f2 = a3 + 60 + (b3 << 3) | 0;
          b3 = a3 + 60 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function _c(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = b3 + 60 + (d2 << 3) | 0;
          b3 = c2[e2 + 4 >> 2] | 0;
          d2 = a3;
          c2[d2 >> 2] = c2[e2 >> 2];
          c2[d2 + 4 >> 2] = b3;
          return;
        }
        function $c(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = a3 + 60 + (b3 << 3) + 4 | 0;
          if ((c2[d2 >> 2] | 0) != 3) {
            g[a3 + 60 + (b3 << 3) >> 2] = T2(t2);
            c2[d2 >> 2] = 3;
            nc(a3);
          }
          return;
        }
        function ad(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = (h3 ^ 1) & 1;
          f2 = a3 + 204 + (b3 << 3) | 0;
          b3 = a3 + 204 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function bd(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = h3 ? 0 : 2;
          f2 = a3 + 204 + (b3 << 3) | 0;
          b3 = a3 + 204 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function cd(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = b3 + 204 + (d2 << 3) | 0;
          b3 = c2[e2 + 4 >> 2] | 0;
          d2 = a3;
          c2[d2 >> 2] = c2[e2 >> 2];
          c2[d2 + 4 >> 2] = b3;
          return;
        }
        function dd(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(d2) | 0;
          e2 = (h3 ^ 1) & 1;
          f2 = a3 + 276 + (b3 << 3) | 0;
          b3 = a3 + 276 + (b3 << 3) + 4 | 0;
          if (!(h3 | T2(g[f2 >> 2]) == d2 ? (c2[b3 >> 2] | 0) == (e2 | 0) : 0)) {
            g[f2 >> 2] = d2;
            c2[b3 >> 2] = e2;
            nc(a3);
          }
          return;
        }
        function ed(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return T2(g[a3 + 276 + (b3 << 3) >> 2]);
        }
        function fd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 348 | 0;
          f2 = a3 + 352 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function gd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0;
          e2 = a3 + 348 | 0;
          d2 = a3 + 352 | 0;
          if (!(!(T2(g[e2 >> 2]) != b3) ? (c2[d2 >> 2] | 0) == 2 : 0)) {
            g[e2 >> 2] = b3;
            e2 = Sb(b3) | 0;
            c2[d2 >> 2] = e2 ? 3 : 2;
            nc(a3);
          }
          return;
        }
        function hd(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = a3 + 352 | 0;
          if ((c2[b3 >> 2] | 0) != 3) {
            g[a3 + 348 >> 2] = T2(t2);
            c2[b3 >> 2] = 3;
            nc(a3);
          }
          return;
        }
        function id(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 348 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function jd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 356 | 0;
          f2 = a3 + 360 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function kd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0;
          e2 = a3 + 356 | 0;
          d2 = a3 + 360 | 0;
          if (!(!(T2(g[e2 >> 2]) != b3) ? (c2[d2 >> 2] | 0) == 2 : 0)) {
            g[e2 >> 2] = b3;
            e2 = Sb(b3) | 0;
            c2[d2 >> 2] = e2 ? 3 : 2;
            nc(a3);
          }
          return;
        }
        function ld(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = a3 + 360 | 0;
          if ((c2[b3 >> 2] | 0) != 3) {
            g[a3 + 356 >> 2] = T2(t2);
            c2[b3 >> 2] = 3;
            nc(a3);
          }
          return;
        }
        function md(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 356 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function nd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 364 | 0;
          f2 = a3 + 368 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function od(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = h3 ? 0 : 2;
          e2 = a3 + 364 | 0;
          f2 = a3 + 368 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function pd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 364 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function qd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 372 | 0;
          f2 = a3 + 376 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function rd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = h3 ? 0 : 2;
          e2 = a3 + 372 | 0;
          f2 = a3 + 376 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function sd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 372 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function td(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 380 | 0;
          f2 = a3 + 384 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function ud(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = h3 ? 0 : 2;
          e2 = a3 + 380 | 0;
          f2 = a3 + 384 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function vd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 380 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function wd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = (h3 ^ 1) & 1;
          e2 = a3 + 388 | 0;
          f2 = a3 + 392 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function xd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0;
          h3 = Sb(b3) | 0;
          d2 = h3 ? 0 : 2;
          e2 = a3 + 388 | 0;
          f2 = a3 + 392 | 0;
          if (!(h3 | T2(g[e2 >> 2]) == b3 ? (c2[f2 >> 2] | 0) == (d2 | 0) : 0)) {
            g[e2 >> 2] = b3;
            c2[f2 >> 2] = d2;
            nc(a3);
          }
          return;
        }
        function yd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = b3 + 388 | 0;
          d2 = c2[e2 + 4 >> 2] | 0;
          b3 = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          c2[b3 + 4 >> 2] = d2;
          return;
        }
        function zd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var c3 = 0;
          c3 = a3 + 396 | 0;
          if (T2(g[c3 >> 2]) != b3) {
            g[c3 >> 2] = b3;
            nc(a3);
          }
          return;
        }
        function Ad(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 396 >> 2]);
        }
        function Bd(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 400 >> 2]);
        }
        function Cd(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 404 >> 2]);
        }
        function Dd(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 408 >> 2]);
        }
        function Ed(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 412 >> 2]);
        }
        function Fd(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 416 >> 2]);
        }
        function Gd(a3) {
          a3 = a3 | 0;
          return T2(g[a3 + 420 >> 2]);
        }
        function Hd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          ec(a3, (b3 | 0) < 6, 2918);
          switch (b3 | 0) {
            case 0: {
              b3 = (c2[a3 + 496 >> 2] | 0) == 2 ? 5 : 4;
              break;
            }
            case 2: {
              b3 = (c2[a3 + 496 >> 2] | 0) == 2 ? 4 : 5;
              break;
            }
            default: {
            }
          }
          return T2(g[a3 + 424 + (b3 << 2) >> 2]);
        }
        function Id(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          ec(a3, (b3 | 0) < 6, 2918);
          switch (b3 | 0) {
            case 0: {
              b3 = (c2[a3 + 496 >> 2] | 0) == 2 ? 5 : 4;
              break;
            }
            case 2: {
              b3 = (c2[a3 + 496 >> 2] | 0) == 2 ? 4 : 5;
              break;
            }
            default: {
            }
          }
          return T2(g[a3 + 448 + (b3 << 2) >> 2]);
        }
        function Jd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          ec(a3, (b3 | 0) < 6, 2918);
          switch (b3 | 0) {
            case 0: {
              b3 = (c2[a3 + 496 >> 2] | 0) == 2 ? 5 : 4;
              break;
            }
            case 2: {
              b3 = (c2[a3 + 496 >> 2] | 0) == 2 ? 4 : 5;
              break;
            }
            default: {
            }
          }
          return T2(g[a3 + 472 + (b3 << 2) >> 2]);
        }
        function Kd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = ib;
          d2 = c2[a3 + 4 >> 2] | 0;
          if ((d2 | 0) == (c2[b3 + 4 >> 2] | 0)) {
            if (!d2) a3 = 1;
            else {
              e2 = T2(g[a3 >> 2]);
              a3 = T2(C2(T2(e2 - T2(g[b3 >> 2])))) < T2(999999974e-13);
            }
          } else a3 = 0;
          return a3 | 0;
        }
        function Ld(a3, b3) {
          a3 = T2(a3);
          b3 = T2(b3);
          var c3 = 0;
          if (Sb(a3) | 0) c3 = Sb(b3) | 0;
          else c3 = T2(C2(T2(a3 - b3))) < T2(999999974e-13);
          return c3 | 0;
        }
        function Md(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Nd(a3, b3);
          return;
        }
        function Nd(b3, d2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 4 | 0;
          c2[f2 >> 2] = 0;
          c2[f2 + 4 >> 2] = 0;
          c2[f2 + 8 >> 2] = 0;
          Ka(f2 | 0, b3 | 0, d2 | 0, 0);
          Vd(b3, 3, (a2[f2 + 11 >> 0] | 0) < 0 ? c2[f2 >> 2] | 0 : f2, e2);
          tC(f2);
          l2 = e2;
          return;
        }
        function Od(a3, b3, c3, d2) {
          a3 = T2(a3);
          b3 = T2(b3);
          c3 = c3 | 0;
          d2 = d2 | 0;
          var e2 = ib;
          a3 = T2(a3 * b3);
          e2 = T2(gC(a3, T2(1)));
          do
            if (!(Ld(e2, T2(0)) | 0)) {
              a3 = T2(a3 - e2);
              if (Ld(e2, T2(1)) | 0) {
                a3 = T2(a3 + T2(1));
                break;
              }
              if (c3) {
                a3 = T2(a3 + T2(1));
                break;
              }
              if (!d2) {
                if (e2 > T2(0.5)) e2 = T2(1);
                else {
                  d2 = Ld(e2, T2(0.5)) | 0;
                  e2 = d2 ? T2(1) : T2(0);
                }
                a3 = T2(a3 + e2);
              }
            } else a3 = T2(a3 - e2);
          while (0);
          return T2(a3 / b3);
        }
        function Pd(a3, b3, c3, d2, e2, f2, h3, i4, j2, k2, l3, m2, n3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = c3 | 0;
          d2 = T2(d2);
          e2 = e2 | 0;
          f2 = T2(f2);
          h3 = h3 | 0;
          i4 = T2(i4);
          j2 = T2(j2);
          k2 = T2(k2);
          l3 = T2(l3);
          m2 = T2(m2);
          n3 = n3 | 0;
          var o3 = 0, p2 = ib, q2 = ib, r3 = ib, s3 = ib, t3 = ib, u2 = ib;
          if (j2 < T2(0) | k2 < T2(0)) n3 = 0;
          else {
            if ((n3 | 0) != 0 ? (p2 = T2(g[n3 + 4 >> 2]), p2 != T2(0)) : 0) {
              r3 = T2(Od(b3, p2, 0, 0));
              s3 = T2(Od(d2, p2, 0, 0));
              q2 = T2(Od(f2, p2, 0, 0));
              p2 = T2(Od(i4, p2, 0, 0));
            } else {
              q2 = f2;
              r3 = b3;
              p2 = i4;
              s3 = d2;
            }
            if ((e2 | 0) == (a3 | 0)) o3 = Ld(q2, r3) | 0;
            else o3 = 0;
            if ((h3 | 0) == (c3 | 0)) n3 = Ld(p2, s3) | 0;
            else n3 = 0;
            if ((!o3 ? (t3 = T2(b3 - l3), !(Qd(a3, t3, j2) | 0)) : 0) ? !(Rd(a3, t3, e2, j2) | 0) : 0) o3 = Sd(a3, t3, e2, f2, j2) | 0;
            else o3 = 1;
            if ((!n3 ? (u2 = T2(d2 - m2), !(Qd(c3, u2, k2) | 0)) : 0) ? !(Rd(c3, u2, h3, k2) | 0) : 0) n3 = Sd(c3, u2, h3, i4, k2) | 0;
            else n3 = 1;
            n3 = o3 & n3;
          }
          return n3 | 0;
        }
        function Qd(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = T2(c3);
          if ((a3 | 0) == 1) a3 = Ld(b3, c3) | 0;
          else a3 = 0;
          return a3 | 0;
        }
        function Rd(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = c3 | 0;
          d2 = T2(d2);
          if ((a3 | 0) == 2 & (c3 | 0) == 0) {
            if (!(b3 >= d2)) a3 = Ld(b3, d2) | 0;
            else a3 = 1;
          } else a3 = 0;
          return a3 | 0;
        }
        function Sd(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = c3 | 0;
          d2 = T2(d2);
          e2 = T2(e2);
          if ((a3 | 0) == 2 & (c3 | 0) == 2 & d2 > b3) {
            if (!(e2 <= b3)) a3 = Ld(b3, e2) | 0;
            else a3 = 1;
          } else a3 = 0;
          return a3 | 0;
        }
        function Td(b3, d2, e2, f2, i4, j2, k2, m2, n3, o3, p2) {
          b3 = b3 | 0;
          d2 = T2(d2);
          e2 = T2(e2);
          f2 = f2 | 0;
          i4 = i4 | 0;
          j2 = j2 | 0;
          k2 = T2(k2);
          m2 = T2(m2);
          n3 = n3 | 0;
          o3 = o3 | 0;
          p2 = p2 | 0;
          var q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = ib, v2 = ib, w3 = 0, x3 = 0, y3 = 0, z2 = 0, A3 = 0, B3 = 0, C3 = 0, D3 = 0, E3 = 0, F3 = 0, G3 = 0, H2 = ib, I3 = ib, J2 = ib, K2 = 0, L3 = 0;
          G3 = l2;
          l2 = l2 + 160 | 0;
          D3 = G3 + 152 | 0;
          C3 = G3 + 120 | 0;
          B3 = G3 + 104 | 0;
          y3 = G3 + 72 | 0;
          t3 = G3 + 56 | 0;
          A3 = G3 + 8 | 0;
          x3 = G3;
          z2 = (c2[2279] | 0) + 1 | 0;
          c2[2279] = z2;
          E3 = b3 + 984 | 0;
          if ((a2[E3 >> 0] | 0) != 0 ? (c2[b3 + 512 >> 2] | 0) != (c2[2278] | 0) : 0) w3 = 4;
          else if ((c2[b3 + 516 >> 2] | 0) == (f2 | 0)) F3 = 0;
          else w3 = 4;
          if ((w3 | 0) == 4) {
            c2[b3 + 520 >> 2] = 0;
            c2[b3 + 924 >> 2] = -1;
            c2[b3 + 928 >> 2] = -1;
            g[b3 + 932 >> 2] = T2(-1);
            g[b3 + 936 >> 2] = T2(-1);
            F3 = 1;
          }
          a: do
            if (!(c2[b3 + 964 >> 2] | 0)) {
              if (n3) {
                q2 = b3 + 916 | 0;
                if (!(Ld(T2(g[q2 >> 2]), d2) | 0)) {
                  w3 = 21;
                  break;
                }
                if (!(Ld(T2(g[b3 + 920 >> 2]), e2) | 0)) {
                  w3 = 21;
                  break;
                }
                if ((c2[b3 + 924 >> 2] | 0) != (i4 | 0)) {
                  w3 = 21;
                  break;
                }
                q2 = (c2[b3 + 928 >> 2] | 0) == (j2 | 0) ? q2 : 0;
                w3 = 22;
                break;
              }
              s3 = c2[b3 + 520 >> 2] | 0;
              if (!s3) w3 = 21;
              else {
                r3 = 0;
                while (1) {
                  q2 = b3 + 524 + (r3 * 24 | 0) | 0;
                  if (((Ld(T2(g[q2 >> 2]), d2) | 0 ? Ld(T2(g[b3 + 524 + (r3 * 24 | 0) + 4 >> 2]), e2) | 0 : 0) ? (c2[b3 + 524 + (r3 * 24 | 0) + 8 >> 2] | 0) == (i4 | 0) : 0) ? (c2[b3 + 524 + (r3 * 24 | 0) + 12 >> 2] | 0) == (j2 | 0) : 0) {
                    w3 = 22;
                    break a;
                  }
                  r3 = r3 + 1 | 0;
                  if (r3 >>> 0 >= s3 >>> 0) {
                    w3 = 21;
                    break;
                  }
                }
              }
            } else {
              u2 = T2(Ud(b3, 2, k2));
              v2 = T2(Ud(b3, 0, k2));
              q2 = b3 + 916 | 0;
              J2 = T2(g[q2 >> 2]);
              I3 = T2(g[b3 + 920 >> 2]);
              H2 = T2(g[b3 + 932 >> 2]);
              if (!(Pd(i4, d2, j2, e2, c2[b3 + 924 >> 2] | 0, J2, c2[b3 + 928 >> 2] | 0, I3, H2, T2(g[b3 + 936 >> 2]), u2, v2, p2) | 0)) {
                s3 = c2[b3 + 520 >> 2] | 0;
                if (!s3) w3 = 21;
                else {
                  r3 = 0;
                  while (1) {
                    q2 = b3 + 524 + (r3 * 24 | 0) | 0;
                    H2 = T2(g[q2 >> 2]);
                    I3 = T2(g[b3 + 524 + (r3 * 24 | 0) + 4 >> 2]);
                    J2 = T2(g[b3 + 524 + (r3 * 24 | 0) + 16 >> 2]);
                    if (Pd(i4, d2, j2, e2, c2[b3 + 524 + (r3 * 24 | 0) + 8 >> 2] | 0, H2, c2[b3 + 524 + (r3 * 24 | 0) + 12 >> 2] | 0, I3, J2, T2(g[b3 + 524 + (r3 * 24 | 0) + 20 >> 2]), u2, v2, p2) | 0) {
                      w3 = 22;
                      break a;
                    }
                    r3 = r3 + 1 | 0;
                    if (r3 >>> 0 >= s3 >>> 0) {
                      w3 = 21;
                      break;
                    }
                  }
                }
              } else w3 = 22;
            }
          while (0);
          do
            if ((w3 | 0) == 21) {
              if (!(a2[11697] | 0)) {
                q2 = 0;
                w3 = 31;
              } else {
                q2 = 0;
                w3 = 28;
              }
            } else if ((w3 | 0) == 22) {
              r3 = (a2[11697] | 0) != 0;
              if (!((q2 | 0) != 0 & (F3 ^ 1))) if (r3) {
                w3 = 28;
                break;
              } else {
                w3 = 31;
                break;
              }
              t3 = q2 + 16 | 0;
              c2[b3 + 908 >> 2] = c2[t3 >> 2];
              s3 = q2 + 20 | 0;
              c2[b3 + 912 >> 2] = c2[s3 >> 2];
              if (!((a2[11698] | 0) == 0 | r3 ^ 1)) {
                c2[x3 >> 2] = Wd(z2) | 0;
                c2[x3 + 4 >> 2] = z2;
                Vd(b3, 4, 2972, x3);
                r3 = c2[b3 + 972 >> 2] | 0;
                if (r3 | 0) nb[r3 & 127](b3);
                i4 = Xd(i4, n3) | 0;
                j2 = Xd(j2, n3) | 0;
                L3 = +T2(g[t3 >> 2]);
                K2 = +T2(g[s3 >> 2]);
                c2[A3 >> 2] = i4;
                c2[A3 + 4 >> 2] = j2;
                h2[A3 + 8 >> 3] = +d2;
                h2[A3 + 16 >> 3] = +e2;
                h2[A3 + 24 >> 3] = L3;
                h2[A3 + 32 >> 3] = K2;
                c2[A3 + 40 >> 2] = o3;
                Vd(b3, 4, 2989, A3);
              }
            }
          while (0);
          if ((w3 | 0) == 28) {
            r3 = Wd(z2) | 0;
            c2[t3 >> 2] = r3;
            c2[t3 + 4 >> 2] = z2;
            c2[t3 + 8 >> 2] = F3 ? 3047 : 11699;
            Vd(b3, 4, 3038, t3);
            r3 = c2[b3 + 972 >> 2] | 0;
            if (r3 | 0) nb[r3 & 127](b3);
            A3 = Xd(i4, n3) | 0;
            w3 = Xd(j2, n3) | 0;
            c2[y3 >> 2] = A3;
            c2[y3 + 4 >> 2] = w3;
            h2[y3 + 8 >> 3] = +d2;
            h2[y3 + 16 >> 3] = +e2;
            c2[y3 + 24 >> 2] = o3;
            Vd(b3, 4, 3049, y3);
            w3 = 31;
          }
          if ((w3 | 0) == 31) {
            Yd(b3, d2, e2, f2, i4, j2, k2, m2, n3, p2);
            if (a2[11697] | 0) {
              r3 = c2[2279] | 0;
              A3 = Wd(r3) | 0;
              c2[B3 >> 2] = A3;
              c2[B3 + 4 >> 2] = r3;
              c2[B3 + 8 >> 2] = F3 ? 3047 : 11699;
              Vd(b3, 4, 3083, B3);
              r3 = c2[b3 + 972 >> 2] | 0;
              if (r3 | 0) nb[r3 & 127](b3);
              A3 = Xd(i4, n3) | 0;
              B3 = Xd(j2, n3) | 0;
              K2 = +T2(g[b3 + 908 >> 2]);
              L3 = +T2(g[b3 + 912 >> 2]);
              c2[C3 >> 2] = A3;
              c2[C3 + 4 >> 2] = B3;
              h2[C3 + 8 >> 3] = K2;
              h2[C3 + 16 >> 3] = L3;
              c2[C3 + 24 >> 2] = o3;
              Vd(b3, 4, 3092, C3);
            }
            c2[b3 + 516 >> 2] = f2;
            if (!q2) {
              r3 = b3 + 520 | 0;
              q2 = c2[r3 >> 2] | 0;
              if ((q2 | 0) == 16) {
                if (a2[11697] | 0) Vd(b3, 4, 3124, D3);
                c2[r3 >> 2] = 0;
                q2 = 0;
              }
              if (n3) q2 = b3 + 916 | 0;
              else {
                c2[r3 >> 2] = q2 + 1;
                q2 = b3 + 524 + (q2 * 24 | 0) | 0;
              }
              g[q2 >> 2] = d2;
              g[q2 + 4 >> 2] = e2;
              c2[q2 + 8 >> 2] = i4;
              c2[q2 + 12 >> 2] = j2;
              c2[q2 + 16 >> 2] = c2[b3 + 908 >> 2];
              c2[q2 + 20 >> 2] = c2[b3 + 912 >> 2];
              q2 = 0;
            }
          }
          if (n3) {
            c2[b3 + 416 >> 2] = c2[b3 + 908 >> 2];
            c2[b3 + 420 >> 2] = c2[b3 + 912 >> 2];
            a2[b3 + 985 >> 0] = 1;
            a2[E3 >> 0] = 0;
          }
          c2[2279] = (c2[2279] | 0) + -1;
          c2[b3 + 512 >> 2] = c2[2278];
          l2 = G3;
          return F3 | (q2 | 0) == 0 | 0;
        }
        function Ud(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          var d2 = ib;
          d2 = T2(me(a3, b3, c3));
          return T2(d2 + T2(ne(a3, b3, c3)));
        }
        function Vd(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          c2[f2 >> 2] = e2;
          if (!a3) e2 = 0;
          else e2 = c2[a3 + 976 >> 2] | 0;
          ge(e2, a3, b3, d2, f2);
          l2 = g2;
          return;
        }
        function Wd(a3) {
          a3 = a3 | 0;
          return (a3 >>> 0 > 60 ? 3201 : 3201 + (60 - a3) | 0) | 0;
        }
        function Xd(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          d2 = f2 + 12 | 0;
          e2 = f2;
          c2[d2 >> 2] = c2[254];
          c2[d2 + 4 >> 2] = c2[255];
          c2[d2 + 8 >> 2] = c2[256];
          c2[e2 >> 2] = c2[257];
          c2[e2 + 4 >> 2] = c2[258];
          c2[e2 + 8 >> 2] = c2[259];
          if ((a3 | 0) > 2) a3 = 11699;
          else a3 = c2[(b3 ? e2 : d2) + (a3 << 2) >> 2] | 0;
          l2 = f2;
          return a3 | 0;
        }
        function Yd(b3, e2, f2, h3, i4, k2, m2, n3, o3, p2) {
          b3 = b3 | 0;
          e2 = T2(e2);
          f2 = T2(f2);
          h3 = h3 | 0;
          i4 = i4 | 0;
          k2 = k2 | 0;
          m2 = T2(m2);
          n3 = T2(n3);
          o3 = o3 | 0;
          p2 = p2 | 0;
          var q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = ib, v2 = ib, w3 = ib, x3 = ib, y3 = ib, z2 = ib, A3 = ib, B3 = 0, C3 = 0, D3 = 0, E3 = ib, F3 = ib, G3 = 0, H2 = ib, I3 = 0, J2 = 0, K2 = 0, L3 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R3 = 0, S2 = 0, U2 = 0, V2 = 0, W3 = 0, X2 = 0, Y2 = 0, Z2 = 0, _2 = 0, $2 = ib, aa2 = ib, ba2 = ib, ca2 = ib, da2 = ib, ea2 = 0, fa2 = 0, ga2 = 0, ha2 = 0, ia2 = 0, ja2 = ib, ka2 = ib, la2 = ib, ma2 = ib, na2 = ib, oa2 = ib, pa2 = 0, qa2 = ib, ra2 = ib, sa2 = ib, ta2 = ib, ua2 = ib, va2 = ib, wa2 = 0, xa2 = 0, ya2 = ib, za2 = ib, Aa2 = 0, Ba2 = 0, Ca2 = 0, Da2 = 0, Ea2 = ib, Fa2 = 0, Ga2 = 0, Ha2 = 0, Ia2 = 0, Ja2 = 0, Ka2 = 0, La2 = 0, Ma2 = ib, Na2 = 0, Oa2 = 0;
          La2 = l2;
          l2 = l2 + 16 | 0;
          ea2 = La2 + 12 | 0;
          fa2 = La2 + 8 | 0;
          ga2 = La2 + 4 | 0;
          ha2 = La2;
          ec(b3, (i4 | 0) == 0 | (Sb(e2) | 0) ^ 1, 3326);
          ec(b3, (k2 | 0) == 0 | (Sb(f2) | 0) ^ 1, 3406);
          Ga2 = qe(b3, h3) | 0;
          c2[b3 + 496 >> 2] = Ga2;
          Ja2 = re(2, Ga2) | 0;
          Ka2 = re(0, Ga2) | 0;
          g[b3 + 440 >> 2] = T2(me(b3, Ja2, m2));
          g[b3 + 444 >> 2] = T2(ne(b3, Ja2, m2));
          g[b3 + 428 >> 2] = T2(me(b3, Ka2, m2));
          g[b3 + 436 >> 2] = T2(ne(b3, Ka2, m2));
          g[b3 + 464 >> 2] = T2(se(b3, Ja2));
          g[b3 + 468 >> 2] = T2(te(b3, Ja2));
          g[b3 + 452 >> 2] = T2(se(b3, Ka2));
          g[b3 + 460 >> 2] = T2(te(b3, Ka2));
          g[b3 + 488 >> 2] = T2(ue(b3, Ja2, m2));
          g[b3 + 492 >> 2] = T2(ve(b3, Ja2, m2));
          g[b3 + 476 >> 2] = T2(ue(b3, Ka2, m2));
          g[b3 + 484 >> 2] = T2(ve(b3, Ka2, m2));
          do
            if (!(c2[b3 + 964 >> 2] | 0)) {
              Ha2 = b3 + 948 | 0;
              Ia2 = (c2[b3 + 952 >> 2] | 0) - (c2[Ha2 >> 2] | 0) >> 2;
              if (!Ia2) {
                xe(b3, e2, f2, i4, k2, m2, n3);
                break;
              }
              if (!o3 ? ye(b3, e2, f2, i4, k2, m2, n3) | 0 : 0) break;
              lc(b3);
              Y2 = b3 + 508 | 0;
              a2[Y2 >> 0] = 0;
              Ja2 = re(c2[b3 + 4 >> 2] | 0, Ga2) | 0;
              Ka2 = ze(Ja2, Ga2) | 0;
              Fa2 = oe(Ja2) | 0;
              Z2 = c2[b3 + 8 >> 2] | 0;
              Ba2 = b3 + 28 | 0;
              _2 = (c2[Ba2 >> 2] | 0) != 0;
              ua2 = Fa2 ? m2 : n3;
              ya2 = Fa2 ? n3 : m2;
              $2 = T2(Ae(b3, Ja2, m2));
              aa2 = T2(Be(b3, Ja2, m2));
              u2 = T2(Ae(b3, Ka2, m2));
              va2 = T2(Ce(b3, Ja2, m2));
              za2 = T2(Ce(b3, Ka2, m2));
              D3 = Fa2 ? i4 : k2;
              Aa2 = Fa2 ? k2 : i4;
              Ea2 = Fa2 ? va2 : za2;
              y3 = Fa2 ? za2 : va2;
              ta2 = T2(Ud(b3, 2, m2));
              x3 = T2(Ud(b3, 0, m2));
              v2 = T2(T2(be(b3 + 364 | 0, m2)) - Ea2);
              w3 = T2(T2(be(b3 + 380 | 0, m2)) - Ea2);
              z2 = T2(T2(be(b3 + 372 | 0, n3)) - y3);
              A3 = T2(T2(be(b3 + 388 | 0, n3)) - y3);
              ba2 = Fa2 ? v2 : z2;
              ca2 = Fa2 ? w3 : A3;
              ta2 = T2(e2 - ta2);
              e2 = T2(ta2 - Ea2);
              if (Sb(e2) | 0) Ea2 = e2;
              else Ea2 = T2(cC(T2(eC(e2, w3)), v2));
              ra2 = T2(f2 - x3);
              e2 = T2(ra2 - y3);
              if (Sb(e2) | 0) sa2 = e2;
              else sa2 = T2(cC(T2(eC(e2, A3)), z2));
              v2 = Fa2 ? Ea2 : sa2;
              qa2 = Fa2 ? sa2 : Ea2;
              a: do
                if ((D3 | 0) == 1) {
                  h3 = 0;
                  r3 = 0;
                  while (1) {
                    q2 = ac(b3, r3) | 0;
                    if (!h3) {
                      if (T2(Ee(q2)) > T2(0) ? T2(Fe(q2)) > T2(0) : 0) h3 = q2;
                      else h3 = 0;
                    } else if (De(q2) | 0) {
                      t3 = 0;
                      break a;
                    }
                    r3 = r3 + 1 | 0;
                    if (r3 >>> 0 >= Ia2 >>> 0) {
                      t3 = h3;
                      break;
                    }
                  }
                } else t3 = 0;
              while (0);
              B3 = t3 + 500 | 0;
              C3 = t3 + 504 | 0;
              h3 = 0;
              q2 = 0;
              e2 = T2(0);
              s3 = 0;
              do {
                r3 = c2[(c2[Ha2 >> 2] | 0) + (s3 << 2) >> 2] | 0;
                if ((c2[r3 + 36 >> 2] | 0) == 1) {
                  Ge(r3);
                  a2[r3 + 985 >> 0] = 1;
                  a2[r3 + 984 >> 0] = 0;
                } else {
                  $d(r3);
                  if (o3) ce(r3, qe(r3, Ga2) | 0, v2, qa2, Ea2);
                  do
                    if ((c2[r3 + 24 >> 2] | 0) != 1) {
                      if ((r3 | 0) == (t3 | 0)) {
                        c2[B3 >> 2] = c2[2278];
                        g[C3 >> 2] = T2(0);
                        break;
                      } else {
                        He(b3, r3, Ea2, i4, sa2, Ea2, sa2, k2, Ga2, p2);
                        break;
                      }
                    } else {
                      if (q2 | 0) c2[q2 + 960 >> 2] = r3;
                      c2[r3 + 960 >> 2] = 0;
                      q2 = r3;
                      h3 = (h3 | 0) == 0 ? r3 : h3;
                    }
                  while (0);
                  oa2 = T2(g[r3 + 504 >> 2]);
                  e2 = T2(e2 + T2(oa2 + T2(Ud(r3, Ja2, Ea2))));
                }
                s3 = s3 + 1 | 0;
              } while ((s3 | 0) != (Ia2 | 0));
              K2 = e2 > v2;
              pa2 = _2 & ((D3 | 0) == 2 & K2) ? 1 : D3;
              I3 = (Aa2 | 0) == 1;
              M2 = I3 & (o3 ^ 1);
              N2 = (pa2 | 0) == 1;
              O2 = (pa2 | 0) == 2;
              P2 = 976 + (Ja2 << 2) | 0;
              Q2 = (Aa2 | 2 | 0) == 2;
              W3 = I3 & (_2 ^ 1);
              R3 = 1040 + (Ka2 << 2) | 0;
              S2 = 1040 + (Ja2 << 2) | 0;
              U2 = 976 + (Ka2 << 2) | 0;
              V2 = (Aa2 | 0) != 1;
              K2 = _2 & ((D3 | 0) != 0 & K2);
              J2 = b3 + 976 | 0;
              I3 = I3 ^ 1;
              e2 = v2;
              G3 = 0;
              L3 = 0;
              oa2 = T2(0);
              da2 = T2(0);
              while (1) {
                b: do
                  if (G3 >>> 0 < Ia2 >>> 0) {
                    C3 = c2[Ha2 >> 2] | 0;
                    s3 = 0;
                    A3 = T2(0);
                    z2 = T2(0);
                    w3 = T2(0);
                    v2 = T2(0);
                    r3 = 0;
                    q2 = 0;
                    t3 = G3;
                    while (1) {
                      B3 = c2[C3 + (t3 << 2) >> 2] | 0;
                      if ((c2[B3 + 36 >> 2] | 0) != 1 ? (c2[B3 + 940 >> 2] = L3, (c2[B3 + 24 >> 2] | 0) != 1) : 0) {
                        x3 = T2(Ud(B3, Ja2, Ea2));
                        X2 = c2[P2 >> 2] | 0;
                        f2 = T2(be(B3 + 380 + (X2 << 3) | 0, ua2));
                        y3 = T2(g[B3 + 504 >> 2]);
                        f2 = T2(eC(f2, y3));
                        f2 = T2(cC(T2(be(B3 + 364 + (X2 << 3) | 0, ua2)), f2));
                        if (_2 & (s3 | 0) != 0 & T2(x3 + T2(z2 + f2)) > e2) {
                          k2 = s3;
                          x3 = A3;
                          D3 = t3;
                          break b;
                        }
                        x3 = T2(x3 + f2);
                        f2 = T2(z2 + x3);
                        x3 = T2(A3 + x3);
                        if (De(B3) | 0) {
                          w3 = T2(w3 + T2(Ee(B3)));
                          v2 = T2(v2 - T2(y3 * T2(Fe(B3))));
                        }
                        if (q2 | 0) c2[q2 + 960 >> 2] = B3;
                        c2[B3 + 960 >> 2] = 0;
                        s3 = s3 + 1 | 0;
                        q2 = B3;
                        r3 = (r3 | 0) == 0 ? B3 : r3;
                      } else {
                        x3 = A3;
                        f2 = z2;
                      }
                      t3 = t3 + 1 | 0;
                      if (t3 >>> 0 < Ia2 >>> 0) {
                        A3 = x3;
                        z2 = f2;
                      } else {
                        k2 = s3;
                        D3 = t3;
                        break;
                      }
                    }
                  } else {
                    k2 = 0;
                    x3 = T2(0);
                    w3 = T2(0);
                    v2 = T2(0);
                    r3 = 0;
                    D3 = G3;
                  }
                while (0);
                X2 = w3 > T2(0) & w3 < T2(1);
                E3 = X2 ? T2(1) : w3;
                X2 = v2 > T2(0) & v2 < T2(1);
                A3 = X2 ? T2(1) : v2;
                do
                  if (!N2) {
                    if (!(x3 < ba2 & ((Sb(ba2) | 0) ^ 1))) {
                      if (!(x3 > ca2 & ((Sb(ca2) | 0) ^ 1))) {
                        if (!(a2[(c2[J2 >> 2] | 0) + 3 >> 0] | 0)) {
                          if (!(E3 == T2(0)) ? !(T2(Ee(b3)) == T2(0)) : 0) {
                            X2 = 53;
                            break;
                          }
                          e2 = x3;
                          X2 = 53;
                        } else X2 = 51;
                      } else {
                        e2 = ca2;
                        X2 = 51;
                      }
                    } else {
                      e2 = ba2;
                      X2 = 51;
                    }
                  } else X2 = 51;
                while (0);
                if ((X2 | 0) == 51) {
                  X2 = 0;
                  if (Sb(e2) | 0) X2 = 53;
                  else {
                    F3 = T2(e2 - x3);
                    H2 = e2;
                  }
                }
                if ((X2 | 0) == 53) {
                  X2 = 0;
                  if (x3 < T2(0)) {
                    F3 = T2(-x3);
                    H2 = e2;
                  } else {
                    F3 = T2(0);
                    H2 = e2;
                  }
                }
                if (!M2 ? (ia2 = (r3 | 0) == 0, !ia2) : 0) {
                  s3 = c2[P2 >> 2] | 0;
                  t3 = F3 < T2(0);
                  y3 = T2(F3 / A3);
                  B3 = F3 > T2(0);
                  z2 = T2(F3 / E3);
                  w3 = T2(0);
                  x3 = T2(0);
                  e2 = T2(0);
                  q2 = r3;
                  do {
                    f2 = T2(be(q2 + 380 + (s3 << 3) | 0, ua2));
                    v2 = T2(be(q2 + 364 + (s3 << 3) | 0, ua2));
                    v2 = T2(eC(f2, T2(cC(v2, T2(g[q2 + 504 >> 2])))));
                    if (t3) {
                      f2 = T2(v2 * T2(Fe(q2)));
                      if (f2 != T2(-0) ? (Ma2 = T2(v2 - T2(y3 * f2)), ja2 = T2(Ie(q2, Ja2, Ma2, H2, Ea2)), Ma2 != ja2) : 0) {
                        w3 = T2(w3 - T2(ja2 - v2));
                        e2 = T2(e2 + f2);
                      }
                    } else if ((B3 ? (ka2 = T2(Ee(q2)), ka2 != T2(0)) : 0) ? (Ma2 = T2(v2 + T2(z2 * ka2)), la2 = T2(Ie(q2, Ja2, Ma2, H2, Ea2)), Ma2 != la2) : 0) {
                      w3 = T2(w3 - T2(la2 - v2));
                      x3 = T2(x3 - ka2);
                    }
                    q2 = c2[q2 + 960 >> 2] | 0;
                  } while ((q2 | 0) != 0);
                  e2 = T2(A3 + e2);
                  v2 = T2(F3 + w3);
                  if (!ia2) {
                    y3 = T2(E3 + x3);
                    t3 = c2[P2 >> 2] | 0;
                    B3 = v2 < T2(0);
                    C3 = e2 == T2(0);
                    z2 = T2(v2 / e2);
                    s3 = v2 > T2(0);
                    y3 = T2(v2 / y3);
                    e2 = T2(0);
                    do {
                      Ma2 = T2(be(r3 + 380 + (t3 << 3) | 0, ua2));
                      w3 = T2(be(r3 + 364 + (t3 << 3) | 0, ua2));
                      w3 = T2(eC(Ma2, T2(cC(w3, T2(g[r3 + 504 >> 2])))));
                      if (B3) {
                        Ma2 = T2(w3 * T2(Fe(r3)));
                        v2 = T2(-Ma2);
                        if (Ma2 != T2(-0)) {
                          Ma2 = T2(z2 * v2);
                          v2 = T2(Ie(r3, Ja2, T2(w3 + (C3 ? v2 : Ma2)), H2, Ea2));
                        } else v2 = w3;
                      } else if (s3 ? (ma2 = T2(Ee(r3)), ma2 != T2(0)) : 0) v2 = T2(Ie(r3, Ja2, T2(w3 + T2(y3 * ma2)), H2, Ea2));
                      else v2 = w3;
                      e2 = T2(e2 - T2(v2 - w3));
                      x3 = T2(Ud(r3, Ja2, Ea2));
                      f2 = T2(Ud(r3, Ka2, Ea2));
                      v2 = T2(v2 + x3);
                      g[fa2 >> 2] = v2;
                      c2[ha2 >> 2] = 1;
                      w3 = T2(g[r3 + 396 >> 2]);
                      c: do
                        if (Sb(w3) | 0) {
                          q2 = Sb(qa2) | 0;
                          do
                            if (!q2) {
                              if (K2 | (ae(r3, Ka2, qa2) | 0 | I3)) break;
                              if ((Je(b3, r3) | 0) != 4) break;
                              if ((c2[(Ke(r3, Ka2) | 0) + 4 >> 2] | 0) == 3) break;
                              if ((c2[(Le(r3, Ka2) | 0) + 4 >> 2] | 0) == 3) break;
                              g[ea2 >> 2] = qa2;
                              c2[ga2 >> 2] = 1;
                              break c;
                            }
                          while (0);
                          if (ae(r3, Ka2, qa2) | 0) {
                            q2 = c2[r3 + 992 + (c2[U2 >> 2] << 2) >> 2] | 0;
                            Ma2 = T2(f2 + T2(be(q2, qa2)));
                            g[ea2 >> 2] = Ma2;
                            q2 = V2 & (c2[q2 + 4 >> 2] | 0) == 2;
                            c2[ga2 >> 2] = ((Sb(Ma2) | 0 | q2) ^ 1) & 1;
                            break;
                          } else {
                            g[ea2 >> 2] = qa2;
                            c2[ga2 >> 2] = q2 ? 0 : 2;
                            break;
                          }
                        } else {
                          Ma2 = T2(v2 - x3);
                          E3 = T2(Ma2 / w3);
                          Ma2 = T2(w3 * Ma2);
                          c2[ga2 >> 2] = 1;
                          g[ea2 >> 2] = T2(f2 + (Fa2 ? E3 : Ma2));
                        }
                      while (0);
                      Me(r3, Ja2, H2, Ea2, ha2, fa2);
                      Me(r3, Ka2, qa2, Ea2, ga2, ea2);
                      do
                        if (!(ae(r3, Ka2, qa2) | 0) ? (Je(b3, r3) | 0) == 4 : 0) {
                          if ((c2[(Ke(r3, Ka2) | 0) + 4 >> 2] | 0) == 3) {
                            q2 = 0;
                            break;
                          }
                          q2 = (c2[(Le(r3, Ka2) | 0) + 4 >> 2] | 0) != 3;
                        } else q2 = 0;
                      while (0);
                      Ma2 = T2(g[fa2 >> 2]);
                      E3 = T2(g[ea2 >> 2]);
                      Na2 = c2[ha2 >> 2] | 0;
                      Oa2 = c2[ga2 >> 2] | 0;
                      Td(r3, Fa2 ? Ma2 : E3, Fa2 ? E3 : Ma2, Ga2, Fa2 ? Na2 : Oa2, Fa2 ? Oa2 : Na2, Ea2, sa2, o3 & (q2 ^ 1), 3488, p2) | 0;
                      a2[Y2 >> 0] = a2[Y2 >> 0] | a2[r3 + 508 >> 0];
                      r3 = c2[r3 + 960 >> 2] | 0;
                    } while ((r3 | 0) != 0);
                  } else e2 = T2(0);
                } else e2 = T2(0);
                e2 = T2(F3 + e2);
                Oa2 = e2 < T2(0) & 1;
                a2[Y2 >> 0] = Oa2 | d[Y2 >> 0];
                if (O2 & e2 > T2(0)) {
                  q2 = c2[P2 >> 2] | 0;
                  if ((c2[b3 + 364 + (q2 << 3) + 4 >> 2] | 0) != 0 ? (na2 = T2(be(b3 + 364 + (q2 << 3) | 0, ua2)), na2 >= T2(0)) : 0) v2 = T2(cC(T2(0), T2(na2 - T2(H2 - e2))));
                  else v2 = T2(0);
                } else v2 = e2;
                B3 = G3 >>> 0 < D3 >>> 0;
                if (B3) {
                  t3 = c2[Ha2 >> 2] | 0;
                  s3 = G3;
                  q2 = 0;
                  do {
                    r3 = c2[t3 + (s3 << 2) >> 2] | 0;
                    if (!(c2[r3 + 24 >> 2] | 0)) {
                      q2 = ((c2[(Ke(r3, Ja2) | 0) + 4 >> 2] | 0) == 3 & 1) + q2 | 0;
                      q2 = q2 + ((c2[(Le(r3, Ja2) | 0) + 4 >> 2] | 0) == 3 & 1) | 0;
                    }
                    s3 = s3 + 1 | 0;
                  } while ((s3 | 0) != (D3 | 0));
                  if (q2) {
                    x3 = T2(0);
                    f2 = T2(0);
                  } else X2 = 101;
                } else X2 = 101;
                d: do
                  if ((X2 | 0) == 101) {
                    X2 = 0;
                    switch (Z2 | 0) {
                      case 1: {
                        q2 = 0;
                        x3 = T2(v2 * T2(0.5));
                        f2 = T2(0);
                        break d;
                      }
                      case 2: {
                        q2 = 0;
                        x3 = v2;
                        f2 = T2(0);
                        break d;
                      }
                      case 3: {
                        if (k2 >>> 0 <= 1) {
                          q2 = 0;
                          x3 = T2(0);
                          f2 = T2(0);
                          break d;
                        }
                        f2 = T2((k2 + -1 | 0) >>> 0);
                        q2 = 0;
                        x3 = T2(0);
                        f2 = T2(T2(cC(v2, T2(0))) / f2);
                        break d;
                      }
                      case 5: {
                        f2 = T2(v2 / T2((k2 + 1 | 0) >>> 0));
                        q2 = 0;
                        x3 = f2;
                        break d;
                      }
                      case 4: {
                        f2 = T2(v2 / T2(k2 >>> 0));
                        q2 = 0;
                        x3 = T2(f2 * T2(0.5));
                        break d;
                      }
                      default: {
                        q2 = 0;
                        x3 = T2(0);
                        f2 = T2(0);
                        break d;
                      }
                    }
                  }
                while (0);
                e2 = T2($2 + x3);
                if (B3) {
                  w3 = T2(v2 / T2(q2 | 0));
                  s3 = c2[Ha2 >> 2] | 0;
                  r3 = G3;
                  v2 = T2(0);
                  do {
                    q2 = c2[s3 + (r3 << 2) >> 2] | 0;
                    e: do
                      if ((c2[q2 + 36 >> 2] | 0) != 1) {
                        switch (c2[q2 + 24 >> 2] | 0) {
                          case 1: {
                            if (Ne(q2, Ja2) | 0) {
                              if (!o3) break e;
                              Ma2 = T2(Oe(q2, Ja2, H2));
                              Ma2 = T2(Ma2 + T2(se(b3, Ja2)));
                              Ma2 = T2(Ma2 + T2(me(q2, Ja2, Ea2)));
                              g[q2 + 400 + (c2[S2 >> 2] << 2) >> 2] = Ma2;
                              break e;
                            }
                            break;
                          }
                          case 0: {
                            Oa2 = (c2[(Ke(q2, Ja2) | 0) + 4 >> 2] | 0) == 3;
                            Ma2 = T2(w3 + e2);
                            e2 = Oa2 ? Ma2 : e2;
                            if (o3) {
                              Oa2 = q2 + 400 + (c2[S2 >> 2] << 2) | 0;
                              g[Oa2 >> 2] = T2(e2 + T2(g[Oa2 >> 2]));
                            }
                            Oa2 = (c2[(Le(q2, Ja2) | 0) + 4 >> 2] | 0) == 3;
                            Ma2 = T2(w3 + e2);
                            e2 = Oa2 ? Ma2 : e2;
                            if (M2) {
                              Ma2 = T2(f2 + T2(Ud(q2, Ja2, Ea2)));
                              v2 = qa2;
                              e2 = T2(e2 + T2(Ma2 + T2(g[q2 + 504 >> 2])));
                              break e;
                            } else {
                              e2 = T2(e2 + T2(f2 + T2(Pe(q2, Ja2, Ea2))));
                              v2 = T2(cC(v2, T2(Pe(q2, Ka2, Ea2))));
                              break e;
                            }
                          }
                          default: {
                          }
                        }
                        if (o3) {
                          Ma2 = T2(x3 + T2(se(b3, Ja2)));
                          Oa2 = q2 + 400 + (c2[S2 >> 2] << 2) | 0;
                          g[Oa2 >> 2] = T2(Ma2 + T2(g[Oa2 >> 2]));
                        }
                      }
                    while (0);
                    r3 = r3 + 1 | 0;
                  } while ((r3 | 0) != (D3 | 0));
                } else v2 = T2(0);
                f2 = T2(aa2 + e2);
                if (Q2) x3 = T2(T2(Ie(b3, Ka2, T2(za2 + v2), ya2, m2)) - za2);
                else x3 = qa2;
                w3 = T2(T2(Ie(b3, Ka2, T2(za2 + (W3 ? qa2 : v2)), ya2, m2)) - za2);
                if (B3 & o3) {
                  r3 = G3;
                  do {
                    s3 = c2[(c2[Ha2 >> 2] | 0) + (r3 << 2) >> 2] | 0;
                    do
                      if ((c2[s3 + 36 >> 2] | 0) != 1) {
                        if ((c2[s3 + 24 >> 2] | 0) == 1) {
                          if (Ne(s3, Ka2) | 0) {
                            Ma2 = T2(Oe(s3, Ka2, qa2));
                            Ma2 = T2(Ma2 + T2(se(b3, Ka2)));
                            Ma2 = T2(Ma2 + T2(me(s3, Ka2, Ea2)));
                            q2 = c2[R3 >> 2] | 0;
                            g[s3 + 400 + (q2 << 2) >> 2] = Ma2;
                            if (!(Sb(Ma2) | 0)) break;
                          } else q2 = c2[R3 >> 2] | 0;
                          Ma2 = T2(se(b3, Ka2));
                          g[s3 + 400 + (q2 << 2) >> 2] = T2(Ma2 + T2(me(s3, Ka2, Ea2)));
                          break;
                        }
                        q2 = Je(b3, s3) | 0;
                        do
                          if ((q2 | 0) == 4) {
                            if ((c2[(Ke(s3, Ka2) | 0) + 4 >> 2] | 0) == 3) {
                              X2 = 139;
                              break;
                            }
                            if ((c2[(Le(s3, Ka2) | 0) + 4 >> 2] | 0) == 3) {
                              X2 = 139;
                              break;
                            }
                            if (ae(s3, Ka2, qa2) | 0) {
                              e2 = u2;
                              break;
                            }
                            Na2 = c2[s3 + 908 + (c2[P2 >> 2] << 2) >> 2] | 0;
                            c2[ea2 >> 2] = Na2;
                            e2 = T2(g[s3 + 396 >> 2]);
                            Oa2 = Sb(e2) | 0;
                            v2 = (c2[j >> 2] = Na2, T2(g[j >> 2]));
                            if (Oa2) e2 = w3;
                            else {
                              F3 = T2(Ud(s3, Ka2, Ea2));
                              Ma2 = T2(v2 / e2);
                              e2 = T2(e2 * v2);
                              e2 = T2(F3 + (Fa2 ? Ma2 : e2));
                            }
                            g[fa2 >> 2] = e2;
                            g[ea2 >> 2] = T2(T2(Ud(s3, Ja2, Ea2)) + v2);
                            c2[ga2 >> 2] = 1;
                            c2[ha2 >> 2] = 1;
                            Me(s3, Ja2, H2, Ea2, ga2, ea2);
                            Me(s3, Ka2, qa2, Ea2, ha2, fa2);
                            e2 = T2(g[ea2 >> 2]);
                            F3 = T2(g[fa2 >> 2]);
                            Ma2 = Fa2 ? e2 : F3;
                            e2 = Fa2 ? F3 : e2;
                            Oa2 = ((Sb(Ma2) | 0) ^ 1) & 1;
                            Td(s3, Ma2, e2, Ga2, Oa2, ((Sb(e2) | 0) ^ 1) & 1, Ea2, sa2, 1, 3493, p2) | 0;
                            e2 = u2;
                          } else X2 = 139;
                        while (0);
                        f: do
                          if ((X2 | 0) == 139) {
                            X2 = 0;
                            e2 = T2(x3 - T2(Pe(s3, Ka2, Ea2)));
                            do
                              if ((c2[(Ke(s3, Ka2) | 0) + 4 >> 2] | 0) == 3) {
                                if ((c2[(Le(s3, Ka2) | 0) + 4 >> 2] | 0) != 3) break;
                                e2 = T2(u2 + T2(cC(T2(0), T2(e2 * T2(0.5)))));
                                break f;
                              }
                            while (0);
                            if ((c2[(Le(s3, Ka2) | 0) + 4 >> 2] | 0) == 3) {
                              e2 = u2;
                              break;
                            }
                            if ((c2[(Ke(s3, Ka2) | 0) + 4 >> 2] | 0) == 3) {
                              e2 = T2(u2 + T2(cC(T2(0), e2)));
                              break;
                            }
                            switch (q2 | 0) {
                              case 1: {
                                e2 = u2;
                                break f;
                              }
                              case 2: {
                                e2 = T2(u2 + T2(e2 * T2(0.5)));
                                break f;
                              }
                              default: {
                                e2 = T2(u2 + e2);
                                break f;
                              }
                            }
                          }
                        while (0);
                        Ma2 = T2(oa2 + e2);
                        Oa2 = s3 + 400 + (c2[R3 >> 2] << 2) | 0;
                        g[Oa2 >> 2] = T2(Ma2 + T2(g[Oa2 >> 2]));
                      }
                    while (0);
                    r3 = r3 + 1 | 0;
                  } while ((r3 | 0) != (D3 | 0));
                }
                oa2 = T2(oa2 + w3);
                da2 = T2(cC(da2, f2));
                k2 = L3 + 1 | 0;
                if (D3 >>> 0 >= Ia2 >>> 0) break;
                else {
                  e2 = H2;
                  G3 = D3;
                  L3 = k2;
                }
              }
              do
                if (o3) {
                  q2 = k2 >>> 0 > 1;
                  if (!q2 ? !(Qe(b3) | 0) : 0) break;
                  if (!(Sb(qa2) | 0)) {
                    e2 = T2(qa2 - oa2);
                    g: do
                      switch (c2[b3 + 12 >> 2] | 0) {
                        case 3: {
                          u2 = T2(u2 + e2);
                          z2 = T2(0);
                          break;
                        }
                        case 2: {
                          u2 = T2(u2 + T2(e2 * T2(0.5)));
                          z2 = T2(0);
                          break;
                        }
                        case 4: {
                          if (qa2 > oa2) z2 = T2(e2 / T2(k2 >>> 0));
                          else z2 = T2(0);
                          break;
                        }
                        case 7:
                          if (qa2 > oa2) {
                            u2 = T2(u2 + T2(e2 / T2(k2 << 1 >>> 0)));
                            z2 = T2(e2 / T2(k2 >>> 0));
                            z2 = q2 ? z2 : T2(0);
                            break g;
                          } else {
                            u2 = T2(u2 + T2(e2 * T2(0.5)));
                            z2 = T2(0);
                            break g;
                          }
                        case 6: {
                          z2 = T2(e2 / T2(L3 >>> 0));
                          z2 = qa2 > oa2 & q2 ? z2 : T2(0);
                          break;
                        }
                        default:
                          z2 = T2(0);
                      }
                    while (0);
                    if (k2 | 0) {
                      B3 = 1040 + (Ka2 << 2) | 0;
                      C3 = 976 + (Ka2 << 2) | 0;
                      t3 = 0;
                      r3 = 0;
                      while (1) {
                        h: do
                          if (r3 >>> 0 < Ia2 >>> 0) {
                            v2 = T2(0);
                            w3 = T2(0);
                            e2 = T2(0);
                            s3 = r3;
                            while (1) {
                              q2 = c2[(c2[Ha2 >> 2] | 0) + (s3 << 2) >> 2] | 0;
                              do
                                if ((c2[q2 + 36 >> 2] | 0) != 1 ? (c2[q2 + 24 >> 2] | 0) == 0 : 0) {
                                  if ((c2[q2 + 940 >> 2] | 0) != (t3 | 0)) break h;
                                  if (Re(q2, Ka2) | 0) {
                                    Ma2 = T2(g[q2 + 908 + (c2[C3 >> 2] << 2) >> 2]);
                                    e2 = T2(cC(e2, T2(Ma2 + T2(Ud(q2, Ka2, Ea2)))));
                                  }
                                  if ((Je(b3, q2) | 0) != 5) break;
                                  na2 = T2(Se(q2));
                                  na2 = T2(na2 + T2(me(q2, 0, Ea2)));
                                  Ma2 = T2(g[q2 + 912 >> 2]);
                                  Ma2 = T2(T2(Ma2 + T2(Ud(q2, 0, Ea2))) - na2);
                                  na2 = T2(cC(w3, na2));
                                  Ma2 = T2(cC(v2, Ma2));
                                  v2 = Ma2;
                                  w3 = na2;
                                  e2 = T2(cC(e2, T2(na2 + Ma2)));
                                }
                              while (0);
                              q2 = s3 + 1 | 0;
                              if (q2 >>> 0 < Ia2 >>> 0) s3 = q2;
                              else {
                                s3 = q2;
                                break;
                              }
                            }
                          } else {
                            w3 = T2(0);
                            e2 = T2(0);
                            s3 = r3;
                          }
                        while (0);
                        y3 = T2(z2 + e2);
                        f2 = u2;
                        u2 = T2(u2 + y3);
                        if (r3 >>> 0 < s3 >>> 0) {
                          x3 = T2(f2 + w3);
                          q2 = r3;
                          do {
                            r3 = c2[(c2[Ha2 >> 2] | 0) + (q2 << 2) >> 2] | 0;
                            i: do
                              if ((c2[r3 + 36 >> 2] | 0) != 1 ? (c2[r3 + 24 >> 2] | 0) == 0 : 0) switch (Je(b3, r3) | 0) {
                                case 1: {
                                  Ma2 = T2(f2 + T2(me(r3, Ka2, Ea2)));
                                  g[r3 + 400 + (c2[B3 >> 2] << 2) >> 2] = Ma2;
                                  break i;
                                }
                                case 3: {
                                  Ma2 = T2(T2(u2 - T2(ne(r3, Ka2, Ea2))) - T2(g[r3 + 908 + (c2[C3 >> 2] << 2) >> 2]));
                                  g[r3 + 400 + (c2[B3 >> 2] << 2) >> 2] = Ma2;
                                  break i;
                                }
                                case 2: {
                                  Ma2 = T2(f2 + T2(T2(y3 - T2(g[r3 + 908 + (c2[C3 >> 2] << 2) >> 2])) * T2(0.5)));
                                  g[r3 + 400 + (c2[B3 >> 2] << 2) >> 2] = Ma2;
                                  break i;
                                }
                                case 4: {
                                  Ma2 = T2(f2 + T2(me(r3, Ka2, Ea2)));
                                  g[r3 + 400 + (c2[B3 >> 2] << 2) >> 2] = Ma2;
                                  if (ae(r3, Ka2, qa2) | 0) break i;
                                  if (Fa2) {
                                    v2 = T2(g[r3 + 908 >> 2]);
                                    e2 = T2(v2 + T2(Ud(r3, Ja2, Ea2)));
                                    w3 = y3;
                                  } else {
                                    w3 = T2(g[r3 + 912 >> 2]);
                                    w3 = T2(w3 + T2(Ud(r3, Ka2, Ea2)));
                                    e2 = y3;
                                    v2 = T2(g[r3 + 908 >> 2]);
                                  }
                                  if (Ld(e2, v2) | 0 ? Ld(w3, T2(g[r3 + 912 >> 2])) | 0 : 0) break i;
                                  Td(r3, e2, w3, Ga2, 1, 1, Ea2, sa2, 1, 3501, p2) | 0;
                                  break i;
                                }
                                case 5: {
                                  g[r3 + 404 >> 2] = T2(T2(x3 - T2(Se(r3))) + T2(Oe(r3, 0, qa2)));
                                  break i;
                                }
                                default:
                                  break i;
                              }
                            while (0);
                            q2 = q2 + 1 | 0;
                          } while ((q2 | 0) != (s3 | 0));
                        }
                        t3 = t3 + 1 | 0;
                        if ((t3 | 0) == (k2 | 0)) break;
                        else r3 = s3;
                      }
                    }
                  }
                }
              while (0);
              g[b3 + 908 >> 2] = T2(Ie(b3, 2, ta2, m2, m2));
              g[b3 + 912 >> 2] = T2(Ie(b3, 0, ra2, n3, m2));
              if ((pa2 | 0) != 0 ? (wa2 = c2[b3 + 32 >> 2] | 0, xa2 = (pa2 | 0) == 2, !(xa2 & (wa2 | 0) != 2)) : 0) {
                if (xa2 & (wa2 | 0) == 2) {
                  e2 = T2(va2 + H2);
                  e2 = T2(cC(T2(eC(e2, T2(Te(b3, Ja2, da2, ua2)))), va2));
                  X2 = 198;
                }
              } else {
                e2 = T2(Ie(b3, Ja2, da2, ua2, m2));
                X2 = 198;
              }
              if ((X2 | 0) == 198) g[b3 + 908 + (c2[976 + (Ja2 << 2) >> 2] << 2) >> 2] = e2;
              if ((Aa2 | 0) != 0 ? (Ca2 = c2[b3 + 32 >> 2] | 0, Da2 = (Aa2 | 0) == 2, !(Da2 & (Ca2 | 0) != 2)) : 0) {
                if (Da2 & (Ca2 | 0) == 2) {
                  e2 = T2(za2 + qa2);
                  e2 = T2(cC(T2(eC(e2, T2(Te(b3, Ka2, T2(za2 + oa2), ya2)))), za2));
                  X2 = 204;
                }
              } else {
                e2 = T2(Ie(b3, Ka2, T2(za2 + oa2), ya2, m2));
                X2 = 204;
              }
              if ((X2 | 0) == 204) g[b3 + 908 + (c2[976 + (Ka2 << 2) >> 2] << 2) >> 2] = e2;
              if (o3) {
                if ((c2[Ba2 >> 2] | 0) == 2) {
                  r3 = 976 + (Ka2 << 2) | 0;
                  s3 = 1040 + (Ka2 << 2) | 0;
                  q2 = 0;
                  do {
                    t3 = ac(b3, q2) | 0;
                    if (!(c2[t3 + 24 >> 2] | 0)) {
                      Na2 = c2[r3 >> 2] | 0;
                      Ma2 = T2(g[b3 + 908 + (Na2 << 2) >> 2]);
                      Oa2 = t3 + 400 + (c2[s3 >> 2] << 2) | 0;
                      Ma2 = T2(Ma2 - T2(g[Oa2 >> 2]));
                      g[Oa2 >> 2] = T2(Ma2 - T2(g[t3 + 908 + (Na2 << 2) >> 2]));
                    }
                    q2 = q2 + 1 | 0;
                  } while ((q2 | 0) != (Ia2 | 0));
                }
                if (h3 | 0) {
                  q2 = Fa2 ? pa2 : i4;
                  do {
                    Ue(b3, h3, Ea2, q2, sa2, Ga2, p2);
                    h3 = c2[h3 + 960 >> 2] | 0;
                  } while ((h3 | 0) != 0);
                }
                q2 = (Ja2 | 2 | 0) == 3;
                r3 = (Ka2 | 2 | 0) == 3;
                if (q2 | r3) {
                  h3 = 0;
                  do {
                    s3 = c2[(c2[Ha2 >> 2] | 0) + (h3 << 2) >> 2] | 0;
                    if ((c2[s3 + 36 >> 2] | 0) != 1) {
                      if (q2) Ve(b3, s3, Ja2);
                      if (r3) Ve(b3, s3, Ka2);
                    }
                    h3 = h3 + 1 | 0;
                  } while ((h3 | 0) != (Ia2 | 0));
                }
              }
            } else we(b3, e2, f2, i4, k2, m2, n3);
          while (0);
          l2 = La2;
          return;
        }
        function Zd(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          var c3 = 0;
          Vb(a3, b3 >= T2(0), 3147);
          c3 = b3 == T2(0);
          g[a3 + 4 >> 2] = c3 ? T2(0) : b3;
          return;
        }
        function _d(b3, d2, e2, f2) {
          b3 = b3 | 0;
          d2 = T2(d2);
          e2 = T2(e2);
          f2 = f2 | 0;
          var h3 = ib, i4 = ib, j2 = 0, k2 = 0, l3 = 0;
          c2[2278] = (c2[2278] | 0) + 1;
          $d(b3);
          if (!(ae(b3, 2, d2) | 0)) {
            h3 = T2(be(b3 + 380 | 0, d2));
            if (!(h3 >= T2(0))) {
              l3 = ((Sb(d2) | 0) ^ 1) & 1;
              h3 = d2;
            } else l3 = 2;
          } else {
            h3 = T2(be(c2[b3 + 992 >> 2] | 0, d2));
            l3 = 1;
            h3 = T2(h3 + T2(Ud(b3, 2, d2)));
          }
          if (!(ae(b3, 0, e2) | 0)) {
            i4 = T2(be(b3 + 388 | 0, e2));
            if (!(i4 >= T2(0))) {
              k2 = ((Sb(e2) | 0) ^ 1) & 1;
              i4 = e2;
            } else k2 = 2;
          } else {
            i4 = T2(be(c2[b3 + 996 >> 2] | 0, e2));
            k2 = 1;
            i4 = T2(i4 + T2(Ud(b3, 0, d2)));
          }
          j2 = b3 + 976 | 0;
          if (Td(b3, h3, i4, f2, l3, k2, d2, e2, 1, 3189, c2[j2 >> 2] | 0) | 0 ? (ce(b3, c2[b3 + 496 >> 2] | 0, d2, e2, d2), de(b3, T2(g[(c2[j2 >> 2] | 0) + 4 >> 2]), T2(0), T2(0)), a2[11696] | 0) : 0) Md(b3, 7);
          return;
        }
        function $d(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          h3 = i4 + 24 | 0;
          g2 = i4 + 16 | 0;
          e2 = i4 + 8 | 0;
          f2 = i4;
          d2 = 0;
          do {
            b3 = a3 + 380 + (d2 << 3) | 0;
            if (!((c2[a3 + 380 + (d2 << 3) + 4 >> 2] | 0) != 0 ? (j2 = b3, k2 = c2[j2 + 4 >> 2] | 0, m2 = e2, c2[m2 >> 2] = c2[j2 >> 2], c2[m2 + 4 >> 2] = k2, m2 = a3 + 364 + (d2 << 3) | 0, k2 = c2[m2 + 4 >> 2] | 0, j2 = f2, c2[j2 >> 2] = c2[m2 >> 2], c2[j2 + 4 >> 2] = k2, c2[g2 >> 2] = c2[e2 >> 2], c2[g2 + 4 >> 2] = c2[e2 + 4 >> 2], c2[h3 >> 2] = c2[f2 >> 2], c2[h3 + 4 >> 2] = c2[f2 + 4 >> 2], Kd(g2, h3) | 0) : 0)) b3 = a3 + 348 + (d2 << 3) | 0;
            c2[a3 + 992 + (d2 << 2) >> 2] = b3;
            d2 = d2 + 1 | 0;
          } while ((d2 | 0) != 2);
          l2 = i4;
          return;
        }
        function ae(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0;
          a3 = c2[a3 + 992 + (c2[976 + (b3 << 2) >> 2] << 2) >> 2] | 0;
          switch (c2[a3 + 4 >> 2] | 0) {
            case 0:
            case 3: {
              a3 = 0;
              break;
            }
            case 1: {
              if (T2(g[a3 >> 2]) < T2(0)) a3 = 0;
              else e2 = 5;
              break;
            }
            case 2: {
              if (T2(g[a3 >> 2]) < T2(0)) a3 = 0;
              else a3 = (Sb(d2) | 0) ^ 1;
              break;
            }
            default:
              e2 = 5;
          }
          if ((e2 | 0) == 5) a3 = 1;
          return a3 | 0;
        }
        function be(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          switch (c2[a3 + 4 >> 2] | 0) {
            case 2: {
              b3 = T2(T2(T2(g[a3 >> 2]) * b3) / T2(100));
              break;
            }
            case 1: {
              b3 = T2(g[a3 >> 2]);
              break;
            }
            default:
              b3 = T2(t2);
          }
          return T2(b3);
        }
        function ce(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          e2 = T2(e2);
          f2 = T2(f2);
          var h3 = 0, i4 = ib;
          b3 = c2[a3 + 944 >> 2] | 0 ? b3 : 1;
          h3 = re(c2[a3 + 4 >> 2] | 0, b3) | 0;
          b3 = ze(h3, b3) | 0;
          d2 = T2($e(a3, h3, d2));
          e2 = T2($e(a3, b3, e2));
          i4 = T2(d2 + T2(me(a3, h3, f2)));
          g[a3 + 400 + (c2[1040 + (h3 << 2) >> 2] << 2) >> 2] = i4;
          d2 = T2(d2 + T2(ne(a3, h3, f2)));
          g[a3 + 400 + (c2[1e3 + (h3 << 2) >> 2] << 2) >> 2] = d2;
          d2 = T2(e2 + T2(me(a3, b3, f2)));
          g[a3 + 400 + (c2[1040 + (b3 << 2) >> 2] << 2) >> 2] = d2;
          f2 = T2(e2 + T2(ne(a3, b3, f2)));
          g[a3 + 400 + (c2[1e3 + (b3 << 2) >> 2] << 2) >> 2] = f2;
          return;
        }
        function de(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = T2(b3);
          d2 = T2(d2);
          e2 = T2(e2);
          var f2 = 0, h3 = 0, i4 = ib, j2 = ib, k2 = 0, l3 = 0, m2 = ib, n3 = 0, o3 = ib, p2 = ib, q2 = ib, r3 = ib;
          if (!(b3 == T2(0))) {
            f2 = a3 + 400 | 0;
            r3 = T2(g[f2 >> 2]);
            h3 = a3 + 404 | 0;
            q2 = T2(g[h3 >> 2]);
            n3 = a3 + 416 | 0;
            p2 = T2(g[n3 >> 2]);
            l3 = a3 + 420 | 0;
            i4 = T2(g[l3 >> 2]);
            o3 = T2(r3 + d2);
            m2 = T2(q2 + e2);
            e2 = T2(o3 + p2);
            j2 = T2(m2 + i4);
            k2 = (c2[a3 + 988 >> 2] | 0) == 1;
            g[f2 >> 2] = T2(Od(r3, b3, 0, k2));
            g[h3 >> 2] = T2(Od(q2, b3, 0, k2));
            d2 = T2(gC(T2(p2 * b3), T2(1)));
            if (Ld(d2, T2(0)) | 0) h3 = 0;
            else h3 = (Ld(d2, T2(1)) | 0) ^ 1;
            d2 = T2(gC(T2(i4 * b3), T2(1)));
            if (Ld(d2, T2(0)) | 0) f2 = 0;
            else f2 = (Ld(d2, T2(1)) | 0) ^ 1;
            r3 = T2(Od(e2, b3, k2 & h3, k2 & (h3 ^ 1)));
            g[n3 >> 2] = T2(r3 - T2(Od(o3, b3, 0, k2)));
            r3 = T2(Od(j2, b3, k2 & f2, k2 & (f2 ^ 1)));
            g[l3 >> 2] = T2(r3 - T2(Od(m2, b3, 0, k2)));
            h3 = (c2[a3 + 952 >> 2] | 0) - (c2[a3 + 948 >> 2] | 0) >> 2;
            if (h3 | 0) {
              f2 = 0;
              do {
                de(ac(a3, f2) | 0, b3, o3, m2);
                f2 = f2 + 1 | 0;
              } while ((f2 | 0) != (h3 | 0));
            }
          }
          return;
        }
        function ee(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          switch (d2 | 0) {
            case 5:
            case 0: {
              a3 = CB(c2[489] | 0, e2, f2) | 0;
              break;
            }
            default:
              a3 = iC(e2, f2) | 0;
          }
          return a3 | 0;
        }
        function fe(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          g2 = f2;
          c2[g2 >> 2] = e2;
          ge(a3, 0, b3, d2, g2);
          l2 = f2;
          return;
        }
        function ge(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          a3 = a3 | 0 ? a3 : 956;
          Bb[c2[a3 + 8 >> 2] & 1](a3, b3, d2, e2, f2) | 0;
          if ((d2 | 0) == 5) Ta();
          else return;
        }
        function he(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          a2[b3 + c3 >> 0] = d2 & 1;
          return;
        }
        function ie(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          c2[a3 >> 2] = 0;
          c2[a3 + 4 >> 2] = 0;
          c2[a3 + 8 >> 2] = 0;
          d2 = b3 + 4 | 0;
          e2 = (c2[d2 >> 2] | 0) - (c2[b3 >> 2] | 0) >> 2;
          if (e2 | 0) {
            je(a3, e2);
            ke(a3, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0, e2);
          }
          return;
        }
        function je(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          if ((le(a3) | 0) >>> 0 < b3 >>> 0) jC(a3);
          if (b3 >>> 0 > 1073741823) Ta();
          else {
            d2 = qC(b3 << 2) | 0;
            c2[a3 + 4 >> 2] = d2;
            c2[a3 >> 2] = d2;
            c2[a3 + 8 >> 2] = d2 + (b3 << 2);
            return;
          }
        }
        function ke(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          e2 = a3 + 4 | 0;
          a3 = d2 - b3 | 0;
          if ((a3 | 0) > 0) {
            BC(c2[e2 >> 2] | 0, b3 | 0, a3 | 0) | 0;
            c2[e2 >> 2] = (c2[e2 >> 2] | 0) + (a3 >>> 2 << 2);
          }
          return;
        }
        function le(a3) {
          a3 = a3 | 0;
          return 1073741823;
        }
        function me(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          if (oe(b3) | 0 ? (c2[a3 + 96 >> 2] | 0) != 0 : 0) a3 = a3 + 92 | 0;
          else a3 = Tb(a3 + 60 | 0, c2[1040 + (b3 << 2) >> 2] | 0, 992) | 0;
          return T2(pe(a3, d2));
        }
        function ne(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          if (oe(b3) | 0 ? (c2[a3 + 104 >> 2] | 0) != 0 : 0) a3 = a3 + 100 | 0;
          else a3 = Tb(a3 + 60 | 0, c2[1e3 + (b3 << 2) >> 2] | 0, 992) | 0;
          return T2(pe(a3, d2));
        }
        function oe(a3) {
          a3 = a3 | 0;
          return (a3 | 1 | 0) == 3 | 0;
        }
        function pe(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          if ((c2[a3 + 4 >> 2] | 0) == 3) b3 = T2(0);
          else b3 = T2(be(a3, b3));
          return T2(b3);
        }
        function qe(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          a3 = c2[a3 >> 2] | 0;
          return ((a3 | 0) == 0 ? (b3 | 0) > 1 ? b3 : 1 : a3) | 0;
        }
        function re(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0;
          a: do
            if ((b3 | 0) == 2) {
              switch (a3 | 0) {
                case 2: {
                  a3 = 3;
                  break a;
                }
                case 3:
                  break;
                default: {
                  c3 = 4;
                  break a;
                }
              }
              a3 = 2;
            } else c3 = 4;
          while (0);
          return a3 | 0;
        }
        function se(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = ib;
          if (!((oe(b3) | 0 ? (c2[a3 + 312 >> 2] | 0) != 0 : 0) ? (d2 = T2(g[a3 + 308 >> 2]), d2 >= T2(0)) : 0)) d2 = T2(cC(T2(g[(Tb(a3 + 276 | 0, c2[1040 + (b3 << 2) >> 2] | 0, 992) | 0) >> 2]), T2(0)));
          return T2(d2);
        }
        function te(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = ib;
          if (!((oe(b3) | 0 ? (c2[a3 + 320 >> 2] | 0) != 0 : 0) ? (d2 = T2(g[a3 + 316 >> 2]), d2 >= T2(0)) : 0)) d2 = T2(cC(T2(g[(Tb(a3 + 276 | 0, c2[1e3 + (b3 << 2) >> 2] | 0, 992) | 0) >> 2]), T2(0)));
          return T2(d2);
        }
        function ue(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = ib;
          if (!((oe(b3) | 0 ? (c2[a3 + 240 >> 2] | 0) != 0 : 0) ? (e2 = T2(be(a3 + 236 | 0, d2)), e2 >= T2(0)) : 0)) e2 = T2(cC(T2(be(Tb(a3 + 204 | 0, c2[1040 + (b3 << 2) >> 2] | 0, 992) | 0, d2)), T2(0)));
          return T2(e2);
        }
        function ve(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = ib;
          if (!((oe(b3) | 0 ? (c2[a3 + 248 >> 2] | 0) != 0 : 0) ? (e2 = T2(be(a3 + 244 | 0, d2)), e2 >= T2(0)) : 0)) e2 = T2(cC(T2(be(Tb(a3 + 204 | 0, c2[1e3 + (b3 << 2) >> 2] | 0, 992) | 0, d2)), T2(0)));
          return T2(e2);
        }
        function we(a3, b3, d2, e2, f2, h3, i4) {
          a3 = a3 | 0;
          b3 = T2(b3);
          d2 = T2(d2);
          e2 = e2 | 0;
          f2 = f2 | 0;
          h3 = T2(h3);
          i4 = T2(i4);
          var j2 = ib, k2 = ib, m2 = ib, n3 = ib, o3 = ib, p2 = ib, q2 = 0, r3 = 0, s3 = 0;
          s3 = l2;
          l2 = l2 + 16 | 0;
          q2 = s3;
          r3 = a3 + 964 | 0;
          ec(a3, (c2[r3 >> 2] | 0) != 0, 3519);
          j2 = T2(Ce(a3, 2, b3));
          k2 = T2(Ce(a3, 0, b3));
          m2 = T2(Ud(a3, 2, b3));
          n3 = T2(Ud(a3, 0, b3));
          if (Sb(b3) | 0) o3 = b3;
          else o3 = T2(cC(T2(0), T2(T2(b3 - m2) - j2)));
          if (Sb(d2) | 0) p2 = d2;
          else p2 = T2(cC(T2(0), T2(T2(d2 - n3) - k2)));
          if ((e2 | 0) == 1 & (f2 | 0) == 1) {
            g[a3 + 908 >> 2] = T2(Ie(a3, 2, T2(b3 - m2), h3, h3));
            b3 = T2(Ie(a3, 0, T2(d2 - n3), i4, h3));
          } else {
            Db[c2[r3 >> 2] & 1](q2, a3, o3, e2, p2, f2);
            o3 = T2(j2 + T2(g[q2 >> 2]));
            p2 = T2(b3 - m2);
            g[a3 + 908 >> 2] = T2(Ie(a3, 2, (e2 | 2 | 0) == 2 ? o3 : p2, h3, h3));
            p2 = T2(k2 + T2(g[q2 + 4 >> 2]));
            b3 = T2(d2 - n3);
            b3 = T2(Ie(a3, 0, (f2 | 2 | 0) == 2 ? p2 : b3, i4, h3));
          }
          g[a3 + 912 >> 2] = b3;
          l2 = s3;
          return;
        }
        function xe(a3, b3, c3, d2, e2, f2, h3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = T2(c3);
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = T2(f2);
          h3 = T2(h3);
          var i4 = ib, j2 = ib, k2 = ib, l3 = ib;
          k2 = T2(Ce(a3, 2, f2));
          i4 = T2(Ce(a3, 0, f2));
          l3 = T2(Ud(a3, 2, f2));
          j2 = T2(Ud(a3, 0, f2));
          b3 = T2(b3 - l3);
          g[a3 + 908 >> 2] = T2(Ie(a3, 2, (d2 | 2 | 0) == 2 ? k2 : b3, f2, f2));
          c3 = T2(c3 - j2);
          g[a3 + 912 >> 2] = T2(Ie(a3, 0, (e2 | 2 | 0) == 2 ? i4 : c3, h3, f2));
          return;
        }
        function ye(a3, b3, c3, d2, e2, f2, h3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = T2(c3);
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = T2(f2);
          h3 = T2(h3);
          var i4 = 0, j2 = ib, k2 = ib;
          i4 = (d2 | 0) == 2;
          if ((!(b3 <= T2(0) & i4) ? !(c3 <= T2(0) & (e2 | 0) == 2) : 0) ? !((d2 | 0) == 1 & (e2 | 0) == 1) : 0) a3 = 0;
          else {
            j2 = T2(Ud(a3, 0, f2));
            k2 = T2(Ud(a3, 2, f2));
            i4 = b3 < T2(0) & i4 | (Sb(b3) | 0);
            b3 = T2(b3 - k2);
            g[a3 + 908 >> 2] = T2(Ie(a3, 2, i4 ? T2(0) : b3, f2, f2));
            b3 = T2(c3 - j2);
            i4 = c3 < T2(0) & (e2 | 0) == 2 | (Sb(c3) | 0);
            g[a3 + 912 >> 2] = T2(Ie(a3, 0, i4 ? T2(0) : b3, h3, f2));
            a3 = 1;
          }
          return a3 | 0;
        }
        function ze(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (We(a3) | 0) a3 = re(2, b3) | 0;
          else a3 = 0;
          return a3 | 0;
        }
        function Ae(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          c3 = T2(ue(a3, b3, c3));
          return T2(c3 + T2(se(a3, b3)));
        }
        function Be(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          c3 = T2(ve(a3, b3, c3));
          return T2(c3 + T2(te(a3, b3)));
        }
        function Ce(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          var d2 = ib;
          d2 = T2(Ae(a3, b3, c3));
          return T2(d2 + T2(Be(a3, b3, c3)));
        }
        function De(a3) {
          a3 = a3 | 0;
          if (!(c2[a3 + 24 >> 2] | 0)) {
            if (T2(Ee(a3)) != T2(0)) a3 = 1;
            else a3 = T2(Fe(a3)) != T2(0);
          } else a3 = 0;
          return a3 | 0;
        }
        function Ee(a3) {
          a3 = a3 | 0;
          var b3 = ib;
          if (c2[a3 + 944 >> 2] | 0) {
            b3 = T2(g[a3 + 44 >> 2]);
            if (Sb(b3) | 0) {
              b3 = T2(g[a3 + 40 >> 2]);
              a3 = b3 > T2(0) & ((Sb(b3) | 0) ^ 1);
              return T2(a3 ? b3 : T2(0));
            }
          } else b3 = T2(0);
          return T2(b3);
        }
        function Fe(b3) {
          b3 = b3 | 0;
          var d2 = ib, e2 = 0, f2 = ib;
          do
            if (c2[b3 + 944 >> 2] | 0) {
              d2 = T2(g[b3 + 48 >> 2]);
              if (Sb(d2) | 0) {
                e2 = a2[(c2[b3 + 976 >> 2] | 0) + 2 >> 0] | 0;
                if (e2 << 24 >> 24 == 0 ? (f2 = T2(g[b3 + 40 >> 2]), f2 < T2(0) & ((Sb(f2) | 0) ^ 1)) : 0) {
                  d2 = T2(-f2);
                  break;
                }
                d2 = e2 << 24 >> 24 ? T2(1) : T2(0);
              }
            } else d2 = T2(0);
          while (0);
          return T2(d2);
        }
        function Ge(b3) {
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          yC(b3 + 400 | 0, 0, 540) | 0;
          a2[b3 + 985 >> 0] = 1;
          lc(b3);
          e2 = $b(b3) | 0;
          if (e2 | 0) {
            d2 = b3 + 948 | 0;
            b3 = 0;
            do {
              Ge(c2[(c2[d2 >> 2] | 0) + (b3 << 2) >> 2] | 0);
              b3 = b3 + 1 | 0;
            } while ((b3 | 0) != (e2 | 0));
          }
          return;
        }
        function He(a3, b3, d2, e2, f2, h3, i4, j2, k2, m2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          e2 = e2 | 0;
          f2 = T2(f2);
          h3 = T2(h3);
          i4 = T2(i4);
          j2 = j2 | 0;
          k2 = k2 | 0;
          m2 = m2 | 0;
          var n3 = 0, o3 = ib, p2 = 0, q2 = 0, r3 = ib, s3 = ib, u2 = 0, v2 = ib, w3 = 0, x3 = ib, y3 = 0, z2 = 0, A3 = 0, B3 = 0, C3 = 0, D3 = 0, E3 = 0, F3 = 0, G3 = 0, H2 = 0;
          G3 = l2;
          l2 = l2 + 16 | 0;
          A3 = G3 + 12 | 0;
          B3 = G3 + 8 | 0;
          C3 = G3 + 4 | 0;
          D3 = G3;
          F3 = re(c2[a3 + 4 >> 2] | 0, k2) | 0;
          y3 = oe(F3) | 0;
          o3 = T2(be(Xe(b3) | 0, y3 ? h3 : i4));
          z2 = ae(b3, 2, h3) | 0;
          E3 = ae(b3, 0, i4) | 0;
          do
            if (!(Sb(o3) | 0) ? !(Sb(y3 ? d2 : f2) | 0) : 0) {
              n3 = b3 + 504 | 0;
              if (!(Sb(T2(g[n3 >> 2])) | 0)) {
                if (!(Ye(c2[b3 + 976 >> 2] | 0, 0) | 0)) break;
                if ((c2[b3 + 500 >> 2] | 0) == (c2[2278] | 0)) break;
              }
              g[n3 >> 2] = T2(cC(o3, T2(Ce(b3, F3, h3))));
            } else p2 = 7;
          while (0);
          do
            if ((p2 | 0) == 7) {
              w3 = y3 ^ 1;
              if (!(w3 | z2 ^ 1)) {
                i4 = T2(be(c2[b3 + 992 >> 2] | 0, h3));
                g[b3 + 504 >> 2] = T2(cC(i4, T2(Ce(b3, 2, h3))));
                break;
              }
              if (!(y3 | E3 ^ 1)) {
                i4 = T2(be(c2[b3 + 996 >> 2] | 0, i4));
                g[b3 + 504 >> 2] = T2(cC(i4, T2(Ce(b3, 0, h3))));
                break;
              }
              g[A3 >> 2] = T2(t2);
              g[B3 >> 2] = T2(t2);
              c2[C3 >> 2] = 0;
              c2[D3 >> 2] = 0;
              v2 = T2(Ud(b3, 2, h3));
              x3 = T2(Ud(b3, 0, h3));
              if (z2) {
                r3 = T2(v2 + T2(be(c2[b3 + 992 >> 2] | 0, h3)));
                g[A3 >> 2] = r3;
                c2[C3 >> 2] = 1;
                q2 = 1;
              } else {
                q2 = 0;
                r3 = T2(t2);
              }
              if (E3) {
                o3 = T2(x3 + T2(be(c2[b3 + 996 >> 2] | 0, i4)));
                g[B3 >> 2] = o3;
                c2[D3 >> 2] = 1;
                n3 = 1;
              } else {
                n3 = 0;
                o3 = T2(t2);
              }
              p2 = c2[a3 + 32 >> 2] | 0;
              if (!(y3 & (p2 | 0) == 2)) {
                if (Sb(r3) | 0 ? !(Sb(d2) | 0) : 0) {
                  g[A3 >> 2] = d2;
                  c2[C3 >> 2] = 2;
                  q2 = 2;
                  r3 = d2;
                }
              } else p2 = 2;
              if ((!((p2 | 0) == 2 & w3) ? Sb(o3) | 0 : 0) ? !(Sb(f2) | 0) : 0) {
                g[B3 >> 2] = f2;
                c2[D3 >> 2] = 2;
                n3 = 2;
                o3 = f2;
              }
              s3 = T2(g[b3 + 396 >> 2]);
              u2 = Sb(s3) | 0;
              do
                if (!u2) {
                  if ((q2 | 0) == 1 & w3) {
                    g[B3 >> 2] = T2(T2(r3 - v2) / s3);
                    c2[D3 >> 2] = 1;
                    n3 = 1;
                    p2 = 1;
                    break;
                  }
                  if (y3 & (n3 | 0) == 1) {
                    g[A3 >> 2] = T2(s3 * T2(o3 - x3));
                    c2[C3 >> 2] = 1;
                    n3 = 1;
                    p2 = 1;
                  } else p2 = q2;
                } else p2 = q2;
              while (0);
              H2 = Sb(d2) | 0;
              q2 = (Je(a3, b3) | 0) != 4;
              if (!(y3 | z2 | ((e2 | 0) != 1 | H2) | (q2 | (p2 | 0) == 1)) ? (g[A3 >> 2] = d2, c2[C3 >> 2] = 1, !u2) : 0) {
                g[B3 >> 2] = T2(T2(d2 - v2) / s3);
                c2[D3 >> 2] = 1;
                n3 = 1;
              }
              if (!(E3 | w3 | ((j2 | 0) != 1 | (Sb(f2) | 0)) | (q2 | (n3 | 0) == 1)) ? (g[B3 >> 2] = f2, c2[D3 >> 2] = 1, !u2) : 0) {
                g[A3 >> 2] = T2(s3 * T2(f2 - x3));
                c2[C3 >> 2] = 1;
              }
              Me(b3, 2, h3, h3, C3, A3);
              Me(b3, 0, i4, h3, D3, B3);
              d2 = T2(g[A3 >> 2]);
              f2 = T2(g[B3 >> 2]);
              Td(b3, d2, f2, k2, c2[C3 >> 2] | 0, c2[D3 >> 2] | 0, h3, i4, 0, 3565, m2) | 0;
              i4 = T2(g[b3 + 908 + (c2[976 + (F3 << 2) >> 2] << 2) >> 2]);
              g[b3 + 504 >> 2] = T2(cC(i4, T2(Ce(b3, F3, h3))));
            }
          while (0);
          c2[b3 + 500 >> 2] = c2[2278];
          l2 = G3;
          return;
        }
        function Ie(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          d2 = T2(d2);
          e2 = T2(e2);
          d2 = T2(Te(a3, b3, c3, d2));
          return T2(cC(d2, T2(Ce(a3, b3, e2))));
        }
        function Je(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          b3 = b3 + 20 | 0;
          b3 = c2[((c2[b3 >> 2] | 0) == 0 ? a3 + 16 | 0 : b3) >> 2] | 0;
          if ((b3 | 0) == 5 ? We(c2[a3 + 4 >> 2] | 0) | 0 : 0) b3 = 1;
          return b3 | 0;
        }
        function Ke(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (oe(b3) | 0 ? (c2[a3 + 96 >> 2] | 0) != 0 : 0) b3 = 4;
          else b3 = c2[1040 + (b3 << 2) >> 2] | 0;
          return a3 + 60 + (b3 << 3) | 0;
        }
        function Le(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (oe(b3) | 0 ? (c2[a3 + 104 >> 2] | 0) != 0 : 0) b3 = 5;
          else b3 = c2[1e3 + (b3 << 2) >> 2] | 0;
          return a3 + 60 + (b3 << 3) | 0;
        }
        function Me(a3, b3, d2, e2, f2, h3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          e2 = T2(e2);
          f2 = f2 | 0;
          h3 = h3 | 0;
          d2 = T2(be(a3 + 380 + (c2[976 + (b3 << 2) >> 2] << 3) | 0, d2));
          d2 = T2(d2 + T2(Ud(a3, b3, e2)));
          switch (c2[f2 >> 2] | 0) {
            case 2:
            case 1: {
              f2 = Sb(d2) | 0;
              e2 = T2(g[h3 >> 2]);
              g[h3 >> 2] = f2 | e2 < d2 ? e2 : d2;
              break;
            }
            case 0: {
              if (!(Sb(d2) | 0)) {
                c2[f2 >> 2] = 2;
                g[h3 >> 2] = d2;
              }
              break;
            }
            default: {
            }
          }
          return;
        }
        function Ne(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          a3 = a3 + 132 | 0;
          if (oe(b3) | 0 ? (c2[(Tb(a3, 4, 948) | 0) + 4 >> 2] | 0) != 0 : 0) a3 = 1;
          else a3 = (c2[(Tb(a3, c2[1040 + (b3 << 2) >> 2] | 0, 948) | 0) + 4 >> 2] | 0) != 0;
          return a3 | 0;
        }
        function Oe(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0;
          a3 = a3 + 132 | 0;
          if (oe(b3) | 0 ? (e2 = Tb(a3, 4, 948) | 0, (c2[e2 + 4 >> 2] | 0) != 0) : 0) f2 = 4;
          else {
            e2 = Tb(a3, c2[1040 + (b3 << 2) >> 2] | 0, 948) | 0;
            if (!(c2[e2 + 4 >> 2] | 0)) d2 = T2(0);
            else f2 = 4;
          }
          if ((f2 | 0) == 4) d2 = T2(be(e2, d2));
          return T2(d2);
        }
        function Pe(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = ib;
          e2 = T2(g[a3 + 908 + (c2[976 + (b3 << 2) >> 2] << 2) >> 2]);
          e2 = T2(e2 + T2(me(a3, b3, d2)));
          return T2(e2 + T2(ne(a3, b3, d2)));
        }
        function Qe(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          a: do
            if (!(We(c2[a3 + 4 >> 2] | 0) | 0)) {
              if ((c2[a3 + 16 >> 2] | 0) != 5) {
                d2 = $b(a3) | 0;
                if (!d2) b3 = 0;
                else {
                  b3 = 0;
                  while (1) {
                    e2 = ac(a3, b3) | 0;
                    if ((c2[e2 + 24 >> 2] | 0) == 0 ? (c2[e2 + 20 >> 2] | 0) == 5 : 0) {
                      b3 = 1;
                      break a;
                    }
                    b3 = b3 + 1 | 0;
                    if (b3 >>> 0 >= d2 >>> 0) {
                      b3 = 0;
                      break;
                    }
                  }
                }
              } else b3 = 1;
            } else b3 = 0;
          while (0);
          return b3 | 0;
        }
        function Re(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = ib;
          d2 = T2(g[a3 + 908 + (c2[976 + (b3 << 2) >> 2] << 2) >> 2]);
          return d2 >= T2(0) & ((Sb(d2) | 0) ^ 1) | 0;
        }
        function Se(a3) {
          a3 = a3 | 0;
          var b3 = ib, d2 = 0, e2 = 0, f2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = ib;
          d2 = c2[a3 + 968 >> 2] | 0;
          if (!d2) {
            h3 = $b(a3) | 0;
            do
              if (h3 | 0) {
                d2 = 0;
                f2 = 0;
                while (1) {
                  e2 = ac(a3, f2) | 0;
                  if (c2[e2 + 940 >> 2] | 0) {
                    i4 = 8;
                    break;
                  }
                  if ((c2[e2 + 24 >> 2] | 0) != 1) {
                    j2 = (Je(a3, e2) | 0) == 5;
                    if (j2) {
                      d2 = e2;
                      break;
                    } else d2 = (d2 | 0) == 0 ? e2 : d2;
                  }
                  f2 = f2 + 1 | 0;
                  if (f2 >>> 0 >= h3 >>> 0) {
                    i4 = 8;
                    break;
                  }
                }
                if ((i4 | 0) == 8) {
                  if (!d2) break;
                }
                b3 = T2(Se(d2));
                return T2(b3 + T2(g[d2 + 404 >> 2]));
              }
            while (0);
            b3 = T2(g[a3 + 912 >> 2]);
          } else {
            k2 = T2(g[a3 + 908 >> 2]);
            b3 = T2(g[a3 + 912 >> 2]);
            b3 = T2(mb[d2 & 0](a3, k2, b3));
            ec(a3, (Sb(b3) | 0) ^ 1, 3573);
          }
          return T2(b3);
        }
        function Te(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          d2 = T2(d2);
          var e2 = ib, f2 = 0;
          if (!(We(b3) | 0)) {
            if (oe(b3) | 0) {
              b3 = 0;
              f2 = 3;
            } else {
              d2 = T2(t2);
              e2 = T2(t2);
            }
          } else {
            b3 = 1;
            f2 = 3;
          }
          if ((f2 | 0) == 3) {
            e2 = T2(be(a3 + 364 + (b3 << 3) | 0, d2));
            d2 = T2(be(a3 + 380 + (b3 << 3) | 0, d2));
          }
          f2 = d2 < c3 & (d2 >= T2(0) & ((Sb(d2) | 0) ^ 1));
          c3 = f2 ? d2 : c3;
          f2 = e2 >= T2(0) & ((Sb(e2) | 0) ^ 1) & c3 < e2;
          return T2(f2 ? e2 : c3);
        }
        function Ue(a3, b3, d2, e2, f2, h3, i4) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          e2 = e2 | 0;
          f2 = T2(f2);
          h3 = h3 | 0;
          i4 = i4 | 0;
          var j2 = ib, k2 = ib, l3 = 0, m2 = 0, n3 = ib, o3 = ib, p2 = ib, q2 = 0, r3 = 0, s3 = 0, u2 = 0, v2 = ib, w3 = 0;
          s3 = re(c2[a3 + 4 >> 2] | 0, h3) | 0;
          q2 = ze(s3, h3) | 0;
          r3 = oe(s3) | 0;
          n3 = T2(Ud(b3, 2, d2));
          o3 = T2(Ud(b3, 0, d2));
          if (!(ae(b3, 2, d2) | 0)) {
            if (Ne(b3, 2) | 0 ? Ze(b3, 2) | 0 : 0) {
              j2 = T2(g[a3 + 908 >> 2]);
              k2 = T2(se(a3, 2));
              k2 = T2(j2 - T2(k2 + T2(te(a3, 2))));
              j2 = T2(Oe(b3, 2, d2));
              j2 = T2(Ie(b3, 2, T2(k2 - T2(j2 + T2(_e(b3, 2, d2)))), d2, d2));
            } else j2 = T2(t2);
          } else j2 = T2(n3 + T2(be(c2[b3 + 992 >> 2] | 0, d2)));
          if (!(ae(b3, 0, f2) | 0)) {
            if (Ne(b3, 0) | 0 ? Ze(b3, 0) | 0 : 0) {
              k2 = T2(g[a3 + 912 >> 2]);
              v2 = T2(se(a3, 0));
              v2 = T2(k2 - T2(v2 + T2(te(a3, 0))));
              k2 = T2(Oe(b3, 0, f2));
              k2 = T2(Ie(b3, 0, T2(v2 - T2(k2 + T2(_e(b3, 0, f2)))), f2, d2));
            } else k2 = T2(t2);
          } else k2 = T2(o3 + T2(be(c2[b3 + 996 >> 2] | 0, f2)));
          l3 = Sb(j2) | 0;
          m2 = Sb(k2) | 0;
          do
            if (l3 ^ m2 ? (p2 = T2(g[b3 + 396 >> 2]), !(Sb(p2) | 0)) : 0) if (l3) {
              j2 = T2(n3 + T2(T2(k2 - o3) * p2));
              break;
            } else {
              v2 = T2(o3 + T2(T2(j2 - n3) / p2));
              k2 = m2 ? v2 : k2;
              break;
            }
          while (0);
          m2 = Sb(j2) | 0;
          l3 = Sb(k2) | 0;
          if (m2 | l3) {
            w3 = (m2 ^ 1) & 1;
            e2 = d2 > T2(0) & ((e2 | 0) != 0 & m2);
            j2 = r3 ? j2 : e2 ? d2 : j2;
            Td(b3, j2, k2, h3, r3 ? w3 : e2 ? 2 : w3, m2 & (l3 ^ 1) & 1, j2, k2, 0, 3623, i4) | 0;
            j2 = T2(g[b3 + 908 >> 2]);
            j2 = T2(j2 + T2(Ud(b3, 2, d2)));
            k2 = T2(g[b3 + 912 >> 2]);
            k2 = T2(k2 + T2(Ud(b3, 0, d2)));
          }
          Td(b3, j2, k2, h3, 1, 1, j2, k2, 1, 3635, i4) | 0;
          if (Ze(b3, s3) | 0 ? !(Ne(b3, s3) | 0) : 0) {
            w3 = c2[976 + (s3 << 2) >> 2] | 0;
            v2 = T2(g[a3 + 908 + (w3 << 2) >> 2]);
            v2 = T2(v2 - T2(g[b3 + 908 + (w3 << 2) >> 2]));
            v2 = T2(v2 - T2(te(a3, s3)));
            v2 = T2(v2 - T2(ne(b3, s3, d2)));
            v2 = T2(v2 - T2(_e(b3, s3, r3 ? d2 : f2)));
            g[b3 + 400 + (c2[1040 + (s3 << 2) >> 2] << 2) >> 2] = v2;
          } else u2 = 21;
          do
            if ((u2 | 0) == 21) {
              if (!(Ne(b3, s3) | 0) ? (c2[a3 + 8 >> 2] | 0) == 1 : 0) {
                w3 = c2[976 + (s3 << 2) >> 2] | 0;
                v2 = T2(g[a3 + 908 + (w3 << 2) >> 2]);
                v2 = T2(T2(v2 - T2(g[b3 + 908 + (w3 << 2) >> 2])) * T2(0.5));
                g[b3 + 400 + (c2[1040 + (s3 << 2) >> 2] << 2) >> 2] = v2;
                break;
              }
              if (!(Ne(b3, s3) | 0) ? (c2[a3 + 8 >> 2] | 0) == 2 : 0) {
                w3 = c2[976 + (s3 << 2) >> 2] | 0;
                v2 = T2(g[a3 + 908 + (w3 << 2) >> 2]);
                v2 = T2(v2 - T2(g[b3 + 908 + (w3 << 2) >> 2]));
                g[b3 + 400 + (c2[1040 + (s3 << 2) >> 2] << 2) >> 2] = v2;
              }
            }
          while (0);
          if (Ze(b3, q2) | 0 ? !(Ne(b3, q2) | 0) : 0) {
            w3 = c2[976 + (q2 << 2) >> 2] | 0;
            v2 = T2(g[a3 + 908 + (w3 << 2) >> 2]);
            v2 = T2(v2 - T2(g[b3 + 908 + (w3 << 2) >> 2]));
            v2 = T2(v2 - T2(te(a3, q2)));
            v2 = T2(v2 - T2(ne(b3, q2, d2)));
            v2 = T2(v2 - T2(_e(b3, q2, r3 ? f2 : d2)));
            g[b3 + 400 + (c2[1040 + (q2 << 2) >> 2] << 2) >> 2] = v2;
          } else u2 = 30;
          do
            if ((u2 | 0) == 30 ? !(Ne(b3, q2) | 0) : 0) {
              if ((Je(a3, b3) | 0) == 2) {
                w3 = c2[976 + (q2 << 2) >> 2] | 0;
                v2 = T2(g[a3 + 908 + (w3 << 2) >> 2]);
                v2 = T2(T2(v2 - T2(g[b3 + 908 + (w3 << 2) >> 2])) * T2(0.5));
                g[b3 + 400 + (c2[1040 + (q2 << 2) >> 2] << 2) >> 2] = v2;
                break;
              }
              w3 = (Je(a3, b3) | 0) == 3;
              if (w3 ^ (c2[a3 + 28 >> 2] | 0) == 2) {
                w3 = c2[976 + (q2 << 2) >> 2] | 0;
                v2 = T2(g[a3 + 908 + (w3 << 2) >> 2]);
                v2 = T2(v2 - T2(g[b3 + 908 + (w3 << 2) >> 2]));
                g[b3 + 400 + (c2[1040 + (q2 << 2) >> 2] << 2) >> 2] = v2;
              }
            }
          while (0);
          return;
        }
        function Ve(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = ib, f2 = 0;
          f2 = c2[976 + (d2 << 2) >> 2] | 0;
          e2 = T2(g[b3 + 908 + (f2 << 2) >> 2]);
          e2 = T2(T2(g[a3 + 908 + (f2 << 2) >> 2]) - e2);
          e2 = T2(e2 - T2(g[b3 + 400 + (c2[1040 + (d2 << 2) >> 2] << 2) >> 2]));
          g[b3 + 400 + (c2[1e3 + (d2 << 2) >> 2] << 2) >> 2] = e2;
          return;
        }
        function We(a3) {
          a3 = a3 | 0;
          return (a3 | 1 | 0) == 1 | 0;
        }
        function Xe(b3) {
          b3 = b3 | 0;
          var d2 = ib;
          switch (c2[b3 + 56 >> 2] | 0) {
            case 0:
            case 3: {
              d2 = T2(g[b3 + 40 >> 2]);
              if (d2 > T2(0) & ((Sb(d2) | 0) ^ 1)) b3 = a2[(c2[b3 + 976 >> 2] | 0) + 2 >> 0] | 0 ? 1056 : 992;
              else b3 = 1056;
              break;
            }
            default:
              b3 = b3 + 52 | 0;
          }
          return b3 | 0;
        }
        function Ye(b3, c3) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          return (a2[b3 + c3 >> 0] | 0) != 0 | 0;
        }
        function Ze(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          a3 = a3 + 132 | 0;
          if (oe(b3) | 0 ? (c2[(Tb(a3, 5, 948) | 0) + 4 >> 2] | 0) != 0 : 0) a3 = 1;
          else a3 = (c2[(Tb(a3, c2[1e3 + (b3 << 2) >> 2] | 0, 948) | 0) + 4 >> 2] | 0) != 0;
          return a3 | 0;
        }
        function _e(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = T2(d2);
          var e2 = 0, f2 = 0;
          a3 = a3 + 132 | 0;
          if (oe(b3) | 0 ? (e2 = Tb(a3, 5, 948) | 0, (c2[e2 + 4 >> 2] | 0) != 0) : 0) f2 = 4;
          else {
            e2 = Tb(a3, c2[1e3 + (b3 << 2) >> 2] | 0, 948) | 0;
            if (!(c2[e2 + 4 >> 2] | 0)) d2 = T2(0);
            else f2 = 4;
          }
          if ((f2 | 0) == 4) d2 = T2(be(e2, d2));
          return T2(d2);
        }
        function $e(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          if (Ne(a3, b3) | 0) c3 = T2(Oe(a3, b3, c3));
          else c3 = T2(-T2(_e(a3, b3, c3)));
          return T2(c3);
        }
        function af(a3) {
          a3 = T2(a3);
          return (g[j >> 2] = a3, c2[j >> 2] | 0) | 0;
        }
        function bf(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 1073741823) Ta();
              else {
                f2 = qC(b3 << 2) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 2) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 2);
          return;
        }
        function cf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 2) << 2) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function df(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -4 - b3 | 0) >>> 2) << 2);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function ef(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          h3 = a3 + 4 | 0;
          i4 = c2[h3 >> 2] | 0;
          f2 = i4 - e2 | 0;
          g2 = f2 >> 2;
          a3 = b3 + (g2 << 2) | 0;
          if (a3 >>> 0 < d2 >>> 0) {
            e2 = i4;
            do {
              c2[e2 >> 2] = c2[a3 >> 2];
              a3 = a3 + 4 | 0;
              e2 = (c2[h3 >> 2] | 0) + 4 | 0;
              c2[h3 >> 2] = e2;
            } while (a3 >>> 0 < d2 >>> 0);
          }
          if (g2 | 0) GC(i4 + (0 - g2 << 2) | 0, b3 | 0, f2 | 0) | 0;
          return;
        }
        function ff(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = b3 + 4 | 0;
          j2 = c2[i4 >> 2] | 0;
          f2 = c2[a3 >> 2] | 0;
          h3 = d2;
          g2 = h3 - f2 | 0;
          e2 = j2 + (0 - (g2 >> 2) << 2) | 0;
          c2[i4 >> 2] = e2;
          if ((g2 | 0) > 0) BC(e2 | 0, f2 | 0, g2 | 0) | 0;
          f2 = a3 + 4 | 0;
          g2 = b3 + 8 | 0;
          e2 = (c2[f2 >> 2] | 0) - h3 | 0;
          if ((e2 | 0) > 0) {
            BC(c2[g2 >> 2] | 0, d2 | 0, e2 | 0) | 0;
            c2[g2 >> 2] = (c2[g2 >> 2] | 0) + (e2 >>> 2 << 2);
          }
          h3 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = c2[i4 >> 2];
          c2[i4 >> 2] = h3;
          h3 = c2[f2 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = h3;
          h3 = a3 + 8 | 0;
          d2 = b3 + 12 | 0;
          a3 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[d2 >> 2];
          c2[d2 >> 2] = a3;
          c2[b3 >> 2] = c2[i4 >> 2];
          return j2 | 0;
        }
        function gf(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          h3 = c2[b3 >> 2] | 0;
          g2 = c2[d2 >> 2] | 0;
          if ((h3 | 0) != (g2 | 0)) {
            f2 = a3 + 8 | 0;
            d2 = ((g2 + -4 - h3 | 0) >>> 2) + 1 | 0;
            a3 = h3;
            e2 = c2[f2 >> 2] | 0;
            do {
              c2[e2 >> 2] = c2[a3 >> 2];
              e2 = (c2[f2 >> 2] | 0) + 4 | 0;
              c2[f2 >> 2] = e2;
              a3 = a3 + 4 | 0;
            } while ((a3 | 0) != (g2 | 0));
            c2[b3 >> 2] = h3 + (d2 << 2);
          }
          return;
        }
        function hf() {
          Qb();
          return;
        }
        function jf() {
          var a3 = 0;
          a3 = qC(4) | 0;
          kf(a3);
          return a3 | 0;
        }
        function kf(a3) {
          a3 = a3 | 0;
          c2[a3 >> 2] = gc() | 0;
          return;
        }
        function lf(a3) {
          a3 = a3 | 0;
          if (a3 | 0) {
            mf(a3);
            sC(a3);
          }
          return;
        }
        function mf(a3) {
          a3 = a3 | 0;
          ic(c2[a3 >> 2] | 0);
          return;
        }
        function nf(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          he(c2[a3 >> 2] | 0, b3, d2);
          return;
        }
        function of(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          Zd(c2[a3 >> 2] | 0, b3);
          return;
        }
        function pf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Ye(c2[a3 >> 2] | 0, b3) | 0;
        }
        function qf() {
          var a3 = 0;
          a3 = qC(8) | 0;
          rf(a3, 0);
          return a3 | 0;
        }
        function rf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (!b3) b3 = Wb() | 0;
          else b3 = Ub(c2[b3 >> 2] | 0) | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = 0;
          vc(b3, a3);
          return;
        }
        function sf(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = qC(8) | 0;
          rf(b3, a3);
          return b3 | 0;
        }
        function tf(a3) {
          a3 = a3 | 0;
          if (a3 | 0) {
            uf(a3);
            sC(a3);
          }
          return;
        }
        function uf(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          Zb(c2[a3 >> 2] | 0);
          b3 = a3 + 4 | 0;
          a3 = c2[b3 >> 2] | 0;
          c2[b3 >> 2] = 0;
          if (a3 | 0) {
            vf(a3);
            sC(a3);
          }
          return;
        }
        function vf(a3) {
          a3 = a3 | 0;
          wf(a3);
          return;
        }
        function wf(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) ab(a3 | 0);
          return;
        }
        function xf(a3) {
          a3 = a3 | 0;
          return wc(a3) | 0;
        }
        function yf(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          d2 = a3 + 4 | 0;
          b3 = c2[d2 >> 2] | 0;
          c2[d2 >> 2] = 0;
          if (b3 | 0) {
            vf(b3);
            sC(b3);
          }
          dc(c2[a3 >> 2] | 0);
          return;
        }
        function zf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          sc(c2[a3 >> 2] | 0, c2[b3 >> 2] | 0);
          return;
        }
        function Af(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Hc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Bf(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          Vc(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function Cf(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          Wc(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function Df(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Bc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Ef(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Dc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Ff(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Fc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Gf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          xc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Hf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Jc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function If(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          zc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Jf(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          Yc(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function Kf(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          Zc(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function Lf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          $c(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Mf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Lc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Nf(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Nc(c2[a3 >> 2] | 0, b3);
          return;
        }
        function Of(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          Pc(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Pf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          Sc(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Qf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          Tc(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Rf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          Qc(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Sf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          Rc(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Tf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          fd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Uf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          gd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Vf(a3) {
          a3 = a3 | 0;
          hd(c2[a3 >> 2] | 0);
          return;
        }
        function Wf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          jd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Xf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          kd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function Yf(a3) {
          a3 = a3 | 0;
          ld(c2[a3 >> 2] | 0);
          return;
        }
        function Zf(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          nd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function _f(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          od(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function $f(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          qd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function ag(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          rd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function bg(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          td(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function cg(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          ud(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function dg(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          wd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function eg(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          xd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function fg(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          zd(c2[a3 >> 2] | 0, T2(b3));
          return;
        }
        function gg(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          dd(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function hg(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          ad(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function ig(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          bd(c2[a3 >> 2] | 0, b3, T2(d2));
          return;
        }
        function jg(a3) {
          a3 = a3 | 0;
          return Ic(c2[a3 >> 2] | 0) | 0;
        }
        function kg(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2;
          Xc(f2, c2[b3 >> 2] | 0, d2);
          lg(a3, f2);
          l2 = e2;
          return;
        }
        function lg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          mg(a3, c2[b3 + 4 >> 2] | 0, +T2(g[b3 >> 2]));
          return;
        }
        function mg(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          c2[a3 >> 2] = b3;
          h2[a3 + 8 >> 3] = d2;
          return;
        }
        function ng(a3) {
          a3 = a3 | 0;
          return Cc(c2[a3 >> 2] | 0) | 0;
        }
        function og(a3) {
          a3 = a3 | 0;
          return Ec(c2[a3 >> 2] | 0) | 0;
        }
        function pg(a3) {
          a3 = a3 | 0;
          return Gc(c2[a3 >> 2] | 0) | 0;
        }
        function qg(a3) {
          a3 = a3 | 0;
          return yc(c2[a3 >> 2] | 0) | 0;
        }
        function rg(a3) {
          a3 = a3 | 0;
          return Kc(c2[a3 >> 2] | 0) | 0;
        }
        function sg(a3) {
          a3 = a3 | 0;
          return Ac(c2[a3 >> 2] | 0) | 0;
        }
        function tg(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2;
          _c(f2, c2[b3 >> 2] | 0, d2);
          lg(a3, f2);
          l2 = e2;
          return;
        }
        function ug(a3) {
          a3 = a3 | 0;
          return Mc(c2[a3 >> 2] | 0) | 0;
        }
        function vg(a3) {
          a3 = a3 | 0;
          return Oc(c2[a3 >> 2] | 0) | 0;
        }
        function wg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          Uc(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function xg(a3) {
          a3 = a3 | 0;
          return + +T2(tc(c2[a3 >> 2] | 0));
        }
        function yg(a3) {
          a3 = a3 | 0;
          return + +T2(uc(c2[a3 >> 2] | 0));
        }
        function zg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          id(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function Ag(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          md(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function Bg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          pd(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function Cg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          sd(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function Dg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          vd(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function Eg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          yd(e2, c2[b3 >> 2] | 0);
          lg(a3, e2);
          l2 = d2;
          return;
        }
        function Fg(a3) {
          a3 = a3 | 0;
          return + +T2(Ad(c2[a3 >> 2] | 0));
        }
        function Gg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return + +T2(ed(c2[a3 >> 2] | 0, b3));
        }
        function Hg(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2;
          cd(f2, c2[b3 >> 2] | 0, d2);
          lg(a3, f2);
          l2 = e2;
          return;
        }
        function Ig(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          kc(c2[a3 >> 2] | 0, c2[b3 >> 2] | 0, d2);
          return;
        }
        function Jg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          cc(c2[a3 >> 2] | 0, c2[b3 >> 2] | 0);
          return;
        }
        function Kg(a3) {
          a3 = a3 | 0;
          return $b(c2[a3 >> 2] | 0) | 0;
        }
        function Lg(a3) {
          a3 = a3 | 0;
          a3 = pc(c2[a3 >> 2] | 0) | 0;
          if (!a3) a3 = 0;
          else a3 = xf(a3) | 0;
          return a3 | 0;
        }
        function Mg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          a3 = ac(c2[a3 >> 2] | 0, b3) | 0;
          if (!a3) a3 = 0;
          else a3 = xf(a3) | 0;
          return a3 | 0;
        }
        function Ng(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          e2 = qC(4) | 0;
          Og(e2, b3);
          d2 = a3 + 4 | 0;
          b3 = c2[d2 >> 2] | 0;
          c2[d2 >> 2] = e2;
          if (b3 | 0) {
            vf(b3);
            sC(b3);
          }
          jc(c2[a3 >> 2] | 0, 1);
          return;
        }
        function Og(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          gh(a3, b3);
          return;
        }
        function Pg(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          d2 = d2 | 0;
          e2 = T2(e2);
          f2 = f2 | 0;
          var i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          j2 = i4;
          Qg(j2, wc(b3) | 0, +c3, d2, +e2, f2);
          g[a3 >> 2] = T2(+h2[j2 >> 3]);
          g[a3 + 4 >> 2] = T2(+h2[j2 + 8 >> 3]);
          l2 = i4;
          return;
        }
        function Qg(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          e2 = e2 | 0;
          f2 = +f2;
          g2 = g2 | 0;
          var i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          n3 = i4 + 8 | 0;
          m2 = i4 + 20 | 0;
          k2 = i4;
          j2 = i4 + 16 | 0;
          h2[n3 >> 3] = d2;
          c2[m2 >> 2] = e2;
          h2[k2 >> 3] = f2;
          c2[j2 >> 2] = g2;
          Rg(a3, c2[b3 + 4 >> 2] | 0, n3, m2, k2, j2);
          l2 = i4;
          return;
        }
        function Rg(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          j2 = i4;
          UA(j2);
          b3 = Sg(b3) | 0;
          Tg(a3, b3, +h2[d2 >> 3], c2[e2 >> 2] | 0, +h2[f2 >> 3], c2[g2 >> 2] | 0);
          WA(j2);
          l2 = i4;
          return;
        }
        function Sg(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function Tg(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          d2 = d2 | 0;
          e2 = +e2;
          f2 = f2 | 0;
          var g2 = 0;
          g2 = Vg(Ug() | 0) | 0;
          c3 = +Wg(c3);
          d2 = Xg(d2) | 0;
          e2 = +Wg(e2);
          Yg(a3, cb2(0, g2 | 0, b3 | 0, +c3, d2 | 0, +e2, Xg(f2) | 0) | 0);
          return;
        }
        function Ug() {
          var b3 = 0;
          if (!(a2[7608] | 0)) {
            dh(9120);
            b3 = 7608;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 9120;
        }
        function Vg(a3) {
          a3 = a3 | 0;
          return c2[a3 + 8 >> 2] | 0;
        }
        function Wg(a3) {
          a3 = +a3;
          return + +ch(a3);
        }
        function Xg(a3) {
          a3 = a3 | 0;
          return bh(a3) | 0;
        }
        function Yg(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          d2 = f2;
          e2 = b3;
          if (!(e2 & 1)) {
            c2[a3 >> 2] = c2[b3 >> 2];
            c2[a3 + 4 >> 2] = c2[b3 + 4 >> 2];
            c2[a3 + 8 >> 2] = c2[b3 + 8 >> 2];
            c2[a3 + 12 >> 2] = c2[b3 + 12 >> 2];
          } else {
            Zg(d2, 0);
            Ja(e2 | 0, d2 | 0) | 0;
            _g(a3, d2);
            $g(d2);
          }
          l2 = f2;
          return;
        }
        function Zg(b3, d2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          ah(b3, d2);
          c2[b3 + 8 >> 2] = 0;
          a2[b3 + 24 >> 0] = 0;
          return;
        }
        function _g(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          b3 = b3 + 8 | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = c2[b3 + 4 >> 2];
          c2[a3 + 8 >> 2] = c2[b3 + 8 >> 2];
          c2[a3 + 12 >> 2] = c2[b3 + 12 >> 2];
          return;
        }
        function $g(b3) {
          b3 = b3 | 0;
          a2[b3 + 24 >> 0] = 0;
          return;
        }
        function ah(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = b3;
          return;
        }
        function bh(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function ch(a3) {
          a3 = +a3;
          return +a3;
        }
        function dh(a3) {
          a3 = a3 | 0;
          fh(a3, eh() | 0, 4);
          return;
        }
        function eh() {
          return 1064;
        }
        function fh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          c2[a3 + 8 >> 2] = _a2(b3 | 0, d2 + 1 | 0) | 0;
          return;
        }
        function gh(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          b3 = c2[b3 >> 2] | 0;
          c2[a3 >> 2] = b3;
          Aa(b3 | 0);
          return;
        }
        function hh(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          d2 = a3 + 4 | 0;
          b3 = c2[d2 >> 2] | 0;
          c2[d2 >> 2] = 0;
          if (b3 | 0) {
            vf(b3);
            sC(b3);
          }
          jc(c2[a3 >> 2] | 0, 0);
          return;
        }
        function ih(a3) {
          a3 = a3 | 0;
          qc(c2[a3 >> 2] | 0);
          return;
        }
        function jh(a3) {
          a3 = a3 | 0;
          return rc(c2[a3 >> 2] | 0) | 0;
        }
        function kh(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = +b3;
          d2 = +d2;
          e2 = e2 | 0;
          _d(c2[a3 >> 2] | 0, T2(b3), T2(d2), e2);
          return;
        }
        function lh(a3) {
          a3 = a3 | 0;
          return + +T2(Bd(c2[a3 >> 2] | 0));
        }
        function mh(a3) {
          a3 = a3 | 0;
          return + +T2(Dd(c2[a3 >> 2] | 0));
        }
        function nh(a3) {
          a3 = a3 | 0;
          return + +T2(Cd(c2[a3 >> 2] | 0));
        }
        function oh(a3) {
          a3 = a3 | 0;
          return + +T2(Ed(c2[a3 >> 2] | 0));
        }
        function ph(a3) {
          a3 = a3 | 0;
          return + +T2(Fd(c2[a3 >> 2] | 0));
        }
        function qh(a3) {
          a3 = a3 | 0;
          return + +T2(Gd(c2[a3 >> 2] | 0));
        }
        function rh(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          h2[a3 >> 3] = +T2(Bd(c2[b3 >> 2] | 0));
          h2[a3 + 8 >> 3] = +T2(Dd(c2[b3 >> 2] | 0));
          h2[a3 + 16 >> 3] = +T2(Cd(c2[b3 >> 2] | 0));
          h2[a3 + 24 >> 3] = +T2(Ed(c2[b3 >> 2] | 0));
          h2[a3 + 32 >> 3] = +T2(Fd(c2[b3 >> 2] | 0));
          h2[a3 + 40 >> 3] = +T2(Gd(c2[b3 >> 2] | 0));
          return;
        }
        function sh(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return + +T2(Hd(c2[a3 >> 2] | 0, b3));
        }
        function th(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return + +T2(Id(c2[a3 >> 2] | 0, b3));
        }
        function uh(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return + +T2(Jd(c2[a3 >> 2] | 0, b3));
        }
        function vh() {
          return fc() | 0;
        }
        function wh() {
          xh();
          yh();
          zh();
          Ah();
          Bh();
          Ch();
          return;
        }
        function xh() {
          kv(11713, 4938, 1);
          return;
        }
        function yh() {
          yu(10448);
          return;
        }
        function zh() {
          eu(10408);
          return;
        }
        function Ah() {
          vt(10324);
          return;
        }
        function Bh() {
          or(10096);
          return;
        }
        function Ch() {
          Dh(9132);
          return;
        }
        function Dh(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = 0, v2 = 0, w3 = 0, x3 = 0, y3 = 0, z2 = 0, A3 = 0, B3 = 0, C3 = 0, D3 = 0, E3 = 0, F3 = 0, G3 = 0, H2 = 0, I3 = 0, J2 = 0, K2 = 0, L3 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R3 = 0, S2 = 0, T3 = 0, U2 = 0, V2 = 0, W3 = 0, X2 = 0, Y2 = 0, Z2 = 0, _2 = 0, $2 = 0, aa2 = 0, ba2 = 0, ca2 = 0, da2 = 0, ea2 = 0, fa2 = 0, ga2 = 0, ha2 = 0, ia2 = 0, ja2 = 0, ka2 = 0, la2 = 0, ma2 = 0, na2 = 0, oa2 = 0, pa2 = 0, qa2 = 0, ra2 = 0, sa2 = 0, ta2 = 0, ua2 = 0, va2 = 0, wa2 = 0, xa2 = 0, ya2 = 0, za2 = 0, Aa2 = 0, Ba2 = 0, Ca2 = 0, Da2 = 0, Ea2 = 0, Fa2 = 0, Ga2 = 0;
          b3 = l2;
          l2 = l2 + 672 | 0;
          d2 = b3 + 656 | 0;
          Ga2 = b3 + 648 | 0;
          Fa2 = b3 + 640 | 0;
          Ea2 = b3 + 632 | 0;
          Da2 = b3 + 624 | 0;
          Ca2 = b3 + 616 | 0;
          Ba2 = b3 + 608 | 0;
          Aa2 = b3 + 600 | 0;
          za2 = b3 + 592 | 0;
          ya2 = b3 + 584 | 0;
          xa2 = b3 + 576 | 0;
          wa2 = b3 + 568 | 0;
          va2 = b3 + 560 | 0;
          ua2 = b3 + 552 | 0;
          ta2 = b3 + 544 | 0;
          sa2 = b3 + 536 | 0;
          ra2 = b3 + 528 | 0;
          qa2 = b3 + 520 | 0;
          pa2 = b3 + 512 | 0;
          oa2 = b3 + 504 | 0;
          na2 = b3 + 496 | 0;
          ma2 = b3 + 488 | 0;
          la2 = b3 + 480 | 0;
          ka2 = b3 + 472 | 0;
          ja2 = b3 + 464 | 0;
          ia2 = b3 + 456 | 0;
          ha2 = b3 + 448 | 0;
          ga2 = b3 + 440 | 0;
          fa2 = b3 + 432 | 0;
          ea2 = b3 + 424 | 0;
          da2 = b3 + 416 | 0;
          ca2 = b3 + 408 | 0;
          ba2 = b3 + 400 | 0;
          aa2 = b3 + 392 | 0;
          $2 = b3 + 384 | 0;
          _2 = b3 + 376 | 0;
          Z2 = b3 + 368 | 0;
          Y2 = b3 + 360 | 0;
          X2 = b3 + 352 | 0;
          W3 = b3 + 344 | 0;
          V2 = b3 + 336 | 0;
          U2 = b3 + 328 | 0;
          T3 = b3 + 320 | 0;
          S2 = b3 + 312 | 0;
          R3 = b3 + 304 | 0;
          Q2 = b3 + 296 | 0;
          P2 = b3 + 288 | 0;
          O2 = b3 + 280 | 0;
          N2 = b3 + 272 | 0;
          M2 = b3 + 264 | 0;
          L3 = b3 + 256 | 0;
          K2 = b3 + 248 | 0;
          J2 = b3 + 240 | 0;
          I3 = b3 + 232 | 0;
          H2 = b3 + 224 | 0;
          G3 = b3 + 216 | 0;
          F3 = b3 + 208 | 0;
          E3 = b3 + 200 | 0;
          D3 = b3 + 192 | 0;
          C3 = b3 + 184 | 0;
          B3 = b3 + 176 | 0;
          A3 = b3 + 168 | 0;
          z2 = b3 + 160 | 0;
          y3 = b3 + 152 | 0;
          x3 = b3 + 144 | 0;
          w3 = b3 + 136 | 0;
          v2 = b3 + 128 | 0;
          u2 = b3 + 120 | 0;
          t3 = b3 + 112 | 0;
          s3 = b3 + 104 | 0;
          r3 = b3 + 96 | 0;
          q2 = b3 + 88 | 0;
          p2 = b3 + 80 | 0;
          o3 = b3 + 72 | 0;
          n3 = b3 + 64 | 0;
          m2 = b3 + 56 | 0;
          k2 = b3 + 48 | 0;
          j2 = b3 + 40 | 0;
          i4 = b3 + 32 | 0;
          h3 = b3 + 24 | 0;
          g2 = b3 + 16 | 0;
          f2 = b3 + 8 | 0;
          e2 = b3;
          Eh(a3, 3646);
          Fh(a3, 3651, 2) | 0;
          Gh(a3, 3665, 2) | 0;
          Hh(a3, 3682, 18) | 0;
          c2[Ga2 >> 2] = 19;
          c2[Ga2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Ga2 >> 2];
          c2[d2 + 4 >> 2] = c2[Ga2 + 4 >> 2];
          Ih(a3, 3690, d2) | 0;
          c2[Fa2 >> 2] = 1;
          c2[Fa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Fa2 >> 2];
          c2[d2 + 4 >> 2] = c2[Fa2 + 4 >> 2];
          Jh(a3, 3696, d2) | 0;
          c2[Ea2 >> 2] = 2;
          c2[Ea2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Ea2 >> 2];
          c2[d2 + 4 >> 2] = c2[Ea2 + 4 >> 2];
          Kh(a3, 3706, d2) | 0;
          c2[Da2 >> 2] = 1;
          c2[Da2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Da2 >> 2];
          c2[d2 + 4 >> 2] = c2[Da2 + 4 >> 2];
          Lh(a3, 3722, d2) | 0;
          c2[Ca2 >> 2] = 2;
          c2[Ca2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Ca2 >> 2];
          c2[d2 + 4 >> 2] = c2[Ca2 + 4 >> 2];
          Lh(a3, 3734, d2) | 0;
          c2[Ba2 >> 2] = 3;
          c2[Ba2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Ba2 >> 2];
          c2[d2 + 4 >> 2] = c2[Ba2 + 4 >> 2];
          Kh(a3, 3753, d2) | 0;
          c2[Aa2 >> 2] = 4;
          c2[Aa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Aa2 >> 2];
          c2[d2 + 4 >> 2] = c2[Aa2 + 4 >> 2];
          Kh(a3, 3769, d2) | 0;
          c2[za2 >> 2] = 5;
          c2[za2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[za2 >> 2];
          c2[d2 + 4 >> 2] = c2[za2 + 4 >> 2];
          Kh(a3, 3783, d2) | 0;
          c2[ya2 >> 2] = 6;
          c2[ya2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ya2 >> 2];
          c2[d2 + 4 >> 2] = c2[ya2 + 4 >> 2];
          Kh(a3, 3796, d2) | 0;
          c2[xa2 >> 2] = 7;
          c2[xa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[xa2 >> 2];
          c2[d2 + 4 >> 2] = c2[xa2 + 4 >> 2];
          Kh(a3, 3813, d2) | 0;
          c2[wa2 >> 2] = 8;
          c2[wa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[wa2 >> 2];
          c2[d2 + 4 >> 2] = c2[wa2 + 4 >> 2];
          Kh(a3, 3825, d2) | 0;
          c2[va2 >> 2] = 3;
          c2[va2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[va2 >> 2];
          c2[d2 + 4 >> 2] = c2[va2 + 4 >> 2];
          Lh(a3, 3843, d2) | 0;
          c2[ua2 >> 2] = 4;
          c2[ua2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ua2 >> 2];
          c2[d2 + 4 >> 2] = c2[ua2 + 4 >> 2];
          Lh(a3, 3853, d2) | 0;
          c2[ta2 >> 2] = 9;
          c2[ta2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ta2 >> 2];
          c2[d2 + 4 >> 2] = c2[ta2 + 4 >> 2];
          Kh(a3, 3870, d2) | 0;
          c2[sa2 >> 2] = 10;
          c2[sa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[sa2 >> 2];
          c2[d2 + 4 >> 2] = c2[sa2 + 4 >> 2];
          Kh(a3, 3884, d2) | 0;
          c2[ra2 >> 2] = 11;
          c2[ra2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ra2 >> 2];
          c2[d2 + 4 >> 2] = c2[ra2 + 4 >> 2];
          Kh(a3, 3896, d2) | 0;
          c2[qa2 >> 2] = 1;
          c2[qa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[qa2 >> 2];
          c2[d2 + 4 >> 2] = c2[qa2 + 4 >> 2];
          Mh(a3, 3907, d2) | 0;
          c2[pa2 >> 2] = 2;
          c2[pa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[pa2 >> 2];
          c2[d2 + 4 >> 2] = c2[pa2 + 4 >> 2];
          Mh(a3, 3915, d2) | 0;
          c2[oa2 >> 2] = 3;
          c2[oa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[oa2 >> 2];
          c2[d2 + 4 >> 2] = c2[oa2 + 4 >> 2];
          Mh(a3, 3928, d2) | 0;
          c2[na2 >> 2] = 4;
          c2[na2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[na2 >> 2];
          c2[d2 + 4 >> 2] = c2[na2 + 4 >> 2];
          Mh(a3, 3948, d2) | 0;
          c2[ma2 >> 2] = 5;
          c2[ma2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ma2 >> 2];
          c2[d2 + 4 >> 2] = c2[ma2 + 4 >> 2];
          Mh(a3, 3960, d2) | 0;
          c2[la2 >> 2] = 6;
          c2[la2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[la2 >> 2];
          c2[d2 + 4 >> 2] = c2[la2 + 4 >> 2];
          Mh(a3, 3974, d2) | 0;
          c2[ka2 >> 2] = 7;
          c2[ka2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ka2 >> 2];
          c2[d2 + 4 >> 2] = c2[ka2 + 4 >> 2];
          Mh(a3, 3983, d2) | 0;
          c2[ja2 >> 2] = 20;
          c2[ja2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ja2 >> 2];
          c2[d2 + 4 >> 2] = c2[ja2 + 4 >> 2];
          Ih(a3, 3999, d2) | 0;
          c2[ia2 >> 2] = 8;
          c2[ia2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ia2 >> 2];
          c2[d2 + 4 >> 2] = c2[ia2 + 4 >> 2];
          Mh(a3, 4012, d2) | 0;
          c2[ha2 >> 2] = 9;
          c2[ha2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ha2 >> 2];
          c2[d2 + 4 >> 2] = c2[ha2 + 4 >> 2];
          Mh(a3, 4022, d2) | 0;
          c2[ga2 >> 2] = 21;
          c2[ga2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ga2 >> 2];
          c2[d2 + 4 >> 2] = c2[ga2 + 4 >> 2];
          Ih(a3, 4039, d2) | 0;
          c2[fa2 >> 2] = 10;
          c2[fa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[fa2 >> 2];
          c2[d2 + 4 >> 2] = c2[fa2 + 4 >> 2];
          Mh(a3, 4053, d2) | 0;
          c2[ea2 >> 2] = 11;
          c2[ea2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ea2 >> 2];
          c2[d2 + 4 >> 2] = c2[ea2 + 4 >> 2];
          Mh(a3, 4065, d2) | 0;
          c2[da2 >> 2] = 12;
          c2[da2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[da2 >> 2];
          c2[d2 + 4 >> 2] = c2[da2 + 4 >> 2];
          Mh(a3, 4084, d2) | 0;
          c2[ca2 >> 2] = 13;
          c2[ca2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ca2 >> 2];
          c2[d2 + 4 >> 2] = c2[ca2 + 4 >> 2];
          Mh(a3, 4097, d2) | 0;
          c2[ba2 >> 2] = 14;
          c2[ba2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[ba2 >> 2];
          c2[d2 + 4 >> 2] = c2[ba2 + 4 >> 2];
          Mh(a3, 4117, d2) | 0;
          c2[aa2 >> 2] = 15;
          c2[aa2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[aa2 >> 2];
          c2[d2 + 4 >> 2] = c2[aa2 + 4 >> 2];
          Mh(a3, 4129, d2) | 0;
          c2[$2 >> 2] = 16;
          c2[$2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[$2 >> 2];
          c2[d2 + 4 >> 2] = c2[$2 + 4 >> 2];
          Mh(a3, 4148, d2) | 0;
          c2[_2 >> 2] = 17;
          c2[_2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[_2 >> 2];
          c2[d2 + 4 >> 2] = c2[_2 + 4 >> 2];
          Mh(a3, 4161, d2) | 0;
          c2[Z2 >> 2] = 18;
          c2[Z2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Z2 >> 2];
          c2[d2 + 4 >> 2] = c2[Z2 + 4 >> 2];
          Mh(a3, 4181, d2) | 0;
          c2[Y2 >> 2] = 5;
          c2[Y2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Y2 >> 2];
          c2[d2 + 4 >> 2] = c2[Y2 + 4 >> 2];
          Lh(a3, 4196, d2) | 0;
          c2[X2 >> 2] = 6;
          c2[X2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[X2 >> 2];
          c2[d2 + 4 >> 2] = c2[X2 + 4 >> 2];
          Lh(a3, 4206, d2) | 0;
          c2[W3 >> 2] = 7;
          c2[W3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[W3 >> 2];
          c2[d2 + 4 >> 2] = c2[W3 + 4 >> 2];
          Lh(a3, 4217, d2) | 0;
          c2[V2 >> 2] = 3;
          c2[V2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[V2 >> 2];
          c2[d2 + 4 >> 2] = c2[V2 + 4 >> 2];
          Nh(a3, 4235, d2) | 0;
          c2[U2 >> 2] = 1;
          c2[U2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[U2 >> 2];
          c2[d2 + 4 >> 2] = c2[U2 + 4 >> 2];
          Oh(a3, 4251, d2) | 0;
          c2[T3 >> 2] = 4;
          c2[T3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[T3 >> 2];
          c2[d2 + 4 >> 2] = c2[T3 + 4 >> 2];
          Nh(a3, 4263, d2) | 0;
          c2[S2 >> 2] = 5;
          c2[S2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[S2 >> 2];
          c2[d2 + 4 >> 2] = c2[S2 + 4 >> 2];
          Nh(a3, 4279, d2) | 0;
          c2[R3 >> 2] = 6;
          c2[R3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[R3 >> 2];
          c2[d2 + 4 >> 2] = c2[R3 + 4 >> 2];
          Nh(a3, 4293, d2) | 0;
          c2[Q2 >> 2] = 7;
          c2[Q2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[Q2 >> 2];
          c2[d2 + 4 >> 2] = c2[Q2 + 4 >> 2];
          Nh(a3, 4306, d2) | 0;
          c2[P2 >> 2] = 8;
          c2[P2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[P2 >> 2];
          c2[d2 + 4 >> 2] = c2[P2 + 4 >> 2];
          Nh(a3, 4323, d2) | 0;
          c2[O2 >> 2] = 9;
          c2[O2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[O2 >> 2];
          c2[d2 + 4 >> 2] = c2[O2 + 4 >> 2];
          Nh(a3, 4335, d2) | 0;
          c2[N2 >> 2] = 2;
          c2[N2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[N2 >> 2];
          c2[d2 + 4 >> 2] = c2[N2 + 4 >> 2];
          Oh(a3, 4353, d2) | 0;
          c2[M2 >> 2] = 12;
          c2[M2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[M2 >> 2];
          c2[d2 + 4 >> 2] = c2[M2 + 4 >> 2];
          Ph(a3, 4363, d2) | 0;
          c2[L3 >> 2] = 1;
          c2[L3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[L3 >> 2];
          c2[d2 + 4 >> 2] = c2[L3 + 4 >> 2];
          Qh(a3, 4376, d2) | 0;
          c2[K2 >> 2] = 2;
          c2[K2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[K2 >> 2];
          c2[d2 + 4 >> 2] = c2[K2 + 4 >> 2];
          Qh(a3, 4388, d2) | 0;
          c2[J2 >> 2] = 13;
          c2[J2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[J2 >> 2];
          c2[d2 + 4 >> 2] = c2[J2 + 4 >> 2];
          Ph(a3, 4402, d2) | 0;
          c2[I3 >> 2] = 14;
          c2[I3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[I3 >> 2];
          c2[d2 + 4 >> 2] = c2[I3 + 4 >> 2];
          Ph(a3, 4411, d2) | 0;
          c2[H2 >> 2] = 15;
          c2[H2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[H2 >> 2];
          c2[d2 + 4 >> 2] = c2[H2 + 4 >> 2];
          Ph(a3, 4421, d2) | 0;
          c2[G3 >> 2] = 16;
          c2[G3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[G3 >> 2];
          c2[d2 + 4 >> 2] = c2[G3 + 4 >> 2];
          Ph(a3, 4433, d2) | 0;
          c2[F3 >> 2] = 17;
          c2[F3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[F3 >> 2];
          c2[d2 + 4 >> 2] = c2[F3 + 4 >> 2];
          Ph(a3, 4446, d2) | 0;
          c2[E3 >> 2] = 18;
          c2[E3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[E3 >> 2];
          c2[d2 + 4 >> 2] = c2[E3 + 4 >> 2];
          Ph(a3, 4458, d2) | 0;
          c2[D3 >> 2] = 3;
          c2[D3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[D3 >> 2];
          c2[d2 + 4 >> 2] = c2[D3 + 4 >> 2];
          Qh(a3, 4471, d2) | 0;
          c2[C3 >> 2] = 1;
          c2[C3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[C3 >> 2];
          c2[d2 + 4 >> 2] = c2[C3 + 4 >> 2];
          Rh(a3, 4486, d2) | 0;
          c2[B3 >> 2] = 10;
          c2[B3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[B3 >> 2];
          c2[d2 + 4 >> 2] = c2[B3 + 4 >> 2];
          Nh(a3, 4496, d2) | 0;
          c2[A3 >> 2] = 11;
          c2[A3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[A3 >> 2];
          c2[d2 + 4 >> 2] = c2[A3 + 4 >> 2];
          Nh(a3, 4508, d2) | 0;
          c2[z2 >> 2] = 3;
          c2[z2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[z2 >> 2];
          c2[d2 + 4 >> 2] = c2[z2 + 4 >> 2];
          Oh(a3, 4519, d2) | 0;
          c2[y3 >> 2] = 4;
          c2[y3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[y3 >> 2];
          c2[d2 + 4 >> 2] = c2[y3 + 4 >> 2];
          Sh(a3, 4530, d2) | 0;
          c2[x3 >> 2] = 19;
          c2[x3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[x3 >> 2];
          c2[d2 + 4 >> 2] = c2[x3 + 4 >> 2];
          Th(a3, 4542, d2) | 0;
          c2[w3 >> 2] = 12;
          c2[w3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[w3 >> 2];
          c2[d2 + 4 >> 2] = c2[w3 + 4 >> 2];
          Uh(a3, 4554, d2) | 0;
          c2[v2 >> 2] = 13;
          c2[v2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[v2 >> 2];
          c2[d2 + 4 >> 2] = c2[v2 + 4 >> 2];
          Vh(a3, 4568, d2) | 0;
          c2[u2 >> 2] = 2;
          c2[u2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[u2 >> 2];
          c2[d2 + 4 >> 2] = c2[u2 + 4 >> 2];
          Wh(a3, 4578, d2) | 0;
          c2[t3 >> 2] = 20;
          c2[t3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[t3 >> 2];
          c2[d2 + 4 >> 2] = c2[t3 + 4 >> 2];
          Xh(a3, 4587, d2) | 0;
          c2[s3 >> 2] = 22;
          c2[s3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[s3 >> 2];
          c2[d2 + 4 >> 2] = c2[s3 + 4 >> 2];
          Ih(a3, 4602, d2) | 0;
          c2[r3 >> 2] = 23;
          c2[r3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[r3 >> 2];
          c2[d2 + 4 >> 2] = c2[r3 + 4 >> 2];
          Ih(a3, 4619, d2) | 0;
          c2[q2 >> 2] = 14;
          c2[q2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[q2 >> 2];
          c2[d2 + 4 >> 2] = c2[q2 + 4 >> 2];
          Yh(a3, 4629, d2) | 0;
          c2[p2 >> 2] = 1;
          c2[p2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[p2 >> 2];
          c2[d2 + 4 >> 2] = c2[p2 + 4 >> 2];
          Zh(a3, 4637, d2) | 0;
          c2[o3 >> 2] = 4;
          c2[o3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[o3 >> 2];
          c2[d2 + 4 >> 2] = c2[o3 + 4 >> 2];
          Qh(a3, 4653, d2) | 0;
          c2[n3 >> 2] = 5;
          c2[n3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[n3 >> 2];
          c2[d2 + 4 >> 2] = c2[n3 + 4 >> 2];
          Qh(a3, 4669, d2) | 0;
          c2[m2 >> 2] = 6;
          c2[m2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[m2 >> 2];
          c2[d2 + 4 >> 2] = c2[m2 + 4 >> 2];
          Qh(a3, 4686, d2) | 0;
          c2[k2 >> 2] = 7;
          c2[k2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[k2 >> 2];
          c2[d2 + 4 >> 2] = c2[k2 + 4 >> 2];
          Qh(a3, 4701, d2) | 0;
          c2[j2 >> 2] = 8;
          c2[j2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[j2 >> 2];
          c2[d2 + 4 >> 2] = c2[j2 + 4 >> 2];
          Qh(a3, 4719, d2) | 0;
          c2[i4 >> 2] = 9;
          c2[i4 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[i4 >> 2];
          c2[d2 + 4 >> 2] = c2[i4 + 4 >> 2];
          Qh(a3, 4736, d2) | 0;
          c2[h3 >> 2] = 21;
          c2[h3 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[h3 >> 2];
          c2[d2 + 4 >> 2] = c2[h3 + 4 >> 2];
          _h(a3, 4754, d2) | 0;
          c2[g2 >> 2] = 2;
          c2[g2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[g2 >> 2];
          c2[d2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Rh(a3, 4772, d2) | 0;
          c2[f2 >> 2] = 3;
          c2[f2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[f2 >> 2];
          c2[d2 + 4 >> 2] = c2[f2 + 4 >> 2];
          Rh(a3, 4790, d2) | 0;
          c2[e2 >> 2] = 4;
          c2[e2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[e2 >> 2];
          c2[d2 + 4 >> 2] = c2[e2 + 4 >> 2];
          Rh(a3, 4808, d2) | 0;
          l2 = b3;
          return;
        }
        function Eh(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = dr() | 0;
          c2[a3 >> 2] = d2;
          er(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function Fh(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Oq(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function Gh(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          tq(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function Hh(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          cq(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function Ih(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Lp(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Jh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          pp(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Kh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Yo(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Lh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Fo(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Mh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          mo(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Nh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Un(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Oh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Bn(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Ph(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Um(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Qh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Bm(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Rh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          im(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Sh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Rl(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Th(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          vl(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Uh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          bl(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Vh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Kk(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Wh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          nk(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Xh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Rj(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Yh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          xj(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function Zh(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          _i(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function _h(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          $h(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function $h(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          bi(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function ai(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function bi(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = ci() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = di(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, ei(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function ci() {
          var b3 = 0, d2 = 0;
          if (!(a2[7616] | 0)) {
            qi(9136);
            Ha(24, 9136, o2 | 0) | 0;
            d2 = 7616;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9136) | 0)) {
            b3 = 9136;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            qi(9136);
          }
          return 9136;
        }
        function di(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function ei(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = ci() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            ki(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            li(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function fi(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          o3 = h3 + 24 | 0;
          n3 = h3 + 20 | 0;
          j2 = h3 + 16 | 0;
          m2 = h3 + 12 | 0;
          k2 = h3 + 8 | 0;
          i4 = h3 + 4 | 0;
          p2 = h3;
          c2[n3 >> 2] = b3;
          c2[j2 >> 2] = d2;
          c2[m2 >> 2] = e2;
          c2[k2 >> 2] = f2;
          c2[i4 >> 2] = g2;
          g2 = a3 + 28 | 0;
          c2[p2 >> 2] = c2[g2 >> 2];
          c2[o3 >> 2] = c2[p2 >> 2];
          gi(a3 + 24 | 0, o3, n3, m2, k2, j2, i4) | 0;
          c2[g2 >> 2] = c2[c2[g2 >> 2] >> 2];
          l2 = h3;
          return;
        }
        function gi(a3, b3, d2, e2, f2, g2, h3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          h3 = h3 | 0;
          a3 = hi(b3) | 0;
          b3 = qC(24) | 0;
          ii(b3 + 4 | 0, c2[d2 >> 2] | 0, c2[e2 >> 2] | 0, c2[f2 >> 2] | 0, c2[g2 >> 2] | 0, c2[h3 >> 2] | 0);
          c2[b3 >> 2] = c2[a3 >> 2];
          c2[a3 >> 2] = b3;
          return b3 | 0;
        }
        function hi(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function ii(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2;
          c2[a3 + 16 >> 2] = g2;
          return;
        }
        function ji(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return b3 | a3 | 0;
        }
        function ki(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function li(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = mi(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            ni(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            ki(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            oi(a3, i4);
            pi(i4);
            l2 = k2;
            return;
          }
        }
        function mi(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function ni(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function oi(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function pi(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function qi(a3) {
          a3 = a3 | 0;
          ui(a3);
          return;
        }
        function ri(a3) {
          a3 = a3 | 0;
          ti(a3 + 24 | 0);
          return;
        }
        function si(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function ti(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function ui(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 3, b3, wi() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function vi() {
          return 9228;
        }
        function wi() {
          return 1140;
        }
        function xi(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = zi(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          b3 = Ai(b3, e2) | 0;
          l2 = d2;
          return b3 | 0;
        }
        function yi(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2;
          c2[a3 + 16 >> 2] = g2;
          return;
        }
        function zi(a3) {
          a3 = a3 | 0;
          return (c2[(ci() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Ai(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 48 | 0;
          e2 = f2;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          ob[d2 & 31](e2, a3);
          e2 = Bi(e2) | 0;
          l2 = f2;
          return e2 | 0;
        }
        function Bi(a3) {
          a3 = a3 | 0;
          var b3 = 0, c3 = 0, d2 = 0, e2 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          b3 = e2 + 12 | 0;
          c3 = e2;
          d2 = Di(Ci() | 0) | 0;
          if (!d2) a3 = Ii(a3) | 0;
          else {
            Ei(b3, d2);
            Fi(c3, b3);
            Gi(a3, c3);
            a3 = Hi(b3) | 0;
          }
          l2 = e2;
          return a3 | 0;
        }
        function Ci() {
          var b3 = 0;
          if (!(a2[7632] | 0)) {
            Ti(9184);
            Ha(25, 9184, o2 | 0) | 0;
            b3 = 7632;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 9184;
        }
        function Di(a3) {
          a3 = a3 | 0;
          return c2[a3 + 36 >> 2] | 0;
        }
        function Ei(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = a3;
          c2[a3 + 8 >> 2] = 0;
          return;
        }
        function Fi(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = c2[b3 + 4 >> 2];
          c2[a3 + 8 >> 2] = 0;
          return;
        }
        function Gi(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Ni(b3, a3, a3 + 8 | 0, a3 + 16 | 0, a3 + 24 | 0, a3 + 32 | 0, a3 + 40 | 0) | 0;
          return;
        }
        function Hi(a3) {
          a3 = a3 | 0;
          return c2[(c2[a3 + 4 >> 2] | 0) + 8 >> 2] | 0;
        }
        function Ii(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          j2 = l2;
          l2 = l2 + 16 | 0;
          d2 = j2 + 4 | 0;
          e2 = j2;
          f2 = jy(8) | 0;
          g2 = f2;
          h3 = qC(48) | 0;
          i4 = h3;
          b3 = i4 + 48 | 0;
          do {
            c2[i4 >> 2] = c2[a3 >> 2];
            i4 = i4 + 4 | 0;
            a3 = a3 + 4 | 0;
          } while ((i4 | 0) < (b3 | 0));
          b3 = g2 + 4 | 0;
          c2[b3 >> 2] = h3;
          i4 = qC(8) | 0;
          h3 = c2[b3 >> 2] | 0;
          c2[e2 >> 2] = 0;
          c2[d2 >> 2] = c2[e2 >> 2];
          Ji(i4, h3, d2);
          c2[f2 >> 2] = i4;
          l2 = j2;
          return g2 | 0;
        }
        function Ji(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          d2 = qC(16) | 0;
          c2[d2 + 4 >> 2] = 0;
          c2[d2 + 8 >> 2] = 0;
          c2[d2 >> 2] = 1092;
          c2[d2 + 12 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Ki(a3) {
          a3 = a3 | 0;
          kC(a3);
          sC(a3);
          return;
        }
        function Li(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 12 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Mi(a3) {
          a3 = a3 | 0;
          sC(a3);
          return;
        }
        function Ni(a3, b3, d2, e2, f2, g2, h3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          h3 = h3 | 0;
          g2 = Oi(c2[a3 >> 2] | 0, b3, d2, e2, f2, g2, h3) | 0;
          h3 = a3 + 4 | 0;
          c2[(c2[h3 >> 2] | 0) + 8 >> 2] = g2;
          return c2[(c2[h3 >> 2] | 0) + 8 >> 2] | 0;
        }
        function Oi(a3, b3, c3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          j2 = i4;
          UA(j2);
          a3 = Sg(a3) | 0;
          g2 = Pi(a3, +h2[b3 >> 3], +h2[c3 >> 3], +h2[d2 >> 3], +h2[e2 >> 3], +h2[f2 >> 3], +h2[g2 >> 3]) | 0;
          WA(j2);
          l2 = i4;
          return g2 | 0;
        }
        function Pi(a3, b3, c3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          d2 = +d2;
          e2 = +e2;
          f2 = +f2;
          g2 = +g2;
          var h3 = 0;
          h3 = Vg(Qi() | 0) | 0;
          b3 = +Wg(b3);
          c3 = +Wg(c3);
          d2 = +Wg(d2);
          e2 = +Wg(e2);
          f2 = +Wg(f2);
          return ya(0, h3 | 0, a3 | 0, +b3, +c3, +d2, +e2, +f2, + +Wg(g2)) | 0;
        }
        function Qi() {
          var b3 = 0;
          if (!(a2[7624] | 0)) {
            Ri(9172);
            b3 = 7624;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 9172;
        }
        function Ri(a3) {
          a3 = a3 | 0;
          fh(a3, Si() | 0, 6);
          return;
        }
        function Si() {
          return 1112;
        }
        function Ti(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function Ui(a3) {
          a3 = a3 | 0;
          Vi(a3 + 24 | 0);
          Wi(a3 + 16 | 0);
          return;
        }
        function Vi(a3) {
          a3 = a3 | 0;
          Yi(a3);
          return;
        }
        function Wi(a3) {
          a3 = a3 | 0;
          Xi(a3);
          return;
        }
        function Xi(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          b3 = c2[a3 >> 2] | 0;
          if (b3 | 0) do {
            d2 = b3;
            b3 = c2[b3 >> 2] | 0;
            sC(d2);
          } while ((b3 | 0) != 0);
          c2[a3 >> 2] = 0;
          return;
        }
        function Yi(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          b3 = c2[a3 >> 2] | 0;
          if (b3 | 0) do {
            d2 = b3;
            b3 = c2[b3 >> 2] | 0;
            sC(d2);
          } while ((b3 | 0) != 0);
          c2[a3 >> 2] = 0;
          return;
        }
        function Zi(b3) {
          b3 = b3 | 0;
          var d2 = 0;
          c2[b3 + 16 >> 2] = 0;
          c2[b3 + 20 >> 2] = 0;
          d2 = b3 + 24 | 0;
          c2[d2 >> 2] = 0;
          c2[b3 + 28 >> 2] = d2;
          c2[b3 + 36 >> 2] = 0;
          a2[b3 + 40 >> 0] = 0;
          a2[b3 + 41 >> 0] = 0;
          return;
        }
        function _i(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          $i(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function $i(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = aj() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = bj(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, cj(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function aj() {
          var b3 = 0, d2 = 0;
          if (!(a2[7640] | 0)) {
            jj(9232);
            Ha(26, 9232, o2 | 0) | 0;
            d2 = 7640;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9232) | 0)) {
            b3 = 9232;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            jj(9232);
          }
          return 9232;
        }
        function bj(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function cj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = aj() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            dj(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            ej(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function dj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function ej(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = fj(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            gj(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            dj(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            hj(a3, i4);
            ij(i4);
            l2 = k2;
            return;
          }
        }
        function fj(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function gj(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function hj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function ij(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function jj(a3) {
          a3 = a3 | 0;
          mj(a3);
          return;
        }
        function kj(a3) {
          a3 = a3 | 0;
          lj(a3 + 24 | 0);
          return;
        }
        function lj(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function mj(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 1, b3, nj() | 0, 3);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function nj() {
          return 1144;
        }
        function oj(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          e2 = +e2;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          h3 = g2 + 8 | 0;
          i4 = g2;
          j2 = pj(a3) | 0;
          a3 = c2[j2 + 4 >> 2] | 0;
          c2[i4 >> 2] = c2[j2 >> 2];
          c2[i4 + 4 >> 2] = a3;
          c2[h3 >> 2] = c2[i4 >> 2];
          c2[h3 + 4 >> 2] = c2[i4 + 4 >> 2];
          qj(b3, h3, d2, e2, f2);
          l2 = g2;
          return;
        }
        function pj(a3) {
          a3 = a3 | 0;
          return (c2[(aj() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function qj(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          e2 = +e2;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0;
          k2 = l2;
          l2 = l2 + 16 | 0;
          h3 = k2 + 2 | 0;
          i4 = k2 + 1 | 0;
          j2 = k2;
          g2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) g2 = c2[(c2[a3 >> 2] | 0) + g2 >> 2] | 0;
          rj(h3, d2);
          d2 = +sj(h3, d2);
          rj(i4, e2);
          e2 = +sj(i4, e2);
          tj(j2, f2);
          j2 = uj(j2, f2) | 0;
          qb[g2 & 1](a3, d2, e2, j2);
          l2 = k2;
          return;
        }
        function rj(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          return;
        }
        function sj(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          return + +wj(b3);
        }
        function tj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function uj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return vj(b3) | 0;
        }
        function vj(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function wj(a3) {
          a3 = +a3;
          return +a3;
        }
        function xj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          yj(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function yj(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = zj() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Aj(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Bj(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function zj() {
          var b3 = 0, d2 = 0;
          if (!(a2[7648] | 0)) {
            Ij(9268);
            Ha(27, 9268, o2 | 0) | 0;
            d2 = 7648;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9268) | 0)) {
            b3 = 9268;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Ij(9268);
          }
          return 9268;
        }
        function Aj(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Bj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = zj() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Cj(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Dj(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Cj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Dj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Ej(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Fj(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Cj(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Gj(a3, i4);
            Hj(i4);
            l2 = k2;
            return;
          }
        }
        function Ej(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Fj(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Gj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Hj(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Ij(a3) {
          a3 = a3 | 0;
          Lj(a3);
          return;
        }
        function Jj(a3) {
          a3 = a3 | 0;
          Kj(a3 + 24 | 0);
          return;
        }
        function Kj(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Lj(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 4, b3, Mj() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Mj() {
          return 1160;
        }
        function Nj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = Oj(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          b3 = Pj(b3, e2) | 0;
          l2 = d2;
          return b3 | 0;
        }
        function Oj(a3) {
          a3 = a3 | 0;
          return (c2[(zj() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Pj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          return Qj(pb[d2 & 31](a3) | 0) | 0;
        }
        function Qj(a3) {
          a3 = a3 | 0;
          return a3 & 1 | 0;
        }
        function Rj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Sj(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Sj(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Tj() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Uj(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Vj(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Tj() {
          var b3 = 0, d2 = 0;
          if (!(a2[7656] | 0)) {
            ak(9304);
            Ha(28, 9304, o2 | 0) | 0;
            d2 = 7656;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9304) | 0)) {
            b3 = 9304;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            ak(9304);
          }
          return 9304;
        }
        function Uj(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Vj(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Tj() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Wj(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Xj(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Wj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Xj(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Yj(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Zj(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Wj(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            _j(a3, i4);
            $j(i4);
            l2 = k2;
            return;
          }
        }
        function Yj(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Zj(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function _j(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function $j(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function ak(a3) {
          a3 = a3 | 0;
          dk(a3);
          return;
        }
        function bk(a3) {
          a3 = a3 | 0;
          ck(a3 + 24 | 0);
          return;
        }
        function ck(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function dk(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 5, b3, ek() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function ek() {
          return 1164;
        }
        function fk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = gk(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          hk(b3, f2, d2);
          l2 = e2;
          return;
        }
        function gk(a3) {
          a3 = a3 | 0;
          return (c2[(Tj() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function hk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          ik(f2, d2);
          d2 = jk(f2, d2) | 0;
          ob[e2 & 31](a3, d2);
          kk(f2);
          l2 = g2;
          return;
        }
        function ik(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          lk(a3, b3);
          return;
        }
        function jk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return a3 | 0;
        }
        function kk(a3) {
          a3 = a3 | 0;
          vf(a3);
          return;
        }
        function lk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          mk(a3, b3);
          return;
        }
        function mk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = b3;
          return;
        }
        function nk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          ok(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function ok(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = pk() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = qk(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, rk(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function pk() {
          var b3 = 0, d2 = 0;
          if (!(a2[7664] | 0)) {
            yk(9340);
            Ha(29, 9340, o2 | 0) | 0;
            d2 = 7664;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9340) | 0)) {
            b3 = 9340;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            yk(9340);
          }
          return 9340;
        }
        function qk(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function rk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = pk() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            sk(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            tk(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function sk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function tk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = uk(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            vk(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            sk(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            wk(a3, i4);
            xk(i4);
            l2 = k2;
            return;
          }
        }
        function uk(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function vk(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function wk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function xk(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function yk(a3) {
          a3 = a3 | 0;
          Bk(a3);
          return;
        }
        function zk(a3) {
          a3 = a3 | 0;
          Ak(a3 + 24 | 0);
          return;
        }
        function Ak(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Bk(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 4, b3, Ck() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Ck() {
          return 1180;
        }
        function Dk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Ek(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          d2 = Fk(b3, f2, d2) | 0;
          l2 = e2;
          return d2 | 0;
        }
        function Ek(a3) {
          a3 = a3 | 0;
          return (c2[(pk() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Fk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          Gk(f2, d2);
          f2 = Hk(f2, d2) | 0;
          f2 = Ik(wb[e2 & 15](a3, f2) | 0) | 0;
          l2 = g2;
          return f2 | 0;
        }
        function Gk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function Hk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Jk(b3) | 0;
        }
        function Ik(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Jk(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Kk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Lk(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Lk(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Mk() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Nk(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Ok(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Mk() {
          var b3 = 0, d2 = 0;
          if (!(a2[7672] | 0)) {
            Vk(9376);
            Ha(30, 9376, o2 | 0) | 0;
            d2 = 7672;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9376) | 0)) {
            b3 = 9376;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Vk(9376);
          }
          return 9376;
        }
        function Nk(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Ok(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Mk() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Pk(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Qk(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Pk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Qk(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Rk(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Sk(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Pk(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Tk(a3, i4);
            Uk(i4);
            l2 = k2;
            return;
          }
        }
        function Rk(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Sk(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Tk(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Uk(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Vk(a3) {
          a3 = a3 | 0;
          Yk(a3);
          return;
        }
        function Wk(a3) {
          a3 = a3 | 0;
          Xk(a3 + 24 | 0);
          return;
        }
        function Xk(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Yk(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 5, b3, Zk() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Zk() {
          return 1196;
        }
        function _k(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = $k(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          b3 = al(b3, e2) | 0;
          l2 = d2;
          return b3 | 0;
        }
        function $k(a3) {
          a3 = a3 | 0;
          return (c2[(Mk() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function al(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          return Ik(pb[d2 & 31](a3) | 0) | 0;
        }
        function bl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          cl(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function cl(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = dl() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = el(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, fl(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function dl() {
          var b3 = 0, d2 = 0;
          if (!(a2[7680] | 0)) {
            ml(9412);
            Ha(31, 9412, o2 | 0) | 0;
            d2 = 7680;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9412) | 0)) {
            b3 = 9412;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            ml(9412);
          }
          return 9412;
        }
        function el(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function fl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = dl() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            gl(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            hl(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function gl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function hl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = il(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            jl(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            gl(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            kl(a3, i4);
            ll(i4);
            l2 = k2;
            return;
          }
        }
        function il(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function jl(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function kl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function ll(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function ml(a3) {
          a3 = a3 | 0;
          pl(a3);
          return;
        }
        function nl(a3) {
          a3 = a3 | 0;
          ol(a3 + 24 | 0);
          return;
        }
        function ol(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function pl(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 6, b3, ql() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function ql() {
          return 1200;
        }
        function rl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = sl(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          b3 = tl(b3, e2) | 0;
          l2 = d2;
          return b3 | 0;
        }
        function sl(a3) {
          a3 = a3 | 0;
          return (c2[(dl() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function tl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          return ul(pb[d2 & 31](a3) | 0) | 0;
        }
        function ul(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function vl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          wl(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function wl(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = xl() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = yl(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, zl(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function xl() {
          var b3 = 0, d2 = 0;
          if (!(a2[7688] | 0)) {
            Gl(9448);
            Ha(32, 9448, o2 | 0) | 0;
            d2 = 7688;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9448) | 0)) {
            b3 = 9448;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Gl(9448);
          }
          return 9448;
        }
        function yl(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function zl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = xl() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Al(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Bl(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Al(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Bl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Cl(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Dl(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Al(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            El(a3, i4);
            Fl(i4);
            l2 = k2;
            return;
          }
        }
        function Cl(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Dl(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function El(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Fl(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Gl(a3) {
          a3 = a3 | 0;
          Jl(a3);
          return;
        }
        function Hl(a3) {
          a3 = a3 | 0;
          Il(a3 + 24 | 0);
          return;
        }
        function Il(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Jl(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 6, b3, Kl() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Kl() {
          return 1204;
        }
        function Ll(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Ml(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Nl(b3, f2, d2);
          l2 = e2;
          return;
        }
        function Ml(a3) {
          a3 = a3 | 0;
          return (c2[(xl() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Nl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          Ol(f2, d2);
          f2 = Pl(f2, d2) | 0;
          ob[e2 & 31](a3, f2);
          l2 = g2;
          return;
        }
        function Ol(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function Pl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Ql(b3) | 0;
        }
        function Ql(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Rl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Sl(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Sl(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Tl() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Ul(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Vl(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Tl() {
          var b3 = 0, d2 = 0;
          if (!(a2[7696] | 0)) {
            am(9484);
            Ha(33, 9484, o2 | 0) | 0;
            d2 = 7696;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9484) | 0)) {
            b3 = 9484;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            am(9484);
          }
          return 9484;
        }
        function Ul(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Vl(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Tl() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Wl(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Xl(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Wl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Xl(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Yl(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Zl(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Wl(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            _l(a3, i4);
            $l(i4);
            l2 = k2;
            return;
          }
        }
        function Yl(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Zl(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function _l(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function $l(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function am(a3) {
          a3 = a3 | 0;
          dm(a3);
          return;
        }
        function bm(a3) {
          a3 = a3 | 0;
          cm(a3 + 24 | 0);
          return;
        }
        function cm(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function dm(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 1, b3, em() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function em() {
          return 1212;
        }
        function fm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          g2 = f2 + 8 | 0;
          h3 = f2;
          i4 = gm(a3) | 0;
          a3 = c2[i4 + 4 >> 2] | 0;
          c2[h3 >> 2] = c2[i4 >> 2];
          c2[h3 + 4 >> 2] = a3;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = c2[h3 + 4 >> 2];
          hm(b3, g2, d2, e2);
          l2 = f2;
          return;
        }
        function gm(a3) {
          a3 = a3 | 0;
          return (c2[(Tl() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function hm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          g2 = i4 + 1 | 0;
          h3 = i4;
          f2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) f2 = c2[(c2[a3 >> 2] | 0) + f2 >> 2] | 0;
          Ol(g2, d2);
          g2 = Pl(g2, d2) | 0;
          Gk(h3, e2);
          h3 = Hk(h3, e2) | 0;
          Eb[f2 & 15](a3, g2, h3);
          l2 = i4;
          return;
        }
        function im(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          jm(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function jm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = km() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = lm(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, mm(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function km() {
          var b3 = 0, d2 = 0;
          if (!(a2[7704] | 0)) {
            tm(9520);
            Ha(34, 9520, o2 | 0) | 0;
            d2 = 7704;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9520) | 0)) {
            b3 = 9520;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            tm(9520);
          }
          return 9520;
        }
        function lm(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function mm(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = km() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            nm(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            om(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function nm(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function om(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = pm(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            qm(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            nm(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            rm(a3, i4);
            sm(i4);
            l2 = k2;
            return;
          }
        }
        function pm(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function qm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function rm(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function sm(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function tm(a3) {
          a3 = a3 | 0;
          wm(a3);
          return;
        }
        function um(a3) {
          a3 = a3 | 0;
          vm(a3 + 24 | 0);
          return;
        }
        function vm(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function wm(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 1, b3, xm() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function xm() {
          return 1224;
        }
        function ym(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          g2 = f2 + 8 | 0;
          h3 = f2;
          i4 = zm(a3) | 0;
          a3 = c2[i4 + 4 >> 2] | 0;
          c2[h3 >> 2] = c2[i4 >> 2];
          c2[h3 + 4 >> 2] = a3;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = c2[h3 + 4 >> 2];
          e2 = +Am(b3, g2, d2);
          l2 = f2;
          return +e2;
        }
        function zm(a3) {
          a3 = a3 | 0;
          return (c2[(km() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Am(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          tj(f2, d2);
          f2 = uj(f2, d2) | 0;
          h3 = +ch(+zb[e2 & 7](a3, f2));
          l2 = g2;
          return +h3;
        }
        function Bm(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Cm(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function Cm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Dm() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Em(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Fm(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Dm() {
          var b3 = 0, d2 = 0;
          if (!(a2[7712] | 0)) {
            Mm(9556);
            Ha(35, 9556, o2 | 0) | 0;
            d2 = 7712;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9556) | 0)) {
            b3 = 9556;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Mm(9556);
          }
          return 9556;
        }
        function Em(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Fm(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Dm() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Gm(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Hm(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Gm(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Hm(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Im(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Jm(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Gm(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Km(a3, i4);
            Lm(i4);
            l2 = k2;
            return;
          }
        }
        function Im(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Jm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Km(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Lm(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Mm(a3) {
          a3 = a3 | 0;
          Pm(a3);
          return;
        }
        function Nm(a3) {
          a3 = a3 | 0;
          Om(a3 + 24 | 0);
          return;
        }
        function Om(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Pm(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 5, b3, Qm() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Qm() {
          return 1232;
        }
        function Rm(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Sm(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          d2 = +Tm(b3, f2);
          l2 = e2;
          return +d2;
        }
        function Sm(a3) {
          a3 = a3 | 0;
          return (c2[(Dm() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Tm(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          return + +ch(+ub[d2 & 15](a3));
        }
        function Um(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Vm(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function Vm(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Wm() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Xm(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Ym(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Wm() {
          var b3 = 0, d2 = 0;
          if (!(a2[7720] | 0)) {
            dn(9592);
            Ha(36, 9592, o2 | 0) | 0;
            d2 = 7720;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9592) | 0)) {
            b3 = 9592;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            dn(9592);
          }
          return 9592;
        }
        function Xm(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Ym(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Wm() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Zm(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            _m(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Zm(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function _m(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = $m(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            an(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Zm(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            bn(a3, i4);
            cn(i4);
            l2 = k2;
            return;
          }
        }
        function $m(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function an(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function bn(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function cn(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function dn(a3) {
          a3 = a3 | 0;
          gn(a3);
          return;
        }
        function en(a3) {
          a3 = a3 | 0;
          fn(a3 + 24 | 0);
          return;
        }
        function fn(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function gn(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 7, b3, hn() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function hn() {
          return 1276;
        }
        function jn(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = kn(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          b3 = ln(b3, e2) | 0;
          l2 = d2;
          return b3 | 0;
        }
        function kn(a3) {
          a3 = a3 | 0;
          return (c2[(Wm() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function ln(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          e2 = f2;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          ob[d2 & 31](e2, a3);
          e2 = mn(e2) | 0;
          l2 = f2;
          return e2 | 0;
        }
        function mn(a3) {
          a3 = a3 | 0;
          var b3 = 0, c3 = 0, d2 = 0, e2 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          b3 = e2 + 12 | 0;
          c3 = e2;
          d2 = Di(nn() | 0) | 0;
          if (!d2) a3 = pn(a3) | 0;
          else {
            Ei(b3, d2);
            Fi(c3, b3);
            on(a3, c3);
            a3 = Hi(b3) | 0;
          }
          l2 = e2;
          return a3 | 0;
        }
        function nn() {
          var b3 = 0;
          if (!(a2[7736] | 0)) {
            An(9640);
            Ha(25, 9640, o2 | 0) | 0;
            b3 = 7736;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 9640;
        }
        function on(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          un(b3, a3, a3 + 8 | 0) | 0;
          return;
        }
        function pn(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          f2 = d2 + 4 | 0;
          h3 = d2;
          e2 = jy(8) | 0;
          b3 = e2;
          i4 = qC(16) | 0;
          c2[i4 >> 2] = c2[a3 >> 2];
          c2[i4 + 4 >> 2] = c2[a3 + 4 >> 2];
          c2[i4 + 8 >> 2] = c2[a3 + 8 >> 2];
          c2[i4 + 12 >> 2] = c2[a3 + 12 >> 2];
          g2 = b3 + 4 | 0;
          c2[g2 >> 2] = i4;
          a3 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[h3 >> 2] = 0;
          c2[f2 >> 2] = c2[h3 >> 2];
          qn(a3, g2, f2);
          c2[e2 >> 2] = a3;
          l2 = d2;
          return b3 | 0;
        }
        function qn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          d2 = qC(16) | 0;
          c2[d2 + 4 >> 2] = 0;
          c2[d2 + 8 >> 2] = 0;
          c2[d2 >> 2] = 1244;
          c2[d2 + 12 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function rn(a3) {
          a3 = a3 | 0;
          kC(a3);
          sC(a3);
          return;
        }
        function sn(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 12 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function tn(a3) {
          a3 = a3 | 0;
          sC(a3);
          return;
        }
        function un(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          b3 = vn(c2[a3 >> 2] | 0, b3, d2) | 0;
          d2 = a3 + 4 | 0;
          c2[(c2[d2 >> 2] | 0) + 8 >> 2] = b3;
          return c2[(c2[d2 >> 2] | 0) + 8 >> 2] | 0;
        }
        function vn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2;
          UA(f2);
          a3 = Sg(a3) | 0;
          d2 = wn(a3, c2[b3 >> 2] | 0, +h2[d2 >> 3]) | 0;
          WA(f2);
          l2 = e2;
          return d2 | 0;
        }
        function wn(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          var d2 = 0;
          d2 = Vg(xn() | 0) | 0;
          b3 = Xg(b3) | 0;
          return za(0, d2 | 0, a3 | 0, b3 | 0, + +Wg(c3)) | 0;
        }
        function xn() {
          var b3 = 0;
          if (!(a2[7728] | 0)) {
            yn(9628);
            b3 = 7728;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 9628;
        }
        function yn(a3) {
          a3 = a3 | 0;
          fh(a3, zn() | 0, 2);
          return;
        }
        function zn() {
          return 1264;
        }
        function An(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function Bn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Cn(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function Cn(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Dn() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = En(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Fn(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Dn() {
          var b3 = 0, d2 = 0;
          if (!(a2[7744] | 0)) {
            Mn(9684);
            Ha(37, 9684, o2 | 0) | 0;
            d2 = 7744;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9684) | 0)) {
            b3 = 9684;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Mn(9684);
          }
          return 9684;
        }
        function En(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Fn(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Dn() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Gn(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Hn(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Gn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Hn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = In(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Jn(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Gn(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Kn(a3, i4);
            Ln(i4);
            l2 = k2;
            return;
          }
        }
        function In(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Jn(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Kn(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Ln(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Mn(a3) {
          a3 = a3 | 0;
          Pn(a3);
          return;
        }
        function Nn(a3) {
          a3 = a3 | 0;
          On(a3 + 24 | 0);
          return;
        }
        function On(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Pn(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 5, b3, Qn() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Qn() {
          return 1280;
        }
        function Rn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Sn(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          d2 = Tn(b3, f2, d2) | 0;
          l2 = e2;
          return d2 | 0;
        }
        function Sn(a3) {
          a3 = a3 | 0;
          return (c2[(Dn() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Tn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          f2 = h3;
          g2 = h3 + 16 | 0;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          tj(g2, d2);
          g2 = uj(g2, d2) | 0;
          Eb[e2 & 15](f2, a3, g2);
          g2 = mn(f2) | 0;
          l2 = h3;
          return g2 | 0;
        }
        function Un(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Vn(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function Vn(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Wn() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Xn(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Yn(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Wn() {
          var b3 = 0, d2 = 0;
          if (!(a2[7752] | 0)) {
            eo(9720);
            Ha(38, 9720, o2 | 0) | 0;
            d2 = 7752;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9720) | 0)) {
            b3 = 9720;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            eo(9720);
          }
          return 9720;
        }
        function Xn(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Yn(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Wn() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Zn(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            _n(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Zn(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function _n(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = $n(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            ao(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Zn(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            bo(a3, i4);
            co(i4);
            l2 = k2;
            return;
          }
        }
        function $n(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function ao(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function bo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function co(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function eo(a3) {
          a3 = a3 | 0;
          ho(a3);
          return;
        }
        function fo(a3) {
          a3 = a3 | 0;
          go(a3 + 24 | 0);
          return;
        }
        function go(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function ho(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 8, b3, io() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function io() {
          return 1288;
        }
        function jo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = ko(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          b3 = lo(b3, e2) | 0;
          l2 = d2;
          return b3 | 0;
        }
        function ko(a3) {
          a3 = a3 | 0;
          return (c2[(Wn() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function lo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          return bh(pb[d2 & 31](a3) | 0) | 0;
        }
        function mo(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          no(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function no(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = oo() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = po(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, qo(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function oo() {
          var b3 = 0, d2 = 0;
          if (!(a2[7760] | 0)) {
            xo(9756);
            Ha(39, 9756, o2 | 0) | 0;
            d2 = 7760;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9756) | 0)) {
            b3 = 9756;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            xo(9756);
          }
          return 9756;
        }
        function po(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function qo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = oo() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            ro(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            so(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function ro(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function so(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = to(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            uo(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            ro(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            vo(a3, i4);
            wo(i4);
            l2 = k2;
            return;
          }
        }
        function to(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function uo(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function vo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function wo(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function xo(a3) {
          a3 = a3 | 0;
          Ao(a3);
          return;
        }
        function yo(a3) {
          a3 = a3 | 0;
          zo(a3 + 24 | 0);
          return;
        }
        function zo(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Ao(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 8, b3, Bo() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Bo() {
          return 1292;
        }
        function Co(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Do(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Eo(b3, f2, d2);
          l2 = e2;
          return;
        }
        function Do(a3) {
          a3 = a3 | 0;
          return (c2[(oo() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Eo(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          rj(f2, d2);
          d2 = +sj(f2, d2);
          lb[e2 & 31](a3, d2);
          l2 = g2;
          return;
        }
        function Fo(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Go(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Go(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Ho() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Io(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Jo(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Ho() {
          var b3 = 0, d2 = 0;
          if (!(a2[7768] | 0)) {
            Qo(9792);
            Ha(40, 9792, o2 | 0) | 0;
            d2 = 7768;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9792) | 0)) {
            b3 = 9792;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Qo(9792);
          }
          return 9792;
        }
        function Io(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Jo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Ho() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Ko(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Lo(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Ko(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Lo(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Mo(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            No(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Ko(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Oo(a3, i4);
            Po(i4);
            l2 = k2;
            return;
          }
        }
        function Mo(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function No(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Oo(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Po(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Qo(a3) {
          a3 = a3 | 0;
          To(a3);
          return;
        }
        function Ro(a3) {
          a3 = a3 | 0;
          So(a3 + 24 | 0);
          return;
        }
        function So(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function To(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 1, b3, Uo() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Uo() {
          return 1300;
        }
        function Vo(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = +e2;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          g2 = f2 + 8 | 0;
          h3 = f2;
          i4 = Wo(a3) | 0;
          a3 = c2[i4 + 4 >> 2] | 0;
          c2[h3 >> 2] = c2[i4 >> 2];
          c2[h3 + 4 >> 2] = a3;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = c2[h3 + 4 >> 2];
          Xo(b3, g2, d2, e2);
          l2 = f2;
          return;
        }
        function Wo(a3) {
          a3 = a3 | 0;
          return (c2[(Ho() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Xo(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = +e2;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          g2 = i4 + 1 | 0;
          h3 = i4;
          f2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) f2 = c2[(c2[a3 >> 2] | 0) + f2 >> 2] | 0;
          tj(g2, d2);
          g2 = uj(g2, d2) | 0;
          rj(h3, e2);
          e2 = +sj(h3, e2);
          Gb[f2 & 15](a3, g2, e2);
          l2 = i4;
          return;
        }
        function Yo(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Zo(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Zo(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = _o() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = $o(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, ap(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function _o() {
          var b3 = 0, d2 = 0;
          if (!(a2[7776] | 0)) {
            hp(9828);
            Ha(41, 9828, o2 | 0) | 0;
            d2 = 7776;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9828) | 0)) {
            b3 = 9828;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            hp(9828);
          }
          return 9828;
        }
        function $o(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function ap(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = _o() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            bp(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            cp(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function bp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function cp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = dp(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            ep(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            bp(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            fp(a3, i4);
            gp(i4);
            l2 = k2;
            return;
          }
        }
        function dp(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function ep(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function fp(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function gp(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function hp(a3) {
          a3 = a3 | 0;
          kp(a3);
          return;
        }
        function ip(a3) {
          a3 = a3 | 0;
          jp(a3 + 24 | 0);
          return;
        }
        function jp(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function kp(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 7, b3, lp() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function lp() {
          return 1312;
        }
        function mp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = np(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          op(b3, f2, d2);
          l2 = e2;
          return;
        }
        function np(a3) {
          a3 = a3 | 0;
          return (c2[(_o() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function op(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          tj(f2, d2);
          f2 = uj(f2, d2) | 0;
          ob[e2 & 31](a3, f2);
          l2 = g2;
          return;
        }
        function pp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          qp(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function qp(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = rp() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = sp(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, tp(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function rp() {
          var b3 = 0, d2 = 0;
          if (!(a2[7784] | 0)) {
            Ap(9864);
            Ha(42, 9864, o2 | 0) | 0;
            d2 = 7784;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9864) | 0)) {
            b3 = 9864;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Ap(9864);
          }
          return 9864;
        }
        function sp(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function tp(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = rp() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            up(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            vp(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function up(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function vp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = wp(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            xp(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            up(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            yp(a3, i4);
            zp(i4);
            l2 = k2;
            return;
          }
        }
        function wp(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function xp(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function yp(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function zp(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Ap(a3) {
          a3 = a3 | 0;
          Dp(a3);
          return;
        }
        function Bp(a3) {
          a3 = a3 | 0;
          Cp(a3 + 24 | 0);
          return;
        }
        function Cp(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Dp(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 8, b3, Ep() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Ep() {
          return 1320;
        }
        function Fp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Gp(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Hp(b3, f2, d2);
          l2 = e2;
          return;
        }
        function Gp(a3) {
          a3 = a3 | 0;
          return (c2[(rp() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Hp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          Ip(f2, d2);
          f2 = Jp(f2, d2) | 0;
          ob[e2 & 31](a3, f2);
          l2 = g2;
          return;
        }
        function Ip(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function Jp(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Kp(b3) | 0;
        }
        function Kp(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Lp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Mp(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Mp(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Np() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Op(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Pp(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Np() {
          var b3 = 0, d2 = 0;
          if (!(a2[7792] | 0)) {
            Wp(9900);
            Ha(43, 9900, o2 | 0) | 0;
            d2 = 7792;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9900) | 0)) {
            b3 = 9900;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Wp(9900);
          }
          return 9900;
        }
        function Op(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Pp(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Np() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Qp(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Rp(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Qp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Rp(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Sp(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Tp(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Qp(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Up(a3, i4);
            Vp(i4);
            l2 = k2;
            return;
          }
        }
        function Sp(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Tp(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Up(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Vp(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Wp(a3) {
          a3 = a3 | 0;
          Zp(a3);
          return;
        }
        function Xp(a3) {
          a3 = a3 | 0;
          Yp(a3 + 24 | 0);
          return;
        }
        function Yp(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Zp(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 22, b3, _p() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function _p() {
          return 1344;
        }
        function $p(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2 + 8 | 0;
          f2 = d2;
          g2 = aq(a3) | 0;
          a3 = c2[g2 + 4 >> 2] | 0;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = a3;
          c2[e2 >> 2] = c2[f2 >> 2];
          c2[e2 + 4 >> 2] = c2[f2 + 4 >> 2];
          bq(b3, e2);
          l2 = d2;
          return;
        }
        function aq(a3) {
          a3 = a3 | 0;
          return (c2[(Np() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function bq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) d2 = c2[(c2[a3 >> 2] | 0) + d2 >> 2] | 0;
          nb[d2 & 127](a3);
          return;
        }
        function cq(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = dq() | 0;
          a3 = eq(d2) | 0;
          fi(g2, b3, f2, a3, fq(d2, e2) | 0, e2);
          return;
        }
        function dq() {
          var b3 = 0, d2 = 0;
          if (!(a2[7800] | 0)) {
            mq(9936);
            Ha(44, 9936, o2 | 0) | 0;
            d2 = 7800;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9936) | 0)) {
            b3 = 9936;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            mq(9936);
          }
          return 9936;
        }
        function eq(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function fq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = dq() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            gq(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            hq(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function gq(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function hq(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = iq(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            jq(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            gq(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            kq(a3, f2);
            lq(f2);
            l2 = i4;
            return;
          }
        }
        function iq(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function jq(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function kq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function lq(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function mq(a3) {
          a3 = a3 | 0;
          pq(a3);
          return;
        }
        function nq(a3) {
          a3 = a3 | 0;
          oq(a3 + 24 | 0);
          return;
        }
        function oq(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function pq(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 23, b3, Kl() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function qq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          sq(c2[(rq(a3) | 0) >> 2] | 0, b3);
          return;
        }
        function rq(a3) {
          a3 = a3 | 0;
          return (c2[(dq() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function sq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0, d2 = 0;
          c3 = l2;
          l2 = l2 + 16 | 0;
          d2 = c3;
          Ol(d2, b3);
          b3 = Pl(d2, b3) | 0;
          nb[a3 & 127](b3);
          l2 = c3;
          return;
        }
        function tq(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = uq() | 0;
          a3 = vq(d2) | 0;
          fi(g2, b3, f2, a3, wq(d2, e2) | 0, e2);
          return;
        }
        function uq() {
          var b3 = 0, d2 = 0;
          if (!(a2[7808] | 0)) {
            Dq(9972);
            Ha(45, 9972, o2 | 0) | 0;
            d2 = 7808;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(9972) | 0)) {
            b3 = 9972;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Dq(9972);
          }
          return 9972;
        }
        function vq(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function wq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = uq() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            xq(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            yq(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function xq(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function yq(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = zq(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            Aq(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            xq(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            Bq(a3, f2);
            Cq(f2);
            l2 = i4;
            return;
          }
        }
        function zq(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function Aq(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function Bq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Cq(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Dq(a3) {
          a3 = a3 | 0;
          Gq(a3);
          return;
        }
        function Eq(a3) {
          a3 = a3 | 0;
          Fq(a3 + 24 | 0);
          return;
        }
        function Fq(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Gq(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 9, b3, Hq() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Hq() {
          return 1348;
        }
        function Iq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Kq(c2[(Jq(a3) | 0) >> 2] | 0, b3) | 0;
        }
        function Jq(a3) {
          a3 = a3 | 0;
          return (c2[(uq() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function Kq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0, d2 = 0;
          c3 = l2;
          l2 = l2 + 16 | 0;
          d2 = c3;
          Lq(d2, b3);
          b3 = Mq(d2, b3) | 0;
          b3 = Ik(pb[a3 & 31](b3) | 0) | 0;
          l2 = c3;
          return b3 | 0;
        }
        function Lq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function Mq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Nq(b3) | 0;
        }
        function Nq(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Oq(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Pq() | 0;
          a3 = Qq(d2) | 0;
          fi(g2, b3, f2, a3, Rq(d2, e2) | 0, e2);
          return;
        }
        function Pq() {
          var b3 = 0, d2 = 0;
          if (!(a2[7816] | 0)) {
            Yq(10008);
            Ha(46, 10008, o2 | 0) | 0;
            d2 = 7816;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10008) | 0)) {
            b3 = 10008;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Yq(10008);
          }
          return 10008;
        }
        function Qq(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Rq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Pq() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            Sq(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            Tq(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function Sq(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Tq(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = Uq(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            Vq(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            Sq(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            Wq(a3, f2);
            Xq(f2);
            l2 = i4;
            return;
          }
        }
        function Uq(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function Vq(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function Wq(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Xq(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Yq(a3) {
          a3 = a3 | 0;
          $q(a3);
          return;
        }
        function Zq(a3) {
          a3 = a3 | 0;
          _q(a3 + 24 | 0);
          return;
        }
        function _q(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function $q(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 15, b3, Zk() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function ar(a3) {
          a3 = a3 | 0;
          return cr(c2[(br(a3) | 0) >> 2] | 0) | 0;
        }
        function br(a3) {
          a3 = a3 | 0;
          return (c2[(Pq() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function cr(a3) {
          a3 = a3 | 0;
          return Ik(Ab[a3 & 7]() | 0) | 0;
        }
        function dr() {
          var b3 = 0;
          if (!(a2[7832] | 0)) {
            nr(10052);
            Ha(25, 10052, o2 | 0) | 0;
            b3 = 7832;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10052;
        }
        function er(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = fr() | 0;
          c2[a3 + 4 >> 2] = gr() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = hr() | 0;
          c2[a3 + 32 >> 2] = 2;
          return;
        }
        function fr() {
          return 11709;
        }
        function gr() {
          return 1188;
        }
        function hr() {
          return lr() | 0;
        }
        function ir(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              kr(c3);
              sC(c3);
            }
          } else if (b3 | 0) {
            uf(b3);
            sC(b3);
          }
          return;
        }
        function jr(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return b3 & a3 | 0;
        }
        function kr(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function lr() {
          var b3 = 0;
          if (!(a2[7824] | 0)) {
            c2[2511] = mr() | 0;
            c2[2512] = 0;
            b3 = 7824;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10044;
        }
        function mr() {
          return 0;
        }
        function nr(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function or(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0;
          b3 = l2;
          l2 = l2 + 32 | 0;
          d2 = b3 + 24 | 0;
          g2 = b3 + 16 | 0;
          f2 = b3 + 8 | 0;
          e2 = b3;
          pr(a3, 4827);
          qr(a3, 4834, 3) | 0;
          rr(a3, 3682, 47) | 0;
          c2[g2 >> 2] = 9;
          c2[g2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[g2 >> 2];
          c2[d2 + 4 >> 2] = c2[g2 + 4 >> 2];
          sr(a3, 4841, d2) | 0;
          c2[f2 >> 2] = 1;
          c2[f2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[f2 >> 2];
          c2[d2 + 4 >> 2] = c2[f2 + 4 >> 2];
          tr(a3, 4871, d2) | 0;
          c2[e2 >> 2] = 10;
          c2[e2 + 4 >> 2] = 0;
          c2[d2 >> 2] = c2[e2 >> 2];
          c2[d2 + 4 >> 2] = c2[e2 + 4 >> 2];
          ur(a3, 4891, d2) | 0;
          l2 = b3;
          return;
        }
        function pr(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = nt() | 0;
          c2[a3 >> 2] = d2;
          ot(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function qr(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Ws(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function rr(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Es(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function sr(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          is(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function tr(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Or(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function ur(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = c2[d2 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[d2 >> 2];
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          vr(a3, b3, f2);
          l2 = e2;
          return a3 | 0;
        }
        function vr(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          wr(a3, d2, f2, 1);
          l2 = e2;
          return;
        }
        function wr(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = xr() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = yr(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, zr(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function xr() {
          var b3 = 0, d2 = 0;
          if (!(a2[7840] | 0)) {
            Gr(10100);
            Ha(48, 10100, o2 | 0) | 0;
            d2 = 7840;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10100) | 0)) {
            b3 = 10100;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Gr(10100);
          }
          return 10100;
        }
        function yr(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function zr(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = xr() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Ar(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Br(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Ar(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Br(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Cr(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Dr(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Ar(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Er(a3, i4);
            Fr(i4);
            l2 = k2;
            return;
          }
        }
        function Cr(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Dr(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Er(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Fr(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Gr(a3) {
          a3 = a3 | 0;
          Jr(a3);
          return;
        }
        function Hr(a3) {
          a3 = a3 | 0;
          Ir(a3 + 24 | 0);
          return;
        }
        function Ir(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function Jr(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 6, b3, Kr() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Kr() {
          return 1364;
        }
        function Lr(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = Mr(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          d2 = Nr(b3, f2, d2) | 0;
          l2 = e2;
          return d2 | 0;
        }
        function Mr(a3) {
          a3 = a3 | 0;
          return (c2[(xr() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function Nr(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          tj(f2, d2);
          f2 = uj(f2, d2) | 0;
          f2 = Qj(wb[e2 & 15](a3, f2) | 0) | 0;
          l2 = g2;
          return f2 | 0;
        }
        function Or(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          Pr(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function Pr(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = Qr() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = Rr(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, Sr(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function Qr() {
          var b3 = 0, d2 = 0;
          if (!(a2[7848] | 0)) {
            Zr(10136);
            Ha(49, 10136, o2 | 0) | 0;
            d2 = 7848;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10136) | 0)) {
            b3 = 10136;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Zr(10136);
          }
          return 10136;
        }
        function Rr(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function Sr(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = Qr() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Tr(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            Ur(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function Tr(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function Ur(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = Vr(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            Wr(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            Tr(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            Xr(a3, i4);
            Yr(i4);
            l2 = k2;
            return;
          }
        }
        function Vr(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function Wr(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function Xr(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Yr(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Zr(a3) {
          a3 = a3 | 0;
          as(a3);
          return;
        }
        function _r(a3) {
          a3 = a3 | 0;
          $r(a3 + 24 | 0);
          return;
        }
        function $r(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function as(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 9, b3, bs() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function bs() {
          return 1372;
        }
        function cs(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          h3 = ds(a3) | 0;
          a3 = c2[h3 + 4 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = a3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          es(b3, f2, d2);
          l2 = e2;
          return;
        }
        function ds(a3) {
          a3 = a3 | 0;
          return (c2[(Qr() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function es(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          var e2 = 0, f2 = 0, g2 = 0, h3 = ib;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2;
          e2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) e2 = c2[(c2[a3 >> 2] | 0) + e2 >> 2] | 0;
          fs(f2, d2);
          h3 = T2(gs(f2, d2));
          kb[e2 & 1](a3, h3);
          l2 = g2;
          return;
        }
        function fs(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          return;
        }
        function gs(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          return T2(hs(b3));
        }
        function hs(a3) {
          a3 = +a3;
          return T2(a3);
        }
        function is(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2 + 8 | 0;
          g2 = e2;
          i4 = c2[d2 >> 2] | 0;
          h3 = c2[d2 + 4 >> 2] | 0;
          d2 = ai(b3) | 0;
          c2[g2 >> 2] = i4;
          c2[g2 + 4 >> 2] = h3;
          c2[f2 >> 2] = c2[g2 >> 2];
          c2[f2 + 4 >> 2] = c2[g2 + 4 >> 2];
          js(a3, d2, f2, 0);
          l2 = e2;
          return;
        }
        function js(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2 + 16 | 0;
          m2 = f2 + 8 | 0;
          i4 = f2;
          k2 = c2[d2 >> 2] | 0;
          j2 = c2[d2 + 4 >> 2] | 0;
          h3 = c2[a3 >> 2] | 0;
          a3 = ks() | 0;
          c2[m2 >> 2] = k2;
          c2[m2 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[m2 >> 2];
          c2[g2 + 4 >> 2] = c2[m2 + 4 >> 2];
          d2 = ls(g2) | 0;
          c2[i4 >> 2] = k2;
          c2[i4 + 4 >> 2] = j2;
          c2[g2 >> 2] = c2[i4 >> 2];
          c2[g2 + 4 >> 2] = c2[i4 + 4 >> 2];
          fi(h3, b3, a3, d2, ms(g2, e2) | 0, e2);
          l2 = f2;
          return;
        }
        function ks() {
          var b3 = 0, d2 = 0;
          if (!(a2[7856] | 0)) {
            ts(10172);
            Ha(50, 10172, o2 | 0) | 0;
            d2 = 7856;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10172) | 0)) {
            b3 = 10172;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            ts(10172);
          }
          return 10172;
        }
        function ls(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function ms(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          m2 = l2;
          l2 = l2 + 32 | 0;
          f2 = m2 + 24 | 0;
          h3 = m2 + 16 | 0;
          i4 = m2;
          j2 = m2 + 8 | 0;
          g2 = c2[a3 >> 2] | 0;
          e2 = c2[a3 + 4 >> 2] | 0;
          c2[i4 >> 2] = g2;
          c2[i4 + 4 >> 2] = e2;
          n3 = ks() | 0;
          k2 = n3 + 24 | 0;
          a3 = ji(b3, 4) | 0;
          c2[j2 >> 2] = a3;
          b3 = n3 + 28 | 0;
          d2 = c2[b3 >> 2] | 0;
          if (d2 >>> 0 < (c2[n3 + 32 >> 2] | 0) >>> 0) {
            c2[h3 >> 2] = g2;
            c2[h3 + 4 >> 2] = e2;
            c2[f2 >> 2] = c2[h3 >> 2];
            c2[f2 + 4 >> 2] = c2[h3 + 4 >> 2];
            ns(d2, f2, a3);
            a3 = (c2[b3 >> 2] | 0) + 12 | 0;
            c2[b3 >> 2] = a3;
          } else {
            os(k2, i4, j2);
            a3 = c2[b3 >> 2] | 0;
          }
          l2 = m2;
          return ((a3 - (c2[k2 >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
        }
        function ns(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          e2 = c2[b3 + 4 >> 2] | 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 8 >> 2] = d2;
          return;
        }
        function os(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0;
          k2 = l2;
          l2 = l2 + 48 | 0;
          e2 = k2 + 32 | 0;
          h3 = k2 + 24 | 0;
          i4 = k2;
          j2 = a3 + 4 | 0;
          f2 = (((c2[j2 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
          g2 = ps(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            m2 = c2[a3 >> 2] | 0;
            o3 = ((c2[a3 + 8 >> 2] | 0) - m2 | 0) / 12 | 0;
            n3 = o3 << 1;
            qs(i4, o3 >>> 0 < g2 >>> 1 >>> 0 ? n3 >>> 0 < f2 >>> 0 ? f2 : n3 : g2, ((c2[j2 >> 2] | 0) - m2 | 0) / 12 | 0, a3 + 8 | 0);
            j2 = i4 + 8 | 0;
            g2 = c2[j2 >> 2] | 0;
            f2 = c2[b3 + 4 >> 2] | 0;
            d2 = c2[d2 >> 2] | 0;
            c2[h3 >> 2] = c2[b3 >> 2];
            c2[h3 + 4 >> 2] = f2;
            c2[e2 >> 2] = c2[h3 >> 2];
            c2[e2 + 4 >> 2] = c2[h3 + 4 >> 2];
            ns(g2, e2, d2);
            c2[j2 >> 2] = (c2[j2 >> 2] | 0) + 12;
            rs(a3, i4);
            ss(i4);
            l2 = k2;
            return;
          }
        }
        function ps(a3) {
          a3 = a3 | 0;
          return 357913941;
        }
        function qs(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 357913941) Ta();
              else {
                f2 = qC(b3 * 12 | 0) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 * 12 | 0) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 * 12 | 0);
          return;
        }
        function rs(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (((f2 | 0) / -12 | 0) * 12 | 0) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function ss(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~(((e2 + -12 - b3 | 0) >>> 0) / 12 | 0) * 12 | 0);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function ts(a3) {
          a3 = a3 | 0;
          ws(a3);
          return;
        }
        function us(a3) {
          a3 = a3 | 0;
          vs(a3 + 24 | 0);
          return;
        }
        function vs(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~(((b3 + -12 - e2 | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d2);
          }
          return;
        }
        function ws(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 2, 3, b3, xs() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function xs() {
          return 1380;
        }
        function ys(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          g2 = f2 + 8 | 0;
          h3 = f2;
          i4 = zs(a3) | 0;
          a3 = c2[i4 + 4 >> 2] | 0;
          c2[h3 >> 2] = c2[i4 >> 2];
          c2[h3 + 4 >> 2] = a3;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = c2[h3 + 4 >> 2];
          As(b3, g2, d2, e2);
          l2 = f2;
          return;
        }
        function zs(a3) {
          a3 = a3 | 0;
          return (c2[(ks() | 0) + 24 >> 2] | 0) + (a3 * 12 | 0) | 0;
        }
        function As(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          g2 = i4 + 1 | 0;
          h3 = i4;
          f2 = c2[b3 >> 2] | 0;
          b3 = c2[b3 + 4 >> 2] | 0;
          a3 = a3 + (b3 >> 1) | 0;
          if (b3 & 1) f2 = c2[(c2[a3 >> 2] | 0) + f2 >> 2] | 0;
          tj(g2, d2);
          g2 = uj(g2, d2) | 0;
          Bs(h3, e2);
          h3 = Cs(h3, e2) | 0;
          Eb[f2 & 15](a3, g2, h3);
          l2 = i4;
          return;
        }
        function Bs(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function Cs(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return Ds(b3) | 0;
        }
        function Ds(a3) {
          a3 = a3 | 0;
          return (a3 | 0) != 0 | 0;
        }
        function Es(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Fs() | 0;
          a3 = Gs(d2) | 0;
          fi(g2, b3, f2, a3, Hs(d2, e2) | 0, e2);
          return;
        }
        function Fs() {
          var b3 = 0, d2 = 0;
          if (!(a2[7864] | 0)) {
            Os(10208);
            Ha(51, 10208, o2 | 0) | 0;
            d2 = 7864;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10208) | 0)) {
            b3 = 10208;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Os(10208);
          }
          return 10208;
        }
        function Gs(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Hs(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Fs() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            Is(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            Js(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function Is(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Js(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = Ks(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            Ls(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            Is(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            Ms(a3, f2);
            Ns(f2);
            l2 = i4;
            return;
          }
        }
        function Ks(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function Ls(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function Ms(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Ns(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Os(a3) {
          a3 = a3 | 0;
          Rs(a3);
          return;
        }
        function Ps(a3) {
          a3 = a3 | 0;
          Qs(a3 + 24 | 0);
          return;
        }
        function Qs(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Rs(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 24, b3, Ss() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Ss() {
          return 1392;
        }
        function Ts(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          Vs(c2[(Us(a3) | 0) >> 2] | 0, b3);
          return;
        }
        function Us(a3) {
          a3 = a3 | 0;
          return (c2[(Fs() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function Vs(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0, d2 = 0;
          c3 = l2;
          l2 = l2 + 16 | 0;
          d2 = c3;
          Lq(d2, b3);
          b3 = Mq(d2, b3) | 0;
          nb[a3 & 127](b3);
          l2 = c3;
          return;
        }
        function Ws(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Xs() | 0;
          a3 = Ys(d2) | 0;
          fi(g2, b3, f2, a3, Zs(d2, e2) | 0, e2);
          return;
        }
        function Xs() {
          var b3 = 0, d2 = 0;
          if (!(a2[7872] | 0)) {
            et(10244);
            Ha(52, 10244, o2 | 0) | 0;
            d2 = 7872;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10244) | 0)) {
            b3 = 10244;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            et(10244);
          }
          return 10244;
        }
        function Ys(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Zs(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Xs() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            _s(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            $s(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function _s(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function $s(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = at(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            bt(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            _s(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            ct(a3, f2);
            dt(f2);
            l2 = i4;
            return;
          }
        }
        function at(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function bt(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function ct(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function dt(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function et(a3) {
          a3 = a3 | 0;
          ht(a3);
          return;
        }
        function ft(a3) {
          a3 = a3 | 0;
          gt(a3 + 24 | 0);
          return;
        }
        function gt(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function ht(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 16, b3, it() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function it() {
          return 1400;
        }
        function jt(a3) {
          a3 = a3 | 0;
          return lt(c2[(kt(a3) | 0) >> 2] | 0) | 0;
        }
        function kt(a3) {
          a3 = a3 | 0;
          return (c2[(Xs() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function lt(a3) {
          a3 = a3 | 0;
          return mt(Ab[a3 & 7]() | 0) | 0;
        }
        function mt(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function nt() {
          var b3 = 0;
          if (!(a2[7880] | 0)) {
            ut(10280);
            Ha(25, 10280, o2 | 0) | 0;
            b3 = 7880;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10280;
        }
        function ot(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = pt() | 0;
          c2[a3 + 4 >> 2] = qt() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = rt() | 0;
          c2[a3 + 32 >> 2] = 4;
          return;
        }
        function pt() {
          return 11711;
        }
        function qt() {
          return 1356;
        }
        function rt() {
          return lr() | 0;
        }
        function st(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              tt(c3);
              sC(c3);
            }
          } else if (b3 | 0) {
            mf(b3);
            sC(b3);
          }
          return;
        }
        function tt(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function ut(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function vt(a3) {
          a3 = a3 | 0;
          wt(a3, 4920);
          xt(a3) | 0;
          yt(a3) | 0;
          return;
        }
        function wt(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = nn() | 0;
          c2[a3 >> 2] = d2;
          Yt(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function xt(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, Mt() | 0);
          return a3 | 0;
        }
        function yt(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, zt() | 0);
          return a3 | 0;
        }
        function zt() {
          var b3 = 0;
          if (!(a2[7888] | 0)) {
            Bt(10328);
            Ha(53, 10328, o2 | 0) | 0;
            b3 = 7888;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(10328) | 0)) Bt(10328);
          return 10328;
        }
        function At(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          fi(a3, 0, b3, 0, 0, 0);
          return;
        }
        function Bt(a3) {
          a3 = a3 | 0;
          Et(a3);
          Gt(a3, 10);
          return;
        }
        function Ct(a3) {
          a3 = a3 | 0;
          Dt(a3 + 24 | 0);
          return;
        }
        function Dt(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Et(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 1, b3, Jt() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Ft(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          Ht(a3, b3, c3);
          return;
        }
        function Gt(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 + 20 >> 2] = b3;
          return;
        }
        function Ht(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = +d2;
          var e2 = 0, f2 = 0, g2 = 0, i4 = 0, j2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          g2 = e2 + 8 | 0;
          j2 = e2 + 13 | 0;
          f2 = e2;
          i4 = e2 + 12 | 0;
          tj(j2, b3);
          c2[g2 >> 2] = uj(j2, b3) | 0;
          rj(i4, d2);
          h2[f2 >> 3] = +sj(i4, d2);
          It(a3, g2, f2);
          l2 = e2;
          return;
        }
        function It(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          mg(b3 + 8 | 0, c2[d2 >> 2] | 0, +h2[e2 >> 3]);
          a2[b3 + 24 >> 0] = 1;
          return;
        }
        function Jt() {
          return 1404;
        }
        function Kt(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          return Lt(a3, b3) | 0;
        }
        function Lt(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          g2 = e2 + 4 | 0;
          h3 = e2 + 8 | 0;
          i4 = e2;
          f2 = jy(8) | 0;
          d2 = f2;
          j2 = qC(16) | 0;
          tj(g2, a3);
          a3 = uj(g2, a3) | 0;
          rj(h3, b3);
          mg(j2, a3, +sj(h3, b3));
          h3 = d2 + 4 | 0;
          c2[h3 >> 2] = j2;
          a3 = qC(8) | 0;
          h3 = c2[h3 >> 2] | 0;
          c2[i4 >> 2] = 0;
          c2[g2 >> 2] = c2[i4 >> 2];
          qn(a3, h3, g2);
          c2[f2 >> 2] = a3;
          l2 = e2;
          return d2 | 0;
        }
        function Mt() {
          var b3 = 0;
          if (!(a2[7896] | 0)) {
            Nt(10364);
            Ha(54, 10364, o2 | 0) | 0;
            b3 = 7896;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(10364) | 0)) Nt(10364);
          return 10364;
        }
        function Nt(a3) {
          a3 = a3 | 0;
          Qt(a3);
          Gt(a3, 55);
          return;
        }
        function Ot(a3) {
          a3 = a3 | 0;
          Pt(a3 + 24 | 0);
          return;
        }
        function Pt(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Qt(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 4, b3, Vt() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Rt(a3) {
          a3 = a3 | 0;
          St(a3);
          return;
        }
        function St(a3) {
          a3 = a3 | 0;
          Tt(a3);
          return;
        }
        function Tt(b3) {
          b3 = b3 | 0;
          Ut(b3 + 8 | 0);
          a2[b3 + 24 >> 0] = 1;
          return;
        }
        function Ut(a3) {
          a3 = a3 | 0;
          c2[a3 >> 2] = 0;
          h2[a3 + 8 >> 3] = 0;
          return;
        }
        function Vt() {
          return 1424;
        }
        function Wt() {
          return Xt() | 0;
        }
        function Xt() {
          var a3 = 0, b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          b3 = l2;
          l2 = l2 + 16 | 0;
          f2 = b3 + 4 | 0;
          h3 = b3;
          d2 = jy(8) | 0;
          a3 = d2;
          e2 = qC(16) | 0;
          Ut(e2);
          g2 = a3 + 4 | 0;
          c2[g2 >> 2] = e2;
          e2 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[h3 >> 2] = 0;
          c2[f2 >> 2] = c2[h3 >> 2];
          qn(e2, g2, f2);
          c2[d2 >> 2] = e2;
          l2 = b3;
          return a3 | 0;
        }
        function Yt(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = Zt() | 0;
          c2[a3 + 4 >> 2] = _t() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = $t() | 0;
          c2[a3 + 32 >> 2] = 5;
          return;
        }
        function Zt() {
          return 11710;
        }
        function _t() {
          return 1416;
        }
        function $t() {
          return cu() | 0;
        }
        function au(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              bu(c3);
              sC(c3);
            }
          } else if (b3 | 0) sC(b3);
          return;
        }
        function bu(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function cu() {
          var b3 = 0;
          if (!(a2[7904] | 0)) {
            c2[2600] = du() | 0;
            c2[2601] = 0;
            b3 = 7904;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10400;
        }
        function du() {
          return c2[357] | 0;
        }
        function eu(a3) {
          a3 = a3 | 0;
          fu(a3, 4926);
          gu(a3) | 0;
          return;
        }
        function fu(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = Ci() | 0;
          c2[a3 >> 2] = d2;
          su(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function gu(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, hu() | 0);
          return a3 | 0;
        }
        function hu() {
          var b3 = 0;
          if (!(a2[7912] | 0)) {
            iu(10412);
            Ha(56, 10412, o2 | 0) | 0;
            b3 = 7912;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(10412) | 0)) iu(10412);
          return 10412;
        }
        function iu(a3) {
          a3 = a3 | 0;
          lu(a3);
          Gt(a3, 57);
          return;
        }
        function ju(a3) {
          a3 = a3 | 0;
          ku(a3 + 24 | 0);
          return;
        }
        function ku(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function lu(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 5, b3, pu() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function mu(a3) {
          a3 = a3 | 0;
          nu(a3);
          return;
        }
        function nu(a3) {
          a3 = a3 | 0;
          ou(a3);
          return;
        }
        function ou(b3) {
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = b3 + 8 | 0;
          e2 = d2 + 48 | 0;
          do {
            c2[d2 >> 2] = 0;
            d2 = d2 + 4 | 0;
          } while ((d2 | 0) < (e2 | 0));
          a2[b3 + 56 >> 0] = 1;
          return;
        }
        function pu() {
          return 1432;
        }
        function qu() {
          return ru() | 0;
        }
        function ru() {
          var a3 = 0, b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          h3 = l2;
          l2 = l2 + 16 | 0;
          a3 = h3 + 4 | 0;
          b3 = h3;
          d2 = jy(8) | 0;
          e2 = d2;
          f2 = qC(48) | 0;
          g2 = f2;
          i4 = g2 + 48 | 0;
          do {
            c2[g2 >> 2] = 0;
            g2 = g2 + 4 | 0;
          } while ((g2 | 0) < (i4 | 0));
          g2 = e2 + 4 | 0;
          c2[g2 >> 2] = f2;
          i4 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[b3 >> 2] = 0;
          c2[a3 >> 2] = c2[b3 >> 2];
          Ji(i4, g2, a3);
          c2[d2 >> 2] = i4;
          l2 = h3;
          return e2 | 0;
        }
        function su(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = tu() | 0;
          c2[a3 + 4 >> 2] = uu() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = vu() | 0;
          c2[a3 + 32 >> 2] = 6;
          return;
        }
        function tu() {
          return 11704;
        }
        function uu() {
          return 1436;
        }
        function vu() {
          return cu() | 0;
        }
        function wu(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              xu(c3);
              sC(c3);
            }
          } else if (b3 | 0) sC(b3);
          return;
        }
        function xu(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function yu(a3) {
          a3 = a3 | 0;
          zu(a3, 4933);
          Au(a3) | 0;
          Bu(a3) | 0;
          return;
        }
        function zu(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = cv() | 0;
          c2[a3 >> 2] = d2;
          dv(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function Au(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, Su() | 0);
          return a3 | 0;
        }
        function Bu(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, Cu() | 0);
          return a3 | 0;
        }
        function Cu() {
          var b3 = 0;
          if (!(a2[7920] | 0)) {
            Du(10452);
            Ha(58, 10452, o2 | 0) | 0;
            b3 = 7920;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(10452) | 0)) Du(10452);
          return 10452;
        }
        function Du(a3) {
          a3 = a3 | 0;
          Gu(a3);
          Gt(a3, 1);
          return;
        }
        function Eu(a3) {
          a3 = a3 | 0;
          Fu(a3 + 24 | 0);
          return;
        }
        function Fu(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Gu(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 1, b3, Lu() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Hu(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          Iu(a3, b3, c3);
          return;
        }
        function Iu(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, i4 = 0;
          d2 = l2;
          l2 = l2 + 32 | 0;
          f2 = d2 + 8 | 0;
          i4 = d2 + 17 | 0;
          e2 = d2;
          g2 = d2 + 16 | 0;
          rj(i4, b3);
          h2[f2 >> 3] = +sj(i4, b3);
          rj(g2, c3);
          h2[e2 >> 3] = +sj(g2, c3);
          Ju(a3, f2, e2);
          l2 = d2;
          return;
        }
        function Ju(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          Ku(b3 + 8 | 0, +h2[c3 >> 3], +h2[d2 >> 3]);
          a2[b3 + 24 >> 0] = 1;
          return;
        }
        function Ku(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          h2[a3 >> 3] = b3;
          h2[a3 + 8 >> 3] = c3;
          return;
        }
        function Lu() {
          return 1472;
        }
        function Mu(a3, b3) {
          a3 = +a3;
          b3 = +b3;
          return Nu(a3, b3) | 0;
        }
        function Nu(a3, b3) {
          a3 = +a3;
          b3 = +b3;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          h3 = e2 + 4 | 0;
          i4 = e2 + 8 | 0;
          j2 = e2;
          f2 = jy(8) | 0;
          d2 = f2;
          g2 = qC(16) | 0;
          rj(h3, a3);
          a3 = +sj(h3, a3);
          rj(i4, b3);
          Ku(g2, a3, +sj(i4, b3));
          i4 = d2 + 4 | 0;
          c2[i4 >> 2] = g2;
          g2 = qC(8) | 0;
          i4 = c2[i4 >> 2] | 0;
          c2[j2 >> 2] = 0;
          c2[h3 >> 2] = c2[j2 >> 2];
          Ou(g2, i4, h3);
          c2[f2 >> 2] = g2;
          l2 = e2;
          return d2 | 0;
        }
        function Ou(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          d2 = qC(16) | 0;
          c2[d2 + 4 >> 2] = 0;
          c2[d2 + 8 >> 2] = 0;
          c2[d2 >> 2] = 1452;
          c2[d2 + 12 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Pu(a3) {
          a3 = a3 | 0;
          kC(a3);
          sC(a3);
          return;
        }
        function Qu(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 12 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Ru(a3) {
          a3 = a3 | 0;
          sC(a3);
          return;
        }
        function Su() {
          var b3 = 0;
          if (!(a2[7928] | 0)) {
            Tu(10488);
            Ha(59, 10488, o2 | 0) | 0;
            b3 = 7928;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(10488) | 0)) Tu(10488);
          return 10488;
        }
        function Tu(a3) {
          a3 = a3 | 0;
          Wu(a3);
          Gt(a3, 60);
          return;
        }
        function Uu(a3) {
          a3 = a3 | 0;
          Vu(a3 + 24 | 0);
          return;
        }
        function Vu(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Wu(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 6, b3, $u() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Xu(a3) {
          a3 = a3 | 0;
          Yu(a3);
          return;
        }
        function Yu(a3) {
          a3 = a3 | 0;
          Zu(a3);
          return;
        }
        function Zu(b3) {
          b3 = b3 | 0;
          _u(b3 + 8 | 0);
          a2[b3 + 24 >> 0] = 1;
          return;
        }
        function _u(a3) {
          a3 = a3 | 0;
          c2[a3 >> 2] = 0;
          c2[a3 + 4 >> 2] = 0;
          c2[a3 + 8 >> 2] = 0;
          c2[a3 + 12 >> 2] = 0;
          return;
        }
        function $u() {
          return 1492;
        }
        function av() {
          return bv() | 0;
        }
        function bv() {
          var a3 = 0, b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          b3 = l2;
          l2 = l2 + 16 | 0;
          f2 = b3 + 4 | 0;
          h3 = b3;
          d2 = jy(8) | 0;
          a3 = d2;
          e2 = qC(16) | 0;
          _u(e2);
          g2 = a3 + 4 | 0;
          c2[g2 >> 2] = e2;
          e2 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[h3 >> 2] = 0;
          c2[f2 >> 2] = c2[h3 >> 2];
          Ou(e2, g2, f2);
          c2[d2 >> 2] = e2;
          l2 = b3;
          return a3 | 0;
        }
        function cv() {
          var b3 = 0;
          if (!(a2[7936] | 0)) {
            jv(10524);
            Ha(25, 10524, o2 | 0) | 0;
            b3 = 7936;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10524;
        }
        function dv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = ev() | 0;
          c2[a3 + 4 >> 2] = fv() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = gv() | 0;
          c2[a3 + 32 >> 2] = 7;
          return;
        }
        function ev() {
          return 11700;
        }
        function fv() {
          return 1484;
        }
        function gv() {
          return cu() | 0;
        }
        function hv(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              iv(c3);
              sC(c3);
            }
          } else if (b3 | 0) sC(b3);
          return;
        }
        function iv(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function jv(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function kv(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          a3 = ai(b3) | 0;
          b3 = lv(c3) | 0;
          c3 = mv(c3, 0) | 0;
          Zv(a3, b3, c3, nv() | 0, 0);
          return;
        }
        function lv(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function mv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = nv() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            vv(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            wv(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function nv() {
          var b3 = 0, d2 = 0;
          if (!(a2[7944] | 0)) {
            ov(10568);
            Ha(61, 10568, o2 | 0) | 0;
            d2 = 7944;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10568) | 0)) {
            b3 = 10568;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            ov(10568);
          }
          return 10568;
        }
        function ov(a3) {
          a3 = a3 | 0;
          rv(a3);
          return;
        }
        function pv(a3) {
          a3 = a3 | 0;
          qv(a3 + 24 | 0);
          return;
        }
        function qv(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function rv(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 17, b3, ql() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function sv(a3) {
          a3 = a3 | 0;
          return uv(c2[(tv(a3) | 0) >> 2] | 0) | 0;
        }
        function tv(a3) {
          a3 = a3 | 0;
          return (c2[(nv() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function uv(a3) {
          a3 = a3 | 0;
          return ul(Ab[a3 & 7]() | 0) | 0;
        }
        function vv(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function wv(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = xv(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            yv(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            vv(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            zv(a3, f2);
            Av(f2);
            l2 = i4;
            return;
          }
        }
        function xv(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function yv(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function zv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Av(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Bv() {
          Cv();
          return;
        }
        function Cv() {
          Dv(10604);
          return;
        }
        function Dv(a3) {
          a3 = a3 | 0;
          Ev(a3, 4955);
          return;
        }
        function Ev(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = Fv() | 0;
          c2[a3 >> 2] = d2;
          Gv(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function Fv() {
          var b3 = 0;
          if (!(a2[7952] | 0)) {
            Rv(10612);
            Ha(25, 10612, o2 | 0) | 0;
            b3 = 7952;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10612;
        }
        function Gv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = Mv() | 0;
          c2[a3 + 4 >> 2] = Nv() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = Ov() | 0;
          c2[a3 + 32 >> 2] = 8;
          return;
        }
        function Hv(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          b3 = l2;
          l2 = l2 + 16 | 0;
          d2 = b3;
          Iv() | 0;
          c2[d2 >> 2] = a3;
          Jv(10608, d2);
          l2 = b3;
          return;
        }
        function Iv() {
          if (!(a2[11714] | 0)) {
            c2[2652] = 0;
            Ha(62, 10608, o2 | 0) | 0;
            a2[11714] = 1;
          }
          return 10608;
        }
        function Jv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = qC(8) | 0;
          c2[d2 + 4 >> 2] = c2[b3 >> 2];
          c2[d2 >> 2] = c2[a3 >> 2];
          c2[a3 >> 2] = d2;
          return;
        }
        function Kv(a3) {
          a3 = a3 | 0;
          Lv(a3);
          return;
        }
        function Lv(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          b3 = c2[a3 >> 2] | 0;
          if (b3 | 0) do {
            d2 = b3;
            b3 = c2[b3 >> 2] | 0;
            sC(d2);
          } while ((b3 | 0) != 0);
          c2[a3 >> 2] = 0;
          return;
        }
        function Mv() {
          return 11715;
        }
        function Nv() {
          return 1496;
        }
        function Ov() {
          return lr() | 0;
        }
        function Pv(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              Qv(c3);
              sC(c3);
            }
          } else if (b3 | 0) sC(b3);
          return;
        }
        function Qv(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function Rv(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function Sv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          Iv() | 0;
          d2 = c2[2652] | 0;
          a: do
            if (d2 | 0) {
              while (1) {
                e2 = c2[d2 + 4 >> 2] | 0;
                if (e2 | 0 ? (AB(Tv(e2) | 0, a3) | 0) == 0 : 0) break;
                d2 = c2[d2 >> 2] | 0;
                if (!d2) break a;
              }
              Uv(e2, b3);
            }
          while (0);
          return;
        }
        function Tv(a3) {
          a3 = a3 | 0;
          return c2[a3 + 12 >> 2] | 0;
        }
        function Uv(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          a3 = a3 + 36 | 0;
          d2 = c2[a3 >> 2] | 0;
          if (d2 | 0) {
            vf(d2);
            sC(d2);
          }
          d2 = qC(4) | 0;
          Og(d2, b3);
          c2[a3 >> 2] = d2;
          return;
        }
        function Vv() {
          if (!(a2[11716] | 0)) {
            c2[2664] = 0;
            Ha(63, 10656, o2 | 0) | 0;
            a2[11716] = 1;
          }
          return 10656;
        }
        function Wv() {
          var b3 = 0;
          if (!(a2[11717] | 0)) {
            Xv();
            c2[2665] = 1504;
            a2[11717] = 1;
            b3 = 1504;
          } else b3 = c2[2665] | 0;
          return b3 | 0;
        }
        function Xv() {
          if (!(a2[11740] | 0)) {
            a2[11718] = ji(ji(8, 0) | 0, 0) | 0;
            a2[11719] = ji(ji(0, 0) | 0, 0) | 0;
            a2[11720] = ji(ji(0, 16) | 0, 0) | 0;
            a2[11721] = ji(ji(8, 0) | 0, 0) | 0;
            a2[11722] = ji(ji(0, 0) | 0, 0) | 0;
            a2[11723] = ji(ji(8, 0) | 0, 0) | 0;
            a2[11724] = ji(ji(0, 0) | 0, 0) | 0;
            a2[11725] = ji(ji(8, 0) | 0, 0) | 0;
            a2[11726] = ji(ji(0, 0) | 0, 0) | 0;
            a2[11727] = ji(ji(8, 0) | 0, 0) | 0;
            a2[11728] = ji(ji(0, 0) | 0, 0) | 0;
            a2[11729] = ji(ji(0, 0) | 0, 32) | 0;
            a2[11730] = ji(ji(0, 0) | 0, 32) | 0;
            a2[11740] = 1;
          }
          return;
        }
        function Yv() {
          return 1572;
        }
        function Zv(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          g2 = l2;
          l2 = l2 + 32 | 0;
          m2 = g2 + 16 | 0;
          k2 = g2 + 12 | 0;
          j2 = g2 + 8 | 0;
          i4 = g2 + 4 | 0;
          h3 = g2;
          c2[m2 >> 2] = a3;
          c2[k2 >> 2] = b3;
          c2[j2 >> 2] = d2;
          c2[i4 >> 2] = e2;
          c2[h3 >> 2] = f2;
          Vv() | 0;
          _v(10656, m2, k2, j2, i4, h3);
          l2 = g2;
          return;
        }
        function _v(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var h3 = 0;
          h3 = qC(24) | 0;
          ii(h3 + 4 | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0, c2[e2 >> 2] | 0, c2[f2 >> 2] | 0, c2[g2 >> 2] | 0);
          c2[h3 >> 2] = c2[a3 >> 2];
          c2[a3 >> 2] = h3;
          return;
        }
        function $v(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = 0;
          u2 = l2;
          l2 = l2 + 32 | 0;
          q2 = u2 + 20 | 0;
          r3 = u2 + 8 | 0;
          s3 = u2 + 4 | 0;
          t3 = u2;
          b3 = c2[b3 >> 2] | 0;
          if (b3 | 0) {
            p2 = q2 + 4 | 0;
            j2 = q2 + 8 | 0;
            k2 = r3 + 4 | 0;
            m2 = r3 + 8 | 0;
            n3 = r3 + 8 | 0;
            o3 = q2 + 8 | 0;
            do {
              h3 = b3 + 4 | 0;
              i4 = aw(h3) | 0;
              if (i4 | 0) {
                f2 = bw(i4) | 0;
                c2[q2 >> 2] = 0;
                c2[p2 >> 2] = 0;
                c2[j2 >> 2] = 0;
                e2 = (cw(i4) | 0) + 1 | 0;
                dw(q2, e2);
                if (e2 | 0) while (1) {
                  e2 = e2 + -1 | 0;
                  OA(r3, c2[f2 >> 2] | 0);
                  g2 = c2[p2 >> 2] | 0;
                  if (g2 >>> 0 < (c2[o3 >> 2] | 0) >>> 0) {
                    c2[g2 >> 2] = c2[r3 >> 2];
                    c2[p2 >> 2] = (c2[p2 >> 2] | 0) + 4;
                  } else ew(q2, r3);
                  if (!e2) break;
                  else f2 = f2 + 4 | 0;
                }
                e2 = fw(i4) | 0;
                c2[r3 >> 2] = 0;
                c2[k2 >> 2] = 0;
                c2[m2 >> 2] = 0;
                a: do
                  if (c2[e2 >> 2] | 0) {
                    f2 = 0;
                    g2 = 0;
                    while (1) {
                      if ((f2 | 0) == (g2 | 0)) gw(r3, e2);
                      else {
                        c2[f2 >> 2] = c2[e2 >> 2];
                        c2[k2 >> 2] = (c2[k2 >> 2] | 0) + 4;
                      }
                      e2 = e2 + 4 | 0;
                      if (!(c2[e2 >> 2] | 0)) break a;
                      f2 = c2[k2 >> 2] | 0;
                      g2 = c2[n3 >> 2] | 0;
                    }
                  }
                while (0);
                c2[s3 >> 2] = hw(h3) | 0;
                c2[t3 >> 2] = si(i4) | 0;
                iw(d2, a3, s3, t3, q2, r3);
                jw(r3);
                kw(q2);
              }
              b3 = c2[b3 >> 2] | 0;
            } while ((b3 | 0) != 0);
          }
          l2 = u2;
          return;
        }
        function aw(a3) {
          a3 = a3 | 0;
          return c2[a3 + 12 >> 2] | 0;
        }
        function bw(a3) {
          a3 = a3 | 0;
          return c2[a3 + 12 >> 2] | 0;
        }
        function cw(a3) {
          a3 = a3 | 0;
          return c2[a3 + 16 >> 2] | 0;
        }
        function dw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          d2 = f2;
          e2 = c2[a3 >> 2] | 0;
          if ((c2[a3 + 8 >> 2] | 0) - e2 >> 2 >>> 0 < b3 >>> 0) {
            Rw(d2, b3, (c2[a3 + 4 >> 2] | 0) - e2 >> 2, a3 + 8 | 0);
            Sw(a3, d2);
            Tw(d2);
          }
          l2 = f2;
          return;
        }
        function ew(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          d2 = h3;
          e2 = a3 + 4 | 0;
          f2 = ((c2[e2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 2) + 1 | 0;
          g2 = Nw(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            i4 = c2[a3 >> 2] | 0;
            k2 = (c2[a3 + 8 >> 2] | 0) - i4 | 0;
            j2 = k2 >> 1;
            Rw(d2, k2 >> 2 >>> 0 < g2 >>> 1 >>> 0 ? j2 >>> 0 < f2 >>> 0 ? f2 : j2 : g2, (c2[e2 >> 2] | 0) - i4 >> 2, a3 + 8 | 0);
            g2 = d2 + 8 | 0;
            c2[c2[g2 >> 2] >> 2] = c2[b3 >> 2];
            c2[g2 >> 2] = (c2[g2 >> 2] | 0) + 4;
            Sw(a3, d2);
            Tw(d2);
            l2 = h3;
            return;
          }
        }
        function fw(a3) {
          a3 = a3 | 0;
          return c2[a3 + 8 >> 2] | 0;
        }
        function gw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          d2 = h3;
          e2 = a3 + 4 | 0;
          f2 = ((c2[e2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 2) + 1 | 0;
          g2 = Kw(a3) | 0;
          if (g2 >>> 0 < f2 >>> 0) jC(a3);
          else {
            i4 = c2[a3 >> 2] | 0;
            k2 = (c2[a3 + 8 >> 2] | 0) - i4 | 0;
            j2 = k2 >> 1;
            Ow(d2, k2 >> 2 >>> 0 < g2 >>> 1 >>> 0 ? j2 >>> 0 < f2 >>> 0 ? f2 : j2 : g2, (c2[e2 >> 2] | 0) - i4 >> 2, a3 + 8 | 0);
            g2 = d2 + 8 | 0;
            c2[c2[g2 >> 2] >> 2] = c2[b3 >> 2];
            c2[g2 >> 2] = (c2[g2 >> 2] | 0) + 4;
            Pw(a3, d2);
            Qw(d2);
            l2 = h3;
            return;
          }
        }
        function hw(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function iw(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          lw(a3, b3, c3, d2, e2, f2);
          return;
        }
        function jw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -4 - e2 | 0) >>> 2) << 2);
            sC(d2);
          }
          return;
        }
        function kw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -4 - e2 | 0) >>> 2) << 2);
            sC(d2);
          }
          return;
        }
        function lw(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          h3 = l2;
          l2 = l2 + 48 | 0;
          m2 = h3 + 40 | 0;
          i4 = h3 + 32 | 0;
          n3 = h3 + 24 | 0;
          j2 = h3 + 12 | 0;
          k2 = h3;
          UA(i4);
          a3 = Sg(a3) | 0;
          c2[n3 >> 2] = c2[b3 >> 2];
          d2 = c2[d2 >> 2] | 0;
          e2 = c2[e2 >> 2] | 0;
          mw(j2, f2);
          nw(k2, g2);
          c2[m2 >> 2] = c2[n3 >> 2];
          ow(a3, m2, d2, e2, j2, k2);
          jw(k2);
          kw(j2);
          WA(i4);
          l2 = h3;
          return;
        }
        function mw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          c2[a3 >> 2] = 0;
          c2[a3 + 4 >> 2] = 0;
          c2[a3 + 8 >> 2] = 0;
          d2 = b3 + 4 | 0;
          e2 = (c2[d2 >> 2] | 0) - (c2[b3 >> 2] | 0) >> 2;
          if (e2 | 0) {
            Lw(a3, e2);
            Mw(a3, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0, e2);
          }
          return;
        }
        function nw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          c2[a3 >> 2] = 0;
          c2[a3 + 4 >> 2] = 0;
          c2[a3 + 8 >> 2] = 0;
          d2 = b3 + 4 | 0;
          e2 = (c2[d2 >> 2] | 0) - (c2[b3 >> 2] | 0) >> 2;
          if (e2 | 0) {
            Iw(a3, e2);
            Jw(a3, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0, e2);
          }
          return;
        }
        function ow(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          m2 = h3 + 28 | 0;
          n3 = h3 + 24 | 0;
          i4 = h3 + 12 | 0;
          j2 = h3;
          k2 = Vg(pw() | 0) | 0;
          c2[n3 >> 2] = c2[b3 >> 2];
          c2[m2 >> 2] = c2[n3 >> 2];
          b3 = qw(m2) | 0;
          d2 = rw(d2) | 0;
          e2 = sw(e2) | 0;
          c2[i4 >> 2] = c2[f2 >> 2];
          m2 = f2 + 4 | 0;
          c2[i4 + 4 >> 2] = c2[m2 >> 2];
          n3 = f2 + 8 | 0;
          c2[i4 + 8 >> 2] = c2[n3 >> 2];
          c2[n3 >> 2] = 0;
          c2[m2 >> 2] = 0;
          c2[f2 >> 2] = 0;
          f2 = tw(i4) | 0;
          c2[j2 >> 2] = c2[g2 >> 2];
          m2 = g2 + 4 | 0;
          c2[j2 + 4 >> 2] = c2[m2 >> 2];
          n3 = g2 + 8 | 0;
          c2[j2 + 8 >> 2] = c2[n3 >> 2];
          c2[n3 >> 2] = 0;
          c2[m2 >> 2] = 0;
          c2[g2 >> 2] = 0;
          Ba(0, k2 | 0, a3 | 0, b3 | 0, d2 | 0, e2 | 0, f2 | 0, uw(j2) | 0) | 0;
          jw(j2);
          kw(i4);
          l2 = h3;
          return;
        }
        function pw() {
          var b3 = 0;
          if (!(a2[7968] | 0)) {
            Gw(10708);
            b3 = 7968;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10708;
        }
        function qw(a3) {
          a3 = a3 | 0;
          return yw(a3) | 0;
        }
        function rw(a3) {
          a3 = a3 | 0;
          return ww(a3) | 0;
        }
        function sw(a3) {
          a3 = a3 | 0;
          return ul(a3) | 0;
        }
        function tw(a3) {
          a3 = a3 | 0;
          return xw(a3) | 0;
        }
        function uw(a3) {
          a3 = a3 | 0;
          return vw(a3) | 0;
        }
        function vw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          e2 = (c2[a3 + 4 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0;
          d2 = e2 >> 2;
          e2 = jy(e2 + 4 | 0) | 0;
          c2[e2 >> 2] = d2;
          if (d2 | 0) {
            b3 = 0;
            do {
              c2[e2 + 4 + (b3 << 2) >> 2] = ww(c2[(c2[a3 >> 2] | 0) + (b3 << 2) >> 2] | 0) | 0;
              b3 = b3 + 1 | 0;
            } while ((b3 | 0) != (d2 | 0));
          }
          return e2 | 0;
        }
        function ww(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function xw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          e2 = (c2[a3 + 4 >> 2] | 0) - (c2[a3 >> 2] | 0) | 0;
          d2 = e2 >> 2;
          e2 = jy(e2 + 4 | 0) | 0;
          c2[e2 >> 2] = d2;
          if (d2 | 0) {
            b3 = 0;
            do {
              c2[e2 + 4 + (b3 << 2) >> 2] = yw((c2[a3 >> 2] | 0) + (b3 << 2) | 0) | 0;
              b3 = b3 + 1 | 0;
            } while ((b3 | 0) != (d2 | 0));
          }
          return e2 | 0;
        }
        function yw(a3) {
          a3 = a3 | 0;
          var b3 = 0, c3 = 0, d2 = 0, e2 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          b3 = e2 + 12 | 0;
          c3 = e2;
          d2 = Di(zw() | 0) | 0;
          if (!d2) a3 = Aw(a3) | 0;
          else {
            Ei(b3, d2);
            Fi(c3, b3);
            RA(a3, c3);
            a3 = Hi(b3) | 0;
          }
          l2 = e2;
          return a3 | 0;
        }
        function zw() {
          var b3 = 0;
          if (!(a2[7960] | 0)) {
            Fw(10664);
            Ha(25, 10664, o2 | 0) | 0;
            b3 = 7960;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10664;
        }
        function Aw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          f2 = d2 + 4 | 0;
          h3 = d2;
          e2 = jy(8) | 0;
          b3 = e2;
          i4 = qC(4) | 0;
          c2[i4 >> 2] = c2[a3 >> 2];
          g2 = b3 + 4 | 0;
          c2[g2 >> 2] = i4;
          a3 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[h3 >> 2] = 0;
          c2[f2 >> 2] = c2[h3 >> 2];
          Bw(a3, g2, f2);
          c2[e2 >> 2] = a3;
          l2 = d2;
          return b3 | 0;
        }
        function Bw(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          d2 = qC(16) | 0;
          c2[d2 + 4 >> 2] = 0;
          c2[d2 + 8 >> 2] = 0;
          c2[d2 >> 2] = 1656;
          c2[d2 + 12 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Cw(a3) {
          a3 = a3 | 0;
          kC(a3);
          sC(a3);
          return;
        }
        function Dw(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 12 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Ew(a3) {
          a3 = a3 | 0;
          sC(a3);
          return;
        }
        function Fw(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function Gw(a3) {
          a3 = a3 | 0;
          fh(a3, Hw() | 0, 5);
          return;
        }
        function Hw() {
          return 1676;
        }
        function Iw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          if ((Kw(a3) | 0) >>> 0 < b3 >>> 0) jC(a3);
          if (b3 >>> 0 > 1073741823) Ta();
          else {
            d2 = qC(b3 << 2) | 0;
            c2[a3 + 4 >> 2] = d2;
            c2[a3 >> 2] = d2;
            c2[a3 + 8 >> 2] = d2 + (b3 << 2);
            return;
          }
        }
        function Jw(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          e2 = a3 + 4 | 0;
          a3 = d2 - b3 | 0;
          if ((a3 | 0) > 0) {
            BC(c2[e2 >> 2] | 0, b3 | 0, a3 | 0) | 0;
            c2[e2 >> 2] = (c2[e2 >> 2] | 0) + (a3 >>> 2 << 2);
          }
          return;
        }
        function Kw(a3) {
          a3 = a3 | 0;
          return 1073741823;
        }
        function Lw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          if ((Nw(a3) | 0) >>> 0 < b3 >>> 0) jC(a3);
          if (b3 >>> 0 > 1073741823) Ta();
          else {
            d2 = qC(b3 << 2) | 0;
            c2[a3 + 4 >> 2] = d2;
            c2[a3 >> 2] = d2;
            c2[a3 + 8 >> 2] = d2 + (b3 << 2);
            return;
          }
        }
        function Mw(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          e2 = a3 + 4 | 0;
          a3 = d2 - b3 | 0;
          if ((a3 | 0) > 0) {
            BC(c2[e2 >> 2] | 0, b3 | 0, a3 | 0) | 0;
            c2[e2 >> 2] = (c2[e2 >> 2] | 0) + (a3 >>> 2 << 2);
          }
          return;
        }
        function Nw(a3) {
          a3 = a3 | 0;
          return 1073741823;
        }
        function Ow(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 1073741823) Ta();
              else {
                f2 = qC(b3 << 2) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 2) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 2);
          return;
        }
        function Pw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 2) << 2) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Qw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -4 - b3 | 0) >>> 2) << 2);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Rw(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 1073741823) Ta();
              else {
                f2 = qC(b3 << 2) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 2) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 2);
          return;
        }
        function Sw(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 2) << 2) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Tw(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -4 - b3 | 0) >>> 2) << 2);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Uw(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0;
          r3 = l2;
          l2 = l2 + 32 | 0;
          m2 = r3 + 20 | 0;
          n3 = r3 + 12 | 0;
          k2 = r3 + 16 | 0;
          o3 = r3 + 4 | 0;
          p2 = r3;
          q2 = r3 + 8 | 0;
          i4 = Wv() | 0;
          g2 = c2[i4 >> 2] | 0;
          h3 = c2[g2 >> 2] | 0;
          if (h3 | 0) {
            j2 = c2[i4 + 8 >> 2] | 0;
            i4 = c2[i4 + 4 >> 2] | 0;
            while (1) {
              OA(m2, h3);
              Vw(a3, m2, i4, j2);
              g2 = g2 + 4 | 0;
              h3 = c2[g2 >> 2] | 0;
              if (!h3) break;
              else {
                j2 = j2 + 1 | 0;
                i4 = i4 + 1 | 0;
              }
            }
          }
          g2 = Yv() | 0;
          h3 = c2[g2 >> 2] | 0;
          if (h3 | 0) do {
            OA(m2, h3);
            c2[n3 >> 2] = c2[g2 + 4 >> 2];
            Ww(b3, m2, n3);
            g2 = g2 + 8 | 0;
            h3 = c2[g2 >> 2] | 0;
          } while ((h3 | 0) != 0);
          g2 = c2[(Iv() | 0) >> 2] | 0;
          if (g2 | 0) do {
            b3 = c2[g2 + 4 >> 2] | 0;
            OA(m2, c2[(Xw(b3) | 0) >> 2] | 0);
            c2[n3 >> 2] = Tv(b3) | 0;
            Yw(d2, m2, n3);
            g2 = c2[g2 >> 2] | 0;
          } while ((g2 | 0) != 0);
          OA(k2, 0);
          g2 = Vv() | 0;
          c2[m2 >> 2] = c2[k2 >> 2];
          $v(m2, g2, f2);
          g2 = c2[(Iv() | 0) >> 2] | 0;
          if (g2 | 0) {
            a3 = m2 + 4 | 0;
            b3 = m2 + 8 | 0;
            d2 = m2 + 8 | 0;
            do {
              j2 = c2[g2 + 4 >> 2] | 0;
              OA(n3, c2[(Xw(j2) | 0) >> 2] | 0);
              _w(o3, Zw(j2) | 0);
              h3 = c2[o3 >> 2] | 0;
              if (h3 | 0) {
                c2[m2 >> 2] = 0;
                c2[a3 >> 2] = 0;
                c2[b3 >> 2] = 0;
                do {
                  OA(p2, c2[(Xw(c2[h3 + 4 >> 2] | 0) | 0) >> 2] | 0);
                  i4 = c2[a3 >> 2] | 0;
                  if (i4 >>> 0 < (c2[d2 >> 2] | 0) >>> 0) {
                    c2[i4 >> 2] = c2[p2 >> 2];
                    c2[a3 >> 2] = (c2[a3 >> 2] | 0) + 4;
                  } else ew(m2, p2);
                  h3 = c2[h3 >> 2] | 0;
                } while ((h3 | 0) != 0);
                $w(e2, n3, m2);
                kw(m2);
              }
              c2[q2 >> 2] = c2[n3 >> 2];
              k2 = ax(j2) | 0;
              c2[m2 >> 2] = c2[q2 >> 2];
              $v(m2, k2, f2);
              Wi(o3);
              g2 = c2[g2 >> 2] | 0;
            } while ((g2 | 0) != 0);
          }
          l2 = r3;
          return;
        }
        function Vw(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          ox(a3, b3, c3, d2);
          return;
        }
        function Ww(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          nx(a3, b3, c3);
          return;
        }
        function Xw(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Yw(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          ix(a3, b3, c3);
          return;
        }
        function Zw(a3) {
          a3 = a3 | 0;
          return a3 + 16 | 0;
        }
        function _w(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2 + 8 | 0;
          d2 = g2;
          c2[a3 >> 2] = 0;
          e2 = c2[b3 >> 2] | 0;
          c2[f2 >> 2] = e2;
          c2[d2 >> 2] = a3;
          d2 = gx(d2) | 0;
          if (e2 | 0) {
            e2 = qC(12) | 0;
            h3 = (hx(f2) | 0) + 4 | 0;
            a3 = c2[h3 + 4 >> 2] | 0;
            b3 = e2 + 4 | 0;
            c2[b3 >> 2] = c2[h3 >> 2];
            c2[b3 + 4 >> 2] = a3;
            b3 = c2[c2[f2 >> 2] >> 2] | 0;
            c2[f2 >> 2] = b3;
            if (!b3) a3 = e2;
            else {
              b3 = e2;
              while (1) {
                a3 = qC(12) | 0;
                j2 = (hx(f2) | 0) + 4 | 0;
                i4 = c2[j2 + 4 >> 2] | 0;
                h3 = a3 + 4 | 0;
                c2[h3 >> 2] = c2[j2 >> 2];
                c2[h3 + 4 >> 2] = i4;
                c2[b3 >> 2] = a3;
                h3 = c2[c2[f2 >> 2] >> 2] | 0;
                c2[f2 >> 2] = h3;
                if (!h3) break;
                else b3 = a3;
              }
            }
            c2[a3 >> 2] = c2[d2 >> 2];
            c2[d2 >> 2] = e2;
          }
          l2 = g2;
          return;
        }
        function $w(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          bx(a3, b3, c3);
          return;
        }
        function ax(a3) {
          a3 = a3 | 0;
          return a3 + 24 | 0;
        }
        function bx(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          h3 = e2 + 24 | 0;
          f2 = e2 + 16 | 0;
          i4 = e2 + 12 | 0;
          g2 = e2;
          UA(f2);
          a3 = Sg(a3) | 0;
          c2[i4 >> 2] = c2[b3 >> 2];
          mw(g2, d2);
          c2[h3 >> 2] = c2[i4 >> 2];
          cx(a3, h3, g2);
          kw(g2);
          WA(f2);
          l2 = e2;
          return;
        }
        function cx(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          h3 = e2 + 16 | 0;
          i4 = e2 + 12 | 0;
          f2 = e2;
          g2 = Vg(dx() | 0) | 0;
          c2[i4 >> 2] = c2[b3 >> 2];
          c2[h3 >> 2] = c2[i4 >> 2];
          b3 = qw(h3) | 0;
          c2[f2 >> 2] = c2[d2 >> 2];
          h3 = d2 + 4 | 0;
          c2[f2 + 4 >> 2] = c2[h3 >> 2];
          i4 = d2 + 8 | 0;
          c2[f2 + 8 >> 2] = c2[i4 >> 2];
          c2[i4 >> 2] = 0;
          c2[h3 >> 2] = 0;
          c2[d2 >> 2] = 0;
          xa(0, g2 | 0, a3 | 0, b3 | 0, tw(f2) | 0) | 0;
          kw(f2);
          l2 = e2;
          return;
        }
        function dx() {
          var b3 = 0;
          if (!(a2[7976] | 0)) {
            ex(10720);
            b3 = 7976;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10720;
        }
        function ex(a3) {
          a3 = a3 | 0;
          fh(a3, fx() | 0, 2);
          return;
        }
        function fx() {
          return 1732;
        }
        function gx(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function hx(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function ix(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          g2 = e2 + 16 | 0;
          f2 = e2 + 8 | 0;
          h3 = e2;
          UA(f2);
          a3 = Sg(a3) | 0;
          c2[h3 >> 2] = c2[b3 >> 2];
          d2 = c2[d2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          jx(a3, g2, d2);
          WA(f2);
          l2 = e2;
          return;
        }
        function jx(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          g2 = e2 + 4 | 0;
          h3 = e2;
          f2 = Vg(kx() | 0) | 0;
          c2[h3 >> 2] = c2[b3 >> 2];
          c2[g2 >> 2] = c2[h3 >> 2];
          b3 = qw(g2) | 0;
          xa(0, f2 | 0, a3 | 0, b3 | 0, rw(d2) | 0) | 0;
          l2 = e2;
          return;
        }
        function kx() {
          var b3 = 0;
          if (!(a2[7984] | 0)) {
            lx(10732);
            b3 = 7984;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10732;
        }
        function lx(a3) {
          a3 = a3 | 0;
          fh(a3, mx() | 0, 2);
          return;
        }
        function mx() {
          return 1744;
        }
        function nx(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          g2 = e2 + 16 | 0;
          f2 = e2 + 8 | 0;
          h3 = e2;
          UA(f2);
          a3 = Sg(a3) | 0;
          c2[h3 >> 2] = c2[b3 >> 2];
          d2 = c2[d2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          jx(a3, g2, d2);
          WA(f2);
          l2 = e2;
          return;
        }
        function ox(b3, d2, e2, f2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          g2 = l2;
          l2 = l2 + 32 | 0;
          i4 = g2 + 16 | 0;
          h3 = g2 + 8 | 0;
          j2 = g2;
          UA(h3);
          b3 = Sg(b3) | 0;
          c2[j2 >> 2] = c2[d2 >> 2];
          e2 = a2[e2 >> 0] | 0;
          f2 = a2[f2 >> 0] | 0;
          c2[i4 >> 2] = c2[j2 >> 2];
          px(b3, i4, e2, f2);
          WA(h3);
          l2 = g2;
          return;
        }
        function px(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          h3 = f2 + 4 | 0;
          i4 = f2;
          g2 = Vg(qx() | 0) | 0;
          c2[i4 >> 2] = c2[b3 >> 2];
          c2[h3 >> 2] = c2[i4 >> 2];
          b3 = qw(h3) | 0;
          d2 = rx(d2) | 0;
          $a(0, g2 | 0, a3 | 0, b3 | 0, d2 | 0, rx(e2) | 0) | 0;
          l2 = f2;
          return;
        }
        function qx() {
          var b3 = 0;
          if (!(a2[7992] | 0)) {
            tx(10744);
            b3 = 7992;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10744;
        }
        function rx(a3) {
          a3 = a3 | 0;
          return sx(a3) | 0;
        }
        function sx(a3) {
          a3 = a3 | 0;
          return a3 & 255 | 0;
        }
        function tx(a3) {
          a3 = a3 | 0;
          fh(a3, ux() | 0, 3);
          return;
        }
        function ux() {
          return 1756;
        }
        function vx(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0;
          p2 = l2;
          l2 = l2 + 32 | 0;
          j2 = p2 + 8 | 0;
          k2 = p2 + 4 | 0;
          m2 = p2 + 20 | 0;
          n3 = p2;
          mk(b3, 0);
          f2 = QA(d2) | 0;
          c2[j2 >> 2] = 0;
          o3 = j2 + 4 | 0;
          c2[o3 >> 2] = 0;
          c2[j2 + 8 >> 2] = 0;
          switch (f2 << 24 >> 24) {
            case 0: {
              a2[m2 >> 0] = 0;
              wx(k2, e2, m2);
              xx(b3, k2) | 0;
              wf(k2);
              break;
            }
            case 8: {
              o3 = PA(d2) | 0;
              a2[m2 >> 0] = 8;
              OA(n3, c2[o3 + 4 >> 2] | 0);
              yx(k2, e2, m2, n3, o3 + 8 | 0);
              xx(b3, k2) | 0;
              wf(k2);
              break;
            }
            case 9: {
              h3 = PA(d2) | 0;
              d2 = c2[h3 + 4 >> 2] | 0;
              if (d2 | 0) {
                i4 = j2 + 8 | 0;
                g2 = h3 + 12 | 0;
                while (1) {
                  d2 = d2 + -1 | 0;
                  OA(k2, c2[g2 >> 2] | 0);
                  f2 = c2[o3 >> 2] | 0;
                  if (f2 >>> 0 < (c2[i4 >> 2] | 0) >>> 0) {
                    c2[f2 >> 2] = c2[k2 >> 2];
                    c2[o3 >> 2] = (c2[o3 >> 2] | 0) + 4;
                  } else ew(j2, k2);
                  if (!d2) break;
                  else g2 = g2 + 4 | 0;
                }
              }
              a2[m2 >> 0] = 9;
              OA(n3, c2[h3 + 8 >> 2] | 0);
              zx(k2, e2, m2, n3, j2);
              xx(b3, k2) | 0;
              wf(k2);
              break;
            }
            default: {
              o3 = PA(d2) | 0;
              a2[m2 >> 0] = f2;
              OA(n3, c2[o3 + 4 >> 2] | 0);
              Ax(k2, e2, m2, n3);
              xx(b3, k2) | 0;
              wf(k2);
            }
          }
          kw(j2);
          l2 = p2;
          return;
        }
        function wx(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          e2 = l2;
          l2 = l2 + 16 | 0;
          f2 = e2;
          UA(f2);
          c3 = Sg(c3) | 0;
          Ox(b3, c3, a2[d2 >> 0] | 0);
          WA(f2);
          l2 = e2;
          return;
        }
        function xx(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = c2[a3 >> 2] | 0;
          if (d2 | 0) ab(d2 | 0);
          c2[a3 >> 2] = c2[b3 >> 2];
          c2[b3 >> 2] = 0;
          return a3 | 0;
        }
        function yx(b3, d2, e2, f2, g2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var h3 = 0, i4 = 0, j2 = 0, k2 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          j2 = h3 + 16 | 0;
          i4 = h3 + 8 | 0;
          k2 = h3;
          UA(i4);
          d2 = Sg(d2) | 0;
          e2 = a2[e2 >> 0] | 0;
          c2[k2 >> 2] = c2[f2 >> 2];
          g2 = c2[g2 >> 2] | 0;
          c2[j2 >> 2] = c2[k2 >> 2];
          Kx(b3, d2, e2, j2, g2);
          WA(i4);
          l2 = h3;
          return;
        }
        function zx(b3, d2, e2, f2, g2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          var h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          h3 = l2;
          l2 = l2 + 32 | 0;
          k2 = h3 + 24 | 0;
          i4 = h3 + 16 | 0;
          m2 = h3 + 12 | 0;
          j2 = h3;
          UA(i4);
          d2 = Sg(d2) | 0;
          e2 = a2[e2 >> 0] | 0;
          c2[m2 >> 2] = c2[f2 >> 2];
          mw(j2, g2);
          c2[k2 >> 2] = c2[m2 >> 2];
          Gx(b3, d2, e2, k2, j2);
          kw(j2);
          WA(i4);
          l2 = h3;
          return;
        }
        function Ax(b3, d2, e2, f2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          g2 = l2;
          l2 = l2 + 32 | 0;
          i4 = g2 + 16 | 0;
          h3 = g2 + 8 | 0;
          j2 = g2;
          UA(h3);
          d2 = Sg(d2) | 0;
          e2 = a2[e2 >> 0] | 0;
          c2[j2 >> 2] = c2[f2 >> 2];
          c2[i4 >> 2] = c2[j2 >> 2];
          Bx(b3, d2, e2, i4);
          WA(h3);
          l2 = g2;
          return;
        }
        function Bx(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          g2 = f2 + 4 | 0;
          i4 = f2;
          h3 = Vg(Cx() | 0) | 0;
          d2 = rx(d2) | 0;
          c2[i4 >> 2] = c2[e2 >> 2];
          c2[g2 >> 2] = c2[i4 >> 2];
          Dx(a3, xa(0, h3 | 0, b3 | 0, d2 | 0, qw(g2) | 0) | 0);
          l2 = f2;
          return;
        }
        function Cx() {
          var b3 = 0;
          if (!(a2[8e3] | 0)) {
            Ex(10756);
            b3 = 8e3;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10756;
        }
        function Dx(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          mk(a3, b3);
          return;
        }
        function Ex(a3) {
          a3 = a3 | 0;
          fh(a3, Fx() | 0, 2);
          return;
        }
        function Fx() {
          return 1772;
        }
        function Gx(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0;
          g2 = l2;
          l2 = l2 + 32 | 0;
          j2 = g2 + 16 | 0;
          k2 = g2 + 12 | 0;
          h3 = g2;
          i4 = Vg(Hx() | 0) | 0;
          d2 = rx(d2) | 0;
          c2[k2 >> 2] = c2[e2 >> 2];
          c2[j2 >> 2] = c2[k2 >> 2];
          e2 = qw(j2) | 0;
          c2[h3 >> 2] = c2[f2 >> 2];
          j2 = f2 + 4 | 0;
          c2[h3 + 4 >> 2] = c2[j2 >> 2];
          k2 = f2 + 8 | 0;
          c2[h3 + 8 >> 2] = c2[k2 >> 2];
          c2[k2 >> 2] = 0;
          c2[j2 >> 2] = 0;
          c2[f2 >> 2] = 0;
          Dx(a3, $a(0, i4 | 0, b3 | 0, d2 | 0, e2 | 0, tw(h3) | 0) | 0);
          kw(h3);
          l2 = g2;
          return;
        }
        function Hx() {
          var b3 = 0;
          if (!(a2[8008] | 0)) {
            Ix(10768);
            b3 = 8008;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10768;
        }
        function Ix(a3) {
          a3 = a3 | 0;
          fh(a3, Jx() | 0, 3);
          return;
        }
        function Jx() {
          return 1784;
        }
        function Kx(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          i4 = g2 + 4 | 0;
          j2 = g2;
          h3 = Vg(Lx() | 0) | 0;
          d2 = rx(d2) | 0;
          c2[j2 >> 2] = c2[e2 >> 2];
          c2[i4 >> 2] = c2[j2 >> 2];
          e2 = qw(i4) | 0;
          Dx(a3, $a(0, h3 | 0, b3 | 0, d2 | 0, e2 | 0, sw(f2) | 0) | 0);
          l2 = g2;
          return;
        }
        function Lx() {
          var b3 = 0;
          if (!(a2[8016] | 0)) {
            Mx(10780);
            b3 = 8016;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10780;
        }
        function Mx(a3) {
          a3 = a3 | 0;
          fh(a3, Nx() | 0, 3);
          return;
        }
        function Nx() {
          return 1800;
        }
        function Ox(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          var d2 = 0;
          d2 = Vg(Px() | 0) | 0;
          Dx(a3, bb(0, d2 | 0, b3 | 0, rx(c3) | 0) | 0);
          return;
        }
        function Px() {
          var b3 = 0;
          if (!(a2[8024] | 0)) {
            Qx(10792);
            b3 = 8024;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 10792;
        }
        function Qx(a3) {
          a3 = a3 | 0;
          fh(a3, Rx() | 0, 1);
          return;
        }
        function Rx() {
          return 1816;
        }
        function Sx() {
          Tx();
          Ux();
          Vx();
          return;
        }
        function Tx() {
          c2[2702] = rC(65536) | 0;
          return;
        }
        function Ux() {
          qy(10856);
          return;
        }
        function Vx() {
          Wx(10816);
          return;
        }
        function Wx(a3) {
          a3 = a3 | 0;
          Xx(a3, 5044);
          Yx(a3) | 0;
          return;
        }
        function Xx(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = zw() | 0;
          c2[a3 >> 2] = d2;
          ky(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function Yx(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, Zx() | 0);
          return a3 | 0;
        }
        function Zx() {
          var b3 = 0;
          if (!(a2[8032] | 0)) {
            _x(10820);
            Ha(64, 10820, o2 | 0) | 0;
            b3 = 8032;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(10820) | 0)) _x(10820);
          return 10820;
        }
        function _x(a3) {
          a3 = a3 | 0;
          by(a3);
          Gt(a3, 25);
          return;
        }
        function $x(a3) {
          a3 = a3 | 0;
          ay(a3 + 24 | 0);
          return;
        }
        function ay(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function by(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 18, b3, gy() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function cy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          dy(a3, b3);
          return;
        }
        function dy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          f2 = d2 + 4 | 0;
          Gk(f2, b3);
          c2[e2 >> 2] = Hk(f2, b3) | 0;
          ey(a3, e2);
          l2 = d2;
          return;
        }
        function ey(b3, d2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          fy(b3 + 4 | 0, c2[d2 >> 2] | 0);
          a2[b3 + 8 >> 0] = 1;
          return;
        }
        function fy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = b3;
          return;
        }
        function gy() {
          return 1824;
        }
        function hy(a3) {
          a3 = a3 | 0;
          return iy(a3) | 0;
        }
        function iy(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          f2 = d2 + 4 | 0;
          h3 = d2;
          e2 = jy(8) | 0;
          b3 = e2;
          i4 = qC(4) | 0;
          Gk(f2, a3);
          fy(i4, Hk(f2, a3) | 0);
          g2 = b3 + 4 | 0;
          c2[g2 >> 2] = i4;
          a3 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[h3 >> 2] = 0;
          c2[f2 >> 2] = c2[h3 >> 2];
          Bw(a3, g2, f2);
          c2[e2 >> 2] = a3;
          l2 = d2;
          return b3 | 0;
        }
        function jy(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          a3 = a3 + 7 & -8;
          if (a3 >>> 0 <= 32768 ? (b3 = c2[2701] | 0, a3 >>> 0 <= (65536 - b3 | 0) >>> 0) : 0) {
            d2 = (c2[2702] | 0) + b3 | 0;
            c2[2701] = b3 + a3;
            a3 = d2;
          } else {
            a3 = rC(a3 + 8 | 0) | 0;
            c2[a3 >> 2] = c2[2703];
            c2[2703] = a3;
            a3 = a3 + 8 | 0;
          }
          return a3 | 0;
        }
        function ky(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = ly() | 0;
          c2[a3 + 4 >> 2] = my() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = ny() | 0;
          c2[a3 + 32 >> 2] = 9;
          return;
        }
        function ly() {
          return 11744;
        }
        function my() {
          return 1832;
        }
        function ny() {
          return cu() | 0;
        }
        function oy(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              py(c3);
              sC(c3);
            }
          } else if (b3 | 0) sC(b3);
          return;
        }
        function py(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function qy(a3) {
          a3 = a3 | 0;
          ry(a3, 5052);
          sy(a3) | 0;
          ty(a3, 5058, 26) | 0;
          uy(a3, 5069, 1) | 0;
          vy(a3, 5077, 10) | 0;
          wy(a3, 5087, 19) | 0;
          yy(a3, 5094, 27) | 0;
          return;
        }
        function ry(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = GA() | 0;
          c2[a3 >> 2] = d2;
          HA(d2, b3);
          Hv(c2[a3 >> 2] | 0);
          return;
        }
        function sy(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          At(b3, rA() | 0);
          return a3 | 0;
        }
        function ty(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Yz(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function uy(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Gz(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function vy(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          hz(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function wy(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Ry(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function xy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          a: while (1) {
            d2 = c2[2703] | 0;
            while (1) {
              if ((d2 | 0) == (b3 | 0)) break a;
              e2 = c2[d2 >> 2] | 0;
              c2[2703] = e2;
              if (!d2) d2 = e2;
              else break;
            }
            sC(d2);
          }
          c2[2701] = a3;
          return;
        }
        function yy(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          zy(a3, ai(b3) | 0, c3, 0);
          return a3 | 0;
        }
        function zy(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Ay() | 0;
          a3 = By(d2) | 0;
          fi(g2, b3, f2, a3, Cy(d2, e2) | 0, e2);
          return;
        }
        function Ay() {
          var b3 = 0, d2 = 0;
          if (!(a2[8040] | 0)) {
            Jy(10860);
            Ha(65, 10860, o2 | 0) | 0;
            d2 = 8040;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10860) | 0)) {
            b3 = 10860;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Jy(10860);
          }
          return 10860;
        }
        function By(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Cy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Ay() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            Dy(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            Ey(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function Dy(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Ey(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = Fy(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            Gy(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            Dy(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            Hy(a3, f2);
            Iy(f2);
            l2 = i4;
            return;
          }
        }
        function Fy(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function Gy(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function Hy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Iy(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Jy(a3) {
          a3 = a3 | 0;
          My(a3);
          return;
        }
        function Ky(a3) {
          a3 = a3 | 0;
          Ly(a3 + 24 | 0);
          return;
        }
        function Ly(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function My(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 11, b3, Ny() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Ny() {
          return 1840;
        }
        function Oy(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          Qy(c2[(Py(a3) | 0) >> 2] | 0, b3, d2);
          return;
        }
        function Py(a3) {
          a3 = a3 | 0;
          return (c2[(Ay() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function Qy(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          f2 = d2 + 1 | 0;
          e2 = d2;
          Gk(f2, b3);
          b3 = Hk(f2, b3) | 0;
          Gk(e2, c3);
          c3 = Hk(e2, c3) | 0;
          ob[a3 & 31](b3, c3);
          l2 = d2;
          return;
        }
        function Ry(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Sy() | 0;
          a3 = Ty(d2) | 0;
          fi(g2, b3, f2, a3, Uy(d2, e2) | 0, e2);
          return;
        }
        function Sy() {
          var b3 = 0, d2 = 0;
          if (!(a2[8048] | 0)) {
            $y(10896);
            Ha(66, 10896, o2 | 0) | 0;
            d2 = 8048;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10896) | 0)) {
            b3 = 10896;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            $y(10896);
          }
          return 10896;
        }
        function Ty(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Uy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Sy() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            Vy(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            Wy(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function Vy(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Wy(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = Xy(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            Yy(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            Vy(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            Zy(a3, f2);
            _y(f2);
            l2 = i4;
            return;
          }
        }
        function Xy(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function Yy(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function Zy(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function _y(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function $y(a3) {
          a3 = a3 | 0;
          cz(a3);
          return;
        }
        function az(a3) {
          a3 = a3 | 0;
          bz(a3 + 24 | 0);
          return;
        }
        function bz(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function cz(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 11, b3, dz() | 0, 1);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function dz() {
          return 1852;
        }
        function ez(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return gz(c2[(fz(a3) | 0) >> 2] | 0, b3) | 0;
        }
        function fz(a3) {
          a3 = a3 | 0;
          return (c2[(Sy() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function gz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0, d2 = 0;
          c3 = l2;
          l2 = l2 + 16 | 0;
          d2 = c3;
          Gk(d2, b3);
          b3 = Hk(d2, b3) | 0;
          b3 = ul(pb[a3 & 31](b3) | 0) | 0;
          l2 = c3;
          return b3 | 0;
        }
        function hz(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = iz() | 0;
          a3 = jz(d2) | 0;
          fi(g2, b3, f2, a3, kz(d2, e2) | 0, e2);
          return;
        }
        function iz() {
          var b3 = 0, d2 = 0;
          if (!(a2[8056] | 0)) {
            rz(10932);
            Ha(67, 10932, o2 | 0) | 0;
            d2 = 8056;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10932) | 0)) {
            b3 = 10932;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            rz(10932);
          }
          return 10932;
        }
        function jz(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function kz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = iz() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            lz(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            mz(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function lz(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function mz(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = nz(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            oz(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            lz(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            pz(a3, f2);
            qz(f2);
            l2 = i4;
            return;
          }
        }
        function nz(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function oz(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function pz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function qz(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function rz(a3) {
          a3 = a3 | 0;
          uz(a3);
          return;
        }
        function sz(a3) {
          a3 = a3 | 0;
          tz(a3 + 24 | 0);
          return;
        }
        function tz(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function uz(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 7, b3, vz() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function vz() {
          return 1860;
        }
        function wz(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          return yz(c2[(xz(a3) | 0) >> 2] | 0, b3, d2) | 0;
        }
        function xz(a3) {
          a3 = a3 | 0;
          return (c2[(iz() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function yz(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          e2 = l2;
          l2 = l2 + 32 | 0;
          h3 = e2 + 12 | 0;
          g2 = e2 + 8 | 0;
          i4 = e2;
          j2 = e2 + 16 | 0;
          f2 = e2 + 4 | 0;
          zz(j2, b3);
          Az(i4, j2, b3);
          ik(f2, d2);
          d2 = jk(f2, d2) | 0;
          c2[h3 >> 2] = c2[i4 >> 2];
          Eb[a3 & 15](g2, h3, d2);
          d2 = Bz(g2) | 0;
          wf(g2);
          kk(f2);
          l2 = e2;
          return d2 | 0;
        }
        function zz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function Az(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          Cz(a3, c3);
          return;
        }
        function Bz(a3) {
          a3 = a3 | 0;
          return Sg(a3) | 0;
        }
        function Cz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          f2 = l2;
          l2 = l2 + 16 | 0;
          d2 = f2;
          e2 = b3;
          if (!(e2 & 1)) c2[a3 >> 2] = c2[b3 >> 2];
          else {
            Dz(d2, 0);
            Ja(e2 | 0, d2 | 0) | 0;
            Ez(a3, d2);
            Fz(d2);
          }
          l2 = f2;
          return;
        }
        function Dz(b3, d2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          ah(b3, d2);
          c2[b3 + 4 >> 2] = 0;
          a2[b3 + 8 >> 0] = 0;
          return;
        }
        function Ez(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = c2[b3 + 4 >> 2];
          return;
        }
        function Fz(b3) {
          b3 = b3 | 0;
          a2[b3 + 8 >> 0] = 0;
          return;
        }
        function Gz(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Hz() | 0;
          a3 = Iz(d2) | 0;
          fi(g2, b3, f2, a3, Jz(d2, e2) | 0, e2);
          return;
        }
        function Hz() {
          var b3 = 0, d2 = 0;
          if (!(a2[8064] | 0)) {
            Qz(10968);
            Ha(68, 10968, o2 | 0) | 0;
            d2 = 8064;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(10968) | 0)) {
            b3 = 10968;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            Qz(10968);
          }
          return 10968;
        }
        function Iz(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function Jz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Hz() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            Kz(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            Lz(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function Kz(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function Lz(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = Mz(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            Nz(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            Kz(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            Oz(a3, f2);
            Pz(f2);
            l2 = i4;
            return;
          }
        }
        function Mz(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function Nz(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function Oz(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function Pz(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function Qz(a3) {
          a3 = a3 | 0;
          Tz(a3);
          return;
        }
        function Rz(a3) {
          a3 = a3 | 0;
          Sz(a3 + 24 | 0);
          return;
        }
        function Sz(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function Tz(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 1, b3, Uz() | 0, 5);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function Uz() {
          return 1872;
        }
        function Vz(a3, b3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          Xz(c2[(Wz(a3) | 0) >> 2] | 0, b3, d2, e2, f2, g2);
          return;
        }
        function Wz(a3) {
          a3 = a3 | 0;
          return (c2[(Hz() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function Xz(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          g2 = l2;
          l2 = l2 + 32 | 0;
          h3 = g2 + 16 | 0;
          i4 = g2 + 12 | 0;
          j2 = g2 + 8 | 0;
          k2 = g2 + 4 | 0;
          m2 = g2;
          ik(h3, b3);
          b3 = jk(h3, b3) | 0;
          ik(i4, c3);
          c3 = jk(i4, c3) | 0;
          ik(j2, d2);
          d2 = jk(j2, d2) | 0;
          ik(k2, e2);
          e2 = jk(k2, e2) | 0;
          ik(m2, f2);
          f2 = jk(m2, f2) | 0;
          jb[a3 & 1](b3, c3, d2, e2, f2);
          kk(m2);
          kk(k2);
          kk(j2);
          kk(i4);
          kk(h3);
          l2 = g2;
          return;
        }
        function Yz(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = c2[a3 >> 2] | 0;
          f2 = Zz() | 0;
          a3 = _z(d2) | 0;
          fi(g2, b3, f2, a3, $z(d2, e2) | 0, e2);
          return;
        }
        function Zz() {
          var b3 = 0, d2 = 0;
          if (!(a2[8072] | 0)) {
            gA(11004);
            Ha(69, 11004, o2 | 0) | 0;
            d2 = 8072;
            c2[d2 >> 2] = 1;
            c2[d2 + 4 >> 2] = 0;
          }
          if (!(si(11004) | 0)) {
            b3 = 11004;
            d2 = b3 + 36 | 0;
            do {
              c2[b3 >> 2] = 0;
              b3 = b3 + 4 | 0;
            } while ((b3 | 0) < (d2 | 0));
            gA(11004);
          }
          return 11004;
        }
        function _z(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function $z(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          i4 = l2;
          l2 = l2 + 16 | 0;
          f2 = i4;
          g2 = i4 + 4 | 0;
          c2[f2 >> 2] = a3;
          j2 = Zz() | 0;
          h3 = j2 + 24 | 0;
          b3 = ji(b3, 4) | 0;
          c2[g2 >> 2] = b3;
          d2 = j2 + 28 | 0;
          e2 = c2[d2 >> 2] | 0;
          if (e2 >>> 0 < (c2[j2 + 32 >> 2] | 0) >>> 0) {
            aA(e2, a3, b3);
            b3 = (c2[d2 >> 2] | 0) + 8 | 0;
            c2[d2 >> 2] = b3;
          } else {
            bA(h3, f2, g2);
            b3 = c2[d2 >> 2] | 0;
          }
          l2 = i4;
          return (b3 - (c2[h3 >> 2] | 0) >> 3) + -1 | 0;
        }
        function aA(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function bA(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0;
          i4 = l2;
          l2 = l2 + 32 | 0;
          f2 = i4;
          g2 = a3 + 4 | 0;
          h3 = ((c2[g2 >> 2] | 0) - (c2[a3 >> 2] | 0) >> 3) + 1 | 0;
          e2 = cA(a3) | 0;
          if (e2 >>> 0 < h3 >>> 0) jC(a3);
          else {
            j2 = c2[a3 >> 2] | 0;
            m2 = (c2[a3 + 8 >> 2] | 0) - j2 | 0;
            k2 = m2 >> 2;
            dA(f2, m2 >> 3 >>> 0 < e2 >>> 1 >>> 0 ? k2 >>> 0 < h3 >>> 0 ? h3 : k2 : e2, (c2[g2 >> 2] | 0) - j2 >> 3, a3 + 8 | 0);
            h3 = f2 + 8 | 0;
            aA(c2[h3 >> 2] | 0, c2[b3 >> 2] | 0, c2[d2 >> 2] | 0);
            c2[h3 >> 2] = (c2[h3 >> 2] | 0) + 8;
            eA(a3, f2);
            fA(f2);
            l2 = i4;
            return;
          }
        }
        function cA(a3) {
          a3 = a3 | 0;
          return 536870911;
        }
        function dA(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0;
          c2[a3 + 12 >> 2] = 0;
          c2[a3 + 16 >> 2] = e2;
          do
            if (b3) {
              if (b3 >>> 0 > 536870911) Ta();
              else {
                f2 = qC(b3 << 3) | 0;
                break;
              }
            } else f2 = 0;
          while (0);
          c2[a3 >> 2] = f2;
          e2 = f2 + (d2 << 3) | 0;
          c2[a3 + 8 >> 2] = e2;
          c2[a3 + 4 >> 2] = e2;
          c2[a3 + 12 >> 2] = f2 + (b3 << 3);
          return;
        }
        function eA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          e2 = c2[a3 >> 2] | 0;
          h3 = a3 + 4 | 0;
          g2 = b3 + 4 | 0;
          f2 = (c2[h3 >> 2] | 0) - e2 | 0;
          d2 = (c2[g2 >> 2] | 0) + (0 - (f2 >> 3) << 3) | 0;
          c2[g2 >> 2] = d2;
          if ((f2 | 0) > 0) {
            BC(d2 | 0, e2 | 0, f2 | 0) | 0;
            e2 = g2;
            d2 = c2[g2 >> 2] | 0;
          } else e2 = g2;
          g2 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = d2;
          c2[e2 >> 2] = g2;
          g2 = b3 + 8 | 0;
          f2 = c2[h3 >> 2] | 0;
          c2[h3 >> 2] = c2[g2 >> 2];
          c2[g2 >> 2] = f2;
          g2 = a3 + 8 | 0;
          h3 = b3 + 12 | 0;
          a3 = c2[g2 >> 2] | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[h3 >> 2] = a3;
          c2[b3 >> 2] = c2[e2 >> 2];
          return;
        }
        function fA(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          b3 = c2[a3 + 4 >> 2] | 0;
          d2 = a3 + 8 | 0;
          e2 = c2[d2 >> 2] | 0;
          if ((e2 | 0) != (b3 | 0)) c2[d2 >> 2] = e2 + (~((e2 + -8 - b3 | 0) >>> 3) << 3);
          a3 = c2[a3 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function gA(a3) {
          a3 = a3 | 0;
          jA(a3);
          return;
        }
        function hA(a3) {
          a3 = a3 | 0;
          iA(a3 + 24 | 0);
          return;
        }
        function iA(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function jA(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 1, 12, b3, kA() | 0, 2);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function kA() {
          return 1896;
        }
        function lA(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          nA(c2[(mA(a3) | 0) >> 2] | 0, b3, d2);
          return;
        }
        function mA(a3) {
          a3 = a3 | 0;
          return (c2[(Zz() | 0) + 24 >> 2] | 0) + (a3 << 3) | 0;
        }
        function nA(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          f2 = d2 + 4 | 0;
          e2 = d2;
          oA(f2, b3);
          b3 = pA(f2, b3) | 0;
          ik(e2, c3);
          c3 = jk(e2, c3) | 0;
          ob[a3 & 31](b3, c3);
          kk(e2);
          l2 = d2;
          return;
        }
        function oA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return;
        }
        function pA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return qA(b3) | 0;
        }
        function qA(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function rA() {
          var b3 = 0;
          if (!(a2[8080] | 0)) {
            sA(11040);
            Ha(70, 11040, o2 | 0) | 0;
            b3 = 8080;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          if (!(si(11040) | 0)) sA(11040);
          return 11040;
        }
        function sA(a3) {
          a3 = a3 | 0;
          vA(a3);
          Gt(a3, 71);
          return;
        }
        function tA(a3) {
          a3 = a3 | 0;
          uA(a3 + 24 | 0);
          return;
        }
        function uA(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0;
          d2 = c2[a3 >> 2] | 0;
          e2 = d2;
          if (d2 | 0) {
            a3 = a3 + 4 | 0;
            b3 = c2[a3 >> 2] | 0;
            if ((b3 | 0) != (d2 | 0)) c2[a3 >> 2] = b3 + (~((b3 + -8 - e2 | 0) >>> 3) << 3);
            sC(d2);
          }
          return;
        }
        function vA(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = vi() | 0;
          yi(a3, 5, 7, b3, zA() | 0, 0);
          c2[a3 + 24 >> 2] = 0;
          c2[a3 + 28 >> 2] = 0;
          c2[a3 + 32 >> 2] = 0;
          return;
        }
        function wA(a3) {
          a3 = a3 | 0;
          xA(a3);
          return;
        }
        function xA(a3) {
          a3 = a3 | 0;
          yA(a3);
          return;
        }
        function yA(b3) {
          b3 = b3 | 0;
          a2[b3 + 8 >> 0] = 1;
          return;
        }
        function zA() {
          return 1936;
        }
        function AA() {
          return BA() | 0;
        }
        function BA() {
          var a3 = 0, b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0;
          b3 = l2;
          l2 = l2 + 16 | 0;
          f2 = b3 + 4 | 0;
          h3 = b3;
          d2 = jy(8) | 0;
          a3 = d2;
          g2 = a3 + 4 | 0;
          c2[g2 >> 2] = qC(1) | 0;
          e2 = qC(8) | 0;
          g2 = c2[g2 >> 2] | 0;
          c2[h3 >> 2] = 0;
          c2[f2 >> 2] = c2[h3 >> 2];
          CA(e2, g2, f2);
          c2[d2 >> 2] = e2;
          l2 = b3;
          return a3 | 0;
        }
        function CA(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          c2[a3 >> 2] = b3;
          d2 = qC(16) | 0;
          c2[d2 + 4 >> 2] = 0;
          c2[d2 + 8 >> 2] = 0;
          c2[d2 >> 2] = 1916;
          c2[d2 + 12 >> 2] = b3;
          c2[a3 + 4 >> 2] = d2;
          return;
        }
        function DA(a3) {
          a3 = a3 | 0;
          kC(a3);
          sC(a3);
          return;
        }
        function EA(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 12 >> 2] | 0;
          if (a3 | 0) sC(a3);
          return;
        }
        function FA(a3) {
          a3 = a3 | 0;
          sC(a3);
          return;
        }
        function GA() {
          var b3 = 0;
          if (!(a2[8088] | 0)) {
            NA(11076);
            Ha(25, 11076, o2 | 0) | 0;
            b3 = 8088;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 11076;
        }
        function HA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = IA() | 0;
          c2[a3 + 4 >> 2] = JA() | 0;
          c2[a3 + 12 >> 2] = b3;
          c2[a3 + 8 >> 2] = KA() | 0;
          c2[a3 + 32 >> 2] = 10;
          return;
        }
        function IA() {
          return 11745;
        }
        function JA() {
          return 1940;
        }
        function KA() {
          return lr() | 0;
        }
        function LA(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if ((jr(d2, 896) | 0) == 512) {
            if (c3 | 0) {
              MA(c3);
              sC(c3);
            }
          } else if (b3 | 0) sC(b3);
          return;
        }
        function MA(a3) {
          a3 = a3 | 0;
          a3 = c2[a3 + 4 >> 2] | 0;
          if (a3 | 0) oC(a3);
          return;
        }
        function NA(a3) {
          a3 = a3 | 0;
          Zi(a3);
          return;
        }
        function OA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c2[a3 >> 2] = b3;
          return;
        }
        function PA(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function QA(b3) {
          b3 = b3 | 0;
          return a2[c2[b3 >> 2] >> 0] | 0;
        }
        function RA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          c2[e2 >> 2] = c2[a3 >> 2];
          SA(b3, e2) | 0;
          l2 = d2;
          return;
        }
        function SA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0;
          d2 = TA(c2[a3 >> 2] | 0, b3) | 0;
          b3 = a3 + 4 | 0;
          c2[(c2[b3 >> 2] | 0) + 8 >> 2] = d2;
          return c2[(c2[b3 >> 2] | 0) + 8 >> 2] | 0;
        }
        function TA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = l2;
          l2 = l2 + 16 | 0;
          e2 = d2;
          UA(e2);
          a3 = Sg(a3) | 0;
          b3 = VA(a3, c2[b3 >> 2] | 0) | 0;
          WA(e2);
          l2 = d2;
          return b3 | 0;
        }
        function UA(a3) {
          a3 = a3 | 0;
          c2[a3 >> 2] = c2[2701];
          c2[a3 + 4 >> 2] = c2[2703];
          return;
        }
        function VA(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0;
          c3 = Vg(XA() | 0) | 0;
          return bb(0, c3 | 0, a3 | 0, sw(b3) | 0) | 0;
        }
        function WA(a3) {
          a3 = a3 | 0;
          xy(c2[a3 >> 2] | 0, c2[a3 + 4 >> 2] | 0);
          return;
        }
        function XA() {
          var b3 = 0;
          if (!(a2[8096] | 0)) {
            YA(11120);
            b3 = 8096;
            c2[b3 >> 2] = 1;
            c2[b3 + 4 >> 2] = 0;
          }
          return 11120;
        }
        function YA(a3) {
          a3 = a3 | 0;
          fh(a3, ZA() | 0, 1);
          return;
        }
        function ZA() {
          return 1948;
        }
        function _A() {
          $A();
          return;
        }
        function $A() {
          var b3 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0;
          s3 = l2;
          l2 = l2 + 16 | 0;
          o3 = s3 + 4 | 0;
          p2 = s3;
          Ea(65536, 10804, c2[2702] | 0, 10812);
          f2 = Wv() | 0;
          e2 = c2[f2 >> 2] | 0;
          b3 = c2[e2 >> 2] | 0;
          if (b3 | 0) {
            g2 = c2[f2 + 8 >> 2] | 0;
            f2 = c2[f2 + 4 >> 2] | 0;
            while (1) {
              Ma(b3 | 0, d[f2 >> 0] | 0 | 0, a2[g2 >> 0] | 0);
              e2 = e2 + 4 | 0;
              b3 = c2[e2 >> 2] | 0;
              if (!b3) break;
              else {
                g2 = g2 + 1 | 0;
                f2 = f2 + 1 | 0;
              }
            }
          }
          b3 = Yv() | 0;
          e2 = c2[b3 >> 2] | 0;
          if (e2 | 0) do {
            Na(e2 | 0, c2[b3 + 4 >> 2] | 0);
            b3 = b3 + 8 | 0;
            e2 = c2[b3 >> 2] | 0;
          } while ((e2 | 0) != 0);
          Na(aB() | 0, 5167);
          n3 = Iv() | 0;
          b3 = c2[n3 >> 2] | 0;
          a: do
            if (b3 | 0) {
              do {
                bB(c2[b3 + 4 >> 2] | 0);
                b3 = c2[b3 >> 2] | 0;
              } while ((b3 | 0) != 0);
              b3 = c2[n3 >> 2] | 0;
              if (b3 | 0) {
                m2 = n3;
                do {
                  while (1) {
                    h3 = b3;
                    b3 = c2[b3 >> 2] | 0;
                    h3 = c2[h3 + 4 >> 2] | 0;
                    if (!(cB(h3) | 0)) break;
                    c2[p2 >> 2] = m2;
                    c2[o3 >> 2] = c2[p2 >> 2];
                    dB(n3, o3) | 0;
                    if (!b3) break a;
                  }
                  eB(h3);
                  m2 = c2[m2 >> 2] | 0;
                  e2 = fB(h3) | 0;
                  i4 = Va() | 0;
                  j2 = l2;
                  l2 = l2 + ((1 * (e2 << 2) | 0) + 15 & -16) | 0;
                  k2 = l2;
                  l2 = l2 + ((1 * (e2 << 2) | 0) + 15 & -16) | 0;
                  e2 = c2[(Zw(h3) | 0) >> 2] | 0;
                  if (e2 | 0) {
                    f2 = j2;
                    g2 = k2;
                    while (1) {
                      c2[f2 >> 2] = c2[(Xw(c2[e2 + 4 >> 2] | 0) | 0) >> 2];
                      c2[g2 >> 2] = c2[e2 + 8 >> 2];
                      e2 = c2[e2 >> 2] | 0;
                      if (!e2) break;
                      else {
                        f2 = f2 + 4 | 0;
                        g2 = g2 + 4 | 0;
                      }
                    }
                  }
                  t3 = Xw(h3) | 0;
                  e2 = gB(h3) | 0;
                  f2 = fB(h3) | 0;
                  g2 = hB(h3) | 0;
                  Ra(t3 | 0, e2 | 0, j2 | 0, k2 | 0, f2 | 0, g2 | 0, Tv(h3) | 0);
                  Ga(i4 | 0);
                } while ((b3 | 0) != 0);
              }
            }
          while (0);
          b3 = c2[(Vv() | 0) >> 2] | 0;
          if (b3 | 0) do {
            t3 = b3 + 4 | 0;
            n3 = aw(t3) | 0;
            h3 = fw(n3) | 0;
            i4 = bw(n3) | 0;
            j2 = (cw(n3) | 0) + 1 | 0;
            k2 = iB(n3) | 0;
            m2 = jB(t3) | 0;
            n3 = si(n3) | 0;
            o3 = hw(t3) | 0;
            p2 = kB(t3) | 0;
            Pa(0, h3 | 0, i4 | 0, j2 | 0, k2 | 0, m2 | 0, n3 | 0, o3 | 0, p2 | 0, lB(t3) | 0);
            b3 = c2[b3 >> 2] | 0;
          } while ((b3 | 0) != 0);
          b3 = c2[(Iv() | 0) >> 2] | 0;
          b: do
            if (b3 | 0) {
              c: while (1) {
                e2 = c2[b3 + 4 >> 2] | 0;
                if (e2 | 0 ? (q2 = c2[(Xw(e2) | 0) >> 2] | 0, r3 = c2[(ax(e2) | 0) >> 2] | 0, r3 | 0) : 0) {
                  f2 = r3;
                  do {
                    e2 = f2 + 4 | 0;
                    g2 = aw(e2) | 0;
                    d: do
                      if (g2 | 0) switch (si(g2) | 0) {
                        case 0:
                          break c;
                        case 4:
                        case 3:
                        case 2: {
                          k2 = fw(g2) | 0;
                          m2 = bw(g2) | 0;
                          n3 = (cw(g2) | 0) + 1 | 0;
                          o3 = iB(g2) | 0;
                          p2 = si(g2) | 0;
                          t3 = hw(e2) | 0;
                          Pa(q2 | 0, k2 | 0, m2 | 0, n3 | 0, o3 | 0, 0, p2 | 0, t3 | 0, kB(e2) | 0, lB(e2) | 0);
                          break d;
                        }
                        case 1: {
                          j2 = fw(g2) | 0;
                          k2 = bw(g2) | 0;
                          m2 = (cw(g2) | 0) + 1 | 0;
                          n3 = iB(g2) | 0;
                          o3 = jB(e2) | 0;
                          p2 = si(g2) | 0;
                          t3 = hw(e2) | 0;
                          Pa(q2 | 0, j2 | 0, k2 | 0, m2 | 0, n3 | 0, o3 | 0, p2 | 0, t3 | 0, kB(e2) | 0, lB(e2) | 0);
                          break d;
                        }
                        case 5: {
                          n3 = fw(g2) | 0;
                          o3 = bw(g2) | 0;
                          p2 = (cw(g2) | 0) + 1 | 0;
                          t3 = iB(g2) | 0;
                          Pa(q2 | 0, n3 | 0, o3 | 0, p2 | 0, t3 | 0, mB(g2) | 0, si(g2) | 0, 0, 0, 0);
                          break d;
                        }
                        default:
                          break d;
                      }
                    while (0);
                    f2 = c2[f2 >> 2] | 0;
                  } while ((f2 | 0) != 0);
                }
                b3 = c2[b3 >> 2] | 0;
                if (!b3) break b;
              }
              Ta();
            }
          while (0);
          Sa();
          l2 = s3;
          return;
        }
        function aB() {
          return 11703;
        }
        function bB(b3) {
          b3 = b3 | 0;
          a2[b3 + 40 >> 0] = 0;
          return;
        }
        function cB(b3) {
          b3 = b3 | 0;
          return (a2[b3 + 40 >> 0] | 0) != 0 | 0;
        }
        function dB(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          b3 = nB(b3) | 0;
          a3 = c2[b3 >> 2] | 0;
          c2[b3 >> 2] = c2[a3 >> 2];
          sC(a3);
          return c2[b3 >> 2] | 0;
        }
        function eB(b3) {
          b3 = b3 | 0;
          a2[b3 + 40 >> 0] = 1;
          return;
        }
        function fB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 20 >> 2] | 0;
        }
        function gB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 8 >> 2] | 0;
        }
        function hB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 32 >> 2] | 0;
        }
        function iB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 4 >> 2] | 0;
        }
        function jB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 4 >> 2] | 0;
        }
        function kB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 8 >> 2] | 0;
        }
        function lB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 16 >> 2] | 0;
        }
        function mB(a3) {
          a3 = a3 | 0;
          return c2[a3 + 20 >> 2] | 0;
        }
        function nB(a3) {
          a3 = a3 | 0;
          return c2[a3 >> 2] | 0;
        }
        function oB(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = 0, v2 = 0, w3 = 0, x3 = 0;
          x3 = l2;
          l2 = l2 + 16 | 0;
          o3 = x3;
          do
            if (a3 >>> 0 < 245) {
              k2 = a3 >>> 0 < 11 ? 16 : a3 + 11 & -8;
              a3 = k2 >>> 3;
              n3 = c2[2783] | 0;
              d2 = n3 >>> a3;
              if (d2 & 3 | 0) {
                b3 = (d2 & 1 ^ 1) + a3 | 0;
                a3 = 11172 + (b3 << 1 << 2) | 0;
                d2 = a3 + 8 | 0;
                e2 = c2[d2 >> 2] | 0;
                f2 = e2 + 8 | 0;
                g2 = c2[f2 >> 2] | 0;
                if ((a3 | 0) == (g2 | 0)) c2[2783] = n3 & ~(1 << b3);
                else {
                  c2[g2 + 12 >> 2] = a3;
                  c2[d2 >> 2] = g2;
                }
                w3 = b3 << 3;
                c2[e2 + 4 >> 2] = w3 | 3;
                w3 = e2 + w3 + 4 | 0;
                c2[w3 >> 2] = c2[w3 >> 2] | 1;
                w3 = f2;
                l2 = x3;
                return w3 | 0;
              }
              m2 = c2[2785] | 0;
              if (k2 >>> 0 > m2 >>> 0) {
                if (d2 | 0) {
                  b3 = 2 << a3;
                  b3 = d2 << a3 & (b3 | 0 - b3);
                  b3 = (b3 & 0 - b3) + -1 | 0;
                  h3 = b3 >>> 12 & 16;
                  b3 = b3 >>> h3;
                  d2 = b3 >>> 5 & 8;
                  b3 = b3 >>> d2;
                  f2 = b3 >>> 2 & 4;
                  b3 = b3 >>> f2;
                  a3 = b3 >>> 1 & 2;
                  b3 = b3 >>> a3;
                  e2 = b3 >>> 1 & 1;
                  e2 = (d2 | h3 | f2 | a3 | e2) + (b3 >>> e2) | 0;
                  b3 = 11172 + (e2 << 1 << 2) | 0;
                  a3 = b3 + 8 | 0;
                  f2 = c2[a3 >> 2] | 0;
                  h3 = f2 + 8 | 0;
                  d2 = c2[h3 >> 2] | 0;
                  if ((b3 | 0) == (d2 | 0)) {
                    a3 = n3 & ~(1 << e2);
                    c2[2783] = a3;
                  } else {
                    c2[d2 + 12 >> 2] = b3;
                    c2[a3 >> 2] = d2;
                    a3 = n3;
                  }
                  g2 = (e2 << 3) - k2 | 0;
                  c2[f2 + 4 >> 2] = k2 | 3;
                  e2 = f2 + k2 | 0;
                  c2[e2 + 4 >> 2] = g2 | 1;
                  c2[e2 + g2 >> 2] = g2;
                  if (m2 | 0) {
                    f2 = c2[2788] | 0;
                    b3 = m2 >>> 3;
                    d2 = 11172 + (b3 << 1 << 2) | 0;
                    b3 = 1 << b3;
                    if (!(a3 & b3)) {
                      c2[2783] = a3 | b3;
                      b3 = d2;
                      a3 = d2 + 8 | 0;
                    } else {
                      a3 = d2 + 8 | 0;
                      b3 = c2[a3 >> 2] | 0;
                    }
                    c2[a3 >> 2] = f2;
                    c2[b3 + 12 >> 2] = f2;
                    c2[f2 + 8 >> 2] = b3;
                    c2[f2 + 12 >> 2] = d2;
                  }
                  c2[2785] = g2;
                  c2[2788] = e2;
                  w3 = h3;
                  l2 = x3;
                  return w3 | 0;
                }
                i4 = c2[2784] | 0;
                if (i4) {
                  d2 = (i4 & 0 - i4) + -1 | 0;
                  h3 = d2 >>> 12 & 16;
                  d2 = d2 >>> h3;
                  g2 = d2 >>> 5 & 8;
                  d2 = d2 >>> g2;
                  j2 = d2 >>> 2 & 4;
                  d2 = d2 >>> j2;
                  e2 = d2 >>> 1 & 2;
                  d2 = d2 >>> e2;
                  a3 = d2 >>> 1 & 1;
                  a3 = c2[11436 + ((g2 | h3 | j2 | e2 | a3) + (d2 >>> a3) << 2) >> 2] | 0;
                  d2 = (c2[a3 + 4 >> 2] & -8) - k2 | 0;
                  e2 = c2[a3 + 16 + (((c2[a3 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                  if (!e2) {
                    j2 = a3;
                    g2 = d2;
                  } else {
                    do {
                      h3 = (c2[e2 + 4 >> 2] & -8) - k2 | 0;
                      j2 = h3 >>> 0 < d2 >>> 0;
                      d2 = j2 ? h3 : d2;
                      a3 = j2 ? e2 : a3;
                      e2 = c2[e2 + 16 + (((c2[e2 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                    } while ((e2 | 0) != 0);
                    j2 = a3;
                    g2 = d2;
                  }
                  h3 = j2 + k2 | 0;
                  if (j2 >>> 0 < h3 >>> 0) {
                    f2 = c2[j2 + 24 >> 2] | 0;
                    b3 = c2[j2 + 12 >> 2] | 0;
                    do
                      if ((b3 | 0) == (j2 | 0)) {
                        a3 = j2 + 20 | 0;
                        b3 = c2[a3 >> 2] | 0;
                        if (!b3) {
                          a3 = j2 + 16 | 0;
                          b3 = c2[a3 >> 2] | 0;
                          if (!b3) {
                            d2 = 0;
                            break;
                          }
                        }
                        while (1) {
                          d2 = b3 + 20 | 0;
                          e2 = c2[d2 >> 2] | 0;
                          if (e2 | 0) {
                            b3 = e2;
                            a3 = d2;
                            continue;
                          }
                          d2 = b3 + 16 | 0;
                          e2 = c2[d2 >> 2] | 0;
                          if (!e2) break;
                          else {
                            b3 = e2;
                            a3 = d2;
                          }
                        }
                        c2[a3 >> 2] = 0;
                        d2 = b3;
                      } else {
                        d2 = c2[j2 + 8 >> 2] | 0;
                        c2[d2 + 12 >> 2] = b3;
                        c2[b3 + 8 >> 2] = d2;
                        d2 = b3;
                      }
                    while (0);
                    do
                      if (f2 | 0) {
                        b3 = c2[j2 + 28 >> 2] | 0;
                        a3 = 11436 + (b3 << 2) | 0;
                        if ((j2 | 0) == (c2[a3 >> 2] | 0)) {
                          c2[a3 >> 2] = d2;
                          if (!d2) {
                            c2[2784] = i4 & ~(1 << b3);
                            break;
                          }
                        } else {
                          c2[f2 + 16 + (((c2[f2 + 16 >> 2] | 0) != (j2 | 0) & 1) << 2) >> 2] = d2;
                          if (!d2) break;
                        }
                        c2[d2 + 24 >> 2] = f2;
                        b3 = c2[j2 + 16 >> 2] | 0;
                        if (b3 | 0) {
                          c2[d2 + 16 >> 2] = b3;
                          c2[b3 + 24 >> 2] = d2;
                        }
                        b3 = c2[j2 + 20 >> 2] | 0;
                        if (b3 | 0) {
                          c2[d2 + 20 >> 2] = b3;
                          c2[b3 + 24 >> 2] = d2;
                        }
                      }
                    while (0);
                    if (g2 >>> 0 < 16) {
                      w3 = g2 + k2 | 0;
                      c2[j2 + 4 >> 2] = w3 | 3;
                      w3 = j2 + w3 + 4 | 0;
                      c2[w3 >> 2] = c2[w3 >> 2] | 1;
                    } else {
                      c2[j2 + 4 >> 2] = k2 | 3;
                      c2[h3 + 4 >> 2] = g2 | 1;
                      c2[h3 + g2 >> 2] = g2;
                      if (m2 | 0) {
                        e2 = c2[2788] | 0;
                        b3 = m2 >>> 3;
                        d2 = 11172 + (b3 << 1 << 2) | 0;
                        b3 = 1 << b3;
                        if (!(n3 & b3)) {
                          c2[2783] = n3 | b3;
                          b3 = d2;
                          a3 = d2 + 8 | 0;
                        } else {
                          a3 = d2 + 8 | 0;
                          b3 = c2[a3 >> 2] | 0;
                        }
                        c2[a3 >> 2] = e2;
                        c2[b3 + 12 >> 2] = e2;
                        c2[e2 + 8 >> 2] = b3;
                        c2[e2 + 12 >> 2] = d2;
                      }
                      c2[2785] = g2;
                      c2[2788] = h3;
                    }
                    w3 = j2 + 8 | 0;
                    l2 = x3;
                    return w3 | 0;
                  } else n3 = k2;
                } else n3 = k2;
              } else n3 = k2;
            } else if (a3 >>> 0 <= 4294967231) {
              a3 = a3 + 11 | 0;
              k2 = a3 & -8;
              j2 = c2[2784] | 0;
              if (j2) {
                e2 = 0 - k2 | 0;
                a3 = a3 >>> 8;
                if (a3) {
                  if (k2 >>> 0 > 16777215) i4 = 31;
                  else {
                    n3 = (a3 + 1048320 | 0) >>> 16 & 8;
                    v2 = a3 << n3;
                    m2 = (v2 + 520192 | 0) >>> 16 & 4;
                    v2 = v2 << m2;
                    i4 = (v2 + 245760 | 0) >>> 16 & 2;
                    i4 = 14 - (m2 | n3 | i4) + (v2 << i4 >>> 15) | 0;
                    i4 = k2 >>> (i4 + 7 | 0) & 1 | i4 << 1;
                  }
                } else i4 = 0;
                d2 = c2[11436 + (i4 << 2) >> 2] | 0;
                a: do
                  if (!d2) {
                    d2 = 0;
                    a3 = 0;
                    v2 = 57;
                  } else {
                    a3 = 0;
                    h3 = k2 << ((i4 | 0) == 31 ? 0 : 25 - (i4 >>> 1) | 0);
                    g2 = 0;
                    while (1) {
                      f2 = (c2[d2 + 4 >> 2] & -8) - k2 | 0;
                      if (f2 >>> 0 < e2 >>> 0) if (!f2) {
                        a3 = d2;
                        e2 = 0;
                        f2 = d2;
                        v2 = 61;
                        break a;
                      } else {
                        a3 = d2;
                        e2 = f2;
                      }
                      f2 = c2[d2 + 20 >> 2] | 0;
                      d2 = c2[d2 + 16 + (h3 >>> 31 << 2) >> 2] | 0;
                      g2 = (f2 | 0) == 0 | (f2 | 0) == (d2 | 0) ? g2 : f2;
                      f2 = (d2 | 0) == 0;
                      if (f2) {
                        d2 = g2;
                        v2 = 57;
                        break;
                      } else h3 = h3 << ((f2 ^ 1) & 1);
                    }
                  }
                while (0);
                if ((v2 | 0) == 57) {
                  if ((d2 | 0) == 0 & (a3 | 0) == 0) {
                    a3 = 2 << i4;
                    a3 = j2 & (a3 | 0 - a3);
                    if (!a3) {
                      n3 = k2;
                      break;
                    }
                    n3 = (a3 & 0 - a3) + -1 | 0;
                    h3 = n3 >>> 12 & 16;
                    n3 = n3 >>> h3;
                    g2 = n3 >>> 5 & 8;
                    n3 = n3 >>> g2;
                    i4 = n3 >>> 2 & 4;
                    n3 = n3 >>> i4;
                    m2 = n3 >>> 1 & 2;
                    n3 = n3 >>> m2;
                    d2 = n3 >>> 1 & 1;
                    a3 = 0;
                    d2 = c2[11436 + ((g2 | h3 | i4 | m2 | d2) + (n3 >>> d2) << 2) >> 2] | 0;
                  }
                  if (!d2) {
                    i4 = a3;
                    h3 = e2;
                  } else {
                    f2 = d2;
                    v2 = 61;
                  }
                }
                if ((v2 | 0) == 61) while (1) {
                  v2 = 0;
                  d2 = (c2[f2 + 4 >> 2] & -8) - k2 | 0;
                  n3 = d2 >>> 0 < e2 >>> 0;
                  d2 = n3 ? d2 : e2;
                  a3 = n3 ? f2 : a3;
                  f2 = c2[f2 + 16 + (((c2[f2 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                  if (!f2) {
                    i4 = a3;
                    h3 = d2;
                    break;
                  } else {
                    e2 = d2;
                    v2 = 61;
                  }
                }
                if ((i4 | 0) != 0 ? h3 >>> 0 < ((c2[2785] | 0) - k2 | 0) >>> 0 : 0) {
                  g2 = i4 + k2 | 0;
                  if (i4 >>> 0 >= g2 >>> 0) {
                    w3 = 0;
                    l2 = x3;
                    return w3 | 0;
                  }
                  f2 = c2[i4 + 24 >> 2] | 0;
                  b3 = c2[i4 + 12 >> 2] | 0;
                  do
                    if ((b3 | 0) == (i4 | 0)) {
                      a3 = i4 + 20 | 0;
                      b3 = c2[a3 >> 2] | 0;
                      if (!b3) {
                        a3 = i4 + 16 | 0;
                        b3 = c2[a3 >> 2] | 0;
                        if (!b3) {
                          b3 = 0;
                          break;
                        }
                      }
                      while (1) {
                        d2 = b3 + 20 | 0;
                        e2 = c2[d2 >> 2] | 0;
                        if (e2 | 0) {
                          b3 = e2;
                          a3 = d2;
                          continue;
                        }
                        d2 = b3 + 16 | 0;
                        e2 = c2[d2 >> 2] | 0;
                        if (!e2) break;
                        else {
                          b3 = e2;
                          a3 = d2;
                        }
                      }
                      c2[a3 >> 2] = 0;
                    } else {
                      w3 = c2[i4 + 8 >> 2] | 0;
                      c2[w3 + 12 >> 2] = b3;
                      c2[b3 + 8 >> 2] = w3;
                    }
                  while (0);
                  do
                    if (f2) {
                      a3 = c2[i4 + 28 >> 2] | 0;
                      d2 = 11436 + (a3 << 2) | 0;
                      if ((i4 | 0) == (c2[d2 >> 2] | 0)) {
                        c2[d2 >> 2] = b3;
                        if (!b3) {
                          e2 = j2 & ~(1 << a3);
                          c2[2784] = e2;
                          break;
                        }
                      } else {
                        c2[f2 + 16 + (((c2[f2 + 16 >> 2] | 0) != (i4 | 0) & 1) << 2) >> 2] = b3;
                        if (!b3) {
                          e2 = j2;
                          break;
                        }
                      }
                      c2[b3 + 24 >> 2] = f2;
                      a3 = c2[i4 + 16 >> 2] | 0;
                      if (a3 | 0) {
                        c2[b3 + 16 >> 2] = a3;
                        c2[a3 + 24 >> 2] = b3;
                      }
                      a3 = c2[i4 + 20 >> 2] | 0;
                      if (a3) {
                        c2[b3 + 20 >> 2] = a3;
                        c2[a3 + 24 >> 2] = b3;
                        e2 = j2;
                      } else e2 = j2;
                    } else e2 = j2;
                  while (0);
                  do
                    if (h3 >>> 0 >= 16) {
                      c2[i4 + 4 >> 2] = k2 | 3;
                      c2[g2 + 4 >> 2] = h3 | 1;
                      c2[g2 + h3 >> 2] = h3;
                      b3 = h3 >>> 3;
                      if (h3 >>> 0 < 256) {
                        d2 = 11172 + (b3 << 1 << 2) | 0;
                        a3 = c2[2783] | 0;
                        b3 = 1 << b3;
                        if (!(a3 & b3)) {
                          c2[2783] = a3 | b3;
                          b3 = d2;
                          a3 = d2 + 8 | 0;
                        } else {
                          a3 = d2 + 8 | 0;
                          b3 = c2[a3 >> 2] | 0;
                        }
                        c2[a3 >> 2] = g2;
                        c2[b3 + 12 >> 2] = g2;
                        c2[g2 + 8 >> 2] = b3;
                        c2[g2 + 12 >> 2] = d2;
                        break;
                      }
                      b3 = h3 >>> 8;
                      if (b3) {
                        if (h3 >>> 0 > 16777215) b3 = 31;
                        else {
                          v2 = (b3 + 1048320 | 0) >>> 16 & 8;
                          w3 = b3 << v2;
                          u2 = (w3 + 520192 | 0) >>> 16 & 4;
                          w3 = w3 << u2;
                          b3 = (w3 + 245760 | 0) >>> 16 & 2;
                          b3 = 14 - (u2 | v2 | b3) + (w3 << b3 >>> 15) | 0;
                          b3 = h3 >>> (b3 + 7 | 0) & 1 | b3 << 1;
                        }
                      } else b3 = 0;
                      d2 = 11436 + (b3 << 2) | 0;
                      c2[g2 + 28 >> 2] = b3;
                      a3 = g2 + 16 | 0;
                      c2[a3 + 4 >> 2] = 0;
                      c2[a3 >> 2] = 0;
                      a3 = 1 << b3;
                      if (!(e2 & a3)) {
                        c2[2784] = e2 | a3;
                        c2[d2 >> 2] = g2;
                        c2[g2 + 24 >> 2] = d2;
                        c2[g2 + 12 >> 2] = g2;
                        c2[g2 + 8 >> 2] = g2;
                        break;
                      }
                      a3 = h3 << ((b3 | 0) == 31 ? 0 : 25 - (b3 >>> 1) | 0);
                      d2 = c2[d2 >> 2] | 0;
                      while (1) {
                        if ((c2[d2 + 4 >> 2] & -8 | 0) == (h3 | 0)) {
                          v2 = 97;
                          break;
                        }
                        e2 = d2 + 16 + (a3 >>> 31 << 2) | 0;
                        b3 = c2[e2 >> 2] | 0;
                        if (!b3) {
                          v2 = 96;
                          break;
                        } else {
                          a3 = a3 << 1;
                          d2 = b3;
                        }
                      }
                      if ((v2 | 0) == 96) {
                        c2[e2 >> 2] = g2;
                        c2[g2 + 24 >> 2] = d2;
                        c2[g2 + 12 >> 2] = g2;
                        c2[g2 + 8 >> 2] = g2;
                        break;
                      } else if ((v2 | 0) == 97) {
                        v2 = d2 + 8 | 0;
                        w3 = c2[v2 >> 2] | 0;
                        c2[w3 + 12 >> 2] = g2;
                        c2[v2 >> 2] = g2;
                        c2[g2 + 8 >> 2] = w3;
                        c2[g2 + 12 >> 2] = d2;
                        c2[g2 + 24 >> 2] = 0;
                        break;
                      }
                    } else {
                      w3 = h3 + k2 | 0;
                      c2[i4 + 4 >> 2] = w3 | 3;
                      w3 = i4 + w3 + 4 | 0;
                      c2[w3 >> 2] = c2[w3 >> 2] | 1;
                    }
                  while (0);
                  w3 = i4 + 8 | 0;
                  l2 = x3;
                  return w3 | 0;
                } else n3 = k2;
              } else n3 = k2;
            } else n3 = -1;
          while (0);
          d2 = c2[2785] | 0;
          if (d2 >>> 0 >= n3 >>> 0) {
            b3 = d2 - n3 | 0;
            a3 = c2[2788] | 0;
            if (b3 >>> 0 > 15) {
              w3 = a3 + n3 | 0;
              c2[2788] = w3;
              c2[2785] = b3;
              c2[w3 + 4 >> 2] = b3 | 1;
              c2[w3 + b3 >> 2] = b3;
              c2[a3 + 4 >> 2] = n3 | 3;
            } else {
              c2[2785] = 0;
              c2[2788] = 0;
              c2[a3 + 4 >> 2] = d2 | 3;
              w3 = a3 + d2 + 4 | 0;
              c2[w3 >> 2] = c2[w3 >> 2] | 1;
            }
            w3 = a3 + 8 | 0;
            l2 = x3;
            return w3 | 0;
          }
          h3 = c2[2786] | 0;
          if (h3 >>> 0 > n3 >>> 0) {
            u2 = h3 - n3 | 0;
            c2[2786] = u2;
            w3 = c2[2789] | 0;
            v2 = w3 + n3 | 0;
            c2[2789] = v2;
            c2[v2 + 4 >> 2] = u2 | 1;
            c2[w3 + 4 >> 2] = n3 | 3;
            w3 = w3 + 8 | 0;
            l2 = x3;
            return w3 | 0;
          }
          if (!(c2[2901] | 0)) {
            c2[2903] = 4096;
            c2[2902] = 4096;
            c2[2904] = -1;
            c2[2905] = -1;
            c2[2906] = 0;
            c2[2894] = 0;
            a3 = o3 & -16 ^ 1431655768;
            c2[o3 >> 2] = a3;
            c2[2901] = a3;
            a3 = 4096;
          } else a3 = c2[2903] | 0;
          i4 = n3 + 48 | 0;
          j2 = n3 + 47 | 0;
          g2 = a3 + j2 | 0;
          f2 = 0 - a3 | 0;
          k2 = g2 & f2;
          if (k2 >>> 0 <= n3 >>> 0) {
            w3 = 0;
            l2 = x3;
            return w3 | 0;
          }
          a3 = c2[2893] | 0;
          if (a3 | 0 ? (m2 = c2[2891] | 0, o3 = m2 + k2 | 0, o3 >>> 0 <= m2 >>> 0 | o3 >>> 0 > a3 >>> 0) : 0) {
            w3 = 0;
            l2 = x3;
            return w3 | 0;
          }
          b: do
            if (!(c2[2894] & 4)) {
              d2 = c2[2789] | 0;
              c: do
                if (d2) {
                  e2 = 11580;
                  while (1) {
                    a3 = c2[e2 >> 2] | 0;
                    if (a3 >>> 0 <= d2 >>> 0 ? (r3 = e2 + 4 | 0, (a3 + (c2[r3 >> 2] | 0) | 0) >>> 0 > d2 >>> 0) : 0) break;
                    a3 = c2[e2 + 8 >> 2] | 0;
                    if (!a3) {
                      v2 = 118;
                      break c;
                    } else e2 = a3;
                  }
                  b3 = g2 - h3 & f2;
                  if (b3 >>> 0 < 2147483647) {
                    a3 = FC(b3 | 0) | 0;
                    if ((a3 | 0) == ((c2[e2 >> 2] | 0) + (c2[r3 >> 2] | 0) | 0)) {
                      if ((a3 | 0) != (-1 | 0)) {
                        h3 = b3;
                        g2 = a3;
                        v2 = 135;
                        break b;
                      }
                    } else {
                      e2 = a3;
                      v2 = 126;
                    }
                  } else b3 = 0;
                } else v2 = 118;
              while (0);
              do
                if ((v2 | 0) == 118) {
                  d2 = FC(0) | 0;
                  if ((d2 | 0) != (-1 | 0) ? (b3 = d2, p2 = c2[2902] | 0, q2 = p2 + -1 | 0, b3 = ((q2 & b3 | 0) == 0 ? 0 : (q2 + b3 & 0 - p2) - b3 | 0) + k2 | 0, p2 = c2[2891] | 0, q2 = b3 + p2 | 0, b3 >>> 0 > n3 >>> 0 & b3 >>> 0 < 2147483647) : 0) {
                    r3 = c2[2893] | 0;
                    if (r3 | 0 ? q2 >>> 0 <= p2 >>> 0 | q2 >>> 0 > r3 >>> 0 : 0) {
                      b3 = 0;
                      break;
                    }
                    a3 = FC(b3 | 0) | 0;
                    if ((a3 | 0) == (d2 | 0)) {
                      h3 = b3;
                      g2 = d2;
                      v2 = 135;
                      break b;
                    } else {
                      e2 = a3;
                      v2 = 126;
                    }
                  } else b3 = 0;
                }
              while (0);
              do
                if ((v2 | 0) == 126) {
                  d2 = 0 - b3 | 0;
                  if (!(i4 >>> 0 > b3 >>> 0 & (b3 >>> 0 < 2147483647 & (e2 | 0) != (-1 | 0)))) if ((e2 | 0) == (-1 | 0)) {
                    b3 = 0;
                    break;
                  } else {
                    h3 = b3;
                    g2 = e2;
                    v2 = 135;
                    break b;
                  }
                  a3 = c2[2903] | 0;
                  a3 = j2 - b3 + a3 & 0 - a3;
                  if (a3 >>> 0 >= 2147483647) {
                    h3 = b3;
                    g2 = e2;
                    v2 = 135;
                    break b;
                  }
                  if ((FC(a3 | 0) | 0) == (-1 | 0)) {
                    FC(d2 | 0) | 0;
                    b3 = 0;
                    break;
                  } else {
                    h3 = a3 + b3 | 0;
                    g2 = e2;
                    v2 = 135;
                    break b;
                  }
                }
              while (0);
              c2[2894] = c2[2894] | 4;
              v2 = 133;
            } else {
              b3 = 0;
              v2 = 133;
            }
          while (0);
          if (((v2 | 0) == 133 ? k2 >>> 0 < 2147483647 : 0) ? (u2 = FC(k2 | 0) | 0, r3 = FC(0) | 0, s3 = r3 - u2 | 0, t3 = s3 >>> 0 > (n3 + 40 | 0) >>> 0, !((u2 | 0) == (-1 | 0) | t3 ^ 1 | u2 >>> 0 < r3 >>> 0 & ((u2 | 0) != (-1 | 0) & (r3 | 0) != (-1 | 0)) ^ 1)) : 0) {
            h3 = t3 ? s3 : b3;
            g2 = u2;
            v2 = 135;
          }
          if ((v2 | 0) == 135) {
            b3 = (c2[2891] | 0) + h3 | 0;
            c2[2891] = b3;
            if (b3 >>> 0 > (c2[2892] | 0) >>> 0) c2[2892] = b3;
            j2 = c2[2789] | 0;
            do
              if (j2) {
                b3 = 11580;
                while (1) {
                  a3 = c2[b3 >> 2] | 0;
                  d2 = b3 + 4 | 0;
                  e2 = c2[d2 >> 2] | 0;
                  if ((g2 | 0) == (a3 + e2 | 0)) {
                    v2 = 145;
                    break;
                  }
                  f2 = c2[b3 + 8 >> 2] | 0;
                  if (!f2) break;
                  else b3 = f2;
                }
                if (((v2 | 0) == 145 ? (c2[b3 + 12 >> 2] & 8 | 0) == 0 : 0) ? j2 >>> 0 < g2 >>> 0 & j2 >>> 0 >= a3 >>> 0 : 0) {
                  c2[d2 >> 2] = e2 + h3;
                  w3 = j2 + 8 | 0;
                  w3 = (w3 & 7 | 0) == 0 ? 0 : 0 - w3 & 7;
                  v2 = j2 + w3 | 0;
                  w3 = (c2[2786] | 0) + (h3 - w3) | 0;
                  c2[2789] = v2;
                  c2[2786] = w3;
                  c2[v2 + 4 >> 2] = w3 | 1;
                  c2[v2 + w3 + 4 >> 2] = 40;
                  c2[2790] = c2[2905];
                  break;
                }
                if (g2 >>> 0 < (c2[2787] | 0) >>> 0) c2[2787] = g2;
                d2 = g2 + h3 | 0;
                b3 = 11580;
                while (1) {
                  if ((c2[b3 >> 2] | 0) == (d2 | 0)) {
                    v2 = 153;
                    break;
                  }
                  a3 = c2[b3 + 8 >> 2] | 0;
                  if (!a3) break;
                  else b3 = a3;
                }
                if ((v2 | 0) == 153 ? (c2[b3 + 12 >> 2] & 8 | 0) == 0 : 0) {
                  c2[b3 >> 2] = g2;
                  m2 = b3 + 4 | 0;
                  c2[m2 >> 2] = (c2[m2 >> 2] | 0) + h3;
                  m2 = g2 + 8 | 0;
                  m2 = g2 + ((m2 & 7 | 0) == 0 ? 0 : 0 - m2 & 7) | 0;
                  b3 = d2 + 8 | 0;
                  b3 = d2 + ((b3 & 7 | 0) == 0 ? 0 : 0 - b3 & 7) | 0;
                  k2 = m2 + n3 | 0;
                  i4 = b3 - m2 - n3 | 0;
                  c2[m2 + 4 >> 2] = n3 | 3;
                  do
                    if ((b3 | 0) != (j2 | 0)) {
                      if ((b3 | 0) == (c2[2788] | 0)) {
                        w3 = (c2[2785] | 0) + i4 | 0;
                        c2[2785] = w3;
                        c2[2788] = k2;
                        c2[k2 + 4 >> 2] = w3 | 1;
                        c2[k2 + w3 >> 2] = w3;
                        break;
                      }
                      a3 = c2[b3 + 4 >> 2] | 0;
                      if ((a3 & 3 | 0) == 1) {
                        h3 = a3 & -8;
                        e2 = a3 >>> 3;
                        d: do
                          if (a3 >>> 0 < 256) {
                            a3 = c2[b3 + 8 >> 2] | 0;
                            d2 = c2[b3 + 12 >> 2] | 0;
                            if ((d2 | 0) == (a3 | 0)) {
                              c2[2783] = c2[2783] & ~(1 << e2);
                              break;
                            } else {
                              c2[a3 + 12 >> 2] = d2;
                              c2[d2 + 8 >> 2] = a3;
                              break;
                            }
                          } else {
                            g2 = c2[b3 + 24 >> 2] | 0;
                            a3 = c2[b3 + 12 >> 2] | 0;
                            do
                              if ((a3 | 0) == (b3 | 0)) {
                                e2 = b3 + 16 | 0;
                                d2 = e2 + 4 | 0;
                                a3 = c2[d2 >> 2] | 0;
                                if (!a3) {
                                  a3 = c2[e2 >> 2] | 0;
                                  if (!a3) {
                                    a3 = 0;
                                    break;
                                  } else d2 = e2;
                                }
                                while (1) {
                                  e2 = a3 + 20 | 0;
                                  f2 = c2[e2 >> 2] | 0;
                                  if (f2 | 0) {
                                    a3 = f2;
                                    d2 = e2;
                                    continue;
                                  }
                                  e2 = a3 + 16 | 0;
                                  f2 = c2[e2 >> 2] | 0;
                                  if (!f2) break;
                                  else {
                                    a3 = f2;
                                    d2 = e2;
                                  }
                                }
                                c2[d2 >> 2] = 0;
                              } else {
                                w3 = c2[b3 + 8 >> 2] | 0;
                                c2[w3 + 12 >> 2] = a3;
                                c2[a3 + 8 >> 2] = w3;
                              }
                            while (0);
                            if (!g2) break;
                            d2 = c2[b3 + 28 >> 2] | 0;
                            e2 = 11436 + (d2 << 2) | 0;
                            do
                              if ((b3 | 0) != (c2[e2 >> 2] | 0)) {
                                c2[g2 + 16 + (((c2[g2 + 16 >> 2] | 0) != (b3 | 0) & 1) << 2) >> 2] = a3;
                                if (!a3) break d;
                              } else {
                                c2[e2 >> 2] = a3;
                                if (a3 | 0) break;
                                c2[2784] = c2[2784] & ~(1 << d2);
                                break d;
                              }
                            while (0);
                            c2[a3 + 24 >> 2] = g2;
                            d2 = b3 + 16 | 0;
                            e2 = c2[d2 >> 2] | 0;
                            if (e2 | 0) {
                              c2[a3 + 16 >> 2] = e2;
                              c2[e2 + 24 >> 2] = a3;
                            }
                            d2 = c2[d2 + 4 >> 2] | 0;
                            if (!d2) break;
                            c2[a3 + 20 >> 2] = d2;
                            c2[d2 + 24 >> 2] = a3;
                          }
                        while (0);
                        b3 = b3 + h3 | 0;
                        f2 = h3 + i4 | 0;
                      } else f2 = i4;
                      b3 = b3 + 4 | 0;
                      c2[b3 >> 2] = c2[b3 >> 2] & -2;
                      c2[k2 + 4 >> 2] = f2 | 1;
                      c2[k2 + f2 >> 2] = f2;
                      b3 = f2 >>> 3;
                      if (f2 >>> 0 < 256) {
                        d2 = 11172 + (b3 << 1 << 2) | 0;
                        a3 = c2[2783] | 0;
                        b3 = 1 << b3;
                        if (!(a3 & b3)) {
                          c2[2783] = a3 | b3;
                          b3 = d2;
                          a3 = d2 + 8 | 0;
                        } else {
                          a3 = d2 + 8 | 0;
                          b3 = c2[a3 >> 2] | 0;
                        }
                        c2[a3 >> 2] = k2;
                        c2[b3 + 12 >> 2] = k2;
                        c2[k2 + 8 >> 2] = b3;
                        c2[k2 + 12 >> 2] = d2;
                        break;
                      }
                      b3 = f2 >>> 8;
                      do
                        if (!b3) b3 = 0;
                        else {
                          if (f2 >>> 0 > 16777215) {
                            b3 = 31;
                            break;
                          }
                          v2 = (b3 + 1048320 | 0) >>> 16 & 8;
                          w3 = b3 << v2;
                          u2 = (w3 + 520192 | 0) >>> 16 & 4;
                          w3 = w3 << u2;
                          b3 = (w3 + 245760 | 0) >>> 16 & 2;
                          b3 = 14 - (u2 | v2 | b3) + (w3 << b3 >>> 15) | 0;
                          b3 = f2 >>> (b3 + 7 | 0) & 1 | b3 << 1;
                        }
                      while (0);
                      e2 = 11436 + (b3 << 2) | 0;
                      c2[k2 + 28 >> 2] = b3;
                      a3 = k2 + 16 | 0;
                      c2[a3 + 4 >> 2] = 0;
                      c2[a3 >> 2] = 0;
                      a3 = c2[2784] | 0;
                      d2 = 1 << b3;
                      if (!(a3 & d2)) {
                        c2[2784] = a3 | d2;
                        c2[e2 >> 2] = k2;
                        c2[k2 + 24 >> 2] = e2;
                        c2[k2 + 12 >> 2] = k2;
                        c2[k2 + 8 >> 2] = k2;
                        break;
                      }
                      a3 = f2 << ((b3 | 0) == 31 ? 0 : 25 - (b3 >>> 1) | 0);
                      d2 = c2[e2 >> 2] | 0;
                      while (1) {
                        if ((c2[d2 + 4 >> 2] & -8 | 0) == (f2 | 0)) {
                          v2 = 194;
                          break;
                        }
                        e2 = d2 + 16 + (a3 >>> 31 << 2) | 0;
                        b3 = c2[e2 >> 2] | 0;
                        if (!b3) {
                          v2 = 193;
                          break;
                        } else {
                          a3 = a3 << 1;
                          d2 = b3;
                        }
                      }
                      if ((v2 | 0) == 193) {
                        c2[e2 >> 2] = k2;
                        c2[k2 + 24 >> 2] = d2;
                        c2[k2 + 12 >> 2] = k2;
                        c2[k2 + 8 >> 2] = k2;
                        break;
                      } else if ((v2 | 0) == 194) {
                        v2 = d2 + 8 | 0;
                        w3 = c2[v2 >> 2] | 0;
                        c2[w3 + 12 >> 2] = k2;
                        c2[v2 >> 2] = k2;
                        c2[k2 + 8 >> 2] = w3;
                        c2[k2 + 12 >> 2] = d2;
                        c2[k2 + 24 >> 2] = 0;
                        break;
                      }
                    } else {
                      w3 = (c2[2786] | 0) + i4 | 0;
                      c2[2786] = w3;
                      c2[2789] = k2;
                      c2[k2 + 4 >> 2] = w3 | 1;
                    }
                  while (0);
                  w3 = m2 + 8 | 0;
                  l2 = x3;
                  return w3 | 0;
                }
                b3 = 11580;
                while (1) {
                  a3 = c2[b3 >> 2] | 0;
                  if (a3 >>> 0 <= j2 >>> 0 ? (w3 = a3 + (c2[b3 + 4 >> 2] | 0) | 0, w3 >>> 0 > j2 >>> 0) : 0) break;
                  b3 = c2[b3 + 8 >> 2] | 0;
                }
                f2 = w3 + -47 | 0;
                a3 = f2 + 8 | 0;
                a3 = f2 + ((a3 & 7 | 0) == 0 ? 0 : 0 - a3 & 7) | 0;
                f2 = j2 + 16 | 0;
                a3 = a3 >>> 0 < f2 >>> 0 ? j2 : a3;
                b3 = a3 + 8 | 0;
                d2 = g2 + 8 | 0;
                d2 = (d2 & 7 | 0) == 0 ? 0 : 0 - d2 & 7;
                v2 = g2 + d2 | 0;
                d2 = h3 + -40 - d2 | 0;
                c2[2789] = v2;
                c2[2786] = d2;
                c2[v2 + 4 >> 2] = d2 | 1;
                c2[v2 + d2 + 4 >> 2] = 40;
                c2[2790] = c2[2905];
                d2 = a3 + 4 | 0;
                c2[d2 >> 2] = 27;
                c2[b3 >> 2] = c2[2895];
                c2[b3 + 4 >> 2] = c2[2896];
                c2[b3 + 8 >> 2] = c2[2897];
                c2[b3 + 12 >> 2] = c2[2898];
                c2[2895] = g2;
                c2[2896] = h3;
                c2[2898] = 0;
                c2[2897] = b3;
                b3 = a3 + 24 | 0;
                do {
                  v2 = b3;
                  b3 = b3 + 4 | 0;
                  c2[b3 >> 2] = 7;
                } while ((v2 + 8 | 0) >>> 0 < w3 >>> 0);
                if ((a3 | 0) != (j2 | 0)) {
                  g2 = a3 - j2 | 0;
                  c2[d2 >> 2] = c2[d2 >> 2] & -2;
                  c2[j2 + 4 >> 2] = g2 | 1;
                  c2[a3 >> 2] = g2;
                  b3 = g2 >>> 3;
                  if (g2 >>> 0 < 256) {
                    d2 = 11172 + (b3 << 1 << 2) | 0;
                    a3 = c2[2783] | 0;
                    b3 = 1 << b3;
                    if (!(a3 & b3)) {
                      c2[2783] = a3 | b3;
                      b3 = d2;
                      a3 = d2 + 8 | 0;
                    } else {
                      a3 = d2 + 8 | 0;
                      b3 = c2[a3 >> 2] | 0;
                    }
                    c2[a3 >> 2] = j2;
                    c2[b3 + 12 >> 2] = j2;
                    c2[j2 + 8 >> 2] = b3;
                    c2[j2 + 12 >> 2] = d2;
                    break;
                  }
                  b3 = g2 >>> 8;
                  if (b3) {
                    if (g2 >>> 0 > 16777215) d2 = 31;
                    else {
                      v2 = (b3 + 1048320 | 0) >>> 16 & 8;
                      w3 = b3 << v2;
                      u2 = (w3 + 520192 | 0) >>> 16 & 4;
                      w3 = w3 << u2;
                      d2 = (w3 + 245760 | 0) >>> 16 & 2;
                      d2 = 14 - (u2 | v2 | d2) + (w3 << d2 >>> 15) | 0;
                      d2 = g2 >>> (d2 + 7 | 0) & 1 | d2 << 1;
                    }
                  } else d2 = 0;
                  e2 = 11436 + (d2 << 2) | 0;
                  c2[j2 + 28 >> 2] = d2;
                  c2[j2 + 20 >> 2] = 0;
                  c2[f2 >> 2] = 0;
                  b3 = c2[2784] | 0;
                  a3 = 1 << d2;
                  if (!(b3 & a3)) {
                    c2[2784] = b3 | a3;
                    c2[e2 >> 2] = j2;
                    c2[j2 + 24 >> 2] = e2;
                    c2[j2 + 12 >> 2] = j2;
                    c2[j2 + 8 >> 2] = j2;
                    break;
                  }
                  a3 = g2 << ((d2 | 0) == 31 ? 0 : 25 - (d2 >>> 1) | 0);
                  d2 = c2[e2 >> 2] | 0;
                  while (1) {
                    if ((c2[d2 + 4 >> 2] & -8 | 0) == (g2 | 0)) {
                      v2 = 216;
                      break;
                    }
                    e2 = d2 + 16 + (a3 >>> 31 << 2) | 0;
                    b3 = c2[e2 >> 2] | 0;
                    if (!b3) {
                      v2 = 215;
                      break;
                    } else {
                      a3 = a3 << 1;
                      d2 = b3;
                    }
                  }
                  if ((v2 | 0) == 215) {
                    c2[e2 >> 2] = j2;
                    c2[j2 + 24 >> 2] = d2;
                    c2[j2 + 12 >> 2] = j2;
                    c2[j2 + 8 >> 2] = j2;
                    break;
                  } else if ((v2 | 0) == 216) {
                    v2 = d2 + 8 | 0;
                    w3 = c2[v2 >> 2] | 0;
                    c2[w3 + 12 >> 2] = j2;
                    c2[v2 >> 2] = j2;
                    c2[j2 + 8 >> 2] = w3;
                    c2[j2 + 12 >> 2] = d2;
                    c2[j2 + 24 >> 2] = 0;
                    break;
                  }
                }
              } else {
                w3 = c2[2787] | 0;
                if ((w3 | 0) == 0 | g2 >>> 0 < w3 >>> 0) c2[2787] = g2;
                c2[2895] = g2;
                c2[2896] = h3;
                c2[2898] = 0;
                c2[2792] = c2[2901];
                c2[2791] = -1;
                b3 = 0;
                do {
                  w3 = 11172 + (b3 << 1 << 2) | 0;
                  c2[w3 + 12 >> 2] = w3;
                  c2[w3 + 8 >> 2] = w3;
                  b3 = b3 + 1 | 0;
                } while ((b3 | 0) != 32);
                w3 = g2 + 8 | 0;
                w3 = (w3 & 7 | 0) == 0 ? 0 : 0 - w3 & 7;
                v2 = g2 + w3 | 0;
                w3 = h3 + -40 - w3 | 0;
                c2[2789] = v2;
                c2[2786] = w3;
                c2[v2 + 4 >> 2] = w3 | 1;
                c2[v2 + w3 + 4 >> 2] = 40;
                c2[2790] = c2[2905];
              }
            while (0);
            b3 = c2[2786] | 0;
            if (b3 >>> 0 > n3 >>> 0) {
              u2 = b3 - n3 | 0;
              c2[2786] = u2;
              w3 = c2[2789] | 0;
              v2 = w3 + n3 | 0;
              c2[2789] = v2;
              c2[v2 + 4 >> 2] = u2 | 1;
              c2[w3 + 4 >> 2] = n3 | 3;
              w3 = w3 + 8 | 0;
              l2 = x3;
              return w3 | 0;
            }
          }
          c2[(vB() | 0) >> 2] = 12;
          w3 = 0;
          l2 = x3;
          return w3 | 0;
        }
        function pB(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          if (!a3) return;
          d2 = a3 + -8 | 0;
          f2 = c2[2787] | 0;
          a3 = c2[a3 + -4 >> 2] | 0;
          b3 = a3 & -8;
          j2 = d2 + b3 | 0;
          do
            if (!(a3 & 1)) {
              e2 = c2[d2 >> 2] | 0;
              if (!(a3 & 3)) return;
              h3 = d2 + (0 - e2) | 0;
              g2 = e2 + b3 | 0;
              if (h3 >>> 0 < f2 >>> 0) return;
              if ((h3 | 0) == (c2[2788] | 0)) {
                a3 = j2 + 4 | 0;
                b3 = c2[a3 >> 2] | 0;
                if ((b3 & 3 | 0) != 3) {
                  i4 = h3;
                  b3 = g2;
                  break;
                }
                c2[2785] = g2;
                c2[a3 >> 2] = b3 & -2;
                c2[h3 + 4 >> 2] = g2 | 1;
                c2[h3 + g2 >> 2] = g2;
                return;
              }
              d2 = e2 >>> 3;
              if (e2 >>> 0 < 256) {
                a3 = c2[h3 + 8 >> 2] | 0;
                b3 = c2[h3 + 12 >> 2] | 0;
                if ((b3 | 0) == (a3 | 0)) {
                  c2[2783] = c2[2783] & ~(1 << d2);
                  i4 = h3;
                  b3 = g2;
                  break;
                } else {
                  c2[a3 + 12 >> 2] = b3;
                  c2[b3 + 8 >> 2] = a3;
                  i4 = h3;
                  b3 = g2;
                  break;
                }
              }
              f2 = c2[h3 + 24 >> 2] | 0;
              a3 = c2[h3 + 12 >> 2] | 0;
              do
                if ((a3 | 0) == (h3 | 0)) {
                  d2 = h3 + 16 | 0;
                  b3 = d2 + 4 | 0;
                  a3 = c2[b3 >> 2] | 0;
                  if (!a3) {
                    a3 = c2[d2 >> 2] | 0;
                    if (!a3) {
                      a3 = 0;
                      break;
                    } else b3 = d2;
                  }
                  while (1) {
                    d2 = a3 + 20 | 0;
                    e2 = c2[d2 >> 2] | 0;
                    if (e2 | 0) {
                      a3 = e2;
                      b3 = d2;
                      continue;
                    }
                    d2 = a3 + 16 | 0;
                    e2 = c2[d2 >> 2] | 0;
                    if (!e2) break;
                    else {
                      a3 = e2;
                      b3 = d2;
                    }
                  }
                  c2[b3 >> 2] = 0;
                } else {
                  i4 = c2[h3 + 8 >> 2] | 0;
                  c2[i4 + 12 >> 2] = a3;
                  c2[a3 + 8 >> 2] = i4;
                }
              while (0);
              if (f2) {
                b3 = c2[h3 + 28 >> 2] | 0;
                d2 = 11436 + (b3 << 2) | 0;
                if ((h3 | 0) == (c2[d2 >> 2] | 0)) {
                  c2[d2 >> 2] = a3;
                  if (!a3) {
                    c2[2784] = c2[2784] & ~(1 << b3);
                    i4 = h3;
                    b3 = g2;
                    break;
                  }
                } else {
                  c2[f2 + 16 + (((c2[f2 + 16 >> 2] | 0) != (h3 | 0) & 1) << 2) >> 2] = a3;
                  if (!a3) {
                    i4 = h3;
                    b3 = g2;
                    break;
                  }
                }
                c2[a3 + 24 >> 2] = f2;
                b3 = h3 + 16 | 0;
                d2 = c2[b3 >> 2] | 0;
                if (d2 | 0) {
                  c2[a3 + 16 >> 2] = d2;
                  c2[d2 + 24 >> 2] = a3;
                }
                b3 = c2[b3 + 4 >> 2] | 0;
                if (b3) {
                  c2[a3 + 20 >> 2] = b3;
                  c2[b3 + 24 >> 2] = a3;
                  i4 = h3;
                  b3 = g2;
                } else {
                  i4 = h3;
                  b3 = g2;
                }
              } else {
                i4 = h3;
                b3 = g2;
              }
            } else {
              i4 = d2;
              h3 = d2;
            }
          while (0);
          if (h3 >>> 0 >= j2 >>> 0) return;
          a3 = j2 + 4 | 0;
          e2 = c2[a3 >> 2] | 0;
          if (!(e2 & 1)) return;
          if (!(e2 & 2)) {
            a3 = c2[2788] | 0;
            if ((j2 | 0) == (c2[2789] | 0)) {
              j2 = (c2[2786] | 0) + b3 | 0;
              c2[2786] = j2;
              c2[2789] = i4;
              c2[i4 + 4 >> 2] = j2 | 1;
              if ((i4 | 0) != (a3 | 0)) return;
              c2[2788] = 0;
              c2[2785] = 0;
              return;
            }
            if ((j2 | 0) == (a3 | 0)) {
              j2 = (c2[2785] | 0) + b3 | 0;
              c2[2785] = j2;
              c2[2788] = h3;
              c2[i4 + 4 >> 2] = j2 | 1;
              c2[h3 + j2 >> 2] = j2;
              return;
            }
            f2 = (e2 & -8) + b3 | 0;
            d2 = e2 >>> 3;
            do
              if (e2 >>> 0 < 256) {
                b3 = c2[j2 + 8 >> 2] | 0;
                a3 = c2[j2 + 12 >> 2] | 0;
                if ((a3 | 0) == (b3 | 0)) {
                  c2[2783] = c2[2783] & ~(1 << d2);
                  break;
                } else {
                  c2[b3 + 12 >> 2] = a3;
                  c2[a3 + 8 >> 2] = b3;
                  break;
                }
              } else {
                g2 = c2[j2 + 24 >> 2] | 0;
                a3 = c2[j2 + 12 >> 2] | 0;
                do
                  if ((a3 | 0) == (j2 | 0)) {
                    d2 = j2 + 16 | 0;
                    b3 = d2 + 4 | 0;
                    a3 = c2[b3 >> 2] | 0;
                    if (!a3) {
                      a3 = c2[d2 >> 2] | 0;
                      if (!a3) {
                        d2 = 0;
                        break;
                      } else b3 = d2;
                    }
                    while (1) {
                      d2 = a3 + 20 | 0;
                      e2 = c2[d2 >> 2] | 0;
                      if (e2 | 0) {
                        a3 = e2;
                        b3 = d2;
                        continue;
                      }
                      d2 = a3 + 16 | 0;
                      e2 = c2[d2 >> 2] | 0;
                      if (!e2) break;
                      else {
                        a3 = e2;
                        b3 = d2;
                      }
                    }
                    c2[b3 >> 2] = 0;
                    d2 = a3;
                  } else {
                    d2 = c2[j2 + 8 >> 2] | 0;
                    c2[d2 + 12 >> 2] = a3;
                    c2[a3 + 8 >> 2] = d2;
                    d2 = a3;
                  }
                while (0);
                if (g2 | 0) {
                  a3 = c2[j2 + 28 >> 2] | 0;
                  b3 = 11436 + (a3 << 2) | 0;
                  if ((j2 | 0) == (c2[b3 >> 2] | 0)) {
                    c2[b3 >> 2] = d2;
                    if (!d2) {
                      c2[2784] = c2[2784] & ~(1 << a3);
                      break;
                    }
                  } else {
                    c2[g2 + 16 + (((c2[g2 + 16 >> 2] | 0) != (j2 | 0) & 1) << 2) >> 2] = d2;
                    if (!d2) break;
                  }
                  c2[d2 + 24 >> 2] = g2;
                  a3 = j2 + 16 | 0;
                  b3 = c2[a3 >> 2] | 0;
                  if (b3 | 0) {
                    c2[d2 + 16 >> 2] = b3;
                    c2[b3 + 24 >> 2] = d2;
                  }
                  a3 = c2[a3 + 4 >> 2] | 0;
                  if (a3 | 0) {
                    c2[d2 + 20 >> 2] = a3;
                    c2[a3 + 24 >> 2] = d2;
                  }
                }
              }
            while (0);
            c2[i4 + 4 >> 2] = f2 | 1;
            c2[h3 + f2 >> 2] = f2;
            if ((i4 | 0) == (c2[2788] | 0)) {
              c2[2785] = f2;
              return;
            }
          } else {
            c2[a3 >> 2] = e2 & -2;
            c2[i4 + 4 >> 2] = b3 | 1;
            c2[h3 + b3 >> 2] = b3;
            f2 = b3;
          }
          a3 = f2 >>> 3;
          if (f2 >>> 0 < 256) {
            d2 = 11172 + (a3 << 1 << 2) | 0;
            b3 = c2[2783] | 0;
            a3 = 1 << a3;
            if (!(b3 & a3)) {
              c2[2783] = b3 | a3;
              a3 = d2;
              b3 = d2 + 8 | 0;
            } else {
              b3 = d2 + 8 | 0;
              a3 = c2[b3 >> 2] | 0;
            }
            c2[b3 >> 2] = i4;
            c2[a3 + 12 >> 2] = i4;
            c2[i4 + 8 >> 2] = a3;
            c2[i4 + 12 >> 2] = d2;
            return;
          }
          a3 = f2 >>> 8;
          if (a3) {
            if (f2 >>> 0 > 16777215) a3 = 31;
            else {
              h3 = (a3 + 1048320 | 0) >>> 16 & 8;
              j2 = a3 << h3;
              g2 = (j2 + 520192 | 0) >>> 16 & 4;
              j2 = j2 << g2;
              a3 = (j2 + 245760 | 0) >>> 16 & 2;
              a3 = 14 - (g2 | h3 | a3) + (j2 << a3 >>> 15) | 0;
              a3 = f2 >>> (a3 + 7 | 0) & 1 | a3 << 1;
            }
          } else a3 = 0;
          e2 = 11436 + (a3 << 2) | 0;
          c2[i4 + 28 >> 2] = a3;
          c2[i4 + 20 >> 2] = 0;
          c2[i4 + 16 >> 2] = 0;
          b3 = c2[2784] | 0;
          d2 = 1 << a3;
          do
            if (b3 & d2) {
              b3 = f2 << ((a3 | 0) == 31 ? 0 : 25 - (a3 >>> 1) | 0);
              d2 = c2[e2 >> 2] | 0;
              while (1) {
                if ((c2[d2 + 4 >> 2] & -8 | 0) == (f2 | 0)) {
                  a3 = 73;
                  break;
                }
                e2 = d2 + 16 + (b3 >>> 31 << 2) | 0;
                a3 = c2[e2 >> 2] | 0;
                if (!a3) {
                  a3 = 72;
                  break;
                } else {
                  b3 = b3 << 1;
                  d2 = a3;
                }
              }
              if ((a3 | 0) == 72) {
                c2[e2 >> 2] = i4;
                c2[i4 + 24 >> 2] = d2;
                c2[i4 + 12 >> 2] = i4;
                c2[i4 + 8 >> 2] = i4;
                break;
              } else if ((a3 | 0) == 73) {
                h3 = d2 + 8 | 0;
                j2 = c2[h3 >> 2] | 0;
                c2[j2 + 12 >> 2] = i4;
                c2[h3 >> 2] = i4;
                c2[i4 + 8 >> 2] = j2;
                c2[i4 + 12 >> 2] = d2;
                c2[i4 + 24 >> 2] = 0;
                break;
              }
            } else {
              c2[2784] = b3 | d2;
              c2[e2 >> 2] = i4;
              c2[i4 + 24 >> 2] = e2;
              c2[i4 + 12 >> 2] = i4;
              c2[i4 + 8 >> 2] = i4;
            }
          while (0);
          j2 = (c2[2791] | 0) + -1 | 0;
          c2[2791] = j2;
          if (!j2) a3 = 11588;
          else return;
          while (1) {
            a3 = c2[a3 >> 2] | 0;
            if (!a3) break;
            else a3 = a3 + 8 | 0;
          }
          c2[2791] = -1;
          return;
        }
        function qB() {
          return 11628;
        }
        function rB(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          b3 = l2;
          l2 = l2 + 16 | 0;
          d2 = b3;
          c2[d2 >> 2] = yB(c2[a3 + 60 >> 2] | 0) | 0;
          a3 = uB(db(6, d2 | 0) | 0) | 0;
          l2 = b3;
          return a3 | 0;
        }
        function sB(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0;
          n3 = l2;
          l2 = l2 + 48 | 0;
          k2 = n3 + 16 | 0;
          g2 = n3;
          f2 = n3 + 32 | 0;
          i4 = a3 + 28 | 0;
          e2 = c2[i4 >> 2] | 0;
          c2[f2 >> 2] = e2;
          j2 = a3 + 20 | 0;
          e2 = (c2[j2 >> 2] | 0) - e2 | 0;
          c2[f2 + 4 >> 2] = e2;
          c2[f2 + 8 >> 2] = b3;
          c2[f2 + 12 >> 2] = d2;
          e2 = e2 + d2 | 0;
          h3 = a3 + 60 | 0;
          c2[g2 >> 2] = c2[h3 >> 2];
          c2[g2 + 4 >> 2] = f2;
          c2[g2 + 8 >> 2] = 2;
          g2 = uB(gb(146, g2 | 0) | 0) | 0;
          a: do
            if ((e2 | 0) != (g2 | 0)) {
              b3 = 2;
              while (1) {
                if ((g2 | 0) < 0) break;
                e2 = e2 - g2 | 0;
                p2 = c2[f2 + 4 >> 2] | 0;
                o3 = g2 >>> 0 > p2 >>> 0;
                f2 = o3 ? f2 + 8 | 0 : f2;
                b3 = (o3 << 31 >> 31) + b3 | 0;
                p2 = g2 - (o3 ? p2 : 0) | 0;
                c2[f2 >> 2] = (c2[f2 >> 2] | 0) + p2;
                o3 = f2 + 4 | 0;
                c2[o3 >> 2] = (c2[o3 >> 2] | 0) - p2;
                c2[k2 >> 2] = c2[h3 >> 2];
                c2[k2 + 4 >> 2] = f2;
                c2[k2 + 8 >> 2] = b3;
                g2 = uB(gb(146, k2 | 0) | 0) | 0;
                if ((e2 | 0) == (g2 | 0)) {
                  m2 = 3;
                  break a;
                }
              }
              c2[a3 + 16 >> 2] = 0;
              c2[i4 >> 2] = 0;
              c2[j2 >> 2] = 0;
              c2[a3 >> 2] = c2[a3 >> 2] | 32;
              if ((b3 | 0) == 2) d2 = 0;
              else d2 = d2 - (c2[f2 + 4 >> 2] | 0) | 0;
            } else m2 = 3;
          while (0);
          if ((m2 | 0) == 3) {
            p2 = c2[a3 + 44 >> 2] | 0;
            c2[a3 + 16 >> 2] = p2 + (c2[a3 + 48 >> 2] | 0);
            c2[i4 >> 2] = p2;
            c2[j2 >> 2] = p2;
          }
          l2 = n3;
          return d2 | 0;
        }
        function tB(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          f2 = l2;
          l2 = l2 + 32 | 0;
          g2 = f2;
          e2 = f2 + 20 | 0;
          c2[g2 >> 2] = c2[a3 + 60 >> 2];
          c2[g2 + 4 >> 2] = 0;
          c2[g2 + 8 >> 2] = b3;
          c2[g2 + 12 >> 2] = e2;
          c2[g2 + 16 >> 2] = d2;
          if ((uB(fb(140, g2 | 0) | 0) | 0) < 0) {
            c2[e2 >> 2] = -1;
            a3 = -1;
          } else a3 = c2[e2 >> 2] | 0;
          l2 = f2;
          return a3 | 0;
        }
        function uB(a3) {
          a3 = a3 | 0;
          if (a3 >>> 0 > 4294963200) {
            c2[(vB() | 0) >> 2] = 0 - a3;
            a3 = -1;
          }
          return a3 | 0;
        }
        function vB() {
          return (wB() | 0) + 64 | 0;
        }
        function wB() {
          return xB() | 0;
        }
        function xB() {
          return 2084;
        }
        function yB(a3) {
          a3 = a3 | 0;
          return a3 | 0;
        }
        function zB(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 32 | 0;
          f2 = g2;
          c2[b3 + 36 >> 2] = 1;
          if ((c2[b3 >> 2] & 64 | 0) == 0 ? (c2[f2 >> 2] = c2[b3 + 60 >> 2], c2[f2 + 4 >> 2] = 21523, c2[f2 + 8 >> 2] = g2 + 16, Wa(54, f2 | 0) | 0) : 0) a2[b3 + 75 >> 0] = -1;
          f2 = sB(b3, d2, e2) | 0;
          l2 = g2;
          return f2 | 0;
        }
        function AB(b3, c3) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          var d2 = 0, e2 = 0;
          d2 = a2[b3 >> 0] | 0;
          e2 = a2[c3 >> 0] | 0;
          if (d2 << 24 >> 24 == 0 ? 1 : d2 << 24 >> 24 != e2 << 24 >> 24) b3 = e2;
          else {
            do {
              b3 = b3 + 1 | 0;
              c3 = c3 + 1 | 0;
              d2 = a2[b3 >> 0] | 0;
              e2 = a2[c3 >> 0] | 0;
            } while (!(d2 << 24 >> 24 == 0 ? 1 : d2 << 24 >> 24 != e2 << 24 >> 24));
            b3 = e2;
          }
          return (d2 & 255) - (b3 & 255) | 0;
        }
        function BB(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0;
          a: do
            if (!d2) b3 = 0;
            else {
              while (1) {
                e2 = a2[b3 >> 0] | 0;
                f2 = a2[c3 >> 0] | 0;
                if (e2 << 24 >> 24 != f2 << 24 >> 24) break;
                d2 = d2 + -1 | 0;
                if (!d2) {
                  b3 = 0;
                  break a;
                } else {
                  b3 = b3 + 1 | 0;
                  c3 = c3 + 1 | 0;
                }
              }
              b3 = (e2 & 255) - (f2 & 255) | 0;
            }
          while (0);
          return b3 | 0;
        }
        function CB(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0;
          s3 = l2;
          l2 = l2 + 224 | 0;
          n3 = s3 + 120 | 0;
          o3 = s3 + 80 | 0;
          q2 = s3;
          r3 = s3 + 136 | 0;
          f2 = o3;
          g2 = f2 + 40 | 0;
          do {
            c2[f2 >> 2] = 0;
            f2 = f2 + 4 | 0;
          } while ((f2 | 0) < (g2 | 0));
          c2[n3 >> 2] = c2[e2 >> 2];
          if ((DB(0, d2, n3, q2, o3) | 0) < 0) e2 = -1;
          else {
            if ((c2[b3 + 76 >> 2] | 0) > -1) p2 = EB(b3) | 0;
            else p2 = 0;
            e2 = c2[b3 >> 2] | 0;
            m2 = e2 & 32;
            if ((a2[b3 + 74 >> 0] | 0) < 1) c2[b3 >> 2] = e2 & -33;
            f2 = b3 + 48 | 0;
            if (!(c2[f2 >> 2] | 0)) {
              g2 = b3 + 44 | 0;
              h3 = c2[g2 >> 2] | 0;
              c2[g2 >> 2] = r3;
              i4 = b3 + 28 | 0;
              c2[i4 >> 2] = r3;
              j2 = b3 + 20 | 0;
              c2[j2 >> 2] = r3;
              c2[f2 >> 2] = 80;
              k2 = b3 + 16 | 0;
              c2[k2 >> 2] = r3 + 80;
              e2 = DB(b3, d2, n3, q2, o3) | 0;
              if (h3) {
                sb[c2[b3 + 36 >> 2] & 7](b3, 0, 0) | 0;
                e2 = (c2[j2 >> 2] | 0) == 0 ? -1 : e2;
                c2[g2 >> 2] = h3;
                c2[f2 >> 2] = 0;
                c2[k2 >> 2] = 0;
                c2[i4 >> 2] = 0;
                c2[j2 >> 2] = 0;
              }
            } else e2 = DB(b3, d2, n3, q2, o3) | 0;
            f2 = c2[b3 >> 2] | 0;
            c2[b3 >> 2] = f2 | m2;
            if (p2 | 0) FB(b3);
            e2 = (f2 & 32 | 0) == 0 ? e2 : -1;
          }
          l2 = s3;
          return e2 | 0;
        }
        function DB(d2, e2, f2, g2, i4) {
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          i4 = i4 | 0;
          var j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = 0, v2 = 0, w3 = 0, x3 = 0, y3 = 0, z2 = 0, B3 = 0, C3 = 0, D3 = 0, E3 = 0, F3 = 0, G3 = 0, H2 = 0;
          H2 = l2;
          l2 = l2 + 64 | 0;
          D3 = H2 + 16 | 0;
          E3 = H2;
          B3 = H2 + 24 | 0;
          F3 = H2 + 8 | 0;
          G3 = H2 + 20 | 0;
          c2[D3 >> 2] = e2;
          x3 = (d2 | 0) != 0;
          y3 = B3 + 40 | 0;
          z2 = y3;
          B3 = B3 + 39 | 0;
          C3 = F3 + 4 | 0;
          k2 = 0;
          j2 = 0;
          p2 = 0;
          a: while (1) {
            do
              if ((j2 | 0) > -1) if ((k2 | 0) > (2147483647 - j2 | 0)) {
                c2[(vB() | 0) >> 2] = 75;
                j2 = -1;
                break;
              } else {
                j2 = k2 + j2 | 0;
                break;
              }
            while (0);
            k2 = a2[e2 >> 0] | 0;
            if (!(k2 << 24 >> 24)) {
              w3 = 87;
              break;
            } else m2 = e2;
            b: while (1) {
              switch (k2 << 24 >> 24) {
                case 37: {
                  k2 = m2;
                  w3 = 9;
                  break b;
                }
                case 0: {
                  k2 = m2;
                  break b;
                }
                default: {
                }
              }
              v2 = m2 + 1 | 0;
              c2[D3 >> 2] = v2;
              k2 = a2[v2 >> 0] | 0;
              m2 = v2;
            }
            c: do
              if ((w3 | 0) == 9) while (1) {
                w3 = 0;
                if ((a2[m2 + 1 >> 0] | 0) != 37) break c;
                k2 = k2 + 1 | 0;
                m2 = m2 + 2 | 0;
                c2[D3 >> 2] = m2;
                if ((a2[m2 >> 0] | 0) == 37) w3 = 9;
                else break;
              }
            while (0);
            k2 = k2 - e2 | 0;
            if (x3) GB(d2, e2, k2);
            if (k2 | 0) {
              e2 = m2;
              continue;
            }
            n3 = m2 + 1 | 0;
            k2 = (a2[n3 >> 0] | 0) + -48 | 0;
            if (k2 >>> 0 < 10) {
              v2 = (a2[m2 + 2 >> 0] | 0) == 36;
              u2 = v2 ? k2 : -1;
              p2 = v2 ? 1 : p2;
              n3 = v2 ? m2 + 3 | 0 : n3;
            } else u2 = -1;
            c2[D3 >> 2] = n3;
            k2 = a2[n3 >> 0] | 0;
            m2 = (k2 << 24 >> 24) + -32 | 0;
            d: do
              if (m2 >>> 0 < 32) {
                o3 = 0;
                q2 = k2;
                while (1) {
                  k2 = 1 << m2;
                  if (!(k2 & 75913)) {
                    k2 = q2;
                    break d;
                  }
                  o3 = k2 | o3;
                  n3 = n3 + 1 | 0;
                  c2[D3 >> 2] = n3;
                  k2 = a2[n3 >> 0] | 0;
                  m2 = (k2 << 24 >> 24) + -32 | 0;
                  if (m2 >>> 0 >= 32) break;
                  else q2 = k2;
                }
              } else o3 = 0;
            while (0);
            if (k2 << 24 >> 24 == 42) {
              m2 = n3 + 1 | 0;
              k2 = (a2[m2 >> 0] | 0) + -48 | 0;
              if (k2 >>> 0 < 10 ? (a2[n3 + 2 >> 0] | 0) == 36 : 0) {
                c2[i4 + (k2 << 2) >> 2] = 10;
                k2 = c2[g2 + ((a2[m2 >> 0] | 0) + -48 << 3) >> 2] | 0;
                p2 = 1;
                n3 = n3 + 3 | 0;
              } else {
                if (p2 | 0) {
                  j2 = -1;
                  break;
                }
                if (x3) {
                  p2 = (c2[f2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  k2 = c2[p2 >> 2] | 0;
                  c2[f2 >> 2] = p2 + 4;
                  p2 = 0;
                  n3 = m2;
                } else {
                  k2 = 0;
                  p2 = 0;
                  n3 = m2;
                }
              }
              c2[D3 >> 2] = n3;
              v2 = (k2 | 0) < 0;
              k2 = v2 ? 0 - k2 | 0 : k2;
              o3 = v2 ? o3 | 8192 : o3;
            } else {
              k2 = HB(D3) | 0;
              if ((k2 | 0) < 0) {
                j2 = -1;
                break;
              }
              n3 = c2[D3 >> 2] | 0;
            }
            do
              if ((a2[n3 >> 0] | 0) == 46) {
                if ((a2[n3 + 1 >> 0] | 0) != 42) {
                  c2[D3 >> 2] = n3 + 1;
                  m2 = HB(D3) | 0;
                  n3 = c2[D3 >> 2] | 0;
                  break;
                }
                q2 = n3 + 2 | 0;
                m2 = (a2[q2 >> 0] | 0) + -48 | 0;
                if (m2 >>> 0 < 10 ? (a2[n3 + 3 >> 0] | 0) == 36 : 0) {
                  c2[i4 + (m2 << 2) >> 2] = 10;
                  m2 = c2[g2 + ((a2[q2 >> 0] | 0) + -48 << 3) >> 2] | 0;
                  n3 = n3 + 4 | 0;
                  c2[D3 >> 2] = n3;
                  break;
                }
                if (p2 | 0) {
                  j2 = -1;
                  break a;
                }
                if (x3) {
                  v2 = (c2[f2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  m2 = c2[v2 >> 2] | 0;
                  c2[f2 >> 2] = v2 + 4;
                } else m2 = 0;
                c2[D3 >> 2] = q2;
                n3 = q2;
              } else m2 = -1;
            while (0);
            t3 = 0;
            while (1) {
              if (((a2[n3 >> 0] | 0) + -65 | 0) >>> 0 > 57) {
                j2 = -1;
                break a;
              }
              v2 = n3 + 1 | 0;
              c2[D3 >> 2] = v2;
              q2 = a2[(a2[n3 >> 0] | 0) + -65 + (5178 + (t3 * 58 | 0)) >> 0] | 0;
              r3 = q2 & 255;
              if ((r3 + -1 | 0) >>> 0 < 8) {
                t3 = r3;
                n3 = v2;
              } else break;
            }
            if (!(q2 << 24 >> 24)) {
              j2 = -1;
              break;
            }
            s3 = (u2 | 0) > -1;
            do
              if (q2 << 24 >> 24 == 19) {
                if (s3) {
                  j2 = -1;
                  break a;
                } else w3 = 49;
              } else {
                if (s3) {
                  c2[i4 + (u2 << 2) >> 2] = r3;
                  s3 = g2 + (u2 << 3) | 0;
                  u2 = c2[s3 + 4 >> 2] | 0;
                  w3 = E3;
                  c2[w3 >> 2] = c2[s3 >> 2];
                  c2[w3 + 4 >> 2] = u2;
                  w3 = 49;
                  break;
                }
                if (!x3) {
                  j2 = 0;
                  break a;
                }
                IB(E3, r3, f2);
              }
            while (0);
            if ((w3 | 0) == 49 ? (w3 = 0, !x3) : 0) {
              k2 = 0;
              e2 = v2;
              continue;
            }
            n3 = a2[n3 >> 0] | 0;
            n3 = (t3 | 0) != 0 & (n3 & 15 | 0) == 3 ? n3 & -33 : n3;
            s3 = o3 & -65537;
            u2 = (o3 & 8192 | 0) == 0 ? o3 : s3;
            e: do
              switch (n3 | 0) {
                case 110:
                  switch ((t3 & 255) << 24 >> 24) {
                    case 0: {
                      c2[c2[E3 >> 2] >> 2] = j2;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    case 1: {
                      c2[c2[E3 >> 2] >> 2] = j2;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    case 2: {
                      k2 = c2[E3 >> 2] | 0;
                      c2[k2 >> 2] = j2;
                      c2[k2 + 4 >> 2] = ((j2 | 0) < 0) << 31 >> 31;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    case 3: {
                      b2[c2[E3 >> 2] >> 1] = j2;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    case 4: {
                      a2[c2[E3 >> 2] >> 0] = j2;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    case 6: {
                      c2[c2[E3 >> 2] >> 2] = j2;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    case 7: {
                      k2 = c2[E3 >> 2] | 0;
                      c2[k2 >> 2] = j2;
                      c2[k2 + 4 >> 2] = ((j2 | 0) < 0) << 31 >> 31;
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                    default: {
                      k2 = 0;
                      e2 = v2;
                      continue a;
                    }
                  }
                case 112: {
                  n3 = 120;
                  m2 = m2 >>> 0 > 8 ? m2 : 8;
                  e2 = u2 | 8;
                  w3 = 61;
                  break;
                }
                case 88:
                case 120: {
                  e2 = u2;
                  w3 = 61;
                  break;
                }
                case 111: {
                  n3 = E3;
                  e2 = c2[n3 >> 2] | 0;
                  n3 = c2[n3 + 4 >> 2] | 0;
                  r3 = KB(e2, n3, y3) | 0;
                  s3 = z2 - r3 | 0;
                  o3 = 0;
                  q2 = 5642;
                  m2 = (u2 & 8 | 0) == 0 | (m2 | 0) > (s3 | 0) ? m2 : s3 + 1 | 0;
                  s3 = u2;
                  w3 = 67;
                  break;
                }
                case 105:
                case 100: {
                  n3 = E3;
                  e2 = c2[n3 >> 2] | 0;
                  n3 = c2[n3 + 4 >> 2] | 0;
                  if ((n3 | 0) < 0) {
                    e2 = wC(0, 0, e2 | 0, n3 | 0) | 0;
                    n3 = A2;
                    o3 = E3;
                    c2[o3 >> 2] = e2;
                    c2[o3 + 4 >> 2] = n3;
                    o3 = 1;
                    q2 = 5642;
                    w3 = 66;
                    break e;
                  } else {
                    o3 = (u2 & 2049 | 0) != 0 & 1;
                    q2 = (u2 & 2048 | 0) == 0 ? (u2 & 1 | 0) == 0 ? 5642 : 5644 : 5643;
                    w3 = 66;
                    break e;
                  }
                }
                case 117: {
                  n3 = E3;
                  o3 = 0;
                  q2 = 5642;
                  e2 = c2[n3 >> 2] | 0;
                  n3 = c2[n3 + 4 >> 2] | 0;
                  w3 = 66;
                  break;
                }
                case 99: {
                  a2[B3 >> 0] = c2[E3 >> 2];
                  e2 = B3;
                  o3 = 0;
                  q2 = 5642;
                  r3 = y3;
                  n3 = 1;
                  m2 = s3;
                  break;
                }
                case 109: {
                  n3 = MB(c2[(vB() | 0) >> 2] | 0) | 0;
                  w3 = 71;
                  break;
                }
                case 115: {
                  n3 = c2[E3 >> 2] | 0;
                  n3 = n3 | 0 ? n3 : 5652;
                  w3 = 71;
                  break;
                }
                case 67: {
                  c2[F3 >> 2] = c2[E3 >> 2];
                  c2[C3 >> 2] = 0;
                  c2[E3 >> 2] = F3;
                  r3 = -1;
                  n3 = F3;
                  w3 = 75;
                  break;
                }
                case 83: {
                  e2 = c2[E3 >> 2] | 0;
                  if (!m2) {
                    OB(d2, 32, k2, 0, u2);
                    e2 = 0;
                    w3 = 84;
                  } else {
                    r3 = m2;
                    n3 = e2;
                    w3 = 75;
                  }
                  break;
                }
                case 65:
                case 71:
                case 70:
                case 69:
                case 97:
                case 103:
                case 102:
                case 101: {
                  k2 = QB(d2, +h2[E3 >> 3], k2, m2, u2, n3) | 0;
                  e2 = v2;
                  continue a;
                }
                default: {
                  o3 = 0;
                  q2 = 5642;
                  r3 = y3;
                  n3 = m2;
                  m2 = u2;
                }
              }
            while (0);
            f: do
              if ((w3 | 0) == 61) {
                u2 = E3;
                t3 = c2[u2 >> 2] | 0;
                u2 = c2[u2 + 4 >> 2] | 0;
                r3 = JB(t3, u2, y3, n3 & 32) | 0;
                q2 = (e2 & 8 | 0) == 0 | (t3 | 0) == 0 & (u2 | 0) == 0;
                o3 = q2 ? 0 : 2;
                q2 = q2 ? 5642 : 5642 + (n3 >> 4) | 0;
                s3 = e2;
                e2 = t3;
                n3 = u2;
                w3 = 67;
              } else if ((w3 | 0) == 66) {
                r3 = LB(e2, n3, y3) | 0;
                s3 = u2;
                w3 = 67;
              } else if ((w3 | 0) == 71) {
                w3 = 0;
                u2 = NB(n3, 0, m2) | 0;
                t3 = (u2 | 0) == 0;
                e2 = n3;
                o3 = 0;
                q2 = 5642;
                r3 = t3 ? n3 + m2 | 0 : u2;
                n3 = t3 ? m2 : u2 - n3 | 0;
                m2 = s3;
              } else if ((w3 | 0) == 75) {
                w3 = 0;
                q2 = n3;
                e2 = 0;
                m2 = 0;
                while (1) {
                  o3 = c2[q2 >> 2] | 0;
                  if (!o3) break;
                  m2 = PB(G3, o3) | 0;
                  if ((m2 | 0) < 0 | m2 >>> 0 > (r3 - e2 | 0) >>> 0) break;
                  e2 = m2 + e2 | 0;
                  if (r3 >>> 0 > e2 >>> 0) q2 = q2 + 4 | 0;
                  else break;
                }
                if ((m2 | 0) < 0) {
                  j2 = -1;
                  break a;
                }
                OB(d2, 32, k2, e2, u2);
                if (!e2) {
                  e2 = 0;
                  w3 = 84;
                } else {
                  o3 = 0;
                  while (1) {
                    m2 = c2[n3 >> 2] | 0;
                    if (!m2) {
                      w3 = 84;
                      break f;
                    }
                    m2 = PB(G3, m2) | 0;
                    o3 = m2 + o3 | 0;
                    if ((o3 | 0) > (e2 | 0)) {
                      w3 = 84;
                      break f;
                    }
                    GB(d2, G3, m2);
                    if (o3 >>> 0 >= e2 >>> 0) {
                      w3 = 84;
                      break;
                    } else n3 = n3 + 4 | 0;
                  }
                }
              }
            while (0);
            if ((w3 | 0) == 67) {
              w3 = 0;
              n3 = (e2 | 0) != 0 | (n3 | 0) != 0;
              u2 = (m2 | 0) != 0 | n3;
              n3 = ((n3 ^ 1) & 1) + (z2 - r3) | 0;
              e2 = u2 ? r3 : y3;
              r3 = y3;
              n3 = u2 ? (m2 | 0) > (n3 | 0) ? m2 : n3 : m2;
              m2 = (m2 | 0) > -1 ? s3 & -65537 : s3;
            } else if ((w3 | 0) == 84) {
              w3 = 0;
              OB(d2, 32, k2, e2, u2 ^ 8192);
              k2 = (k2 | 0) > (e2 | 0) ? k2 : e2;
              e2 = v2;
              continue;
            }
            t3 = r3 - e2 | 0;
            s3 = (n3 | 0) < (t3 | 0) ? t3 : n3;
            u2 = s3 + o3 | 0;
            k2 = (k2 | 0) < (u2 | 0) ? u2 : k2;
            OB(d2, 32, k2, u2, m2);
            GB(d2, q2, o3);
            OB(d2, 48, k2, u2, m2 ^ 65536);
            OB(d2, 48, s3, t3, 0);
            GB(d2, e2, t3);
            OB(d2, 32, k2, u2, m2 ^ 8192);
            e2 = v2;
          }
          g: do
            if ((w3 | 0) == 87) {
              if (!d2) if (!p2) j2 = 0;
              else {
                j2 = 1;
                while (1) {
                  e2 = c2[i4 + (j2 << 2) >> 2] | 0;
                  if (!e2) break;
                  IB(g2 + (j2 << 3) | 0, e2, f2);
                  j2 = j2 + 1 | 0;
                  if ((j2 | 0) >= 10) {
                    j2 = 1;
                    break g;
                  }
                }
                while (1) {
                  if (c2[i4 + (j2 << 2) >> 2] | 0) {
                    j2 = -1;
                    break g;
                  }
                  j2 = j2 + 1 | 0;
                  if ((j2 | 0) >= 10) {
                    j2 = 1;
                    break;
                  }
                }
              }
            }
          while (0);
          l2 = H2;
          return j2 | 0;
        }
        function EB(a3) {
          a3 = a3 | 0;
          return 0;
        }
        function FB(a3) {
          a3 = a3 | 0;
          return;
        }
        function GB(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          if (!(c2[a3 >> 2] & 32)) aC(b3, d2, a3) | 0;
          return;
        }
        function HB(b3) {
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          e2 = c2[b3 >> 2] | 0;
          f2 = (a2[e2 >> 0] | 0) + -48 | 0;
          if (f2 >>> 0 < 10) {
            d2 = 0;
            do {
              d2 = f2 + (d2 * 10 | 0) | 0;
              e2 = e2 + 1 | 0;
              c2[b3 >> 2] = e2;
              f2 = (a2[e2 >> 0] | 0) + -48 | 0;
            } while (f2 >>> 0 < 10);
          } else d2 = 0;
          return d2 | 0;
        }
        function IB(a3, b3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          var e2 = 0, f2 = 0, g2 = 0;
          a: do
            if (b3 >>> 0 <= 20) do
              switch (b3 | 0) {
                case 9: {
                  e2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  b3 = c2[e2 >> 2] | 0;
                  c2[d2 >> 2] = e2 + 4;
                  c2[a3 >> 2] = b3;
                  break a;
                }
                case 10: {
                  e2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  b3 = c2[e2 >> 2] | 0;
                  c2[d2 >> 2] = e2 + 4;
                  e2 = a3;
                  c2[e2 >> 2] = b3;
                  c2[e2 + 4 >> 2] = ((b3 | 0) < 0) << 31 >> 31;
                  break a;
                }
                case 11: {
                  e2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  b3 = c2[e2 >> 2] | 0;
                  c2[d2 >> 2] = e2 + 4;
                  e2 = a3;
                  c2[e2 >> 2] = b3;
                  c2[e2 + 4 >> 2] = 0;
                  break a;
                }
                case 12: {
                  e2 = (c2[d2 >> 2] | 0) + (8 - 1) & ~(8 - 1);
                  b3 = e2;
                  f2 = c2[b3 >> 2] | 0;
                  b3 = c2[b3 + 4 >> 2] | 0;
                  c2[d2 >> 2] = e2 + 8;
                  e2 = a3;
                  c2[e2 >> 2] = f2;
                  c2[e2 + 4 >> 2] = b3;
                  break a;
                }
                case 13: {
                  f2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  e2 = c2[f2 >> 2] | 0;
                  c2[d2 >> 2] = f2 + 4;
                  e2 = (e2 & 65535) << 16 >> 16;
                  f2 = a3;
                  c2[f2 >> 2] = e2;
                  c2[f2 + 4 >> 2] = ((e2 | 0) < 0) << 31 >> 31;
                  break a;
                }
                case 14: {
                  f2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  e2 = c2[f2 >> 2] | 0;
                  c2[d2 >> 2] = f2 + 4;
                  f2 = a3;
                  c2[f2 >> 2] = e2 & 65535;
                  c2[f2 + 4 >> 2] = 0;
                  break a;
                }
                case 15: {
                  f2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  e2 = c2[f2 >> 2] | 0;
                  c2[d2 >> 2] = f2 + 4;
                  e2 = (e2 & 255) << 24 >> 24;
                  f2 = a3;
                  c2[f2 >> 2] = e2;
                  c2[f2 + 4 >> 2] = ((e2 | 0) < 0) << 31 >> 31;
                  break a;
                }
                case 16: {
                  f2 = (c2[d2 >> 2] | 0) + (4 - 1) & ~(4 - 1);
                  e2 = c2[f2 >> 2] | 0;
                  c2[d2 >> 2] = f2 + 4;
                  f2 = a3;
                  c2[f2 >> 2] = e2 & 255;
                  c2[f2 + 4 >> 2] = 0;
                  break a;
                }
                case 17: {
                  f2 = (c2[d2 >> 2] | 0) + (8 - 1) & ~(8 - 1);
                  g2 = +h2[f2 >> 3];
                  c2[d2 >> 2] = f2 + 8;
                  h2[a3 >> 3] = g2;
                  break a;
                }
                case 18: {
                  f2 = (c2[d2 >> 2] | 0) + (8 - 1) & ~(8 - 1);
                  g2 = +h2[f2 >> 3];
                  c2[d2 >> 2] = f2 + 8;
                  h2[a3 >> 3] = g2;
                  break a;
                }
                default:
                  break a;
              }
            while (0);
          while (0);
          return;
        }
        function JB(b3, c3, e2, f2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          if (!((b3 | 0) == 0 & (c3 | 0) == 0)) do {
            e2 = e2 + -1 | 0;
            a2[e2 >> 0] = d[5694 + (b3 & 15) >> 0] | 0 | f2;
            b3 = AC(b3 | 0, c3 | 0, 4) | 0;
            c3 = A2;
          } while (!((b3 | 0) == 0 & (c3 | 0) == 0));
          return e2 | 0;
        }
        function KB(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          if (!((b3 | 0) == 0 & (c3 | 0) == 0)) do {
            d2 = d2 + -1 | 0;
            a2[d2 >> 0] = b3 & 7 | 48;
            b3 = AC(b3 | 0, c3 | 0, 3) | 0;
            c3 = A2;
          } while (!((b3 | 0) == 0 & (c3 | 0) == 0));
          return d2 | 0;
        }
        function LB(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          if (c3 >>> 0 > 0 | (c3 | 0) == 0 & b3 >>> 0 > 4294967295) {
            while (1) {
              e2 = HC(b3 | 0, c3 | 0, 10, 0) | 0;
              d2 = d2 + -1 | 0;
              a2[d2 >> 0] = e2 & 255 | 48;
              e2 = b3;
              b3 = EC(b3 | 0, c3 | 0, 10, 0) | 0;
              if (!(c3 >>> 0 > 9 | (c3 | 0) == 9 & e2 >>> 0 > 4294967295)) break;
              else c3 = A2;
            }
            c3 = b3;
          } else c3 = b3;
          if (c3) while (1) {
            d2 = d2 + -1 | 0;
            a2[d2 >> 0] = (c3 >>> 0) % 10 | 0 | 48;
            if (c3 >>> 0 < 10) break;
            else c3 = (c3 >>> 0) / 10 | 0;
          }
          return d2 | 0;
        }
        function MB(a3) {
          a3 = a3 | 0;
          return XB(a3, c2[(WB() | 0) + 188 >> 2] | 0) | 0;
        }
        function NB(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          h3 = d2 & 255;
          f2 = (e2 | 0) != 0;
          a: do
            if (f2 & (b3 & 3 | 0) != 0) {
              g2 = d2 & 255;
              while (1) {
                if ((a2[b3 >> 0] | 0) == g2 << 24 >> 24) {
                  i4 = 6;
                  break a;
                }
                b3 = b3 + 1 | 0;
                e2 = e2 + -1 | 0;
                f2 = (e2 | 0) != 0;
                if (!(f2 & (b3 & 3 | 0) != 0)) {
                  i4 = 5;
                  break;
                }
              }
            } else i4 = 5;
          while (0);
          if ((i4 | 0) == 5) if (f2) i4 = 6;
          else e2 = 0;
          b: do
            if ((i4 | 0) == 6) {
              g2 = d2 & 255;
              if ((a2[b3 >> 0] | 0) != g2 << 24 >> 24) {
                f2 = P(h3, 16843009) | 0;
                c: do
                  if (e2 >>> 0 > 3) while (1) {
                    h3 = c2[b3 >> 2] ^ f2;
                    if ((h3 & -2139062144 ^ -2139062144) & h3 + -16843009 | 0) break;
                    b3 = b3 + 4 | 0;
                    e2 = e2 + -4 | 0;
                    if (e2 >>> 0 <= 3) {
                      i4 = 11;
                      break c;
                    }
                  }
                  else i4 = 11;
                while (0);
                if ((i4 | 0) == 11) {
                  if (!e2) {
                    e2 = 0;
                    break;
                  }
                }
                while (1) {
                  if ((a2[b3 >> 0] | 0) == g2 << 24 >> 24) break b;
                  b3 = b3 + 1 | 0;
                  e2 = e2 + -1 | 0;
                  if (!e2) {
                    e2 = 0;
                    break;
                  }
                }
              }
            }
          while (0);
          return (e2 | 0 ? b3 : 0) | 0;
        }
        function OB(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 256 | 0;
          f2 = g2;
          if ((c3 | 0) > (d2 | 0) & (e2 & 73728 | 0) == 0) {
            e2 = c3 - d2 | 0;
            yC(f2 | 0, b3 | 0, (e2 >>> 0 < 256 ? e2 : 256) | 0) | 0;
            if (e2 >>> 0 > 255) {
              b3 = c3 - d2 | 0;
              do {
                GB(a3, f2, 256);
                e2 = e2 + -256 | 0;
              } while (e2 >>> 0 > 255);
              e2 = b3 & 255;
            }
            GB(a3, f2, e2);
          }
          l2 = g2;
          return;
        }
        function PB(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (!a3) a3 = 0;
          else a3 = UB(a3, b3, 0) | 0;
          return a3 | 0;
        }
        function QB(b3, e2, f2, g2, h3, i4) {
          b3 = b3 | 0;
          e2 = +e2;
          f2 = f2 | 0;
          g2 = g2 | 0;
          h3 = h3 | 0;
          i4 = i4 | 0;
          var j2 = 0, k2 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0, q2 = 0, r3 = 0, s3 = 0, t3 = 0, u2 = 0, v2 = 0, w3 = 0, x3 = 0, y3 = 0, z2 = 0, B3 = 0, C3 = 0, D3 = 0, E3 = 0, F3 = 0, G3 = 0, H2 = 0;
          H2 = l2;
          l2 = l2 + 560 | 0;
          m2 = H2 + 8 | 0;
          u2 = H2;
          G3 = H2 + 524 | 0;
          F3 = G3;
          n3 = H2 + 512 | 0;
          c2[u2 >> 2] = 0;
          E3 = n3 + 12 | 0;
          RB(e2) | 0;
          if ((A2 | 0) < 0) {
            e2 = -e2;
            C3 = 1;
            B3 = 5659;
          } else {
            C3 = (h3 & 2049 | 0) != 0 & 1;
            B3 = (h3 & 2048 | 0) == 0 ? (h3 & 1 | 0) == 0 ? 5660 : 5665 : 5662;
          }
          RB(e2) | 0;
          D3 = A2 & 2146435072;
          do
            if (D3 >>> 0 < 2146435072 | (D3 | 0) == 2146435072 & 0 < 0) {
              r3 = +SB(e2, u2) * 2;
              j2 = r3 != 0;
              if (j2) c2[u2 >> 2] = (c2[u2 >> 2] | 0) + -1;
              w3 = i4 | 32;
              if ((w3 | 0) == 97) {
                s3 = i4 & 32;
                q2 = (s3 | 0) == 0 ? B3 : B3 + 9 | 0;
                p2 = C3 | 2;
                j2 = 12 - g2 | 0;
                do
                  if (!(g2 >>> 0 > 11 | (j2 | 0) == 0)) {
                    e2 = 8;
                    do {
                      j2 = j2 + -1 | 0;
                      e2 = e2 * 16;
                    } while ((j2 | 0) != 0);
                    if ((a2[q2 >> 0] | 0) == 45) {
                      e2 = -(e2 + (-r3 - e2));
                      break;
                    } else {
                      e2 = r3 + e2 - e2;
                      break;
                    }
                  } else e2 = r3;
                while (0);
                k2 = c2[u2 >> 2] | 0;
                j2 = (k2 | 0) < 0 ? 0 - k2 | 0 : k2;
                j2 = LB(j2, ((j2 | 0) < 0) << 31 >> 31, E3) | 0;
                if ((j2 | 0) == (E3 | 0)) {
                  j2 = n3 + 11 | 0;
                  a2[j2 >> 0] = 48;
                }
                a2[j2 + -1 >> 0] = (k2 >> 31 & 2) + 43;
                o3 = j2 + -2 | 0;
                a2[o3 >> 0] = i4 + 15;
                n3 = (g2 | 0) < 1;
                m2 = (h3 & 8 | 0) == 0;
                j2 = G3;
                do {
                  D3 = ~~e2;
                  k2 = j2 + 1 | 0;
                  a2[j2 >> 0] = d[5694 + D3 >> 0] | s3;
                  e2 = (e2 - +(D3 | 0)) * 16;
                  if ((k2 - F3 | 0) == 1 ? !(m2 & (n3 & e2 == 0)) : 0) {
                    a2[k2 >> 0] = 46;
                    j2 = j2 + 2 | 0;
                  } else j2 = k2;
                } while (e2 != 0);
                D3 = j2 - F3 | 0;
                F3 = E3 - o3 | 0;
                E3 = (g2 | 0) != 0 & (D3 + -2 | 0) < (g2 | 0) ? g2 + 2 | 0 : D3;
                j2 = F3 + p2 + E3 | 0;
                OB(b3, 32, f2, j2, h3);
                GB(b3, q2, p2);
                OB(b3, 48, f2, j2, h3 ^ 65536);
                GB(b3, G3, D3);
                OB(b3, 48, E3 - D3 | 0, 0, 0);
                GB(b3, o3, F3);
                OB(b3, 32, f2, j2, h3 ^ 8192);
                break;
              }
              k2 = (g2 | 0) < 0 ? 6 : g2;
              if (j2) {
                j2 = (c2[u2 >> 2] | 0) + -28 | 0;
                c2[u2 >> 2] = j2;
                e2 = r3 * 268435456;
              } else {
                e2 = r3;
                j2 = c2[u2 >> 2] | 0;
              }
              D3 = (j2 | 0) < 0 ? m2 : m2 + 288 | 0;
              m2 = D3;
              do {
                y3 = ~~e2 >>> 0;
                c2[m2 >> 2] = y3;
                m2 = m2 + 4 | 0;
                e2 = (e2 - +(y3 >>> 0)) * 1e9;
              } while (e2 != 0);
              if ((j2 | 0) > 0) {
                n3 = D3;
                p2 = m2;
                while (1) {
                  o3 = (j2 | 0) < 29 ? j2 : 29;
                  j2 = p2 + -4 | 0;
                  if (j2 >>> 0 >= n3 >>> 0) {
                    m2 = 0;
                    do {
                      x3 = zC(c2[j2 >> 2] | 0, 0, o3 | 0) | 0;
                      x3 = xC(x3 | 0, A2 | 0, m2 | 0, 0) | 0;
                      y3 = A2;
                      v2 = HC(x3 | 0, y3 | 0, 1e9, 0) | 0;
                      c2[j2 >> 2] = v2;
                      m2 = EC(x3 | 0, y3 | 0, 1e9, 0) | 0;
                      j2 = j2 + -4 | 0;
                    } while (j2 >>> 0 >= n3 >>> 0);
                    if (m2) {
                      n3 = n3 + -4 | 0;
                      c2[n3 >> 2] = m2;
                    }
                  }
                  m2 = p2;
                  while (1) {
                    if (m2 >>> 0 <= n3 >>> 0) break;
                    j2 = m2 + -4 | 0;
                    if (!(c2[j2 >> 2] | 0)) m2 = j2;
                    else break;
                  }
                  j2 = (c2[u2 >> 2] | 0) - o3 | 0;
                  c2[u2 >> 2] = j2;
                  if ((j2 | 0) > 0) p2 = m2;
                  else break;
                }
              } else n3 = D3;
              if ((j2 | 0) < 0) {
                g2 = ((k2 + 25 | 0) / 9 | 0) + 1 | 0;
                t3 = (w3 | 0) == 102;
                do {
                  s3 = 0 - j2 | 0;
                  s3 = (s3 | 0) < 9 ? s3 : 9;
                  if (n3 >>> 0 < m2 >>> 0) {
                    o3 = (1 << s3) + -1 | 0;
                    p2 = 1e9 >>> s3;
                    q2 = 0;
                    j2 = n3;
                    do {
                      y3 = c2[j2 >> 2] | 0;
                      c2[j2 >> 2] = (y3 >>> s3) + q2;
                      q2 = P(y3 & o3, p2) | 0;
                      j2 = j2 + 4 | 0;
                    } while (j2 >>> 0 < m2 >>> 0);
                    j2 = (c2[n3 >> 2] | 0) == 0 ? n3 + 4 | 0 : n3;
                    if (!q2) {
                      n3 = j2;
                      j2 = m2;
                    } else {
                      c2[m2 >> 2] = q2;
                      n3 = j2;
                      j2 = m2 + 4 | 0;
                    }
                  } else {
                    n3 = (c2[n3 >> 2] | 0) == 0 ? n3 + 4 | 0 : n3;
                    j2 = m2;
                  }
                  m2 = t3 ? D3 : n3;
                  m2 = (j2 - m2 >> 2 | 0) > (g2 | 0) ? m2 + (g2 << 2) | 0 : j2;
                  j2 = (c2[u2 >> 2] | 0) + s3 | 0;
                  c2[u2 >> 2] = j2;
                } while ((j2 | 0) < 0);
                j2 = n3;
                g2 = m2;
              } else {
                j2 = n3;
                g2 = m2;
              }
              y3 = D3;
              if (j2 >>> 0 < g2 >>> 0) {
                m2 = (y3 - j2 >> 2) * 9 | 0;
                o3 = c2[j2 >> 2] | 0;
                if (o3 >>> 0 >= 10) {
                  n3 = 10;
                  do {
                    n3 = n3 * 10 | 0;
                    m2 = m2 + 1 | 0;
                  } while (o3 >>> 0 >= n3 >>> 0);
                }
              } else m2 = 0;
              t3 = (w3 | 0) == 103;
              v2 = (k2 | 0) != 0;
              n3 = k2 - ((w3 | 0) != 102 ? m2 : 0) + ((v2 & t3) << 31 >> 31) | 0;
              if ((n3 | 0) < (((g2 - y3 >> 2) * 9 | 0) + -9 | 0)) {
                n3 = n3 + 9216 | 0;
                s3 = D3 + 4 + (((n3 | 0) / 9 | 0) + -1024 << 2) | 0;
                n3 = ((n3 | 0) % 9 | 0) + 1 | 0;
                if ((n3 | 0) < 9) {
                  o3 = 10;
                  do {
                    o3 = o3 * 10 | 0;
                    n3 = n3 + 1 | 0;
                  } while ((n3 | 0) != 9);
                } else o3 = 10;
                p2 = c2[s3 >> 2] | 0;
                q2 = (p2 >>> 0) % (o3 >>> 0) | 0;
                n3 = (s3 + 4 | 0) == (g2 | 0);
                if (!(n3 & (q2 | 0) == 0)) {
                  r3 = (((p2 >>> 0) / (o3 >>> 0) | 0) & 1 | 0) == 0 ? 9007199254740992 : 9007199254740994;
                  x3 = (o3 | 0) / 2 | 0;
                  e2 = q2 >>> 0 < x3 >>> 0 ? 0.5 : n3 & (q2 | 0) == (x3 | 0) ? 1 : 1.5;
                  if (C3) {
                    x3 = (a2[B3 >> 0] | 0) == 45;
                    e2 = x3 ? -e2 : e2;
                    r3 = x3 ? -r3 : r3;
                  }
                  n3 = p2 - q2 | 0;
                  c2[s3 >> 2] = n3;
                  if (r3 + e2 != r3) {
                    x3 = n3 + o3 | 0;
                    c2[s3 >> 2] = x3;
                    if (x3 >>> 0 > 999999999) {
                      m2 = s3;
                      while (1) {
                        n3 = m2 + -4 | 0;
                        c2[m2 >> 2] = 0;
                        if (n3 >>> 0 < j2 >>> 0) {
                          j2 = j2 + -4 | 0;
                          c2[j2 >> 2] = 0;
                        }
                        x3 = (c2[n3 >> 2] | 0) + 1 | 0;
                        c2[n3 >> 2] = x3;
                        if (x3 >>> 0 > 999999999) m2 = n3;
                        else break;
                      }
                    } else n3 = s3;
                    m2 = (y3 - j2 >> 2) * 9 | 0;
                    p2 = c2[j2 >> 2] | 0;
                    if (p2 >>> 0 >= 10) {
                      o3 = 10;
                      do {
                        o3 = o3 * 10 | 0;
                        m2 = m2 + 1 | 0;
                      } while (p2 >>> 0 >= o3 >>> 0);
                    }
                  } else n3 = s3;
                } else n3 = s3;
                n3 = n3 + 4 | 0;
                n3 = g2 >>> 0 > n3 >>> 0 ? n3 : g2;
                x3 = j2;
              } else {
                n3 = g2;
                x3 = j2;
              }
              w3 = n3;
              while (1) {
                if (w3 >>> 0 <= x3 >>> 0) {
                  u2 = 0;
                  break;
                }
                j2 = w3 + -4 | 0;
                if (!(c2[j2 >> 2] | 0)) w3 = j2;
                else {
                  u2 = 1;
                  break;
                }
              }
              g2 = 0 - m2 | 0;
              do
                if (t3) {
                  j2 = ((v2 ^ 1) & 1) + k2 | 0;
                  if ((j2 | 0) > (m2 | 0) & (m2 | 0) > -5) {
                    o3 = i4 + -1 | 0;
                    k2 = j2 + -1 - m2 | 0;
                  } else {
                    o3 = i4 + -2 | 0;
                    k2 = j2 + -1 | 0;
                  }
                  j2 = h3 & 8;
                  if (!j2) {
                    if (u2 ? (z2 = c2[w3 + -4 >> 2] | 0, (z2 | 0) != 0) : 0) {
                      if (!((z2 >>> 0) % 10 | 0)) {
                        n3 = 0;
                        j2 = 10;
                        do {
                          j2 = j2 * 10 | 0;
                          n3 = n3 + 1 | 0;
                        } while (!((z2 >>> 0) % (j2 >>> 0) | 0 | 0));
                      } else n3 = 0;
                    } else n3 = 9;
                    j2 = ((w3 - y3 >> 2) * 9 | 0) + -9 | 0;
                    if ((o3 | 32 | 0) == 102) {
                      s3 = j2 - n3 | 0;
                      s3 = (s3 | 0) > 0 ? s3 : 0;
                      k2 = (k2 | 0) < (s3 | 0) ? k2 : s3;
                      s3 = 0;
                      break;
                    } else {
                      s3 = j2 + m2 - n3 | 0;
                      s3 = (s3 | 0) > 0 ? s3 : 0;
                      k2 = (k2 | 0) < (s3 | 0) ? k2 : s3;
                      s3 = 0;
                      break;
                    }
                  } else s3 = j2;
                } else {
                  o3 = i4;
                  s3 = h3 & 8;
                }
              while (0);
              t3 = k2 | s3;
              p2 = (t3 | 0) != 0 & 1;
              q2 = (o3 | 32 | 0) == 102;
              if (q2) {
                v2 = 0;
                j2 = (m2 | 0) > 0 ? m2 : 0;
              } else {
                j2 = (m2 | 0) < 0 ? g2 : m2;
                j2 = LB(j2, ((j2 | 0) < 0) << 31 >> 31, E3) | 0;
                n3 = E3;
                if ((n3 - j2 | 0) < 2) do {
                  j2 = j2 + -1 | 0;
                  a2[j2 >> 0] = 48;
                } while ((n3 - j2 | 0) < 2);
                a2[j2 + -1 >> 0] = (m2 >> 31 & 2) + 43;
                j2 = j2 + -2 | 0;
                a2[j2 >> 0] = o3;
                v2 = j2;
                j2 = n3 - j2 | 0;
              }
              j2 = C3 + 1 + k2 + p2 + j2 | 0;
              OB(b3, 32, f2, j2, h3);
              GB(b3, B3, C3);
              OB(b3, 48, f2, j2, h3 ^ 65536);
              if (q2) {
                o3 = x3 >>> 0 > D3 >>> 0 ? D3 : x3;
                s3 = G3 + 9 | 0;
                p2 = s3;
                q2 = G3 + 8 | 0;
                n3 = o3;
                do {
                  m2 = LB(c2[n3 >> 2] | 0, 0, s3) | 0;
                  if ((n3 | 0) == (o3 | 0)) {
                    if ((m2 | 0) == (s3 | 0)) {
                      a2[q2 >> 0] = 48;
                      m2 = q2;
                    }
                  } else if (m2 >>> 0 > G3 >>> 0) {
                    yC(G3 | 0, 48, m2 - F3 | 0) | 0;
                    do
                      m2 = m2 + -1 | 0;
                    while (m2 >>> 0 > G3 >>> 0);
                  }
                  GB(b3, m2, p2 - m2 | 0);
                  n3 = n3 + 4 | 0;
                } while (n3 >>> 0 <= D3 >>> 0);
                if (t3 | 0) GB(b3, 5710, 1);
                if (n3 >>> 0 < w3 >>> 0 & (k2 | 0) > 0) while (1) {
                  m2 = LB(c2[n3 >> 2] | 0, 0, s3) | 0;
                  if (m2 >>> 0 > G3 >>> 0) {
                    yC(G3 | 0, 48, m2 - F3 | 0) | 0;
                    do
                      m2 = m2 + -1 | 0;
                    while (m2 >>> 0 > G3 >>> 0);
                  }
                  GB(b3, m2, (k2 | 0) < 9 ? k2 : 9);
                  n3 = n3 + 4 | 0;
                  m2 = k2 + -9 | 0;
                  if (!(n3 >>> 0 < w3 >>> 0 & (k2 | 0) > 9)) {
                    k2 = m2;
                    break;
                  } else k2 = m2;
                }
                OB(b3, 48, k2 + 9 | 0, 9, 0);
              } else {
                t3 = u2 ? w3 : x3 + 4 | 0;
                if ((k2 | 0) > -1) {
                  u2 = G3 + 9 | 0;
                  s3 = (s3 | 0) == 0;
                  g2 = u2;
                  p2 = 0 - F3 | 0;
                  q2 = G3 + 8 | 0;
                  o3 = x3;
                  do {
                    m2 = LB(c2[o3 >> 2] | 0, 0, u2) | 0;
                    if ((m2 | 0) == (u2 | 0)) {
                      a2[q2 >> 0] = 48;
                      m2 = q2;
                    }
                    do
                      if ((o3 | 0) == (x3 | 0)) {
                        n3 = m2 + 1 | 0;
                        GB(b3, m2, 1);
                        if (s3 & (k2 | 0) < 1) {
                          m2 = n3;
                          break;
                        }
                        GB(b3, 5710, 1);
                        m2 = n3;
                      } else {
                        if (m2 >>> 0 <= G3 >>> 0) break;
                        yC(G3 | 0, 48, m2 + p2 | 0) | 0;
                        do
                          m2 = m2 + -1 | 0;
                        while (m2 >>> 0 > G3 >>> 0);
                      }
                    while (0);
                    F3 = g2 - m2 | 0;
                    GB(b3, m2, (k2 | 0) > (F3 | 0) ? F3 : k2);
                    k2 = k2 - F3 | 0;
                    o3 = o3 + 4 | 0;
                  } while (o3 >>> 0 < t3 >>> 0 & (k2 | 0) > -1);
                }
                OB(b3, 48, k2 + 18 | 0, 18, 0);
                GB(b3, v2, E3 - v2 | 0);
              }
              OB(b3, 32, f2, j2, h3 ^ 8192);
            } else {
              G3 = (i4 & 32 | 0) != 0;
              j2 = C3 + 3 | 0;
              OB(b3, 32, f2, j2, h3 & -65537);
              GB(b3, B3, C3);
              GB(b3, e2 != e2 | false ? G3 ? 5686 : 5690 : G3 ? 5678 : 5682, 3);
              OB(b3, 32, f2, j2, h3 ^ 8192);
            }
          while (0);
          l2 = H2;
          return ((j2 | 0) < (f2 | 0) ? f2 : j2) | 0;
        }
        function RB(a3) {
          a3 = +a3;
          var b3 = 0;
          h2[j >> 3] = a3;
          b3 = c2[j >> 2] | 0;
          A2 = c2[j + 4 >> 2] | 0;
          return b3 | 0;
        }
        function SB(a3, b3) {
          a3 = +a3;
          b3 = b3 | 0;
          return + +TB(a3, b3);
        }
        function TB(a3, b3) {
          a3 = +a3;
          b3 = b3 | 0;
          var d2 = 0, e2 = 0, f2 = 0;
          h2[j >> 3] = a3;
          d2 = c2[j >> 2] | 0;
          e2 = c2[j + 4 >> 2] | 0;
          f2 = AC(d2 | 0, e2 | 0, 52) | 0;
          switch (f2 & 2047) {
            case 0: {
              if (a3 != 0) {
                a3 = +TB(a3 * 18446744073709552e3, b3);
                d2 = (c2[b3 >> 2] | 0) + -64 | 0;
              } else d2 = 0;
              c2[b3 >> 2] = d2;
              break;
            }
            case 2047:
              break;
            default: {
              c2[b3 >> 2] = (f2 & 2047) + -1022;
              c2[j >> 2] = d2;
              c2[j + 4 >> 2] = e2 & -2146435073 | 1071644672;
              a3 = +h2[j >> 3];
            }
          }
          return +a3;
        }
        function UB(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          do
            if (b3) {
              if (d2 >>> 0 < 128) {
                a2[b3 >> 0] = d2;
                b3 = 1;
                break;
              }
              if (!(c2[c2[(VB() | 0) + 188 >> 2] >> 2] | 0)) if ((d2 & -128 | 0) == 57216) {
                a2[b3 >> 0] = d2;
                b3 = 1;
                break;
              } else {
                c2[(vB() | 0) >> 2] = 84;
                b3 = -1;
                break;
              }
              if (d2 >>> 0 < 2048) {
                a2[b3 >> 0] = d2 >>> 6 | 192;
                a2[b3 + 1 >> 0] = d2 & 63 | 128;
                b3 = 2;
                break;
              }
              if (d2 >>> 0 < 55296 | (d2 & -8192 | 0) == 57344) {
                a2[b3 >> 0] = d2 >>> 12 | 224;
                a2[b3 + 1 >> 0] = d2 >>> 6 & 63 | 128;
                a2[b3 + 2 >> 0] = d2 & 63 | 128;
                b3 = 3;
                break;
              }
              if ((d2 + -65536 | 0) >>> 0 < 1048576) {
                a2[b3 >> 0] = d2 >>> 18 | 240;
                a2[b3 + 1 >> 0] = d2 >>> 12 & 63 | 128;
                a2[b3 + 2 >> 0] = d2 >>> 6 & 63 | 128;
                a2[b3 + 3 >> 0] = d2 & 63 | 128;
                b3 = 4;
                break;
              } else {
                c2[(vB() | 0) >> 2] = 84;
                b3 = -1;
                break;
              }
            } else b3 = 1;
          while (0);
          return b3 | 0;
        }
        function VB() {
          return xB() | 0;
        }
        function WB() {
          return xB() | 0;
        }
        function XB(b3, e2) {
          b3 = b3 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = 0;
          while (1) {
            if ((d[5712 + g2 >> 0] | 0) == (b3 | 0)) {
              b3 = 2;
              break;
            }
            f2 = g2 + 1 | 0;
            if ((f2 | 0) == 87) {
              f2 = 5800;
              g2 = 87;
              b3 = 5;
              break;
            } else g2 = f2;
          }
          if ((b3 | 0) == 2) if (!g2) f2 = 5800;
          else {
            f2 = 5800;
            b3 = 5;
          }
          if ((b3 | 0) == 5) while (1) {
            do {
              b3 = f2;
              f2 = f2 + 1 | 0;
            } while ((a2[b3 >> 0] | 0) != 0);
            g2 = g2 + -1 | 0;
            if (!g2) break;
            else b3 = 5;
          }
          return YB(f2, c2[e2 + 20 >> 2] | 0) | 0;
        }
        function YB(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return ZB(a3, b3) | 0;
        }
        function ZB(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          if (!b3) b3 = 0;
          else b3 = _B(c2[b3 >> 2] | 0, c2[b3 + 4 >> 2] | 0, a3) | 0;
          return (b3 | 0 ? b3 : a3) | 0;
        }
        function _B(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, l3 = 0, m2 = 0, n3 = 0, o3 = 0;
          o3 = (c2[b3 >> 2] | 0) + 1794895138 | 0;
          h3 = $B(c2[b3 + 8 >> 2] | 0, o3) | 0;
          f2 = $B(c2[b3 + 12 >> 2] | 0, o3) | 0;
          g2 = $B(c2[b3 + 16 >> 2] | 0, o3) | 0;
          a: do
            if ((h3 >>> 0 < d2 >>> 2 >>> 0 ? (n3 = d2 - (h3 << 2) | 0, f2 >>> 0 < n3 >>> 0 & g2 >>> 0 < n3 >>> 0) : 0) ? ((g2 | f2) & 3 | 0) == 0 : 0) {
              n3 = f2 >>> 2;
              m2 = g2 >>> 2;
              l3 = 0;
              while (1) {
                j2 = h3 >>> 1;
                k2 = l3 + j2 | 0;
                i4 = k2 << 1;
                g2 = i4 + n3 | 0;
                f2 = $B(c2[b3 + (g2 << 2) >> 2] | 0, o3) | 0;
                g2 = $B(c2[b3 + (g2 + 1 << 2) >> 2] | 0, o3) | 0;
                if (!(g2 >>> 0 < d2 >>> 0 & f2 >>> 0 < (d2 - g2 | 0) >>> 0)) {
                  f2 = 0;
                  break a;
                }
                if (a2[b3 + (g2 + f2) >> 0] | 0) {
                  f2 = 0;
                  break a;
                }
                f2 = AB(e2, b3 + g2 | 0) | 0;
                if (!f2) break;
                f2 = (f2 | 0) < 0;
                if ((h3 | 0) == 1) {
                  f2 = 0;
                  break a;
                } else {
                  l3 = f2 ? l3 : k2;
                  h3 = f2 ? j2 : h3 - j2 | 0;
                }
              }
              f2 = i4 + m2 | 0;
              g2 = $B(c2[b3 + (f2 << 2) >> 2] | 0, o3) | 0;
              f2 = $B(c2[b3 + (f2 + 1 << 2) >> 2] | 0, o3) | 0;
              if (f2 >>> 0 < d2 >>> 0 & g2 >>> 0 < (d2 - f2 | 0) >>> 0) f2 = (a2[b3 + (f2 + g2) >> 0] | 0) == 0 ? b3 + f2 | 0 : 0;
              else f2 = 0;
            } else f2 = 0;
          while (0);
          return f2 | 0;
        }
        function $B(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          var c3 = 0;
          c3 = IC(a3 | 0) | 0;
          return ((b3 | 0) == 0 ? a3 : c3) | 0;
        }
        function aC(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0, j2 = 0;
          f2 = e2 + 16 | 0;
          g2 = c2[f2 >> 2] | 0;
          if (!g2) {
            if (!(bC(e2) | 0)) {
              g2 = c2[f2 >> 2] | 0;
              h3 = 5;
            } else f2 = 0;
          } else h3 = 5;
          a: do
            if ((h3 | 0) == 5) {
              j2 = e2 + 20 | 0;
              i4 = c2[j2 >> 2] | 0;
              f2 = i4;
              if ((g2 - i4 | 0) >>> 0 < d2 >>> 0) {
                f2 = sb[c2[e2 + 36 >> 2] & 7](e2, b3, d2) | 0;
                break;
              }
              b: do
                if ((a2[e2 + 75 >> 0] | 0) > -1) {
                  i4 = d2;
                  while (1) {
                    if (!i4) {
                      h3 = 0;
                      g2 = b3;
                      break b;
                    }
                    g2 = i4 + -1 | 0;
                    if ((a2[b3 + g2 >> 0] | 0) == 10) break;
                    else i4 = g2;
                  }
                  f2 = sb[c2[e2 + 36 >> 2] & 7](e2, b3, i4) | 0;
                  if (f2 >>> 0 < i4 >>> 0) break a;
                  h3 = i4;
                  g2 = b3 + i4 | 0;
                  d2 = d2 - i4 | 0;
                  f2 = c2[j2 >> 2] | 0;
                } else {
                  h3 = 0;
                  g2 = b3;
                }
              while (0);
              BC(f2 | 0, g2 | 0, d2 | 0) | 0;
              c2[j2 >> 2] = (c2[j2 >> 2] | 0) + d2;
              f2 = h3 + d2 | 0;
            }
          while (0);
          return f2 | 0;
        }
        function bC(b3) {
          b3 = b3 | 0;
          var d2 = 0, e2 = 0;
          d2 = b3 + 74 | 0;
          e2 = a2[d2 >> 0] | 0;
          a2[d2 >> 0] = e2 + 255 | e2;
          d2 = c2[b3 >> 2] | 0;
          if (!(d2 & 8)) {
            c2[b3 + 8 >> 2] = 0;
            c2[b3 + 4 >> 2] = 0;
            e2 = c2[b3 + 44 >> 2] | 0;
            c2[b3 + 28 >> 2] = e2;
            c2[b3 + 20 >> 2] = e2;
            c2[b3 + 16 >> 2] = e2 + (c2[b3 + 48 >> 2] | 0);
            b3 = 0;
          } else {
            c2[b3 >> 2] = d2 | 32;
            b3 = -1;
          }
          return b3 | 0;
        }
        function cC(a3, b3) {
          a3 = T2(a3);
          b3 = T2(b3);
          var c3 = 0, d2 = 0;
          c3 = dC(a3) | 0;
          do
            if ((c3 & 2147483647) >>> 0 <= 2139095040) {
              d2 = dC(b3) | 0;
              if ((d2 & 2147483647) >>> 0 <= 2139095040) if ((d2 ^ c3 | 0) < 0) {
                a3 = (c3 | 0) < 0 ? b3 : a3;
                break;
              } else {
                a3 = a3 < b3 ? b3 : a3;
                break;
              }
            } else a3 = b3;
          while (0);
          return T2(a3);
        }
        function dC(a3) {
          a3 = T2(a3);
          return (g[j >> 2] = a3, c2[j >> 2] | 0) | 0;
        }
        function eC(a3, b3) {
          a3 = T2(a3);
          b3 = T2(b3);
          var c3 = 0, d2 = 0;
          c3 = fC(a3) | 0;
          do
            if ((c3 & 2147483647) >>> 0 <= 2139095040) {
              d2 = fC(b3) | 0;
              if ((d2 & 2147483647) >>> 0 <= 2139095040) if ((d2 ^ c3 | 0) < 0) {
                a3 = (c3 | 0) < 0 ? a3 : b3;
                break;
              } else {
                a3 = a3 < b3 ? a3 : b3;
                break;
              }
            } else a3 = b3;
          while (0);
          return T2(a3);
        }
        function fC(a3) {
          a3 = T2(a3);
          return (g[j >> 2] = a3, c2[j >> 2] | 0) | 0;
        }
        function gC(a3, b3) {
          a3 = T2(a3);
          b3 = T2(b3);
          var d2 = 0, e2 = 0, f2 = 0, h3 = 0, i4 = 0, k2 = 0, l3 = 0, m2 = 0;
          h3 = (g[j >> 2] = a3, c2[j >> 2] | 0);
          k2 = (g[j >> 2] = b3, c2[j >> 2] | 0);
          d2 = h3 >>> 23 & 255;
          i4 = k2 >>> 23 & 255;
          l3 = h3 & -2147483648;
          f2 = k2 << 1;
          a: do
            if ((f2 | 0) != 0 ? !((d2 | 0) == 255 | ((hC(b3) | 0) & 2147483647) >>> 0 > 2139095040) : 0) {
              e2 = h3 << 1;
              if (e2 >>> 0 <= f2 >>> 0) {
                b3 = T2(a3 * T2(0));
                return T2((e2 | 0) == (f2 | 0) ? b3 : a3);
              }
              if (!d2) {
                d2 = h3 << 9;
                if ((d2 | 0) > -1) {
                  e2 = d2;
                  d2 = 0;
                  do {
                    d2 = d2 + -1 | 0;
                    e2 = e2 << 1;
                  } while ((e2 | 0) > -1);
                } else d2 = 0;
                e2 = h3 << 1 - d2;
              } else e2 = h3 & 8388607 | 8388608;
              if (!i4) {
                h3 = k2 << 9;
                if ((h3 | 0) > -1) {
                  f2 = 0;
                  do {
                    f2 = f2 + -1 | 0;
                    h3 = h3 << 1;
                  } while ((h3 | 0) > -1);
                } else f2 = 0;
                i4 = f2;
                k2 = k2 << 1 - f2;
              } else k2 = k2 & 8388607 | 8388608;
              f2 = e2 - k2 | 0;
              h3 = (f2 | 0) > -1;
              b: do
                if ((d2 | 0) > (i4 | 0)) {
                  while (1) {
                    if (h3) if (!f2) break;
                    else e2 = f2;
                    e2 = e2 << 1;
                    d2 = d2 + -1 | 0;
                    f2 = e2 - k2 | 0;
                    h3 = (f2 | 0) > -1;
                    if ((d2 | 0) <= (i4 | 0)) break b;
                  }
                  b3 = T2(a3 * T2(0));
                  break a;
                }
              while (0);
              if (h3) if (!f2) {
                b3 = T2(a3 * T2(0));
                break;
              } else e2 = f2;
              if (e2 >>> 0 < 8388608) do {
                e2 = e2 << 1;
                d2 = d2 + -1 | 0;
              } while (e2 >>> 0 < 8388608);
              if ((d2 | 0) > 0) d2 = e2 + -8388608 | d2 << 23;
              else d2 = e2 >>> (1 - d2 | 0);
              b3 = (c2[j >> 2] = d2 | l3, T2(g[j >> 2]));
            } else m2 = 3;
          while (0);
          if ((m2 | 0) == 3) {
            b3 = T2(a3 * b3);
            b3 = T2(b3 / b3);
          }
          return T2(b3);
        }
        function hC(a3) {
          a3 = T2(a3);
          return (g[j >> 2] = a3, c2[j >> 2] | 0) | 0;
        }
        function iC(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return CB(c2[582] | 0, a3, b3) | 0;
        }
        function jC(a3) {
          a3 = a3 | 0;
          Ta();
        }
        function kC(a3) {
          a3 = a3 | 0;
          return;
        }
        function lC(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return 0;
        }
        function mC(a3) {
          a3 = a3 | 0;
          if ((nC(a3 + 4 | 0) | 0) == -1) {
            nb[c2[(c2[a3 >> 2] | 0) + 8 >> 2] & 127](a3);
            a3 = 1;
          } else a3 = 0;
          return a3 | 0;
        }
        function nC(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = c2[a3 >> 2] | 0;
          c2[a3 >> 2] = b3 + -1;
          return b3 + -1 | 0;
        }
        function oC(a3) {
          a3 = a3 | 0;
          if (mC(a3) | 0) pC(a3);
          return;
        }
        function pC(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = a3 + 8 | 0;
          if (!((c2[b3 >> 2] | 0) != 0 ? (nC(b3) | 0) != -1 : 0)) nb[c2[(c2[a3 >> 2] | 0) + 16 >> 2] & 127](a3);
          return;
        }
        function qC(a3) {
          a3 = a3 | 0;
          var b3 = 0;
          b3 = (a3 | 0) == 0 ? 1 : a3;
          while (1) {
            a3 = oB(b3) | 0;
            if (a3 | 0) break;
            a3 = uC() | 0;
            if (!a3) {
              a3 = 0;
              break;
            }
            Fb[a3 & 0]();
          }
          return a3 | 0;
        }
        function rC(a3) {
          a3 = a3 | 0;
          return qC(a3) | 0;
        }
        function sC(a3) {
          a3 = a3 | 0;
          pB(a3);
          return;
        }
        function tC(b3) {
          b3 = b3 | 0;
          if ((a2[b3 + 11 >> 0] | 0) < 0) sC(c2[b3 >> 2] | 0);
          return;
        }
        function uC() {
          var a3 = 0;
          a3 = c2[2923] | 0;
          c2[2923] = a3 + 0;
          return a3 | 0;
        }
        function vC() {
        }
        function wC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          d2 = b3 - d2 - (c3 >>> 0 > a3 >>> 0 | 0) >>> 0;
          return (A2 = d2, a3 - c3 >>> 0 | 0) | 0;
        }
        function xC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          c3 = a3 + c3 >>> 0;
          return (A2 = b3 + d2 + (c3 >>> 0 < a3 >>> 0 | 0) >>> 0, c3 | 0) | 0;
        }
        function yC(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0, i4 = 0;
          h3 = b3 + e2 | 0;
          d2 = d2 & 255;
          if ((e2 | 0) >= 67) {
            while (b3 & 3) {
              a2[b3 >> 0] = d2;
              b3 = b3 + 1 | 0;
            }
            f2 = h3 & -4 | 0;
            g2 = f2 - 64 | 0;
            i4 = d2 | d2 << 8 | d2 << 16 | d2 << 24;
            while ((b3 | 0) <= (g2 | 0)) {
              c2[b3 >> 2] = i4;
              c2[b3 + 4 >> 2] = i4;
              c2[b3 + 8 >> 2] = i4;
              c2[b3 + 12 >> 2] = i4;
              c2[b3 + 16 >> 2] = i4;
              c2[b3 + 20 >> 2] = i4;
              c2[b3 + 24 >> 2] = i4;
              c2[b3 + 28 >> 2] = i4;
              c2[b3 + 32 >> 2] = i4;
              c2[b3 + 36 >> 2] = i4;
              c2[b3 + 40 >> 2] = i4;
              c2[b3 + 44 >> 2] = i4;
              c2[b3 + 48 >> 2] = i4;
              c2[b3 + 52 >> 2] = i4;
              c2[b3 + 56 >> 2] = i4;
              c2[b3 + 60 >> 2] = i4;
              b3 = b3 + 64 | 0;
            }
            while ((b3 | 0) < (f2 | 0)) {
              c2[b3 >> 2] = i4;
              b3 = b3 + 4 | 0;
            }
          }
          while ((b3 | 0) < (h3 | 0)) {
            a2[b3 >> 0] = d2;
            b3 = b3 + 1 | 0;
          }
          return h3 - e2 | 0;
        }
        function zC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          if ((c3 | 0) < 32) {
            A2 = b3 << c3 | (a3 & (1 << c3) - 1 << 32 - c3) >>> 32 - c3;
            return a3 << c3;
          }
          A2 = a3 << c3 - 32;
          return 0;
        }
        function AC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          if ((c3 | 0) < 32) {
            A2 = b3 >>> c3;
            return a3 >>> c3 | (b3 & (1 << c3) - 1) << 32 - c3;
          }
          A2 = 0;
          return b3 >>> c3 - 32 | 0;
        }
        function BC(b3, d2, e2) {
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0, h3 = 0;
          if ((e2 | 0) >= 8192) return Oa(b3 | 0, d2 | 0, e2 | 0) | 0;
          h3 = b3 | 0;
          g2 = b3 + e2 | 0;
          if ((b3 & 3) == (d2 & 3)) {
            while (b3 & 3) {
              if (!e2) return h3 | 0;
              a2[b3 >> 0] = a2[d2 >> 0] | 0;
              b3 = b3 + 1 | 0;
              d2 = d2 + 1 | 0;
              e2 = e2 - 1 | 0;
            }
            e2 = g2 & -4 | 0;
            f2 = e2 - 64 | 0;
            while ((b3 | 0) <= (f2 | 0)) {
              c2[b3 >> 2] = c2[d2 >> 2];
              c2[b3 + 4 >> 2] = c2[d2 + 4 >> 2];
              c2[b3 + 8 >> 2] = c2[d2 + 8 >> 2];
              c2[b3 + 12 >> 2] = c2[d2 + 12 >> 2];
              c2[b3 + 16 >> 2] = c2[d2 + 16 >> 2];
              c2[b3 + 20 >> 2] = c2[d2 + 20 >> 2];
              c2[b3 + 24 >> 2] = c2[d2 + 24 >> 2];
              c2[b3 + 28 >> 2] = c2[d2 + 28 >> 2];
              c2[b3 + 32 >> 2] = c2[d2 + 32 >> 2];
              c2[b3 + 36 >> 2] = c2[d2 + 36 >> 2];
              c2[b3 + 40 >> 2] = c2[d2 + 40 >> 2];
              c2[b3 + 44 >> 2] = c2[d2 + 44 >> 2];
              c2[b3 + 48 >> 2] = c2[d2 + 48 >> 2];
              c2[b3 + 52 >> 2] = c2[d2 + 52 >> 2];
              c2[b3 + 56 >> 2] = c2[d2 + 56 >> 2];
              c2[b3 + 60 >> 2] = c2[d2 + 60 >> 2];
              b3 = b3 + 64 | 0;
              d2 = d2 + 64 | 0;
            }
            while ((b3 | 0) < (e2 | 0)) {
              c2[b3 >> 2] = c2[d2 >> 2];
              b3 = b3 + 4 | 0;
              d2 = d2 + 4 | 0;
            }
          } else {
            e2 = g2 - 4 | 0;
            while ((b3 | 0) < (e2 | 0)) {
              a2[b3 >> 0] = a2[d2 >> 0] | 0;
              a2[b3 + 1 >> 0] = a2[d2 + 1 >> 0] | 0;
              a2[b3 + 2 >> 0] = a2[d2 + 2 >> 0] | 0;
              a2[b3 + 3 >> 0] = a2[d2 + 3 >> 0] | 0;
              b3 = b3 + 4 | 0;
              d2 = d2 + 4 | 0;
            }
          }
          while ((b3 | 0) < (g2 | 0)) {
            a2[b3 >> 0] = a2[d2 >> 0] | 0;
            b3 = b3 + 1 | 0;
            d2 = d2 + 1 | 0;
          }
          return h3 | 0;
        }
        function CC(b3) {
          b3 = b3 | 0;
          var c3 = 0;
          c3 = a2[n2 + (b3 & 255) >> 0] | 0;
          if ((c3 | 0) < 8) return c3 | 0;
          c3 = a2[n2 + (b3 >> 8 & 255) >> 0] | 0;
          if ((c3 | 0) < 8) return c3 + 8 | 0;
          c3 = a2[n2 + (b3 >> 16 & 255) >> 0] | 0;
          if ((c3 | 0) < 8) return c3 + 16 | 0;
          return (a2[n2 + (b3 >>> 24) >> 0] | 0) + 24 | 0;
        }
        function DC(a3, b3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          var g2 = 0, h3 = 0, i4 = 0, j2 = 0, k2 = 0, l3 = 0, m2 = 0, n3 = 0, o3 = 0, p2 = 0;
          l3 = a3;
          j2 = b3;
          k2 = j2;
          h3 = d2;
          n3 = e2;
          i4 = n3;
          if (!k2) {
            g2 = (f2 | 0) != 0;
            if (!i4) {
              if (g2) {
                c2[f2 >> 2] = (l3 >>> 0) % (h3 >>> 0);
                c2[f2 + 4 >> 2] = 0;
              }
              n3 = 0;
              f2 = (l3 >>> 0) / (h3 >>> 0) >>> 0;
              return (A2 = n3, f2) | 0;
            } else {
              if (!g2) {
                n3 = 0;
                f2 = 0;
                return (A2 = n3, f2) | 0;
              }
              c2[f2 >> 2] = a3 | 0;
              c2[f2 + 4 >> 2] = b3 & 0;
              n3 = 0;
              f2 = 0;
              return (A2 = n3, f2) | 0;
            }
          }
          g2 = (i4 | 0) == 0;
          do
            if (h3) {
              if (!g2) {
                g2 = (S(i4 | 0) | 0) - (S(k2 | 0) | 0) | 0;
                if (g2 >>> 0 <= 31) {
                  m2 = g2 + 1 | 0;
                  i4 = 31 - g2 | 0;
                  b3 = g2 - 31 >> 31;
                  h3 = m2;
                  a3 = l3 >>> (m2 >>> 0) & b3 | k2 << i4;
                  b3 = k2 >>> (m2 >>> 0) & b3;
                  g2 = 0;
                  i4 = l3 << i4;
                  break;
                }
                if (!f2) {
                  n3 = 0;
                  f2 = 0;
                  return (A2 = n3, f2) | 0;
                }
                c2[f2 >> 2] = a3 | 0;
                c2[f2 + 4 >> 2] = j2 | b3 & 0;
                n3 = 0;
                f2 = 0;
                return (A2 = n3, f2) | 0;
              }
              g2 = h3 - 1 | 0;
              if (g2 & h3 | 0) {
                i4 = (S(h3 | 0) | 0) + 33 - (S(k2 | 0) | 0) | 0;
                p2 = 64 - i4 | 0;
                m2 = 32 - i4 | 0;
                j2 = m2 >> 31;
                o3 = i4 - 32 | 0;
                b3 = o3 >> 31;
                h3 = i4;
                a3 = m2 - 1 >> 31 & k2 >>> (o3 >>> 0) | (k2 << m2 | l3 >>> (i4 >>> 0)) & b3;
                b3 = b3 & k2 >>> (i4 >>> 0);
                g2 = l3 << p2 & j2;
                i4 = (k2 << p2 | l3 >>> (o3 >>> 0)) & j2 | l3 << m2 & i4 - 33 >> 31;
                break;
              }
              if (f2 | 0) {
                c2[f2 >> 2] = g2 & l3;
                c2[f2 + 4 >> 2] = 0;
              }
              if ((h3 | 0) == 1) {
                o3 = j2 | b3 & 0;
                p2 = a3 | 0 | 0;
                return (A2 = o3, p2) | 0;
              } else {
                p2 = CC(h3 | 0) | 0;
                o3 = k2 >>> (p2 >>> 0) | 0;
                p2 = k2 << 32 - p2 | l3 >>> (p2 >>> 0) | 0;
                return (A2 = o3, p2) | 0;
              }
            } else {
              if (g2) {
                if (f2 | 0) {
                  c2[f2 >> 2] = (k2 >>> 0) % (h3 >>> 0);
                  c2[f2 + 4 >> 2] = 0;
                }
                o3 = 0;
                p2 = (k2 >>> 0) / (h3 >>> 0) >>> 0;
                return (A2 = o3, p2) | 0;
              }
              if (!l3) {
                if (f2 | 0) {
                  c2[f2 >> 2] = 0;
                  c2[f2 + 4 >> 2] = (k2 >>> 0) % (i4 >>> 0);
                }
                o3 = 0;
                p2 = (k2 >>> 0) / (i4 >>> 0) >>> 0;
                return (A2 = o3, p2) | 0;
              }
              g2 = i4 - 1 | 0;
              if (!(g2 & i4)) {
                if (f2 | 0) {
                  c2[f2 >> 2] = a3 | 0;
                  c2[f2 + 4 >> 2] = g2 & k2 | b3 & 0;
                }
                o3 = 0;
                p2 = k2 >>> ((CC(i4 | 0) | 0) >>> 0);
                return (A2 = o3, p2) | 0;
              }
              g2 = (S(i4 | 0) | 0) - (S(k2 | 0) | 0) | 0;
              if (g2 >>> 0 <= 30) {
                b3 = g2 + 1 | 0;
                i4 = 31 - g2 | 0;
                h3 = b3;
                a3 = k2 << i4 | l3 >>> (b3 >>> 0);
                b3 = k2 >>> (b3 >>> 0);
                g2 = 0;
                i4 = l3 << i4;
                break;
              }
              if (!f2) {
                o3 = 0;
                p2 = 0;
                return (A2 = o3, p2) | 0;
              }
              c2[f2 >> 2] = a3 | 0;
              c2[f2 + 4 >> 2] = j2 | b3 & 0;
              o3 = 0;
              p2 = 0;
              return (A2 = o3, p2) | 0;
            }
          while (0);
          if (!h3) {
            k2 = i4;
            j2 = 0;
            i4 = 0;
          } else {
            m2 = d2 | 0 | 0;
            l3 = n3 | e2 & 0;
            k2 = xC(m2 | 0, l3 | 0, -1, -1) | 0;
            d2 = A2;
            j2 = i4;
            i4 = 0;
            do {
              e2 = j2;
              j2 = g2 >>> 31 | j2 << 1;
              g2 = i4 | g2 << 1;
              e2 = a3 << 1 | e2 >>> 31 | 0;
              n3 = a3 >>> 31 | b3 << 1 | 0;
              wC(k2 | 0, d2 | 0, e2 | 0, n3 | 0) | 0;
              p2 = A2;
              o3 = p2 >> 31 | ((p2 | 0) < 0 ? -1 : 0) << 1;
              i4 = o3 & 1;
              a3 = wC(e2 | 0, n3 | 0, o3 & m2 | 0, (((p2 | 0) < 0 ? -1 : 0) >> 31 | ((p2 | 0) < 0 ? -1 : 0) << 1) & l3 | 0) | 0;
              b3 = A2;
              h3 = h3 - 1 | 0;
            } while ((h3 | 0) != 0);
            k2 = j2;
            j2 = 0;
          }
          h3 = 0;
          if (f2 | 0) {
            c2[f2 >> 2] = a3;
            c2[f2 + 4 >> 2] = b3;
          }
          o3 = (g2 | 0) >>> 31 | (k2 | h3) << 1 | (h3 << 1 | g2 >>> 31) & 0 | j2;
          p2 = (g2 << 1 | 0 >>> 31) & -2 | i4;
          return (A2 = o3, p2) | 0;
        }
        function EC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          return DC(a3, b3, c3, d2, 0) | 0;
        }
        function FC(a3) {
          a3 = a3 | 0;
          var b3 = 0, d2 = 0;
          d2 = a3 + 15 & -16 | 0;
          b3 = c2[i3 >> 2] | 0;
          a3 = b3 + d2 | 0;
          if ((d2 | 0) > 0 & (a3 | 0) < (b3 | 0) | (a3 | 0) < 0) {
            Y() | 0;
            Qa(12);
            return -1;
          }
          c2[i3 >> 2] = a3;
          if ((a3 | 0) > (X() | 0) ? (W2() | 0) == 0 : 0) {
            c2[i3 >> 2] = b3;
            Qa(12);
            return -1;
          }
          return b3 | 0;
        }
        function GC(b3, c3, d2) {
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          var e2 = 0;
          if ((c3 | 0) < (b3 | 0) & (b3 | 0) < (c3 + d2 | 0)) {
            e2 = b3;
            c3 = c3 + d2 | 0;
            b3 = b3 + d2 | 0;
            while ((d2 | 0) > 0) {
              b3 = b3 - 1 | 0;
              c3 = c3 - 1 | 0;
              d2 = d2 - 1 | 0;
              a2[b3 >> 0] = a2[c3 >> 0] | 0;
            }
            b3 = e2;
          } else BC(b3, c3, d2) | 0;
          return b3 | 0;
        }
        function HC(a3, b3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          var f2 = 0, g2 = 0;
          g2 = l2;
          l2 = l2 + 16 | 0;
          f2 = g2 | 0;
          DC(a3, b3, d2, e2, f2) | 0;
          l2 = g2;
          return (A2 = c2[f2 + 4 >> 2] | 0, c2[f2 >> 2] | 0) | 0;
        }
        function IC(a3) {
          a3 = a3 | 0;
          return (a3 & 255) << 24 | (a3 >> 8 & 255) << 16 | (a3 >> 16 & 255) << 8 | a3 >>> 24 | 0;
        }
        function JC(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          jb[a3 & 1](b3 | 0, c3 | 0, d2 | 0, e2 | 0, f2 | 0);
        }
        function KC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          kb[a3 & 1](b3 | 0, T2(c3));
        }
        function LC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          lb[a3 & 31](b3 | 0, +c3);
        }
        function MC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          d2 = T2(d2);
          return T2(mb[a3 & 0](b3 | 0, T2(c3), T2(d2)));
        }
        function NC(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          nb[a3 & 127](b3 | 0);
        }
        function OC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          ob[a3 & 31](b3 | 0, c3 | 0);
        }
        function PC(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return pb[a3 & 31](b3 | 0) | 0;
        }
        function QC(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          d2 = +d2;
          e2 = e2 | 0;
          qb[a3 & 1](b3 | 0, +c3, +d2, e2 | 0);
        }
        function RC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          d2 = +d2;
          rb[a3 & 1](b3 | 0, +c3, +d2);
        }
        function SC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          return sb[a3 & 7](b3 | 0, c3 | 0, d2 | 0) | 0;
        }
        function TC(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          return +tb[a3 & 1](b3 | 0, c3 | 0, d2 | 0);
        }
        function UC(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          return +ub[a3 & 15](b3 | 0);
        }
        function VC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          return vb[a3 & 1](b3 | 0, +c3) | 0;
        }
        function WC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          return wb[a3 & 15](b3 | 0, c3 | 0) | 0;
        }
        function XC(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = +d2;
          e2 = +e2;
          f2 = f2 | 0;
          xb[a3 & 1](b3 | 0, c3 | 0, +d2, +e2, f2 | 0);
        }
        function YC(a3, b3, c3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          g2 = g2 | 0;
          yb[a3 & 1](b3 | 0, c3 | 0, d2 | 0, e2 | 0, f2 | 0, g2 | 0);
        }
        function ZC(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          return +zb[a3 & 7](b3 | 0, c3 | 0);
        }
        function _C(a3) {
          a3 = a3 | 0;
          return Ab[a3 & 7]() | 0;
        }
        function $C(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          return Bb[a3 & 1](b3 | 0, c3 | 0, d2 | 0, e2 | 0, f2 | 0) | 0;
        }
        function aD(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = +e2;
          Cb[a3 & 1](b3 | 0, c3 | 0, d2 | 0, +e2);
        }
        function bD(a3, b3, c3, d2, e2, f2, g2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = T2(d2);
          e2 = e2 | 0;
          f2 = T2(f2);
          g2 = g2 | 0;
          Db[a3 & 1](b3 | 0, c3 | 0, T2(d2), e2 | 0, T2(f2), g2 | 0);
        }
        function cD(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          Eb[a3 & 15](b3 | 0, c3 | 0, d2 | 0);
        }
        function dD(a3) {
          a3 = a3 | 0;
          Fb[a3 & 0]();
        }
        function eD(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = +d2;
          Gb[a3 & 15](b3 | 0, c3 | 0, +d2);
        }
        function fD(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          return Hb[a3 & 1](+b3, +c3) | 0;
        }
        function gD(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          Ib[a3 & 15](b3 | 0, c3 | 0, d2 | 0, e2 | 0);
        }
        function hD(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          U(0);
        }
        function iD(a3, b3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          U(1);
        }
        function jD(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          U(2);
        }
        function kD(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = T2(b3);
          c3 = T2(c3);
          U(3);
          return ib;
        }
        function lD(a3) {
          a3 = a3 | 0;
          U(4);
        }
        function mD(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          U(5);
        }
        function nD(a3) {
          a3 = a3 | 0;
          U(6);
          return 0;
        }
        function oD(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          d2 = d2 | 0;
          U(7);
        }
        function pD(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = +b3;
          c3 = +c3;
          U(8);
        }
        function qD(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          U(9);
          return 0;
        }
        function rD(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          U(10);
          return 0;
        }
        function sD(a3) {
          a3 = a3 | 0;
          U(11);
          return 0;
        }
        function tD(a3, b3) {
          a3 = a3 | 0;
          b3 = +b3;
          U(12);
          return 0;
        }
        function uD(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          U(13);
          return 0;
        }
        function vD(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          d2 = +d2;
          e2 = e2 | 0;
          U(14);
        }
        function wD(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          f2 = f2 | 0;
          U(15);
        }
        function xD(a3, b3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          U(16);
          return 0;
        }
        function yD() {
          U(17);
          return 0;
        }
        function zD(a3, b3, c3, d2, e2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          e2 = e2 | 0;
          U(18);
          return 0;
        }
        function AD(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = +d2;
          U(19);
        }
        function BD(a3, b3, c3, d2, e2, f2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = T2(c3);
          d2 = d2 | 0;
          e2 = T2(e2);
          f2 = f2 | 0;
          U(20);
        }
        function CD(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          U(21);
        }
        function DD() {
          U(22);
        }
        function ED(a3, b3, c3) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = +c3;
          U(23);
        }
        function FD(a3, b3) {
          a3 = +a3;
          b3 = +b3;
          U(24);
          return 0;
        }
        function GD(a3, b3, c3, d2) {
          a3 = a3 | 0;
          b3 = b3 | 0;
          c3 = c3 | 0;
          d2 = d2 | 0;
          U(25);
        }
        var jb = [hD, Uw];
        var kb = [iD, of];
        var lb = [jD, Of, Pf, Qf, Rf, Sf, Tf, Uf, Wf, Xf, Zf, _f, $f, ag, bg, cg, dg, eg, fg, jD, jD, jD, jD, jD, jD, jD, jD, jD, jD, jD, jD, jD];
        var mb = [kD];
        var nb = [lD, kC, Ki, Li, Mi, rn, sn, tn, Pu, Qu, Ru, Cw, Dw, Ew, DA, EA, FA, Rb, tf, yf, Vf, Yf, hh, ih, ri, Ui, kj, Jj, bk, zk, Wk, nl, Hl, bm, um, Nm, en, Nn, fo, yo, Ro, ip, Bp, Xp, nq, Eq, Zq, lf, Hr, _r, us, Ps, ft, Ct, Ot, Rt, ju, mu, Eu, Uu, Xu, pv, Kv, Vi, $x, Ky, az, sz, Rz, hA, tA, wA, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD, lD];
        var ob = [mD, zf, Af, Df, Ef, Ff, Gf, Hf, If, Lf, Mf, Nf, wg, zg, Ag, Bg, Cg, Dg, Eg, Jg, Ng, rh, $p, qq, Ts, cy, Sv, xy, mD, mD, mD, mD];
        var pb = [nD, rB, sf, jg, ng, og, pg, qg, rg, sg, ug, vg, Kg, Lg, jh, ar, jt, sv, hy, jy, nD, nD, nD, nD, nD, nD, nD, nD, nD, nD, nD, nD];
        var qb = [oD, kh];
        var rb = [pD, Hu];
        var sb = [qD, sB, tB, zB, Dk, Rn, Lr, wz];
        var tb = [rD, ym];
        var ub = [sD, xg, yg, Fg, lh, mh, nh, oh, ph, qh, sD, sD, sD, sD, sD, sD];
        var vb = [tD, Kt];
        var wb = [uD, lC, Mg, xi, Nj, _k, rl, jn, jo, Iq, pf, ez, uD, uD, uD, uD];
        var xb = [vD, oj];
        var yb = [wD, Vz];
        var zb = [xD, Gg, sh, th, uh, Rm, xD, xD];
        var Ab = [yD, vh, qf, jf, Wt, qu, av, AA];
        var Bb = [zD, ee];
        var Cb = [AD, Vo];
        var Db = [BD, Pg];
        var Eb = [CD, kg, tg, Hg, Ig, fk, Ll, mp, Fp, nf, vx, Oy, lA, CD, CD, CD];
        var Fb = [DD];
        var Gb = [ED, Bf, Cf, Jf, Kf, gg, hg, ig, Co, cs, Ft, ED, ED, ED, ED, ED];
        var Hb = [FD, Mu];
        var Ib = [GD, fm, ir, ys, st, au, wu, hv, Pv, oy, LA, GD, GD, GD, GD, GD];
        return { _llvm_bswap_i32: IC, dynCall_idd: fD, dynCall_i: _C, _i64Subtract: wC, ___udivdi3: EC, dynCall_vif: KC, setThrew: Nb, dynCall_viii: cD, _bitshift64Lshr: AC, _bitshift64Shl: zC, dynCall_vi: NC, dynCall_viiddi: XC, dynCall_diii: TC, dynCall_iii: WC, _memset: yC, _sbrk: FC, _memcpy: BC, __GLOBAL__sub_I_Yoga_cpp: hf, dynCall_vii: OC, ___uremdi3: HC, dynCall_vid: LC, stackAlloc: Jb, _nbind_init: _A, getTempRet0: Pb, dynCall_di: UC, dynCall_iid: VC, setTempRet0: Ob, _i64Add: xC, dynCall_fiff: MC, dynCall_iiii: SC, _emscripten_get_global_libc: qB, dynCall_viid: eD, dynCall_viiid: aD, dynCall_viififi: bD, dynCall_ii: PC, __GLOBAL__sub_I_Binding_cc: Sx, dynCall_viiii: gD, dynCall_iiiiii: $C, stackSave: Kb, dynCall_viiiii: JC, __GLOBAL__sub_I_nbind_cc: wh, dynCall_vidd: RC, _free: pB, runPostSets: vC, dynCall_viiiiii: YC, establishStackSpace: Mb, _memmove: GC, stackRestore: Lb, _malloc: oB, __GLOBAL__sub_I_common_cc: Bv, dynCall_viddi: QC, dynCall_dii: ZC, dynCall_v: dD };
      }(
        // EMSCRIPTEN_END_ASM
        Module.asmGlobalArg,
        Module.asmLibraryArg,
        buffer
      );
      var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = asm["_llvm_bswap_i32"];
      var getTempRet0 = Module["getTempRet0"] = asm["getTempRet0"];
      var ___udivdi3 = Module["___udivdi3"] = asm["___udivdi3"];
      var setThrew = Module["setThrew"] = asm["setThrew"];
      var _bitshift64Lshr = Module["_bitshift64Lshr"] = asm["_bitshift64Lshr"];
      var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
      var _memset = Module["_memset"] = asm["_memset"];
      var _sbrk = Module["_sbrk"] = asm["_sbrk"];
      var _memcpy = Module["_memcpy"] = asm["_memcpy"];
      var stackAlloc = Module["stackAlloc"] = asm["stackAlloc"];
      var ___uremdi3 = Module["___uremdi3"] = asm["___uremdi3"];
      var _nbind_init = Module["_nbind_init"] = asm["_nbind_init"];
      var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
      var setTempRet0 = Module["setTempRet0"] = asm["setTempRet0"];
      var _i64Add = Module["_i64Add"] = asm["_i64Add"];
      var _emscripten_get_global_libc = Module["_emscripten_get_global_libc"] = asm["_emscripten_get_global_libc"];
      var __GLOBAL__sub_I_Yoga_cpp = Module["__GLOBAL__sub_I_Yoga_cpp"] = asm["__GLOBAL__sub_I_Yoga_cpp"];
      var __GLOBAL__sub_I_Binding_cc = Module["__GLOBAL__sub_I_Binding_cc"] = asm["__GLOBAL__sub_I_Binding_cc"];
      var stackSave = Module["stackSave"] = asm["stackSave"];
      var __GLOBAL__sub_I_nbind_cc = Module["__GLOBAL__sub_I_nbind_cc"] = asm["__GLOBAL__sub_I_nbind_cc"];
      var _free = Module["_free"] = asm["_free"];
      var runPostSets = Module["runPostSets"] = asm["runPostSets"];
      var establishStackSpace = Module["establishStackSpace"] = asm["establishStackSpace"];
      var _memmove = Module["_memmove"] = asm["_memmove"];
      var stackRestore = Module["stackRestore"] = asm["stackRestore"];
      var _malloc = Module["_malloc"] = asm["_malloc"];
      var __GLOBAL__sub_I_common_cc = Module["__GLOBAL__sub_I_common_cc"] = asm["__GLOBAL__sub_I_common_cc"];
      var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
      var dynCall_vif = Module["dynCall_vif"] = asm["dynCall_vif"];
      var dynCall_vid = Module["dynCall_vid"] = asm["dynCall_vid"];
      var dynCall_fiff = Module["dynCall_fiff"] = asm["dynCall_fiff"];
      var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
      var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
      var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
      var dynCall_viddi = Module["dynCall_viddi"] = asm["dynCall_viddi"];
      var dynCall_vidd = Module["dynCall_vidd"] = asm["dynCall_vidd"];
      var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
      var dynCall_diii = Module["dynCall_diii"] = asm["dynCall_diii"];
      var dynCall_di = Module["dynCall_di"] = asm["dynCall_di"];
      var dynCall_iid = Module["dynCall_iid"] = asm["dynCall_iid"];
      var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
      var dynCall_viiddi = Module["dynCall_viiddi"] = asm["dynCall_viiddi"];
      var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
      var dynCall_dii = Module["dynCall_dii"] = asm["dynCall_dii"];
      var dynCall_i = Module["dynCall_i"] = asm["dynCall_i"];
      var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
      var dynCall_viiid = Module["dynCall_viiid"] = asm["dynCall_viiid"];
      var dynCall_viififi = Module["dynCall_viififi"] = asm["dynCall_viififi"];
      var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
      var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
      var dynCall_viid = Module["dynCall_viid"] = asm["dynCall_viid"];
      var dynCall_idd = Module["dynCall_idd"] = asm["dynCall_idd"];
      var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
      Runtime.stackAlloc = Module["stackAlloc"];
      Runtime.stackSave = Module["stackSave"];
      Runtime.stackRestore = Module["stackRestore"];
      Runtime.establishStackSpace = Module["establishStackSpace"];
      Runtime.setTempRet0 = Module["setTempRet0"];
      Runtime.getTempRet0 = Module["getTempRet0"];
      Module["asm"] = asm;
      function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status;
      }
      ExitStatus.prototype = new Error();
      ExitStatus.prototype.constructor = ExitStatus;
      var initialStackTop;
      var preloadStartTime = null;
      var calledMain = false;
      dependenciesFulfilled = function runCaller() {
        if (!Module["calledRun"]) run();
        if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
      };
      Module["callMain"] = Module.callMain = function callMain(args) {
        args = args || [];
        ensureInitRuntime();
        var argc = args.length + 1;
        function pad() {
          for (var i4 = 0; i4 < 4 - 1; i4++) {
            argv.push(0);
          }
        }
        var argv = [allocate(intArrayFromString(Module["thisProgram"]), "i8", ALLOC_NORMAL)];
        pad();
        for (var i3 = 0; i3 < argc - 1; i3 = i3 + 1) {
          argv.push(allocate(intArrayFromString(args[i3]), "i8", ALLOC_NORMAL));
          pad();
        }
        argv.push(0);
        argv = allocate(argv, "i32", ALLOC_NORMAL);
        try {
          var ret = Module["_main"](argc, argv, 0);
          exit(ret, true);
        } catch (e) {
          if (e instanceof ExitStatus) {
            return;
          } else if (e == "SimulateInfiniteLoop") {
            Module["noExitRuntime"] = true;
            return;
          } else {
            var toLog = e;
            if (e && typeof e === "object" && e.stack) {
              toLog = [e, e.stack];
            }
            Module.printErr("exception thrown: " + toLog);
            Module["quit"](1, e);
          }
        } finally {
          calledMain = true;
        }
      };
      function run(args) {
        args = args || Module["arguments"];
        if (preloadStartTime === null) preloadStartTime = Date.now();
        if (runDependencies > 0) {
          return;
        }
        preRun();
        if (runDependencies > 0) return;
        if (Module["calledRun"]) return;
        function doRun() {
          if (Module["calledRun"]) return;
          Module["calledRun"] = true;
          if (ABORT) return;
          ensureInitRuntime();
          preMain();
          if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
          if (Module["_main"] && shouldRunNow) Module["callMain"](args);
          postRun();
        }
        if (Module["setStatus"]) {
          Module["setStatus"]("Running...");
          setTimeout(function() {
            setTimeout(function() {
              Module["setStatus"]("");
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
      }
      Module["run"] = Module.run = run;
      function exit(status, implicit) {
        if (implicit && Module["noExitRuntime"]) {
          return;
        }
        if (Module["noExitRuntime"]) {
        } else {
          ABORT = true;
          EXITSTATUS = status;
          STACKTOP = initialStackTop;
          exitRuntime();
          if (Module["onExit"]) Module["onExit"](status);
        }
        if (ENVIRONMENT_IS_NODE) {
          process["exit"](status);
        }
        Module["quit"](status, new ExitStatus(status));
      }
      Module["exit"] = Module.exit = exit;
      var abortDecorators = [];
      function abort(what) {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
        if (what !== void 0) {
          Module.print(what);
          Module.printErr(what);
          what = JSON.stringify(what);
        } else {
          what = "";
        }
        ABORT = true;
        EXITSTATUS = 1;
        var extra = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
        var output = "abort(" + what + ") at " + stackTrace() + extra;
        if (abortDecorators) {
          abortDecorators.forEach(function(decorator) {
            output = decorator(output, what);
          });
        }
        throw output;
      }
      Module["abort"] = Module.abort = abort;
      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
          Module["preInit"].pop()();
        }
      }
      var shouldRunNow = true;
      if (Module["noInitialRun"]) {
        shouldRunNow = false;
      }
      run();
    });
  }
});

// ../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/dist/entry-browser.js
var require_entry_browser = __commonJS({
  "../../node_modules/.pnpm/@react-pdf+yoga@2.0.4/node_modules/@react-pdf/yoga/src/dist/entry-browser.js"(exports2, module2) {
    "use strict";
    var Yoga = require_entry_common();
    var nbind = require_nbind();
    var ran = false;
    var ret = null;
    nbind({}, function(err2, result) {
      if (ran) {
        return;
      }
      ran = true;
      if (err2) {
        throw err2;
      }
      ret = result;
    });
    if (!ran) {
      throw new Error("Failed to load the yoga module - it needed to be loaded synchronously, but didn't");
    }
    module2.exports = Yoga(ret.bind, ret.lib);
  }
});

// ../../node_modules/.pnpm/@react-three+flex@1.0.1_@react-three+fiber@8.18.0_react@19.2.0_three@0.172.0/node_modules/@react-three/flex/dist/index.js
var import_react = __toESM(require_react());
var import_yoga = __toESM(require_entry_browser());

// ../../node_modules/.pnpm/react-merge-refs@1.1.0/node_modules/react-merge-refs/dist/react-merge-refs.esm.js
function mergeRefs(refs) {
  return function(value) {
    refs.forEach(function(ref) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var react_merge_refs_esm_default = mergeRefs;

// ../../node_modules/.pnpm/@react-three+flex@1.0.1_@react-three+fiber@8.18.0_react@19.2.0_three@0.172.0/node_modules/@react-three/flex/dist/index.js
var h = (e) => e[0].toUpperCase() + e.slice(1);
var x = (e) => e.toUpperCase().replace("-", "_");
var w = (e, t2, r2) => Object.keys(t2).forEach((n2) => {
  const i3 = t2[n2];
  if ("string" == typeof i3) switch (n2) {
    case "flexDir":
    case "dir":
    case "flexDirection":
      return e.setFlexDirection(import_yoga.default[`FLEX_DIRECTION_${x(i3)}`]);
    case "align":
      return e.setAlignItems(import_yoga.default[`ALIGN_${x(i3)}`]), e.setAlignContent(import_yoga.default[`ALIGN_${x(i3)}`]);
    case "alignContent":
      return e.setAlignContent(import_yoga.default[`ALIGN_${x(i3)}`]);
    case "alignItems":
      return e.setAlignItems(import_yoga.default[`ALIGN_${x(i3)}`]);
    case "alignSelf":
      return e.setAlignSelf(import_yoga.default[`ALIGN_${x(i3)}`]);
    case "justify":
    case "justifyContent":
      return e.setJustifyContent(import_yoga.default[`JUSTIFY_${x(i3)}`]);
    case "wrap":
    case "flexWrap":
      return e.setFlexWrap(import_yoga.default[`WRAP_${x(i3)}`]);
    case "basis":
    case "flexBasis":
      return e.setFlexBasis(i3);
    default:
      return e[`set${h(n2)}`](i3);
  }
  else if ("number" == typeof i3) {
    const t3 = i3 * r2;
    switch (n2) {
      case "basis":
      case "flexBasis":
        return e.setFlexBasis(t3);
      case "grow":
      case "flexGrow":
        return e.setFlexGrow(t3);
      case "shrink":
      case "flexShrink":
        return e.setFlexShrink(t3);
      case "align":
        return e.setAlignItems(i3);
      case "justify":
        return e.setJustifyContent(i3);
      case "flexDir":
      case "dir":
        return e.setFlexDirection(i3);
      case "wrap":
        return e.setFlexWrap(i3);
      case "padding":
      case "p":
        return e.setPadding(import_yoga.default.EDGE_ALL, t3);
      case "paddingLeft":
      case "pl":
        return e.setPadding(import_yoga.default.EDGE_LEFT, t3);
      case "paddingRight":
      case "pr":
        return e.setPadding(import_yoga.default.EDGE_RIGHT, t3);
      case "paddingTop":
      case "pt":
        return e.setPadding(import_yoga.default.EDGE_TOP, t3);
      case "paddingBottom":
      case "pb":
        return e.setPadding(import_yoga.default.EDGE_BOTTOM, t3);
      case "margin":
      case "m":
        return e.setMargin(import_yoga.default.EDGE_ALL, t3);
      case "marginLeft":
      case "ml":
        return e.setMargin(import_yoga.default.EDGE_LEFT, t3);
      case "marginRight":
      case "mr":
        return e.setMargin(import_yoga.default.EDGE_RIGHT, t3);
      case "marginTop":
      case "mt":
        return e.setMargin(import_yoga.default.EDGE_TOP, t3);
      case "marginBottom":
      case "mb":
        return e.setMargin(import_yoga.default.EDGE_BOTTOM, t3);
      default:
        return e[`set${h(n2)}`](t3);
    }
  }
});
var y = (e) => Object.keys(e).forEach((t2) => void 0 === e[t2] ? delete e[t2] : {});
var E = (0, import_react.createContext)({ scaleFactor: 100, requestReflow() {
  console.warn("Flex not initialized! Please report");
}, registerBox() {
  console.warn("Flex not initialized! Please report");
}, unregisterBox() {
  console.warn("Flex not initialized! Please report");
}, notInitialized: true });
var b = (0, import_react.createContext)({ node: null, size: [0, 0], notInitialized: true });
function C(e) {
  let t2 = (0, import_react.useContext)(e);
  return t2.notInitialized && console.warn("You must place this hook/component under a <Flex/> component!"), t2;
}
function B() {
  const { requestReflow: e } = C(E);
  return e;
}
function D() {
  const { size: [e, t2], centerAnchor: r2 } = C(b);
  return (0, import_react.useMemo)(() => [e, t2, r2], [e, t2, r2]);
}
function I() {
  const { node: e } = C(b);
  return e;
}
function W() {
  const { requestReflow: e, scaleFactor: t2 } = C(E), r2 = I();
  return (0, import_react.useCallback)((n2, i3) => {
    if (null == r2) throw new Error("yoga node is null. sync size is impossible");
    r2.setWidth(n2 * t2), r2.setHeight(i3 * t2), e();
  }, [r2, e]);
}
var L = new Vector3();
function R() {
  const e = W();
  return (0, import_react.useCallback)((t2) => {
    if (t2.updateMatrixWorld(), L.setFromMatrixScale(t2.matrixWorld), Math.abs(L.x - L.y) > 1e-3 || Math.abs(L.y - L.z) > 1e-3) throw new Error("object was not scaled uniformly");
    const r2 = L.x;
    t2.geometry.computeBoundingBox();
    const n2 = t2.geometry.boundingBox;
    e((n2.max.x - n2.min.x) * r2, (n2.max.y - n2.min.y) * r2);
  }, [e]);
}
function T(r2, n2) {
  let { children: a2, centerAnchor: g, flexDirection: m, flexDir: p, dir: f, alignContent: h2, alignItems: x2, alignSelf: D2, align: I2, justifyContent: W2, justify: L2, flexBasis: R2, basis: T2, flexGrow: F2, grow: A2, flexShrink: G2, shrink: z, flexWrap: _, wrap: M, margin: P, m: v, marginBottom: S, marginLeft: j, marginRight: H, marginTop: O, mb: k, ml: N, mr: $, mt: U, padding: q, p: J, paddingBottom: Y, paddingLeft: V, paddingRight: X, paddingTop: K, pb: Q, pl: Z, pr: ee, pt: te, height: re, width: ne, maxHeight: ie, maxWidth: ae, minHeight: oe, minWidth: se, ...ce } = r2;
  const le = (0, import_react.useMemo)(() => {
    const e = { flexDirection: m, flexDir: p, dir: f, alignContent: h2, alignItems: x2, alignSelf: D2, align: I2, justifyContent: W2, justify: L2, flexBasis: R2, basis: T2, flexGrow: F2, grow: A2, flexShrink: G2, shrink: z, flexWrap: _, wrap: M, margin: P, m: v, marginBottom: S, marginLeft: j, marginRight: H, marginTop: O, mb: k, ml: N, mr: $, mt: U, padding: q, p: J, paddingBottom: Y, paddingLeft: V, paddingRight: X, paddingTop: K, pb: Q, pl: Z, pr: ee, pt: te, height: re, width: ne, maxHeight: ie, maxWidth: ae, minHeight: oe, minWidth: se };
    return y(e), e;
  }, [I2, h2, x2, D2, f, R2, T2, p, m, F2, A2, G2, z, _, re, L2, W2, v, P, S, j, H, O, ie, ae, k, oe, se, N, $, U, J, q, Y, V, X, K, Q, Z, ee, te, ne, M]), { registerBox: de, unregisterBox: ge, scaleFactor: ue } = C(E), { node: me } = C(b), pe = (0, import_react.useRef)(), fe = (0, import_react.useMemo)(() => import_yoga.default.Node.create(), []), he = B(), xe = (0, import_react.useRef)(null == me ? void 0 : me.getChildCount());
  (0, import_react.useLayoutEffect)(() => {
    w(fe, le, ue);
  }, [le, fe, ue]), (0, import_react.useLayoutEffect)(() => {
    if (pe.current && me) return xe.current = xe.current || me.getChildCount(), me.insertChild(fe, xe.current), de(fe, pe.current, le, g), () => {
      me.removeChild(fe), ge(fe);
    };
  }, [fe, me, le, g, de, ge]), (0, import_react.useLayoutEffect)(() => {
    he();
  }, [a2, le, he]);
  const [we, ye] = (0, import_react.useState)([0, 0]), Ee = 1 / ue;
  useFrame(() => {
    const e = ("number" == typeof le.width ? le.width : null) || fe.getComputedWidth().valueOf() / ue, t2 = ("number" == typeof le.height ? le.height : null) || fe.getComputedHeight().valueOf() / ue;
    (Math.abs(e - we[0]) > Ee || Math.abs(t2 - we[1]) > Ee) && ye([e, t2]);
  });
  const be = (0, import_react.useMemo)(() => ({ node: fe, size: we, centerAnchor: g }), [fe, we, g]);
  return import_react.default.createElement("group", _extends({ ref: react_merge_refs_esm_default([pe, n2]) }, ce), import_react.default.createElement(b.Provider, { value: be }, "function" == typeof a2 ? a2(we[0], we[1], g) : a2));
}
var F = import_react.default.forwardRef(T);
function A(r2, n2) {
  let { size: c2 = [1, 1, 1], yogaDirection: h2 = "ltr", plane: x2 = "xy", children: C2, scaleFactor: B2 = 100, onReflow: D2, disableSizeRecalc: I2, centerAnchor: W2, flexDirection: L2, flexDir: R2, dir: T2, alignContent: F2, alignItems: A2, alignSelf: G2, align: z, justifyContent: _, justify: M, flexBasis: P, basis: v, flexGrow: S, grow: j, flexShrink: H, shrink: O, flexWrap: k, wrap: N, margin: $, m: U, marginBottom: q, marginLeft: J, marginRight: Y, marginTop: V, mb: X, ml: K, mr: Q, mt: Z, padding: ee, p: te, paddingBottom: re, paddingLeft: ne, paddingRight: ie, paddingTop: ae, pb: oe, pl: se, pr: ce, pt: le, height: de, width: ge, maxHeight: ue, maxWidth: me, minHeight: pe, minWidth: fe, ...he } = r2;
  const xe = (0, import_react.useMemo)(() => {
    const e = { flexDirection: L2, flexDir: R2, dir: T2, alignContent: F2, alignItems: A2, alignSelf: G2, align: z, justifyContent: _, justify: M, flexBasis: P, basis: v, flexGrow: S, grow: j, flexShrink: H, shrink: O, flexWrap: k, wrap: N, margin: $, m: U, marginBottom: q, marginLeft: J, marginRight: Y, marginTop: V, mb: X, ml: K, mr: Q, mt: Z, padding: ee, p: te, paddingBottom: re, paddingLeft: ne, paddingRight: ie, paddingTop: ae, pb: oe, pl: se, pr: ce, pt: le, height: de, width: ge, maxHeight: ue, maxWidth: me, minHeight: pe, minWidth: fe };
    return y(e), e;
  }, [z, F2, A2, G2, T2, P, v, R2, L2, S, j, H, O, k, de, M, _, U, $, q, J, Y, V, ue, me, X, pe, fe, K, Q, Z, te, ee, re, ne, ie, ae, oe, se, ce, le, ge, N]), we = (0, import_react.useRef)(), ye = (0, import_react.useRef)([]), Ee = (0, import_react.useCallback)(function(e, t2, r3, n3) {
    void 0 === n3 && (n3 = false);
    const i3 = ye.current.findIndex((t3) => t3.node === e);
    -1 !== i3 && ye.current.splice(i3, 1), ye.current.push({ group: t2, node: e, flexProps: r3, centerAnchor: n3 });
  }, []), be = (0, import_react.useCallback)((e) => {
    const t2 = ye.current.findIndex((t3) => t3.node === e);
    -1 !== t2 && ye.current.splice(t2, 1);
  }, []), Ce = (0, import_react.useMemo)(() => import_yoga.default.Node.create(), []);
  (0, import_react.useLayoutEffect)(() => {
    w(Ce, xe, B2);
  }, [Ce, xe, B2]);
  const { invalidate: Be } = useThree(), De = (0, import_react.useRef)(true), Ie = (0, import_react.useCallback)(() => {
    De.current = true, Be();
  }, [Be]);
  (0, import_react.useLayoutEffect)(() => {
    Ie();
  }, [C2, xe, Ie]);
  const We = (0, import_react.useMemo)(() => new Box3(), []), Le = (0, import_react.useMemo)(() => new Vector3(), []), Re = x2[0], Te = x2[1], Fe = function(e) {
    switch (e) {
      case "xy":
        return "z";
      case "yz":
        return "x";
      case "xz":
        return "y";
    }
  }(x2), [Ae, Ge] = function(e, t2) {
    switch (t2) {
      case "xy":
        return [e[0], e[1]];
      case "yz":
        return [e[1], e[2]];
      case "xz":
        return [e[0], e[2]];
    }
  }(c2, x2), ze = "ltr" === h2 ? import_yoga.default.DIRECTION_LTR : "rtl" === h2 ? import_yoga.default.DIRECTION_RTL : h2, _e = (0, import_react.useMemo)(() => ({ requestReflow: Ie, registerBox: Ee, unregisterBox: be, scaleFactor: B2 }), [Ie, Ee, be, B2]), Me = (0, import_react.useMemo)(() => ({ node: Ce, size: [Ae, Ge], centerAnchor: W2 }), [Ce, Ae, Ge, W2]);
  function Pe() {
    I2 || ye.current.forEach((e2) => {
      let { group: t3, node: r4, flexProps: n4 } = e2;
      const i4 = "number" == typeof n4.width ? n4.width * B2 : n4.width, a3 = "number" == typeof n4.height ? n4.height * B2 : n4.height;
      void 0 !== i4 && void 0 !== a3 ? (r4.setWidth(i4), r4.setHeight(a3)) : 0 === r4.getChildCount() && (we.current ? ((e3, t4, r5, n5) => {
        e3.updateMatrix();
        const i5 = e3.matrix, a4 = e3.matrixAutoUpdate;
        t4.updateMatrixWorld();
        const o2 = new Matrix4().copy(t4.matrixWorld).invert();
        e3.matrix = o2, e3.matrixAutoUpdate = false, t4.updateMatrixWorld(), r5.setFromObject(e3).getSize(n5), e3.matrix = i5, e3.matrixAutoUpdate = a4, t4.updateMatrixWorld();
      })(t3, we.current, We, Le) : We.setFromObject(t3).getSize(Le), r4.setWidth(i4 || Le[Re] * B2), r4.setHeight(a3 || Le[Te] * B2));
    }), Ce.calculateLayout(Ae * B2, Ge * B2, ze);
    const e = Ce.getComputedWidth(), t2 = Ce.getComputedHeight();
    let r3 = 0, n3 = 0, i3 = 0, a2 = 0;
    ye.current.forEach((o2) => {
      let { group: s2, node: c3, centerAnchor: l2 } = o2;
      const { left: d, top: g, width: u, height: m } = c3.getComputedLayout(), [f, h3] = ((e2, t3, r4, n4) => e2 && ((e3) => {
        var t4;
        return !(null != (t4 = e3.getParent()) && t4.getParent());
      })(n4) ? [-t3 / 2, -r4 / 2] : [0, 0])(W2, e, t2, c3), x3 = ((e2) => {
        let { x: t3, y: r4, z: n4 } = e2;
        return new Vector3(t3, r4, n4);
      })({ [Re]: (f + d + (l2 ? u / 2 : 0)) / B2, [Te]: -(h3 + g + (l2 ? m / 2 : 0)) / B2, [Fe]: 0 });
      r3 = Math.min(r3, d), i3 = Math.min(i3, g), n3 = Math.max(n3, d + u), a2 = Math.max(a2, g + m), s2.position.copy(x3);
    }), D2 && D2((n3 - r3) / B2, (a2 - i3) / B2), Be();
  }
  return useFrame(() => {
    De.current && (De.current = false, Pe());
  }), import_react.default.createElement("group", _extends({ ref: react_merge_refs_esm_default([we, n2]) }, he), import_react.default.createElement(E.Provider, { value: _e }, import_react.default.createElement(b.Provider, { value: Me }, C2)));
}
F.displayName = "Box";
var G = import_react.default.forwardRef(A);
G.displayName = "Flex";
export {
  F as Box,
  G as Flex,
  C as useContext,
  I as useFlexNode,
  D as useFlexSize,
  B as useReflow,
  W as useSetSize,
  R as useSyncGeometrySize
};
//# sourceMappingURL=@react-three_flex.js.map
