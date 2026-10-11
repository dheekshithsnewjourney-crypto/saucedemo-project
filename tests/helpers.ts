import { Page, expect } from '@playwright/test';

export const PASSWORD = 'secret_sauce';
export const USERS = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  problem: 'problem_user',
  glitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
};

export async function login(page: Page, user = USERS.standard, pass = PASSWORD) {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(user);
  await page.locator('[data-test="password"]').fill(pass);
  await page.locator('[data-test="login-button"]').click();
}

export async function loginOk(page: Page) {
  await login(page);
  await expect(page).toHaveURL('/inventory.html');
  await expect(page.locator('[data-test="inventory-item"]').first()).toBeVisible();
}

