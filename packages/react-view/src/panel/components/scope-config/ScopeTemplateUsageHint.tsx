export function ScopeTemplateUsageHint() {
  return (
    <div className="space-y-2">
      <p>
        表单中可使用模版字符串引用 scope，例如{" "}
        <code className="rounded bg-muted px-1">{`{scope?.a||0}`}</code>
        、
        <code className="rounded bg-muted px-1">{`{scope?.name||''}`}</code>
        。支持 <code className="rounded bg-muted px-1">?.</code> 与{" "}
        <code className="rounded bg-muted px-1">||</code> 占位。
      </p>
      <p>
        数组展开模版{" "}
        <code className="rounded bg-muted px-1">{`[...{scope?.a?.b}]`}</code>
        、
        <code className="rounded bg-muted px-1">
          {`[...{scope?.data?.data?.statusName}]`}
        </code>
        ：在文本字段输出逗号分隔字符串；在图表「类目」等数组字段会展开为 n
        个独立项（如 3 条数据对应 3 个类目）。
      </p>
    </div>
  );
}
