import { BodyShort, Panel } from "@navikt/ds-react";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { Kandidatlistesammendrag as Sammendrag } from "~/services/domene";
import css from "./Kandidatlistesammendrag.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

type Props = {
    sammendrag: Sammendrag;
};

const Kandidatlistesammendrag: FunctionComponent<Props> = ({ sammendrag }) => {
    const { kandidatliste, antallKandidater } = sammendrag;
    const { stillingId, tittel, opprettetTidspunkt } = kandidatliste;

    return (
        <Panel as="li" className="kandidatlistesammendrag">
            <span>
                <Link to={`/kandidatliste/${stillingId}`} className="navds-link">
                    {tittel}
                </Link>
            </span>
            <BodyShort>Opprettet {formaterOpprettetTidspunkt(opprettetTidspunkt)}</BodyShort>
            <BodyShort>
                {antallKandidater} kandidat{antallKandidater === 1 ? "" : "er"}
            </BodyShort>
        </Panel>
    );
};

const formaterOpprettetTidspunkt = (tidspunkt: string) => {
    return new Date(tidspunkt).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export default Kandidatlistesammendrag;
