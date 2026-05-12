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

const labelFor = (input: OgInput): string => {
  switch (input.kind) {
    case 'site':
      return '~ zrosenbauer.com';
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

export function template(input: OgInput): ReactElement {
  const title = input.kind === 'site' ? 'zrosenbauer.com' : input.title;
  const description =
    input.kind === 'site'
      ? 'TypeScript, Node, Rust, and a purveyor of all languages.'
      : input.description;

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
        <span>{labelFor(input)}</span>
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
            fontSize: titleFontSize(title),
            lineHeight: 1.05,
            color: COLORS.fg,
          }}
        >
          {title}
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
          {description}
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
}
