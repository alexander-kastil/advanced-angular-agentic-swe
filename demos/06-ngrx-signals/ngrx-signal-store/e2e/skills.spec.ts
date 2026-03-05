import { test, expect, seedSkills } from './skills.fixtures';

test.describe('Skills', () => {
    test.beforeEach(async ({ page, mockSkillsApi }) => {
        await page.goto('/skills', { waitUntil: 'networkidle' });
    });

    test.describe('List view', () => {
        test('displays all skills', async ({ page }) => {
            await expect(page.locator('app-skill-row')).toHaveCount(3);
            for (const skill of seedSkills) {
                await expect(page.getByText(skill.name)).toBeVisible();
            }
        });

        test('shows KPI totals', async ({ page }) => {
            await expect(page.getByText('Skills Total: 3')).toBeVisible();
            await expect(page.getByText('Not Completed: 2')).toBeVisible();
        });

        test('ShowAll toggle filters to non-completed only', async ({ page }) => {
            await page.locator('mat-slide-toggle').click();
            await expect(page.locator('app-skill-row')).toHaveCount(2);
        });

        test('ShowAll toggle restores all skills', async ({ page }) => {
            await page.locator('mat-slide-toggle').click();
            await expect(page.locator('app-skill-row')).toHaveCount(2);
            await page.locator('mat-slide-toggle').click();
            await expect(page.locator('app-skill-row')).toHaveCount(3);
        });
    });

    test.describe('Add skill', () => {
        test('Add button navigates to add form', async ({ page }) => {
            await page.getByRole('button', { name: /add/i }).click();
            await expect(page).toHaveURL(/\/skills\/new$/);
            await expect(page.getByText('Add Skill')).toBeVisible();
        });

        test('add form has empty name field', async ({ page }) => {
            await page.getByRole('button', { name: /add/i }).click();
            await expect(page.getByPlaceholder('Name')).toHaveValue('');
        });

        test('cancel returns to list without adding', async ({ page }) => {
            await page.getByRole('button', { name: /add/i }).click();
            await page.getByRole('button', { name: /cancel/i }).click();
            await expect(page).toHaveURL(/\/skills$/);
            await expect(page.locator('app-skill-row')).toHaveCount(3);
        });

        test('save with empty name stays on form', async ({ page }) => {
            await page.getByRole('button', { name: /add/i }).click();
            await page.getByRole('button', { name: /save/i }).click();
            await expect(page).toHaveURL(/\/skills\/new$/);
        });

        test('adds a new skill and returns to list', async ({ page }) => {
            await page.getByRole('button', { name: /add/i }).click();
            await page.getByPlaceholder('Name').fill('RxJS');
            await page.getByRole('button', { name: /save/i }).click();
            await expect(page).toHaveURL(/\/skills$/);
            await expect(page.locator('app-skill-row')).toHaveCount(4);
            await expect(page.getByText('RxJS')).toBeVisible();
        });

        test.skip('adding two skills does not override the first', async ({ page }) => {
            await page.getByRole('button', { name: /add/i }).click();
            await page.getByPlaceholder('Name').fill('RxJS');
            await page.getByRole('button', { name: /save/i }).click();
            await expect(page).toHaveURL(/\/skills$/);
            await expect(page.locator('app-skill-row')).toHaveCount(4);

            await page.getByRole('button', { name: /add/i }).click();
            await page.getByPlaceholder('Name').fill('Signals');
            await page.getByRole('button', { name: /save/i }).click();
            await expect(page).toHaveURL(/\/skills$/);
            await expect(page.locator('app-skill-row')).toHaveCount(5);
            await expect(page.getByText('RxJS')).toBeVisible();
            await expect(page.getByText('Signals')).toBeVisible();
        });
    });

    test.describe('Edit skill', () => {
        test('edit button navigates to edit form', async ({ page }) => {
            await page.locator('app-skill-row').first().locator('button').first().click();
            await expect(page).toHaveURL(/\/skills\/\d+$/);
            await expect(page.getByText('Edit Skill')).toBeVisible();
        });

        test('edit form prefills existing skill data', async ({ page }) => {
            await page.locator('app-skill-row').first().locator('button').first().click();
            await expect(page.getByPlaceholder('Name')).toHaveValue('Angular');
        });

        test('cancel on edit returns to list', async ({ page }) => {
            await page.locator('app-skill-row').first().locator('button').first().click();
            await page.getByRole('button', { name: /cancel/i }).click();
            await expect(page).toHaveURL(/\/skills$/);
        });

        test.skip('saves updated skill and returns to list', async ({ page }) => {
            await page.locator('app-skill-row').first().locator('button').first().click();
            await page.getByPlaceholder('Name').clear();
            await page.getByPlaceholder('Name').fill('Angular Updated');
            await page.getByRole('button', { name: /save/i }).click();
            await expect(page).toHaveURL(/\/skills$/);
            await expect(page.getByText('Angular Updated')).toBeVisible();
        });
    });

    test.describe('Delete skill', () => {
        test('deletes a skill and updates the list', async ({ page }) => {
            const rows = page.locator('app-skill-row');
            await expect(rows).toHaveCount(3);
            await rows.first().locator('button').nth(1).click();
            await expect(rows).toHaveCount(2);
        });

        test('KPI updates after delete', async ({ page }) => {
            await page.locator('app-skill-row').first().locator('button').nth(1).click();
            await expect(page.getByText('Skills Total: 2')).toBeVisible();
        });
    });
});
