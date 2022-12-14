import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";
import { mockedeKandidatlistesammendrag, mockedeKandidatlister } from "./mockKandidatliste";
import mockedeOrganisasjoner from "./mockOrganisasjoner";

export const handlers = [
    rest.get(`${apiConfig.url}/samtykke`, (_, res, ctx) => {
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
];
