import { test as base, expect } from '@playwright/test';

export const seedSkills = [
    { id: 1, name: 'Angular', completed: false },
    { id: 2, name: 'NgRx', completed: true },
    { id: 3, name: 'TypeScript', completed: false },
];

export const test = base.extend<{ mockSkillsApi: void }>({
    mockSkillsApi: [async ({ page }, use) => {
        let skills = seedSkills.map(s => ({ ...s }));
        let nextId = Math.max(...seedSkills.map(s => s.id)) + 1;

        await page.route('http://localhost:3000/skills/*', async (route) => {
            const url = route.request().url();
            const segment = url.split('/').pop()!;
            const id = parseInt(segment);
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({ json: skills.find(s => s.id === id) ?? null });
            } else if (method === 'PUT') {
                const body = await route.request().postDataJSON();
                const updated = { ...body, id };
                const idx = skills.findIndex(s => s.id === id);
                if (idx !== -1) skills[idx] = updated;
                await route.fulfill({ json: updated });
            } else if (method === 'DELETE') {
                skills = skills.filter(s => s.id !== id);
                await route.fulfill({ json: {} });
            } else {
                await route.continue();
            }
        });

        await page.route('http://localhost:3000/skills', async (route) => {
            const method = route.request().method();
            if (method === 'GET') {
                await route.fulfill({ json: skills });
            } else if (method === 'POST') {
                const body = await route.request().postDataJSON();
                const newSkill = { ...body, id: nextId++ };
                skills.push(newSkill);
                await route.fulfill({ json: newSkill });
            } else {
                await route.continue();
            }
        });

        await use();
    }, { auto: true }],
});

export { expect };
