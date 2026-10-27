import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@arronqzy/ui";
import {
  TEMPLATE_DOC_BOOKS,
  TEMPLATE_DOC_CHROME,
  closeTemplateDoc,
  docText,
  getTemplateDocRequest,
  openTemplateDoc,
  sectionSearchText,
  splitTemplateDocLinks,
  subscribeTemplateDoc,
  type DocMember,
  type DocSection,
  type TemplateDocRequest,
} from "@arronqzy/blueprint-dsl";

const linkClassName =
  "rv-doc-link inline cursor-pointer border-0 bg-transparent p-0 font-medium underline underline-offset-2";

export function TemplateConceptText({ text }: { text: string }) {
  const pieces = splitTemplateDocLinks(text);
  if (pieces.every((piece) => piece.type === "text")) return <>{text}</>;

  return (
    <>
      {pieces.map((piece, index) =>
        piece.type === "text" ? (
          <span key={index}>{piece.text}</span>
        ) : (
          <button
            key={index}
            type="button"
            className={linkClassName}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openTemplateDoc({
                root: piece.root,
                sectionId: piece.sectionId,
                token: piece.text,
              });
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            {piece.text}
          </button>
        )
      )}
    </>
  );
}

export function linkifyTemplateDocNode(node: ReactNode, path = "0"): ReactNode {
  if (typeof node === "string") {
    return <TemplateConceptText key={path} text={node} />;
  }
  if (typeof node === "number") return node;
  if (Array.isArray(node)) {
    return node.map((child, index) => linkifyTemplateDocNode(child, `${path}.${index}`));
  }
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children != null) {
    return cloneElement(
      node,
      { key: node.key ?? path },
      linkifyTemplateDocNode(node.props.children, `${path}.c`)
    );
  }
  return node;
}

const hostIds: string[] = [];
let hostOwner: string | null = null;
const hostListeners = new Set<() => void>();

function emitHostOwner() {
  hostListeners.forEach((listener) => listener());
}

function retainDocHost(id: string) {
  hostIds.push(id);
  if (!hostOwner) hostOwner = id;
  emitHostOwner();
  return () => {
    const index = hostIds.indexOf(id);
    if (index >= 0) hostIds.splice(index, 1);
    if (hostOwner === id) {
      hostOwner = hostIds[0] ?? null;
      emitHostOwner();
    }
  };
}

function subscribeDocHost(listener: () => void) {
  hostListeners.add(listener);
  return () => hostListeners.delete(listener);
}

function getDocHostOwner() {
  return hostOwner;
}

export function TemplateDocHost() {
  const id = useId();
  useEffect(() => retainDocHost(id), [id]);
  const owner = useSyncExternalStore(subscribeDocHost, getDocHostOwner, getDocHostOwner);
  if (owner !== id) return null;
  return <TemplateDocDialog />;
}

function useTemplateDocRequest() {
  return useSyncExternalStore(subscribeTemplateDoc, getTemplateDocRequest, getTemplateDocRequest);
}

function memberMatches(member: DocMember, query: string) {
  return [member.name, member.summary["zh-CN"], member.summary["en-US"], member.usage ?? ""]
    .join("\n")
    .toLowerCase()
    .includes(query);
}

function visibleMembers(section: DocSection, query: string): DocMember[] {
  const members = section.members ?? [];
  if (!query) return members;
  const matched = members.filter((member) => memberMatches(member, query));
  if (matched.length > 0) return matched;
  const sectionHit = [section.title["zh-CN"], section.title["en-US"], section.body["zh-CN"], section.body["en-US"], ...(section.examples ?? [])]
    .join("\n")
    .toLowerCase()
    .includes(query);
  return sectionHit ? members : [];
}

function scrollDocSection(container: HTMLElement | null, anchorId: string) {
  const target = document.getElementById(anchorId);
  if (!container || !target) return;
  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;
  container.scrollTo({ top: Math.max(0, top) });
}

function TemplateDocDialog() {
  const { locale } = useI18n();
  const request = useTemplateDocRequest();
  const [query, setQuery] = useState("");
  const [openedNonce, setOpenedNonce] = useState<number | null>(null);

  useEffect(() => {
    if (!request || request.nonce === openedNonce) return;
    setQuery("");
    setOpenedNonce(request.nonce);
  }, [openedNonce, request]);

  return (
    <Dialog
      open={request != null}
      onOpenChange={(open) => {
        if (!open) closeTemplateDoc();
      }}
    >
      {request ? (
        <TemplateDocBody
          request={request}
          locale={locale}
          query={query}
          onQuery={setQuery}
        />
      ) : null}
    </Dialog>
  );
}

