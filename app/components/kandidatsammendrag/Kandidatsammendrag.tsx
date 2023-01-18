import { Link } from "@remix-run/react";
import { BodyShort } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { Cv, Kandidat } from "~/services/domene";
import css from "./Kandidatsammendrag.css";
import useVirksomhet from "~/services/useVirksomhet";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

type Props = {
    kandidat: Kandidat;
    stillingId: string;
};

const Kandidatsammendrag: FunctionComponent<Props> = ({ kandidat, stillingId }) => {
    const virksomhet = useVirksomhet();

    if (kandidat.cv === null) {
        return <KandidatsammendragUtenCv kandidat={kandidat} stillingId={stillingId} />;
    }

    const { kompetanse, arbeidserfaring } = kandidat.cv;

    return (
        <li className="kandidatsammendrag">
            <Link
                to={`/kandidatliste/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${virksomhet}`}
                className="navds-link"
            >
                <span>{visKandidatnavn(kandidat.cv)}</span>
            </Link>
            <BodyShort>
                <span className="kandidatsammendrag__punkt">Kompetanse: </span>
                <span>{kompetanse.join(", ")}</span>
            </BodyShort>
            <BodyShort>
                <span className="kandidatsammendrag__punkt">Arbeidserfaring: </span>
                <span>
                    {arbeidserfaring.map((erfaring) => erfaring.stillingstittel).join(", ")}
                </span>
            </BodyShort>
        </li>
    );
};

export const KandidatsammendragUtenCv: FunctionComponent<Props> = ({ kandidat, stillingId }) => {
    const virksomhet = useVirksomhet();

    return (
        <li className="kandidatsammendrag">
            <Link
                to={`/kandidatliste/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${virksomhet}`}
                className="navds-link"
            >
                <span>Utilgjengelig kandidat</span>
            </Link>
            <BodyShort>Kandidaten er ikke lenger tilgjengelig</BodyShort>
        </li>
    );
};

const visKandidatnavn = (cv: Cv) => {
    return `${cv.fornavn} ${cv.etternavn}`;
};

export default Kandidatsammendrag;
