import test from 'ava';
import { useStory } from '../../shared/test-utils';

test('should expand on click', useStory('lightbox'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  t.pass();
});

test('should close on click', useStory('lightbox'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=close').click();
  await page.locator('img').first().waitFor({ state: 'hidden' });
  t.pass();
});

test('should navigate forward on arrow click', useStory('lightbox'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=forward').click();
  await page.waitForTimeout(2000);

  const bounds = await page.locator('img').nth(1).boundingBox();
  t.is(bounds.x, 0);
});

test('should navigate back on arrow click', useStory('lightbox'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=forward').click();
  await page.locator('text=back').click();
  await page.waitForTimeout(1000);

  const bounds = await page.locator('img').first().boundingBox();
  t.is(bounds.x, 0);
});

test('should wrap focus', useStory('lightbox'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const lightbox$ = page.locator('sg-lightbox');
  const focusText = await lightbox$.evaluate(el => el.shadowRoot.activeElement.textContent);

  // using regex matcher because of whitespace
  t.regex(focusText, /forward/);
});

test('should send back focus to opening element when closing', useStory('lightbox'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('img').first().waitFor();
  await page.locator('text=close').click();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'open');
});

test('should not scroll body on long page', useStory('lightbox', 'scroll-lock'), async (t, page) => {
  await page.locator('button >> text=open').click();
  await page.mouse.wheel(0, 1000);
  await page.locator('text=close').click();
  const scrollTop = await page.locator('html').evaluate(body => body.scrollTop);
  t.is(0, scrollTop);
});

test('should select first focusable element when opened', useStory('lightbox', 'links'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('text=link').first().waitFor();
  const focusText = await page.evaluate(() => document.activeElement.textContent);
  t.is(focusText, 'link');
});

test('should close on escape', useStory('lightbox'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('img').first().waitFor();
  await page.keyboard.press('Escape');
  await page.locator('text=link').first().waitFor({ state: 'hidden' });
  t.pass();
});

test('should navigate next on arrow right', useStory('lightbox'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('img').first().waitFor();
  await page.keyboard.press('ArrowRight');

  // wait for animation
  await page.waitForTimeout(1000);
  const bounds = await page.locator('img').nth(2).boundingBox();
  t.is(bounds.x, 0);
});

test('should navigate prev on arrow left', useStory('lightbox'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('img').first().waitFor();

  await page.keyboard.press('ArrowRight');
  // wait for animation
  await page.waitForTimeout(1000);
  const boundsNextPos = await page.locator('img').nth(2).boundingBox();
  t.is(boundsNextPos.x, 0);

  await page.keyboard.press('ArrowLeft');
  // wait for animation
  await page.waitForTimeout(1000);
  const boundsPrevPos = await page.locator('img').nth(2).boundingBox();
  t.not(boundsPrevPos.x, 0);
});
