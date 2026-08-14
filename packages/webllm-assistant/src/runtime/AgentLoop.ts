import {
  isTerminalAgentAction,
  parseAssistantAction,
  type AssistantAction,
} from "../actions/schema";
import { buildEditorContext, type EditorContextInput } from "../context/buildEditorContext";
import {
  DEFAULT_AGENT_MAX_STEPS,
  buildForceActionPrompt,
  buildSystemPrompt,
} from "../prompt/system";
import type { ChatMessage } from "./WebLLMAssistantRuntime";

export type AgentStepRecord = {
  step: number;
  action: AssistantAction;
  rawText: string;
  resultOk: boolean;
  resultMessage: string;
};

export type AgentLoopResult = {
  steps: AgentStepRecord[];
  finalMessage: string;
  stoppedReason: "done" | "fail" | "reply" | "max_steps" | "parse_fail";
};

export type AgentApplyResult = {
  ok: boolean;
  message: string;
  createdIds?: string[];
};

export type AgentLoopOptions = {
  userGoal: string;
  maxSteps?: number;
  /**
   * Prior user/assistant turns from the UI chat (cross-turn continuity).
   * Injected after system prompt, before in-loop step history.
   */
  priorChat?: ChatMessage[];
  /** Build fresh observation each step (selected ids, layers, etc. may change). */
  getObservation: (meta: {
    step: number;
    maxSteps: number;
    lastActionResult: string | null;
    userGoal: string;
  }) => Omit<
    EditorContextInput,
    "step" | "maxSteps" | "lastActionResult" | "userGoal"
  >;
  chat: (messages: ChatMessage[]) => Promise<string>;
  apply: (action: AssistantAction) => AgentApplyResult | Promise<AgentApplyResult>;
  /** Optional step 0 bypass (e.g. inferPanelAddFromUserText). */
  bootstrapAction?: AssistantAction | null;
  /** If true, stop with agent.done after a successful bootstrap (simple add-only goals). */
  finishAfterBootstrap?: boolean;
  onStep?: (record: AgentStepRecord) => void;
};

