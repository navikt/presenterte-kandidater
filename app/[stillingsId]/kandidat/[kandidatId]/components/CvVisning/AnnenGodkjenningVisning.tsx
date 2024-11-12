import { Heading } from '@navikt/ds-react';
import { Fragment } from 'react';
import { AnnenGodkjenningDTO } from '../../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { formaterMånedOgÅr } from '../../../../../util/formatering';

export default function AnnenGodkjenning({
  godkjenning,
}: {
  godkjenning: AnnenGodkjenningDTO;
}) {
  const { tittel, dato } = godkjenning;

  return (
    <Fragment key={tittel}>
      <Heading level='4' size='xsmall' className='text-xl mt-8'>
        {tittel}
      </Heading>

      {dato && <p className='m-0 leading-6'>{formaterMånedOgÅr(dato)}</p>}
    </Fragment>
  );
}
