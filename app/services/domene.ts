export type Kandidatlistestatus = "ÅPEN" | "LUKKET";
export type Kandidatvurdering = "TIL_VURDERING" | "IKKE_AKTUELL" | "AKTUELL" | "FÅTT_JOBBEN";

export type Kandidatliste = {
    kandidatliste: Kandidatlistebase;
    kandidater: Kandidat[];
};

export type Kandidatlistesammendrag = {
    kandidatliste: Kandidatlistebase;
    antallKandidater: number;
};

type Kandidatlistebase = {
    stillingId: string;
    uuid: string;
    tittel: string;
    status: Kandidatlistestatus;
    slettet: boolean;
    virksomhetsnummer: string;
    sistEndret: string;
    opprettet: string;
};

export type Kandidat = {
    kandidat: Kandidatbase;
    vurdering: Kandidatvurdering;
    cv: Cv;
};

type Kandidatbase = {
    uuid: string;
    opprettet: string;
};

export type Cv = {
    fornavn: string;
    etternavn: string;
    kompetanse: string[];
    arbeidserfaring: Arbeidserfaring[];
    utdanning: Utdanning[];
    ønsketYrke: string[];
    språk: Språk[];
    sammendrag: string;
    alder: number;
    bosted: string;

    harKontaktinformasjon: boolean;
    epostadresse: string | null;
    mobiltelefonnummer: string | null;
};

type Arbeidserfaring = {
    fraDato: string;
    tilDato: string;
    arbeidsgiver: string;
    sted: string;
    stillingstittel: string;
    beskrivelse: string;
};

type Utdanning = {
    utdanningsretning: string;
    beskrivelse: string;
    utdannelsessted: string;
    fra: string;
    til: string;
};

type Språk = {
    navn: string;
    muntlig: string;
    skriftlig: string;
};
