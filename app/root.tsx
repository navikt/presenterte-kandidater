import { useEffect } from "react";
import { redirect, Response } from "@remix-run/node";
import { json } from "@remix-run/node";
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
import { BodyShort, Heading, Modal, Panel } from "@navikt/ds-react";
import { proxyTilApi } from "./services/api/proxy";
import { settInnDekoratørHosKlienten } from "./services/dekoratør";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import Header from "./components/header/Header";
import IngenOrganisasjoner from "./routes/kandidatliste/IngenOrganisasjoner";

import type { ReactNode } from "react";
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

    return <Dokument organisasjoner={organisasjoner}>{visning}</Dokument>;
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
            <Dokument>
                <Heading spacing size="large" level="2">
                    {error.status}
                </Heading>
                <Panel>
                    <BodyShort>Det skjedde en uventet feil</BodyShort>
                    <BodyShort>{error.data.message}</BodyShort>
                </Panel>
            </Dokument>
        );
    } else {
        return (
            <Dokument>
                <Heading spacing size="large" level="2">
                    Ojsann!
                </Heading>
                <Panel>
                    <BodyShort>Det skjedde en uventet feil.</BodyShort>
                    <BodyShort>Vennligst prøv igjen senere</BodyShort>
                </Panel>
            </Dokument>
        );
    }
};

const Dokument = ({
    organisasjoner = [],
    children,
}: {
    organisasjoner?: Organisasjon[];
    children: ReactNode;
}) => (
    <html lang="nb">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
            <div className={css.header}>
                <Header organisasjoner={organisasjoner} />
            </div>
            <main className={css.side}>{children}</main>
            <ScrollRestoration />
            <RemixScripts />
            <LiveReload />
        </body>
    </html>
);

const redirectTilInnlogging = () => {
    if (typeof window !== "undefined") {
        window.location.href = `/kandidatliste/oauth2/login?redirect=${window.location.pathname}`;
    }
};

export default App;
