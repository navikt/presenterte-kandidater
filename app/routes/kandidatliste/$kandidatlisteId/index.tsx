import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { Heading } from "@navikt/ds-react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import css from "./index.css";

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request }) => {
    return json(await proxyTilApi(request, "/kandidater"));
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
