'use server';
import KandidatlisteVisning from './KandidatlisteVisning';

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
