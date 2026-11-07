"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";

type NavLink = { label: string; href: string };

function closeMenu(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

export function ActiveNav({ links, className }: { links: NavLink[]; className?: string }) {
  const [current, setCurrent] = useState<string>();

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.split("#")[1] ?? ""))
      .filter((section) => section !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.find((entry) => entry.isIntersecting);
        if (onScreen) setCurrent(onScreen.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            prefetch={false}
            onClick={closeMenu}
            aria-current={link.href.endsWith(`#${current}`) ? "true" : undefined}
            className="nav-link inline-flex min-h-(--size-target) min-w-(--size-target) items-center justify-center px-1 text-sm font-medium"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
