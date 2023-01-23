import { Back } from "@navikt/ds-icons";
import { BodyLong, Heading, Panel } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import type { FunctionComponent } from "react";
import useVirksomhet from "~/services/useVirksomhet";
import css from "./IkkeFunnet.module.css";

type Props = {
    forklaring: string;
};

const IkkeFunnet: FunctionComponent<Props> = ({ forklaring }) => {
    const virksomhet = useVirksomhet();

    return (
        <main className={"side " + css.side}>
            <div className={css.tilbakelenke}>
                <Link to={`/kandidatliste?virksomhet=${virksomhet}`} className="navds-link">
                    <Back aria-hidden />
                    Alle rekrutteringsprosesser
                </Link>
            </div>
            <Panel className={css.ikkeFunnet}>
                <Heading spacing level="2" size="large">
                    Ikke funnet
                </Heading>
                <BodyLong>{forklaring}</BodyLong>
            </Panel>
        </main>
    );
};

export default IkkeFunnet;
