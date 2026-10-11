import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

test.describe('Network mocking', () => {
  test('page still works when all images fail to load', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    await loginOk(page);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('mock a backend response and assert on it', async ({ page }) => {
    await page.route('**/api/products', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'Mock Backpack', price: 29.99 }]),
      }));
    await page.goto('/');
    const data = await page.evaluate(async () => (await fetch('/api/products')).json());
    expect(data[0].name).toBe('Mock Backpack');
  });

  test('simulate 500 error from a backend call', async ({ page }) => {
    await page.route('**/api/orders', route => route.fulfill({ status: 500, body: 'Server error' }));
    await page.goto('/');
    const status = await page.evaluate(async () => (await fetch('/api/orders')).status);
    expect(status).toBe(500);
  });

  test('simulate slow network on page load', async ({ page }) => {
    await page.route('**/*', async route => {
      await new Promise(r => setTimeout(r, 300));
      await route.continue();
    });
    await page.goto('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('log all network requests during login (DevTools-style)', async ({ page }) => {
    const urls: string[] = [];
    page.on('request', r => urls.push(`${r.method()} ${r.url()}`));
    await loginOk(page);
    console.log(urls.slice(0, 10).join('\n'));
    expect(urls.length).toBeGreaterThan(0);
  });
});