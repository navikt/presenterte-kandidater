'use client';

import Feilmelding from './components/Feilmelding';
import { rapporterFeil } from '@/app/util/apm';
import { useEffect } from 'react';

type ErrorWithStatus = Error & { digest?: string; status?: number };

export default function Error({ error }: { error: ErrorWithStatus }) {
  const response = error instanceof Response ? error : undefined;
  const statuskode = resolveStatuskode(response, error);

  useEffect(() => {
    // Feil med statuskode er API-feil som fetcheren allerede har rapportert.
    if (statuskode === undefined) rapporterFeil(error);
  }, [error, statuskode]);

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
