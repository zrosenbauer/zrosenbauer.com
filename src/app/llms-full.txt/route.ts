import { buildLlmsFullTxt } from '@utils/llms';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
