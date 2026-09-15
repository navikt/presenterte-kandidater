import {
  OrganisasjonDTO,
  OrganisasjonerDTO,
} from '@/app/api/presenterte-kandidater-api/organisasjoner/useOrganisasjoner';
import { Organisasjon } from '@navikt/virksomhetsvelger';

export const tilOrganisasjonstre = (
  organisasjoner: OrganisasjonerDTO,
): Organisasjon[] => {
  const barnPerParent = new Map<string, OrganisasjonDTO[]>();
  const røtter: OrganisasjonDTO[] = [];

  for (const organisasjon of organisasjoner) {
    const parent = organisasjon.ParentOrganizationNumber;
    if (!parent) {
      røtter.push(organisasjon);
      continue;
    }
    const søsken = barnPerParent.get(parent);
    if (søsken) {
      søsken.push(organisasjon);
    } else {
      barnPerParent.set(parent, [organisasjon]);
    }
  }

  const tilOrg = (organisasjon: OrganisasjonDTO): Organisasjon => ({
    orgnr: organisasjon.OrganizationNumber,
    navn: organisasjon.Name,
    underenheter: (
      barnPerParent.get(organisasjon.OrganizationNumber) ?? []
    ).map(tilOrg),
  });

  return røtter.map(tilOrg);
};
