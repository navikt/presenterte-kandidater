import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import { mockedeKandidatlisteoppsummeringer, mockedeKandidatlister } from "./mockKandidatliste";
import mockedeOrganisasjoner from "./mockOrganisasjoner";

export const handlers = [
    rest.get(`${apiConfig.url}/organisasjoner`, (_, res, ctx) => {
        return res(ctx.json(mockedeOrganisasjoner));
    }),

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
