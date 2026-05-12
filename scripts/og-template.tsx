import type { ReactElement } from 'react';

const COLORS = {
  bg: '#0a0c0b',
  fg: '#eef4ee',
  primary: '#5eed9b',
  accent: '#e9c46a',
  border: '#2a2e2c',
  muted: '#9aa39a',
};

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

const titleFontSize = (title: string): number => {
  if (title.length > 80) return 60;
  if (title.length > 50) return 72;
  return 88;
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
        fontFamily: 'CalSans',
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
          gap: 22,
          marginTop: 12,
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: COLORS.muted }}>
          <span style={{ color: COLORS.primary }}>$&nbsp;</span>
          <span>whoami</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            lineHeight: 1.0,
            color: COLORS.fg,
            letterSpacing: '-0.02em',
          }}
        >
          zrosenbauer
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: COLORS.muted, marginTop: 16 }}>
          <span style={{ color: COLORS.primary }}>$&nbsp;</span>
          <span>cat profile.txt</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: COLORS.fg,
            lineHeight: 1.35,
          }}
        >
          typescript · node · rust · purveyor of all languages
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 30,
            color: COLORS.muted,
            marginTop: 4,
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
        fontFamily: 'CalSans',
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
          gap: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: titleFontSize(input.title),
            lineHeight: 1.05,
            color: COLORS.fg,
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
