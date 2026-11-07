import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

function scan(body, extraFiles = {}) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "scan-"));
  fs.writeFileSync(path.join(folder, "index.html"), `<html><body>${body}</body></html>`);
  for (const [name, content] of Object.entries(extraFiles)) {
    fs.mkdirSync(path.dirname(path.join(folder, name)), { recursive: true });
    fs.writeFileSync(path.join(folder, name), content);
  }
  const result = spawnSync(process.execPath, ["scripts/check-built-output.mjs", folder], {
    encoding: "utf8",
  });
  fs.rmSync(folder, { recursive: true, force: true });
  return { status: result.status, output: result.stdout + result.stderr };
}

const mustFail = [
  ["email in text", "<p>name@example.com</p>", "email"],
  ["email in an inline payload", '<script>self.x("name@example.com")</script>', "email"],
  ["international phone", "<p>Call +1 415 555 0100</p>", "phone"],
  ["local phone", "<p>(415) 555-0100</p>", "phone"],
  ["mailto link", '<a href="mailto:a">Mail</a>', "contact link"],
  ["tel link", '<a href="tel:+14155550100">Call</a>', "contact link"],
  ["sms link", '<a href="sms:+14155550100">Text</a>', "contact link"],
  ["banned domain in a link", '<a href="https://linkedin.com/in/x">In</a>', "banned domain"],
  ["banned domain in text", "<p>Find me on wa.me/123</p>", "banned domain"],
  ["banned subdomain", '<a href="https://www.facebook.com/x">Fb</a>', "banned domain"],
  ["unknown outbound link", '<a href="https://example.org">Site</a>', "outbound link"],
  ["form", "<form><input></form>", "form"],
  ["third-party script", '<script src="https://cdn.example.org/a.js"></script>', "third-party"],
  ["bracket placeholder", "<p>[X] tickets automated</p>", "placeholder"],
  ["worded placeholder", "<p>[client quote]</p>", "placeholder"],
  ["todo", "<p>TODO write this</p>", "placeholder"],
  ["tbd", "<p>Timeline TBD</p>", "placeholder"],
  ["lorem ipsum", "<p>Lorem ipsum dolor</p>", "placeholder"],
  ["placeholder in alt", '<img src="#" alt="[X]">', "placeholder"],
  ["missing page", '<a href="/missing/">Gone</a>', "broken link"],
  ["missing section", '<a href="#nowhere">Gone</a>', "broken link"],
  ["missing image", '<img src="/images/gone.webp" alt="">', "broken link"],
  ["missing srcset image", '<img srcset="/images/gone.webp 640w" alt="">', "broken link"],
];

for (const [name, body, rule] of mustFail) {
  test(`fails on ${name}`, () => {
    const { status, output } = scan(body);
    assert.equal(status, 1, output);
    assert.match(output, new RegExp(rule));
  });
}

const mustPass = [
  ["a domain ending in a banned one", "<p>Built for netflix.com and max.com</p>"],
  ["an image name with an at sign", '<img src="/photo@2x.webp" alt="">'],
  ["year ranges", "<p>Worked here 2019 - 2024 and 2024 - 2026</p>"],
  ["metric values", "<p>1,000,000 tickets in 12 months, 40% faster</p>"],
  ["an upwork link", '<a href="https://www.upwork.com/freelancers/~01">Hire</a>'],
  ["a github link", '<a href="https://github.com/example">Code</a>'],
  ["brackets in code", "<pre>items[0]</pre><code>[X]</code>"],
  ["the home link", '<a href="/">Home</a>'],
  ["a section on the page", '<a href="#here">Go</a><div id="here"></div>'],
];

for (const [name, body] of mustPass) {
  test(`passes ${name}`, () => {
    const { status, output } = scan(body, { "photo@2x.webp": "" });
    assert.equal(status, 0, output);
  });
}

test("resolves links under the base path", () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "scan-"));
  fs.writeFileSync(path.join(folder, "index.html"), '<a href="/portfolio/">Home</a>');
  const result = spawnSync(process.execPath, ["scripts/check-built-output.mjs", folder], {
    encoding: "utf8",
    env: { ...process.env, PAGES_BASE_PATH: "/portfolio" },
  });
  fs.rmSync(folder, { recursive: true, force: true });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
