import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Detail, Heading } from "@navikt/ds-react";
import { proxyTilApi } from "~/services/api/proxy";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { Kandidat } from "./$kandidatId";
import css from "./index.css";

export type Kandidatliste = {
    stillingId: string;
    tittel: string;
    status: string;
    slettet: boolean;
    virksomhetsnummer: string;
    opprettetTidspunkt: string;
    kandidater: Kandidat[];
};

export enum Kandidatlistestatus {
    Åpen = "ÅPEN",
    Lukket = "LUKKET",
}

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const stillingId = params.stillingId;
    const respons = await proxyTilApi(request, `/kandidatlister/${stillingId}`);

    return json(await respons.json());
};

const Kandidatlistevisning = () => {
    const kandidatliste = useLoaderData<Kandidatliste>();
    const { tittel, stillingId } = kandidatliste;

    return (
        <>
            <main className="side">
                <Link to="/kandidatliste">Tilbake</Link>
                <Detail>Kandidatliste for stilling {stillingId}</Detail>
                <Heading size="medium">{tittel}</Heading>
                <ul>
                    {kandidatliste.kandidater.map((kandidat) => (
                        <li key={kandidat.kandidatId}>
                            <Link to={`/kandidatliste/${stillingId}/${kandidat.kandidatId}`}>
                                <span>{kandidat.kandidat.fornavn} </span>
                                <span>{kandidat.kandidat.etternavn} </span>
                                <span>({kandidat.kandidatId})</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
};

export default Kandidatlistevisning;
