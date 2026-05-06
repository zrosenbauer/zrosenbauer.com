'use client';

import { MarioSprite } from '@components/terminal/mario-sprite';
import { useEffect, useState } from 'react';

import './hero-banner.css';

const BANNER_LINES = [
  '███████╗██████╗  ██████╗ ███████╗███████╗███╗   ██╗██████╗  █████╗ ██╗   ██╗███████╗██████╗ ',
  '╚══███╔╝██╔══██╗██╔═══██╗██╔════╝██╔════╝████╗  ██║██╔══██╗██╔══██╗██║   ██║██╔════╝██╔══██╗',
  '  ███╔╝ ██████╔╝██║   ██║███████╗█████╗  ██╔██╗ ██║██████╔╝███████║██║   ██║█████╗  ██████╔╝',
  ' ███╔╝  ██╔══██╗██║   ██║╚════██║██╔══╝  ██║╚██╗██║██╔══██╗██╔══██║██║   ██║██╔══╝  ██╔══██╗',
  '███████╗██║  ██║╚██████╔╝███████║███████╗██║ ╚████║██████╔╝██║  ██║╚██████╔╝███████╗██║  ██║',
  '╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝',
];

const INTRO_DURATION_MS = 3500;

interface HeroBannerProps {
  withMario?: boolean;
  className?: string;
}

export function HeroBanner({ withMario = false, className }: HeroBannerProps) {
  const [introPlaying, setIntroPlaying] = useState(withMario);

  useEffect(() => {
    if (!withMario) return;
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setIntroPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setIntroPlaying(false), INTRO_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [withMario]);

  const stageClass = `hero-stage${withMario && introPlaying ? ' hero-stage--intro' : ''}${
    className ? ` ${className}` : ''
  }`;

  return (
    <div className={stageClass}>
      {introPlaying && withMario ? (
        <div className="hero-mario-rig" aria-hidden="true">
          <div className="hero-mario-bouncer">
            <div className="hero-mario-frame hero-mario-frame--a">
              <MarioSprite frame="a" nesPalette className="hero-mario-svg" />
            </div>
            <div className="hero-mario-frame hero-mario-frame--b">
              <MarioSprite frame="b" nesPalette className="hero-mario-svg" />
            </div>
          </div>
        </div>
      ) : null}
      <pre className="hero-banner rainbow-text" aria-label="zrosenbauer">
        {BANNER_LINES.join('\n')}
      </pre>
    </div>
  );
}
