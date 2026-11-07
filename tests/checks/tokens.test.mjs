import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("generated images never use the accent colour", () => {
  const css = fs.readFileSync("src/app/globals.css", "utf8");
  const accent = css.match(/--color-accent:\s*(#[0-9a-f]+)/i)?.[1];
  assert.ok(accent, "accent token not found");

  const result = spawnSync(process.execPath, ["scripts/generate-images.mjs"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);

  const folder = "public/images/generated";
  const svgs = fs.readdirSync(folder).filter((file) => file.endsWith(".svg"));
  assert.ok(svgs.length > 0, "no SVG sources generated");
  for (const file of svgs) {
    const svg = fs.readFileSync(path.join(folder, file), "utf8").toLowerCase();
    assert.ok(!svg.includes(accent.toLowerCase()), `${file} uses the accent colour`);
  }
});
