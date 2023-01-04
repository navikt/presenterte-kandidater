import { Dialog, FileContent, Office1, Office2, Star } from "@navikt/ds-icons";
import { BodyLong, BodyShort, Heading, Panel, Tooltip } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent, ReactNode } from "react";
import type {
    Arbeidserfaring as ArbeidserfaringType,
    Utdanning as UtdanningType,
    Språk as SpråkType,
    Cv,
} from "~/services/domene";
import css from "./KandidatCv.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

type Props = {
    cv: Cv;
};

const KandidatCv: FunctionComponent<Props> = ({ cv }) => {
    const telefon = cv.mobiltelefonnummer || cv.telefonnummer;

    return (
        <Panel className="kandidat-cv">
            <Heading size="large" level="2">
                <span>
                    {cv.fornavn} {cv.etternavn}
                </span>
            </Heading>
            <dl className="kandidat-cv__personalia">
                <BodyShort as="dt">Bosted</BodyShort>
                <BodyShort as="dd">{cv.bosted}</BodyShort>

                {telefon && (
                    <>
                        <BodyShort as="dt">Telefon</BodyShort>
                        <BodyShort as="dd">{telefon}</BodyShort>
                    </>
                )}

                {cv.epost && (
                    <>
                        <BodyShort as="dt">E-post</BodyShort>
                        <BodyShort as="dd">
                            <Tooltip
                                className="kandidat-cv__epost-tooltip"
                                content="Skriv en e-post til kandidaten"
                            >
                                <a className="kandidat-cv__epost" href={`mailto:${cv.epost}`}>
                                    {cv.epost}
                                </a>
                            </Tooltip>
                        </BodyShort>
                    </>
                )}

                {cv.alder && (
                    <>
                        <BodyShort as="dt">Alder</BodyShort>
                        <BodyShort as="dd">{cv.alder}</BodyShort>
                    </>
                )}
            </dl>

            <Gruppe icon={<Star />} tittel="Kompetanse">
                <Liste elementer={cv.kompetanse} />
            </Gruppe>
            <Gruppe icon={<Office1 />} tittel="Arbeidserfaring">
                {cv.arbeidserfaring.map((arbeidserfaring) => (
                    <Arbeidserfaring
                        key={`${arbeidserfaring.stillingstittel}-${arbeidserfaring.arbeidsgiver}`}
                        arbeidserfaring={arbeidserfaring}
                    />
                ))}
            </Gruppe>
            <Gruppe icon={<FileContent />} tittel="Sammendrag">
                {cv.sammendrag}
            </Gruppe>
            <Gruppe icon={<Office2 />} tittel="Utdanning">
                {cv.utdanning.map((utdanning) => (
                    <Utdanning
                        key={`${utdanning.utdannelsessted}-${utdanning.utdanningsretning}`}
                        utdanning={utdanning}
                    />
                ))}
            </Gruppe>
            <Gruppe icon={<Dialog />} tittel="Språk">
                {cv.språk.map((språk) => (
                    <Språk key={språk.navn} språk={språk} />
                ))}
            </Gruppe>
        </Panel>
    );
};

const Gruppe: FunctionComponent<{
    icon: ReactNode;
    tittel: string;
    children: ReactNode;
}> = ({ icon, tittel, children }) => {
    return (
        <div className="kandidat-cv--gruppe">
            <div className="kandidat-cv--gruppe-header">
                {icon}
                <Heading level="3" size="small">
                    {tittel}
                </Heading>
            </div>
            <div className="kandidat-cv--gruppe-body">{children}</div>
        </div>
    );
};

const Liste: FunctionComponent<{
    elementer: Array<string | null>;
}> = ({ elementer }) => (
    <ul className="kandidat-cv__liste">
        {elementer
            .filter((e) => e !== null)
            .map((e) => (
                <li key={e}>{e}</li>
            ))}
    </ul>
);

const Arbeidserfaring: FunctionComponent<{ arbeidserfaring: ArbeidserfaringType }> = ({
    arbeidserfaring,
}) => {
    const { arbeidsgiver, beskrivelse, fraDato, tilDato, sted, stillingstittel } = arbeidserfaring;

    return (
        <div className="kandidat-cv__arbeidserfaring">
            <Heading level="4" size="xsmall">
                {stillingstittel}
            </Heading>
            <p className="kandidat-cv__arbeidsgiver" aria-label="Arbeidsgiver">
                {arbeidsgiver}, {sted}
            </p>
            <p aria-label="Periode">{formaterPeriode(fraDato, tilDato)}</p>
            <p
                className="kandidat-cv__arbeidserfaring-beskrivelse"
                aria-label="Beskrivelse av arbeid"
            >
                {beskrivelse}
            </p>
        </div>
    );
};

const Utdanning: FunctionComponent<{ utdanning: UtdanningType }> = ({ utdanning }) => {
    const { fra, til, beskrivelse, utdannelsessted, utdanningsretning } = utdanning;

    return (
        <div className="kandidat-cv__arbeidserfaring">
            <Heading level="4" size="xsmall">
                {utdanningsretning}
            </Heading>
            <p className="kandidat-cv__arbeidsgiver" aria-label="Utdannelsessted">
                {utdannelsessted}
            </p>
            <p aria-label="Periode">{formaterPeriode(fra, til)}</p>
            <p
                className="kandidat-cv__arbeidserfaring-beskrivelse"
                aria-label="Beskrivelse av utdanning"
            >
                {beskrivelse}
            </p>
        </div>
    );
};

const Språk: FunctionComponent<{ språk: SpråkType }> = ({ språk }) => {
    const { navn, muntlig, skriftlig } = språk;

    return (
        <div className="kandidat-cv__arbeidserfaring">
            <Heading level="4" size="xsmall">
                {navn}
            </Heading>
            <p>Muntlig: {muntlig}</p>
            <p>Skriftlig: {skriftlig}</p>
        </div>
    );
};

const formaterMånedOgÅr = (dato: string) =>
    new Date(dato).toLocaleDateString("nb-NO", {
        month: "long",
        year: "numeric",
    });

const formaterPeriode = (fra: string, til: string | null) => {
    const fraMånedÅr = formaterMånedOgÅr(fra);
    const tilMånedÅr = til ? formaterMånedOgÅr(til) : "I dag";

    return `${fraMånedÅr}—${tilMånedÅr}`;
};

export const KandidatUtenCv: FunctionComponent = () => (
    <Panel className="kandidat-cv">
        <BodyLong>Kandidaten er ikke lenger tilgjengelig.</BodyLong>
    </Panel>
);

export default KandidatCv;
