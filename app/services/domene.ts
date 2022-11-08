export type Kandidatlisteoppsummering = {
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
    kandidater: Kandidat[];
};

export type Kandidatlistestatus = "ÅPEN" | "LUKKET";

export type Kandidat = {
    kandidatId: string;
    hendelsestidspunkt: string;
    arbeidsgiversStatus: Kandidatstatus;
    kandidat: Cv;
};

export type Kandidatstatus = "Å_VURDERE" | "IKKE_AKTUELL" | "AKTUELL" | "FÅTT_JOBBEN";

export type Cv = {
    fornavn: string;
    etternavn: string;
    epostadresse: string | null;
    telefon: string | null;
    harKontaktinformasjon: boolean;
};
