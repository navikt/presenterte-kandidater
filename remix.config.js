/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*", "**/*.css"],
    publicPath: "/kandidatliste/build/",
    future: {
        // Bruk CSS-modules
        unstable_cssModules: true,
    },
};
