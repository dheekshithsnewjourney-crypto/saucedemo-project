import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

const URL = 'https://www.saucedemo.com/';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(URL);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.locator('[data-test="username"]').fill('wrongusername');
      await page.locator('[data-test="password"]').fill('wrongpassword');
      await page.locator('[data-test="login-button"]').click();

      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('do not match any user');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();

      await expect(page).toHaveURL('/inventory.html');
    });

    test('should show error when username is empty', async ({ page }) => {
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();

      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    });

    test('should show error when password is empty', async ({ page }) => {
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="login-button"]').click();

      await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
    });

    test('locked out user sees error', async ({ page }) => {
      await page.locator('[data-test="username"]').fill('locked_out_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();

      await expect(page.locator('[data-test="error"]')).toContainText('locked out');
    });
  });

  test('login page lists accepted usernames and password', async ({ page }) => {
    await page.goto('/');

    const credentials = page.locator('[data-test="login-credentials"]');
    await expect(credentials.locator('h4')).toHaveText('Accepted usernames are:');

    const usernames = [
      'standard_user',
      'locked_out_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user',
    ];

    for (const name of usernames) {
      await expect(credentials).toContainText(name);
    }

    const password = page.locator('[data-test="login-password"]');
    await expect(password.locator('h4')).toHaveText('Password for all users:');
    await expect(password).toContainText('secret_sauce');
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      await loginOk(page);

      await page.getByRole('button', { name: 'Open Menu' }).click();
      await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
      await page.locator('[data-test="logout-sidebar-link"]').click();

      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });
});