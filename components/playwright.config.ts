import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Options shared for all projects.
  fullyParallel: true,
  workers: 4,
  timeout: 30000,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    ignoreHTTPSErrors: true,
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:6006',
  },
  outputDir: './test-results',

  // Options specific to each project.
  projects: [
    {
      name: 'mobile chromium',
      use: devices['Pixel 5'],
    },
    {
      name: 'mobile webkit',
      use: devices['iPhone 12'],
    },
    {
      name: 'desktop chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'desktop webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
      }
    },
    {
      name: 'desktop firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
      }
    },
  ],
};
export default config;
