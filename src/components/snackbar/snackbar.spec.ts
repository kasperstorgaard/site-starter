import test from 'ava';
import { useStory } from '../../shared/test-utils';

test('should show when activated', useStory('snackbar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=snackbar message').waitFor();
  t.pass();
});

test('should hide itself after activation', useStory('snackbar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=snackbar message').waitFor();
  await page.locator('text=snackbar message').waitFor({ state: 'hidden', timeout: 6000 });
  t.pass();
});

test('should close using close button', useStory('snackbar'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('text=snackbar message').waitFor();
  await page.locator('text=close').click();
  await page.locator('text=snackbar message').waitFor({ state: 'hidden' });
  t.pass();
});

test('should be closeable using keyboard navigation', useStory('snackbar'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('text=snackbar message').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('text=snackbar message').waitFor({ state: 'hidden', timeout: 1000 });
  t.pass();
});

test('should restore focus when closing using keyboard', useStory('snackbar'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('text=snackbar message').waitFor();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('text=snackbar message').waitFor({ state: 'hidden', timeout: 1000 });
  const focusText = await page.evaluate(() => document.activeElement.textContent);
  t.is(focusText, 'open');
});

test('should set aria-live when opening', useStory('snackbar'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('[aria-live]').waitFor();
  t.pass();
});
