import Link from "next/link";
import { HireButton } from "@/components/HireButton";
import { loadContent } from "@/lib/content/load";

export default function NotFound() {
  const { notFound } = loadContent();
  return (
    <section className="overflow-clip bg-ink text-on-ink">
      <div className="mx-auto max-w-content px-2 py-8 md:px-3 md:py-14">
        <p
          aria-hidden
          data-decorative
          className="type-display text-wordmark text-ink-line select-none"
        >
          404
        </p>
        <h1 className="type-display mt-4 text-heading">{notFound.heading}</h1>
        <p className="mt-2 text-lg text-on-ink-muted">{notFound.text}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          <HireButton />
          <Link href="/" prefetch={false} className="btn-ghost">
            {notFound.homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
