import urlJoin from 'url-join';
import agent from '../services/agent';
import ProviderRepository from '../types/ProviderRepository';

const API_ROOT = 'https://api.github.com/';

export default class GithubRepository extends ProviderRepository {
    async getRepository(): Promise<IRepository> {
        const { body } = await agent
            .set('User-Agent', 'Pull-Request-Aggregator')
            .get(urlJoin(API_ROOT, '/repos', this.path));

        return <IRepository> {
            id: this.makeRepositoryId(body.id),
            name: body.name,
            namespace: this.namespace,
            url: body.html_url,
            updatedAt: body.updated_at,
        }
    }

    async getPullRequests(): Promise<IPullRequest[]> {
        const { body: pulls } = await agent
            .set('User-Agent', 'Pull-Request-Aggregator')
            .get(urlJoin(API_ROOT, '/repos', this.path, '/pulls'));

        return pulls.map((pull: any) => (<IPullRequest>{
            id: pull.id,
            url: pull.html_url,
            title: pull.title,
            labels: pull.labels.map((label: any) => (<ILabel>{
                id: label.id,
                color: label.color,
                name: label.name,
            })),
        }))
    }

}