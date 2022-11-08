import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { Kandidat } from "~/routes/kandidatliste/$stillingId/$kandidatId";
import css from "./Kandidatoppsummering.css";
import { BodyShort } from "@navikt/ds-react";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

type Props = {
    kandidat: Kandidat;
    stillingId: string;
};

const Kandidatoppsummering: FunctionComponent<Props> = ({ kandidat, stillingId }) => {
    return (
        <li className="kandidatoppsummering">
            <Link to={`/kandidatliste/${stillingId}/${kandidat.kandidatId}`} className="navds-link">
                <span>{visKandidatnavn(kandidat)} </span>
            </Link>
            <BodyShort>
                <b>Kompetanse: </b>
            </BodyShort>
            <BodyShort>
                <b>Arbeidserfaring: </b>
            </BodyShort>
            <BodyShort>
                <b>Jobbønske: </b>
            </BodyShort>
        </li>
    );
};

const visKandidatnavn = (kandidat: Kandidat) => {
    return `${kandidat.kandidat.fornavn} ${kandidat.kandidat.etternavn}`;
};

export default Kandidatoppsummering;
