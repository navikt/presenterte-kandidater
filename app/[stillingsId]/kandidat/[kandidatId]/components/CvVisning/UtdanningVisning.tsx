import { Heading } from '@navikt/ds-react';
import { UtdanningDTO } from '../../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { formaterPeriode } from '../../../../../util/formatering';

type Props = {
  utdanning: UtdanningDTO;
};

export default function Utdanning({ utdanning }: Props) {
  const { fra, til, beskrivelse, utdannelsessted, utdanningsretning } =
    utdanning;

  return (
    <>
      <Heading level='4' size='xsmall' className='text-xl mt-8'>
        {utdanningsretning}
      </Heading>

      {utdannelsessted && (
        <p className='m-0 leading-6 italic'>{utdannelsessted}</p>
      )}

      {fra && <p className='m-0 leading-6'>{formaterPeriode(fra, til)}</p>}

      {beskrivelse && <p className='mt-3 leading-6'>{beskrivelse}</p>}
    </>
  );
}
