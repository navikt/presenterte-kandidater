import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import type { Utdanning as UtdanningType } from "~/services/domene";
import { formaterPeriode } from "./formatering";
import css from "./Erfaring.module.css";

type Props = {
    utdanning: UtdanningType;
};

export const Utdanning: FunctionComponent<Props> = ({ utdanning }) => {
    const { fra, til, beskrivelse, utdannelsessted, utdanningsretning } = utdanning;

    return (
        <>
            <Heading className={css.tittel} level="4" size="xsmall">
                {utdanningsretning}
            </Heading>
            {utdannelsessted && <p className={css.sted}>{utdannelsessted}</p>}
            {fra && <p className={css.periode}>{formaterPeriode(fra, til)}</p>}
            {beskrivelse && <p className={css.beskrivelse}>{beskrivelse}</p>}
        </>
    );
};

export default Utdanning;
