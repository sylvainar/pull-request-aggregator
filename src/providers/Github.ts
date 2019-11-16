const urlJoin = require('url-join');
const agent = require('../services/agent');

const API_ROOT = 'https://api.github.com/';

export const getRepository = async (repository:IRepositoryConfig):Promise<IRepository> => {
    const { body } = await agent
        .set('User-Agent', 'Pull-Request-Aggregator')
        .get(urlJoin(API_ROOT, '/repos', repository.path));

    return <IRepository> {
        id: body.id,
        name: body.name,
        url: body.html_url,
        updatedAt: body.updated_at,
    }
};

export const getPullRequests = async (repository:IRepositoryConfig):Promise<IPullRequest[]> => {
    const { body: pulls } = await agent
        .set('User-Agent', 'Pull-Request-Aggregator')
        .get(urlJoin(API_ROOT, '/repos', repository.path, '/pulls'));

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
};
