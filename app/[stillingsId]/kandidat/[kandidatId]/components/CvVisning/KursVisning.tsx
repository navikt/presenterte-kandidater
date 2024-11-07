import { Heading } from '@navikt/ds-react';
import {
  KursDTO,
  OmfangEnhet,
} from '../../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { formaterMånedOgÅr } from '../../../../../util/formatering';

export default function Kurs({ kurs }: { kurs: KursDTO }) {
  const { tittel, omfangEnhet, omfangVerdi, tilDato } = kurs;

  return (
    <div>
      <Heading level='4' size='xsmall' className='text-xl mt-8'>
        {tittel}
      </Heading>

      {tilDato && <p className='m-0 leading-6'>{formaterMånedOgÅr(tilDato)}</p>}

      <p className='m-0 leading-6'>
        <span>Varighet: </span>
        {omfangEnhet && omfangVerdi ? (
          <span>
            {omfangVerdi} {omfangTilVisning(omfangEnhet)}
          </span>
        ) : (
          'Ikke oppgitt'
        )}
      </p>
    </div>
  );
}

function omfangTilVisning(omfangEnhet: OmfangEnhet): string {
  switch (omfangEnhet) {
    case OmfangEnhet.Time:
      return 'timer';
    case OmfangEnhet.Dag:
      return 'dager';
    case OmfangEnhet.Uke:
      return 'uker';
    case OmfangEnhet.Måned:
      return 'måneder';
    default:
      return omfangEnhet;
  }
}
