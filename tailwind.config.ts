import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx,css}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // https://cdn.jsdelivr.net/npm/@navikt/ds-tailwind/tailwind.config.js

  plugins: [],
};

export default config;
