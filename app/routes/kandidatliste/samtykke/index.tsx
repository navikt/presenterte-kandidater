import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { FunctionComponent } from "react";
import {
    BodyLong,
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Panel,
    Link as NavLink,
} from "@navikt/ds-react";

import { logger } from "server/logger";
import { proxyTilApi } from "~/services/api/proxy";
import Tilbakelenke from "~/components/tilbakelenke/Tilbakelenke";
import useVirksomhet from "~/services/useVirksomhet";
import css from "./index.module.css";

export const loader: LoaderFunction = async ({ request }) => {
    const respons = await proxyTilApi(request, "/samtykke");
    return respons.ok;
};

export const action: ActionFunction = async ({ request }) => {
    const body = await request.formData();
    const harGodkjent = body.get("samtykke") === "true";

    if (!harGodkjent) {
        return json("Du må huke av for å godta vilkårene.", { status: 422 });
    } else {
        const respons = await proxyTilApi(request, "/samtykke", "POST");

        if (respons.ok) {
            const virksomhet = new URL(request.url).searchParams.get("virksomhet");

            return redirect(`/kandidatliste?virksomhet=${virksomhet}`);
        } else {
            logger.error(
                `Klarte ikke å lagre samtykke, fikk ${respons.status}-feil: ${respons.statusText}`,
                respons.body
            );

            return json("Klarte ikke å lagre samtykke.", { status: 500 });
        }
    }
};

const Samtykke: FunctionComponent = () => {
    const virksomhet = useVirksomhet();
    const feilmelding = useActionData<string | undefined>();
    const harSamtykket = useLoaderData<boolean>();

    return (
        <main className={"side " + css.samtykkeside}>
            {harSamtykket && (
                <Tilbakelenke href={`/kandidatliste?virksomhet=${virksomhet}`}>
                    Tilbake
                </Tilbakelenke>
            )}
            <Panel className={css.vilkår}>
                <div className={css.topp}>
                    <Heading level="2" size="large">
                        Vilkår for å motta CV-er fra NAV
                    </Heading>
                </div>

                <Heading level="3" size="medium">
                    Hvem kan bruke tjenesten
                </Heading>
                <BodyLong>
                    Arbeidsgiver gir tilganger til sine ansatte i Altinn. Hvis flere ansatte har
                    fått tilgang til å motta CV-er fra NAV, kan de se og utføre det samme. De kan
                    også endre det som andre har utført. Arbeidsgiver har ansvar for at kun ansatte
                    med behov har tilgang til CV-er fra NAV. Den som har fått tilgangen har ansvar
                    for ikke å dele CV-er med andre uten behov. Tilgangsstyring skjer gjennom
                    Altinn.
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
                <BodyLong>NAV vil følge opp eventuelle brudd på disse vilkårene.</BodyLong>
                <Heading level="3" size="medium">
                    Arbeidsgiver må være oppmerksom på dette:
                </Heading>
                <ul>
                    <li>
                        CV-ene slettes automatisk seks måneder etter at de mottatt. Hvis du ikke
                        lenger har behov for CV-ene, skal du slette de og ikke vente på den
                        automatiske slettingen.
                    </li>
                    <li>
                        Arbeidsgiver har behandlingsansvaret for personopplysningene dersom kopi av
                        CV-en på nav.no printes ut eller lagres i egne systemer.
                    </li>
                </ul>
                <Heading level="3" size="medium">
                    NAV lagrer personopplysninger
                </Heading>
                <BodyLong>
                    Vi er pålagt å drive en statlig arbeidsformidling og formidle arbeidskraft. For
                    å tilby disse tjenestene til arbeidsgivere, må vi lagre nødvendige
                    personopplysninger. Vi lagrer derfor kandidatene som er delt med arbeidsgivere
                    og anonymiserte opplysninger fra disse. Denne informasjonen bruker NAV til å
                    forbedre tjenesten.
                </BodyLong>
                <BodyLong>
                    <span>For mer informasjon, </span>
                    <NavLink href="https://www.nav.no/personvernerklaering">
                        se NAVs personvernerklæring
                    </NavLink>
                </BodyLong>
                <BodyLong>
                    <span>Har du spørsmål, kan du kontakte oss på </span>
                    <NavLink href="https://arbeidsgiver.nav.no/kontakt-oss/">
                        Kontakt NAV - arbeidsgiver
                    </NavLink>
                </BodyLong>

                {!harSamtykket && (
                    <Form method="post">
                        <CheckboxGroup hideLegend legend="Godkjenner du vilkårene?">
                            <Checkbox name="samtykke" value="true">
                                Jeg har lest og godtar vilkårene.
                            </Checkbox>
                        </CheckboxGroup>
                        {feilmelding && (
                            <BodyShort className={css.feilmelding}>{feilmelding}</BodyShort>
                        )}
                        <Button type="submit">Godta vilkår</Button>
                    </Form>
                )}
            </Panel>
        </main>
    );
};

export default Samtykke;
