import { test as base, expect } from '@playwright/test';

export const seedDemos = [
    { id: 1, url: 'app-state', title: 'SignalStore App State', sortOrder: 1, topic: 'SignalStore Fundamentals', md: 'app-state', teaches: '' },
    { id: 4, url: 'deep-signals', title: 'Deep Signals', sortOrder: 11, topic: 'Data Management', md: 'deep-signals', teaches: '' },
    { id: 3, url: 'store-entities', title: 'SignalStore Entities', sortOrder: 10, topic: 'Data Management', md: 'store-entities', teaches: '' },
];

export const test = base.extend<{ mockDemosApi: void }>({
    mockDemosApi: [async ({ page }, use) => {
        await page.route('http://localhost:3000/demos', async (route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({ json: seedDemos });
            } else {
                await route.continue();
            }
        });
        await use();
    }, { auto: true }],
});

export { expect };
