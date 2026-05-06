import * as React from 'react';

interface SectionProps {
  /** `[NN]` index prefix. When provided alongside a label, the section renders */
  /** with the home-style 2-column rail. Omit on sub-pages for a full-width body.*/
  index?: string;
  label?: string;
  id?: string;
  first?: boolean;
  /** Remove padding so content fills the rail edge-to-edge (used for banners). */
  bleed?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Section({
  index,
  label,
  id,
  first,
  bleed,
  className,
  children,
}: SectionProps) {
  const padding = bleed ? '' : 'px-6 py-8 md:py-12';
  const sectionClass = `${padding} ${first ? '' : 'border-t-2 border-border'}${
    className ? ` ${className}` : ''
  }`;

  // Home-style: index + label in a left rail, content on the right.
  if (index && label) {
    return (
      <section id={id} className={sectionClass}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-12">
          <div className="border-b-2 border-border pb-4 md:col-span-3 md:border-b-0 md:border-r-2 md:pb-0 md:pr-8">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span className="text-primary">[{index}]</span>
              <span className="mx-2 text-border">/</span>
              {label}
            </div>
          </div>
          <div className="md:col-span-9">{children}</div>
        </div>
      </section>
    );
  }

  // Sub-page style: full-width content. Optional small label header.
  return (
    <section id={id} className={sectionClass}>
      {label ? (
        <div className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      ) : null}
      {children}
    </section>
  );
}

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The bordered column wrapper. Place all gui-route content inside one of these.
 * Designed to sit between SiteHeader and SiteFooter (which extend the side rails).
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={`mx-auto w-full max-w-5xl border-x-2 border-border${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </main>
  );
}
