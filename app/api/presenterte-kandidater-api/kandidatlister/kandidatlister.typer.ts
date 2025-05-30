import { PresenterteKandidaterAPI } from '../../api-routes';
import { z } from 'zod';

export const kandidatlisterEndepunkt = (virksomhetsNummer: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidatlister?virksomhetsnummer=${virksomhetsNummer}`;

const Status = z.enum(['ÅPEN', 'LUKKET']);

export const KandidatlisteSchema = z.object({
  uuid: z.string().uuid(),
  stillingId: z.string().uuid(),
  tittel: z.string(),
  status: Status,
  slettet: z.boolean(),
  virksomhetsnummer: z.string(),
  sistEndret: z.string(), // Expecting ISO string for ZonedDateTime
  opprettet: z.string(), // Expecting ISO string for ZonedDateTime
});

const KandidatlisteMedAntallKandidaterSchema = z.object({
  kandidatliste: KandidatlisteSchema,
  antallKandidater: z.number(),
});

export const KandidatlisterSchema = z.array(
  KandidatlisteMedAntallKandidaterSchema,
);

export type KandidatlisterDTO = z.infer<typeof KandidatlisterSchema>;
export type KandidatlisteDTO = z.infer<typeof KandidatlisteSchema>;
export type KandidatlisteMedAntallKandidaterDTO = z.infer<
  typeof KandidatlisteMedAntallKandidaterSchema
>;
