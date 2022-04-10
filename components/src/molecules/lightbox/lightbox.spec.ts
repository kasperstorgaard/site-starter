import { test, expect } from '../../../test/test-setup';

test('should expand on click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
});

test('should close on click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');
  page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=close').click();
  await page.locator('img').first().waitFor({ state: 'hidden' });
});

test('should navigate forward on arrow click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=forward').click();

  await page.waitForTimeout(1000);

  const lightbox$ = page.locator('sg-lightbox');
  const index = await lightbox$.evaluate(el => (el as any).index);

  expect(index).toBe(1);
});

test('should navigate back on arrow click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');

  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=forward').click();
  await page.locator('text=back').click();
  await page.waitForTimeout(1000);

  const lightbox$ = page.locator('sg-lightbox');
  const index = await lightbox$.evaluate(el => (el as any).index);

  expect(index).toBe(0);
});

test('should wrap focus', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');

  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const lightbox$ = page.locator('sg-lightbox');
  const focusText = await lightbox$.evaluate(el => el.shadowRoot.activeElement.textContent);

  // using regex matcher because of whitespace
  expect(focusText).toMatch(/forward/);
});

test('should send back focus to opening element when closing', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');

  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=close').click();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);

  expect(focusedText).toBe('open');
});

test('should not scroll body on long page', async ({ dsPage, browserName, viewport }) => {
  // TODO: find way to emulate touch scroll
  test.skip(browserName === 'webkit' && viewport.width < 640, 'webkit mobile does not support scroll wheel');

  const page = await dsPage.goto('molecule', 'lightbox', 'scroll-lock');

  await page.locator('button >> text=open').click();
  await page.mouse.wheel(0, 1000);

  await page.locator('text=close').click();
  const scrollTop = await page.locator('html').evaluate(body => body.scrollTop);

  expect(scrollTop).toBe(0);
});

test('should focus self when opened', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox', 'links');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('img').first().waitFor();
  await page.waitForTimeout(1000);

  const focusedTag = await page.evaluate(() => document.activeElement.tagName);

  expect(focusedTag).toBe('SG-LIGHTBOX');
});

test('should close on escape', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'lightbox');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('img').first().waitFor();
  await page.keyboard.press('Escape');
  await page.locator('text=link').first().waitFor({ state: 'hidden' });
});
