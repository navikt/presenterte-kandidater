import { useEffect } from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import { sendEvent } from "~/services/amplitude";
import useVirksomhet from "~/services/useVirksomhet";
import VisKandidatlistesammendrag from "~/routes/kandidatliste/kandidatlistesammendrag/Kandidatlistesammendrag";

import type { Kandidatlistesammendrag } from "~/services/domene";
import type { LoaderFunction } from "@remix-run/node";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import type { LoaderData as RootLoaderData } from "~/root";

import css from "./route.module.css";

export const loader: LoaderFunction = async ({ request }) => {
    let virksomhet = hentValgtVirksomhet(request.url);

    if (!virksomhet) {
        const organisasjoner = await proxyTilApi(request, "/organisasjoner");
        virksomhet = hentFørsteVirksomhetsnummer(await organisasjoner.json());
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
    const virksomhet = useVirksomhet();
    const { harRiktigRolleIAltinn, sammendrag } = useLoaderData<LoaderData>();
    const { organisasjoner } = useRouteLoaderData("root") as RootLoaderData;

    const { aktive, avsluttede } = fordelPåStatus(sammendrag);

    useEffect(() => {
        sendEvent("app", "visning", {
            antallOrganisasjoner: organisasjoner.length,
            antallAktive: aktive.length,
            antallAvsluttede: avsluttede.length,
        });
    }, [organisasjoner.length, aktive, avsluttede]);

    if (!harRiktigRolleIAltinn) {
        return (
            <main className={"side " + css.kandidatlister}>
                <Heading level="2" size="small">
                    Ikke tilgang
                </Heading>
                <BodyShort>Du mangler korrekt rolle eller enkeltrettighet</BodyShort>
            </main>
        );
    }

    return (
        <div className={css.kandidatlister}>
            <Heading level="2" size="small">
                Aktive rekrutteringsprosesser
            </Heading>

            {aktive.length > 0 ? (
                <ul className={css.gruppe}>
                    {aktive.map((sammendrag) => (
                        <VisKandidatlistesammendrag
                            key={sammendrag.kandidatliste.stillingId}
                            sammendrag={sammendrag}
                        />
                    ))}
                </ul>
            ) : (
                <BodyShort className={css.tomGruppe}>
                    <em>Ingen aktive rekrutteringsprosesser</em>
                </BodyShort>
            )}

            <Heading level="2" size="small">
                Avsluttede rekrutteringsprosesser
            </Heading>

            {avsluttede.length > 0 ? (
                <ul className={css.gruppe}>
                    {avsluttede.map((sammendrag) => (
                        <VisKandidatlistesammendrag
                            key={sammendrag.kandidatliste.stillingId}
                            sammendrag={sammendrag}
                        />
                    ))}
                </ul>
            ) : (
                <BodyShort className={css.tomGruppe}>
                    <em>Ingen avsluttede rekrutteringsprosesser</em>
                </BodyShort>
            )}
            <div className={css.samtykkelenke}>
                <Link
                    className="navds-link"
                    to={`/kandidatliste/samtykke?virksomhet=${virksomhet}`}
                >
                    Vilkår for tjenesten
                </Link>
            </div>
        </div>
    );
};

const fordelPåStatus = (sammendrag: Kandidatlistesammendrag[]) => {
    const aktive: Kandidatlistesammendrag[] = [];
    const avsluttede: Kandidatlistesammendrag[] = [];

    (sammendrag ?? []).forEach((sammendrag) => {
        if (sammendrag.kandidatliste.status === "ÅPEN") {
            aktive.push(sammendrag);
        } else {
            avsluttede.push(sammendrag);
        }
    });

    return {
        aktive,
        avsluttede,
    };
};

const hentValgtVirksomhet = (url: string) => new URL(url).searchParams.get("virksomhet");

const hentFørsteVirksomhetsnummer = (organisasjoner: Organisasjon[]) =>
    organisasjoner.filter((org) => org.Type === "Business")[0]?.OrganizationNumber;

export default Kandidatlister;
