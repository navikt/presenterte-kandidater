import { Link, useLoaderData, useParams } from "@remix-run/react";
import { BodyShort, ReadMore, ToggleGroup } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { AddPerson, Back, Close, Helptext, Like, Next } from "@navikt/ds-icons";
import KandidatCv, { links as kandidatCvLinks } from "~/components/kandidat-cv/KandidatCv";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import type { Kandidatliste } from "../index";
import css from "./index.css";
import { Kandidatstatus } from "~/services/domene";

export const links: LinksFunction = () => [
    ...kandidatCvLinks(),
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const { kandidatId, stillingId } = params;

    const [kandidat, kandidatliste] = await Promise.all([
        proxyTilApi(request, `/kandidatlister/${stillingId}/${kandidatId}`),
        proxyTilApi(request, `/kandidatlister/${stillingId}`),
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
    const { stillingId } = useParams();

    const { kandidat, kandidatliste } = useLoaderData<LoaderData>();
    const { kandidatId } = kandidat;

    const kandidaterMedSammeStatus = kandidatliste.kandidater.filter(
        (annenKandidat) => annenKandidat.arbeidsgiversStatus === kandidat.arbeidsgiversStatus
    );

    const plasseringTilKandidat = kandidaterMedSammeStatus.findIndex(
        (annenKandidat) => annenKandidat.kandidatId === kandidatId
    );
    const nesteKandidatMedSammeStatus = kandidaterMedSammeStatus[plasseringTilKandidat + 1];
    const forrigeKandidatMedSammeStatus = kandidaterMedSammeStatus[plasseringTilKandidat - 1];

    return (
        <main className="side kandidatside">
            <Link to={`/kandidatliste/${stillingId}`} className="navds-link">
                <Back />
                Alle kandidater
            </Link>
            <div className="kandidatside--navigering">
                <BodyShort>
                    <b>
                        {visArbeidsgiversStatus(kandidat.arbeidsgiversStatus)} (
                        {kandidaterMedSammeStatus.length})
                    </b>
                </BodyShort>
                {forrigeKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${stillingId}/${forrigeKandidatMedSammeStatus.kandidatId}`}
                        className="navds-link"
                    >
                        <Back />
                        Forrige
                    </Link>
                )}
                {nesteKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${stillingId}/${nesteKandidatMedSammeStatus.kandidatId}`}
                        className="navds-link"
                    >
                        Neste
                        <Next />
                    </Link>
                )}
            </div>
            <ToggleGroup
                defaultValue={kandidat.arbeidsgiversStatus}
                label={`For stilling: ${kandidatliste.tittel}`}
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
                    <AddPerson aria-hidden={true} />
                    Fått jobben
                </ToggleGroup.Item>
            </ToggleGroup>
            <ReadMore header="Slik virker statusene">
                Statusene hjelper deg å holde styr på kandidatene NAV sendt deg.
                <br />
                Informasjonen blir ikke sendt over til kandidat eller NAV.
            </ReadMore>
            <KandidatCv cv={kandidat.kandidat} />
        </main>
    );
};

export const visArbeidsgiversStatus = (arbeidsgiversStatus: Kandidatstatus) => {
    switch (arbeidsgiversStatus) {
        case "Å_VURDERE":
            return "Å vurdere";
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
