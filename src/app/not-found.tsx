import Link from "next/link";
import { HireButton } from "@/components/HireButton";
import { loadContent } from "@/lib/content/load";

export default function NotFound() {
  const { notFound } = loadContent();
  return (
    <section className="mx-auto max-w-content px-2 py-10 md:px-3 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{notFound.heading}</h1>
      <p className="mt-2 text-lg text-muted">{notFound.text}</p>
      <div className="mt-3 flex flex-col gap-1 sm:flex-row">
        <HireButton />
        <Link
          href="/"
          prefetch={false}
          className="inline-flex min-h-(--size-target) items-center justify-center rounded-sm border border-border px-2 font-semibold transition-colors duration-200 hover:bg-surface"
        >
          {notFound.homeLabel}
        </Link>
      </div>
    </section>
  );
}
