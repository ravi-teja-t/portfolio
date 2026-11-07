// Runs Lighthouse on phone and desktop settings, on both test and real content. Run
// `pnpm test:e2e` first, because this audits the builds it creates.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const lhci = path.join("node_modules", "@lhci", "cli", "src", "cli.js");
const builds = [".fixture-out/full", ".fixture-out/real"];
const configs = ["lighthouserc.json", "lighthouserc.desktop.json"];

for (const build of builds) {
  if (!fs.existsSync(build)) {
    console.error(`Missing ${build}. Run pnpm test:e2e first.`);
    process.exit(1);
  }
}

const failed = [];

for (const build of builds) {
  for (const config of configs) {
    console.log(`\nLighthouse: ${build} with ${config}`);
    const result = spawnSync(
      process.execPath,
      [lhci, "autorun", `--config=${config}`, `--collect.staticDistDir=${build}`],
      { stdio: "inherit", env: { ...process.env, CHROME_PATH: chromium.executablePath() } },
    );
    if (result.status !== 0) failed.push(`${build} with ${config}`);
  }
}

if (failed.length > 0) {
  console.error(`\nLighthouse failed on: ${failed.join("; ")}`);
  process.exit(1);
}
console.log("\nLighthouse passed on every build and setting.");
