'use client';

import { rapporterFeil } from '@/app/util/apm';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function RotFeilgrense({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div>Noe gikk galt ved lasting av applikasjonen.</div>}
      onError={(feil) => rapporterFeil(feil)}
    >
      {children}
    </ErrorBoundary>
  );
}
