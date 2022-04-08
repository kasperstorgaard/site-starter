import { expect, test } from '../../../test/test-setup';

test('should show results when typing', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'autocomplete');

  await page.locator('text=city').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
});

test('should close results when tabbing out', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'autocomplete');

  await page.locator('text=city').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('Tab');
  await page.locator('text=copenhagen').waitFor({ state: 'hidden' });
});

test('should select item when using arrow down', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'autocomplete');

  await page.locator('text=city').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.locator('[aria-selected=true] >> text=copenhagen').waitFor();
});

test('should close results when arrow up after down', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'autocomplete');

  await page.locator('text=city').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await page.locator('text=copenhagen').waitFor({ state: 'hidden' });
});

test('should reopen results when focusing and using arrow down', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'autocomplete');

  await page.locator('text=city').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('Tab');
  await page.locator('text=copenhagen').waitFor({ state: 'hidden' });
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('ArrowDown');
  await page.locator('text=copenhagen').waitFor();
});

test('should select item on enter', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'autocomplete');

  await page.locator('text=city').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  const value = await page.locator('input').evaluate((el: HTMLInputElement) => el.value);
  expect(value).toBe('Copenhagen');
});
