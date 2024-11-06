'use client';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import { useEffect, useState } from 'react';

import type { Miljø as NotifikasjonMiljø } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { Loader } from '@navikt/ds-react';
import type { FunctionComponent } from 'react';
import { useApplikasjonContext } from '../ApplikasjonsContext';
import { hentMiljø, Miljø } from '../util/miljø';

const Header: FunctionComponent = () => {
  const { organisasjoner, orgnrHook } = useApplikasjonContext();

  const [renderWidget, setRenderWidget] = useState<boolean>(false);
  const miljø = hentMiljøTilNotifikasjonWidget();

  useEffect(() => {
    setRenderWidget(true);
  }, []);

  if (!organisasjoner) {
    return <Loader />;
  }
  return (
    <Bedriftsmeny
      sidetittel='Kandidater'
      organisasjoner={organisasjoner}
      orgnrSearchParam={orgnrHook}
    >
      {renderWidget && (
        <NotifikasjonWidget
          miljo={miljø}
          apiUrl='/api/notifikasjon-bruker-api/graphql'
        />
      )}
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
