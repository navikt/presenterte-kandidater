import { Link, useLoaderData, useParams } from "@remix-run/react";
import { BodyShort, Radio, RadioGroup, ReadMore, ToggleGroup } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { Back, Close, DecisionCheck, Helptext, Like, Next } from "@navikt/ds-icons";
import KandidatCv, {
    KandidatUtenCv,
    links as kandidatCvLinks,
} from "~/components/kandidat-cv/KandidatCv";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import { Kandidatvurdering } from "~/services/domene";
import css from "./index.css";

export const links: LinksFunction = () => [
    ...kandidatCvLinks(),
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const { stillingId, kandidatId } = params;

    const respons = await proxyTilApi(request, `/kandidatliste/${stillingId}`);
    const kandidatliste: Kandidatliste = await respons.json();
    const kandidat = kandidatliste.kandidater.find(
        (kandidat) => kandidat.kandidat.uuid === kandidatId
    );

    return json({
        kandidat,
        kandidatliste,
    });
};

export const action: ActionFunction = async ({ request, context, params }) => {
    const { stillingId, kandidatId } = params;

    const data = await request.formData();
    const vurdering = data.get("vurdering");

    proxyTilApi(request, `/kandidatliste/${stillingId}/kandidat/${kandidatId}/vurdering`, "POST", {
        vurdering,
    });
};

type LoaderData = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

const Kandidatvisning = () => {
    const { stillingId } = useParams();
    const { kandidat, kandidatliste } = useLoaderData<LoaderData>();

    const kandidaterMedSammeStatus = kandidatliste.kandidater.filter(
        (annenKandidat) => annenKandidat.kandidat.vurdering === kandidat.kandidat.vurdering
    );

    const plasseringTilKandidat = kandidaterMedSammeStatus.findIndex(
        (annenKandidat) => annenKandidat.kandidat.uuid === kandidat.kandidat.uuid
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
                        {visVurdering(kandidat.kandidat.vurdering)} (
                        {kandidaterMedSammeStatus.length})
                    </b>
                </BodyShort>
                {forrigeKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${stillingId}/kandidat/${forrigeKandidatMedSammeStatus.kandidat.uuid}`}
                        className="navds-link"
                    >
                        <Back />
                        Forrige
                    </Link>
                )}
                {nesteKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${stillingId}/kandidat/${nesteKandidatMedSammeStatus.kandidat.uuid}`}
                        className="navds-link"
                    >
                        Neste
                        <Next />
                    </Link>
                )}
            </div>
            <ToggleGroup
                className="kandidatside--velg-status-desktop"
                defaultValue={kandidat.kandidat.vurdering}
                label={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                onChange={console.log}
            >
                <ToggleGroup.Item value={Kandidatvurdering.TilVurdering}>
                    <Helptext aria-hidden={true} />
                    Til vurdering
                </ToggleGroup.Item>
                <ToggleGroup.Item value={Kandidatvurdering.IkkeAktuell}>
                    <Close aria-hidden={true} />
                    Ikke aktuell
                </ToggleGroup.Item>
                <ToggleGroup.Item value={Kandidatvurdering.Aktuell}>
                    <Like aria-hidden={true} />
                    Aktuell
                </ToggleGroup.Item>
                <ToggleGroup.Item value={Kandidatvurdering.FåttJobben}>
                    <DecisionCheck aria-hidden={true} />
                    Fått jobben
                </ToggleGroup.Item>
            </ToggleGroup>
            <RadioGroup
                className="kandidatside--velg-status-mobil"
                legend={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                defaultValue={kandidat.kandidat.vurdering}
                onChange={console.log}
            >
                <Radio value="Å_VURDERE">Å vurdere</Radio>
                <Radio value="IKKE_AKTUELL">Ikke aktuell</Radio>
                <Radio value="AKTUELL">Aktuell</Radio>
                <Radio value="FÅTT_JOBBEN">Fått jobben</Radio>
            </RadioGroup>
            <ReadMore header="Slik virker statusene">
                Statusene hjelper deg å holde oversikt over kandidatene NAV har sendt deg.
                <br />
                Informasjonen blir ikke formidlet videre til kandidaten eller NAV.
            </ReadMore>
            {kandidat.cv ? <KandidatCv cv={kandidat.cv} /> : <KandidatUtenCv />}
        </main>
    );
};

export const visVurdering = (vurdering?: Kandidatvurdering) => {
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
            return "Ikke vurdert";
    }
};

export default Kandidatvisning;
