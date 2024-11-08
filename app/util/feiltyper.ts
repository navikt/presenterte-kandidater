import { ZodError } from 'zod';

export interface IFeilmelding {
  zodError?: ZodError;
  statuskode?: number;
  tittel?: string;
  stack?: string;
  beskrivelse?: string;
  url?: string;
}
