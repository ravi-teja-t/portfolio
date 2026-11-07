// Builds the site once per content set, for the browser and Lighthouse tests. Each build
// is scanned too, so a broken fixture fails here with a clear message.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUTPUT = ".fixture-out";
const nextBin = path.join("node_modules", "next", "dist", "bin", "next");

function run(args, env) {
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function build(destination, env) {
  console.log(`\nBuilding ${destination}`);
  run(["scripts/generate-images.mjs"], env);
  run([nextBin, "build"], env);
  run(["scripts/strip-not-found-scripts.mjs"], env);
  run(["scripts/check-built-output.mjs"], env);
  const target = path.join(OUTPUT, destination);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync("out", target, { recursive: true });
}

fs.rmSync(OUTPUT, { recursive: true, force: true });

build("full", { CONTENT_DIR: "tests/fixtures/full", SITE_CANONICAL: "off" });
build("empty", { CONTENT_DIR: "tests/fixtures/empty", SITE_CANONICAL: "off" });
build("real", { SITE_CANONICAL: "off" });
build("base/portfolio", { CONTENT_DIR: "tests/fixtures/full", PAGES_BASE_PATH: "/portfolio" });
