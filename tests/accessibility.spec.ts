import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

test.describe('Accessibility (manual-style checks)', () => {

  test('login form is keyboard operable', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Tab key focus works differently in WebKit (Safari), so this check is skipped there');
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-test="username"]')).toBeFocused();
    await page.keyboard.type('standard_user');
    await page.keyboard.press('Tab');
    await page.keyboard.type('secret_sauce');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/inventory.html');
  });

  test('all product images have alt text', async ({ page }) => {
    await loginOk(page);
    const imgs = page.locator('.inventory_item_img img');
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('alt', /.+/);
    }
  });

  test('page has a heading structure', async ({ page }) => {
    test.fail(true, 'Bug: inventory page has no h1-h6 headings');
    await loginOk(page);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('inputs have placeholders/labels', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', 'Username');
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('placeholder', 'Password');
  });
});