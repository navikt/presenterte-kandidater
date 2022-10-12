const { createRequestHandler } = require("@remix-run/express");
const path = require("path");

const buildDir = path.join(process.cwd(), "build");

const purgeRequireCache = () => {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default
    for (const key in require.cache) {
        if (key.startsWith(buildDir)) {
            delete require.cache[key];
        }
    }
};

const createRequestHandlerForDevelopment = (req, res, next) => {
    purgeRequireCache();

    return createRequestHandler({
        build: require(buildDir),
        mode: process.env.NODE_ENV,
    })(req, res, next);
};

const handleRequest =
    process.env.NODE_ENV === "development"
        ? createRequestHandlerForDevelopment
        : createRequestHandler({
              build: require(buildDir),
              mode: process.env.NODE_ENV,
          });

module.exports = handleRequest;
