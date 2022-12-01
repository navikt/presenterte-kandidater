import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import Header from "./components/header/Header";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { configureMock } from "./mocks";

import rootCss from "./root.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import { hentMiljø, Miljø } from "./services/miljø";
import { proxyTilApi } from "./services/api/proxy";
import { useEffect } from "react";
import { settInnDekoratørHosKlienten } from "./services/dekoratør";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Kandidater",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: rootCss },
    { rel: "stylesheet", href: designsystemStyles },
    { rel: "stylesheet", href: bedriftsmenyStyles },
];

export const loader: LoaderFunction = async ({ request }) => {
    if (hentMiljø() === Miljø.Lokalt) {
        configureMock();
    }

    const respons = await proxyTilApi(request, "/organisasjoner");

    return json({
        organisasjoner: await respons.json(),
    });
};

type LoaderData = {
    organisasjoner: Organisasjon[];
};

const App = () => {
    const { organisasjoner } = useLoaderData<LoaderData>();

    useEffect(() => {
        settInnDekoratørHosKlienten();
    }, []);

    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <header>
                    <Header organisasjoner={organisasjoner} />
                </header>
                <Outlet />
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
            </body>
        </html>
    );
};

export default App;
