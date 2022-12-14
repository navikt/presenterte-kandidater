import type {
    ErrorBoundaryComponent,
    LinksFunction,
    LoaderFunction,
    MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
import { configureMock } from "./mocks";
import { hentMiljø, Miljø } from "./services/miljø";
import { Panel } from "@navikt/ds-react";
import { proxyTilApi } from "./services/api/proxy";
import { settInnDekoratørHosKlienten } from "./services/dekoratør";
import { useEffect } from "react";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import Header from "./components/header/Header";
import IngenOrganisasjoner from "./components/IngenOrganisasjoner";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import rootCss from "./root.css";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Foreslåtte kandidater",
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

    const samtykkeside = "/kandidatliste/samtykke";
    const erPåSamtykkeside = new URL(request.url).pathname !== samtykkeside;
    if (!samtykke.ok && erPåSamtykkeside) {
        return redirect(samtykkeside);
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

    const visning = organisasjoner.length === 0 ? <IngenOrganisasjoner /> : <Outlet />;

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
