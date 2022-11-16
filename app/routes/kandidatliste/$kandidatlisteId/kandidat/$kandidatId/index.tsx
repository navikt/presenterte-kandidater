import { Link, useLoaderData, useParams } from "@remix-run/react";
import { BodyShort, Radio, RadioGroup, ReadMore, ToggleGroup } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { Back, Close, DecisionCheck, Helptext, Like, Next } from "@navikt/ds-icons";
import KandidatCv, { links as kandidatCvLinks } from "~/components/kandidat-cv/KandidatCv";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import type { Kandidat, Kandidatliste, Kandidatvurdering } from "~/services/domene";
import css from "./index.css";

export const links: LinksFunction = () => [
    ...kandidatCvLinks(),
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const { kandidatId, kandidatlisteId } = params;

    const [kandidat, kandidatliste] = await Promise.all([
        proxyTilApi(request, `/kandidatlister/${kandidatlisteId}/kandidat/${kandidatId}`),
        proxyTilApi(request, `/kandidatlister/${kandidatlisteId}`),
    ]);

    return json({
        kandidat: await kandidat.json(),
        kandidatliste: await kandidatliste.json(),
    });
};

type LoaderData = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

const Kandidatvisning = () => {
    const { kandidatlisteId } = useParams();
    const { kandidat, kandidatliste } = useLoaderData<LoaderData>();

    const kandidaterMedSammeStatus = kandidatliste.kandidater.filter(
        (annenKandidat) => annenKandidat.vurdering === kandidat.vurdering
    );

    const plasseringTilKandidat = kandidaterMedSammeStatus.findIndex(
        (annenKandidat) => annenKandidat.kandidat.uuid === kandidat.kandidat.uuid
    );
    const nesteKandidatMedSammeStatus = kandidaterMedSammeStatus[plasseringTilKandidat + 1];
    const forrigeKandidatMedSammeStatus = kandidaterMedSammeStatus[plasseringTilKandidat - 1];

    return (
        <main className="side kandidatside">
            <Link to={`/kandidatliste/${kandidatlisteId}`} className="navds-link">
                <Back />
                Alle kandidater
            </Link>
            <div className="kandidatside--navigering">
                <BodyShort>
                    <b>
                        {visVurdering(kandidat.vurdering)} ({kandidaterMedSammeStatus.length})
                    </b>
                </BodyShort>
                {forrigeKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${kandidatlisteId}/kandidat/${forrigeKandidatMedSammeStatus.kandidat.uuid}`}
                        className="navds-link"
                    >
                        <Back />
                        Forrige
                    </Link>
                )}
                {nesteKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${kandidatlisteId}/kandidat/${nesteKandidatMedSammeStatus.kandidat.uuid}`}
                        className="navds-link"
                    >
                        Neste
                        <Next />
                    </Link>
                )}
            </div>
            <ToggleGroup
                className="kandidatside--velg-status-desktop"
                defaultValue={kandidat.vurdering}
                label={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                onChange={console.log}
            >
                <ToggleGroup.Item value="Å_VURDERE">
                    <Helptext aria-hidden={true} />Å vurdere
                </ToggleGroup.Item>
                <ToggleGroup.Item value="IKKE_AKTUELL">
                    <Close aria-hidden={true} />
                    Ikke aktuell
                </ToggleGroup.Item>
                <ToggleGroup.Item value="AKTUELL">
                    <Like aria-hidden={true} />
                    Aktuell
                </ToggleGroup.Item>
                <ToggleGroup.Item value="FÅTT_JOBBEN">
                    <DecisionCheck aria-hidden={true} />
                    Fått jobben
                </ToggleGroup.Item>
            </ToggleGroup>
            <RadioGroup
                className="kandidatside--velg-status-mobil"
                legend={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                defaultValue={kandidat.vurdering}
                onChange={console.log}
            >
                <Radio value="Å_VURDERE">Å vurdere</Radio>
                <Radio value="IKKE_AKTUELL">Ikke aktuell</Radio>
                <Radio value="AKTUELL">Aktuell</Radio>
                <Radio value="FÅTT_JOBBEN">Fått jobben</Radio>
            </RadioGroup>
            <ReadMore header="Slik virker statusene">
                Statusene hjelper deg å holde styr på kandidatene NAV sendt deg.
                <br />
                Informasjonen blir ikke sendt over til kandidat eller NAV.
            </ReadMore>
            <KandidatCv cv={kandidat.cv} />
        </main>
    );
};

export const visVurdering = (vurdering: Kandidatvurdering) => {
    switch (vurdering) {
        case "TIL_VURDERING":
            return "Til vurdering";
        case "IKKE_AKTUELL":
            return "Ikke aktuell";
        case "AKTUELL":
            return "Aktuell";
        case "FÅTT_JOBBEN":
            return "Fått jobben";
        default:
            return "Ukjent status";
    }
};

export default Kandidatvisning;
