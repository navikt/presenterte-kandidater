'use client';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import * as React from 'react';
import {
  OrganisasjonerDTO,
  useUseOrganisasjoner,
} from './api/presenterte-kandidater-api/organisasjoner/useOrganisasjoner';

interface IApplikasjonsContext {
  organisasjoner?: OrganisasjonerDTO;
  valgtOrganisasjonsnummer: string | null;
  orgnrHook?: () => [string | null, (orgnr: string) => void];
}
export const ApplikasjonsContext = React.createContext<IApplikasjonsContext>({
  valgtOrganisasjonsnummer: null,
});

export interface ApplikasjonsContextProps {
  children?: React.ReactNode | undefined;
}

export const ApplikasjonsContextProvider: React.FC<
  ApplikasjonsContextProps
> = ({ children }) => {
  const { data, isLoading } = useUseOrganisasjoner();
  const router = useRouter();
  const [orgnummer, setOrgnummer] = useQueryState('virksomhet');

  const oppdaterOrgnummer = React.useCallback(
    (orgnummer: string) => {
      router.push(`/?virksomhet=${orgnummer}`);
    },
    [router]
  );

  if (!orgnummer && data) {
    setOrgnummer(data[0].OrganizationNumber);
  }

  const useOrgnrHook: () => [string | null, (orgnr: string) => void] =
    React.useCallback(
      () => [orgnummer, oppdaterOrgnummer],
      [orgnummer, oppdaterOrgnummer]
    );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ApplikasjonsContext.Provider
      value={{
        organisasjoner: data,
        valgtOrganisasjonsnummer: orgnummer,
        orgnrHook: useOrgnrHook,
      }}
    >
      {children}
    </ApplikasjonsContext.Provider>
  );
};

export const useApplikasjonContext = () => {
  const context = React.useContext(ApplikasjonsContext);
  if (context === undefined) {
    throw new Error(
      'useApplikasjonContext må være i scope: ApplikasjonsContextProvider'
    );
  }
  return context;
};
