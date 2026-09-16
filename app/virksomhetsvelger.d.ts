declare module '@navikt/virksomhetsvelger' {
  import { ComponentType, ReactNode } from 'react';

  export interface Organisasjon {
    orgnr: string;
    navn: string;
    underenheter: Organisasjon[];
  }

  export const Banner: ComponentType<{
    tittel: string;
    children?: ReactNode;
  }>;

  export const Virksomhetsvelger: ComponentType<{
    organisasjoner: any;
    initValgtOrgnr?: string;
    onChange: (organisasjon: Organisasjon) => void;
  }>;
}
