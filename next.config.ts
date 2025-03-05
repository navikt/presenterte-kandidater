/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@navikt/ds-react', '@navikt/ds-css', '@navikt/navspa'],
  basePath: process.env.NODE_ENV === 'development' ? '' : '/kandidatliste',
  assetPrefix: '/kandidatliste',
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  serverExternalPackages: ['@navikt/next-logger'],
};

export default nextConfig;
