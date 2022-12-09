import { useState } from "react";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { BodyShort, Button, Radio, RadioGroup, ReadMore, ToggleGroup } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { Back, Next } from "@navikt/ds-icons";
import KandidatCv, {
    KandidatUtenCv,
    links as kandidatCvLinks,
} from "~/components/kandidat-cv/KandidatCv";
import { Kandidatvurdering } from "~/services/domene";
import Vurderingsikon from "~/components/Vurderingsikon";
import type { FunctionComponent } from "react";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import useVirksomhet from "~/services/useVirksomhet";
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
    const { kandidatId } = params;

    const data = await request.formData();
    const vurdering = data.get("vurdering");
    const respons = await proxyTilApi(request, `/kandidat/${kandidatId}/vurdering`, "PUT", {
        arbeidsgiversVurdering: vurdering,
    });

    if (respons.ok) {
        return null;
    } else {
        throw new Error("Klarte ikke å endre vurdering");
    }
};

type LoaderData = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

const Kandidatvisning = () => {
    const { stillingId } = useParams();
    const { kandidat, kandidatliste } = useLoaderData<LoaderData>();
    const virksomhet = useVirksomhet();

    const [kandidatvurdering, setKandidatvurdering] = useState<Kandidatvurdering>(
        kandidat.kandidat.arbeidsgiversVurdering
    );

    const kandidaterMedSammeStatus = kandidatliste.kandidater.filter(
        (annenKandidat) =>
            annenKandidat.kandidat.arbeidsgiversVurdering ===
            kandidat.kandidat.arbeidsgiversVurdering
    );

    const plasseringTilKandidat = kandidaterMedSammeStatus.findIndex(
        (annenKandidat) => annenKandidat.kandidat.uuid === kandidat.kandidat.uuid
    );
    const nesteKandidatMedSammeStatus = kandidaterMedSammeStatus[plasseringTilKandidat + 1];
    const forrigeKandidatMedSammeStatus = kandidaterMedSammeStatus[plasseringTilKandidat - 1];

    return (
        <main className="side kandidatside">
            <Link
                to={`/kandidatliste/${stillingId}?virksomhet=${virksomhet}`}
                className="navds-link"
            >
                <Back />
                Alle kandidater
            </Link>
            <div className="kandidatside--navigering">
                <BodyShort>
                    <b>
                        {visVurdering(kandidat.kandidat.arbeidsgiversVurdering)} (
                        {kandidaterMedSammeStatus.length})
                    </b>
                </BodyShort>
                {forrigeKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${stillingId}/kandidat/${forrigeKandidatMedSammeStatus.kandidat.uuid}?virksomhet=${virksomhet}`}
                        className="navds-link"
                    >
                        <Back />
                        Forrige
                    </Link>
                )}
                {nesteKandidatMedSammeStatus && (
                    <Link
                        to={`/kandidatliste/${stillingId}/kandidat/${nesteKandidatMedSammeStatus.kandidat.uuid}?virksomhet=${virksomhet}`}
                        className="navds-link"
                    >
                        Neste
                        <Next />
                    </Link>
                )}
            </div>
            <Form method="put">
                <ToggleGroup
                    className="kandidatside--velg-status-desktop"
                    label={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                    value={kandidatvurdering}
                    onChange={(value) => setKandidatvurdering(value as Kandidatvurdering)}
                >
                    {Object.values(Kandidatvurdering).map((vurdering) => (
                        <Vurderingsvalg
                            key={vurdering}
                            vurdering={vurdering}
                            valgtVurdering={kandidatvurdering}
                        />
                    ))}
                </ToggleGroup>

                <RadioGroup
                    className="kandidatside--velg-status-mobil"
                    legend={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                    value={kandidatvurdering}
                    onChange={setKandidatvurdering}
                >
                    {Object.values(Kandidatvurdering).map((vurdering) => (
                        <Radio key={vurdering} value={vurdering}>
                            {visVurdering(vurdering)}
                        </Radio>
                    ))}
                    <Button type="submit" variant="primary">
                        Endre vurdering
                    </Button>
                </RadioGroup>
                <input type="hidden" name="vurdering" value={kandidatvurdering} />
            </Form>

            <ReadMore header="Slik virker statusene">
                Statusene hjelper deg å holde oversikt over kandidatene NAV har sendt deg.
                <br />
                Informasjonen blir ikke formidlet videre til kandidaten eller NAV.
            </ReadMore>
            {kandidat.cv ? <KandidatCv cv={kandidat.cv} /> : <KandidatUtenCv />}
        </main>
    );
};

type VurderingsvalgProps = {
    valgtVurdering: Kandidatvurdering;
    vurdering: Kandidatvurdering;
};

const Vurderingsvalg: FunctionComponent<VurderingsvalgProps> = ({ vurdering }) => {
    return (
        <ToggleGroup.Item
            // @ts-ignore
            type="submit"
            name="vurdering"
            value={vurdering}
        >
            <Vurderingsikon vurdering={vurdering} />
            {visVurdering(vurdering)}
        </ToggleGroup.Item>
    );
};

export const visVurdering = (vurdering?: Kandidatvurdering) => {
    switch (vurdering) {
        case Kandidatvurdering.TilVurdering:
            return "Til vurdering";
        case Kandidatvurdering.IkkeAktuell:
            return "Ikke aktuell";
        case Kandidatvurdering.Aktuell:
            return "Aktuell";
        case Kandidatvurdering.FåttJobben:
            return "Fått jobben";
        default:
            return "Ikke vurdert";
    }
};

export default Kandidatvisning;
