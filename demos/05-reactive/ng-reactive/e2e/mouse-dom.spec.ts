import { test, expect } from '@playwright/test';

test.describe('Mouse & DOM Events demo', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/demos/mouse-dom', { waitUntil: 'networkidle' });
        // wait for the child component to be rendered
        await page.locator('app-mouse-dom-observables').waitFor({ state: 'attached', timeout: 10000 });
    });

    test('renders the canvas and button', async ({ page }) => {
        await expect(page.locator('canvas')).toBeVisible();
        await expect(page.getByRole('button', { name: /capture mouse events/i })).toBeVisible();
    });

    test('shows initial coordinates -1 -1', async ({ page }) => {
        await expect(page.getByText('signPad - Mouse Moved at X: -1 Y: -1')).toBeVisible();
    });

    test('updates coordinates after drawing on canvas', async ({ page }) => {
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        await page.getByRole('button', { name: /capture mouse events/i }).click();

        const box = await canvas.boundingBox();
        if (!box) throw new Error('canvas not found');

        // simulate draw: mousedown → mousemove → mouseup
        await page.mouse.move(box.x + 20, box.y + 20);
        await page.mouse.down();
        await page.mouse.move(box.x + 60, box.y + 60, { steps: 5 });
        await page.mouse.up();

        // coordinates should have changed from -1
        const coordDiv = page.locator('app-mouse-dom-observables div').last();
        await expect(coordDiv).not.toHaveText(/X: -1 Y: -1/);
        await expect(coordDiv).toBeVisible();
    });
});
