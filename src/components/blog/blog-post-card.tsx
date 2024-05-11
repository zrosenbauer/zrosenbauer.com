import type { BlogPost } from '@content';
import Link from 'next/link';

export const BlogPostCard: React.FC<{
  post: BlogPost;
}> = ({ post }) => {
  return (
    <Link href={`/blog/posts/${post.slug}`}>
      <article className='p-4 md:p-8'>
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
      </article>
    </Link>
  );
};
