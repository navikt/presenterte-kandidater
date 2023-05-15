import { redirect, Response } from "@remix-run/node";
import { json } from "@remix-run/node";
import parse from "html-react-parser";
import {
    isRouteErrorResponse,
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { configureMock } from "./mocks";
import { cssBundleHref } from "@remix-run/css-bundle";
import { hentSsrDekoratør } from "./services/dekoratør.server";
import { hentMiljø, Miljø } from "./services/miljø";
import { Heading, Modal, Panel } from "@navikt/ds-react";
import { proxyTilApi } from "./services/api/proxy";
import { settInnDekoratørHosKlienten } from "./services/dekoratør";
import { useEffect } from "react";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import Header from "./components/header/Header";
import IngenOrganisasjoner from "./components/IngenOrganisasjoner";

import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Dekoratørfragmenter } from "./services/dekoratør";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

import css from "./root.module.css";

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

export const loader: LoaderFunction = async ({ request, context }) => {
    const miljø = hentMiljø();

    if (miljø === Miljø.Lokalt) {
        configureMock();
    } else {
        if (!context.erAutorisert) {
            throw new Response("Bruker er ikke autorisert", { status: 401 });
        }
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
        ssrDekoratør: await hentSsrDekoratør(),
        organisasjoner: await organisasjoner.json(),
    });
};

export type LoaderData = {
    ssrDekoratør: Dekoratørfragmenter | null;
    organisasjoner: Organisasjon[];
};

const App = () => {
    const { organisasjoner, ssrDekoratør } = useLoaderData<LoaderData>();

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

export const ErrorBoundary = () => {
    const error = useRouteError();

    useEffect(() => {
        if (isRouteErrorResponse(error) && error.status === 401) {
            redirectTilInnlogging();
        }
    });

    if (isRouteErrorResponse(error)) {
        return (
            <>
                <header>
                    <Header organisasjoner={[]} />
                </header>
                <Heading size="medium" level="2">
                    {error.status}-feil
                </Heading>
                <Panel>Det skjedde en uventet feil: {error.data.message}</Panel>
            </>
        );
    } else {
        return (
            <>
                <header>
                    <Header organisasjoner={[]} />
                </header>
                <Heading size="medium" level="2">
                    Ojsann!
                </Heading>
                <Panel>Det skjedde en feil – vennligst prøv igjen senere</Panel>
            </>
        );
    }
};

const redirectTilInnlogging = () => {
    if (typeof window !== "undefined") {
        window.location.href = `/kandidatliste/oauth2/login?redirect=${window.location.pathname}`;
    }
};

export default App;
