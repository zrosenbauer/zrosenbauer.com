'use client';

import { Card } from '@components/card';
import { Mdx } from '@components/md/mdx';
import { Navigation } from '@components/nav';
import { allProjects } from '@content';
import { IconStar } from '@tabler/icons-react';
import { useGitHubApi } from '@utils/github/client';
import _ from 'lodash';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { ProjectCard } from './project-card';

import './page.css';

export const revalidate = 60;

export default function ProjectsPage() {
  const top1Project = findProjectBySlug('fastify-prisma');
  const top2Project = findProjectBySlug('unicorn');
  const top3Project = findProjectBySlug('tempo');
  const nonFeaturedProjects = allProjects.filter(
    (project) =>
      project.slug !== top1Project.slug &&
      project.slug !== top2Project.slug &&
      project.slug !== top3Project.slug
  );

  const [featuredOwner, featuredRepo] = top1Project.repository.split('/');
  const featuredGhRepo = useGitHubApi('GET /repos/{owner}/{repo}', {
    owner: featuredOwner,
    repo: featuredRepo,
  });

  return (
    <div className='relative pb-16'>
      <Navigation />
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32'>
        <div className='max-w-2xl mx-auto text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl'>
            projects
          </h1>
          <p className='mt-6 text-lg leading-8 text-zinc-300'>
            My work ranging from open-source, work-related, to personal
            projects.
          </p>
        </div>
        <div className='w-full h-px bg-zinc-800' />
        <div className='grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 '>
          <Card>
            <Link
              href={`https://github.com/${top1Project.repository}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <article className='relative w-full h-full p-4 md:p-8'>
                <div className='flex items-center justify-between gap-2'>
                  {!_.isNil(featuredGhRepo.data) && (
                    <span className='flex items-center gap-1 text-xs text-zinc-500'>
                      <IconStar className='w-4 h-4' />{' '}
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
                  {top1Project.title}
                </h2>
                <div className='mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300'>
                  <Mdx code={top1Project.body.code} />
                </div>
                <div className='absolute bottom-4 md:bottom-8'>
                  <p className='hidden text-zinc-200 hover:text-zinc-50 lg:block'>
                    Read more <span aria-hidden='true'>&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>
          <div className='flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 '>
            {[top2Project, top3Project].map((project) => (
              <Card key={project.slug}>
                <ProjectCard project={project} />
              </Card>
            ))}
          </div>
        </div>
        <div className='hidden w-full h-px md:block bg-zinc-800' />
        <div className='grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3'>
          <div className='grid grid-cols-1 gap-4'>
            {nonFeaturedProjects
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <ProjectCard project={project} />
                </Card>
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4'>
            {nonFeaturedProjects
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <ProjectCard project={project} />
                </Card>
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4'>
            {nonFeaturedProjects
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <ProjectCard project={project} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const findProjectBySlug = (slug: string) => {
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return project;
};
