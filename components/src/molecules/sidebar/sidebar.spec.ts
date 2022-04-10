import { expect, test } from '../../../test/test-setup';

test('should expand on click', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
});

test('should close when clicking close button', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar', 'pre-opened');
  await page.locator('text=close').click();
  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
});

test.only('should close when clicking outside container', async ({ dsPage, viewport }) => {
  test.skip(viewport.width < 640, 'There is no area to click outside on mobile');
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.click('text=open');
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.click('body', { position: { x: 200, y: 200 }});

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
});

test('should not scroll body on long page', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.locator('text="open"').click();
  await page.mouse.wheel(0, 1000);
  await page.locator('text=close').click();
  const scrollTop = await page.locator('html').evaluate(body => body.scrollTop);

  expect(scrollTop).toBe(0);
});

test('should set focus to container when opening', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.locator('text=open').click();
  await page.waitForTimeout(1000);
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
});

test('should send back focus to opening element when closing', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.locator('text=close').click();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);

  expect(focusedText, 'open');
});

test('should focus sidebar on open', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar', 'header-and-footer');
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName);

  expect(focusedTag).toBe('SG-SIDEBAR');
});

test('should be able to close the sidebar with keyboard', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
});

test('should be able to close sidebar with keyboard when tabbing backwards', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
});

test('should wrap around focus when tabbing past elements', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar', 'header-and-footer');

  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  expect(focusedText).toBe('continue');
});

test('should close on escape', async ({ dsPage }) => {
  const page = await dsPage.goto('molecule', 'sidebar');

  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.up('Escape');

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
});
