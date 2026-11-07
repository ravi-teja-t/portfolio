import { loadContent } from "@/lib/content/load";

type Props = { className?: string; compact?: boolean };

export function HireButton({ className = "", compact = false }: Props) {
  const { site } = loadContent();
  const size = compact ? "px-1 text-sm min-[360px]:px-1.5 md:px-2" : "px-2";
  return (
    <a
      data-hire
      href={site.upworkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-(--size-target) items-center justify-center rounded-sm bg-accent font-semibold whitespace-nowrap text-on-accent transition-colors duration-200 hover:bg-accent-hover ${size} ${className}`}
    >
      {site.hireLabel}
    </a>
  );
}
