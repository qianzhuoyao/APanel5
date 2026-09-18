import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
  cn,
} from "@arronqzy/ui";
import {
  downloadApiCollectionTemplate,
  getApiCollectionTemplateJson,
  type ApiCollectionRecord,
  type ApiCollectionSyncResult,
} from "@arronqzy/blueprint-dsl";
import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";

import {
  getApiCollectionRecords,
  removeApiCollection,
  subscribeApiCollections,
  upsertApiCollectionFromJson,
} from "../library/api-collection-store";

export type ApiCollectionUploadStartInfo = {
  fileNames: string[];
  count: number;
};

export type ApiCollectionUploadSuccessInfo = {
  collections: Array<{
    id: string;
    name: string;
    apiCount: number;
    persistLocal: boolean;
  }>;
};

export type ApiCollectionManagerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadStart?: (info: ApiCollectionUploadStartInfo) => void;
  onUploadSuccess?: (info: ApiCollectionUploadSuccessInfo) => void;
  /** 按 URL 同步当前蓝图里的 Fetch 节点 */
  onSyncCollection?: (
    record: ApiCollectionRecord
  ) => ApiCollectionSyncResult | Promise<ApiCollectionSyncResult>;
};

function formatSyncResultMessage(
  t: (key: string, params?: Record<string, string | number>) => string,
  result: ApiCollectionSyncResult
): string {
  if (result.updatedCount <= 0) {
    return t("blueprint.apiCollection.syncNone");
  }
  const names = result.nodes.map((node) => node.label).join("、");
  return t("blueprint.apiCollection.syncSuccessDetail", {
    count: result.updatedCount,
    names,
  });
}

