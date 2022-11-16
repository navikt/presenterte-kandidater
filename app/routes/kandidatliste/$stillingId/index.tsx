import { Accordion, Heading, Panel } from "@navikt/ds-react";
import { visVurdering } from "./kandidat/$kandidatId";
import { Back, Close, DecisionCheck, ExternalLink, Helptext, Like } from "@navikt/ds-icons";
import { json } from "@remix-run/node";
import { Link as NavLink } from "@navikt/ds-react";
import { Link, useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { ReactNode } from "react";
import type { Kandidat, Kandidatliste, Kandidatvurdering } from "~/services/domene";
import Kandidatsammendrag, {
    links as kandidatsammendragLinks,
} from "~/components/kandidatsammendrag/Kandidatsammendrag";
import css from "./index.css";

export const links: LinksFunction = () => [
    ...kandidatsammendragLinks(),
    {
        rel: "stylesheet",
        href: css,
    },
];

export const loader: LoaderFunction = async ({ request, params }) => {
    const stillingId = params.stillingId;
    const respons = await proxyTilApi(request, `/kandidatlister/${stillingId}`);

    return json(await respons.json());
};

const Kandidatlistevisning = () => {
    const { kandidatliste, kandidater } = useLoaderData<Kandidatliste>();
    const { tittel, stillingId } = kandidatliste;

    console.log("ALLE", kandidatliste, kandidater);

    return (
        <main className="side">
            <Link to="/kandidatliste" className="navds-link">
                <Back />
                Alle oppdrag
            </Link>
            <Panel className="kandidatlistevisning">
                <Heading size="medium">{tittel}</Heading>

                <NavLink href={`https://www.nav.no/arbeid/stilling/${stillingId}`} target="__blank">
                    Se stilling
                    <ExternalLink />
                </NavLink>

                <GruppeMedKandidater
                    vurdering="TIL_VURDERING"
                    icon={<Helptext />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    vurdering="AKTUELL"
                    icon={<Like />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    vurdering="FÅTT_JOBBEN"
                    icon={<DecisionCheck />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    vurdering="IKKE_AKTUELL"
                    icon={<Close />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />
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
    vurdering: Kandidatvurdering;
    icon: ReactNode;
    kandidater: Kandidat[];
    stillingId: string;
}) => {
    const kandidaterMedGittStatus = kandidater.filter(
        (kandidat) => kandidat.vurdering === vurdering
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

export default Kandidatlistevisning;
