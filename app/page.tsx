'use client';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApplikasjonContext } from './ApplikasjonsContext';
import IngenOrganisasjoner from './components/IngenOrganisasjoner';

export default function Home() {
  const router = useRouter();
  const { organisasjoner, valgtOrganisasjonsnummer } = useApplikasjonContext();

  useEffect(() => {
    if (organisasjoner && valgtOrganisasjonsnummer) {
      router.push(`/kandidatliste?virksomhet=${valgtOrganisasjonsnummer}`);
    }
  }, [organisasjoner, valgtOrganisasjonsnummer, router]);

  if (!organisasjoner) {
    return <IngenOrganisasjoner />;
  }

  return <Loader />;
}
