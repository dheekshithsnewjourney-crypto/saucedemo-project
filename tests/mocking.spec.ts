import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

test.describe('Network mocking', () => {

  test('page still works when all images fail to load', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    await loginOk(page);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('simulate slow network on page load', async ({ page }) => {
    await page.route('**/*', async route => {
      await new Promise(r => setTimeout(r, 300));
      await route.continue();
    });
    await page.goto('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});