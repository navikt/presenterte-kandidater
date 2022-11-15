import { BodyShort, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import Kandidatoppsummering, {
    links as kandidatoppsummeringCss,
} from "~/components/kandidatlisteoppsummering/Kandidatlisteoppsummering";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { Kandidatlisteoppsummering } from "~/services/domene";
import css from "./index.css";

export const links: LinksFunction = () => [
    ...kandidatoppsummeringCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request }) => {
    // TODO: Bruk virksomhet fra bedriftsmeny
    const virksomhetsnummer = "912998827";

    const respons = await proxyTilApi(
        request,
        `/kandidatlister?virksomhetsnummer=${virksomhetsnummer}`
    );

    return json(await respons.json());
};

const Kandidatlister = () => {
    const oppsummeringer = useLoaderData<Kandidatlisteoppsummering[]>();
    const { pågående, avsluttede } = fordelPåStatus(oppsummeringer);

    return (
        <main className="side kandidatlister">
            <Heading level="2" size="small">
                Pågående oppdrag
            </Heading>

            <ul className="kandidatlister--gruppe">
                {pågående.map((oppsummering) => (
                    <Kandidatoppsummering
                        key={oppsummering.kandidatliste.stillingId}
                        oppsummering={oppsummering}
                    />
                ))}
            </ul>

            <Heading level="2" size="small">
                Avsluttede oppdrag
            </Heading>

            {avsluttede.length === 0 && (
                <BodyShort>
                    <em>Ingen avsluttede oppdrag</em>
                </BodyShort>
            )}
            <ul className="kandidatlister--gruppe">
                {avsluttede.map((oppsummering) => (
                    <Kandidatoppsummering
                        key={oppsummering.kandidatliste.stillingId}
                        oppsummering={oppsummering}
                    />
                ))}
            </ul>
        </main>
    );
};

const fordelPåStatus = (oppsummeringer: Kandidatlisteoppsummering[]) => {
    const pågående: Kandidatlisteoppsummering[] = [];
    const avsluttede: Kandidatlisteoppsummering[] = [];

    oppsummeringer.forEach((oppsummering) => {
        if (oppsummering.kandidatliste.status === "ÅPEN") {
            pågående.push(oppsummering);
        } else {
            avsluttede.push(oppsummering);
        }
    });

    return {
        pågående,
        avsluttede,
    };
};

export default Kandidatlister;
