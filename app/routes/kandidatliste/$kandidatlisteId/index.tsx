import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { Heading } from "@navikt/ds-react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { hentExchangeToken, retrieveToken } from "~/services/tokenx.server";
import { logger } from "server/logger";
import css from "./index.css";

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request }) => {
    const cluster = process.env.NAIS_CLUSTER_NAME;
    const apiScope = `${cluster}:toi:presenterte-kandidater-api`;
    const accessToken = retrieveToken(request);

    if (!accessToken) {
        logger.error("Bruker har ikke auth token");

        return null;
    } else {
        const exchangeToken = await hentExchangeToken(accessToken, apiScope);
        request.headers.set("authorization", `Bearer ${exchangeToken.access_token}`);

        const response = await fetch(`https://presenterte-kandidater-api.dev.intern.nav.no`);
        const data = await response.text();

        return json(data);
    }
};

const Kandidatliste = () => {
    const { kandidatlisteId } = useParams();
    const kandidater = useLoaderData<any>();

    console.log("Kandidater:", kandidater);

    return (
        <>
            <main className="side">
                <Link to="/kandidatliste">Tilbake</Link>
                <Heading size="medium">Kandidatliste {kandidatlisteId}</Heading>
                <ul>
                    <li>
                        <Link to={`/kandidatliste/${kandidatlisteId}/ABC`}>Kandidat "ABC"</Link>
                    </li>
                </ul>
            </main>
        </>
    );
};

export default Kandidatliste;
