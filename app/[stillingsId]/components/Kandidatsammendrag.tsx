import { BodyShort } from '@navikt/ds-react';
import Link from 'next/link';
import type { FunctionComponent } from 'react';
import { useApplikasjonContext } from '../../ApplikasjonsContext';
import {
  KandidatCvDTO,
  KandidatMedCvDTO,
} from '../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';

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
    <li className='flex flex-col items-start p-4 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-[--a-gray-200]'>
      <Link
        href={`/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${valgtOrganisasjonsnummer}`}
        className='navds-link'
      >
        <span className='text-[--a-font-size-xlarge]'>
          {visKandidatnavn(kandidat.cv)}
        </span>
      </Link>
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
    <li className='flex flex-col items-start p-4 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-[--a-gray-200]'>
      <Link
        href={`/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${valgtOrganisasjonsnummer}`}
        className='navds-link'
      >
        <span className='text-[--a-font-size-xlarge]'>
          Utilgjengelig kandidat
        </span>
      </Link>
      <BodyShort>Kandidaten er ikke lenger tilgjengelig</BodyShort>
    </li>
  );
};

const visKandidatnavn = (cv: KandidatCvDTO) => {
  return `${cv.fornavn} ${cv.etternavn}`;
};

export default Kandidatsammendrag;
