import test from 'ava';
import { useStory, env } from '../../shared/test-utils';

test('should expand on click', useStory('sidebar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  t.pass();
});

test('should close when clicking close button', useStory('sidebar', 'pre-opened'), async (t, page) => {
  await page.locator('text=close').click();
  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
  t.pass();
});

test('should close when clicking outside container on desktop', useStory('sidebar', 'pre-opened'), async (t, page) => {
  if (env.isMobile) {
    t.pass('sidebar only has "scrim" background element on desktop');
    return;
  }

  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.click('html', { position: { x: 200, y: 200 }});

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
  t.pass();
});

test('should not scroll body on long page', useStory('sidebar', 'scroll-lock'), async (t, page) => {
  await page.locator('text="open"').click();
  await page.mouse.wheel(0, 1000);
  await page.locator('text=close').click();
  const scrollTop = await page.locator('html').evaluate(body => body.scrollTop);
  t.is(0, scrollTop);
});

test('should set focus to container when opening', useStory('sidebar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.waitForTimeout(1000);
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
  t.is(focusedTag, 'SG-SIDEBAR');
});

test('should send back focus to opening element when closing', useStory('sidebar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.locator('text=close').click();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'open');
});

test('should focus first focusable element on open', useStory('sidebar', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'continue');
});

test('should be able to close the sidebar with keyboard', useStory('sidebar', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
  t.pass();
});

test('should be able to close sidebar with keyboard when tabbing backwards', useStory('sidebar', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
  t.pass();
});

test('should wrap around focus when tabbing past elements', useStory('sidebar', 'header-and-footer'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focusedText = await page.evaluate(() => document.activeElement?.textContent);
  t.is(focusedText, 'continue');
});

test('should close on escape', useStory('sidebar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=hi from the sidebar :)').waitFor();
  await page.keyboard.up('Escape');

  await page.locator('text=hi from the sidebar :)').waitFor({ state: 'hidden'});
  t.pass();
});
