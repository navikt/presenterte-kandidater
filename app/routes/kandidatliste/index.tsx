import { Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import { Kandidatlistestatus } from "./$stillingId";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { Kandidatliste } from "./$stillingId";
import Kandidatlisteforhåndsvisning, {
    links as forhåndsvisningCss,
} from "~/components/kandidatlisteforhåndsvisning/Kandidatlisteforhåndsvisning";
import css from "./index.css";

export const links: LinksFunction = () => [
    ...forhåndsvisningCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request }) => {
    const respons = await proxyTilApi(request, "/kandidatlister");

    return json(await respons.json());
};

const Kandidatlister = () => {
    const kandidatlister = useLoaderData<Kandidatliste[]>();

    const { pågående, avsluttede } = fordelPåStatus(kandidatlister);

    return (
        <main className="side kandidatlister">
            <Heading level="2" size="small">
                Pågående oppdrag
            </Heading>

            <ul className="kandidatlister--gruppe">
                {pågående.map((kandidatliste) => (
                    <Kandidatlisteforhåndsvisning
                        key={kandidatliste.stillingId}
                        kandidatliste={kandidatliste}
                    />
                ))}
            </ul>

            <Heading level="2" size="small">
                Avsluttede oppdrag
            </Heading>

            <ul className="kandidatlister--gruppe">
                {avsluttede.map((kandidatliste) => (
                    <Kandidatlisteforhåndsvisning
                        key={kandidatliste.stillingId}
                        kandidatliste={kandidatliste}
                    />
                ))}
            </ul>
        </main>
    );
};

const fordelPåStatus = (kandidatlister: Kandidatliste[]) => {
    const pågående: Kandidatliste[] = [];
    const avsluttede: Kandidatliste[] = [];

    kandidatlister.forEach((kandidatliste) => {
        if (kandidatliste.status === Kandidatlistestatus.Åpen) {
            pågående.push(kandidatliste);
        } else {
            avsluttede.push(kandidatliste);
        }
    });

    return {
        pågående,
        avsluttede,
    };
};

export default Kandidatlister;
