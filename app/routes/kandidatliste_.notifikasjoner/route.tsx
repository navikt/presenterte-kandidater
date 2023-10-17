import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { logger } from "server/logger";
import { MaybeAuthorizationHeader, opprettAuthorizationHeader } from "~/services/api/proxy";
import { Miljø, hentMiljø } from "~/services/miljø";

const apiUrl =
    hentMiljø() !== Miljø.Lokalt ? process.env.NOTIFIKASJON_API_URL : "http://localhost:3000";

export const notifikasjonApiConfig = {
    scope: `${process.env.NAIS_CLUSTER_NAME}:fager:notifikasjon-bruker-api`,
    url: apiUrl,
};

export const proxyTilNotifikasjonApi = async (request: Request) => {
    const requestUrl = `${notifikasjonApiConfig.url}/api/graphql`;

    let maybeAuthorizationHeader: MaybeAuthorizationHeader;
    try {
        maybeAuthorizationHeader = await opprettAuthorizationHeader(
            request,
            notifikasjonApiConfig.scope
        );
    } catch (e) {
        logger.warn("Klarte ikke å opprette authorization header:", e);
        return new Response("", { status: 401 });
    }
    let headers;
    if (maybeAuthorizationHeader.isPresent) {
        headers = maybeAuthorizationHeader.authorizationHeader;
    } else {
        logger.info(maybeAuthorizationHeader.cause);
        return new Response("", { status: 401 });
    }

    const requestMedToken = new Request(request);
    requestMedToken.headers.set("Authorization", headers.authorization);

    return await fetch(requestUrl, {
        method: requestMedToken.method,
        headers: requestMedToken.headers,
        body: requestMedToken.body,

        duplex: "half",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
};

export const loader: LoaderFunction = async ({ request }) => proxyTilNotifikasjonApi(request);
export const action: ActionFunction = async ({ request }) => proxyTilNotifikasjonApi(request);
