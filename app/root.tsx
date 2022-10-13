import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import Header, { links as headerLinks } from "./components/header/Header";
import designsystemStyles from "@navikt/ds-css/dist/index.css";
import rootStyles from "~/styles/root.css";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Kandidater",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
    return [
        ...headerLinks(),
        { rel: "stylesheet", href: rootStyles },
        { rel: "stylesheet", href: designsystemStyles },
    ];
};

const App = () => {
    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Header />
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
};

export default App;
