import { notFound } from 'next/navigation';
import { allProjects } from '@content';
import { GitHubReadme } from '@components/github/readme';

import { Header } from './header';

import './mdx.css';

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props['params'][]> {
  return allProjects
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  const [owner, repo] = project.repository.split('/');
  return (
    <div className='bg-zinc-50 min-h-screen'>
      <Header project={project} />
      <article className='px-4 py-12 mx-auto prose prose-zinc prose-quoteless'>
        <GitHubReadme
          owner={owner}
          repo={repo}
        />
      </article>
    </div>
  );
}
