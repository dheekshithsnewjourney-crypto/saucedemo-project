import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers';

test.describe('Special users', () => {
  test('error_user: all 6 items can be added to the cart', async ({ page }) => {
    await login(page, USERS.error);
    await expect(page).toHaveURL(/inventory\.html/);

    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await expect(addButtons).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      await addButtons.first().click();
    }

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('6');
  });

  test('problem_user: sorting by price low to high works', async ({ page }) => {
    await login(page, USERS.problem);
    await expect(page).toHaveURL(/inventory\.html/);

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents())
      .map(p => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('visual_user: names and prices match standard_user', async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    const standardNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    const standardPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();

    await page.context().clearCookies();
    await login(page, USERS.visual);
    await expect(page).toHaveURL(/inventory\.html/);
    const visualNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    const visualPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();

    expect(visualNames).toEqual(standardNames);
    expect(visualPrices).toEqual(standardPrices);
  });
});