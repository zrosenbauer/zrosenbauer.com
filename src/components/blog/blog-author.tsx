import type { BlogPost } from '@content';
import Link from 'next/link';

export const BlogPostAuthor: React.FC<{
  post: BlogPost;
  className?: string;
}> = ({ post, className }) => {
  return (
    <div className={`${className} flex gap-2 items-center`}>
      <img
        src={`https://github.com/${post.authorGithubUsername}.png`}
        className='rounded-full h-12 w-12 flex items-center justify-center'
        alt='Author'
      />
      <div className='flex flex-col'>
        <Link
          href={`https://github.com/${post.authorGithubUsername}`}
          className='font-bold'
        >
          @{post.authorGithubUsername}
        </Link>
        <div className='flex flex-row'>
          <div className='flex-initial mr-1'>
            Published on {new Date(post.publishedAt).toLocaleDateString()}
          </div>
          <div>•</div>
          <div className='flex-initial ml-1'>
            {post.readTime} {post.readTime === 1 ? 'minute' : 'minutes'} read
          </div>
        </div>
      </div>
    </div>
  );
};
