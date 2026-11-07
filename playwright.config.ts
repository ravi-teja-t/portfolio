import { defineConfig, devices } from "@playwright/test";

const serve = (folder: string, port: number, readyPath = "") => ({
  command: `pnpm exec serve .fixture-out/${folder} -l ${port} -L`,
  url: `http://localhost:${port}${readyPath}`,
  reuseExistingServer: !process.env.CI,
});

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: devices["Desktop Chrome"],
  webServer: [
    serve("full", 4101),
    serve("empty", 4102),
    serve("base", 4103, "/portfolio/"),
    serve("real", 4104),
  ],
});
