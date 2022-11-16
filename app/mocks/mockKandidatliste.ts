import type {
    Kandidatlistestatus,
    Kandidatliste,
    Kandidatvurdering,
    Kandidat,
    Cv,
    Kandidatlistesammendrag,
} from "~/services/domene";

const mocketKandidatliste = (
    kandidatlisteId: string,
    tittel: string,
    status: Kandidatlistestatus = "ÅPEN"
): Kandidatliste => {
    return {
        kandidatliste: {
            stillingId: "123",
            uuid: kandidatlisteId,
            tittel,
            status,
            slettet: false,
            virksomhetsnummer: "123456789",
            opprettet: new Date().toISOString(),
            sistEndret: new Date().toISOString(),
        },
        kandidater: mockedeKandidater,
    };
};

// Jævli rart å bruke kandidatlisteId

const mocketKandidat = (
    kandidatId: string,
    cv: Partial<Cv> = {},
    vurdering: Kandidatvurdering = "TIL_VURDERING"
): Kandidat => ({
    kandidat: {
        uuid: kandidatId,
        kandidatlisteId: "",
        opprettet: new Date().toISOString(),
    },
    vurdering,
    cv: {
        fornavn: "Kristoffer",
        etternavn: "Kandidat",
        alder: 30,
        epostadresse: "kristoffer@kandidat.no",
        mobiltelefonnummer: "+47 91234567",
        harKontaktinformasjon: true,
        kompetanse: ["Kniv"],
        arbeidserfaring: [
            {
                arbeidsgiver: "Kokkerier AS",
                stillingstittel: "Kokk i Kokkerier",
                beskrivelse: "Kokkerier i Kokkerier",
                fraDato: new Date().toISOString(),
                tilDato: new Date().toISOString(),
                sted: "Kokkestad",
            },
        ],
        bosted: "Kokkestad",
        ønsketYrke: ["Kokk"],
        utdanning: [
            {
                fra: "2021-09",
                til: "2021-11",
                beskrivelse: "Generell utdanning",
                utdannelsessted: "Generellandia",
                utdanningsretning: "Generalitet",
            },
        ],
        språk: [
            {
                navn: "Engelsk",
                muntlig: "Godt",
                skriftlig: "Svært godt",
            },
        ],
        sammendrag: "Ønsker å jobbe som kokk",
        ...cv,
    },
});

export const mockedeKandidater = [
    mocketKandidat("23d45ba2-ce9e-446e-9137-5ebb44bf6490", {
        fornavn: "Joare",
        etternavn: "Mossby",
    }),
    mocketKandidat("2f122c9f-24c3-4a6b-bd01-56a38825dfcf"),
    mocketKandidat(
        "3a175a91-5ee8-4811-be11-5a5d2d33b967",
        {
            fornavn: "Ola",
            etternavn: "Nordmann",
        },
        "AKTUELL"
    ),
];

export const mockedeKandidatlister = [
    mocketKandidatliste(
        "1c6894d1-127d-47d5-b3b0-c2778677ee49",
        "Volleyballskuespillere til Pascara Beach"
    ),
    mocketKandidatliste("f2387b55-c562-4d89-a337-0ae20ac22692", "Bartender på Galgeberg Corner"),
    mocketKandidatliste("720696c9-0077-464f-b0dc-c12b95db32d4", "Misjonærer for Gather Town"),
];

export const mockedeKandidatlistesammendrag: Kandidatlistesammendrag[] = mockedeKandidatlister.map(
    (kandidatliste) => ({
        kandidatliste: kandidatliste.kandidatliste,
        antallKandidater: kandidatliste.kandidater.length,
    })
);
