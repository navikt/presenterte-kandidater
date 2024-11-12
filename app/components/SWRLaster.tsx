import { Loader } from '@navikt/ds-react';
import * as React from 'react';
import { SWRResponse } from 'swr';
import { ZodError } from 'zod';
import Feilmelding from './Feilmelding';

export interface ISWRLasterProps<T> {
  hook: SWRResponse<T, Error> | undefined;
  skeleton?: React.ReactNode;
  children: (data: T) => React.ReactNode; // Children as a function
}

function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

const SWRLaster = <T,>({
  hook,
  skeleton,
  children,
}: ISWRLasterProps<T>): React.ReactElement | null => {
  if (!hook) {
    return <>{skeleton ? skeleton : <Loader />}</>;
  }

  if (hook.isLoading || hook.isValidating) {
    return <>{skeleton ? skeleton : <Loader />}</>;
  }

  if (hook.error) {
    return (
      <Feilmelding
        {...hook.error}
        tittel='Feil ved henting av data'
        zodError={isZodError(hook.error) ? hook.error : undefined}
      />
    );
  }

  if (hook.data) {
    return <>{children(hook.data)}</>;
  }

  return null;
};

export default SWRLaster;
