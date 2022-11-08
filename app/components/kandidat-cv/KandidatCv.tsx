import { Dialog, FileContent, Heart, Office1, Office2, Star } from "@navikt/ds-icons";
import { BodyLong, Heading, Panel } from "@navikt/ds-react";
import type { LinksFunction } from "@remix-run/node";
import type { FunctionComponent, ReactNode } from "react";
import type { Cv } from "~/routes/kandidatliste/$stillingId/$kandidatId/index";
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
            <BodyLong>Telefon: {cv.telefon}</BodyLong>
            <BodyLong>E-post: {cv.epostadresse}</BodyLong>
            <Gruppe icon={<Star />} tittel="Kompetanse">
                <ul>
                    <li>Digital markedsføring</li>
                    <li>Kassaerfaring</li>
                </ul>
            </Gruppe>
            <Gruppe icon={<Office1 />} tittel="Arbeidserfaring">
                Arbeidserfaring
            </Gruppe>
            <Gruppe icon={<Heart />} tittel="Ønsket yrke">
                Ønsket yrke
            </Gruppe>
            <Gruppe icon={<FileContent />} tittel="Sammendrag">
                Sammendrag
            </Gruppe>
            <Gruppe icon={<Office2 />} tittel="Utdanning">
                Utdanning
            </Gruppe>
            <Gruppe icon={<Dialog />} tittel="Språk">
                Språk
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

export default KandidatCv;
