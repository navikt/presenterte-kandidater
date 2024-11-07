'use client';
import { Loader } from '@navikt/ds-react';
import { useSamtykke } from './api/presenterte-kandidater-api/samtykke/useSamtykke';
import Kandidatlister from './Kandidatlister';
import Samtykke from './samtykke/page';

export default function Home() {
  const harSamtykke = useSamtykke();

  if (harSamtykke.isLoading) {
    return <Loader />;
  }
  return harSamtykke?.data?.harSamtykke ? <Kandidatlister /> : <Samtykke />;
}
