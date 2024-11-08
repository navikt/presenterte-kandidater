import { IFeilmelding } from './feiltyper';

export class kastError extends Error {
  public statuskode: number;
  public tittel: string;
  public beskrivelse: string;
  public url: string;

  constructor({ statuskode, tittel, stack, beskrivelse, url }: IFeilmelding) {
    super(beskrivelse);
    this.name = this.constructor.name;
    this.statuskode = statuskode ?? 500;
    this.tittel = tittel ?? 'Ukjent feil';
    this.stack = stack || this.stack;
    this.beskrivelse = beskrivelse ?? '';
    this.url = url ?? '';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statuskode: this.statuskode,
      tittel: this.tittel,
      beskrivelse: this.beskrivelse,
      url: this.url,
      stack: this.stack,
    };
  }
}
