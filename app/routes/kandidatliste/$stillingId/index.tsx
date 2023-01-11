import { Accordion, BodyLong, Heading, Panel } from "@navikt/ds-react";
import { visVurdering } from "./kandidat/$kandidatId";
import { Back, Close, ExternalLink } from "@navikt/ds-icons";
import { json, Response } from "@remix-run/node";
import { Link as NavLink } from "@navikt/ds-react";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { ReactNode } from "react";
import type { Kandidat, Kandidatliste } from "~/services/domene";
import { Kandidatvurdering } from "~/services/domene";
import Kandidatsammendrag, {
    links as kandidatsammendragLinks,
} from "~/components/kandidatsammendrag/Kandidatsammendrag";
import css from "./index.css";
import useVirksomhet from "~/services/useVirksomhet";
import IkkeFunnet, { links as ikkeFunnetLinks } from "~/components/ikke-funnet/IkkeFunnet";
import Vurderingsikon from "~/components/endre-vurdering/Vurderingsikon";

export const links: LinksFunction = () => [
    ...kandidatsammendragLinks(),
    ...ikkeFunnetLinks(),
    {
        rel: "stylesheet",
        href: css,
    },
];

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
        <main className="side kandidatlisteside">
            <Link
                to={`/kandidatliste?virksomhet=${virksomhet}`}
                className="navds-link kandidatlisteside__tilbakelenke"
            >
                <Back />
                Alle oppdrag
            </Link>
            <Panel className="kandidatlistevisning">
                <Heading size="medium">{tittel}</Heading>

                <NavLink href={`https://www.nav.no/arbeid/stilling/${stillingId}`} target="__blank">
                    Se stilling
                    <ExternalLink />
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
        </main>
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
        <Accordion className="gruppe-med-kandidater">
            <Accordion.Item defaultOpen={kandidaterMedGittStatus.length > 0}>
                <Accordion.Header>
                    <div className="gruppe-med-kandidater--header">
                        {icon}
                        <span>
                            {visVurdering(vurdering)} ({kandidaterMedGittStatus.length})
                        </span>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    <ul className="gruppe-med-kandidater--kandidater">
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
