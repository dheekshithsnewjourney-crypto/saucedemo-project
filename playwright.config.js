import { defineConfig, devices } from '@playwright/test';
 
export default defineConfig({

  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,   // one test at a time: Firefox froze at random steps when several browsers ran together

  reporter: [
    ['html'],
    ['junit', { outputFile: 'results.xml' }]
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      timeout: 60000,   // Firefox starts slowly on this machine
      retries: 1,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
       name: 'Mobile Chrome',
       use: { ...devices['Pixel 5'] },
   },
     {
      name: 'Mobile Safari',
       use: { ...devices['iPhone 12'] },
     },
  ],
});

