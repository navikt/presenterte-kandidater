/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@navikt/ds-react', '@navikt/ds-css', '@navikt/navspa'],
  basePath:
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE === 'true'
      ? ''
      : '/kandidatliste',
  assetPrefix: '/kandidatliste',
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  serverExternalPackages: ['@navikt/next-logger', 'msw', '@mswjs/interceptors'],
};

export default nextConfig;
