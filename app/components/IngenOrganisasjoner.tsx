import { BodyShort, Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";

const IngenOrganisasjoner: FunctionComponent = () => {
    return (
        <main className="side kandidatlister">
            <Heading level="2" size="small">
                Ikke tilgang
            </Heading>
            <BodyShort>Du representerer ingen organisasjoner</BodyShort>
        </main>
    );
};

export default IngenOrganisasjoner;
