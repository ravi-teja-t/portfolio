import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const nextBin = path.join("node_modules", "next", "dist", "bin", "next");

// Each invalid set holds only the bad file, laid over the minimal valid content.
const cases = [
  ["missing-field", "services/bad.mdx"],
  ["too-many-metrics", "metrics.yaml"],
  ["placeholder-hidden", "testimonials/pending.yaml"],
  ["slug-clash", "services/clash.mdx"],
];

for (const [name, expected] of cases) {
  test(`build fails on ${name}`, () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.cpSync("tests/fixtures/empty", folder, { recursive: true });
    fs.cpSync(path.join("tests/fixtures/invalid", name), folder, { recursive: true });

    const result = spawnSync(process.execPath, [nextBin, "build"], {
      encoding: "utf8",
      env: { ...process.env, CONTENT_DIR: folder, NODE_ENV: "production" },
    });
    fs.rmSync(folder, { recursive: true, force: true });

    const output = result.stdout + result.stderr;
    assert.notEqual(result.status, 0, "build should fail");
    assert.ok(output.includes(expected), `error should name ${expected}:\n${output}`);
  });
}
