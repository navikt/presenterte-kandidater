import { Back } from "@navikt/ds-icons";
import { BodyLong, Heading, Panel } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import css from "./IkkeFunnet.css";
import useVirksomhet from "~/services/useVirksomhet";

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: css,
        },
    ];
};

type Props = {
    forklaring: string;
};

const IkkeFunnet: FunctionComponent<Props> = ({ forklaring }) => {
    const virksomhet = useVirksomhet();

    return (
        <main className="side ikke-funnet-side">
            <div className="ikke-funnet__tilbakelenke">
                <Link to={`/kandidatliste?virksomhet=${virksomhet}`} className="navds-link">
                    <Back aria-hidden />
                    Alle rekrutteringsprosesser
                </Link>
            </div>
            <Panel className="ikke-funnet">
                <Heading spacing level="2" size="large">
                    Ikke funnet
                </Heading>
                <BodyLong>{forklaring}</BodyLong>
            </Panel>
        </main>
    );
};

export default IkkeFunnet;
