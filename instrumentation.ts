const globalForMsw = globalThis as unknown as {
  __mswListening?: boolean;
  __mswPatched?: boolean;
  __mswServer?: {
    close: () => void;
    listen: (o?: Record<string, unknown>) => void;
  };
};

function reInitMSW() {
  const server = globalForMsw.__mswServer;
  if (!server) return;
  try {
    server.close();
  } catch {}
  server.listen({ onUnhandledRequest: 'bypass' });
  console.warn('MSW interceptor re-etablert');
}

function patchFetchMedMockRetry() {
  if (globalForMsw.__mswPatched) return;
  globalForMsw.__mswPatched = true;

  const origFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async function mswSafeFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const erMock = url.includes('mock-api');

    if (!erMock) return origFetch(input, init);

    try {
      return await origFetch(input, init);
    } catch (førsteError) {
      console.warn('MSW fetch feilet, re-etablerer interceptor:', url);
      reInitMSW();
      await new Promise((r) => setTimeout(r, 50));
      try {
        return await origFetch(input, init);
      } catch {
        await new Promise((r) => setTimeout(r, 200));
        return await origFetch(input, init);
      }
    }
  } as typeof fetch;
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (globalForMsw.__mswListening) return;

  const testMode = process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE === 'true';
  const isDev = process.env.NODE_ENV === 'development';

  if (testMode || isDev) {
    const { server } = await import('./mocks/server');
    globalForMsw.__mswServer = server;
    server.listen({ onUnhandledRequest: 'bypass' });
    globalForMsw.__mswListening = true;
    patchFetchMedMockRetry();
    console.log('MSW node-server startet');
  }
}
