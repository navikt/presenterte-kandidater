import { useState } from "react";
import {
    Link,
    useActionData,
    useCatch,
    useLoaderData,
    useParams,
    useTransition,
} from "@remix-run/react";
import { Button, ReadMore } from "@navikt/ds-react";
import { json, redirect } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import { Back } from "@navikt/ds-icons";
import KandidatCv, { KandidatUtenCv } from "~/components/cv/Cv";
import { Kandidatvurdering } from "~/services/domene";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import useVirksomhet from "~/services/useVirksomhet";
import Slettemodal from "~/components/slettemodal/Slettemodal";
import EndreVurdering from "~/components/endre-vurdering/EndreVurdering";
import IkkeFunnet from "~/components/ikke-funnet/IkkeFunnet";
import css from "./index.module.css";

type LoaderData = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const { stillingId, kandidatId } = params;

    const respons = await proxyTilApi(request, `/kandidatliste/${stillingId}`);

    if (respons.ok) {
        const kandidatliste: Kandidatliste = await respons.json();

        const kandidat = kandidatliste.kandidater.find(
            (kandidat) => kandidat.kandidat.uuid === kandidatId
        );

        if (kandidat === undefined) {
            throw new Response("Fant ikke kandidaten.", { status: 404 });
        }

        return json({
            kandidat,
            kandidatliste,
        });
    } else {
        throw new Response("Fant ikke kandidatlisten. Har du skrevet riktig adresse?", {
            status: 404,
        });
    }
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

    return (
        <main className={"side " + css.kandidatside}>
            <Link
                to={`/kandidatliste/${stillingId}?virksomhet=${virksomhet}`}
                className="navds-link"
            >
                <Back aria-hidden />
                Alle kandidater
            </Link>

            <EndreVurdering
                kandidatliste={kandidatliste}
                vurdering={kandidatvurdering}
                setVurdering={setKandidatvurdering}
                feilmelding={feilmeldinger?.endreVurdering}
                endrerVurdering={handling === "endre-vurdering"}
            />

            <ReadMore header="Slik virker statusene" className={css.slikVirkerStatusene}>
                Statusene hjelper deg å holde oversikt over kandidatene NAV har sendt deg.
                <br />
                Informasjonen blir ikke formidlet videre til kandidaten eller NAV.
            </ReadMore>
            {kandidat.cv ? <KandidatCv cv={kandidat.cv} /> : <KandidatUtenCv />}

            <Button className={css.slettIKandidat} onClick={åpneSlettemodal} variant="secondary">
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

export const CatchBoundary = () => {
    const caught = useCatch();

    return <IkkeFunnet forklaring={caught.data} />;
};

export default Kandidatvisning;
