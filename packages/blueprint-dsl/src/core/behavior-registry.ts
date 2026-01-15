// behavior-registry.ts
import { BehaviorFn } from "./behavior"

type JSBehavior = {
  kind: "js"
  run: BehaviorFn
}

type BlueprintBehavior = {
  kind: "blueprint"
  blueprintId: string
}

export type Behavior = JSBehavior | BlueprintBehavior

export class BehaviorRegistry {
  private map = new Map<string, Behavior>()

  registerJS(id: string, fn: BehaviorFn) {
    this.map.set(id, { kind: "js", run: fn })
  }

  registerBlueprint(id: string, blueprintId: string) {
    this.map.set(id, { kind: "blueprint", blueprintId })
  }

  get(id: string): Behavior {
    const b = this.map.get(id)
    if (!b) throw new Error(`Behavior not found: ${id}`)
    return b
  }
}
