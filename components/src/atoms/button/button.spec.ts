import { test, expect } from '../../../test/test-setup';

test('should match snapshot', async ({ dsPage }) => {
  const page = await dsPage.goto('atom', 'button', 'overview');
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot('button-overview.png');
});
