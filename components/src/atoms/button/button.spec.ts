import { test, expect } from '../../../test/test-setup';

test.beforeEach(({}, testInfo) => {
  // This means we don't use different snapshots based on operating system.
  // otherwise we would have to run on too many combinations.
  // (downside is that we can theoretically get visual differences bc. of OS)
  testInfo.snapshotSuffix = '';
});

test('should match snapshot', async ({ dsPage }) => {
  const page = await dsPage.goto('atom', 'button', 'overview');
  const screenshot = await page.locator('#root').screenshot();
  expect(screenshot).toMatchSnapshot('button-overview.png');
});
