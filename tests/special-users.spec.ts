import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers';

const expectedNames = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];
const expectedPrices = ['$29.99', '$9.99', '$15.99', '$49.99', '$7.99', '$15.99'];

test.describe('Special users', () => {

  test('error_user: all 6 items can be added to the cart', async ({ page }) => {
    test.fail(true, 'KNOWN BUG: error_user cannot add every item to the cart (the badge stays below 6)');
    await login(page, USERS.error);
    await expect(page).toHaveURL('/inventory.html');

    const cards = page.locator('[data-test="inventory-item"]');
    await expect(cards).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      await cards.nth(i).getByRole('button', { name: 'Add to cart' }).click();
    }

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('6');
  });

  test('problem_user: sorting by price low to high works', async ({ page }) => {
    test.fail(true, 'KNOWN BUG: problem_user sorting does not change the product order');
    await login(page, USERS.problem);
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents())
      .map(p => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('visual_user: names match and price differences are reported', async ({ page }) => {
    await login(page, USERS.visual);
    await expect(page).toHaveURL('/inventory.html');

    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(expectedNames);

    const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    if (prices.join() !== expectedPrices.join()) {
      test.info().annotations.push({
        type: 'known bug',
        description: `visual_user shows different prices: ${prices.join(', ')}`,
      });
    }
  });
});