import type { CSSProperties } from "react";

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

function delayed(delay: number): CSSProperties {
  return { "--delay": `${delay}ms` } as CSSProperties;
}

function popped(delay: number): CSSProperties {
  return { ...delayed(delay), transformBox: "fill-box", transformOrigin: "center" };
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

function Chip({ box, layout, delay }: { box: Box; layout: Layout; delay: number }) {
  const { width, height } = layout.chip;
  return (
    <g className="hero-node" style={popped(delay)}>
      <rect
        x={box.x}
        y={box.y}
        width={width}
        height={height}
        className="schematic-box"
        strokeWidth={1}
      />
      <text
        x={box.x + width / 2}
        y={box.y + height / 2}
        dy="0.35em"
        textAnchor="middle"
        fontSize={layout.font}
      >
        {box.label}
      </text>
    </g>
  );
}

function Schematic({ layout }: { layout: Layout }) {
  const { agent, inputs, outputs, font } = layout;
  const ins = inputs.map((box, index) => inputPath(layout, box, index));
  const outs = outputs.map((box, index) => outputPath(layout, box, index));
  const cellHeight = (agent.height - 44) / CELLS.length;
  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      aria-hidden
      className={`h-auto w-full overflow-visible ${layout.className}`}
      fill="none"
    >
      {ins.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className="hero-line"
          style={delayed(150 + index * 90)}
          strokeWidth={1}
        />
      ))}
      {outs.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className="hero-line"
          style={delayed(1100 + index * 120)}
          strokeWidth={1}
        />
      ))}
      {ins.map((d, index) => (
        <path
          key={`pulse-${d}`}
          d={d}
          pathLength={1}
          className="hero-pulse"
          style={delayed(900 + index * 130)}
          strokeWidth={3}
        />
      ))}
      {outs.map((d, index) => (
        <path
          key={`pulse-${d}`}
          d={d}
          pathLength={1}
          className="hero-pulse"
          style={delayed(2900 + index * 170)}
          strokeWidth={3}
        />
      ))}
      {inputs.map((box, index) => (
        <Chip key={box.label} box={box} layout={layout} delay={index * 80} />
      ))}
      <g className="hero-node" style={popped(450)}>
        <rect
          x={agent.x}
          y={agent.y}
          width={agent.width}
          height={agent.height}
          className="schematic-agent"
          strokeWidth={1.5}
        />
        <text x={agent.x + 12} y={agent.y + 24} fontSize={font} className="schematic-label">
          Agent
        </text>
        {CELLS.map((label, index) => (
          <g key={label}>
            <rect
              x={agent.x + 12}
              y={agent.y + 34 + index * cellHeight}
              width={agent.width - 24}
              height={cellHeight - 6}
              className="schematic-cell"
              style={delayed(2000 + index * 320)}
              strokeWidth={1}
            />
            <text
              x={agent.x + agent.width / 2}
              y={agent.y + 34 + index * cellHeight + (cellHeight - 6) / 2}
              dy="0.35em"
              textAnchor="middle"
              fontSize={font}
            >
              {label}
            </text>
          </g>
        ))}
      </g>
      {outputs.map((box, index) => (
        <Chip key={box.label} box={box} layout={layout} delay={1500 + index * 110} />
      ))}
    </svg>
  );
}

// Decorative, so it's hidden from assistive technology. The base styles show the finished
// drawing, and the opening run only plays under prefers-reduced-motion: no-preference.
export function HeroVisual() {
  return (
    <div className="schematic">
      <Schematic layout={WIDE} />
      <Schematic layout={COMPACT} />
    </div>
  );
}
