import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import { mockedeKandidatlister, mockedeKandidatlistesammendrag } from "./mockKandidatliste";
import { mockedeNotifikasjoner } from "./mockNotifikasjoner";
import mockedeOrganisasjoner from "./mockOrganisasjoner";

export const handlers = [
    rest.get(`${apiConfig.url}/samtykke`, (_, res, ctx) => {
        return res(ctx.status(200));
    }),

    rest.post(`${apiConfig.url}/samtykke`, (_, res, ctx) => {
        return res(ctx.status(200));
    }),

    rest.get(`${apiConfig.url}/organisasjoner`, (_, res, ctx) => {
        return res(ctx.json(mockedeOrganisasjoner));
    }),

    rest.get(`${apiConfig.url}/kandidatlister`, (req, res, ctx) => {
        const virksomhet = new URL(req.url).searchParams.get("virksomhetsnummer");

        return res(ctx.json(mockedeKandidatlistesammendrag(virksomhet)));
    }),

    rest.get(`${apiConfig.url}/kandidatliste/:stillingId`, (req, res, ctx) => {
        return res(
            ctx.json(
                mockedeKandidatlister.find(
                    (liste) => liste.kandidatliste.stillingId === req.params.stillingId
                )
            )
        );
    }),

    rest.put(`${apiConfig.url}/kandidat/:kandidatId/vurdering`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),

    rest.delete(`${apiConfig.url}/kandidat/:kandidatId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),

    rest.post(`${apiConfig.url}/kandidat/:kandidatId/registrerviskontaktinfo`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),

    rest.all(`${apiConfig.url}/api/graphql`, (req, res, ctx) => {
        return res(ctx.json(mockedeNotifikasjoner));
    }),
];
