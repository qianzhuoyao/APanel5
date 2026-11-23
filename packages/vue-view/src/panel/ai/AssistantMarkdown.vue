<script setup lang="ts">
import { computed } from "vue";

type Segment =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "link"; label: string; href: string };

type Block =
  | { type: "p"; text: string }
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "pre"; code: string }
  | { type: "quote"; text: string };

const props = withDefaults(
  defineProps<{
    content: string;
    className?: string;
  }>(),
  { className: "" }
);

function parseInline(text: string): Segment[] {
  const segments: Segment[] = [];
  const re =
    /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      segments.push({ type: "text", value: text.slice(last, match.index) });
    }
    const token = match[0]!;
    if (token.startsWith("`")) {
      segments.push({ type: "code", value: token.slice(1, -1) });
    } else if (token.startsWith("**") || token.startsWith("__")) {
      segments.push({ type: "bold", value: token.slice(2, -2) });
    } else if (token.startsWith("*") || token.startsWith("_")) {
      segments.push({ type: "italic", value: token.slice(1, -1) });
    } else if (token.startsWith("[")) {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) segments.push({ type: "link", label: m[1]!, href: m[2]! });
      else segments.push({ type: "text", value: token });
    }
    last = match.index + token.length;
  }
  if (last < text.length) {
    segments.push({ type: "text", value: text.slice(last) });
  }
  return segments.length ? segments : [{ type: "text", value: text }];
}

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (/^```/.test(line)) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i] ?? "")) {
        code.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      blocks.push({ type: "pre", code: code.join("\n") });
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({
        type: "h",
        level: heading[1]!.length as 1 | 2 | 3,
        text: heading[2]!.trim(),
      });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i] ?? "")) {
        parts.push((lines[i] ?? "").replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: parts.join("\n") });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const parts: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() &&
      !/^(#{1,3}\s+|```|\s*[-*]\s+|\s*\d+\.\s+|>\s?)/.test(lines[i] ?? "")
    ) {
      parts.push(lines[i] ?? "");
      i += 1;
    }
    blocks.push({ type: "p", text: parts.join("\n") });
  }

  return blocks;
}

const headingClass: Record<1 | 2 | 3, string> = {
  1: "mb-1.5 text-[16px] font-semibold tracking-tight text-foreground",
  2: "mb-1 text-[15px] font-semibold tracking-tight text-foreground",
  3: "mb-1 text-[14px] font-semibold text-foreground",
};

const blocks = computed(() => parseBlocks(props.content.trim()));
const hasContent = computed(() => Boolean(props.content.trim()));
</script>

<template>
  <div
    v-if="hasContent"
    class="assistant-md space-y-2 text-[14px] leading-6 text-foreground"
    :class="className"
  >
    <template v-for="(block, idx) in blocks" :key="idx">
      <component
        v-if="block.type === 'h'"
        :is="`h${block.level}`"
        :class="headingClass[block.level]"
      >
        <template
          v-for="(seg, i) in parseInline(block.text)"
          :key="i"
        >
          <code
            v-if="seg.type === 'code'"
            class="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
          >{{ seg.value }}</code>
          <strong v-else-if="seg.type === 'bold'" class="font-semibold">{{ seg.value }}</strong>
          <em v-else-if="seg.type === 'italic'" class="italic">{{ seg.value }}</em>
          <a
            v-else-if="seg.type === 'link'"
            :href="seg.href"
            target="_blank"
            rel="noreferrer noopener"
            class="text-primary underline underline-offset-2"
            data-no-drag
          >{{ seg.label }}</a>
          <template v-else>{{ seg.value }}</template>
        </template>
      </component>

      <pre
        v-else-if="block.type === 'pre'"
        class="overflow-x-auto rounded-lg border border-border bg-muted/60 p-3 font-mono text-[12px] leading-5 text-foreground"
      ><code>{{ block.code }}</code></pre>

      <ul v-else-if="block.type === 'ul'" class="list-disc space-y-1 pl-5">
        <li v-for="(item, j) in block.items" :key="j">
          <template v-for="(seg, i) in parseInline(item)" :key="i">
            <code
              v-if="seg.type === 'code'"
              class="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
            >{{ seg.value }}</code>
            <strong v-else-if="seg.type === 'bold'" class="font-semibold">{{ seg.value }}</strong>
            <em v-else-if="seg.type === 'italic'" class="italic">{{ seg.value }}</em>
            <a
              v-else-if="seg.type === 'link'"
              :href="seg.href"
              target="_blank"
              rel="noreferrer noopener"
              class="text-primary underline underline-offset-2"
              data-no-drag
            >{{ seg.label }}</a>
            <template v-else>{{ seg.value }}</template>
          </template>
        </li>
      </ul>

      <ol v-else-if="block.type === 'ol'" class="list-decimal space-y-1 pl-5">
        <li v-for="(item, j) in block.items" :key="j">
          <template v-for="(seg, i) in parseInline(item)" :key="i">
            <code
              v-if="seg.type === 'code'"
              class="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
            >{{ seg.value }}</code>
            <strong v-else-if="seg.type === 'bold'" class="font-semibold">{{ seg.value }}</strong>
            <em v-else-if="seg.type === 'italic'" class="italic">{{ seg.value }}</em>
            <a
              v-else-if="seg.type === 'link'"
              :href="seg.href"
              target="_blank"
              rel="noreferrer noopener"
              class="text-primary underline underline-offset-2"
              data-no-drag
            >{{ seg.label }}</a>
            <template v-else>{{ seg.value }}</template>
          </template>
        </li>
      </ol>

      <blockquote
        v-else-if="block.type === 'quote'"
        class="border-l-2 border-border pl-3 text-muted-foreground"
      >
        <template v-for="(seg, i) in parseInline(block.text)" :key="i">
          <code
            v-if="seg.type === 'code'"
            class="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
          >{{ seg.value }}</code>
          <strong v-else-if="seg.type === 'bold'" class="font-semibold">{{ seg.value }}</strong>
          <em v-else-if="seg.type === 'italic'" class="italic">{{ seg.value }}</em>
          <a
            v-else-if="seg.type === 'link'"
            :href="seg.href"
            target="_blank"
            rel="noreferrer noopener"
            class="text-primary underline underline-offset-2"
            data-no-drag
          >{{ seg.label }}</a>
          <template v-else>{{ seg.value }}</template>
        </template>
      </blockquote>

      <p v-else class="whitespace-pre-wrap">
        <template v-for="(seg, i) in parseInline(block.text)" :key="i">
          <code
            v-if="seg.type === 'code'"
            class="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
          >{{ seg.value }}</code>
          <strong v-else-if="seg.type === 'bold'" class="font-semibold">{{ seg.value }}</strong>
          <em v-else-if="seg.type === 'italic'" class="italic">{{ seg.value }}</em>
          <a
            v-else-if="seg.type === 'link'"
            :href="seg.href"
            target="_blank"
            rel="noreferrer noopener"
            class="text-primary underline underline-offset-2"
            data-no-drag
          >{{ seg.label }}</a>
          <template v-else>{{ seg.value }}</template>
        </template>
      </p>
    </template>
  </div>
</template>