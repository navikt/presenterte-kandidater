'use client';

import { getBasePath } from './util/miljø';
import { Box } from '@navikt/ds-react';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const response = error instanceof Response ? error : undefined;
  const { title, messages } = getErrorContent(response?.status);

  useEffect(() => {
    if (response?.status === 401) {
      window.location.href = `${getBasePath()}/oauth2/login?redirect=${
        window.location.pathname
      }`;
    }
  }, [response?.status]);

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>{title}</h2>
      <Box
        padding='4'
        borderWidth='1'
        borderRadius='small'
        className='bg-white'
      >
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </Box>
    </div>
  );
}

function getErrorContent(status?: number) {
  if (status === 401) {
    return {
      title: 'Logg inn for å fortsette',
      messages: [
        'Du er ikke logget inn eller sesjonen har utløpt.',
        'Sender deg videre til innlogging. Hvis det ikke skjer automatisk kan du prøve igjen fra forsiden.',
      ],
    };
  }

  if (status === 403) {
    return {
      title: 'Du har ikke tilgang',
      messages: [
        'Du mangler rettigheter til å se denne siden eller kandidatlisten.',
      ],
    };
  }

  return {
    title: 'Ojsann!',
    messages: ['Det skjedde en uventet feil.', 'Vennligst prøv igjen senere.'],
  };
}
