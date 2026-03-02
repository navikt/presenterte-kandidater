import { gotoApp } from './gotoApp';
import { snapshotTest } from './snapshotTest';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';
const STILLING_ID = '720696c9-0077-464f-b0dc-c12b95db32d4';

test.describe('Kandidatliste for stilling', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page, `/${STILLING_ID}?virksomhet=${VIRKSOMHET}`);
    await expect(page.getByText('Misjonærer for Gather Town')).toBeVisible();
  });

  test('viser kandidatliste med kandidater', async ({ page }) => {
    await expect(page.getByText('Misjonærer for Gather Town')).toBeVisible();
  });

  snapshotTest(test);
});
