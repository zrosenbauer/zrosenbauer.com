import { VIEWABLE_TUI_SLUGS } from '@components/terminal/navigators';
import { TerminalShell } from '@components/terminal/terminal-shell';
import type { Metadata } from 'next';

interface ParamsShape {
  slug: string[];
}

interface Props {
  params: Promise<ParamsShape>;
}

export const metadata: Metadata = {
  title: 'terminal',
  description: 'A terminal-style interface for zrosenbauer.com.',
};

export async function generateStaticParams(): Promise<Array<ParamsShape>> {
  return VIEWABLE_TUI_SLUGS.map((slug) => ({
    slug: slug.split('/'),
  }));
}

export default async function TerminalDeepLinkPage({ params }: Props) {
  const { slug } = await params;
  // Pass the resolved path to the shell so it can seed pager state during the
  // first render — no SSR shell flash before the pager opens.
  const initialPath = `/tui/${slug.join('/')}`;
  return <TerminalShell initialPath={initialPath} />;
}
