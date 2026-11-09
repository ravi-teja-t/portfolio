// Generates every site image from content, so no image needs manual work. Output goes to
// public/images/generated, which is gitignored. Drawn images are abstract illustrations or
// schematics: this script must never draw a face or anything that could pass for a product
// screenshot. The only face is Ravi's real photo (PORTRAIT), which is resized, never drawn.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { parse } from "yaml";
import siteConfig from "../site.config.ts";
import {
  ABOUT,
  COVER,
  GENERATED_PATH,
  ICON_SIZES,
  PORTRAIT,
  TOUCH_ICON_SIZE,
  tileName,
} from "./image-sizes.mjs";

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
const FONT = "IBM Plex Sans, Segoe UI, Helvetica, Arial, sans-serif";

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

// Tangled lines on the left pass through a gate and leave in order on the right: the idea behind
// the hero schematic, drawn differently for each seed.
function flow(seed, x, y, width, height, count = 64) {
  const random = seededRandom(seed);
  const gateX = x + width * (0.42 + random() * 0.14);
  const gateWidth = width * 0.12;
  const gateTop = y + height * 0.34;
  const gateHeight = height * 0.32;
  const exit = gateX + gateWidth;
  const reach = x + width - exit;
  const lines = Array.from({ length: count }, (_, index) => {
    const start = y + random() * height;
    const swing = y + random() * height;
    const gate = gateTop + (gateHeight * index) / (count - 1);
    const end = y + (height * (index + 0.5)) / count;
    const d = [
      `M${x} ${start}`,
      `C${x + (gateX - x) * 0.45} ${swing} ${x + (gateX - x) * 0.6} ${gate} ${gateX} ${gate}`,
      `H${exit}`,
      `C${exit + reach * 0.4} ${gate} ${exit + reach * 0.5} ${end} ${x + width} ${end}`,
    ].join(" ");
    return `<path d="${d}" stroke="${color["on-ink"]}" stroke-opacity="0.42" stroke-width="1.25" fill="none"/>`;
  });
  const gate = `<rect x="${gateX}" y="${gateTop - 14}" width="${gateWidth}" height="${gateHeight + 28}" fill="${color.ink}" stroke="${color["on-ink"]}" stroke-width="2"/>`;
  return [...lines, gate].join("");
}

// Contour lines around a point, like a survey plate. It stands in for a portrait without
// drawing one.
function contours(seed, size) {
  const random = seededRandom(seed);
  const waves = Array.from({ length: 4 }, (_, index) => ({
    frequency: index + 2,
    phase: random() * Math.PI * 2,
    depth: 0.05 + random() * 0.07,
  }));
  const center = size / 2;
  const rings = Array.from({ length: 30 }, (_, ring) => {
    const radius = size * 0.03 + ring * size * 0.0215;
    const points = Array.from({ length: 120 }, (_, step) => {
      const angle = (step / 120) * Math.PI * 2;
      const wobble = waves.reduce(
        (sum, wave) =>
          sum + Math.sin(angle * wave.frequency + wave.phase + ring * 0.09) * wave.depth,
        1,
      );
      const px = center + Math.cos(angle) * radius * wobble;
      const py = center + Math.sin(angle) * radius * wobble;
      return `${px.toFixed(1)} ${py.toFixed(1)}`;
    });
    const opacity = (0.75 - ring * 0.018).toFixed(2);
    return `<path d="M${points.join(" L")} Z" stroke="${color["on-ink"]}" stroke-opacity="${opacity}" stroke-width="1.25" fill="none"/>`;
  });
  return rings.join("");
}

function gridLines(width, height, step) {
  const columns = Array.from({ length: Math.ceil(width / step) }, (_, index) => index * step);
  const rows = Array.from({ length: Math.ceil(height / step) }, (_, index) => index * step);
  return [
    ...columns.map((x) => `<path d="M${x} 0 V${height}" stroke="${color["ink-line"]}"/>`),
    ...rows.map((y) => `<path d="M0 ${y} H${width}" stroke="${color["ink-line"]}"/>`),
  ].join("");
}

