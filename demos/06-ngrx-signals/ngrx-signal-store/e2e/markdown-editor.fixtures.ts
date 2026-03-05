import { test as base, expect } from '@playwright/test';

export const seedDemos = [
    { id: 1, url: 'app-state', title: 'SignalStore App State', sortOrder: 1, topic: 'SignalStore Fundamentals', md: 'app-state', teaches: '' },
    { id: 4, url: 'deep-signals', title: 'Deep Signals', sortOrder: 11, topic: 'Data Management', md: 'deep-signals', teaches: '' },
];

export const seedMarkdownItems = [
    { id: 1, url: '', title: 'Using @ngrx/store', comment: 'To use @ngrx/store, we need to install it first.', saved: '2020-09-16T20:10:06.925Z' },
    { id: 2, url: '', title: 'Optimizing change detection', comment: 'In order to optimize change detection, we need to use OnPush strategy.', saved: '2020-09-16T20:10:06.925Z' },
];

export const test = base.extend<{ mockApis: void }>({
    mockApis: [async ({ page }, use) => {
        let items = seedMarkdownItems.map(i => ({ ...i }));
        let nextId = Math.max(...seedMarkdownItems.map(i => i.id)) + 1;

        await page.route('http://localhost:3000/demos', async (route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({ json: seedDemos });
            } else {
                await route.continue();
            }
        });

        await page.route('http://localhost:3000/markdownItems/*', async (route) => {
            const url = route.request().url();
            const segment = url.split('/').pop()!;
            const id = parseInt(segment);
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({ json: items.find(i => i.id === id) ?? null });
            } else if (method === 'PUT') {
                const body = await route.request().postDataJSON();
                const updated = { ...body, id };
                const idx = items.findIndex(i => i.id === id);
                if (idx !== -1) items[idx] = updated;
                await route.fulfill({ json: updated });
            } else if (method === 'DELETE') {
                items = items.filter(i => i.id !== id);
                await route.fulfill({ json: {} });
            } else {
                await route.continue();
            }
        });

        await page.route('http://localhost:3000/markdownItems', async (route) => {
            const method = route.request().method();
            if (method === 'GET') {
                await route.fulfill({ json: items });
            } else if (method === 'POST') {
                const body = await route.request().postDataJSON();
                const newItem = { ...body, id: nextId++ };
                items.push(newItem);
                await route.fulfill({ json: newItem });
            } else {
                await route.continue();
            }
        });

        await page.route('**/markdown/*.md', async (route) => {
            await route.fulfill({ body: '# Test Markdown\n\nSample content for testing.' });
        });

        await use();
    }, { auto: true }],
});

export { expect };
