export type Kandidatlistesammendrag = {
    kandidatliste: Omit<Kandidatliste, "kandidater">;
    antallKandidater: number;
};

export type Kandidatliste = {
    stillingId: string;
    tittel: string;
    status: Kandidatlistestatus;
    slettet: boolean;
    virksomhetsnummer: string;
    opprettetTidspunkt: string;
    kandidater: Kandidatsammendrag[];
};

export type Kandidatlistestatus = "ÅPEN" | "LUKKET";
export type Kandidatstatus = "TIL_VURDERING" | "IKKE_AKTUELL" | "AKTUELL" | "FÅTT_JOBBEN";

export type Kandidat = {
    kandidatId: string;
    hendelsestidspunkt: string;
    arbeidsgiversStatus: Kandidatstatus;
    cv: Cv;
};

export type Kandidatsammendrag = {
    kandidatId: string;
    hendelsestidspunkt: string;
    arbeidsgiversStatus: Kandidatstatus;
    cv: CvSammendrag;
};

export type CvSammendrag = {
    fornavn: string;
    etternavn: string;
    kompetanse: string[];
    arbeidserfaring: string[];
    ønsketYrke: string[];
};

export type Cv = CvSammendrag & {
    harKontaktinformasjon: boolean;
    epostadresse: string | null;
    telefon: string | null;
};
