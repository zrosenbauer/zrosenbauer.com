import { notFound } from 'next/navigation';
import { allBlogPosts } from '@content';
import { Mdx } from '@components/mdx';

import { Header } from './header';

import './mdx.css';

export const revalidate = 60;

type Props = {
  title: string;
  summary?: string;
  contents: string;
};

export default async function BasicPageTemplate({ title, summary, contents }: Props) {
  return (
    <div className='bg-zinc-50 min-h-screen'>
      <Header 
        title={title}
        summary={summary}
      />
      <article className='px-4 py-12 mx-auto prose prose-zinc prose-quoteless'>
        <Mdx code={contents} />
      </article>
    </div>
  );
}
