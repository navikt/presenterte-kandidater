import {
  PersonCheckmarkIcon,
  QuestionmarkCircleIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from '@navikt/aksel-icons';
import type { FunctionComponent } from 'react';
import { Kandidatvurdering } from '../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';

type Props = {
  vurdering: Kandidatvurdering;
};

const Vurderingsikon: FunctionComponent<Props> = ({ vurdering }) => {
  switch (vurdering) {
    case Kandidatvurdering.TilVurdering:
      return <QuestionmarkCircleIcon aria-hidden={true} />;
    case Kandidatvurdering.IkkeAktuell:
      return <ThumbDownIcon aria-hidden={true} />;
    case Kandidatvurdering.Aktuell:
      return <ThumbUpIcon aria-hidden={true} />;
    case Kandidatvurdering.FåttJobben:
      return <PersonCheckmarkIcon aria-hidden={true} />;
    default:
      return null;
  }
};

export default Vurderingsikon;
