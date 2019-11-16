const urlJoin = require('url-join');
const agent = require('../services/agent');

const GITLAB_URL = 'https://gitlab.com';
const API_ROOT = '/api/v4/';

const makeApiUrl = (provider:IProvider):string => urlJoin(provider.options?.gitlabHost || GITLAB_URL, API_ROOT);

export const getRepository = async (repository:IRepositoryConfig):Promise<IRepository> => {
    const apiUrl = makeApiUrl(repository.provider);
    const { body } = await agent
        .set('User-Agent', 'Pull-Request-Aggregator')
        .get(urlJoin(apiUrl, '/projects', encodeURIComponent(repository.path)));

    return <IRepository> {
        id: body.id,
        name: body.name,
        url: body.web_url,
        updatedAt: body.last_activity_at,
    }
};

export const getPullRequests = async (repository:IRepositoryConfig):Promise<IPullRequest[]> => {
    const apiUrl = makeApiUrl(repository.provider);
    const { body: pulls } = await agent
        .set('User-Agent', 'Pull-Request-Aggregator')
        .get(urlJoin(apiUrl, '/projects', encodeURIComponent(repository.path), '/merge_requests?state=opened'));

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
};
