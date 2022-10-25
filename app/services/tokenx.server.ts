import { client } from "server/tokenx";

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
