# Changelog

本文件记录 `@arronqzy/abuilder` 主入口及相关配套包的用户可见变更。版本以主包 `abuilder` 为准；括号内为同步 bump 的关键子包。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [1.1.36] - 2026-09-18

配套：`react-blueprint@1.0.21` · `vue-blueprint@0.1.16` · `react-view@1.0.35` · `abuilder-vue@0.1.20`

### Added

- 蓝图画布 Soft UI：大圆角色块卡片、类型图标、灰细连线、点阵背景
- 蓝图 / 视图配置类型使用独立节点图标，避免外观混淆
- 切换节点配置类型时，若名称仍是默认类型文案，则自动同步为新类型名

### Fixed

- 节点输入 / 输出连接点相对卡片左右中线定位
- 选中态描边与连接点高亮更清晰

### Changed

- 节点卡片样式改为 CSS 变量驱动，减少 Tailwind purge 导致的图标底色缺失
- `react-view` Tailwind `content` 纳入 `react-blueprint` 源码路径

## [1.1.35] - 2026-09-18

配套：`react-blueprint@1.0.20` · `vue-blueprint@0.1.15` · `react-view@1.0.34` · `abuilder-vue@0.1.19` · `blueprint-dsl@1.0.16`

### Added

- 接口集合：上传 / 管理本地 API JSON；数据源获取节点可从集合选接口回填；支持按 URL 同步更新蓝图节点
- 模版双根：配置与蓝图除 `{scope?...}` 外，新增 `{system?...}`（time / math / location），可与 scope 互相嵌套
- JSON 节点语法错误高亮（编辑区下方预览，定位更准）
- 集合 JSON 的 `url` / `params` / `headers` / `body` / `baseUrl` 字符串值支持 Scope / System 模版

### Fixed

- `blueprint-dsl` 精简 dayjs 供应商时补回 `en` locale，避免 `./locale/en` 解析失败

## [1.1.34] 及更早

更早变更见 Git 提交历史（`v5` 分支）。重要方向包括：

- 配置面板展开状态记忆、中文使用手册、设置「关于」显示版本
- Scope 模版覆盖视图 URL 与更多蓝图字段
- 工作区 IndexedDB 持久化加固、配置滚动位置记忆
- WebLLM / Vite 插件与宿主构建工具兼容性修复
- React / Vue 双栈视图与蓝图能力持续对齐
