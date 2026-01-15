'use client';

import Feilmelding from './components/Feilmelding';

type ErrorWithStatus = Error & { digest?: string; status?: number };

export default function Error({ error }: { error: ErrorWithStatus }) {
  const response = error instanceof Response ? error : undefined;
  const statuskode = resolveStatuskode(response, error);

  return (
    <Feilmelding
      statuskode={statuskode}
      tittel={response ? response.statusText : error.message}
    />
  );
}

function resolveStatuskode(
  response: Response | undefined,
  error: ErrorWithStatus,
) {
  if (response?.status) {
    return response.status;
  }

  if (typeof error.status === 'number') {
    return error.status;
  }

  return undefined;
}
