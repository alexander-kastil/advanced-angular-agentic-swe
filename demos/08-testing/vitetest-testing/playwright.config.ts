import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env['PW_PORT'] ?? 4200);

export default defineConfig({
  testDir: './e2e',
  tsconfig: './tsconfig.e2e.json',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx ng serve --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
