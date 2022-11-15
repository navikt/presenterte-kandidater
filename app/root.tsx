import { json, LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import parse from "html-react-parser";
import Header from "./components/header/Header";
import hentDekoratør from "./services/dekoratør";
import type { Dekoratørfragmenter } from "./services/dekoratør";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { configureMock } from "./mocks";

import rootCss from "./root.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/index.css";
import { proxyTilApi } from "./services/api/proxy";
import { hentMiljø, Miljø } from "./services/miljø";
import mockedeOrganisasjoner from "./mocks/mockOrganisasjoner";

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

    const respons = mockedeOrganisasjoner; // await proxyTilApi(request, "/organisasjoner");

    return json({
        dekoratør: await hentDekoratør(),
        organisasjoner: respons, // await respons.json(),
    });
};

type LoaderData = {
    dekoratør: Dekoratørfragmenter;
    organisasjoner: Organisasjon[];
};

const App = () => {
    const { dekoratør, organisasjoner } = useLoaderData<LoaderData>();
    const { styles, header, footer, scripts } = dekoratør;

    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
                {parse(styles)}
            </head>
            <body>
                <header>
                    {parse(header)}
                    <Header organisasjoner={organisasjoner} />
                </header>
                <Outlet />
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                {parse(footer)}
                {parse(scripts)}
            </body>
        </html>
    );
};

export default App;
