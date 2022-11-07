import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Accordion, Detail, Heading, Panel } from "@navikt/ds-react";
import { proxyTilApi } from "~/services/api/proxy";
import { ArbeidsgiversStatus, Kandidat, visArbeidsgiversStatus } from "./$kandidatId";
import { Link as NavLink } from "@navikt/ds-react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import css from "./index.css";
import { Back, Close, Helptext, Like, Next } from "@navikt/ds-icons";
import { ReactNode } from "react";

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

    const { åVurdere, ikkeAktuelle, aktuelle } = fordelPåStatus(kandidater);

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
                    kandidater={åVurdere}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    status={ArbeidsgiversStatus.Aktuell}
                    icon={<Like />}
                    kandidater={aktuelle}
                    stillingId={stillingId}
                />

                <GruppeMedKandidater
                    status={ArbeidsgiversStatus.IkkeAktuell}
                    icon={<Close />}
                    kandidater={ikkeAktuelle}
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
    return (
        <Accordion className="gruppe-med-kandidater">
            <Accordion.Item defaultOpen={kandidater.length > 0}>
                <Accordion.Header>
                    <div className="gruppe-med-kandidater--header">
                        {icon}
                        <span>
                            {visArbeidsgiversStatus(status)} ({kandidater.length})
                        </span>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    <ul>
                        {kandidater.map((kandidat) => (
                            <li key={kandidat.kandidatId}>
                                <Link to={`/kandidatliste/${stillingId}/${kandidat.kandidatId}`}>
                                    <span>{kandidat.kandidat.fornavn} </span>
                                    <span>{kandidat.kandidat.etternavn} </span>
                                    <span>({kandidat.kandidatId})</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

const fordelPåStatus = (kandidater: Kandidat[]) => {
    const åVurdere: Kandidat[] = [];
    const aktuelle: Kandidat[] = [];
    const ikkeAktuelle: Kandidat[] = [];

    kandidater.forEach((kandidat) => {
        if (kandidat.arbeidsgiversStatus === ArbeidsgiversStatus.ÅVurdere) {
            åVurdere.push(kandidat);
        } else if (kandidat.arbeidsgiversStatus === ArbeidsgiversStatus.Aktuell) {
            aktuelle.push(kandidat);
        } else if (kandidat.arbeidsgiversStatus === ArbeidsgiversStatus.IkkeAktuell) {
            ikkeAktuelle.push(kandidat);
        }
    });

    return { åVurdere, aktuelle, ikkeAktuelle };
};

export default Kandidatlistevisning;
