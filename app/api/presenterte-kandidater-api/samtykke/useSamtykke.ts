/**
 * Endepunkt /useSamtykke
 */
import useSWRImmutable from 'swr/immutable';
import { z } from 'zod';
import { PresenterteKandidaterAPI } from '../../api-routes';
import { getAPIwithSchema } from '../../fetcher';

const samtykkeEndepunkt = `${PresenterteKandidaterAPI.internUrl}/samtykke`;

const SamtykkeSchema = z.object({
  harSamtykke: z.boolean(),
});

export type useSamtykkeDTO = z.infer<typeof SamtykkeSchema>;

export const useSamtykke = () => {
  //TODO Hack for å håndtere samtykke bare via http 200
  const swr = useSWRImmutable(
    samtykkeEndepunkt,
    getAPIwithSchema(SamtykkeSchema)
  );

  return {
    ...swr,
    data: swr.data ? { harSamtykke: true } : { harSamtykke: false },
  };
};
