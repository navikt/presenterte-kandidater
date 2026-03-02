import { useApplikasjonContext } from '../../ApplikasjonsContext';
import {
  KandidatCvDTO,
  KandidatMedCvDTO,
} from '../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { Link as AkselLink, BodyShort } from '@navikt/ds-react';
import NextLink from 'next/link';
import type { FunctionComponent } from 'react';

type Props = {
  kandidat: KandidatMedCvDTO;
  stillingId: string;
};

const Kandidatsammendrag: FunctionComponent<Props> = ({
  kandidat,
  stillingId,
}) => {
  const { valgtOrganisasjonsnummer } = useApplikasjonContext();

  if (kandidat.cv === null) {
    return (
      <KandidatsammendragUtenCv kandidat={kandidat} stillingId={stillingId} />
    );
  }

  const { kompetanse, arbeidserfaring } = kandidat.cv;

  return (
    <li className='flex flex-col items-start p-4 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-gray-200'>
      <AkselLink
        as={NextLink}
        href={`/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${valgtOrganisasjonsnummer}`}
      >
        <span className='text-font-size-xlarge'>
          {visKandidatnavn(kandidat.cv)}
        </span>
      </AkselLink>
      <BodyShort className='mt-2'>
        <span className='leading-7 font-bold'>Kompetanse: </span>
        <span>{kompetanse.join(', ')}</span>
      </BodyShort>
      <BodyShort>
        <span className='leading-7 font-bold'>Arbeidserfaring: </span>
        <span>
          {arbeidserfaring
            .map((erfaring) => erfaring.stillingstittel)
            .join(', ')}
        </span>
      </BodyShort>
    </li>
  );
};

export const KandidatsammendragUtenCv: FunctionComponent<Props> = ({
  kandidat,
  stillingId,
}) => {
  const { valgtOrganisasjonsnummer } = useApplikasjonContext();

  return (
    <li className='flex flex-col items-start p-4 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-gray-200'>
      <AkselLink
        as={NextLink}
        href={`/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${valgtOrganisasjonsnummer}`}
      >
        <span className='text-font-size-xlarge'>Utilgjengelig kandidat</span>
      </AkselLink>
      <BodyShort>Kandidaten er ikke lenger tilgjengelig</BodyShort>
    </li>
  );
};

const visKandidatnavn = (cv: KandidatCvDTO) => {
  return `${cv.fornavn} ${cv.etternavn}`;
};

export default Kandidatsammendrag;
