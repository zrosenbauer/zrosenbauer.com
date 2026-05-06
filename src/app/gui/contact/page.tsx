import { Section } from '@components/site/section';
import Link from 'next/link';

const channels = [
  {
    label: 'email',
    href: 'mailto:zac@joggr.ai',
    handle: 'zac@joggr.ai',
    note: 'best signal — i actually read it',
  },
  {
    label: 'github',
    href: 'https://github.com/zrosenbauer',
    handle: '@zrosenbauer',
    note: 'open issues, PRs welcome',
    external: true,
  },
  {
    label: 'linkedin',
    href: 'https://linkedin.com/in/zacrosenbauer',
    handle: '/in/zacrosenbauer',
    note: 'recruiters: probably not',
    external: true,
  },
  {
    label: 'twitter',
    href: 'https://twitter.com/zrosenbauer',
    handle: '@zrosenbauer',
    note: 'rare — usually retweets',
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <Section first>
        <div className="flex flex-col gap-4">
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
            contact
          </h1>
          <p className="max-w-prose text-base text-muted-foreground md:text-lg">
            Open source, side projects, hot takes welcome. Easiest way to reach me is email.
          </p>
        </div>
      </Section>

      <Section>
        <ul className="divide-y-2 divide-border border-y-2 border-border">
          {channels.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-2 py-4 hover:bg-primary/5"
              >
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="text-base font-bold text-foreground group-hover:text-primary md:text-lg">
                    {c.handle}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground md:text-sm">
                  {c.note}
                  {c.external ? <span className="ml-2 text-muted-foreground/60">↗</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
