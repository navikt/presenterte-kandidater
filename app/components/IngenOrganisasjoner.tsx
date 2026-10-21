import { BodyShort, Heading } from '@navikt/ds-react';
import type { FunctionComponent } from 'react';

const IngenOrganisasjoner: FunctionComponent = () => {
  return (
    <div className='side kandidatlister'>
      <Heading level='2' size='small'>
        Ikke tilgang
      </Heading>
      <BodyShort>Du representerer ingen organisasjoner</BodyShort>
    </div>
  );
};

export default IngenOrganisasjoner;
