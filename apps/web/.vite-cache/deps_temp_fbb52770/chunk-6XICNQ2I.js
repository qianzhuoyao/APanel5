import {
  useControllableState
} from "./chunk-LPRI5GCV.js";
import {
  Primitive,
  composeEventHandlers
} from "./chunk-UVPOHZM4.js";
import {
  require_jsx_runtime
} from "./chunk-MKG6J3U4.js";
import {
  require_react
} from "./chunk-FYB3GGWZ.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// ../../node_modules/.pnpm/@radix-ui+react-toggle@1.1.10_@types+react-dom@19.1.1_@types+react@19.1.0_react-dom@19.2.0_react@19.2.0/node_modules/@radix-ui/react-toggle/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NAME = "Toggle";
var Toggle = React.forwardRef((props, forwardedRef) => {
  const { pressed: pressedProp, defaultPressed, onPressedChange, ...buttonProps } = props;
  const [pressed, setPressed] = useControllableState({
    prop: pressedProp,
    onChange: onPressedChange,
    defaultProp: defaultPressed ?? false,
    caller: NAME
  });
  return (0, import_jsx_runtime.jsx)(
    Primitive.button,
    {
      type: "button",
      "aria-pressed": pressed,
      "data-state": pressed ? "on" : "off",
      "data-disabled": props.disabled ? "" : void 0,
      ...buttonProps,
      ref: forwardedRef,
      onClick: composeEventHandlers(props.onClick, () => {
        if (!props.disabled) {
          setPressed(!pressed);
        }
      })
    }
  );
});
Toggle.displayName = NAME;
var Root = Toggle;

export {
  Toggle,
  Root
};
//# sourceMappingURL=chunk-6XICNQ2I.js.map
