import { defineConfig, devices } from '@playwright/test';

// Tillat overstyring av port i CI hvis flere prosesser kjører parallelt
const PLAYWRIGHT_PORT = process.env.PLAYWRIGHT_PORT || '1337';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? '100%' : undefined,
  /* Stopp hele kjøringen i CI hvis den henger, i stedet for å vente på jobbens tidsgrense */
  globalTimeout: process.env.CI ? 15 * 60 * 1000 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'html',
      {
        attachments: true,
        outputFolder: 'playwright-report',
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1080 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 1080 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 1080 },
      },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],

  /* I CI startes serveren av next-testserver-actionen, lokalt starter Playwright den selv */
  webServer: process.env.CI
    ? undefined
    : {
        command: `pnpm exec next dev -p ${PLAYWRIGHT_PORT}`,
        env: { NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE: 'true' },
        url: `http://localhost:${PLAYWRIGHT_PORT}`,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
