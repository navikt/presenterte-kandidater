'use client';

/**
 * Endepunkt /useOrganisasjoner
 */
import { PresenterteKandidaterAPI } from '../../api-routes';
import { getAPIwithSchema } from '../../fetcher';
import useSWRImmutable from 'swr/immutable';
import { z } from 'zod';

const useOrganisasjonerEndepunkt =
  PresenterteKandidaterAPI.internUrl + '/organisasjoner';

const OrganisasjonDTO = z.object({
  Name: z.string(),
  OrganizationNumber: z.string(),
  OrganizationForm: z.string(),
  ParentOrganizationNumber: z.string().nullable(),
});

const OrganisasjonerSchema = z.array(OrganisasjonDTO);

export type OrganisasjonerDTO = z.infer<typeof OrganisasjonerSchema>;
export type OrganisasjonDTO = z.infer<typeof OrganisasjonDTO>;

export const useUseOrganisasjoner = () =>
  useSWRImmutable(
    useOrganisasjonerEndepunkt,
    getAPIwithSchema(OrganisasjonerSchema),
  );
