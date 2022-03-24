import test from 'ava';
import { useStory } from '../../shared/test-utils.js';

test('should expand on click', useStory('accordion'), async (t, page) => {
  await page.locator('text=item 0').click();
  await page.locator('text=this is some content').waitFor();
  t.pass();
});

test('should close on click', useStory('accordion'), async (t, page) => {
  await page.locator('text=item 0').click();
  await page.locator('text=content 0').waitFor();
  await page.locator('text=item 0').click();
  await page.locator('text=content 0').waitFor({ state: 'hidden' });
  t.pass();
});

test('should close other item in single mode', useStory('accordion', 'single-mode'), async (t, page) => {
  await page.locator('text=item 0').click();
  await page.locator('text=content 0').waitFor();
  await page.locator('text=item 1').click();
  await page.locator('text=content 1').waitFor();
  await page.locator('text=content 0').waitFor({ state: 'hidden' });
  t.pass();
});

test('should be able to use with keyboard', useStory('accordion'), async (t, page) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.locator('text=content 0').waitFor();
  t.pass();
});
