// @ts-check
const { defineConfig, devices } = require("@playwright/test")

/**
 * End-to-end checks run against the dev server. If one is already running on
 * :8000 the suite reuses it; otherwise it starts one.
 */
module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:8000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run develop",
    url: "http://localhost:8000",
    reuseExistingServer: true,
    timeout: 180 * 1000,
  },
})
