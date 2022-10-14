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
import parse from "html-react-parser";
import Header, { links as headerLinks } from "./components/header/Header";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import hentDekoratør, * as Dekoratør from "./services/dekoratør";
import rootStyles from "~/styles/root.css";
import { ReactNode } from "react";

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
    return await hentDekoratør();
};

const App = () => {
    const { Styles, Header: NavHeader, Footer, Scripts } = useLoaderData();

    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
                {parse(Styles)}
            </head>
            <body>
                <header>
                    {parse(NavHeader)}
                    <Header />
                </header>
                <Outlet />
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                {parse(Footer)}
                {parse(Scripts)}
            </body>
        </html>
    );
};

export default App;
