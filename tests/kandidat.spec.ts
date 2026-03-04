import { gotoApp } from './gotoApp';
import { snapshotTest } from './snapshotTest';
import { expect, test } from '@playwright/test';

const VIRKSOMHET = '811076902';
const STILLING_ID = '720696c9-0077-464f-b0dc-c12b95db32d4';
const KANDIDAT_ID = '23d45ba2-ce9e-446e-9137-5ebb44bf6490';

test.describe('Kandidatvisning', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(
      page,
      `/${STILLING_ID}/kandidat/${KANDIDAT_ID}?virksomhet=${VIRKSOMHET}`,
    );
    await expect(
      page.getByRole('heading', { name: 'CV-en til Joare Mossby' }),
    ).toBeVisible();
  });

  test('viser kandidat-CV', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'CV-en til Joare Mossby' }),
    ).toBeVisible();
  });

  snapshotTest(test);
});
