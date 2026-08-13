import React, { useMemo } from "react";

type Segment =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "link"; label: string; href: string };

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

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((seg, i) => {
        if (seg.type === "code") {
          return (
            <code
              key={i}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
            >
              {seg.value}
            </code>
          );
        }
        if (seg.type === "bold") {
          return (
            <strong key={i} className="font-semibold">
              {seg.value}
            </strong>
          );
        }
        if (seg.type === "italic") {
          return (
            <em key={i} className="italic">
              {seg.value}
            </em>
          );
        }
        if (seg.type === "link") {
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline underline-offset-2"
              data-no-drag
            >
              {seg.label}
            </a>
          );
        }
        return <React.Fragment key={i}>{seg.value}</React.Fragment>;
      })}
    </>
  );
}

type Block =
  | { type: "p"; text: string }
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "pre"; code: string }
  | { type: "quote"; text: string };

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

export function AssistantMarkdown({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const blocks = useMemo(() => parseBlocks(content.trim()), [content]);

  if (!content.trim()) return null;

  return (
    <div className={`assistant-md space-y-2 text-[14px] leading-6 text-foreground ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "h") {
          const Tag = (`h${block.level}` as "h1" | "h2" | "h3");
          return (
            <Tag key={idx} className={headingClass[block.level]}>
              <Inline text={block.text} />
            </Tag>
          );
        }
        if (block.type === "pre") {
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-3 font-mono text-[12px] leading-5 text-foreground"
            >
              <code>{block.code}</code>
            </pre>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={idx} className="list-disc space-y-1 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={idx} className="list-decimal space-y-1 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-border pl-3 text-muted-foreground"
            >
              <Inline text={block.text} />
            </blockquote>
          );
        }
        return (
          <p key={idx} className="whitespace-pre-wrap">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
