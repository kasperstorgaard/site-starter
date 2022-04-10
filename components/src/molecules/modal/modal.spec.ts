import { test, expect } from '../../../test/test-setup';

test('should expand on click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal');
  await page.locator('text=open').click();
  await page.locator('text=A modal is a window').waitFor();
});

test('should close when clicking close button', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal', 'pre-opened')
  await page.locator('button >> text=close').click();
  await page.locator('text=About Cookies').waitFor({ state: 'hidden'});
});

test('should close when clicking outside container on desktop', async ({ dsPage, viewport }) => {
  const page = await dsPage.goto('molecule', 'modal', 'pre-opened');

  await page.locator('text=About Cookies').waitFor();
  await page.locator('html').click({ position: { x: 200, y: 50 }});

  await page.locator('text=About Cookies').waitFor({ state: 'hidden'});
});

test('should not scroll body on long page', async ({ dsPage, browserName, viewport }) => {
  // TODO: find way to emulate touch scroll
  test.skip(browserName === 'webkit' && viewport.width < 640, 'webkit mobile does not support scroll wheel');

  const page = await dsPage.goto('molecule', 'modal', 'scroll-lock');

  await page.locator('text=open the modal').click();
  await page.mouse.wheel(0, 1000);

  await page.locator('button >> text=close').click();
  const scrollTop = await page.locator('html').evaluate(body => body.scrollTop);
  expect(scrollTop).toBe(0);
});

test('should send back focus to opening element when closing', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal');
  await page.locator('text=open the modal').click();
  await page.locator('text=A modal is a window').waitFor();
  await page.locator('button >> text=close').click();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);

  expect(focusedText).toBe('open the modal');
});

test('should focus self on open', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal', 'directions');
  await page.locator('text=open the modal').click();
  await page.locator('text=Up, Up, Down, Down,').waitFor();
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName);

  expect(focusedTag).toBe('SG-MODAL')
});

test('should be able to close the with keyboard', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal', 'pre-opened');

  await page.locator('text=About Cookies').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');

  await page.locator('text=About Cookies').waitFor({ state: 'hidden'});
});

test('should be able to close with keyboard when tabbing backwards', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal', 'pre-opened');

  await page.locator('text=About Cookies').waitFor();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');

  await page.locator('text=About Cookies').waitFor({ state: 'hidden'});
});

test('should wrap around focus when tabbing past elements', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal', 'pre-opened');

  await page.locator('text=About Cookies on This Site').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focusedText = await page.evaluate(() => document.activeElement?.textContent);

  expect(focusedText).toBe('I accept...');
});

test('should close on escape', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'modal');

  await page.locator('text=open the modal').click();
  await page.locator('text=A modal is a window').waitFor();
  await page.keyboard.press('Escape');

  await page.locator('text=A modal is a window').waitFor({ state: 'hidden'});
});
