// Generates every site image from content, so no image needs manual work. Output goes to
// public/images/generated, which is gitignored. Images are abstract illustrations: this script
// must never draw a face or anything that could pass for a product screenshot.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { parse } from "yaml";
import siteConfig from "../site.config.ts";
import { ABOUT, COVER, GENERATED_PATH, tileName } from "./image-sizes.mjs";

const contentDir = path.resolve(process.env.CONTENT_DIR ?? "content");
const outputDir = path.join("public", GENERATED_PATH);

// Colours come from the design tokens, so they have one source. The accent is reserved for
// the Hire button, so it's skipped here.
function readTokens() {
  const css = fs.readFileSync("src/app/globals.css", "utf8");
  const theme = css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const entries = [...theme.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{3,8})/gi)]
    .filter(([, name]) => !name.includes("accent"))
    .map(([, name, value]) => [name, value]);
  return Object.fromEntries(entries);
}

const color = readTokens();
const FONT = "Inter, Segoe UI, Helvetica, Arial, sans-serif";

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(value, maxChars) {
  const lines = [];
  let line = "";
  for (const word of value.split(/\s+/)) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  return line ? [...lines, line] : lines;
}

function seededRandom(seed) {
  let state = [...seed].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// An abstract graph of connected nodes, unique to each seed.
function graph(seed, x, y, width, height) {
  const random = seededRandom(seed);
  const columns = 5;
  const nodes = Array.from({ length: columns * 2 }, (_, index) => ({
    x: x + (width / (columns - 1)) * (index % columns),
    y: y + height * (index < columns ? 0.15 + random() * 0.3 : 0.55 + random() * 0.35),
    size: 7 + random() * 9,
  }));
  const lines = nodes.flatMap((node, index) => {
    const next = nodes[(index + 1 + Math.floor(random() * 3)) % nodes.length];
    return `<path d="M${node.x} ${node.y} C${(node.x + next.x) / 2} ${node.y} ${(node.x + next.x) / 2} ${next.y} ${next.x} ${next.y}" stroke="${color["ink-line"]}" stroke-width="2" fill="none"/>`;
  });
  const dots = nodes.map(
    (node) =>
      `<circle cx="${node.x}" cy="${node.y}" r="${node.size}" fill="${color.ink}" stroke="${color["on-ink"]}" stroke-width="2"/>`,
  );
  return [...lines, ...dots].join("");
}

function textLines(lines, x, y, size, fill, weight = 700) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * size * 1.2}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`,
    )
    .join("");
}

function coverSvg(study) {
  const width = COVER.widths.at(-1);
  const height = Math.round(width * COVER.ratio);
  const title = wrap(study.title, 34).slice(0, 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${color.ink}"/>
    ${graph(study.slug, 90, 40, width - 180, 340)}
    ${textLines(title, 80, 500, 54, color["on-ink"])}
    ${textLines([study.stack.join("  ·  ")], 80, 650, 28, color["ink-line"], 500)}
  </svg>`;
}

function initials(name) {
  return name
    .split(/[\s/-]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function aboutSvg(name) {
  const size = ABOUT.widths.at(-1);
  const rings = [290, 230, 170]
    .map(
      (radius) =>
        `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color["ink-line"]}" stroke-width="2"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${color.ink}"/>
    ${rings}
    <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="${FONT}" font-size="150" font-weight="700" fill="${color["on-ink"]}">${escapeXml(initials(name))}</text>
  </svg>`;
}

function tileSvg(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <rect width="96" height="96" rx="16" fill="${color.ink}"/>
    <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${color["on-ink"]}">${escapeXml(initials(name))}</text>
  </svg>`;
}

function shareSvg(name, headline) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${color.ink}"/>
    ${graph(name, 760, 60, 370, 510)}
    ${textLines([name], 72, 110, 34, color["ink-line"], 600)}
    ${textLines(wrap(headline, 24), 72, 230, 62, color["on-ink"])}
  </svg>`;
}

async function writeRaster(svg, name, widths) {
  fs.writeFileSync(path.join(outputDir, `${name}.svg`), svg);
  await Promise.all(
    widths.flatMap((width) => {
      const image = sharp(Buffer.from(svg)).resize(width);
      return [
        image
          .clone()
          .webp({ quality: 80 })
          .toFile(path.join(outputDir, `${name}-${width}.webp`)),
        image
          .clone()
          .avif({ quality: 55 })
          .toFile(path.join(outputDir, `${name}-${width}.avif`)),
      ];
    }),
  );
}

function readYaml(relative) {
  const file = path.join(contentDir, relative);
  return fs.existsSync(file) ? parse(fs.readFileSync(file, "utf8")) : undefined;
}

function readCaseStudies() {
  const folder = path.join(contentDir, "case-studies");
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(folder, file), "utf8").replace(/\r\n/g, "\n");
      return parse(raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "{}");
    });
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const studies = readCaseStudies();
await Promise.all(
  studies.map((study) => writeRaster(coverSvg(study), `cover-${study.slug}`, COVER.widths)),
);

await writeRaster(aboutSvg(siteConfig.name), "about", ABOUT.widths);
fs.writeFileSync(path.join(outputDir, "icon.svg"), tileSvg(siteConfig.name));

const techItems = (readYaml("home/tech-stack.yaml") ?? []).flatMap((group) => group.items ?? []);
for (const item of techItems) {
  fs.writeFileSync(path.join(outputDir, `${tileName(item.name)}.svg`), tileSvg(item.name));
}

const headline = readYaml("home/hero.yaml")?.headline ?? siteConfig.tagline;
const share = shareSvg(siteConfig.name, headline);
fs.writeFileSync(path.join(outputDir, "share.svg"), share);
await sharp(Buffer.from(share)).png().toFile(path.join(outputDir, "share.png"));

console.log(`Generated images for ${studies.length} case studies and ${techItems.length} tools.`);
