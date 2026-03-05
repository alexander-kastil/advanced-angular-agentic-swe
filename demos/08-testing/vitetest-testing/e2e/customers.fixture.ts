import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';

const API = 'http://localhost:3000';

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Cleo' },
  { id: 2, name: 'Soi' },
  { id: 3, name: 'Giro' },
  { id: 4, name: 'Flora' },
];

async function resetCustomers(request: APIRequestContext) {
  const existing = await (await request.get(`${API}/customers`)).json();
  for (const c of existing) {
    await request.delete(`${API}/customers/${c.id}`);
  }
  for (const c of INITIAL_CUSTOMERS) {
    await request.post(`${API}/customers`, { data: c });
  }
}

export class CustomersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/customers');
    await this.page.waitForLoadState('networkidle');
  }

  table() {
    return this.page.getByRole('table');
  }

  row(name: string | RegExp) {
    return this.page.getByRole('row', { name });
  }

  editButton(rowName: string | RegExp) {
    return this.row(rowName).getByRole('button').first();
  }

  deleteButton(rowName: string | RegExp) {
    return this.row(rowName).getByRole('button').last();
  }

  addButton() {
    return this.page.getByRole('button', { name: 'Add Customer' });
  }

  nameInput() {
    return this.page.getByRole('textbox', { name: 'Name' });
  }

  saveButton() {
    return this.page.getByRole('button', { name: 'Save' });
  }

  cancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  async fillName(name: string) {
    await this.nameInput().fill(name);
  }

  async save() {
    await this.saveButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectRowVisible(name: string) {
    await expect(this.page.getByRole('cell', { name })).toBeVisible();
  }

  async expectRowHidden(name: string) {
    await expect(this.page.getByRole('cell', { name })).not.toBeVisible();
  }

  async expectFormVisible() {
    await expect(this.nameInput()).toBeVisible();
  }

  async expectFormHidden() {
    await expect(this.nameInput()).not.toBeVisible();
  }
}

type CustomersFixtures = { customersPage: CustomersPage };

export const test = base.extend<CustomersFixtures>({
  customersPage: async ({ page, request }, use) => {
    await resetCustomers(request);
    const cp = new CustomersPage(page);
    await cp.goto();
    await use(cp);
  },
});

export { expect };
