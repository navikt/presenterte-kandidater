import {
  kortResponstekst,
  lagProxyFeillogg,
  lagProxyNettverksfeillogg,
  lagZodFeillogg,
  loggnivåForStatus,
} from '../app/util/loggformat';
import { expect, test } from '@playwright/test';
import { z } from 'zod';

const INTERN_URL = '/api/presenterte-kandidater-api';

test.describe('Loggformat for proxy', () => {
  test('lager lesbar melding uten spørreparametre', () => {
    const { nivå, melding, felt } = lagProxyFeillogg({
      tjeneste: 'presenterte-kandidater-api',
      metode: 'GET',
      url: '/kandidatlister?virksomhetsnummer=811076902',
      status: 403,
      statusText: 'Forbidden',
      responstekst: '{"message":"Ingen tilgang"}',
    });

    expect(melding).toBe(
      'Kall til presenterte-kandidater-api feilet med 403 Forbidden (GET /kandidatlister)',
    );
    expect(melding).not.toContain('811076902');
    expect(nivå).toBe('warn');
    expect(felt).toEqual({
      tjeneste: 'presenterte-kandidater-api',
      status: 403,
      statusText: 'Forbidden',
      metode: 'GET',
      sti: '/kandidatlister',
      parametre: { virksomhetsnummer: '811076902' },
      responstekst: '{"message":"Ingen tilgang"}',
      utloptOkt: undefined,
    });
  });

  test('erstatter ID-er i meldingen, men beholder dem i feltet', () => {
    const { melding, felt } = lagProxyFeillogg({
      tjeneste: 'presenterte-kandidater-api',
      metode: 'GET',
      url: '/kandidatliste/720696c9-0077-464f-b0dc-c12b95db32d4',
      status: 500,
    });
    expect(melding).toBe(
      'Kall til presenterte-kandidater-api feilet med 500 (GET /kandidatliste/:id)',
    );
    expect(felt.sti).toBe(
      '/kandidatliste/720696c9-0077-464f-b0dc-c12b95db32d4',
    );
  });

  test('setter nivå etter alvorlighetsgrad', () => {
    expect(loggnivåForStatus(401)).toBe('warn');
    expect(loggnivåForStatus(401, true)).toBe('info');
    expect(loggnivåForStatus(403)).toBe('warn');
    expect(loggnivåForStatus(404)).toBe('warn');
    expect(loggnivåForStatus(500)).toBe('error');
    expect(loggnivåForStatus(503)).toBe('error');
  });

  test('korter ned responsteksten og fjerner personopplysninger', () => {
    expect(
      kortResponstekst('Fant ikke 12345678901 eller ola@nav.no i 010190 12345'),
    ).toBe('Fant ikke [fnr] eller [e-post] i [fnr]');

    const lang = kortResponstekst('x'.repeat(1000));
    expect(lang).toHaveLength(501);
    expect(lang?.endsWith('…')).toBe(true);
    expect(kortResponstekst('')).toBeUndefined();
  });

  test('lager lesbar melding for nettverksfeil', () => {
    const { melding, felt } = lagProxyNettverksfeillogg({
      tjeneste: 'presenterte-kandidater-api',
      metode: 'GET',
      url: '/kandidatlister?virksomhetsnummer=811076902',
    });
    expect(melding).toBe(
      'Kall til presenterte-kandidater-api feilet uten svar (GET /kandidatlister)',
    );
    expect(felt.parametre).toEqual({ virksomhetsnummer: '811076902' });
  });
});

test.describe('Loggformat for Zod-feil', () => {
  const schema = z.object({
    kandidatliste: z.object({ tittel: z.string() }),
    kandidater: z.array(z.object({ navn: z.string() })),
  });

  test('beskriver første feil og antall andre i meldingen', () => {
    const data = { status: 403, message: 'Forbidden' };
    const resultat = schema.safeParse(data);
    expect(resultat.success).toBe(false);

    const { melding, felt } = lagZodFeillogg(
      `${INTERN_URL}/kandidatliste/720696c9-0077-464f-b0dc-c12b95db32d4`,
      resultat.error!,
      data,
      INTERN_URL,
    );

    expect(melding).toBe(
      'Uventet format på svar fra /kandidatliste/:id: kandidatliste (forventet object, fikk undefined) og 1 annen feil',
    );
    expect(felt.zodFeil).toEqual([
      {
        sti: 'kandidatliste',
        kode: 'invalid_type',
        melding: 'forventet object, fikk undefined',
      },
      {
        sti: 'kandidater',
        kode: 'invalid_type',
        melding: 'forventet array, fikk undefined',
      },
    ]);
    expect(felt.antallFeil).toBe(2);
  });

  test('tar ikke med verdier eller spørreparametre i meldingen', () => {
    const listeschema = z.array(z.object({ navn: z.string() }));
    const data = { hemmelig: '12345678901' };
    const resultat = listeschema.safeParse(data);

    const { melding, felt } = lagZodFeillogg(
      `${INTERN_URL}/kandidatlister?virksomhetsnummer=811076902`,
      resultat.error!,
      data,
      INTERN_URL,
    );

    expect(melding).toBe(
      'Uventet format på svar fra /kandidatlister: (rot) (forventet array, fikk object)',
    );
    expect(JSON.stringify(felt)).not.toContain('12345678901');
    expect(JSON.stringify(felt)).not.toContain('811076902');
  });

  test('formaterer stier med indekser', () => {
    const data = { kandidatliste: { tittel: 'x' }, kandidater: [{ navn: 1 }] };
    const resultat = schema.safeParse(data);
    const { felt } = lagZodFeillogg(
      '/kandidatliste',
      resultat.error!,
      data,
      INTERN_URL,
    );
    expect(felt.zodFeil[0].sti).toBe('kandidater[0].navn');
    expect(felt.zodFeil[0].melding).toBe('forventet string, fikk number');
  });
});
