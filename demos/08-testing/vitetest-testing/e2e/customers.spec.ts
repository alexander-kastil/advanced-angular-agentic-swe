import { test, expect, API, CustomersPage } from './customers.fixture';

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

test.describe('Customers — network mocking', () => {
  test('renders whatever the mocked API returns', async ({ page }) => {
    await page.route(`${API}/customers`, (route) =>
      route.fulfill({ json: [{ id: 1, name: 'Mocked Ada' }] })
    );

    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    await customersPage.expectRowVisible('Mocked Ada');
    await customersPage.expectRowHidden('Cleo');
  });

  test('shows an empty table when the API returns nothing', async ({ page }) => {
    await page.route(`${API}/customers`, (route) => route.fulfill({ json: [] }));

    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    await expect(page.getByRole('cell')).toHaveCount(0);
    await expect(customersPage.addButton()).toBeVisible();
  });

  test('survives a failing API without breaking the page', async ({ page }) => {
    await page.route(`${API}/customers`, (route) =>
      route.fulfill({ status: 500, json: { message: 'boom' } })
    );

    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    await expect(page.getByRole('cell')).toHaveCount(0);
    await expect(customersPage.addButton()).toBeEnabled();
  });
});

test.describe('Customers — network assertions', () => {
  test('save sends a PUT with the edited payload', async ({ page, customersPage }) => {
    await customersPage.editButton(/Cleo/).click();
    await customersPage.fillName('Cleo Renamed');

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().startsWith(`${API}/customers/`) && r.request().method() === 'PUT'
      ),
      customersPage.save(),
    ]);

    expect(response.ok()).toBe(true);
    expect(response.request().postDataJSON()).toMatchObject({ name: 'Cleo Renamed' });
  });

  test('cancel sends no request at all', async ({ page, customersPage }) => {
    const writes: string[] = [];
    page.on('request', (r) => {
      if (r.method() !== 'GET') writes.push(`${r.method()} ${r.url()}`);
    });

    await customersPage.editButton(/Soi/).click();
    await customersPage.fillName('Never Saved');
    await customersPage.cancelButton().click();
    await customersPage.expectFormHidden();

    expect(writes).toEqual([]);
  });
});

test.describe('Customers — keyboard interaction', () => {
  test('retypes the name with the keyboard and submits with Enter', async ({ customersPage }) => {
    await customersPage.editButton(/Giro/).click();

    await customersPage.nameInput().press('ControlOrMeta+a');
    await customersPage.nameInput().pressSequentially('Giro Typed');
    await customersPage.nameInput().press('Enter');

    await customersPage.expectRowVisible('Giro Typed');
    await customersPage.expectFormHidden();
  });

  test('the name field takes and reports focus', async ({ customersPage }) => {
    await customersPage.editButton(/Flora/).click();

    await customersPage.nameInput().focus();
    await expect(customersPage.nameInput()).toBeFocused();
  });

  test('clearing the name disables save', async ({ customersPage }) => {
    await customersPage.editButton(/Flora/).click();

    await customersPage.nameInput().press('ControlOrMeta+a');
    await customersPage.nameInput().press('Backspace');

    await expect(customersPage.saveButton()).toBeDisabled();
  });
});

test.describe('Customers — steps and soft assertions', () => {
  test('adding a customer, reported step by step', async ({ customersPage }) => {
    await test.step('open the empty form', async () => {
      await customersPage.addButton().click();
      await customersPage.expectFormVisible();
    });

    await test.step('type a name', async () => {
      await customersPage.fillName('Stepwise');
      await expect(customersPage.saveButton()).toBeEnabled();
    });

    await test.step('save', async () => {
      await customersPage.save();
      await customersPage.expectFormHidden();
    });

    await customersPage.expectRowVisible('Stepwise');
  });

  test('checks the whole table in one run', async ({ customersPage }) => {
    await expect.soft(customersPage.row(/Cleo/)).toBeVisible();
    await expect.soft(customersPage.row(/Soi/)).toBeVisible();
    await expect.soft(customersPage.row(/Giro/)).toBeVisible();
    await expect.soft(customersPage.row(/Flora/)).toBeVisible();
  });
});

test.describe('Customers — API request context', () => {
  test('delete removes the customer on the server too', async ({ customersPage, request }) => {
    await customersPage.deleteButton(/Giro/).click();
    await customersPage.expectRowHidden('Giro');

    const remaining = (await (await request.get(`${API}/customers`)).json()) as {
      name: string;
    }[];
    expect(remaining.map((c) => c.name)).not.toContain('Giro');
  });

  test('a customer seeded through the API shows up after a reload', async ({
    page,
    customersPage,
    request,
  }) => {
    await request.post(`${API}/customers`, { data: { id: 99, name: 'Api Seeded' } });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await customersPage.expectRowVisible('Api Seeded');
  });
});
