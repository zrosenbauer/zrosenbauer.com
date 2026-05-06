import { SiteFooter } from '@components/site/site-footer';
import { SiteHeader } from '@components/site/site-header';
import type { ReactNode } from 'react';

/**
 * Single bordered column for the entire gui — header, content, and footer
 * live inside one rail (`max-w-5xl` + `border-x-2`) so the side rails are
 * continuous top-to-bottom.
 *
 * Sticky-footer pattern via `min-h-dvh` (dynamic viewport height — accurate
 * on mobile Safari with the address bar) + `flex-1` on `<main>`.
 *
 * No `bg-background` is set anywhere here on purpose — the `<body>` element
 * already provides the background. Stacking extra `bg-background` layers
 * caused subtle rendering differences between the rail interior and the
 * gutters.
 */
export default function GuiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col border-x-2 border-border font-mono text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
