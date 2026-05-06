'use client';

import Link from 'next/link';
import type * as React from 'react';
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { COMMAND_NAMES, completeCommand, runCommand } from './command-registry';
import { HOME_PATH, prettyPath, resolveNode } from './fs';
import { MarioSprite } from './mario-sprite';
import { Pager } from './pager';
import { pagerSlugForState, resolveTuiPath } from './navigators';
import {
  type CommandContext,
  type CommandOutput,
  type PagerState,
  type SelectionMode,
  type SelectPromptItem,
  TERMINAL_THEMES,
  type TerminalTheme,
} from './types';

import './terminal-shell.css';

const INTRO_DURATION_MS = 3500;
const TUI_BASE_PATH = '/tui';

const fsLookup = {
  resolve: (path: string) => {
    const node = resolveNode(path);
    if (!node || node.kind !== 'file') return null;
    return { title: node.title, content: node.content, href: node.href };
  },
};

const buildPagerStateFromPath = (pathname: string): PagerState | null => {
  const view = resolveTuiPath(pathname, fsLookup);
  if (!view) return null;
  return {
    title: view.title,
    content: view.content,
    href: view.href,
    navigatorId: view.navigatorId,
    index: view.index,
    collection: view.collection,
  };
};

const STORAGE_KEY = 'zr-terminal:v1';
const HISTORY_LIMIT = 200;

interface StoredState {
  theme: TerminalTheme;
  cwd: string;
  history: string[];
}

const DEFAULT_STATE: StoredState = {
  theme: 'matrix',
  cwd: HOME_PATH,
  history: [],
};

interface Entry {
  id: number;
  cwd: string;
  input: string;
  output: CommandOutput;
  /** When set, render this label instead of the regular cwd prompt (used for select-mode entries). */
  promptOverride?: string;
}

const BANNER_ART = [
  '███████╗██████╗  ██████╗ ███████╗███████╗███╗   ██╗██████╗  █████╗ ██╗   ██╗███████╗██████╗ ',
  '╚══███╔╝██╔══██╗██╔═══██╗██╔════╝██╔════╝████╗  ██║██╔══██╗██╔══██╗██║   ██║██╔════╝██╔══██╗',
  '  ███╔╝ ██████╔╝██║   ██║███████╗█████╗  ██╔██╗ ██║██████╔╝███████║██║   ██║█████╗  ██████╔╝',
  ' ███╔╝  ██╔══██╗██║   ██║╚════██║██╔══╝  ██║╚██╗██║██╔══██╗██╔══██║██║   ██║██╔══╝  ██╔══██╗',
  '███████╗██║  ██║╚██████╔╝███████║███████╗██║ ╚████║██████╔╝██║  ██║╚██████╔╝███████╗██║  ██║',
  '╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝',
].join('\n');


const isStoredState = (value: unknown): value is StoredState => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.theme === 'string' &&
    (TERMINAL_THEMES as ReadonlyArray<string>).includes(v.theme) &&
    typeof v.cwd === 'string' &&
    Array.isArray(v.history)
  );
};

const loadState = (): StoredState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredState(parsed)) return DEFAULT_STATE;
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
};

const persistState = (state: StoredState): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

