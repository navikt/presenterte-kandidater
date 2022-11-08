import { Accordion, Heading, Panel } from "@navikt/ds-react";
import { ArbeidsgiversStatus, visArbeidsgiversStatus } from "./$kandidatId";
import { Back, Close, Helptext, Like, Next } from "@navikt/ds-icons";
import { json } from "@remix-run/node";
import { Link as NavLink } from "@navikt/ds-react";
import { Link, useLoaderData } from "@remix-run/react";
import { proxyTilApi } from "~/services/api/proxy";
import type { Kandidat } from "./$kandidatId";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { ReactNode } from "react";
import Kandidatoppsummering, {
    links as kandidatoppsumeringLinks,
} from "~/components/kandidatoppsummering/Kandidatoppsummering";
import css from "./index.css";

export type Kandidatliste = {
    stillingId: string;
    tittel: string;
    status: string;
    slettet: boolean;
    virksomhetsnummer: string;
    opprettetTidspunkt: string;
    kandidater: Kandidat[];
};

export enum Kandidatlistestatus {
    Åpen = "ÅPEN",
    Lukket = "LUKKET",
}

export const links: LinksFunction = () => [
    ...kandidatoppsumeringLinks(),
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
    const kandidatliste = useLoaderData<Kandidatliste>();
    const { tittel, stillingId, kandidater } = kandidatliste;

    return (
        <>
            <Panel as="main" className="side kandidatlistevisning">
                <Link to="/kandidatliste" className="navds-link">
                    <Back />
                    Tilbake
                </Link>
                <Heading size="medium">{tittel}</Heading>

                <NavLink href={`https://www.nav.no/arbeid/stilling/${stillingId}`}>
                    Se stilling
                    <Next />
                </NavLink>

                <GruppeMedKandidater
                    status={ArbeidsgiversStatus.ÅVurdere}
                    icon={<Helptext />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    status={ArbeidsgiversStatus.Aktuell}
                    icon={<Like />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    status={ArbeidsgiversStatus.IkkeAktuell}
                    icon={<Close />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                />
            </Panel>
        </>
    );
};

const GruppeMedKandidater = ({
    status,
    icon,
    kandidater,
    stillingId,
}: {
    status: ArbeidsgiversStatus;
    icon: ReactNode;
    kandidater: Kandidat[];
    stillingId: string;
}) => {
    const kandidaterMedGittStatus = kandidater.filter(
        (kandidat) => kandidat.arbeidsgiversStatus === status
    );

    return (
        <Accordion className="gruppe-med-kandidater">
            <Accordion.Item defaultOpen={kandidaterMedGittStatus.length > 0}>
                <Accordion.Header>
                    <div className="gruppe-med-kandidater--header">
                        {icon}
                        <span>
                            {visArbeidsgiversStatus(status)} ({kandidaterMedGittStatus.length})
                        </span>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    <ul className="gruppe-med-kandidater--kandidater">
                        {kandidaterMedGittStatus.map((kandidat) => (
                            <Kandidatoppsummering
                                key={kandidat.kandidatId}
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
