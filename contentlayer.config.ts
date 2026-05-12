import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import type { ComputedFields } from 'contentlayer2/source-files';
import _ from 'lodash';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { remarkAlert } from 'remark-github-blockquote-alert';

import { blogTags } from './src/utils/blog/tags';

const computedFields: ComputedFields = {
  path: {
    type: 'string',
    resolve: (doc) => {
      // Pages live at /gui/<slug> (we strip the `pages/` directory prefix).
      if (doc._raw.flattenedPath.startsWith('pages/')) {
        return `/gui/${doc._raw.flattenedPath.replace(/^pages\//, '')}`;
      }
      return `/gui/${doc._raw.flattenedPath}`;
    },
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
};

export const Design = defineDocumentType(() => ({
  name: 'Design',
  filePathPattern: './designs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    mode: {
      type: 'enum',
      options: ['light', 'dark'],
      required: true,
    },
  },
  computedFields,
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: './projects/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    repository: {
      type: 'string',
      required: true,
    },
    deprecated: {
      type: 'boolean',
      required: true,
    },
    role: {
      type: 'enum',
      options: ['author', 'contributor'],
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
  },
  computedFields,
}));

export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: './blog/posts/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    authorGithubUsername: {
      type: 'string',
      required: true,
    },
    readTime: {
      type: 'number',
      required: true,
    },
    publishedAt: {
      type: 'date',
      required: true,
    },
    image: {
      type: 'string',
      required: false,
    },
    tags: {
      type: 'list',
      of: {
        type: 'enum',
        options: blogTags.map((tag) => tag.slug),
      },
      required: false,
    },
  },
  computedFields: {
    ...computedFields,
    slug: {
      type: 'string',
      resolve: (doc) => {
        return _.chain(doc._raw.flattenedPath).split('/').last().value();
      },
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: './pages/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: false,
    },
    template: {
      type: 'string',
      required: true,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Page, Project, Design, BlogPost],
  mdx: {
    // contentlayer2 ships unified v10 types internally; remark-gfm v4 and
    // remark-github-blockquote-alert ship v11 types. Cast bridges the drift.
    remarkPlugins: [remarkAlert, remarkGfm] as any,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('line-highlighted');
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word-highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
