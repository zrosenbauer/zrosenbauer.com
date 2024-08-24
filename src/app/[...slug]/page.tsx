import { Footer } from '@components/footer';
import { Mdx } from '@components/md/mdx';
import { Navigation } from '@components/nav';
import { allPages } from '@content';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface Props {
  params: {
    slug: string[];
  };
}

export async function generateStaticParams(): Promise<Array<Props['params']>> {
  return allPages.map((p) => ({
    slug: p.slug.split('/'),
  }));
}

export default async function Page({ params }: Props) {
  const page = allPages.find((page) => page.slug === params.slug.join('/'));

  if (!page) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gradient-to-tl from-black via-zinc-900 to-black'>
      <header className='relative isolate overflow-hidden'>
        <Navigation />
        <div className='container page-container mx-auto relative isolate overflow-hidden py-24 sm:py-32'>
          <div className='mx-auto text-center flex flex-col items-center'>
            <div className='mx-auto lg:mx-0'>
              <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl font-display'>
                {page.title}
              </h1>
              {page.description && (
                <p className='mt-6 text-lg leading-8 text-zinc-300'>
                  {page.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>
      <article className='pb-12 page-container mx-auto prose prose-zinc prose-quoteless'>
        <Mdx code={page.body.code} />
      </article>
      <Footer />
    </div>
  );
}
