import { Accordion, BodyLong, Heading, Panel } from "@navikt/ds-react";
import { visVurdering } from "./kandidat/$kandidatId";
import { Back, Close, ExternalLink } from "@navikt/ds-icons";
import { json, Response } from "@remix-run/node";
import { Link as NavLink } from "@navikt/ds-react";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import type { LoaderFunction } from "@remix-run/node";
import type { ReactNode } from "react";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import { Kandidatvurdering } from "~/services/domene";
import useVirksomhet from "~/services/useVirksomhet";
import IkkeFunnet from "~/components/ikke-funnet/IkkeFunnet";
import Vurderingsikon from "~/components/endre-vurdering/Vurderingsikon";
import Kandidatsammendrag from "~/components/kandidatsammendrag/Kandidatsammendrag";
import css from "./index.module.css";
import Tilbakelenke from "~/components/tilbakelenke/Tilbakelenke";

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

const GruppeMedKandidater = ({
    vurdering,
    icon,
    kandidater,
    stillingId,
}: {
    vurdering?: Kandidatvurdering;
    icon: ReactNode;
    kandidater: Kandidat[];
    stillingId: string;
}) => {
    const kandidaterMedGittStatus = kandidater.filter(
        (kandidat) => kandidat.kandidat.arbeidsgiversVurdering === vurdering
    );

    if (kandidaterMedGittStatus.length === 0) {
        return null;
    }

    return (
        <Accordion className={css.gruppeMedKandidater}>
            <Accordion.Item defaultOpen={kandidaterMedGittStatus.length > 0}>
                <Accordion.Header>
                    <div className={css.header}>
                        {icon}
                        <Heading level="3" size="small">
                            {visVurdering(vurdering)} ({kandidaterMedGittStatus.length})
                        </Heading>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    <ul className={css.kandidater}>
                        {kandidaterMedGittStatus.map((kandidat) => (
                            <Kandidatsammendrag
                                key={kandidat.kandidat.uuid}
                                kandidat={kandidat}
                                stillingId={stillingId}
                            />
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export const CatchBoundary = () => {
    const caught = useCatch();

    return <IkkeFunnet forklaring={caught.data} />;
};

export default Kandidatlistevisning;
