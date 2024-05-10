import type { Endpoints } from '@octokit/types';

export type Route = keyof Endpoints;

export type RouteParams<R extends Route> = Endpoints[R]['parameters'];

export type RouteResponse<R extends Route> = Endpoints[R]['response'];

export type RouteResponseData<R extends Route> = RouteResponse<R>['data'];
