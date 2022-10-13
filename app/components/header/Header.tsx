import type { LinksFunction } from "@remix-run/node";
import { Heading } from "@navikt/ds-react";
import css from "./Header.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

const Header = () => {
    return (
        <header>
            <Heading size="large">Kandidater</Heading>
        </header>
    );
};

export default Header;