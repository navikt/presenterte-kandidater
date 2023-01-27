import type { FunctionComponent } from "react";
import { BodyLong, BodyShort, Heading, Panel, Tooltip } from "@navikt/ds-react";
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
import type { Cv as CvType } from "~/services/domene";
import { Arbeidserfaring } from "./erfaring/Arbeidserfaring";
import AnnenErfaring from "./erfaring/AnnenErfaring";
import AnnenGodkjenning from "./erfaring/AnnenGodkjenning";
import Førerkort from "./erfaring/Førerkort";
import Kurs from "./erfaring/Kurs";
import Språk from "./erfaring/Språk";
import Utdanning from "./erfaring/Utdanning";
import css from "./Cv.module.css";
import Gruppe from "../gruppe/Gruppe";

type Props = {
    cv: CvType;
};

const KandidatCv: FunctionComponent<Props> = ({ cv }) => {
    const telefon = cv.mobiltelefonnummer || cv.telefonnummer;
    const navn = `${cv.fornavn} ${cv.etternavn}`;

    return (
        <Panel className={css.cv}>
            <Heading aria-label={`CV-en til ${navn}`} size="large" level="2">
                {navn}
            </Heading>
            <dl className={css.personalia}>
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
                                className={css.epostTooltip}
                                content="Skriv en e-post til kandidaten"
                            >
                                <a className={css.epost} href={`mailto:${cv.epost}`}>
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
                {cv.utdanning.map((utdanning) => (
                    <Utdanning key={utdanning.utdanningsretning} utdanning={utdanning} />
                ))}
            </Gruppe>
            {cv.fagdokumentasjon.length > 0 && (
                <Gruppe icon={<Bag aria-hidden />} tittel="Fagbrev, svennebrev og mesterbrev">
                    <Liste elementer={cv.fagdokumentasjon} />
                </Gruppe>
            )}
            <Gruppe icon={<Office1 aria-hidden />} tittel="Arbeidserfaring">
                {cv.arbeidserfaring.map((arbeidserfaring) => (
                    <Arbeidserfaring
                        key={arbeidserfaring.stillingstittel}
                        arbeidserfaring={arbeidserfaring}
                    />
                ))}
            </Gruppe>
            {cv.godkjenninger.length > 0 && (
                <Gruppe icon={<Law aria-hidden />} tittel="Offentlige godkjenninger">
                    <Liste elementer={cv.godkjenninger} />
                </Gruppe>
            )}

            {cv.andreGodkjenninger.length > 0 && (
                <Gruppe icon={<Attachment aria-hidden />} tittel="Andre godkjenninger">
                    {cv.andreGodkjenninger.map((godkjenning) => (
                        <AnnenGodkjenning key={godkjenning.tittel} godkjenning={godkjenning} />
                    ))}
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
                    {cv.andreErfaringer.map((erfaring) => (
                        <AnnenErfaring key={erfaring.beskrivelse} erfaring={erfaring} />
                    ))}
                </Gruppe>
            )}
        </Panel>
    );
};

const Liste: FunctionComponent<{
    elementer: Array<string | null>;
}> = ({ elementer }) => (
    <ul className={css.liste}>
        {elementer
            .filter((e) => e !== null)
            .map((e) => (
                <li key={e}>{e}</li>
            ))}
    </ul>
);

export const KandidatUtenCv: FunctionComponent = () => (
    <Panel className={css.cv}>
        <BodyLong>Kandidaten er ikke lenger tilgjengelig.</BodyLong>
    </Panel>
);

export default KandidatCv;
