import { client } from "server/tokenx";

export const hentExchangeToken = async (accessToken: string, scope: string) => {
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

export const retrieveToken = (request: Request) => {
    return request.headers.get("authorization")?.replace("Bearer", "");
};
