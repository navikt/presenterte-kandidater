'use client';
import * as React from 'react';
import { useUseKandidatliste } from '../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/useKandidatliste';
import SWRLaster from '../../../components/SWRLaster';
import KandidatVisning from './KandidatVisning';

export interface pageProps {
  stillingsId: string;
  kandidatId: string;
}

const KandidatLaster: React.FC<pageProps> = ({ stillingsId, kandidatId }) => {
  const hook = useUseKandidatliste(stillingsId);
  return (
    <SWRLaster hook={hook}>
      {(data) => {
        const kandidat = data.kandidater.find(
          (kandidat) => kandidat.kandidat.uuid === kandidatId,
        );

        if (!kandidat) {
          return <div>Fant ikke kandidat</div>;
        }
        return (
          <KandidatVisning
            kandidat={kandidat}
            kandidatliste={data.kandidatliste}
          />
        );
      }}
    </SWRLaster>
  );
};

export default KandidatLaster;
