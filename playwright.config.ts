import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  workers: 2,
  reporter: [['list'], ['json', { outputFile: 'reports/local/e2e.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/Amazon-Clone-Demo-Project/',
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173/Amazon-Clone-Demo-Project/',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
