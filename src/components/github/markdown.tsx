'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const GitHubMarkdown: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <ReactMarkdown
      className='markdown-body'
      // @ts-expect-error = we are locked into to v3
      remarkPlugins={[remarkGfm]}
      skipHtml
    >
      {content}
    </ReactMarkdown>
  );
};
