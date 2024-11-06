'use client';

import { ReadMore } from '@navikt/ds-react';

import {
  ArbeidsgiversVurderingDTO,
  KandidatlisteDTO,
  KandidatMedCvDTO,
  Kandidatvurdering,
} from '../../../../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { useApplikasjonContext } from '../../../../ApplikasjonsContext';
import Tilbakelenke from '../../../../components/TilbakeLenke';
import Spørreskjemalenke from '../../components/Spørreskjemalenke';
import EndreVurdering from './components/EndreVurdering';
import KandidatCv from './components/KandidatCv';
import { KandidatUtenCv } from './components/KandidatUtenCv';
import Slettemodal from './components/SlettModal';

export default function Kandidatvisning({
  kandidat,
  kandidatliste,
}: {
  kandidat: KandidatMedCvDTO;
  kandidatliste: KandidatlisteDTO;
}) {
  const { valgtOrganisasjonsnummer } = useApplikasjonContext();

  return (
    <div className='flex flex-col items-start gap-6 p-4'>
      <Tilbakelenke
        href={`/kandidatliste/${kandidatliste.stillingId}?virksomhet=${valgtOrganisasjonsnummer}`}
      >
        Alle kandidater
      </Tilbakelenke>

      <EndreVurdering
        kandidatId={kandidat.kandidat.uuid}
        kandidatliste={kandidatliste}
        vurdering={kandidat.kandidat.arbeidsgiversVurdering}
      />

      <ReadMore header='Slik virker statusene' className='print:hidden'>
        Statusene hjelper deg å holde oversikt over kandidatene NAV har sendt
        deg.
        <br />
        Informasjonen blir ikke formidlet videre til kandidaten eller NAV.
      </ReadMore>

      {kandidat.cv ? (
        <KandidatCv kandidatId={kandidat.kandidat.uuid} cv={kandidat.cv} />
      ) : (
        <KandidatUtenCv />
      )}

      <Spørreskjemalenke />

      <Slettemodal
        kandidatId={kandidat.kandidat.uuid}
        cv={kandidat.cv}
        stillingsId={kandidatliste.stillingId}
      />
    </div>
  );
}

export function visVurdering(vurdering?: ArbeidsgiversVurderingDTO) {
  switch (vurdering) {
    case Kandidatvurdering.TilVurdering:
      return 'Til vurdering';
    case Kandidatvurdering.IkkeAktuell:
      return 'Ikke aktuell';
    case Kandidatvurdering.Aktuell:
      return 'Aktuell';
    case Kandidatvurdering.FåttJobben:
      return 'Fått jobben';
    default:
      return 'Ikke vurdert';
  }
}
