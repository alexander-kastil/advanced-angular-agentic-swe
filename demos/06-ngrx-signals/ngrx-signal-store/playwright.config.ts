import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 15000,
    use: {
        baseURL: 'http://localhost:4200',
        ...devices['Desktop Chrome'],
        headless: true,
    },
});
