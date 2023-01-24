import { BodyLong, Heading, Panel } from "@navikt/ds-react";
import { Close, ExternalLink } from "@navikt/ds-icons";
import { json, Response } from "@remix-run/node";
import { Link as NavLink } from "@navikt/ds-react";
import { useCatch, useLoaderData } from "@remix-run/react";

import { Kandidatvurdering } from "~/services/domene";
import { proxyTilApi } from "~/services/api/proxy";
import IkkeFunnet from "~/components/ikke-funnet/IkkeFunnet";
import Tilbakelenke from "~/components/tilbakelenke/Tilbakelenke";
import useVirksomhet from "~/services/useVirksomhet";
import Vurderingsikon from "~/components/endre-vurdering/Vurderingsikon";
import GruppeMedKandidater from "~/components/gruppeMedKandidater/GruppeMedKandidater";

import type { LoaderFunction } from "@remix-run/node";
import type { Kandidatliste } from "~/services/domene";

import css from "./index.module.css";

export const loader: LoaderFunction = async ({ request, params }) => {
    const stillingId = params.stillingId;
    const respons = await proxyTilApi(request, `/kandidatliste/${stillingId}`);

    if (respons.ok) {
        return json(await respons.json());
    } else {
        throw new Response("Fant ikke kandidatlisten. Har du skrevet inn riktig adresse?", {
            status: 404,
        });
    }
};

const Kandidatlistevisning = () => {
    const { kandidatliste, kandidater } = useLoaderData<Kandidatliste>();
    const { tittel, stillingId } = kandidatliste;
    const virksomhet = useVirksomhet();

    return (
        <div className={css.kandidatlisteside}>
            <Tilbakelenke href={`/kandidatliste?virksomhet=${virksomhet}`}>
                Alle rekrutteringsprosesser
            </Tilbakelenke>

            <Panel className={css.kandidatlistevisning}>
                <Heading aria-label={`Kandidater til stilling «${tittel}»`} level="2" size="medium">
                    {tittel}
                </Heading>

                <NavLink href={`https://www.nav.no/arbeid/stilling/${stillingId}`} target="__blank">
                    Se stilling
                    <ExternalLink aria-hidden />
                </NavLink>

                {kandidater.length === 0 ? (
                    <BodyLong>Det er foreløpig ingen kandidater i denne kandidatlisten.</BodyLong>
                ) : (
                    <>
                        <GruppeMedKandidater
                            vurdering={Kandidatvurdering.TilVurdering}
                            icon={<Vurderingsikon vurdering={Kandidatvurdering.TilVurdering} />}
                            kandidater={kandidater}
                            stillingId={stillingId}
                        />

                        <GruppeMedKandidater
                            vurdering={Kandidatvurdering.Aktuell}
                            icon={<Vurderingsikon vurdering={Kandidatvurdering.Aktuell} />}
                            kandidater={kandidater}
                            stillingId={stillingId}
                        />

                        <GruppeMedKandidater
                            vurdering={Kandidatvurdering.FåttJobben}
                            icon={<Vurderingsikon vurdering={Kandidatvurdering.FåttJobben} />}
                            kandidater={kandidater}
                            stillingId={stillingId}
                        />

                        <GruppeMedKandidater
                            vurdering={Kandidatvurdering.IkkeAktuell}
                            icon={<Vurderingsikon vurdering={Kandidatvurdering.IkkeAktuell} />}
                            kandidater={kandidater}
                            stillingId={stillingId}
                        />

                        <GruppeMedKandidater
                            icon={<Close />}
                            kandidater={kandidater}
                            stillingId={stillingId}
                        />
                    </>
                )}
            </Panel>
        </div>
    );
};

export const CatchBoundary = () => {
    const caught = useCatch();

    return <IkkeFunnet forklaring={caught.data} />;
};

export default Kandidatlistevisning;
