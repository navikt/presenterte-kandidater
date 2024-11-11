'use client';
import { Loader } from '@navikt/ds-react';
import { useHentSamtykke } from './api/presenterte-kandidater-api/hentsamtykke/useHentSamtykke';
import Kandidatlister from './Kandidatlister';
import Samtykke from './samtykke/page';

export default function Home() {
  const samtykke = useHentSamtykke();

  if (samtykke.isLoading) {
    return <Loader />;
  }
  return samtykke?.data?.harSamtykket ? <Kandidatlister /> : <Samtykke />;
}
