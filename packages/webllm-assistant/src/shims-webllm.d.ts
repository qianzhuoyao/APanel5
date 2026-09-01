/// <reference types="vite/client" />

declare module "@mlc-ai/web-llm" {
  export class MLCEngine {
    constructor(config?: {
      initProgressCallback?: (report: { progress?: number; text?: string }) => void;
    });
    reload(modelId: string): Promise<void>;
    unload(): Promise<void>;
    chat: {
      completions: {
        create(request: unknown): Promise<unknown>;
      };
    };
  }
}
