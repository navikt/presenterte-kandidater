import type { FunctionComponent } from "react";
import { Heading } from "@navikt/ds-react";
import { formaterPeriode } from "./formatering";
import type { AnnenErfaring as AnnenErfaringType } from "~/services/domene";
import css from "./Erfaring.module.css";

type Props = {
    erfaring: AnnenErfaringType;
};

const AnnenErfaring: FunctionComponent<Props> = ({ erfaring }) => {
    const { rolle, beskrivelse, fraDato, tilDato } = erfaring;

    return (
        <>
            <Heading className={css.tittel} level="4" size="xsmall">
                {rolle}
            </Heading>
            {fraDato && <p className={css.periode}>{formaterPeriode(fraDato, tilDato)}</p>}
            {beskrivelse && <p className={css.beskrivelse}>{beskrivelse}</p>}
        </>
    );
};

export default AnnenErfaring;
