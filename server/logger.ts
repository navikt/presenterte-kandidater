import winston from "winston";

export const logger = winston.createLogger({
    format: process.env.NODE_ENV === "production" ? winston.format.json() : winston.format.simple(),
    transports: new winston.transports.Console(),
});
