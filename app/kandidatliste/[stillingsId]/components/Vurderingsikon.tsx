import { DecisionCheck, Helptext, Like } from '@navikt/ds-icons';
import type { FunctionComponent } from 'react';
import { Kandidatvurdering } from '../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';

type Props = {
  vurdering: Kandidatvurdering;
};

const Vurderingsikon: FunctionComponent<Props> = ({ vurdering }) => {
  switch (vurdering) {
    case Kandidatvurdering.TilVurdering:
      return <Helptext aria-hidden={true} />;
    case Kandidatvurdering.IkkeAktuell:
      return (
        <Like style={{ transform: 'rotate(180deg)' }} aria-hidden={true} />
      );
    case Kandidatvurdering.Aktuell:
      return <Like aria-hidden={true} />;
    case Kandidatvurdering.FåttJobben:
      return <DecisionCheck aria-hidden={true} />;
    default:
      return null;
  }
};

export default Vurderingsikon;
