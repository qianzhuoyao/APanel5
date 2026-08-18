import {
  require_react
} from "./chunk-ECT2SSAV.js";
import {
  __toESM
} from "./chunk-DLJ4GP37.js";

// ../../node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.1.0_react@19.2.0/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var React = __toESM(require_react(), 1);
function useCallbackRef(callback) {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(() => (...args) => {
    var _a;
    return (_a = callbackRef.current) == null ? void 0 : _a.call(callbackRef, ...args);
  }, []);
}

export {
  useCallbackRef
};
//# sourceMappingURL=chunk-IEB4R6RF.js.map
