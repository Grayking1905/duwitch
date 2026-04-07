const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
  tags?: string[]
  revalidate?: number
}

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, tags, revalidate } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    next: tags || revalidate !== undefined ? { tags, revalidate } : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ code: 'UNKNOWN', message: res.statusText }))
    throw new ApiError(res.status, err.code ?? 'UNKNOWN', err.message ?? 'An error occurred')
  }

  return res.json() as Promise<T>
}

export const api = {
  get:    <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
            request<T>(path, { ...opts, method: 'GET' }),
  post:   <T>(path: string, body: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
            request<T>(path, { ...opts, method: 'POST', body }),
  patch:  <T>(path: string, body: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
            request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
            request<T>(path, { ...opts, method: 'DELETE' }),
}

export { ApiError }
