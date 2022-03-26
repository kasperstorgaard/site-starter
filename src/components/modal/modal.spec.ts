import test from 'ava';
import { useStory, env } from '../../shared/test-utils';

test('should expand on click', useStory('modal'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  t.pass();
});

test('should close when clicking close button', useStory('modal', 'pre-opened'), async (t, page) => {
  await page.locator('text=close').click();
  await page.locator('text=hello').waitFor({ state: 'hidden'});
  t.pass();
});

test('should close when clicking outside container on desktop', useStory('modal', 'pre-opened'), async (t, page) => {
  if (env.isMobile) {
    t.pass('modal only has "scrim" background element on desktop');
    return;
  }

  await page.locator('text=hello').waitFor();
  await page.locator('html').click({ position: { x: 200, y: 200 }});

  await page.locator('text=hello').waitFor({ state: 'hidden'});
  t.pass();
});

test('should not scroll body on long page', useStory('modal', 'scroll-lock'), async (t, page) => {
  await page.locator('button >> text=open').click();
  await page.mouse.wheel(0, 1000);
  await page.locator('text=close').click();
  const scrollTop = await page.locator('html').evaluate(body => body.scrollTop);
  t.is(0, scrollTop);
});

test('should set focus to close button when opening', useStory('modal'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  const modal$ = page.locator('sg-modal');
  const focusedText = await modal$.evaluate(el => el.shadowRoot.activeElement?.textContent);
  t.regex(focusedText, /close/);
});

test('should send back focus to opening element when closing', useStory('modal'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  await page.locator('text=close').click();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'open');
});

test('should focus first focusable element on open', useStory('modal', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'sign me up');
});

test('should be able to close the with keyboard', useStory('modal', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');

  await page.locator('text=hello').waitFor({ state: 'hidden'});
  t.pass();
});

test('should be able to close with keyboard when tabbing backwards', useStory('modal', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');

  await page.locator('text=hello').waitFor({ state: 'hidden'});
  t.pass();
});

test('should wrap around focus when tabbing past elements', useStory('modal', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'sign me up');
});

test('should close on escape', useStory('modal'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hello').waitFor();
  await page.keyboard.press('Escape');

  await page.locator('text=hello').waitFor({ state: 'hidden'});
  t.pass();
});
