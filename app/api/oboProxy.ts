import {
  lagProxyFeillogg,
  lagProxyNettverksfeillogg,
} from '../util/loggformat';
import { erLokalt } from '../util/miljø';
import { Iroute } from './api-routes';
import { logger } from '@navikt/next-logger';
import {
  expiresIn,
  getToken,
  requestOboToken,
  TokenResult,
} from '@navikt/oasis';
import { NextResponse } from 'next/server';

const NULL_BODY_STATUSER = [204, 205, 304];

const erUtløpt = (token: string) => {
  if (token === 'DEV') return false;
  try {
    return expiresIn(token) <= 0;
  } catch {
    return false;
  }
};

const isAbortLikeError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const abortError = error as { name?: unknown; message?: unknown };
  return abortError.name === 'AbortError' || abortError.message === 'aborted';
};

export const proxyWithOBO = async (
  proxy: Iroute,
  req: Request,
  customRoute?: string,
) => {
  const lokalt = erLokalt();
  const token = lokalt ? 'DEV' : getToken(req.headers);

  if (!proxy.api_url && !lokalt) {
    return NextResponse.json(
      { beskrivelse: 'Ingen url oppgitt for proxy' },
      { status: 500 },
    );
  }

  if (!token) {
    logger.info('Kunne ikke hente token, redirect til login');
    return NextResponse.json(
      { beskrivelse: 'Kunne ikke hente token' },
      { status: 401 },
    );
  }

  let obo: TokenResult;
  try {
    obo = lokalt
      ? ({ ok: true, token: 'DEV' } as TokenResult)
      : await requestOboToken(token, proxy.scope);
  } catch (error) {
    logger.error({ err: error }, 'Henting av OBO-token feilet med unntak');
    return NextResponse.json(
      { beskrivelse: 'Kunne ikke hente OBO-token' },
      { status: 500 },
    );
  }

  if (!obo.ok || !obo.token) {
    if (erUtløpt(token)) {
      logger.info('Kunne ikke hente OBO-token fordi økten er utløpt');
      return NextResponse.json(
        { beskrivelse: 'Økten er utløpt' },
        { status: 401 },
      );
    }
    logger.error(
      { err: obo.ok ? undefined : obo.error },
      'Kunne ikke hente OBO-token',
    );
    return NextResponse.json(
      { beskrivelse: 'Ugyldig OBO-token mottatt' },
      { status: 500 },
    );
  }

  const originalUrl = new URL(req.url);
  const path =
    proxy.api_route + originalUrl.pathname.replace(proxy.internUrl, '');
  const newUrl = customRoute
    ? proxy.api_url + customRoute
    : `${proxy.api_url}${path}${originalUrl.search}`;

  const requestUrl = lokalt
    ? `http://mock-api${path}${originalUrl.search}`
    : newUrl;

  const tjeneste = proxy.internUrl.split('/').pop() || 'backend';
  const loggUrl = customRoute ?? `${path}${originalUrl.search}`;

  try {
    const originalHeaders = new Headers(req.headers);
    originalHeaders.set('Authorization', `Bearer ${obo.token}`);
    originalHeaders.set('Content-Type', 'application/json');

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: originalHeaders,
    };

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await new Response(req.body).json();
      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(requestUrl, fetchOptions);
    const { status } = response;
    const contentType = response.headers.get('Content-Type');
    const responseText = await response.text();

    if (!response.ok) {
      const { nivå, melding, felt } = lagProxyFeillogg({
        tjeneste,
        metode: req.method,
        url: loggUrl,
        status,
        statusText: response.statusText,
        responstekst: responseText,
        utløptØkt: status === 401 && erUtløpt(token),
      });
      logger[nivå](felt, melding);
    }

    if (NULL_BODY_STATUSER.includes(status)) {
      return new NextResponse(null, { status });
    }

    // workaround da backend av og til returnerer application/json selv om det ikke er respons.
    if (
      contentType &&
      contentType.includes('application/json') &&
      responseText
    ) {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status });
    } else if (!responseText) {
      return NextResponse.json({ status, message: 'No content' }, { status });
    }

    return NextResponse.json(
      { status, message: 'Non-JSON content received' },
      { status },
    );
  } catch (error: unknown) {
    const { melding, felt } = lagProxyNettverksfeillogg({
      tjeneste,
      metode: req.method,
      url: loggUrl,
    });

    if (isAbortLikeError(error)) {
      logger.info({ ...felt, err: error }, melding);
    } else {
      logger.error({ ...felt, err: error }, melding);
    }

    return NextResponse.json(
      { beskrivelse: error instanceof Error ? error.message : 'Feil i proxy' },
      {
        status: 500,
      },
    );
  }
};
