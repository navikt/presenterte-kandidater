/**
 * Endepunkt /useKandidatlister
 */
import useSWRImmutable from 'swr/immutable';
import { getAPIwithSchema } from '../../fetcher';
import {
  kandidatlisterEndepunkt,
  KandidatlisterSchema,
} from './kandidatlister.typer';

export const useUseKandidatlister = (virksomhetsNummer: string | null) => {
  return useSWRImmutable(
    virksomhetsNummer ? kandidatlisterEndepunkt(virksomhetsNummer) : null,
    getAPIwithSchema(KandidatlisterSchema),
  );
};
