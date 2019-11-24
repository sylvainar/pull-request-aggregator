export type Constructor<T> = new (...args: any[]) => T;

export interface Config {
  repositories: RepositoryConfig[],
}

export interface ProviderAuth {
  // Depend on provider.
  // In your provider, you have to extend from
  // this interface, with the keys you need.
}

export interface Provider {
  name: string,
  auth?: ProviderAuth,
  options: any,
}

export interface RepositoryMetadata {
  // Could be pretty much anything depending
  // on what the user needs.
}

export interface RepositoryConfig {
  metadata: RepositoryMetadata,
  path: string,
  provider: Provider,
}

export interface Repository {
  id: string,
  name: string,
  metadata: RepositoryMetadata,
  url: string,
  updatedAt: Date,
  pulls?: PullRequest[],
}

export interface PullRequest {
  id: string,
  url: string,
  title: string,
  author: string,
  labels: Label[],
  reviews: PullRequestReview[],
  createdAt: Date,
  updatedAt: Date,
}

export interface Label {
  id: string,
  name: string,
  color: string,
}

export enum PullRequestReviewStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEUTRAL = 'NEUTRAL',
}

export interface PullRequestReview {
  id: string,
  author: string,
  status: PullRequestReviewStatus,
}
