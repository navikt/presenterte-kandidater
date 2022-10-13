import express from "express";
import compression from "compression";
import morgan from "morgan";
import handleRequest from "./handleRequest";
import type { Response } from "express";

const port = process.env.PORT || 3000;
const basePath = "/kandidatliste";

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

    // Request logger
    app.use(morgan("tiny"));
};

const startServer = () => {
    configureServerSettings();

    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (_, res: Response) =>
        res.sendStatus(200)
    );

    app.all("*", handleRequest);

    app.listen(port, () => {
        console.log(`Server kjører på port ${port}`);
    });
};

startServer();
