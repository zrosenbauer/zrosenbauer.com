import { type Endpoints } from '@octokit/types';
import _ from 'lodash';
import useSWR, { type SWRResponse } from 'swr';

import type { Route, RouteResponseData } from './types';

import { request } from './server';

export function useGitHubApi<R extends Route>(
  route: R,
  params: Endpoints[R]['parameters']
): SWRResponse<RouteResponseData<R>> {
  return useSWR([route, params], request);
}
