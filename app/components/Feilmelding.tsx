'use client';

import { IFeilmelding } from '../util/feiltyper';
import { getBasePath } from '../util/miljø';
import { Alert, BodyLong, BodyShort, Button } from '@navikt/ds-react';
import { logger } from '@navikt/next-logger';
import * as React from 'react';
import { useEffect } from 'react';

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
    logger.info(zodError, 'ZodError');
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

  const tittelTekst = () => {
    switch (statuskode) {
      case 401:
        return 'Du er ikke autentisert (Statuskode 401)';
      case 403:
        return 'Du har ikke rett tilgang i Altinn (Statuskode 403)';
      default:
        return 'Noe gikk galt!';
    }
  };

  const beskrivelseTekst = () => {
    switch (statuskode) {
      case 403:
        return 'Det er kun arbeidsgivere med riktig tilgang i Altinn som kan ta i bruk min side arbeidsgiver for denne virksomheten.';
      default:
        return beskrivelse;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Alert style={{ margin: '1rem' }} variant='error'>
        <strong>{tittelTekst()}</strong>
        <BodyLong>{beskrivelseTekst()}</BodyLong>
      </Alert>
    </div>
  );
};

export default Feilmelding;
