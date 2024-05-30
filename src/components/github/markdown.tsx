'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { remarkAlert } from 'remark-github-blockquote-alert';

export const GitHubMarkdown: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <ReactMarkdown
      className='markdown-body'
        // @ts-expect-error - `remarkPlugins` is not in the types properly
      remarkPlugins={[remarkAlert, remarkGfm]}
      skipHtml
    >
      {content}
    </ReactMarkdown>
  );
};
