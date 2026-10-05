#!/usr/bin/env bash
# 仅当 npm 上不存在该精确版本时才发布（版本未 bump 的包会自动跳过）
set -euo pipefail

PKG="${1:?用法: publish-if-new.sh <@scope/name>}"

VERSION="$(pnpm list -r --depth -1 --json 2>/dev/null | node -e "
const pkgs = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const found = pkgs.find((p) => p.name === process.argv[1]);
if (!found?.version) process.exit(1);
process.stdout.write(found.version);
" "$PKG")"

if [ -z "$VERSION" ]; then
  echo "❌ 无法读取 $PKG 的 version" >&2
  exit 1
fi

TAG="${PKG}@${VERSION}"

if npm view "$TAG" version >/dev/null 2>&1; then
  echo "⏭️  跳过 $TAG（npm 上已存在）"
  exit 0
fi

echo "📦 发布 $TAG ..."
# 无权限时 npm 对已有 scope 包的 PUT 常返回 404，附带提示便于排障
if ! pnpm --filter "$PKG" publish --access public --no-git-checks; then
  echo "❌ 发布 $TAG 失败。若报 404 Not Found - PUT，多半是 NPM_TOKEN 无效/过期/无 @arronqzy 发布权限（而非版本不存在）。" >&2
  exit 1
fi
echo "✅ 已发布 $TAG"
