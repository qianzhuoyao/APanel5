/**
 * Contract test for materializePanelElements shallow reuse.
 * Run: node packages/react-view/src/panel/utils/materializePanelElements.test.mjs
 */
import assert from "node:assert/strict";

/** Mirrors react-view and vue-view materializePanelElements.ts */
function isSameMaterializedElement(prev, next) {
  if (prev === next) return true;
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return false;
  for (const key of nextKeys) {
    if (prev[key] !== next[key]) return false;
  }
  return true;
}

function materialize(nodes, previous) {
  const list = nodes ?? [];
  const prevById = previous?.length
    ? new Map(previous.map((el) => [el.id, el]))
    : null;
  const next = [];
  for (const n of list) {
    if (!n?.props) continue;
    const props = n.props;
    const normalized =
      typeof props.zIndex === "number" ? props : { ...props, zIndex: 1 };
    const prev = prevById?.get(normalized.id);
    if (prev && isSameMaterializedElement(prev, normalized)) {
      next.push(prev);
      continue;
    }
    next.push(normalized);
  }
  if (
    previous &&
    previous.length === next.length &&
    previous.every((el, i) => el === next[i])
  ) {
    return previous;
  }
  return next;
}

/** Old allowlist that omitted text/audio/geometry fields (reproduces the bug). */
function materializeLegacy(nodes, previous) {
  const list = nodes ?? [];
  const prevById = previous?.length
    ? new Map(previous.map((el) => [el.id, el]))
    : null;
  const next = [];
  for (const n of list) {
    if (!n?.props) continue;
    const props = n.props;
    const normalized =
      typeof props.zIndex === "number" ? props : { ...props, zIndex: 1 };
    const prev = prevById?.get(normalized.id);
    if (prev && prev === normalized) {
      next.push(prev);
      continue;
    }
    if (
      prev &&
      prev.id === normalized.id &&
      prev.x === normalized.x &&
      prev.y === normalized.y &&
      prev.width === normalized.width &&
      prev.height === normalized.height &&
      prev.rotate === normalized.rotate &&
      prev.zIndex === normalized.zIndex &&
      prev.layerId === normalized.layerId &&
      prev.locked === normalized.locked &&
      prev.materialType === normalized.materialType &&
      prev.name === normalized.name &&
      prev.chart === normalized.chart &&
      prev.table === normalized.table &&
      prev.style === normalized.style &&
      prev.textHtml === normalized.textHtml &&
      prev.textAllowInput === normalized.textAllowInput &&
      prev.audioSrc === normalized.audioSrc &&
      prev.videoSrc === normalized.videoSrc &&
      prev.geometryShape === normalized.geometryShape &&
      prev.geometryColor === normalized.geometryColor &&
      prev.geometrySketchDataUrl === normalized.geometrySketchDataUrl
    ) {
      next.push(prev);
      continue;
    }
    next.push(normalized);
  }
  return next;
}

const base = {
  id: "t1",
  layerId: "L1",
  zIndex: 1,
  materialType: "text",
  name: "文本",
  x: 10,
  y: 20,
  width: 100,
  height: 40,
  textHtml: "<p>hi</p>",
  textFontSize: 14,
  textColor: "#111",
};

const first = materialize([{ props: base }]);
assert.equal(first[0].textFontSize, 14);

const updatedProps = { ...base, textFontSize: 28 };
const second = materialize([{ props: updatedProps }], first);
assert.equal(second[0].textFontSize, 28, "textFontSize must apply");
assert.notEqual(second[0], first[0], "must use new element reference");

const legacy = materializeLegacy([{ props: updatedProps }], first);
assert.equal(
  legacy[0].textFontSize,
  14,
  "legacy allowlist incorrectly keeps old textFontSize"
);
assert.equal(legacy[0], first[0], "legacy reuses old reference");

const withAudio = {
  ...base,
  id: "a1",
  materialType: "audio",
  audioSrc: "x.mp3",
  audioVisualEffect: "none",
};
const a1 = materialize([{ props: withAudio }]);
const a2 = materialize(
  [{ props: { ...withAudio, audioVisualEffect: "pulse" } }],
  a1
);
assert.equal(a2[0].audioVisualEffect, "pulse");
assert.notEqual(a2[0], a1[0]);

const sameRef = materialize([{ props: updatedProps }], second);
assert.equal(sameRef[0], second[0]);

const noZ = { ...base, id: "z1" };
delete noZ.zIndex;
const z1 = materialize([{ props: noZ }]);
const z2 = materialize([{ props: { ...noZ } }], z1);
assert.equal(z2[0], z1[0], "zIndex-normalized equal values reuse prev");

console.log("materializePanelElements tests passed");
