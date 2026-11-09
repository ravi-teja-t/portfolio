import Link from "next/link";
import { getHome } from "@/lib/content/select";
import { HireButton } from "./HireButton";
import { ActiveNav } from "./motion/ActiveNav";
import { ScrollProgress } from "./motion/ScrollProgress";

export function TopBar() {
  const { site, nav } = getHome();
  return (
    <header id="top-bar" className="sticky top-0 z-20 border-b border-ink-line bg-ink text-on-ink">
      <div className="mx-auto flex h-(--size-bar) max-w-content items-center gap-1 px-1.5 md:gap-2 md:px-3">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex min-h-(--size-target) items-center gap-1 font-bold tracking-tight whitespace-nowrap"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="hidden size-2.5 min-[400px]:block">
            <path d="M3 3h18v18H3z" fill="none" stroke="currentColor" strokeWidth={2} />
            <path d="M12 12h9v9h-9z" fill="currentColor" />
          </svg>
          {site.name}
        </Link>

        {nav.length > 0 && (
          <nav aria-label={site.menuLabel} className="ml-auto hidden md:block">
            <ActiveNav links={nav} className="flex items-center gap-1" />
          </nav>
        )}

        {nav.length > 0 && (
          <details className="relative ml-auto md:hidden">
            <summary className="inline-flex min-h-(--size-target) min-w-(--size-target) items-center justify-center px-1 text-sm font-medium">
              {site.menuLabel}
            </summary>
            <nav
              aria-label={site.menuLabel}
              className="absolute top-full right-0 z-30 min-w-20 border border-ink-line bg-ink-raised p-1 shadow-menu"
            >
              <ActiveNav links={nav} className="flex flex-col items-stretch" />
            </nav>
          </details>
        )}

        <HireButton compact className={nav.length > 0 ? "" : "ml-auto"} />
      </div>
      <ScrollProgress />
    </header>
  );
}
