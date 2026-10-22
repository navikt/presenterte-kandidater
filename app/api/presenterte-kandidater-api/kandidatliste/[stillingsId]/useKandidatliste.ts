'use client';

/**
 * Endepunkt /useKandidatliste
 */
import { getAPIwithSchema, skalPrøvePåNytt } from '../../../fetcher';
import {
  kandidatlisteEndepunkt,
  KandidatlisteForStillingSchema,
} from './kandidatliste.typer';
import useSWRImmutable from 'swr/immutable';

export const useUseKandidatliste = (stillingId: string) =>
  useSWRImmutable(
    stillingId ? kandidatlisteEndepunkt(stillingId) : null,
    getAPIwithSchema(KandidatlisteForStillingSchema),
    { shouldRetryOnError: skalPrøvePåNytt },
  );
