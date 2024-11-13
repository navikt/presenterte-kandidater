import { z } from 'zod';
import { PresenterteKandidaterAPI } from '../../../api-routes';
import { KandidatlisteSchema } from '../../kandidatlister/kandidatlister.typer';

export const kandidatlisteEndepunkt = (stillingId: string) =>
  `${PresenterteKandidaterAPI.internUrl}/kandidatliste/${stillingId}`;

export enum Kandidatvurdering {
  TilVurdering = 'TIL_VURDERING',
  Aktuell = 'AKTUELL',
  IkkeAktuell = 'IKKE_AKTUELL',
  FåttJobben = 'FÅTT_JOBBEN',
}

const ArbeidsgiversVurdering = z.enum([
  Kandidatvurdering.TilVurdering,
  Kandidatvurdering.Aktuell,
  Kandidatvurdering.IkkeAktuell,
  Kandidatvurdering.FåttJobben,
]);

const KandidatSchema = z.object({
  uuid: z.string().uuid(),
  aktørId: z.string().optional(),
  kandidatlisteId: z.string().optional(),
  arbeidsgiversVurdering: ArbeidsgiversVurdering,
  sistEndret: z.string().optional(),
});

export const kursSchema = z.object({
  tittel: z.string(),
  omfangVerdi: z.number().nullable(),
  omfangEnhet: z.string().optional().nullable(),
  tilDato: z.string().nullable(),
});

export enum Språkkompetanse {
  IkkeOppgitt = 'IKKE_OPPGITT',
  Nybegynner = 'NYBEGYNNER',
  Godt = 'GODT',
  VeldigGodt = 'VELDIG_GODT',
  Førstespråk = 'FOERSTESPRAAK',
}

const språkkompetanseSchema = z.nativeEnum(Språkkompetanse);

export const SpråkkompetanseSchema = z.object({
  navn: z.string(),
  muntlig: språkkompetanseSchema,
  skriftlig: språkkompetanseSchema,
});

export const AnnenErfaringSchema = z.object({
  rolle: z.string(),
  beskrivelse: z.string().nullable(),
  fraDato: z.string().nullable(),
  tilDato: z.string().nullable(),
});

const ArbeidserfaringSchema = z.object({
  fraDato: z.string(),
  tilDato: z.string().nullable(),
  arbeidsgiver: z.string(),
  sted: z.string(),
  stillingstittel: z.string().nullable(),
  beskrivelse: z.string(),
});

const UtdanningSchema = z.object({
  utdanningsretning: z.string(),
  beskrivelse: z.string(),
  utdannelsessted: z.string(),
  fra: z.string(),
  til: z.string().nullable(),
});

const AnnenGodkjenningSchema = z.object({
  tittel: z.string(),
  dato: z.string().nullable(),
});

export const CvSchema = z.object({
  fornavn: z.string(),
  etternavn: z.string(),
  bosted: z.string(),
  mobiltelefonnummer: z.string().nullable(),
  telefonnummer: z.string().nullable(),
  epost: z.string().nullable(),
  alder: z.number(),
  kompetanse: z.array(z.string()),
  arbeidserfaring: z.array(ArbeidserfaringSchema),
  sammendrag: z.string(),
  utdanning: z.array(UtdanningSchema),
  språk: z.array(SpråkkompetanseSchema),
  førerkort: z.array(z.object({ førerkortKodeKlasse: z.string() })),
  fagdokumentasjon: z.array(z.string()),
  godkjenninger: z.array(z.string()),
  andreGodkjenninger: z.array(AnnenGodkjenningSchema),
  kurs: z.array(kursSchema),
  andreErfaringer: z.array(AnnenErfaringSchema),
});

const KandidatMedCvSchema = z.object({
  cv: CvSchema.nullable(),
  kandidat: KandidatSchema,
});

export const KandidatlisteForStillingSchema = z.object({
  kandidater: z.array(KandidatMedCvSchema),
  kandidatliste: KandidatlisteSchema,
});

export type ArbeidserfaringDTO = z.infer<typeof ArbeidserfaringSchema>;
export type KandidatMedCvDTO = z.infer<typeof KandidatMedCvSchema>;
export type AnnenGodkjenningDTO = z.infer<typeof AnnenGodkjenningSchema>;
export type KursDTO = z.infer<typeof kursSchema>;
export type UtdanningDTO = z.infer<typeof UtdanningSchema>;
export type KandidatCvDTO = z.infer<typeof CvSchema>;
export type SpråkDTO = z.infer<typeof SpråkkompetanseSchema>;

export type KandidatlisteDTO = z.infer<typeof KandidatlisteSchema>;
export type AnnenErfaringDTO = z.infer<typeof AnnenErfaringSchema>;
export type ArbeidsgiversVurderingDTO = z.infer<typeof ArbeidsgiversVurdering>;

export type KandidatlisteForStillingDTO = z.infer<
  typeof KandidatlisteForStillingSchema
>;
