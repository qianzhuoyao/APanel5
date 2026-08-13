/** Compact tool catalog injected into the agent system prompt. */
export const AGENT_TOOL_CATALOG = `
工具（每步只输出一个 JSON，type 必须是下列之一）：
- reply / agent.done / agent.fail：问答结束 / 成功结束 / 失败结束
- panel.add {materialType,x?,y?,patch?}
- panel.update {id,patch}
- panel.remove {id}
- panel.select {ids:string[]}
- panel.duplicate {id}
- panel.lock {id,locked:boolean}
- panel.zOrder {action:"front"|"back"|"forward"|"backward", ids?:string[]}
- panel.batch {actions:[]}  （单步内小子步骤，少用）
- layer.setActive {id} | layer.add {name?} | layer.rename {id,name} | layer.lock {id,locked} | layer.delete {id}
- viewport.zoom {value,mode?:"absolute"|"delta"} | viewport.fit
- history.undo | history.redo
- blueprint.open {open?:boolean} | blueprint.addNode | blueprint.connect | blueprint.removeNode
- blueprint.updateNode {id,patch} | blueprint.removeEdge {id} | blueprint.runAll
- workspace.save | workspace.sync | workspace.create {name?} | workspace.open {id} | workspace.preview {id?}
- io.exportPanel | io.importPanelJson {json}
- ui.setTheme {theme:"light"|"dark"} | ui.setLocale {locale:"zh-CN"|"en-US"} | ui.setPanelFontSize {size:"sm"|"md"|"lg"}

materialType 仅英文：table/text/grid/image/bar/line/pie/area/scatter/radar/gauge/funnel/geometry/video/audio/reference
`.trim();
