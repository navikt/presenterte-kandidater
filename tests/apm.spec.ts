import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('prefiks i toi-next-frontend/apm samsvarer med installert @nais/apm', () => {
  const kilde = readFileSync(
    require
      .resolve('@nais/apm/package.json')
      .replace('package.json', 'dist/console.js'),
    'utf8',
  );
  expect(kilde).toContain("CONSOLE_ERROR_PREFIX = 'console.error: '");
});
