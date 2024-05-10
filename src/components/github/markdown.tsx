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
      remarkPlugins={[remarkGfm]} 
      skipHtml
    >
      {content}
    </ReactMarkdown> 
  );
}
