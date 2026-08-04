'use client';

import { useApplikasjonContext } from '../ApplikasjonsContext';
import {
  OrganisasjonDTO,
  OrganisasjonerDTO,
} from '@/app/api/presenterte-kandidater-api/organisasjoner/useOrganisasjoner';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { Loader } from '@navikt/ds-react';
import {
  Banner,
  Organisasjon,
  Virksomhetsvelger,
} from '@navikt/virksomhetsvelger';
import { FunctionComponent, useCallback, useMemo } from 'react';

const tilOrganisasjonstre = (
  organisasjoner: OrganisasjonerDTO,
): Organisasjon[] => {
  const tilOrg = (organisasjon: OrganisasjonDTO): Organisasjon => ({
    orgnr: organisasjon.OrganizationNumber,
    navn: organisasjon.Name,
    underenheter: organisasjoner
      .filter(
        (underenhet) =>
          underenhet.ParentOrganizationNumber ===
          organisasjon.OrganizationNumber,
      )
      .map(tilOrg),
  });

  return organisasjoner
    .filter((organisasjon) => !organisasjon.ParentOrganizationNumber)
    .map(tilOrg);
};

const Header: FunctionComponent = () => {
  const { organisasjoner, orgnrHook } = useApplikasjonContext();
  const [orgnr, settOrgnr] = orgnrHook?.() ?? [null, () => {}];

  const organisasjonstre = useMemo(
    () => (organisasjoner ? tilOrganisasjonstre(organisasjoner) : []),
    [organisasjoner],
  );

  const håndterEndreVirksomhet = useCallback(
    (org: Organisasjon) => settOrgnr(org.orgnr),
    [settOrgnr],
  );

  if (!organisasjoner) {
    return <Loader />;
  }

  return (
    <Banner tittel='Kandidater'>
      <Virksomhetsvelger
        organisasjoner={organisasjonstre}
        initValgtOrgnr={orgnr ?? undefined}
        onChange={håndterEndreVirksomhet}
      />
      <NotifikasjonWidget />
    </Banner>
  );
};

export default Header;
