import { withContentlayer } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },

  /**
   * @see https://nextjs.org/docs/pages/api-reference/next-config-js/pageExtensions
   */
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  /**
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/mdxRs
   */
  experimental: {
    mdxRs: true,
  },

  /**
   * Opt into Turbopack (default in Next 16). Empty config is enough — the
   * webpack config injected by `withContentlayer` coexists at build time.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
   */
  turbopack: {},
};

export default withContentlayer(nextConfig);
