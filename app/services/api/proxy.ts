import { logger } from "../../../server/logger";
import { hentMiljø, Miljø } from "../miljø";
import TokenClient from "./TokenClient.server";

export const client = new TokenClient();

const naisCluster = process.env.NAIS_CLUSTER_NAME;
const apiUrl = hentMiljø() !== Miljø.Lokalt ? process.env.API_URL : "http://localhost:3000";

export const apiConfig = {
    scope: `${naisCluster}:toi:presenterte-kandidater-api`,
    url: apiUrl,
};

export const proxyTilApi = async (request: Request, url: string, method = "GET", body?: object) => {
    let maybeAuthorizationHeader: MaybeAuthorizationHeader;
    try {
        maybeAuthorizationHeader = await opprettAuthorizationHeader(request, apiConfig.scope);
    } catch (e) {
        logger.warn("Klarte ikke å opprette authorization header:", e);
    }
    // TODO Are: Vi fortsetter bare etter exception? Burde vi returnere med status 401?

    let headers;
    if (maybeAuthorizationHeader.isPresent) {
        headers = maybeAuthorizationHeader.authorizationHeader;
    } else {
        logger.info(maybeAuthorizationHeader.cause);
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return await fetch(`${apiConfig.url}${url}`, options);
};

export type MaybeAuthorizationHeader =
    | { isPresent: true; authorizationHeader: { authorization: string } }
    | { cause: string };
export const opprettAuthorizationHeader = async (
    request: Request,
    scope: string
): Promise<MaybeAuthorizationHeader> => {
    if (process.env.NODE_ENV === "development") {
        return {
            isPresent: true,
            authorizationHeader: {
                authorization: `whatever`,
            },
        };
    }

    const accessToken = accessToken(request);
    if (!accessToken) {
        return {
            cause: "Request mangler access token, brukeren er sannsynligvis ikke logget inn",
        };
    }

    const exchangeToken = await client.veksleToken(accessToken, scope);
    return {
        isPresent: true,
        authorizationHeader: {
            authorization: `Bearer ${exchangeToken.access_token}`,
        },
    };
};

const accessToken = (request: Request) => {
    return request.headers.get("authorization")?.replace("Bearer", "");
};
