import { Link, useLoaderData, useParams } from "@remix-run/react";
import { Detail, Heading } from "@navikt/ds-react";
import { json } from "@remix-run/node";
import { proxyTilApi } from "~/services/api/proxy";
import type { LoaderFunction } from "@remix-run/node";
import type { Kandidatliste } from ".";

export type Kandidat = {
    kandidatId: string;
    hendelsestidspunkt: string;
    arbeidsgiversStatus: ArbeidsgiversStatus;

    // Fra ElasticSearch
    kandidat: {
        fornavn: string;
        etternavn: string;
        epostadresse: string | null;
        telefon: string | null;
        harKontaktinformasjon: boolean;
    };
};

export enum ArbeidsgiversStatus {
    ÅVurdere = "Å_VURDERE",
    IkkeAktuell = "IKKE_AKTUELL",
    Aktuell = "AKTUELL",
    FåttJobben = "FÅTT_JOBBEN",
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const { kandidatId, stillingId } = params;

    const [kandidat, kandidatliste] = await Promise.all([
        proxyTilApi(request, `/kandidatlister/${stillingId}/${kandidatId}`),
        proxyTilApi(request, `/kandidatlister/${stillingId}`),
    ]);

    return json({
        kandidat: await kandidat.json(),
        kandidatliste: await kandidatliste.json(),
    });
};

type LoaderData = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

const Kandidatvisning = () => {
    const { stillingId } = useParams();

    const { kandidat } = useLoaderData<LoaderData>();
    const { kandidatId, arbeidsgiversStatus } = kandidat;

    return (
        <main className="side">
            <Link to={`/kandidatliste/${stillingId}`}>Tilbake</Link>
            <Detail>Kandidat med kandidatId {kandidatId}</Detail>
            <Heading size="medium">
                <span>{kandidat.kandidat.fornavn} </span>
                <span>{kandidat.kandidat.etternavn} </span>
            </Heading>
            <Detail>Status «{visArbeidsgiversStatus(arbeidsgiversStatus)}»</Detail>
        </main>
    );
};

export const visArbeidsgiversStatus = (arbeidsgiversStatus: ArbeidsgiversStatus) => {
    switch (arbeidsgiversStatus) {
        case ArbeidsgiversStatus.ÅVurdere:
            return "Å vurdere";
        case ArbeidsgiversStatus.IkkeAktuell:
            return "Ikke aktuell";
        case ArbeidsgiversStatus.Aktuell:
            return "Aktuell";
        case ArbeidsgiversStatus.FåttJobben:
            return "Fått jobben";
        default:
            return "Ukjent status";
    }
};

export default Kandidatvisning;
