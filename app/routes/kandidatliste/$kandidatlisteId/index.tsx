import type { LinksFunction } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { Heading } from "@navikt/ds-react";
import css from "./index.css";

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: css,
    },
];

const Kandidatliste = () => {
    const { kandidatlisteId } = useParams();

    return (
        <>
            <main className="side">
                <Link to="/kandidatliste">Tilbake</Link>
                <Heading size="medium">Kandidatliste {kandidatlisteId}</Heading>
                <ul>
                    <li>
                        <Link to={`/kandidatliste/${kandidatlisteId}/ABC`}>Kandidat "ABC"</Link>
                    </li>
                </ul>
            </main>
        </>
    );
};

export default Kandidatliste;
