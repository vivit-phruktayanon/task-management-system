const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

type HttpOptions = RequestInit & {
  json?: any
}

async function request<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Accept": "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(headers || {})
    },
    body: json ? JSON.stringify(json) : rest.body,
    cache: "no-store"
  })

  // พยายาม parse เสมอ
  let data: any = null
  try {
    data = await res.json()
  } catch {}

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`
    throw new Error(message)
  }

  return data as T
}

export const http = {
  get:  <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, json?: any) => request<T>(path, { method: "POST", json }),
  put:  <T>(path: string, json?: any) => request<T>(path, { method: "PUT",  json }),
  del:  <T>(path: string) => request<T>(path, { method: "DELETE" })
}