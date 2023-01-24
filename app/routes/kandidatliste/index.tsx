import { BodyShort, Heading } from "@navikt/ds-react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { Link, useLoaderData } from "@remix-run/react";
import type { Kandidatlistesammendrag } from "~/services/domene";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import VisKandidatlistesammendrag from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import useVirksomhet from "~/services/useVirksomhet";
import css from "./index.module.css";

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

    const { pågående, avsluttede } = fordelPåStatus(sammendrag);

    return (
        <div className={css.kandidatlister}>
            <Heading level="2" size="small">
                Aktive rekrutteringsprosesser
            </Heading>

            {pågående.length > 0 ? (
                <ul className={css.gruppe}>
                    {pågående.map((sammendrag) => (
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
