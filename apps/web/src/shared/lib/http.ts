import { env } from "@innovate-test/env/web";

const baseUrl = env.VITE_SERVER_URL.replace(/\/$/, "");

const parseError = async (res: Response) => {
  let message = res.statusText;
  try {
    const body = (await res.json()) as { error?: string; message?: string };
    if (body.error) message = body.error;
    else if (body.message) message = body.message;
  } catch {
    /* ignore */
  }
  return new Error(message);
};

export const http = {
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json", ...init?.headers },
    });
    if (!res.ok) throw await parseError(res);
    return res.json() as Promise<T>;
  },
  async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseError(res);
    return res.json() as Promise<T>;
  },
  async patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw await parseError(res);
    return res.json() as Promise<T>;
  },
  async put<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseError(res);
    return res.json() as Promise<T>;
  },
  async del<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json", ...init?.headers },
    });
    if (!res.ok) throw await parseError(res);
    return res.json() as Promise<T>;
  },
};
