```ts
const behaviors = new BehaviorRegistry();

behaviors.registerJS("print-js", async ({ io }) => {
  console.log(await io.getInput("msg"));
  io.emitFlow("out");
});

behaviors.registerJS("sleep-js", async ({ io }) => {
  const ms = await io.getInput("ms");
  await new Promise((r) => setTimeout(r, ms));
  io.emitFlow("out");
});


const PrintNode: NodeDefinition = {
  type: "Print",
  inputs: [{ name: "msg", kind: "data" }],
  outputs: [{ name: "out", kind: "flow" }],
  behavior: { kind: "js", ref: "print-js" }
}


await executor.executeToken({
  tokenId: "t1",
  nodeId: "n1",
  nodeType: "Print",
  inPort: "in",
  scope: { vars: new Map() }
})

```
