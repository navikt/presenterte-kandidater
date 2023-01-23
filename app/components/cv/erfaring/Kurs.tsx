import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import { OmfangEnhet } from "~/services/domene";
import type { Kurs as KursType } from "~/services/domene";
import { formaterMånedOgÅr } from "./formatering";
import css from "./Erfaring.module.css";

const Kurs: FunctionComponent<{ kurs: KursType }> = ({ kurs }) => {
    const { tittel, omfangEnhet, omfangVerdi, tilDato } = kurs;

    return (
        <div>
            <Heading className={css.tittel} level="4" size="xsmall">
                {tittel}
            </Heading>
            {tilDato && <p className={css.tekst}>{formaterMånedOgÅr(tilDato)}</p>}
            <p className={css.tekst}>
                <span>Varighet: </span>
                {omfangEnhet && omfangVerdi ? (
                    <span>
                        {omfangVerdi} {omfangTilVisning(omfangEnhet)}
                    </span>
                ) : (
                    "Ikke oppgitt"
                )}
            </p>
        </div>
    );
};

const omfangTilVisning = (omfangEnhet: OmfangEnhet) => {
    switch (omfangEnhet) {
        case OmfangEnhet.Time:
            return "timer";
        case OmfangEnhet.Dag:
            return "dager";
        case OmfangEnhet.Uke:
            return "uker";
        case OmfangEnhet.Måned:
            return "måneder";
        default:
            return omfangEnhet;
    }
};

export default Kurs;
