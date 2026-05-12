import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import wawoff2 from 'wawoff2';

import { allBlogPosts, allDesigns, allPages } from '../.contentlayer/generated/index.mjs';
import { template, type OgInput } from './og-template';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC_OG = join(ROOT, 'public', 'og');
const CAL_SANS_PATH = join(ROOT, 'public', 'fonts', 'CalSans-SemiBold.ttf');

// Geist Pixel ships only as WOFF2; satori needs TTF/OTF. Resolve the woff2 via
// the package's `geist/font/pixel` export (which lives in dist/) and decompress
// on the fly with wawoff2.
const require = createRequire(import.meta.url);
const GEIST_PIXEL_WOFF2_PATH = join(
  dirname(require.resolve('geist/font/pixel')),
  'fonts/geist-pixel/GeistPixel-Square.woff2'
);

const WIDTH = 1200;
const HEIGHT = 630;

type Fonts = { calSans: Buffer; geistPixel: Buffer };

const loadFonts = async (): Promise<Fonts> => {
  const [calSans, pixelWoff2] = await Promise.all([
    readFile(CAL_SANS_PATH),
    readFile(GEIST_PIXEL_WOFF2_PATH),
  ]);
  const decompressed = await wawoff2.decompress(pixelWoff2);
  return { calSans, geistPixel: Buffer.from(decompressed) };
};

type Job = { outPath: string; input: OgInput };

const siteJob = (): Job => ({
  outPath: join(PUBLIC_OG, 'default.png'),
  input: { kind: 'site' },
});

const blogJobs = (): Job[] =>
  allBlogPosts.map((p) => ({
    outPath: join(PUBLIC_OG, 'blog', `${p.slug}.png`),
    input: {
      kind: 'blog',
      title: p.title,
      description: p.description,
      publishedAt: p.publishedAt,
      readTime: p.readTime,
      tags: p.tags,
    },
  }));

const designJobs = (): Job[] =>
  allDesigns.map((d) => ({
    outPath: join(PUBLIC_OG, 'designs', `${d.slug}.png`),
    input: { kind: 'design', title: d.title, description: d.description },
  }));

const pageJobs = (): Job[] =>
  allPages.map((p) => ({
    outPath: join(PUBLIC_OG, 'pages', `${p.slug}.png`),
    input: { kind: 'page', title: p.title, description: p.description ?? '' },
  }));

type CliArgs = { type?: string; slug?: string; force: boolean };

const parseArgs = (): CliArgs => {
  const args: CliArgs = { force: false };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--force') args.force = true;
    else if (arg.startsWith('--type=')) args.type = arg.slice('--type='.length);
    else if (arg.startsWith('--slug=')) args.slug = arg.slice('--slug='.length);
  }
  return args;
};

const TYPE_DIR_MAP: Record<string, string> = {
  site: '',
  blog: 'blog',
  design: 'designs',
  page: 'pages',
};

const renderJob = async (job: Job, fonts: Fonts): Promise<void> => {
  const svg = await satori(template(job.input), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'CalSans', data: fonts.calSans, weight: 600, style: 'normal' },
      { name: 'GeistPixel', data: fonts.geistPixel, weight: 500, style: 'normal' },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  const png = resvg.render().asPng();
  await mkdir(dirname(job.outPath), { recursive: true });
  await writeFile(job.outPath, png);
  console.log(`  ✓ ${job.outPath.replace(`${ROOT}/`, '')}`);
};

const main = async (): Promise<void> => {
  const args = parseArgs();
  const fonts = await loadFonts();

  let jobs: Job[] = [siteJob(), ...blogJobs(), ...designJobs(), ...pageJobs()];

  if (args.type !== undefined) {
    const dir = TYPE_DIR_MAP[args.type];
    if (dir === undefined) {
      console.error(
        `Unknown --type: ${args.type}. Expected one of: ${Object.keys(TYPE_DIR_MAP).join(', ')}`
      );
      process.exit(1);
    }
    jobs = jobs.filter((j) =>
      args.type === 'site' ? j.outPath.endsWith('default.png') : j.outPath.includes(`/og/${dir}/`)
    );
  }

  if (args.slug !== undefined) {
    jobs = jobs.filter((j) => j.outPath.endsWith(`/${args.slug}.png`));
  }

  if (!args.force) {
    jobs = jobs.filter((j) => !existsSync(j.outPath));
  }

  if (jobs.length === 0) {
    console.log('No OG images to generate (use --force to regenerate).');
    return;
  }

  console.log(`Generating ${jobs.length} OG image${jobs.length === 1 ? '' : 's'}…`);
  for (const job of jobs) {
    await renderJob(job, fonts);
  }
  console.log('Done.');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
