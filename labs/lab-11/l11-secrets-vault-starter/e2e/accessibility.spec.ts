import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const OWNER = { name: 'owner', password: 'Owner#Vault2026!' };

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('User').fill(OWNER.name);
  await page.getByLabel('Password').fill(OWNER.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('link', { name: /Cloud Provider Keys/ })).toBeVisible();
});

test('the login screen has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/login');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('the workbench has no WCAG 2.2 AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('the masked value announces its state to a screen reader', async ({ page }) => {
  const reveal = page.getByRole('button', { name: /^Reveal the value of / }).first();

  await expect(reveal).toHaveAttribute('aria-pressed', 'false');
  await reveal.click();
  await expect(reveal).toHaveAttribute('aria-pressed', 'true');
});
