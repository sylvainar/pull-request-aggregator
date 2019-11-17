import urlJoin from 'url-join';
import agent from '../../services/agent';
import ProviderRepository from '../ProviderRepository';
import {
  Repository, PullRequestReviewStatus, PullRequest, PullRequestReview, Label,
} from '../../types';

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

export default class GithubRepository extends ProviderRepository {
  static repositoryId = 'github';

  async getRepository(): Promise<Repository> {
    const { body } = await agent
      .set('User-Agent', 'Pull-Request-Aggregator')
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
    const { body: pulls } = await agent
      .set('User-Agent', 'Pull-Request-Aggregator')
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
      });
    });

    return Promise.all(promises);
  }

  async getPullRequestReviews(prNumber:number): Promise<PullRequestReview[]> {
    const { body: reviews } = await agent
      .set('User-Agent', 'Pull-Request-Aggregator')
      .get(urlJoin(API_ROOT, 'repos', this.path, 'pulls', prNumber.toString(), 'reviews'));

    return reviews.map((review: any) => (<PullRequestReview>{
      id: review.id,
      author: review.user.login,
      status: evaluateStatus(review.state),
    }));
  }
}
