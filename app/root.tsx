import {
    ActionFunction,
    ErrorBoundaryComponent,
    LinksFunction,
    LoaderFunction,
    MetaFunction,
    redirect,
} from "@remix-run/node";
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
import { Panel } from "@navikt/ds-react";
import IngenOrganisasjoner from "./components/IngenOrganisasjoner";

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

    const [samtykke, organisasjoner] = await Promise.all([
        proxyTilApi(request, "/samtykke"),
        proxyTilApi(request, "/organisasjoner"),
    ]);
    console.log("samtykke", samtykke);
    console.log("request.url", request.url);

    if (!samtykke.ok && new URL(request.url).pathname !== "/kandidatliste/samtykke") {
        return redirect("/kandidatliste/samtykke");
    }

    return json({
        organisasjoner: await organisasjoner.json(),
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

    let visning = <Outlet />;

    if (organisasjoner.length === 0) {
        visning = <IngenOrganisasjoner />;
    }

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
                {visning}
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
            </body>
        </html>
    );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <header>
                    <Header organisasjoner={[]} />
                </header>
                <Panel>Det skjedde en feil: {error.message}</Panel>
                <RemixScripts />
            </body>
        </html>
    );
};

export default App;
