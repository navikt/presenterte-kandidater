import { test as baseTest, expect } from '@playwright/test';

export const snapshotTest = (test = baseTest) =>
  test('Visuell snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot();
  });
