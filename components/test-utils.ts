// eslint-disable-next-line ava/use-test
import { ExecutionContext } from 'ava';
import { Browser, chromium, firefox, LaunchOptions, webkit, BrowserContext, Page, FrameLocator } from 'playwright';
import { devices, BrowserContextOptions } from 'playwright';

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

/**
 * Macro that creates a browser context, sets default options and navigates to the provided storybook story.
 * Useful for straightforward tests where you don't need to set anything up before landing on the page to test.
 * @param name The name of the story to navigate to.
 * @param variant The variant of the story to navigate to.
 */
export const useStory = (name: string, variant?: string) => {
  return async (
    t: ExecutionContext<any>,
    callback: (t: ExecutionContext<any>, page: Page
  ) => any) => {
    const location = new URL(env.baseUrl);
    location.pathname = '/iframe.html';
    location.searchParams.set('id', variant ? `${name}--${variant}` : name);
    location.searchParams.set('viewMode', 'story');

    const { page, context } = await setupPage(location.href);

    try {
      await callback(t, page);
    } finally {
      await context.close();
    }
  };
};

/**
 * Macro that creates a browser context and sets default options.
 * Useful for when you still want the default options, but need some more control before
 * navigating to the page to test.
 */
export const useBrowserContext = () => {
  return async (
    t: ExecutionContext<any>,
    callback: (t: ExecutionContext<any>, context: BrowserContext) => any,
  ) => {
    const context = await setupContext();

    try {
      await callback(t, context);
    } finally {
      await context.close();
    }
  };
};

/*
 * Creates a browser context, sets default options and navigates to the provided page.
 * Useful for straightforward tests where you don't need to set anything up before landing on the page to test.
 */
export async function setupPage(url: string) {
  const context = await setupContext();

  const page = await context.newPage();
  await page.goto(url);

  return { page, context };
}

/**
 * Creates a browser context and sets default options.
 * Useful for when you still want the default options, but need some more control before
 * navigating to the page to test.
 */
export async function setupContext() {
  const browser = await getBrowser();
  const context = await browser.newContext({
    ...env.device.options,
    ignoreHTTPSErrors: true, // we don't really care about localhost certificates here...
  });

  context.setDefaultTimeout(10000);
  context.setDefaultNavigationTimeout(10000);
  return context;
}

const browser: Promise<Browser> = launch(env.device.browser, {
  headless: env.headless,
  slowMo: env.headless ? 0 : 500,
});

export function getBrowser() {
  return browser;
}

function launch(key: string, options: LaunchOptions) {
  switch (key) {
    case 'chromium':
    case 'edge':
    case 'chrome':
      return chromium.launch(options);
    case 'webkit':
    case 'safari':
      return webkit.launch(options);
    case 'firefox':
      return firefox.launch(options);
    default:
      throw new Error(`found no matching browser for ${key}`);
  }
}

