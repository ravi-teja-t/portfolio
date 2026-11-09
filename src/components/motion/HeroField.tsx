"use client";

import { useEffect, useRef } from "react";

// Follows the pointer across the hero: lights up the dot grid, draws drafting crosshairs and
// tilts the schematic. It only moves when the visitor does, and does nothing on touch screens
// or with reduced motion, where the plain dot grid stays.
export function HeroField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const hero = field?.parentElement;
    if (!field || !hero) return;
    const canFollow = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
    if (!canFollow) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    function paint() {
      frame = 0;
      if (!field || !hero) return;
      field.style.setProperty("--px", `${x}px`);
      field.style.setProperty("--py", `${y}px`);
      hero.style.setProperty("--nx", (x / hero.clientWidth - 0.5).toFixed(3));
      hero.style.setProperty("--ny", (y / hero.clientHeight - 0.5).toFixed(3));
      if (coordsRef.current) {
        coordsRef.current.textContent = `${String(Math.round(x)).padStart(4, "0")} , ${String(
          Math.round(y),
        ).padStart(4, "0")}`;
      }
    }

    function follow(event: PointerEvent) {
      if (!field || !hero) return;
      const box = hero.getBoundingClientRect();
      x = event.clientX - box.left;
      y = event.clientY - box.top;
      field.dataset.active = "";
      frame ||= requestAnimationFrame(paint);
    }

    function leave() {
      if (!field || !hero) return;
      delete field.dataset.active;
      hero.style.setProperty("--nx", "0");
      hero.style.setProperty("--ny", "0");
    }

    hero.addEventListener("pointermove", follow, { passive: true });
    hero.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", follow);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={fieldRef} aria-hidden className="hero-field">
      <div className="hero-field-lit" />
      <div className="hero-cross-x" />
      <div className="hero-cross-y" />
      <span ref={coordsRef} className="hero-coords" />
    </div>
  );
}
