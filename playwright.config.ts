import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixels: 100, // Tillåt en liten skillnad i pixlar
      threshold: 0.2,     // Tröskelvärde för känslighet
    },
  },

  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop
    {
      name: 'chromium-desktop-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
    {
      name: 'chromium-desktop-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    // Tablet
    {
      name: 'chromium-tablet-dark',
      use: { ...devices['iPad (gen 7)'], colorScheme: 'dark' },
    },
    {
      name: 'chromium-tablet-light',
      use: { ...devices['iPad (gen 7)'], colorScheme: 'light' },
    },
    // Mobile
    {
      name: 'chromium-mobile-dark',
      use: { ...devices['Pixel 5'], colorScheme: 'dark' },
    },
    {
      name: 'chromium-mobile-light',
      use: { ...devices['Pixel 5'], colorScheme: 'light' },
    },
  ],

  webServer: {
    command: 'bundle exec jekyll serve --port 4000',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
