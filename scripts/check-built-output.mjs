// Scans every built HTML file and exits non-zero on anything that could cost Ravi the Upwork
// account or embarrass the site: contact details, banned domains, placeholders, broken links.
// Rules are defined in specs/001-homepage/contracts/build-checks.md.
import fs from "node:fs";
import path from "node:path";
import { ALLOWED_OUTBOUND_DOMAINS, BANNED_DOMAINS } from "./banned-domains.mjs";

const root = path.resolve(process.argv[2] ?? "out");
const basePath = process.env.PAGES_BASE_PATH ?? "";

const IMAGE_EXTENSIONS = /\.(?:webp|avif|png|jpe?g|gif|svg)$/i;
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi;
const PHONE = /\+?\(?\d[\d\s().-]{7,}\d/g;
const CONTACT_LINK = /(?:mailto:|tel:\+?\d|sms:\+?\d)/gi;
const PLACEHOLDER = /\[[^\]\n]{1,80}\]|\bTODO\b|\bTBD\b|lorem ipsum/gi;

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

function withoutScripts(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

function visibleText(html) {
  const withoutCode = withoutScripts(html).replace(/<(code|pre)\b[\s\S]*?<\/\1>/gi, " ");
  return decodeEntities(withoutCode.replace(/<[^>]+>/g, " "));
}

function attributeText(html) {
  const values = [...html.matchAll(/\s(?:alt|title|content)="([^"]*)"/gi)].map((match) => match[1]);
  return decodeEntities(values.join("\n"));
}

function domainPattern(domain) {
  const escaped = domain.replace(/\./g, "\\.");
  return new RegExp(`(?<![a-z0-9.-])(?:[a-z0-9-]+\\.)*${escaped}(?![a-z0-9-])`, "i");
}

function isHost(host, domain) {
  return host === domain || host.endsWith(`.${domain}`);
}

function resolveInternal(reference) {
  const withoutBase =
    basePath && reference.startsWith(basePath) ? reference.slice(basePath.length) : reference;
  const relative = decodeURI(withoutBase).replace(/^\//, "");
  const direct = path.join(root, relative);
  const candidates = [direct, path.join(direct, "index.html"), `${direct}.html`];
  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
}

function checkInternalLink(file, html, reference, report) {
  const [pathPart, hash] = reference.split("#");
  const target = pathPart ? resolveInternal(pathPart) : file;
  if (!target) {
    report("broken link", reference);
    return;
  }
  if (hash) {
    const targetHtml = target === file ? html : fs.readFileSync(target, "utf8");
    if (!targetHtml.includes(`id="${hash}"`)) report("broken link", reference);
  }
}

function scanFile(file, findings) {
  const html = fs.readFileSync(file, "utf8");
  const markup = withoutScripts(html);
  const text = visibleText(html);
  const report = (rule, match) => findings.push({ file: path.relative(root, file), rule, match });

  for (const [match] of html.matchAll(EMAIL)) {
    if (!IMAGE_EXTENSIONS.test(match)) report("email", match);
  }

  for (const [match] of text.matchAll(PHONE)) {
    const digits = match.replace(/\D/g, "").length;
    if (digits >= 10 && digits <= 15) report("phone", match.trim());
  }

  for (const [match] of html.matchAll(CONTACT_LINK)) report("contact link", match);

  for (const domain of BANNED_DOMAINS) {
    const match = html.match(domainPattern(domain));
    if (match) report("banned domain", match[0]);
  }

  for (const [, href] of markup.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)) {
    const external = href.match(/^(?:https?:)?\/\/([^/?#]+)/i);
    if (external) {
      const host = external[1].toLowerCase();
      if (!ALLOWED_OUTBOUND_DOMAINS.some((domain) => isHost(host, domain))) {
        report("outbound link", href);
      }
    } else if (href.startsWith("/") || href.startsWith("#")) {
      checkInternalLink(file, html, href, report);
    }
  }

  for (const [, src] of markup.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/gi)) {
    if (src.startsWith("/")) checkInternalLink(file, html, src, report);
  }

  for (const [, srcset] of markup.matchAll(/\ssrcset="([^"]+)"/gi)) {
    for (const candidate of srcset.split(",")) {
      const src = candidate.trim().split(/\s+/)[0];
      if (src.startsWith("/")) checkInternalLink(file, html, src, report);
    }
  }

  for (const [, src] of html.matchAll(/<script\b[^>]*\ssrc="((?:https?:)?\/\/[^"]+)"/gi)) {
    report("third-party script", src);
  }

  if (/<form[\s>]/i.test(markup)) report("form", "<form>");

  for (const [match] of `${text}\n${attributeText(markup)}`.matchAll(PLACEHOLDER)) {
    report("placeholder", match);
  }
}

const findings = [];
const files = htmlFiles(root);
files.forEach((file) => scanFile(file, findings));

if (findings.length > 0) {
  console.error(`Compliance scan failed with ${findings.length} finding(s):`);
  for (const { file, rule, match } of findings) console.error(`  ${file}: ${rule}: ${match}`);
  process.exit(1);
}

console.log(`Compliance scan passed: ${files.length} HTML files.`);
