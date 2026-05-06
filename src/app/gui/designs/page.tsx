import { Section } from '@components/site/section';
import { allDesigns } from '@content';
import Image from 'next/image';
import Link from 'next/link';

export default function DesignsPage() {
  const designs = [...allDesigns].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <Section first>
        <div className="flex flex-col gap-4">
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
            designs
          </h1>
          <p className="max-w-prose text-base text-muted-foreground md:text-lg">
            I 🫶 figma. Graphic experiments and one-off illustrations from over the years.
          </p>
        </div>
      </Section>

      <Section>
        {designs.length === 0 ? (
          <p className="text-muted-foreground">(no designs yet)</p>
        ) : (
          <ul className="grid grid-cols-1 gap-0 divide-y-2 divide-border border-y-2 border-border sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0">
            {designs.map((design) => (
              <li key={design.slug}>
                <Link
                  href={`/gui/designs/${design.slug}`}
                  className="group flex flex-col gap-3 p-4 hover:bg-primary/5"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-border">
                    <Image
                      src={`/img/designs/${design.slug}/banner.png`}
                      alt={design.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-bold text-foreground group-hover:text-primary md:text-lg">
                      {design.title}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {design.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
