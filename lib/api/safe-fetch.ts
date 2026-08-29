export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

function describeStatus(status: number, sawHtml: boolean): string {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You are not allowed to perform this action.";
  if (status === 404) {
    return sawHtml
      ? "This feature is not available yet (the API route was not found)."
      : "The requested resource was not found.";
  }
  if (status === 429) return "Too many requests. Please slow down and try again.";
  if (status >= 500) return "The server ran into a problem. Please try again.";
  if (sawHtml) return "The server returned a web page instead of data.";
  return "Unexpected response from the server.";
}

export async function safeFetch<T>(
  input: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  let response: Response;

  try {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    response = await fetch(input, { ...init, headers });
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Network error. Check your connection and try again.",
    };
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    let sawHtml = false;
    try {
      const text = await response.text();
      sawHtml = text.trimStart().startsWith("<");
    } catch {
      sawHtml = false;
    }
    return {
      ok: false,
      status: response.status,
      error: describeStatus(response.status, sawHtml),
    };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return {
      ok: false,
      status: response.status,
      error: "The server sent a malformed response.",
    };
  }

  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  if (!response.ok || record.success === false) {
    const serverError =
      typeof record.error === "string" && record.error.trim().length > 0
        ? record.error
        : describeStatus(response.status, false);
    return { ok: false, status: response.status, error: serverError };
  }

  return { ok: true, status: response.status, data: payload as T };
}