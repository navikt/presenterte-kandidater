import bedriftsmenyStyles from "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import { BodyShort, Heading, Panel } from "@navikt/ds-react";
import { cssBundleHref } from "@remix-run/css-bundle";
import { json, redirect } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import parse from "html-react-parser";
import { useEffect } from "react";
import Header from "./components/header/Header";
import { configureMock } from "./mocks";
import IngenOrganisasjoner from "./routes/kandidatliste/IngenOrganisasjoner";
import { proxyTilApi } from "./services/api/proxy";
import { hentSsrDekoratør } from "./services/dekoratør/dekoratør.server";
import { Miljø, hentMiljø } from "./services/miljø";

import type { Organisasjon } from "@navikt/bedriftsmeny";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import type { ReactNode } from "react";
import type { Dekoratørfragmenter } from "./services/dekoratør/dekoratør.server";

import "@navikt/arbeidsgiver-notifikasjon-widget/lib/cjs/index.css";
import css from "./root.module.css";
import useInjectDecoratorScript from "./services/dekoratør/useInjectScript";

export const meta: MetaFunction = () => [
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
            return redirect(`/kandidatliste/oauth2/login?redirect=${request.url}`);
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

export const shouldRevalidate = () => false;

export type LoaderData = {
    dekoratør: Dekoratørfragmenter | null;
    organisasjoner: Organisasjon[];
};

const App = () => {
    const { organisasjoner, dekoratør } = useLoaderData<LoaderData>();

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
