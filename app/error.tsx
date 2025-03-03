'use client';

import { getBasePath } from './util/miljø';
import { Box } from '@navikt/ds-react';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    if (error instanceof Response && error.status === 401) {
      window.location.href = `${getBasePath()}/oauth2/login?redirect=${
        window.location.pathname
      }`;
    }
  }, [error]);

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Ojsann!</h2>
      <Box
        padding='4'
        borderWidth='1'
        borderRadius='small'
        className='bg-white'
      >
        <p>Det skjedde en uventet feil.</p>
        <p>Vennligst prøv igjen senere</p>
      </Box>
    </div>
  );
}
