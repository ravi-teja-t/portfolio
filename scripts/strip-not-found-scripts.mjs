// The not-found page is static: its links and Hire button are plain anchors, and the site
// works with scripts off. Removing its scripts spares a lost visitor the framework's startup cost.
import fs from "node:fs";

const file = "out/404.html";

const html = fs
  .readFileSync(file, "utf8")
  .replace(/<script\b[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*\bas="script"[^>]*>/gi, "");

fs.writeFileSync(file, html);
