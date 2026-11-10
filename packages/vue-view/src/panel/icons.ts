import { h, type VNode } from "vue";

const svgProps = {
  viewBox: "0 0 24 24",
  class: "h-3.5 w-3.5",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
};

function svg(children: VNode | VNode[], extra: Record<string, unknown> = {}) {
  return h("svg", { ...svgProps, ...extra }, children);
}

export function IconPlus() {
  return svg(h("path", { d: "M12 5v14M5 12h14" }));
}

export function IconMerge() {
  return svg([
    h("path", { d: "M7 7h4a4 4 0 0 1 4 4v6" }),
    h("path", { d: "m12 14 3 3 3-3" }),
    h("path", { d: "M7 17h2" }),
  ]);
}

export function IconLock({ locked }: { locked: boolean }) {
  return locked
    ? svg([
        h("rect", { x: "4", y: "11", width: "16", height: "9", rx: "2" }),
        h("path", { d: "M8 11V8a4 4 0 0 1 8 0v3" }),
      ])
    : svg([
        h("rect", { x: "4", y: "11", width: "16", height: "9", rx: "2" }),
        h("path", { d: "M16 11V8a4 4 0 0 0-7-2.5" }),
      ]);
}

export function IconEdit() {
  return svg([
    h("path", { d: "M12 20h9" }),
    h("path", { d: "m16.5 3.5 4 4L8 20l-5 1 1-5Z" }),
  ]);
}

export function IconTrash() {
  return svg([
    h("path", { d: "M3 6h18" }),
    h("path", { d: "M8 6V4h8v2" }),
    h("path", { d: "M19 6l-1 14H6L5 6" }),
  ]);
}

export function IconCheck() {
  return svg(h("path", { d: "m5 12 5 5L20 7" }));
}

export function IconClose() {
  return svg(h("path", { d: "M6 6l12 12M18 6 6 18" }));
}

export function IconChevron({ expanded }: { expanded: boolean }) {
  return svg(
    expanded ? h("path", { d: "m6 14 6-6 6 6" }) : h("path", { d: "m6 10 6 6 6-6" })
  );
}

export function IconUndo() {
  return svg([
    h("path", { d: "M9 14 4 9l5-5" }),
    h("path", { d: "M20 20a9 9 0 0 0-9-9H4" }),
  ]);
}

export function IconRedo() {
  return svg([
    h("path", { d: "m15 14 5-5-5-5" }),
    h("path", { d: "M4 20a9 9 0 0 1 9-9h7" }),
  ]);
}

export function IconBringFront() {
  return svg([
    h("path", { d: "M7 17h10M12 17V7" }),
    h("path", { d: "m8.5 9 3.5-3.5L15.5 9" }),
  ]);
}

export function IconSendBack() {
  return svg([
    h("path", { d: "M7 7h10M12 17V7" }),
    h("path", { d: "m15.5 15-3.5 3.5L8.5 15" }),
  ]);
}

export function IconForward() {
  return svg([
    h("path", { d: "M12 18V6" }),
    h("path", { d: "m8.5 9 3.5-3.5L15.5 9" }),
  ]);
}

export function IconBackward() {
  return svg([
    h("path", { d: "M12 6v12" }),
    h("path", { d: "m15.5 15-3.5 3.5L8.5 15" }),
  ]);
}

export function IconLayers() {
  return svg([
    h("path", { d: "m12 4 8 4-8 4-8-4 8-4Z" }),
    h("path", { d: "m4 12 8 4 8-4" }),
    h("path", { d: "m4 16 8 4 8-4" }),
  ]);
}

export function IconImage() {
  return svg([
    h("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
    h("circle", { cx: "9", cy: "10", r: "1.5" }),
    h("path", { d: "m21 16-5.5-5.5L7 19" }),
  ]);
}

export function IconStar({ filled }: { filled?: boolean } = {}) {
  return svg(h("path", { d: "m12 3 2.7 5.5 6 .9-4.4 4.3 1 6L12 16.8 6.7 19.7l1-6L3.3 9.4l6-.9L12 3Z" }), {
    fill: filled ? "currentColor" : "none",
  });
}

export function IconEyeOff() {
  return svg([
    h("path", { d: "M3 3l18 18" }),
    h("path", { d: "M10.6 10.6a2 2 0 0 0 2.8 2.8" }),
    h("path", {
      d: "M9.9 5.1A10.6 10.6 0 0 1 12 5c5 0 9.3 3.1 11 7-.5 1.2-1.2 2.3-2.1 3.2",
    }),
    h("path", {
      d: "M6.1 6.1C4.2 7.3 2.7 9 1.9 11c1.7 3.9 6 7 10.1 7 1.4 0 2.7-.3 3.9-.7",
    }),
  ]);
}

export function IconBlueprint({ active }: { active?: boolean } = {}) {
  return svg(
    [
      h("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
      h("circle", {
        cx: "8",
        cy: "10",
        r: "1.5",
        fill: active ? "currentColor" : "none",
      }),
      h("circle", {
        cx: "16",
        cy: "10",
        r: "1.5",
        fill: active ? "currentColor" : "none",
      }),
      h("circle", {
        cx: "12",
        cy: "16",
        r: "1.5",
        fill: active ? "currentColor" : "none",
      }),
      h("path", { d: "M9.2 10.8 10.8 14.2M14.8 10.8 13.2 14.2" }),
    ],
    { "stroke-width": active ? 2.2 : 2 }
  );
}

export function IconSun() {
  return svg([
    h("circle", { cx: "12", cy: "12", r: "4" }),
    h("path", {
      d: "M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77",
    }),
  ]);
}

export function IconMoon() {
  return svg(
    h("path", {
      d: "M21 12.79A9 9 0 1 1 11.21 3c0 .66.08 1.3.22 1.92A7 7 0 0 0 19.08 12c.62.14 1.26.22 1.92.22Z",
    })
  );
}
