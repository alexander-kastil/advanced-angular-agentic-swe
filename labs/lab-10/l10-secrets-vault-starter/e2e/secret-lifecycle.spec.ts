import { expect, test } from '@playwright/test';

const OWNER = { name: 'owner', password: 'Owner#Vault2026!' };
const LIST = 'Cloud Provider Keys';
const CREATED = 'lab-08-probe';
const RENAMED = 'lab-08-probe-renamed';

async function apiToken(request: import('@playwright/test').APIRequestContext) {
  const response = await request.post('/api/auth/login', { data: OWNER });
  return (await response.json()).token as string;
}

test.beforeEach(async ({ page, request }) => {
  // A run that failed halfway leaves a row behind, and two rows break a strict locator.
  const token = await apiToken(request);
  const headers = { Authorization: `Bearer ${token}` };
  const lists = await (await request.get('/api/lists', { headers })).json();
  const listId = lists.find((list: { name: string }) => list.name === LIST).listId;
  for (const name of [CREATED, RENAMED]) {
    await request.delete(`/api/secrets/${name}?listId=${listId}`, { headers });
  }

  await page.goto('/login');
  await page.getByLabel('User').fill(OWNER.name);
  await page.getByLabel('Password').fill(OWNER.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('link', { name: new RegExp(LIST) })).toBeVisible();
});

test('creates, renames and deletes a secret', async ({ page, request }) => {
  const token = await apiToken(request);
  const headers = { Authorization: `Bearer ${token}` };

  const lists = await (await request.get('/api/lists', { headers })).json();
  const listId = lists.find((list: { name: string }) => list.name === LIST).listId;

  await request.post('/api/secrets', {
    headers,
    data: {
      listId,
      name: CREATED,
      url: null,
      user: 'probe',
      password: null,
      comment: 'Created by the lab 8 end-to-end run.',
      mfa: false,
      categoryIds: [],
    },
  });

  await page.goto(`/secrets/${listId}`);
  await page.getByPlaceholder('name, user or comment').fill(CREATED);
  await expect(page.getByRole('link', { name: new RegExp(`^${CREATED} `) })).toBeVisible();

  await page.getByRole('link', { name: new RegExp(`^${CREATED} `) }).click();
  await expect(page.getByRole('heading', { name: CREATED, level: 3 })).toBeVisible();

  await page.getByLabel('Name').fill(RENAMED);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('heading', { name: RENAMED, level: 3 })).toBeVisible();

  const after = await (
    await request.get(`/api/secrets/${RENAMED}?listId=${listId}`, { headers })
  ).json();
  expect(after.name).toBe(RENAMED);

  const deleted = await request.delete(`/api/secrets/${RENAMED}?listId=${listId}`, { headers });
  expect(deleted.status()).toBe(204);

  await page.reload();
  await page.getByPlaceholder('name, user or comment').fill(RENAMED);
  await expect(page.getByText('No secret in this list matches that filter.')).toBeVisible();
});
