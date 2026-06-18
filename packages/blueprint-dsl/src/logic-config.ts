export type LogicNodeConfig = {
  /** 用户手写的 update(input) 函数脚本 */
  sourceCode: string;
};

export const DEFAULT_LOGIC_NODE_CONFIG: LogicNodeConfig = {
  sourceCode: `function update(input) {
  return input;
}`,
};

function compileLogicRunner(sourceCode: string): (input: unknown) => unknown {
  return new Function(
    "input",
    `"use strict";
${sourceCode}
if (typeof update !== "function") {
  throw new TypeError("需要定义 update(input) 函数");
}
return update(input);`
  ) as (input: unknown) => unknown;
}

export function validateLogicSourceCode(
  sourceCode: string
): { ok: true } | { ok: false; error: string } {
  const raw = sourceCode?.trim();
  if (!raw) {
    return { ok: false, error: "代码不能为空" };
  }

  try {
    compileLogicRunner(raw);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JavaScript 语法错误",
    };
  }
}

export function executeLogicConfig(
  config: LogicNodeConfig,
  input: unknown
): unknown {
  const validation = validateLogicSourceCode(config.sourceCode ?? "");
  if (!validation.ok) {
    throw new Error(validation.error);
  }
  const run = compileLogicRunner(config.sourceCode);
  return run(input);
}
