'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/gui/about', label: 'about' },
  { href: '/gui/projects', label: 'projects' },
  { href: '/gui/designs', label: 'designs' },
  { href: '/gui/blog', label: 'blog' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-background">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/gui"
          className="group flex items-baseline gap-2 text-sm font-bold uppercase tracking-widest"
        >
          <span className="text-primary">▸</span>
          <span className="text-foreground">zr</span>
          <span className="hidden text-muted-foreground sm:inline">/ zrosenbauer.com</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs uppercase tracking-widest">
          {navLinks.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
