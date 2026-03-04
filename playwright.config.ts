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
  /* Bruk 50% av tilgjengelige CPUer i CI for parallellkjøring */
  workers: process.env.CI ? '50%' : undefined,
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
  ],

  /* I CI startes serveren av next-testserver-actionen, lokalt starter Playwright den selv */
  webServer: process.env.CI
    ? undefined
    : {
        command: `bash -c "PID=\$(lsof -ti tcp:${PLAYWRIGHT_PORT} || true); if [ -n \"$PID\" ]; then kill -9 $PID; fi; NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE=true next dev -p ${PLAYWRIGHT_PORT}"`,
        url: `http://localhost:${PLAYWRIGHT_PORT}`,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
