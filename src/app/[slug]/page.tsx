import { notFound } from 'next/navigation';
import { allPages } from '@content';

import BasicPageTemplate from '@components/templates/basic-page';

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props['params'][]> {
  return allPages
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function Page({ params }: Props) {
  const slug = params?.slug;
  const page = allPages.find((page) => page.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <BasicPageTemplate
      title={page.title}
      // summary={page.summary}
      contents={page.body.code}
    />
  );
}
