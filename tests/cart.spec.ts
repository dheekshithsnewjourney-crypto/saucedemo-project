import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

test.describe('Cart', () => {

  test.beforeEach(async ({ page }) => {
    await loginOk(page);
  });

  test('add one item updates badge', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('add multiple items', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });

  test('remove item from inventory page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });

  test('cart page lists the added item', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveCount(1);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
  });

  test('remove item from cart page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('cart persists even after page reload', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.reload();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('click continue and  shopping returns to inventory', async ({ page }) => {
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL('/inventory.html');
  });
});