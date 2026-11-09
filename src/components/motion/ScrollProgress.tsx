// A CSS scroll-driven animation in globals.css moves this, so it needs no JavaScript. Browsers
// without scroll-driven animations just don't show the line.
export function ScrollProgress() {
  return (
    <div
      data-scroll-progress
      aria-hidden
      className="absolute inset-x-0 -bottom-px h-px origin-left bg-on-ink"
    />
  );
}
