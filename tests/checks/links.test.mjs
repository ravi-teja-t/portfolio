import assert from "node:assert/strict";
import test from "node:test";
import { caseStudyHref, serviceHref } from "../../src/lib/content/links.ts";

test("a service links to its page only when it has one", () => {
  assert.equal(serviceHref({ slug: "backend", hasPage: true }), "/backend");
  assert.equal(serviceHref({ slug: "backend", hasPage: false }), undefined);
});

test("a case study links to its page only when it has one", () => {
  assert.equal(caseStudyHref({ slug: "aikaiq", hasPage: true }), "/work/aikaiq");
  assert.equal(caseStudyHref({ slug: "aikaiq", hasPage: false }), undefined);
});
