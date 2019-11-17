import urlJoin from 'url-join';
import agent from '../../services/agent';
import ProviderRepository from '../ProviderRepository';

const API_ROOT = 'https://api.github.com/';

export default class GithubRepository extends ProviderRepository {
    static repositoryId = 'github';

    async getRepository(): Promise<Repository> {
        const { body } = await agent
            .set('User-Agent', 'Pull-Request-Aggregator')
            .get(urlJoin(API_ROOT, '/repos', this.path));

        return <Repository> {
            id: this.makeRepositoryId(body.id),
            name: body.name,
            metadata: this.metadata,
            url: body.html_url,
            updatedAt: body.updated_at,
        }
    }

    async getPullRequests(): Promise<PullRequest[]> {
        const { body: pulls } = await agent
            .set('User-Agent', 'Pull-Request-Aggregator')
            .get(urlJoin(API_ROOT, '/repos', this.path, '/pulls'));

        return pulls.map((pull: any) => (<PullRequest>{
            id: pull.id,
            url: pull.html_url,
            title: pull.title,
            labels: pull.labels.map((label: any) => (<Label>{
                id: label.id,
                color: label.color,
                name: label.name,
            })),
        }))
    }

}