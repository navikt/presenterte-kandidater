import KandidatLaster from './KandidatLaster';
import { sidetittel } from '@/app/util/sidetittel';
import type { Metadata } from 'next';

// Navnet på kandidaten skal aldri stå i tittelen, fordi den sendes til Umami.
export const metadata: Metadata = { title: sidetittel('Kandidat') };

export default async function KandidatPage({
  params,
}: {
  params: Promise<{ stillingsId: string; kandidatId: string }>;
}) {
  const { stillingsId, kandidatId } = await params;

  if (!kandidatId) {
    return <div>Fant ikke kandidat</div>;
  }

  if (!stillingsId) {
    return <div>Fant ikke stilling</div>;
  }

  return <KandidatLaster stillingsId={stillingsId} kandidatId={kandidatId} />;
}