function textLines(lines, x, y, size, fill, weight = 700) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * size * 1.2}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`,
    )
    .join("");
}

const MONO = "JetBrains Mono, Consolas, DejaVu Sans Mono, monospace";

// Evenly spaced centres for `count` items between `start` and `end`.
function spread(count, start, end) {
  if (count === 1) return [(start + end) / 2];
  return Array.from({ length: count }, (_, index) => start + ((end - start) * index) / (count - 1));
}

function label(
  text,
  x,
  y,
  { size = 22, fill = color["on-ink"], weight = 600, anchor = "start", font = FONT } = {},
) {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle">${escapeXml(text)}</text>`;
}

function node(text, cx, cy, width, height = 56) {
  return [
    `<rect x="${cx - width / 2}" y="${cy - height / 2}" width="${width}" height="${height}" fill="${color["ink-raised"]}" stroke="${color["on-ink-muted"]}" stroke-width="1.5"/>`,
    label(text, cx, cy, { anchor: "middle" }),
  ].join("");
}

function wire(x1, y1, x2, y2, vertical = false) {
  const d = vertical
    ? `M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`
    : `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
  return [
    `<path d="${d}" stroke="${color["on-ink-muted"]}" stroke-opacity="0.8" stroke-width="1.5" fill="none"/>`,
    `<circle cx="${x2}" cy="${y2}" r="4" fill="${color["on-ink"]}"/>`,
  ].join("");
}

// A system diagram of the case study, from the `diagram` block in its front matter: where work
// comes in, the agent loop, the tools it uses and how work ends. Clearly a schematic, never a
// screenshot.
function diagramCover(diagram) {
  const { inputs, core, steps, tools, outputs } = diagram;
  const heading = (text, x, anchor = "start") =>
    label(text.toUpperCase(), x, 96, {
      size: 16,
      fill: color["on-ink-muted"],
      weight: 500,
      anchor,
      font: MONO,
    });

  const inX = 190;
  const inWidth = 240;
  const coreLeft = 480;
  const coreWidth = 340;
  const coreTop = 140;
  const coreHeight = 340;
  const coreRight = coreLeft + coreWidth;
  const coreCenter = coreLeft + coreWidth / 2;
  const outX = 1080;
  const outWidth = 260;
  const toolTop = 610;

  const inYs = spread(inputs.length, 170, 450);
  const inPorts = spread(inputs.length, coreTop + 50, coreTop + coreHeight - 50);
  const outYs = spread(outputs.length, 230, 390);
  const outPorts = spread(outputs.length, coreTop + 110, coreTop + coreHeight - 110);
  const toolWidth = 190;
  const toolXs = spread(tools.length, 240, 1040);
  const toolPorts = spread(tools.length, coreLeft + 50, coreRight - 50);

  const stepRows = steps.map((step, index) => {
    const y = coreTop + 120 + index * 50;
    return [
      `<rect x="${coreLeft + 24}" y="${y - 20}" width="${coreWidth - 48}" height="40" fill="${color.ink}" stroke="${color["ink-line"]}"/>`,
      label(String(index + 1).padStart(2, "0"), coreLeft + 44, y, {
        size: 16,
        fill: color["on-ink-muted"],
        weight: 500,
        font: MONO,
      }),
      label(step, coreLeft + 88, y, { size: 20, weight: 500 }),
    ].join("");
  });

  return [
    heading("Work comes in", inX - inWidth / 2),
    heading("Agent", coreLeft),
    heading("Outcome", outX - outWidth / 2),
    label("TOOLS", 40, toolTop + 28, {
      size: 16,
      fill: color["on-ink-muted"],
      weight: 500,
      font: MONO,
    }),
    ...inputs.map((input, index) => wire(inX + inWidth / 2, inYs[index], coreLeft, inPorts[index])),
    ...outputs.map((_, index) =>
      wire(coreRight, outPorts[index], outX - outWidth / 2, outYs[index]),
    ),
    ...tools.map((_, index) =>
      wire(toolPorts[index], coreTop + coreHeight, toolXs[index], toolTop, true),
    ),
    ...inputs.map((input, index) => node(input, inX, inYs[index], inWidth)),
    ...outputs.map((output, index) => node(output, outX, outYs[index], outWidth)),
    ...tools.map((tool, index) => node(tool, toolXs[index], toolTop + 28, toolWidth)),
    `<rect x="${coreLeft}" y="${coreTop}" width="${coreWidth}" height="${coreHeight}" fill="${color["ink-raised"]}" stroke="${color["on-ink"]}" stroke-width="2.5"/>`,
    label(core, coreCenter, coreTop + 48, { size: 36, weight: 700, anchor: "middle" }),
    label("agent loop", coreCenter, coreTop + 82, {
      size: 16,
      fill: color["on-ink-muted"],
      weight: 500,
      anchor: "middle",
      font: MONO,
    }),
    ...stepRows,
  ].join("");
}

function coverSvg(study) {
  const width = COVER.widths.at(-1);
  const height = Math.round(width * COVER.ratio);
  const art = study.diagram
    ? diagramCover(study.diagram)
    : flow(study.slug, 0, 40, width, height - 80, 72);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${color.ink}"/>
    ${gridLines(width, height, 80)}
    ${art}
  </svg>`;
}

