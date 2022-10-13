import { Heading, BodyLong } from "@navikt/ds-react";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import css from "~/styles/index.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

const Kandidatlister = () => {
    return (
        <main className="kandidatlister">
            <Heading size="medium">Kandidater</Heading>
            <BodyLong>Liste over kandidatlister</BodyLong>
        </main>
    );
};

export default Kandidatlister;
