import { test, expect } from './demo-layout.fixtures';

test.describe('Demo layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/demos', { waitUntil: 'networkidle' });
        await page.evaluate(() => localStorage.clear());
    });

    test.describe('Guide button visibility', () => {
        test('not visible on /demos root (no demo selected)', async ({ page }) => {
            await page.goto('/demos', { waitUntil: 'networkidle' });
            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await expect(guideBtn).not.toBeVisible();
        });

        test('visible on deep-signals (component has content + markdown)', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await expect(guideBtn).toBeVisible();
        });

        test('visible on store-entities (empty component but has markdown)', async ({ page }) => {
            await page.goto('/demos/store-entities', { waitUntil: 'networkidle' });
            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await expect(guideBtn).toBeVisible();
        });
    });

    test.describe('Demo pane visibility', () => {
        test('demo pane is hidden when component has no content (store-entities)', async ({ page }) => {
            await page.goto('/demos/store-entities', { waitUntil: 'networkidle' });
            const demoPaneArea = page.locator('as-split-area').first();
            await expect(demoPaneArea).toHaveClass(/as-hidden/);
        });

        test('demo pane is visible when component has content (deep-signals)', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            const demoPaneArea = page.locator('as-split-area').first();
            await expect(demoPaneArea).not.toHaveClass(/as-hidden/);
        });
    });

    test.describe('Markdown pane', () => {
        test('opens on guide button click when demo has markdown', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await guideBtn.click();
            await expect(page.locator('.as-split-gutter')).toBeVisible();
        });

        test('closes on second guide button click', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await guideBtn.click();
            await expect(page.locator('.as-split-gutter')).toBeVisible();
            await guideBtn.click();
            await expect(page.locator('.as-split-gutter')).not.toBeVisible();
        });

        test('fills full height on store-entities (no demo content)', async ({ page }) => {
            await page.goto('/demos/store-entities', { waitUntil: 'networkidle' });
            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await guideBtn.click();
            const gutter = page.locator('.as-split-gutter');
            await expect(gutter).not.toBeVisible();
        });

        test('guide content visible after guide button click', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            await page.locator('[mattooltip="Toggle Markdown Guide"]').click();
            await expect(page.locator('app-markdown-renderer')).toBeVisible();
            await expect(page.locator('app-markdown-editor-container')).not.toBeVisible();
        });
    });

    test.describe('Editor toggle', () => {
        test('editor button shows edit_square icon when editor is closed', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            const editorBtn = page.getByRole('button', { name: 'Open Editor' });
            await expect(editorBtn).toBeVisible();
            await expect(editorBtn.locator('mat-icon')).toHaveText('edit_square');
        });

        test('editor button opens editor pane and switches to cancel icon', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.getByRole('button', { name: 'Close Editor' })).toBeVisible();
            await expect(page.locator('app-markdown-editor-container')).toBeVisible();
            await expect(page.locator('app-markdown-renderer')).not.toBeVisible();
        });

        test('close editor hides pane and restores edit_square icon', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.getByRole('button', { name: 'Close Editor' })).toBeVisible();
            await page.getByRole('button', { name: 'Close Editor' }).click();
            await expect(page.getByRole('button', { name: 'Open Editor' })).toBeVisible();
            await expect(page.locator('.as-split-gutter')).not.toBeVisible();
        });

        test('guide button switches from editor to guide view', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-editor-container')).toBeVisible();
            await page.locator('[mattooltip="Toggle Markdown Guide"]').click();
            await expect(page.locator('app-markdown-renderer')).toBeVisible();
            await expect(page.locator('app-markdown-editor-container')).not.toBeVisible();
        });
    });

    test.describe('Split pane retention', () => {
        test('demoPaneSize persists after drag and guide toggle', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });

            const guideBtn = page.locator('[mattooltip="Toggle Markdown Guide"]');
            await guideBtn.click();

            const gutter = page.locator('.as-split-gutter').first();
            await expect(gutter).toBeVisible();

            const gutterBox = await gutter.boundingBox();
            if (gutterBox) {
                const cx = gutterBox.x + gutterBox.width / 2;
                const cy = gutterBox.y + gutterBox.height / 2;
                await page.mouse.move(cx, cy);
                await page.mouse.down();
                await page.mouse.move(cx, cy - 150, { steps: 10 });
                await page.mouse.up();
            }

            await page.waitForFunction(
                () => {
                    const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
                    return state.demoPaneSize !== 500 && state.demoPaneSize !== undefined;
                },
                { timeout: 5000 }
            );

            const sizeAfterDrag = await page.evaluate<number>(() => {
                const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
                return state.demoPaneSize;
            });

            expect(sizeAfterDrag).not.toBe(500);

            await guideBtn.click();
            await expect(gutter).not.toBeVisible();

            await guideBtn.click();
            await expect(gutter).toBeVisible();

            const sizeAfterToggle = await page.evaluate<number>(() => {
                const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
                return state.demoPaneSize;
            });

            expect(sizeAfterToggle).toBeCloseTo(sizeAfterDrag, 0);
        });

        test('demoPaneSize persists across page reload', async ({ page }) => {
            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });

            await page.evaluate(() => {
                const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
                localStorage.setItem('layout-state', JSON.stringify({ ...state, demoPaneSize: 350 }));
            });

            await page.reload({ waitUntil: 'networkidle' });

            const savedSize = await page.evaluate<number>(() => {
                const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
                return state.demoPaneSize;
            });

            expect(savedSize).toBe(350);
        });
    });
});
