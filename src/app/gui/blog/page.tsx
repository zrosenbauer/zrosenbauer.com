'use client';

import { Section } from '@components/site/section';
import { allBlogPosts } from '@content';
import { blogTags } from '@utils/blog/tags';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function BlogPage() {
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  const sortedPosts = useMemo(() => {
    const filtered =
      tagFilters.length === 0
        ? allBlogPosts
        : allBlogPosts.filter((p) => p.tags?.some((t) => tagFilters.includes(t)) ?? false);
    return [...filtered].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [tagFilters]);

  const toggleTag = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => setTagFilters([]);

  return (
    <>
      
        <Section first>
          <div className="flex flex-col gap-4">
            <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
              blog
            </h1>
            <p className="max-w-prose text-base text-muted-foreground md:text-lg">
              Tutorials, gotchas, and other things I learned the hard way — DevOps, Node.js, and
              React.
            </p>
          </div>
        </Section>

        <Section>
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            {blogTags.map((tag) => {
              const active = tagFilters.includes(tag.slug);
              return (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`border-2 px-3 py-1 font-bold uppercase tracking-widest transition-colors ${
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
            {tagFilters.length > 0 ? (
              <>
                <span aria-hidden="true" className="mx-1 h-6 w-0.5 bg-border" />
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2 py-1 font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-destructive"
                >
                  clear ({tagFilters.length}) ✕
                </button>
              </>
            ) : null}
          </div>
          {sortedPosts.length === 0 ? (
            <p className="text-muted-foreground">no posts match those tags. try clearing.</p>
          ) : (
            <ul className="divide-y-2 divide-border border-y-2 border-border">
              {sortedPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/gui/blog/posts/${post.slug}`}
                    className="group flex flex-col gap-1 px-2 py-4 hover:bg-primary/5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span className="text-base font-bold text-foreground group-hover:text-primary md:text-lg">
                        {post.title}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)} · {post.readTime} min
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
                      {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      
    </>
  );
}
