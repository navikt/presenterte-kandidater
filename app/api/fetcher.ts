import { kastError } from '../util/kastError';
import { lagZodFeillogg } from '../util/loggformat';
import { getBasePath } from '../util/miljø';
import { PresenterteKandidaterAPI } from './api-routes';
import { rapporterApiFeil } from '@/app/util/apm';
import { logger } from '@navikt/next-logger';
import { ZodError, ZodSchema } from 'zod';

const loggZodFeil = (url: string, error: ZodError, data: unknown) => {
  const { melding, felt } = lagZodFeillogg(
    url,
    error,
    data,
    PresenterteKandidaterAPI.internUrl,
  );
  logger.error(felt, melding);
};

/** 4xx-feil som 401 og 403 blir ikke bedre av å prøve igjen. */
export const skalPrøvePåNytt = (error: unknown) =>
  !(
    error instanceof kastError &&
    error.statuskode >= 400 &&
    error.statuskode < 500
  );

const lesJsonHvisFinnes = async (response: Response) => {
  const tekst = await response.text();
  return tekst ? JSON.parse(tekst) : undefined;
};

export const getAPIwithSchema = <T>(
  schema: ZodSchema<T>,
): ((url: string) => Promise<T>) => {
  return async (url: string) => {
    const data = await getAPI(url);

    const zodResult = schema.safeParse(data);

    if (zodResult.error) {
      loggZodFeil(url, zodResult.error, data);
    }
    return data;
  };
};

const getAPI = async (url: string) => {
  const response = await fetch(getBasePath() + url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    rapporterApiFeil(response.status, response.url);
    let errorDetails = '';
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Hent JSON
      const errorData = await response.json();
      errorDetails = JSON.stringify(errorData);
    } else {
      // Håndtere ikke JSON
      errorDetails = await response.text();
    }

    const error = new kastError({
      url: response.url,
      statuskode: response.status,
      stack: errorDetails,
    });
    throw error;
  }

  return lesJsonHvisFinnes(response);
};

export const deleteApi = async (url: string) => {
  const response = await fetch(getBasePath() + url, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (response.ok) {
    return lesJsonHvisFinnes(response);
  }
  rapporterApiFeil(response.status, response.url);
  if (response.status === 404) {
    throw new Error('404');
  } else if (response.status === 403) {
    throw new Error('403');
  } else {
    throw new Error(
      `Feil respons fra server (http-status: ${response.status})`,
    );
  }
};

export const postApi = async (
  url: string,
  body: unknown,
  queryParams?: URLSearchParams,
) => {
  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }

  const response = await fetch(getBasePath() + url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body, (_key, value) =>
      value instanceof Set ? [...value] : value,
    ),
  });

  if (response.ok) {
    return lesJsonHvisFinnes(response);
  }
  rapporterApiFeil(response.status, response.url);
  if (response.status === 404) {
    throw new Error('404');
  } else if (response.status === 403) {
    throw new Error('403');
  } else {
    throw new Error(
      `Feil respons fra server (http-status: ${response.status})`,
    );
  }
};

export type postApiProps = {
  url: string;
  body?: unknown;
  queryParams?: string;
};

export const postApiWithSchema = <T>(
  schema: ZodSchema<T>,
): ((props: postApiProps) => Promise<T>) => {
  return async (props) => {
    const data = await postApi(
      props.queryParams ? props.url + `?${props.queryParams}` : props.url,
      props.body,
    );
    const zodResult = schema.safeParse(data);

    if (zodResult.error) {
      loggZodFeil(props.url, zodResult.error, data);
    }

    return data;
  };
};

export const putApi = async (
  url: string,
  body: unknown,
  queryParams?: URLSearchParams,
) => {
  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }

  const response = await fetch(getBasePath() + url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body, (_key, value) =>
      value instanceof Set ? [...value] : value,
    ),
  });

  if (response.ok) {
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json();
    }
    return response.status;
  }
  rapporterApiFeil(response.status, response.url);
  if (response.status === 404) {
    throw new Error('404');
  } else if (response.status === 403) {
    throw new Error('403');
  } else {
    throw new Error(
      `Feil respons fra server (http-status: ${response.status})`,
    );
  }
};
