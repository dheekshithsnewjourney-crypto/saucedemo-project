import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginOk } from './helpers';

test('axe scan: login page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  console.log(results.violations.map(v => `${v.impact}: ${v.help}`));
  expect(results.violations).toEqual([]);
});

test('axe scan: inventory page', async ({ page }) => {
  await loginOk(page);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  console.log(results.violations.map(v => `${v.impact}: ${v.help}`));
  expect(results.violations).toEqual([]);
});