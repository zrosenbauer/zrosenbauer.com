import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC_DESIGNS = join(ROOT, 'public/img/designs');
const CONTENT_DESIGNS = join(ROOT, 'content/designs');

type Args = {
  slug: string;
  cols?: number;
  gap?: number;
  bg?: string;
};

function parseArgs(argv: string[]): Args {
  const out: Partial<Args> = {};
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--slug=')) out.slug = arg.slice('--slug='.length);
    else if (arg.startsWith('--cols=')) out.cols = Number(arg.slice('--cols='.length));
    else if (arg.startsWith('--gap=')) out.gap = Number(arg.slice('--gap='.length));
    else if (arg.startsWith('--bg=')) out.bg = arg.slice('--bg='.length);
  }
  if (out.slug === undefined || out.slug === '') {
    console.error(
      'Usage: tsx scripts/generate-design-banner.ts --slug=<slug> [--cols=N] [--gap=PX] [--bg=#hex|none]'
    );
    process.exit(1);
  }
  return out as Args;
}

function magick(args: string[]): void {
  const result = spawnSync('magick', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) {
    const stderr = result.stderr?.toString() ?? '';
    throw new Error(`magick failed (${args.join(' ')}): ${stderr}`);
  }
}

function readMdxImageOrder(slug: string, slugDir: string): string[] {
  const mdxPath = join(CONTENT_DESIGNS, `${slug}.mdx`);
  if (!existsSync(mdxPath)) return [];
  const src = readFileSync(mdxPath, 'utf8');
  const re = /<img\s+src="\/img\/designs\/[^/]+\/([^"]+\.png)"/g;
  const seen = new Set<string>();
  const order: string[] = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const name = m[1];
    if (name === 'banner.png' || seen.has(name)) continue;
    seen.add(name);
    if (existsSync(join(slugDir, name))) order.push(name);
  }
  return order;
}

function readMdxMode(slug: string): 'light' | 'dark' {
  const mdxPath = join(CONTENT_DESIGNS, `${slug}.mdx`);
  if (!existsSync(mdxPath)) return 'dark';
  const src = readFileSync(mdxPath, 'utf8');
  const m = /^mode:\s*['"]?(light|dark)['"]?/m.exec(src);
  return (m?.[1] as 'light' | 'dark') ?? 'dark';
}

function autoCols(n: number): number {
  if (n <= 4) return n;
  if (n <= 6) return 3;
  if (n <= 12) return 4;
  return Math.ceil(Math.sqrt(n));
}

function rowArgs(rowFiles: string[], slugDir: string, bg: string, halfGap: number): string[] {
  const out: string[] = [];
  for (const f of rowFiles) {
    out.push('(', join(slugDir, f), '-bordercolor', bg, '-border', String(halfGap), ')');
  }
  out.push('+append');
  return out;
}

function buildBanner(args: Args): void {
  const slugDir = join(PUBLIC_DESIGNS, args.slug);
  if (!existsSync(slugDir)) {
    throw new Error(`No image dir at ${slugDir}`);
  }

  const orderFromMdx = readMdxImageOrder(args.slug, slugDir);
  const files =
    orderFromMdx.length > 0
      ? orderFromMdx
      : readdirSync(slugDir)
          .filter((f) => f.endsWith('.png') && f !== 'banner.png')
          .sort();

  if (files.length === 0) throw new Error(`No images in ${slugDir}`);

  const mode = readMdxMode(args.slug);
  const defaultBg = mode === 'dark' ? '#0a0a0a' : 'none';
  const bg = args.bg ?? defaultBg;
  const gap = args.gap ?? 24;
  const cols = args.cols ?? autoCols(files.length);
  const rows = Math.ceil(files.length / cols);
  const halfGap = Math.floor(gap / 2);
  const tmpRows: string[] = [];

  for (let r = 0; r < rows; r += 1) {
    const rowFiles = files.slice(r * cols, (r + 1) * cols);
    const tmp = join('/tmp', `banner-${args.slug}-row-${r}.png`);
    magick([...rowArgs(rowFiles, slugDir, bg, halfGap), tmp]);
    tmpRows.push(tmp);
  }

  const out = join(slugDir, 'banner.png');
  magick([...tmpRows, '-append', out]);
  for (const tmp of tmpRows) rmSync(tmp, { force: true });

  const identify = spawnSync('magick', ['identify', '-format', '%wx%h', out]);
  const dims = identify.stdout?.toString().trim() ?? '?';
  console.log(
    `  ✓ public/img/designs/${args.slug}/banner.png (${dims}, ${files.length} images, ${cols}x${rows})`
  );
}

const args = parseArgs(process.argv);
try {
  buildBanner(args);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
