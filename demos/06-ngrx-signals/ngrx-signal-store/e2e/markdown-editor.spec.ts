import { test, expect, seedMarkdownItems } from './markdown-editor.fixtures';

test.describe('Markdown Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
        await page.evaluate(() => localStorage.clear());
        await page.reload({ waitUntil: 'networkidle' });
    });

    test.describe('Opening the editor', () => {
        test('editor toggle button opens the editor pane', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-editor-container')).toBeVisible();
        });

        test('editor shows "Mock Markdown Editor" card title', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-editor-container mat-card-title')).toHaveText('Mock Markdown Editor');
        });

        test('closing editor hides the editor pane', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-editor-container')).toBeVisible();
            await page.getByRole('button', { name: 'Close Editor' }).click();
            await expect(page.locator('app-markdown-editor-container')).not.toBeVisible();
        });
    });

    test.describe('Item list', () => {
        test('displays page override entry (id=-1) at the top with article icon', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const firstRow = page.locator('app-markdown-list .row').first();
            await expect(firstRow.locator('mat-icon')).toHaveText('article');
        });

        test('displays seeded comment items with comment icon', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const commentRows = page.locator('app-markdown-list .row mat-icon:has-text("comment")');
            await expect(commentRows).toHaveCount(seedMarkdownItems.length);
        });

        test('shows item titles in the list', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            for (const item of seedMarkdownItems) {
                await expect(page.locator('app-markdown-list .title', { hasText: item.title })).toBeVisible();
            }
        });

        test('page override row has no Delete button', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const firstRow = page.locator('app-markdown-list .row').first();
            await expect(firstRow.locator('mat-icon')).toHaveText('article');
            await expect(firstRow.locator('.no-delete')).toBeVisible();
            await expect(firstRow.getByRole('button', { name: 'Delete' })).not.toBeVisible();
        });

        test('comment items have a Delete button', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const commentRow = page.locator('app-markdown-list .row', { hasText: seedMarkdownItems[0].title });
            await expect(commentRow.getByRole('button', { name: 'Delete' })).toBeVisible();
        });

        test('each item has an Edit button', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const rows = page.locator('app-markdown-list .row');
            await expect(rows.first()).toBeVisible();
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                await expect(rows.nth(i).getByRole('button', { name: 'Edit' })).toBeVisible();
            }
        });
    });

    test.describe('Adding a comment', () => {
        test('Add Comment button appears when editor is open', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.getByRole('button', { name: 'Add Comment' })).toBeVisible();
        });

        test('Add Comment button is hidden when editor is closed', async ({ page }) => {
            await expect(page.getByRole('button', { name: 'Add Comment' })).not.toBeVisible();
        });

        test('clicking Add Comment switches to edit form with empty fields', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.getByRole('button', { name: 'Add Comment' }).click();
            await expect(page.locator('app-markdown-edit')).toBeVisible();
            await expect(page.locator('app-markdown-list')).not.toBeVisible();
            const titleInput = page.locator('app-markdown-edit input[matinput]');
            await expect(titleInput).toHaveValue('');
        });

        test('Save and Cancel buttons appear in edit mode', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.getByRole('button', { name: 'Add Comment' }).click();
            await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        });

        test('saving a new comment sends POST and returns to list', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.getByRole('button', { name: 'Add Comment' }).click();

            const titleInput = page.locator('app-markdown-edit input[matinput]');
            await titleInput.fill('New Test Comment');
            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await textarea.fill('This is a new comment body');

            const postPromise = page.waitForRequest(req =>
                req.url().includes('/markdownItems') && req.method() === 'POST'
            );

            await page.getByRole('button', { name: 'Save' }).click();
            const postReq = await postPromise;
            const body = postReq.postDataJSON();
            expect(body.title).toBe('New Test Comment');
            expect(body.comment).toBe('This is a new comment body');

            await expect(page.locator('app-markdown-list')).toBeVisible();
            await expect(page.locator('app-markdown-edit')).not.toBeVisible();
        });
    });

    test.describe('Editing an existing item', () => {
        test('clicking Edit on a comment opens edit form with item data', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const commentRow = page.locator('app-markdown-list .row', { hasText: seedMarkdownItems[0].title });
            await commentRow.getByRole('button', { name: 'Edit' }).click();

            await expect(page.locator('app-markdown-edit')).toBeVisible();
            const titleInput = page.locator('app-markdown-edit input[matinput]');
            await expect(titleInput).toHaveValue(seedMarkdownItems[0].title);

            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await expect(textarea).toHaveValue(seedMarkdownItems[0].comment);
        });

        test('saving edits sends PUT and returns to list', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const commentRow = page.locator('app-markdown-list .row', { hasText: seedMarkdownItems[0].title });
            await commentRow.getByRole('button', { name: 'Edit' }).click();

            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await textarea.fill('Updated comment text');

            const putPromise = page.waitForRequest(req =>
                req.url().includes(`/markdownItems/${seedMarkdownItems[0].id}`) && req.method() === 'PUT'
            );

            await page.getByRole('button', { name: 'Save' }).click();
            const putReq = await putPromise;
            const body = putReq.postDataJSON();
            expect(body.comment).toBe('Updated comment text');

            await expect(page.locator('app-markdown-list')).toBeVisible();
        });

        test('title input is editable for regular comments (id > 0)', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const commentRow = page.locator('app-markdown-list .row', { hasText: seedMarkdownItems[0].title });
            await commentRow.getByRole('button', { name: 'Edit' }).click();

            const titleInput = page.locator('app-markdown-edit input[matinput]');
            await expect(titleInput).not.toHaveAttribute('readonly');
            await titleInput.fill('Changed Title');
            await expect(titleInput).toHaveValue('Changed Title');
        });
    });

    test.describe('Editing page override (id=-1)', () => {
        test('clicking Edit on page override opens form with readonly title', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const pageRow = page.locator('app-markdown-list .row').first();
            await expect(pageRow.locator('mat-icon')).toHaveText('article');
            await pageRow.getByRole('button', { name: 'Edit' }).click();

            await expect(page.locator('app-markdown-edit')).toBeVisible();
            const titleInput = page.locator('app-markdown-edit input[matinput]');
            await expect(titleInput).toHaveAttribute('readonly');
        });

        test('page override loads markdown content into comment textarea', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const pageRow = page.locator('app-markdown-list .row').first();
            await pageRow.getByRole('button', { name: 'Edit' }).click();

            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await expect(textarea).toHaveValue(/Test Markdown|Sample content/, { timeout: 5000 });
        });
    });

    test.describe('Deleting an item', () => {
        test('clicking Delete sends DELETE request and removes item from list', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const targetTitle = seedMarkdownItems[0].title;
            const commentRow = page.locator('app-markdown-list .row', { hasText: targetTitle });
            await expect(commentRow).toBeVisible();

            const deletePromise = page.waitForRequest(req =>
                req.url().includes(`/markdownItems/${seedMarkdownItems[0].id}`) && req.method() === 'DELETE'
            );

            await commentRow.getByRole('button', { name: 'Delete' }).click();
            await deletePromise;

            await expect(page.locator('app-markdown-list .row', { hasText: targetTitle })).not.toBeVisible();
        });

        test('second comment can be deleted independently', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const targetTitle = seedMarkdownItems[1].title;
            const commentRow = page.locator('app-markdown-list .row', { hasText: targetTitle });

            const deletePromise = page.waitForRequest(req =>
                req.url().includes(`/markdownItems/${seedMarkdownItems[1].id}`) && req.method() === 'DELETE'
            );

            await commentRow.getByRole('button', { name: 'Delete' }).click();
            await deletePromise;

            await expect(page.locator('app-markdown-list .row', { hasText: targetTitle })).not.toBeVisible();
            await expect(page.locator('app-markdown-list .row', { hasText: seedMarkdownItems[0].title })).toBeVisible();
        });
    });

    test.describe('Cancel editing', () => {
        test('Cancel returns to item list without saving', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.getByRole('button', { name: 'Add Comment' }).click();
            await expect(page.locator('app-markdown-edit')).toBeVisible();

            await page.getByRole('button', { name: 'Cancel' }).click();
            await expect(page.locator('app-markdown-list')).toBeVisible();
            await expect(page.locator('app-markdown-edit')).not.toBeVisible();
        });

        test('Cancel after editing does not persist changes', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const commentRow = page.locator('app-markdown-list .row', { hasText: seedMarkdownItems[0].title });
            await commentRow.getByRole('button', { name: 'Edit' }).click();

            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await textarea.fill('Should not be saved');

            await page.getByRole('button', { name: 'Cancel' }).click();
            await expect(page.locator('app-markdown-list .title', { hasText: seedMarkdownItems[0].title })).toBeVisible();
        });
    });

    test.describe('Form validation behavior', () => {
        test('Title and Comment form fields are present in edit mode', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.getByRole('button', { name: 'Add Comment' }).click();

            await expect(page.locator('app-markdown-edit mat-label', { hasText: 'Title' })).toBeVisible();
            await expect(page.locator('app-markdown-edit mat-label', { hasText: 'Comment' })).toBeVisible();
        });

        test('textarea uses autosize', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.getByRole('button', { name: 'Add Comment' }).click();
            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await expect(textarea).toHaveAttribute('cdktextareaautosize', '');
        });
    });

    test.describe('Page override persistence', () => {
        test('saving a page override sends POST with id -1 url pattern', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            const pageRow = page.locator('app-markdown-list .row').first();
            await pageRow.getByRole('button', { name: 'Edit' }).click();

            const textarea = page.locator('app-markdown-edit textarea[matinput]');
            await textarea.fill('# Custom override content');

            const savePromise = page.waitForRequest(req =>
                req.url().includes('/markdownItems') && (req.method() === 'POST' || req.method() === 'PUT')
            );

            await page.getByRole('button', { name: 'Save' }).click();
            await savePromise;

            await expect(page.locator('app-markdown-list')).toBeVisible();
        });

        test('after saving page override, article icon gets primary color', async ({ page }) => {
            await page.route('http://localhost:3000/markdownItems', async (route) => {
                if (route.request().method() === 'GET') {
                    await route.fulfill({
                        json: [
                            ...seedMarkdownItems,
                            { id: 3, url: 'demos/deep-signals', title: 'Deep Signals', comment: 'Overridden', saved: new Date().toISOString() },
                        ]
                    });
                } else if (route.request().method() === 'POST') {
                    const body = await route.request().postDataJSON();
                    await route.fulfill({ json: { ...body, id: 99 } });
                } else {
                    await route.continue();
                }
            });

            await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
            await page.getByRole('button', { name: 'Open Editor' }).click();

            const pageIcon = page.locator('app-markdown-list .row').first().locator('mat-icon');
            await expect(pageIcon).toHaveText('article');
        });
    });

    test.describe('Editor mode transitions', () => {
        test('switching from editor to guide hides editor container', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-editor-container')).toBeVisible();

            await page.locator('[mattooltip="Toggle Markdown Guide"]').click();
            await expect(page.locator('app-markdown-editor-container')).not.toBeVisible();
            await expect(page.locator('app-markdown-renderer')).toBeVisible();
        });

        test('switching back to editor from guide restores editor container', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await page.locator('[mattooltip="Toggle Markdown Guide"]').click();
            await expect(page.locator('app-markdown-renderer')).toBeVisible();

            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-editor-container')).toBeVisible();
        });

        test('editor retains list state after guide round-trip', async ({ page }) => {
            await page.getByRole('button', { name: 'Open Editor' }).click();
            await expect(page.locator('app-markdown-list')).toBeVisible();

            await page.locator('[mattooltip="Toggle Markdown Guide"]').click();
            await page.getByRole('button', { name: 'Open Editor' }).click();

            await expect(page.locator('app-markdown-list')).toBeVisible();
            for (const item of seedMarkdownItems) {
                await expect(page.locator('app-markdown-list .title', { hasText: item.title })).toBeVisible();
            }
        });
    });
});
