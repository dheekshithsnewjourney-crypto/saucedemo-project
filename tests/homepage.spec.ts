import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

test('has title & Cart & Menu-open & Menu-close', async ({ page }) => {
  await loginOk(page);

  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  await expect(page.locator('[data-test="open-menu"]')).toBeVisible();
  await expect(page.locator('[data-test="close-menu"]')).toBeVisible();
});

test('has filter ', async ({ page }) => {
  await loginOk(page);

  const product_sort_container = page.locator('[data-test="product-sort-container"]');
  await expect(product_sort_container).toBeVisible();
  await expect(product_sort_container).toHaveValues([
    'az',
    'za',
    'lohi',
    'hilo'
  ]);
});

test('has inventory-list visible', async ({ page }) => {
  const inventory_list = page.locator('[data-test="inventory-list"]');
  const products = inventory_list.locator('[data-test="inventory-item"]');
  await expect(products).toHaveCount(6);

  for (const product of await products.all()) {
    await expect(product.locator('.inventory_item_image')).toBeVisible();
    await expect(product.locator('.inventory_item_label')).toBeVisible();
    await expect(product.locator('[data-test="inventory-item-price"]')).toBeVisible();
    await expect(product.locator('.btn btn_primary btn_small btn_inventory')).toBeVisible();
    await expect(product.locator('.inventory_item_img')).toBeVisible();
  }
});

test('has product details', async ({ page }) => {
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
      name: 'Test.allThings() T-shirt (Red)',
      price: '$15.99',
      description: "This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton."
    }
  ];

  for (const expected of expectedProducts) {
    const products = page.locator('[data-test="inventory-item"]');
    const product = products.filter({ hasText: expected.name });

    await expect(product.locator('[data-test="inventory-item-name')).toHaveText(expected.name);
    await expect(product.locator('[data-test="inventory-item-price')).toHaveText(expected.price);
    await expect(product.locator('[data-test="inventory-item-description')).toHaveText(expected.description);
  }
})

test('has footer & social media icons visible', async ({ page }) => {
  const footer = page.locator('.footer');
  const socialIcons = footer.locator('.social li');

  await expect(socialIcons).toHaveCount(3);

  const expectedUrls = [
    ['social-x', 'https://x.com/saucelabs'],
    ['social-facebook', 'https://www.facebook.com/saucelabs'],
    ['social-linkedin', 'https://www.linkedin.com/company/sauce-labs/'],
  ];

  for (const [testId, expectedUrl] of expectedUrls) {
    const socialIcon = footer.locator(`[data-test="${testId}"]`);
    await expect(socialIcon).toBeVisible();
    await expect(socialIcon.locator('a')).toHaveAttribute('href', expectedUrl);
  }

  await expect(footer.locator('[data-test="footer-copy"]')).toHaveText('© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');
});

test('testing Add to cart & Remove btn', async ({ page }) => {
  await loginOk(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});