function aboutSvg(name) {
  const size = ABOUT.widths.at(-1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${color.ink}"/>
    ${gridLines(size, size, 80)}
    ${contours(name, size)}
  </svg>`;
}

// A small mirrored pixel mark, different for each tool.
function tileSvg(name) {
  const random = seededRandom(name);
  const cell = 16;
  const square = (column, row) =>
    `<rect x="${8 + column * cell}" y="${8 + row * cell}" width="${cell}" height="${cell}"/>`;
  const cells = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 3 }, (_, column) => {
      if (random() < 0.45) return "";
      return column < 2 ? square(column, row) + square(4 - column, row) : square(column, row);
    }).join(""),
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <g fill="${color["on-ink"]}">${cells}</g>
  </svg>`;
}

// The about photo, and favicons cropped to the face: round ones for browser tabs, and a square
// one for iOS, which rounds the corners itself.
async function writePortrait() {
  if (!fs.existsSync(PORTRAIT.source)) {
    throw new Error(`Missing ${PORTRAIT.source}: the about photo and favicons are made from it.`);
  }
  const photo = sharp(PORTRAIT.source).rotate();
  const { width, height } = await photo.metadata();
  const side = Math.round(Math.min(width, height) * PORTRAIT.face.size);
  const face = {
    left: Math.round(width * PORTRAIT.face.left),
    top: Math.round(height * PORTRAIT.face.top),
    width: side,
    height: side,
  };
  const square = photo.clone().resize(PORTRAIT.size, PORTRAIT.size, { fit: "cover" });
  const base = path.join(outputDir, PORTRAIT.name);
  const circle = (size) =>
    Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`,
    );
  await Promise.all([
    square.clone().webp({ quality: 82 }).toFile(`${base}.webp`),
    square.clone().avif({ quality: 60 }).toFile(`${base}.avif`),
    ...ICON_SIZES.map((size) =>
      photo
        .clone()
        .extract(face)
        .resize(size, size)
        .composite([{ input: circle(size), blend: "dest-in" }])
        .png()
        .toFile(path.join(outputDir, `icon-${size}.png`)),
    ),
    photo
      .clone()
      .extract(face)
      .resize(TOUCH_ICON_SIZE, TOUCH_ICON_SIZE)
      .png()
      .toFile(path.join(outputDir, "apple-touch-icon.png")),
  ]);
}

// The headline keeps the left column: at 66px a 16-character line ends near x=650, and the
// flow lines start at x=720, so they never cross the text.
function shareSvg(name, headline) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${color.ink}"/>
    ${gridLines(1200, 630, 70)}
    ${flow(name, 720, 40, 440, 550, 40)}
    ${textLines([name], 72, 110, 32, color["on-ink-muted"], 600)}
    ${textLines(wrap(headline, 16).slice(0, 5), 72, 210, 66, color["on-ink"])}
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
await writePortrait();

const techItems = (readYaml("home/tech-stack.yaml") ?? []).flatMap((group) => group.items ?? []);
for (const item of techItems) {
  fs.writeFileSync(path.join(outputDir, `${tileName(item.name)}.svg`), tileSvg(item.name));
}

const headline = readYaml("home/hero.yaml")?.headline ?? siteConfig.tagline;
const share = shareSvg(siteConfig.name, headline);
fs.writeFileSync(path.join(outputDir, "share.svg"), share);
await sharp(Buffer.from(share)).png().toFile(path.join(outputDir, "share.png"));

console.log(`Generated images for ${studies.length} case studies and ${techItems.length} tools.`);
