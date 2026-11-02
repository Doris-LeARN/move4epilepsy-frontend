const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002/api/v1';

function getErrorMessage(body: unknown, status: number): string {
  if (typeof body === 'object' && body !== null) {
    if ('detail' in body) {
      if (typeof body.detail === 'string') return body.detail;
      if (Array.isArray(body.detail)) {
        const messages = body.detail
          .map((issue: unknown) => (
            typeof issue === 'object' && issue !== null && 'msg' in issue && typeof issue.msg === 'string'
              ? issue.msg
              : null
          ))
          .filter((message): message is string => message !== null);
        if (messages.length) return messages.join(' ');
      }
    }
    if ('message' in body && typeof body.message === 'string') return body.message;
    if ('error' in body && typeof body.error === 'string') return body.error;
  }
  return `Erreur API (${status})`;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new Error(getErrorMessage(body, response.status));
  }

  if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
