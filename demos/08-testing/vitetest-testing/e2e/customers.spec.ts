import { test, expect, CustomersPage } from './customers.fixture';

test.describe('Customers — table', () => {
  test('shows all customers on load', async ({ customersPage }) => {
    await customersPage.expectRowVisible('Cleo');
    await customersPage.expectRowVisible('Soi');
    await customersPage.expectRowVisible('Giro');
    await customersPage.expectRowVisible('Flora');
  });

  test('edit form is hidden on load', async ({ customersPage }) => {
    await customersPage.expectFormHidden();
  });
});

test.describe('Customers — edit', () => {
  test('opens form with correct data when edit is clicked', async ({ customersPage }) => {
    await customersPage.editButton(/Cleo/).click();
    await customersPage.expectFormVisible();
    await expect(customersPage.nameInput()).toHaveValue('Cleo');
  });

  test('updates the row after save', async ({ customersPage }) => {
    await customersPage.editButton(/Cleo/).click();
    await customersPage.fillName('Cleo Updated');
    await customersPage.save();

    await customersPage.expectRowVisible('Cleo Updated');
    await customersPage.expectRowHidden('Cleo');
  });

  test('hides form after save', async ({ customersPage }) => {
    await customersPage.editButton(/Cleo/).click();
    await customersPage.fillName('Cleo Updated');
    await customersPage.save();

    await customersPage.expectFormHidden();
  });

  test('hides form on cancel without changing data', async ({ customersPage }) => {
    await customersPage.editButton(/Soi/).click();
    await customersPage.fillName('Soi Changed');
    await customersPage.cancelButton().click();

    await customersPage.expectFormHidden();
    await customersPage.expectRowVisible('Soi');
  });
});

test.describe('Customers — delete', () => {
  test('removes the row from the table', async ({ customersPage }) => {
    await customersPage.deleteButton(/Cleo/).click();
    await customersPage.expectRowHidden('Cleo');
  });

  test('remaining rows are unaffected', async ({ customersPage }) => {
    await customersPage.deleteButton(/Cleo/).click();
    await customersPage.expectRowVisible('Soi');
    await customersPage.expectRowVisible('Giro');
    await customersPage.expectRowVisible('Flora');
  });
});

test.describe('Customers — add', () => {
  test('opens empty form with next id', async ({ customersPage }) => {
    await customersPage.addButton().click();
    await customersPage.expectFormVisible();
    await expect(customersPage.nameInput()).toHaveValue('');
  });

  test('save is disabled when name is empty', async ({ customersPage }) => {
    await customersPage.addButton().click();
    await expect(customersPage.saveButton()).toBeDisabled();
  });

  test('save is enabled after typing a name', async ({ customersPage }) => {
    await customersPage.addButton().click();
    await customersPage.fillName('New One');
    await expect(customersPage.saveButton()).toBeEnabled();
  });

  test('adds new row to the table after save', async ({ customersPage }) => {
    await customersPage.addButton().click();
    await customersPage.fillName('New One');
    await customersPage.save();

    await customersPage.expectRowVisible('New One');
  });

  test('hides form after save', async ({ customersPage }) => {
    await customersPage.addButton().click();
    await customersPage.fillName('New One');
    await customersPage.save();

    await customersPage.expectFormHidden();
  });
});
