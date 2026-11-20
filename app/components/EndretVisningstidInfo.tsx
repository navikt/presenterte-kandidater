import { InformationSquareIcon } from '@navikt/aksel-icons';
import { BodyLong, InfoCard } from '@navikt/ds-react';

// Midlertidig melding om at CV-er nå vises i tre måneder. Fjernes seks uker
// etter at endringen er rullet ut.
const EndretVisningstidInfo = () => (
  <InfoCard data-color='info' className='[overflow-wrap:anywhere]'>
    <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
      <InfoCard.Title>
        Endring i tilgjengelighet for oversendte CV-er
      </InfoCard.Title>
    </InfoCard.Header>
    <InfoCard.Content>
      <BodyLong spacing>
        Oversendte CV-er vil nå være tilgjengelige på denne siden i tre måneder,
        mot tidligere seks måneder.
      </BodyLong>
      <BodyLong spacing>
        Endringen er gjort etter en ny vurdering av hvor lenge opplysningene er
        nødvendige for å ivareta formålet med rekrutteringsprosessen, i samsvar
        med GDPR.
      </BodyLong>
      <BodyLong>
        Dersom den nye tilgjengelighetsperioden medfører utfordringer for dere,
        kan dere kontakte arbeidsgivertelefonen på 55 55 33 36.
      </BodyLong>
    </InfoCard.Content>
  </InfoCard>
);

export default EndretVisningstidInfo;
