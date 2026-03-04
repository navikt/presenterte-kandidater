import { gotoApp } from './gotoApp';
import { snapshotTest } from './snapshotTest';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';

test.describe('Kandidatlister', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page, `/?virksomhet=${VIRKSOMHET}`);
    await expect(page.getByText('Aktive rekrutteringsprosesser')).toBeVisible();
  });

  test('viser kandidatlister', async ({ page }) => {
    await expect(page.getByText('Vilkår for tjenesten')).toBeVisible();
  });

  snapshotTest(test);
});
