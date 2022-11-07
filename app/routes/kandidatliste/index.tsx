import { Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { Kandidatliste } from "./$stillingId";
import css from "./index.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

export const loader: LoaderFunction = async ({ request }) => {
    const respons = await proxyTilApi(request, "/kandidatlister");

    return json(await respons.json());
};

const Kandidatlister = () => {
    const kandidatlister = useLoaderData<Kandidatliste[]>();

    return (
        <main className="side kandidatlister">
            <Heading size="medium">Kandidater</Heading>
            <ul>
                {kandidatlister.map((kandidatliste) => (
                    <li key={kandidatliste.stillingId}>
                        <Link to={`/kandidatliste/${kandidatliste.stillingId}`}>
                            {kandidatliste.tittel} ({kandidatliste.stillingId})
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default Kandidatlister;
