'use client';

import { BlogPostCard } from '@components/blog/blog-post-card';
import { Card } from '@components/card';
import { Navigation } from '@components/nav';
import { Chip } from '@components/ui/chip';
import { Icon } from '@components/ui/icon';
import { allBlogPosts } from '@content';
import _ from 'lodash';
import React from 'react';

import { blogTags } from '@utils/blog/tags';
import { Popout } from '@components/ui/popout';

export const revalidate = 60;

export default function BlogPage() {
  const [tagFilters, setTagFilters] = React.useState<string[]>([]);
  // const featured = allBlogPosts.find(
  //   (project) => project.slug === 'posts/hello-world',
  // )!;
  // const top2 = allBlogPosts.find((project) => project.slug === "art")!;
  // const top3 = allBlogPosts.find((project) => project.slug === "tempo")!;
  const sorted = _.chain(allBlogPosts)
    .filter((post) => {
      if (tagFilters.length === 0) return true;
      return post.tags?.some((tag) => tagFilters.includes(tag)) ?? false;
    })
    .value();
  // .filter(
  //   (project) => project.slug !== featured.slug &&
  //   project.slug !== top2.slug &&
  //   project.slug !== top3.slug,
  // );

  const handleClearFilters = () => {
    if (tagFilters.length === 0) return;
    setTagFilters([]);
  };

  const createFilterHandler = (tag: string) => () => {
    setTagFilters((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      return _.uniq([...prev, tag]);
    });
  };

  return (
    <div className='relative pb-16'>
      <Navigation />
      <div className='px-6 pt-20 mx-auto max-w-7xl lg:px-8 md:pt-24 lg:pt-32'>
        <div className='max-w-2xl mx-auto text-center my-8'>
          <h1 className='text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl'>
            blog
          </h1>
          <p className='mt-6 text-lg leading-8 text-zinc-300'>
            Tutorials, gotchas, and other topics in the DevOps, Node.js, and
            React world.
          </p>
        </div>
        <Popout>
          <div className='inline-flex items-center space-x-1.5'>
            <div className='text-zinc-200'>Filter by tag:</div>
            <div
              className='flex gap-2'
            >
              {blogTags.map((tag) => (
                <Chip
                  key={tag.slug} 
                  label={tag.name}
                  icon={<Icon name={tag.icon} />}
                  onClick={createFilterHandler(tag.slug)}
                  active={tagFilters.includes(tag.slug)}
                />
              ))}
            </div>
            {tagFilters.length > 0 && (
              <button
                className='text-zinc-200 hover:text-zinc-50'
                onClick={handleClearFilters}
              >
                <Icon name='x' />
              </button>
            )}
          </div>
        </Popout>
        {/* <div className='w-full h-px bg-zinc-800' /> */}
        {/* <div className='grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 '>
          <Card>
            <Link href={`/projects/${featured.slug}`}>
              <article className='relative w-full h-full p-4 md:p-8'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-xs text-zinc-100'>
                    {featured.date ?
                      <time dateTime={new Date(featured.date).toISOString()}>
                        {Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                        }).format(new Date(featured.date))}
                      </time>
                    : <span>SOON</span>}
                  </div>
                  {!_.isNil(featuredGhRepo.data) && (
                    <span className='flex items-center gap-1 text-xs text-zinc-500'>
                      <Star className='w-4 h-4' />{' '}
                      {Intl.NumberFormat('en-US', {
                        notation: 'compact',
                      }).format(featuredGhRepo.data.stargazers_count)}
                    </span>
                  )}
                </div>

                <h2
                  id='featured-post'
                  className='mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display'
                >
                  {featured.title}
                </h2>
                <p className='mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300'>
                  {featuredGhRepo.data?.description ?? "No description"}
                </p>
                <div className='absolute bottom-4 md:bottom-8'>
                  <p className='hidden text-zinc-200 hover:text-zinc-50 lg:block'>
                    Read more <span aria-hidden='true'>&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>
          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((project) => (
              <Card key={project.slug}>
                <ProjectCard project={project}  />
              </Card>
            ))}
          </div>
        </div> */}
        <div className='hidden w-full h-px md:block bg-zinc-800 my-8' />
        <div className='grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 my-8'>
          <div className='grid grid-cols-1 gap-4'>
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((post) => (
                <Card key={post.slug}>
                  <BlogPostCard post={post} />
                </Card>
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4'>
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((post) => (
                <Card key={post.slug}>
                  <BlogPostCard post={post} />
                </Card>
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4'>
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((post) => (
                <Card key={post.slug}>
                  <BlogPostCard post={post} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
