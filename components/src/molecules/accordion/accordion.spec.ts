import { test } from '../../../test/test-setup';

test('should expand on click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'accordion');

  await page.locator('text=How many species').click();
  await page.locator('text=There are two universally').waitFor();
});

test('should close on click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'accordion');

  await page.locator('text=How many species').click();
  await page.locator('text=There are two universally').waitFor();
  await page.locator('text=How many species').click();
  await page.locator('text=There are two universally').waitFor({ state: 'hidden' });
});

test('should close other item in single mode', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'accordion', 'single');

  await page.locator('text=Which is the tallest animal in the world?').click();
  await page.locator('text=Answer: Giraffe').waitFor();
  await page.locator('text=Which animal has the longest lifeline?').click();
  await page.locator('text=Answer: The arctic whale').waitFor();
  await page.locator('text=Answer: Giraffe').waitFor({ state: 'hidden' });
});

test('should be able to use with keyboard', async ({ dsPage, tabKey }) => {
  const page = await dsPage.goto('molecule', 'accordion');

  await page.keyboard.press(tabKey);
  await page.keyboard.press('Space');
  await page.locator('text=There are two universally').waitFor();
});
