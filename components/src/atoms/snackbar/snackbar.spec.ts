import { expect, test } from '../../../test/test-setup';

test('should show when activated', async ({ dsPage }) => {
  const page = await dsPage.goto('atom', 'snackbar');
  await page.locator('text=show notification').click();
  await page.locator('text=document saved').waitFor();
});

test('should hide itself after activation', async ({ dsPage }) => {
  const page = await dsPage.goto('atom', 'snackbar');
  await page.locator('text=show notification').click();
  await page.locator('text=document saved').waitFor();
  await page.locator('text=document saved').waitFor({ state: 'hidden', timeout: 6000 });
});

test('should close using close button', async ({ dsPage }) => {
  const page = await dsPage.goto('atom', 'snackbar');
  await page.locator('text=show notification').click();
  await page.locator('text=document saved').waitFor();
  await page.locator('text=close').click();
  await page.locator('text=document saved').waitFor({ state: 'hidden' });
});

test('should be closeable using keyboard navigation', async ({ dsPage, tabKey }) => {
  const page = await dsPage.goto('atom', 'snackbar');
  await page.keyboard.press(tabKey);
  await page.keyboard.press('Space');
  await page.locator('text=document saved').waitFor();
  await page.keyboard.press(tabKey);
  await page.keyboard.press('Space');
  await page.locator('text=document saved').waitFor({ state: 'hidden', timeout: 1000 });
});

test('should restore focus when closing using keyboard', async ({ dsPage, tabKey }) => {
  const page = await dsPage.goto('atom', 'snackbar');
  await page.keyboard.press(tabKey);
  await page.keyboard.press('Space');
  await page.locator('text=document saved').waitFor();
  await page.keyboard.press(tabKey);
  await page.keyboard.press('Space');
  await page.locator('text=document saved').waitFor({ state: 'hidden', timeout: 1000 });
  const focusText = await page.evaluate(() => document.activeElement.textContent);

  expect(focusText).toBe('Show notification');
});

test('should set aria-live when opening', async ({ dsPage, tabKey }) => {
  const page = await dsPage.goto('atom', 'snackbar');
  await page.keyboard.press(tabKey);
  await page.keyboard.press('Space');
  await page.locator('[aria-live="polite"]').waitFor();
});
