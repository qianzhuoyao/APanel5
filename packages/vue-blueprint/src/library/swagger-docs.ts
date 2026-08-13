import {
  parseSwaggerDocument,
  type ParsedSwaggerDocument,
} from "@arronqzy/blueprint-dsl";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";

function t() {
  return tForLocale(resolveLocale());
}

export async function loadSwaggerDocument(
  docsUrl: string,
  signal?: AbortSignal
): Promise<ParsedSwaggerDocument> {
  const translate = t();
  const trimmed = docsUrl.trim();
  if (!trimmed) {
    throw new Error(translate("blueprint.config.enterSwaggerUrl"));
  }

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  let response: Response;
  try {
    response = await fetch(trimmed, {
      method: "GET",
      credentials: "same-origin",
      signal,
    });
  } catch (error) {
    if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      throw new DOMException("Aborted", "AbortError");
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : translate("blueprint.config.cannotFetchSwagger")
    );
  }

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  if (!response.ok) {
    throw new Error(
      translate("blueprint.config.swaggerHttpFailed", { status: response.status })
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    throw new Error(translate("blueprint.config.swaggerHtmlReturned"));
  }

  let spec: unknown;
  try {
    spec = await response.json();
  } catch {
    throw new Error(translate("blueprint.config.swaggerInvalidJson"));
  }

  return parseSwaggerDocument(spec, trimmed);
}
