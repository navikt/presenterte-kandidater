import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/kandidatliste',
  assetPrefix: '/kandidatliste',
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  serverExternalPackages: ['@navikt/next-logger'],
};

export default nextConfig;
