import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import { Kandidatlistestatus } from "~/routes/kandidatliste/$stillingId";
import { ArbeidsgiversStatus } from "~/routes/kandidatliste/$stillingId/$kandidatId";
import type { Kandidatliste } from "~/routes/kandidatliste/$stillingId";
import type { Kandidat } from "~/routes/kandidatliste/$stillingId/$kandidatId";

const mocketKandidatliste = (
    stillingId = "1c6894d1-127d-47d5-b3b0-c2778677ee49"
): Kandidatliste => ({
    stillingId,
    tittel: "Volleyballskuespillere til Pascara Beach",
    virksomhetsnummer: "123456789",
    status: Kandidatlistestatus.Åpen,
    slettet: false,
    kandidater: [mocketKandidat("23d45ba2-ce9e-446e-9137-5ebb44bf6490")],
});

const mocketKandidat = (kandidatId = "23d45ba2-ce9e-446e-9137-5ebb44bf6490"): Kandidat => ({
    kandidatId,
    arbeidsgiversStatus: ArbeidsgiversStatus.ÅVurdere,
    hendelsestidspunkt: new Date(),
    kandidat: {
        fornavn: "Joare",
        etternavn: "Mossby",
        epostadresse: "joare@mossby.no",
        harKontaktinformasjon: true,
        telefon: "+47 90000000",
    },
});

export const handlers = [
    rest.get(`${apiConfig.url}/kandidatlister`, (req, res, ctx) => {
        return res(ctx.json([mocketKandidatliste()]));
    }),

    rest.get(`${apiConfig.url}/kandidatlister/:stillingId`, (req, res, ctx) => {
        return res(ctx.json(mocketKandidatliste(req.params.stillingId as string)));
    }),

    rest.get(`${apiConfig.url}/kandidatlister/:stillingId/:kandidatId`, (req, res, ctx) => {
        return res(ctx.json(mocketKandidat(req.params.kandidatId as string)));
    }),
];
