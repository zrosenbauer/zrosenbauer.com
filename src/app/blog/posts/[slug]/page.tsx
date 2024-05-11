import { notFound } from 'next/navigation';
import { allBlogPosts } from '@content';
import { Mdx } from '@components/mdx';
import { Navigation } from '@components/nav';
import { Footer } from '@components/footer';
import { BlogPostAuthor } from '@components/blog/blog-author';

import './page.css';

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props['params'][]> {
  return allBlogPosts
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const post = allBlogPosts.find((blogPost) => blogPost.slug === slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className='bg-zinc-50 min-h-screen'>
      <Navigation
        className='bg-black fixed'
        backLink='/blog'
      />
      <div className='container px-4 blog-post-page mx-auto relative isolate overflow-hidden pt-24 sm:pt-32'>
        <div className='flex flex-col items-center'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <h1 className='text-4xl mb-2 font-bold tracking-tight sm:text-6xl font-display'>
              {post.title}
            </h1>
            <p className='mb-4 text-lg leading-8'>
              {post.description}
            </p>
            <img 
              src={post.image}
              className='w-full mb-7'
            />
            <BlogPostAuthor 
              post={post}
              className='mb-2'
            />
          </div>
        </div>
      </div>
      <article className='px-4 pb-12 mx-auto prose prose-zinc prose-quoteless'>
        <Mdx code={post.body.code} />
      </article>
      <Footer />
    </div>
  );
}
