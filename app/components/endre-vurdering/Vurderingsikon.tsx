import { Helptext, Like, DecisionCheck } from "@navikt/ds-icons";
import { Kandidatvurdering } from "~/services/domene";
import type { FunctionComponent } from "react";

type Props = {
    vurdering: Kandidatvurdering;
};

const Vurderingsikon: FunctionComponent<Props> = ({ vurdering }) => {
    switch (vurdering) {
        case Kandidatvurdering.TilVurdering:
            return <Helptext aria-hidden={true} />;
        case Kandidatvurdering.IkkeAktuell:
            return <Like style={{ transform: "rotate(180deg)" }} aria-hidden={true} />;
        case Kandidatvurdering.Aktuell:
            return <Like aria-hidden={true} />;
        case Kandidatvurdering.FåttJobben:
            return <DecisionCheck aria-hidden={true} />;
        default:
            return null;
    }
};

export default Vurderingsikon;
