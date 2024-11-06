import KandidatLaster from './KandidatLaster';

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
