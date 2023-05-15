/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*", "**/*.module.css"],
    publicPath: "/kandidatliste/build/",
    future: {
        unstable_dev: true,
        v2_errorBoundary: true,
        v2_routeConvention: true,
    },
};
