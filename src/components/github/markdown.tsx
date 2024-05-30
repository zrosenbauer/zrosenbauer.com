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
      remarkPlugins={[remarkAlert, remarkGfm]}
      skipHtml
    >
      {content}
    </ReactMarkdown>
  );
};
