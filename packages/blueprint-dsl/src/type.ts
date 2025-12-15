export interface IBlueprintDsl {
  source: {
    id: string;
  };
  subscription: {
    triggerName: string;
    //作用于,关于是否需要$node$做标记待定，返回值是payload的actionParams参数
    //不写就是整个组件都作用，此处应该是组件
    trigger: string;
    //当前所有task执行完才执行next,会自动去找到id是‘id-yy’的节点，并执行它下属的
    //$node$_expand_bar上的custom_collapse_bar事件上的task，task不写在此处
    next: {
      target: string;
      action: string;
    };
    task: {
      targets: {
        target: string;
        action: string;
      }[];
      payload: {
        taskParams: Record<string, unknown>; //上一个节点task的结果，如无则是空对象
        inputParams: Record<string, unknown>; //由用户构建，提供表单生成，但原则上的key应该由actingUpon决定。假设这里输入是isDbclick:boolean
        actionParams: Record<string, unknown>; //由acting
      }[];
    }[];
  };
}
