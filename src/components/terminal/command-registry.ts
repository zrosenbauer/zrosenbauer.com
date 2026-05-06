import { HOME_PATH, listDir, normalizePath, prettyPath, resolveNode } from './fs';
import { type Navigator, type NavigatorItem, NAVIGATORS, resolveNavigatorItem } from './navigators';
import {
  type CommandContext,
  type CommandDefinition,
  type CommandGroup,
  type CommandOutput,
  TERMINAL_THEMES,
  type TerminalTheme,
} from './types';

const isTerminalTheme = (value: string): value is TerminalTheme =>
  (TERMINAL_THEMES as ReadonlyArray<string>).includes(value);

const ok = (lines: ReadonlyArray<string>): CommandOutput => ({ kind: 'text', lines });
const err = (message: string): CommandOutput => ({ kind: 'error', message });
const empty: CommandOutput = { kind: 'empty' };

const formatRows = (cmds: ReadonlyArray<CommandDefinition>): string[] => {
  if (cmds.length === 0) return [];
  const padTo = Math.max(...cmds.map((c) => c.name.length));
  return cmds.map((c) => `  ${c.name.padEnd(padTo, ' ')}   ${c.summary}`);
};

const renderListing = (path: string): CommandOutput => {
  const node = resolveNode(path);
  if (!node) return err(`ls: ${prettyPath(path)}: no such file or directory`);
  if (node.kind === 'file') {
    return ok([node.name]);
  }
  const entries = listDir(node);
  if (entries.length === 0) return ok(['(empty)']);
  const widest = Math.max(...entries.map((e) => e.name.length));
  const lines = entries.map((e) => {
    const tag = e.kind === 'dir' ? '/' : ' ';
    const desc = e.description ? `  — ${e.description}` : '';
    return `  ${(e.name + tag).padEnd(widest + 2, ' ')}${desc}`;
  });
  return ok(lines);
};

// ---------- shell commands ----------

const catCommand: CommandDefinition = {
  name: 'cat',
  summary: 'Print a file to the terminal',
  group: 'shell',
  usage: 'cat <path>',
  run: (args, ctx) => {
    if (args.length === 0) return err('cat: missing operand');
    const target = normalizePath(args[0], ctx.cwd);
    const node = resolveNode(target);
    if (!node) return err(`cat: ${prettyPath(target)}: no such file or directory`);
    if (node.kind === 'dir') return err(`cat: ${prettyPath(target)}: is a directory`);
    return { kind: 'markdown', content: node.content };
  },
};

const lsCommand: CommandDefinition = {
  name: 'ls',
  summary: 'List directory contents',
  group: 'shell',
  usage: 'ls [path]',
  run: (args, ctx) => {
    const target = normalizePath(args[0] ?? '.', ctx.cwd);
    return renderListing(target);
  },
};

const cdCommand: CommandDefinition = {
  name: 'cd',
  summary: 'Change the current directory',
  group: 'shell',
  usage: 'cd [path]',
  run: (args, ctx) => {
    const target = normalizePath(args[0] ?? '~', ctx.cwd);
    const node = resolveNode(target);
    if (!node) return err(`cd: ${prettyPath(target)}: no such file or directory`);
    if (node.kind !== 'dir') return err(`cd: ${prettyPath(target)}: not a directory`);
    ctx.setCwd(target);
    return empty;
  },
};

const pwdCommand: CommandDefinition = {
  name: 'pwd',
  summary: 'Print the current directory',
  group: 'shell',
  run: (_args, ctx) => ok([ctx.cwd]),
};

const clearCommand: CommandDefinition = {
  name: 'clear',
  summary: 'Clear the screen',
  group: 'shell',
  run: () => ({ kind: 'clear-screen' }),
};

const themeCommand: CommandDefinition = {
  name: 'theme',
  summary: 'Switch terminal theme',
  group: 'shell',
  usage: `theme [${TERMINAL_THEMES.join('|')}]`,
  run: (args, ctx) => {
    if (args.length === 0) {
      return ok([`available themes: ${TERMINAL_THEMES.join(', ')}`, 'usage: theme <name>']);
    }
    const name = args[0];
    if (!isTerminalTheme(name)) return err(`theme: unknown theme '${name}'`);
    ctx.setTheme(name);
    return ok([`theme set to '${name}'`]);
  },
};

const historyCommand: CommandDefinition = {
  name: 'history',
  summary: 'Show recent commands',
  group: 'shell',
  run: (_args, ctx) => {
    if (ctx.history.length === 0) return ok(['(empty)']);
    const padTo = String(ctx.history.length).length;
    return ok(ctx.history.map((cmd, i) => `  ${String(i + 1).padStart(padTo, ' ')}  ${cmd}`));
  },
};

