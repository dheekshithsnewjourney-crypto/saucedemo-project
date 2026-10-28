import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

test('has title & Cart & Menu-open & Menu-close', async ({ page }) => {
  await loginOk(page);

  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  await expect(page.locator('[data-test="open-menu"]')).toBeVisible();

  // The close (X) icon only shows while the menu is open, so open the menu first
  await page.locator('[data-test="open-menu"]').click();
  await expect(page.locator('[data-test="close-menu"]')).toBeVisible();
});

test('has filter', async ({ page }) => {
  await loginOk(page);

  const sort = page.locator('[data-test="product-sort-container"]');
  await expect(sort).toBeVisible();

  const expectedValues = ['az', 'za', 'lohi', 'hilo'];
  const options = sort.locator('option');
  await expect(options).toHaveCount(expectedValues.length);

  for (let i = 0; i < expectedValues.length; i++) {
    await expect(options.nth(i)).toHaveAttribute('value', expectedValues[i]);
  }
});

test('has inventory-list visible', async ({ page }) => {
  await loginOk(page);

  const products = page.locator('[data-test="inventory-item"]');
  await expect(products).toHaveCount(6);

  for (const product of await products.all()) {
    await expect(product.locator('[data-test="inventory-item-name"]')).toBeVisible();
    await expect(product.locator('[data-test="inventory-item-price"]')).toContainText('$');
    await expect(product.locator('img')).toBeVisible();
    await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }
});

test('has product details', async ({ page }) => {
  await loginOk(page);

  const expectedProducts = [
    {
      name: 'Sauce Labs Backpack',
      price: '$29.99',
      description: "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection."
    },
    {
      name: 'Sauce Labs Bike Light',
      price: '$9.99',
      description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included."
    },
    {
      name: 'Sauce Labs Bolt T-Shirt',
      price: '$15.99',
      description: "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt."
    },
    {
      name: 'Sauce Labs Fleece Jacket',
      price: '$49.99',
      description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office."
    },
    {
      name: 'Sauce Labs Onesie',
      price: '$7.99',
      description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel."
    },
    {
      name: 'Test.allTheThings() T-Shirt (Red)',
      price: '$15.99',
      description: "This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton."
    }
  ];

  const products = page.locator('[data-test="inventory-item"]');

  for (const expected of expectedProducts) {
    const product = products.filter({ hasText: expected.name });

    await expect(product.locator('[data-test="inventory-item-name"]')).toHaveText(expected.name);
    await expect(product.locator('[data-test="inventory-item-price"]')).toHaveText(expected.price);
    // This element also holds the name, price and button, so we check that it CONTAINS the description
    await expect(product.locator('[data-test="inventory-item-description"]')).toContainText(expected.description);
  }
});

test('has footer & social media icons visible', async ({ page }) => {
  await loginOk(page);

  const footer = page.getByRole('contentinfo');
  await expect(footer).toBeVisible();

  const expectedLinks = [
    ['X', 'https://x.com/saucelabs'],
    ['Facebook', 'https://www.facebook.com/saucelabs'],
    ['LinkedIn', 'https://www.linkedin.com/company/sauce-labs/'],
  ];

  await expect(footer.getByRole('link')).toHaveCount(expectedLinks.length);

  for (const [name, url] of expectedLinks) {
    const link = footer.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', url);
  }

  await expect(footer).toContainText('© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');
});