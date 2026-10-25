const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'omit',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string; message?: string; error?: string } | null;
    const message = body?.detail || body?.message || body?.error || `Erreur API (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
