import {
  Primitive
} from "./chunk-DSYZZ4OM.js";
import {
  useLayoutEffect2
} from "./chunk-LZFA4K44.js";
import {
  require_jsx_runtime
} from "./chunk-MKG6J3U4.js";
import {
  require_react_dom
} from "./chunk-TU732EOO.js";
import {
  require_react
} from "./chunk-FYB3GGWZ.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// ../../node_modules/.pnpm/@radix-ui+react-portal@1.1.9_@types+react-dom@19.1.1_@types+react@19.1.0_react-dom@19.2.0_react@19.2.0/node_modules/@radix-ui/react-portal/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var PORTAL_NAME = "Portal";
var Portal = React.forwardRef((props, forwardedRef) => {
  var _a;
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = React.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
  return container ? import_react_dom.default.createPortal((0, import_jsx_runtime.jsx)(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;

export {
  Portal
};
//# sourceMappingURL=chunk-KXCH37PJ.js.map
