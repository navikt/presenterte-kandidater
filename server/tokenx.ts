import { Issuer } from "openid-client";
import type { Client } from "openid-client";
import type { RequestHandler } from "@remix-run/express";
import type { Request } from "express";

let client: Client;

const config = {
    discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
    clientId: process.env.TOKEN_X_CLIENT_ID,
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
};

export const initializeTokenX = async () => {
    const issuer = await discoverTokenXIssuer();

    const jwk = JSON.parse(config.privateJwk);
    client = new issuer.Client(
        {
            client_id: config.clientId,
            token_endpoint_auth_method: "private_key_jwt",
        },
        {
            keys: [jwk],
        }
    );
};

const discoverTokenXIssuer = async () => {
    if (config.discoveryUrl) {
        return await Issuer.discover(config.discoveryUrl);
    } else {
        throw Error(`Miljøvariabelen "TOKEN_X_WELL_KNOWN_URL" må være definert`);
    }
};

export const requireAuthorizationHeader: RequestHandler = async (request, response, next) => {
    if (request.headers.authorization) {
        next();
    } else {
        response.sendStatus(401);
    }
};

export const setExchangeToken =
    (scope: string): RequestHandler =>
    async (request, response, next) => {
        const accessToken = retrieveToken(request);

        if (accessToken) {
            const exchangeToken = await hentExchangeToken(accessToken, scope);

            request.headers.authorization = `Bearer ${exchangeToken.access_token}`;
            return next();
        } else {
            response
                .status(500)
                .send("Kan ikke be om exchange-token siden access-token ikke finnes");
        }
    };

const hentExchangeToken = async (accessToken: string, scope: string) => {
    const now = Math.floor(Date.now() / 1000);
    const additionalClaims = {
        clientAssertionPayload: {
            nbf: now,
        },
    };

    // TODO: Cache exchange token med gitt scope
    const exchangeToken = await client.grant(
        {
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
            audience: scope,
            subject_token: accessToken,
        },
        additionalClaims
    );

    return exchangeToken;
};

const retrieveToken = (request: Request) => {
    return request.headers.authorization?.replace("Bearer", "");
};
