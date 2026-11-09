"use client";

import { LazyMotion, m } from "framer-motion";
import type { ReactNode } from "react";
import { loadFeatures } from "./loadFeatures";
import { useReveal } from "./useReveal";

export function Reveal({ children }: { children: ReactNode }) {
  const { ref, hidden } = useReveal();
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        ref={ref}
        data-reveal
        initial={false}
        animate={hidden ? { opacity: 0, y: 28 } : { opacity: 1, y: 0 }}
        transition={hidden ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
