/**
 * Loggkonvensjon:
 * - `message` er en lesbar setning som kan grupperes (ingen ID-er, spørreparametre eller personopplysninger).
 * - Detaljer legges i egne felt.
 * - Nivå settes etter alvorlighetsgrad: forventede feil (401/403 o.l.) er warn/info, 5xx og nettverksfeil er error.
 */
import type { ZodError } from 'zod';

export type Loggnivå = 'info' | 'warn' | 'error';

const MAKS_RESPONSTEKST = 500;

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const FØDSELSNUMMER = /\b\d{6}\s?\d{5}\b/g;
const EPOST = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g;
const LANGT_TALL = /\b\d{9,}\b/g;

export const fjernPersonopplysninger = (tekst: string) =>
  tekst.replace(FØDSELSNUMMER, '[fnr]').replace(EPOST, '[e-post]');

export const kortResponstekst = (tekst: string | undefined) => {
  if (!tekst) return undefined;
  const vasket = fjernPersonopplysninger(tekst.trim());
  return vasket.length > MAKS_RESPONSTEKST
    ? `${vasket.slice(0, MAKS_RESPONSTEKST)}…`
    : vasket;
};

/** Gjør stien grupperbar ved å erstatte ID-er og lange tall med plassholdere. */
export const normaliserSti = (sti: string) =>
  sti.replace(UUID, ':id').replace(LANGT_TALL, ':nr');

/** Deler en URL eller sti i sti uten spørreparametre og spørreparametre som eget objekt. */
export const delOppUrl = (url: string) => {
  const parsed = new URL(url, 'http://localhost');
  const parametre = Object.fromEntries(parsed.searchParams.entries());
  return {
    sti: parsed.pathname,
    parametre: Object.keys(parametre).length > 0 ? parametre : undefined,
  };
};

export const loggnivåForStatus = (
  status: number,
  utløptØkt = false,
): Loggnivå => {
  if (status === 401 && utløptØkt) return 'info';
  if (status >= 500) return 'error';
  return 'warn';
};

export interface ProxyFeilInput {
  tjeneste: string;
  metode: string;
  url: string;
  status: number;
  statusText?: string;
  responstekst?: string;
  utløptØkt?: boolean;
}

export const lagProxyFeillogg = ({
  tjeneste,
  metode,
  url,
  status,
  statusText,
  responstekst,
  utløptØkt = false,
}: ProxyFeilInput) => {
  const { sti, parametre } = delOppUrl(url);
  const statusbeskrivelse = [status, statusText].filter(Boolean).join(' ');

  return {
    nivå: loggnivåForStatus(status, utløptØkt),
    melding: `Kall til ${tjeneste} feilet med ${statusbeskrivelse} (${metode} ${normaliserSti(sti)})`,
    felt: {
      tjeneste,
      status,
      statusText: statusText || undefined,
      metode,
      sti,
      parametre,
      responstekst: kortResponstekst(responstekst),
      utloptOkt: utløptØkt || undefined,
    },
  };
};

export const lagProxyNettverksfeillogg = ({
  tjeneste,
  metode,
  url,
}: Pick<ProxyFeilInput, 'tjeneste' | 'metode' | 'url'>) => {
  const { sti, parametre } = delOppUrl(url);
  return {
    melding: `Kall til ${tjeneste} feilet uten svar (${metode} ${normaliserSti(sti)})`,
    felt: { tjeneste, metode, sti, parametre },
  };
};

type ZodIssue = ZodError['issues'][number];

export interface ZodFeilFelt {
  sti: string;
  kode: string;
  melding: string;
}

export const formaterZodSti = (sti: PropertyKey[]) => {
  if (sti.length === 0) return '(rot)';
  return sti.reduce<string>((tekst, segment) => {
    if (typeof segment === 'number') return `${tekst}[${segment}]`;
    return tekst ? `${tekst}.${String(segment)}` : String(segment);
  }, '');
};

/** Beskriver typen til verdien på stien uten å ta med selve verdien. */
const beskrivType = (data: unknown, sti: PropertyKey[]) => {
  let peker: unknown = data;
  for (const segment of sti) {
    if (peker === null || typeof peker !== 'object') return 'undefined';
    peker = (peker as Record<PropertyKey, unknown>)[segment];
  }
  if (peker === null) return 'null';
  if (Array.isArray(peker)) return 'array';
  return typeof peker;
};

const beskrivIssue = (issue: ZodIssue, data: unknown) => {
  if (issue.code === 'invalid_type') {
    return `forventet ${issue.expected}, fikk ${beskrivType(data, issue.path)}`;
  }
  return issue.message;
};

export const lagZodFeillogg = (
  url: string,
  error: ZodError,
  data: unknown,
  internUrl = '',
) => {
  const { sti } = delOppUrl(url);
  const kilde = normaliserSti(
    internUrl && sti.startsWith(internUrl) ? sti.slice(internUrl.length) : sti,
  );
  const [første, ...resten] = error.issues;
  const førsteBeskrivelse = første
    ? `${formaterZodSti(første.path)} (${beskrivIssue(første, data)})`
    : 'ukjent feil';
  const flere =
    resten.length > 0
      ? ` og ${resten.length} ${resten.length === 1 ? 'annen feil' : 'andre feil'}`
      : '';

  return {
    melding: `Uventet format på svar fra ${kilde}: ${førsteBeskrivelse}${flere}`,
    felt: {
      kilde,
      antallFeil: error.issues.length,
      zodFeil: error.issues.map<ZodFeilFelt>((issue) => ({
        sti: formaterZodSti(issue.path),
        kode: issue.code,
        melding: beskrivIssue(issue, data),
      })),
    },
  };
};
