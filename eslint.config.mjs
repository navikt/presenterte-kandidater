import { anbefalt as toiA11y } from '@navikt/toi-next-frontend/eslint';
import nextConfig from 'eslint-config-next';
import reactCompiler from 'eslint-plugin-react-compiler';

const config = [
  ...nextConfig,
  toiA11y,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
  },
];
export default config;
