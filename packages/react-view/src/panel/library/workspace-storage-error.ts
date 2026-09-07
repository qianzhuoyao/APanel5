/**
 * Map IndexedDB / clone failures to localized workspace messages.
 * Used by create / sync / open / delete so device-specific DOMExceptions
 * show actionable copy instead of opaque browser English.
 */
export function mapWorkspaceStorageError(
  error: unknown,
  t: (key: string) => string
): Error {
  const raw = error instanceof Error ? error : new Error(String(error));
  const name =
    (error as { name?: string } | null)?.name ||
    (raw as { name?: string }).name ||
    "";
  const message = raw.message || "";

  if (
    name === "IndexedDbUnavailable" ||
    name === "SecurityError" ||
    message.includes("indexeddb-unavailable") ||
    /indexedDB is not available|Access is denied|The operation is insecure/i.test(
      message
    )
  ) {
    return new Error(t("panel.messages.workspaceStorageUnavailable"));
  }

  if (
    name === "TimeoutError" ||
    message.includes("indexeddb-open-timeout")
  ) {
    return new Error(t("panel.messages.workspaceStorageTimeout"));
  }

  if (
    name === "QuotaExceededError" ||
    /QuotaExceeded|quota|storage.*full|exceeded the quota/i.test(message)
  ) {
    return new Error(t("panel.messages.workspaceStorageQuotaExceeded"));
  }

  if (
    name === "DataCloneError" ||
    message.includes("indexeddb-serialize-failed") ||
    /could not be cloned|DataCloneError|circular/i.test(message)
  ) {
    return new Error(t("panel.messages.workspaceStorageSerializeFailed"));
  }

  if (
    message.includes("indexeddb-open-failed") ||
    message.includes("indexeddb-transaction-failed") ||
    message.includes("indexeddb-request-failed") ||
    message.includes("indexeddb-transaction-aborted")
  ) {
    return new Error(t("panel.messages.workspaceStorageFailed"));
  }

  return raw;
}
