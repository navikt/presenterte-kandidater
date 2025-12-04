'use client';

import { useApplikasjonContext } from '../ApplikasjonsContext';
import { getBasePath, hentMiljø, Miljø } from '../util/miljø';
import type { Miljø as NotifikasjonMiljø } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import Bedriftsmeny, { Organisasjon } from '@navikt/bedriftsmeny';
import { Loader } from '@navikt/ds-react';
import type { FunctionComponent } from 'react';

const Header: FunctionComponent = () => {
  const { organisasjoner, orgnrHook } = useApplikasjonContext();
  const miljø = hentMiljøTilNotifikasjonWidget();

  if (!organisasjoner) {
    return <Loader />;
  }
  return (
    <Bedriftsmeny
      sidetittel='Kandidater'
      //TODO Endre hvis bedriftmeny fikser null på parent organisasjon
      organisasjoner={organisasjoner as unknown as Organisasjon[]}
      orgnrSearchParam={orgnrHook}
    >
      <NotifikasjonWidget
        miljo={miljø}
        apiUrl={`${getBasePath()}/api/notifikasjon-bruker-api/graphql`}
      />
    </Bedriftsmeny>
  );
};

const hentMiljøTilNotifikasjonWidget = (): NotifikasjonMiljø => {
  switch (hentMiljø()) {
    case Miljø.DevGcp:
      return 'dev';
    case Miljø.ProdGcp:
      return 'prod';
    case Miljø.Lokalt:
      return 'local';
  }
};

export default Header;
