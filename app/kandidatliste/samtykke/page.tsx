'use client';

import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  Link as NavLink,
} from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PresenterteKandidaterAPI } from '../../api/api-routes';
import { useSamtykke } from '../../api/presenterte-kandidater-api/samtykke/useSamtykke';
import { useApplikasjonContext } from '../../ApplikasjonsContext';
import SWRLaster from '../../components/SWRLaster';
import Tilbakelenke from '../../components/TilbakeLenke';

export default function Samtykke() {
  const router = useRouter();

  const { valgtOrganisasjonsnummer } = useApplikasjonContext();

  const [feilmelding, setFeilmelding] = useState<string>();

  const hook = useSamtykke();

  //   const [harSamtykket, setHarSamtykket] = useState(false);

  async function handleSubmit(formData: FormData) {
    const harGodkjent = formData.get('samtykke') === 'true';
    if (!harGodkjent) {
      setFeilmelding('Du må huke av for å godta vilkårene.');
      return;
    }
    try {
      const respons = await fetch(
        `${PresenterteKandidaterAPI.internUrl}/samtykke`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (respons.ok) {
        router.push(`/kandidatliste?virksomhet=${valgtOrganisasjonsnummer}`);
      } else {
        setFeilmelding('Klarte ikke å lagre samtykke.');
      }
    } catch {
      setFeilmelding('Klarte ikke å lagre samtykke.');
    }
  }

  return (
    <SWRLaster hook={hook}>
      {(data) => (
        <div className='p-4 md:p-4'>
          {data.harSamtykke && (
            <Tilbakelenke
              href={`/kandidatliste?virksomhet=${valgtOrganisasjonsnummer}`}
            >
              Tilbake
            </Tilbakelenke>
          )}
          <Box
            padding='4'
            borderWidth='1'
            borderRadius='small'
            className='flex flex-col gap-4 -mx-4 leading-8 md:m-0 md:p-10 bg-white'
          >
            <div className='flex flex-col mb-4 md:items-center'>
              <Heading level='2' size='large'>
                Vilkår for å motta CV-er fra NAV
              </Heading>
            </div>

            <Heading level='3' size='medium'>
              Hvem kan bruke tjenesten
            </Heading>
            <BodyLong>
              Arbeidsgiver gir tilganger til sine ansatte i Altinn. Hvis flere
              ansatte har fått tilgang til å motta CV-er fra NAV, kan de se og
              utføre det samme. De kan også endre det som andre har utført.
              Arbeidsgiver har ansvar for at kun ansatte med behov har tilgang
              til CV-er fra NAV. Den som har fått tilgangen har ansvar for ikke
              å dele CV-er med andre uten behov. Tilgangsstyring skjer gjennom
              Altinn.
            </BodyLong>
            <Heading level='3' size='medium'>
              Bruk av opplysninger i CV-er
            </Heading>
            <BodyLong>
              Du kan kun bruke opplysninger i CV-er hvis målet er å bemanne,
              rekruttere eller oppfordre personer til å søke på stillinger.
            </BodyLong>
            <BodyLong>
              Det er ikke tillatt å bruke CV-er til andre formål, slik som å
            </BodyLong>
            <ul>
              <li>
                bruke opplysninger i forbindelse med salg eller markedsføring av
                varer eller tjenester
              </li>
              <li>
                tilby arbeidssøkere stillinger der arbeidssøkeren må betale for
                å søke
              </li>
              <li>tilby personer arbeidstreningsplasser</li>
            </ul>
            <BodyLong>
              NAV vil følge opp eventuelle brudd på disse vilkårene.
            </BodyLong>
            <Heading level='3' size='medium'>
              Arbeidsgiver må være oppmerksom på dette:
            </Heading>
            <ul>
              <li>
                CV-ene slettes automatisk seks måneder etter at de mottatt. Hvis
                du ikke lenger har behov for CV-ene, skal du slette de og ikke
                vente på den automatiske slettingen.
              </li>
              <li>
                Arbeidsgiver har behandlingsansvaret for personopplysningene
                dersom kopi av CV-en på nav.no printes ut eller lagres i egne
                systemer.
              </li>
            </ul>
            <Heading level='3' size='medium'>
              NAV lagrer personopplysninger
            </Heading>
            <BodyLong>
              Vi er pålagt å drive en statlig arbeidsformidling og formidle
              arbeidskraft. For å tilby disse tjenestene til arbeidsgivere, må
              vi lagre nødvendige personopplysninger. Vi lagrer derfor
              kandidatene som er delt med arbeidsgivere og anonymiserte
              opplysninger fra disse. Denne informasjonen bruker NAV til å
              forbedre tjenesten.
            </BodyLong>
            <BodyLong>
              <span>For mer informasjon, </span>
              <NavLink href='https://www.nav.no/personvernerklaering'>
                se NAVs personvernerklæring
              </NavLink>
            </BodyLong>
            <BodyLong>
              <span>Har du spørsmål, kan du kontakte oss på </span>
              <NavLink href='https://arbeidsgiver.nav.no/kontakt-oss/'>
                Kontakt NAV - arbeidsgiver
              </NavLink>
            </BodyLong>

            {!data.harSamtykke && (
              <form action={handleSubmit}>
                <CheckboxGroup hideLegend legend='Godkjenner du vilkårene?'>
                  <Checkbox name='samtykke' value='true'>
                    Jeg har lest og godtar vilkårene.
                  </Checkbox>
                </CheckboxGroup>
                {feilmelding && (
                  <BodyShort className='text-[--a-text-danger] italic'>
                    {feilmelding}
                  </BodyShort>
                )}
                <Button type='submit' className='mt-8'>
                  Godta vilkår
                </Button>
              </form>
            )}
          </Box>
        </div>
      )}
    </SWRLaster>
  );
}