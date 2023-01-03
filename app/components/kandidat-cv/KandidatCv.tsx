import { Dialog, FileContent, Office1, Office2, Star } from "@navikt/ds-icons";
import { BodyLong, BodyShort, Heading, Panel, Tooltip } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent, ReactNode } from "react";
import type { Cv } from "~/services/domene";
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
                <Liste elementer={cv.arbeidserfaring.map((erfaring) => erfaring.stillingstittel)} />
            </Gruppe>
            <Gruppe icon={<FileContent />} tittel="Sammendrag">
                {cv.sammendrag}
            </Gruppe>
            <Gruppe icon={<Office2 />} tittel="Utdanning">
                <Liste elementer={cv.utdanning.map((utdanning) => utdanning.beskrivelse)} />
            </Gruppe>
            <Gruppe icon={<Dialog />} tittel="Språk">
                <Liste elementer={cv.språk.map((s) => s.navn)} />
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
    <ul>
        {elementer
            .filter((e) => e !== null)
            .map((e) => (
                <li key={e}>{e}</li>
            ))}
    </ul>
);

export const KandidatUtenCv: FunctionComponent = () => (
    <Panel className="kandidat-cv">
        <BodyLong>Kandidaten er ikke lenger tilgjengelig.</BodyLong>
    </Panel>
);

export default KandidatCv;
