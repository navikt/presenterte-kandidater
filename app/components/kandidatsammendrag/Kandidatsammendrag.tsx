import { Link } from "@remix-run/react";
import { BodyShort } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { Cv, Kandidat } from "~/services/domene";
import css from "./Kandidatsammendrag.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
};

const Kandidatsammendrag: FunctionComponent<Props> = ({ kandidat, kandidatlisteId }) => {
    const { kompetanse, arbeidserfaring, ønsketYrke } = kandidat.cv;

    return (
        <li className="kandidatsammendrag">
            <Link
                to={`/kandidatliste/${kandidatlisteId}/kandidat/${kandidat.kandidat.uuid}`}
                className="navds-link"
            >
                <span>{visKandidatnavn(kandidat.cv)} </span>
            </Link>
            <BodyShort>
                <b>Kompetanse: </b>
                <span>{kompetanse.join(", ")}</span>
            </BodyShort>
            <BodyShort>
                <b>Arbeidserfaring: </b>
                <span>
                    {arbeidserfaring.map((erfaring) => erfaring.stillingstittel).join(", ")}
                </span>
            </BodyShort>
            <BodyShort>
                <b>Ønsket yrke: </b>
                <span>{ønsketYrke.join(", ")}</span>
            </BodyShort>
        </li>
    );
};

const visKandidatnavn = (cv: Cv) => {
    return `${cv.fornavn} ${cv.etternavn}`;
};

export default Kandidatsammendrag;
