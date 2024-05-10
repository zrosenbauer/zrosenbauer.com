import _ from 'lodash';

import type { Route, RouteParams, RouteResponseData } from './types';

export async function request<R extends Route>(args: [R, RouteParams<R>]): Promise<RouteResponseData<R>> {
  const [route, params] = args;
  const [method, path] = route.split(' ');
  let url = `https://api.github.com${path}`;
  const body: Record<string, unknown> = {};

  for (const key in params) {
    if (path.includes(`{${key}}`)) {
      url = url.replace(`{${key}}`, `${params[key]}`);
    } else {
      body[key] = params[key];
    }
  }

  const response = await fetch(url, {
    method,
    body: _.isEmpty(body) ? undefined : JSON.stringify(params),
  });
  return await response.json() as Awaited<RouteResponseData<R>>;
}
