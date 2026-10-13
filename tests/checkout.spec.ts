import { test, expect, Page } from '@playwright/test';
import { loginOk } from './helpers';

async function checkOutBackpack(page: Page) {
  await loginOk(page);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL('/checkout-step-one.html');
}

test.describe('Checkout', () => {

  test('complete the happy path', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="firstName"]').fill('Dheekshith');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('560100');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL('/checkout-step-two.html');
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('missing first name', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('560100');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('missing last name', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="firstName"]').fill('Dheekshith');
    await page.locator('[data-test="postalCode"]').fill('560100');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('missing postal code', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="firstName"]').fill('Dheekshith');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('check if order total = total item + tax', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="firstName"]').fill('A');
    await page.locator('[data-test="lastName"]').fill('B');
    await page.locator('[data-test="postalCode"]').fill('1');
    await page.locator('[data-test="continue"]').click();
    const num = async (sel: string) =>
      parseFloat((await page.locator(sel).innerText()).replace(/[^0-9.]/g, ''));
    const sub = await num('[data-test="subtotal-label"]');
    const tax = await num('[data-test="tax-label"]');
    const total = await num('[data-test="total-label"]');
    expect(+(sub + tax).toFixed(2)).toBe(total);
  });

  test('try to cancel on step one and returns to cart', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL('/cart.html');
  });

  test('back to home after the order clears the cart', async ({ page }) => {
    await checkOutBackpack(page);
    await page.locator('[data-test="firstName"]').fill('A');
    await page.locator('[data-test="lastName"]').fill('B');
    await page.locator('[data-test="postalCode"]').fill('1');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });
});