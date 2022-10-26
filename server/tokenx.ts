import { Issuer } from "openid-client";
import type { Client } from "openid-client";
import { logger } from "./logger";

const config = {
    discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
    clientId: process.env.TOKEN_X_CLIENT_ID,
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
};

class TokenClient {
    private client?: Client;

    hent = async (): Promise<Client> => {
        if (this.client === undefined) {
            const issuerClient = await this.configure();

            this.client = issuerClient;
            return issuerClient;
        }

        return this.client;
    };

    configure = async (): Promise<Client> => {
        logger.info(
            `Konfigurerer TokenX med clientId ${config.clientId} og discoveryUrl ${config.discoveryUrl} ...`
        );

        const issuer = await this.discoverTokenXIssuer();

        const jwk = JSON.parse(config.privateJwk);
        const issuerClient = new issuer.Client(
            {
                client_id: config.clientId,
                token_endpoint_auth_method: "private_key_jwt",
            },
            {
                keys: [jwk],
            }
        );

        logger.info("TokenX er konfigurert!");

        return issuerClient;
    };

    discoverTokenXIssuer = async () => {
        if (config.discoveryUrl) {
            return await Issuer.discover(config.discoveryUrl);
        } else {
            throw Error(`Miljøvariabelen "TOKEN_X_WELL_KNOWN_URL" må være definert`);
        }
    };
}

let client = new TokenClient();

export default client;
