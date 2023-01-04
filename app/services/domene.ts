export type Kandidatlistestatus = "ÅPEN" | "LUKKET";

export enum Kandidatvurdering {
    TilVurdering = "TIL_VURDERING",
    IkkeAktuell = "IKKE_AKTUELL",
    Aktuell = "AKTUELL",
    FåttJobben = "FÅTT_JOBBEN",
}

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
    cv: Cv | null;
};

type Kandidatbase = {
    uuid: string;
    arbeidsgiversVurdering: Kandidatvurdering;
    opprettet: string;
};

export type Cv = {
    fornavn: string;
    etternavn: string;
    kompetanse: string[];
    arbeidserfaring: Arbeidserfaring[];
    utdanning: Utdanning[];
    språk: Språk[];
    sammendrag: string;
    alder: number;
    bosted: string;

    epost: string | null;
    mobiltelefonnummer: string | null;
    telefonnummer: string | null;
};

export type Arbeidserfaring = {
    fraDato: string;
    tilDato: string | null;
    arbeidsgiver: string;
    sted: string;
    stillingstittel: string | null;
    beskrivelse: string;
};

export type Utdanning = {
    utdanningsretning: string;
    beskrivelse: string;
    utdannelsessted: string;
    fra: string;
    til: string;
};

export type Språk = {
    navn: string;
    muntlig: string;
    skriftlig: string;
};
