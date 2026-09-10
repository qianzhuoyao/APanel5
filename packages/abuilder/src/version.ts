import packageJson from "../package.json";

/** 与 packages/abuilder/package.json 的 name / version 保持同步（构建时从 JSON 读入）。 */
export const ABUILDER_PACKAGE_NAME = packageJson.name;
export const ABUILDER_VERSION = packageJson.version;
