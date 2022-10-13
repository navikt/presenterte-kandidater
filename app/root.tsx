import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Kandidater",
    viewport: "width=device-width,initial-scale=1",
});

const App = () => {
    return (
        <html lang="no">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
};

export default App;