const renderOutput = (output: CommandOutput): React.ReactElement | null => {
  if (output.kind === 'empty' || output.kind === 'clear-screen') return null;
  if (output.kind === 'error') {
    return <div className="terminal-error">{output.message}</div>;
  }
  if (output.kind === 'text') {
    return <pre className="terminal-text">{output.lines.join('\n')}</pre>;
  }
  if (output.kind === 'links') {
    return (
      <div className="terminal-links">
        {output.heading ? <div className="terminal-links-heading">{output.heading}</div> : null}
        <ul>
          {output.items.map((item) => (
            <li key={`${item.label}-${item.href}`}>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </a>
              {item.description ? (
                <span className="terminal-link-desc"> — {item.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (output.kind === 'select-prompt') {
    const padTo = String(output.items.length).length;
    return (
      <div className="terminal-select">
        {output.heading ? <div className="terminal-select-heading">{output.heading}</div> : null}
        <ul className="terminal-select-list">
          {output.items.map((item, i) => (
            <li key={item.slug} className="terminal-select-item">
              <span className="terminal-select-num">{String(i + 1).padStart(padTo, ' ')}.</span>{' '}
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="terminal-select-link"
              >
                {item.label}
              </a>
              {item.description ? (
                <span className="terminal-link-desc"> — {item.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
        {output.hint ? <div className="terminal-select-hint">{output.hint}</div> : null}
      </div>
    );
  }
  return (
    <div className="terminal-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {output.content}
      </ReactMarkdown>
    </div>
  );
};

const Prompt = ({ cwd }: { cwd: string }) => (
  <span className="terminal-prompt-text">
    <span className="terminal-prompt-user">zac</span>
    <span className="terminal-prompt-at">@</span>
    <span className="terminal-prompt-host">zrosenbauer.com</span>
    <span className="terminal-prompt-sep">:</span>
    <span className="terminal-prompt-cwd">{prettyPath(cwd)}</span>
    <span className="terminal-prompt-sigil">$</span>{' '}
  </span>
);

const SelectPrompt = ({ label, count }: { label: string; count: number }) => (
  <span className="terminal-prompt-text terminal-prompt-select">
    <span className="terminal-prompt-user">{label}</span>
    <span className="terminal-prompt-sep"> [1-{count}]</span>
    <span className="terminal-prompt-sigil">›</span>{' '}
  </span>
);

const navigateItem = (item: SelectPromptItem): void => {
  if (typeof window === 'undefined') return;
  if (item.external) {
    window.open(item.href, '_blank', 'noopener,noreferrer');
  } else {
    window.location.assign(item.href);
  }
};

const findInSelection = (
  items: ReadonlyArray<SelectPromptItem>,
  query: string
): SelectPromptItem | null => {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const idx = Number.parseInt(trimmed, 10);
  if (!Number.isNaN(idx) && idx >= 1 && idx <= items.length) {
    return items[idx - 1] ?? null;
  }
  const exact = items.find((i) => i.slug === trimmed);
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  return (
    items.find(
      (i) => i.slug.toLowerCase().includes(lower) || i.label.toLowerCase().includes(lower)
    ) ?? null
  );
};

const isCancelKeyword = (input: string): boolean => {
  const v = input.trim().toLowerCase();
  return v === 'q' || v === 'quit' || v === 'cancel' || v === 'esc' || v === 'exit';
};

interface TerminalShellProps {
  /**
   * Path used to seed the pager state synchronously during the first render.
   * Pass this from `/tui/[...slug]/page.tsx` so deep-linked URLs hydrate
   * already showing the pager — no shell-flash before the pager opens.
   */
  initialPath?: string;
}

export function TerminalShell({ initialPath }: TerminalShellProps = {}) {
  const [hydrated, setHydrated] = useState(false);
  const [theme, setThemeState] = useState<TerminalTheme>(DEFAULT_STATE.theme);
  const [cwd, setCwdState] = useState<string>(DEFAULT_STATE.cwd);
  const [history, setHistory] = useState<string[]>(DEFAULT_STATE.history);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [introPlaying, setIntroPlaying] = useState(true);
  const [selectionMode, setSelectionMode] = useState<SelectionMode | null>(null);
  const [pagerMode, setPagerMode] = useState<PagerState | null>(() =>
    initialPath ? buildPagerStateFromPath(initialPath) : null
  );

  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage after mount.
  useEffect(() => {
    const state = loadState();
    setThemeState(state.theme);
    setCwdState(state.cwd);
    setHistory(state.history);
    setHydrated(true);
  }, []);

  // Listen for browser back/forward and re-resolve the URL → pager state.
  // (The initial pager state was already seeded synchronously from `initialPath`
  // in the useState initializer above, so there's no shell-then-pager flash.)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => {
      setPagerMode(buildPagerStateFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  // Run the Mario intro once on mount, then collapse the reserved padding.
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setIntroPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setIntroPlaying(false), INTRO_DURATION_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Persist on changes after hydration.
  useEffect(() => {
    if (!hydrated) return;
    persistState({ theme, cwd, history });
  }, [hydrated, theme, cwd, history]);

  // Auto-scroll on new entries.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [entries.length]);

  // Persist UI preference for the / redirect.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('ui-preference', 'tui');
  }, []);

  const ctx: CommandContext = useMemo(
    () => ({
      cwd,
      setCwd: setCwdState,
      setTheme: setThemeState,
      clearScreen: () => setEntries([]),
      history,
      commandNames: COMMAND_NAMES,
    }),
    [cwd, history]
  );

  const recordHistory = (cmd: string) => {
    setHistory((prev) => {
      const next = [...prev, cmd];
      return next.length > HISTORY_LIMIT ? next.slice(-HISTORY_LIMIT) : next;
    });
    setHistoryCursor(null);
  };

  const submit = (raw: string) => {
    const trimmed = raw.trim();

    // ----- selection mode -----
    if (selectionMode) {
      if (!trimmed) {
        return;
      }
      if (isCancelKeyword(trimmed)) {
        setEntries((prev) => [
          ...prev,
          {
            id: idRef.current++,
            cwd,
            input: trimmed,
            output: { kind: 'text', lines: ['cancelled'] },
            promptOverride: selectionMode.promptLabel,
          },
        ]);
        setSelectionMode(null);
        recordHistory(trimmed);
        return;
      }
      const item = findInSelection(selectionMode.items, trimmed);
      if (!item) {
        setEntries((prev) => [
          ...prev,
          {
            id: idRef.current++,
            cwd,
            input: trimmed,
            output: {
              kind: 'error',
              message: `no match. type a number 1-${selectionMode.items.length}, a slug, or 'q' to cancel.`,
            },
            promptOverride: selectionMode.promptLabel,
          },
        ]);
        recordHistory(trimmed);
        return;
      }
      setEntries((prev) => [
        ...prev,
        {
          id: idRef.current++,
          cwd,
          input: trimmed,
          output: { kind: 'text', lines: [`opening ${item.label}…`] },
          promptOverride: selectionMode.promptLabel,
        },
      ]);
      const items = selectionMode.items;
      const promptId = selectionMode.navigatorId;
      setSelectionMode(null);
      recordHistory(trimmed);
      // Internal viewable item → open the pager. External / non-viewable → navigate.
      if (item.viewable && item.getContent) {
        const index = items.findIndex((i) => i.slug === item.slug);
        setPagerMode({
          title: item.label,
          content: item.getContent(),
          href: item.href,
          navigatorId: promptId,
          index: index >= 0 ? index : undefined,
          collection: index >= 0 ? items : undefined,
        });
      } else {
        navigateItem(item);
      }
      return;
    }

    // ----- normal command mode -----
    if (!trimmed) {
      setEntries((prev) => [
        ...prev,
        { id: idRef.current++, cwd, input: '', output: { kind: 'empty' } },
      ]);
      return;
    }
    const output = runCommand(trimmed, ctx);
    if (output.kind === 'clear-screen') {
      setEntries([]);
    } else if (output.kind === 'view') {
      setEntries((prev) => [
        ...prev,
        {
          id: idRef.current++,
          cwd,
          input: trimmed,
          output: { kind: 'text', lines: [`opening ${output.title}…`] },
        },
      ]);
      setPagerMode({
        title: output.title,
        content: output.content,
        href: output.href,
        navigatorId: output.navigatorId,
        index: output.index,
        collection: output.collection,
      });
    } else {
      setEntries((prev) => [...prev, { id: idRef.current++, cwd, input: trimmed, output }]);
    }
    if (output.kind === 'select-prompt') {
      setSelectionMode({
        navigatorId: output.navigatorId,
        promptLabel: output.promptLabel,
        items: output.items,
      });
    }
    recordHistory(trimmed);
  };

  // Sync URL whenever pager state changes meaningfully (after first mount).
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    const desired = pagerMode
      ? `${TUI_BASE_PATH}/${pagerSlugForState(pagerMode)}`
      : TUI_BASE_PATH;
    if (window.location.pathname !== desired) {
      window.history.pushState({}, '', desired);
    }
  }, [hydrated, pagerMode]);

  const closePager = () => {
    setPagerMode(null);
    // Restore focus to the shell input on the next tick (after the pager unmounts).
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const movePager = (delta: number) => {
    if (!pagerMode || !pagerMode.collection || pagerMode.index === undefined) return;
    const newIndex = pagerMode.index + delta;
    if (newIndex < 0 || newIndex >= pagerMode.collection.length) return;
    const next = pagerMode.collection[newIndex];
    if (!next.viewable || !next.getContent) return;
    setPagerMode({
      ...pagerMode,
      title: next.label,
      content: next.getContent(),
      href: next.href,
      index: newIndex,
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(input);
    setInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && selectionMode) {
      e.preventDefault();
      setEntries((prev) => [
        ...prev,
        {
          id: idRef.current++,
          cwd,
          input: '',
          output: { kind: 'text', lines: ['cancelled'] },
          promptOverride: selectionMode.promptLabel,
        },
      ]);
      setSelectionMode(null);
      setInput('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyCursor === null ? history.length - 1 : Math.max(0, historyCursor - 1);
      setHistoryCursor(next);
      setInput(history[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyCursor === null) return;
      const next = historyCursor + 1;
      if (next >= history.length) {
        setHistoryCursor(null);
        setInput('');
      } else {
        setHistoryCursor(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const tokens = input.split(/\s+/);
      if (tokens.length <= 1) {
        const matches = completeCommand(tokens[0] ?? '');
        if (matches.length === 1) {
          setInput(`${matches[0]} `);
        } else if (matches.length > 1) {
          setEntries((prev) => [
            ...prev,
            {
              id: idRef.current++,
              cwd,
              input,
              output: { kind: 'text', lines: [matches.join('  ')] },
            },
          ]);
        }
      }
      return;
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setEntries([]);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setHistoryCursor(null);
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className={`terminal terminal-${theme}`}
      data-theme={theme}
      onClick={pagerMode ? undefined : focusInput}
    >
      <div
        className={`terminal-window${pagerMode ? ' terminal-window--pager-active' : ''}`}
        ref={scrollRef}
      >
        {pagerMode ? null : (
        <header className="terminal-banner">
          <div
            className={`terminal-banner-stage${introPlaying ? ' terminal-banner-stage--intro' : ''}`}
          >
            {introPlaying ? (
              <div className="terminal-banner-mario-rig" aria-hidden="true">
                <div className="terminal-banner-mario-bouncer">
                  <div className="terminal-banner-mario-frame terminal-banner-mario-frame--a">
                    <MarioSprite frame="a" className="terminal-banner-mario-svg" />
                  </div>
                  <div className="terminal-banner-mario-frame terminal-banner-mario-frame--b">
                    <MarioSprite frame="b" className="terminal-banner-mario-svg" />
                  </div>
                </div>
              </div>
            ) : null}
            <pre className="terminal-banner-art">{BANNER_ART}</pre>
          </div>
          <div className="terminal-banner-tagline">
            <span>
              <strong>zrosenbauer.com</strong> — co-founder of joggr.ai · typescript · node · rust · purveyor of all languages
            </span>
            <span>
              type <strong>help</strong> to get started · <strong>exit</strong> to switch to the
              classic site
            </span>
          </div>
        </header>
        )}
        {pagerMode ? (
          <Pager
            state={pagerMode}
            onClose={closePager}
            onNext={
              pagerMode.collection &&
              pagerMode.index !== undefined &&
              pagerMode.index < pagerMode.collection.length - 1
                ? () => movePager(1)
                : undefined
            }
            onPrev={
              pagerMode.collection && pagerMode.index !== undefined && pagerMode.index > 0
                ? () => movePager(-1)
                : undefined
            }
          />
        ) : null}
        {pagerMode
          ? null
          : entries.map((entry) => (
          <div key={entry.id} className="terminal-entry">
            <div className="terminal-entry-line">
              {entry.promptOverride ? (
                <span className="terminal-prompt-text terminal-prompt-select">
                  <span className="terminal-prompt-user">{entry.promptOverride}</span>
                  <span className="terminal-prompt-sigil">›</span>{' '}
                </span>
              ) : (
                <Prompt cwd={entry.cwd} />
              )}
              <span className="terminal-entry-input">{entry.input}</span>
            </div>
            {renderOutput(entry.output)}
          </div>
            ))}
        {pagerMode ? null : (
        <form onSubmit={onSubmit} className="terminal-input-line">
          {selectionMode ? (
            <SelectPrompt
              label={selectionMode.promptLabel}
              count={selectionMode.items.length}
            />
          ) : (
            <Prompt cwd={cwd} />
          )}
          <input
            ref={inputRef}
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label={selectionMode ? `${selectionMode.promptLabel} selection` : 'Terminal input'}
            className="terminal-input"
          />
        </form>
        )}
      </div>
      {pagerMode ? null : (
        <footer className="terminal-footer">
          <span>
            {selectionMode ? (
              <>
                <kbd>1</kbd>–<kbd>{selectionMode.items.length}</kbd> to pick · <kbd>esc</kbd> or{' '}
                <kbd>q</kbd> to cancel
              </>
            ) : (
              <>
                <kbd>tab</kbd> autocomplete · <kbd>↑</kbd>/<kbd>↓</kbd> history · <kbd>ctrl+l</kbd>{' '}
                clear
              </>
            )}
          </span>
          <Link href="/gui" className="terminal-classic-link">
            switch to gui →
          </Link>
        </footer>
      )}
    </div>
  );
}
