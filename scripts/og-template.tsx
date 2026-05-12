import type { ReactElement } from 'react';

const COLORS = {
  bg: '#0a0c0b',
  fg: '#eef4ee',
  primary: '#5eed9b',
  accent: '#e9c46a',
  border: '#2a2e2c',
  muted: '#9aa39a',
};

const PIXEL_FONT = 'GeistPixel';
const BODY_FONT = 'CalSans';

export type OgInput =
  | { kind: 'site' }
  | {
      kind: 'blog';
      title: string;
      description: string;
      publishedAt: string;
      readTime: number;
      tags?: readonly string[];
    }
  | {
      kind: 'project';
      title: string;
      description: string;
      role: 'author' | 'contributor';
      deprecated: boolean;
    }
  | { kind: 'design'; title: string; description: string }
  | { kind: 'page'; title: string; description: string };

const labelFor = (kind: Exclude<OgInput['kind'], 'site'>): string => {
  switch (kind) {
    case 'blog':
      return '~ blog';
    case 'project':
      return '~ project';
    case 'design':
      return '~ design';
    case 'page':
      return '~ page';
  }
};

// Pixel fonts run wider than proportional ones; tune sizes per length so titles
// fit the 1200px canvas.
const pixelTitleFontSize = (title: string): number => {
  if (title.length > 50) return 44;
  if (title.length > 30) return 56;
  return 72;
};

const siteTemplate = (): ReactElement => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: 56,
        fontFamily: BODY_FONT,
        color: COLORS.fg,
        borderTop: `10px solid ${COLORS.primary}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 22,
          color: COLORS.muted,
          letterSpacing: '0.08em',
        }}
      >
        <span style={{ color: COLORS.primary }}>●</span>
        <span style={{ color: COLORS.primary }}>●</span>
        <span style={{ color: COLORS.primary }}>●</span>
        <span style={{ marginLeft: 16 }}>zrosenbauer@home: ~</span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 32,
          marginTop: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            lineHeight: 1.0,
            color: COLORS.fg,
            fontFamily: PIXEL_FONT,
            fontWeight: 700,
            WebkitTextStroke: `3px ${COLORS.fg}`,
          }}
        >
          whoami
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 32,
            lineHeight: 1.4,
            color: COLORS.muted,
            maxWidth: '92%',
          }}
        >
          Zac Rosenbauer - blog, open-source projects, and notes on TypeScript, Node, and Rust.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 32,
            color: COLORS.muted,
            marginTop: 8,
          }}
        >
          <span style={{ color: COLORS.primary }}>$</span>
          <span
            style={{
              width: 18,
              height: 36,
              backgroundColor: COLORS.primary,
              display: 'flex',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 24,
          borderTop: `2px solid ${COLORS.border}`,
          paddingTop: 20,
        }}
      >
        <span style={{ color: COLORS.primary }}>zrosenbauer.com</span>
        <span style={{ color: COLORS.accent }}>~ home</span>
      </div>
    </div>
  );
};

const cardTemplate = (input: Exclude<OgInput, { kind: 'site' }>): ReactElement => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: 56,
        fontFamily: BODY_FONT,
        color: COLORS.fg,
        borderTop: `10px solid ${COLORS.primary}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 24,
          color: COLORS.primary,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        <span>{labelFor(input.kind)}</span>
        {input.kind === 'blog' && input.tags && input.tags.length > 0 ? (
          <span style={{ color: COLORS.muted }}>· {input.tags.join(' · ')}</span>
        ) : null}
        {input.kind === 'project' ? (
          <span style={{ color: COLORS.muted }}>
            · {input.role}
            {input.deprecated ? ' · deprecated' : ''}
          </span>
        ) : null}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: pixelTitleFontSize(input.title),
            lineHeight: 1.1,
            color: COLORS.fg,
            fontFamily: PIXEL_FONT,
            fontWeight: 700,
            WebkitTextStroke: `2px ${COLORS.fg}`,
          }}
        >
          {input.title}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            lineHeight: 1.4,
            color: COLORS.muted,
            maxWidth: '92%',
          }}
        >
          {input.description}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 26,
          borderTop: `2px solid ${COLORS.border}`,
          paddingTop: 24,
        }}
      >
        <span style={{ color: COLORS.primary }}>zrosenbauer.com</span>
        {input.kind === 'blog' ? (
          <span style={{ color: COLORS.accent }}>
            {new Date(input.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            · {input.readTime} min read
          </span>
        ) : null}
      </div>
    </div>
  );
};

export function template(input: OgInput): ReactElement {
  if (input.kind === 'site') return siteTemplate();
  return cardTemplate(input);
}
