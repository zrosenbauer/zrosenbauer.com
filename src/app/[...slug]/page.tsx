import { notFound } from 'next/navigation';
import { allPages } from '@content';
import { Navigation } from '@components/nav';
import { Footer } from '@components/footer';
import { Mdx } from '@components/mdx';

export const revalidate = 60;

type Props = {
  params: {
    slug: string[];
  };
};

export async function generateStaticParams(): Promise<Props['params'][]> {
  return allPages
    .map((p) => ({
      slug: p.slug.split('/'),
    }));
}

export default async function Page({ params }: Props) {
  const page = allPages.find(
    (page) => page.slug === params.slug.join('/')
  );

  if (!page) {
    notFound();
  }

  return (
    <div className='bg-zinc-50 min-h-screen'>
      <header className='relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black'>
        <Navigation 
          backLink='/blog'
        />
        <div className='container mx-auto relative isolate overflow-hidden py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
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
      <article className='px-4 py-12 mx-auto prose prose-zinc prose-quoteless'>
        <Mdx code={page.body.code} />     
      </article>
      <Footer />
    </div>
  );
}
