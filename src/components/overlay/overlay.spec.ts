import test from 'ava';
import { useStory, env } from '../../shared/test-utils';

test('should close on click', useStory('overlay'), async (t, page) => {
  await page.locator('text=open').click();
  await page.locator('sg-overlay').waitFor();
  await page.locator('html').click({ position: { x: 200, y: 200 }});
  await page.locator('sg-overlay').waitFor({ state: 'hidden' });
  t.pass();
});
