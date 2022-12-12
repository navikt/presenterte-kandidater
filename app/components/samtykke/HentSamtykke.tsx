import { BodyLong, Heading } from "@navikt/ds-react";
import type { FunctionComponent } from "react";

const HentSamtykke: FunctionComponent = () => {
    return (
        <main className="side">
            <Heading level="2" size="large">
                Vilkår
            </Heading>
            <Heading level="3" size="medium">
                Hvem kan bruke tjenestene?
            </Heading>
            <BodyLong>
                Arbeidsgiveren i en virksomhet gir tilganger til sine ansatte i Altinn. Har flere
                ansatte fått tilgang til å publisere stillinger på Arbeidsplassen, kan de se og
                utføre det samme, også endre det som en annen har lagt inn.
            </BodyLong>
            <Heading level="3" size="medium">
                Bruk av opplysninger i CV-er
            </Heading>
            <BodyLong>
                Du kan kun bruke opplysninger i CV-er hvis målet er å bemanne, rekruttere eller
                oppfordre personer til å søke på stillinger.
            </BodyLong>
            <BodyLong>Det er ikke tillatt å bruke CV-er til andre formål, slik som å</BodyLong>
            <ul>
                <li>
                    bruke opplysninger i forbindelse med salg eller markedsføring av varer eller
                    tjenester
                </li>
                <li>tilby arbeidssøkere stillinger der arbeidssøkeren må betale for å søke</li>
                <li>tilby personer arbeidstreningsplasser</li>
            </ul>
            <BodyLong>NAV vil følge opp brudd på disse vilkårene hvis det forekommer.</BodyLong>
        </main>
    );
};

export default HentSamtykke;
