import { request as undiciRequest } from "undici";

export type JsonResponse<T> = {
  status: number;
  ok: boolean;
  data: T;
};

export type RequestOptions = {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs: number;
};

const toBody = (body: unknown) => {
  if (body === undefined) {
    return undefined;
  }
  if (typeof body === "string" || body instanceof Uint8Array) {
    return body;
  }
  return JSON.stringify(body);
};

export const jsonRequest = async <T>(options: RequestOptions): Promise<JsonResponse<T>> => {
  const { url, method = "GET", timeoutMs } = options;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json",
    ...options.headers,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await undiciRequest(url, {
      method,
      headers,
      body: toBody(options.body),
      signal: controller.signal,
    });
    const data = (await response.body.json()) as T;
    return { status: response.statusCode, ok: response.statusCode < 400, data };
  } finally {
    clearTimeout(timeout);
  }
};

