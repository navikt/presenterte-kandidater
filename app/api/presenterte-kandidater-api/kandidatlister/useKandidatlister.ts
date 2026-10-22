/**
 * Endepunkt /useKandidatlister
 */
import { getAPIwithSchema, skalPrøvePåNytt } from '../../fetcher';
import {
  kandidatlisterEndepunkt,
  KandidatlisterSchema,
} from './kandidatlister.typer';
import useSWRImmutable from 'swr/immutable';

export const useUseKandidatlister = (virksomhetsNummer: string | null) => {
  return useSWRImmutable(
    virksomhetsNummer ? kandidatlisterEndepunkt(virksomhetsNummer) : null,
    getAPIwithSchema(KandidatlisterSchema),
    { shouldRetryOnError: skalPrøvePåNytt },
  );
};
