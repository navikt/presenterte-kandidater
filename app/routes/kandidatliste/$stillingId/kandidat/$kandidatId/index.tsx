import { useState } from "react";
import { Link, useActionData, useLoaderData, useParams, useTransition } from "@remix-run/react";
import { BodyShort, Button, ReadMore } from "@navikt/ds-react";
import { json, redirect } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { Back, Next } from "@navikt/ds-icons";
import KandidatCv, {
    KandidatUtenCv,
    links as kandidatCvLinks,
} from "~/components/kandidat-cv/KandidatCv";
import { Kandidatvurdering } from "~/services/domene";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import useVirksomhet from "~/services/useVirksomhet";
import css from "./index.css";
import Slettemodal from "~/components/slettemodal/Slettemodal";
import EndreVurdering from "~/components/endre-vurdering/EndreVurdering";

export const links: LinksFunction = () => [
    ...kandidatCvLinks(),
    {
        rel: "stylesheet",
        href: css,
    },
];

type LoaderData = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

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

const endreVurdering = async (
    request: Request,
    kandidatId: string,
    vurdering: Kandidatvurdering
) => {
    const respons = await proxyTilApi(request, `/kandidat/${kandidatId}/vurdering`, "PUT", {
        arbeidsgiversVurdering: vurdering,
    });

    if (respons.ok) {
        return null;
    } else {
        return json<ActionData>({
            endreVurdering: "Klarte ikke å endre vurdering",
        });
    }
};

const slett = async (request: Request, stillingId: string, kandidatId: string) => {
    const respons = await proxyTilApi(request, `/kandidat/${kandidatId}`, "DELETE");

    if (respons.ok) {
        return redirect(`/kandidatliste/${stillingId}`);
    } else {
        return json<ActionData>({
            slett: "Klarte ikke å slette kandidaten",
        });
    }
};

type Handling = "endre-vurdering" | "slett";

export type ActionData =
    | undefined
    | {
          slett?: string;
          endreVurdering?: string;
      };

export const action: ActionFunction = async ({ request, context, params }) => {
    const { stillingId, kandidatId } = params;
    if (stillingId === undefined || kandidatId === undefined) {
        throw new Error("Stilling eller kandidat er ikke definert");
    }

    const formData = await request.formData();
    const handling = formData.get("handling") as Handling;

    if (handling === "endre-vurdering") {
        return endreVurdering(request, kandidatId, formData.get("vurdering") as Kandidatvurdering);
    } else if (handling === "slett") {
        return slett(request, stillingId, kandidatId);
    } else {
        throw new Error("Ukjent handling");
    }
};

const Kandidatvisning = () => {
    const { stillingId } = useParams();
    const { kandidat, kandidatliste } = useLoaderData<LoaderData>();
    const [visSlettemodal, setVisSlettemodal] = useState<boolean>(false);
    const virksomhet = useVirksomhet();
    const feilmeldinger = useActionData<ActionData>();

    const transition = useTransition();
    const handling = transition.submission?.formData.get("handling");

    const [kandidatvurdering, setKandidatvurdering] = useState<Kandidatvurdering>(
        kandidat.kandidat.arbeidsgiversVurdering
    );

    const åpneSlettemodal = () => {
        setVisSlettemodal(true);
    };

    const lukkSlettemodal = () => {
        setVisSlettemodal(false);
    };

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

            <EndreVurdering
                kandidatliste={kandidatliste}
                vurdering={kandidatvurdering}
                setVurdering={setKandidatvurdering}
                feilmelding={feilmeldinger?.endreVurdering}
                endrerVurdering={handling === "endre-vurdering"}
            />

            <ReadMore header="Slik virker statusene">
                Statusene hjelper deg å holde oversikt over kandidatene NAV har sendt deg.
                <br />
                Informasjonen blir ikke formidlet videre til kandidaten eller NAV.
            </ReadMore>
            {kandidat.cv ? <KandidatCv cv={kandidat.cv} /> : <KandidatUtenCv />}

            <Button onClick={åpneSlettemodal} variant="secondary">
                Slett kandidat
            </Button>

            <Slettemodal
                vis={visSlettemodal}
                onClose={lukkSlettemodal}
                cv={kandidat.cv}
                feilmeldinger={feilmeldinger}
                sletterKandidat={handling === "slett"}
            />
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
