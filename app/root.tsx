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
import { hentSsrDekoratør } from "./services/dekoratør/dekoratør.server";
import { hentMiljø, Miljø } from "./services/miljø";
import { BodyShort, Heading, Modal, Panel } from "@navikt/ds-react";
import { proxyTilApi } from "./services/api/proxy";
import parse from "html-react-parser";
import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import Header from "./components/header/Header";
import IngenOrganisasjoner from "./routes/kandidatliste/IngenOrganisasjoner";

import type { ReactNode } from "react";
import type { V2_MetaFunction } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import type { Dekoratørfragmenter } from "./services/dekoratør/dekoratør.server";

import css from "./root.module.css";
import useInjectDecoratorScript from "./services/dekoratør/useInjectScript";

export const meta: V2_MetaFunction = () => [
    {
        title: "Foreslåtte kandidater",
    },
];

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
        dekoratør: await hentSsrDekoratør(),
        organisasjoner: await organisasjoner.json(),
    });
};

export type LoaderData = {
    dekoratør: Dekoratørfragmenter | null;
    organisasjoner: Organisasjon[];
};

const App = () => {
    const { organisasjoner, dekoratør } = useLoaderData<LoaderData>();

    useEffect(() => {
        Modal.setAppElement(document.getElementsByTagName("body"));
    }, [dekoratør]);

    const visning = organisasjoner.length === 0 ? <IngenOrganisasjoner /> : <Outlet />;

    return (
        <Dokument dekoratør={dekoratør || undefined} organisasjoner={organisasjoner}>
            {visning}
        </Dokument>
    );
};

const Dokument = ({
    dekoratør,
    organisasjoner = [],
    children,
}: {
    dekoratør?: Dekoratørfragmenter;
    organisasjoner?: Organisasjon[];
    children: ReactNode;
}) => {
    useInjectDecoratorScript(dekoratør?.scripts);

    return (
        <html lang="nb">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
                {dekoratør && parse(dekoratør.styles)}
            </head>
            <body>
                {dekoratør && parse(dekoratør.header)}
                <div className={css.header}>
                    <Header organisasjoner={organisasjoner} />
                </div>
                <main className={css.side}>{children}</main>
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                {dekoratør && parse(dekoratør.footer)}
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

const redirectTilInnlogging = () => {
    if (typeof window !== "undefined") {
        window.location.href = `/kandidatliste/oauth2/login?redirect=${window.location.pathname}`;
    }
};

export default App;
