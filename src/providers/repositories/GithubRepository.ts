import urlJoin from 'url-join';

import ProviderRepository from '../ProviderRepository';
import {
  Repository,
  PullRequestReviewStatus,
  PullRequest,
  PullRequestReview,
  Label,
  RepositoryConfig,
  ProviderAuth,
} from '../../types';
import { makeDefaultAgent } from '../../services/agent';

const API_ROOT = 'https://api.github.com/';

const evaluateStatus = (status: string):PullRequestReviewStatus => {
  switch (status) {
    case 'APPROVED':
      return PullRequestReviewStatus.APPROVED;
    case 'REJECTED':
      return PullRequestReviewStatus.REJECTED;
    default:
      return PullRequestReviewStatus.NEUTRAL;
  }
};

interface GithubAuth extends ProviderAuth {
  username: string,
  token: string,
}

const makeAgent = (repositoryConfig:RepositoryConfig) => {
  const agent = makeDefaultAgent();

  agent.set('User-Agent', 'Pull-Request-Aggregator');

  if (repositoryConfig.provider.auth) {
    const { username, token } = <GithubAuth> repositoryConfig.provider.auth;
    agent.auth(username, token);
  }

  return agent;
};

export default class GithubRepository extends ProviderRepository {
  static repositoryId = 'github';

  constructor(repositoryConfig:RepositoryConfig) {
    super(repositoryConfig);

    this.agent = makeAgent(repositoryConfig);
  }

  async getRepository(): Promise<Repository> {
    const { body } = await this.agent
      .get(urlJoin(API_ROOT, 'repos', this.path));

    return <Repository> {
      id: this.makeRepositoryId(body.id),
      name: body.name,
      metadata: this.metadata,
      url: body.html_url,
      updatedAt: body.updated_at,
    };
  }

  async getPullRequests(): Promise<PullRequest[]> {
    const { body: pulls } = await this.agent
      .get(urlJoin(API_ROOT, 'repos', this.path, 'pulls'));

    const promises = pulls.map(async (pull: any) => {
      const reviews = await this.getPullRequestReviews(pull.number);

      return (<PullRequest> {
        id: pull.id,
        url: pull.html_url,
        title: pull.title,
        author: pull.user?.login,
        labels: pull.labels.map((label: any) => (<Label>{
          id: label.id,
          color: label.color,
          name: label.name,
        })),
        reviews,
        createdAt: pull.created_at,
        updatedAt: pull.updated_at,
      });
    });

    return Promise.all(promises);
  }

  async getPullRequestReviews(prNumber:number): Promise<PullRequestReview[]> {
    const { body: reviews } = await this.agent
      .get(urlJoin(API_ROOT, 'repos', this.path, 'pulls', prNumber.toString(), 'reviews'));

    return reviews.map((review: any) => (<PullRequestReview>{
      id: review.id,
      author: review.user.login,
      status: evaluateStatus(review.state),
    }));
  }
}
