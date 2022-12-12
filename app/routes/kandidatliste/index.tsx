import { BodyShort, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import { links as kandidatsammendragCss } from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import VisKandidatlistesammendrag from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { Kandidatlistesammendrag } from "~/services/domene";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

import css from "./index.css";
import { virksomhetErFeatureTogglet } from "~/services/api/featureToggle";

export const links: LinksFunction = () => [
    ...kandidatsammendragCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request }) => {
    let virksomhet = hentValgtVirksomhet(request.url);

    if (!virksomhet) {
        const organisasjoner = await proxyTilApi(request, "/organisasjoner");
        virksomhet = hentFørsteVirksomhetsnummer(await organisasjoner.json());
    }

    // Feature-toggle
    if (!virksomhetErFeatureTogglet(virksomhet)) {
        return json({
            harRiktigRolleIAltinn: false,
        });
    }

    const kandidatlister = await proxyTilApi(
        request,
        `/kandidatlister?virksomhetsnummer=${virksomhet}`
    );

    if (!kandidatlister.ok) {
        return json({
            harRiktigRolleIAltinn: false,
        });
    }

    return json({
        harRiktigRolleIAltinn: true,
        sammendrag: await kandidatlister.json(),
    });
};

type LoaderData = {
    harRiktigRolleIAltinn: boolean;
    sammendrag: Kandidatlistesammendrag[];
};

const Kandidatlister = () => {
    const { harRiktigRolleIAltinn, sammendrag } = useLoaderData<LoaderData>();

    if (!harRiktigRolleIAltinn) {
        return (
            <main className="side kandidatlister">
                <Heading level="2" size="small">
                    Ikke tilgang
                </Heading>
                <BodyShort>Du mangler korrekt rolle eller enkeltrettighet</BodyShort>
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

const hentValgtVirksomhet = (url: string) => new URL(url).searchParams.get("virksomhet");

const hentFørsteVirksomhetsnummer = (organisasjoner: Organisasjon[]) =>
    organisasjoner.filter((org) => org.Type === "Business")[0]?.OrganizationNumber;

export default Kandidatlister;
