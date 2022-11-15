import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import css from "./Kandidatsammendrag.css";
import { BodyShort } from "@navikt/ds-react";
import type { CvSammendrag, Kandidatsammendrag as Sammendrag } from "~/services/domene";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

type Props = {
    sammendrag: Sammendrag;
    stillingId: string;
};

const Kandidatsammendrag: FunctionComponent<Props> = ({ sammendrag, stillingId }) => {
    const { kompetanse, arbeidserfaring, ønsketYrke } = sammendrag.cv;

    return (
        <li className="kandidatsammendrag">
            <Link
                to={`/kandidatliste/${stillingId}/${sammendrag.kandidatId}`}
                className="navds-link"
            >
                <span>{visKandidatnavn(sammendrag.cv)} </span>
            </Link>
            <BodyShort>
                <b>Kompetanse: </b>
                <span>{kompetanse}</span>
            </BodyShort>
            <BodyShort>
                <b>Arbeidserfaring: </b>
                <span>{arbeidserfaring}</span>
            </BodyShort>
            <BodyShort>
                <b>Ønsket yrke: </b>
                <span>{ønsketYrke}</span>
            </BodyShort>
        </li>
    );
};

const visKandidatnavn = (cv: CvSammendrag) => {
    return `${cv.fornavn} ${cv.etternavn}`;
};

export default Kandidatsammendrag;
