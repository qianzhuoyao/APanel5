import {
  require_client
} from "./chunk-TFBAXGPF.js";
import "./chunk-3J2OHGY4.js";
import {
  useFrame,
  useThree
} from "./chunk-NOMVIORJ.js";
import {
  create
} from "./chunk-QA3FA25W.js";
import "./chunk-2NVUNDZI.js";
import {
  require_react
} from "./chunk-ECT2SSAV.js";
import {
  OrthographicCamera,
  PerspectiveCamera,
  Vector3
} from "./chunk-WCOX6VFL.js";
import {
  __toESM
} from "./chunk-DLJ4GP37.js";

// ../../node_modules/.pnpm/@react-three+a11y@3.0.0_@react-three+fiber@8.18.0_react-dom@19.2.0_react@19.2.0_three@0.172.0/node_modules/@react-three/a11y/dist/a11y.esm.js
var import_react = __toESM(require_react());
var import_client = __toESM(require_client());
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var useAnnounceStore = create(function(set) {
  return {
    message: "",
    a11yScreenReader: function a11yScreenReader(message) {
      set(function() {
        return {
          message
        };
      });
    }
  };
});
var stylesHiddenButScreenreadable = {
  opacity: 0,
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  overflow: "hidden",
  transform: "translateX(-50%) translateY(-50%)",
  display: "inline-block",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
  margin: 0
};
var A11ySectionContext = import_react.default.createContext((0, import_react.createRef)());
A11ySectionContext.displayName = "A11ySectionContext";
var useA11ySectionContext = function useA11ySectionContext2() {
  return (0, import_react.useContext)(A11ySectionContext);
};
var A11ySection = function A11ySection2(_ref) {
  var children = _ref.children, label = _ref.label, description = _ref.description;
  var ref = (0, import_react.useRef)(null);
  var refpDesc = (0, import_react.useRef)(null);
  var gl = useThree(function(state) {
    return state.gl;
  });
  var _React$useState = import_react.default.useState(function() {
    return document.createElement("section");
  }), el = _React$useState[0];
  var target = gl.domElement.parentNode;
  (0, import_react.useEffect)(function() {
    if (label) {
      el.setAttribute("aria-label", label);
    }
    el.setAttribute("r3f-a11y", "true");
    el.setAttribute("style", function(styles) {
      return Object.keys(styles).reduce(function(acc, key) {
        return acc + key.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + styles[key] + ";";
      }, "");
    }(stylesHiddenButScreenreadable));
    if (description) {
      if (refpDesc.current === null) {
        var pDesc = document.createElement("p");
        pDesc.innerHTML = description;
        pDesc.style.cssText = "border: 0!important;clip: rect(1px,1px,1px,1px)!important;-webkit-clip-path: inset(50%)!important;clip-path: inset(50%)!important;height: 1px!important;margin: -1px!important;overflow: hidden!important;padding: 0!important;position: absolute!important;width: 1px!important;white-space: nowrap!important;";
        el.prepend(pDesc);
        refpDesc.current = pDesc;
      } else {
        refpDesc.current.innerHTML = description;
      }
    }
    return function() {
      if (target) target.removeChild(el);
    };
  }, [description, label]);
  if (ref.current === null) {
    if (target) {
      target.appendChild(el);
    }
    ref.current = el;
  }
  return import_react.default.createElement(import_react.default.Fragment, null, import_react.default.createElement(A11ySectionContext.Provider, {
    value: ref
  }, children));
};
var v1 = new Vector3();
var v2 = new Vector3();
var v3 = new Vector3();
function calculatePosition(el, camera, size) {
  var objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  objectPos.project(camera);
  var widthHalf = size.width / 2;
  var heightHalf = size.height / 2;
  return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
}
function isObjectBehindCamera(el, camera) {
  var objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  var cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
  var deltaCamObj = objectPos.sub(cameraPos);
  var camDir = camera.getWorldDirection(v3);
  return deltaCamObj.angleTo(camDir) > Math.PI / 2;
}
function objectZIndex(el, camera, zIndexRange) {
  if (camera instanceof PerspectiveCamera || camera instanceof OrthographicCamera) {
    var objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    var cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    var dist = objectPos.distanceTo(cameraPos);
    var A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
    var B = zIndexRange[1] - A * camera.far;
    return Math.round(A * dist + B);
  }
  return void 0;
}
var Html = (0, import_react.forwardRef)(function(_ref, ref) {
  var _portal$current;
  var children = _ref.children, _ref$eps = _ref.eps, eps = _ref$eps === void 0 ? 1e-3 : _ref$eps, style = _ref.style, className = _ref.className, portal = _ref.portal, _ref$zIndexRange = _ref.zIndexRange, zIndexRange = _ref$zIndexRange === void 0 ? [16777271, 0] : _ref$zIndexRange, props = _objectWithoutPropertiesLoose(_ref, ["children", "eps", "style", "className", "portal", "zIndexRange"]);
  var gl = useThree(function(_ref2) {
    var gl2 = _ref2.gl;
    return gl2;
  });
  var camera = useThree(function(_ref3) {
    var camera2 = _ref3.camera;
    return camera2;
  });
  var scene = useThree(function(_ref4) {
    var scene2 = _ref4.scene;
    return scene2;
  });
  var size = useThree(function(_ref5) {
    var size2 = _ref5.size;
    return size2;
  });
  var _React$useState = (0, import_react.useState)(function() {
    return document.createElement("div");
  }), el = _React$useState[0];
  var root = (0, import_react.useMemo)(function() {
    return import_client.default.createRoot(el);
  }, [el]);
  var group = (0, import_react.useRef)(null);
  var oldZoom = (0, import_react.useRef)(0);
  var oldPosition = (0, import_react.useRef)([0, 0]);
  var target = (_portal$current = portal == null ? void 0 : portal.current) != null ? _portal$current : gl.domElement.parentNode;
  (0, import_react.useEffect)(function() {
    if (group.current) {
      scene.updateMatrixWorld();
      var vec = calculatePosition(group.current, camera, size);
      el.style.cssText = "position:absolute;top:0;left:0;transform:translate3d(" + vec[0] + "px," + vec[1] + "px,0);transform-origin:0 0;";
      if (target) {
        target.appendChild(el);
      }
      return function() {
        if (target) target.removeChild(el);
        root.unmount();
      };
    }
  }, [target]);
  var styles = (0, import_react.useMemo)(function() {
    return _extends({
      position: "absolute",
      transform: "none"
    }, style);
  }, [style, size]);
  (0, import_react.useLayoutEffect)(function() {
    root.render((0, import_react.createElement)("div", {
      ref,
      style: styles,
      className,
      children
    }));
  });
  useFrame(function() {
    if (group.current) {
      camera.updateMatrixWorld();
      var vec = calculatePosition(group.current, camera, size);
      if (Math.abs(oldZoom.current - camera.zoom) > eps || Math.abs(oldPosition.current[0] - vec[0]) > eps || Math.abs(oldPosition.current[1] - vec[1]) > eps) {
        el.style.display = !isObjectBehindCamera(group.current, camera) ? "block" : "none";
        el.style.zIndex = "" + objectZIndex(group.current, camera, zIndexRange);
        el.style.transform = "translate3d(" + vec[0] + "px," + vec[1] + "px,0) scale(1)";
        oldPosition.current = vec;
        oldZoom.current = camera.zoom;
      }
    }
  });
  return (0, import_react.createElement)("group", Object.assign({}, props, {
    ref: group
  }));
});
var A11yContext = import_react.default.createContext({
  focus: false,
  hover: false,
  pressed: false
});
A11yContext.displayName = "A11yContext";
var useA11y = function useA11y2() {
  return (0, import_react.useContext)(A11yContext);
};
var A11y = function A11y2(_ref) {
  var children = _ref.children, description = _ref.description, activationMsg = _ref.activationMsg, deactivationMsg = _ref.deactivationMsg, tabIndex = _ref.tabIndex, href = _ref.href, role = _ref.role, _ref$showAltText = _ref.showAltText, showAltText = _ref$showAltText === void 0 ? false : _ref$showAltText, actionCall = _ref.actionCall, focusCall = _ref.focusCall, disabled = _ref.disabled, _ref$debug = _ref.debug, debug = _ref$debug === void 0 ? false : _ref$debug, a11yElStyle = _ref.a11yElStyle, _ref$startPressed = _ref.startPressed, startPressed = _ref$startPressed === void 0 ? false : _ref$startPressed, _ref$tag = _ref.tag, tag = _ref$tag === void 0 ? "p" : _ref$tag, _ref$hidden = _ref.hidden, hidden = _ref$hidden === void 0 ? false : _ref$hidden, dragThreshold = _ref.dragThreshold, props = _objectWithoutPropertiesLoose(_ref, ["children", "description", "activationMsg", "deactivationMsg", "tabIndex", "href", "role", "showAltText", "actionCall", "focusCall", "disabled", "debug", "a11yElStyle", "startPressed", "tag", "hidden", "dragThreshold"]);
  var constHiddenButScreenreadable = Object.assign({}, stylesHiddenButScreenreadable, {
    opacity: debug ? 1 : 0
  }, a11yElStyle);
  var _useState = (0, import_react.useState)({
    hovered: false,
    focused: false,
    pressed: startPressed ? startPressed : false
  }), a11yState = _useState[0], setA11yState = _useState[1];
  var a11yScreenReader = useAnnounceStore(function(state) {
    return state.a11yScreenReader;
  });
  var overHtml = (0, import_react.useRef)(false);
  var overMesh = (0, import_react.useRef)(false);
  var domElement = useThree(function(state) {
    return state.gl.domElement;
  });
  var componentIsMounted = (0, import_react.useRef)(true);
  (0, import_react.useEffect)(function() {
    return function() {
      domElement.style.cursor = "default";
      componentIsMounted.current = false;
    };
  }, []);
  import_react.default.Children.only(children);
  var handleOnPointerOver = function handleOnPointerOver2(e) {
    if (e.eventObject) {
      overMesh.current = true;
    } else {
      overHtml.current = true;
    }
    if (overHtml.current || overMesh.current) {
      if (role !== "content" && role !== "image" && !disabled) {
        domElement.style.cursor = "pointer";
      }
      setA11yState({
        hovered: true,
        focused: a11yState.focused,
        pressed: a11yState.pressed
      });
    }
  };
  var handleOnPointerOut = function handleOnPointerOut2(e) {
    if (e.eventObject) {
      overMesh.current = false;
    } else {
      overHtml.current = false;
    }
    if (!overHtml.current && !overMesh.current) {
      if (componentIsMounted.current) {
        domElement.style.cursor = "default";
        setA11yState({
          hovered: false,
          focused: a11yState.focused,
          pressed: a11yState.pressed
        });
      }
    }
  };
  function handleBtnClick() {
    a11yScreenReader("");
    window.setTimeout(function() {
      if (typeof activationMsg === "string") a11yScreenReader(activationMsg);
    }, 100);
    if (typeof actionCall === "function") actionCall();
  }
  function handleToggleBtnClick() {
    if (a11yState.pressed) {
      if (typeof deactivationMsg === "string") a11yScreenReader(deactivationMsg);
    } else {
      if (typeof activationMsg === "string") a11yScreenReader(activationMsg);
    }
    setA11yState({
      hovered: a11yState.hovered,
      focused: a11yState.focused,
      pressed: !a11yState.pressed
    });
    if (typeof actionCall === "function") actionCall();
  }
  var returnHtmlA11yEl = function returnHtmlA11yEl2() {
    if (role === "button" || role === "togglebutton") {
      var disabledBtnAttr = disabled ? {
        disabled: true
      } : null;
      if (role === "togglebutton") {
        return import_react.default.createElement("button", Object.assign({
          "r3f-a11y": "true"
        }, disabledBtnAttr, {
          "aria-pressed": a11yState.pressed ? "true" : "false",
          tabIndex: tabIndex ? tabIndex : 0,
          style: Object.assign(constHiddenButScreenreadable, disabled ? {
            cursor: "default"
          } : {
            cursor: "pointer"
          }, hidden ? {
            visibility: "hidden"
          } : {
            visibility: "visible"
          }),
          onPointerOver: handleOnPointerOver,
          onPointerOut: handleOnPointerOut,
          onClick: function onClick(e) {
            e.stopPropagation();
            if (disabled) {
              return;
            }
            handleToggleBtnClick();
          },
          onFocus: function onFocus() {
            if (typeof focusCall === "function") focusCall();
            setA11yState({
              hovered: a11yState.hovered,
              focused: true,
              pressed: a11yState.pressed
            });
          },
          onBlur: function onBlur() {
            setA11yState({
              hovered: a11yState.hovered,
              focused: false,
              pressed: a11yState.pressed
            });
          }
        }), description);
      } else {
        return import_react.default.createElement("button", Object.assign({
          "r3f-a11y": "true"
        }, disabledBtnAttr, {
          tabIndex: tabIndex ? tabIndex : 0,
          style: Object.assign(constHiddenButScreenreadable, disabled ? {
            cursor: "default"
          } : {
            cursor: "pointer"
          }, hidden ? {
            visibility: "hidden"
          } : {
            visibility: "visible"
          }),
          onPointerOver: handleOnPointerOver,
          onPointerOut: handleOnPointerOut,
          onClick: function onClick(e) {
            e.stopPropagation();
            if (disabled) {
              return;
            }
            handleBtnClick();
          },
          onFocus: function onFocus() {
            if (typeof focusCall === "function") focusCall();
            setA11yState({
              hovered: a11yState.hovered,
              focused: true,
              pressed: a11yState.pressed
            });
          },
          onBlur: function onBlur() {
            setA11yState({
              hovered: a11yState.hovered,
              focused: false,
              pressed: a11yState.pressed
            });
          }
        }), description);
      }
    } else if (role === "link") {
      return import_react.default.createElement("a", {
        "r3f-a11y": "true",
        style: Object.assign(constHiddenButScreenreadable, hidden ? {
          visibility: "hidden"
        } : {
          visibility: "visible"
        }),
        href,
        onPointerOver: handleOnPointerOver,
        onPointerOut: handleOnPointerOut,
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          if (typeof actionCall === "function") actionCall();
        },
        onFocus: function onFocus() {
          if (typeof focusCall === "function") focusCall();
          setA11yState({
            hovered: a11yState.hovered,
            focused: true,
            pressed: a11yState.pressed
          });
        },
        onBlur: function onBlur() {
          setA11yState({
            hovered: a11yState.hovered,
            focused: false,
            pressed: a11yState.pressed
          });
        }
      }, description);
    } else {
      var tabIndexP = tabIndex ? {
        tabIndex
      } : null;
      if (role === "image") {
        return import_react.default.createElement("img", Object.assign({
          "r3f-a11y": "true",
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
          alt: description
        }, tabIndexP, {
          style: Object.assign(constHiddenButScreenreadable, hidden ? {
            visibility: "hidden"
          } : {
            visibility: "visible"
          }),
          onPointerOver: handleOnPointerOver,
          onPointerOut: handleOnPointerOut,
          onBlur: function onBlur() {
            setA11yState({
              hovered: a11yState.hovered,
              focused: false,
              pressed: a11yState.pressed
            });
          },
          onFocus: function onFocus() {
            if (typeof focusCall === "function") focusCall();
            setA11yState({
              hovered: a11yState.hovered,
              focused: true,
              pressed: a11yState.pressed
            });
          }
        }));
      } else {
        var Tag = tag;
        return import_react.default.createElement(Tag, Object.assign({
          "r3f-a11y": "true"
        }, tabIndexP, {
          style: Object.assign(constHiddenButScreenreadable, hidden ? {
            visibility: "hidden"
          } : {
            visibility: "visible"
          }),
          onPointerOver: handleOnPointerOver,
          onPointerOut: handleOnPointerOut,
          onBlur: function onBlur() {
            setA11yState({
              hovered: a11yState.hovered,
              focused: false,
              pressed: a11yState.pressed
            });
          },
          onFocus: function onFocus() {
            if (typeof focusCall === "function") focusCall();
            setA11yState({
              hovered: a11yState.hovered,
              focused: true,
              pressed: a11yState.pressed
            });
          }
        }), description);
      }
    }
  };
  var HtmlAccessibleElement = import_react.default.useMemo(returnHtmlA11yEl, [description, a11yState, hidden, tabIndex, href, disabled, startPressed, tag, actionCall, focusCall]);
  var AltText = null;
  if (showAltText && a11yState.hovered) {
    AltText = import_react.default.createElement("div", {
      "aria-hidden": true,
      style: {
        width: "auto",
        maxWidth: "300px",
        display: "block",
        position: "absolute",
        top: "0px",
        left: "0px",
        transform: "translate(-50%,-50%)",
        background: "white",
        borderRadius: "4px",
        padding: "4px"
      }
    }, import_react.default.createElement("p", {
      "aria-hidden": true,
      style: {
        margin: "0px"
      }
    }, description));
  }
  var section = useA11ySectionContext();
  var portal = {};
  if (section.current instanceof HTMLElement) {
    portal = {
      portal: section
    };
  }
  return import_react.default.createElement(A11yContext.Provider, {
    value: {
      hover: a11yState.hovered,
      focus: a11yState.focused,
      pressed: a11yState.pressed
    }
  }, import_react.default.createElement("group", Object.assign({}, props, {
    onClick: function onClick(e) {
      e.stopPropagation();
      if (disabled || dragThreshold && e.delta > dragThreshold) {
        return;
      }
      if (role === "button") {
        handleBtnClick();
      } else if (role === "togglebutton") {
        handleToggleBtnClick();
      } else {
        if (typeof actionCall === "function") actionCall();
      }
    },
    onPointerOver: handleOnPointerOver,
    onPointerOut: handleOnPointerOut
  }), children, import_react.default.createElement(Html, Object.assign({
    style: {
      width: "0px"
    },
    position: (
      // @ts-ignore
      children.props.position ? children.props.position : 0
    )
  }, portal), AltText, HtmlAccessibleElement)));
};
var A11yUserPreferencesContext = import_react.default.createContext({
  a11yPrefersState: {
    prefersReducedMotion: false,
    prefersDarkScheme: false
  },
  // tslint:disable:no-unused-variable
  setA11yPrefersState: function setA11yPrefersState(_state) {
  }
});
A11yUserPreferencesContext.displayName = "A11yUserPreferencesContext";
var useUserPreferences = function useUserPreferences2() {
  return (0, import_react.useContext)(A11yUserPreferencesContext);
};
var A11yUserPreferences = function A11yUserPreferences2(_ref) {
  var children = _ref.children;
  var _useState = (0, import_react.useState)({
    prefersReducedMotion: false,
    prefersDarkScheme: false
  }), a11yPrefersState = _useState[0], setA11yPrefersState2 = _useState[1];
  (0, import_react.useEffect)(function() {
    var prefersReducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var prefersDarkSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setA11yPrefersState2({
      prefersReducedMotion: prefersReducedMotionMediaQuery.matches,
      prefersDarkScheme: prefersDarkSchemeMediaQuery.matches
    });
    var handleReducedMotionPrefChange = function handleReducedMotionPrefChange2(e) {
      setA11yPrefersState2({
        prefersReducedMotion: e.matches,
        prefersDarkScheme: prefersDarkSchemeMediaQuery.matches
      });
    };
    var handleDarkSchemePrefChange = function handleDarkSchemePrefChange2(e) {
      setA11yPrefersState2({
        prefersReducedMotion: prefersReducedMotionMediaQuery.matches,
        prefersDarkScheme: e.matches
      });
    };
    if (typeof prefersReducedMotionMediaQuery.addEventListener === "function") {
      prefersReducedMotionMediaQuery.addEventListener("change", handleReducedMotionPrefChange);
    }
    if (typeof prefersDarkSchemeMediaQuery.addEventListener === "function") {
      prefersDarkSchemeMediaQuery.addEventListener("change", handleDarkSchemePrefChange);
    }
    return function() {
      if (typeof prefersReducedMotionMediaQuery.removeEventListener === "function") {
        prefersReducedMotionMediaQuery.removeEventListener("change", handleReducedMotionPrefChange);
      }
      if (typeof prefersDarkSchemeMediaQuery.removeEventListener === "function") {
        prefersDarkSchemeMediaQuery.removeEventListener("change", handleDarkSchemePrefChange);
      }
    };
  }, []);
  return import_react.default.createElement(A11yUserPreferencesContext.Provider, {
    value: {
      a11yPrefersState: {
        prefersReducedMotion: a11yPrefersState.prefersReducedMotion,
        prefersDarkScheme: a11yPrefersState.prefersDarkScheme
      },
      setA11yPrefersState: setA11yPrefersState2
    }
  }, children);
};
var offScreenStyle = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  padding: 0,
  width: "1px",
  position: "absolute"
};
var A11yAnnouncer = function A11yAnnouncer2() {
  var message = useAnnounceStore(function(state) {
    return state.message;
  });
  (0, import_react.useEffect)(function() {
    var mouseClickListener = function mouseClickListener2(e) {
      var _window$document$acti;
      if ((_window$document$acti = window.document.activeElement) != null && _window$document$acti.getAttribute("r3f-a11y") && e.detail !== 0) {
        if (window.document.activeElement instanceof HTMLElement) {
          window.document.activeElement.blur();
        }
      }
    };
    window.addEventListener("click", mouseClickListener);
    return function() {
      window.removeEventListener("click", mouseClickListener);
    };
  });
  return import_react.default.createElement("div", {
    style: offScreenStyle,
    "aria-atomic": "true",
    "aria-live": "polite"
  }, message);
};
var A11yDebuger = function A11yDebuger2(_ref) {
  _objectDestructuringEmpty(_ref);
  var _useState = (0, import_react.useState)(function() {
    return document.createElement("div");
  }), el = _useState[0];
  var root = import_react.default.useMemo(function() {
    return import_client.default.createRoot(el);
  }, [el]);
  var _useState2 = (0, import_react.useState)({}), boundingStyle = _useState2[0], setBoundingStyle = _useState2[1];
  var _useState3 = (0, import_react.useState)({
    prefersDarkScheme: false,
    prefersReducedMotion: false
  }), debugState = _useState3[0], setDebugState = _useState3[1];
  var _useUserPreferences = useUserPreferences(), a11yPrefersState = _useUserPreferences.a11yPrefersState, setA11yPrefersState2 = _useUserPreferences.setA11yPrefersState;
  var domStructureRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(function() {
    el.style.cssText = "position:fixed;top:0;left:0;";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    setDebugState({
      prefersDarkScheme: a11yPrefersState.prefersDarkScheme,
      prefersReducedMotion: a11yPrefersState.prefersReducedMotion
    });
    var selectActiveEl = function selectActiveEl2() {
      var _document$activeEleme;
      console.log("focused: ", document.activeElement);
      var r3fa11ydebugidref = (_document$activeEleme = document.activeElement) == null ? void 0 : _document$activeEleme.getAttribute("r3f-a11y-debug-id");
      if (r3fa11ydebugidref) {
        document.querySelectorAll("[r3fa11ydebugidref]").forEach(function(node) {
          node.style.color = null;
        });
        var refEl = document.querySelector('[r3fa11ydebugidref="' + r3fa11ydebugidref + '"]');
        if (refEl) {
          refEl.style.color = "red";
        }
      }
    };
    var root2 = import_client.default.createRoot(domStructureRef.current);
    console.log("enregistre ev");
    document.addEventListener("focus", selectActiveEl, true);
    var superinterval = window.setInterval(function() {
      var r3fPosId = 0;
      var elements = [];
      document.querySelectorAll("[r3f-a11y]").forEach(function(node) {
        node.setAttribute("r3f-a11y-debug-id", "" + r3fPosId);
        elements.push(
          //@ts-ignore
          import_react.default.createElement("li", {
            key: r3fPosId,
            r3fa11ydebugidref: r3fPosId
          }, node.tagName, import_react.default.createElement("button", {
            tabIndex: -1,
            onClick: function onClick() {
              console.log(node);
              var clientRect = node.getBoundingClientRect();
              setBoundingStyle({
                width: clientRect.width,
                height: clientRect.height,
                top: clientRect.top,
                left: clientRect.left
              });
            }
          }, "Show"))
        );
        r3fPosId++;
      });
      root2.render(import_react.default.createElement(import_react.default.Fragment, null, elements));
    }, 2e3);
    return function() {
      clearInterval(superinterval);
      root2.unmount();
      console.log("remove ev");
      document.removeEventListener("focus", selectActiveEl, true);
    };
  }, [a11yPrefersState]);
  var handleChange = function handleChange2(e) {
    setA11yPrefersState2({
      prefersDarkScheme: e.target.name === "prefersDarkScheme" ? e.target.checked : debugState.prefersDarkScheme,
      prefersReducedMotion: e.target.name === "prefersReducedMotion" ? e.target.checked : debugState.prefersReducedMotion
    });
  };
  (0, import_react.useLayoutEffect)(function() {
    return void root.render(import_react.default.createElement(import_react.default.Fragment, null, import_react.default.createElement("label", null, "Prefer dark mode", import_react.default.createElement("input", {
      type: "checkbox",
      name: "prefersDarkScheme",
      checked: debugState.prefersDarkScheme,
      onChange: handleChange
    })), import_react.default.createElement("label", null, "Prefer reduced motion", import_react.default.createElement("input", {
      type: "checkbox",
      name: "prefersReducedMotion",
      checked: debugState.prefersReducedMotion,
      onChange: handleChange
    })), import_react.default.createElement("h3", null, "R3F Dom order"), import_react.default.createElement("ul", {
      ref: domStructureRef
    }), import_react.default.createElement("div", {
      style: Object.assign({
        position: "absolute",
        border: "1px solid white",
        borderRadius: "50%",
        background: "linear-gradient( 45deg, rgb(70, 255, 60, 0.7), rgb(0, 64, 193, 0.7))",
        pointerEvents: "none",
        transition: "all 200ms ease"
      }, boundingStyle)
    })));
  });
  return import_react.default.createElement(import_react.default.Fragment, null);
};
export {
  A11y,
  A11yAnnouncer,
  A11yDebuger,
  A11ySection,
  A11yUserPreferences,
  A11yUserPreferencesContext,
  useA11y,
  useUserPreferences
};
//# sourceMappingURL=@react-three_a11y.js.map
