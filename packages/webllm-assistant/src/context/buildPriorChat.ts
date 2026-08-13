import type { ChatMessage } from "../runtime/WebLLMAssistantRuntime";

export type PriorChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

const DEFAULT_MAX_TURNS = 6;
const DEFAULT_MAX_CHARS = 480;

/**
 * Convert UI chat turns into model messages (user/assistant only).
 * Keeps the last N turns so follow-ups like「继续」「刚才那个」have continuity.
 */
export function buildPriorChatMessages(
  turns: PriorChatTurn[],
  options?: {
    maxTurns?: number;
    maxCharsPerMessage?: number;
  }
): ChatMessage[] {
  const maxTurns = options?.maxTurns ?? DEFAULT_MAX_TURNS;
  const maxChars = options?.maxCharsPerMessage ?? DEFAULT_MAX_CHARS;

  const dialog = turns.filter(
    (t): t is { role: "user" | "assistant"; content: string } =>
      (t.role === "user" || t.role === "assistant") && !!t.content.trim()
  );

  return dialog.slice(-maxTurns).map((t) => ({
    role: t.role,
    content: truncateForChat(t.content, maxChars),
  }));
}

/** Compact recent dialog for the observation JSON (helps small models). */
export function buildRecentDialogSummary(
  turns: PriorChatTurn[],
  options?: { maxTurns?: number; maxCharsPerMessage?: number }
): Array<{ role: "user" | "assistant"; content: string }> {
  return buildPriorChatMessages(turns, {
    maxTurns: options?.maxTurns ?? 4,
    maxCharsPerMessage: options?.maxCharsPerMessage ?? 220,
  }) as Array<{ role: "user" | "assistant"; content: string }>;
}

function truncateForChat(text: string, max: number): string {
  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max)}…`;
}
