import { test } from '../../../test/test-setup';

test('should close on click', async ({ dsPage }) => {
  const page = await dsPage.goto('atom', 'overlay');

  await page.locator('text=Open overlay').click();
  await page.locator('sg-overlay').waitFor();
  await page.locator('html').click({ position: { x: 200, y: 200 }});
  await page.locator('sg-overlay').waitFor({ state: 'hidden' });
});
