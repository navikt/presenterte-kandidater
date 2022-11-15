import { BodyShort, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import { logger } from "server/logger";
import Kandidatsammendrag, {
    links as kandidatsammendragCss,
} from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import Kandidatlistesammendrag from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { Kandidatlistesammendrag as Listesammendrag } from "~/services/domene";

import css from "./index.css";

export const links: LinksFunction = () => [
    ...kandidatsammendragCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request }) => {
    // TODO: Bruk virksomhet fra bedriftsmeny
    const virksomhetsnummer = "912998827";

    const respons = await proxyTilApi(
        request,
        `/kandidatlister?virksomhetsnummer=${virksomhetsnummer}`
    );

    try {
        const data = await respons.json();
        return json(data);
    } catch (e) {
        logger.error("Klarte ikke å hente kandidatliste:", e);
    }
};

const Kandidatlister = () => {
    const sammendrag = useLoaderData<Listesammendrag[]>();
    const { pågående, avsluttede } = fordelPåStatus(sammendrag);

    return (
        <main className="side kandidatlister">
            <Heading level="2" size="small">
                Pågående oppdrag
            </Heading>

            <ul className="kandidatlister--gruppe">
                {pågående.map((sammendrag) => (
                    <Kandidatlistesammendrag
                        key={sammendrag.kandidatliste.stillingId}
                        sammendrag={sammendrag}
                    />
                ))}
            </ul>

            <Heading level="2" size="small">
                Avsluttede oppdrag
            </Heading>

            {avsluttede.length === 0 && (
                <BodyShort>
                    <em>Ingen avsluttede oppdrag</em>
                </BodyShort>
            )}
            <ul className="kandidatlister--gruppe">
                {avsluttede.map((sammendrag) => (
                    <Kandidatlistesammendrag
                        key={sammendrag.kandidatliste.stillingId}
                        sammendrag={sammendrag}
                    />
                ))}
            </ul>
        </main>
    );
};

const fordelPåStatus = (sammendrag: Listesammendrag[]) => {
    const pågående: Listesammendrag[] = [];
    const avsluttede: Listesammendrag[] = [];

    sammendrag.forEach((sammendrag) => {
        if (sammendrag.kandidatliste.status === "ÅPEN") {
            pågående.push(sammendrag);
        } else {
            avsluttede.push(sammendrag);
        }
    });

    return {
        pågående,
        avsluttede,
    };
};

export default Kandidatlister;
