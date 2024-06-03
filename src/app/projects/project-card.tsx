import { Mdx } from '@components/md/mdx';
import type { Project } from '@content';
import { useGitHubApi } from '@utils/github/client';
import _ from 'lodash';
import { Star } from 'lucide-react';
import Link from 'next/link';

export const ProjectCard: React.FC<{
  project: Project;
}> = ({ project }) => {
  const [owner, repo] = project.repository.split('/');
  const { data } = useGitHubApi('GET /repos/{owner}/{repo}', {
    owner,
    repo,
  });

  if (!data) {
    return null;
  }

  return (
    <Link
      href={`https://github.com/${project.repository}`}
      rel='noopener noreferrer'
      target='_blank'
    >
      <article className='p-4 md:p-8'>
        <div className='flex justify-between gap-2 items-center'>
          <span className='text-zinc-500 text-xs flex items-center gap-1'>
            <Star className='w-4 h-4' />{' '}
            {Intl.NumberFormat('en-US', { notation: 'compact' }).format(
              data.stargazers_count
            )}
          </span>
          {project.deprecated && (
            <div className='text-xs px-2 py-1 opacity-35 text-red-900 bg-red-300 rounded-md'>
              deprecated
            </div>
          )}
        </div>
        <h2 className='z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display'>
          {project.title}
        </h2>
        <div className='z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200'>
          <Mdx code={project.body.code} />
        </div>
      </article>
    </Link>
  );
};
