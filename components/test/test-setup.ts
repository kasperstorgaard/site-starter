import { test as base } from '@playwright/test';
import { DesignSystemPage } from './design-system-page';

// Declare the types of your fixtures.
type MyFixtures = {
  dsPage: DesignSystemPage;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  dsPage: async ({ page }, use) => {
    await use(new DesignSystemPage(page));
  },
});

export { expect } from '@playwright/test';
