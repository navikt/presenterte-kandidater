import KandidatlisteVisning from './KandidatlisteVisning';
import { sidetittel } from '@/app/util/sidetittel';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: sidetittel('Kandidatliste') };

export default async function KandidaterForKandidatliste({
  params,
}: {
  params: Promise<{ stillingsId: string }>;
}) {
  const stillingsId = (await params).stillingsId;

  if (!stillingsId) {
    return <div>Klarte ikke å finne stillingsId</div>;
  }
  return <KandidatlisteVisning stillingsId={stillingsId} />;
}
