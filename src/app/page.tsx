'use client';

import { HeroBanner } from '@components/site/hero-banner';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import './landing.css';

const BOOT_LINES = [
  '[ ok ]  loaded ascii banner',
  '[ ok ]  mounted routes (/tui · /gui)',
  '[ ok ]  checked session preference',
  '[ ok ]  ready',
];

const formatBootTime = (d: Date): string =>
  `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)} UTC`;

export default function LandingPage() {
  const [stored, setStored] = useState<'tui' | 'gui' | null>(null);
  const [bootedAt] = useState(() => new Date());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = window.localStorage.getItem('ui-preference');
    if (v === 'tui' || v === 'gui') setStored(v);
  }, []);

  const remember = (choice: 'tui' | 'gui') => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('ui-preference', choice);
  };

  return (
    <main className="landing">
      <HeroBanner />
      <div className="landing-inner">
        <pre className="landing-meta">
          {`zrosenbauer.com · v1.0.0 · boot ${formatBootTime(bootedAt)}
typescript · node · rust · purveyor of all languages`}
        </pre>
        <pre className="landing-bootlog">{BOOT_LINES.join('\n')}</pre>
        <p className="landing-prompt">&gt; select interface:</p>
        <ul className="landing-menu">
          <li>
            <Link
              href="/tui"
              className="landing-menu-item"
              onClick={() => remember('tui')}
              data-recommended={stored === 'tui' ? 'true' : undefined}
            >
              <span className="landing-menu-key">[1]</span>
              <span className="landing-menu-name">tui</span>
              <span className="landing-menu-desc">terminal interface</span>
              <span className="landing-menu-meta">cli · keyboard · old-school</span>
            </Link>
          </li>
          <li>
            <Link
              href="/gui"
              className="landing-menu-item"
              onClick={() => remember('gui')}
              data-recommended={stored === 'gui' ? 'true' : undefined}
            >
              <span className="landing-menu-key">[2]</span>
              <span className="landing-menu-name">gui</span>
              <span className="landing-menu-desc">graphical interface</span>
              <span className="landing-menu-meta">mouse · scroll · designed</span>
            </Link>
          </li>
        </ul>
        <p className="landing-foot">
          press <kbd>1</kbd> or <kbd>2</kbd>
          {stored ? (
            <>
              {' '}
              · last session: <strong>{stored}</strong>
            </>
          ) : null}
        </p>
        <p className="landing-cursor">
          $ <span className="landing-blink">█</span>
        </p>
      </div>
      <KeyHandler />
    </main>
  );
}

function KeyHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === '1') {
        window.localStorage.setItem('ui-preference', 'tui');
        window.location.assign('/tui');
      } else if (e.key === '2') {
        window.localStorage.setItem('ui-preference', 'gui');
        window.location.assign('/gui');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return null;
}
