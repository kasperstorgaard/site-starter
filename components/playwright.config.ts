import { PlaywrightTestConfig, devices } from '@playwright/test';
import { cpus } from 'os';

// Options shared for all projects.
const config: PlaywrightTestConfig = {
  // Makes sure that the CI fails if any tests are marked as .only (debug)
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  workers: process.env.CI ? 1 : cpus().length / 2,
  timeout: 20000,
  // Github connects failures inline with tests files,
  // making it easier to pinpoint issues.
  reporter: process.env.CI ? 'github' : 'list',
  outputDir: './test-results',
  use: {
    ignoreHTTPSErrors: true,
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:6006',
  },

  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 10,
      threshold: 0.5,
    }
  },

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
