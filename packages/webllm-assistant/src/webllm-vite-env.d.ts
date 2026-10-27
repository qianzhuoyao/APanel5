/** Vite rewrites this specifier in `webllmAssistant()`. */
declare module "virtual:arronqzy-webllm-entry" {
  const assetHref: string;
  export default assetHref;
}

declare module "node:fs" {
  export function existsSync(path: string): boolean;
  export function createReadStream(path: string): {
    pipe(destination: import("node:http").ServerResponse): unknown;
  };
}

declare module "node:http" {
  export interface IncomingMessage {
    url?: string;
  }
  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(chunk?: string): void;
  }
}
