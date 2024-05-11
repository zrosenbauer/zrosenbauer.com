'use client';

import { useGitHubApi } from '@utils/github/client';
import React from 'react';


import { GitHubMarkdown } from './markdown';

export const GitHubReadme: React.FC<{
  owner: string;
  repo: string;
}> = ({ owner, repo }) => {
  const { data } = useGitHubApi('GET /repos/{owner}/{repo}/readme', {
    owner,
    repo,
  });

  if (!data) {
    return null;
  }

  return <GitHubMarkdown content={atob(data.content)} />;
};
