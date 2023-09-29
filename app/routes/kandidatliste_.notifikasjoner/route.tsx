import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { logger } from "server/logger";
import { opprettAuthorizationHeader } from "~/services/api/proxy";
import { Miljø, hentMiljø } from "~/services/miljø";

const apiUrl =
    hentMiljø() !== Miljø.Lokalt ? process.env.NOTIFIKASJON_API_URL : "http://localhost:3000";

export const notifikasjonApiConfig = {
    scope: `${process.env.NAIS_CLUSTER_NAME}:fager:notifikasjon-bruker-api`,
    url: apiUrl,
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
