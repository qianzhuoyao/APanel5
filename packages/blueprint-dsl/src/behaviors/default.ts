import type { LifecycleSignal } from "../lifecycle.js";
import { BehaviorRegistry } from "../core/behavior-registry.js";

const LIFECYCLE_SIGNAL_KEY = "__lifecycleSignal";

export function registerDefaultBehaviors(registry: BehaviorRegistry) {
  registry.registerJS("logic-noop", async ({ io }) => {
    io.emitFlow("out");
  });

  registry.registerJS("lifecycle-emit", async ({ token, io }) => {
    const signal = token.scope.vars.get(LIFECYCLE_SIGNAL_KEY) as
      | LifecycleSignal
      | undefined;
    if (signal) {
      io.setOutput("signal", signal);
    }
    io.emitFlow("out");
  });
}

export { LIFECYCLE_SIGNAL_KEY };
