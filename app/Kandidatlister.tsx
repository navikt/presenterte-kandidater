'use client';
import { BodyShort, Heading } from '@navikt/ds-react';
import Link from 'next/link';

import { sendEvent } from './amplitude';
import { useUseKandidatlister } from './api/presenterte-kandidater-api/kandidatlister/[virksomhetsId]/useKandidatlister';
import { useApplikasjonContext } from './ApplikasjonsContext';
import SWRLaster from './components/SWRLaster';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import IngenOrganisasjoner from './components/IngenOrganisasjoner';
import VisKandidatlistesammendrag from './components/VisKandidatlistesammendrag';
import { getBasePath } from './util/miljø';

const Kandidatlister: React.FC = () => {
  const { valgtOrganisasjonsnummer, organisasjoner } = useApplikasjonContext();
  const router = useRouter();
  const hook = useUseKandidatlister(valgtOrganisasjonsnummer);

  React.useEffect(() => {
    if (organisasjoner && valgtOrganisasjonsnummer) {
      router.push(`${getBasePath()}?virksomhet=${valgtOrganisasjonsnummer}`);
    }
  }, [organisasjoner, valgtOrganisasjonsnummer, router]);

  if (!valgtOrganisasjonsnummer) {
    return <IngenOrganisasjoner />;
  }
  return (
    <SWRLaster hook={hook}>
      {(data) => {
        const aktive =
          data?.filter(
            (sammendrag) => sammendrag.kandidatliste.status === 'ÅPEN'
          ) ?? [];
        const avsluttede =
          data?.filter(
            (sammendrag) => sammendrag.kandidatliste.status !== 'ÅPEN'
          ) ?? [];

        sendEvent('app', 'visning', {
          antallOrganisasjoner: data.length,
          antallAktive: aktive.length,
          antallAvsluttede: avsluttede.length,
        });

        return (
          <div className='p-4'>
            <Heading level='2' size='small' className='mb-4'>
              Aktive rekrutteringsprosesser
            </Heading>

            {valgtOrganisasjonsnummer && aktive.length > 0 ? (
              <ul className='p-0 flex flex-col gap-6 list-none mb-12'>
                {aktive.map((sammendrag) => (
                  <VisKandidatlistesammendrag
                    virksomhet={valgtOrganisasjonsnummer}
                    key={sammendrag.kandidatliste.stillingId}
                    sammendrag={sammendrag}
                  />
                ))}
              </ul>
            ) : (
              <BodyShort className='mb-12'>
                <em>Ingen aktive rekrutteringsprosesser</em>
              </BodyShort>
            )}

            <Heading level='2' size='small' className='mb-4'>
              Avsluttede rekrutteringsprosesser
            </Heading>

            {valgtOrganisasjonsnummer && avsluttede.length > 0 ? (
              <ul className='p-0 flex flex-col gap-6 list-none mb-12'>
                {avsluttede.map((sammendrag) => (
                  <VisKandidatlistesammendrag
                    virksomhet={valgtOrganisasjonsnummer}
                    key={sammendrag.kandidatliste.stillingId}
                    sammendrag={sammendrag}
                  />
                ))}
              </ul>
            ) : (
              <BodyShort className='mb-12'>
                <em>Ingen avsluttede rekrutteringsprosesser</em>
              </BodyShort>
            )}
            <div className='flex justify-center'>
              <Link
                className='navds-link'
                href={`${getBasePath()}/samtykke?virksomhet=${valgtOrganisasjonsnummer}`}
              >
                Vilkår for tjenesten
              </Link>
            </div>
          </div>
        );
      }}
    </SWRLaster>
  );
};
export default Kandidatlister;
