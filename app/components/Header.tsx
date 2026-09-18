'use client';

import { useApplikasjonContext } from '../ApplikasjonsContext';
import { tilOrganisasjonstre } from '@/app/util/organisasjonstreMapper';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { Loader } from '@navikt/ds-react';
import {
  Banner,
  Organisasjon,
  Virksomhetsvelger,
} from '@navikt/virksomhetsvelger';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useCallback, useMemo } from 'react';

const Header: FunctionComponent = () => {
  const { organisasjoner, valgtOrganisasjonsnummer } = useApplikasjonContext();
  const router = useRouter();

  const organisasjonstre = useMemo(
    () => (organisasjoner ? tilOrganisasjonstre(organisasjoner) : []),
    [organisasjoner],
  );

  const håndterEndreVirksomhet = useCallback(
    (organisasjon: Organisasjon) => {
      if (organisasjon.orgnr === valgtOrganisasjonsnummer) {
        return;
      }
      router.push(`/?virksomhet=${organisasjon.orgnr}`);
    },
    [router, valgtOrganisasjonsnummer],
  );

  if (!organisasjoner) {
    return <Loader />;
  }

  return (
    <Banner tittel='Kandidater'>
      <Virksomhetsvelger
        organisasjoner={organisasjonstre}
        initValgtOrgnr={valgtOrganisasjonsnummer ?? undefined}
        onChange={håndterEndreVirksomhet}
      />
      <NotifikasjonWidget />
    </Banner>
  );
};

export default Header;