export function ApiCollectionManagerDialog({
  open,
  onOpenChange,
  onUploadStart,
  onUploadSuccess,
  onSyncCollection,
}: ApiCollectionManagerDialogProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [records, setRecords] = useState<ApiCollectionRecord[]>(() =>
    getApiCollectionRecords()
  );
  const [persistLocalDefault, setPersistLocalDefault] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorJson, setEditorJson] = useState("");
  const [editorPersistLocal, setEditorPersistLocal] = useState(true);
  const [editorError, setEditorError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setRecords([...getApiCollectionRecords()]);
    return subscribeApiCollections(() => setRecords([...getApiCollectionRecords()]));
  }, [open]);

  const sorted = useMemo(
    () => [...records].sort((a, b) => b.updatedAt - a.updatedAt),
    [records]
  );

  const openCreateEditor = () => {
    setEditingId(null);
    setEditorJson(getApiCollectionTemplateJson());
    setEditorPersistLocal(persistLocalDefault);
    setEditorError(null);
    setEditorOpen(true);
  };

  const openEditEditor = (record: ApiCollectionRecord) => {
    setEditingId(record.id);
    setEditorJson(record.rawJson);
    setEditorPersistLocal(record.persistLocal);
    setEditorError(null);
    setEditorOpen(true);
  };

  const handleSaveEditor = async () => {
    setBusy(true);
    setEditorError(null);
    try {
      const result = await upsertApiCollectionFromJson({
        id: editingId ?? undefined,
        rawJson: editorJson,
        persistLocal: editorPersistLocal,
      });
      if (!result.ok) {
        setEditorError(result.error);
        return;
      }
      setEditorOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm(t("blueprint.apiCollection.confirmDelete"));
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      await removeApiCollection(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSync = async (record: ApiCollectionRecord) => {
    if (!onSyncCollection) {
      setError(t("blueprint.apiCollection.syncUnavailable"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await onSyncCollection(record);
      window.alert(formatSyncResultMessage(t, result));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSyncFromEditor = async () => {
    setBusy(true);
    setEditorError(null);
    try {
      const result = await upsertApiCollectionFromJson({
        id: editingId ?? undefined,
        rawJson: editorJson,
        persistLocal: editorPersistLocal,
      });
      if (!result.ok) {
        setEditorError(result.error);
        return;
      }
      setEditingId(result.record.id);
      if (!onSyncCollection) {
        setEditorError(t("blueprint.apiCollection.syncUnavailable"));
        return;
      }
      const syncResult = await onSyncCollection(result.record);
      window.alert(formatSyncResultMessage(t, syncResult));
    } catch (err) {
      setEditorError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setBusy(true);
    setError(null);
    onUploadStart?.({
      fileNames: list.map((file) => file.name),
      count: list.length,
    });

    const uploaded: ApiCollectionUploadSuccessInfo["collections"] = [];
    const errors: string[] = [];

    try {
      for (const file of list) {
        const text = await file.text();
        const result = await upsertApiCollectionFromJson({
          rawJson: text,
          persistLocal: persistLocalDefault,
          fallbackName: file.name,
        });
        if (!result.ok) {
          errors.push(`${file.name}: ${result.error}`);
          continue;
        }
        uploaded.push({
          id: result.record.id,
          name: result.record.name,
          apiCount: result.record.document.apis.length,
          persistLocal: result.record.persistLocal,
        });
      }
      if (uploaded.length > 0) {
        onUploadSuccess?.({ collections: uploaded });
      }
      if (errors.length > 0) {
        setError(errors.join("\n"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] w-[min(96vw,960px)] flex-col sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>{t("blueprint.apiCollection.managerTitle")}</DialogTitle>
            <DialogDescription>
              {t("blueprint.apiCollection.managerDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("blueprint.apiCollection.upload")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={openCreateEditor}
            >
              {t("blueprint.apiCollection.create")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => downloadApiCollectionTemplate()}
            >
              {t("blueprint.apiCollection.downloadTemplate")}
            </Button>
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border border-input"
                checked={persistLocalDefault}
                onChange={(e) => setPersistLocalDefault(e.target.checked)}
              />
              {t("blueprint.apiCollection.persistLocal")}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              multiple
              className="hidden"
              onChange={(e) => void handleFiles(e.target.files)}
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {t("blueprint.apiCollection.persistLocalHint")}
          </p>

          {error ? (
            <pre className="max-h-24 overflow-auto whitespace-pre-wrap rounded border border-destructive/40 bg-destructive/5 p-2 text-[11px] text-destructive">
              {error}
            </pre>
          ) : null}

          <div className="min-h-0 flex-1 space-y-2 overflow-auto py-1">
            {sorted.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                {t("blueprint.apiCollection.empty")}
              </p>
            ) : (
              sorted.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-2 rounded-md border border-border/70 bg-muted/20 px-2.5 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground">
                      {record.name}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10px] text-muted-foreground">
                      <span>
                        {t("blueprint.apiCollection.apiCount", {
                          count: record.document.apis.length,
                        })}
                      </span>
                      <span>
                        {record.persistLocal
                          ? t("blueprint.apiCollection.persisted")
                          : t("blueprint.apiCollection.memoryOnly")}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2 text-[11px]"
                    disabled={busy || !onSyncCollection}
                    title={t("blueprint.apiCollection.syncHint")}
                    onClick={() => void handleSync(record)}
                  >
                    {t("blueprint.apiCollection.sync")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2 text-[11px]"
                    disabled={busy}
                    onClick={() => openEditEditor(record)}
                  >
                    {t("common.edit")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                    disabled={busy}
                    onClick={() => void handleDelete(record.id)}
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="flex max-h-[90vh] w-[min(96vw,1100px)] flex-col sm:max-w-[1100px]">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? t("blueprint.apiCollection.editTitle")
                : t("blueprint.apiCollection.createTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("blueprint.apiCollection.editorDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs">
                {t("blueprint.apiCollection.jsonEditor")}
              </Label>
              <label className="flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border border-input"
                  checked={editorPersistLocal}
                  onChange={(e) => setEditorPersistLocal(e.target.checked)}
                />
                {t("blueprint.apiCollection.persistLocal")}
              </label>
            </div>
            <Textarea
              value={editorJson}
              onChange={(e) => setEditorJson(e.target.value)}
              className={cn(
                "min-h-[min(62vh,640px)] flex-1 font-mono text-[12px] leading-relaxed",
                editorError && "border-destructive"
              )}
              spellCheck={false}
            />
            {editorError ? (
              <p className="text-[11px] text-destructive">{editorError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadApiCollectionTemplate()}
            >
              {t("blueprint.apiCollection.downloadTemplate")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy || !onSyncCollection}
              title={t("blueprint.apiCollection.syncHint")}
              onClick={() => void handleSyncFromEditor()}
            >
              {t("blueprint.apiCollection.sync")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" disabled={busy} onClick={() => void handleSaveEditor()}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
