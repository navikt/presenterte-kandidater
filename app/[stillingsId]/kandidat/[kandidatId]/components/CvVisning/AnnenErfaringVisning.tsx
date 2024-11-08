import { Heading } from '@navikt/ds-react';
import { AnnenErfaringDTO } from '../../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { formaterPeriode } from '../../../../../util/formatering';

type Props = {
  erfaring: AnnenErfaringDTO;
};

export default function AnnenErfaring({ erfaring }: Props) {
  const { rolle, beskrivelse, fraDato, tilDato } = erfaring;

  return (
    <>
      <Heading level='4' size='xsmall' className='text-xl mt-8'>
        {rolle}
      </Heading>

      {fraDato && (
        <p className='m-0 leading-6'>{formaterPeriode(fraDato, tilDato)}</p>
      )}

      {beskrivelse && <p className='mt-3 leading-6'>{beskrivelse}</p>}
    </>
  );
}
