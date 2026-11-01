import type { ApiErrorBody } from "../types/api";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: Array<{ path: string; message: string }>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error.message);
    this.status = status;
    this.code = body.error.code;
    this.details = body.error.details;
    this.name = "ApiError";
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const token = localStorage.getItem("kanbot_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, {
      error: {
        code: "INTERNAL_ERROR",
        message: "Cannot reach the server. Is it running?",
      },
    });
  }

  if (response.status === 401 && !path.includes("/auth/login")) {
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data as ApiErrorBody);
  }

  return data as T;
}

export function fieldErrors(err: unknown): Record<string, string> {
  if (err instanceof ApiError && err.details) {
    const map: Record<string, string> = {};
    for (const d of err.details) {
      map[d.path] = d.message;
    }
    return map;
  }
  return {};
}
