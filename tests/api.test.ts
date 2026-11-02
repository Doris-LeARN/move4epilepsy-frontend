import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadApi() {
  vi.resetModules();
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/api/v1');
  return import('../src/services/api');
}

describe('apiRequest', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('uses the configured base URL, JSON headers, and cookie credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { apiRequest } = await loadApi();

    await expect(apiRequest('/auth/me/profile')).resolves.toEqual({ success: true });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/v1/auth/me/profile',
      expect.objectContaining({
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('preserves request options and merges custom headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ created: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { apiRequest } = await loadApi();
    const options: RequestInit = {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' },
      body: JSON.stringify({ value: 1 }),
    };

    await expect(apiRequest('/opinions', options)).resolves.toEqual({ created: true });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/v1/opinions',
      expect.objectContaining({
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      }),
    );
  });

  it.each([
    { status: 204, contentType: 'application/json' },
    { status: 200, contentType: 'text/plain' },
  ])('returns undefined for empty or non-JSON responses', async ({ status, contentType }) => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status, headers: { 'Content-Type': contentType } }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { apiRequest } = await loadApi();

    await expect(apiRequest('/logout')).resolves.toBeUndefined();
  });

  it.each([
    { body: { detail: 'Détail API' }, expectedMessage: 'Détail API' },
    { body: { message: 'Message API' }, expectedMessage: 'Message API' },
    { body: { error: 'Erreur API' }, expectedMessage: 'Erreur API' },
    { body: {}, expectedMessage: 'Erreur API (503)' },
  ])('reports API errors using the available message', async ({ body, expectedMessage }) => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { apiRequest } = await loadApi();

    await expect(apiRequest('/patients')).rejects.toThrow(expectedMessage);
  });
});
