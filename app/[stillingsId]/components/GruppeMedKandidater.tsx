import { Accordion, Heading } from '@navikt/ds-react';
import * as React from 'react';
import { ReactNode } from 'react';
import {
  KandidatMedCvDTO,
  Kandidatvurdering,
} from '../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import Kandidatsammendrag from './Kandidatsammendrag';

export interface GruppeMedKandidaterProps {
  vurdering?: Kandidatvurdering;
  icon: ReactNode;
  kandidater: KandidatMedCvDTO[];
  stillingId: string;
}

const GruppeMedKandidater: React.FC<GruppeMedKandidaterProps> = ({
  vurdering,
  icon,
  kandidater,
  stillingId,
}) => {
  const kandidaterMedGittStatus = kandidater.filter(
    (kandidat) => kandidat.kandidat.arbeidsgiversVurdering === vurdering
  );

  if (kandidaterMedGittStatus.length === 0) {
    return null;
  }

  return (
    <Accordion>
      <Accordion.Item defaultOpen={kandidaterMedGittStatus.length > 0}>
        <Accordion.Header>
          <div className='flex items-center gap-4'>
            <div className='w-6 h-6'>{icon}</div>
            <Heading level='3' size='small'>
              {visVurdering(vurdering)} ({kandidaterMedGittStatus.length})
            </Heading>
          </div>
        </Accordion.Header>
        <Accordion.Content className='p-0 border-b-0'>
          <ul className='list-none p-0 m-0'>
            {kandidaterMedGittStatus.map((kandidat) => (
              <Kandidatsammendrag
                key={kandidat.kandidat.uuid}
                kandidat={kandidat}
                stillingId={stillingId}
              />
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

export default GruppeMedKandidater;

export const visVurdering = (vurdering?: Kandidatvurdering) => {
  switch (vurdering) {
    case Kandidatvurdering.TilVurdering:
      return 'Til vurdering';
    case Kandidatvurdering.IkkeAktuell:
      return 'Ikke aktuell';
    case Kandidatvurdering.Aktuell:
      return 'Aktuell';
    case Kandidatvurdering.FåttJobben:
      return 'Fått jobben';
    default:
      return 'Ikke vurdert';
  }
};
