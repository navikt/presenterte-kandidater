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

    rest.get(`${apiConfig.url}/kandidatlister/:kandidatlisteId`, (req, res, ctx) => {
        return res(
            ctx.json(
                mockedeKandidatlister.find(
                    (liste) => liste.kandidatliste.uuid === req.params.kandidatlisteId
                )
            )
        );
    }),

    rest.get(
        `${apiConfig.url}/kandidatlister/:kandidatlisteId/kandidat/:kandidatId`,
        (req, res, ctx) => {
            return res(
                ctx.json(
                    mockedeKandidatlister
                        .find((liste) => liste.kandidatliste.uuid === req.params.kandidatlisteId)
                        ?.kandidater.find(
                            (kandidat) => kandidat.kandidat.uuid === req.params.kandidatId
                        )
                )
            );
        }
    ),
];
