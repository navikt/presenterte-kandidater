import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { Heading } from "@navikt/ds-react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import css from "./index.css";
import { logger } from "server/logger";

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async () => {
    const publicPath = "/kandidatliste";
    const basePath =
        process.env.NODE_ENV === "production"
            ? `https://presenterte-kandidater.dev.nav.no${publicPath}`
            : `http://localhost:3000${publicPath}`;

    // Kaller vår egen server. Er dette innafor?
    const response = await fetch(`${basePath}/api/kandidater`);
    const data = await response.text();

    logger.info("Data:", data);

    return json(data);
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
