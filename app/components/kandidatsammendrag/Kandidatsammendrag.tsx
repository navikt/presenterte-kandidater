import { Link } from "@remix-run/react";
import { BodyShort } from "@navikt/ds-react";
import type { FunctionComponent } from "react";
import type { Cv, Kandidat } from "~/services/domene";
import useVirksomhet from "~/services/useVirksomhet";
import css from "./Kandidatsammendrag.module.css";

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
        <li className={css.kandidat}>
            <Link
                to={`/kandidatliste/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${virksomhet}`}
                className="navds-link"
            >
                <span className={css.navn}>{visKandidatnavn(kandidat.cv)}</span>
            </Link>
            <BodyShort>
                <span className={css.punkt}>Kompetanse: </span>
                <span>{kompetanse.join(", ")}</span>
            </BodyShort>
            <BodyShort>
                <span className={css.punkt}>Arbeidserfaring: </span>
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
        <li className={css.kandidat}>
            <Link
                to={`/kandidatliste/${stillingId}/kandidat/${kandidat.kandidat.uuid}?virksomhet=${virksomhet}`}
                className="navds-link"
            >
                <span className={css.navn}>Utilgjengelig kandidat</span>
            </Link>
            <BodyShort>Kandidaten er ikke lenger tilgjengelig</BodyShort>
        </li>
    );
};

const visKandidatnavn = (cv: Cv) => {
    return `${cv.fornavn} ${cv.etternavn}`;
};

export default Kandidatsammendrag;
