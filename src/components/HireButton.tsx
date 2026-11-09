import { loadContent } from "@/lib/content/load";

type Props = { className?: string; compact?: boolean };

export function HireButton({ className = "", compact = false }: Props) {
  const { site } = loadContent();
  const size = compact ? "px-1 text-sm min-[360px]:px-1.5 md:px-2" : "gap-1 px-2";
  return (
    <a
      data-hire
      href={site.upworkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-(--size-target) items-center justify-center bg-accent font-semibold whitespace-nowrap text-on-accent transition-colors duration-200 hover:bg-accent-hover ${size} ${className}`}
    >
      {site.hireLabel}
      {!compact && (
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="hire-arrow size-2 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" />
        </svg>
      )}
    </a>
  );
}
