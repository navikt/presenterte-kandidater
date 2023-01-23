import { Fragment } from "react";
import { Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import type { AnnenGodkjenning as AnnenGodkjenningType } from "~/services/domene";
import { formaterMånedOgÅr } from "./CvErfaring";
import css from "./CvErfaring.module.css";

const AnnenGodkjenning: FunctionComponent<{ godkjenning: AnnenGodkjenningType }> = ({
    godkjenning,
}) => {
    const { tittel, dato } = godkjenning;

    return (
        <Fragment key={tittel}>
            <Heading className={css.tittel} level="4" size="xsmall">
                {tittel}
            </Heading>
            {dato && <p className={css.tekst}>{formaterMånedOgÅr(dato)}</p>}
        </Fragment>
    );
};

export default AnnenGodkjenning;
