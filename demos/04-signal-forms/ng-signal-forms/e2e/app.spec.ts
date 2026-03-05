import { test, expect } from '@playwright/test';

test.describe('App smoke test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('renders the application', async ({ page }) => {
        // Check for app root element
        const appRoot = page.locator('app-root');
        await expect(appRoot).toBeVisible();
    });
});
