import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { logger } from "server/logger";
import { opprettAuthorizationHeader } from "~/services/api/proxy";

export const notifikasjonApiConfig = {
    scope: `${process.env.NAIS_CLUSTER_NAME}:fager:notifikasjon-bruker-api`,
    url: process.env.NOTIFIKASJON_API_URL,
};

export const proxyTilNotifikasjonApi = async (request: Request, method = "GET", body?: object) => {
    let headers;
    try {
        headers = await opprettAuthorizationHeader(request, notifikasjonApiConfig.scope);
    } catch (e) {
        logger.warning("Klarte ikke å opprette authorization header:", e);
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return await fetch(`${notifikasjonApiConfig.url}/api/graphql`, options);
};

export const loader: LoaderFunction = async ({ request }) => proxyTilNotifikasjonApi(request);
export const action: ActionFunction = async ({ request }) => proxyTilNotifikasjonApi(request);
