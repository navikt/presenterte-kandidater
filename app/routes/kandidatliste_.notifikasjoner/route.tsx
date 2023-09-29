import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { logger } from "server/logger";
import { opprettAuthorizationHeader } from "~/services/api/proxy";
import { Miljø, hentMiljø } from "~/services/miljø";

const apiUrl =
    hentMiljø() !== Miljø.Lokalt ? process.env.NOTIFIKASJON_API_URL! : "http://localhost:3000";

export const notifikasjonApiConfig = {
    scope: `${process.env.NAIS_CLUSTER_NAME}:fager:notifikasjon-bruker-api`,
    url: apiUrl,
};

export const proxyTilNotifikasjonApi = async (request: Request) => {
    const requestUrl = `${notifikasjonApiConfig.url}/api/graphql`;
    logger.info(`Proxy ${request.method}-request til notifikasjon-api: ${requestUrl}`);

    let headers;
    try {
        headers = await opprettAuthorizationHeader(request, notifikasjonApiConfig.scope);
    } catch (e) {
        logger.warn("Klarte ikke å opprette authorization header:", e);
    }

    const requestMedToken = new Request(requestUrl, {
        method: request.method,
        body: request.body,
        headers: {
            ...request.headers,
            ...headers,
        },
    });

    return await fetch(requestMedToken);
};

export const loader: LoaderFunction = async ({ request }) => proxyTilNotifikasjonApi(request);
export const action: ActionFunction = async ({ request }) => proxyTilNotifikasjonApi(request);
