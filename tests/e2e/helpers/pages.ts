import fs from "node:fs";
import path from "node:path";

export const FULL = "http://localhost:4101";
export const EMPTY = "http://localhost:4102";
export const BASE = "http://localhost:4103/portfolio";
export const REAL = "http://localhost:4104";

const SKIPPED_FOLDERS = new Set(["_next", "404", "_not-found"]);

function indexPages(root: string, relative = ""): string[] {
  const pages: string[] = [];
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIPPED_FOLDERS.has(entry.name)) {
        pages.push(...indexPages(root, path.posix.join(relative, entry.name)));
      }
    } else if (entry.name === "index.html") {
      pages.push(`/${relative ? `${relative}/` : ""}`);
    }
  }
  return pages;
}

// Every page in the build, so new pages are tested automatically. The 404/ and _not-found/
// folders are the same page as 404.html, which is reached through a missing address.
export const pages = [...indexPages(".fixture-out/full"), "/this-page-does-not-exist/"];

export const sectionIds = [
  "top-bar",
  "hero",
  "proof",
  "services",
  "work",
  "how-i-work",
  "tech-stack",
  "about",
  "testimonials",
  "faq",
  "closing",
  "footer",
];
