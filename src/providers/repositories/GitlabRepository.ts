import urlJoin from 'url-join';

import ProviderRepository from '../ProviderRepository';
import {
  Label,
  ProviderAuth,
  PullRequest,
  PullRequestReview,
  PullRequestReviewStatus,
  Repository,
  RepositoryConfig,
} from '../../types';
import { makeDefaultAgent } from '../../services/agent';

const GITLAB_URL = 'https://gitlab.com';
const API_ROOT = '/api/v4/';

interface GitlabAuth extends ProviderAuth {
  privateToken: string,
}

const makeAgent = (repositoryConfig:RepositoryConfig) => {
  const agent = makeDefaultAgent();

  agent.set('User-Agent', 'Pull-Request-Aggregator');

  if (repositoryConfig.provider.auth) {
    const { privateToken } = <GitlabAuth> repositoryConfig.provider.auth;
    agent.set('Authorization', `Bearer ${privateToken}`);
  }

  return agent;
};


export default class GitlabRepository extends ProviderRepository {
  static repositoryId = 'gitlab';

  constructor(repositoryConfig:RepositoryConfig) {
    super(repositoryConfig);

    this.agent = makeAgent(repositoryConfig);
  }

  makeApiUrl = ():string => urlJoin(this.provider.options?.gitlabHost || GITLAB_URL, API_ROOT);

  makeRepositoryId(providerId: string): string {
    // If it's on-prem gitlab, add host to ensure unique ids.
    return super.makeRepositoryId(`${this.provider.options?.gitlabHost || ''}${providerId}`);
  }

  async getRepository(): Promise<Repository> {
    const apiUrl = this.makeApiUrl();

    const { body } = await this.agent
      .get(urlJoin(apiUrl, '/projects', encodeURIComponent(this.path)));

    return <Repository> {
      id: this.makeRepositoryId(body.id),
      name: body.name,
      metadata: this.metadata,
      url: body.web_url,
      updatedAt: body.last_activity_at,
    };
  }

  async getPullRequests(): Promise<PullRequest[]> {
    const apiUrl = this.makeApiUrl();

    const { body: pulls } = await this.agent
      .get(urlJoin(apiUrl, 'projects', encodeURIComponent(this.path), 'merge_requests?state=opened'));

    const promises = pulls.map(async (pull: any) => {
      const reviews = await this.getPullRequestReviews(pull.iid);

      return (<PullRequest>{
        id: pull.id,
        url: pull.web_url,
        title: pull.title,
        author: pull.author.username,
        labels: pull.labels.map((label: any) => (<Label>{
          id: label,
          color: undefined,
          name: label,
        })),
        reviews,
        createdAt: pull.created_at,
        updatedAt: pull.updated_at,
      });
    });

    return Promise.all(promises);
  }

  async getPullRequestReviews(iid:number): Promise<PullRequestReview[]> {
    const apiUrl = this.makeApiUrl();

    const { body: { approved_by: reviews } } = await this.agent
      .get(urlJoin(apiUrl, 'projects', encodeURIComponent(this.path), 'merge_requests', iid.toString(), 'approvals'));

    return reviews.map((review: any) => (<PullRequestReview>{
      id: review.user.id,
      author: review.user.username,
      // On gitlab you only approve a PR.
      status: PullRequestReviewStatus.APPROVED,
    }));
  }
}
