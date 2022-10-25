import express from "express";
import compression from "compression";
import handleRequest from "./handleRequest";
import type { Response } from "express";
import { krevAuthorizationHeader, setExchangeToken } from "./tokenx";
import { setupProxy } from "./proxy";
import { logger, logRequests } from "./logger";

const port = process.env.PORT || 3000;
const basePath = "/kandidatliste";

const cluster = process.env.NAIS_CLUSTER_NAME;
const apiScope = `api://${cluster}.toi.presenterte-kandidater-api/.default`;
const apiUrl = process.env.API_URL;

const app = express();

const configureServerSettings = () => {
    // Gzip responser
    app.use(compression());

    // Sikkerhetsgreier
    app.disable("x-powered-by");

    // Remix bygger appen med fingerprinting, så vi kan cache disse filene evig
    app.use(`${basePath}/build`, express.static("public/build", { immutable: true, maxAge: "1y" }));

    // Cache public-filer (som favicon) i én time
    app.use(express.static("public", { maxAge: "1h" }));
};

const startServer = () => {
    configureServerSettings();

    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (_, res: Response) =>
        res.sendStatus(200)
    );

    app.use(logRequests);
    app.all("*", handleRequest);

    app.use(
        `${basePath}/api/*`,
        krevAuthorizationHeader,
        setExchangeToken(apiScope),
        setupProxy(`${basePath}/api`, apiUrl)
    );

    app.listen(port, () => {
        logger.info(`Server kjører på port ${port}`);
    });
};

startServer();
