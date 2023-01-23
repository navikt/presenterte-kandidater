import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import type { Førerkort as FørerkortType } from "~/services/domene";
import css from "./CvErfaring.module.css";

const Førerkort: FunctionComponent<{ førerkort: FørerkortType }> = ({ førerkort }) => {
    const { førerkortKodeKlasse } = førerkort;

    return (
        <Heading className={css.tittel} level="4" size="xsmall">
            {førerkortKodeKlasse}
        </Heading>
    );
};

export default Førerkort;
