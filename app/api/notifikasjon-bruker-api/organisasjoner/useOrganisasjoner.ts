'use client';
/**
 * Endepunkt /useOrganisasjoner
 */
import useSWRImmutable from 'swr/immutable';
import { z } from 'zod';
import { NotifikasjonAPI } from '../../api-routes';
import { getAPIwithSchema } from '../../fetcher';

const useOrganisasjonerEndepunkt =
  NotifikasjonAPI.internUrl + '/organisasjoner';

const OrganisasjonDTO = z.object({
  Name: z.string(),
  OrganizationNumber: z.string(),
  OrganizationForm: z.string(),
  ParentOrganizationNumber: z.string(),
});

const OrganisasjonerSchema = z.array(OrganisasjonDTO);

export type OrganisasjonerDTO = z.infer<typeof OrganisasjonerSchema>;
export type OrganisasjonDTO = z.infer<typeof OrganisasjonDTO>;

export const useUseOrganisasjoner = () =>
  useSWRImmutable(
    useOrganisasjonerEndepunkt,
    getAPIwithSchema(OrganisasjonerSchema)
  );
