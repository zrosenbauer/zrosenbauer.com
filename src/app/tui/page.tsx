import { TerminalShell } from '@components/terminal/terminal-shell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'terminal',
  description:
    'A terminal-style interface for zrosenbauer.com. Run `help` to see available commands.',
};

export default function TerminalPage() {
  return <TerminalShell />;
}
