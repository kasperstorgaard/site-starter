import test from 'ava';
import { useStory, env } from '../../../test-utils';

test('should show results when typing', useStory('autocomplete'), async (t, page) => {
  await page.locator('text=cities').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  t.pass();
});

test('should close results when tabbing out', useStory('autocomplete'), async (t, page) => {
  await page.locator('text=cities').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('Tab');
  await page.locator('text=copenhagen').waitFor({ state: 'hidden' });
  t.pass();
});

test('should select item when using arrow down', useStory('autocomplete'), async (t, page) => {
  await page.locator('text=cities').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.locator('[aria-selected=true] >> text=copenhagen').waitFor();
  t.pass();
});

test('should close results when arrow up after down', useStory('autocomplete'), async (t, page) => {
  await page.locator('text=cities').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await page.locator('text=copenhagen').waitFor({ state: 'hidden' });
  t.pass();
});

test('should reopen results when focusing and using arrow down', useStory('autocomplete'), async (t, page) => {
  await page.locator('text=cities').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('Tab');
  await page.locator('text=copenhagen').waitFor({ state: 'hidden' });
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('ArrowDown');
  await page.locator('text=copenhagen').waitFor();
  t.pass();
});

test('should select item on enter', useStory('autocomplete'), async (t, page) => {
  await page.locator('text=cities').click();
  await page.keyboard.type('cope');
  await page.locator('text=copenhagen').waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  const value = await page.locator('input').evaluate((el: HTMLInputElement) => el.value);
  t.is(value, 'Copenhagen');
  t.pass();
});
