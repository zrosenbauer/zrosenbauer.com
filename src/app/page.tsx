'use client';

import { HeroBanner } from '@components/site/hero-banner';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import './landing.css';

export default function LandingPage() {
  const [stored, setStored] = useState<'tui' | 'gui' | null>(null);

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
      <p className="landing-tagline">
        co-founder of joggr.ai · typescript · node · rust · purveyor of all languages · pick your interface
      </p>
      <div className="landing-choices">
        <Link
          href="/tui"
          className="landing-choice landing-choice--tui"
          onClick={() => remember('tui')}
          data-recommended={stored === 'tui' ? 'true' : undefined}
        >
          <span className="landing-choice-key">[1]</span>
          <span className="landing-choice-name">tui</span>
          <span className="landing-choice-desc">terminal interface</span>
          <span className="landing-choice-meta">cli · keyboard · old-school</span>
        </Link>
        <Link
          href="/gui"
          className="landing-choice landing-choice--gui"
          onClick={() => remember('gui')}
          data-recommended={stored === 'gui' ? 'true' : undefined}
        >
          <span className="landing-choice-key">[2]</span>
          <span className="landing-choice-name">gui</span>
          <span className="landing-choice-desc">classic site</span>
          <span className="landing-choice-meta">mouse · scroll · designed</span>
        </Link>
      </div>
      <p className="landing-foot">
        {stored ? (
          <>
            last visit: <strong>{stored}</strong> ·{' '}
          </>
        ) : null}
        press <kbd>1</kbd> or <kbd>2</kbd>
      </p>
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
