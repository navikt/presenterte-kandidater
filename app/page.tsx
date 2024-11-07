'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApplikasjonContext } from './ApplikasjonsContext';
import IngenOrganisasjoner from './components/IngenOrganisasjoner';
import Kandidatlister from './Kandidatlister';
import { getBasePath } from './util/miljø';

export default function Home() {
  const router = useRouter();
  const { organisasjoner, valgtOrganisasjonsnummer } = useApplikasjonContext();

  useEffect(() => {
    if (organisasjoner && valgtOrganisasjonsnummer) {
      router.push(`${getBasePath()}?virksomhet=${valgtOrganisasjonsnummer}`);
    }
  }, [organisasjoner, valgtOrganisasjonsnummer, router]);

  if (!organisasjoner) {
    return <IngenOrganisasjoner />;
  }

  return <Kandidatlister />;
}
