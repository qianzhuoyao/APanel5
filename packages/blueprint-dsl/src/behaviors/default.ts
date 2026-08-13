import {
  createFalseSignal,
  createTrueSignal,
  isFalseSignal,
  isTrueSignal,
} from "../node-signal.js";
import type { LifecycleSignal } from "../lifecycle.js";
import { BehaviorRegistry } from "../core/behavior-registry.js";

const LIFECYCLE_SIGNAL_KEY = "__lifecycleSignal";
const BLUEPRINT_ACTIVATION_INPUT_KEY = "__blueprintActivationInput";
const UI_EVENT_PAYLOAD_KEY = "__uiEventPayload";

export function registerDefaultBehaviors(registry: BehaviorRegistry) {
  registry.registerJS("logic-noop", async ({ io }) => {
    const input = await io.getInput("in");
    if (isFalseSignal(input)) {
      io.setOutput("out", input);
    } else if (isTrueSignal(input)) {
      io.setOutput("out", createTrueSignal(input.value));
    } else {
      io.setOutput("out", createTrueSignal(undefined));
    }
    io.emitFlow("out");
  });

  registry.registerJS("lifecycle-emit", async ({ token, io }) => {
    const lifecycle = token.scope.vars.get(LIFECYCLE_SIGNAL_KEY) as
      | LifecycleSignal
      | undefined;
    if (!lifecycle) {
      io.setOutput("out", createFalseSignal("生命周期信号缺失"));
    } else if (lifecycle.phase === "blueprintActivated") {
      io.setOutput(
        "out",
        createTrueSignal(token.scope.vars.get(BLUEPRINT_ACTIVATION_INPUT_KEY))
      );
    } else {
      io.setOutput("out", createTrueSignal(lifecycle));
    }
    io.emitFlow("out");
  });
}

export { LIFECYCLE_SIGNAL_KEY, BLUEPRINT_ACTIVATION_INPUT_KEY, UI_EVENT_PAYLOAD_KEY };
