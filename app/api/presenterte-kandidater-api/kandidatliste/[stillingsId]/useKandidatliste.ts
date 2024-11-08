'use client';
/**
 * Endepunkt /useKandidatliste
 */
import useSWRImmutable from 'swr/immutable';
import { getAPIwithSchema } from '../../../fetcher';
import { kandidatlisteEndepunkt, KandidatlisteForStillingSchema } from './kandidatliste.typer';


export const useUseKandidatliste = (stillingId: string) =>
  useSWRImmutable(
    stillingId ? kandidatlisteEndepunkt(stillingId) : null,
    getAPIwithSchema(KandidatlisteForStillingSchema)
  );
