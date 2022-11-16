import { Dialog, FileContent, Heart, Office1, Office2, Star } from "@navikt/ds-icons";
import { BodyLong, Heading, Panel } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent, ReactNode } from "react";
import type { Cv } from "~/services/domene";
import css from "./KandidatCv.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

type Props = {
    cv: Cv;
};

const KandidatCv: FunctionComponent<Props> = ({ cv }) => {
    return (
        <Panel className="kandidat-cv">
            <Heading size="large" level="2">
                <span>
                    {cv.fornavn} {cv.etternavn}
                </span>
            </Heading>
            <BodyLong>Alder:</BodyLong>
            <BodyLong>Bosted:</BodyLong>
            <BodyLong>Telefon: {cv.mobiltelefonnummer}</BodyLong>
            <BodyLong>E-post: {cv.epostadresse}</BodyLong>
            <Gruppe icon={<Star />} tittel="Kompetanse">
                <Liste elementer={cv.kompetanse} />
            </Gruppe>
            <Gruppe icon={<Office1 />} tittel="Arbeidserfaring">
                <Liste elementer={cv.arbeidserfaring.map((erfaring) => erfaring.stillingstittel)} />
            </Gruppe>
            <Gruppe icon={<Heart />} tittel="Ønsket yrke">
                <Liste elementer={cv.ønsketYrke} />
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
    elementer: string[];
}> = ({ elementer }) => (
    <ul>
        {elementer.map((e) => (
            <li key={e}>{e}</li>
        ))}
    </ul>
);

export default KandidatCv;