const openCommand: CommandDefinition = {
  name: 'open',
  summary: 'Open a path in a new tab',
  group: 'shell',
  usage: 'open [path]',
  run: (args, _ctx) => {
    const target = args[0] ?? '/gui';
    if (typeof window !== 'undefined') {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
    return ok([`opening ${target}…`]);
  },
};

const exitCommand: CommandDefinition = {
  name: 'exit',
  summary: 'Return to the chooser',
  group: 'shell',
  run: () => {
    if (typeof window !== 'undefined') {
      // Don't persist the previous tui preference — let the user pick fresh.
      window.localStorage.removeItem('ui-preference');
      window.location.assign('/');
    }
    return ok(['returning to home…']);
  },
};

const whoamiCommand: CommandDefinition = {
  name: 'whoami',
  summary: 'Print the current user',
  group: 'shell',
  hidden: true,
  run: () => ok(['zac']),
};

const echoCommand: CommandDefinition = {
  name: 'echo',
  summary: 'Print arguments back to the terminal',
  group: 'shell',
  hidden: true,
  run: (args) => ok([args.join(' ')]),
};

// ---------- navigation commands ----------

const openItem = (item: NavigatorItem, collection: ReadonlyArray<NavigatorItem>): CommandOutput => {
  // Internal viewable content → in-terminal pager.
  if (item.viewable && item.getContent) {
    const index = collection.findIndex((c) => c.slug === item.slug);
    return {
      kind: 'view',
      title: item.label,
      content: item.getContent(),
      href: item.href,
      index: index >= 0 ? index : undefined,
      collection: index >= 0 ? collection : undefined,
    };
  }
  // External or non-viewable → real navigation.
  if (typeof window !== 'undefined') {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.assign(item.href);
    }
  }
  return ok([`opening ${item.label}…`]);
};

const createNavCommand = (nav: Navigator): CommandDefinition => ({
  name: nav.name,
  summary: nav.summary,
  group: 'navigate',
  usage: `${nav.name} [list | <n> | <slug>]`,
  run: (args) => {
    const items = nav.list();
    if (items.length === 0) {
      return ok([nav.emptyMessage ?? '(empty)']);
    }
    const sub = args[0]?.toLowerCase();

    if (sub === 'ls' || sub === 'list') {
      return {
        kind: 'links',
        heading: `${nav.name}:`,
        items: items.map((item, i) => ({
          label: `${i + 1}. ${item.label}`,
          href: item.href,
          description: item.description,
          external: item.external,
        })),
      };
    }

    if (!sub) {
      return {
        kind: 'select-prompt',
        heading: `${nav.name}:`,
        hint: "type a number, slug, or 'q' to cancel",
        navigatorId: nav.id,
        promptLabel: nav.promptLabel,
        items,
      };
    }

    const item = resolveNavigatorItem(items, args.join(' '));
    if (!item) return err(`${nav.name}: no match for '${args.join(' ')}'`);
    return openItem(item, items);
  },
});

const viewFile = (path: string, fallbackHref: string): CommandOutput => {
  const node = resolveNode(path);
  if (!node || node.kind !== 'file') {
    return err(`${prettyPath(path)}: not available`);
  }
  return {
    kind: 'view',
    title: node.title,
    content: node.content,
    href: node.href ?? fallbackHref,
  };
};

const aboutCommand: CommandDefinition = {
  name: 'about',
  summary: 'About the author',
  group: 'navigate',
  run: () => viewFile(`${HOME_PATH}/about.md`, '/gui/about'),
};

const contactCommand: CommandDefinition = {
  name: 'contact',
  summary: 'Show contact info',
  group: 'navigate',
  run: () => viewFile(`${HOME_PATH}/contact.md`, '/gui/contact'),
};

const navCommands: CommandDefinition[] = [
  aboutCommand,
  ...NAVIGATORS.map(createNavCommand),
  contactCommand,
];

// ---------- registry ----------

const shellCommands: CommandDefinition[] = [
  lsCommand,
  cdCommand,
  catCommand,
  pwdCommand,
  themeCommand,
  historyCommand,
  clearCommand,
  openCommand,
  exitCommand,
  whoamiCommand,
  echoCommand,
];

const helpCommand: CommandDefinition = {
  name: 'help',
  summary: 'Show available commands',
  group: 'shell',
  run: () => {
    const visibleNav = navCommands
      .filter((c) => !c.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));
    const visibleShell = [helpCommand, ...shellCommands]
      .filter((c) => !c.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));

    const lines: string[] = ['available:'];
    if (visibleNav.length > 0) {
      lines.push('', 'navigate:', ...formatRows(visibleNav));
    }
    if (visibleShell.length > 0) {
      lines.push('', 'commands:', ...formatRows(visibleShell));
    }
    lines.push(
      '',
      "tip: try `blog`, `projects 1`, or `theme dark`. inside select mode type a number, slug, or 'q' to cancel."
    );
    return ok(lines);
  },
};

const allCommands: CommandDefinition[] = [helpCommand, ...navCommands, ...shellCommands];

const commandMap = new Map(allCommands.map((c) => [c.name, c] as const));

export const COMMAND_NAMES: ReadonlyArray<string> = allCommands
  .filter((c) => !c.hidden)
  .map((c) => c.name)
  .sort();

const tokenize = (input: string): string[] => input.trim().split(/\s+/);

export const runCommand = (input: string, ctx: CommandContext): CommandOutput => {
  const tokens = tokenize(input);
  if (tokens.length === 0) return empty;
  const [name, ...args] = tokens;
  const cmd = commandMap.get(name.toLowerCase());
  if (!cmd) return err(`command not found: ${name}. type 'help' for available commands.`);
  return cmd.run(args, ctx);
};

export const completeCommand = (prefix: string): string[] => {
  const lower = prefix.toLowerCase();
  return allCommands.filter((c) => !c.hidden && c.name.startsWith(lower)).map((c) => c.name);
};

export type { CommandGroup };
