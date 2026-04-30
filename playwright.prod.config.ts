import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...baseConfig,
  expect: {
    timeout: 10000, // Ge lite extra tid för produktionsmiljön
    toHaveScreenshot: {
      maxDiffPixels: 200, // Tillåt lite större skillnad i produktion
      threshold: 0.2,
    },
  },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://blog.pownas.se',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: undefined,
});
