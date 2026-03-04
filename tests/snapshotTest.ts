import { test as baseTest, expect } from '@playwright/test';

const isCI = !!process.env.CI;

export const snapshotTest = (test = baseTest) =>
  test('Visuell snapshot', async ({ page }) => {
    test.skip(!isCI, 'Snapshots kjøres kun i CI');
    await expect(page).toHaveScreenshot();
  });