function TemplateDocBody({
  request,
  locale,
  query,
  onQuery,
}: {
  request: TemplateDocRequest;
  locale: string;
  query: string;
  onQuery: (value: string) => void;
}) {
  const book = TEMPLATE_DOC_BOOKS[request.root];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(request.sectionId);
  const normalized = query.trim().toLowerCase();
  const sections = useMemo(() => {
    return book.sections.filter((section) => {
      if (!normalized) return true;
      const plugin =
        section.id === "time"
          ? `${TEMPLATE_DOC_CHROME.pluginNote["zh-CN"]}\n${TEMPLATE_DOC_CHROME.pluginNote["en-US"]}`.toLowerCase()
          : "";
      return `${sectionSearchText(section)}\n${plugin}`.includes(normalized);
    });
  }, [book.sections, normalized]);

  useEffect(() => {
    setActiveId(request.sectionId);
  }, [request.nonce, request.sectionId]);

  useEffect(() => {
    if (sections.some((section) => section.id === activeId)) return;
    if (sections[0]) setActiveId(sections[0].id);
  }, [activeId, sections]);

  const selectSection = (sectionId: string) => {
    setActiveId(sectionId);
    requestAnimationFrame(() => {
      scrollDocSection(
        scrollerRef.current,
        `template-doc-${request.root}-${sectionId}`
      );
    });
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollDocSection(
        scrollerRef.current,
        `template-doc-${request.root}-${activeId}`
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [activeId, request.nonce, request.root]);

  return (
    <DialogContent className="flex h-[min(720px,82vh)] w-[min(760px,calc(100vw-2rem))] max-w-none flex-col gap-3 overflow-hidden">
      <DialogHeader className="shrink-0 space-y-1 pr-8">
        <DialogTitle>{docText(book.title, locale)}</DialogTitle>
        <DialogDescription>{docText(book.intro, locale)}</DialogDescription>
      </DialogHeader>
      <div className="shrink-0 space-y-2">
        <p className="text-xs text-muted-foreground">
          {docText(TEMPLATE_DOC_CHROME.current, locale)}
          <code className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
            {request.token}
          </code>
        </p>
        <Input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={docText(TEMPLATE_DOC_CHROME.searchPlaceholder, locale)}
          aria-label={docText(TEMPLATE_DOC_CHROME.searchPlaceholder, locale)}
        />
        {sections.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                aria-pressed={section.id === activeId}
                data-no-drag
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  section.id === activeId
                    ? "bg-[#0070cc] text-white dark:bg-[#44aaff] dark:text-[#062033]"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => selectSection(section.id)}
              >
                {docText(section.title, locale)}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div ref={scrollerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">{docText(TEMPLATE_DOC_CHROME.empty, locale)}</p>
        ) : (
          sections.map((section) => (
            <DocSectionBlock
              key={section.id}
              section={section}
              locale={locale}
              query={normalized}
              active={section.id === activeId}
              anchorId={`template-doc-${request.root}-${section.id}`}
            />
          ))
        )}
      </div>
    </DialogContent>
  );
}

function DocSectionBlock({
  section,
  locale,
  query,
  active,
  anchorId,
}: {
  section: DocSection;
  locale: string;
  query: string;
  active: boolean;
  anchorId: string;
}) {
  const members = visibleMembers(section, query);
  return (
    <section
      id={anchorId}
      className={`scroll-mt-2 space-y-2 rounded-md border p-3 ${
        active
          ? "border-[#0070cc] bg-[#0070cc]/10 dark:border-[#44aaff] dark:bg-[#44aaff]/10"
          : "border-border"
      }`}
    >
      <h3 className="text-sm font-medium text-foreground">{docText(section.title, locale)}</h3>
      <p className="text-[13px] leading-6 text-muted-foreground">{docText(section.body, locale)}</p>
      {section.id === "time" ? (
        <p className="text-[12px] leading-5 text-muted-foreground">
          {docText(TEMPLATE_DOC_CHROME.pluginNote, locale)}
        </p>
      ) : null}
      {section.examples && section.examples.length > 0 ? (
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-foreground">
            {docText(TEMPLATE_DOC_CHROME.examples, locale)}
          </div>
          <ul className="space-y-1">
            {section.examples.map((example) => (
              <li key={example}>
                <code className="block overflow-x-auto rounded bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                  {example}
                </code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {members.length > 0 ? (
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-foreground">
            {docText(TEMPLATE_DOC_CHROME.members, locale)}
          </div>
          <ul className="divide-y divide-border rounded-md border border-border">
            {members.map((member) => (
              <li key={member.name} className="space-y-0.5 px-2 py-1.5">
                <div className="font-mono text-[12px] font-medium text-[#0070cc] dark:text-[#44aaff]">
                  {member.name}
                </div>
                <p className="text-[12px] leading-5 text-muted-foreground">
                  {docText(member.summary, locale)}
                </p>
                {member.usage ? (
                  <code className="block overflow-x-auto font-mono text-[11px] text-foreground">
                    {member.usage}
                  </code>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
