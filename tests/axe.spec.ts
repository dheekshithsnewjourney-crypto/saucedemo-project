import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginOk } from './helpers';

for (const [name, path] of [['login', '/'], ['inventory', '/inventory.html']]) {
  test(`axe scan: ${name} page`, async ({ page }) => {
    if (name === 'inventory') await loginOk(page); else await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    for (const v of results.violations) {
      console.log(`[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
    }
    expect.soft(results.violations, 'WCAG violations found').toEqual([]);
  });
}