import type { LinksFunction } from "@remix-run/node";
import { Heading } from "@navikt/ds-react";
import css from "./Header.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: css }];
};

const Header = () => {
    return (
        <div className="arbeidsgiver-header">
            <div className="arbeidsgiver-header--inner">
                <Heading size="large">Kandidater</Heading>
            </div>
        </div>
    );
};

export default Header;
