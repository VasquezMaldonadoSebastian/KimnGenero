export type ApiErrorPayload = {
  error?: string;
  code?: string;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function tryParseJson(res: Response): Promise<unknown | undefined> {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined;
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function apiGetJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, method: "GET" });
  if (res.ok) {
    return (await res.json()) as T;
  }

  const parsed = (await tryParseJson(res)) as ApiErrorPayload | undefined;
  const message =
    parsed?.message ?? parsed?.error ?? `Request failed (${res.status})`;

  throw new ApiError(res.status, message, parsed?.code, parsed?.details);
}

