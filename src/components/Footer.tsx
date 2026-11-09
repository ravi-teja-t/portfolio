import Link from "next/link";
import { getHome } from "@/lib/content/select";

export function Footer() {
  const { site, nav } = getHome();
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="overflow-clip bg-ink text-on-ink">
      <div className="mx-auto flex max-w-content flex-col gap-2 border-t border-ink-line px-2 py-3 md:flex-row md:items-center md:justify-between md:px-3">
        <div className="text-sm text-on-ink-muted">
          <p className="font-semibold text-on-ink">
            {site.name} · {year}
          </p>
          <p>{site.footerLine}</p>
        </div>
        {nav.length > 0 && (
          <nav aria-label={site.name}>
            <ul className="-ml-1 flex gap-1">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="nav-link inline-flex min-h-(--size-target) min-w-(--size-target) items-center justify-center px-1 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <p
        aria-hidden
        className="type-display text-center text-wordmark whitespace-nowrap text-ink-line select-none"
      >
        {site.name}
      </p>
    </footer>
  );
}
