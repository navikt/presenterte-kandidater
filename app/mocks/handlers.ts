import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import { mockedeKandidatlistesammendrag, mockedeKandidatlister } from "./mockKandidatliste";
import mockedeOrganisasjoner from "./mockOrganisasjoner";

export const handlers = [
    rest.get(`${apiConfig.url}/organisasjoner`, (_, res, ctx) => {
        return res(ctx.json(mockedeOrganisasjoner));
    }),

    rest.get(`${apiConfig.url}/kandidatlister`, (req, res, ctx) => {
        return res(ctx.json(mockedeKandidatlistesammendrag));
    }),

    rest.get(`${apiConfig.url}/kandidatlister/:stillingId`, (req, res, ctx) => {
        return res(
            ctx.json(
                mockedeKandidatlister.find(
                    (liste) => liste.kandidatliste.stillingId === req.params.stillingId
                )
            )
        );
    }),
];
