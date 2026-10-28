import { test, expect } from '@playwright/test';
import { login, loginOk, USERS, logout } from './helpers';

test.describe('Edge cases', () => {

  test('SQL-injection-style username is rejected', async ({ page }) => {
    await login(page, "' OR 1=1 --", 'x');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('very long username does not break the page', async ({ page }) => {
    await login(page, 'a'.repeat(5000), 'x');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('XSS payload in username is not executed', async ({ page }) => {
    let dialog = false;
    page.on('dialog', d => { dialog = true; d.dismiss(); });
    await login(page, '<script>alert(1)</script>', 'x');
    expect(dialog).toBe(false);
  });

  test('whitespace-padded username is rejected', async ({ page }) => {
    await login(page, ' standard_user ', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('username is case-sensitive', async ({ page }) => {
    await login(page, 'STANDARD_USER', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('browser back after logout does not reveal inventory', async ({ page }) => {
    await loginOk(page);
    await logout(page);
    await page.goBack();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('problem_user: all product images are the same', async ({ page }) => {
    await login(page, USERS.problem);
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.inventory_item_img img').first()).toBeVisible();
    const srcs = await page.locator('.inventory_item_img img').evaluateAll(
      els => els.map(e => (e as HTMLImageElement).src));
    expect(new Set(srcs).size, 'BUG: problem_user shows duplicate images').toBe(1);
  });

  test('performance_glitch_user logs in within 10s', async ({ page }) => {
    const start = Date.now();
    await login(page, USERS.glitch);
    await expect(page).toHaveURL('/inventory.html', { timeout: 10_000 });
    console.log(`Login took ${Date.now() - start} ms`);
  });

  test('invalid checkout step URL without login is blocked', async ({ page }) => {
    await page.goto('/checkout-step-two.html');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});