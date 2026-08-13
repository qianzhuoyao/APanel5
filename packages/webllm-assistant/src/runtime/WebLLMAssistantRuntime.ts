import { DEFAULT_MODEL_ID } from "../prompt/system";

export type AssistantEngineStatus =
  | "idle"
  | "checking"
  | "unsupported"
  | "loading"
  | "ready"
  | "error";

export type InitProgress = {
  progress: number;
  text: string;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionReply = {
  choices?: Array<{
    message?: { content?: string | Array<string | { text?: string }> };
  }>;
};

type MLCEngineLike = {
  reload: (modelId: string) => Promise<void>;
  unload: () => Promise<void>;
  chat: {
    completions: {
      create: (request: {
        messages: Array<{ role: string; content: string }>;
        stream?: boolean;
        temperature?: number;
        max_tokens?: number;
      }) => Promise<ChatCompletionReply>;
    };
  };
};

type WebLLMModule = {
  MLCEngine: new (config?: {
    initProgressCallback?: (report: { progress?: number; text?: string }) => void;
  }) => MLCEngineLike;
};

export function isWebGPUAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

export class WebLLMAssistantRuntime {
  private engine: MLCEngineLike | null = null;
  private webllm: WebLLMModule | null = null;
  private modelId = DEFAULT_MODEL_ID;
  status: AssistantEngineStatus = "idle";
  lastError: string | null = null;
  progress: InitProgress = { progress: 0, text: "" };

  get currentModelId() {
    return this.modelId;
  }

  async ensureModule(): Promise<WebLLMModule> {
    if (this.webllm) return this.webllm;
    this.webllm = (await import("@mlc-ai/web-llm")) as unknown as WebLLMModule;
    return this.webllm;
  }

  async init(
    modelId: string = DEFAULT_MODEL_ID,
    onProgress?: (p: InitProgress) => void
  ): Promise<void> {
    this.status = "checking";
    this.lastError = null;
    if (!isWebGPUAvailable()) {
      this.status = "unsupported";
      this.lastError = "webgpu_unavailable";
      throw new Error("webgpu_unavailable");
    }

    this.status = "loading";
    this.modelId = modelId;
    const webllm = await this.ensureModule();

    const engine = new webllm.MLCEngine({
      initProgressCallback: (report) => {
        this.progress = {
          progress: report.progress ?? 0,
          text: report.text ?? "",
        };
        onProgress?.(this.progress);
      },
    });

    try {
      await engine.reload(modelId);
      this.engine = engine;
      this.status = "ready";
      this.progress = { progress: 1, text: "ready" };
    } catch (err) {
      this.status = "error";
      this.lastError = err instanceof Error ? err.message : String(err);
      this.engine = null;
      throw err;
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.engine || this.status !== "ready") {
      throw new Error("engine_not_ready");
    }
    const reply = await this.engine.chat.completions.create({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: false,
      temperature: 0,
      max_tokens: 1024,
    });
    const content = reply.choices?.[0]?.message?.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === "string") return part;
          if (part && typeof part === "object" && "text" in part) {
            return String(part.text ?? "");
          }
          return "";
        })
        .join("");
    }
    return "";
  }

  async unload(): Promise<void> {
    if (this.engine) {
      try {
        await this.engine.unload();
      } catch {
        // ignore
      }
    }
    this.engine = null;
    this.status = "idle";
  }
}
