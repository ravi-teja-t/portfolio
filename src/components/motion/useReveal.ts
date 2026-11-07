"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Content starts visible, so it stays visible if scripts are off, fail or arrive late.
// Only once scripts are running does an element outside the viewport get hidden, ready to
// fade in when it enters. Nothing here ever puts opacity:0 in the built HTML.
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [reduceMotion]);

  return { ref, hidden: armed && !inView };
}
