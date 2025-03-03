/**
 * Endepunkt /useHentSamtykke
 */
import { PresenterteKandidaterAPI } from '../../api-routes';
import { getAPIwithSchema } from '../../fetcher';
import useSWRImmutable from 'swr/immutable';
import { z } from 'zod';

const hentSamtykkeEndepunkt = `${PresenterteKandidaterAPI.internUrl}/hentsamtykke`;

const HentSamtykkeSchema = z.object({
  harSamtykket: z.boolean(),
});

export type useHentSamtykkeDTO = z.infer<typeof HentSamtykkeSchema>;

export const useHentSamtykke = () => {
  return useSWRImmutable(
    hentSamtykkeEndepunkt,
    getAPIwithSchema(HentSamtykkeSchema),
  );
};
