import { BodyShort, Box, Link } from '@navikt/ds-react';

import type { FunctionComponent } from 'react';
import { KandidatlisteMedAntallKandidaterDTO } from '../api/presenterte-kandidater-api/kandidatlister/[virksomhetsId]/kandidatlister.typer';
import { getBasePath } from '../util/miljø';

type Props = {
  sammendrag: KandidatlisteMedAntallKandidaterDTO;
  virksomhet: string;
};

const VisKandidatlistesammendrag: FunctionComponent<Props> = ({
  sammendrag,
  virksomhet,
}) => {
  const { antallKandidater } = sammendrag;
  const { tittel, opprettet, stillingId } = sammendrag.kandidatliste;

  return (
    <Box
      padding='4'
      borderWidth='1'
      borderRadius='small'
      as='li'
      className='flex flex-col gap-4 -mx-4 md:grid md:grid-cols-[1fr,auto] md:p-6 md:m-0 bg-white'
    >
      <span>
        <Link
          href={`${getBasePath()}/${stillingId}?virksomhet=${virksomhet}`}
          className='navds-link'
        >
          {tittel}
        </Link>
      </span>
      <BodyShort>Opprettet {formaterOpprettetTidspunkt(opprettet)}</BodyShort>
      <BodyShort>
        {antallKandidater} kandidat{antallKandidater === 1 ? '' : 'er'}
      </BodyShort>
    </Box>
  );
};

const formaterOpprettetTidspunkt = (tidspunkt: string) => {
  return new Date(tidspunkt).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default VisKandidatlistesammendrag;
