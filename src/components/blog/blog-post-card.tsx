import { Chip } from '@components/ui/chip';
import { Icon } from '@components/ui/icon';
import type { BlogPost } from '@content';
import { getBlogTagBySlug } from '@utils/blog/tags';
import Link from 'next/link';
import React from 'react';

export const BlogPostCard: React.FC<{
  post: BlogPost;
}> = ({ post }) => {
  const tags = Array.isArray(post.tags)
    ? post.tags.map((tagSlug) => {
        return getBlogTagBySlug(tagSlug);
      })
    : [];

  return (
    <Link href={`/blog/posts/${post.slug}`}>
      <article className='px-4 pt-4 pb-24'>
        <img
          src={post.image}
          alt={post.title}
          className='w-full mb-3 group-hover:scale-105 duration-1000 transform transition-all'
        />
        <div className='flex gap-2 items-center'>
          <h2 className='z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display'>
            {post.title}
          </h2>
        </div>
        <p className='z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200'>
          {post.description}
        </p>
        {tags.length > 0 && (
          <div className='absolute bottom-4 right-4 left-4'>
            <hr className='my-4' />
            <div className='flex gap-2'>
              {tags.map((tag) => (
                <Chip
                  key={tag.slug}
                  label={tag.name}
                  icon={<Icon name={tag.icon} />}
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
};
