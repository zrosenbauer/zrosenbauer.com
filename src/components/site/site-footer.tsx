'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const externalLinks = [
  { href: 'https://github.com/zrosenbauer', label: 'github' },
  { href: 'https://linkedin.com/in/zacrosenbauer', label: 'linkedin' },
  { href: 'mailto:me@zrosenbauer.com', label: 'email' },
];

const tuiHrefForPath = (pathname: string | null): string => {
  if (!pathname) {
    return '/tui';
  }
  if (pathname === '/gui/about') {
    return '/tui/about';
  }
  if (pathname === '/gui/contact') {
    return '/tui/contact';
  }

  const blogSlug = pathname.match(/^\/gui\/blog\/posts\/([^/]+)$/)?.[1];
  if (blogSlug) {
    return `/tui/blog/${blogSlug}`;
  }

  const designSlug = pathname.match(/^\/gui\/designs\/([^/]+)$/)?.[1];
  if (designSlug) {
    return `/tui/designs/${designSlug}`;
  }

  return '/tui';
};

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const tuiHref = tuiHrefForPath(pathname);

  return (
    <footer className="border-t-2 border-border">
      <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center">
        <div className="flex items-baseline gap-2 text-xs uppercase tracking-widest">
          <span className="text-primary">▸</span>
          <span className="text-muted-foreground">© {year} zac rosenbauer</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest">
          <Link
            href="/llms.txt"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            llms.txt
          </Link>
          <span className="text-border">/</span>
          {externalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label} ↗
            </Link>
          ))}
        </div>
        <Link
          href={tuiHref}
          className="text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-accent"
        >
          {tuiHref === '/tui' ? 'switch to tui →' : 'view in tui →'}
        </Link>
      </div>
    </footer>
  );
}
