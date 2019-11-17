import urlJoin from 'url-join';
import agent from '../services/agent';
import ProviderRepository from '../types/ProviderRepository';

const GITLAB_URL = 'https://gitlab.com';
const API_ROOT = '/api/v4/';

export default class GitlabRepository extends ProviderRepository {
    makeApiUrl = ():string => urlJoin(this.provider.options?.gitlabHost || GITLAB_URL, API_ROOT);

    makeRepositoryId(providerId: string): string {
        // If it's on-prem gitlab, add host to ensure unique ids.
        return super.makeRepositoryId(`${this.provider.options?.gitlabHost || ''}${providerId}`);
    }

    async getRepository(): Promise<IRepository> {
        const apiUrl = this.makeApiUrl();

        const { body } = await agent
            .set('User-Agent', 'Pull-Request-Aggregator')
            .get(urlJoin(apiUrl, '/projects', encodeURIComponent(this.path)));

        return <IRepository> {
            id: this.makeRepositoryId(body.id),
            name: body.name,
            namespace: this.namespace,
            url: body.web_url,
            updatedAt: body.last_activity_at,
        }
    }

    async getPullRequests(): Promise<IPullRequest[]> {
        const apiUrl = this.makeApiUrl();

        const { body: pulls } = await agent
            .set('User-Agent', 'Pull-Request-Aggregator')
            .get(urlJoin(apiUrl, '/projects', encodeURIComponent(this.path), '/merge_requests?state=opened'));

        return pulls.map((pull: any) => (<IPullRequest>{
            id: pull.id,
            url: pull.web_url,
            title: pull.title,
            labels: pull.labels.map((label: any) => {
                return (<ILabel>{
                    id: label,
                    color: undefined,
                    name: label,
                });
            }),
        }))
    }
}