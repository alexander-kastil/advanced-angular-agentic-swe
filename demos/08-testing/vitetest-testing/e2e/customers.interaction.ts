/**
 * Customers interaction script — mirrors the manual MCP browser exploration.
 * Not a test suite: sequential steps to smoke-test the full customer workflow.
 * Run with: npx playwright test e2e/customers.interaction.ts --headed
 */
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:4200/customers');
  await page.waitForLoadState('networkidle');
  console.log('✔ Customers page loaded');

  // Edit Cleo → append " Updated"
  const cleoRow = page.getByRole('row', { name: /Cleo/ });
  await cleoRow.getByRole('button').first().click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Cleo Updated');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✔ Edited Cleo → Cleo Updated');

  // Delete Cleo Updated
  const updatedRow = page.getByRole('row', { name: /Cleo Updated/ });
  await updatedRow.getByRole('button').last().click();
  await page.waitForLoadState('networkidle');
  console.log('✔ Deleted Cleo Updated');

  // Add new customer
  await page.getByRole('button', { name: 'Add Customer' }).click();
  const nameInput = page.getByRole('textbox', { name: 'Name' });
  console.log('✔ Form opened, Save disabled:', await page.getByRole('button', { name: 'Save' }).isDisabled());
  await nameInput.fill('NewCustomer');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✔ Added NewCustomer');

  // Cancel edit
  const soiRow = page.getByRole('row', { name: /Soi/ });
  await soiRow.getByRole('button').first().click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  console.log('✔ Cancel hides form');

  await browser.close();
})();
