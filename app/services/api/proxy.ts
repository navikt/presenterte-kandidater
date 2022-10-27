import TokenClient from "./TokenClient.server";

export const client = new TokenClient();

const naisCluster = process.env.NAIS_CLUSTER_NAME;

export const apiConfig = {
    scope: `${naisCluster}:toi:presenterte-kandidater-api`,
    url: `https://presenterte-kandidater-api.dev.intern.nav.no`,
};

export const proxyTilApi = async (request: Request, url: string, method = "GET", body?: object) => {
    const options: RequestInit = {
        method,
        headers: await opprettAuthorizationHeader(request),
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return await fetch(`${apiConfig.url}${url}`, options);
};

const opprettAuthorizationHeader = async (request: Request) => {
    if (process.env.NODE_ENV === "development") {
        return {
            authorization: "",
        };
    }

    const accessToken = retrieveToken(request);

    if (!accessToken) {
        throw Error("Fant ikke access token");
    }

    const exchangeToken = await client.veksleToken(accessToken, apiConfig.scope);

    return {
        authorization: `Bearer ${exchangeToken.access_token}`,
    };
};

export const retrieveToken = (request: Request) => {
    return request.headers.get("authorization")?.replace("Bearer", "");
};
