'use client';

import Link from 'next/link';
import { type KeyboardEvent, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import 'highlight.js/styles/github-dark.css';

import type { PagerState } from './types';

export interface PagerProps {
  state: PagerState;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const SCROLL_STEP = 80;
const PAGE_RATIO = 0.85;

export function Pager({ state, onClose, onNext, onPrev }: PagerProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Steal focus on mount so keyboard events flow here, not the shell input.
  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  // Reset scroll when content changes (e.g., n/p navigation within a collection).
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [state.content]);

  const scroll = (dy: number) => {
    bodyRef.current?.scrollBy({ top: dy, behavior: 'smooth' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if ((e.key === 'n' || e.key === 'N') && onNext) {
      e.preventDefault();
      onNext();
      return;
    }
    if ((e.key === 'p' || e.key === 'P') && onPrev) {
      e.preventDefault();
      onPrev();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      scroll(SCROLL_STEP);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      scroll(-SCROLL_STEP);
      return;
    }
    if (e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      scroll((bodyRef.current?.clientHeight ?? 0) * PAGE_RATIO);
      return;
    }
    if (e.key === 'PageUp') {
      e.preventDefault();
      scroll(-((bodyRef.current?.clientHeight ?? 0) * PAGE_RATIO));
      return;
    }
    if (e.key === 'g' && bodyRef.current) {
      e.preventDefault();
      bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (e.key === 'G' && bodyRef.current) {
      e.preventDefault();
      bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
      return;
    }
  };

  const hasCollection = !!state.collection && state.collection.length > 0;
  const collectionPos =
    hasCollection && state.index !== undefined
      ? `${state.index + 1}/${state.collection!.length}`
      : null;

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="document"
      aria-label={state.title}
      className="terminal-pager"
      onKeyDown={onKeyDown}
    >
      <header className="terminal-pager-header">
        <div className="terminal-pager-title">
          <span className="terminal-pager-bullet">›</span> {state.title}
        </div>
        <div className="terminal-pager-meta">
          {collectionPos ? <span>{collectionPos}</span> : null}
          {state.navigatorId ? <span>· {state.navigatorId}</span> : null}
        </div>
      </header>
      <div ref={bodyRef} className="terminal-pager-body">
        <article className="terminal-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
            skipHtml
          >
            {state.content}
          </ReactMarkdown>
        </article>
      </div>
      <footer className="terminal-pager-footer">
        <span className="terminal-pager-hints">
          <kbd>q</kbd>/<kbd>esc</kbd> quit · <kbd>↑</kbd>/<kbd>↓</kbd> scroll · <kbd>space</kbd>{' '}
          page
          {hasCollection ? (
            <>
              {' '}
              · <kbd>n</kbd>/<kbd>p</kbd> next/prev
            </>
          ) : null}
        </span>
        <Link
          href={state.href}
          className="terminal-pager-source"
          target="_blank"
          rel="noopener noreferrer"
        >
          open in gui ↗
        </Link>
      </footer>
    </div>
  );
}
