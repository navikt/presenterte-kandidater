'use client';

import { rapporterFeil } from '@/app/util/apm';
import '@navikt/ds-css';
import { Button, Heading } from '@navikt/ds-react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    rapporterFeil(error);
  }, [error]);

  return (
    <html lang='nb'>
      <body className='p-8'>
        <Heading level='1' size='large' spacing>
          Noe gikk galt
        </Heading>
        <Button onClick={reset}>Prøv igjen</Button>
      </body>
    </html>
  );
}
