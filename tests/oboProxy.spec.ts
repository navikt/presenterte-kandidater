import { PresenterteKandidaterAPI } from '../app/api/api-routes';
import { proxyWithOBO } from '../app/api/oboProxy';
import { expect, test } from '@playwright/test';

const lagBackendrespons = (body: BodyInit | null, init: ResponseInit) => {
  const opprinneligFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(body, init);
  return () => {
    globalThis.fetch = opprinneligFetch;
  };
};

const kallProxy = () =>
  proxyWithOBO(
    PresenterteKandidaterAPI,
    new Request(
      `http://localhost${PresenterteKandidaterAPI.internUrl}/kandidatlister?virksomhetsnummer=811076902`,
    ),
  );

test.describe('OBO-proxy sender med statuskoden fra backend', () => {
  test('403 med JSON-body gir 403', async () => {
    const tilbakestill = lagBackendrespons(
      JSON.stringify({ message: 'Ingen tilgang' }),
      {
        status: 403,
        statusText: 'Forbidden',
        headers: { 'Content-Type': 'application/json' },
      },
    );
    try {
      const respons = await kallProxy();
      expect(respons.status).toBe(403);
      expect(await respons.json()).toEqual({ message: 'Ingen tilgang' });
    } finally {
      tilbakestill();
    }
  });

  test('500 uten body gir 500', async () => {
    const tilbakestill = lagBackendrespons(null, { status: 500 });
    try {
      const respons = await kallProxy();
      expect(respons.status).toBe(500);
    } finally {
      tilbakestill();
    }
  });

  test('401 med tekst gir 401', async () => {
    const tilbakestill = lagBackendrespons('Unauthorized', { status: 401 });
    try {
      const respons = await kallProxy();
      expect(respons.status).toBe(401);
    } finally {
      tilbakestill();
    }
  });

  test('204 gir 204 uten body', async () => {
    const tilbakestill = lagBackendrespons(null, { status: 204 });
    try {
      const respons = await kallProxy();
      expect(respons.status).toBe(204);
      expect(await respons.text()).toBe('');
    } finally {
      tilbakestill();
    }
  });

  test('200 med JSON gir 200 og samme data', async () => {
    const tilbakestill = lagBackendrespons(JSON.stringify([{ a: 1 }]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    try {
      const respons = await kallProxy();
      expect(respons.status).toBe(200);
      expect(await respons.json()).toEqual([{ a: 1 }]);
    } finally {
      tilbakestill();
    }
  });
});
