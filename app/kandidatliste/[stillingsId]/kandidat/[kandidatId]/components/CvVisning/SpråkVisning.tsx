import { Heading } from '@navikt/ds-react';
import {
  SpråkDTO,
  Språkkompetanse,
} from '../../../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';

export default function Språk({ språk }: { språk: SpråkDTO }) {
  const { navn, muntlig, skriftlig } = språk;

  return (
    <div>
      <Heading level='4' size='xsmall' className='text-xl mt-8'>
        {navn}
      </Heading>

      <p className='m-0 leading-6'>
        Muntlig: {språkkompetanseTilVisning(muntlig)}
      </p>

      <p className='m-0 leading-6'>
        Skriftlig: {språkkompetanseTilVisning(skriftlig)}
      </p>
    </div>
  );
}

function språkkompetanseTilVisning(kompetanse: Språkkompetanse): string {
  switch (kompetanse) {
    case Språkkompetanse.IkkeOppgitt:
      return 'Ikke oppgitt';
    case Språkkompetanse.Nybegynner:
      return 'Nybegynner';
    case Språkkompetanse.Godt:
      return 'Godt';
    case Språkkompetanse.VeldigGodt:
      return 'Veldig godt';
    case Språkkompetanse.Førstespråk:
      return 'Førstespråk';
    default:
      return kompetanse;
  }
}
