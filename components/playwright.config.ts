import { PlaywrightTestConfig, devices } from '@playwright/test';
import { cpus } from 'os';

const config: PlaywrightTestConfig = {
  // Options shared for all projects.
  fullyParallel: true,
  workers: process.env.CI ? 1 : cpus().length / 2,
  timeout: 20000,
  reporter: process.env.CI ? 'github' : 'list',
  outputDir: './test-results',
  use: {
    ignoreHTTPSErrors: true,
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:6006',
  },

  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 10,
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
