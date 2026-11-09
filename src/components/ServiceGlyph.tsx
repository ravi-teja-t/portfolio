// Line drawings for the service rows. They're picked by position, so adding a service needs no
// code change, and they draw themselves as the row scrolls into view.
const GLYPHS = [
  // An agent loop: read, act, check, repeat.
  [
    "M60 16a44 44 0 1 1-31 13",
    "M18 18l11 11-1 14",
    "M60 44h24M60 60h24M60 76h24",
    "M36 44h8v8h-8zM36 60h8v8h-8z",
  ],
  // Stacked services.
  ["M60 14l46 24-46 24-46-24z", "M14 60l46 24 46-24", "M14 82l46 24 46-24"],
  // A segmented message passing between two systems, the way HL7 fields are delimited.
  [
    "M8 60h26",
    "M86 60h26",
    "M34 34h52v52H34z",
    "M47 34v52M60 34v52M73 34v52",
    "M8 22h104M8 98h104",
  ],
  // A window with a layout inside it.
  ["M10 18h100v84H10z", "M10 38h100", "M24 54h40v34H24z", "M78 54h18M78 71h18M78 88h18"],
];

export function ServiceGlyph({ index }: { index: number }) {
  const paths = GLYPHS[index % GLYPHS.length];
  return (
    <svg viewBox="0 0 120 120" aria-hidden className="size-full" strokeWidth={1.5} fill="none">
      {paths.map((d) => (
        <path key={d} d={d} pathLength={1} className="draw" />
      ))}
    </svg>
  );
}
