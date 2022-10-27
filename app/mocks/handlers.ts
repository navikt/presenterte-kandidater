import { rest } from "msw";
import { apiConfig } from "~/services/api/proxy";

export const handlers = [
    rest.get(`${apiConfig.url}/kandidater`, (req, res, ctx) => {
        return res(ctx.json("heisann"));
    }),
];
