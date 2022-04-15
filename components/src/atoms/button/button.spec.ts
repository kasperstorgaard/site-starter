import { test, expect } from '../../../test/test-setup';

test.beforeEach(({}, testInfo) => {
  // This means we don't use different snapshots based on operating system.
  // otherwise we would have to run on too many combinations.
  // (downside is that we can theoretically get visual differences bc. of OS)
  testInfo.snapshotSuffix = '';
});

test('should match snapshot', async ({ dsPage }) => {
  await dsPage.goto('atom', 'button', 'overview');
  const screenshot = await dsPage.capture();
  expect(screenshot).toMatchSnapshot('button-overview.png');
});
