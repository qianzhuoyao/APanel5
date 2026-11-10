/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module "react-dom/client" {
  export function createRoot(
    container: Element | DocumentFragment,
    options?: unknown
  ): {
    render: (children: unknown) => void;
    unmount: () => void;
  };
}

declare module "veaury" {
  import type { Component } from "vue";
  import type { ComponentType } from "react";
  import type { Root } from "react-dom/client";

  export function applyPureReactInVue<P = Record<string, unknown>>(
    reactComponent: ComponentType<P>,
    options?: Record<string, unknown>
  ): Component;

  export function applyReactInVue<P = Record<string, unknown>>(
    reactComponent: ComponentType<P>,
    options?: Record<string, unknown>
  ): Component;

  export function setVeauryOptions(options: {
    react?: {
      createRoot?: (
        container: Element | DocumentFragment
      ) => Root;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }): void;
}
