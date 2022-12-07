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
import { virksomhetErFeatureTogglet } from "~/services/api/featureToggle";

export const links: LinksFunction = () => [
    ...kandidatsammendragCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const organisasjonerRespons = await proxyTilApi(request, "/organisasjoner");
    const organisasjoner: Organisasjon[] = await organisasjonerRespons.json();

    const virksomhetSomSearchParam = new URL(request.url).searchParams.get("virksomhet");
    const virksomhetsnummer =
        virksomhetSomSearchParam || hentFørsteVirksomhetsnummer(organisasjoner);

    if (!virksomhetErFeatureTogglet(virksomhetsnummer)) {
        return json({
            harRiktigRolleIAltinn: false,
            organisasjoner,
        });
    } else {
        let harRiktigRolleIAltinn = false;
        const kandidatlisterRespons = await proxyTilApi(
            request,
            `/kandidatlister?virksomhetsnummer=${virksomhetsnummer}`
        );

        logger.info(
            `Henting av kandidatlister med url "/kandidatlister?virksomhetsnummer=${virksomhetsnummer}" gav statuskode ${kandidatlisterRespons.status}`
        );

        let sammendrag = [];
        if (kandidatlisterRespons.ok) {
            harRiktigRolleIAltinn = true;
            sammendrag = await kandidatlisterRespons.json();
        }

        try {
            return json({
                sammendrag,
                organisasjoner,
                harRiktigRolleIAltinn,
            });
        } catch (e) {
            logger.error("Klarte ikke å hente kandidatliste:", e);
        }
    }
};

type LoaderData =
    | {
          harRiktigRolleIAltinn: false;
          organisasjoner: Organisasjon[];
      }
    | {
          harRiktigRolleIAltinn: true;
          sammendrag: Kandidatlistesammendrag[];
          organisasjoner: Organisasjon[];
      };

const Kandidatlister = () => {
    const loaderData = useLoaderData<LoaderData>();

    if (loaderData.organisasjoner.length === 0) {
        return (
            <main className="side kandidatlister">
                <Heading level="2" size="small">
                    Ikke tilgang
                </Heading>
                <BodyShort>Du representerer ingen organisasjoner</BodyShort>
            </main>
        );
    }

    if (!loaderData.harRiktigRolleIAltinn) {
        return (
            <main className="side kandidatlister">
                <Heading level="2" size="small">
                    Ikke tilgang
                </Heading>
                <BodyShort>Du mangler korrekt rolle eller enkeltrettighet</BodyShort>
            </main>
        );
    }

    const { pågående, avsluttede } = fordelPåStatus(loaderData.sammendrag);

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
