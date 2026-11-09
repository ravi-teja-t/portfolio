type Box = { x: number; y: number; label: string };

type Layout = {
  className: string;
  width: number;
  height: number;
  font: number;
  chip: { width: number; height: number };
  agent: { x: number; y: number; width: number; height: number };
  bend: number;
  inputs: Box[];
  outputs: Box[];
};

// Work arrives in no particular order on the left, and leaves sorted on the right. The curves
// are loose going in and square coming out, which is the whole point of the drawing.
const WIDE: Layout = {
  className: "hidden md:block",
  width: 1280,
  height: 340,
  font: 13,
  chip: { width: 132, height: 36 },
  agent: { x: 540, y: 74, width: 200, height: 192 },
  bend: 850,
  inputs: [
    { x: 8, y: 18, label: "Ticket" },
    { x: 92, y: 88, label: "Invoice" },
    { x: 20, y: 152, label: "HL7 message" },
    { x: 120, y: 218, label: "Form" },
    { x: 40, y: 286, label: "Alert" },
  ],
  outputs: [
    { x: 1140, y: 44, label: "Resolved" },
    { x: 1140, y: 152, label: "Routed" },
    { x: 1140, y: 260, label: "Human review" },
  ],
};

const COMPACT: Layout = {
  className: "md:hidden",
  width: 360,
  height: 232,
  font: 11,
  chip: { width: 78, height: 30 },
  agent: { x: 134, y: 42, width: 92, height: 148 },
  bend: 250,
  inputs: [
    { x: 1, y: 14, label: "Ticket" },
    { x: 14, y: 100, label: "Invoice" },
    { x: 1, y: 188, label: "Alert" },
  ],
  outputs: [
    { x: 281, y: 14, label: "Resolved" },
    { x: 281, y: 100, label: "Routed" },
    { x: 281, y: 188, label: "Human" },
  ],
};

const CELLS = ["Read", "Decide", "Act"];

function delayed(delay: number) {
  return `--delay:${delay}ms`;
}

function popped(delay: number) {
  return `${delayed(delay)};transform-box:fill-box;transform-origin:center`;
}

// Spreads connection points evenly down one side of the agent block.
function port(layout: Layout, index: number, count: number) {
  const { y, height } = layout.agent;
  return y + (height * (index + 1)) / (count + 1);
}

function inputPath(layout: Layout, box: Box, index: number) {
  const startX = box.x + layout.chip.width;
  const startY = box.y + layout.chip.height / 2;
  const endY = port(layout, index, layout.inputs.length);
  const middle = (startX + layout.agent.x) / 2;
  return `M${startX} ${startY} C${middle} ${startY} ${middle} ${endY} ${layout.agent.x} ${endY}`;
}

function outputPath(layout: Layout, box: Box, index: number) {
  const startX = layout.agent.x + layout.agent.width;
  const startY = port(layout, index, layout.outputs.length);
  const endY = box.y + layout.chip.height / 2;
  return `M${startX} ${startY} H${layout.bend + index * 8} V${endY} H${box.x}`;
}

function path(d: string, className: string, delay: number, strokeWidth: number) {
  return `<path d="${d}" pathLength="1" class="${className}" style="${delayed(delay)}" stroke-width="${strokeWidth}"></path>`;
}

function chip(box: Box, layout: Layout, delay: number) {
  const { width, height } = layout.chip;
  return (
    `<g class="hero-node" style="${popped(delay)}">` +
    `<rect x="${box.x}" y="${box.y}" width="${width}" height="${height}" class="schematic-box" stroke-width="1"></rect>` +
    `<text x="${box.x + width / 2}" y="${box.y + height / 2}" dy="0.35em" text-anchor="middle" font-size="${layout.font}">${box.label}</text>` +
    `</g>`
  );
}

function schematic(layout: Layout) {
  const { agent, inputs, outputs, font } = layout;
  const ins = inputs.map((box, index) => inputPath(layout, box, index));
  const outs = outputs.map((box, index) => outputPath(layout, box, index));
  const cellHeight = (agent.height - 44) / CELLS.length;
  const cells = CELLS.map((label, index) => {
    const y = agent.y + 34 + index * cellHeight;
    return (
      `<g><rect x="${agent.x + 12}" y="${y}" width="${agent.width - 24}" height="${cellHeight - 6}" class="schematic-cell" style="${delayed(2000 + index * 320)}" stroke-width="1"></rect>` +
      `<text x="${agent.x + agent.width / 2}" y="${y + (cellHeight - 6) / 2}" dy="0.35em" text-anchor="middle" font-size="${font}">${label}</text></g>`
    );
  });
  return [
    `<svg viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true" class="h-auto w-full overflow-visible ${layout.className}" fill="none">`,
    ...ins.map((d, index) => path(d, "hero-line", 150 + index * 90, 1)),
    ...outs.map((d, index) => path(d, "hero-line", 1100 + index * 120, 1)),
    ...ins.map((d, index) => path(d, "hero-pulse", 900 + index * 130, 3)),
    ...outs.map((d, index) => path(d, "hero-pulse", 2900 + index * 170, 3)),
    ...inputs.map((box, index) => chip(box, layout, index * 80)),
    `<g class="hero-node" style="${popped(450)}">`,
    `<rect x="${agent.x}" y="${agent.y}" width="${agent.width}" height="${agent.height}" class="schematic-agent" stroke-width="1.5"></rect>`,
    `<text x="${agent.x + 12}" y="${agent.y + 24}" font-size="${font}" class="schematic-label">Agent</text>`,
    ...cells,
    `</g>`,
    ...outputs.map((box, index) => chip(box, layout, 1500 + index * 110)),
    `</svg>`,
  ].join("");
}

// Built once as plain markup: React hydrates the wrapper as a single node instead of walking
// about a hundred SVG elements that never change, which keeps phone start-up under budget.
// The labels are fixed strings above, never content, so nothing here needs escaping.
const MARKUP = schematic(WIDE) + schematic(COMPACT);

// Decorative, so it's hidden from assistive technology. The base styles show the finished
// drawing, and the opening run only plays under prefers-reduced-motion: no-preference.
export function HeroVisual() {
  return <div className="schematic" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
