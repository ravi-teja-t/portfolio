import type { ReactNode } from "react";

// A CSS scroll-driven animation in globals.css grows the line, so it needs no JavaScript. With
// reduced motion, or in browsers without scroll-driven animations, it shows at full length.
export function TimelineLine({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div aria-hidden className="timeline-rail bg-border" />
      <div data-timeline-line aria-hidden className="timeline-rail bg-text" />
      {children}
    </div>
  );
}
