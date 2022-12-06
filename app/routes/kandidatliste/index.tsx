import { BodyShort, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import { logger } from "server/logger";
import { links as kandidatsammendragCss } from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import VisKandidatlistesammendrag from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { Kandidatlistesammendrag } from "~/services/domene";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

import css from "./index.css";

export const links: LinksFunction = () => [
    ...kandidatsammendragCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const respons = await proxyTilApi(request, "/organisasjoner");
    const organisasjoner: Organisasjon[] = await respons.json();

    const virksomhetSomSearchParam = new URL(request.url).searchParams.get("virksomhet");
    const virksomhetsnummer =
        virksomhetSomSearchParam || hentFørsteVirksomhetsnummer(organisasjoner);

    let sammendrag = [];

    if (virksomhetsnummer) {
        const respons = await proxyTilApi(
            request,
            `/kandidatlister?virksomhetsnummer=${virksomhetsnummer}`
        );
        console.log(
            `/kandidatlister?virksomhetsnummer=${virksomhetsnummer} git status kode: ${respons.status}`
        );

        if (respons.status == 200) {
            sammendrag = await respons.json();
            console.log(
                `Fikk ${sammendrag.length} kandidatlister på virksomhet ${virksomhetsnummer}`
            );
        }
    }

    try {
        return json({
            sammendrag,
            organisasjoner,
        });
    } catch (e) {
        logger.error("Klarte ikke å hente kandidatliste:", e);
    }
};

type LoaderData = {
    sammendrag: Kandidatlistesammendrag[];
    organisasjoner: Organisasjon[];
};

const Kandidatlister = () => {
    const { sammendrag, organisasjoner } = useLoaderData<LoaderData>();

    if (organisasjoner.length === 0) {
        return (
            <main className="side kandidatlister">
                <BodyShort>Du representerer ingen organisasjoner</BodyShort>
            </main>
        );
    }

    const { pågående, avsluttede } = fordelPåStatus(sammendrag);

    return (
        <main className="side kandidatlister">
            <Heading level="2" size="small">
                Pågående oppdrag
            </Heading>

            {pågående.length === 0 && (
                <BodyShort>
                    <em>Ingen pågående oppdrag</em>
                </BodyShort>
            )}

            <ul className="kandidatlister--gruppe">
                {pågående.map((sammendrag) => (
                    <VisKandidatlistesammendrag
                        key={sammendrag.kandidatliste.stillingId}
                        sammendrag={sammendrag}
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
                {avsluttede.map((sammendrag) => (
                    <VisKandidatlistesammendrag
                        key={sammendrag.kandidatliste.stillingId}
                        sammendrag={sammendrag}
                    />
                ))}
            </ul>
        </main>
    );
};

const fordelPåStatus = (sammendrag: Kandidatlistesammendrag[]) => {
    const pågående: Kandidatlistesammendrag[] = [];
    const avsluttede: Kandidatlistesammendrag[] = [];

    sammendrag.forEach((sammendrag) => {
        if (sammendrag.kandidatliste.status === "ÅPEN") {
            pågående.push(sammendrag);
        } else {
            avsluttede.push(sammendrag);
        }
    });

    return {
        pågående,
        avsluttede,
    };
};

const hentFørsteVirksomhetsnummer = (organisasjoner: Organisasjon[]) =>
    organisasjoner.filter((org) => org.Type === "Business")[0]?.OrganizationNumber;

export default Kandidatlister;
