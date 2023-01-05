import {
    Attachment,
    Bag,
    Car,
    Dialog,
    FileContent,
    Office1,
    Office2,
    Star,
} from "@navikt/ds-icons";
import { BodyLong, BodyShort, Heading, Panel, Tooltip } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent, ReactNode } from "react";
import type { Språk as SpråkType, Førerkort as FørerkortType, Cv } from "~/services/domene";
import { Språkkompetanse } from "~/services/domene";
import CvErfaring from "./CvErfaring";
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
            <Gruppe icon={<FileContent />} tittel="Sammendrag">
                {cv.sammendrag}
            </Gruppe>
            <Gruppe icon={<Office2 />} tittel="Utdanning">
                {cv.utdanning.map((utdanning) => {
                    const { fra, til, beskrivelse, utdannelsessted, utdanningsretning } = utdanning;

                    return (
                        <CvErfaring
                            key={`${utdanning.utdannelsessted}-${utdanning.utdanningsretning}`}
                            tittel={utdanningsretning}
                            sted={utdannelsessted}
                            beskrivelse={beskrivelse}
                            fra={fra}
                            til={til}
                        />
                    );
                })}
            </Gruppe>
            {cv.fagdokumentasjon.length > 0 && (
                <Gruppe icon={<Bag />} tittel="Fagbrev, svennebrev og mesterbrev">
                    <Liste elementer={cv.fagdokumentasjon} />
                </Gruppe>
            )}
            <Gruppe icon={<Office1 />} tittel="Arbeidserfaring">
                {cv.arbeidserfaring.map((arbeidserfaring) => {
                    const { stillingstittel, arbeidsgiver, beskrivelse, fraDato, tilDato, sted } =
                        arbeidserfaring;

                    return (
                        <CvErfaring
                            key={`${stillingstittel}-${arbeidsgiver}`}
                            tittel={stillingstittel}
                            sted={`${arbeidsgiver}, ${sted}`}
                            beskrivelse={beskrivelse}
                            fra={fraDato}
                            til={tilDato}
                        />
                    );
                })}
            </Gruppe>
            {cv.godkjenninger.length > 0 && (
                <Gruppe icon={<Attachment />} tittel="Offentlige godkjenninger">
                    <Liste elementer={cv.godkjenninger} />
                </Gruppe>
            )}

            {cv.førerkort.length > 0 && (
                <Gruppe icon={<Car />} tittel="Førerkort">
                    {cv.førerkort.map((førerkort) => (
                        <Førerkort key={førerkort.førerkortKodeKlasse} førerkort={førerkort} />
                    ))}
                </Gruppe>
            )}
            {cv.språk.length > 0 && (
                <Gruppe icon={<Dialog />} tittel="Språk">
                    {cv.språk.map((språk) => (
                        <Språk key={språk.navn} språk={språk} />
                    ))}
                </Gruppe>
            )}
        </Panel>
    );
};

const Gruppe: FunctionComponent<{
    icon: ReactNode;
    tittel: string;
    children: ReactNode;
}> = ({ icon, tittel, children }) => {
    return (
        <section className="kandidat-cv--gruppe">
            <div className="kandidat-cv--gruppe-header">
                {icon}
                <Heading level="3" size="small">
                    {tittel}
                </Heading>
            </div>
            {children}
        </section>
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

const Språk: FunctionComponent<{ språk: SpråkType }> = ({ språk }) => {
    const { navn, muntlig, skriftlig } = språk;

    return (
        <div className="kandidat-cv__erfaring">
            <Heading className="kandidat-cv__erfaring-tittel" level="4" size="xsmall">
                {navn}
            </Heading>
            <p className="kandidat-cv__erfaring-tekst">
                Muntlig: {språkkompetanseTilVisning(muntlig)}
            </p>
            <p className="kandidat-cv__erfaring-tekst">
                Skriftlig: {språkkompetanseTilVisning(skriftlig)}
            </p>
        </div>
    );
};

const Førerkort: FunctionComponent<{ førerkort: FørerkortType }> = ({ førerkort }) => {
    const { førerkortKodeKlasse } = førerkort;

    return (
        <Heading className="kandidat-cv__erfaring-tittel" level="4" size="xsmall">
            {førerkortKodeKlasse}
        </Heading>
    );
};

const språkkompetanseTilVisning = (kompetanse: Språkkompetanse) => {
    switch (kompetanse) {
        case Språkkompetanse.IkkeOppgitt:
            return "Ikke oppgitt";
        case Språkkompetanse.Nybegynner:
            return "Nybegynner";
        case Språkkompetanse.Godt:
            return "Godt";
        case Språkkompetanse.VeldigGodt:
            return "Veldig godt";
        case Språkkompetanse.Førstespråk:
            return "Førstespråk";
        default:
            return kompetanse;
    }
};

export const KandidatUtenCv: FunctionComponent = () => (
    <Panel className="kandidat-cv">
        <BodyLong>Kandidaten er ikke lenger tilgjengelig.</BodyLong>
    </Panel>
);

export default KandidatCv;
