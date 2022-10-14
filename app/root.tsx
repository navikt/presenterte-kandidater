import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
} from "@remix-run/react";
import Header, { links as headerLinks } from "./components/header/Header";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import rootStyles from "~/styles/root.css";
import * as Dekoratør from "./services/dekoratør";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Kandidater",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    ...headerLinks(),
    { rel: "stylesheet", href: rootStyles },
    { rel: "stylesheet", href: designsystemStyles },
];

const App = () => {
    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
                <Dekoratør.Styles />
            </head>
            <body>
                <header>
                    <Dekoratør.Header />
                    <Header />
                </header>
                <Outlet />
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                <Dekoratør.Footer />
                <Dekoratør.Env />
                <Dekoratør.Scripts />
            </body>
        </html>
    );
};

export default App;
