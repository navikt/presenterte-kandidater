import { Heading, BodyLong } from "@navikt/ds-react";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import css from "./index.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

const Kandidatlister = () => {
    return (
        <main className="side kandidatlister">
            <Heading size="medium">Kandidatlister</Heading>
            <BodyLong>Liste over kandidatlister</BodyLong>
            <ul>
                <li>
                    <Link to="/kandidatliste/123">Kandidatliste "123"</Link>
                </li>
            </ul>
        </main>
    );
};

export default Kandidatlister;
