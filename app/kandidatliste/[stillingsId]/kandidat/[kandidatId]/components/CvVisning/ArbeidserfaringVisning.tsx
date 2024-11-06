import { Heading } from '@navikt/ds-react';

import { ArbeidserfaringDTO } from '../../../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { formaterPeriode } from '../../../../../../util/formatering';

type Props = {
  arbeidserfaring: ArbeidserfaringDTO;
};

export default function Arbeidserfaring({ arbeidserfaring }: Props) {
  const { stillingstittel, arbeidsgiver, beskrivelse, fraDato, tilDato, sted } =
    arbeidserfaring;

  return (
    <>
      <Heading level='4' size='xsmall' className='text-xl mt-8'>
        {stillingstittel}
      </Heading>

      {sted && (
        <p className='m-0 leading-6 italic'>{`${arbeidsgiver}, ${sted}`}</p>
      )}

      {fraDato && (
        <p className='m-0 leading-6'>{formaterPeriode(fraDato, tilDato)}</p>
      )}

      {beskrivelse && <p className='mt-3 leading-6'>{beskrivelse}</p>}
    </>
  );
}
