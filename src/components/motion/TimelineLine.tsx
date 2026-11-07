import type { ReactNode } from "react";

const LINE = "absolute top-0 bottom-0 left-2.5 w-0.5 origin-top";

// A CSS scroll-driven animation in globals.css grows the line, so it needs no JavaScript. With
// reduced motion, or in browsers without scroll-driven animations, it shows at full length.
export function TimelineLine({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div aria-hidden className={`${LINE} bg-border`} />
      <div data-timeline-line aria-hidden className={`${LINE} bg-text`} />
      {children}
    </div>
  );
}
