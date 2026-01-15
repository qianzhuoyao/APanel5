// types.ts
export type Value = any

export type PortSpec = {
  name: string
  kind: "data" | "flow"
  optional?: boolean
}

export type NodeDefinition = {
  type: string
  inputs: PortSpec[]
  outputs: PortSpec[]

  behavior: {
    kind: "js" | "blueprint"
    ref: string
  }
}

export type ExecutionToken = {
  tokenId: string
  nodeId: string
  nodeType: string
  inPort: string

  scope: Scope
  correlationId?: string
}

export type Scope = {
  parent?: Scope
  vars: Map<string, Value>
}
