/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*", "**/*.module.css"],
    publicPath: "/kandidatliste/build/",
    serverModuleFormat: "cjs",
    future: {
        unstable_dev: true,
        v2_errorBoundary: true,
        v2_routeConvention: true,
        v2_normalizeFormMethod: true,
        v2_meta: true,
    },
};
