import { redirect, Response } from "@remix-run/node";
import { json } from "@remix-run/node";
import parse from "html-react-parser";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
    useCatch,
    useLoaderData,
} from "@remix-run/react";
import { configureMock } from "./mocks";
import { cssBundleHref } from "@remix-run/css-bundle";
import { hentDekoratør } from "./services/dekoratør.server";
import { hentMiljø, Miljø } from "./services/miljø";
import { Modal, Panel } from "@navikt/ds-react";
import { proxyTilApi } from "./services/api/proxy";
import { settInnDekoratørHosKlienten } from "./services/dekoratør";
import { useEffect } from "react";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import Header from "./components/header/Header";
import IngenOrganisasjoner from "./components/IngenOrganisasjoner";

import type {
    ErrorBoundaryComponent,
    LinksFunction,
    LoaderFunction,
    MetaFunction,
} from "@remix-run/node";
import type { Dekoratørfragmenter } from "./services/dekoratør";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

import css from "./root.module.css";
import { CatchBoundaryComponent } from "@remix-run/react/dist/routeModules";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Foreslåtte kandidater",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: designsystemStyles },
    { rel: "stylesheet", href: bedriftsmenyStyles },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = async ({ request }) => {
    const miljø = hentMiljø();

    if (miljø === Miljø.Lokalt) {
        configureMock();
    }

    const [samtykke, organisasjoner] = await Promise.all([
        proxyTilApi(request, "/samtykke"),
        proxyTilApi(request, "/organisasjoner"),
    ]);

    if (organisasjoner.status === 307) {
        throw new Response("Du er ikke logget inn", {
            status: 401,
        });
    }

    const samtykkeside = "/kandidatliste/samtykke";
    const erPåSamtykkeside = new URL(request.url).pathname !== samtykkeside;

    if (!samtykke.ok && erPåSamtykkeside) {
        return redirect(samtykkeside);
    }

    const dekoratør = miljø === Miljø.ProdGcp ? null : await hentDekoratør();

    return json({
        dekoratør,
        organisasjoner: await organisasjoner.json(),
    });
};

type LoaderData = {
    dekoratør: Dekoratørfragmenter | null;
    organisasjoner: Organisasjon[];
};

const App = () => {
    const { organisasjoner, dekoratør: ssrDekoratør } = useLoaderData<LoaderData>();

    useEffect(() => {
        if (ssrDekoratør === null) {
            settInnDekoratørHosKlienten();
        }

        Modal.setAppElement(document.getElementsByTagName("body"));
    }, [ssrDekoratør]);

    const visning = organisasjoner.length === 0 ? <IngenOrganisasjoner /> : <Outlet />;

    return (
        <html lang="nb">
            <head>
                <Meta />
                <Links />
                {ssrDekoratør && parse(ssrDekoratør.styles)}
            </head>
            <body>
                <div className={css.header}>
                    {ssrDekoratør && parse(ssrDekoratør.header)}
                    <Header organisasjoner={organisasjoner} />
                </div>
                <main className={css.side}>{visning}</main>
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                {ssrDekoratør && parse(ssrDekoratør.footer)}
                {ssrDekoratør && parse(ssrDekoratør.scripts)}
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
                <Panel>Det skjedde en uventet feil: {error.message}</Panel>
                <RemixScripts />
            </body>
        </html>
    );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
    const error = useCatch();

    useEffect(() => {
        if (error.status === 302) {
            window.location.href = `/kandidatliste/oauth2/login?redirect=${window.location.pathname}`;
        }
    }, [error]);

    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Panel>{error.statusText}</Panel>
                <RemixScripts />
            </body>
        </html>
    );
};

export default App;
