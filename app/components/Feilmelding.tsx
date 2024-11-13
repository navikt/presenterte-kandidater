'use client';
import { Alert, BodyLong, BodyShort, Button } from '@navikt/ds-react';
import { logger } from '@navikt/next-logger';
import * as React from 'react';
import { useEffect } from 'react';
import { IFeilmelding } from '../util/feiltyper';
import { getBasePath } from '../util/miljø';

const Feilmelding: React.FC<IFeilmelding> = ({
  zodError,
  tittel,
  statuskode,
  stack,
  beskrivelse,
  url,
}) => {
  const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    if (statuskode === 401) {
      window.location.href = `${getBasePath()}/oauth2/login?redirect=${
        window.location.pathname
      }`;
    }
  }, [statuskode]);

  if (zodError) {
    logger.info('ZodError', zodError);
    return (
      <Alert className='w-full' style={{ margin: '1rem' }} variant='error'>
        <strong>Feil ved validering av data (ZodError)</strong>
        <BodyLong>{tittel}</BodyLong>
        <BodyShort>Antall feil {zodError?.errors.length ?? 'N/A'}</BodyShort>
        <Button
          className='mt-4 mb-4'
          size='small'
          variant={showError ? 'secondary-neutral' : 'secondary'}
          onClick={() => setShowError(!showError)}
        >
          {showError ? 'Skjul' : 'Vis'} detaljert feilmelding
        </Button>
        {showError && (
          <div>
            {zodError?.errors?.map((e, i) => (
              <div key={i} className='mb-2'>
                <dd>
                  <strong>{e.code}:</strong> {e.message}
                </dd>
                <dt>
                  <strong>Path:</strong>{' '}
                  {e.path && <span> {e.path.join('.')}</span>}
                </dt>
              </div>
            ))}
          </div>
        )}
      </Alert>
    );
  }
  return (
    <div style={{ width: '100%' }}>
      <Alert style={{ margin: '1rem' }} variant='error'>
        <strong>Noe gikk galt!</strong>
        <BodyShort>{tittel}</BodyShort>
        <BodyLong>{beskrivelse}</BodyLong>
        <Button
          className='mt-4 mb-4'
          size='small'
          variant={showError ? 'secondary-neutral' : 'secondary'}
          onClick={() => setShowError(!showError)}
        >
          {showError ? 'Skjul' : 'Vis'} detaljert feilmelding
        </Button>
        {showError && (
          <dl>
            <dt className='font-bold italic'>Statuskode</dt>
            <dd className='mb-4 ml-4'>{statuskode ?? '-'}</dd>

            <dt className='font-bold italic'>URL</dt>
            <dd className='mb-4 ml-4'>{url ?? '-'}</dd>

            <dt className='font-bold italic'>Teknisk feilmelding</dt>
            <dd className='mb-4 ml-4'>{stack ?? '-'}</dd>
          </dl>
        )}
      </Alert>
    </div>
  );
};

export default Feilmelding;
