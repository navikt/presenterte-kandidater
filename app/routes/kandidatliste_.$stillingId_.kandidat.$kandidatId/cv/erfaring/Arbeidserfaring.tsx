import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import type { Arbeidserfaring as ArbeidserfaringType } from "~/services/domene";
import { formaterPeriode } from "./formatering";
import css from "./Erfaring.module.css";

type Props = {
    arbeidserfaring: ArbeidserfaringType;
};

export const Arbeidserfaring: FunctionComponent<Props> = ({ arbeidserfaring }) => {
    const { stillingstittel, arbeidsgiver, beskrivelse, fraDato, tilDato, sted } = arbeidserfaring;

    return (
        <>
            <Heading className={css.tittel} level="4" size="xsmall">
                {stillingstittel}
            </Heading>
            {sted && <p className={css.sted}>{`${arbeidsgiver}, ${sted}`}</p>}
            {fraDato && <p className={css.periode}>{formaterPeriode(fraDato, tilDato)}</p>}
            {beskrivelse && <p className={css.beskrivelse}>{beskrivelse}</p>}
        </>
    );
};

export default Arbeidserfaring;
