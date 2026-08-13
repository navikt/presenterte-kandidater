'use client';

import { useHentSamtykke } from './api/presenterte-kandidater-api/hentsamtykke/useHentSamtykke';
import {
  OrganisasjonerDTO,
  useUseOrganisasjoner,
} from './api/presenterte-kandidater-api/organisasjoner/useOrganisasjoner';
import Samtykke from './samtykke/page';
import { getBasePath } from './util/miljø';
import { Loader } from '@navikt/ds-react';
import { configureLogger } from '@navikt/next-logger';
import { useQueryState } from 'nuqs';
import * as React from 'react';

configureLogger({ basePath: getBasePath() });

interface IApplikasjonsContext {
  organisasjoner?: OrganisasjonerDTO;
  valgtOrganisasjonsnummer: string | null;
  settValgtOrganisasjonsnummer: (orgnr: string) => void;
}
export const ApplikasjonsContext = React.createContext<
  IApplikasjonsContext | undefined
>(undefined);

export interface ApplikasjonsContextProps {
  children?: React.ReactNode | undefined;
}

export const ApplikasjonsContextProvider: React.FC<
  ApplikasjonsContextProps
> = ({ children }) => {
  const { data, isLoading } = useUseOrganisasjoner();
  const samtykke = useHentSamtykke();

  const [orgnummer, setOrgnummer] = useQueryState('virksomhet');

  const oppdaterOrgnummer = React.useCallback(
    (orgnummer: string) => {
      void setOrgnummer(orgnummer);
    },
    [setOrgnummer],
  );

  React.useEffect(() => {
    if (orgnummer || !data || data.length === 0) {
      return;
    }
    const underenheter = data.filter(
      (organisasjon) => !!organisasjon.ParentOrganizationNumber,
    );
    if (underenheter.length > 0 && underenheter[0].OrganizationNumber) {
      void setOrgnummer(underenheter[0].OrganizationNumber);
    }
  }, [orgnummer, data, setOrgnummer]);

  const contextVerdi = React.useMemo(
    () => ({
      organisasjoner: data,
      valgtOrganisasjonsnummer: orgnummer,
      settValgtOrganisasjonsnummer: oppdaterOrgnummer,
    }),
    [data, orgnummer, oppdaterOrgnummer],
  );

  if (isLoading || samtykke.isLoading) {
    return <Loader />;
  }

  return (
    <ApplikasjonsContext.Provider value={contextVerdi}>
      {samtykke?.data?.harSamtykket ? children : <Samtykke />}
    </ApplikasjonsContext.Provider>
  );
};

export const useApplikasjonContext = () => {
  const context = React.useContext(ApplikasjonsContext);
  if (context === undefined) {
    throw new Error(
      'useApplikasjonContext må være i scope: ApplikasjonsContextProvider',
    );
  }
  return context;
};