export async function runAgentLoop(
  options: AgentLoopOptions
): Promise<AgentLoopResult> {
  const maxSteps = options.maxSteps ?? DEFAULT_AGENT_MAX_STEPS;
  const steps: AgentStepRecord[] = [];
  let lastActionResult: string | null = null;
  let parseFails = 0;
  const historyTail: ChatMessage[] = [];
  const priorChat = (options.priorChat ?? []).filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  const runStep = async (
    step: number,
    forcedAction?: AssistantAction | null
  ): Promise<"continue" | "stop"> => {
    let action: AssistantAction;
    let rawText = "";

    if (forcedAction) {
      action = forcedAction;
      rawText = JSON.stringify(forcedAction);
    } else {
      const observation = options.getObservation({
        step,
        maxSteps,
        lastActionResult,
        userGoal: options.userGoal,
      });
      const ctx = buildEditorContext({
        ...observation,
        step,
        maxSteps,
        lastActionResult,
        userGoal: options.userGoal,
      });
      const messages: ChatMessage[] = [
        { role: "system", content: buildSystemPrompt(ctx) },
        // Cross-turn chat continuity (previous Q/A), then this-loop tool trail.
        ...priorChat,
        ...historyTail.slice(-10),
        {
          role: "user",
          content:
            step === 1
              ? `【本轮新目标】${options.userGoal}\n打招呼或提问请直接 reply。明确要改页面则输出工具 JSON。只有描述了页面改动却没说清时，才问要不要改。禁止口头假装已改好。\n请输出第一步 JSON。`
              : `继续完成本轮目标。上一步结果：${lastActionResult ?? "无"}\n请输出下一步工具 JSON（或 agent.done / reply）。`,
        },
      ];

      let parsed = parseAssistantAction(await options.chat(messages));
      if (!parsed.ok || (parsed.action.type === "reply" && step > 1 && parseFails < 1)) {
        // one nudge when mid-loop reply/empty
        if (parsed.ok && parsed.action.type === "reply") {
          parsed = parseAssistantAction(
            await options.chat([
              ...messages,
              { role: "assistant", content: parsed.rawText },
              { role: "user", content: buildForceActionPrompt() },
            ])
          );
        } else if (!parsed.ok) {
          parsed = parseAssistantAction(
            await options.chat([
              ...messages,
              { role: "user", content: buildForceActionPrompt() },
            ])
          );
        }
      }

      if (!parsed.ok) {
        parseFails += 1;
        lastActionResult = `parse_fail:${parsed.error}`;
        if (parseFails >= 2) {
          return "stop";
        }
        return "continue";
      }

      parseFails = 0;
      action = parsed.action;
      rawText = parsed.rawText;

      // Don't let the model claim "already changed" without a tool call.
      if (
        action.type === "reply" &&
        looksLikeClaimedMutation(action.message)
      ) {
        const retry = parseAssistantAction(
          await options.chat([
            ...messages,
            { role: "assistant", content: rawText },
            {
              role: "user",
              content:
                "你没有执行任何改页面工具，不能说已经改好。请立刻输出 panel.update / panel.add 等工具 JSON；若仍不确定，reply 问用户：你是要我改当前页面吗？",
            },
          ])
        );
        if (retry.ok) {
          action = retry.action;
          rawText = retry.rawText;
        }
      }
    }

    if (action.type === "reply") {
      const record: AgentStepRecord = {
        step,
        action,
        rawText,
        resultOk: true,
        resultMessage: action.message,
      };
      steps.push(record);
      options.onStep?.(record);
      lastActionResult = action.message;
      return "stop";
    }

    if (action.type === "agent.done" || action.type === "agent.fail") {
      const record: AgentStepRecord = {
        step,
        action,
        rawText,
        resultOk: action.type === "agent.done",
        resultMessage: action.message,
      };
      steps.push(record);
      options.onStep?.(record);
      lastActionResult = action.message;
      return "stop";
    }

    const result = await options.apply(action);
    const record: AgentStepRecord = {
      step,
      action,
      rawText,
      resultOk: result.ok,
      resultMessage: result.message,
    };
    steps.push(record);
    options.onStep?.(record);
    lastActionResult = result.ok
      ? formatOkResult(result.message, result.createdIds)
      : `ERROR:${result.message}`;

    historyTail.push({
      role: "assistant",
      content: rawText.slice(0, 600),
    });
    historyTail.push({
      role: "user",
      content: `结果：${lastActionResult}`,
    });

    return "continue";
  };

  let step = 1;
  if (options.bootstrapAction) {
    const status = await runStep(step, options.bootstrapAction);
    if (status === "stop") {
      return finalize(steps, lastActionResult, maxSteps);
    }
    const last = steps[steps.length - 1];
    if (options.finishAfterBootstrap && last?.resultOk) {
      const doneAction: AssistantAction = {
        type: "agent.done",
        message: last.resultMessage || "已完成",
      };
      const record: AgentStepRecord = {
        step: step + 1,
        action: doneAction,
        rawText: JSON.stringify(doneAction),
        resultOk: true,
        resultMessage: doneAction.message,
      };
      steps.push(record);
      options.onStep?.(record);
      return finalize(steps, doneAction.message, maxSteps);
    }
    step += 1;
  }

  while (step <= maxSteps) {
    const status = await runStep(step);
    if (status === "stop") {
      return finalize(steps, lastActionResult, maxSteps);
    }
    const last = steps[steps.length - 1];
    if (last && isTerminalAgentAction(last.action)) {
      return finalize(steps, lastActionResult, maxSteps);
    }
    step += 1;
  }

  return {
    steps,
    finalMessage: lastActionResult ?? "达到步数上限",
    stoppedReason: "max_steps",
  };
}

function formatOkResult(message: string, createdIds?: string[]): string {
  if (!createdIds?.length) return message;
  return `${message} [createdIds=${createdIds.join(",")}]`;
}

function looksLikeClaimedMutation(message: string): boolean {
  return /已(将|把|改|设置|添加|删除|更新|完成)|已经(改|加|删|设)/.test(message);
}

function finalize(
  steps: AgentStepRecord[],
  lastActionResult: string | null,
  maxSteps: number
): AgentLoopResult {
  const last = steps[steps.length - 1];
  if (!last) {
    return {
      steps,
      finalMessage: "无有效步骤",
      stoppedReason: "parse_fail",
    };
  }
  if (last.action.type === "agent.done") {
    return {
      steps,
      finalMessage: last.action.message,
      stoppedReason: "done",
    };
  }
  if (last.action.type === "agent.fail") {
    return {
      steps,
      finalMessage: last.action.message,
      stoppedReason: "fail",
    };
  }
  if (last.action.type === "reply") {
    return {
      steps,
      finalMessage: last.action.message,
      stoppedReason: "reply",
    };
  }
  if (steps.length >= maxSteps) {
    return {
      steps,
      finalMessage: lastActionResult ?? "达到步数上限",
      stoppedReason: "max_steps",
    };
  }
  return {
    steps,
    finalMessage: lastActionResult ?? "已停止",
    stoppedReason: "parse_fail",
  };
}
