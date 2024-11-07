'use client';
import { Close, ExternalLink } from '@navikt/ds-icons';
import { BodyLong, Box, Heading, Link as NavLink } from '@navikt/ds-react';
import * as React from 'react';
import { Kandidatvurdering } from '../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/kandidatliste.typer';
import { useUseKandidatliste } from '../api/presenterte-kandidater-api/kandidatliste/[stillingsId]/useKandidatliste';
import { useApplikasjonContext } from '../ApplikasjonsContext';
import SWRLaster from '../components/SWRLaster';
import Tilbakelenke from '../components/TilbakeLenke';
import { hentMiljø, Miljø } from '../util/miljø';
import GruppeMedKandidater from './components/GruppeMedKandidater';
import Spørreskjemalenke from './components/Spørreskjemalenke';
import Vurderingsikon from './components/Vurderingsikon';

export interface KandidatlisteVisningProps {
  stillingsId: string;
}

const visStillingUrl =
  hentMiljø() === Miljø.DevGcp
    ? 'https://vis-stilling.intern.dev.nav.no/arbeid/stilling'
    : 'https://www.nav.no/arbeid/stilling';

const KandidatlisteVisning: React.FC<KandidatlisteVisningProps> = ({
  stillingsId,
}) => {
  const { valgtOrganisasjonsnummer } = useApplikasjonContext();
  const hook = useUseKandidatliste(stillingsId);

  return (
    <SWRLaster hook={hook}>
      {(data) => {
        const { kandidatliste, kandidater } = data;
        const { tittel, stillingId } = kandidatliste;
        return (
          <div className='p-4'>
            <Tilbakelenke href={`/?virksomhet=${valgtOrganisasjonsnummer}`}>
              Alle rekrutteringsprosesser
            </Tilbakelenke>

            <Box
              padding='4'
              borderWidth='1'
              borderRadius='small'
              className='-mx-4 flex flex-col gap-6 md:m-0 md:p-10 bg-white'
            >
              <Heading
                aria-label={`Kandidater til stilling «${tittel}»`}
                level='2'
                size='medium'
              >
                {tittel}
              </Heading>

              <NavLink
                className='self-start'
                href={`${visStillingUrl}/${stillingId}`}
                target='__blank'
              >
                Se stilling
                <ExternalLink aria-hidden />
              </NavLink>

              {kandidater.length === 0 ? (
                <BodyLong>
                  Det er foreløpig ingen kandidater i denne kandidatlisten.
                </BodyLong>
              ) : (
                <>
                  <GruppeMedKandidater
                    vurdering={Kandidatvurdering.TilVurdering}
                    icon={
                      <Vurderingsikon
                        vurdering={Kandidatvurdering.TilVurdering}
                      />
                    }
                    kandidater={kandidater}
                    stillingId={stillingId}
                  />

                  <GruppeMedKandidater
                    vurdering={Kandidatvurdering.Aktuell}
                    icon={
                      <Vurderingsikon vurdering={Kandidatvurdering.Aktuell} />
                    }
                    kandidater={kandidater}
                    stillingId={stillingId}
                  />

                  <GruppeMedKandidater
                    vurdering={Kandidatvurdering.FåttJobben}
                    icon={
                      <Vurderingsikon
                        vurdering={Kandidatvurdering.FåttJobben}
                      />
                    }
                    kandidater={kandidater}
                    stillingId={stillingId}
                  />

                  <GruppeMedKandidater
                    vurdering={Kandidatvurdering.IkkeAktuell}
                    icon={
                      <Vurderingsikon
                        vurdering={Kandidatvurdering.IkkeAktuell}
                      />
                    }
                    kandidater={kandidater}
                    stillingId={stillingId}
                  />

                  <GruppeMedKandidater
                    icon={<Close />}
                    kandidater={kandidater}
                    stillingId={stillingId}
                  />
                </>
              )}
            </Box>
            <Spørreskjemalenke />
          </div>
        );
      }}
    </SWRLaster>
  );
};

export default KandidatlisteVisning;
