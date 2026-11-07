"use client";

import { LazyMotion, m } from "framer-motion";
import { Children, type ReactNode } from "react";
import { loadFeatures } from "./loadFeatures";
import { useReveal } from "./useReveal";

const STEP_SECONDS = 0.06;

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, hidden } = useReveal();
  return (
    <LazyMotion features={loadFeatures} strict>
      <div ref={ref} className={className}>
        {Children.toArray(children).map((child, index) => (
          <m.div
            key={index}
            data-reveal
            initial={false}
            animate={hidden ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
            transition={
              hidden
                ? { duration: 0 }
                : { duration: 0.4, ease: "easeOut", delay: index * STEP_SECONDS }
            }
          >
            {child}
          </m.div>
        ))}
      </div>
    </LazyMotion>
  );
}
