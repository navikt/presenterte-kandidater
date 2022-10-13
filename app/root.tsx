import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts as RemixScripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import Header, { links as headerLinks } from "./components/header/Header";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import rootStyles from "~/styles/root.css";
import hentDekoratør from "./services/dekoratør";

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

export const loader: LoaderFunction = async () => {
    return hentDekoratør();
};

const App = () => {
    const { Styles, Scripts, Header: NavHeader, Footer } = useLoaderData();

    return (
        <html lang="no">
            <head>
                <div dangerouslySetInnerHTML={{ __html: Styles }} />
                <div dangerouslySetInnerHTML={{ __html: Scripts }} />
                <Meta />
                <Links />
            </head>
            <body>
                <header>
                    <div dangerouslySetInnerHTML={{ __html: NavHeader }} />
                    <Header />
                </header>
                <Outlet />
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                <footer dangerouslySetInnerHTML={{ __html: Footer }} />
            </body>
        </html>
    );
};

export default App;
