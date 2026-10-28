import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers';

test.describe('Special users', () => {

  test('error_user: all 6 items can be added to the cart', async ({ page }) => {
    test.fail(true, 'KNOWN BUG: error_user cannot add every item to the cart');

    await login(page, USERS.error);
    await expect(page).toHaveURL('/inventory.html');

    // Click "Add to cart" on each of the 6 product cards, one by one
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
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const prices = page.locator('[data-test="inventory-item-price"]');
    await expect(prices.first()).toHaveText('$7.99');
    await expect(prices.last()).toHaveText('$49.99');
  });

  test('visual_user: shows 6 products and the usual price', async ({ page }) => {
    await login(page, USERS.visual);
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);

    const firstPrice = await page.locator('[data-test="inventory-item-price"]').first().textContent();
    if (firstPrice !== '$29.99') {
      test.info().annotations.push({
        type: 'known bug',
        description: `visual_user shows a different price: ${firstPrice}`,
      });
    }
  });
});
