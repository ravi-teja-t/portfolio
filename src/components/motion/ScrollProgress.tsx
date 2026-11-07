// A CSS scroll-driven animation in globals.css moves this, so it needs no JavaScript. Browsers
// without scroll-driven animations just don't show the line.
export function ScrollProgress() {
  return (
    <div
      data-scroll-progress
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-text"
    />
  );
}
