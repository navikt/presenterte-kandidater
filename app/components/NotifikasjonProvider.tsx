'use client';

import { getBasePath, hentMiljø, Miljø } from '../util/miljø';
import type { Miljø as NotifikasjonMiljø } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { FunctionComponent, ReactNode } from 'react';

export const hentMiljøTilNotifikasjonWidget = (): NotifikasjonMiljø => {
  switch (hentMiljø()) {
    case Miljø.DevGcp:
      return 'dev';
    case Miljø.ProdGcp:
      return 'prod';
    case Miljø.Lokalt:
      return 'local';
  }
};

const NotifikasjonProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <NotifikasjonWidgetProvider
    miljo={hentMiljøTilNotifikasjonWidget()}
    apiUrl={`${getBasePath()}/api/notifikasjon-bruker-api/graphql`}
  >
    {children}
  </NotifikasjonWidgetProvider>
);

export default NotifikasjonProvider;
