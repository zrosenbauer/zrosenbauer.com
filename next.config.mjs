import { withContentlayer } from 'next-contentlayer';

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
};

export default withContentlayer(nextConfig);
