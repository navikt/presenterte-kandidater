import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import type {
    Kandidat,
    Kandidatliste,
    Kandidatlistestatus,
    Kandidatstatus,
} from "~/services/domene";

const mocketKandidatliste = (
    stillingId: string,
    tittel: string,
    status: Kandidatlistestatus = "ÅPEN"
): Kandidatliste => {
    return {
        stillingId,
        tittel,
        status,
        slettet: false,
        virksomhetsnummer: "123456789",
        opprettetTidspunkt: new Date().toISOString(),
        kandidater: mockedeKandidater,
    };
};

const mocketKandidat = (
    kandidatId: string,
    kandidat: object = {},
    arbeidsgiversStatus: Kandidatstatus = "Å_VURDERE"
): Kandidat => ({
    kandidatId,
    arbeidsgiversStatus,
    hendelsestidspunkt: new Date().toISOString(),
    kandidat: {
        fornavn: "Kristoffer",
        etternavn: "Kandidat",
        epostadresse: "kristoffer@kandidat.no",
        telefon: "+47 91234567",
        harKontaktinformasjon: true,
        ...kandidat,
    },
});

const mockedeKandidater = [
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

const mockedeKandidatlister = [
    mocketKandidatliste(
        "1c6894d1-127d-47d5-b3b0-c2778677ee49",
        "Volleyballskuespillere til Pascara Beach"
    ),
    mocketKandidatliste("f2387b55-c562-4d89-a337-0ae20ac22692", "Bartender på Galgeberg Corner"),
    mocketKandidatliste("720696c9-0077-464f-b0dc-c12b95db32d4", "Misjonærer for Gather Town"),
];

const mockedeKandidatlisteoppsummeringer = mockedeKandidatlister.map((kandidatliste) => ({
    kandidatliste,
    antallKandidater: kandidatliste.kandidater.length,
}));

export const handlers = [
    rest.get(`${apiConfig.url}/kandidatlister`, (req, res, ctx) => {
        return res(ctx.json(mockedeKandidatlisteoppsummeringer));
    }),

    rest.get(`${apiConfig.url}/kandidatlister/:stillingId`, (req, res, ctx) => {
        return res(
            ctx.json(
                mockedeKandidatlister.find((liste) => liste.stillingId === req.params.stillingId)
            )
        );
    }),

    rest.get(`${apiConfig.url}/kandidatlister/:stillingId/:kandidatId`, (req, res, ctx) => {
        return res(
            ctx.json(
                mockedeKandidatlister
                    .find((liste) => liste.stillingId === req.params.stillingId)
                    ?.kandidater.find((kandidat) => kandidat.kandidatId === req.params.kandidatId)
            )
        );
    }),
];
