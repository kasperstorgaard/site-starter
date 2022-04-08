import { devices, BrowserContextOptions } from 'playwright';
import { test as base } from '@playwright/test';
import { DesignSystemPage } from './design-system-page';

export type BrowserKey = 'chromium'|'webkit'|'firefox'|'chrome'|'edge'|'safari';
export type DeviceKey = 'iphone'|'desktop'|'android';

export interface DeviceConfig {
  browser: BrowserKey,
  options: BrowserContextOptions,
}

export const DEVICES = {
  iphone: {
    name: 'iphone',
    browser: 'webkit',
    options: { ...devices['iPhone 8'] },
  },
  android: {
    name: 'android',
    browser: 'chrome',
    options: { ...devices['Pixel 2'] },
  },
  desktop: {
    name: 'desktop',
    browser: 'chrome',
    options: {
      viewport: {
        width: 1440,
        height: 900,
      },
    },
  },
};

export const DEFAULT_DEVICE = DEVICES.android;

const deviceOverride = process.env.DEVICE?.toLowerCase() as DeviceKey;
const device = DEVICES[deviceOverride] ?? DEFAULT_DEVICE;

const headless = process.env.HEADLESS !== 'false';
const baseUrl = process.env.BASE_URL ?? 'http://localhost:6006';

export const env = {
  device,
  headless,
  baseUrl,
  isDesktop: device.name === 'desktop',
  isMobile: device.name !== 'desktop',
};

// Declare the types of your fixtures.
type MyFixtures = {
  dsPage: DesignSystemPage;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  dsPage: async ({ page }, use) => {
    await use(new DesignSystemPage(page, env.baseUrl));
  },
});

export { expect } from '@playwright/test';
