import nextConfig from 'eslint-config-next';
import reactCompiler from 'eslint-plugin-react-compiler';

const config = [
  ...nextConfig,
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
