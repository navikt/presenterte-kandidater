import { kastError } from '../util/kastError';
import { getBasePath } from '../util/miljø';
import { logger } from '@navikt/next-logger';
import { ZodSchema } from 'zod';

export const getAPIwithSchema = <T>(
  schema: ZodSchema<T>,
): ((url: string) => Promise<T>) => {
  return async (url: string) => {
    const data = await getAPI(url);

    const zodResult = schema.safeParse(data);

    if (zodResult.error) {
      logger.error(zodResult.error.message);
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

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(
      `Feil respons fra server: (http-status: ${response.status})`,
    );
  }
};

export const deleteApi = async (url: string) => {
  const response = await fetch(getBasePath() + url, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else if (response.status === 404) {
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
    return await response.json();
  } else if (response.status === 404) {
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
      logger.error(zodResult.error.message);
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
  } else if (response.status === 404) {
    throw new Error('404');
  } else if (response.status === 403) {
    throw new Error('403');
  } else {
    throw new Error(
      `Feil respons fra server (http-status: ${response.status})`,
    );
  }
};
