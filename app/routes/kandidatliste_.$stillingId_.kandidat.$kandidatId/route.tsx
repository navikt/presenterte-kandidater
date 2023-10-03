import { Button, ReadMore } from "@navikt/ds-react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    ShouldRevalidateFunction,
    isRouteErrorResponse,
    useActionData,
    useLoaderData,
    useNavigation,
    useParams,
    useRouteError,
} from "@remix-run/react";
import { useState } from "react";

import IkkeFunnet from "~/components/ikke-funnet/IkkeFunnet";
import Spørreskjemalenke from "~/components/spørreskjemalenke/Spørreskjemalenke";
import Tilbakelenke from "~/components/tilbakelenke/Tilbakelenke";
import { proxyTilApi } from "~/services/api/proxy";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import { Kandidatvurdering } from "~/services/domene";
import useVirksomhet from "~/services/useVirksomhet";
import KandidatCv, { KandidatUtenCv } from "./cv/Cv";
import EndreVurdering from "./endre-vurdering/EndreVurdering";
import css from "./route.module.css";
import type { ActionData } from "./routeAction";
import { routeAction } from "./routeAction";
import Slettemodal from "./slettemodal/Slettemodal";

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
        throw new Response("Fant ikke kandidatlisten", {
            status: 404,
        });
    }
};

export const action = routeAction;

export const shouldRevalidate: ShouldRevalidateFunction = ({
    formData,
    defaultShouldRevalidate,
}) => {
    const handling = formData?.get("handling");

    if (handling === "vis-kontaktinformasjon") {
        return false;
    } else {
        return defaultShouldRevalidate;
    }
};

const Kandidatvisning = () => {
    const { stillingId } = useParams();
    const { kandidat, kandidatliste } = useLoaderData<LoaderData>();
    const [visSlettemodal, setVisSlettemodal] = useState<boolean>(false);
    const virksomhet = useVirksomhet();
    const feilmeldinger = useActionData<ActionData>();

    const navigation = useNavigation();
    const handling = navigation.formData?.get("handling");

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
        <div className={css.kandidatside}>
            <Tilbakelenke href={`/kandidatliste/${stillingId}?virksomhet=${virksomhet}`}>
                Alle kandidater
            </Tilbakelenke>

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

            <Spørreskjemalenke />

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
        </div>
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

export const ErrorBoundary = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <IkkeFunnet forklaring={error.data.message} />;
        }
    }

    return null;
};

export default Kandidatvisning;
