import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { BodyShort, Button, Radio, RadioGroup, ReadMore, ToggleGroup } from "@navikt/ds-react";
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
    const { kandidatId } = params;

    const data = await request.formData();
    const arbeidsgiversVurdering = data.get("arbeidsgiversVurdering");

    const respons = await proxyTilApi(request, `/kandidat/${kandidatId}/vurdering`, "PUT", {
        arbeidsgiversVurdering: arbeidsgiversVurdering,
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
            <Link to={`/kandidatliste/${stillingId}`} className="navds-link">
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
            <Form method="put">
                <ToggleGroup
                    className="kandidatside--velg-status-desktop"
                    label={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                    defaultValue={kandidat.kandidat.arbeidsgiversVurdering}
                    onChange={() => {}}
                >
                    <ToggleGroup.Item
                        // @ts-ignore
                        type="submit"
                        value={Kandidatvurdering.TilVurdering}
                    >
                        <Helptext aria-hidden={true} />
                        Til vurdering
                        <input
                            type="hidden"
                            name="arbeidsgiversVurdering"
                            value={Kandidatvurdering.TilVurdering}
                        />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                        // @ts-ignore
                        type="submit"
                        value={Kandidatvurdering.IkkeAktuell}
                    >
                        <Close aria-hidden={true} />
                        Ikke aktuell
                        <input
                            type="hidden"
                            name="arbeidsgiversVurdering"
                            value={Kandidatvurdering.IkkeAktuell}
                        />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                        // @ts-ignore
                        type="submit"
                        value={Kandidatvurdering.Aktuell}
                    >
                        <Like aria-hidden={true} />
                        Aktuell
                        <input
                            type="hidden"
                            name="arbeidsgiversVurdering"
                            value={Kandidatvurdering.Aktuell}
                        />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                        // @ts-ignore
                        type="submit"
                        value={Kandidatvurdering.FåttJobben}
                    >
                        <DecisionCheck aria-hidden={true} />
                        Fått jobben
                        <input
                            type="hidden"
                            name="arbeidsgiversVurdering"
                            value={Kandidatvurdering.FåttJobben}
                        />
                    </ToggleGroup.Item>
                </ToggleGroup>
                <RadioGroup
                    className="kandidatside--velg-status-mobil"
                    legend={`For stilling: ${kandidatliste.kandidatliste.tittel}`}
                    defaultValue={kandidat.kandidat.arbeidsgiversVurdering}
                    name="vurdering"
                >
                    <Radio value={Kandidatvurdering.TilVurdering}>Til vurdering</Radio>
                    <Radio value={Kandidatvurdering.IkkeAktuell}>Ikke aktuell</Radio>
                    <Radio value={Kandidatvurdering.Aktuell}>Aktuell</Radio>
                    <Radio value={Kandidatvurdering.FåttJobben}>Fått jobben</Radio>
                    <Button type="submit" variant="primary">
                        Endre vurdering
                    </Button>
                </RadioGroup>
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
