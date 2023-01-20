import {
    Attachment,
    Bag,
    Calender,
    Car,
    Cognition,
    Dialog,
    FileContent,
    Law,
    Office1,
    Office2,
    Star,
} from "@navikt/ds-icons";
import { BodyLong, BodyShort, Heading, Panel, Tooltip } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent, ReactNode } from "react";
import type {
    Cv,
    Førerkort as FørerkortType,
    Språk as SpråkType,
    Kurs as KursType,
} from "~/services/domene";
import { OmfangEnhet } from "~/services/domene";
import { Fragment } from "react";
import { Språkkompetanse } from "~/services/domene";
import CvErfaring, { formaterMånedOgÅr } from "./CvErfaring";
import css from "./KandidatCv.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

type Props = {
    cv: Cv;
};

const KandidatCv: FunctionComponent<Props> = ({ cv }) => {
    const telefon = cv.mobiltelefonnummer || cv.telefonnummer;
    const navn = `${cv.fornavn} ${cv.etternavn}`;

    return (
        <Panel className="kandidat-cv">
            <Heading aria-label={`CV-en til ${navn}`} size="large" level="2">
                {navn}
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

            <Gruppe icon={<Star aria-hidden />} tittel="Kompetanse">
                <Liste elementer={cv.kompetanse} />
            </Gruppe>
            <Gruppe icon={<FileContent aria-hidden />} tittel="Sammendrag">
                {cv.sammendrag}
            </Gruppe>
            <Gruppe icon={<Office2 aria-hidden />} tittel="Utdanning">
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
                <Gruppe icon={<Bag aria-hidden />} tittel="Fagbrev, svennebrev og mesterbrev">
                    <Liste elementer={cv.fagdokumentasjon} />
                </Gruppe>
            )}
            <Gruppe icon={<Office1 aria-hidden />} tittel="Arbeidserfaring">
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
                <Gruppe icon={<Law aria-hidden />} tittel="Offentlige godkjenninger">
                    <Liste elementer={cv.godkjenninger} />
                </Gruppe>
            )}

            {cv.andreGodkjenninger.length > 0 && (
                <Gruppe icon={<Attachment aria-hidden />} tittel="Andre godkjenninger">
                    {cv.andreGodkjenninger.map((godkjenning) => {
                        const { tittel, dato } = godkjenning;

                        return (
                            <Fragment key={tittel}>
                                <Heading
                                    className="kandidat-cv__erfaring-tittel"
                                    level="4"
                                    size="xsmall"
                                >
                                    {tittel}
                                </Heading>
                                {dato && (
                                    <p className="kandidat-cv__erfaring-tekst">
                                        {formaterMånedOgÅr(dato)}
                                    </p>
                                )}
                            </Fragment>
                        );
                    })}
                </Gruppe>
            )}

            {cv.førerkort.length > 0 && (
                <Gruppe icon={<Car aria-hidden />} tittel="Førerkort">
                    {cv.førerkort.map((førerkort) => (
                        <Førerkort key={førerkort.førerkortKodeKlasse} førerkort={førerkort} />
                    ))}
                </Gruppe>
            )}
            {cv.språk.length > 0 && (
                <Gruppe icon={<Dialog aria-hidden />} tittel="Språk">
                    {cv.språk.map((språk) => (
                        <Språk key={språk.navn} språk={språk} />
                    ))}
                </Gruppe>
            )}

            {cv.kurs.length > 0 && (
                <Gruppe icon={<Calender aria-hidden />} tittel="Kurs">
                    {cv.kurs.map((kurs) => (
                        <Kurs key={kurs.tittel} kurs={kurs} />
                    ))}
                </Gruppe>
            )}

            {cv.andreErfaringer.length > 0 && (
                <Gruppe icon={<Cognition aria-hidden />} tittel="Andre erfaringer">
                    {cv.andreErfaringer.map((erfaring) => {
                        const { rolle, beskrivelse, fraDato, tilDato } = erfaring;
                        return (
                            <CvErfaring
                                key={rolle}
                                tittel={rolle}
                                beskrivelse={beskrivelse}
                                fra={fraDato}
                                til={tilDato}
                            />
                        );
                    })}
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

const Kurs: FunctionComponent<{ kurs: KursType }> = ({ kurs }) => {
    const { tittel, omfangEnhet, omfangVerdi, tilDato } = kurs;

    return (
        <div className="kandidat-cv__erfaring">
            <Heading className="kandidat-cv__erfaring-tittel" level="4" size="xsmall">
                {tittel}
            </Heading>
            {tilDato && <p className="kandidat-cv__erfaring-tekst">{formaterMånedOgÅr(tilDato)}</p>}
            <p className="kandidat-cv__erfaring-tekst">
                <span>Varighet: </span>
                {omfangEnhet && omfangVerdi ? (
                    <span>
                        {omfangVerdi} {omfangTilVisning(omfangEnhet)}
                    </span>
                ) : (
                    "Ikke oppgitt"
                )}
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

const omfangTilVisning = (omfangEnhet: OmfangEnhet) => {
    switch (omfangEnhet) {
        case OmfangEnhet.Time:
            return "timer";
        case OmfangEnhet.Dag:
            return "dager";
        case OmfangEnhet.Uke:
            return "uker";
        case OmfangEnhet.Måned:
            return "måneder";
        default:
            return omfangEnhet;
    }
};

export const KandidatUtenCv: FunctionComponent = () => (
    <Panel className="kandidat-cv">
        <BodyLong>Kandidaten er ikke lenger tilgjengelig.</BodyLong>
    </Panel>
);

export default KandidatCv;
