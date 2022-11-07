import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import { Kandidatlistestatus } from "~/routes/kandidatliste/$stillingId";
import { ArbeidsgiversStatus } from "~/routes/kandidatliste/$stillingId/$kandidatId";
import type { Kandidatliste } from "~/routes/kandidatliste/$stillingId";
import type { Kandidat } from "~/routes/kandidatliste/$stillingId/$kandidatId";

const mocketKandidatliste = (
    stillingId: string,
    tittel: string,
    status = Kandidatlistestatus.Åpen
): Kandidatliste => ({
    stillingId,
    tittel,
    status,
    slettet: false,
    virksomhetsnummer: "123456789",
    opprettetTidspunkt: new Date().toISOString(),
    kandidater: [mocketKandidat("23d45ba2-ce9e-446e-9137-5ebb44bf6490")],
});

const mocketKandidat = (kandidatId: string): Kandidat => ({
    kandidatId,
    arbeidsgiversStatus: ArbeidsgiversStatus.ÅVurdere,
    hendelsestidspunkt: new Date().toISOString(),
    kandidat: {
        fornavn: "Joare",
        etternavn: "Mossby",
        epostadresse: "joare@mossby.no",
        telefon: "+47 90000000",
        harKontaktinformasjon: true,
    },
});

const mockedeKandidatlister = [
    mocketKandidatliste(
        "1c6894d1-127d-47d5-b3b0-c2778677ee49",
        "Volleyballskuespillere til Pascara Beach"
    ),
    mocketKandidatliste("f2387b55-c562-4d89-a337-0ae20ac22692", "Bartender på Galgeberg Corner"),
    mocketKandidatliste("720696c9-0077-464f-b0dc-c12b95db32d4", "Misjonærer for Gather Town"),
];

export const handlers = [
    rest.get(`${apiConfig.url}/kandidatlister`, (req, res, ctx) => {
        return res(ctx.json(mockedeKandidatlister));
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
