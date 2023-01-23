import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import css from "./CvErfaring.module.css";

type Props = {
    tittel: string | null;
    sted?: string;
    beskrivelse: string | null;
    fra: string | null;
    til: string | null;
};

export const CvErfaring: FunctionComponent<Props> = ({ tittel, sted, beskrivelse, fra, til }) => {
    return (
        <>
            <Heading className={css.tittel} level="4" size="xsmall">
                {tittel}
            </Heading>
            {sted && <p className={css.sted}>{sted}</p>}
            {fra && <p className={css.periode}>{formaterPeriode(fra, til)}</p>}
            {beskrivelse && <p className={css.beskrivelse}>{beskrivelse}</p>}
        </>
    );
};

export const formaterMånedOgÅr = (dato: string) => {
    const månedOgÅr = new Date(dato).toLocaleDateString("nb-NO", {
        month: "long",
        year: "numeric",
    });

    return månedOgÅr[0].toUpperCase() + månedOgÅr.slice(1);
};

const formaterPeriode = (fra: string, til: string | null) => {
    const fraMånedÅr = formaterMånedOgÅr(fra);
    const tilMånedÅr = til ? formaterMånedOgÅr(til) : "(Nåværende)";

    return `${fraMånedÅr}—${tilMånedÅr}`;
};

export default CvErfaring;
