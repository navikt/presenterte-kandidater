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
import hentDekoratør from "./services/dekoratør";
import rootCss from "./root.css";
import type { Dekoratørfragmenter } from "./services/dekoratør";
import { initializeMock } from "./mocks";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Kandidater",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    ...headerLinks(),
    { rel: "stylesheet", href: rootCss },
    { rel: "stylesheet", href: designsystemStyles },
];

export const loader: LoaderFunction = async () => {
    initializeMock();

    return await hentDekoratør();
};

const App = () => {
    const { styles, header, footer, scripts } = useLoaderData<Dekoratørfragmenter>();

    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
                {parse(styles)}
            </head>
            <body>
                <header>
                    {parse(header)}
                    <Header />
                </header>
                <Outlet />
                <ScrollRestoration />
                <RemixScripts />
                <LiveReload />
                {parse(footer)}
                {parse(scripts)}
            </body>
        </html>
    );
};

export default App;
