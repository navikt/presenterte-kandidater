import { Heading, BodyLong } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/server-runtime";
import css from "~/styles/index.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

const Kandidatlister = () => {
    return (
        <main className="kandidatlister">
            <Heading size="medium">Kandidatlister</Heading>
            <BodyLong>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </BodyLong>
        </main>
    );
};

export default Kandidatlister;
