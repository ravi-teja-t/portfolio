// Publishes the site to the gh-pages branch, which GitHub Pages serves. Every gate runs first,
// and nothing is published if one fails, so a push to main can't change the live site.
import { execFileSync, spawnSync } from "node:child_process";

const BASE_PATH = "/portfolio";
const BRANCH = "gh-pages";
const shell = process.platform === "win32";

function run(command, args, env = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell,
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    console.error(`\nStopped: "${command} ${args.join(" ")}" failed. Nothing was published.`);
    process.exit(1);
  }
}

const changes = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" });
if (changes.trim()) {
  console.error("Stopped: commit your changes first, so the published site matches a commit.");
  process.exit(1);
}

for (const gate of ["lint", "format:check", "typecheck", "test:checks", "test:e2e"]) {
  run("pnpm", ["run", gate]);
}
run("pnpm", ["run", "test:lighthouse"]);
run("pnpm", ["run", "build"], { PAGES_BASE_PATH: BASE_PATH });

const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
run("pnpm", [
  "exec",
  "gh-pages",
  "--dist",
  "out",
  "--branch",
  BRANCH,
  "--nojekyll",
  "--message",
  `"Publish ${commit}"`,
]);

console.log(`\nPublished ${commit} to the ${BRANCH} branch.`);
