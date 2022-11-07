import { BodyShort, Panel } from "@navikt/ds-react";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { Kandidatliste } from "~/routes/kandidatliste/$stillingId";
import css from "./Kandidatlisteforhåndsvisning.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

type Props = {
    kandidatliste: Kandidatliste;
};

const Kandidatlisteforhåndsvisning: FunctionComponent<Props> = ({ kandidatliste }) => {
    const { stillingId, tittel, opprettetTidspunkt, kandidater } = kandidatliste;

    return (
        <Panel as="li" className="kandidatlisteforhandsvisning">
            <Link to={`/kandidatliste/${stillingId}`} className="navds-link">
                {tittel}
            </Link>
            <BodyShort>Opprettet {formaterOpprettetTidspunkt(opprettetTidspunkt)}</BodyShort>
            <BodyShort>
                {kandidater.length} kandidat{kandidater.length === 1 ? "" : "er"}
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

export default Kandidatlisteforhåndsvisning;
