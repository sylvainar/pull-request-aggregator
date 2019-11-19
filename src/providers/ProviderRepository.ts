import {
  Constructor,
  Provider,
  PullRequest,
  PullRequestReview,
  Repository,
  RepositoryConfig,
  RepositoryMetadata,
} from '../types';

export interface ProvidersDictionary {
  [key: string]: Constructor<ProviderRepository>,
}

abstract class ProviderRepository {
  provider: Provider;

  metadata: RepositoryMetadata;

  path: string;

  constructor(repository:RepositoryConfig) {
    this.provider = repository.provider;
    this.metadata = repository.metadata;
    this.path = repository.path;
  }

  /**
     * Make a UNIQUE repository id (even across providers).
     *
     * @param {string} providerId - Provider id.
     * @returns {string} - Unique Id.
     */
  makeRepositoryId(providerId:string):string {
    return `${this.provider.name}-${providerId}`;
  }

  abstract getRepository ():Promise<Repository>;

  abstract getPullRequests ():Promise<PullRequest[]>;

  abstract getPullRequestReviews (iid:number): Promise<PullRequestReview[]>;
}

export default ProviderRepository;
