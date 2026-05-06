export type TerminalTheme = 'matrix' | 'dark' | 'light';

export const TERMINAL_THEMES: TerminalTheme[] = ['matrix', 'dark', 'light'];

export type FsNodeKind = 'dir' | 'file';

export interface FsDir {
  kind: 'dir';
  name: string;
  path: string;
  children: Record<string, FsNode>;
  description?: string;
}

export interface FsFile {
  kind: 'file';
  name: string;
  path: string;
  title: string;
  description?: string;
  content: string;
  href?: string;
  meta?: Record<string, unknown>;
}

export type FsNode = FsDir | FsFile;

export interface SelectPromptItem {
  slug: string;
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  /** When true, picking the item opens the in-terminal pager instead of navigating. */
  viewable?: boolean;
  /** Resolves the markdown content shown in the pager. Required when `viewable`. */
  getContent?: () => string;
}

export interface SelectionMode {
  navigatorId: string;
  promptLabel: string;
  items: ReadonlyArray<SelectPromptItem>;
}

export type CommandOutput =
  | { kind: 'text'; lines: ReadonlyArray<string> }
  | {
      kind: 'links';
      heading?: string;
      items: ReadonlyArray<{
        label: string;
        href: string;
        description?: string;
        external?: boolean;
      }>;
    }
  | { kind: 'markdown'; content: string }
  | { kind: 'error'; message: string }
  | { kind: 'empty' }
  | { kind: 'clear-screen' }
  | {
      kind: 'select-prompt';
      heading?: string;
      hint?: string;
      navigatorId: string;
      promptLabel: string;
      items: ReadonlyArray<SelectPromptItem>;
    }
  | {
      kind: 'view';
      title: string;
      content: string;
      href: string;
      navigatorId?: string;
      index?: number;
      collection?: ReadonlyArray<SelectPromptItem>;
    };

export interface PagerState {
  title: string;
  content: string;
  href: string;
  navigatorId?: string;
  index?: number;
  collection?: ReadonlyArray<SelectPromptItem>;
}

export interface CommandContext {
  cwd: string;
  setCwd: (path: string) => void;
  setTheme: (theme: TerminalTheme) => void;
  clearScreen: () => void;
  history: ReadonlyArray<string>;
  commandNames: ReadonlyArray<string>;
}

export type CommandGroup = 'navigate' | 'shell';

export interface CommandDefinition {
  name: string;
  summary: string;
  group?: CommandGroup;
  usage?: string;
  hidden?: boolean;
  run: (args: ReadonlyArray<string>, ctx: CommandContext) => CommandOutput;
}
