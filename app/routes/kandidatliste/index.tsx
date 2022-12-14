import { BodyShort, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { links as kandidatsammendragCss } from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import { proxyTilApi } from "~/services/api/proxy";
import { Link, useLoaderData } from "@remix-run/react";
import type { Kandidatlistesammendrag } from "~/services/domene";
import type { LinksFunction } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/node";
import type { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import VisKandidatlistesammendrag from "~/components/kandidatlistesammendrag/Kandidatlistesammendrag";
import css from "./index.css";
import useVirksomhet from "~/services/useVirksomhet";

export const links: LinksFunction = () => [
    ...kandidatsammendragCss(),
    { rel: "stylesheet", href: css },
];

export const loader: LoaderFunction = async ({ request }) => {
    let virksomhet = hentValgtVirksomhet(request.url);

    if (!virksomhet) {
        const organisasjoner = await proxyTilApi(request, "/organisasjoner");
        virksomhet = hentFĂ¸rsteVirksomhetsnummer(await organisasjoner.json());
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
            <main className="side kandidatlister">
                <Heading level="2" size="small">
                    Ikke tilgang
                </Heading>
                <BodyShort>Du mangler korrekt rolle eller enkeltrettighet</BodyShort>
            </main>
        );
    }

    const { pĂĄgĂĄende, avsluttede } = fordelPĂĄStatus(sammendrag);

    return (
        <main className="side kandidatlister">
            <Heading level="2" size="small">
                PĂĄgĂĄende oppdrag
            </Heading>

            {pĂĄgĂĄende.length > 0 ? (
                <ul className="kandidatlister__gruppe">
                    {pĂĄgĂĄende.map((sammendrag) => (
                        <VisKandidatlistesammendrag
                            key={sammendrag.kandidatliste.stillingId}
                            sammendrag={sammendrag}
                        />
                    ))}
                </ul>
            ) : (
                <BodyShort className="kandidatlister__tom-gruppe">
                    <em>Ingen pĂĄgĂĄende oppdrag</em>
                </BodyShort>
            )}

            <Heading level="2" size="small">
                Avsluttede oppdrag
            </Heading>

            {avsluttede.length > 0 ? (
                <ul className="kandidatlister__gruppe">
                    {avsluttede.map((sammendrag) => (
                        <VisKandidatlistesammendrag
                            key={sammendrag.kandidatliste.stillingId}
                            sammendrag={sammendrag}
                        />
                    ))}
                </ul>
            ) : (
                <BodyShort className="kandidatlister__tom-gruppe">
                    <em>Ingen avsluttede oppdrag</em>
                </BodyShort>
            )}
            <div className="kandidatlister__samtykkelenke">
                <Link
                    className="navds-link"
                    to={`/kandidatliste/samtykke?virksomhet=${virksomhet}`}
                >
                    VilkĂĄr for tjenesten
                </Link>
            </div>
        </main>
    );
};

const fordelPĂĄStatus = (sammendrag: Kandidatlistesammendrag[]) => {
    const pĂĄgĂĄende: Kandidatlistesammendrag[] = [];
    const avsluttede: Kandidatlistesammendrag[] = [];

    sammendrag.forEach((sammendrag) => {
        if (sammendrag.kandidatliste.status === "Ă…PEN") {
            pĂĄgĂĄende.push(sammendrag);
        } else {
            avsluttede.push(sammendrag);
        }
    });

    return {
        pĂĄgĂĄende,
        avsluttede,
    };
};

const hentValgtVirksomhet = (url: string) => new URL(url).searchParams.get("virksomhet");

const hentFĂ¸rsteVirksomhetsnummer = (organisasjoner: Organisasjon[]) =>
    organisasjoner.filter((org) => org.Type === "Business")[0]?.OrganizationNumber;

export default Kandidatlister;
