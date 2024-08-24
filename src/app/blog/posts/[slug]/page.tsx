import { BlogPostAuthor } from '@components/blog/blog-author';
import { Footer } from '@components/footer';
import { Mdx } from '@components/md/mdx';
import { Navigation } from '@components/nav';
import { allBlogPosts } from '@content';
import { notFound } from 'next/navigation';
import React from 'react';

import { Chip } from '@components/ui/chip';
import { Icon } from '@components/ui/icon';
import { getBlogTagBySlug } from '@utils/blog/tags';

export const revalidate = 60;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<Array<Props['params']>> {
  return allBlogPosts.map((p) => ({
    slug: p.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const post = allBlogPosts.find((blogPost) => blogPost.slug === slug);

  if (!post) {
    notFound();
  }

  const tags = Array.isArray(post.tags)
    ? post.tags.map((tagSlug) => {
        return getBlogTagBySlug(tagSlug);
      })
    : [];

  return (
    <div className='bg-zinc-900 text-zinc-100 min-h-screen'>
      <Navigation className='fixed' backLink='/blog' />
      <div className='container px-4 blog-post-page page-container mx-auto relative isolate overflow-hidden pt-24 sm:pt-32'>
        <div className='flex flex-col items-center'>
          <div className='mx-auto lg:mx-0'>
            <h1 className='text-4xl mb-2 font-bold tracking-tight sm:text-6xl font-display'>
              {post.title}
            </h1>
            <p className='mb-4 text-lg leading-8'>{post.description}</p>
            <img
              src={post.image}
              className='w-full mb-7'
              alt={`Blog post banner for ${post.title}`}
            />
            <BlogPostAuthor post={post} className='mb-2' />
          </div>
        </div>
      </div>
      <article className='px-4 pb-12 mx-auto page-container prose prose-zinc prose-quoteless'>
        <Mdx code={post.body.code} />
        {tags.length > 0 && (
          <React.Fragment>
            <hr className='mb-4 mt-24' />
            <div className='flex gap-2 mb-8'>
              {tags.map((tag) => (
                <Chip
                  key={tag.slug}
                  label={tag.name}
                  icon={<Icon name={tag.icon} />}
                  dark
                />
              ))}
            </div>
          </React.Fragment>
        )}
      </article>
      <Footer />
    </div>
  );
}
