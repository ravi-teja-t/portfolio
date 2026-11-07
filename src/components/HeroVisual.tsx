import type { CSSProperties } from "react";

const LINES = [
  { d: "M70 70 C150 70 150 180 230 180", delay: 200 },
  { d: "M70 180 H230", delay: 350 },
  { d: "M70 290 C150 290 150 180 230 180", delay: 500 },
  { d: "M330 180 C400 180 400 90 470 90", delay: 1100 },
  { d: "M330 180 H470", delay: 1250 },
  { d: "M330 180 C400 180 400 270 470 270", delay: 1400 },
];

const INPUTS = [70, 180, 290].map((cy, index) => ({ cy, delay: index * 150 }));
const OUTPUTS = [90, 180, 270].map((y, index) => ({ y, delay: 2000 + index * 150 }));

function nodeStyle(delay: number): CSSProperties {
  return {
    "--delay": `${delay}ms`,
    transformBox: "fill-box",
    transformOrigin: "center",
  } as CSSProperties;
}

// Decorative, so it has no text. The base styles show the finished drawing, and the animation
// only runs under prefers-reduced-motion: no-preference.
export function HeroVisual() {
  return (
    <div className="overflow-hidden rounded-lg bg-ink p-2">
      <svg viewBox="0 0 540 360" aria-hidden className="block h-auto w-full" fill="none">
        {LINES.map((line) => (
          <path
            key={line.d}
            d={line.d}
            pathLength={1}
            className="hero-line"
            style={
              { "--delay": `${line.delay}ms`, stroke: "var(--color-ink-line)" } as CSSProperties
            }
            strokeWidth={2}
          />
        ))}
        {INPUTS.map((node) => (
          <circle
            key={node.cy}
            cx={70}
            cy={node.cy}
            r={22}
            className="hero-node"
            style={{
              ...nodeStyle(node.delay),
              fill: "var(--color-ink)",
              stroke: "var(--color-on-ink)",
            }}
            strokeWidth={2}
          />
        ))}
        <g className="hero-node" style={nodeStyle(800)}>
          <rect
            x={230}
            y={130}
            width={100}
            height={100}
            rx={20}
            style={{ fill: "var(--color-on-ink)" }}
          />
          <circle cx={280} cy={180} r={18} style={{ fill: "var(--color-ink)" }} />
        </g>
        {OUTPUTS.map((node) => (
          <rect
            key={node.y}
            x={470}
            y={node.y - 18}
            width={36}
            height={36}
            rx={8}
            className="hero-node"
            style={{
              ...nodeStyle(node.delay),
              fill: "var(--color-ink)",
              stroke: "var(--color-on-ink)",
            }}
            strokeWidth={2}
          />
        ))}
      </svg>
    </div>
  );
}
